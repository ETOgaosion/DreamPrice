/* DreamPrice — UI */

import { ASSETS, CATEGORIES, CAVEATS, FX, SRC } from './data.js';
import {
  categoryBreakdown, convert, defaultInputs, evaluateAll,
  fmt, fmtCompact, portfolio,
} from './model.js';

/* ---------------- state ---------------- */
const state = {
  currency: 'CNY',
  scenario: 'base',
  years: 5,
  inflation: 0.02,
  includeCapital: true,
  variants: {},
  inputs: {},
  enabled: {},
};

for (const a of ASSETS) {
  state.variants[a.id] = a.defaultVariant;
  state.inputs[a.id] = defaultInputs(a);
  state.enabled[a.id] = true;
}

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

/* ---------------- headline totals ---------------- */
function renderTotals(results) {
  const cur = state.currency;
  const p = portfolio(results, cur, state.includeCapital, state.enabled);
  const n = Object.values(state.enabled).filter(Boolean).length;

  const cards = [
    { lbl: 'To get started', val: fmtCompact(p.upFront, cur), sub: `of which ${fmtCompact(p.refundable, cur)} is refundable deposit`, flag: true },
    { lbl: 'Per year', val: fmtCompact(p.perYear, cur), sub: `averaged over ${state.years} year${state.years > 1 ? 's' : ''}` },
    { lbl: 'Per month', val: fmtCompact(p.perMonth, cur), sub: 'every month, indefinitely' },
    { lbl: 'Per day', val: fmt(p.perDay, cur, { digits: 0 }), sub: 'while you sleep, too', flag: true },
    { lbl: `Total over ${state.years} yr`, val: fmtCompact(p.total + p.upFront - p.refundable, cur), sub: 'up-front plus everything after' },
  ];

  $('#totals').replaceChildren(...cards.map((c) => {
    const d = el('div', 'tot' + (c.flag ? ' flag' : ''));
    d.append(el('div', 'lbl', c.lbl), el('div', 'val', c.val), el('div', 'sub', c.sub));
    return d;
  }));

  const dropped = ASSETS.filter((a) => !state.enabled[a.id]).map((a) => a.name);
  $('#totals-note').innerHTML =
    `${n} of ${ASSETS.length} assets included` +
    (dropped.length ? `, excluding ${esc(dropped.join(', '))}` : '') +
    `. ${state.includeCapital
      ? 'Depreciation is counted as a real cost, because it is — you just do not write a cheque for it.'
      : 'Depreciation is excluded, so these are pure out-of-pocket payments.'}` +
    ` Running costs grow at ${(state.inflation * 100).toFixed(1)}%/yr; rents grow at each market's own escalation rate.`;
}

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
  cb.addEventListener('change', () => { state.enabled[asset.id] = cb.checked; render(); });
  onoff.append(cb);
  title.append(onoff);
  head.append(title, el('p', 'blurb', esc(asset.blurb)));
  c.append(head);

  /* inputs */
  const box = el('div', 'card-inputs');
  const vsel = el('label', 'ctl full');
  vsel.append(el('span', null, asset.kind === 'car' ? 'Which one' : 'Where'));
  const select = el('select');
  for (const v of asset.variants) {
    const o = el('option', null, esc(v.label));
    o.value = v.id;
    if (v.id === state.variants[asset.id]) o.selected = true;
    select.append(o);
  }
  select.addEventListener('change', () => { state.variants[asset.id] = select.value; render(); });
  vsel.append(select);
  box.append(vsel);

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
        render();
      });
      l.append(range);
    } else {
      const s = el('select');
      for (const o of inp.options) {
        const opt = el('option', null, esc(o.l));
        opt.value = o.v;
        if (o.v === state.inputs[asset.id][inp.id]) opt.selected = true;
        s.append(opt);
      }
      s.addEventListener('change', () => { state.inputs[asset.id][inp.id] = s.value; render(); });
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
  const items = [
    ['Up front', fmtCompact(r.upFront, cur), r.refundable ? `${fmtCompact(r.refundable, cur)} refundable` : ''],
    ['Per year', fmtCompact(r.perYear[key], cur), cross ? `≈ ${fmtCompact(convert(r.perYear[key], cur, disp), disp)}` : ''],
    ['Per month', fmtCompact(r.perMonth[key], cur), cross ? `≈ ${fmtCompact(convert(r.perMonth[key], cur, disp), disp)}` : ''],
    ['Per day', fmt(r.perDay[key], cur, { digits: 0 }), cross ? `≈ ${fmt(convert(r.perDay[key], cur, disp), disp, { digits: 0 })}` : ''],
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
    `Up-front — ${fmtCompact(r.upFront, cur)}`,
    r.oneTime, cur, r.upFront, 'Total at purchase / move-in', true,
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

  $('#fx-stamp').textContent =
    `1 USD = ${FX.perUsd.CNY} CNY = ${FX.perUsd.JPY} JPY = ${FX.perUsd.NOK} NOK`;
}

/* ---------------- render ---------------- */
/* Which <details> blocks the reader had open, so a re-render doesn't slam them shut. */
const openBlocks = new Set();

function render() {
  const results = evaluateAll(state);
  renderTotals(results);
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
$('#currency').addEventListener('change', (e) => { state.currency = e.target.value; render(); });
$('#scenario').addEventListener('change', (e) => { state.scenario = e.target.value; render(); });
$('#years').addEventListener('input', (e) => {
  state.years = Number(e.target.value);
  $('#years-out').textContent = `${state.years} yr`;
  render();
});
$('#inflation').addEventListener('input', (e) => {
  state.inflation = Number(e.target.value) / 100;
  $('#inflation-out').textContent = `${Number(e.target.value).toFixed(1)}%`;
  render();
});
$('#capital').addEventListener('change', (e) => { state.includeCapital = e.target.checked; render(); });

renderStatic();
render();
