// Look E (TERMINAL) kit shared by A4's two sections: skit2.js (agents for agents) and bridge.js (due-diligence form).
// Dark UI on #131512: panels #1E211F with 1-px #393A38 borders, mono labels, green = live/HIM, coral = blocked/HER.
// Everything is a pure function of song time t (no state, no Math.random). Owner: A4.
import * as B from "../../brand.js";
import { clamp, lerp, ease, hash1, fract } from "../../core.js";

export const K = {
  bg: B.C.bg, panel: B.C.panel, line: B.C.line, ink: B.C.paper, white: B.C.white, green: B.C.green, coral: B.C.coral,
  grey: B.C.grey, dgrey: B.C.dgrey, well: "#171916", lilac: "#B9A7E8",
  dim: (a) => `rgba(249,248,245,${a})`,
};
export const F = { mono: B.FONT.mono, hero: B.FONT.hero, serif: B.FONT.serif, grot: B.FONT.grot };

// ---------------------------------------------------------------------------------------------------- clips
// A clip that has not landed yet loads as null; scenes fall back to a slot until it exists.
export async function tryClip(E, name) {
  try { const v = await E.loadVideo(name); return v && v.meta && v.meta.n > 0 ? v : null; } catch (e) { return null; }
}
// keep a clip's local time strictly inside the clip (a held last frame reads as a freeze)
export const inClip = (v, lt) => clamp(lt, 0, v.meta.dur - 0.5 / v.meta.fps);

// smooth a pose landmark over +-2 frames (raw jitter looks cheap). Returns video UV or null.
export function smoothPt(v, lt, idx, minVis = 0.35) {
  if (!v || !v.track) return null;
  let x = 0, y = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const tr = v.trackAt(inClip(v, lt + k / v.meta.fps)), p = tr?.pose?.[idx];
    if (p && p[2] > minVis) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
// mean of several landmarks (e.g. mouth corners 9/10, eyes 2/5), smoothed
export function smoothMean(v, lt, ids, minVis = 0.35) {
  let x = 0, y = 0, n = 0;
  for (const i of ids) { const p = smoothPt(v, lt, i, minVis); if (p) { x += p[0]; y += p[1]; n++; } }
  return n ? [x / n, y / n] : null;
}

// ---------------------------------------------------------------------------------------------------- ground + chrome
export function ground(E, c, o = {}) {
  const S = E.SCALE;
  c.fillStyle = K.bg; c.fillRect(0, 0, E.W, E.H);
  B.hairGrid(c, 0, 0, E.W, E.H, { step: (o.step ?? 96) * S, alpha: o.alpha ?? 0.5, offX: o.offX ?? 0, offY: o.offY ?? 0 });
}
// UI panel: fill, 1-px border, optional title bar with three dots and a mono title (left) / status (right)
export function panel(E, c, x, y, w, h, o = {}) {
  const S = E.SCALE, r = (o.r ?? 10) * S, lw = Math.max(1, S);
  c.save();
  c.globalAlpha = o.alpha ?? 1;
  c.beginPath(); c.roundRect(x, y, w, h, r);
  c.fillStyle = o.fill ?? K.panel; c.fill();
  c.lineWidth = (o.lw ?? 1) * lw; c.strokeStyle = o.border ?? K.line; c.stroke();
  if (o.title != null) {
    const th = (o.titleH ?? 46) * S;
    c.fillStyle = o.border ?? K.line; c.fillRect(x, y + th, w, lw);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(x + (22 + i * 20) * S, y + th / 2, 5 * S, 0, 6.283); c.fillStyle = i === 0 && o.dot ? o.dot : K.line; c.fill(); }
    mono(E, c, o.title, x + 90 * S, y + th / 2, { size: o.titleSize ?? 19, color: K.grey, alpha: o.alpha ?? 1 });
    if (o.status) mono(E, c, o.status, x + w - 22 * S, y + th / 2, { size: o.titleSize ?? 19, color: o.statusColor ?? K.grey, align: "right", alpha: o.alpha ?? 1 });
  }
  c.restore();
}

// ---------------------------------------------------------------------------------------------------- type roles
// MONO: JetBrains Mono, uppercase labels with +0.08em tracking. size in 1080p px.
export function mono(E, c, text, x, y, o = {}) {
  E.drawText(c, o.upper === false ? text : text.toUpperCase(), x, y, {
    font: F.mono, weight: o.weight ?? 600, size: (o.size ?? 22) * E.SCALE, tracking: o.tracking ?? 0.08,
    color: o.color ?? K.ink, align: o.align ?? "left", alpha: o.alpha ?? 1, s: o.s, rot: o.rot,
  });
}
// HER: Instrument Serif Italic coral, sentence case (weight 400: the face has no bold, never synthesize one)
export function serif(E, c, text, x, y, o = {}) {
  E.drawText(c, text, x, y, {
    font: F.serif, italic: true, weight: 400, size: (o.size ?? 72) * E.SCALE, tracking: o.tracking ?? -0.005,
    color: o.color ?? K.coral, align: o.align ?? "left", alpha: o.alpha ?? 1, s: o.s, sx: o.sx, sy: o.sy, rot: o.rot,
    baseline: o.baseline,
  });
}
// HIM: Inter Tight 900 uppercase hype
export function hype(E, c, text, x, y, o = {}) {
  E.drawText(c, text, x, y, {
    font: F.hero, weight: o.weight ?? 900, size: (o.size ?? 120) * E.SCALE, tracking: o.tracking ?? -0.025,
    color: o.color ?? K.white, align: o.align ?? "left", alpha: o.alpha ?? 1, s: o.s, sx: o.sx, sy: o.sy, rot: o.rot,
    baseline: o.baseline,
  });
}
export const fontOf = (role, size, E) =>
  role === "serif" ? { font: F.serif, italic: true, weight: 400, size: size * E.SCALE, tracking: -0.005 }
  : role === "mono" ? { font: F.mono, weight: 600, size: size * E.SCALE, tracking: 0.08 }
  : { font: F.hero, weight: 900, size: size * E.SCALE, tracking: -0.025 };

// ---------------------------------------------------------------------------------------------------- typing
// Words typed on their onsets: each word's letters type in over min(its sung length, cap) from w.s.
// words: [{w, s, e}], disp: the display strings per word (e.g. uppercased). Returns the visible string.
export function typedWords(words, disp, t, cap = 0.22) {
  let out = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (t < w.s - 0.017) break;
    const d = disp[i], dur = clamp(w.e - w.s, 0.05, cap);
    const n = Math.max(1, Math.ceil(clamp((t - w.s + 0.017) / dur) * d.length));
    out += (i ? " " : "") + d.slice(0, n);
  }
  return out;
}
// block cursor, blinks on the beat (on for the first half of each beat)
export function cursor(E, c, t, x, y, w, h, color = K.green, alpha = 1) {
  if (E.beat(t).phase >= 0.5) return;
  c.save(); c.globalAlpha = alpha; c.fillStyle = color; c.fillRect(x, y, w, h); c.restore();
}

// ---------------------------------------------------------------------------------------------------- logs on 16ths
// lines: [{t, text, color}] (t = print time). Draws the last `rows` printed lines, newest at the bottom.
export function drawLog(E, c, lines, t, x, y, o = {}) {
  const S = E.SCALE, lh = (o.lh ?? 34) * S, rows = o.rows ?? 8, size = o.size ?? 21;
  let last = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].t <= t) last = i;
  if (last < 0) return;
  const first = Math.max(0, last - rows + 1);
  for (let i = first; i <= last; i++) {
    const L = lines[i], row = i - first, age = t - L.t;
    const a = (o.alpha ?? 1) * (i === last ? 1 : lerp(0.92, 0.5, (last - i) / rows));
    const txt = age < 0.06 ? L.text.slice(0, Math.ceil(L.text.length * clamp(age / 0.06))) : L.text;
    mono(E, c, txt, x, y + row * lh, { size, color: L.color ?? K.ink, alpha: a, upper: false, tracking: 0.02, weight: L.weight ?? 500 });
  }
  // block cursor after the newest line
  if (o.cursor !== false) {
    const L = lines[last], tw = E.measure(c, L.text, { font: F.mono, weight: 500, size: size * S, tracking: 0.02 });
    cursor(E, c, t, x + tw + 8 * S, y + (last - first) * lh - 11 * S, 12 * S, 22 * S, o.cursorColor ?? K.green, o.alpha ?? 1);
  }
}
// print times: bursts of `n` lines at 16th-note spacing starting on each of `starts` (seconds)
export function burstTimes(E, starts, n = 4) {
  const st = E.spb / 4, out = [];
  for (const s of starts) for (let k = 0; k < n; k++) out.push(s + k * st);
  return out;
}

// ---------------------------------------------------------------------------------------------------- odometer
// Mechanical counter: one wheel per digit, the wheel turns while the digits below it roll over. Linear value.
// (x, y) = top-left. o: {digits, cw, ch, size, color, gap, commas, label, cell, border}
export function odometer(E, c, value, x, y, o = {}) {
  const S = E.SCALE, n = o.digits ?? 9, cw = (o.cw ?? 64) * S, ch = (o.ch ?? 92) * S, gap = (o.gap ?? 6) * S, size = (o.size ?? 64) * S;
  const comma = o.commas !== false ? (o.commaW ?? 18) * S : 0, v = Math.max(0, value);
  const font = { font: F.mono, weight: 700, size, tracking: 0, color: o.color ?? K.ink, align: "center" };
  let xx = x;
  const xs = [];
  for (let i = n - 1; i >= 0; i--) { xs.push(xx); xx += cw + gap; if (i && i % 3 === 0) xx += comma; }
  const W = xx - gap - x;
  c.save();
  for (let k = 0; k < n; k++) {
    const i = n - 1 - k, p = 10 ** i, u = v / p;
    const d = Math.floor(u) % 10;
    const f = i === 0 ? fract(v) : clamp((v % p) - (p - 1));
    const lead = v < p && i > 0;   // leading zeros dimmed
    const cx = xs[k];
    c.fillStyle = o.cell ?? "#0E100D"; c.fillRect(cx, y, cw, ch);
    c.save(); c.beginPath(); c.rect(cx, y, cw, ch); c.clip();
    const yy = y + ch / 2 + 2 * S;
    const col = lead ? K.dgrey : (o.color ?? K.ink);
    E.drawText(c, String(d), cx + cw / 2, yy - f * ch, { ...font, color: col });
    E.drawText(c, String((d + 1) % 10), cx + cw / 2, yy + (1 - f) * ch, { ...font, color: col });
    // wheel shading: darker top and bottom bands (a printed gradient, not a filter on footage)
    c.fillStyle = "rgba(0,0,0,0.38)"; c.fillRect(cx, y, cw, ch * 0.16); c.fillRect(cx, y + ch * 0.84, cw, ch * 0.16);
    c.restore();
    c.strokeStyle = o.border ?? K.line; c.lineWidth = Math.max(1, S); c.strokeRect(cx + 0.5, y + 0.5, cw - 1, ch - 1);
    if (i && i % 3 === 0 && comma) E.drawText(c, ",", cx + cw + gap / 2 + comma / 2, y + ch * 0.78, { ...font, size: size * 0.8, color: K.grey });
  }
  // the hairline through the middle, like a real counter window
  c.fillStyle = o.accent ?? K.grey; c.globalAlpha = 0.25; c.fillRect(x - 6 * S, y + ch / 2, W + 12 * S, Math.max(1, S));
  c.restore();
  return { w: W, h: ch };
}

// ---------------------------------------------------------------------------------------------------- the spine
// tokens HIS word burns: the meter's own event for that onset (brand.initMeter), so numbers never disagree with the meter
export function burnOf(E, w) {
  const M = B.initMeter(E);
  let lo = 0, hi = M.ev.length - 1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (M.ev[m].t < w.s - 1e-6) lo = m + 1; else hi = m - 1; }
  const e = M.ev[lo];
  return e && Math.abs(e.t - w.s) < 1e-6 ? e.amt : 0;
}
// "-2,594" ticks on each of his words (the spine). pos(ts) -> {x, y, fw} = mouth in screen px + face width, or null.
// They launch BESIDE the face (o.side: -1 left, +1 right) and rise away from it, so type never crosses a face.
export function tokenTicks(E, c, t, words, pos, o = {}) {
  const S = E.SCALE, side = o.side ?? -1, lh = (o.size ?? 30) * 1.15 * S;
  let slot = 0;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    // consecutive words (< 0.5 s apart) stack like receipt lines; a pause starts a new stack
    slot = i > 0 && w.s - words[i - 1].s < 0.5 ? slot + 1 : 0;
    const age = t - w.s;
    if (age < -0.02 || age > 0.9) continue;
    const p = pos(w.s); if (!p) continue;
    const amt = burnOf(E, w); if (amt < 1) continue;
    const u = clamp(age / 0.9), a = clamp((age + 0.02) / 0.05) * (1 - ease.inQuad(u));
    const x0 = p.x + side * (p.fw * 0.62 + 16 * S);
    const x = x0 + side * 30 * S * ease.outCubic(u), y = p.y + slot * lh - 90 * S * ease.outCubic(u) - 20 * S;
    mono(E, c, "-" + B.fmtInt(amt), x, y, { size: o.size ?? 30, weight: 700, color: K.green, alpha: a, align: side < 0 ? "right" : "left", tracking: 0.02 });
  }
}
// mouth + face width of a tracked character at clip time lt, in screen px (for tokenTicks)
export function mouthOf(E, v, lt, o) {
  const m = smoothMean(v, lt, [9, 10]), l = smoothPt(v, lt, 2), r = smoothPt(v, lt, 5);
  if (!m || !l || !r) return null;
  const [x, y] = E.plateToScreen(E, v, m, o), [lx] = E.plateToScreen(E, v, l, o), [rx] = E.plateToScreen(E, v, r, o);
  return { x, y, fw: Math.abs(lx - rx) * 2.6 };
}
// voice level bars (vocal envelope, 5 bars) drawn at (x, y) = left baseline
export function voiceBars(E, c, t, x, y, o = {}) {
  const S = E.SCALE, n = o.n ?? 5, bw = (o.bw ?? 7) * S, gap = (o.gap ?? 5) * S, hmax = (o.h ?? 46) * S;
  c.save(); c.fillStyle = o.color ?? K.coral; c.globalAlpha = o.alpha ?? 1;
  for (let i = 0; i < n; i++) {
    const e = clamp(E.env("vocal", t - i * 0.035) * (0.7 + 0.6 * hash1(i * 3.7)) * (o.gain ?? 1.2));
    const h = Math.max(3 * S, hmax * e);
    c.fillRect(x + i * (bw + gap), y - h, bw, h);
  }
  c.restore();
}
// A bracket box (4 corner ticks) around a rect: the terminal's "active speaker" frame
export function brackets(E, c, x, y, w, h, o = {}) {
  const S = E.SCALE, L = (o.len ?? 26) * S;
  c.save(); c.strokeStyle = o.color ?? K.green; c.lineWidth = (o.lw ?? 2) * S; c.globalAlpha = o.alpha ?? 1; c.beginPath();
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    c.moveTo(cx + sx * L, cy); c.lineTo(cx, cy); c.lineTo(cx, cy + sy * L);
  }
  c.stroke(); c.restore();
}

// ---------------------------------------------------------------------------------------------------- the HUD meter, flown
// A faithful copy of scenes/hud.js drawMeter at scale k, so the meter can leave its HUD corner and come back seamlessly
// (the scene sets E.hud.meter = false while its copy is on screen). Values always come from brand.tokensAt.
export function meterCopy(E, c, t, x, y, k = 1, o = {}) {
  const S = E.SCALE * k, st = B.meterState(E, t), v = st.v, dark = true;
  const ink = B.C.white, dim = B.C.whiteA(0.45);
  const warn = st.state === "low" || st.state === "blocked";
  c.save();
  c.globalAlpha = o.alpha ?? 1;
  c.font = `700 ${14 * S}px "JetBrains Mono"`; c.textBaseline = "middle"; c.textAlign = "left"; c.letterSpacing = `${1.8 * S}px`;
  c.fillStyle = o.label ? K.green : warn ? B.C.coral : ink;
  c.fillText(o.label ?? st.label, x, y + 8 * S);
  const val = B.fmtInt(v), cell = Math.max(2, Math.round(4 * S));
  B.pixelText(c, val, x, y + 24 * S, { rows: 9, cell, color: warn ? B.C.coral : B.C.green, line: warn ? "#7a2a26" : B.C.cell, alpha: o.alpha ?? 1 });
  const by = y + 24 * S + 10 * cell + 12 * S, bw = 300 * S, bh = 6 * S, f = clamp(v / 1e6);
  c.fillStyle = B.C.line; c.fillRect(x, by, bw, bh);
  c.fillStyle = warn ? B.C.coral : B.C.green; c.fillRect(x, by, bw * f, bh);
  for (let q = 1; q < 10; q++) { c.fillStyle = B.C.bg; c.fillRect(x + (bw * q) / 10 - 0.5 * S, by, 1 * S, bh); }
  c.font = `600 ${13 * S}px "JetBrains Mono"`; c.fillStyle = dim;
  c.fillText(o.foot ?? `BURN ${B.fmtShort(B.burnRate(E, t, 1))}/s`, x, by + 22 * S);
  c.restore();
  return { w: 300 * S, h: by + 22 * S - y };
}
// where the HUD draws its meter (scenes/hud.js: left = R.x + 44*S, top = R.y + 44*S)
export const meterHome = (E) => [E.SAFE.x + 44 * E.SCALE, E.SAFE.y + 44 * E.SCALE];

// ---------------------------------------------------------------------------------------------------- misc
// last beat at or before t (within `win` s), else t itself
export function beatAtOrBefore(E, t, win = 0.5) {
  const b = E.last("beats", t + 1e-4);
  return b && t - b.t <= win ? b.t : t;
}
// which shot of a list [{t0,t1,...}] is active
export function shotAt(shots, t) {
  for (let i = shots.length - 1; i >= 0; i--) if (t >= shots[i].t0) return shots[i];
  return shots[0];
}
// a soft dark disc under a point (a printed spotlight on the ground, never on the character)
export function glowDisc(c, x, y, r, col, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
  c.save(); c.globalAlpha = a; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}

// A full-width terminal status bar across the bottom (portrait: the platform-UI zone). Drawn in FRONT, it is the desk the
// close-ups sit behind, so their chest crop never shows mid-frame. y0 = top edge in px.
export function statusBar(E, c, t, y0, text) {
  const S = E.SCALE;
  c.save();
  c.fillStyle = K.panel; c.fillRect(0, y0, E.W, E.H - y0);
  c.fillStyle = K.line; c.fillRect(0, y0, E.W, Math.max(1, S));
  c.fillStyle = "rgba(146,231,89,0.35)"; c.fillRect(0, y0 + 6 * S, E.W, Math.max(1, S));
  c.restore();
  mono(E, c, text, E.SAFE.x + 24 * S, y0 + 44 * S, { size: 22, color: K.grey, upper: false });
  cursor(E, c, t, E.SAFE.x + 24 * S, y0 + 74 * S, 14 * S, 26 * S, K.green, 0.8);
}
