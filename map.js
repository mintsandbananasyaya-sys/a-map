// Shared pan/zoom map engine. World coords (Minecraft X/Z) <-> image pixels in one place.
const MapCoords = {
  toPx(x, z) { return { px: (x - MAP_CONFIG.minX) / MAP_CONFIG.blocksPerPixel, py: (z - MAP_CONFIG.minZ) / MAP_CONFIG.blocksPerPixel }; },
  toWorld(px, py) { return { x: px * MAP_CONFIG.blocksPerPixel + MAP_CONFIG.minX, z: py * MAP_CONFIG.blocksPerPixel + MAP_CONFIG.minZ }; }
};

function createMap(el, handlers = {}) {
  const W = MAP_CONFIG.width, H = MAP_CONFIG.height;
  const world = document.createElement('div');
  world.className = 'world';
  world.style.width = W + 'px';
  world.style.height = H + 'px';
  const img = new Image();
  img.src = MAP_CONFIG.image; img.draggable = false;
  world.appendChild(img);
  el.appendChild(world);

  let s = 1, tx = 0, ty = 0, minS = 0.1;
  const MAX_S = 6;
  const pointers = new Map();
  let moved = 0, pinchDist = 0, downTarget = null;

  const rect = () => el.getBoundingClientRect();
  function apply() {
    world.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    el.style.setProperty('--inv', 1 / s);
  }
  function clampPan() {
    const r = rect(), pad = 120;
    tx = Math.min(r.width - pad, Math.max(pad - W * s, tx));
    ty = Math.min(r.height - pad, Math.max(pad - H * s, ty));
  }
  function animate(fn) {
    world.classList.add('anim');
    fn(); apply();
    setTimeout(() => world.classList.remove('anim'), 550);
  }
  function fit(animated) {
    const r = rect();
    minS = Math.min(r.width / W, r.height / H);
    const go = () => { s = minS; tx = (r.width - W * s) / 2; ty = (r.height - H * s) / 2; };
    animated ? animate(go) : (go(), apply());
  }
  function zoomAt(cx, cy, f) {
    const ns = Math.min(MAX_S, Math.max(minS, s * f));
    tx = cx - (cx - tx) * ns / s;
    ty = cy - (cy - ty) * ns / s;
    s = ns; clampPan(); apply();
  }
  function screenToPx(cx, cy) {
    const r = rect();
    return { px: (cx - r.left - tx) / s, py: (cy - r.top - ty) / s };
  }
  function flyTo(x, z, zoom, offset = {}) {
    const { px, py } = MapCoords.toPx(x, z);
    const r = rect();
    const cx = r.width / 2 + (offset.x || 0), cy = r.height / 2 + (offset.y || 0);
    animate(() => {
      s = Math.min(MAX_S, Math.max(minS, zoom || Math.max(s, 1.5)));
      tx = cx - px * s; ty = cy - py * s;
    });
  }

  el.addEventListener('wheel', e => {
    e.preventDefault();
    const r = rect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  el.addEventListener('pointerdown', e => {
    if (e.target.closest('.ui')) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downTarget = e.target;
    if (pointers.size === 1) moved = 0;
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinchDist = Math.hypot(a.x - b.x, a.y - b.y); moved = 99; }
    el.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 1) {
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 5) { tx += dx; ty += dy; clampPan(); apply(); }
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = rect();
      if (pinchDist) zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, d / pinchDist);
      pinchDist = d;
    }
  });
  function up(e) {
    if (!pointers.has(e.pointerId)) return;
    const wasClick = pointers.size === 1 && moved <= 5 && e.type === 'pointerup';
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (!pointers.size) el.classList.remove('grabbing');
    if (wasClick) {
      const m = downTarget && downTarget.closest && downTarget.closest('.marker');
      if (m && handlers.onMarker) handlers.onMarker(m.dataset.index, e);
      else if (handlers.onClick) {
        const { px, py } = screenToPx(e.clientX, e.clientY);
        if (px >= 0 && py >= 0 && px <= W && py <= H) handlers.onClick({ px, py, ...MapCoords.toWorld(px, py) }, e);
      }
    }
  }
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  el.addEventListener('mousemove', e => {
    if (!handlers.onMove) return;
    const { px, py } = screenToPx(e.clientX, e.clientY);
    handlers.onMove(px >= 0 && py >= 0 && px <= W && py <= H ? { px, py, ...MapCoords.toWorld(px, py) } : null);
  });
  el.addEventListener('mouseleave', () => handlers.onMove && handlers.onMove(null));
  window.addEventListener('resize', () => { const old = minS; fit(false); });
  fit(false);

  function addMarker(x, z, color, label, index, cls = '') {
    const { px, py } = MapCoords.toPx(x, z);
    const m = document.createElement('div');
    m.className = 'marker ' + cls;
    m.style.left = px + 'px'; m.style.top = py + 'px';
    if (index !== undefined) m.dataset.index = index;
    m.innerHTML = `<div class="dot" style="--c:${color}"><span class="tip"></span></div>`;
    m.querySelector('.tip').textContent = label || '';
    world.appendChild(m);
    return m;
  }

  return {
    world, fit, zoomAt, flyTo, addMarker, screenToPx,
    zoomBy: f => { const r = rect(); zoomAt(r.width / 2, r.height / 2, f); },
    get scale() { return s; }
  };
}
