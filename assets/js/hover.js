/*
 * DreamPrice — shared hover / pin card.
 *
 * Show after a short dwell so glancing past a row does not flash the card.
 * Once open, park it next to the row and stop chasing the cursor, so the
 * pointer can move onto the card (and its DATA links) without the card
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

  const clearShow = () => { if (showTimer) { clearTimeout(showTimer); showTimer = 0; } };
  const clearHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; } };

  function placeNear(node) {
    const pad = 10;
    const gap = 8;
    const { innerWidth: vw, innerHeight: vh } = window;
    const nr = node.getBoundingClientRect();
    /* Measure after content is in, then park beside the row — never under the cursor. */
    card.style.left = '0px';
    card.style.top = '0px';
    const cr = card.getBoundingClientRect();
    let x = nr.right + gap;
    let y = nr.top;
    if (x + cr.width > vw - pad) x = Math.max(pad, nr.left - cr.width - gap);
    if (x < pad) x = pad;
    if (y + cr.height > vh - pad) y = Math.max(pad, vh - cr.height - pad);
    if (y < pad) y = pad;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }

  function open(node, html, { pinned = false } = {}) {
    clearShow();
    clearHide();
    activeNode = node;
    getHtml = typeof html === 'function' ? html : () => html;
    card.innerHTML = getHtml();
    card.hidden = false;
    card.classList.toggle('is-pinned', pinned || pinnedNode === node);
    placeNear(node);
  }

  function close() {
    if (pinnedNode) return;
    clearShow();
    clearHide();
    activeNode = null;
    getHtml = null;
    card.hidden = true;
    card.classList.remove('is-pinned');
  }

  function scheduleShow(node, html) {
    if (pinnedNode && pinnedNode !== node) return;
    clearHide();
    if (activeNode === node && !card.hidden) {
      /* Already showing this row — refresh content, keep place. */
      getHtml = typeof html === 'function' ? html : () => html;
      card.innerHTML = getHtml();
      return;
    }
    clearShow();
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

    node.addEventListener('mouseenter', () => scheduleShow(node, resolve()));
    node.addEventListener('mouseleave', (ev) => {
      /* If the pointer is heading onto the card, do not hide. */
      if (ev.relatedTarget && (card === ev.relatedTarget || card.contains(ev.relatedTarget))) return;
      scheduleHide();
    });
    node.addEventListener('focusin', () => scheduleShow(node, resolve()));
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
      open(node, resolve(), { pinned: true });
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
    placeNear(activeNode);
  } };
}
