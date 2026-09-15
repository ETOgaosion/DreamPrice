/* DreamPrice — detail page: every asset, every line item, every source. */

import { ASSETS, CATEGORIES, CAVEATS, SRC } from './data.js';
import {
  categoryBreakdown, convert, evaluateAll, fmt, fmtCompact, PERIODS, scenarioBands,
} from './model.js';
import { bindGlobalControls, loadState, saveState } from './state.js';

/* Shared with the overview page through localStorage. */
const state = loadState();

/* ---------------- helpers ---------------- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function srcLink(src) {
  if (!src) return '';
  return `<div class="li-src"><a href="${src.u}" target="_blank" rel="noopener">${esc(src.t)}</a></div>`;
}

/* ---------------- hover card ----------------
 * One floating element reused by every line, rather than 80 tooltips in the
 * DOM. It follows the pointer and flips to stay on screen, and it also opens on
 * keyboard focus so the evidence is reachable without a mouse.
 */
const hoverCard = el('div', 'hovercard');
hoverCard.setAttribute('role', 'tooltip');
hoverCard.hidden = true;
document.body.append(hoverCard);

const SCENARIO_LABEL = { low: 'Optimistic', base: 'Realistic', high: 'Pessimistic' };

function buildEvidence(item, band, currency) {
  const rows = [];

  if (item.informational) {
    rows.push('<div class="hc-amt">Context only — not added to any total</div>');
  } else {
    rows.push(`<div class="hc-amt">${fmt(item.amount, currency, { digits: 0 })}` +
      `<span>${item.frequencyLabel || ''}</span></div>`);
  }

  /* The low/base/high band, derived rather than authored. */
  if (band) {
    const spread = Math.abs(band.high - band.low) > 0.5;
    if (spread) {
      rows.push('<div class="hc-sec">Range across scenarios 三档区间</div>');
      rows.push('<table class="hc-band">' + ['low', 'base', 'high'].map((s) =>
        `<tr class="${s === state.scenario ? 'on' : ''}"><td>${SCENARIO_LABEL[s]}</td>` +
        `<td>${fmt(band[s], currency, { digits: 0 })}</td></tr>`).join('') + '</table>');
    } else if (!item.informational) {
      rows.push('<div class="hc-flat">Fixed — same in every scenario</div>');
    }
  }

  if (item.formula) {
    rows.push('<div class="hc-sec">How it is worked out 算法</div>');
    rows.push(`<div class="hc-formula">${esc(item.formula)}</div>`);
  }

  if (item.facts?.length) {
    rows.push('<div class="hc-sec">Underlying data 原始数据</div>');
    rows.push('<table class="hc-facts">' + item.facts.map(([k, v]) =>
      `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('') + '</table>');
  }

  rows.push(`<div class="hc-conf ${item.est ? 'est' : 'src'}">` +
    (item.est ? 'Derived estimate — see the note' : 'Taken directly from the source') + '</div>');

  if (item.src) {
    rows.push(`<div class="hc-src"><span>${esc(item.src.t)}</span>` +
      `<code>${esc(item.src.u.replace(/^https?:\/\//, '').slice(0, 64))}</code>` +
      `<em>Click the link to open →</em></div>`);
  }
  return rows.join('');
}

function placeCard(ev) {
  const pad = 14;
  const { innerWidth: vw, innerHeight: vh } = window;
  const r = hoverCard.getBoundingClientRect();
  let x = ev.clientX + pad;
  let y = ev.clientY + pad;
  if (x + r.width > vw - 8) x = Math.max(8, ev.clientX - r.width - pad);
  if (y + r.height > vh - 8) y = Math.max(8, vh - r.height - 8);
  hoverCard.style.left = `${x}px`;
  hoverCard.style.top = `${y}px`;
}

function attachHover(node, item, band, currency) {
  const show = (ev) => {
    hoverCard.innerHTML = `<div class="hc-title">${esc(item.label)}</div>` +
      buildEvidence(item, band, currency);
    hoverCard.hidden = false;
    placeCard(ev.clientX !== undefined && ev.clientX !== 0
      ? ev
      : (() => { const b = node.getBoundingClientRect(); return { clientX: b.left, clientY: b.bottom }; })());
  };
  const hide = () => { hoverCard.hidden = true; };
  node.addEventListener('mouseenter', show);
  node.addEventListener('mousemove', (ev) => { if (!hoverCard.hidden) placeCard(ev); });
  node.addEventListener('mouseleave', hide);
  node.addEventListener('focusin', show);
  node.addEventListener('focusout', hide);
}

/* Persist and redraw. Every per-asset control routes through here so the
   overview page sees the change on the next navigation. */
const commit = () => { saveState(state); render(); };

/* ---------------- chart ---------------- */
function renderChart(results) {
  const cur = state.currency;
  const rows = ASSETS.map((a) => {
    const r = results[a.id];
    const cats = categoryBreakdown(r, cur, state.includeCapital);
    const total = cats.reduce((t, [, v]) => t + v, 0);
    return { asset: a, cats, total, on: state.enabled[a.id] };
  });
  const max = Math.max(...rows.filter((r) => r.on).map((r) => r.total), 1);

  $('#chart').replaceChildren(...rows.map((row) => {
    const d = el('div', 'crow' + (row.on ? '' : ' off'));
    d.append(el('div', 'cname', `<span>${row.asset.flag}</span><span>${esc(row.asset.name)} <small>${esc(row.asset.place.split(',')[0])}</small></span>`));
    const bar = el('div', 'cbar');
    const scale = row.total / max;
    for (const [cat, amt] of row.cats) {
      const seg = el('i');
      seg.style.width = `${(amt / row.total) * 100 * scale}%`;
      seg.style.background = CATEGORIES[cat].color;
      seg.title = `${CATEGORIES[cat].label}: ${fmtCompact(amt, cur)}/yr`;
      bar.append(seg);
    }
    d.append(bar, el('div', 'cval', `${fmtCompact(row.total, cur)}/yr`));
    return d;
  }));

  const used = new Set(rows.flatMap((r) => r.cats.map(([c]) => c)));
  $('#legend').replaceChildren(...[...used].map((c) => {
    const s = el('span');
    const i = el('i');
    i.style.background = CATEGORIES[c].color;
    s.append(i, document.createTextNode(CATEGORIES[c].label));
    return s;
  }));
}

/* ---------------- asset cards ---------------- */
function renderAssets(results) {
  $('#assets').replaceChildren(...ASSETS.map((a) => card(a, results[a.id])));
}

function card(asset, r) {
  const cur = asset.currency;
  const disp = state.currency;
  const key = state.includeCapital ? 'all' : 'cash';
  const c = el('article', 'card' + (state.enabled[asset.id] ? '' : ' disabled'));
  c.style.setProperty('--card-accent', asset.accent);

  /* head */
  const head = el('div', 'card-head');
  const title = el('div', 'card-title');
  title.innerHTML =
    `<span class="flag">${asset.flag}</span>` +
    `<span><h3>${esc(asset.name)}</h3><span class="native">${esc(asset.nativeName)}</span></span>`;
  const onoff = el('label', 'onoff');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = state.enabled[asset.id];
  cb.title = 'Include in the totals';
  cb.addEventListener('change', () => { state.enabled[asset.id] = cb.checked; commit(); });
  onoff.append(cb);
  title.append(onoff);
  head.append(title, el('p', 'blurb', esc(asset.blurb)));
  c.append(head);

  /* inputs */
  const box = el('div', 'card-inputs');
  if (asset.variants.length > 1) {
    const vsel = el('label', 'ctl full');
    vsel.append(el('span', null, asset.kind === 'car' ? 'Which one' : 'Where'));
    const select = el('select');
    for (const v of asset.variants) {
      const o = el('option', null, esc(v.label));
      o.value = v.id;
      if (v.id === state.variants[asset.id]) o.selected = true;
      select.append(o);
    }
    select.addEventListener('change', () => { state.variants[asset.id] = select.value; commit(); });
    vsel.append(select);
    box.append(vsel);
  } else {
    /* Nothing to choose — this one is already owned. */
    box.append(el('p', 'owned-tag', `${esc(r.variant.label)}`));
  }

  for (const inp of asset.inputs || []) {
    const l = el('label', 'ctl');
    const cap = el('span');
    cap.append(document.createTextNode(inp.label));
    const b = el('b');
    l.append(cap);
    if (inp.type === 'range') {
      b.textContent = `${Number(state.inputs[asset.id][inp.id]).toLocaleString()} ${inp.unit || ''}`.trim();
      cap.append(b);
      const range = el('input');
      Object.assign(range, { type: 'range', min: inp.min, max: inp.max, step: inp.step, value: state.inputs[asset.id][inp.id] });
      range.addEventListener('input', () => {
        state.inputs[asset.id][inp.id] = Number(range.value);
        commit();
      });
      l.append(range);
    } else if (inp.type === 'number') {
      /* A price wants typing, not dragging. */
      if (inp.unit) { b.textContent = inp.unit; cap.append(b); }
      const num = el('input', 'num');
      Object.assign(num, { type: 'number', min: inp.min, max: inp.max, step: inp.step, value: state.inputs[asset.id][inp.id] });
      const apply = () => {
        const raw = Number(num.value);
        if (!Number.isFinite(raw)) return;
        state.inputs[asset.id][inp.id] = Math.min(inp.max, Math.max(inp.min, Math.round(raw)));
        commit();
      };
      num.addEventListener('change', apply);
      num.addEventListener('blur', apply);
      l.append(num);
    } else {
      const s = el('select');
      for (const o of inp.options) {
        const opt = el('option', null, esc(o.l));
        opt.value = o.v;
        if (o.v === state.inputs[asset.id][inp.id]) opt.selected = true;
        s.append(opt);
      }
      s.addEventListener('change', () => { state.inputs[asset.id][inp.id] = s.value; commit(); });
      l.append(s);
    }
    box.append(l);
    if (inp.hint) box.append(el('p', 'hint', esc(inp.hint)));
  }
  if (r.variant.warn) box.append(el('p', 'unavailable', esc(r.variant.warn)));
  c.append(box);

  /* KPIs */
  const kpis = el('div', 'kpis');
  const cross = cur !== disp;
  const show = (amount) => (Math.abs(amount) < 1000 ? fmt(amount, cur, { digits: 0 }) : fmtCompact(amount, cur));
  const items = [
    [asset.owned ? 'Already paid' : 'Up front', fmtCompact(r.upFront, cur),
      r.refundable ? `${fmtCompact(r.refundable, cur)} back` : ''],
    /* The same four periods the front page is built around. */
    ...PERIODS.map((p) => [
      p.label,
      show(r[p.id][key]),
      cross ? `≈ ${fmt(convert(r[p.id][key], cur, disp), disp, { digits: 0 })}` : '',
    ]),
  ];
  for (const [lbl, val, alt] of items) {
    const k = el('div', 'kpi');
    k.append(el('div', 'lbl', lbl), el('div', 'val', val));
    if (alt) k.append(el('div', 'alt', alt));
    kpis.append(k);
  }
  c.append(kpis);

  /* breakdowns */
  const bands = scenarioBands(asset, state);
  c.append(lineBlock(
    asset.owned
      ? `Already paid 已付 — ${fmtCompact(r.upFront, cur)}`
      : `Up-front — ${fmtCompact(r.upFront, cur)}`,
    r.oneTime, cur, r.upFront,
    asset.owned ? 'Total 落地价 paid' : 'Total at purchase / move-in',
    true, bands.oneTime,
  ));
  c.append(lineBlock(
    `Every year — ${fmtCompact(r.runningYear1, cur)}`,
    r.annual, cur, r.runningYear1, 'Year-one running cost', false, bands.annual,
  ));
  c.append(yearBlock(r, cur));

  return c;
}

function lineBlock(summary, items, cur, total, totalLabel, isUpFront, bands) {
  const d = el('details', 'block');
  d.append(el('summary', null, esc(summary)));
  const body = el('div', 'body');
  items.forEach((item, i) => {
    const li = el('div', 'li');
    const top = el('div', 'li-top');
    const pills =
      (item.est ? ' <span class="pill est">estimate</span>' : '') +
      (item.refundable ? ' <span class="pill ref">refundable</span>' : '') +
      (item.informational ? ' <span class="pill info">context</span>' : '');
    top.append(el('div', 'li-lbl', esc(item.label) + pills));

    /* A real link on every line, not a grey afterthought at the bottom. */
    if (item.src) {
      const a = el('a', 'li-link');
      a.href = item.src.u;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = item.src.t;
      a.setAttribute('aria-label', `Source: ${item.src.t}`);
      a.innerHTML = '<span>data</span>';
      top.append(a);
    }

    const amt = el('div', 'li-amt' + (item.amount === 0 || item.informational ? ' zero' : ''),
      item.informational ? '—' : fmt(item.amount, cur, { digits: 0 }));
    top.append(amt);
    li.append(top);
    if (item.note) li.append(el('p', 'li-note', esc(item.note)));
    if (item.src) li.insertAdjacentHTML('beforeend', srcLink(item.src));

    /* Hover anywhere on the row to see the evidence behind the number. */
    li.tabIndex = 0;
    attachHover(li, item, bands?.[i], cur);
    body.append(li);
  });
  const t = el('div', 'li-total');
  t.innerHTML = `<span>${esc(totalLabel)}</span><span>${fmt(total, cur, { digits: 0 })}</span>`;
  body.append(t);
  if (isUpFront) {
    body.append(el('p', 'hint', 'Refundable items are money you park, not money you spend.'));
  }
  d.append(body);
  return d;
}

function yearBlock(r, cur) {
  const d = el('details', 'block');
  const isCar = r.asset.kind === 'car';
  d.append(el('summary', null, `Year by year over ${r.schedule.length} year${r.schedule.length > 1 ? 's' : ''}`));
  const body = el('div', 'body');
  const table = el('table', 'yrs');
  table.innerHTML =
    `<thead><tr><th>Year</th><th>Running</th>` +
    (isCar ? `<th>${r.variant.appr ? 'Value change' : 'Depreciation'}</th><th>Total</th><th class="dim">Car worth</th>` : `<th>Total</th>`) +
    `</tr></thead>`;
  const tb = el('tbody');
  for (const row of r.schedule) {
    const tr = el('tr');
    let html = `<td>${row.year}</td><td>${fmt(row.running, cur, { digits: 0 })}</td>`;
    if (isCar) {
      const sign = row.capital < 0 ? '+' : '';
      html += `<td>${sign}${fmt(-row.capital, cur, { digits: 0 })}</td>`;
      html += `<td>${fmt(row.total, cur, { digits: 0 })}</td>`;
      html += `<td class="dim">${fmtCompact(row.residual, cur)}</td>`;
    } else {
      html += `<td>${fmt(row.total, cur, { digits: 0 })}</td>`;
    }
    tr.innerHTML = html;
    tb.append(tr);
  }
  table.append(tb);
  const tf = el('tfoot');
  tf.innerHTML =
    `<tr><td>Total</td><td>${fmt(r.totalRunning, cur, { digits: 0 })}</td>` +
    (isCar
      ? `<td>${r.totalCapital < 0 ? '+' : ''}${fmt(-r.totalCapital, cur, { digits: 0 })}</td><td>${fmt(r.trueTotal, cur, { digits: 0 })}</td><td class="dim">${fmtCompact(r.finalResidual, cur)}</td>`
      : `<td>${fmt(r.trueTotal, cur, { digits: 0 })}</td>`) +
    `</tr>`;
  table.append(tf);
  body.append(table);

  const notes = [];
  if (isCar && r.variant.appr) {
    const rate = r.variant.appr[state.scenario] ?? r.variant.appr.base;
    notes.push(
      `Value change ${rate >= 0 ? '+' : ''}${(rate * 100).toFixed(0)}%/yr. Asking prices are rising, but trade-in ` +
      `prices are flat — you buy at retail and sell at trade, a 26–30% gap.`);
  } else if (isCar && r.variant.dep) {
    const rate = r.variant.dep[state.scenario] ?? r.variant.dep.base;
    notes.push(
      `Loses ${(rate * 100).toFixed(0)}% of its value each year${rate < 0 ? ' — negative, so it gains' : ''}. ` +
      `A typical 6-year-old Norwegian car loses about 10%/yr; the old V8 holds value only with repairs on paper.`);
  } else if (isCar) {
    notes.push('Only the car loses value; taxes and fees are gone at once. "Car worth" is resale value.');
  } else {
    const e = r.asset.escalation[state.scenario] ?? r.asset.escalation.base;
    notes.push(`Rent rises ${(e * 100).toFixed(1)}% a year here.`);
  }
  for (const n of notes) body.append(el('p', 'hint', esc(n)));
  d.append(body);
  return d;
}

/* ---------------- static sections ---------------- */
function renderStatic() {
  $('#caveats').replaceChildren(...CAVEATS.map((c) => {
    const d = el('div', 'caveat');
    d.append(el('h4', null, esc(c.tag)), el('p', null, esc(c.body)));
    d.insertAdjacentHTML('beforeend', srcLink(c.src));
    return d;
  }));

  const seen = new Set();
  const list = Object.values(SRC).filter((s) => (seen.has(s.u) ? false : seen.add(s.u)));
  $('#sources-list').replaceChildren(...list.map((s) => {
    const a = el('a', null, esc(s.t));
    a.href = s.u;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }));

}

/* ---------------- render ---------------- */
/* Which <details> blocks the reader had open, so a re-render doesn't slam them shut. */
const openBlocks = new Set();

function render() {
  const results = evaluateAll(state);
  renderChart(results);
  renderAssets(results);

  document.querySelectorAll('.card').forEach((card, ci) => {
    card.querySelectorAll('details.block').forEach((d, di) => {
      const key = `${ci}:${di}`;
      if (openBlocks.has(key)) d.open = true;
      d.addEventListener('toggle', () => {
        if (d.open) openBlocks.add(key); else openBlocks.delete(key);
      });
    });
  });
}

/* ---------------- wiring ---------------- */
bindGlobalControls(state, render);

renderStatic();
render();
