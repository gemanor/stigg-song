// Stigg brand kit shared by every scene: palette, the TOKEN METER (the video's spine), After Tokens pixel-grid type,
// corner crosshairs and hairlines, HER's red pen (strikes, circles, arrows, stamps), and the SEE YOU AFTER TOKENS lockup.
// Everything is deterministic: a pure function of song time t. Import as `import * as B from "../brand.js"`.
import { clamp, lerp, ease, hash1 } from "./core.js";

// ---------------------------------------------------------------------------------------------------------------- palette
export const C = {
  bg: "#131512", void: "#000000", white: "#FFFFFF", paper: "#F9F8F5", ink: "#131512",
  green: "#92E759", mint: "#6BF8C2", cyan: "#69FFF1", coral: "#FF776D",
  line: "#393A38", cell: "#436633", panel: "#1E211F", grey: "#959595", dgrey: "#5A5B5A",
  dgreen: "#1B4D39", pale: "#DEFCCA",
  greenA: (a) => `rgba(146,231,89,${a})`, coralA: (a) => `rgba(255,119,109,${a})`, whiteA: (a) => `rgba(255,255,255,${a})`,
  inkA: (a) => `rgba(19,21,18,${a})`,
};
export const FONT = { hero: "Inter Tight", grot: "Archivo", black: "Archivo Black", mono: "JetBrains Mono", serif: "Instrument Serif" };

// song events (audio/im_an_ai_founder_v5_cues.json)
export const EV = { musicStop: 143.996, tokensWord: 144.02, chime: 147.816, reprise: 148.366, stab: 156.066, end: 157.986 };

export const fmtInt = (n) => Math.max(0, Math.round(n)).toLocaleString("en-US");
export function fmtShort(n) {
  n = Math.max(0, n);
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.?0+$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
  return String(Math.round(n));
}

// ---------------------------------------------------------------------------------------------------------- speakers
// lyrics.json lines carry `speaker`: HIM | HER | GANG | ALL. E.words[i].line.speaker. Helpers:
export const speakerOf = (w) => w?.line?.speaker ?? "HIM";
export const isHim = (w) => speakerOf(w) === "HIM";
export const isHer = (w) => speakerOf(w) === "HER";

// ---------------------------------------------------------------------------------------------------------- TOKEN METER
// Starts at 1,000,000. Every word HE sings or says burns tokens (a short linear roll on its onset); the GANG chant burns more;
// "quarter-million" burns 250,000; the balance is steered to ~60k (LOW BALANCE) by the end of the final chorus, then the
// outro drains the rest so it hits exactly 0 on the music cut (143.996). 147.816: she pays, a top-up rolls it back to 1M.
const START = 1e6, QUARTER = 250000, END_OF_CHORUS3 = 134.5, LEFT_AT_OUTRO = 60000, TOPUP = 1e6;
let MET = null;
export function initMeter(E) {
  if (MET) return MET;
  const ev = [];
  let wsum = 0;
  E.words.forEach((w, i) => {
    const sp = speakerOf(w);
    if (w.s >= END_OF_CHORUS3 || (sp !== "HIM" && sp !== "GANG")) return;
    if (/quarter/i.test(w.w)) { ev.push({ t: w.s, fixed: QUARTER, dur: 0.45 }); return; }
    const chorus = /chorus/.test(w.section);
    const wt = sp === "GANG" ? 5 : (1 + 0.8 * hash1(i * 13.7)) * (chorus ? 1.6 : 1);
    ev.push({ t: w.s, w: wt, dur: 0.1 }); wsum += wt;
  });
  const k = (START - QUARTER - LEFT_AT_OUTRO) / wsum;   // tokens per weight unit
  for (const e of ev) e.amt = e.fixed ?? e.w * k;
  // outro: small burns on his outro words, then the drain to 0 on the cut
  const outro = E.words.filter((w) => w.s >= END_OF_CHORUS3 && w.s < EV.musicStop && isHim(w));
  let left = LEFT_AT_OUTRO;
  const sorry = outro.find((w) => /sorry/i.test(w.w));
  for (const w of outro) if (!sorry || w.s < sorry.s) { const a = 1800 + 1400 * hash1(w.s); ev.push({ t: w.s, amt: a, dur: 0.1 }); left -= a; }
  const drainT0 = sorry ? sorry.s : EV.musicStop - 1.4;
  ev.push({ t: drainT0, amt: left, dur: EV.musicStop - drainT0, drain: true });
  ev.sort((a, b) => a.t - b.t);
  let cum = 0;
  for (const e of ev) { e.before = cum; cum += e.amt; }
  MET = { ev, total: cum };
  return MET;
}
// balance at song time t
export function tokensAt(E, t) {
  const M = initMeter(E);
  if (t >= EV.chime) return lerp(0, TOPUP, ease.outCubic(clamp((t - EV.chime - 0.12) / 0.55)));
  if (t >= EV.musicStop) return 0;
  let lo = 0, hi = M.ev.length - 1, r = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (M.ev[m].t <= t) { r = m; lo = m + 1; } else hi = m - 1; }
  if (r < 0) return START;
  // events can overlap (the drain); sum the finished ones and the running parts of the recent ones
  let spent = 0;
  for (let i = 0; i <= r; i++) {
    const e = M.ev[i], u = clamp((t - e.t) / e.dur);
    spent += e.amt * (e.drain ? ease.inQuad(u) : u);
  }
  return Math.max(0, START - spent);
}
// tokens burned per second, averaged over the last `win` seconds (for "BURN 12.4K/s" readouts)
export const burnRate = (E, t, win = 1) => Math.max(0, (tokensAt(E, t - win) - tokensAt(E, t)) / win);
export const meterState = (E, t) => {
  const v = tokensAt(E, t);
  if (t >= EV.chime) return { v, label: "TOP-UP APPROVED", state: "topup" };
  if (t >= EV.musicStop) return { v: 0, label: "USAGE BLOCKED", state: "blocked" };
  if (v < 0.1 * START) return { v, label: "LOW BALANCE", state: "low" };
  return { v, label: "TOKEN BUDGET", state: "ok" };
};

// ---------------------------------------------------------------------------------------------------- pixel-grid type
// Stigg's After Tokens banner look: glyphs made of bright-green cells split by 1-px darker-green lines.
// The glyph bitmap is cached per (text, rows, font); drawing is ~2 fillRects per lit cell.
const _pix = new Map();
function pixelBitmap(text, rows, font) {
  const key = `${text}|${rows}|${font}`;
  if (_pix.has(key)) return _pix.get(key);
  const fs = rows * 1.36, cv = document.createElement("canvas"), x = cv.getContext("2d");
  x.font = `${font.includes("Inter") ? "900 " : ""}${fs}px "${font}"`;
  const w = Math.ceil(x.measureText(text).width) + 4, h = Math.ceil(fs * 1.25);
  cv.width = w; cv.height = h;
  x.font = `${font.includes("Inter") ? "900 " : ""}${fs}px "${font}"`; x.fillStyle = "#fff"; x.textBaseline = "alphabetic";
  x.fillText(text, 2, Math.round(fs * 0.98));
  const d = x.getImageData(0, 0, w, h).data, on = [];
  let minY = h, maxY = 0, minX = w, maxX = 0;
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (d[(yy * w + xx) * 4 + 3] > 110) { on.push(xx, yy); minY = Math.min(minY, yy); maxY = Math.max(maxY, yy); minX = Math.min(minX, xx); maxX = Math.max(maxX, xx); }
  const bm = { on: new Int16Array(on), cols: maxX - minX + 1, rows: maxY - minY + 1, ox: minX, oy: minY };
  _pix.set(key, bm);
  return bm;
}
// Draw pixel type. (x, y) = top-left (align:'left'), top-center ('center') or top-right ('right') in px.
// o: {rows: cap height in cells (default 12), cell: px per cell, color, line, alpha, font, align,
//     reveal: 0..1 (cells fly in from scattered positions and settle, the banner's particle build), seed}
// Returns {w, h} in px.
export function pixelText(ctx, text, x, y, o = {}) {
  const rows = o.rows ?? 12, cell = o.cell ?? 6, font = o.font ?? FONT.black;
  const bm = pixelBitmap(text, rows, font), w = bm.cols * cell, h = bm.rows * cell;
  const ax = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  const rev = o.reveal ?? 1, seed = o.seed ?? 1, gap = Math.max(1, Math.round(cell / 6));
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
  const col = o.color ?? C.green, ln = o.line ?? C.cell;
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass ? col : ln;
    for (let i = 0; i < bm.on.length; i += 2) {
      const cx = bm.on[i] - bm.ox, cy = bm.on[i + 1] - bm.oy;
      let px = ax + cx * cell, py = y + cy * cell;
      if (rev < 1) {
        const hsh = hash1(i * 0.37 + seed * 17.1), u = ease.outCubic(clamp((rev - hsh * 0.45) / 0.55));
        if (u <= 0) continue;
        const ang = hash1(i * 1.91 + seed) * 6.283, r = (1 - u) * (120 + 380 * hash1(i * 3.3 + seed)) * (cell / 6);
        px += Math.cos(ang) * r; py += Math.sin(ang) * r;
      }
      if (pass) ctx.fillRect(px, py, cell - gap, cell - gap); else ctx.fillRect(px - gap * 0.5, py - gap * 0.5, cell, cell);
    }
  }
  ctx.restore();
  return { w, h };
}
export const pixelSize = (text, o = {}) => { const bm = pixelBitmap(text, o.rows ?? 12, o.font ?? FONT.black); return { w: bm.cols * (o.cell ?? 6), h: bm.rows * (o.cell ?? 6) }; };

// --------------------------------------------------------------------------------------------------- frame furniture
// The banner's corner motif: two short rules per corner plus a crosshair at the first crossing.
export function crosshairs(ctx, x, y, w, h, o = {}) {
  const L = o.len ?? 34, inset = o.inset ?? 14, lw = o.lw ?? 1, col = o.color ?? C.greenA(0.55), cr = o.cross ?? 7;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    ctx.moveTo(cx, cy + sy * inset); ctx.lineTo(cx + sx * L, cy + sy * inset);
    ctx.moveTo(cx + sx * inset, cy); ctx.lineTo(cx + sx * inset, cy + sy * L);
    const px = cx + sx * inset, py = cy + sy * inset;
    ctx.moveTo(px - cr, py); ctx.lineTo(px + cr, py); ctx.moveTo(px, py - cr); ctx.lineTo(px, py + cr);
  }
  ctx.stroke(); ctx.restore();
}
// hairline grid (look A / E grounds). Pass `t` + `drift` for a slow scroll.
export function hairGrid(ctx, x, y, w, h, o = {}) {
  const step = o.step ?? 96, col = o.color ?? C.line, lw = o.lw ?? 1, ox = ((o.offX ?? 0) % step + step) % step, oy = ((o.offY ?? 0) % step + step) % step;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.globalAlpha = o.alpha ?? 1; ctx.beginPath();
  for (let xx = x + ox; xx <= x + w; xx += step) { ctx.moveTo(Math.round(xx) + 0.5, y); ctx.lineTo(Math.round(xx) + 0.5, y + h); }
  for (let yy = y + oy; yy <= y + h; yy += step) { ctx.moveTo(x, Math.round(yy) + 0.5); ctx.lineTo(x + w, Math.round(yy) + 0.5); }
  ctx.stroke(); ctx.restore();
}
// full-width green rules at 45% alpha (the banner's top/bottom rules)
export function rules(ctx, y0, y1, W, o = {}) {
  ctx.save(); ctx.fillStyle = o.color ?? C.greenA(0.45);
  ctx.fillRect(0, Math.round(y0), W, o.lw ?? 1); ctx.fillRect(0, Math.round(y1), W, o.lw ?? 1); ctx.restore();
}

// ------------------------------------------------------------------------------------------------------- HER's red pen
// Hand-drawn strokes drawn on over [t0, t0+dur] (linear). Deterministic wobble from `seed`. Width/sizes in px.
function wob(i, seed, amp) { return (hash1(i * 7.13 + seed * 3.7) - 0.5) * 2 * amp; }
function strokePath(ctx, pts, p, o) {
  const n = pts.length, upto = clamp(p) * (n - 1);
  if (upto <= 0) return;
  ctx.save(); ctx.strokeStyle = o.color ?? C.coral; ctx.lineWidth = o.width ?? 8; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.globalAlpha = o.alpha ?? 1; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  const k = Math.floor(upto);
  for (let i = 1; i <= k; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (k < n - 1) { const f = upto - k; ctx.lineTo(lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)); }
  ctx.stroke(); ctx.restore();
}
export function penStrike(ctx, x0, y, x1, t, t0, o = {}) {
  const dur = o.dur ?? 0.12, seed = o.seed ?? 1, amp = o.amp ?? 4, N = 14, pts = [];
  for (let i = 0; i < N; i++) { const u = i / (N - 1); pts.push([lerp(x0 - 8, x1 + 8, u), y + wob(i, seed, amp) + (u - 0.5) * (o.tilt ?? -6)]); }
  strokePath(ctx, pts, (t - t0) / dur, o);
}
export function penCircle(ctx, cx, cy, rx, ry, t, t0, o = {}) {
  const dur = o.dur ?? 0.25, seed = o.seed ?? 1, N = 40, turns = o.turns ?? 1.12, pts = [];
  for (let i = 0; i < N; i++) { const a = -2.2 + (i / (N - 1)) * turns * 6.283, j = 1 + wob(i, seed, 0.045); pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); }
  strokePath(ctx, pts, (t - t0) / dur, o);
}
export function penUnderline(ctx, x0, y, x1, t, t0, o = {}) { penStrike(ctx, x0, y, x1, t, t0, { tilt: 3, amp: 2.5, ...o }); }
export function penArrow(ctx, x0, y0, x1, y1, t, t0, o = {}) {
  const dur = o.dur ?? 0.18, seed = o.seed ?? 1, N = 16, pts = [], bend = o.bend ?? 0.18;
  const mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend;
  for (let i = 0; i < N; i++) { const u = i / (N - 1), a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; pts.push([a * x0 + b * mx + c * x1 + wob(i, seed, 1.5), a * y0 + b * my + c * y1 + wob(i + 50, seed, 1.5)]); }
  const p = (t - t0) / dur; strokePath(ctx, pts, p, o);
  if (p >= 1) { // head
    const ang = Math.atan2(y1 - pts[N - 3][1], x1 - pts[N - 3][0]), hl = (o.width ?? 8) * 3.2;
    strokePath(ctx, [[x1 - Math.cos(ang - 0.5) * hl, y1 - Math.sin(ang - 0.5) * hl], [x1, y1], [x1 - Math.cos(ang + 0.5) * hl, y1 - Math.sin(ang + 0.5) * hl]], clamp((t - t0 - dur) / 0.06), o);
  }
}
// HER's handwritten note: Instrument Serif Italic in coral, typed on by characters at `cps` from t0.
export function penNote(E, ctx, text, x, y, t, t0, o = {}) {
  const cps = o.cps ?? 28, n = Math.floor(clamp((t - t0) * cps / Math.max(1, text.length)) * text.length);
  if (t < t0 || n <= 0) return;
  E.drawText(ctx, text.slice(0, n), x, y, { font: FONT.serif, italic: true, weight: 400, size: o.size ?? 64, color: o.color ?? C.coral, align: o.align ?? "left", rot: o.rot ?? -0.03, alpha: o.alpha ?? 1 });
}
// A rubber stamp (DECLINED / BLOCKED / WAITLISTED): slams from 1.35x to 1 over 0.14 s, slight rotation, double border.
export function stamp(E, ctx, text, cx, cy, t, t0, o = {}) {
  if (t < t0) return;
  const S = o.S ?? 1, size = (o.size ?? 120) * S, col = o.color ?? C.coral, u = ease.outCubic(clamp((t - t0) / 0.14));
  const sc = lerp(1.35, 1, u), a = clamp((t - t0) / 0.05) * (o.alpha ?? 1);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot ?? -0.12); ctx.scale(sc, sc); ctx.globalAlpha = a;
  ctx.font = `900 ${size}px "${FONT.hero}"`; const tw = ctx.measureText(text).width, padX = size * 0.35, padY = size * 0.22;
  const w = tw + padX * 2, h = size + padY * 2;
  ctx.strokeStyle = col; ctx.lineWidth = size * 0.07; ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.lineWidth = size * 0.025; ctx.strokeRect(-w / 2 + size * 0.11, -h / 2 + size * 0.11, w - size * 0.22, h - size * 0.22);
  ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 0, size * 0.04);
  ctx.restore();
}

// --------------------------------------------------------------------------------------- SEE YOU AFTER TOKENS lockup
// The banner lockup: "SEE YOU AFTER" in white heavy grotesk + "TOKENS" in pixel-grid green, between two green rules,
// inside corner crosshairs. Each word lands on its sung onset when `words` (the 4 lyric words) is passed.
// (cx, cy) = center. o.size = cap height of the grotesk line in px. Returns the lockup box.
export function afterTokens(E, ctx, cx, cy, t, o = {}) {
  const S = E.SCALE, size = (o.size ?? 120) * S, ws = o.words ?? null, ink = o.ink ?? C.white;
  const on = (i) => (ws ? clamp((t - ws[i].s + 0.04) / 0.08) : 1);
  const font = { font: FONT.hero, weight: 900, size, tracking: -0.02, color: ink };
  const top = "SEE YOU AFTER", topW = E.measure(ctx, top, font), cell = Math.max(2, Math.round(size / 12)), rows = 13;
  const pz = pixelSize("TOKENS", { rows, cell }), W = Math.max(topW, pz.w), H = size * 1.08 + pz.h + size * 0.35;
  const x0 = cx - W / 2, y0 = cy - H / 2;
  // words: SEE / YOU / AFTER land one by one
  const parts = ["SEE ", "YOU ", "AFTER"]; let xx = cx - topW / 2;
  parts.forEach((p, i) => {
    const pw = E.measure(ctx, p, font), u = on(i);
    if (u > 0) E.drawText(ctx, p, xx, y0 + size * 0.86, { ...font, align: "left", alpha: u, sy: lerp(1.25, 1, ease.outBack(u)) });
    xx += pw;
  });
  const ut = ws ? clamp((t - ws[3].s + 0.06) / 0.35) : 1;
  if (ut > 0) pixelText(ctx, "TOKENS", cx, y0 + size * 1.25, { rows, cell, align: "center", reveal: ut, color: o.tokenColor ?? C.green, line: o.tokenLine ?? C.cell, seed: o.seed ?? 3 });
  const m = 26 * S;
  rules(ctx, y0 - m, y0 + H + m * 0.6, E.W, { color: o.ruleColor ?? C.greenA(0.45) });
  crosshairs(ctx, x0 - m * 1.6, y0 - m, W + m * 3.2, H + m * 1.6, { color: o.ruleColor ?? C.greenA(0.55), len: 34 * S, inset: 12 * S, cross: 7 * S });
  return { x: x0, y: y0, w: W, h: H };
}
