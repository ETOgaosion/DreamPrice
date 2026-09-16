/* DreamPrice — overview page. Four periods; hover any row for the real data. */

import { ASSETS, FX } from './data.js';
import { convert, DAYS_PER_YEAR, evaluateAll, fmt, fmtCompact, PERIODS, portfolio } from './model.js';
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

/* ---------------- hover card on the front page ----------------
 * The numbers people actually stare at live here. Hover (or click) any asset
 * row to see the line items that add up to it, each with its source link.
 */
const hoverCard = el('div', 'hovercard');
hoverCard.setAttribute('role', 'tooltip');
hoverCard.hidden = true;
document.body.append(hoverCard);

let pinnedNode = null;

function placeCard(ev) {
  const pad = 14;
  const { innerWidth: vw, innerHeight: vh } = window;
  const r = hoverCard.getBoundingClientRect();
  let x = (ev?.clientX ?? 24) + pad;
  let y = (ev?.clientY ?? 24) + pad;
  if (x + r.width > vw - 8) x = Math.max(8, (ev?.clientX ?? 24) - r.width - pad);
  if (y + r.height > vh - 8) y = Math.max(8, vh - r.height - 8);
  hoverCard.style.left = `${x}px`;
  hoverCard.style.top = `${y}px`;
}

function pointerFor(node, ev) {
  if (ev && (ev.clientX || ev.clientY)) return ev;
  const b = node.getBoundingClientRect();
  return { clientX: b.left + Math.min(160, b.width / 2), clientY: b.bottom };
}

function attachHover(node, html) {
  const show = (ev) => {
    hoverCard.innerHTML = html;
    hoverCard.hidden = false;
    hoverCard.classList.toggle('is-pinned', pinnedNode === node);
    placeCard(pointerFor(node, ev));
  };
  const hide = () => {
    if (pinnedNode) return;
    hoverCard.hidden = true;
    hoverCard.classList.remove('is-pinned');
  };
  node.addEventListener('mouseenter', (ev) => {
    if (pinnedNode && pinnedNode !== node) return;
    show(ev);
  });
  node.addEventListener('mousemove', (ev) => {
    if (hoverCard.hidden || pinnedNode) return;
    placeCard(ev);
  });
  node.addEventListener('mouseleave', hide);
  node.addEventListener('focusin', (ev) => {
    if (pinnedNode && pinnedNode !== node) return;
    show(ev);
  });
  node.addEventListener('focusout', (ev) => {
    if (node.contains(ev.relatedTarget)) return;
    hide();
  });
  node.addEventListener('click', (ev) => {
    if (ev.target.closest('a')) return;
    if (pinnedNode === node) {
      pinnedNode = null;
      hoverCard.hidden = true;
      hoverCard.classList.remove('is-pinned');
      node.classList.remove('is-pinned');
      return;
    }
    if (pinnedNode) pinnedNode.classList.remove('is-pinned');
    pinnedNode = node;
    node.classList.add('is-pinned');
    show(ev);
  });
}

document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape' || !pinnedNode) return;
  pinnedNode.classList.remove('is-pinned');
  pinnedNode = null;
  hoverCard.hidden = true;
  hoverCard.classList.remove('is-pinned');
});

/* Build the evidence HTML for one asset in one period. */
function assetEvidence(asset, result, period, displayCur) {
  const div = DIVISOR[period.id];
  const native = asset.currency;
  const periodAmt = convert(result[period.id], native, displayCur);
  const lines = result.annual.filter((i) => !i.informational || i.amount);

  const rows = lines.map((item) => {
    const amt = convert(item.amount / div, native, displayCur);
    const facts = (item.facts || []).slice(0, 3).map(([k, v]) =>
      `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');
    const link = item.src
      ? `<a class="hc-data" href="${item.src.u}" target="_blank" rel="noopener"` +
        ` title="${esc(item.src.t)}"><span>DATA</span><small>${esc(hostOf(item.src.u))}</small></a>`
      : '';
    return (
      `<div class="hc-line">` +
        `<div class="hc-line-top">` +
          `<span class="hc-line-lbl">${esc(item.label)}${item.est ? ' <i>est.</i>' : ''}</span>` +
          link +
          `<span class="hc-line-amt">${money(amt, displayCur)}</span>` +
        `</div>` +
        (item.formula ? `<div class="hc-line-formula">${esc(item.formula)}</div>` : '') +
        (facts ? `<table class="hc-facts">${facts}</table>` : '') +
      `</div>`
    );
  }).join('');

  return (
    `<div class="hc-title">${esc(asset.flag)} ${esc(asset.name)}` +
      `<small>${esc(period.label)} · ${esc(asset.place.split(',')[0])}</small></div>` +
    `<div class="hc-amt">${money(periodAmt, displayCur)}<span>${esc(period.label.toLowerCase())}</span></div>` +
    `<div class="hc-sec">What makes this number 构成</div>` +
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

function upfrontEvidence(results, displayCur, p) {
  const rows = ASSETS.filter((a) => state.enabled[a.id]).map((a) => {
    const r = results[a.id];
    const amt = convert(r.upFront, a.currency, displayCur);
    const top = r.oneTime.filter((i) => !i.informational && i.amount).slice(0, 4);
    const bits = top.map((i) => {
      const link = i.src
        ? ` <a class="hc-data" href="${i.src.u}" target="_blank" rel="noopener"><span>DATA</span></a>`
        : '';
      return `<tr><td>${esc(i.label)}${link}</td>` +
        `<td>${money(convert(i.amount, a.currency, displayCur), displayCur)}</td></tr>`;
    }).join('');
    return (
      `<div class="hc-line">` +
        `<div class="hc-line-top">` +
          `<span class="hc-line-lbl">${esc(a.flag)} ${esc(a.name)}</span>` +
          `<span class="hc-line-amt">${fmtCompact(amt, displayCur)}</span>` +
        `</div>` +
        (bits ? `<table class="hc-facts">${bits}</table>` : '') +
      `</div>`
    );
  }).join('');

  return (
    `<div class="hc-title">One-off <small>一次性投入</small></div>` +
    `<div class="hc-amt">${fmtCompact(p.upFront, displayCur)}<span>to get in</span></div>` +
    `<div class="hc-sec">Per asset, with source links</div>` +
    `<div class="hc-lines">${rows}</div>` +
    `<a class="hc-more" href="./details.html">Configure &amp; open every source →</a>`
  );
}

function render() {
  pinnedNode = null;
  hoverCard.hidden = true;
  hoverCard.classList.remove('is-pinned');

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

  /* One-off cost, with the same hover treatment. */
  const box = el('div', 'upfront-inner');
  box.tabIndex = 0;
  box.title = 'Hover to see what makes up the one-off total';
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
  attachHover(box, upfrontEvidence(results, cur, p));
  $('#upfront').replaceChildren(box);

  const chips = [
    `${included.length}/${ASSETS.length} assets`,
    { low: 'Optimistic', base: 'Realistic', high: 'Pessimistic' }[state.scenario],
    'Hover any row for the real data',
    'Today\u2019s prices',
  ];
  $('#periods').insertAdjacentHTML('beforeend',
    `<p class="periods-note">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</p>`);
}

$('#fx-stamp').textContent =
  `1 USD = ${FX.perUsd.CNY} CNY = ${FX.perUsd.JPY} JPY = ${FX.perUsd.NOK} NOK.`;

bindGlobalControls(state, render);
render();
