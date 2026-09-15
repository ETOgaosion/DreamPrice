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
  const ctx = { v, s: scenario, pick: makePick(scenario), in: state.inputs[asset.id] };

  const oneTime = asset.oneTime(ctx).filter((i) => !i.informational || i.note);
  const annual = asset.annual(ctx);

  const sum = (arr) => arr.reduce((t, i) => t + (i.informational ? 0 : i.amount), 0);

  const upFront = sum(oneTime);
  const refundable = oneTime.reduce((t, i) => t + (i.refundable && !i.informational ? i.amount : 0), 0);
  const runningYear1 = sum(annual);

  /* Capital base for a car: everything paid at purchase that is not coming back. */
  const capitalBase = asset.kind === 'car' ? upFront - refundable : 0;
  const vehicleLine = oneTime.find((i) => i.category === 'capital');
  const vehiclePrice = vehicleLine ? vehicleLine.amount : 0;

  const years = Math.max(1, state.years);
  const infl = state.inflation;
  const rentEsc = asset.escalation ? makePick(scenario)(asset.escalation) : infl;

  /* Year-by-year schedule. */
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

    let capital = 0;
    if (asset.kind === 'car') {
      const before = residual;
      residual = nextResidual(asset, v, ctx, residual, vehiclePrice, y);
      capital = before - residual;
    }

    cumulative += running + capital;
    schedule.push({ year: y, running, capital, total: running + capital, cumulative, residual });
  }

  const totalRunning = schedule.reduce((t, r) => t + r.running, 0);
  const totalCapital = schedule.reduce((t, r) => t + r.capital, 0);
  const finalResidual = asset.kind === 'car' ? residual : 0;

  /* Two views: pure out-of-pocket running cost, and true cost including capital loss. */
  const trueTotal = totalRunning + totalCapital;
  const cashTotal = totalRunning;

  return {
    asset, variant: v, oneTime, annual,
    upFront, refundable, netUpFront: upFront - refundable,
    runningYear1,
    capitalYear1: schedule[0].capital,
    totalYear1: schedule[0].total,
    schedule, totalRunning, totalCapital, trueTotal, cashTotal, finalResidual,
    vehiclePrice,
    capitalBase,
    perYear: { cash: cashTotal / years, all: trueTotal / years },
    perQuarter: { cash: cashTotal / years / 4, all: trueTotal / years / 4 },
    perMonth: { cash: cashTotal / years / 12, all: trueTotal / years / 12 },
    perDay: { cash: cashTotal / years / DAYS_PER_YEAR, all: trueTotal / years / DAYS_PER_YEAR },
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
 * Category rollup for the chart, converted to the display currency.
 * Scaled so the segments sum to the AVERAGE annual cost over the horizon,
 * matching the per-year headline rather than year one alone.
 */
export function categoryBreakdown(result, displayCurrency, includeCapital) {
  const cur = result.asset.currency;
  const years = result.schedule.length;
  const out = new Map();
  const add = (cat, amt) => out.set(cat, (out.get(cat) || 0) + amt);

  const scale = result.runningYear1 ? (result.totalRunning / years) / result.runningYear1 : 1;
  for (const item of result.annual) {
    if (item.informational || !item.amount) continue;
    add(item.category, convert(item.amount * scale, cur, displayCurrency));
  }
  /* Appreciating assets have negative capital cost — no segment to draw. */
  if (includeCapital && result.asset.kind === 'car' && result.totalCapital > 0) {
    add('capital', convert(result.totalCapital / years, cur, displayCurrency));
  }
  return [...out.entries()].filter(([, amt]) => amt > 0).sort((a, b) => b[1] - a[1]);
}

/* ---- portfolio totals ---- */
export function evaluateAll(state) {
  const results = {};
  for (const asset of ASSETS) results[asset.id] = evaluate(asset, state);
  return results;
}

export function portfolio(results, displayCurrency, includeCapital, enabled) {
  const t = {
    upFront: 0, refundable: 0, alreadyPaid: 0,
    perYear: 0, perQuarter: 0, perMonth: 0, perDay: 0,
    total: 0, byCategory: new Map(),
  };
  for (const [id, r] of Object.entries(results)) {
    if (enabled && !enabled[id]) continue;
    const cur = r.asset.currency;
    const key = includeCapital ? 'all' : 'cash';
    t.upFront += convert(r.upFront, cur, displayCurrency);
    t.refundable += convert(r.refundable, cur, displayCurrency);
    /* Assets already bought — money spent, not money to find. */
    if (r.asset.owned) t.alreadyPaid += convert(r.upFront, cur, displayCurrency);
    t.perYear += convert(r.perYear[key], cur, displayCurrency);
    t.perQuarter += convert(r.perQuarter[key], cur, displayCurrency);
    t.perMonth += convert(r.perMonth[key], cur, displayCurrency);
    t.perDay += convert(r.perDay[key], cur, displayCurrency);
    t.total += convert(includeCapital ? r.trueTotal : r.cashTotal, cur, displayCurrency);
    for (const [cat, amt] of categoryBreakdown(r, displayCurrency, includeCapital)) {
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
