/*
 * DreamPrice — pre-deploy validation.
 *
 * There is no build step, so this is the only thing standing between a typo in
 * data.js and a broken page. It exercises every asset against every variant,
 * scenario, currency and horizon, and asserts the data itself is well formed.
 *
 * Run: node scripts/check.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

import { ASSETS, CATEGORIES, CAVEATS, FX, SRC } from '../assets/js/data.js';
import {
  categoryBreakdown, convert, defaultInputs, evaluateAll, fmt, portfolio, variantOf,
} from '../assets/js/model.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0;
let checks = 0;

function check(ok, label, detail) {
  checks++;
  if (ok) return true;
  failures++;
  console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  return false;
}

function section(name) {
  console.log(`\n${name}`);
}

const CURRENCIES = Object.keys(FX.perUsd);
const SCENARIOS = ['low', 'base', 'high'];
const SRC_VALUES = new Set(Object.values(SRC));

/* ------------------------------------------------------------------ */
section('Source registry');
/* ------------------------------------------------------------------ */
for (const [key, s] of Object.entries(SRC)) {
  check(s && typeof s.t === 'string' && s.t.length > 3, `SRC.${key} has a title`);
  check(s && typeof s.u === 'string' && /^https?:\/\/\S+$/.test(s.u), `SRC.${key} has a valid URL`, s?.u);
}
console.log(`  ${Object.keys(SRC).length} sources registered`);

/* ------------------------------------------------------------------ */
section('Exchange rates');
/* ------------------------------------------------------------------ */
check(FX.perUsd.USD === 1, 'USD is the pivot at 1.0');
for (const [cur, rate] of Object.entries(FX.perUsd)) {
  check(Number.isFinite(rate) && rate > 0, `FX rate for ${cur} is positive and finite`, String(rate));
}
/* Round-tripping must be lossless enough to trust the displayed figures. */
for (const a of CURRENCIES) {
  for (const b of CURRENCIES) {
    const back = convert(convert(123456, a, b), b, a);
    check(Math.abs(back - 123456) < 0.01, `convert ${a}->${b}->${a} round-trips`, String(back));
  }
}

/* ------------------------------------------------------------------ */
section('Asset definitions');
/* ------------------------------------------------------------------ */
const seenIds = new Set();
for (const asset of ASSETS) {
  const id = asset.id;
  check(!seenIds.has(id), `asset id "${id}" is unique`);
  seenIds.add(id);
  check(['car', 'home'].includes(asset.kind), `${id}: kind is car or home`, asset.kind);
  check(CURRENCIES.includes(asset.currency), `${id}: currency is convertible`, asset.currency);
  check(asset.variants?.length > 0, `${id}: has at least one variant`);
  check(
    asset.variants.some((v) => v.id === asset.defaultVariant),
    `${id}: defaultVariant "${asset.defaultVariant}" exists`,
  );
  check(typeof asset.blurb === 'string' && asset.blurb.length > 40, `${id}: has a blurb`);
  check(/^#[0-9a-f]{6}$/i.test(asset.accent), `${id}: accent is a hex colour`, asset.accent);

  const variantIds = new Set();
  for (const v of asset.variants) {
    check(!variantIds.has(v.id), `${id}: variant id "${v.id}" is unique`);
    variantIds.add(v.id);
    check(typeof v.label === 'string' && v.label.length > 3, `${id}/${v.id}: has a label`);
  }

  for (const input of asset.inputs || []) {
    if (input.type === 'range') {
      check(input.def >= input.min && input.def <= input.max,
        `${id}/${input.id}: default ${input.def} is within [${input.min}, ${input.max}]`);
      check(input.step > 0, `${id}/${input.id}: step is positive`);
    } else {
      check(input.options?.some((o) => o.v === input.def),
        `${id}/${input.id}: default "${input.def}" is one of the options`);
    }
  }

  /* Homes escalate rent; cars need a way to lose (or gain) value. */
  if (asset.kind === 'home') {
    check(asset.escalation && SCENARIOS.every((s) => Number.isFinite(asset.escalation[s])),
      `${id}: has a rent escalation range`);
  } else {
    const covered = asset.depreciation || asset.variants.every((v) => v.appr || v.dep);
    check(covered, `${id}: every variant has a depreciation or appreciation rate`);
  }
}

/* ------------------------------------------------------------------ */
section('Line items across every variant, scenario, currency and horizon');
/* ------------------------------------------------------------------ */
let combos = 0;
let itemsSeen = 0;

const baseState = () => {
  const s = {
    currency: 'CNY', scenario: 'base', years: 5, inflation: 0.02,
    includeCapital: true, variants: {}, inputs: {}, enabled: {},
  };
  for (const a of ASSETS) {
    s.variants[a.id] = a.defaultVariant;
    s.inputs[a.id] = defaultInputs(a);
    s.enabled[a.id] = true;
  }
  return s;
};

for (const asset of ASSETS) {
  for (const variant of asset.variants) {
    for (const scenario of SCENARIOS) {
      const state = baseState();
      state.variants[asset.id] = variant.id;
      state.scenario = scenario;

      /* Also push each per-asset input to both extremes. */
      for (const input of asset.inputs || []) {
        const values = input.type === 'range' ? [input.min, input.def, input.max] : input.options.map((o) => o.v);
        for (const value of values) {
          state.inputs[asset.id] = { ...defaultInputs(asset), [input.id]: value };
          for (const years of [1, 5, 15]) {
            state.years = years;
            const results = evaluateAll(state);
            const r = results[asset.id];
            const where = `${asset.id}/${variant.id}/${scenario}/${input.id}=${value}/${years}y`;

            for (const item of [...r.oneTime, ...r.annual]) {
              itemsSeen++;
              if (!check(Number.isFinite(item.amount), `${where}: "${item.label}" is finite`, String(item.amount))) continue;
              check(item.amount >= 0, `${where}: "${item.label}" is not negative`, String(item.amount));
              check(CATEGORIES[item.category], `${where}: "${item.label}" has a known category`, item.category);
              check(!item.src || SRC_VALUES.has(item.src), `${where}: "${item.label}" cites a registered source`, item.label);
              check(typeof item.label === 'string' && item.label.length > 0, `${where}: item has a label`);
            }

            for (const key of ['upFront', 'runningYear1', 'trueTotal', 'cashTotal', 'finalResidual']) {
              check(Number.isFinite(r[key]), `${where}: ${key} is finite`, String(r[key]));
            }
            check(r.refundable <= r.upFront + 0.01, `${where}: refundable does not exceed up-front`);
            check(r.schedule.length === years, `${where}: schedule has ${years} rows`, String(r.schedule.length));

            for (const currency of CURRENCIES) {
              for (const includeCapital of [true, false]) {
                const p = portfolio(results, currency, includeCapital, state.enabled);
                for (const key of ['upFront', 'perYear', 'perMonth', 'perDay', 'total']) {
                  check(Number.isFinite(p[key]), `${where}/${currency}: portfolio ${key} is finite`, String(p[key]));
                }
                const cats = categoryBreakdown(r, currency, includeCapital);
                check(cats.every(([, amt]) => Number.isFinite(amt) && amt > 0),
                  `${where}/${currency}: chart segments are positive and finite`);
                check(typeof fmt(p.perDay, currency) === 'string', `${where}/${currency}: formats without throwing`);
                combos++;
              }
            }
          }
        }
      }
    }
  }
}
console.log(`  ${itemsSeen.toLocaleString()} line items and ${combos.toLocaleString()} portfolio rollups evaluated`);

/* ------------------------------------------------------------------ */
section('Scenario ordering');
/* ------------------------------------------------------------------ */
/*
 * "low" must mean cheaper than "base", and "base" cheaper than "high", for
 * every asset. This caught a real bug: the appreciation ranges on the R35 were
 * inverted, so the pessimistic case came out cheapest.
 */
for (const asset of ASSETS) {
  for (const variant of asset.variants) {
    const perYear = {};
    for (const scenario of SCENARIOS) {
      const state = baseState();
      state.variants[asset.id] = variant.id;
      state.scenario = scenario;
      perYear[scenario] = evaluateAll(state)[asset.id].perYear.all;
    }
    check(perYear.low <= perYear.base + 1e-6,
      `${asset.id}/${variant.id}: optimistic <= realistic`,
      `${Math.round(perYear.low)} vs ${Math.round(perYear.base)}`);
    check(perYear.base <= perYear.high + 1e-6,
      `${asset.id}/${variant.id}: realistic <= pessimistic`,
      `${Math.round(perYear.base)} vs ${Math.round(perYear.high)}`);
  }
}

/* ------------------------------------------------------------------ */
section('Caveats');
/* ------------------------------------------------------------------ */
for (const [i, c] of CAVEATS.entries()) {
  check(typeof c.tag === 'string' && c.tag.length > 5, `caveat ${i}: has a tag`);
  check(typeof c.body === 'string' && c.body.length > 80, `caveat ${i}: has a body`);
  check(SRC_VALUES.has(c.src), `caveat ${i} ("${c.tag}"): cites a registered source`);
}
console.log(`  ${CAVEATS.length} caveats`);

/* ------------------------------------------------------------------ */
section('Static assets referenced by index.html');
/* ------------------------------------------------------------------ */
const html = readFileSync(join(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)].map((m) => m[1]);
check(refs.length > 0, 'index.html references local assets');
for (const ref of new Set(refs)) {
  check(existsSync(join(root, ref.replace(/^\.\//, ''))), `${ref} exists on disk`);
}
/* Every element the UI writes into must actually be in the markup. */
const app = readFileSync(join(root, 'assets/js/app.js'), 'utf8');
for (const m of app.matchAll(/\$\('#([\w-]+)'\)/g)) {
  check(html.includes(`id="${m[1]}"`), `app.js targets #${m[1]}, which exists in index.html`);
}
for (const id of ['assets/js/data.js', 'assets/js/model.js', 'assets/js/app.js', '.nojekyll']) {
  check(existsSync(join(root, id)), `${id} is present`);
}

/* ------------------------------------------------------------------ */
console.log(
  `\n${failures === 0 ? 'PASS' : 'FAIL'} — ${(checks - failures).toLocaleString()}/${checks.toLocaleString()} checks passed`,
);
if (failures > 0) {
  console.error(`${failures.toLocaleString()} check(s) failed.`);
  process.exit(1);
}
/* Touch variantOf so an unused-export regression shows up here. */
check(variantOf(ASSETS[0], ASSETS[0].defaultVariant) != null, 'variantOf resolves');
