/* DreamPrice — detail page: every asset, every line item, every source. */

import { ASSETS, CATEGORIES, CAVEATS, SRC } from './data.js';
import {
  categoryBreakdown, convert, evaluateAll, fmt, fmtCompact, PERIODS, scenarioBands,
} from './model.js';
import { bindGlobalControls, loadState, saveState } from './state.js';
import { createHoverController } from './hover.js';

/* Shared with the overview page through localStorage. */
const state = loadState();
const hover = createHoverController({ showDelay: 320, hideDelay: 220 });

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

/* ---------------- hover / pin card ----------------
 * Dwell before show; park beside the row; move onto the card without it
 * chasing the cursor.
 */
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
      `<em>Open the DATA link on the row →</em></div>`);
  }
  return rows.join('');
}

function attachHover(node, item, band, currency) {
  hover.attach(node, () =>
    `<div class="hc-title">${esc(item.label)}</div>` + buildEvidence(item, band, currency));
}

/* Persist and redraw. Every per-asset control routes through here so the
   overview page sees the change on the next navigation. */
const commit = () => { saveState(state); render(); };

/* ---------------- chart ---------------- */
function renderChart(results) {
  const cur = state.currency;
  const rows = ASSETS.map((a) => {
    const r = results[a.id];
    const cats = categoryBreakdown(r, cur);
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
  const c = el('article', 'card' + (state.enabled[asset.id] ? '' : ' disabled'));
  c.id = asset.id;
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
      const dialled = Number(state.inputs[asset.id][inp.id]);
      let shown = `${dialled.toLocaleString()} ${inp.unit || ''}`.trim();
      if (inp.id === 'km' && asset.kind === 'car' && !asset.daily && state.driveMode === 'weekend') {
        const nCars = ASSETS.filter((a) => a.kind === 'car' && !a.daily && state.enabled[a.id]).length;
        const eff = Math.max(600, Math.round((state.weekendPool || 5200) / Math.max(1, nCars)));
        shown = `${eff.toLocaleString()} km/yr effective`;
      }
      b.textContent = shown;
      cap.append(b);
      const range = el('input');
      Object.assign(range, { type: 'range', min: inp.min, max: inp.max, step: inp.step, value: state.inputs[asset.id][inp.id] });
      if (inp.id === 'km' && !asset.daily && state.driveMode === 'weekend') range.disabled = true;
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
    if (inp.id === 'km' && asset.kind === 'car' && !asset.daily && state.driveMode === 'weekend') {
      const nCars = ASSETS.filter((a) => a.kind === 'car' && !a.daily && state.enabled[a.id]).length;
      const pool = state.weekendPool || 5200;
      const eff = Math.max(600, Math.round(pool / Math.max(1, nCars)));
      box.append(el('p', 'hint',
        `Weekend · one car at a time: costing ${eff.toLocaleString()} km/yr ` +
        `(${pool.toLocaleString()} km pool ÷ ${nCars} cars). ` +
        'Fuel / charge / tyres follow this; 车船税 and insurance still bill the full year. ' +
        'Switch Driving to “as dialled” to use the slider.'));
    } else if (inp.hint) {
      box.append(el('p', 'hint', esc(inp.hint)));
    }
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
      show(r[p.id]),
      cross ? `≈ ${fmt(convert(r[p.id], cur, disp), disp, { digits: 0 })}` : '',
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
  const assetKey = asset.id;
  c.append(lineBlock(
    asset.owned
      ? `Already paid 已付 — ${fmtCompact(r.upFront, cur)}`
      : `Up-front — ${fmtCompact(r.upFront, cur)}`,
    r.oneTime, cur, r.upFront,
    asset.owned ? 'Total 落地价 paid' : 'Total at purchase / move-in',
    true, bands.oneTime, `${assetKey}:oneTime`,
  ));
  c.append(lineBlock(
    `Every year — ${fmtCompact(r.annualRunning, cur)}`,
    r.annual, cur, r.annualRunning, 'Cost to keep it, per year', false, bands.annual,
    `${assetKey}:annual`,
  ));
  c.append(yearBlock(r, cur, `${assetKey}:years`));

  return c;
}

function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); }
  catch { return url.replace(/^https?:\/\//, '').split('/')[0]; }
}

function lineBlock(summary, items, cur, total, totalLabel, isUpFront, bands, blockKey) {
  const d = el('details', 'block');
  /* Cost lines stay open on first visit so DATA links and evidence are visible. */
  d.open = !openBlocks.has(`closed:${blockKey}`);
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

    /* A real, labelled link on every line — host visible, not a grey afterthought. */
    if (item.src) {
      const a = el('a', 'li-link');
      a.href = item.src.u;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = `${item.src.t}\n${item.src.u}`;
      a.setAttribute('aria-label', `Open source: ${item.src.t}`);
      a.innerHTML = `<span>DATA</span><small>${esc(hostOf(item.src.u))}</small>`;
      top.append(a);
    }

    const amt = el('div', 'li-amt' + (item.amount === 0 || item.informational ? ' zero' : ''),
      item.informational ? '—' : fmt(item.amount, cur, { digits: 0 }));
    top.append(amt);
    li.append(top);
    if (item.note) li.append(el('p', 'li-note', esc(item.note)));

    /* Real data sits on the row itself — hover/click still opens the full card. */
    if (item.formula) {
      li.append(el('div', 'li-formula', esc(item.formula)));
    }
    if (item.facts?.length) {
      const table = el('table', 'li-facts');
      table.innerHTML = item.facts.map(([k, v]) =>
        `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');
      li.append(table);
    }
    if (item.src) {
      const src = el('div', 'li-src');
      const a = el('a', null, esc(item.src.t));
      a.href = item.src.u;
      a.target = '_blank';
      a.rel = 'noopener';
      src.append(a);
      li.append(src);
    }

    /* Hover or click the row to see the full evidence card. */
    li.tabIndex = 0;
    li.title = 'Hover or click for the full evidence card';
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

function yearBlock(r, cur, blockKey) {
  const d = el('details', 'block');
  const isCar = r.asset.kind === 'car';
  d.open = openBlocks.has(blockKey);
  d.append(el('summary', null, `Year by year over ${r.schedule.length} year${r.schedule.length > 1 ? 's' : ''}`));
  const body = el('div', 'body');
  const table = el('table', 'yrs');
  table.innerHTML =
    `<thead><tr><th>Year</th><th>Cost to keep</th><th>Spent so far</th>` +
    (isCar ? `<th class="dim">Worth if sold</th>` : '') +
    `</tr></thead>`;
  const tb = el('tbody');
  for (const row of r.schedule) {
    const tr = el('tr');
    tr.innerHTML =
      `<td>${row.year}</td>` +
      `<td>${fmt(row.running, cur, { digits: 0 })}</td>` +
      `<td>${fmt(row.cumulative, cur, { digits: 0 })}</td>` +
      (isCar ? `<td class="dim">${fmtCompact(row.residual, cur)}</td>` : '');
    tb.append(tr);
  }
  table.append(tb);
  const tf = el('tfoot');
  tf.innerHTML =
    `<tr><td>Total</td><td>${fmt(r.totalRunning, cur, { digits: 0 })}</td>` +
    `<td>${fmt(r.totalRunning, cur, { digits: 0 })}</td>` +
    (isCar ? `<td class="dim">${fmtCompact(r.finalResidual, cur)}</td>` : '') +
    `</tr>`;
  table.append(tf);
  body.append(table);

  /* Resale value rides alongside as context. It is never a cost column. */
  const notes = [];
  if (isCar) {
    notes.push('"Worth if sold" is context, not a cost \u2014 you paid for the car once, up front.');
    const rate = r.variant.appr
      ? (r.variant.appr[state.scenario] ?? r.variant.appr.base)
      : r.variant.dep
        ? -(r.variant.dep[state.scenario] ?? r.variant.dep.base)
        : null;
    if (rate !== null) {
      notes.push(`Resale tracked at ${rate >= 0 ? '+' : ''}${(rate * 100).toFixed(0)}% a year in this scenario.`);
    }
  } else {
    const e = r.asset.escalation[state.scenario] ?? r.asset.escalation.base;
    notes.push(`Rent rises ${(e * 100).toFixed(1)}% a year here; other lines follow the inflation slider.`);
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
/* Which <details> blocks the reader forced open/closed across re-renders. */
const openBlocks = new Set();

function render() {
  hover.reset();
  const results = evaluateAll(state);
  renderChart(results);
  renderAssets(results);

  document.querySelectorAll('.card').forEach((card) => {
    const assetId = ASSETS[[...document.querySelectorAll('.card')].indexOf(card)]?.id;
    card.querySelectorAll('details.block').forEach((d, di) => {
      const kind = di === 0 ? 'oneTime' : di === 1 ? 'annual' : 'years';
      const key = `${assetId}:${kind}`;
      d.addEventListener('toggle', () => {
        if (kind === 'years') {
          if (d.open) openBlocks.add(key); else openBlocks.delete(key);
        } else {
          /* Cost blocks default open; remember only when the reader closes them. */
          if (d.open) openBlocks.delete(`closed:${key}`);
          else openBlocks.add(`closed:${key}`);
        }
      });
    });
  });
}

/* ---------------- wiring ---------------- */
bindGlobalControls(state, render);

renderStatic();
render();
