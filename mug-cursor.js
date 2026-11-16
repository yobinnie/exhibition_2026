(() => {
  'use strict';
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const forced = matchMedia('(forced-colors: active)');
  const root = document.documentElement;
  const cursor = document.createElement('div');
  const spoon = new Image();
  cursor.className = 'teaspoon-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  spoon.alt = '';
  spoon.draggable = false;
  spoon.className = 'teaspoon-photo';
  cursor.append(spoon);
  document.body.append(cursor);

  const editable = 'input:not([type=button]):not([type=submit]):not([type=reset]),textarea,select,[contenteditable]:not([contenteditable=false])';
  let point = null, releaseTimer = 0, pressedAt = null, layer = document.body;
  const available = () => fine.matches && !forced.matches && spoon.complete && spoon.naturalWidth > 0 && getComputedStyle(cursor).position === 'fixed';

  function resetPress() {
    clearTimeout(releaseTimer);
    pressedAt = null;
    cursor.classList.remove('is-pressed');
  }
  function hide() {
    root.classList.remove('teaspoon-pointer-active');
    cursor.classList.remove('is-visible');
    resetPress(); point = null;
  }
  function syncTarget(target) {
    const visible = !!(point && available() && target instanceof Element && !target.closest(editable));
    root.classList.toggle('teaspoon-pointer-active', visible);
    cursor.classList.toggle('is-visible', visible);
    if (!visible) resetPress();
  }
  function syncPoint() {
    if (point) syncTarget(document.elementFromPoint(point.x, point.y));
  }
  function syncLayer() {
    // Dialog content occupies the top layer, even above a fixed site cursor.
    const dialogs = document.querySelectorAll('dialog[open]');
    const next = dialogs.length ? dialogs[dialogs.length - 1] : document.body;
    if (next !== layer) { next.append(cursor); layer = next; }
    syncPoint();
  }
  function move(event) {
    if (event.pointerType === 'touch' || !fine.matches || forced.matches) { hide(); return; }
    point = { x: event.clientX, y: event.clientY };
    // Register the tip of the bowl to the real pointer. Never ease tracking.
    cursor.style.transform = 'translate3d(' + (point.x - 3) + 'px,' + (point.y - 2) + 'px,0)';
    syncTarget(event.target);
  }
  spoon.addEventListener('load', syncPoint, { once: true });
  spoon.addEventListener('error', hide, { once: true });
  spoon.src = new URL('assets/stcop/cursor-teaspoon.png', document.currentScript.src).href;
  document.addEventListener('pointermove', move, { passive: true, capture: true });
  document.addEventListener('pointerover', move, { passive: true, capture: true });
  document.addEventListener('pointerdown', event => {
    move(event);
    if (event.button !== 0 || !cursor.classList.contains('is-visible')) return;
    clearTimeout(releaseTimer);
    pressedAt = performance.now();
    cursor.classList.add('is-pressed');
  }, { passive: true, capture: true });
  document.addEventListener('pointerup', event => {
    if (event.button !== 0 || pressedAt === null) return;
    // Let a quick tap reach its impact frame. A held click remains down.
    releaseTimer = setTimeout(resetPress, Math.max(0, 90 - (performance.now() - pressedAt)));
  }, { passive: true, capture: true });
  document.addEventListener('pointercancel', hide, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); }, { passive: true });
  document.addEventListener('keydown', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  window.addEventListener('scroll', syncPoint, { passive: true, capture: true });
  new MutationObserver(syncLayer).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  fine.addEventListener('change', hide);
  forced.addEventListener('change', hide);
})();
