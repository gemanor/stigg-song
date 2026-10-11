// A6 kit, shared by outro.js (134.50-147.80) and endcard.js (147.80-157.99).
// Footage slots (real clip, else a same-framing stand-in for layout only), framing a cut-out by its tracked box,
// a tabular pixel counter (fixed digit slots, baseline-locked, same cell look as brand.pixelText), the check,
// the paywall ripple, the logo raster. Everything is a pure function of song time t.
import * as B from "../../brand.js";
import { clamp, lerp, ease, hash1 } from "../../core.js";

// ------------------------------------------------------------------------------------------------ footage slots
// The clip is used when assets/video/<clip>/ exists. Until it lands, a stand-in with a similar framing keeps the
// layout honest (flagged in the console and in the final report; it must not ship).
export const STANDIN = {
  date_table: "party_wide",
  him_gottago: "him_pitch",
  her_whopays: "her_cu_talk",
  him_outoftokens: "him_cu_talk",
  her_pays: "her_cu_talk",
  her_victory: "her_unimpressed",
  him_holds_matcha: "him_chant",
};
const SLOTS = {};
export async function slot(E, name) {
  if (SLOTS[name]) return SLOTS[name];
  let v = null, real = false, src = name;
  try { v = await E.loadVideo(name); real = true; } catch (e) { v = null; }
  if (!v && STANDIN[name]) {
    try { v = await E.loadVideo(STANDIN[name]); src = STANDIN[name]; } catch (e) { v = null; }
  }
  if (!real) console.warn(`[A6] clip ${name} not landed: ${v ? "stand-in " + src : "no footage"}`);
  return (SLOTS[name] = { name, src, v, real });
}
export const clipDur = (v) => (v ? v.meta.dur ?? v.meta.n / v.meta.fps : 6);
// song time -> clip seconds through piecewise-linear keys [[songT, clipT], ...] (slope 1 outside the keys),
// clamped inside the clip so a frame never holds on the last image.
export function clipT(v, keys, t) {
  let c;
  const n = keys.length;
  if (t <= keys[0][0]) c = keys[0][1] + (t - keys[0][0]);
  else if (t >= keys[n - 1][0]) c = keys[n - 1][1] + (t - keys[n - 1][0]);
  else {
    for (let i = 1; i < n; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i]; c = a[1] + ((t - a[0]) / (b[0] - a[0])) * (b[1] - a[1]); break; }
  }
  const fps = v?.meta.fps ?? 24;
  return clamp(c, 0, clipDur(v) - 1.05 / fps);
}

// union of the matte boxes over a clip-time range (video UV)
export function unionBox(v, c0, c1) {
  if (!v?.track) return [0, 0, 1, 1];
  const fps = v.meta.fps, n = v.track.length, r = [1, 1, 0, 0];
  for (let i = Math.max(0, Math.floor(c0 * fps)); i <= Math.min(n - 1, Math.ceil(c1 * fps)); i++) {
    const b = v.track[i]?.box;
    if (!b) continue;
    r[0] = Math.min(r[0], b[0]); r[1] = Math.min(r[1], b[1]); r[2] = Math.max(r[2], b[2]); r[3] = Math.max(r[3], b[3]);
  }
  return r[2] > r[0] ? r : [0, 0, 1, 1];
}
// drawPlate options that put `box` (video UV) at a target on screen: tgt = {h: box height px, cx|x0|x1, cy|y0|y1, mirror}
export function frameBox(E, v, box, tgt) {
  const fit = E.plateFit(E, v), base = E.plateRect(E, v, { fit });
  const z = tgt.h / Math.max(1e-3, (box[3] - box[1]) * base.h), w = base.w * z, h = base.h * z;
  let u0 = box[0], u1 = box[2];
  if (tgt.mirror) { const a = 1 - u1; u1 = 1 - u0; u0 = a; }
  const rx = tgt.cx != null ? tgt.cx - ((u0 + u1) / 2) * w : tgt.x0 != null ? tgt.x0 - u0 * w : tgt.x1 - u1 * w;
  const ry = tgt.cy != null ? tgt.cy - ((box[1] + box[3]) / 2) * h : tgt.y0 != null ? tgt.y0 - box[1] * h : tgt.y1 - box[3] * h;
  return { fit, zoom: z, x: (rx + w / 2 - E.W / 2) / E.SCALE, y: (ry + h / 2 - E.H / 2) / E.SCALE, mirror: !!tgt.mirror };
}
// a pose landmark smoothed over +-2 frames (video UV), or null
export function smoothPt(v, lt, idx, minVis = 0.3) {
  if (!v?.track) return null;
  let x = 0, y = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const p = v.trackAt(lt + k / v.meta.fps)?.pose?.[idx];
    if (p && p[2] > minVis) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
// average of several landmarks (e.g. both mouth corners), or null
export function poseMid(v, lt, ids) {
  let x = 0, y = 0, n = 0;
  for (const i of ids) { const p = smoothPt(v, lt, i); if (p) { x += p[0]; y += p[1]; n++; } }
  return n ? [x / n, y / n] : null;
}
// a tracked point on screen with a fallback (UV inside the clip) when tracking has nothing
export function trackScreen(E, v, lt, ids, opts, fallbackUV) {
  const p = (ids && poseMid(v, lt, ids)) || fallbackUV;
  return E.plateToScreen(E, v, p, opts);
}

// ------------------------------------------------------------------------------------------------ grounds
export function groundA(c, E, t, o = {}) {
  const S = E.SCALE;
  c.fillStyle = o.bg ?? B.C.bg;
  c.fillRect(0, 0, E.W, E.H);
  B.hairGrid(c, 0, 0, E.W, E.H, { step: (o.step ?? 96) * S, alpha: o.gridA ?? 0.55, offX: o.offX ?? 0, offY: o.offY ?? 0 });
}
// soft contact shadow (a graphic under full-body cut-outs)
export function contactShadow(c, x, y, rx, ry, a = 0.55) {
  c.save();
  c.translate(x, y);
  c.scale(1, ry / rx);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(0,0,0,${a})`);
  g.addColorStop(0.55, `rgba(0,0,0,${a * 0.45})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g;
  c.beginPath(); c.arc(0, 0, rx, 0, 6.2832); c.fill();
  c.restore();
}
export const blinkOn = (t, t0, period = 1.0) => (t - t0) / period - Math.floor((t - t0) / period) < 0.5;
export const dark = (hex, k) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
};
export const CORAL_LINE = "#8f3a33"; // pixel-grid cell lines under coral (a darker coral, per the brief)

// --------------------------------------------------------------------------------- tabular pixel counter
// Same raster and cell look as brand.pixelText (Archivo Black, 2-pass cells), but every glyph keeps its baseline
// and digits sit in fixed slots, so a rolling number never jitters and a single "0" lines up with "0 TOKENS".
const GL = new Map();
function glyph(ch, rows, font) {
  const key = ch + "|" + rows + "|" + font;
  let g = GL.get(key);
  if (g) return g;
  const fs = rows * 1.36, cv = document.createElement("canvas"), x = cv.getContext("2d"), f = `${fs}px "${font}"`;
  x.font = f;
  const adv = x.measureText(ch).width, w = Math.ceil(adv) + 6, h = Math.ceil(fs * 1.3);
  cv.width = w; cv.height = h;
  x.font = f; x.fillStyle = "#fff"; x.textBaseline = "alphabetic";
  x.fillText(ch, 3, Math.round(fs * 0.98));
  const d = x.getImageData(0, 0, w, h).data, on = [];
  let top = h;
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (d[(yy * w + xx) * 4 + 3] > 110) { on.push(xx - 3, yy); if (yy < top) top = yy; }
  g = { on: new Int16Array(on), adv: Math.round(adv), top };
  GL.set(key, g);
  return g;
}
const isDigit = (cc) => cc >= 48 && cc <= 57;
function digitAdv(rows, font) {
  let m = 0;
  for (let i = 0; i < 10; i++) m = Math.max(m, glyph(String(i), rows, font).adv);
  return m;
}
export function pixelCountSize(str, o = {}) {
  const rows = o.rows ?? 12, cell = o.cell ?? 6, font = o.font ?? B.FONT.black, dA = digitAdv(rows, font);
  let wc = 0;
  for (let i = 0; i < str.length; i++) { const cc = str.charCodeAt(i); wc += isDigit(cc) ? dA : glyph(str[i], rows, font).adv; }
  return { w: wc * cell, h: rows * cell, digit: dA * cell };
}
// (x, y) = top-left of the cap height ("0" top) for align 'left'; 'right'/'center' anchor the same way.
export function pixelCount(c, str, x, y, o = {}) {
  const rows = o.rows ?? 12, cell = o.cell ?? 6, font = o.font ?? B.FONT.black, dA = digitAdv(rows, font);
  const top = glyph("0", rows, font).top, sz = pixelCountSize(str, o), gap = Math.max(1, Math.round(cell / 6));
  const ax = o.align === "right" ? x - sz.w : o.align === "center" ? x - sz.w / 2 : x;
  c.save();
  c.globalAlpha = o.alpha ?? 1;
  const col = o.color ?? B.C.green, ln = o.line ?? B.C.cell;
  for (let pass = 0; pass < 2; pass++) {
    c.fillStyle = pass ? col : ln;
    let cx = ax;
    for (let i = 0; i < str.length; i++) {
      const cc = str.charCodeAt(i), g = glyph(str[i], rows, font), dig = isDigit(cc), off = dig ? Math.round((dA - g.adv) / 2) : 0;
      for (let k = 0; k < g.on.length; k += 2) {
        const px = cx + (g.on[k] + off) * cell, py = y + (g.on[k + 1] - top) * cell;
        if (pass) c.fillRect(px, py, cell - gap, cell - gap);
        else c.fillRect(px - gap * 0.5, py - gap * 0.5, cell, cell);
      }
      cx += (dig ? dA : g.adv) * cell;
    }
  }
  c.restore();
  return sz;
}
// a block cursor in cells (rows x 0.55 rows), same 2-pass look
export function pixelBlock(c, x, y, wCells, hCells, cell, col, ln, alpha = 1) {
  const gap = Math.max(1, Math.round(cell / 6));
  c.save(); c.globalAlpha = alpha;
  c.fillStyle = ln; c.fillRect(x - gap * 0.5, y - gap * 0.5, wCells * cell, hCells * cell);
  c.fillStyle = col;
  for (let j = 0; j < hCells; j++) for (let i = 0; i < wCells; i++) c.fillRect(x + i * cell, y + j * cell, cell - gap, cell - gap);
  c.restore();
}

// ------------------------------------------------------------------------------------------------ ripple
// the payment tap: a circle growing from (cx, cy) to the farthest corner
export function rippleR(E, t, t0, cx, cy, dur = 0.55) {
  const far = Math.max(Math.hypot(cx, cy), Math.hypot(E.W - cx, cy), Math.hypot(cx, E.H - cy), Math.hypot(E.W - cx, E.H - cy));
  return t < t0 ? 0 : far * 1.04 * ease.outCubic(clamp((t - t0) / dur));
}

// ------------------------------------------------------------------------------------------------ the check
// The bill for the date, itemised from the meter itself (brand.initMeter), so its numbers match the spine:
// the date cost exactly his whole budget, 1,000,000 tokens. Static paper part cached at load.
export function checkItems(E) {
  const M = B.initMeter(E), norm = (s) => s.toLowerCase().replace(/[^a-z' -]/g, "").trim();
  const sum = {}, lines = {};
  for (const e of M.ev) {
    if (e.drain || e.fixed) continue;
    const w = E.words.find((x) => Math.abs(x.s - e.t) < 1e-6 && (B.speakerOf(x) === "HIM" || B.speakerOf(x) === "GANG"));
    if (!w) continue;
    const k = norm(w.line.text);
    sum[k] = (sum[k] ?? 0) + e.amt;
    (lines[k] ??= new Set()).add(w.li);
  }
  const pick = (k) => ({ n: lines[k]?.size ?? 0, v: sum[k] ?? 0 });
  const a = pick("see you after tokens"), b = pick("i'm an ai founder"), f = pick("founder");
  const items = [
    { l: "QUARTER-MILLION BURN", v: 250000 },
    { l: `"SEE YOU AFTER TOKENS" ×${a.n}`, v: a.v },
    { l: `"I'M AN AI FOUNDER" ×${b.n}`, v: b.v },
    { l: `"FOUNDER!" ×${f.n}`, v: f.v },
  ];
  const rest = 1e6 - items.reduce((s, x) => s + Math.round(x.v), 0);
  items.push({ l: "EVERYTHING ELSE HE SAID", v: rest });
  return items;
}
export function buildCheck(E, items) {
  const S = E.SCALE, w = Math.round(620 * S), h = Math.round(800 * S);
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const x = cv.getContext("2d"), ink = B.C.ink, pad = 44 * S;
  x.fillStyle = B.C.paper;
  x.fillRect(0, 0, w, h - 16 * S);
  // torn (zig-zag) bottom edge
  x.beginPath(); x.moveTo(0, h - 16 * S);
  const nz = 22;
  for (let i = 0; i <= nz; i++) x.lineTo((i / nz) * w, h - (i % 2 ? 2 : 16) * S);
  x.lineTo(w, h - 16 * S); x.closePath(); x.fill();
  const mono = (s, px, wt, col, al, align = "left", xx = pad, ls = 0.06) => {
    x.font = `${wt} ${px * S}px "JetBrains Mono"`; x.fillStyle = col; x.textAlign = align; x.textBaseline = "alphabetic";
    x.letterSpacing = `${ls * px * S}px`;
    x.fillText(s, xx, al);
  };
  let y = pad + 30 * S;
  mono("THE CHECK", 34, 800, ink, y);
  mono("#402", 34, 800, B.C.coral, y, "right", w - pad);
  y += 34 * S;
  mono("TABLE 2 · DATE NIGHT · 2 GUESTS", 19, 500, B.C.dgrey, y);
  const dash = (yy) => { x.fillStyle = B.C.inkA(0.35); for (let xx = pad; xx < w - pad; xx += 12 * S) x.fillRect(xx, yy, 6 * S, 2 * S); };
  y += 26 * S; dash(y); y += 40 * S;
  for (const it of items) {
    mono(it.l, 19, 600, ink, y);
    mono(B.fmtInt(it.v), 19, 600, ink, y, "right", w - pad);
    y += 34 * S;
  }
  y -= 8 * S; dash(y); y += 44 * S;
  mono("TOTAL DUE", 24, 800, ink, y);
  mono("TOKENS", 24, 800, ink, y, "right", w - pad);
  const totalY = y + 92 * S; // baseline of the big total (drawn live, so it can be circled)
  return { cv, w, h, totalY, pad, noteY: totalY + 92 * S };
}

// ------------------------------------------------------------------------------------------------ logo
// The official nav logo file, untouched (its own gradient), rasterised once at the size it is drawn.
export async function loadLogo(widthPx) {
  const img = new Image();
  img.src = "/assets/brand/stigg_logo_nav.svg";
  await img.decode();
  const w = Math.round(widthPx), h = Math.round((widthPx * 26) / 93), cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  cv.getContext("2d").drawImage(img, 0, 0, w, h);
  return cv;
}

// small mono label with tracking (UI chrome)
export function label(E, c, s, x, y, o = {}) {
  const S = E.SCALE, px = (o.size ?? 22) * S;
  c.save();
  c.globalAlpha = o.alpha ?? 1;
  c.font = `${o.weight ?? 700} ${px}px "JetBrains Mono"`;
  c.letterSpacing = `${(o.tracking ?? 0.12) * px}px`;
  c.fillStyle = o.color ?? B.C.white;
  c.textAlign = o.align ?? "left";
  c.textBaseline = o.baseline ?? "middle";
  c.fillText(s, x, y);
  const w = c.measureText(s).width;
  c.restore();
  return w;
}
export { B, clamp, lerp, ease, hash1 };

// punch-in: scale a plate layout by k around the screen point of a video-UV point (a crash zoom on a face)
export function punch(E, v, opts, uv, k) {
  const r = E.plateRect(E, v, opts), [px, py] = E.plateToScreen(E, v, uv, opts);
  return { ...opts, zoom: opts.zoom * k, x: (px + (r.cx - px) * k - E.W / 2) / E.SCALE, y: (py + (r.cy - py) * k - E.H / 2) / E.SCALE };
}

// A slow camera push for quiet holds (nothing on screen may freeze). The plate is scaled by k around the screen point
// P (punchScreen); 2D layers drawn inside camOn(c, P, k) get the same transform, so graphics placed from the
// UNPUNCHED plate layout (tracked points included) stay locked to the footage.
export function punchScreen(E, v, opts, P, k) {
  const r = E.plateRect(E, v, opts);
  return { ...opts, zoom: opts.zoom * k, x: (P[0] + (r.cx - P[0]) * k - E.W / 2) / E.SCALE, y: (P[1] + (r.cy - P[1]) * k - E.H / 2) / E.SCALE };
}
export function camOn(c, P, k) {
  c.translate(P[0], P[1]);
  c.scale(k, k);
  c.translate(-P[0], -P[1]);
}
