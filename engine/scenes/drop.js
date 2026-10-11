// DROP · 8.40-17.40 · looks C (SIGNAL GREEN) <-> A (AFTER TOKENS) · gang chant + the fighting-game VS card.   A1
//
// PLAN (lyrics.json onsets; DER syllables from the vocal stem's onsets; beats/downbeats from audio.json)
//   music: 8.4-12.3 chant over a pumping build (bass on every beat) · 12.36-14.2 breakdown (vocal only) ·
//          14.22 THE DROP (kick + bass) · 17.76 break before verse 1 (its "I" is at 18.01; never shown here)
//   t       word / event          visual                                                       layer     cut
//   8.40    (hard cut in)          LOOK C: flat #92E759. him_chant 0.0 (one fist high, can low)   PLATE     D1a
//   8.44    "I'm"                  I'M slams, giant condensed ink, behind him (matte); punch on   MID
//                                  every beat (8.52 9.00 9.46: the bass hits)
//   8.72/8.75 "an" "AI"            jump cut waist-up (pumps warped onto beats); AN / AI slam       MID       D1b
//   9.10    "FOUN-"                jump cut chest-up; FOUN fills the box                           MID       D1c
//   9.46    "-DER!" (beat)         pull back full body; FOUN / DER! completes the word             MID       D1d
//   9.94    (beat, cut)            LOOK A: the BURN LEDGER prints his chant like a usage log on   MID       D2
//                                  16ths (I'M −1,912 · AN −2,073 · AI −2,622 · FOUNDER! −1,844);
//                                  him pumping on the right, pumps warped onto 10.42 / 10.90 / 11.38
//   10.42   (downbeat)             TOTAL −8,451 slams in pixel-grid green, behind him              MID
//   10.90   (beat)                 BALANCE line + drain bar (all ledger graphics sit clear of him) MID
//   11.38   (beat)                 the ledger jolts: anticipation for the gang
//   11.54   GANG "Founder!"        LOOK C: STADIUM WALL: 7 marquee rows of FOUNDER! (alternate     MID       D3
//                                  directions) + a crowd of identical founders pumping in sync +
//                                  a jumbotron: ONE WORD · THE WHOLE CROWD −8,663 (the HUD meter hides)
//   12.10   "I'm" 12.46 "an" 12.585 "AI" 12.88 "FOUN-" 13.27 "-DER!"                              D4
//                                  LOOK A: the chant is MADE OF TOKENS: pixel cells fly in and
//                                  assemble each syllable (the breakdown: a suspended slow drift)
//   13.60   (line ends)            the cells blow apart (tokens burned) as the VS CARD slams in:   FRONT     D5
//                                  green P1 panel | coral P2 panel, speed lines; P1 = him_chant 0.75-4.60
//                                  (pumps; the can is gone), P2 = her_unimpressed 0-3.8 (eye-roll, then sip)
//   13.76   (beat)                 panels lock; top bars: P1 TOKENS (reads tokensAt; the HUD meter hides)
//                                  vs P2 PATIENCE
//   14.22   (DROP downbeat)        "VS" slams (flash + punch, pulses on beats); THE FOUNDER / THE DATE
//   14.70   PRE-SEED · 15.18 ICED MATCHA · 15.66 RUNWAY: 3 WEEKS (her eye-roll) ·
//   16.12   PATIENCE: LOW (her bar drains while she sips) · 16.60 SLEEP: NO · 17.08 FIGHT! (holds to the cut)
//           the camera ping-pongs to whoever gets the stat on that beat; text stays put as UI
// Portrait: every block restacks inside the safe band (type above him, faces inside the band, clip cut edges
// off-canvas); the VS card keeps the side-by-side split with its text in two columns above the fighters.
import * as B from "../brand.js";
import * as K from "./intro/kit.js";

let vCH, vHU, g, WD = [];
const T1 = 9.94, T2 = 11.54, T3 = 12.1, T4 = 13.6;
const HERO = { font: B.FONT.hero, weight: 900, tracking: -0.03 };
const COND = { font: B.FONT.grot, weight: 900, stretch: "62.5%", tracking: -0.01 };
const MONO = { font: B.FONT.mono, weight: 700, tracking: 0.06 };
let CH1 = [], CH2 = [], GANG = null, BEATS = [];

// him_chant time maps (pump peaks ≈1.3 1.9 2.55 3.1 3.75 4.4 warped onto beats; the can is gone 0.5-4.75)
function pw(t, pts) { // piecewise-linear map, linear extrapolation at both ends
  let i = 0;
  while (i < pts.length - 2 && t > pts[i + 1][0]) i++;
  const [a, b] = pts[i], [c, d] = pts[i + 1];
  return b + ((t - a) / (c - a)) * (d - b);
}
const chantLT = (t) => {
  if (t < 8.72) return 0.0 + 0.75 * (t - 8.4); //                    0 -> 0.24: one fist high, can low
  if (t < T1) return 1.3 + 1.25 * (t - 9.0); //                       0.95 -> 2.47: peaks 1.3 @ 9.00, 1.9 @ 9.48
  if (t < T2) return pw(t, [[9.94, 2.55], [10.42, 3.1], [10.9, 3.75], [11.38, 4.4]]); // -> 4.62 @ 11.54
  if (t < T3) return 1.9 + (t - T2); //                               clones: 1.9 -> 2.46 (peak on "FOUNDER!")
  return 0.75 + 1.0132 * (t - T4); //                                 VS card: 0.75 -> 4.60 (the can pops back at 4.667)
};
const herLT = (t) => Math.max(0, t - T4); //                          0 -> 3.8: side-eye, eye-roll 1.0-2.25, sip 2.5+

export default {
  async load(E) {
    [vCH, vHU] = await Promise.all([E.loadVideo("him_chant"), E.loadVideo("her_unimpressed")]);
    g = E.makeG2D(E.W, E.H);
    B.initMeter(E);
    WD = E.words.filter((w) => w.section === "drop");
    const c1 = WD.slice(0, 4), c2 = WD.slice(5, 9);
    GANG = WD[4];
    // syllables: the DER of each "founder!" from the vocal stem (onsets 9.463 / 13.288)
    CH1 = [{ t: "I’M", s: c1[0].s, w: c1[0] }, { t: "AN", s: c1[1].s, w: c1[1] }, { t: "AI", s: c1[2].s, w: c1[2] }, { t: "FOUN", s: c1[3].s, w: c1[3] }, { t: "DER!", s: c1[3].s + 0.363, w: null }];
    CH2 = [{ t: "I’M", s: c2[0].s, w: c2[0] }, { t: "AN", s: c2[1].s, w: c2[1] }, { t: "AI", s: c2[2].s, w: c2[2] }, { t: "FOUN", s: c2[3].s, w: c2[3] }, { t: "DER!", s: c2[3].s + 0.39, w: null }];
    BEATS = E.A.beats.filter((b) => b > 8.3 && b < 17.5);
  },
  async prepare(E, t) {
    if (t < T3) await vCH.frame(chantLT(t));
    else if (t >= T4) await Promise.all([vCH.frame(chantLT(t)), vHU.frame(herLT(t))]);
  },
  render(E, t, rt) {
    E.renderer.setRenderTarget(rt);
    if (t < T1) chant1(E, t);
    else if (t < T2) ledger(E, t);
    else if (t < T3) stadium(E, t);
    else if (t < T4) tokens(E, t);
    else vs(E, t);
  },
};

// ======================================================================================== helpers
const S_ = (E) => E.SCALE;
function capOf(c, txt, o) {
  c.save(); c.font = `${o.weight ?? 900} ${o.size}px "${o.font}"`; c.fontStretch = o.stretch ? "extra-condensed" : "normal";
  const m = c.measureText(txt); c.restore();
  return m.actualBoundingBoxAscent;
}
// draw text filling a box: width-fit, then stretch vertically (sy <= maxSy) to fill the height. Baseline at box bottom.
function fillBox(E, c, txt, bx, o = {}) {
  const base = { ...COND, ...o.font };
  const w0 = E.measure(c, txt, { ...base, size: 100 });
  let size = (bx.w / w0) * 100;
  const cap = capOf(c, txt, { ...base, size });
  let sy = 1;
  if (cap > bx.h) size *= bx.h / cap;
  else sy = Math.min(o.maxSy ?? 1.45, bx.h / cap);
  const capH = capOf(c, txt, { ...base, size }) * sy;
  const x = o.align === "right" ? bx.x + bx.w : o.align === "center" ? bx.x + bx.w / 2 : bx.x;
  return { size, sy, capH, x, y: bx.y + (o.valign === "top" ? capH : bx.h), base };
}
function slam(E, c, txt, bx, t, s, o = {}) {
  if (t < s - 0.067) return; // anticipation: at most 4 frames before the onset
  const f = fillBox(E, c, txt, bx, o), d = t - (s - 0.05);
  const sc = 1 + (o.from ?? 0.18) * (1 - E.spring(Math.max(0, d), 420, 0.5));
  const a = o.solid ? 1 : K.clamp(d / 0.034 + 0.4);
  const cx = bx.x + bx.w / 2, cy = bx.y + bx.h / 2;
  c.save();
  c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy); // the slam, about the box centre
  c.translate(0, f.y); c.scale(1, f.sy); c.translate(0, -f.y); // vertical stretch about the baseline
  E.drawText(c, txt, f.x, f.y, { ...f.base, size: f.size, color: o.color ?? B.C.ink, align: o.align ?? "left", baseline: "alphabetic", alpha: a });
  c.restore();
}
function punchOn(E, t, times, amt = 0.03, dec = 0.09) {
  let p = 0;
  for (const s of times) if (t >= s) p = Math.max(p, Math.exp(-(t - s) / dec));
  E.post.punch = Math.max(E.post.punch, amt * p);
}
function groundA(E, c, t, o = {}) {
  K.ground(E, c);
  B.hairGrid(c, 0, 0, E.W, E.H, { step: 96 * S_(E), alpha: o.grid ?? 0.55, offX: -t * 30 * S_(E) });
  K.vignette(E, c, 0.8);
}

// ======================================================================================== D1 chant 1 (look C)
function chant1(E, t) {
  const S = S_(E), c = g.ctx, P = K.P(E), W = E.W, H = E.H, R = E.SAFE;
  E.hud.theme = "light"; E.hud.sub = false;
  // sub-shot by syllable: a = I'M (full body, fist high) · b = AN AI (waist-up) · c = FOUN (chest-up) · d = DER! (full)
  const sb = t < CH1[1].s - 0.067 ? 0 : t < CH1[3].s - 0.067 ? 1 : t < CH1[4].s - 0.067 ? 2 : 3;
  const fr = P
    ? [{ u: 0.78, v: 0.967, X: 0.55 * W, Y: 0.985 * H, h: 0.56 * H }, { u: 0.78, v: 0.6, X: 0.55 * W, Y: H, h: 0.95 * H }, { u: 0.775, v: 0.5, X: 0.55 * W, Y: H, h: 1.15 * H }, { u: 0.78, v: 0.967, X: 0.55 * W, Y: 0.985 * H, h: 0.56 * H }][sb]
    : [{ u: 0.78, v: 0.967, X: 0.7 * W, Y: 0.985 * H, h: 1.0 * H }, { u: 0.78, v: 0.6, X: 0.72 * W, Y: 1.0 * H, h: 1.7 * H }, { u: 0.775, v: 0.45, X: 0.77 * W, Y: 1.0 * H, h: 2.05 * H }, { u: 0.78, v: 0.967, X: 0.71 * W, Y: 0.985 * H, h: 1.0 * H }][sb];
  const po = K.placePlate(E, vCH, fr);
  g.clear();
  K.ground(E, c, B.C.green);
  // the type box: left of him on landscape, above him on portrait
  const pb = [0.43, 0.49, 0.515, 0.43][sb] * H; // portrait: the box ends just above his head in each framing
  const bx = P ? { x: R.x + 10 * S, y: R.y + 150 * S, w: R.w - 20 * S, h: pb - (R.y + 150 * S) } : { x: 0.035 * W, y: 0.12 * H, w: 0.53 * W, h: 0.8 * H };
  if (sb === 0) slam(E, c, "I’M", bx, t, CH1[0].s, { from: 0.1, solid: true }); // the hard cut-in frame is already loaded
  else if (sb === 1) {
    const h1 = bx.h * 0.36, gap = bx.h * 0.04;
    slam(E, c, "AN", { x: bx.x, y: bx.y, w: bx.w * 0.6, h: h1 }, t, CH1[1].s);
    slam(E, c, "AI", { x: bx.x, y: bx.y + h1 + gap, w: bx.w, h: bx.h - h1 - gap }, t, CH1[2].s, { from: 0.22 });
  } else if (sb === 2) slam(E, c, "FOUN", bx, t, CH1[3].s, { from: 0.22 });
  else {
    const h1 = bx.h * 0.47, gap = bx.h * 0.06;
    slam(E, c, "FOUN", { x: bx.x, y: bx.y, w: bx.w, h: h1 }, t, CH1[3].s, { from: 0 });
    slam(E, c, "DER!", { x: bx.x, y: bx.y + h1 + gap, w: bx.w, h: bx.h - h1 - gap }, t, CH1[4].s, { from: 0.22 });
  }
  g.commit(); E.blitG2D(E, g, 1);
  // contact shadow under the full-body frames (a drawn graphic)
  E.drawPlate(E, vCH, { ...po, matte: true });
  punchOn(E, t, BEATS, 0.032, 0.1); // camera punch on the beats (the bass hits); the syllables slam on their onsets
}

// ======================================================================================== D2 the burn ledger (look A)
function ledger(E, t) {
  const S = S_(E), c = g.ctx, P = K.P(E), W = E.W, H = E.H, R = E.SAFE;
  E.hud.theme = "dark"; E.hud.sub = false; // the chant line was set big in D1; the ledger itemizes it
  const po = K.placePlate(E, vCH, P ? { u: 0.78, v: 0.967, X: 0.66 * W, Y: 1.0 * H, h: 0.44 * H } : { u: 0.78, v: 0.967, X: 0.79 * W, Y: 0.985 * H, h: 0.95 * H });
  const rows = [["I’M", CH1[0].w], ["AN", CH1[1].w], ["AI", CH1[2].w], ["FOUNDER!", CH1[3].w]];
  const total = rows.reduce((a, r) => a + K.costOf(E, r[1]), 0);
  const x0 = P ? R.x + 24 * S : 0.06 * W, y0 = P ? R.y + 190 * S : 0.2 * H;
  const lh = (P ? 54 : 64) * S, fs = (P ? 34 : 42) * S, colW = P ? R.w - 48 * S : 0.5 * W;
  g.clear();
  groundA(E, c, t);
  // MID: the TOTAL in pixel-grid green (behind him)
  const tT = 10.42, tw = K.clamp((t - (tT - 0.05)) / 0.16);
  const cell = Math.round((P ? 9 : 12) * S), rowsPx = P ? 15 : 17;
  const ty = y0 + lh * 6.3;
  if (tw > 0) {
    B.pixelText(c, `−${K.fmt(total)}`, x0, ty, { rows: rowsPx, cell, reveal: tw, seed: 5 });
    E.drawText(c, "TOKENS BURNED BY ONE SENTENCE", x0 + 4 * S, ty + rowsPx * cell + 46 * S, { ...MONO, size: (P ? 22 : 28) * S, color: B.C.whiteA(0.7), align: "left", alpha: tw });
  }
  // the usage log printing on 16ths (left of him: same pass as the ground)
  const jolt = t >= 11.38 ? Math.exp(-(t - 11.38) / 0.08) * Math.sin((t - 11.38) * 90) * 8 * S : 0;
  c.save(); c.translate(jolt, 0);
  E.drawText(c, "USAGE LOG  ·  CHANT_01  ·  LIVE", x0, y0, { ...MONO, size: fs * 0.72, color: B.C.green, align: "left" });
  c.fillStyle = B.C.greenA(0.45); c.fillRect(x0, y0 + 22 * S, colW, Math.max(1, S));
  const step = E.spb / 4;
  rows.forEach((r, i) => {
    const tp = T1 + i * step;
    if (t < tp) return;
    const y = y0 + lh * (i + 1) + 18 * S, a = K.clamp((t - tp) / 0.04);
    const ts = r[1].s.toFixed(2).padStart(5, "0");
    E.drawText(c, ts, x0, y, { ...MONO, size: fs * 0.8, color: B.C.whiteA(0.45), align: "left", alpha: a });
    E.drawText(c, r[0], x0 + fs * 3.6, y, { ...HERO, size: fs * 1.05, color: B.C.white, align: "left", alpha: a });
    E.drawText(c, `−${K.fmt(K.costOf(E, r[1]))}`, x0 + colW, y, { ...MONO, size: fs, color: B.C.green, align: "right", alpha: a });
  });
  if (t >= tT - 0.05) {
    c.fillStyle = B.C.greenA(0.45); c.fillRect(x0, y0 + lh * 5 + 4 * S, colW, Math.max(1, S));
  }
  // 10.90: balance + a drain bar (reads the meter)
  const tB = 10.9;
  if (t >= tB - 0.05) {
    const a = K.clamp((t - (tB - 0.05)) / 0.06), bal = B.tokensAt(E, t);
    const by = ty + rowsPx * cell + 110 * S;
    E.drawText(c, "BALANCE", x0, by, { ...MONO, size: fs * 0.72, color: B.C.whiteA(0.6), align: "left", alpha: a });
    E.drawText(c, K.fmt(bal), x0 + colW, by, { ...MONO, size: fs, color: B.C.white, align: "right", alpha: a });
    c.globalAlpha = a; c.fillStyle = B.C.line; c.fillRect(x0, by + 26 * S, colW, 8 * S);
    c.fillStyle = B.C.green; c.fillRect(x0, by + 26 * S, colW * (bal / 1e6), 8 * S); c.globalAlpha = 1;
  }
  c.restore();
  g.commit(); E.blitG2D(E, g, 1);
  E.drawPlate(E, vCH, { ...po, matte: true });
  punchOn(E, t, [10.42], 0.02, 0.1);
}

// ======================================================================================== D3 stadium wall (look C)
function stadium(E, t) {
  const S = S_(E), c = g.ctx, P = K.P(E), W = E.W, H = E.H;
  E.hud.theme = "light"; E.hud.sub = false;
  const s0 = GANG.s, d = t - s0;
  g.clear();
  K.ground(E, c, B.C.green);
  // 7 marquee rows of FOUNDER!, alternating directions; the rows land one frame apart around the onset
  const nR = P ? 9 : 7, rh = H / nR, fs = rh * 1.02;
  const unit = E.measure(c, "FOUNDER! ", { ...COND, size: fs });
  for (let r = 0; r < nR; r++) {
    const tr = s0 - 0.05 + (Math.abs(r - (nR - 1) / 2) * 0.017);
    if (t < tr) continue;
    const dir = r % 2 ? 1 : -1, v = (P ? 900 : 1500) * S;
    const off = ((dir * (t - s0) * v) % unit + unit) % unit;
    const y = (r + 1) * rh - rh * 0.08;
    const pop = 1 + 0.12 * (1 - E.spring(t - tr, 400, 0.5));
    c.save(); c.translate(W / 2, y - rh / 2); c.scale(pop, pop); c.translate(-W / 2, -(y - rh / 2));
    for (let x = -unit - off; x < W + unit; x += unit) E.drawText(c, "FOUNDER!", x, y, { ...COND, size: fs, color: r % 3 === 1 ? B.C.white : B.C.ink, align: "left", baseline: "alphabetic" });
    c.restore();
  }
  // the jumbotron: one word from the whole crowd, and what it cost (reads the meter)
  const jw = (P ? 0.84 : 0.4) * W, jh = (P ? 0.15 : 0.25) * H, jx = (W - jw) / 2, jy = P ? E.SAFE.y + 150 * S : 0.035 * H;
  const jp = K.popIn(E, t, s0, { from: 0.94, k: 420, z: 0.55 });
  if (jp.a > 0) {
    c.save(); c.globalAlpha = jp.a; c.translate(W / 2, jy + jh / 2); c.scale(jp.s, jp.s); c.translate(-W / 2, -(jy + jh / 2));
    c.fillStyle = B.C.ink; c.fillRect(jx, jy, jw, jh);
    c.strokeStyle = B.C.green; c.lineWidth = 3 * S; c.strokeRect(jx, jy, jw, jh);
    B.crosshairs(c, jx, jy, jw, jh, { len: 26 * S, inset: 10 * S, cross: 6 * S, color: B.C.greenA(0.8) });
    const burn = K.runBurn(E, t, [GANG]), cell = Math.max(2, Math.round((P ? 7 : 9) * S));
    E.drawText(c, "ONE WORD  ·  THE WHOLE CROWD", W / 2, jy + 40 * S, { ...MONO, size: (P ? 20 : 24) * S, color: B.C.whiteA(0.75), align: "center" });
    B.pixelText(c, `−${K.fmt(Math.max(burn, 1))}`, W / 2, jy + 70 * S, { rows: P ? 13 : 15, cell, align: "center" });
    E.drawText(c, `BALANCE ${K.fmt(B.tokensAt(E, t))}`, W / 2, jy + jh - 26 * S, { ...MONO, size: (P ? 20 : 24) * S, color: B.C.green, align: "center" });
    c.restore();
  }
  g.commit(); E.blitG2D(E, g, 1);
  // the crowd: identical founders pumping in sync (one clip, many cut-outs), back row smaller
  const rowsC = P ? [{ n: 4, h: 0.3, y: 0.78 }, { n: 3, h: 0.42, y: 1.0 }] : [{ n: 7, h: 0.5, y: 0.8 }, { n: 5, h: 0.78, y: 1.02 }];
  rowsC.forEach((rc, ri) => {
    for (let i = 0; i < rc.n; i++) {
      const fx = (i + 0.5 + (ri ? 0 : 0.0)) / rc.n, jitter = (E.hash1(i * 7 + ri * 13) - 0.5) * 0.04;
      const pop = E.ease.outCubic(K.clamp((t - (s0 - 0.067 + ri * 0.03 + i * 0.008)) / 0.12));
      const po = K.placePlate(E, vCH, { u: 0.78, v: 0.967, X: (fx + jitter) * W, Y: rc.y * H + (1 - pop) * 0.2 * H, h: rc.h * H });
      E.drawPlate(E, vCH, { ...po, matte: true });
    }
  });
  E.hud.meter = false; // the jumbotron shows the bigger burn for this half-second
  punchOn(E, t, BEATS, 0.03, 0.1);
}

// ======================================================================================== D4 the chant made of tokens (look A)
function tokenLayout(E) {
  const S = S_(E), P = K.P(E), W = E.W, H = E.H, R = E.SAFE;
  const rws = P ? 13 : 18;
  if (!P) {
    const unitW = B.pixelSize("FOUNDER!", { rows: rws, cell: 1 }).w;
    const cell = Math.max(2, Math.floor((0.86 * W) / unitW));
    const fw = unitW * cell, lh = rws * cell, xL = (W - fw) / 2, y1 = 0.5 * H - lh * 1.32;
    return { P, rws, cell, fw, lh, xL, y1, y2: y1 + lh * 1.5, y3: null };
  }
  // portrait: I'M AN AI on one line, then FOUN / DER! stacked bigger
  const w1 = B.pixelSize("I’M", { rows: rws, cell: 1 }).w + B.pixelSize("AN", { rows: rws, cell: 1 }).w + B.pixelSize("AI", { rows: rws, cell: 1 }).w + 12;
  const cell1 = Math.max(2, Math.floor((R.w - 30 * S) / w1));
  const w2 = Math.max(B.pixelSize("FOUN", { rows: rws, cell: 1 }).w, B.pixelSize("DER!", { rows: rws, cell: 1 }).w);
  const cell = Math.max(2, Math.floor((R.w - 30 * S) / w2));
  const lh1 = rws * cell1, lh = rws * cell, xL = R.x + 15 * S;
  const y1 = R.y + 0.27 * R.h, y2 = y1 + lh1 * 1.45, y3 = y2 + lh * 1.2;
  return { P, rws, cell, cell1, fw: R.w - 30 * S, lh, lh1, xL, y1, y2, y3 };
}
function drawTokenLine(E, c, t, L, o = {}) {
  const rv = o.reveal ?? ((s) => K.clamp((t - (s - 0.06)) / 0.11));
  const c1 = L.P ? L.cell1 : L.cell;
  // line 1: I'M AN AI with explicit word gaps (6 cells)
  const words = [["I’M", CH2[0].s], ["AN", CH2[1].s], ["AI", CH2[2].s]];
  let x = L.xL;
  words.forEach(([w, s], i) => {
    const r = rv(s);
    if (r > 0) B.pixelText(c, w, x, L.y1, { rows: L.rws, cell: c1, reveal: r, seed: 11 + i, color: B.C.white, line: B.C.dgrey, alpha: o.alpha ?? 1 });
    x += B.pixelSize(w, { rows: L.rws, cell: c1 }).w + c1 * 6;
  });
  const r3 = rv(CH2[3].s), r4 = rv(CH2[4].s);
  const fw = B.pixelSize("FOUN", { rows: L.rws, cell: L.cell }).w;
  if (r3 > 0) B.pixelText(c, "FOUN", L.xL, L.y2, { rows: L.rws, cell: L.cell, reveal: r3, seed: 21, alpha: o.alpha ?? 1 });
  if (r4 > 0) B.pixelText(c, "DER!", L.P ? L.xL : L.xL + fw + L.cell, L.P ? L.y3 : L.y2, { rows: L.rws, cell: L.cell, reveal: r4, seed: 22, alpha: o.alpha ?? 1 });
}
function tokens(E, t) {
  const S = S_(E), c = g.ctx, P = K.P(E), W = E.W, H = E.H;
  E.hud.theme = "dark"; E.hud.sub = false;
  g.clear();
  groundA(E, c, t, { grid: 0.4 });
  const L = tokenLayout(E);
  // suspended drift: the breakdown floats (slow push toward the line)
  const k = 1 + 0.05 * E.ease.inOutQuad(K.clamp((t - T3) / 1.5));
  c.setTransform(k, 0, 0, k, (W / 2) * (1 - k), ((L.y1 + (L.P ? L.y3 : L.y2) + L.lh) / 2) * (1 - k));
  // After Tokens banner furniture around the block
  const m = 30 * S, top = L.y1 - m * 1.6, bot = (L.P ? L.y3 : L.y2) + L.lh + m * 1.3;
  B.rules(c, top, bot, W, { color: B.C.greenA(0.45), lw: Math.max(1, S) });
  B.crosshairs(c, L.xL - m * 1.5, top, L.fw + m * 3, bot - top, { len: 34 * S, inset: 12 * S, cross: 7 * S });
  E.drawText(c, "CHANT_02  ·  EVERY WORD IS BILLED", L.xL, top - 26 * S, { ...MONO, size: (P ? 20 : 24) * S, color: B.C.whiteA(0.6), align: "left" });
  drawTokenLine(E, c, t, L);
  const cost = K.runBurn(E, t, CH2.filter((x) => x.w).map((x) => x.w));
  if (cost > 0) E.drawText(c, `−${K.fmt(cost)} TOKENS`, L.xL + L.fw, bot + 44 * S, { ...MONO, size: (P ? 26 : 32) * S, color: B.C.green, align: "right" });
  c.setTransform(1, 0, 0, 1, 0, 0);
  g.commit(); E.blitG2D(E, g, 1);
}

// ======================================================================================== D5 VS card
// Landscape: green P1 | coral P2 split on a diagonal. Portrait: P1 on top, P2 below (faces inside the safe band).
function vsLayout(E) {
  const S = S_(E), W = E.W, H = E.H, R = E.SAFE;
  if (!K.P(E)) {
    return {
      P: false,
      split: [[0.545 * W, 0], [0.455 * W, H]],
      him: { u: 0.78, v: 0.967, X: 0.32 * W, Y: 0.985 * H, h: 0.86 * H },
      her: { u: 0.2, v: 0.978, X: 0.665 * W, Y: 0.985 * H, h: 0.86 * H },
      bars: [{ x: 0.05 * W, y: 0.06 * H, w: 0.38 * W, right: false }, { x: 0.57 * W, y: 0.06 * H, w: 0.38 * W, right: true }],
      vs: [0.5 * W, 0.5 * H, 300 * S], fight: [0.5 * W, 0.24 * H, 190 * S],
      names: [[0.04 * W, 0.93 * H, "left"], [0.96 * W, 0.93 * H, "right"]], nf: 92 * S,
      stats: [[0.04 * W, 0.3 * H, "left"], [0.96 * W, 0.3 * H, "right"], [0.04 * W, 0.44 * H, "left"], [0.96 * W, 0.44 * H, "right"], [0.04 * W, 0.58 * H, "left"]],
      sf: 58 * S, lf: 24 * S, sd: 60 * S,
    };
  }
  // portrait: the same split, fighters standing on the canvas bottom (faces just inside the band), text in two
  // columns above them
  const cl = R.x + 12 * S, cr = R.x + R.w - 12 * S;
  return {
    P: true,
    split: [[0.535 * W, 0], [0.465 * W, H]],
    him: { u: 0.78, v: 0.967, X: 0.25 * W, Y: 0.995 * H, h: 0.5 * H },
    her: { u: 0.2, v: 0.978, X: 0.75 * W, Y: 0.995 * H, h: 0.5 * H },
    bars: [{ x: cl, y: R.y + 16 * S, w: 0.465 * W - cl - 26 * S, right: false }, { x: 0.535 * W + 26 * S, y: R.y + 16 * S, w: cr - 0.535 * W - 26 * S, right: true }],
    vs: [0.5 * W, 0.4 * H, 190 * S], fight: [0.5 * W, 0.465 * H, 120 * S],
    names: [[cl, 0.525 * H, "left"], [cr, 0.505 * H, "right"]], nf: 50 * S,
    stats: [[cl, R.y + 150 * S, "left"], [cr, R.y + 150 * S, "right"], [cl, R.y + 245 * S, "left"], [cr, R.y + 245 * S, "right"], [cl, R.y + 340 * S, "left"]],
    sf: 44 * S, lf: 19 * S, sd: 46 * S,
  };
}
// the camera ping-pongs to whoever gets a stat on that beat (eased 0.24 s), then pulls back for FIGHT!
const FOCUS = [[13.6, 0], [14.7, 1], [15.18, 2], [15.66, 1], [16.12, 2], [16.6, 1], [17.08, 0]];
function vsCam(E, t, L) {
  const W = E.W, H = E.H, P = L.P;
  const pt = (f) => (f === 0 ? [0.5 * W, 0.5 * H, 1] : f === 1 ? [L.him.X, P ? 0.55 * H : 0.5 * H, P ? 1.05 : 1.075] : [L.her.X, P ? 0.55 * H : 0.5 * H, P ? 1.05 : 1.075]);
  let i = 0;
  while (i < FOCUS.length - 1 && t >= FOCUS[i + 1][0] - 0.03) i++;
  const a = pt(i ? FOCUS[i - 1][1] : 0), b = pt(FOCUS[i][1]), u = E.ease.outCubic(K.clamp((t - (FOCUS[i][0] - 0.03)) / 0.24));
  return [K.lerp(a[2], b[2], u), K.lerp(a[0], b[0], u), K.lerp(a[1], b[1], u)];
}
function vs(E, t) {
  const S = S_(E), c = g.ctx, W = E.W, H = E.H, L = vsLayout(E);
  E.hud.theme = "light"; E.hud.sub = false; E.hud.meter = false; E.hud.corners = false; // P1's TOKENS bar is the meter here
  const tin = E.ease.outCubic(K.clamp((t - T4) / 0.16)); // panels slide in 13.60 -> 13.76
  const off = (1 - tin) * W * 0.6;
  const [ck, ccx, ccy] = vsCam(E, t, L);
  g.clear();
  K.ground(E, c, B.C.ink);
  K.camCtx(c, ck, ccx, ccy);
  const [[ax, ay], [bx2, by2]] = L.split;
  c.fillStyle = B.C.green; c.beginPath();
  c.moveTo(-off, 0); c.lineTo(ax - off, 0); c.lineTo(bx2 - off, H); c.lineTo(-off, H);
  c.closePath(); c.fill();
  c.fillStyle = B.C.coral; c.beginPath();
  c.moveTo(ax + off, 0); c.lineTo(W + off, 0); c.lineTo(W + off, H); c.lineTo(bx2 + off, H);
  c.closePath(); c.fill();
  // speed lines streaming away from the seam
  c.save(); c.lineWidth = 3 * S;
  for (let i = 0; i < 26; i++) {
    const h1 = E.hash1(i * 3.1), h2 = E.hash1(i * 5.7 + 2), len = (120 + 260 * h2) * S, side = i % 2 ? 1 : -1;
    const sp = (900 + 900 * h2) * S, ph = (t * sp + h2 * W) % (W * 0.6);
    c.strokeStyle = side < 0 ? B.C.inkA(0.12) : B.C.whiteA(0.22);
    const y = h1 * H, x = side < 0 ? Math.min(ax, bx2) - ph : Math.max(ax, bx2) + ph;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + side * len, y); c.stroke();
  }
  c.restore();
  // the chant's tokens burn: the pixel cells blow apart as the card slams in
  if (t < T4 + 0.3) {
    const TL = tokenLayout(E), u = K.clamp((t - T4) / 0.3), k = 1.05;
    c.save(); c.setTransform(k, 0, 0, k, (W / 2) * (1 - k), ((TL.y1 + (TL.P ? TL.y3 : TL.y2) + TL.lh) / 2) * (1 - k));
    drawTokenLine(E, c, t, TL, { reveal: () => 1 - E.ease.outCubic(u), alpha: 1 - u });
    c.restore();
  }
  c.setTransform(1, 0, 0, 1, 0, 0);
  g.commit(); E.blitG2D(E, g, 1);
  // fighters
  const poH = K.placePlate(E, vCH, K.camPlate({ ...L.him, X: L.him.X - off }, ck, ccx, ccy));
  const poU = K.placePlate(E, vHU, K.camPlate({ ...L.her, X: L.her.X + off }, ck, ccx, ccy));
  E.drawPlate(E, vCH, { ...poH, matte: true });
  E.drawPlate(E, vHU, { ...poU, matte: true });
  // FRONT: bars, VS, names, stats
  g.clear();
  const bar = (b, f, col, lab, val) => {
    const bh = 30 * S, { x, y, w, right } = b;
    c.fillStyle = B.C.ink; c.fillRect(x - 4 * S, y - 4 * S, w + 8 * S, bh + 8 * S);
    c.fillStyle = B.C.line; c.fillRect(x, y, w, bh);
    c.fillStyle = col;
    if (right) c.fillRect(x + w * (1 - f), y, w * f, bh); else c.fillRect(x, y, w * f, bh);
    const ly = y + bh + (L.P ? 22 : 30) * S, fz = (L.P ? 18 : 22) * S;
    E.drawText(c, lab, right ? x + w : x, ly, { ...MONO, size: fz, color: B.C.ink, align: right ? "right" : "left" });
    E.drawText(c, val, right ? x : x + w, ly, { ...MONO, size: fz, color: B.C.ink, align: right ? "left" : "right" });
  };
  const tok = B.tokensAt(E, t), pat = 1 - 0.86 * K.clamp((t - 16.12) / 0.45);
  if (tin > 0.5) {
    bar(L.bars[0], tok / 1e6, B.C.green, "P1 · TOKENS", K.fmt(tok));
    bar(L.bars[1], pat, B.C.coral, "P2 · PATIENCE", pat < 0.2 ? "LOW" : `${Math.round(pat * 100)}%`);
  }
  const tV = 14.22;
  if (t >= tV - 0.067) {
    const d = t - (tV - 0.05), sc = (1 + 0.6 * (1 - E.spring(Math.max(0, d), 300, 0.45))) * (1 + 0.05 * E.pulse("beats", t, 0.1));
    const [vx, vy, vsz] = L.vs;
    K.camCtx(c, ck, ccx, ccy); // the VS rides the camera with the art; bars, names and stats are UI and stay put
    c.save(); c.translate(vx, vy); c.scale(sc, sc); c.rotate(-0.08);
    E.drawText(c, "VS", 0, vsz * 0.36, { font: B.FONT.black, weight: 400, size: vsz, color: B.C.white, align: "center", baseline: "alphabetic", stroke: 16 * S * (vsz / (300 * S)), strokeColor: B.C.ink, skewX: -0.18 });
    c.restore();
    c.setTransform(1, 0, 0, 1, 0, 0);
    const nm = (txt, n) => {
      const p = K.popIn(E, t, tV, { from: 0.92 }), [x, y, al] = L.names[n];
      if (p.a > 0) E.drawText(c, txt, x, y, { ...HERO, size: L.nf, color: B.C.ink, align: al, baseline: "alphabetic", alpha: p.a, skewX: -0.14, s: p.s });
    };
    nm("THE FOUNDER", 0); nm("THE DATE", 1);
  }
  const stat = (lab, val, n, s0) => {
    if (t < s0 - 0.067) return;
    const p = K.popIn(E, t, s0, { from: 0.92 }), [x, y, al] = L.stats[n];
    E.drawText(c, lab, x, y, { ...MONO, size: L.lf, color: B.C.inkA(0.7), align: al, alpha: p.a });
    E.drawText(c, val, x, y + L.sd, { ...HERO, size: L.sf, color: B.C.ink, align: al, baseline: "alphabetic", alpha: p.a, s: p.s });
  };
  stat("STAGE", "PRE-SEED", 0, 14.7);
  stat("DRINK", "ICED MATCHA", 1, 15.18);
  stat("RUNWAY", "3 WEEKS", 2, 15.66);
  stat("PATIENCE", "LOW", 3, 16.12);
  stat("SLEEP", "NO", 4, 16.6);
  const tF = 17.08;
  if (t >= tF - 0.067) {
    const d = t - (tF - 0.05), sc = 1 + 0.5 * (1 - E.spring(Math.max(0, d), 320, 0.45)), [fx, fy, fz] = L.fight;
    c.save(); c.translate(fx, fy); c.scale(sc, sc); c.rotate(-0.05);
    E.drawText(c, "FIGHT!", 0, 0, { font: B.FONT.black, weight: 400, size: fz, color: B.C.white, align: "center", stroke: 12 * S * (fz / (190 * S)), strokeColor: B.C.ink, skewX: -0.16 });
    c.restore();
  }
  c.setTransform(1, 0, 0, 1, 0, 0);
  g.commit(); E.blitG2D(E, g, 1);
  punchOn(E, t, [tV], 0.045, 0.14);
  punchOn(E, t, [13.76, 14.7, 15.18, 15.66, 16.12, 16.6, 17.08], 0.018, 0.08);
  if (t >= tV && t < tV + 0.1) { E.post.flash = 0.14 * Math.exp(-(t - tV) / 0.03); E.post.flashCol = [1, 1, 1]; }
}
