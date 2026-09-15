/* DreamPrice — detail page: every asset, every line item, every source. */

import { ASSETS, CATEGORIES, CAVEATS, SRC } from './data.js';
import {
  categoryBreakdown, convert, evaluateAll, fmt, fmtCompact, PERIODS,
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
      r.refundable ? `${fmtCompact(r.refundable, cur)} refundable` : (asset.owned ? '落地价' : '')],
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
  c.append(lineBlock(
    asset.owned
      ? `Already paid 已付 — ${fmtCompact(r.upFront, cur)}`
      : `Up-front — ${fmtCompact(r.upFront, cur)}`,
    r.oneTime, cur, r.upFront,
    asset.owned ? 'Total 落地价 paid' : 'Total at purchase / move-in',
    true,
  ));
  c.append(lineBlock(
    `Every year — ${fmtCompact(r.runningYear1, cur)}`,
    r.annual, cur, r.runningYear1, 'Year-one running cost', false,
  ));
  c.append(yearBlock(r, cur));

  return c;
}

function lineBlock(summary, items, cur, total, totalLabel, isUpFront) {
  const d = el('details', 'block');
  d.append(el('summary', null, esc(summary)));
  const body = el('div', 'body');
  for (const item of items) {
    const li = el('div', 'li');
    const top = el('div', 'li-top');
    const pills =
      (item.est ? ' <span class="pill est">estimate</span>' : '') +
      (item.refundable ? ' <span class="pill ref">refundable</span>' : '') +
      (item.informational ? ' <span class="pill info">context</span>' : '');
    top.append(el('div', 'li-lbl', esc(item.label) + pills));
    const amt = el('div', 'li-amt' + (item.amount === 0 || item.informational ? ' zero' : ''),
      item.informational ? '—' : fmt(item.amount, cur, { digits: 0 }));
    top.append(amt);
    li.append(top);
    if (item.note) li.append(el('p', 'li-note', esc(item.note)));
    if (item.src) li.insertAdjacentHTML('beforeend', srcLink(item.src));
    body.append(li);
  }
  const t = el('div', 'li-total');
  t.innerHTML = `<span>${esc(totalLabel)}</span><span>${fmt(total, cur, { digits: 0 })}</span>`;
  body.append(t);
  if (isUpFront) {
    body.append(el('p', 'hint',
      'Refundable items are money you park, not money you spend — they are in the up-front figure but excluded from the cost of ownership.'));
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
      `Modelled at ${rate >= 0 ? '+' : ''}${(rate * 100).toFixed(0)}%/yr. The R35's retail floor is rising, but largely through ` +
      `survivorship: inventory fell 13% while the average listing rose 6.7% over nine months, as tired high-mileage cars leave ` +
      `the market. Trade-in values for 2010–2012 cars are flat to down, and the retail-to-trade spread is 26–30% — you buy at ` +
      `retail and exit at trade. Do not model an ordinary early car as an appreciating asset.`);
  } else if (isCar && r.variant.dep) {
    const rate = r.variant.dep[state.scenario] ?? r.variant.dep.base;
    notes.push(
      `Modelled at ${(rate * 100).toFixed(0)}%/yr declining balance${rate < 0 ? ' — a negative rate, i.e. appreciation' : ''}. ` +
      `Smartepenger put a 6-year-old Norwegian car at about 10%/yr. The W204's near-zero rate is the sourced exception: ` +
      `PistonHeads say the decline has "slowed dramatically" and CarBuzz measure roughly +15% over 18 months — but only for ` +
      `cars with documented head-bolt and camshaft repairs. Without that paperwork it is not an appreciating asset.`);
  } else if (isCar) {
    notes.push(
      `Depreciation is applied to the vehicle price only — taxes and fees are gone the moment you pay them. ` +
      `"Car worth" is what you would get back if you sold at the end of that year.`);
  } else {
    const e = r.asset.escalation[state.scenario] ?? r.asset.escalation.base;
    notes.push(`Rent escalates at ${(e * 100).toFixed(1)}%/yr in this scenario; other lines follow the global inflation slider.`);
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
