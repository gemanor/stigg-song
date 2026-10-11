// Shared helpers for the intro + drop scenes (A1). Deterministic: everything is a pure function of song time.
import * as B from "../../brand.js";

export const P = (E) => E.ORIENT === "portrait";

// ------------------------------------------------------------------------------------------ plate placement
// Options for E.drawPlate / E.plateToScreen so that clip-UV point (u, v) lands on screen point (X, Y) and the FULL clip
// height spans `h` screen px (independent of the crop). Always fit:'contain' so a 16:9 clip is never cover-cropped on
// a portrait canvas; the zoom does the framing. o: {u, v, X, Y, h, crop?, mirror?, rot?}
export function placePlate(E, v, o) {
  const crop = o.crop ?? [0, 0, 1, 1];
  const base = E.plateRect(E, v, { fit: "contain", crop });
  const z = (o.h * crop[3]) / base.h;
  let uu = (o.u - crop[0]) / crop[2];
  if (o.mirror) uu = 1 - uu;
  const vv = (o.v - crop[1]) / crop[3];
  const w = base.w * z, h = base.h * z;
  const cx = o.X - (uu - 0.5) * w, cy = o.Y - (vv - 0.5) * h;
  return { fit: "contain", crop: o.crop, mirror: !!o.mirror, zoom: z, x: (cx - E.W / 2) / E.SCALE, y: (cy - E.H / 2) / E.SCALE, rot: o.rot ?? 0 };
}
// screen px per clip-UV unit (horizontal, vertical) for opts from placePlate
export function plateScale(E, v, opts) {
  const r = E.plateRect(E, v, opts), c = opts.crop ?? [0, 0, 1, 1];
  return [r.w / c[2], r.h / c[3]];
}

// ------------------------------------------------------------------------------------------ tracking
// pose landmark smoothed over +-k frames (raw jitter looks cheap). Returns [u, v] or null.
export function poseAt(v, lt, idx, k = 2) {
  let x = 0, y = 0, n = 0;
  for (let j = -k; j <= k; j++) {
    const tr = v.trackAt(Math.max(0, lt + j / v.meta.fps));
    const p = tr?.pose?.[idx];
    if (p && p[2] > 0.3) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
// matte box / top smoothed
export function boxAt(v, lt, k = 2) {
  const b = [0, 0, 0, 0]; let n = 0;
  for (let j = -k; j <= k; j++) {
    const tr = v.trackAt(Math.max(0, lt + j / v.meta.fps));
    if (!tr) continue;
    for (let i = 0; i < 4; i++) b[i] += tr.box[i];
    n++;
  }
  return n ? b.map((x) => x / n) : [0, 0, 1, 1];
}

// ------------------------------------------------------------------------------------------ bokeh (party implied)
// Soft out-of-focus discs, cached as sprites. Closed-form drift.
let SPR = null;
function makeSprite(rgb, size = 160) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d"), r = size / 2;
  const g = x.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, `rgba(${rgb},0.55)`);
  g.addColorStop(0.62, `rgba(${rgb},0.62)`);
  g.addColorStop(0.8, `rgba(${rgb},0.85)`);   // a faint rim, like a real out-of-focus highlight
  g.addColorStop(0.9, `rgba(${rgb},0.35)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.beginPath(); x.arc(r, r, r, 0, 6.2832); x.fill();
  return c;
}
export function initBokeh() {
  if (SPR) return SPR;
  SPR = { g: makeSprite("146,231,89"), w: makeSprite("255,255,255"), m: makeSprite("222,252,202") };
  return SPR;
}
// o: {n, seed, alpha, scale, speed, focus (0 = soft, 1 = sharper/bigger), boost}
export function drawBokeh(E, ctx, t, o = {}) {
  const S = E.SCALE, W = E.W, H = E.H, n = o.n ?? 26, seed = o.seed ?? 7, sp = o.speed ?? 1;
  const boost = o.boost ?? 0, a0 = o.alpha ?? 1;
  ctx.save();
  for (let i = 0; i < n; i++) {
    const h1 = E.hash1(i * 3.17 + seed), h2 = E.hash1(i * 7.91 + seed * 2.3), h3 = E.hash1(i * 1.37 + seed * 5.1), h4 = E.hash1(i * 9.43 + seed);
    const sprite = h4 < 0.45 ? SPR.g : h4 < 0.8 ? SPR.w : SPR.m;
    const r = (34 + 150 * h3 * h3) * S * (o.scale ?? 1) * (1 + boost * 0.35);
    // slow drift: a lazy loop plus a gentle upward float
    const x = (h1 * 1.2 - 0.1) * W + Math.sin(t * 0.21 * sp + h2 * 6.28) * 46 * S;
    const yy = ((h2 * 1.2 - 0.1) * H - t * (8 + 14 * h3) * S * sp) % (H * 1.2);
    const y = yy < -H * 0.1 ? yy + H * 1.2 : yy;
    const tw = 0.6 + 0.4 * Math.sin(t * (0.7 + h1) + h3 * 9);
    const al = (0.05 + 0.16 * h1) * tw * a0 * (1 + boost * 1.6);
    if (al <= 0.003) continue;
    ctx.globalAlpha = Math.min(1, al);
    ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------ grounds / furniture
export function ground(E, ctx, col = B.C.bg) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, E.W, E.H);
}

// ------------------------------------------------------------------------------------------ type helpers
// a word envelope for slams: 0 before (s - lead), spring pop, alpha in 2 frames, out after e (3x faster exit)
export function popIn(E, t, s, o = {}) {
  const from = o.from ?? 0.92, k = o.k ?? 320, z = o.z ?? 0.42;
  const dt = t - (s - (o.lead ?? 0.05));
  if (dt < 0) return { a: 0, s: from };
  const sc = from + (1 - from) * E.spring(dt, k, z);
  return { a: Math.min(1, dt / 0.035), s: sc };
}
export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const fmt = (n) => B.fmtInt(n);
// cost of one of HIS words in tokens, read from the meter's own burn events so numbers never disagree with the HUD
let EVM = null;
export function burnOf(E, w) {
  if (!EVM) { EVM = new Map(); for (const e of B.initMeter(E).ev) EVM.set(e.t.toFixed(4), e); }
  return EVM.get(w.s.toFixed(4)) ?? null;
}
export const costOf = (E, w) => Math.round(burnOf(E, w)?.amt ?? 0);
// running burn of a list of words at time t (rolls linearly with each word's meter event, like the HUD)
export function runBurn(E, t, ws) {
  let s = 0;
  for (const w of ws) { const e = burnOf(E, w); if (e && t > e.t) s += e.amt * Math.min(1, (t - e.t) / e.dur); }
  return Math.round(s);
}
// vignette sprite (pre-rendered once; a muffled, enclosed room)
let VIG = null;
export function vignette(E, ctx, a = 1) {
  if (!VIG) {
    VIG = document.createElement("canvas"); VIG.width = 480; VIG.height = 270;
    const x = VIG.getContext("2d"), gr = x.createRadialGradient(240, 135, 40, 240, 135, 300);
    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.55, "rgba(0,0,0,0.05)"); gr.addColorStop(1, "rgba(0,0,0,0.62)");
    x.fillStyle = gr; x.fillRect(0, 0, 480, 270);
  }
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(VIG, 0, 0, E.W, E.H); ctx.restore();
}

// chat bubble (HER): rounded rect with a tail at bottom-left (tail:'left') or bottom-right
export function bubble(ctx, x, y, w, h, r, o = {}) {
  const tailW = o.tailW ?? r * 0.9, tailH = o.tailH ?? r * 0.75, left = (o.tail ?? "left") === "left";
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  if (left) {
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r + tailW * 0.4, y + h);
    ctx.quadraticCurveTo(x + tailW * 0.2, y + h + tailH * 0.15, x - tailW * 0.35, y + h + tailH);
    ctx.quadraticCurveTo(x + tailW * 0.12, y + h - tailH * 0.1, x, y + h - r * 0.9);
    ctx.lineTo(x, y + r);
  } else {
    ctx.quadraticCurveTo(x + w - tailW * 0.12, y + h - tailH * 0.1, x + w + tailW * 0.35, y + h + tailH);
    ctx.quadraticCurveTo(x + w - tailW * 0.2, y + h + tailH * 0.15, x + w - r - tailW * 0.4, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
  }
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ------------------------------------------------------------------------------------------ can track (party_wide)
// The pose tracker follows HIM only; the lilac can changes hands (clip 2.4-2.55 he hands it over, she holds it to 3.2),
// so it has its own colour track (assets/intro/can_track.json: [t, u, v, px]), smoothed over +-2 frames.
let CAN = null;
export async function loadCanTrack() {
  if (!CAN) CAN = await (await fetch("/assets/intro/can_track.json")).json();
  return CAN;
}
export function canAt(lt) {
  if (!CAN) return null;
  const i0 = Math.floor(lt * 24);
  let u = 0, v = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const r = CAN[Math.max(0, Math.min(CAN.length - 1, i0 + k))];
    if (r && r[1] != null && r[3] > 900) { u += r[1]; v += r[2]; n++; }
  }
  return n ? [u / n, v / n] : null;
}
