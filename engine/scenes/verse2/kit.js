// verse2 drawing kit (look D, DICTIONARY). Pure functions of song time t; sizes arrive pre-scaled (px * E.SCALE).
import * as B from "../../brand.js";
import { clamp, lerp, ease, hash1 } from "../../core.js";
const C = B.C;

export const FONT = {
  serif: "Instrument Serif",
  mono: "JetBrains Mono",
  // JetBrains Mono has no ɛ ɔ ɒ ɪ ʒ ˈ ː: those glyphs fall back to Inter Tight (loaded by index.html)
  ipa: 'JetBrains Mono", "Inter Tight',
  hype: "Archivo",
  ui: "Inter Tight",
};

// ------------------------------------------------------------------------------------------------ small helpers
export const tw = (t, t0, d, f = ease.outCubic) => f(clamp((t - t0) / d));
export function T(E, c, s, x, y, o) {
  E.drawText(c, s, x, y, { baseline: "alphabetic", align: "left", weight: 400, ...o });
}
export function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
// smooth a landmark (or the matte box) over +-2 frames; returns null when the pose is missing
export function smoothPt(v, lt, idx) {
  let x = 0, y = 0, n = 0;
  for (let k = -2; k <= 2; k++) {
    const p = v.trackAt(Math.max(0, lt + k / v.meta.fps))?.pose?.[idx];
    if (p && p[2] > 0.3) { x += p[0]; y += p[1]; n++; }
  }
  return n ? [x / n, y / n] : null;
}
export function smoothBox(v, lt) {
  const b = [0, 0, 0, 0];
  let n = 0;
  for (let k = -2; k <= 2; k++) {
    const tr = v.trackAt(Math.max(0, lt + k / v.meta.fps));
    if (tr?.box) { for (let i = 0; i < 4; i++) b[i] += tr.box[i]; n++; }
  }
  return n ? b.map((x) => x / n) : null;
}
// Plate opts that put clip-UV point (u, vv) at screen (X, Y) with the whole clip frame Hpx tall (any canvas).
export function place(E, v, u, vv, X, Y, Hpx, mirror = false) {
  const va = v.meta.w / v.meta.h, sa = E.W / E.H;
  let w0, h0;
  if (va > sa) { w0 = E.W; h0 = E.W / va; } else { h0 = E.H; w0 = E.H * va; }
  const z = Hpx / h0, w = w0 * z, h = h0 * z, uu = mirror ? 1 - u : u;
  const cx = X - (uu - 0.5) * w, cy = Y - (vv - 0.5) * h;
  return { fit: "contain", zoom: z, x: (cx - E.W / 2) / E.SCALE, y: (cy - E.H / 2) / E.SCALE, mirror, feather: 0.1 };
}
// soft contact shadow under feet (a graphic, never on the character)
export function shadow(c, x, y, r, a = 0.2) {
  c.save();
  c.translate(x, y);
  c.scale(1, 0.16);
  const gr = c.createRadialGradient(0, 0, 0, 0, 0, r);
  gr.addColorStop(0, `rgba(19,21,18,${a})`);
  gr.addColorStop(1, "rgba(19,21,18,0)");
  c.fillStyle = gr;
  c.beginPath();
  c.arc(0, 0, r, 0, 6.2832);
  c.fill();
  c.restore();
}

// ------------------------------------------------------------------------------------------- HIS sticker (hype)
// rows: [[{txt, w}]] (w = lyric word). Laid out at base `size`; drawn with a placement transform.
export function stickerLayout(E, c, rows, size) {
  const font = { font: FONT.hype, weight: 900, stretch: "75%", size, tracking: -0.005 };
  const sp = size * 0.2, lh = size * 0.86;
  const R = rows.map((row) => {
    const ws = row.map((k) => E.measure(c, k.txt, font));
    return { toks: row, ws, w: ws.reduce((a, b) => a + b, 0) + sp * (row.length - 1) };
  });
  const tW = Math.max(...R.map((r) => r.w)), tH = lh * rows.length, padX = size * 0.2, padY = size * 0.17;
  const grad = c.createLinearGradient(0, -size * 0.36, 0, size * 0.36); // Stigg's site gradient, HIS hype only
  grad.addColorStop(0, C.pale);
  grad.addColorStop(0.42, C.green);
  grad.addColorStop(1, "#72B445");
  return { font, sp, lh, R, tW, tH, padX, padY, w: tW + padX * 2, h: tH + padY * 2, size, grad, first: rows[0][0].w.s };
}
// pl = {x, y (center), s (scale), r (rotation)}; o.strikeT = when HER pen strikes it; o.align 'left'|'center'
export function drawSticker(E, c, L, t, pl, o = {}) {
  if (t < L.first - 0.066) return;
  const pop = E.popScale(t, L.first, { from: 0.92, k: 420, z: 0.5 });
  c.save();
  c.translate(pl.x, pl.y);
  c.rotate(pl.r ?? 0);
  c.scale(pl.s * pop, pl.s * pop);
  c.fillStyle = C.ink;
  rrect(c, -L.w / 2, -L.h / 2, L.w, L.h, L.size * 0.07);
  c.fill();
  let y = -L.tH / 2 + L.lh * 0.5;
  for (const r of L.R) {
    let x = o.align === "left" ? -L.tW / 2 : -r.w / 2;
    for (let i = 0; i < r.toks.length; i++) {
      const s = r.toks[i].w.s, a = clamp((t - s + 0.066) / 0.05);
      if (a > 0) {
        const p = E.popScale(t, s, { from: 1.3, k: 560, z: 0.42 });
        E.drawText(c, r.toks[i].txt, x + r.ws[i] / 2, y + L.size * 0.035, { ...L.font, align: "center", baseline: "middle", color: L.grad, s: p, alpha: a });
      }
      x += r.ws[i] + L.sp;
    }
    y += L.lh;
  }
  if (o.strikeT != null) {
    // HER red pen through every row, row 2 a beat of a hand later
    L.R.forEach((r, i) => {
      const x0 = o.align === "left" ? -L.tW / 2 : -r.w / 2;
      B.penStrike(c, x0, -L.tH / 2 + L.lh * (i + 0.5) + L.size * 0.03, x0 + r.w, t, o.strikeT + i * 0.07, {
        width: L.size * 0.09, dur: 0.13, seed: (o.seed ?? 1) + i * 3, amp: L.size * 0.025, tilt: -L.size * 0.05, color: C.coral,
      });
    });
  }
  c.restore();
}
// screen-space rect of a placed sticker (axis aligned, rotation ignored)
export const stickerRect = (L, pl) => ({ x: pl.x - (L.w * pl.s) / 2, y: pl.y - (L.h * pl.s) / 2, w: L.w * pl.s, h: L.h * pl.s });

// ----------------------------------------------------------------------------------------- HER definition (serif)
// toks: [{txt, w, hero}] -> wrapped at maxW. Words land on their onsets; hero words in coral with a pop.
export function defLayout(E, c, toks, size, maxW, lhK = 1.08) {
  const font = { font: FONT.serif, italic: true, weight: 400, size };
  const sp = E.measure(c, " ", font) * 1.05, lh = size * lhK;
  let x = 0, y = 0, wMax = 0;
  const out = [];
  for (const k of toks) {
    const ww = E.measure(c, k.txt, font);
    if (x > 0 && x + ww > maxW) { x = 0; y += lh; }
    out.push({ ...k, x, y, ww });
    x += ww + sp;
    wMax = Math.max(wMax, x - sp);
  }
  return { font, toks: out, h: y + lh, w: wMax, size, lh };
}
export function drawDef(E, c, D, t, x0, y0, o = {}) {
  const al = o.alpha ?? 1;
  for (const k of D.toks) {
    const s = k.w.s;
    if (t < s - 0.066) continue;
    const u = clamp((t - s + 0.066) / 0.16), a = clamp((t - s + 0.066) / 0.05);
    const dy = (1 - ease.outCubic(u)) * D.size * 0.2;
    const sc = k.hero ? E.popScale(t, s, { from: 1.28, k: 400, z: 0.45 }) : 1;
    E.drawText(c, k.txt, x0 + k.x + k.ww / 2, y0 + k.y + dy, { ...D.font, align: "center", baseline: "alphabetic", color: k.hero ? C.coral : (o.ink ?? C.ink), alpha: a * al, s: sc });
  }
}

// ------------------------------------------------------------------------------------------- dictionary headword
// "stealth  /stɛlθ/  n." : serif headword, mono phonetics, italic part of speech. Lands at t0 (ease-out rise).
export function headLayout(E, c, h, size) {
  const f1 = { font: FONT.serif, size, weight: 400 }, f2 = { font: FONT.ipa, size: size * 0.4, weight: 500 }, f3 = { font: FONT.serif, italic: true, size: size * 0.52, weight: 400 };
  const w1 = E.measure(c, h.word, f1), w2 = E.measure(c, h.ipa, f2), w3 = E.measure(c, h.pos, f3);
  const gap = size * 0.22;
  return { h, f1, f2, f3, w1, w2, w3, gap, w: w1 + gap + w2 + gap * 0.8 + w3, size, stack: false };
}
export function drawHead(E, c, H, t, t0, x, y, o = {}) {
  if (t < t0 - 0.066) return;
  const u = tw(t, t0 - 0.066, 0.2), a = clamp((t - t0 + 0.066) / 0.08) * (o.alpha ?? 1), dy = (1 - u) * H.size * 0.25;
  T(E, c, H.h.word, x, y + dy, { ...H.f1, color: C.ink, alpha: a });
  if (o.stack) {
    // phonetics + pos on the line below (narrow columns)
    const y2 = y + H.size * 0.62;
    T(E, c, H.h.ipa, x, y2 + dy, { ...H.f2, color: C.dgrey, alpha: a });
    T(E, c, H.h.pos, x + H.w2 + H.gap * 0.8, y2 + dy, { ...H.f3, color: C.dgrey, alpha: a });
    return;
  }
  T(E, c, H.h.ipa, x + H.w1 + H.gap, y - H.size * 0.04 + dy, { ...H.f2, color: C.dgrey, alpha: a });
  T(E, c, H.h.pos, x + H.w1 + H.gap + H.w2 + H.gap * 0.8, y + dy, { ...H.f3, color: C.dgrey, alpha: a });
}

// ----------------------------------------------------------------------------------- column headers (karaoke-lit)
// words: [{txt, on: [t...], off: [t...]}]: lit (coral) from each on until the matching off.
export function drawLabel(E, c, words, t, x, y, size, o = {}) {
  const font = { font: FONT.mono, weight: 700, size, tracking: 0.12 };
  let xx = x;
  for (const k of words) {
    let lit = 0;
    for (let i = 0; i < k.on.length; i++) if (t >= k.on[i] - 0.05 && t < (k.off?.[i] ?? 1e9)) lit = Math.max(lit, clamp((t - k.on[i] + 0.05) / 0.05));
    const ww = E.measure(c, k.txt, font);
    const sc = lit > 0 ? E.popScale(t, k.on.filter((s) => s - 0.05 <= t).pop() ?? 0, { from: 1.3, k: 500, z: 0.5 }) : 1;
    E.drawText(c, k.txt, xx + ww / 2, y, { ...font, align: "center", baseline: "alphabetic", color: lit > 0.5 ? C.coral : C.ink, alpha: (o.alpha ?? 1) * lerp(0.3, 1, lit), s: sc });
    xx += ww + size * 0.55;
  }
  return xx - size * 0.55 - x;
}

// ----------------------------------------------------------------------------------------------- her lyric line
// A sung line set in her serif, words landing on onsets (centered at x). Returns the line width.
export function lineLayout(E, c, toks, size) {
  const font = { font: FONT.serif, italic: true, weight: 400, size };
  const sp = E.measure(c, " ", font) * 1.05;
  let x = 0;
  const out = toks.map((k) => { const ww = E.measure(c, k.txt, font); const r = { ...k, x, ww }; x += ww + sp; return r; });
  return { font, toks: out, w: x - sp, size };
}
export function drawLine(E, c, Lo, t, cx, y, o = {}) {
  const x0 = o.align === "left" ? cx : cx - Lo.w / 2;
  for (const k of Lo.toks) {
    const s = k.w.s;
    if (t < s - 0.066) continue;
    const u = clamp((t - s + 0.066) / 0.14), a = clamp((t - s + 0.066) / 0.05) * (o.alpha ?? 1);
    const sc = k.hero ? E.popScale(t, s, { from: 1.3, k: 420, z: 0.45 }) : 1;
    E.drawText(c, k.txt, x0 + k.x + k.ww / 2, y + (1 - ease.outCubic(u)) * Lo.size * 0.18, { ...Lo.font, align: "center", baseline: "alphabetic", color: k.hero ? C.coral : (o.ink ?? C.ink), alpha: a, s: sc });
  }
}

// --------------------------------------------------------------------------------------------- page furniture
export function page(E, c, P, t, o = {}) {
  const S = E.SCALE;
  c.fillStyle = C.white;
  c.fillRect(0, 0, E.W, E.H);
  if (o.bare) return;
  const a = o.alpha ?? 1;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = C.ink;
  c.fillRect(P.x0, P.ruleY, P.x1 - P.x0, Math.max(1, 2 * S));
  c.fillRect(P.x0, P.ruleY + 6 * S, P.x1 - P.x0, Math.max(1, 1 * S));
  T(E, c, "FOUNDER → ENGLISH", P.x0, P.ruleY - 14 * S, { font: FONT.mono, weight: 700, size: 22 * S, tracking: 0.14, color: C.ink });
  if (o.guide) T(E, c, o.guide, P.x1, P.ruleY - 13 * S, { font: FONT.serif, italic: true, size: 34 * S, color: C.ink, align: "right" });
  if (o.folio && !P.portrait) {
    T(E, c, o.folio, P.x1, P.footY, { font: FONT.mono, weight: 600, size: 20 * S, tracking: 0.1, color: C.inkA(0.55), align: "right" });
  }
  c.restore();
}
