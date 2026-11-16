(() => {
  'use strict';
  const profile = document.querySelector('#profile');
  const header = document.querySelector('.site-header');
  const logo = header.querySelector('.wordmark');
  const shore = document.querySelector('#coffee-shore');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 640px), (hover: none) and (pointer: coarse) and (max-width: 1024px)');
  const quietShore = shore.getAttribute('d');
  const clamp = n => Math.min(1, Math.max(0, n));

  // The edge is in profile space, not in screen space. It therefore stays
  // attached to the surface of Work on resize, anchor jumps and reverse scroll.
  let origin = 0, width = 1, height = 1, aspect = 1, frame = 0, needsMeasure = true, last = -1;
  let compactMode = false, canvas = null, context = null, points = [];
  let ink = '', paper = '', currentProgress = 0;
  const typeSelector = '#profile-title, .opening-lead, .opening-support, .identity-line strong, .identity-line time, .design-fields, .profile-tabs button, .timeline dt, .timeline dd, .skills-block h2, .skill-dots, .education-block, .skills-block';

  function measureCompact(box) {
    if (compact.matches && !canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'mobile-pour-surface';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.hidden = true;
      profile.prepend(canvas);
      context = canvas.getContext('2d', { alpha: false });
    }
    compactMode = compact.matches && !!context;
    profile.classList.toggle('mobile-pour', compactMode);
    if (!compactMode) {
      if (canvas) canvas.hidden = true;
      profile.classList.remove('mobile-pour-full');
      points = [];
      return;
    }
    const styles = getComputedStyle(profile);
    ink = styles.getPropertyValue('--espresso').trim() || '#131312';
    paper = styles.getPropertyValue('--profile-paper').trim() || '#eef5f9';
    // Allocate once per real size change, independent of Safari toolbar motion.
    // Backing store never exceeds ~3 megapixels on a tall phone/tablet profile.
    const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3000000 / (width * height)));
    const rw = Math.max(1, Math.round(width * ratio)), rh = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== rw) canvas.width = rw;
    if (canvas.height !== rh) canvas.height = rh;
    points = Array.from(profile.querySelectorAll(typeSelector), el => {
      const r = el.getBoundingClientRect();
      const rule = el.matches('.skills-block, .education-block');
      return { el, x: (r.left + r.width * .5 - box.left) / width,
        y: r.top + (rule ? 0 : r.height * .5) - box.top, h: rule ? 0 : r.height };
    });
  }

  function edgeAt(x, p) {
    // Heights are in CSS pixels. A narrow 1,400px-tall profile must not turn
    // a 35px-wide shoulder into a 350px vertical tongue.
    const a = Math.min(56, width * .116) * Math.sin(Math.PI * p);
    const u = clamp(x);
    const shelf = u * u * (3 - 2 * u);
    const folds = .27 * Math.sin(u * 7.35 + .35 + .22 * p)
                + .13 * Math.sin(u * 13.5 - 1.14) - .88 * shelf + .38;
    return height * (1 - p * (1.35 - .35 * p)) + (1 - 2 * p) * 2 + a * folds;
  }

  function paintCompact(p) {
    currentProgress = p;
    const full = p === 1, empty = p === 0;
    profile.classList.toggle('mobile-pour-full', full);
    // At both ends there is no residual antialiased edge to composite. In
    // between, repaint the *entire* opaque sheet, including all exposed paper.
    canvas.hidden = empty || full;
    if (!canvas.hidden) {
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      context.fillStyle = paper;
      context.fillRect(0, 0, width, height);
      context.beginPath();
      context.moveTo(-1, height + 1);
      context.lineTo(-1, edgeAt(0, p));
      const segments = Math.max(24, Math.ceil(width / 5));
      for (let i = 0; i <= segments; i++) context.lineTo(width * i / segments, edgeAt(i / segments, p));
      context.lineTo(width + 1, edgeAt(1, p));
      context.lineTo(width + 1, height + 1);
      context.closePath();
      context.fillStyle = ink;
      context.fill();
    }
    // Use normal foreground ink on phones, rather than compositing several
    // overlapping SVG / difference layers. A small halo only at the crossing
    // protects a line of text while the curved boundary runs through it.
    for (const item of points) {
      const gap = item.y - edgeAt(item.x, p);
      item.el.classList.toggle('mobile-coffee-ink', full || (!empty && gap >= 0));
      item.el.classList.toggle('mobile-ink-edge', !empty && !full && item.h > 0 && Math.abs(gap) < item.h * .52 + 7);
    }
  }
  function drawSpill() {
    frame = 0;
    if (needsMeasure) {
      const box = profile.getBoundingClientRect();
      origin = window.scrollY + box.top - header.getBoundingClientRect().height;
      height = Math.max(1, box.height);
      width = Math.max(1, box.width);
      aspect = width / height;
      measureCompact(box);
      needsMeasure = false;
      last = -1;
    }
    if (compactMode) {
      const progress = clamp((window.scrollY - origin) / (height * .91));
      // Reduced motion has an unanimated paper profile leading into solid Work.
      const p = motion.matches ? 0 : progress;
      if (last !== p) { last = p; paintCompact(p); }
      return;
    }
    if (motion.matches) {
      if (last !== -2) shore.setAttribute('d', quietShore);
      last = -2;
      return;
    }
    const step = Math.round(clamp((window.scrollY - origin) / (height * .91)) * 1500);
    if (step === last) return;
    last = step;
    const p = step / 1500;
    // The right side, below the mug, spills ahead. Small pools touch and
    // coalesce with the advancing liquid rather than drifting independently.
    const level = 1.001 - 1.16 * p * (1.34 - .34 * p);
    const swell = Math.pow(Math.max(0, Math.sin(Math.PI * p)), .82);
    const slide = .038 * Math.sin(Math.PI * p * 1.18) * swell;
    const n = v => Number(v.toFixed(5));
    const xy = (x, dy) => n(x + slide * Math.sin(Math.PI * clamp(x))) + ',' + n(level + dy * swell);
    let d = 'M' + xy(-.12, .109) +
      ' C' + xy(-.02,.125) + ' ' + xy(.035,.043) + ' ' + xy(.125,.062) +
      ' C' + xy(.209,.079) + ' ' + xy(.191,.16) + ' ' + xy(.29,.157) +
      ' C' + xy(.395,.154) + ' ' + xy(.403,.021) + ' ' + xy(.501,.038) +
      ' C' + xy(.567,.05) + ' ' + xy(.581,.085) + ' ' + xy(.631,.05) +
      ' C' + xy(.691,.007) + ' ' + xy(.607,-.067) + ' ' + xy(.702,-.118) +
      ' C' + xy(.766,-.147) + ' ' + xy(.777,-.143) + ' ' + xy(.793,-.21) +
      ' C' + xy(.808,-.284) + ' ' + xy(.9,-.302) + ' ' + xy(.93,-.24) +
      ' C' + xy(.975,-.15) + ' ' + xy(1.022,-.241) + ' ' + xy(1.13,-.213) +
      ' V1.23 H-.12 Z';
    const bead = (x, dy, size, stretch) => {
      const rx = n(size * swell), ry = n(rx * aspect * stretch);
      if (!rx || !ry) return '';
      return ' M' + xy(x - rx, dy) + ' a' + rx + ',' + ry + ' 0 1 0 ' + n(2 * rx) + ',0 a' + rx + ',' + ry + ' 0 1 0 ' + n(-2 * rx) + ',0Z';
    };
    if (p > .015 && p < .98) {
      // Small drops meet the main body around the middle of the pour.
      d += bead(.595, -.050 + .18 * p, .0068, .81);
      d += bead(.621, -.084 + .17 * p, .0036, 1.07);
    }
    shore.setAttribute('d', d);
  }
  function syncHeaderTone() {
    const surface = profile.getBoundingClientRect();
    const mark = logo.getBoundingClientRect();
    const x = mark.left + mark.width / 2;
    const y = mark.top + mark.height / 2;
    let dark = y >= surface.bottom;
    if (y >= surface.top && y < surface.bottom) {
      if (compactMode) {
        dark = currentProgress === 1 || (currentProgress > 0 &&
          y - surface.top >= edgeAt((x - surface.left) / width, currentProgress));
      } else if (typeof shore.isPointInFill === 'function') {
        dark = shore.isPointInFill(new DOMPoint((x - surface.left) / surface.width, (y - surface.top) / surface.height));
      }
    }
    header.classList.toggle('on-coffee', dark);
  }
  function updateScene() { drawSpill(); syncHeaderTone(); }
  function scheduleSpill() {
    if (!frame) frame = requestAnimationFrame(updateScene);
  }
  function measure() { needsMeasure = true; scheduleSpill(); }
  window.addEventListener('scroll', scheduleSpill, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  compact.addEventListener('change', measure);
  if ('ResizeObserver' in window) {
    const sizing = new ResizeObserver(measure);
    sizing.observe(profile); sizing.observe(header);
  }
  updateScene();

  const copy = document.querySelector('.opening-copy');
  let entered = true;
  try {
    if (window.frameElement?.id === 'main-preview') entered = !window.frameElement.inert;
  } catch { /* ordinary external embeds are already visible */ }
  let inView = false, started = false, finished = false, pen = null, cursor = 0, typingFrame = 0, startTime = 0;
  const lead = copy.querySelector('.opening-lead');
  const original = lead.textContent;
  const sequence = [];
  let supportTimer = 0;
  function revealSupport() {
    supportTimer = 0;
    copy.classList.remove('awaiting-support');
  }
  function finishTyping(immediate = motion.matches) {
    finished = true;
    cancelAnimationFrame(typingFrame);
    // Preserve the completed title for a short reading beat, then reveal the
    // entire support sentence at once without shifting its reserved space.
    lead.textContent = original;
    clearTimeout(supportTimer);
    if (immediate) revealSupport();
    else supportTimer = setTimeout(revealSupport, 600);
  }
  if (!motion.matches) {
    const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('ko', { granularity: 'grapheme' }) : null;
    const reader = document.createElement('span');
    reader.className = 'copy-reader'; reader.textContent = original;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    let next = 0;
    for (const token of original.split(/(\s+)/u)) {
      if (/^\s+$/u.test(token)) {
        visual.append(document.createTextNode(token));
        next += 22;
        continue;
      }
      const word = document.createElement('span');
      word.className = 'copy-word';
      const letters = segmenter ? Array.from(segmenter.segment(token), s => s.segment) : Array.from(token);
      for (const letter of letters) {
        const glyph = document.createElement('span');
        glyph.className = 'copy-glyph pending'; glyph.textContent = letter;
        word.append(glyph); sequence.push({ at: next, glyph });
        next += 54;
      }
      visual.append(word);
    }
    copy.classList.add('awaiting-support');
    lead.replaceChildren(reader, visual);
  } else {
    finished = true;
  }
  function typeTick(now) {
    if (finished) return;
    const elapsed = now - startTime;
    let current;
    while (cursor < sequence.length && sequence[cursor].at <= elapsed) {
      current = sequence[cursor++].glyph;
      current.classList.remove('pending');
    }
    if (current) {
      if (pen) pen.classList.remove('pen');
      pen = current; pen.classList.add('pen');
    }
    if (cursor === sequence.length) {
      finishTyping();
    } else {
      typingFrame = requestAnimationFrame(typeTick);
    }
  }
  function tryStart() {
    if (finished || started || !inView || !entered || document.hidden) return;
    started = true; startTime = performance.now();
    typeTick(startTime);
  }
  // The landing preloads this document in a hidden iframe. Only start the
  // typewriter once its authored video has finished AND the visitor enters.
  window.addEventListener('stcop:showroom-visible', () => { entered = true; tryStart(); }, { once: true });
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) { tryStart(); visibility.disconnect(); }
    });
    visibility.observe(copy);
  } else { inView = true; tryStart(); }
  document.addEventListener('visibilitychange', tryStart);
  motion.addEventListener('change', () => {
    if (motion.matches) finishTyping(true);
    measure();
  });
})();
