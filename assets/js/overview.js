/* DreamPrice — overview page. Four periods; hover any row for the real data. */

import { ASSETS, FX } from './data.js';
import { convert, DAYS_PER_YEAR, evaluateAll, fmt, fmtCompact, PERIODS, portfolio } from './model.js';
import { bindGlobalControls, loadState } from './state.js';
import { createHoverController } from './hover.js';

const state = loadState();
const hover = createHoverController({ showDelay: 320, hideDelay: 220 });

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

const DIVISOR = {
  perYear: 1,
  perQuarter: 4,
  perMonth: 12,
  perDay: DAYS_PER_YEAR,
};

function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); }
  catch { return url.replace(/^https?:\/\//, '').split('/')[0]; }
}

function attachHover(node, html) {
  hover.attach(node, typeof html === 'function' ? html : () => html);
}

/* One line item, rendered the same way wherever it appears. */
function lineRow(item, amount, displayCur, { pill = '' } = {}) {
  const facts = (item.facts || []).slice(0, 3).map(([k, v]) =>
    `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');
  const link = item.src
    ? `<a class="hc-data" href="${item.src.u}" target="_blank" rel="noopener"` +
      ` title="${esc(item.src.t)}"><span>DATA</span><small>${esc(hostOf(item.src.u))}</small></a>`
    : '';
  return (
    `<div class="hc-line">` +
      `<div class="hc-line-top">` +
        `<span class="hc-line-lbl">${esc(item.label)}${item.est ? ' <i>est.</i>' : ''}${pill}</span>` +
        link +
        `<span class="hc-line-amt">${money(amount, displayCur)}</span>` +
      `</div>` +
      (item.formula ? `<div class="hc-line-formula">${esc(item.formula)}</div>` : '') +
      (facts ? `<table class="hc-facts">${facts}</table>` : '') +
    `</div>`
  );
}

/* Build the evidence HTML for one asset in one period. */
function assetEvidence(asset, result, period, displayCur) {
  const div = DIVISOR[period.id];
  const native = asset.currency;
  const periodAmt = convert(result[period.id], native, displayCur);
  const lines = result.annual.filter((i) => !i.informational || i.amount);
  const yearly = convert(result.annualRunning, native, displayCur);

  const rows = lines
    .map((item) => lineRow(item, convert(item.amount / div, native, displayCur), displayCur))
    .join('');

  const share = div === 1
    ? ''
    : `<div class="hc-sec">From year to ${esc(period.label.replace(/^Per /, ''))} 折算</div>` +
      `<div class="hc-formula">${money(yearly, displayCur)} per year ÷ ` +
      `${div === DAYS_PER_YEAR ? '365.25 days' : `${div}`} = ${money(periodAmt, displayCur)}</div>`;

  return (
    `<div class="hc-title">${esc(asset.flag)} ${esc(asset.name)}` +
      `<small>${esc(period.label)} · ${esc(asset.place.split(',')[0])}</small></div>` +
    `<div class="hc-amt">${money(periodAmt, displayCur)}<span>${esc(period.label.toLowerCase())}</span></div>` +
    share +
    `<div class="hc-sec">What makes this number 构成</div>` +
    `<div class="hc-lines">${rows}</div>` +
    `<a class="hc-more" href="./details.html#${asset.id}">Full breakdown on the detail page →</a>`
  );
}

/* Every one-off line for one asset: what you hand over to get in. */
function oneOffEvidence(asset, result, displayCur) {
  const native = asset.currency;
  const total = convert(result.upFront, native, displayCur);
  const lines = result.oneTime.filter((i) => !i.informational || i.amount);

  const rows = lines.map((item) => lineRow(
    item,
    convert(item.amount, native, displayCur),
    displayCur,
    { pill: item.refundable ? ' <i>refundable</i>' : '' },
  )).join('');

  const counted = lines.filter((i) => !i.informational);
  const sum = counted
    .map((i) => money(convert(i.amount, native, displayCur), displayCur))
    .join(' + ');
  const refund = convert(result.refundable, native, displayCur);

  return (
    `<div class="hc-title">${esc(asset.flag)} ${esc(asset.name)}` +
      `<small>${asset.owned ? 'Already paid 已付' : 'Up-front 落地'} · ${esc(asset.place.split(',')[0])}</small></div>` +
    `<div class="hc-amt">${money(total, displayCur)}<span>one-off</span></div>` +
    `<div class="hc-sec">How the total is reached 加总</div>` +
    `<div class="hc-formula">${sum} = ${money(total, displayCur)}</div>` +
    (refund
      ? `<div class="hc-formula">Of which ${money(refund, displayCur)} is a deposit you get back — ` +
        `net ${money(total - refund, displayCur)}</div>`
      : '') +
    `<div class="hc-sec">Every one-off line 逐条</div>` +
    `<div class="hc-lines">${rows}</div>` +
    `<a class="hc-more" href="./details.html#${asset.id}">Full breakdown on the detail page →</a>`
  );
}

function totalEvidence(rows, period, displayCur, total) {
  const list = rows.map(({ a, amount }) =>
    `<tr><td>${esc(a.flag)} ${esc(a.name)}</td><td>${money(amount, displayCur)}</td></tr>`).join('');
  return (
    `<div class="hc-title">All assets<small>${esc(period.label)}</small></div>` +
    `<div class="hc-amt">${money(total, displayCur)}<span>${esc(period.label.toLowerCase())}</span></div>` +
    `<div class="hc-sec">By asset 按资产</div>` +
    `<table class="hc-facts">${list}</table>` +
    `<a class="hc-more" href="./details.html">Open every line item →</a>`
  );
}

/* The one-off total: which assets it adds up from, stated as arithmetic. */
function upfrontEvidence(results, displayCur, p, included) {
  const parts = included.map((a) => ({
    a,
    amt: convert(results[a.id].upFront, a.currency, displayCur),
  })).sort((x, y) => y.amt - x.amt);

  const list = parts.map(({ a, amt }) =>
    `<tr><td>${esc(a.flag)} ${esc(a.name)}${a.owned ? ' — already paid' : ''}</td>` +
    `<td>${money(amt, displayCur)}</td></tr>`).join('');

  return (
    `<div class="hc-title">One-off <small>一次性投入 · ${parts.length} assets</small></div>` +
    `<div class="hc-amt">${fmtCompact(p.upFront, displayCur)}<span>to get in</span></div>` +
    `<div class="hc-sec">How the total is reached 加总</div>` +
    `<div class="hc-formula">${parts.map(({ amt }) => money(amt, displayCur)).join(' + ')} = ` +
      `${money(p.upFront, displayCur)}</div>` +
    `<div class="hc-sec">Per asset 按资产</div>` +
    `<table class="hc-facts">${list}</table>` +
    `<div class="hc-sec">Nothing here repeats 说明</div>` +
    `<div class="hc-line-formula">Purchase price, taxes, plates, deposits and agency fees — ` +
      `paid once. Running costs live in the four period tables above.</div>` +
    `<a class="hc-more" href="./details.html">Configure &amp; open every source →</a>`
  );
}

/* Each of the three summary facts, derived rather than asserted. */
function factEvidence(kind, results, displayCur, p, included) {
  const rowsFor = (pick) => included.filter(pick).map((a) => {
    const r = results[a.id];
    const amt = convert(kind === 'refundable' ? r.refundable : r.upFront, a.currency, displayCur);
    return { a, amt };
  }).filter(({ amt }) => amt > 0).sort((x, y) => y.amt - x.amt);

  const spec = {
    paid: {
      title: 'Already paid 已付',
      value: p.alreadyPaid,
      sec: 'Assets you already own',
      rows: rowsFor((a) => a.owned),
      note: 'Money that has already left your account, so it is not part of what you still need to find.',
    },
    ahead: {
      title: 'Still ahead 还要付',
      value: p.upFront - p.alreadyPaid,
      sec: 'Assets not bought yet',
      rows: rowsFor((a) => !a.owned),
      note: `One-off total ${money(p.upFront, displayCur)} − already paid ` +
        `${money(p.alreadyPaid, displayCur)} = ${money(p.upFront - p.alreadyPaid, displayCur)}.`,
    },
    refundable: {
      title: 'Refundable deposit 押金可退',
      value: p.refundable,
      sec: 'Deposits inside the one-off total',
      rows: rowsFor(() => true),
      note: 'Rental deposits are parked, not spent — you get them back when you move out, ' +
        'so the real out-of-pocket figure is lower than the one-off total.',
    },
  }[kind];

  const list = spec.rows.map(({ a, amt }) =>
    `<tr><td>${esc(a.flag)} ${esc(a.name)}</td><td>${money(amt, displayCur)}</td></tr>`).join('')
    || '<tr><td>Nothing in this bucket</td><td>—</td></tr>';

  const sum = spec.rows.length > 1
    ? `<div class="hc-formula">${spec.rows.map(({ amt }) => money(amt, displayCur)).join(' + ')} = ` +
      `${money(spec.value, displayCur)}</div>`
    : '';

  return (
    `<div class="hc-title">${spec.title}<small>Part of the one-off total</small></div>` +
    `<div class="hc-amt">${money(spec.value, displayCur)}<span>one-off</span></div>` +
    `<div class="hc-sec">${spec.sec}</div>` +
    `<table class="hc-facts">${list}</table>` +
    sum +
    `<div class="hc-sec">Why 说明</div>` +
    `<div class="hc-line-formula">${esc(spec.note)}</div>` +
    `<a class="hc-more" href="./details.html">Open every one-off line →</a>`
  );
}

function render() {
  hover.reset();

  const results = evaluateAll(state);
  const cur = state.currency;
  const included = ASSETS.filter((a) => state.enabled[a.id]);
  const p = portfolio(results, cur, state.enabled);

  /* One table per period. Rows are the assets, sorted dearest first. */
  $('#periods').replaceChildren(...PERIODS.map((period) => {
    const rows = included
      .map((a) => ({ a, amount: convert(results[a.id][period.id], a.currency, cur) }))
      .sort((x, y) => y.amount - x.amount);
    const total = p[period.id];
    const max = rows.length ? rows[0].amount : 1;

    const card = el('section', 'period');
    const head = el('header');
    const totalEl = el('div', 'period-total', money(total, cur));
    totalEl.tabIndex = 0;
    totalEl.title = 'Hover to see each asset’s share';
    attachHover(totalEl, totalEvidence(rows, period, cur, total));
    head.append(
      el('h2', null, `${period.label} <small>${period.zh}</small>`),
      totalEl,
    );
    card.append(head);

    const table = el('table');
    const tbody = el('tbody');
    for (const { a, amount } of rows) {
      const tr = el('tr');
      tr.tabIndex = 0;
      tr.style.setProperty('--share', `${(amount / max) * 100}%`);
      tr.style.setProperty('--tint', a.accent);
      tr.title = 'Hover or click to see the real data behind this number';

      const name = el('td', 'n');
      name.innerHTML =
        `<span class="flag">${a.flag}</span>` +
        `<span class="nm">${esc(a.name)}<small>${esc(a.place.split(',')[0])}</small></span>`;

      /* Clear source entry-point: top cost’s DATA link + detail anchor. */
      const topSrc = results[a.id].annual.find((i) => i.src && !i.informational && i.amount)?.src
        || results[a.id].annual.find((i) => i.src)?.src;
      const links = el('td', 'lnk');
      const wrap = el('div', 'lnk-wrap');
      if (topSrc) {
        const data = el('a', 'row-data');
        data.href = topSrc.u;
        data.target = '_blank';
        data.rel = 'noopener';
        data.title = topSrc.t;
        data.innerHTML = `<span>DATA</span><small>${esc(hostOf(topSrc.u))}</small>`;
        wrap.append(data);
      }
      const more = el('a', 'row-more');
      more.href = `./details.html#${a.id}`;
      more.textContent = '明细';
      more.title = 'Open full breakdown';
      wrap.append(more);
      links.append(wrap);

      const val = el('td', 'v', money(amount, cur));
      tr.append(name, links, val);
      attachHover(tr, assetEvidence(a, results[a.id], period, cur));
      tbody.append(tr);
    }
    table.append(tbody);

    const tfoot = el('tfoot');
    const foot = el('tr');
    foot.innerHTML = `<td class="n" colspan="2">All ${included.length}</td><td class="v">${money(total, cur)}</td>`;
    foot.tabIndex = 0;
    attachHover(foot, totalEvidence(rows, period, cur, total));
    tfoot.append(foot);
    table.append(tfoot);
    card.append(table);
    return card;
  }));

  /* One-off cost: same treatment as the period tables, so it shows its working. */
  const box = el('div', 'upfront-inner');
  const head = el('div', 'upfront-head');
  head.tabIndex = 0;
  head.title = 'Hover to see how the one-off total adds up';
  head.append(
    el('div', 'upfront-lbl', 'One-off <small>一次性投入</small>'),
    el('div', 'upfront-val', fmtCompact(p.upFront, cur)),
  );
  attachHover(head, upfrontEvidence(results, cur, p, included));
  box.append(head);

  const facts = [
    ['paid', 'Already paid', '已付', p.alreadyPaid],
    ['ahead', 'Still ahead', '还要付', p.upFront - p.alreadyPaid],
    ['refundable', 'Refundable deposit', '押金可退', p.refundable],
  ].filter(([, , , v]) => Math.round(v) !== 0);

  const split = el('div', 'upfront-split');
  for (const [kind, en, zh, value] of facts) {
    const f = el('div', 'fact');
    f.tabIndex = 0;
    f.title = 'Hover for the derivation';
    f.append(el('span', 'fact-l', `${en} <i>${zh}</i>`), el('span', 'fact-v', fmtCompact(value, cur)));
    attachHover(f, factEvidence(kind, results, cur, p, included));
    split.append(f);
  }
  box.append(split);

  /* Per-asset one-off rows — every one of them opens its own line items. */
  const table = el('table', 'upfront-table');
  const tbody = el('tbody');
  const upfronts = included
    .map((a) => ({ a, amount: convert(results[a.id].upFront, a.currency, cur) }))
    .sort((x, y) => y.amount - x.amount);
  const max = upfronts.length ? upfronts[0].amount : 1;

  for (const { a, amount } of upfronts) {
    const tr = el('tr');
    tr.tabIndex = 0;
    tr.style.setProperty('--share', `${(amount / max) * 100}%`);
    tr.style.setProperty('--tint', a.accent);
    tr.title = 'Hover or click to see every one-off line and its source';

    const name = el('td', 'n');
    name.innerHTML =
      `<span class="flag">${a.flag}</span>` +
      `<span class="nm">${esc(a.name)}<small>${a.owned ? '已付 · already paid' : esc(a.place.split(',')[0])}</small></span>`;

    const topSrc = results[a.id].oneTime.find((i) => i.src && !i.informational && i.amount)?.src
      || results[a.id].oneTime.find((i) => i.src)?.src;
    const links = el('td', 'lnk');
    const wrap = el('div', 'lnk-wrap');
    if (topSrc) {
      const data = el('a', 'row-data');
      data.href = topSrc.u;
      data.target = '_blank';
      data.rel = 'noopener';
      data.title = topSrc.t;
      data.innerHTML = `<span>DATA</span><small>${esc(hostOf(topSrc.u))}</small>`;
      wrap.append(data);
    }
    const more = el('a', 'row-more');
    more.href = `./details.html#${a.id}`;
    more.textContent = '明细';
    more.title = 'Open full breakdown';
    wrap.append(more);
    links.append(wrap);

    tr.append(name, links, el('td', 'v', money(amount, cur)));
    attachHover(tr, oneOffEvidence(a, results[a.id], cur));
    tbody.append(tr);
  }
  table.append(tbody);

  const tfoot = el('tfoot');
  const foot = el('tr');
  foot.innerHTML =
    `<td class="n" colspan="2">All ${included.length}</td>` +
    `<td class="v">${money(p.upFront, cur)}</td>`;
  foot.tabIndex = 0;
  attachHover(foot, upfrontEvidence(results, cur, p, included));
  tfoot.append(foot);
  table.append(tfoot);
  box.append(table);

  $('#upfront').replaceChildren(box);

  const chips = [
    `${included.length}/${ASSETS.length} assets`,
    { low: 'Optimistic', base: 'Realistic', high: 'Pessimistic' }[state.scenario],
    state.driveMode === 'weekend'
      ? `Weekend · ${Math.round((state.weekendPool || 5200) / Math.max(1, included.filter((a) => a.kind === 'car' && !a.daily).length)).toLocaleString()} km/toy`
      : 'Km as dialled on detail',
    'Dwell on a row for sources',
  ];
  $('#periods').insertAdjacentHTML('beforeend',
    `<p class="periods-note">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</p>`);
}

$('#fx-stamp').textContent =
  `1 USD = ${FX.perUsd.CNY} CNY = ${FX.perUsd.JPY} JPY = ${FX.perUsd.NOK} NOK.`;

bindGlobalControls(state, render);
render();
