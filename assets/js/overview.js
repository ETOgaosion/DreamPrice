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
  /* One-off cost, stated as three facts rather than a paragraph. */
  const box = el('div', 'upfront-inner');
  const facts = [
    ['Already paid', '已付', fmtCompact(p.alreadyPaid, cur)],
    ['Still ahead', '还要付', fmtCompact(p.upFront - p.alreadyPaid, cur)],
    ['Refundable deposit', '押金可退', fmtCompact(p.refundable, cur)],
  ].filter(([, , v]) => !/^[^\d]*0$/.test(v));

  box.append(
    el('div', 'upfront-lbl', 'One-off <small>一次性投入</small>'),
    el('div', 'upfront-val', fmtCompact(p.upFront, cur)),
  );
  const split = el('div', 'upfront-split');
  for (const [en, zh, v] of facts) {
    const f = el('div', 'fact');
    f.append(el('span', 'fact-l', `${en} <i>${zh}</i>`), el('span', 'fact-v', v));
    split.append(f);
  }
  box.append(split);
  $('#upfront').replaceChildren(box);

  /* Settings recap: chips, not prose. */
  const chips = [
    `${included.length}/${ASSETS.length} assets`,
    { low: 'Optimistic', base: 'Realistic', high: 'Pessimistic' }[state.scenario],
    `${state.years}-year average`,
    state.includeCapital ? 'Depreciation in' : 'Depreciation out',
  ];
  $('#periods').insertAdjacentHTML('beforeend',
    `<p class="periods-note">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</p>`);
}

$('#fx-stamp').textContent =
  `1 USD = ${FX.perUsd.CNY} CNY = ${FX.perUsd.JPY} JPY = ${FX.perUsd.NOK} NOK.`;

bindGlobalControls(state, render);
render();
