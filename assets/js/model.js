/*
 * DreamPrice — cost model
 *
 * Turns the researched data in data.js into up-front / annual / monthly / daily
 * figures, and into a year-by-year schedule over the chosen ownership horizon.
 */

import { ASSETS, FX } from './data.js';

export const DAYS_PER_YEAR = 365.25;

/* ---- currency ---- */
export function convert(amount, from, to) {
  if (from === to) return amount;
  return amount / FX.perUsd[from] * FX.perUsd[to];
}

/* ---- scenario picker ---- */
function makePick(scenario) {
  return (range) => {
    if (typeof range === 'number') return range;
    if (range == null) return 0;
    return range[scenario] ?? range.base ?? 0;
  };
}

export function variantOf(asset, variantId) {
  return asset.variants.find((v) => v.id === variantId) || asset.variants[0];
}

export function defaultInputs(asset) {
  const out = {};
  for (const i of asset.inputs || []) out[i.id] = i.def;
  return out;
}

/*
 * Evaluate one asset.
 *
 * state = { scenario, years, inflation, variants: {id: variantId}, inputs: {id: {...}} }
 * Returns everything in the asset's NATIVE currency.
 */
export function evaluate(asset, state) {
  const scenario = state.scenario;
  const v = variantOf(asset, state.variants[asset.id]);
  const inputs = { ...(state.inputs[asset.id] || {}) };

  /*
   * Weekend · one car at a time: you do not put 15,000 km on every toy. A shared
   * annual pool (~100 km × 52 weekends) is split across the cars that are still
   * switched on. Ownership taxes (车船税 / 自動車税 / TFA) do not care — they
   * bill whether the car moves or not.
   */
  if (asset.kind === 'car' && state.driveMode === 'weekend' && Number.isFinite(inputs.km)) {
    const nCars = ASSETS.filter((a) => a.kind === 'car' && state.enabled?.[a.id] !== false).length;
    const pool = Number.isFinite(state.weekendPool) ? state.weekendPool : 5200;
    inputs.kmDialled = inputs.km;
    inputs.km = Math.max(600, Math.round(pool / Math.max(1, nCars)));
    inputs.kmWeekend = true;
    inputs.kmPool = pool;
    inputs.kmCars = Math.max(1, nCars);
  }

  const ctx = { v, s: scenario, pick: makePick(scenario), in: inputs, driveMode: state.driveMode };

  const oneTime = asset.oneTime(ctx).filter((i) => !i.informational || i.note);
  const annual = asset.annual(ctx);

  const sum = (arr) => arr.reduce((t, i) => t + (i.informational ? 0 : i.amount), 0);

  /*
   * Two buckets, and only two.
   *
   *   upFront        what you hand over once, at the start.
   *   annualRunning  what it costs to keep each year — servicing, repairs,
   *                  insurance, fuel, tax, tyres, parking.
   *
   * Depreciation is deliberately NOT a cost here. You pay for the car once; the
   * fact that it is worth less later is a change in what you own, not a bill
   * that arrives. So there is no averaging of the purchase across the years,
   * and the per-year figure is simply one year of running cost.
   */
  const upFront = sum(oneTime);
  const refundable = oneTime.reduce((t, i) => t + (i.refundable && !i.informational ? i.amount : 0), 0);
  const annualRunning = sum(annual);

  const vehicleLine = oneTime.find((i) => i.category === 'capital');
  const vehiclePrice = vehicleLine ? vehicleLine.amount : 0;

  const years = Math.max(1, state.years);
  const infl = state.inflation;
  const rentEsc = asset.escalation ? makePick(scenario)(asset.escalation) : infl;

  /*
   * Year-by-year projection, for the detail page only. Running costs creep with
   * inflation and rent escalation. Resale value rides alongside as context —
   * what the car would fetch if sold — never added to any total.
   */
  const schedule = [];
  let residual = vehiclePrice;
  let cumulative = 0;

  for (let y = 1; y <= years; y++) {
    let running = 0;
    for (const item of annual) {
      if (item.informational) continue;
      const g = item.escalate === 'rent' ? rentEsc : infl;
      running += item.amount * Math.pow(1 + g, y - 1);
    }
    if (asset.kind === 'car') residual = nextResidual(asset, v, ctx, residual, vehiclePrice, y);
    cumulative += running;
    schedule.push({ year: y, running, cumulative, residual });
  }

  const totalRunning = schedule.reduce((t, r) => t + r.running, 0);

  return {
    asset, variant: v, oneTime, annual,
    upFront, refundable, netUpFront: upFront - refundable,
    annualRunning,
    schedule, totalRunning,
    vehiclePrice,
    finalResidual: asset.kind === 'car' ? residual : 0,
    /* One year of running cost, sliced four ways. No averaging involved. */
    perYear: annualRunning,
    perQuarter: annualRunning / 4,
    perMonth: annualRunning / 12,
    perDay: annualRunning / DAYS_PER_YEAR,
  };
}

/* The four periods the overview page is built around. */
export const PERIODS = [
  { id: 'perYear',    label: 'Per year',    zh: '每年' },
  { id: 'perQuarter', label: 'Per quarter', zh: '每季度' },
  { id: 'perMonth',   label: 'Per month',   zh: '每月' },
  { id: 'perDay',     label: 'Per day',     zh: '每天' },
];

function nextResidual(asset, v, ctx, current, price, year) {
  /* Appreciating asset (the R35) — compounded off the original price. */
  if (v.appr) return price * Math.pow(1 + ctx.pick(v.appr), year);
  /* Flat declining balance, per variant (the used AMGs). A negative rate appreciates. */
  if (v.dep) return current * (1 - ctx.pick(v.dep));
  /* Steep first year then a flatter tail (a new car). */
  const dep = asset.depreciation;
  if (!dep) return current;
  return current * (1 - (year === 1 ? ctx.pick(dep.y1) : ctx.pick(dep.yn)));
}

/*
 * The same line items priced under all three scenarios, zipped by position.
 *
 * Every item therefore gets a low/base/high band to show on hover without
 * anyone having to type one in. Position is stable across scenarios because the
 * item arrays only ever branch on inputs, never on the scenario.
 */
export function scenarioBands(asset, state) {
  const bands = { oneTime: [], annual: [] };
  for (const scenario of ['low', 'base', 'high']) {
    const r = evaluate(asset, { ...state, scenario });
    for (const section of ['oneTime', 'annual']) {
      r[section].forEach((item, i) => {
        (bands[section][i] ||= {})[scenario] = item.amount;
      });
    }
  }
  return bands;
}

/*
 * Category rollup for the chart: one year of running cost, by category,
 * converted to the display currency. The purchase price is not in here — it is
 * not an annual cost.
 */
export function categoryBreakdown(result, displayCurrency) {
  const cur = result.asset.currency;
  const out = new Map();
  for (const item of result.annual) {
    if (item.informational || !item.amount) continue;
    out.set(item.category,
      (out.get(item.category) || 0) + convert(item.amount, cur, displayCurrency));
  }
  return [...out.entries()].filter(([, amt]) => amt > 0).sort((a, b) => b[1] - a[1]);
}

/* ---- portfolio totals ---- */
export function evaluateAll(state) {
  const results = {};
  for (const asset of ASSETS) results[asset.id] = evaluate(asset, state);
  return results;
}

export function portfolio(results, displayCurrency, enabled) {
  const t = {
    upFront: 0, refundable: 0, alreadyPaid: 0,
    perYear: 0, perQuarter: 0, perMonth: 0, perDay: 0,
    totalRunning: 0, byCategory: new Map(),
  };
  for (const [id, r] of Object.entries(results)) {
    if (enabled && !enabled[id]) continue;
    const cur = r.asset.currency;
    const conv = (n) => convert(n, cur, displayCurrency);
    t.upFront += conv(r.upFront);
    t.refundable += conv(r.refundable);
    /* Assets already bought — money spent, not money to find. */
    if (r.asset.owned) t.alreadyPaid += conv(r.upFront);
    for (const p of PERIODS) t[p.id] += conv(r[p.id]);
    t.totalRunning += conv(r.totalRunning);
    for (const [cat, amt] of categoryBreakdown(r, displayCurrency)) {
      t.byCategory.set(cat, (t.byCategory.get(cat) || 0) + amt);
    }
  }
  t.categories = [...t.byCategory.entries()].sort((a, b) => b[1] - a[1]);
  return t;
}

/* ---- formatting ---- */
const SYMBOL = { CNY: '¥', JPY: '¥', NOK: 'kr', USD: '$', EUR: '€' };

export function fmt(amount, currency, opts = {}) {
  const digits = opts.digits ?? (Math.abs(amount) < 100 ? (Math.abs(amount) < 10 ? 2 : 1) : 0);
  const n = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  const sym = SYMBOL[currency] || '';
  return currency === 'NOK' ? `${n} ${sym}` : `${sym}${n}`;
}

export function fmtCompact(amount, currency) {
  const abs = Math.abs(amount);
  const sym = SYMBOL[currency] || '';
  let body;
  if (abs >= 1e8) body = (amount / 1e6).toFixed(0) + 'M';
  else if (abs >= 1e6) body = (amount / 1e6).toFixed(2) + 'M';
  else if (abs >= 1e4) body = (amount / 1e3).toFixed(0) + 'k';
  else body = Math.round(amount).toLocaleString('en-US');
  return currency === 'NOK' ? `${body} ${sym}` : `${sym}${body}`;
}
