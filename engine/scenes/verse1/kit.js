// Shared kit for verse1 + pre1 (HIS pitch deck, look B). Owned by verse1/pre1 only.
// Everything is authored in "units": 1080p canvas px (landscape 1920x1080, portrait 1080x1920). Each frame starts with
// c.setTransform(S,0,0,S,0,0) so drawing code never multiplies by E.SCALE.
import * as THREE from "three";
import * as B from "../../brand.js";

export const C = B.C;
export { B };
const F = B.FONT;

let K = null,
  KP = null;
// one shared set of surfaces/assets for both scenes (only one of them renders per frame)
export function kit(E) {
  if (!KP) KP = build(E);
  return KP;
}
async function build(E) {
  K = {};
  K.gA = E.makeG2D(E.W, E.H); // BACK pass
  K.gB = E.makeG2D(E.W, E.H); // FRONT pass
  K.props = {};
  await Promise.all(
    ["macmini", "macmini_leash", "can", "tin"].map(async (n) => {
      const b = await (await fetch(`/assets/verse1/${n}.png`)).blob();
      K.props[n] = await createImageBitmap(b);
    }),
  );
  // ortho scene for shaped plates (circle headshots), screen px, y down
  K.cam = new THREE.OrthographicCamera(0, E.W, 0, E.H, -10, 10);
  K.scene = new THREE.Scene();
  K.meshes = {};
  K.glyphs = new Map();
  K.cache = new Map();
  return K;
}
export const units = (E) => ({ W0: E.W / E.SCALE, H0: E.H / E.SCALE, P: E.ORIENT === "portrait", R: safeU(E) });
export function safeU(E) {
  const S = E.SCALE, R = E.SAFE;
  return { x: R.x / S, y: R.y / S, w: R.w / S, h: R.h / S };
}

// ----------------------------------------------------------------------------------------------------- math helpers
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const oc = (x) => 1 - Math.pow(1 - clamp(x), 3); // outCubic
export const io = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const oq = (x) => 1 - Math.pow(1 - clamp(x), 4);
export const oexpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
// arrival that LANDS on s: 0 before s-d, 1 at s (outCubic), then a small decaying overshoot (for scale)
export const land = (t, s, d = 0.066) => oc((t - (s - d)) / d);
export function settle(t, s, amp = 0.06, f = 9, k = 7) {
  const dt = t - s;
  if (dt <= 0) return 0;
  return amp * Math.exp(-dt * k) * Math.sin(dt * f * 6.283);
}
// slam scale: from `from` down/up to 1 at s, then a small spring settle
export const slam = (t, s, from = 1.35, d = 0.066) => (t < s - d ? from : lerp(from, 1, land(t, s, d)) + settle(t, s, 0.05 * Math.sign(from - 1 || 1), 7, 9));
export const vis = (t, s, d = 0.066) => t >= s - d;
// word lookup (by section + text), returns the E.words entry (first match after `after`)
export function W(E, section, text, after = 0) {
  const t = text.toLowerCase();
  return E.words.find((w) => w.section === section && w.s >= after && w.w.toLowerCase().replace(/[^a-z0-9'-]/g, "") === t);
}

// ----------------------------------------------------------------------------------------------------- type
// (E.drawText sets globalAlpha absolutely; these multiply by the context's current alpha so group fades work)
export function T(E, c, str, x, y, o = {}) {
  E.drawText(c, str, x, y, { font: F.hero, weight: 900, size: 100, color: C.ink, align: "left", tracking: -0.03, ...o, alpha: (o.alpha ?? 1) * c.globalAlpha });
}
export function M(E, c, str, x, y, o = {}) {
  E.drawText(c, str, x, y, { font: F.mono, weight: 600, size: 26, color: C.inkA(0.6), align: "left", tracking: 0.12, ...o, alpha: (o.alpha ?? 1) * c.globalAlpha });
}
export function measure(E, c, str, o = {}) {
  const key = str + "|" + (o.font ?? F.hero) + "|" + (o.weight ?? 900) + "|" + (o.size ?? 100) + "|" + (o.tracking ?? -0.03) + "|" + (o.italic ? 1 : 0);
  let w = K.cache.get(key);
  if (w === undefined) {
    w = E.measure(c, str, { font: F.hero, weight: 900, size: 100, tracking: -0.03, ...o });
    K.cache.set(key, w);
  }
  return w;
}
export function fit(E, c, str, o, maxW) {
  const w = measure(E, c, str, o);
  return w > maxW ? (o.size ?? 100) * (maxW / w) : o.size ?? 100;
}
// green highlight bar (marker): sweeps left->right, p 0..1
export function hl(c, x, y, w, h, p, col = C.green) {
  if (p <= 0) return;
  c.fillStyle = col;
  c.fillRect(x, y, w * clamp(p), h);
}
// eyebrow: small green square + mono label, with a hairline rule
export function eyebrow(E, c, str, x, y, o = {}) {
  const a = o.alpha ?? 1;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = o.sq ?? C.green;
  // the green square ticks on every beat (a small designed event on each beat of every slide)
  const k = 1 + 0.45 * E.pulse("beats", E.t, 0.1);
  c.fillRect(x + 9 - 9 * k, y - 9 * k, 18 * k, 18 * k);
  M(E, c, str, x + 34, y + 1, { size: o.size ?? 26, color: o.color ?? C.inkA(0.62), weight: 700 });
  c.restore();
}
// portrait: a dark stage band across the platform-UI zone (built-in scrim for the app's own white UI text) that carries the
// deck footer. Drawn in screen units after the slide (BACK pass); bodies run down in front of it.
export const BAND_Y = 1300;
export function stageBand(E, c, U, num, o = {}) {
  if (!U.P) return;
  c.save();
  c.globalAlpha *= o.alpha ?? 1;
  c.fillStyle = C.ink;
  c.fillRect(0, BAND_Y, U.W0, U.H0 - BAND_Y);
  c.fillStyle = o.accent ?? C.green;
  c.fillRect(0, BAND_Y, U.W0 * clamp(o.progress ?? 0), 4);
  const x = U.R.x + U.R.w - 10, y = BAND_Y + 64;
  if (num) {
    M(E, c, "/12", x, y, { align: "right", size: 26, color: C.whiteA(0.45), tracking: 0.06 });
    M(E, c, num, x - 58, y, { align: "right", size: 26, color: C.white, tracking: 0.06, weight: 700 });
  }
  T(E, c, "building.", U.R.x + 10, y + 1, { size: 30, weight: 800, tracking: -0.02, color: C.white });
  c.restore();
}
// slide footer: tiny "building." wordmark + slide number (landscape; portrait uses stageBand)
export function footer(E, c, U, num, o = {}) {
  const { W0, H0, P, R } = U;
  if (P) return;
  const x = P ? R.x + R.w - 24 : W0 - 96, y = P ? R.y + R.h - 34 : H0 - 66;
  c.save();
  c.globalAlpha = o.alpha ?? 1;
  const ink = o.ink ?? C.ink;
  M(E, c, "/12", x, y, { align: "right", size: 26, color: o.dim ?? C.inkA(0.38), tracking: 0.06 });
  M(E, c, num, x - 58, y, { align: "right", size: 26, color: ink, tracking: 0.06, weight: 700 });
  T(E, c, "building.", x - 150, y + 1, { align: "right", size: 30, weight: 800, tracking: -0.02, color: ink });
  c.restore();
}

// ----------------------------------------------------------------------------------------------------- pixel digits
// After Tokens pixel type, rasterised per glyph on a FIXED cell box (shared baseline) so numbers can be composed and
// odometer-rolled digit by digit. rows = cap height in cells. Returns cached {cells:Int16Array, cols, rows, adv}.
function glyph(ch, rows) {
  const key = ch + "|" + rows;
  let g = K.glyphs.get(key);
  if (g) return g;
  const fs = rows * 1.36, cv = document.createElement("canvas"), x = cv.getContext("2d");
  const w = Math.ceil(fs * 1.1) + 4, h = Math.ceil(fs * 1.3);
  cv.width = w;
  cv.height = h;
  x.font = `${fs}px "${F.black}"`;
  x.fillStyle = "#fff";
  x.textBaseline = "alphabetic";
  const base = Math.round(fs * 0.98);
  x.fillText(ch, 2, base);
  const adv = Math.ceil(x.measureText(ch).width);
  const d = x.getImageData(0, 0, w, h).data, on = [];
  const top = base - rows; // cap-top row
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (d[(yy * w + xx) * 4 + 3] > 110) on.push(xx - 2, yy - top);
  g = { cells: new Int16Array(on), adv: Math.max(1, adv), rows };
  K.glyphs.set(key, g);
  return g;
}
// draw a pixel string at (x, y) = top-left of cap height. o: {rows, cell, color, line, tab (fixed digit advance), roll}
// roll: optional numeric value -> odometer rolling (digits only, string must be the formatted value)
export function pix(c, str, x, y, o = {}) {
  const rows = o.rows ?? 12, cell = o.cell ?? 10, gap = Math.max(1, Math.round(cell / 6)), col = o.color ?? C.green, ln = o.line ?? C.cell;
  const tab = o.tab ?? glyph("0", rows).adv + 1;
  let xx = x;
  const items = [];
  for (const ch of str) {
    const g = glyph(ch, rows), digit = ch >= "0" && ch <= "9";
    const adv = digit ? tab : g.adv + 1;
    items.push([g, xx + (digit ? Math.floor((tab - g.adv) / 2) * cell : 0), ch]);
    xx += adv * cell;
  }
  const W = xx - x;
  if (o.measure) return W;
  c.save();
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  for (let pass = 0; pass < 2; pass++) {
    c.fillStyle = pass ? col : ln;
    for (const [g, gx, ch] of items) {
      const cl = g.cells, jx = o.jit ? o.jit(gx, 0) : 0, jy = o.jit ? o.jit(gx, 1) : 0;
      for (let i = 0; i < cl.length; i += 2) {
        const px = gx + cl[i] * cell + jx, py = y + cl[i + 1] * cell + jy;
        if (pass) c.fillRect(px, py, cell - gap, cell - gap);
        else c.fillRect(px - gap * 0.5, py - gap * 0.5, cell, cell);
      }
    }
  }
  c.restore();
  return W;
}
export const pixW = (str, o = {}) => pix(null, str, 0, 0, { ...o, measure: true });
// Rolling pixel counter for a monotonic value(t) (e.g. B.tokensAt): shows round(value(t)) with thousands commas; every digit
// that changed within the last `tau` seconds slides (snapped to whole cells) from its previous digit, so a fast roll smears
// through the low digits and the big digits visibly tick over, while a value at rest is always crisp.
const _dig = (n, i) => Math.floor(n / Math.pow(10, i)) % 10;
export function odo(c, val, t, x, y, o = {}) {
  const rows = o.rows ?? 12, cell = o.cell ?? 10, gap = Math.max(1, Math.round(cell / 6)), col = o.color ?? C.green, ln = o.line ?? C.cell;
  const tab = glyph("0", rows).adv + 1, comma = glyph(",", rows), tau = o.tau ?? 0.09;
  const V = (tt) => Math.max(0, Math.round(typeof val === "function" ? val(tt) : val));
  const v1 = V(t);
  const n = Math.max(o.minDigits ?? 1, String(v1).length);
  // layout
  let Wtot = 0;
  for (let i = n - 1; i >= 0; i--) { Wtot += tab * cell; if (i > 0 && i % 3 === 0) Wtot += (comma.adv + 1) * cell; }
  if (o.measure) return Wtot;
  const ax = o.align === "center" ? x - Wtot / 2 : o.align === "right" ? x - Wtot : x;
  const live = typeof val === "function";
  const v0 = live ? V(t - tau) : v1, down = v1 <= v0;
  const boxH = rows + 4;
  c.save();
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  for (let pass = 0; pass < 2; pass++) {
    c.fillStyle = pass ? col : ln;
    let xx = ax;
    for (let i = n - 1; i >= 0; i--) {
      const d1 = _dig(v1, i);
      let sh = 0, dPrev = d1;
      // a digit that changes faster than ~14x/s just shows crisp (a spinning counter); only slow digits slide
      const rate = Math.abs(v1 - v0) / tau / Math.pow(10, i);
      if (live && rate < 14 && _dig(v0, i) !== d1) {
        // find when this digit last became d1
        let lo = t - tau, hi = t;
        for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (_dig(V(m), i) === d1) hi = m; else lo = m; }
        dPrev = _dig(V(lo), i);
        const p = oc((t - hi) / tau);
        sh = Math.floor((1 - p) * boxH);
      }
      const g1 = glyph(String(d1), rows), ox1 = Math.floor((tab - g1.adv) / 2) * cell;
      const jx = o.jit ? o.jit(xx, 0) : 0, jy = o.jit ? o.jit(xx, 1) : 0;
      if (sh > 0 && dPrev !== d1) {
        const g0 = glyph(String(dPrev), rows), ox0 = Math.floor((tab - g0.adv) / 2) * cell;
        // falling value: new digit drops in from above, old one exits below (and the reverse when rising)
        const s = down ? 1 : -1;
        drawCells(c, g1.cells, xx + ox1 + jx, y + jy, cell, gap, pass, -s * sh, 0, rows);
        drawCells(c, g0.cells, xx + ox0 + jx, y + jy, cell, gap, pass, s * (boxH - sh), 0, rows);
      } else drawCells(c, g1.cells, xx + ox1 + jx, y + jy, cell, gap, pass, 0, 0, rows + 1);
      xx += tab * cell;
      if (i > 0 && i % 3 === 0) { drawCells(c, comma.cells, xx, y, cell, gap, pass, 0, -99, 99); xx += (comma.adv + 1) * cell; }
    }
  }
  c.restore();
  return Wtot;
}
function drawCells(c, cl, x, y, cell, gap, pass, dy, lo, hi) {
  for (let i = 0; i < cl.length; i += 2) {
    const cy = cl[i + 1] + dy;
    if (cy < lo || cy >= hi) continue;
    const px = x + cl[i] * cell, py = y + cy * cell;
    if (pass) c.fillRect(px, py, cell - gap, cell - gap);
    else c.fillRect(px - gap * 0.5, py - gap * 0.5, cell, cell);
  }
}
export const odoW = (v, o = {}) => odo(null, v, 0, 0, 0, { ...o, measure: true });

// ----------------------------------------------------------------------------------------------------- footage
// A "frame" F = where the FULL clip would sit on screen, in units {x, y, w, h} (h = w * 9/16). Draw its keyed cut-out,
// optionally clipped to a screen rect Q (units). Never draws the raw plate (matte always on).
export function frameAt(cx, cy, w) {
  const h = w * 9 / 16;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
export function plate(E, v, Fr, o = {}) {
  if (!v) return;
  const S = E.SCALE;
  let x0 = Fr.x, y0 = Fr.y, x1 = Fr.x + Fr.w, y1 = Fr.y + Fr.h;
  const Q = o.clip;
  if (Q) { x0 = Math.max(x0, Q.x); y0 = Math.max(y0, Q.y); x1 = Math.min(x1, Q.x + Q.w); y1 = Math.min(y1, Q.y + Q.h); }
  if (x1 - x0 < 1 || y1 - y0 < 1) return;
  let u0 = (x0 - Fr.x) / Fr.w, uw = (x1 - x0) / Fr.w;
  const v0 = (y0 - Fr.y) / Fr.h, vh = (y1 - y0) / Fr.h;
  if (o.mirror) u0 = 1 - u0 - uw;
  const va = (v.meta.w * uw) / (v.meta.h * vh), sa = E.W / E.H;
  const baseW = va > sa ? E.W : E.H * va;
  const rw = (x1 - x0) * S;
  E.drawPlate(E, v, {
    fit: "contain", crop: [u0, v0, uw, vh], zoom: rw / baseW,
    x: ((x0 + x1) / 2) - E.W / S / 2, y: ((y0 + y1) / 2) - E.H / S / 2,
    matte: true, mirror: !!o.mirror, opacity: o.opacity ?? 1, feather: o.feather ?? 0.12,
  });
}
// clip-UV point -> units, for a frame
export function fpt(Fr, p, mirror = false) {
  return [Fr.x + (mirror ? 1 - p[0] : p[0]) * Fr.w, Fr.y + p[1] * Fr.h];
}
// smoothed pose landmark (+-2 frames), clip UV, or null
export function pose(v, lt, idx, minVis = 0.4) {
  if (!v || !v.track) return null;
  let x = 0, y = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const tr = v.trackAt(clamp(lt + k / v.meta.fps, 0, v.meta.dur - 0.01));
    const p = tr?.pose?.[idx];
    if (p && p[2] > minVis) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
export function box(v, lt) {
  if (!v || !v.track) return null;
  return v.trackAt(clamp(lt, 0, v.meta.dur - 0.01))?.box ?? null;
}
// keep a clip-local time inside the clip (never a held last frame)
export const inClip = (v, lt) => clamp(lt, 0, (v?.meta?.dur ?? 6) - 1 / 24 - 0.001);

// Shaped plate: the keyed cut-out masked into a circle whose top opens up so the head pops out of it
// ("pop-out headshot"). (cx, cy, r) in units; uvC = clip-UV center of the circle, ruv = circle radius in clip-UV *height*.
// popUp = how far (in radii) the opening extends above the circle center; popW = half-width of the opening (radii).
export function headshot(E, v, key, cx, cy, r, uvC, ruv, o = {}) {
  if (!v) return;
  const popUp = o.popUp ?? 1.65, popW = o.popW ?? 0.62;
  let m = K.meshes[key];
  if (!m) {
    const sh = new THREE.Shape();
    // lower semicircle (y up), then straight up the sides of the opening, rounded top
    sh.moveTo(-1, 0);
    sh.absarc(0, 0, 1, Math.PI, 2 * Math.PI, false);
    sh.lineTo(1, 0);
    // upper circle part until the opening
    const a0 = Math.acos(popW);
    sh.absarc(0, 0, 1, 0, a0, false);
    sh.lineTo(popW, popUp - popW);
    sh.absarc(0, popUp - popW, popW, 0, Math.PI, false);
    sh.lineTo(-popW, Math.sin(a0));
    sh.absarc(0, 0, 1, Math.PI - a0, Math.PI, false);
    const geo = new THREE.ShapeGeometry(sh, 48);
    // uv from position over the box x[-1,1] y[-1,popUp]
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + 1) / 2, (pos.getY(i) + 1) / (popUp + 1));
    uv.needsUpdate = true;
    m = new THREE.Mesh(geo, E.plateMaterialFor(v, { matte: true }));
    m.userData.popUp = popUp;
    K.meshes[key] = m;
  }
  const S = E.SCALE, U = m.material.uniforms, pu = m.userData.popUp;
  U.tVideo.value = v.tex;
  U.tMatte.value = v.mtex;
  U.uMirror.value = o.mirror ? 1 : 0;
  // crop: box x[-1,1] -> width 2*ruv (in clip-height units) -> clip-UV width = 2*ruv*h/w
  const asp = v.meta.h / v.meta.w, uw = 2 * ruv * asp, vh = ruv * (pu + 1);
  const u0 = uvC[0] - ruv * asp, vTop = uvC[1] - ruv * pu;
  U.uCrop.value.set(u0, 1 - vTop - vh, uw, vh);
  m.position.set(cx * S, cy * S, 0);
  m.scale.set(r * S, -r * S, 1);
  m.updateMatrixWorld();
  K.cam.right = E.W;
  K.cam.bottom = E.H;
  K.cam.updateProjectionMatrix();
  K.scene.children.length = 0;
  K.scene.add(m);
  E.renderer.render(K.scene, K.cam);
}

// ----------------------------------------------------------------------------------------------------- founder bubble
// Loom-style webcam bubble: disc (BACK) + pop-out headshot (PLATE, kit.headshot) + ring/active-speaker/name (FRONT).
// The ring skips the top opening so it never crosses the head that pops out of it.
export function bubbleBack(c, cx, cy, r, o = {}) {
  c.save();
  c.globalAlpha *= o.alpha ?? 1;
  c.fillStyle = o.fill ?? C.pale;
  c.beginPath();
  c.arc(cx, cy, r, 0, 6.283);
  c.fill();
  c.restore();
}
export function bubbleFront(E, c, cx, cy, r, o = {}) {
  const popW = o.popW ?? 0.62, gapA = Math.asin(Math.min(0.99, popW)), a0 = -Math.PI / 2 + gapA, a1 = (3 * Math.PI) / 2 - gapA;
  const lvl = clamp(o.level ?? 0), col = o.ring ?? C.green;
  c.save();
  c.globalAlpha *= o.alpha ?? 1;
  c.lineCap = "round";
  // active speaker: a second ring that lights with the voice
  if (lvl > 0.02) {
    c.globalAlpha *= 1;
    c.strokeStyle = col;
    c.lineWidth = (o.lw ?? 8) * 0.8;
    c.globalAlpha = (o.alpha ?? 1) * lvl;
    c.beginPath();
    c.arc(cx, cy, r + (o.lw ?? 8) * 2.2, a0 + 0.06, a1 - 0.06);
    c.stroke();
    c.globalAlpha = o.alpha ?? 1;
  }
  c.strokeStyle = o.ink ?? C.ink;
  c.lineWidth = o.lw ?? 8;
  c.beginPath();
  c.arc(cx, cy, r, a0, a1);
  c.stroke();
  if (o.name) {
    const size = o.nameSize ?? 26, w = measure(E, c, o.name, { font: F.mono, weight: 700, size, tracking: 0.04 }) + size * 1.9 + (o.dot ? size : 0);
    const h = size * 1.7, x = cx - w / 2, y = cy + r - h * 0.5;
    c.fillStyle = C.ink;
    rrect(c, x, y, w, h, h / 2);
    c.fill();
    let tx = x + size * 0.95;
    if (o.dot) {
      c.fillStyle = col;
      c.globalAlpha = (o.alpha ?? 1) * (0.5 + 0.5 * lvl);
      c.beginPath();
      c.arc(tx + size * 0.25, y + h / 2, size * 0.26, 0, 6.283);
      c.fill();
      c.globalAlpha = o.alpha ?? 1;
      tx += size;
    }
    E.drawText(c, o.name, tx, y + h / 2 + 1, { font: F.mono, weight: 700, size, tracking: 0.04, color: "#FFFFFF", align: "left", alpha: c.globalAlpha });
  }
  c.restore();
}
// voice level 0..1 for the active-speaker ring, from the vocal envelope gated by the speaker's words
export function voice(E, t, who = "HIM") {
  const w = E.wordAt(t + 0.02);
  if (!w || B.speakerOf(w) !== who || t > w.e + 0.12) return 0;
  return clamp((E.envAvg("vocal", t, 0.08) - 0.12) * 1.6);
}

// ----------------------------------------------------------------------------------------------------- props
// draw a keyed prop (from HIM's sheet) centered at (x, y) with height h, rotation rot
export function prop(c, name, x, y, h, o = {}) {
  const im = K.props[name];
  if (!im) return;
  const w = (h * im.width) / im.height;
  c.save();
  c.translate(x, y);
  if (o.rot) c.rotate(o.rot);
  if (o.sx || o.sy) c.scale(o.sx ?? 1, o.sy ?? 1);
  c.globalAlpha *= o.alpha ?? 1;
  c.drawImage(im, -w / 2, -h / 2, w, h);
  c.restore();
  return w;
}
export const propW = (name, h) => { const im = K.props[name]; return im ? (h * im.width) / im.height : h; };

// ----------------------------------------------------------------------------------------------------- frost
// icicles hanging from a baseline [x0..x1] at y, grown by p (0..1). Deterministic per seed.
export function icicles(c, x0, x1, y, p, o = {}) {
  if (p <= 0) return;
  const n = Math.max(3, Math.floor((x1 - x0) / (o.step ?? 46))), maxL = o.len ?? 70, seed = o.seed ?? 1;
  c.save();
  c.lineJoin = "round";
  for (let i = 0; i < n; i++) {
    const r1 = hsh(i * 3.1 + seed), r2 = hsh(i * 7.7 + seed * 2.3), r3 = hsh(i * 1.3 + seed * 5.1);
    const cx = x0 + ((i + 0.5 + (r1 - 0.5) * 0.6) / n) * (x1 - x0);
    const L = maxL * (0.35 + 0.65 * r2) * clamp(p * 1.6 - r3 * 0.6), w = (o.w ?? 18) * (0.6 + 0.6 * r1);
    if (L <= 1) continue;
    c.beginPath();
    c.moveTo(cx - w / 2, y);
    c.quadraticCurveTo(cx - w * 0.18, y + L * 0.6, cx + (r3 - 0.5) * 4, y + L);
    c.quadraticCurveTo(cx + w * 0.18, y + L * 0.6, cx + w / 2, y);
    c.closePath();
    c.fillStyle = o.fill ?? "#FFFFFF";
    c.fill();
    c.lineWidth = o.lw ?? 3;
    c.strokeStyle = o.ink ?? C.ink;
    c.stroke();
    // highlight
    c.beginPath();
    c.moveTo(cx - w * 0.18, y + 4);
    c.lineTo(cx - w * 0.04, y + L * 0.55);
    c.strokeStyle = o.hi ?? "rgba(105,255,241,0.9)";
    c.lineWidth = Math.max(2, w * 0.14);
    c.stroke();
  }
  c.restore();
}
function hsh(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return s - Math.floor(s); }
export { hsh };
// a six-armed frost crystal (snowflake sprig), size r, grown by p
export function crystal(c, x, y, r, p, o = {}) {
  if (p <= 0) return;
  c.save();
  c.translate(x, y);
  c.rotate(o.rot ?? 0);
  c.strokeStyle = o.color ?? "#FFFFFF";
  c.lineWidth = o.lw ?? 3;
  c.lineCap = "round";
  c.globalAlpha *= o.alpha ?? 1;
  const L = r * clamp(p);
  c.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * 6.283, ca = Math.cos(a), sa = Math.sin(a);
    c.moveTo(0, 0);
    c.lineTo(ca * L, sa * L);
    for (const f of [0.45, 0.72]) {
      const bx = ca * L * f, by = sa * L * f, bl = L * 0.28 * (1 - f * 0.5);
      for (const s of [-1, 1]) {
        const b = a + s * 0.75;
        c.moveTo(bx, by);
        c.lineTo(bx + Math.cos(b) * bl, by + Math.sin(b) * bl);
      }
    }
  }
  c.stroke();
  c.restore();
}

// ----------------------------------------------------------------------------------------------------- misc drawing
export function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
// a clean (his) strike: ink bar wiping across, p 0..1
export function wipeStrike(c, x0, x1, y, p, o = {}) {
  if (p <= 0) return;
  c.fillStyle = o.color ?? C.ink;
  const h = o.h ?? 10;
  c.fillRect(x0 - 10, y - h / 2, (x1 - x0 + 20) * clamp(p), h);
}
// up/down triangle
export function tri(c, x, y, s, up = true, col = C.green) {
  c.fillStyle = col;
  c.beginPath();
  if (up) { c.moveTo(x, y - s * 0.6); c.lineTo(x + s * 0.62, y + s * 0.45); c.lineTo(x - s * 0.62, y + s * 0.45); }
  else { c.moveTo(x, y + s * 0.6); c.lineTo(x + s * 0.62, y - s * 0.45); c.lineTo(x - s * 0.62, y - s * 0.45); }
  c.closePath();
  c.fill();
}
export function check(c, x, y, s, col = C.green, lw = 8, p = 1) {
  c.save();
  c.strokeStyle = col;
  c.lineWidth = lw;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  const a = [x - s * 0.5, y], b = [x - s * 0.12, y + s * 0.38], d = [x + s * 0.55, y - s * 0.42];
  const q = clamp(p);
  c.moveTo(a[0], a[1]);
  if (q < 0.4) c.lineTo(lerp(a[0], b[0], q / 0.4), lerp(a[1], b[1], q / 0.4));
  else { c.lineTo(b[0], b[1]); const r = (q - 0.4) / 0.6; c.lineTo(lerp(b[0], d[0], r), lerp(b[1], d[1], r)); }
  c.stroke();
  c.restore();
}
