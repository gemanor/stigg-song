// END CARD · 147.80-157.99 · HUD "TOP_UP" · look A. Owner: A6. Renders both timeline entries:
// `endcard` (variant a) and `endcard_b` (variant b: + AFTER TOKENS · NOV 10 · SAN FRANCISCO).
// The music comes back on HER dime, the meter that ran the whole video turns into the brand.
//
// GRID  chime 147.816 · reprise 148.366 · downbeats 148.46 150.36 152.28 154.16 156.066(stab) · beats 148.94 149.40
//       149.88 150.84 151.32 151.80 152.76 153.22 153.70 154.64 155.12 155.60 · the drop (kick+bass) hits 154.16
//       · silence after 156.2
// METER brand.tokensAt: 0 → 1,000,000 from 147.936 over 0.55 s (outCubic): full on the reprise downbeat.
//
// PLAN  t        word / event              visual                                                       layer
// E1  147.800     (her_pays continues)      the take from the outro, no jump                             herpays.js
//     147.816     CHIME: her phone tap      green rings from the phone; inside the ripple the blocked     BACK clip
//                                           black world turns back into look A; TOP-UP APPROVED +counter  MID clip
//                                           rolls 0 → 1,000,000; the HUD comes back online                 FRONT rings
// E2  148.370     I'm (cut on the chant)    her_victory: the stadium fist pump, full body, right of centre
//     148.38 I'm / 148.66 an / 148.69 AI   his chant in HER voice now: "I'm an AI / founder!" in huge    MID (matte)
//     149.04 founder!                       coral Instrument Serif Italic, word by word
//     148.94                                tracked tag on her head: FOUNDER · PROFITABLE                 FRONT tracked
// E3  150.360 DB  (cut)                     him_holds_matcha, deadpan, right third
//     150.45                                tracked tag on the cup: HOLDING 1× ICED MATCHA / $6.15 · PAID  FRONT tracked
//                                           BY: HER (callback: "Hold my Celsius")
//     151.48      Founder!                  the gang wall: rows of FOUNDER! slam in behind him            MID (matte)
// E4  152.040     I'm (cut)                 both: her fist pump + him holding her matcha, side by side    2 cut-outs
//     152.04 I'M / 152.40 AN / 152.525 AI / I'M AN AI FOUNDER! in his hype type, slam per word           FRONT
//     152.82 FOUNDER!
//     153.700     (beat)                    her red pen strikes the line through: the last edit           FRONT
// E5  154.160 DB  THE DROP                  MAKE EVERY / TOKEN COUNT. (TOKEN in pixel-grid green, cells   FRONT
//                                           assemble) + the big meter: TOP-UP APPROVED 1,000,000 PAID BY:
//                                           HER; kick punches 154.14…155.83; the meter block lands 154.64
// E6  156.066     STAB                      the meter is swapped for the Stigg logo (official file and   FRONT
//                                           gradient) + "The usage runtime for AI products"; HUD off;
//                                           (b) the After Tokens strip: AFTER TOKENS · NOV 10 · SAN FRANCISCO
//     156.07→158  hold, silence             TOKEN glint sweep, grid drift, crosshair frame
import { B, slot, clipT, unionBox, frameBox, smoothPt, poseMid, groundA, contactShadow, label, pixelCount, pixelCountSize, loadLogo, clamp, lerp, ease } from "./outro/lib.js";
import { surfaces } from "./outro/surf.js";
import * as HP from "./outro/herpays.js";

const CUT = { e2: 148.37, e3: 150.36, e4: 152.04, e5: 154.16, e6: B.EV.stab };
// her_victory (6 s): fist up 0.0-0.25, 0.75-1.0, 2.0-2.5, 3.5-4.0, 5.0+. him_holds_matcha (5 s): holds the cup at his
// chest, sips through the straw 3.0-4.25 s.
const K = {
  her: [[148.37, 0.0]],      // E2: pumps on "I'm" and on "founder!" (149.04)
  him: [[150.36, 1.98]],     // E3: the deadpan sip lands on the gang's "Founder!" (151.48)
  her4: [[152.04, 2.72]],    // E4: a later stretch of her take, fist up on "founder!" (152.82)
  him4: [[152.04, 0.0]],     // E4: the head of his take (no second sip)
};
let W, her, him, box = {}, logo = null, wall = null;

function shotAt(t) {
  return t < CUT.e2 ? 1 : t < CUT.e3 ? 2 : t < CUT.e4 ? 3 : t < CUT.e5 ? 4 : t < CUT.e6 ? 5 : 6;
}
const wide = (E) => E.ORIENT === "landscape";
const hype = (size, color = B.C.white) => ({ font: B.FONT.hero, weight: 900, size, tracking: -0.035, color });

export default {
  async load(E) {
    surfaces(E);
    W = E.words.filter((w) => w.section === "endcard");
    her = await slot(E, "her_victory");
    him = await slot(E, "him_holds_matcha");
    box.her = her.v ? unionBox(her.v, clipT(her.v, K.her, CUT.e2), clipT(her.v, K.her, CUT.e3)) : [0.35, 0.05, 0.65, 0.95];
    box.him = him.v ? unionBox(him.v, clipT(him.v, K.him, CUT.e3), clipT(him.v, K.him, CUT.e4)) : [0.6, 0.05, 0.9, 0.95];
    box.her4 = her.v ? unionBox(her.v, clipT(her.v, K.her4, CUT.e4), clipT(her.v, K.her4, CUT.e5)) : box.her;
    box.him4 = him.v ? unionBox(him.v, clipT(him.v, K.him4, CUT.e4), clipT(him.v, K.him4, CUT.e5)) : box.him;
    logo = await loadLogo((wide(E) ? 560 : 500) * E.SCALE);
    wall = buildWall(E);
    await HP.load(E);
  },
  async prepare(E, t) {
    const sh = shotAt(t);
    if (sh === 1) await HP.prepare(E, t);
    else if (sh === 2 && her.v) await her.v.frame(clipT(her.v, K.her, t));
    else if (sh === 3 && him.v) await him.v.frame(clipT(him.v, K.him, t));
    else if (sh === 4) {
      if (her.v) await her.v.frame(clipT(her.v, K.her4, t));
      if (him.v && him.v !== her.v) await him.v.frame(clipT(him.v, K.him4, t));
    }
  },
  render(E, t, rt, layer) {
    const sh = shotAt(t), b = layer.id === "endcard_b";
    E.renderer.setRenderTarget(rt);
    if (sh === 1) HP.render(E, t, rt);
    else if (sh === 2) e2(E, t, rt);
    else if (sh === 3) e3(E, t, rt);
    else if (sh === 4) e4(E, t, rt);
    else e56(E, t, rt, b);
  },
};

// ------------------------------------------------------------------------------------------------ helpers
function blitBack(E, rt) {
  const [g1] = surfaces(E);
  g1.commit();
  E.renderer.setRenderTarget(rt);
  E.blitG2D(E, g1, 1);
}
function blitFront(E) {
  const [, g2] = surfaces(E);
  g2.commit();
  E.blitG2D(E, g2, 1);
}
function shadowUnder(E, c, v, opts, bx, a = 0.6) {
  const r = E.plateRect(E, v, opts), S = E.SCALE;
  const cx = r.x + ((opts.mirror ? 1 - (bx[0] + bx[2]) / 2 : (bx[0] + bx[2]) / 2)) * r.w;
  contactShadow(c, cx, r.y + bx[3] * r.h - 4 * S, (bx[2] - bx[0]) * r.w * 0.62, 26 * S, a);
}
// a mono tag with a leader line from a tracked point
function tag(E, f, px, py, lines, t, t0, o = {}) {
  if (t < t0) return;
  const S = E.SCALE, u = ease.outCubic(clamp((t - t0) / 0.18)), dx = (o.dx ?? 90) * S, dy = (o.dy ?? -70) * S;
  const ex = px + dx * u, ey = py + dy * u, right = dx < 0;
  f.save();
  f.strokeStyle = o.color ?? B.C.green; f.fillStyle = o.color ?? B.C.green; f.lineWidth = 2 * S;
  f.beginPath(); f.arc(px, py, 6 * S, 0, 6.2832); f.fill();
  f.beginPath(); f.moveTo(px, py); f.lineTo(ex, ey); f.lineTo(ex + (right ? -40 : 40) * S * u, ey); f.stroke();
  f.restore();
  // a dark plate so the tag reads over anything (the FOUNDER! wall included)
  const fz = (o.size ?? 30) * S, lh = fz * 1.4, tx = ex + (right ? -50 : 50) * S;
  f.save();
  f.font = `700 ${fz}px "JetBrains Mono"`; f.letterSpacing = `${0.12 * fz}px`;
  const tw = Math.max(...lines.map((ln) => f.measureText(ln.s).width)), pad = 14 * S;
  f.globalAlpha = 0.86 * u; f.fillStyle = B.C.bg;
  f.beginPath(); f.roundRect(right ? tx - tw - pad : tx - pad, ey - lh * 0.5 - pad * 0.6, tw + pad * 2, lh * lines.length + pad * 1.2, 6 * S); f.fill();
  f.restore();
  lines.forEach((ln, i) => {
    const n = Math.floor(clamp((t - t0 - 0.08 - i * 0.12) * 40, 0, ln.s.length));
    if (n > 0) label(E, f, ln.s.slice(0, n), tx, ey + i * lh, { size: o.size ?? 30, color: ln.c ?? B.C.white, align: right ? "right" : "left", weight: 700 });
  });
}

// ------------------------------------------------------------------------------------------------ E2 her chant
function e2(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = her.v, lt = v ? clipT(v, K.her, t) : 0, [g1, g2] = surfaces(E), c = g1.ctx;
  const tgt = wide(E) ? { h: 0.86 * E.H, y1: 0.955 * E.H, cx: 0.7 * E.W } : { h: 0.5 * E.H, y1: 0.93 * E.H, cx: 0.55 * E.W };
  const opts = v ? frameBox(E, v, box.her, tgt) : null;
  g1.clear();
  groundA(c, E, t, { offY: -(t - CUT.e2) * 16 * S });
  B.rules(c, 0.06 * E.H, 0.94 * E.H, E.W, { color: B.C.greenA(0.3) });
  if (v) shadowUnder(E, c, v, opts, box.her);
  // MID: the chant in her serif
  const serif = (size) => ({ font: B.FONT.serif, italic: true, weight: 400, size, color: B.C.coral, align: "left", stroke: 1.6 * S, strokeColor: B.C.coral });
  const x0 = wide(E) ? 0.055 * E.W : R.x + 20 * S, y1 = wide(E) ? 0.33 * E.H : R.y + R.h * 0.12, y2 = wide(E) ? 0.63 * E.H : R.y + R.h * 0.3;
  const s1 = wide(E) ? 210 * S : E.fitSize(c, "I'm an AI", serif(200 * S), R.w * 0.9), s2 = wide(E) ? 310 * S : E.fitSize(c, "founder!", serif(300 * S), R.w * 0.95);
  let x = x0;
  for (const [w, txt] of [[W[0], "I'm "], [W[1], "an "], [W[2], "AI"]]) {
    const ww = E.measure(c, txt, serif(s1));
    if (t >= w.s - 0.05) E.drawText(c, txt, x, y1, { ...serif(s1), s: E.popScale(t, w.s, { from: 1.22, k: 300, z: 0.45 }), alpha: E.wordAlpha(t, w.s, 1e9) });
    x += ww;
  }
  if (t >= W[3].s - 0.05) E.drawText(c, "founder!", x0, y2, { ...serif(s2), s: E.popScale(t, W[3].s, { from: 1.3, k: 280, z: 0.42 }), alpha: E.wordAlpha(t, W[3].s, 1e9) });
  blitBack(E, rt);
  if (v) E.drawPlate(E, v, { ...opts, matte: true });
  // FRONT: tracked tag on her
  g2.clear();
  if (v) {
    // anchored on her hair beside the face (the matte top would jump to her raised fist)
    const nose = smoothPt(v, lt, 0) ?? [0.5, 0.2], [hx, hy] = E.plateToScreen(E, v, [nose[0] + 0.045, nose[1] - 0.07], opts);
    tag(E, g2.ctx, hx, hy, [{ s: "● FOUNDER", c: B.C.green }, { s: "PROFITABLE" }], t, 148.94, { dx: wide(E) ? 130 : 90, dy: -70 });
  }
  blitFront(E);
  E.hud.sub = false;
}

// ------------------------------------------------------------------------------------------------ E3 him + the wall
function buildWall(E) {
  const S = E.SCALE, size = (wide(E) ? 150 : 120) * S, f = { font: B.FONT.hero, weight: 900, size, tracking: -0.035 };
  const mk = (color) => {
    const cv = document.createElement("canvas"), x = cv.getContext("2d");
    x.font = `900 ${size}px "Inter Tight"`;
    x.letterSpacing = `${-0.035 * size}px`;
    const unit = x.measureText("FOUNDER! ").width;
    cv.width = Math.ceil(unit * (Math.ceil((E.W * 1.6) / unit) + 1));
    cv.height = Math.ceil(size * 1.05);
    x.font = `900 ${size}px "Inter Tight"`; x.letterSpacing = `${-0.035 * size}px`;
    x.fillStyle = color; x.textBaseline = "middle";
    for (let k = 0; k * unit < cv.width; k++) x.fillText("FOUNDER!", k * unit, cv.height / 2);
    return { cv, unit };
  };
  return { white: mk(B.C.white), green: mk(B.C.green), dim: mk("#2c3a25"), size };
}
function e3(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = him.v, lt = v ? clipT(v, K.him, t) : 0, [g1, g2] = surfaces(E), c = g1.ctx;
  const tgt = wide(E) ? { h: 0.84 * E.H, y1: 0.955 * E.H, x1: 0.93 * E.W } : { h: 0.5 * E.H, y1: 0.93 * E.H, cx: 0.6 * E.W };
  const opts = v ? frameBox(E, v, box.him, tgt) : null;
  g1.clear();
  groundA(c, E, t, { offX: (t - CUT.e3) * 16 * S });
  // MID: the stadium. A dim wall of FOUNDER! waits behind him from the cut; on the gang's "Founder!" it lights up,
  // row by row, top to bottom, with a jolt (one luminance change, well under the flash limit).
  const wf = W[4], rh = wall.size * 1.02, n = Math.ceil(E.H / rh) + 1;
  for (let i = 0; i < n; i++) {
    const dir = i % 2 ? 1 : -1, off = ((i * 0.37) % 1) * wall.dim.unit, drift = (t - CUT.e3) * 34 * S * dir;
    const lit = ease.outCubic(clamp((t - (wf.s - 0.03) - i * 0.016) / 0.07)), jolt = (1 - lit) * (t >= wf.s - 0.03 ? 46 : 0) * S * dir;
    const x = -off + drift + jolt - wall.dim.unit, y = i * rh - rh * 0.35;
    c.globalAlpha = 0.6;
    c.drawImage(wall.dim.cv, x, y);
    if (lit > 0) {
      c.globalAlpha = 0.95 * lit;
      c.drawImage(i % 3 === 1 ? wall.green.cv : i % 3 === 2 ? wall.dim.cv : wall.white.cv, x, y);
    }
  }
  c.globalAlpha = 1;
  if (v) shadowUnder(E, c, v, opts, box.him);
  blitBack(E, rt);
  if (v) E.drawPlate(E, v, { ...opts, matte: true });
  // FRONT: the tag on her matcha (in his hands)
  g2.clear();
  if (v) {
    const cup = poseMid(v, lt, [15, 16]) ?? [0.78, 0.45], [cx, cy] = E.plateToScreen(E, v, cup, opts);
    tag(E, g2.ctx, cx, cy - 20 * S, [{ s: "HOLDING · 1× ICED MATCHA", c: B.C.green }, { s: "$6.15 · PAID BY: HER" }], t, CUT.e3 + 0.12, { dx: wide(E) ? -170 : -120, dy: -120 });
  }
  blitFront(E);
  E.hud.sub = false;
  if (t >= W[4].s - 0.03) E.hud.meter = false; // the lit wall would swallow the small meter for half a second
}

// ------------------------------------------------------------------------------------------------ E4 both + the strike
function e4(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, [g1, g2] = surfaces(E), c = g1.ctx;
  const vh = her.v, vm = him.v, same = vh && vh === vm;
  const th = wide(E) ? { h: 0.93 * E.H, y1: 0.995 * E.H, cx: 0.33 * E.W } : { h: 0.46 * E.H, y1: 0.9 * E.H, cx: 0.31 * E.W };
  const tm = wide(E) ? { h: 0.8 * E.H, y1: 0.995 * E.H, cx: 0.69 * E.W } : { h: 0.4 * E.H, y1: 0.9 * E.H, cx: 0.72 * E.W };
  const oh = vh ? frameBox(E, vh, box.her4, th) : null, om = vm && !same ? frameBox(E, vm, box.him4, tm) : null;
  g1.clear();
  groundA(c, E, t, { offY: (t - CUT.e4) * 14 * S });
  if (vh) shadowUnder(E, c, vh, oh, box.her4);
  if (om) shadowUnder(E, c, vm, om, box.him4);
  // MID: I'M AN AI FOUNDER! slams word by word behind them (her fist punches up through it), then her pen strikes it
  const f = c, txt = ["I'M ", "AN ", "AI ", "FOUNDER!"], ws = [W[5], W[6], W[7], W[8]];
  const size = wide(E) ? E.fitSize(f, "I'M AN AI FOUNDER!", hype(160 * S), E.W * 0.86) : E.fitSize(f, "FOUNDER!", hype(200 * S), R.w * 0.92);
  const lines = wide(E) ? [[0, 1, 2, 3]] : [[0, 1, 2], [3]];
  const y0 = wide(E) ? 0.105 * E.H : R.y + R.h * 0.1, lh = size * 1.0;
  let sx0 = 0, sx1 = 0;
  lines.forEach((ln, li) => {
    const tw = ln.reduce((a, i) => a + E.measure(f, txt[i], hype(size)), 0);
    let x = E.W / 2 - tw / 2;
    if (li === 0) { sx0 = x; sx1 = x + tw; }
    for (const i of ln) {
      const w = ws[i], ww = E.measure(f, txt[i], hype(size));
      if (t >= w.s - 0.05) E.drawText(f, txt[i], x, y0 + li * lh, { ...hype(size, i === 3 ? B.C.green : B.C.white), align: "left", s: E.popScale(t, w.s, { from: 1.35, k: 320, z: 0.5 }), alpha: E.wordAlpha(t, w.s, 1e9) });
      x += ww;
    }
  });
  for (let li = 0; li < lines.length; li++) B.penStrike(f, sx0 - 10 * S, y0 + li * lh + 4 * S, sx1, t, 153.7 + li * 0.08, { dur: 0.16, width: 12 * S, seed: 9 + li, amp: 5 * S });
  blitBack(E, rt);
  if (om) E.drawPlate(E, vm, { ...om, matte: true });
  if (vh) E.drawPlate(E, vh, { ...oh, matte: true });
  E.hud.sub = false;
  E.hud.meter = false; // the line runs across the top; the meter is back, big, on the drop
}

// ------------------------------------------------------------------------------------------------ E5/E6 the slogan, then the brand
function lockup(E, b) {
  const S = E.SCALE, R = E.SAFE, cell = Math.max(2, Math.round(8 * S));
  if (wide(E)) {
    const sh = b ? -0.05 : 0;
    return { size: 190 * S, rows: 17, cell, l1: (0.2 + sh) * E.H, l2: (0.385 + sh) * E.H, meterY: 0.6 * E.H, logoY: (0.64 + sh) * E.H, tagY: (0.8 + sh) * E.H, bannerY: 0.835 * E.H, two: true };
  }
  const size = 0;
  return { size: 120 * S, rows: 13, cell, l1: R.y + R.h * (b ? 0.07 : 0.1), l2: R.y + R.h * (b ? 0.2 : 0.235), l3: R.y + R.h * (b ? 0.33 : 0.37), meterY: R.y + R.h * 0.55, logoY: R.y + R.h * (b ? 0.53 : 0.6), tagY: R.y + R.h * (b ? 0.665 : 0.74), bannerY: R.y + R.h * 0.78, two: false };
}
function e56(E, t, rt, b) {
  const S = E.SCALE, R = E.SAFE, [g1] = surfaces(E), c = g1.ctx, L = lockup(E, b), stab = t >= CUT.e6;
  g1.clear();
  groundA(c, E, t, { offY: -(t - CUT.e5) * 9 * S, gridA: 0.5 });
  const t0 = CUT.e5, pop = (d = 0) => E.popScale(t, t0 + d, { from: 1.28, k: 300, z: 0.5 }), al = (d = 0) => clamp((t - (t0 + d - 0.05)) / 0.035);
  const size = wide(E) ? L.size : E.fitSize(c, "MAKE EVERY", hype(L.size), R.w * 0.92);
  const tokO = { rows: L.rows, cell: L.cell, color: B.C.green, line: B.C.cell, seed: 21 };
  const tok = B.pixelSize("TOKEN", tokO);
  const rev = clamp((t - (t0 - 0.03)) / 0.42);
  if (wide(E)) {
    E.drawText(c, "MAKE EVERY", E.W / 2, L.l1, { ...hype(size), align: "center", s: pop(), alpha: al() });
    const cw = E.measure(c, " COUNT.", hype(size)), x0 = E.W / 2 - (tok.w + cw) / 2;
    B.pixelText(c, "TOKEN", x0, L.l2 - tok.h / 2, { ...tokO, reveal: rev });
    E.drawText(c, " COUNT.", x0 + tok.w, L.l2, { ...hype(size), align: "left", s: pop(0.02), alpha: al(0.02) });
    if (rev >= 1) glint(c, E, t, x0, L.l2 - tok.h / 2, tok, tokO);
  } else {
    E.drawText(c, "MAKE EVERY", E.W / 2, L.l1, { ...hype(size), align: "center", s: pop(), alpha: al() });
    B.pixelText(c, "TOKEN", E.W / 2, L.l2 - tok.h / 2, { ...tokO, align: "center", reveal: rev });
    E.drawText(c, "COUNT.", E.W / 2, L.l3, { ...hype(size), align: "center", s: pop(0.02), alpha: al(0.02) });
    if (rev >= 1) glint(c, E, t, E.W / 2 - tok.w / 2, L.l2 - tok.h / 2, tok, tokO);
  }
  if (!stab) {
    // the meter, big: the spine at its last state
    const u = ease.outCubic(clamp((t - 154.6) / 0.25)), o = { rows: wide(E) ? 11 : 9, cell: L.cell, color: B.C.green, line: B.C.cell };
    if (u > 0) {
      const val = B.fmtInt(B.tokensAt(E, t)), sz = pixelCountSize(val, o), x = E.W / 2 - sz.w / 2, y = L.meterY + (1 - u) * 30 * S;
      c.save(); c.globalAlpha = u;
      label(E, c, "TOP-UP APPROVED", x, y - 30 * S, { size: 24, color: B.C.green });
      pixelCount(c, val, x, y, o);
      const by = y + sz.h + 28 * S;
      c.fillStyle = B.C.green; c.fillRect(x, by, sz.w, 10 * S);
      for (let i = 1; i < 10; i++) { c.fillStyle = B.C.bg; c.fillRect(x + (sz.w * i) / 10 - S, by, 2 * S, 10 * S); }
      label(E, c, "PAID BY: HER", x, by + 40 * S, { size: 20, weight: 600, color: B.C.whiteA(0.6) });
      c.restore();
    }
  } else {
    // THE STAB: the meter becomes the brand
    const lw = logo.width, lh = logo.height;
    c.drawImage(logo, Math.round(E.W / 2 - lw / 2), Math.round(L.logoY - lh / 2));
    const ts = wide(E) ? 46 * S : E.fitSize(c, "The usage runtime for AI products", { font: B.FONT.hero, weight: 500, size: 44 * S }, R.w * 0.92);
    const ua = clamp((t - (CUT.e6 + 0.1)) / 0.12);
    E.drawText(c, "The usage runtime for AI products", E.W / 2, L.tagY + (1 - ua) * 10 * S, { font: B.FONT.hero, weight: 500, size: ts, tracking: -0.01, color: B.C.paper, align: "center", alpha: 0.88 * ua });
    if (b) banner(E, c, t, L.bannerY);
    // the lockup's own After Tokens frame: corner crosshairs just outside the type's cap and the tagline
    const fx = wide(E) ? 0.18 * E.W : R.x + 10 * S, fy = Math.max(R.y + 12 * S, L.l1 - size * 0.62 - 44 * S);
    B.crosshairs(c, fx, fy, E.W - 2 * fx, (b ? L.bannerY - 36 * S : L.tagY + 60 * S) - fy, { len: 40 * S, inset: 12 * S, cross: 8 * S, color: B.C.greenA(0.5) });
  }
  blitBack(E, rt);
  E.hud.sub = false;
  E.hud.meter = false;
  if (stab) E.hud.alpha = 0;
  E.post.punch = t < CUT.e6 + 0.1 ? 0.028 * E.pulse("kicks", t, 0.09) : 0;
}
// a slow light sweep across TOKEN's cells (the final hold keeps moving)
function glint(c, E, t, x, y, sz, o) {
  const S = E.SCALE, p = ((t - CUT.e5 - 0.45) / 1.6) % 1, bx = x - sz.w * 0.3 + p * sz.w * 1.6, bw = sz.w * 0.16;
  c.save();
  c.beginPath(); c.rect(bx, y - 4 * S, bw, sz.h + 8 * S); c.clip();
  B.pixelText(c, "TOKEN", x, y, { ...o, color: B.C.pale, reveal: 1 });
  c.restore();
}
// variant b: the After Tokens strip (Stigg's own site banner): rules, corner grid + crosshair, After + pixel TOKENS, NOV 10 / SAN FRANCISCO
function banner(E, c, t, y) {
  const S = E.SCALE, R = E.SAFE, u = clamp((t - (CUT.e6 + 0.22)) / 0.2), h = (wide(E) ? 96 : 150) * S;
  if (u <= 0) return;
  c.save(); c.globalAlpha = u;
  const g = B.C.greenA(0.45);
  c.fillStyle = g; c.fillRect(0, Math.round(y), E.W, Math.max(1, S)); c.fillRect(0, Math.round(y + h), E.W, Math.max(1, S));
  const title = { font: B.FONT.hero, weight: 800, size: (wide(E) ? 60 : 54) * S, tracking: -0.035, color: B.C.white };
  const aw = E.measure(c, "AFTER ", title), po = { rows: 14, cell: Math.max(2, Math.round(3 * S)), color: B.C.green, line: B.C.cell, reveal: clamp((t - (CUT.e6 + 0.22)) / 0.45), seed: 4 };
  const pw = B.pixelSize("TOKENS", po).w, meta = "NOV 10 / SAN FRANCISCO";
  c.font = `400 ${24 * S}px "JetBrains Mono"`; c.letterSpacing = `${0.03 * 24 * S}px`;
  const mw = c.measureText(meta).width, corner = 70 * S, gap = 48 * S;
  if (wide(E)) {
    const tw = corner + gap + aw + pw + gap * 2 + mw + gap, x0 = E.W / 2 - tw / 2;
    // corner grid + crosshair
    c.fillStyle = g;
    c.fillRect(x0 + 22 * S, y, Math.max(1, S), h); c.fillRect(x0 + 45 * S, y, Math.max(1, S), h); c.fillRect(x0 + corner, y, Math.max(1, S), h);
    c.fillRect(x0, y + 23 * S, corner, Math.max(1, S)); c.fillRect(x0, y + 74 * S, corner, Math.max(1, S));
    c.fillStyle = B.C.green; c.fillRect(x0 + 11 * S, y + 22 * S, 22 * S, 2 * S); c.fillRect(x0 + 21 * S, y + 12 * S, 2 * S, 22 * S);
    c.fillStyle = B.C.line; c.fillRect(x0 - S, y, Math.max(1, S), h); c.fillRect(x0 + tw, y, Math.max(1, S), h);
    const tx = x0 + corner + gap;
    E.drawText(c, "AFTER ", tx, y + h / 2, { ...title, align: "left" });
    B.pixelText(c, "TOKENS", tx + aw, y + h / 2 - (po.rows * po.cell) / 2, po);
    const mx = tx + aw + pw + gap;
    c.fillStyle = B.C.line; c.fillRect(mx, y, Math.max(1, S), h);
    drawMeta(c, E, mx + gap, y + h / 2, S);
  } else {
    const tw = aw + pw, tx = E.W / 2 - tw / 2;
    E.drawText(c, "AFTER ", tx, y + h * 0.32, { ...title, align: "left" });
    B.pixelText(c, "TOKENS", tx + aw, y + h * 0.32 - (po.rows * po.cell) / 2, po);
    c.fillStyle = B.C.line; c.fillRect(R.x, y + h * 0.62, R.w, Math.max(1, S));
    drawMeta(c, E, E.W / 2 - mw / 2, y + h * 0.8, S);
  }
  c.restore();
}
function drawMeta(c, E, x, y, S) {
  c.save();
  c.font = `400 ${24 * S}px "JetBrains Mono"`; c.letterSpacing = `${0.03 * 24 * S}px`; c.textBaseline = "middle"; c.textAlign = "left";
  c.fillStyle = B.C.white; c.fillText("NOV 10 ", x, y);
  let w = c.measureText("NOV 10 ").width;
  c.fillStyle = B.C.green; c.fillText("/", x + w, y);
  w += c.measureText("/ ").width;
  c.fillStyle = B.C.white; c.fillText("SAN FRANCISCO", x + w, y);
  c.restore();
}
