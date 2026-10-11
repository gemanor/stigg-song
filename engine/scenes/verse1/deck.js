// HIS pitch deck (look B): every slide of verse1, drawable full-frame with live builds (verse1) or in its final state
// inside HER review pass (pre1). Slides are authored in slide units = 1080p canvas px of the current orientation.
//   slide.back(E, c, st)   graphics behind footage (the caller has set the slide->screen transform on c)
//   slide.plates(E, st)    keyed footage that belongs to the slide (VC, pop-out headshot), mapped through st.xf
//   slide.front(E, c, st)  graphics in front of footage
//   slide.anchors(st)      points HER red pen aims at (slide units)
// st = { t: song time (live things), tb: build time (= t in verse1, +inf for a finished slide), U: units(E),
//        xf: {ox, oy, z} slide units -> screen units, v: {cu, vc} clips, lt: {cu, vc} clip-local times }
import * as B from "../../brand.js";
import {
  C, T, M, measure, fit, hl, eyebrow, footer, pix, pixW, odo, odoW, plate, frameAt, fpt, headshot, prop, propW,
  icicles, crystal, rrect, wipeStrike, tri, check, clamp, lerp, oc, io, oq, oexpo, land, settle, slam, hsh,
} from "./kit.js";

const CAP = 0.7275; // Inter Tight cap height (em)
export const O = {}; // named onsets (song seconds)
let ready = false;
export function initDeck(E) {
  if (ready) return O;
  const L = E.section("verse1"), w = (li, wi) => L[li].words[wi].s, we = (li, wi) => L[li].words[wi].e;
  Object.assign(O, {
    v0: 17.4, salary: w(0, 4), iTake: w(1, 0), token: w(1, 3), budget: w(1, 4),
    burned: w(2, 0), quarter: w(2, 2), and4: w(3, 0), investors: w(3, 2), love: w(3, 3), loveE: we(3, 4),
    my5: w(4, 0), cofounder: w(4, 1), mac: w(4, 3), mini: w(4, 4), sitting: w(5, 0), shelf: w(5, 3),
    it7: w(6, 0), sleeps: w(6, 2), eats: w(6, 5), its8: w(7, 0), basically: w(7, 1), myself: w(7, 2),
    closed: w(8, 0), seed: w(8, 2), cold: w(8, 5), plunge: w(8, 6), it10: w(9, 0), flash: w(9, 5),
    he11: w(10, 0), feel: w(10, 2), fingers: w(10, 4), but12: w(11, 0), wired: w(11, 2), cash: w(11, 5),
    matcha: w(12, 0), record13: w(12, 3), high13: w(12, 4), theres: w(13, 0), shortage: w(13, 2), japan: w(13, 4),
    my15: w(14, 0), valuation: w(14, 1), record15: w(14, 4), high15: w(14, 5), i16: w(15, 0), dont16: w(15, 1), plan: w(15, 4),
  });
  const P = E.section("pre1"), p = (li, wi) => P[li].words[wi].s;
  Object.assign(O, {
    so: p(0, 0), cofounder2: p(0, 2), a2: p(0, 3), computer: p(0, 4),
    and2: p(1, 0), moneys: p(1, 2), made: p(1, 3), air: p(1, 5),
    and3: p(2, 0), youd: p(2, 1), freeze: p(2, 3), vc: p(2, 5),
    than: p(3, 0), take: p(3, 1), me: p(3, 2), anywhere: p(3, 3),
  });
  ready = true;
  return O;
}

// ----------------------------------------------------------------------------------------------------- layout helpers
// content box: presenter slides keep the left (landscape) / bottom (portrait) free for HIM
function box(U, presenter) {
  const { W0, H0, P, R } = U;
  if (P) return { x: R.x + 40, y: R.y + 210, w: R.w - 80, h: presenter ? 470 : 760, P };
  return presenter ? { x: 930, y: 250, w: 890, h: 640, P } : { x: 140, y: 250, w: 1640, h: 640, P };
}
const sx = (st, x) => st.xf.ox + x * st.xf.z; // slide units -> screen units
const sy = (st, y) => st.xf.oy + y * st.xf.z;
const ss = (st, s) => s * st.xf.z;
// text width cache shortcut
const tw = (E, c, s, size, o = {}) => measure(E, c, s, { size, ...o });
// a word that lands on its onset (alpha + slam scale), returns alpha
function word(E, c, s, x, y, t, on, o = {}) {
  if (t < on - 0.066) return 0;
  const k = o.from === undefined ? slam(t, on, 1.28) : slam(t, on, o.from);
  const a = clamp((t - (on - 0.066)) / 0.05);
  E.drawText(c, s, x, y, { font: B.FONT.hero, weight: 900, size: 100, color: C.ink, align: "left", tracking: -0.035, baseline: "alphabetic", ...o, s: k * (o.s ?? 1), alpha: a * (o.alpha ?? 1) * c.globalAlpha });
  return a;
}
// left-aligned slam scales around the text's own left/baseline point: emulate with translate
function wordL(E, c, s, x, y, t, on, o = {}) {
  if (t < on - 0.066) return 0;
  const k = slam(t, on, o.from ?? 1.22), a = clamp((t - (on - 0.066)) / 0.05);
  const w = measure(E, c, s, { size: o.size ?? 100, weight: o.weight ?? 900, tracking: o.tracking ?? -0.035, font: o.font });
  c.save();
  c.translate(x + w / 2, y - (o.size ?? 100) * CAP * 0.5);
  c.scale(k, k);
  E.drawText(c, s, 0, (o.size ?? 100) * CAP * 0.5, { font: B.FONT.hero, weight: 900, size: 100, color: C.ink, align: "center", tracking: -0.035, baseline: "alphabetic", ...o, alpha: a * (o.alpha ?? 1) * c.globalAlpha });
  c.restore();
  return a;
}
// marker bar behind caps text at baseline y (size px), sweeping on over [t0, t0+d]
function marker(c, x, y, w, size, t, t0, d = 0.12, col = C.green) {
  const p = oc((t - t0) / d);
  if (p <= 0) return;
  c.fillStyle = col;
  c.fillRect(x - size * 0.06, y - size * CAP * 0.62, (w + size * 0.12) * p, size * CAP * 0.78);
}
function pill(E, c, x, y, h, label, o = {}) {
  const size = o.size ?? h * 0.44, w = measure(E, c, label, { font: B.FONT.mono, weight: 700, size, tracking: 0.1 }) + h * 0.9 + (o.icon ? h * 0.7 : 0);
  c.save();
  c.globalAlpha *= o.alpha ?? 1;
  rrect(c, x, y, w, h, h / 2);
  c.fillStyle = o.bg ?? C.ink;
  c.fill();
  if (o.stroke) { c.lineWidth = 3; c.strokeStyle = o.stroke; c.stroke(); }
  let tx = x + h * 0.45;
  if (o.icon === "dot") { c.fillStyle = o.dot ?? C.green; c.beginPath(); c.arc(tx + h * 0.16, y + h / 2, h * 0.14, 0, 6.283); c.fill(); tx += h * 0.6; }
  if (o.icon === "check") { check(c, tx + h * 0.2, y + h * 0.52, h * 0.42, o.fg ?? C.green, h * 0.1); tx += h * 0.65; }
  E.drawText(c, label, tx, y + h * 0.53, { font: B.FONT.mono, weight: 700, size, tracking: 0.1, color: o.fg ?? C.green, align: "left" });
  c.restore();
  return w;
}

// ===================================================================================================== 01 TITLE
export const TITLE = {
  num: "01",
  back(E, c, st) {
    const { U, tb } = st, bx = box(U, true);
    if (U.P) {
      eyebrow(E, c, "SEED DECK · CONFIDENTIAL", bx.x, bx.y + 20);
      const size = fit(E, c, "building.", { size: 300, tracking: -0.045 }, bx.w);
      const y = bx.y + 120 + size * CAP;
      marker(c, bx.x, y, tw(E, c, "building.", size, { tracking: -0.045 }), size, 1, 0);
      T(E, c, "building.", bx.x, y, { size, tracking: -0.045, baseline: "alphabetic" });
      M(E, c, "v47_FINAL_final(2).key", bx.x, y + 80, { size: 30, color: C.inkA(0.55), tracking: 0.04 });
    } else {
      eyebrow(E, c, "SEED DECK · CONFIDENTIAL", 700, 330);
      const size = fit(E, c, "building.", { size: 330, tracking: -0.045 }, 1780 - 700), y = 640, w = tw(E, c, "building.", size, { tracking: -0.045 });
      marker(c, 700, y, w, size, 1, 0);
      T(E, c, "building.", 700, y, { size, tracking: -0.045, baseline: "alphabetic" });
      M(E, c, "v47_FINAL_final(2).key", 704, y + 96, { size: 32, color: C.inkA(0.55), tracking: 0.04 });
    }
    footer(E, c, U, "01");
  },
  plates() {},
  front() {},
};

// ===================================================================================================== 02 COMPENSATION
export const COMP = {
  num: "02",
  back(E, c, st) {
    const { U, tb, t } = st, bx = box(U, true);
    const s1 = U.P ? 120 : 150;
    const x0 = bx.x, x1 = bx.x + bx.w;
    const y1 = bx.y + (U.P ? 90 : 120) + s1 * CAP, y2 = y1 + (U.P ? 190 : 230);
    eyebrow(E, c, "COMPENSATION", x0, bx.y + 6);
    // row 1: SALARY ...... $0   (struck by his own clean strike on "I take")
    const struck = clamp((tb - O.iTake) / 0.12);
    const dim = 1 - 0.62 * oc((tb - O.iTake - 0.1) / 0.2);
    c.save();
    c.globalAlpha = dim;
    T(E, c, "SALARY", x0, y1, { size: s1, baseline: "alphabetic", tracking: -0.035 });
    const wS = tw(E, c, "SALARY", s1, { tracking: -0.035 }), w0 = tw(E, c, "$0", s1, { tracking: -0.035 });
    // dotted leader
    c.fillStyle = C.inkA(0.35);
    for (let x = x0 + wS + 28; x < x1 - w0 - 28; x += 22) c.fillRect(x, y1 - 14, 8, 8);
    wordL(E, c, "$0", x1 - w0, y1, tb, O.salary, { size: s1, tracking: -0.035 });
    c.restore();
    if (struck > 0) wipeStrike(c, x0, x1, y1 - s1 * CAP * 0.45, struck, { h: U.P ? 12 : 14 });
    // row 2: TOKEN BUDGET (green marker) + live meter pill
    const s2 = fit(E, c, "TOKEN BUDGET", { size: U.P ? 120 : 140, tracking: -0.035 }, bx.w);
    const wT = tw(E, c, "TOKEN", s2, { tracking: -0.035 }) + s2 * 0.26, wB = tw(E, c, "BUDGET", s2, { tracking: -0.035 });
    marker(c, x0, y2, wT - s2 * 0.12, s2, tb, O.token - 0.1, 0.1);
    marker(c, x0 + wT - s2 * 0.2, y2, wB + s2 * 0.2, s2, tb, O.budget - 0.1, 0.1);
    wordL(E, c, "TOKEN", x0, y2, tb, O.token, { size: s2 });
    wordL(E, c, "BUDGET", x0 + wT, y2, tb, O.budget, { size: s2 });
    // live balance in a dark pill (the meter, read from tokensAt)
    if (tb >= O.budget - 0.066) {
      const a = oc((tb - O.budget + 0.066) / 0.15), ph = U.P ? 92 : 104, py = y2 + (U.P ? 46 : 56);
      const tok = (tt) => B.tokensAt(E, tt), cell = U.P ? 6 : 7, ow = odoW(tok(t), { rows: 9, cell });
      const lab = "/ MONTH", lw = measure(E, c, lab, { font: B.FONT.mono, weight: 700, size: 28, tracking: 0.1 });
      const pw = ow + lw + 100;
      c.save();
      c.globalAlpha = a;
      c.translate(0, (1 - a) * 18);
      rrect(c, x0, py, pw, ph, 14);
      c.fillStyle = C.ink;
      c.fill();
      odo(c, tok, t, x0 + 30, py + (ph - 9 * cell) / 2 - 2, { rows: 9, cell });
      M(E, c, lab, x0 + 50 + ow, py + ph / 2 + 2, { size: 28, color: C.whiteA(0.7), weight: 700, tracking: 0.1 });
      c.restore();
    }
    footer(E, c, U, "02");
  },
  plates() {},
  front() {},
};

// ===================================================================================================== 03 BURN (hero)
// The token meter as a giant pixel odometer on a dark dashboard card; the quarter-million roll is B.tokensAt's own.
// Line 2 ("and my investors love it"): magic move: the odometer docks top-left, the burn chart takes the card, and a
// second line, INVESTOR LOVE, rockets out of the bottom of the cliff (the scissors chart).
const BURN_T0 = 17.4, BURN_T1 = 22.2;
export const BURN = {
  num: "03",
  panel(U) {
    const { W0, H0, P, R } = U;
    return P ? { x: R.x + 6, y: R.y + 20, w: R.w - 12, h: R.h - 170 } : { x: 64, y: 118, w: W0 - 128, h: 790 };
  },
  back(E, c, st) {
    const { U, t, tb } = st, pn = this.panel(U), P = U.P;
    const tok = (tt) => B.tokensAt(E, tt);
    rrect(c, pn.x, pn.y, pn.w, pn.h, P ? 26 : 30);
    c.fillStyle = C.bg;
    c.fill();
    c.save();
    rrect(c, pn.x, pn.y, pn.w, pn.h, 30);
    c.clip();
    B.hairGrid(c, pn.x, pn.y, pn.w, pn.h, { step: P ? 72 : 96, color: C.line, alpha: 0.55 });
    const ix = pn.x + (P ? 36 : 64), iy = pn.y + (P ? 50 : 64), iw = pn.w - (P ? 72 : 128);
    // header
    M(E, c, "TOKEN BUDGET", ix, iy, { color: C.whiteA(0.72), size: P ? 24 : 28, weight: 700 });
    const lw = measure(E, c, "TOKEN BUDGET", { font: B.FONT.mono, weight: 700, size: P ? 24 : 28, tracking: 0.12 });
    c.fillStyle = C.green;
    c.globalAlpha = 0.6 + 0.4 * E.pulse("beats", t, 0.25);
    c.beginPath();
    c.arc(ix + lw + 30, iy, 7, 0, 6.283);
    c.fill();
    c.globalAlpha = 1;
    M(E, c, "LIVE", ix + lw + 46, iy, { color: C.green, size: P ? 24 : 28, weight: 700 });
    M(E, c, "03/12 · BURN", pn.x + pn.w - (P ? 36 : 64), iy, { color: C.whiteA(0.45), size: P ? 20 : 26, align: "right" });
    // magic move on "and (my investors love it)"
    const m = st.live ? io((tb - O.and4 + 0.04) / 0.32) : 1;
    const rows = 12, cell = Math.floor((iw - (P ? 0 : 90)) / odoW(999999, { rows, cell: 1 }));
    const bigW = odoW(tok(t), { rows, cell });
    // odometer: big & centred -> docked top-left at ~0.42
    const zS = P ? 0.5 : 0.4, z = lerp(1, zS, m);
    const ox = lerp(pn.x + pn.w / 2 - bigW / 2, ix, m), oy = lerp(pn.y + (P ? 110 : 150), iy + (P ? 40 : 46), m);
    // chart rect: small strip -> the whole card
    const chBig = P ? { x: ix, y: pn.y + pn.h - 290, w: iw, h: 210 } : { x: ix, y: pn.y + 540, w: iw, h: 200 };
    const chSm = P ? { x: ix, y: pn.y + 380, w: iw, h: pn.h - 470 } : { x: ix, y: pn.y + 300, w: iw, h: 430 };
    const ch = { x: ix, y: lerp(chBig.y, chSm.y, m), w: iw, h: lerp(chBig.h, chSm.h, m) };
    this.chart(E, c, st, ch, m, pn);
    // the number (drawn over the chart lines)
    const roll = clamp((t - O.quarter) / 0.45);
    const jit = roll > 0 && roll < 1 ? (gx, k) => (hsh(gx * 0.013 + k * 9.1 + Math.floor(t * 60) * 0.37) - 0.5) * cell * 0.8 : null;
    c.save();
    c.translate(ox, oy);
    c.scale(z, z);
    odo(c, tok, t, 0, 0, { rows, cell, jit, tau: 0.1 });
    c.restore();
    // delta label: -250,000 slams on "quarter-million", then docks next to the small number
    if (tb >= O.quarter - 0.066) {
      const k = slam(tb, O.quarter, 1.5), a = clamp((tb - O.quarter + 0.066) / 0.05);
      const size = lerp(P ? 96 : 120, P ? 60 : 78, m);
      const s = "−250,000", w = tw(E, c, s, size), w2 = measure(E, c, " TOKENS", { font: B.FONT.mono, weight: 700, size: size * 0.36, tracking: 0.1 });
      const bx = pn.x + pn.w / 2 - (w + w2) / 2, by = oy + rows * cell * z + (P ? 150 : 160) * lerp(1, 0.4, m);
      const sxp = P ? ix : ix + bigW * zS + 50, syp = P ? oy + rows * cell * z + 110 : iy + 46 + rows * cell * zS * 0.5 + size * CAP * 0.5;
      const dx = lerp(bx, sxp, m), dy = lerp(by, syp, m);
      c.save();
      c.translate(dx + (w + w2) / 2, dy - size * CAP / 2);
      c.scale(k, k);
      c.translate(-(w + w2) / 2, size * CAP / 2);
      E.drawText(c, s, 0, 0, { font: B.FONT.hero, weight: 900, size, color: C.green, align: "left", tracking: -0.035, baseline: "alphabetic", alpha: a });
      M(E, c, " TOKENS", w, -size * 0.05, { size: size * 0.36, color: C.green, weight: 700, alpha: a, baseline: "alphabetic" });
      c.restore();
    }
    // usage bar along the card bottom
    const f = clamp(tok(t) / 1e6), byb = pn.y + pn.h - (P ? 30 : 34);
    c.fillStyle = C.line;
    c.fillRect(ix, byb, iw, 8);
    c.fillStyle = C.green;
    c.fillRect(ix, byb, iw * f, 8);
    c.restore();
    footer(E, c, U, "03");
  },
  chart(E, c, st, ch, m, pn) {
    const { t, tb, U } = st, P = U.P;
    const vmax = B.tokensAt(E, BURN_T0) + 15000, vmin = B.tokensAt(E, BURN_T1) - 45000;
    const tx = (tt) => ch.x + ((tt - BURN_T0) / (BURN_T1 - BURN_T0)) * ch.w;
    const vy = (v) => ch.y + ch.h - ((v - vmin) / (vmax - vmin)) * ch.h;
    c.fillStyle = C.whiteA(0.2);
    c.fillRect(ch.x, ch.y + ch.h, ch.w, 2);
    M(E, c, "TOKENS", ch.x, ch.y + ch.h + 24, { color: C.whiteA(0.5), size: 18, weight: 700 });
    const tEnd = Math.min(t, BURN_T1);
    c.beginPath();
    let first = true;
    for (let tt = BURN_T0; tt <= tEnd + 1e-6; tt += 1 / 30) {
      const x = tx(tt), y = vy(B.tokensAt(E, tt));
      if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y);
    }
    const hx = tx(tEnd), hy = vy(B.tokensAt(E, tEnd));
    c.lineTo(hx, hy);
    c.strokeStyle = C.white;
    c.lineWidth = lerp(5, 7, m);
    c.lineJoin = "round";
    c.stroke();
    c.fillStyle = C.white;
    c.beginPath();
    c.arc(hx, hy, 10, 0, 6.283);
    c.fill();
    // INVESTOR LOVE: out of the bottom of the cliff on "investors", rockets on "love"
    const t0 = O.investors - 0.066;
    if (tb > t0) {
      const cx0 = tx(O.quarter + 0.45), cy0 = vy(B.tokensAt(E, O.quarter + 0.45));
      const u = oc((tb - t0) / (O.love - t0)), u2 = oexpo((tb - O.love + 0.066) / 0.34);
      const top = pn.y + (P ? 300 : 150);
      const xA = lerp(cx0, cx0 + ch.w * 0.05, u), yA = lerp(cy0, cy0 - (cy0 - top) * 0.28, u);
      const xB = lerp(xA, xA + ch.w * 0.05, u2), yB = lerp(yA, top, u2);
      c.save();
      c.strokeStyle = C.green;
      c.lineWidth = 9;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.beginPath();
      c.moveTo(cx0, cy0);
      c.lineTo(xA, yA);
      if (u2 > 0) c.lineTo(xB, yB);
      c.stroke();
      c.restore();
      const hx2 = u2 > 0 ? xB : xA, hy2 = u2 > 0 ? yB : yA;
      tri(c, hx2, hy2 - 8, 40, true, C.green);
      const a = clamp((tb - t0) / 0.06), lx = hx2 + (P ? -30 : 40), al = P ? "right" : "left";
      M(E, c, "INVESTOR LOVE", lx, hy2 + 4, { color: C.green, size: P ? 24 : 30, weight: 800, alpha: a, align: al });
      if (tb >= O.love - 0.066) {
        const k = slam(tb, O.love, 1.45), size = P ? 76 : 104;
        c.save();
        c.translate(lx, hy2 + 22 + size * CAP);
        c.scale(k, k);
        E.drawText(c, "LOVE IT.", 0, 0, { font: B.FONT.hero, weight: 900, size, color: C.white, align: al, tracking: -0.035, baseline: "alphabetic" });
        c.restore();
      }
    }
  },
  plates() {},
  front() {},
};

// ===================================================================================================== 04 TEAM / 05 BENCH
// Two circles: HIM (pop-out headshot, him_cu_talk masked into a circle with his cap breaking out of the top) and the
// Mac mini (prop from his sheet). TEAM ("My co-founder's a Mac mini / sitting on a shelf.") magic-moves into BENCH
// ("It never sleeps, it never eats. / It's basically myself.") where the circles become column heads.
function teamLayout(U, tb) {
  const P = U.P, R = U.R;
  // TEAM
  const A = P ? { l: [R.x + R.w * 0.27, R.y + 470], r: [R.x + R.w * 0.73, R.y + 470], rad: 165 } : { l: [620, 560], r: [1300, 560], rad: 205 };
  // BENCH (column heads)
  const Bq = P ? { l: [R.x + R.w * 0.55, R.y + 300], r: [R.x + R.w * 0.83, R.y + 300], rad: 78 } : { l: [1100, 330], r: [1560, 330], rad: 108 };
  const m = io((tb - O.it7 + 0.02) / 0.3); // magic move on "It never sleeps"
  return {
    m,
    l: [lerp(A.l[0], Bq.l[0], m), lerp(A.l[1], Bq.l[1], m)],
    r: [lerp(A.r[0], Bq.r[0], m), lerp(A.r[1], Bq.r[1], m)],
    rad: lerp(A.rad, Bq.rad, m),
  };
}
export const TEAM = {
  num: "04",
  layout: teamLayout,
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, R = U.R, L = teamLayout(U, tb), m = L.m;
    const bx = box(U, false);
    const bench = tb >= O.it7 - 0.02;
    eyebrow(E, c, bench ? "BENCHMARKS" : "TEAM", bx.x, P ? R.y + 200 : 250);
    const rad = L.rad;
    // left disc (HIM) — green
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(L.l[0], L.l[1], rad, 0, 6.283);
    c.fill();
    // right disc: dashed placeholder until "co-founder's", then pale; green when the Mac mini lands
    const onCF = tb >= O.cofounder - 0.066, onMac = tb >= O.mac - 0.066;
    if (onCF || !st.live) {
      const k = onMac ? slam(tb, O.mac, 0.9) : 1;
      c.save();
      c.translate(L.r[0], L.r[1]);
      c.scale(k, k);
      c.beginPath();
      c.arc(0, 0, rad, 0, 6.283);
      if (onMac) { c.fillStyle = C.green; c.fill(); }
      else {
        c.fillStyle = C.inkA(0.05);
        c.fill();
        c.setLineDash([14, 12]);
        c.lineWidth = 4;
        c.strokeStyle = C.inkA(0.5);
        c.stroke();
        c.setLineDash([]);
        T(E, c, "?", 0, rad * 0.32, { size: rad * 0.9, align: "center", color: C.inkA(0.35), baseline: "alphabetic" });
      }
      c.restore();
    }
    // captions (TEAM only; they exit on the magic move)
    const ca = 1 - clamp(m * 3);
    if (ca > 0) {
      const cy = L.l[1] + rad + (P ? 70 : 92), sN = P ? 58 : 72, sR = P ? 22 : 26;
      c.save();
      c.globalAlpha = ca;
      T(E, c, "FOUNDER", L.l[0], cy, { size: sN, align: "center", baseline: "alphabetic" });
      M(E, c, "CEO · BUILDING.", L.l[0], cy + (P ? 40 : 48), { size: sR, align: "center", color: C.inkA(0.55) });
      if (onCF) {
        if (tb >= O.mini - 0.066) {
          const k = slam(tb, O.mini, 1.3), w = tw(E, c, "MAC MINI", sN);
          c.save();
          c.translate(L.r[0], cy - sN * CAP / 2);
          c.scale(k, k);
          marker(c, -w / 2, sN * CAP / 2, w, sN, tb, O.mini - 0.08, 0.08);
          T(E, c, "MAC MINI", 0, sN * CAP / 2, { size: sN, align: "center", baseline: "alphabetic" });
          c.restore();
        } else T(E, c, "TBD", L.r[0], cy, { size: sN, align: "center", baseline: "alphabetic", color: C.inkA(0.3) });
        M(E, c, "CO-FOUNDER · CTO", L.r[0], cy + (P ? 40 : 48), { size: sR, align: "center", color: C.inkA(0.55) });
      }
      c.restore();
    }
    // shelf under the Mac mini ("sitting on a shelf")
    const sh = tb >= O.sitting - 0.066 ? oc((tb - O.sitting + 0.066) / 0.2) : 0;
    if (sh > 0 && ca > 0) {
      const w = rad * 1.5, y = L.r[1] + rad * 0.34, x = L.r[0];
      c.save();
      c.globalAlpha = ca;
      c.fillStyle = C.ink;
      c.fillRect(x - (w / 2) * sh, y, w * sh, 12);
      // brackets
      if (sh > 0.6) {
        for (const s of [-1, 1]) {
          c.beginPath();
          c.moveTo(x + s * w * 0.3, y + 12);
          c.lineTo(x + s * w * 0.3, y + 12 + 44 * sh);
          c.lineTo(x + s * w * 0.3 - s * 40 * sh, y + 12);
          c.closePath();
          c.fill();
        }
      }
      c.restore();
      if (tb >= O.shelf - 0.066 && ca > 0) {
        const k = slam(tb, O.shelf, 1.3);
        c.save();
        c.globalAlpha = ca;
        c.translate(x + rad * 0.95, L.r[1] - rad * 0.95);
        c.rotate(0.08);
        c.scale(k, k);
        pill(E, c, -10, -30, 60, "HQ: SHELF", { bg: C.ink, fg: C.green, icon: "dot" });
        c.restore();
      }
    }
    // BENCH rows
    if (bench) this.bench(E, c, st, L);
    footer(E, c, U, bench ? "05" : "04");
  },
  bench(E, c, st, L) {
    const { U, tb } = st, P = U.P, R = U.R, rad = L.rad;
    const xl = P ? R.x + 40 : 140, xr = P ? R.x + R.w - 40 : 1790;
    const rows = [["SLEEP", "0h", "0h", O.sleeps], ["MEALS", "0", "0", O.eats]];
    const fin = tb >= O.myself - 0.066 ? clamp((tb - O.myself + 0.066) / 0.08) : 0; // rows give way to the equation
    const y0 = P ? R.y + 560 : 640, dy = P ? 170 : 170, sz = P ? 104 : 130, ls = P ? 60 : 84;
    // column labels under the heads
    c.save();
    c.globalAlpha = clamp(L.m * 2) * (1 - fin);
    M(E, c, "ME", L.l[0], L.l[1] + rad + 34, { align: "center", size: P ? 22 : 26, color: C.ink, weight: 800 });
    M(E, c, "MAC MINI", L.r[0], L.r[1] + rad + 34, { align: "center", size: P ? 22 : 26, color: C.ink, weight: 800 });
    c.fillStyle = C.ink;
    c.fillRect(xl, y0 - (P ? 130 : 160), (xr - xl) * clamp(L.m * 1.4), 3);
    c.restore();
    rows.forEach(([lab, a, b, on], i) => {
      const y = y0 + i * dy;
      if (tb < on - 0.066) return;
      c.save();
      c.globalAlpha = 1 - fin;
      c.fillStyle = C.inkA(0.16);
      c.fillRect(xl, y + (P ? 40 : 46), (xr - xl) * oc((tb - on + 0.066) / 0.2), 2);
      wordL(E, c, lab, xl, y, tb, on - 0.04, { size: ls, color: C.inkA(0.85) });
      wordL(E, c, a, L.l[0] - tw(E, c, a, sz) / 2, y, tb, on, { size: sz });
      wordL(E, c, b, L.r[0] - tw(E, c, b, sz) / 2, y, tb, on + 0.03, { size: sz });
      c.restore();
    });
    // "It's basically myself." -> MAC MINI = ME
    if (tb >= O.myself - 0.066) {
      const str = "MAC MINI = ME", size = fit(E, c, str, { size: P ? 150 : 200, tracking: -0.04 }, P ? R.w - 60 : 1640);
      const w = tw(E, c, str, size, { tracking: -0.04 }), wl = tw(E, c, "MAC MINI ", size, { tracking: -0.04 });
      const x = (P ? R.x + R.w / 2 : 960) - w / 2, y = P ? R.y + 760 : 790;
      const k = slam(tb, O.myself, 1.25);
      c.save();
      c.translate(x + w / 2, y - size * CAP / 2);
      c.scale(k, k);
      c.translate(-w / 2, size * CAP / 2);
      marker(c, wl - size * 0.05, 0, w - wl + size * 0.05, size, tb, O.myself - 0.05, 0.08);
      T(E, c, str, 0, 0, { size, tracking: -0.04, baseline: "alphabetic" });
      c.restore();
    }
  },
  plates(E, st) {
    const { U, tb, v, lt } = st, L = teamLayout(U, tb);
    if (!v.cu) return;
    // HIM pop-out headshot: him_cu_talk, circle on his chin/neck, cap breaking out of the top
    headshot(E, v.cu, "cu", sx(st, L.l[0]), sy(st, L.l[1]), ss(st, L.rad), [0.662, 0.6], 0.3, { popUp: 1.62, popW: 0.66 });
  },
  front(E, c, st) {
    const { U, tb, t } = st, L = teamLayout(U, tb), rad = L.rad;
    // ring on the headshot (hides the mask edge) + LIVE dot
    c.lineWidth = Math.max(4, rad * 0.035);
    c.strokeStyle = C.ink;
    c.beginPath();
    c.arc(L.l[0], L.l[1], rad, 0.05 * Math.PI, 0.95 * Math.PI);
    c.stroke();
    // the Mac mini (prop), lands on "Mac", drops onto the shelf on "shelf"
    if (tb >= O.mac - 0.066 || !st.live) {
      const k = slam(tb, O.mac, 1.5);
      const drop = tb >= O.shelf - 0.066 ? 1 : 0;
      const bounce = drop ? settle(tb, O.shelf, 10, 3.2, 8) : 0;
      const shelfY = L.r[1] + rad * 0.34;
      const h = rad * 0.62 * (1 - L.m * 0.25);
      const y = lerp(L.r[1] + rad * 0.02, shelfY - h * 0.42, drop ? 1 : (tb >= O.sitting ? oc((tb - O.sitting) / 0.25) * 0.4 : 0)) - bounce;
      c.save();
      c.translate(L.r[0], L.m > 0 ? lerp(y, L.r[1] + rad * 0.05, L.m) : y);
      c.scale(k, k);
      prop(c, L.m > 0.5 ? "macmini" : "macmini_leash", L.m > 0.5 ? 0 : rad * 0.3, 0, h);
      c.restore();
      // ring
      c.lineWidth = Math.max(4, rad * 0.035);
      c.strokeStyle = C.ink;
      c.beginPath();
      c.arc(L.r[0], L.r[1], rad * k, 0, 6.283);
      c.stroke();
    }
  },
  anchors(st) {
    const L = teamLayout(st.U, 1e9 * 0 + O.it7 - 1);
    return { mini: L.r, rad: L.rad, cap: [L.r[0], L.r[1] + L.rad + (st.U.P ? 70 : 92)] };
  },
};

// ===================================================================================================== 06 FUNDRAISING (cold plunge)
function vcFrame(U, mode = "wide") {
  const { W0, H0, P, R } = U;
  if (P) {
    const w = 1500;
    return { x: R.x + R.w * 0.5 - 0.7 * w, y: H0 - 0.92 * (w * 9 / 16) - 120, w, h: w * 9 / 16 };
  }
  const w = 1700;
  return { x: 1340 - 0.7 * w, y: H0 - w * 9 / 16, w, h: w * 9 / 16 };
}
export const FUND = {
  num: "06",
  vcFrame,
  lay(U) {
    const P = U.P, R = U.R;
    return P
      ? { x: R.x + 40, ey: R.y + 200, seedY: R.y + 390, seedS: 200, venueY: R.y + 470, sheet: { x: R.x + 40, y: R.y + 520, w: 420, h: 150 } }
      : { x: 140, ey: 250, seedY: 470, seedS: 230, venueY: 560, sheet: { x: 140, y: 640, w: 600, h: 240 } };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, L = this.lay(U);
    eyebrow(E, c, "FUNDRAISING", L.x, L.ey);
    // SEED (lands on "seed") + CLOSED pill (on "Closed", the cut)
    const sw = tw(E, c, "SEED", L.seedS, { tracking: -0.04 });
    wordL(E, c, "SEED", L.x, L.seedY, tb, O.seed, { size: L.seedS, tracking: -0.04 });
    if (tb >= O.closed - 0.066) {
      const k = slam(tb, O.closed, 1.3);
      c.save();
      c.translate(L.x + sw + 40, L.seedY - L.seedS * CAP * 0.62);
      c.scale(k, k);
      pill(E, c, 0, -36, 72, "CLOSED", { icon: "check" });
      c.restore();
    }
    // venue row
    if (tb >= O.cold - 0.066) {
      M(E, c, "VENUE", L.x, L.venueY - 14, { size: P ? 22 : 26, color: C.inkA(0.6), weight: 800 });
      const vx = L.x + (P ? 110 : 130), s = P ? 52 : 66;
      wordL(E, c, "COLD", vx, L.venueY, tb, O.cold, { size: s });
      wordL(E, c, "PLUNGE", vx + tw(E, c, "COLD ", s), L.venueY, tb, O.plunge, { size: s });
    }
    // term sheet card
    this.sheet(E, c, st, L.sheet);
    footer(E, c, U, "06");
  },
  sheet(E, c, st, s) {
    const { tb, U } = st, P = U.P;
    if (tb < O.it10 - 0.066 && st.live) return;
    const a = st.live ? oc((tb - O.it10 + 0.066) / 0.15) : 1;
    c.save();
    c.globalAlpha = a;
    c.translate(0, (1 - a) * 30);
    c.fillStyle = "#FFFFFF";
    c.fillRect(s.x, s.y, s.w, s.h);
    c.lineWidth = 3;
    c.strokeStyle = C.ink;
    c.strokeRect(s.x, s.y, s.w, s.h);
    E.drawText(c, "Term Sheet", s.x + 28, s.y + (P ? 42 : 54), { font: B.FONT.serif, weight: 400, size: P ? 34 : 46, color: C.ink, align: "left" });
    M(E, c, "SERIES SEED · NON-BINDING", s.x + s.w - 24, s.y + (P ? 42 : 54), { size: P ? 13 : 16, align: "right", color: C.inkA(0.5) });
    c.fillStyle = C.inkA(0.16);
    for (let i = 0; i < 2; i++) c.fillRect(s.x + 28, s.y + (P ? 70 : 92) + i * (P ? 16 : 22), s.w * (0.78 - i * 0.2), P ? 7 : 9);
    // signature line + signature drawn on while he signs (26.32 -> flash)
    const ly = s.y + s.h - (P ? 30 : 42);
    c.fillStyle = C.ink;
    c.fillRect(s.x + 28, ly, s.w * 0.62, 3);
    M(E, c, "X", s.x + 30, ly - 22, { size: P ? 18 : 22, color: C.inkA(0.6) });
    const p = st.live ? clamp((tb - (O.it10 + 0.05)) / (O.flash - O.it10 - 0.08)) : 1;
    if (p > 0) {
      c.save();
      c.beginPath();
      const N = 60, x0 = s.x + 70, w = s.w * 0.5, amp = P ? 18 : 26, n = Math.floor(p * N);
      for (let i = 0; i <= n; i++) {
        const u = i / N, x = x0 + u * w + Math.sin(u * 31) * amp * 0.35, y = ly - 14 - Math.sin(u * 19 + 0.6) * amp * (0.6 + 0.4 * Math.sin(u * 5)) + (hsh(i * 3.7) - 0.5) * 4;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.strokeStyle = "#1B2A6B";
      c.lineWidth = P ? 3.5 : 4.5;
      c.lineJoin = "round";
      c.lineCap = "round";
      c.stroke();
      c.restore();
    }
    // SIGNED badge on "flash"
    if (tb >= O.flash - 0.066 || !st.live) {
      const k = st.live ? slam(tb, O.flash, 1.6) : 1;
      c.save();
      c.translate(s.x + s.w * 0.8, ly - (P ? 34 : 48));
      c.rotate(-0.12);
      c.scale(k, k);
      pill(E, c, -90, -30, 60, "SIGNED", { icon: "check", bg: C.green, fg: C.ink });
      c.restore();
    }
    c.restore();
  },
  plates(E, st) {
    const { U, v, lt } = st;
    if (!v.vc) return;
    const Fr = vcFrame(U);
    plate(E, v.vc, { x: sx(st, Fr.x), y: sy(st, Fr.y), w: ss(st, Fr.w), h: ss(st, Fr.h) }, { clip: st.clipR });
  },
  front(E, c, st) {
    const { U, tb, t } = st, P = U.P, L = this.lay(U);
    // frost on the type from "cold": icicles under SEED and the venue line, crystals on the letters
    const fr = st.live ? clamp((tb - O.cold + 0.05) / 1.1) : 1;
    if (fr > 0) {
      const sw = tw(E, c, "SEED", L.seedS, { tracking: -0.04 });
      icicles(c, L.x + 8, L.x + sw - 10, L.seedY + 2, fr, { len: P ? 60 : 84, step: P ? 34 : 44, seed: 3, w: P ? 16 : 20 });
      for (let i = 0; i < 7; i++) {
        const cx = L.x + (i + 0.5) * (sw / 7) + (hsh(i * 2.1) - 0.5) * 40, cy = L.seedY - L.seedS * CAP * (0.2 + 0.6 * hsh(i * 5.3));
        crystal(c, cx, cy, (P ? 18 : 26) * (0.6 + 0.6 * hsh(i * 9.1)), fr * 1.4 - hsh(i) * 0.4, { rot: hsh(i * 4.4) * 3, lw: P ? 2.5 : 3.5, color: "#FFFFFF" });
      }
      // frost bloom in the paper corners near the VC (drawn ink line art so it reads on paper)
      const vcx = P ? U.R.x + U.R.w * 0.86 : 1820, vcy = P ? U.R.y + 260 : 200;
      for (let i = 0; i < 5; i++)
        crystal(c, vcx - hsh(i * 7.7) * (P ? 120 : 220), vcy + hsh(i * 3.3) * (P ? 120 : 200), (P ? 16 : 22) * (0.6 + hsh(i * 1.9)), fr * 1.5 - hsh(i * 2.2) * 0.5, { rot: hsh(i) * 3, lw: 2.5, color: C.inkA(0.35) });
    }
  },
  anchors(st) {
    const U = st.U, Fr = vcFrame(U), L = this.lay(U);
    return { vcHead: fpt(Fr, [0.7, 0.24]), vcTub: fpt(Fr, [0.7, 0.8]), venue: [L.x, L.venueY], seed: [L.x, L.seedY] };
  },
};

// ===================================================================================================== 07 FINGERS
export const FINGERS = {
  num: "07",
  frame(U) {
    const { W0, H0, P, R } = U;
    const w = P ? 3000 : 4300, h = w * 9 / 16, ax = P ? R.x + R.w * 0.55 : 1180, ay = P ? R.y + 700 : 600;
    return { x: ax - 0.69 * w, y: ay - 0.56 * h, w, h };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, R = U.R;
    const x = P ? R.x + 40 : 140;
    eyebrow(E, c, "HARDWARE STATUS", x, P ? R.y + 200 : 250);
    // big FINGERS, shivering
    const s = P ? 150 : 190, y = P ? R.y + 380 : 470;
    const jit = (k) => (E.noise1(t * 26 + k * 7.3) * (P ? 4 : 6));
    c.save();
    c.translate(jit(1), jit(2));
    wordL(E, c, "FINGERS", x, y, tb, O.fingers, { size: s, tracking: -0.04 });
    c.restore();
    if (tb >= O.fingers - 0.066) {
      const k = slam(tb, O.fingers + 0.12, 1.3);
      c.save();
      c.translate(x, y + (P ? 60 : 76));
      c.scale(k, k);
      pill(E, c, 0, 0, P ? 64 : 76, "OFFLINE", { icon: "dot", dot: C.grey, bg: C.inkA(0.08), fg: C.ink, stroke: C.ink });
      c.restore();
    } else if (tb >= O.he11 - 0.066) {
      // before the word lands: a "feel" probe
      M(E, c, "PINGING FINGERS…", x, y - s * CAP - 26, { size: P ? 22 : 26, color: C.inkA(0.6) });
    }
    footer(E, c, U, "07");
  },
  plates(E, st) {
    const { U, v } = st;
    if (!v.vc) return;
    const Fr = this.frame(U);
    plate(E, v.vc, { x: sx(st, Fr.x), y: sy(st, Fr.y), w: ss(st, Fr.w), h: ss(st, Fr.h) });
  },
  front(E, c, st) {
    const { U, tb, t, v, lt } = st, P = U.P;
    // leader from the label to the stylus hand (shivers with him)
    const Fr = this.frame(U), hand = fpt(Fr, [0.655 + E.noise1(t * 22) * 0.004, 0.55 + E.noise1(t * 19 + 3) * 0.004]);
    if (tb >= O.fingers - 0.066) {
      const p = oc((tb - O.fingers + 0.066) / 0.15), x0 = P ? U.R.x + 300 : 560, y0 = P ? U.R.y + 470 : 585;
      c.strokeStyle = C.ink;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(lerp(x0, hand[0], p), lerp(y0, hand[1], p));
      c.stroke();
      if (p >= 1) {
        c.beginPath();
        c.arc(hand[0], hand[1], 16, 0, 6.283);
        c.lineWidth = 4;
        c.stroke();
      }
    }
    // frost crystals framing the close-up
    for (let i = 0; i < 9; i++) {
      const side = i % 3, cx = P ? 120 + hsh(i * 3.3) * 840 : 700 + hsh(i * 3.3) * 1180, cy = P ? (side ? 1500 + hsh(i) * 300 : 300 + hsh(i * 2) * 120) : side ? 900 + hsh(i) * 120 : 120 + hsh(i * 2) * 120;
      crystal(c, cx, cy, (P ? 22 : 30) * (0.6 + hsh(i * 9.1)), 1, { rot: hsh(i * 4.4) * 3 + t * 0.2, lw: 3, color: C.inkA(0.3) });
    }
  },
};

// ===================================================================================================== 08 WIRE
export const WIRE = {
  num: "08",
  card(U) {
    const { P, R } = U;
    return P ? { x: R.x + 20, y: R.y + 220, w: R.w - 40, h: 560 } : { x: 250, y: 190, w: 1260, h: 650 };
  },
  amount: "$3,000,000.00",
  amtLay(E, c, U) {
    const cd = this.card(U), P = U.P;
    const size = fit(E, c, this.amount, { size: P ? 150 : 190, tracking: -0.035 }, cd.w - (P ? 70 : 130));
    return { x: cd.x + (P ? 34 : 64), y: cd.y + (P ? 300 : 360), size, w: tw(E, c, this.amount, size, { tracking: -0.035 }) };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, cd = this.card(U);
    const on = st.live ? O.wired : -1;
    const k = st.live ? slam(tb, on, 1.12) : 1, a = st.live ? clamp((tb - on + 0.066) / 0.05) : 1;
    if (a <= 0) { footer(E, c, U, "08"); return; }
    c.save();
    c.globalAlpha = a;
    c.translate(cd.x + cd.w / 2, cd.y + cd.h / 2);
    c.scale(k, k);
    c.translate(-(cd.x + cd.w / 2), -(cd.y + cd.h / 2));
    rrect(c, cd.x, cd.y, cd.w, cd.h, 28);
    c.fillStyle = "#FFFFFF";
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = C.ink;
    c.stroke();
    // header
    const hx = cd.x + (P ? 34 : 64), hy = cd.y + (P ? 100 : 120), r = P ? 30 : 40;
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(hx + r, hy - r * 0.35, r, 0, 6.283);
    c.fill();
    check(c, hx + r, hy - r * 0.32, r * 0.95, C.ink, r * 0.22, st.live ? clamp((tb - O.cash + 0.05) / 0.12) : 1);
    T(E, c, "WIRE RECEIVED", hx + r * 2 + 24, hy, { size: P ? 60 : 84, baseline: "alphabetic" });
    M(E, c, "INCOMING · USD", cd.x + cd.w - (P ? 34 : 64), cd.y + (P ? 50 : 60), { size: P ? 18 : 22, align: "right", color: C.inkA(0.5) });
    c.fillStyle = C.inkA(0.12);
    c.fillRect(cd.x + 30, hy + (P ? 40 : 52), cd.w - 60, 2);
    // shivering amount: every glyph shivers on its own
    const A = this.amtLay(E, c, U);
    let xx = A.x;
    const fullW = A.w;
    const air = st.air ?? 0, n = this.amount.length;
    for (let i = 0; i < n; i++) {
      const ch = this.amount[i], cw = measure(E, c, ch, { size: A.size, tracking: -0.035 });
      const jx = E.noise1(t * 24 + i * 13.1) * A.size * 0.025, jy = E.noise1(t * 27 + i * 7.7 + 40) * A.size * 0.03, jr = E.noise1(t * 21 + i * 3.3 + 90) * 0.04;
      // HER "made of air": the struck digits float up and evaporate into bubbles, one after another
      const ua = clamp(air * 1.7 - (i / n) * 0.7);
      if (ua < 1) {
        const rise = oc(ua) * A.size * (1.1 + 0.8 * hsh(i * 3.1)), sway = Math.sin(ua * 6 + i) * A.size * 0.08 * ua;
        E.drawText(c, ch, xx + cw / 2 + jx + sway, A.y + jy - rise, { font: B.FONT.hero, weight: 900, size: A.size * (1 - 0.35 * ua), color: C.ink, align: "center", tracking: -0.035, baseline: "alphabetic", rot: jr + (hsh(i) - 0.5) * ua, alpha: (1 - ua) * c.globalAlpha });
      }
      if (ua > 0 && ua < 1 && ch !== "," && ch !== ".") {
        c.save();
        c.strokeStyle = C.inkA(0.45 * (1 - ua));
        c.lineWidth = 3;
        for (let b = 0; b < 3; b++) {
          const bu = clamp(ua * 1.4 - b * 0.15), r = A.size * (0.05 + 0.04 * hsh(i * 7 + b));
          if (bu <= 0) continue;
          c.beginPath();
          c.arc(xx + cw / 2 + Math.sin(bu * 9 + b * 2 + i) * 18, A.y - A.size * 0.4 - bu * A.size * (1.6 + b * 0.5), r, 0, 6.283);
          c.stroke();
        }
        c.restore();
      }
      xx += cw;
    }
    // detail rows
    const ry = A.y + (P ? 80 : 100), rs = P ? 22 : 28;
    M(E, c, "FROM", A.x, ry, { size: rs, color: C.inkA(0.5), weight: 800 });
    M(E, c, "ONE (1) VC, IN AN ICE BATH", A.x + (P ? 110 : 140), ry, { size: rs, color: C.ink, weight: 700 });
    M(E, c, "MEMO", A.x, ry + (P ? 40 : 50), { size: rs, color: C.inkA(0.5), weight: 800 });
    M(E, c, "brrrrrrrrr", A.x + (P ? 110 : 140), ry + (P ? 40 : 50), { size: rs, color: C.ink, weight: 700, tracking: 0.04 });
    c.restore();
    footer(E, c, U, "08");
  },
  plates(E, st) {
    const { U, v } = st;
    if (!v.vc || st.noVC) return;
    const cd = this.card(U), P = U.P;
    // small VC giving the thumbs-up, peeking in at the card's corner
    const w = P ? 1100 : 1250, Fr = P ? { x: U.R.x + U.R.w * 0.62 - 0.66 * w, y: cd.y + cd.h - 40 - 0.3 * w * 9 / 16, w, h: w * 9 / 16 } : { x: 1640 - 0.66 * w, y: 1080 - w * 9 / 16 + 40, w, h: w * 9 / 16 };
    plate(E, v.vc, { x: sx(st, Fr.x), y: sy(st, Fr.y), w: ss(st, Fr.w), h: ss(st, Fr.h) });
  },
  front(E, c, st) {
    const { U, tb } = st, cd = this.card(U);
    // icicles hanging from the card
    const a = st.live ? clamp((tb - O.wired + 0.066) / 0.05) : 1;
    if (a > 0) icicles(c, cd.x + 40, cd.x + cd.w * 0.55, cd.y + cd.h, st.live ? clamp((tb - O.wired) / 0.6) : 1, { len: 60, step: 50, seed: 7 });
  },
  anchors(st, E, c) {
    const A = this.amtLay(E, c, st.U);
    return { amt: A };
  },
};

// ===================================================================================================== 09/10 MARKET -> VALUATION
// The matcha ticker (verified: 2026 Uji first-harvest tencha auction, ¥17,250/kg, July 2026, highest since 1996).
// On "My valuation's" the same chart is relabelled: his valuation is marked to matcha. On "record high" it leaves the frame.
function sparkPts(n = 34) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const base = 0.12 + 0.55 * Math.pow(u, 2.2);
    pts.push([u, base + (hsh(i * 3.7) - 0.5) * 0.08 * (1 - u * 0.5)]);
  }
  pts[n - 1][1] = 0.82;
  return pts;
}
const SPK = sparkPts();
export const MARKET = {
  num: "09",
  lay(U) {
    const P = U.P, R = U.R;
    return P
      ? { x: R.x + 40, x1: R.x + R.w - 40, ey: R.y + 200, labY: R.y + 330, labS: 120, priceY: R.y + 430, priceS: 76, srcY: R.y + 480, ch: { x: R.x + 40, y: R.y + 520, w: R.w - 80, h: 240 } }
      : { x: 930, x1: 1820, ey: 250, labY: 410, labS: 150, priceY: 530, priceS: 96, srcY: 584, ch: { x: 930, y: 640, w: 890, h: 230 } };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, L = this.lay(U);
    const val = tb >= O.my15 - 0.066; // valuation phase
    const tilt = val ? oc((tb - O.high15 + 0.066) / 0.3) : 0; // camera tilts up with the spike
    c.save();
    c.translate(0, tilt * (P ? 260 : 330));
    eyebrow(E, c, val ? "FINANCIALS" : "MARKET", L.x, L.ey);
    // label slot-roll: MATCHA -> VALUATION
    const roll = val ? io((tb - O.my15 + 0.066) / 0.18) : 0;
    const labA = "MATCHA", labB = "VALUATION";
    const sA = L.labS, sB = fit(E, c, labB, { size: L.labS, tracking: -0.04 }, L.x1 - L.x - (P ? 70 : 110));
    c.save();
    c.beginPath();
    c.rect(L.x - 20, L.labY - L.labS * CAP - 24, L.x1 - L.x + 40, L.labS * CAP + 48);
    c.clip();
    const lh = L.labS * 1.05;
    if (roll < 1) {
      wordL(E, c, labA, L.x, L.labY - roll * lh, tb, st.live ? O.matcha : -1, { size: sA, tracking: -0.04 });
      tri(c, L.x + tw(E, c, labA, sA, { tracking: -0.04 }) + 60, L.labY - roll * lh - sA * CAP * 0.45, sA * 0.42, true, C.green);
    }
    if (roll > 0) {
      T(E, c, labB, L.x, L.labY + (1 - roll) * lh, { size: sB, tracking: -0.04, baseline: "alphabetic" });
      tri(c, L.x + tw(E, c, labB, sB, { tracking: -0.04 }) + 50, L.labY + (1 - roll) * lh - sB * CAP * 0.45, sB * 0.42, true, C.green);
    }
    c.restore();
    // price row (verified number) / valuation row
    if (!val) {
      if (tb >= O.record13 - 0.066 || !st.live) {
        const pw = tw(E, c, "¥17,250/kg", L.priceS);
        wordL(E, c, "¥17,250/kg", L.x, L.priceY, tb, st.live ? O.record13 : -1, { size: L.priceS });
        // RECORD HIGH tag on "high"
        if (tb >= O.high13 - 0.066 || !st.live) {
          const k = st.live ? slam(tb, O.high13, 1.35) : 1;
          c.save();
          c.translate(L.x + pw + 36, L.priceY - L.priceS * CAP * 0.5);
          c.scale(k, k);
          pill(E, c, 0, -(P ? 28 : 34), P ? 56 : 68, "RECORD HIGH", { bg: C.green, fg: C.ink, icon: "dot", dot: C.ink });
          c.restore();
        }
      }
      M(E, c, "UJI FIRST-HARVEST TENCHA · AUCTION, JULY 2026 · HIGHEST SINCE 1996", L.x, L.srcY, { size: P ? 13 : 17, color: C.inkA(0.5), tracking: 0.06 });
    } else {
      M(E, c, "MARKED TO MATCHA", L.x, L.priceY - 22, { size: P ? 26 : 32, color: C.ink, weight: 800 });
      if (tb >= O.high15 - 0.066) {
        const k = slam(tb, O.high15, 1.4);
        c.save();
        c.translate(L.x + (P ? 330 : 400), L.priceY - 34);
        c.scale(k, k);
        pill(E, c, 0, -(P ? 30 : 36), P ? 60 : 72, "RECORD HIGH", { bg: C.green, fg: C.ink, icon: "dot", dot: C.ink });
        c.restore();
      }
      M(E, c, "PRE-MONEY · POST-MATCHA", L.x, L.srcY, { size: P ? 13 : 17, color: C.inkA(0.5), tracking: 0.06 });
    }
    this.chart(E, c, st, L.ch, val);
    // shortage chip on line 2
    if (!val && (tb >= O.shortage - 0.066 || !st.live)) {
      const k = st.live ? slam(tb, O.shortage, 1.3) : 1;
      c.save();
      c.translate(L.ch.x + L.ch.w * 0.02, L.ch.y + (P ? 40 : 50));
      c.scale(k, k);
      const w = pill(E, c, 0, -30, 60, "SUPPLY ▼ SHORTAGE", { bg: C.ink, fg: C.white });
      if (tb >= O.japan - 0.066 || !st.live) {
        const k2 = st.live ? slam(tb, O.japan, 1.4) : 1;
        c.translate(w + 16 + 60, 0);
        c.scale(k2, k2);
        pill(E, c, -60, -30, 60, "JAPAN", { bg: "#FFFFFF", fg: C.ink, stroke: C.ink, icon: "dot", dot: C.coral });
      }
      c.restore();
    }
    c.restore();
    footer(E, c, U, val ? "10" : "09");
  },
  chart(E, c, st, ch, val) {
    const { tb, U } = st, P = U.P;
    // draw-on from "Matcha's" to "high" (linear), the spike on the valuation's "high"
    const p = st.live ? clamp((tb - O.matcha + 0.05) / (O.high13 - O.matcha + 0.05)) : 1;
    const spike = val ? oexpo((tb - O.high15 + 0.066) / 0.32) : 0;
    c.fillStyle = C.inkA(0.14);
    c.fillRect(ch.x, ch.y + ch.h, ch.w, 2);
    M(E, c, "1996", ch.x, ch.y + ch.h + 26, { size: P ? 16 : 18, color: C.inkA(0.45) });
    M(E, c, "2026", ch.x + ch.w, ch.y + ch.h + 26, { size: P ? 16 : 18, color: C.inkA(0.45), align: "right" });
    const n = SPK.length, upto = p * (n - 1);
    c.save();
    c.beginPath();
    let hx = ch.x, hy = ch.y + ch.h;
    for (let i = 0; i <= Math.min(n - 1, Math.ceil(upto)); i++) {
      const f = i <= upto ? 1 : upto - (i - 1);
      const [u, v] = SPK[i];
      let x = ch.x + u * ch.w, y = ch.y + ch.h - v * ch.h;
      if (i > upto) { const [u0, v0] = SPK[i - 1]; x = ch.x + lerp(u0, u, f) * ch.w; y = ch.y + ch.h - lerp(v0, v, f) * ch.h; }
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      hx = x; hy = y;
    }
    if (spike > 0) { const yy = lerp(hy, ch.y - (P ? 900 : 1100), spike); c.lineTo(hx + 30 * spike, yy); hx += 30 * spike; hy = yy; }
    c.strokeStyle = C.ink;
    c.lineWidth = P ? 6 : 8;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.stroke();
    c.restore();
    // head
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(hx, hy, P ? 12 : 15, 0, 6.283);
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = C.ink;
    c.stroke();
  },
  plates() {},
  front() {},
};

// ===================================================================================================== 11 PLAN
export const PLAN = {
  num: "11",
  lay(U) {
    const P = U.P, R = U.R;
    return P ? { x: R.x + 40, x1: R.x + R.w - 40, ey: R.y + 200, tabY: R.y + 250, s404: 300 } : { x: 930, x1: 1820, ey: 250, tabY: 300, s404: 360 };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, L = this.lay(U);
    eyebrow(E, c, "ROADMAP", L.x, L.ey);
    // file tab + doc
    const tabW = P ? 230 : 270, tabH = P ? 56 : 64, dy = L.tabY + tabH, dh = P ? 470 : 520;
    c.fillStyle = C.ink;
    rrect(c, L.x, L.tabY, tabW, tabH + 12, 12);
    c.fill();
    M(E, c, "plan.md", L.x + 26, L.tabY + tabH / 2 + 2, { size: P ? 26 : 30, color: C.white, weight: 700, tracking: 0.02 });
    c.lineWidth = 4;
    c.strokeStyle = C.ink;
    c.fillStyle = "#FFFFFF";
    c.fillRect(L.x, dy, L.x1 - L.x, dh);
    c.strokeRect(L.x, dy, L.x1 - L.x, dh);
    const on404 = st.live ? O.dont16 : -1;
    if (tb < on404 - 0.066) {
      // loading spinner while he says "I"
      const cx = L.x + (L.x1 - L.x) / 2, cy = dy + dh / 2;
      c.save();
      c.translate(cx, cy);
      c.rotate(t * 8);
      c.strokeStyle = C.ink;
      c.lineWidth = 8;
      c.lineCap = "round";
      c.beginPath();
      c.arc(0, 0, 44, 0, 4.4);
      c.stroke();
      c.restore();
      M(E, c, "LOADING PLAN…", cx, cy + 92, { size: 24, align: "center", color: C.inkA(0.6) });
    } else {
      const s = L.s404, k = st.live ? slam(tb, on404, 1.3) : 1;
      const cx = L.x + (L.x1 - L.x) / 2, by = dy + (P ? 300 : 340);
      c.save();
      c.translate(cx, by - s * CAP / 2);
      c.scale(k, k);
      T(E, c, "404", 0, s * CAP / 2, { size: s, align: "center", tracking: -0.05, baseline: "alphabetic" });
      c.restore();
      M(E, c, "NOT FOUND", cx, by + (P ? 50 : 56), { size: P ? 26 : 32, align: "center", color: C.ink, weight: 800, tracking: 0.3 });
      // PLAN: null types on "plan"
      if (tb >= O.plan - 0.066 || !st.live) {
        const str = "const plan = null;", n = st.live ? Math.floor(clamp((tb - O.plan + 0.066) / 0.18) * str.length) : str.length;
        const ps = P ? 28 : 34, w = measure(E, c, str, { font: B.FONT.mono, weight: 700, size: ps, tracking: 0.02 });
        c.fillStyle = C.green;
        c.fillRect(cx - w / 2 - 14, by + (P ? 96 : 110) - ps * 0.8, w + 28, ps * 1.5);
        M(E, c, str.slice(0, n), cx - w / 2, by + (P ? 96 : 110), { size: ps, color: C.ink, weight: 700, tracking: 0.02 });
      }
    }
    footer(E, c, U, "11");
  },
  plates() {},
  front() {},
};
