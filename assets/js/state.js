/*
 * DreamPrice — shared state.
 *
 * The overview page and the detail page are separate documents, so the model
 * settings live in localStorage. Anything you change on one page is already
 * applied when you land on the other.
 */

import { ASSETS } from './data.js';
import { defaultInputs } from './model.js';

const KEY = 'dreamprice.state.v1';
const CURRENCIES = ['CNY', 'JPY', 'NOK', 'USD', 'EUR'];
const SCENARIOS = ['low', 'base', 'high'];

export function createState() {
  const s = {
    currency: 'CNY',
    scenario: 'base',
    years: 5,
    inflation: 0.02,
    variants: {},
    inputs: {},
    enabled: {},
  };
  for (const a of ASSETS) {
    s.variants[a.id] = a.defaultVariant;
    s.inputs[a.id] = defaultInputs(a);
    s.enabled[a.id] = true;
  }
  return s;
}

/*
 * Merge stored settings over the defaults, discarding anything that no longer
 * exists. data.js changes more often than this file, so a stale variant id or a
 * renamed input must never be able to break the page.
 */
export function loadState() {
  const state = createState();
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    stored = null;
  }
  if (!stored || typeof stored !== 'object') return state;

  if (CURRENCIES.includes(stored.currency)) state.currency = stored.currency;
  if (SCENARIOS.includes(stored.scenario)) state.scenario = stored.scenario;
  if (Number.isFinite(stored.years)) state.years = Math.min(15, Math.max(1, Math.round(stored.years)));
  if (Number.isFinite(stored.inflation)) state.inflation = Math.min(0.08, Math.max(0, stored.inflation));

  for (const asset of ASSETS) {
    if (asset.variants.some((v) => v.id === stored.variants?.[asset.id])) {
      state.variants[asset.id] = stored.variants[asset.id];
    }
    if (typeof stored.enabled?.[asset.id] === 'boolean') {
      state.enabled[asset.id] = stored.enabled[asset.id];
    }
    for (const input of asset.inputs || []) {
      const value = stored.inputs?.[asset.id]?.[input.id];
      if (value === undefined) continue;
      if (input.type === 'range' || input.type === 'number') {
        if (Number.isFinite(value) && value >= input.min && value <= input.max) {
          state.inputs[asset.id][input.id] = value;
        }
      } else if (input.options.some((o) => o.v === value)) {
        state.inputs[asset.id][input.id] = value;
      }
    }
  }
  return state;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* Private browsing or a full quota — the page still works, it just forgets. */
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

/*
 * Wire whichever of the global controls exist in this document. Both pages use
 * the same ids, so each one only has to call this.
 */
export function bindGlobalControls(state, rerender) {
  const $ = (sel) => document.querySelector(sel);
  const commit = () => { saveState(state); rerender(); };

  const currency = $('#currency');
  if (currency) {
    currency.value = state.currency;
    currency.addEventListener('change', () => { state.currency = currency.value; commit(); });
  }

  const scenario = $('#scenario');
  if (scenario) {
    scenario.value = state.scenario;
    scenario.addEventListener('change', () => { state.scenario = scenario.value; commit(); });
  }

  const years = $('#years');
  const yearsOut = $('#years-out');
  if (years) {
    years.value = state.years;
    if (yearsOut) yearsOut.textContent = `${state.years} yr`;
    years.addEventListener('input', () => {
      state.years = Number(years.value);
      if (yearsOut) yearsOut.textContent = `${state.years} yr`;
      commit();
    });
  }

  const inflation = $('#inflation');
  const inflationOut = $('#inflation-out');
  if (inflation) {
    inflation.value = state.inflation * 100;
    if (inflationOut) inflationOut.textContent = `${(state.inflation * 100).toFixed(1)}%`;
    inflation.addEventListener('input', () => {
      state.inflation = Number(inflation.value) / 100;
      if (inflationOut) inflationOut.textContent = `${Number(inflation.value).toFixed(1)}%`;
      commit();
    });
  }

  const reset = $('#reset');
  if (reset) {
    reset.addEventListener('click', () => { resetState(); location.reload(); });
  }
}
