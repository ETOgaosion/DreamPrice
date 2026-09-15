/* DreamPrice — overview page. Four periods, one table each, nothing else. */

import { ASSETS, FX } from './data.js';
import { convert, evaluateAll, fmt, fmtCompact, PERIODS, portfolio } from './model.js';
import { bindGlobalControls, loadState } from './state.js';

const state = loadState();

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Daily figures are small enough that rounding to whole units hides the detail. */
const money = (amount, currency) =>
  Math.abs(amount) < 1000 ? fmt(amount, currency, { digits: 0 }) : fmtCompact(amount, currency);

function render() {
  const results = evaluateAll(state);
  const cur = state.currency;
  const key = state.includeCapital ? 'all' : 'cash';
  const included = ASSETS.filter((a) => state.enabled[a.id]);
  const p = portfolio(results, cur, state.includeCapital, state.enabled);

  /* One table per period. Rows are the assets, sorted dearest first, so the
     thing you should look at is always at the top. */
  $('#periods').replaceChildren(...PERIODS.map((period) => {
    const rows = included
      .map((a) => ({ a, amount: convert(results[a.id][period.id][key], a.currency, cur) }))
      .sort((x, y) => y.amount - x.amount);
    const total = p[period.id];
    const max = rows.length ? rows[0].amount : 1;

    const card = el('section', 'period');
    const head = el('header');
    head.append(
      el('h2', null, `${period.label} <small>${period.zh}</small>`),
      el('div', 'period-total', money(total, cur)),
      el('p', 'period-note', esc(period.note)),
    );
    card.append(head);

    const table = el('table');
    const tbody = el('tbody');
    for (const { a, amount } of rows) {
      const tr = el('tr');
      tr.style.setProperty('--share', `${(amount / max) * 100}%`);
      tr.style.setProperty('--tint', a.accent);
      tr.innerHTML =
        `<td class="n"><span class="flag">${a.flag}</span>` +
        `<span class="nm">${esc(a.name)}<small>${esc(a.place.split(',')[0])}</small></span></td>` +
        `<td class="v">${money(amount, cur)}</td>`;
      tbody.append(tr);
    }
    table.append(tbody);

    const tfoot = el('tfoot');
    tfoot.innerHTML = `<tr><td class="n">All six</td><td class="v">${money(total, cur)}</td></tr>`;
    table.append(tfoot);
    card.append(table);
    return card;
  }));

  /* Up-front sits apart, because it is not a period and adding it to the tables
     would be the fastest way to make them lie. */
  const owned = ASSETS.filter((a) => a.owned && state.enabled[a.id]);
  const stillToFind = p.upFront - p.alreadyPaid;
  const box = el('div', 'upfront-inner');
  box.append(
    el('div', 'upfront-lbl', 'One-off, before any of the above <small>一次性投入</small>'),
    el('div', 'upfront-val', fmtCompact(p.upFront, cur)),
    el('p', 'upfront-note',
      `Purchase prices, taxes, deposits, agency and key money, winter tyres. ` +
      `${fmtCompact(p.refundable, cur)} of that is refundable deposit you get back, so the true sunk ` +
      `cost is ${fmtCompact(p.upFront - p.refundable, cur)}.` +
      (owned.length
        ? ` ${fmtCompact(p.alreadyPaid, cur)} is already spent on the ` +
          `${esc(owned.map((a) => a.name).join(' and '))} — money gone, not money to find. ` +
          `That leaves ${fmtCompact(stillToFind, cur)} ahead of you.`
        : '')),
  );
  $('#upfront').replaceChildren(box);

  const dropped = ASSETS.filter((a) => !state.enabled[a.id]);
  const note = dropped.length
    ? ` Excluding ${esc(dropped.map((a) => a.name).join(', '))}.`
    : '';
  $('#periods').insertAdjacentHTML('beforeend',
    `<p class="periods-note">` +
    `${included.length} of ${ASSETS.length} assets, ${esc({ low: 'optimistic', base: 'realistic', high: 'pessimistic' }[state.scenario])} scenario, ` +
    `averaged over ${state.years} year${state.years > 1 ? 's' : ''}.${note} ` +
    `${state.includeCapital
      ? 'Depreciation is counted, because it is a real cost — you just never write a cheque for it.'
      : 'Depreciation is excluded, so these are pure out-of-pocket payments.'}` +
    `</p>`);
}

$('#fx-stamp').textContent =
  `1 USD = ${FX.perUsd.CNY} CNY = ${FX.perUsd.JPY} JPY = ${FX.perUsd.NOK} NOK.`;

bindGlobalControls(state, render);
render();
