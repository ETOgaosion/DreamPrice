/*
 * DreamPrice — shared hover / pin card.
 *
 * Show after a short dwell so glancing past a row does not flash the card.
 * It opens on whichever side of the cursor has room, then freezes there so
 * the pointer can travel onto the card (and its DATA links) without the card
 * running away. Hide only after leaving both the row and the card.
 */

export function createHoverController({
  showDelay = 320,
  hideDelay = 220,
} = {}) {
  const card = document.createElement('div');
  card.className = 'hovercard';
  card.setAttribute('role', 'tooltip');
  card.hidden = true;
  document.body.append(card);

  let showTimer = 0;
  let hideTimer = 0;
  let activeNode = null;
  let pinnedNode = null;
  let getHtml = null;
  /* Where the pointer was when the card opened — the anchor it stays glued to. */
  let anchor = null;

  const clearShow = () => { if (showTimer) { clearTimeout(showTimer); showTimer = 0; } };
  const clearHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; } };

  /*
   * Place beside the cursor, on whichever side actually fits. The gap is wide
   * enough to keep the card off the pointer, but close enough that the trip
   * from row to card never crosses unrelated content.
   */
  function placeAt(point, node) {
    const pad = 10;
    const gap = 16;
    const { innerWidth: vw, innerHeight: vh } = window;

    card.style.left = '0px';
    card.style.top = '0px';
    const { width, height } = card.getBoundingClientRect();

    /* Keyboard users have no cursor, so the row's own edge stands in for one. */
    const nr = node ? node.getBoundingClientRect() : null;
    const cx = point?.x ?? (nr ? nr.right : vw / 2);
    const cy = point?.y ?? (nr ? nr.top + nr.height / 2 : vh / 2);

    const roomRight = vw - pad - (cx + gap);
    const roomLeft = (cx - gap) - pad;
    /* Right by default; flip left when the right side cannot hold the card and
       the left side can hold more of it. */
    const goLeft = width > roomRight && roomLeft > roomRight;

    let x = goLeft ? cx - gap - width : cx + gap;
    x = Math.min(Math.max(pad, x), Math.max(pad, vw - pad - width));

    /* Vertically centred on the cursor, clamped into the viewport. */
    let y = cy - height / 2;
    y = Math.min(Math.max(pad, y), Math.max(pad, vh - pad - height));

    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }

  function open(node, html, point, { pinned = false } = {}) {
    clearShow();
    clearHide();
    activeNode = node;
    if (point) anchor = point;
    getHtml = typeof html === 'function' ? html : () => html;
    card.innerHTML = getHtml();
    card.hidden = false;
    card.classList.toggle('is-pinned', pinned || pinnedNode === node);
    placeAt(anchor, node);
  }

  function close() {
    if (pinnedNode) return;
    clearShow();
    clearHide();
    activeNode = null;
    getHtml = null;
    anchor = null;
    card.hidden = true;
    card.classList.remove('is-pinned');
  }

  function scheduleShow(node, html, point) {
    if (pinnedNode && pinnedNode !== node) return;
    clearHide();
    if (activeNode === node && !card.hidden) {
      /* Already showing this row — refresh content, keep place. */
      getHtml = typeof html === 'function' ? html : () => html;
      card.innerHTML = getHtml();
      return;
    }
    clearShow();
    /* Live anchor: mousemove keeps refining it right up until the card opens. */
    anchor = point;
    showTimer = window.setTimeout(() => open(node, html), showDelay);
  }

  function scheduleHide() {
    if (pinnedNode) return;
    clearShow();
    clearHide();
    hideTimer = window.setTimeout(close, hideDelay);
  }

  /* Moving onto the card cancels a pending hide. */
  card.addEventListener('mouseenter', () => { clearHide(); });
  card.addEventListener('mouseleave', scheduleHide);

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (pinnedNode) pinnedNode.classList.remove('is-pinned');
    pinnedNode = null;
    close();
  });

  function attach(node, html) {
    const resolve = () => (typeof html === 'function' ? html : () => html);
    const pointOf = (ev) => (ev && (ev.clientX || ev.clientY)
      ? { x: ev.clientX, y: ev.clientY }
      : null);

    node.addEventListener('mouseenter', (ev) => scheduleShow(node, resolve(), pointOf(ev)));
    /* Until the dwell elapses, keep the anchor under the moving cursor. */
    node.addEventListener('mousemove', (ev) => {
      if (showTimer) anchor = pointOf(ev);
    });
    node.addEventListener('mouseleave', (ev) => {
      /* If the pointer is heading onto the card, do not hide. */
      if (ev.relatedTarget && (card === ev.relatedTarget || card.contains(ev.relatedTarget))) return;
      scheduleHide();
    });
    node.addEventListener('focusin', () => scheduleShow(node, resolve(), null));
    node.addEventListener('focusout', (ev) => {
      if (node.contains(ev.relatedTarget)) return;
      if (ev.relatedTarget && (card === ev.relatedTarget || card.contains(ev.relatedTarget))) return;
      scheduleHide();
    });
    node.addEventListener('click', (ev) => {
      if (ev.target.closest('a')) return;
      if (pinnedNode === node) {
        pinnedNode.classList.remove('is-pinned');
        pinnedNode = null;
        close();
        return;
      }
      if (pinnedNode) pinnedNode.classList.remove('is-pinned');
      pinnedNode = node;
      node.classList.add('is-pinned');
      open(node, resolve(), pointOf(ev), { pinned: true });
    });
  }

  function reset() {
    if (pinnedNode) pinnedNode.classList.remove('is-pinned');
    pinnedNode = null;
    close();
  }

  return { attach, reset, card, refresh() {
    if (!activeNode || card.hidden || !getHtml) return;
    card.innerHTML = getHtml();
    placeAt(anchor, activeNode);
  } };
}
