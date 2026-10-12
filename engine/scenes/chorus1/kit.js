// Shared kit for the three choruses (chorus1.js / chorus2.js / chorus3.js). Owner: motion designer A3.
// Clip slots with fallbacks, subject framing from the tracking boxes, beat-locked speed ramps, the five looks' grounds,
// hype-type slams, burn tags (brand.tokensAt), stadium walls, the After Tokens lockup wrapper, impact bursts.
// Deterministic: everything is a pure function of song time t.
import * as B from "../../brand.js";
import { clamp, lerp, ease, hash1 } from "../../core.js";
export { B, clamp, lerp, ease, hash1 };
export const C = B.C, FONT = B.FONT;

export const LOOK = {
  A: { bg: C.bg, ink: C.white, acc: C.green, hud: "dark" }, // AFTER TOKENS
  B: { bg: C.paper, ink: C.ink, acc: C.green, hud: "light" }, // PITCH DECK
  C: { bg: C.green, ink: C.ink, acc: C.white, hud: "light" }, // SIGNAL GREEN
  D: { bg: "#FFFFFF", ink: C.ink, acc: C.coral, hud: "light" }, // DICTIONARY
  E: { bg: C.bg, ink: C.paper, acc: C.green, hud: "dark" }, // TERMINAL
};

// ------------------------------------------------------------------------------------------------------------- clips
// Every clip is optional: a slot whose clip hasn't landed yet resolves to null and the shot uses its fallback.
const _clips = {};
export function loadClip(E, name) {
  if (!_clips[name])
    _clips[name] = E.loadVideo(name)
      .then((v) => (prepClip(v), v))
      .catch(() => null);
  return _clips[name];
}
export async function loadClips(E, names) {
  const out = {};
  await Promise.all(names.map(async (n) => (out[n] = await loadClip(E, n))));
  return out;
}
const median = (a) => a.slice().sort((p, q) => p - q)[a.length >> 1];
// subject boxes for clips that land before their tracking does (clip UV, measured from out/key_<clip>.jpg)
const BOX_FALLBACK = { duo_dance: [0.22, 0.03, 0.78, 0.95] };
function prepClip(v) {
  const tr = v.track || [];
  if (!tr.length && BOX_FALLBACK[v.meta.src?.replace(/\.mp4$/, "")]) {
    const b = BOX_FALLBACK[v.meta.src.replace(/\.mp4$/, "")];
    v.dur = v.meta.n / v.meta.fps; v.mb = b; v.ub = b; v.pumps = [];
    if (!v.trackAt || !v.track) v.trackAt = () => ({ box: b, c: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2], top: [(b[0] + b[2]) / 2, b[1]], pose: null });
    return;
  }
  const b = [[], [], [], []];
  for (const f of tr) if (f && f.box) for (let k = 0; k < 4; k++) b[k].push(f.box[k]);
  v.dur = v.meta.n / v.meta.fps;
  v.mb = b[0].length ? b.map(median) : [0, 0, 1, 1]; // median subject box (stable framing)
  v.ub = b[0].length ? [Math.min(...b[0]), Math.min(...b[1]), Math.max(...b[2]), Math.max(...b[3])] : [0, 0, 1, 1];
  v.pumps = pumpPeaks(v);
}
// fist-pump peaks: local minima of the (smoothed) mean wrist height, in clip seconds
function pumpPeaks(v) {
  const tr = v.track || [], n = tr.length, y = new Float32Array(n), fps = v.meta.fps;
  for (let i = 0; i < n; i++) {
    const p = tr[i]?.pose;
    let s = 0, k = 0;
    if (p) for (const j of [15, 16]) if (p[j] && p[j][2] > 0.3) { s += p[j][1]; k++; }
    y[i] = k ? s / k : i ? y[i - 1] : 0.5;
  }
  const sm = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0, k = 0; for (let d = -2; d <= 2; d++) if (i + d >= 0 && i + d < n) { s += y[i + d]; k++; } sm[i] = s / k; }
  const out = [];
  for (let i = 3; i < n - 3; i++) {
    let lo = true, mx = 0;
    for (let d = 1; d <= 3; d++) if (sm[i] > sm[i - d] || sm[i] > sm[i + d]) lo = false;
    for (let d = -7; d <= 7; d++) if (i + d >= 0 && i + d < n) mx = Math.max(mx, sm[i + d]);
    if (lo && mx - sm[i] > 0.012 && (!out.length || i / fps - out[out.length - 1] > 0.3)) out.push(i / fps);
  }
  return out;
}
// keep local time strictly inside the clip (a held last frame reads as a freeze)
export const inClip = (v, x) => clamp(x, 0, v.dur - 1 / v.meta.fps);
// piecewise-linear time warp from song time to clip time through knots [[songT, clipT], ...] (extrapolates at end slopes)
export function warp(knots, t) {
  const n = knots.length;
  if (n === 1) return knots[0][1] + (t - knots[0][0]);
  let i = 0;
  while (i < n - 2 && t > knots[i + 1][0]) i++;
  const [a, b] = knots[i], [c, d] = knots[i + 1];
  return b + ((t - a) / (c - a)) * (d - b);
}
// knots that land clip pump peaks (from index p0) on the song's beats in [t0, t1]; pre-roll runs at rate 1
export function pumpKnots(E, v, t0, t1, p0 = 0) {
  const beats = E.A.beats.filter((x) => x >= t0 - 0.01 && x <= t1 + 0.6), k = [];
  for (let i = 0; i < beats.length && p0 + i < v.pumps.length; i++) k.push([beats[i], v.pumps[p0 + i]]);
  if (!k.length) return [[t0, 0.5]];
  if (k.length === 1) k.push([k[0][0] + 1, k[0][1] + 1]);
  return k;
}

// ------------------------------------------------------------------------------------------------------ framing
// drawPlate options that put the subject box (median box by default) at screen anchor (cx, bottom) with height h px.
// o: {h, cx, bottom | ay, mirror, box, spanUV (UV height that maps to h), au/av (anchor in clip UV), crop, pad, rot}
export function frameSub(E, v, o) {
  const bx = o.box ?? v.mb, pad = o.pad ?? 0.03;
  let crop = o.crop;
  if (!crop) {
    const x0 = Math.max(0, v.ub[0] - pad), y0 = Math.max(0, v.ub[1] - pad);
    crop = [x0, y0, Math.min(1, v.ub[2] + pad) - x0, Math.min(1, v.ub[3] + pad) - y0];
  }
  const span = o.spanUV ?? bx[3] - bx[1], k = o.h / (span * v.meta.h);
  const cw = crop[2] * v.meta.w * k, ch = crop[3] * v.meta.h * k;
  const va = (v.meta.w * crop[2]) / (v.meta.h * crop[3]), sa = E.W / E.H;
  const h0 = va > sa ? E.W / va : E.H;
  const au = o.au ?? (bx[0] + bx[2]) / 2, av = o.av ?? bx[3];
  let fu = (au - crop[0]) / crop[2];
  if (o.mirror) fu = 1 - fu;
  const fv = (av - crop[1]) / crop[3];
  const pcx = o.cx - (fu - 0.5) * cw, pcy = (o.bottom ?? o.ay) - (fv - 0.5) * ch;
  return { fit: "contain", crop, zoom: ch / h0, x: (pcx - E.W / 2) / E.SCALE, y: (pcy - E.H / 2) / E.SCALE, mirror: !!o.mirror, matte: true, rot: o.rot ?? 0, feather: o.feather ?? 0.12 };
}
// smoothed pose landmark (±2 frames) in clip UV, or null
export function lm(v, lt, idx) {
  let x = 0, y = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const p = v.trackAt(lt + k / v.meta.fps)?.pose?.[idx];
    if (p && p[2] > 0.3) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
// screen position of a landmark (or a fallback UV point) under plate options
export function lmScreen(E, v, lt, idx, opts, fb) {
  const p = lm(v, lt, idx) ?? fb;
  return p ? E.plateToScreen(E, v, p, opts) : null;
}
export function boxScreen(E, v, lt, opts) {
  const b = v.trackAt(lt)?.box ?? v.mb, a = E.plateToScreen(E, v, [b[0], b[1]], opts), c = E.plateToScreen(E, v, [b[2], b[3]], opts);
  return { x0: Math.min(a[0], c[0]), y0: a[1], x1: Math.max(a[0], c[0]), y1: c[1] };
}

// ------------------------------------------------------------------------------------------------------- grounds
export function groundA(F, c, o = {}) {
  const { E, t, S } = F;
  c.fillStyle = C.bg; c.fillRect(0, 0, E.W, E.H);
  const bp = E.pulse("beats", t, 0.1);
  B.hairGrid(c, 0, 0, E.W, E.H, { step: (o.step ?? 96) * S, alpha: (o.gridA ?? 0.55) + 0.45 * bp, offX: o.offX ?? 0, offY: o.offY ?? 0 });
}
export function groundC(F, c) { c.fillStyle = C.green; c.fillRect(0, 0, F.E.W, F.E.H); }
export function groundFill(F, c, col) { c.fillStyle = col; c.fillRect(0, 0, F.E.W, F.E.H); }

// --------------------------------------------------------------------------------------------------------- type
export const HERO = { font: FONT.hero, weight: 900, tracking: -0.03 };
export const COND = { font: FONT.grot, weight: 900, stretch: "62.5%", tracking: -0.01 };
export const MONO = { font: FONT.mono, weight: 700, tracking: 0.08 };
// Slam: appears 3 frames before the onset at `from` scale, accelerates into the impact frame (t = s), small bounce after.
export function slam(t, s, o = {}) {
  const pre = o.pre ?? 0.05;
  if (t < s - pre) return null;
  if (t < s) { const u = (t - (s - pre)) / pre; return { a: o.fadeIn ? Math.min(1, 0.35 + u) : 1, sc: lerp(o.from ?? 1.32, 1, ease.inQuad(u)) }; }
  const dt = t - s;
  return { a: 1, sc: 1 - (o.bounce ?? 0.035) * Math.exp(-dt * 16) * Math.sin(dt * 46) };
}
// Draw `text` slammed on onset s, scaling about the word's visual centre. Returns false while not yet visible.
export function slamText(F, c, text, x, y, s, o = {}) {
  const k = slam(F.t, s, o);
  if (!k) return false;
  const E = F.E, font = { ...HERO, ...o }, size = font.size ?? 120;
  const wd = E.measure(c, text, font), al = font.align ?? "center", bl = font.baseline ?? "middle";
  const cx = al === "left" ? x + wd / 2 : al === "right" ? x - wd / 2 : x, cy = bl === "alphabetic" ? y - size * 0.36 : y;
  const sc = (o.s ?? 1) * k.sc;
  c.save(); c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy);
  E.drawText(c, text, x, y, { ...font, s: 1, alpha: (o.alpha ?? 1) * k.a });
  c.restore();
  return true;
}
// a shared measuring context (no per-frame canvas allocation)
let _m = null;
export const mctx = () => (_m ??= document.createElement("canvas").getContext("2d"));
// cap heights (fraction of font size) for baseline layout
export const CAP = { hero: 0.73, cond: 0.69, black: 0.72, serif: 0.66 };
export const fit = (F, c, text, o, maxW) => F.E.fitSize(c, text, o, maxW);
export const upper = (w) => w.w.toUpperCase();

// tokens burned by a word (rolls in over 0.1 s on its onset)
const _burn = new Map();
export function burnOf(E, w) {
  if (!_burn.has(w.s)) _burn.set(w.s, Math.max(0, B.tokensAt(E, w.s - 0.001) - B.tokensAt(E, w.s + 0.11)));
  return _burn.get(w.s);
}
// small mono "−4,213" tag that rises off a word after its onset
export function burnTag(F, c, w, x, y, o = {}) {
  const { E, t, S } = F;
  if (t < w.s) return;
  const u = (t - w.s) / (o.dur ?? 0.7);
  if (u > 1) return;
  const b = burnOf(E, w);
  if (b < 1) return;
  E.drawText(c, `−${B.fmtInt(b)}${o.unit ?? ""}`, x, y - ease.outCubic(u) * (o.rise ?? 46) * S, { ...MONO, size: (o.size ?? 30) * 1.35 * S, color: o.color ?? C.green, alpha: 1 - u * u, align: o.align ?? "left" }); // ≥ 40 px: reads inline on phones
}

// cached word sprites (for stadium walls): offscreen canvas, text drawn at `size` px, baseline-middle
const _spr = new Map();
export function sprite(E, text, o) {
  const key = JSON.stringify([text, o]);
  if (_spr.has(key)) return _spr.get(key);
  const cv = document.createElement("canvas"), x = cv.getContext("2d");
  const font = { ...HERO, ...o, align: "left" };
  const w = Math.ceil(E.measure(x, text, font)) + 8, h = Math.ceil(o.size * 1.02);
  cv.width = w; cv.height = h;
  E.drawText(x, text, 4, h * 0.52, { ...font, baseline: "middle" });
  const r = { cv, w, h };
  _spr.set(key, r);
  return r;
}

// ------------------------------------------------------------------------------------------------ stadium walls
// GANG "FOUNDER!" as a crowd of repeated words. All closed-form in (t - t0).
// Tiers: perspective rows (nearest at the bottom), alternate rows scroll opposite ways, a stadium jump on each beat.
export function wallTiers(F, c, t0, o = {}) {
  const { E, t, S, W, H } = F, dt = t - t0, word = o.word ?? "FOUNDER!";
  const base = Math.round((o.base ?? 300) * S);
  const sp = [sprite(E, word, { size: base, color: o.ink ?? C.white }), sprite(E, word, { size: base, color: o.acc ?? C.green })];
  const rows = o.rows ?? 9, shrink = o.shrink ?? 0.76;
  let yb = H * (o.bottom ?? 1.06) * 1, k = o.scale0 ?? 1;
  const bt = E.last("beats", t);
  for (let r = 0; r < rows; r++) {
    const rw = sp[0].w * k, rh = sp[0].h * k;
    const jumpDt = bt ? t - bt.t - r * 0.018 : 9;
    const jump = jumpDt > 0 ? Math.exp(-jumpDt / 0.09) * Math.sin(Math.min(Math.PI, jumpDt * 26)) * 22 * S * k : 0;
    const y = yb - rh * 0.92 - jump;
    const gap = rw * 1.04, dir = r % 2 ? 1 : -1, off = dir * (o.speed ?? 520) * S * dt + hash1(r * 7.7 + 1) * gap;
    const n0 = Math.floor(-off / gap) - 1;
    c.globalAlpha = (o.alpha ?? 1) * Math.max(0.16, 1 - r * (o.fade ?? 0.1));
    for (let i = n0; ; i++) {
      const x = off + i * gap;
      if (x > W) break;
      if (x + rw < 0) continue;
      c.drawImage(sp[(((i + r * 2) % 3) + 3) % 3 === 0 ? 1 : 0].cv, x, y, rw, rh);
    }
    yb = y + rh * 0.2;
    k *= shrink;
    if (yb < -10) break;
  }
  c.globalAlpha = 1;
}
// Wave: a grid of words, a stadium wave sweeps across (scale up + accent colour at the crest).
export function wallWave(F, c, t0, o = {}) {
  const { E, t, S, W, H } = F, dt = t - t0, word = o.word ?? "FOUNDER!";
  const base = Math.round((o.base ?? 160) * S);
  const sp = [sprite(E, word, { size: base, color: o.ink ?? C.white }), sprite(E, word, { size: base, color: o.acc ?? C.green })];
  const cols = o.cols ?? 4, rows = o.rows ?? 7, cw = W / cols, rh = H / rows;
  const k = Math.min((cw * 0.94) / sp[0].w, (rh * 1.05) / sp[0].h);
  const front = lerp(-0.25, 1.25, clamp(dt / (o.dur ?? 0.5))) * W;
  for (let r = 0; r < rows; r++)
    for (let i = 0; i < cols; i++) {
      const sh = (r % 2) * cw * 0.5, cx = (i + 0.5) * cw + sh - (r % 2 ? cw * 0.25 : 0), cy = (r + 0.5) * rh;
      const d = (cx - front) / (W * 0.13), crest = Math.exp(-d * d);
      const s = k * (1 + 0.32 * crest), w = sp[0].w * s, h = sp[0].h * s;
      c.globalAlpha = (o.alpha ?? 1) * (0.5 + 0.5 * Math.max(crest, cx < front ? 0.75 : 0.4));
      c.drawImage(sp[crest > 0.45 ? 1 : 0].cv, cx - w / 2, cy - h / 2 - crest * 18 * S, w, h);
    }
  c.globalAlpha = 1;
}

// ------------------------------------------------------------------------------------------------------- lockup
// The SEE YOU AFTER TOKENS banner (brand.afterTokens, words landing on their onsets) with framing variations:
// o: {size (cap px at 1080p), sc, rot, band (fill colour of a full-width banner strip behind it), bandPad, seed}
export function lockupBox(E, c, cx, cy, size) {
  const sz = size * E.SCALE, topW = E.measure(c, "SEE YOU AFTER", { font: FONT.hero, weight: 900, size: sz, tracking: -0.02 });
  const cell = Math.max(2, Math.round(sz / 12)), pz = B.pixelSize("TOKENS", { rows: 13, cell });
  const W = Math.max(topW, pz.w), H = sz * 1.08 + pz.h + sz * 0.35, m = 26 * E.SCALE;
  return { x: cx - W / 2, y: cy - H / 2, w: W, h: H, top: cy - H / 2 - m, bot: cy + H / 2 + m * 0.6 };
}
export function lockup(F, c, words, cx, cy, o = {}) {
  const { E, t } = F, size = o.size ?? 120;
  c.save();
  if (o.sc || o.rot) { c.translate(cx, cy); if (o.rot) c.rotate(o.rot); if (o.sc) c.scale(o.sc, o.sc); c.translate(-cx, -cy); }
  const bx = lockupBox(E, c, cx, cy, size);
  if (o.band) {
    const p = (o.bandPad ?? 22) * E.SCALE;
    c.fillStyle = o.band; c.fillRect(-E.W, bx.top - p, E.W * 3, bx.bot - bx.top + 2 * p);
  }
  const r = B.afterTokens(E, c, cx, cy, t, { size, words, seed: o.seed ?? 3 });
  c.restore();
  return { ...bx, ...r };
}

// ------------------------------------------------------------------------------------------------------- graphics
// radial impact lines (fist pump / finger-gun hits), drawn over [t0, t0+dur]
export function burst(c, x, y, t, t0, o = {}) {
  const dur = o.dur ?? 0.24, u = (t - t0) / dur;
  if (u < 0 || u >= 1) return;
  const n = o.n ?? 10, r0 = o.r0 ?? 30, r1 = o.r1 ?? 120, a0 = o.a0 ?? -1.5708, spread = o.spread ?? 6.2832;
  c.save(); c.strokeStyle = o.color ?? C.white; c.lineWidth = o.lw ?? 4; c.lineCap = "round"; c.beginPath();
  const head = ease.outCubic(Math.min(1, u * 1.5)), tail = ease.outCubic(u);
  for (let i = 0; i < n; i++) {
    const a = a0 - spread / 2 + (spread * (i + 0.5)) / n, j = 0.75 + 0.5 * hash1(i * 3.1 + (o.seed ?? 0));
    const ra = lerp(r0, r1 * j, tail * 0.8), rb = lerp(r0, r1 * j, head);
    if (rb - ra < 1) continue;
    c.moveTo(x + Math.cos(a) * ra, y + Math.sin(a) * ra); c.lineTo(x + Math.cos(a) * rb, y + Math.sin(a) * rb);
  }
  c.stroke(); c.restore();
}
// soft contact shadow under a full-body cut-out (a graphic on the ground layer)
let _shadow = null;
export function shadow(c, x, y, w, col = "rgba(0,0,0,0.35)") {
  if (!_shadow) {
    _shadow = document.createElement("canvas"); _shadow.width = 256; _shadow.height = 64;
    const g = _shadow.getContext("2d"), gr = g.createRadialGradient(128, 32, 4, 128, 32, 128);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.setTransform(1, 0, 0, 0.25, 0, 24); g.fillStyle = gr; g.beginPath(); g.arc(128, 32, 128, 0, 6.2832); g.fill();
  }
  c.save(); c.globalAlpha = col === "light" ? 0.18 : 0.42; c.drawImage(_shadow, x - w / 2, y - w * 0.125, w, w * 0.25); c.restore();
}
// beats inside [a, b)
export const beatsIn = (E, a, b) => E.A.beats.filter((x) => x >= a && x < b);

// impact lines on both wrists at each beat-locked pump peak (knots = [[songT, clipT], ...])
export function fistBursts(F, c, v, lt, op, kn, col, joints = [15, 16]) {
  const { E, t, S } = F, z = Math.min(1.6, op.zoom);
  for (const k of kn) {
    if (t < k[0] - 0.02 || t > k[0] + 0.3) continue;
    for (const j of joints) {
      const p = lmScreen(E, v, lt, j, op);
      if (p) burst(c, p[0], p[1] - 20 * S * op.zoom, t, k[0], { color: col, lw: 5 * S, r0: 40 * S * z, r1: 150 * S * z, n: 9, a0: -1.5708, spread: 3.4, seed: j });
    }
  }
}
// the GANG chant's cost: a mono readout slammed on the chant ("GANG CHANT −8,663 TOKENS")
export function gangReadout(F, c, gw, o = {}) {
  const { E, t, S, W, H, R, port } = F, b = burnOf(E, gw);
  const x = o.x ?? (port ? R.x + R.w / 2 : W / 2), y = o.y ?? (port ? R.y + R.h * 0.5 : 0.5 * H);
  const k = slam(t, gw.s, { from: 1.2 });
  if (!k) return;
  const txt = o.text ?? `GANG CHANT  −${B.fmtInt(b)} TOKENS`;
  const f = { ...MONO, size: (o.size ?? (port ? 34 : 56)) * S, align: "center" };
  const tw = E.measure(c, txt, f) + 60 * S, col = o.color ?? C.green;
  c.save(); c.translate(x, y); c.scale(k.sc, k.sc); if (o.rot) c.rotate(o.rot);
  c.fillStyle = o.bg ?? C.bg; c.fillRect(-tw / 2, -f.size * 0.95, tw, f.size * 1.9);
  c.fillStyle = col; c.fillRect(-tw / 2, -f.size * 0.95, 6 * S, f.size * 1.9);
  E.drawText(c, txt, 0, 0, { ...f, color: col });
  c.restore();
}
// his lanyard badge in clip UV: centre of the torso, ~0.29 torso-length tall (measured on him_chant)
export function badgeUV(v, lt) {
  const s1 = lm(v, lt, 11), s2 = lm(v, lt, 12), h1 = lm(v, lt, 23), h2 = lm(v, lt, 24);
  if (!s1 || !s2 || !h1 || !h2) return null;
  const sx = (s1[0] + s2[0]) / 2, sy = (s1[1] + s2[1]) / 2, hy = (h1[1] + h2[1]) / 2, len = hy - sy;
  return { c: [sx, sy + 0.5 * len], h: 0.29 * len };
}

// ------------------------------------------------------------------------------------------------------- runner
// A scene = a list of shots {a, b, look, clips(F) -> [[v, localT], ...], draw(F)}. Hard cuts at shot boundaries.
// F (per frame): {E, t, S, W, H, R (safe band), port, cl (clips with local times), back(fn), plate(v, opts), front(fn)}.
// back() and front() are the two full-res 2D surfaces (BACK/MID behind the cut-outs, FRONT over them).
export function makeScene(def) {
  let g1, g2, SH = [];
  // PT: top of the free type area (below the HUD's token meter, which sits at the top-left of the safe band)
  const ctx = (E, t, layer) => ({ E, t, S: E.SCALE, W: E.W, H: E.H, R: E.SAFE, port: E.ORIENT === "portrait", layer,
    PT: E.ORIENT === "portrait" ? E.SAFE.y + 175 * E.SCALE : 0.16 * E.H });
  const pick = (t) => { for (const s of SH) if (t >= s.a && t < s.b) return s; return SH[t < SH[0].a ? 0 : SH.length - 1]; };
  return {
    async load(E, layer) {
      g1 = E.makeG2D(E.W, E.H); g2 = E.makeG2D(E.W, E.H);
      B.initMeter(E);
      const V = await loadClips(E, def.clips);
      SH = def.shots(E, V, layer);
    },
    async prepare(E, t, layer) {
      const sh = pick(t);
      if (sh.clips) for (const [v, lt] of sh.clips(ctx(E, t, layer))) if (v) await v.frame(lt);
    },
    render(E, t, rt, layer) {
      E.renderer.setRenderTarget(rt);
      const sh = pick(t), F = ctx(E, t, layer);
      F.sh = sh;
      F.cl = sh.clips ? sh.clips(F) : [];
      F.back = (fn) => { g1.clear(); g1.ctx.save(); fn(g1.ctx); g1.ctx.restore(); g1.commit(); E.blitG2D(E, g1, 1); };
      F.front = (fn) => { g2.clear(); g2.ctx.save(); fn(g2.ctx); g2.ctx.restore(); g2.commit(); E.blitG2D(E, g2, 1); };
      F.plate = (v, o) => { if (v) E.drawPlate(E, v, o); };
      E.hud.sub = false; // every sung word is drawn by the scene itself
      E.hud.theme = LOOK[sh.look]?.hud ?? "dark";
      sh.draw(F, sh);
    },
  };
}
// camera punch on beats (kick-aligned 4/4), bigger on downbeats; amt within 0.015-0.04
export function punch(F, amt = 0.025) {
  const { E, t } = F, b = E.last("beats", t), d = E.last("downbeats", t);
  if (!b) return;
  const down = d && Math.abs(d.t - b.t) < 0.02;
  E.post.punch = Math.max(E.post.punch, Math.min(0.04, down ? amt * 1.4 : amt) * Math.exp(-b.dt / 0.1));
}
// slow camera creep across a shot (1 → 1+amt), for plates and type: shots never sit dead still
export const creep = (t, a, b, amt = 0.035) => 1 + amt * ease.outQuad(clamp((t - a) / Math.max(0.1, b - a)));
