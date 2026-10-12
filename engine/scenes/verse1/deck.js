// HIS pitch deck (look B), CALM PASS: four slides, each holding two couplets (about two bars). Every slide builds in place
// on the onsets (elements add, nothing replaces), with no slide-to-slide pushes and no zoom pops. pre1 reuses TEAM and
// FUND in their final states for HER red-pen pass. Slides are authored in slide units = 1080p canvas px of the orientation.
//   slide.back(E, c, st)   graphics behind footage (the caller has set the slide->screen transform on c)
//   slide.plates(E, st)    keyed footage that belongs to the slide (VC, pop-out headshot), mapped through st.xf
//   slide.front(E, c, st)  graphics in front of footage
//   slide.anchors(st)      points HER red pen aims at (slide units)
// st = { t: song time (live things), tb: build time (= t in verse1, +inf-ish for a finished slide), U: units(E),
//        xf: {ox, oy, z} slide units -> screen units, v: clips, lt: clip-local times, live, air, head, clipR }
import * as B from "../../brand.js";
import {
  C, T, M, measure, fit, eyebrow, footer, odo, plate, fpt, headshot, prop, icicles, crystal, rrect, wipeStrike, tri, check,
  clamp, lerp, oc, io, oexpo, settle, slam, hsh,
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
const sx = (st, x) => st.xf.ox + x * st.xf.z; // slide units -> screen units
const sy = (st, y) => st.xf.oy + y * st.xf.z;
const ss = (st, s) => s * st.xf.z;
const tw = (E, c, s, size, o = {}) => measure(E, c, s, { size, ...o });
// left-aligned word that lands on its onset (alpha + a small calm scale), returns alpha
function wordL(E, c, s, x, y, t, on, o = {}) {
  if (t < on - 0.066) return 0;
  const k = slam(t, on, o.from ?? 1.22), a = clamp((t - (on - 0.066)) / 0.05), size = o.size ?? 100;
  const w = measure(E, c, s, { size, weight: o.weight ?? 900, tracking: o.tracking ?? -0.035, font: o.font });
  c.save();
  c.translate(x + w / 2, y - size * CAP * 0.5);
  c.scale(k, k);
  E.drawText(c, s, 0, size * CAP * 0.5, { font: B.FONT.hero, weight: 900, size: 100, color: C.ink, align: "center", tracking: -0.035, baseline: "alphabetic", ...o, alpha: a * (o.alpha ?? 1) * c.globalAlpha });
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
  if (o.icon === "check") { check(c, tx + h * 0.2, y + h * 0.52, h * 0.42, o.fg ?? C.green, h * 0.1, o.checkP ?? 1); tx += h * 0.65; }
  E.drawText(c, label, tx, y + h * 0.53, { font: B.FONT.mono, weight: 700, size, tracking: 0.1, color: o.fg ?? C.green, align: "left", alpha: c.globalAlpha });
  c.restore();
  return w;
}
// a pill that lands (calm scale) around its own left-centre point
function pillAt(E, c, x, yc, h, label, t, on, o = {}) {
  if (t < on - 0.066) return 0;
  const k = slam(t, on, o.from ?? 1.3), a = clamp((t - on + 0.066) / 0.05);
  c.save();
  c.translate(x, yc);
  if (o.rot) c.rotate(o.rot);
  c.scale(k, k);
  const w = pill(E, c, 0, -h / 2, h, label, { ...o, alpha: a * (o.alpha ?? 1) });
  c.restore();
  return w;
}

// ===================================================================================================== 1 · COMPENSATION
// L1-4: "I don't take a salary, I take a token budget. / Burned a quarter-million, and my investors love it."
// Left: SALARY .... $0 (struck by his own clean strike), TOKEN BUDGET (green markers). Under them the dark TOKEN BUDGET
// card is up from the first frame: the live meter as a pixel odometer (B.tokensAt) with its burn chart. On
// "quarter-million" the odometer does the -250,000 roll and the chart falls off a cliff; on "investors" a green INVESTOR
// LOVE line climbs out of the cliff and on "love" rockets: LOVE IT. HIS lip-synced founder bubble holds on the right.
const BURN_T0 = 17.4, BURN_T1 = 22.6;
export const COMP = {
  num: "02",
  lay(U) {
    const P = U.P, R = U.R;
    if (P) return { x: R.x + 40, x1: R.x + 560, ey: 450, y1: 545, s1: 56, y2: 630, s2: 62, card: { x: R.x + 10, y: 760, w: R.w - 20 }, bub: { cx: R.x + R.w - 150, cy: 600, r: 128 } };
    return { x: 120, x1: 1100, ey: 200, y1: 304, s1: 84, y2: 410, s2: 92, card: { x: 120, y: 450, w: 980 }, bub: { cx: 1480, cy: 600, r: 280 } };
  },
  back(E, c, st) {
    const { U, tb } = st, L = this.lay(U), P = U.P;
    eyebrow(E, c, "COMPENSATION", L.x, L.ey);
    // row 1: SALARY ...... $0, struck on "I take"
    const s1 = L.s1, x0 = L.x, x1 = L.x1, y1 = L.y1;
    const struck = clamp((tb - O.iTake) / 0.12), dim = 1 - 0.62 * oc((tb - O.iTake - 0.1) / 0.2);
    c.save();
    c.globalAlpha = dim;
    T(E, c, "SALARY", x0, y1, { size: s1, baseline: "alphabetic", tracking: -0.035 });
    const wS = tw(E, c, "SALARY", s1, { tracking: -0.035 }), w0 = tw(E, c, "$0", s1, { tracking: -0.035 });
    c.fillStyle = C.inkA(0.35);
    const dot = P ? 6 : 8, step = P ? 16 : 22;
    for (let x = x0 + wS + 24; x < x1 - w0 - 24; x += step) c.fillRect(x, y1 - s1 * 0.12, dot, dot);
    wordL(E, c, "$0", x1 - w0, y1, tb, O.salary, { size: s1, tracking: -0.035 });
    c.restore();
    if (struck > 0) wipeStrike(c, x0, x1, y1 - s1 * CAP * 0.45, struck, { h: P ? 9 : 12 });
    // row 2: TOKEN BUDGET (green markers, on the words)
    const s2 = L.s2, y2 = L.y2;
    const wT = tw(E, c, "TOKEN", s2, { tracking: -0.035 }) + s2 * 0.26, wB = tw(E, c, "BUDGET", s2, { tracking: -0.035 });
    marker(c, x0, y2, wT - s2 * 0.12, s2, tb, O.token - 0.066, 0.066);
    marker(c, x0 + wT - s2 * 0.2, y2, wB + s2 * 0.2, s2, tb, O.budget - 0.066, 0.066);
    wordL(E, c, "TOKEN", x0, y2, tb, O.token, { size: s2 });
    wordL(E, c, "BUDGET", x0 + wT, y2, tb, O.budget, { size: s2 });
    // the card (authored at 980 x 420, scaled to the column)
    const cd = L.card, k = cd.w / 980;
    c.save();
    c.translate(cd.x, cd.y);
    c.scale(k, k);
    this.card(E, c, st);
    c.restore();
    footer(E, c, U, this.num);
  },
  card(E, c, st) {
    const { t, tb } = st, W = 980, H = 420;
    const tok = (tt) => B.tokensAt(E, tt);
    rrect(c, 0, 0, W, H, 26);
    c.fillStyle = C.bg;
    c.fill();
    c.save();
    rrect(c, 0, 0, W, H, 26);
    c.clip();
    B.hairGrid(c, 0, 0, W, H, { step: 70, color: C.line, alpha: 0.5 });
    M(E, c, "BALANCE", 40, 46, { color: C.whiteA(0.72), size: 22, weight: 700 });
    const lw = measure(E, c, "BALANCE", { font: B.FONT.mono, weight: 700, size: 22, tracking: 0.12 });
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(40 + lw + 24, 46, 6, 0, 6.283);
    c.fill();
    M(E, c, "LIVE", 40 + lw + 38, 46, { color: C.green, size: 22, weight: 700 });
    // the meter as a pixel odometer; the quarter-million roll is B.tokensAt's own (0.45 s), fast digits spin crisp
    const rows = 12, cell = 10, roll = clamp((t - O.quarter) / 0.45);
    const jit = roll > 0 && roll < 1 ? (gx, kk) => (hsh(gx * 0.013 + kk * 9.1 + Math.floor(t * 60) * 0.37) - 0.5) * cell * 0.8 : null;
    odo(c, tok, t, 40, 78, { rows, cell, jit, tau: 0.1 });
    // -250,000 TOKENS on "quarter-million"
    if (tb >= O.quarter - 0.066) {
      const k = slam(tb, O.quarter, 1.3), a = clamp((tb - O.quarter + 0.066) / 0.05), size = 60;
      const s = "−250,000", w = tw(E, c, s, size);
      c.save();
      c.translate(40, 272 - size * CAP / 2);
      c.scale(k, k);
      E.drawText(c, s, 0, size * CAP / 2, { font: B.FONT.hero, weight: 900, size, color: C.green, align: "left", tracking: -0.035, baseline: "alphabetic", alpha: a });
      M(E, c, " TOKENS", w, size * CAP / 2 - 3, { size: 22, color: C.green, weight: 700, alpha: a, baseline: "alphabetic" });
      c.restore();
    }
    this.chart(E, c, st, { x: 40, y: 302, w: 900, h: 92 });
    c.restore();
  },
  chart(E, c, st, ch) {
    const { t, tb } = st;
    const vmax = B.tokensAt(E, BURN_T0) + 15000, vmin = B.tokensAt(E, BURN_T1) - 4000;
    const tx = (tt) => ch.x + ((tt - BURN_T0) / (BURN_T1 - BURN_T0)) * ch.w;
    const vy = (v) => ch.y + ch.h - ((v - vmin) / (vmax - vmin)) * ch.h;
    c.fillStyle = C.whiteA(0.2);
    c.fillRect(ch.x, ch.y + ch.h, ch.w, 2);
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
    c.lineWidth = 5;
    c.lineJoin = "round";
    c.stroke();
    c.fillStyle = C.white;
    c.beginPath();
    c.arc(hx, hy, 8, 0, 6.283);
    c.fill();
    // INVESTOR LOVE: out of the bottom of the cliff on "investors", rockets on "love"
    const t0 = O.investors - 0.066;
    if (tb > t0) {
      const cx0 = tx(O.quarter + 0.45), cy0 = vy(B.tokensAt(E, O.quarter + 0.45));
      const u = oc((tb - t0) / (O.love - t0)), u2 = oexpo((tb - O.love + 0.066) / 0.3);
      const top = ch.y - 4;
      const xA = lerp(cx0, cx0 + 16, u), yA = lerp(cy0, cy0 - (cy0 - top) * 0.3, u);
      const xB = lerp(xA, xA + 26, u2), yB = lerp(yA, top, u2);
      c.save();
      c.strokeStyle = C.green;
      c.lineWidth = 8;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.beginPath();
      c.moveTo(cx0, cy0);
      c.lineTo(xA, yA);
      if (u2 > 0) c.lineTo(xB, yB);
      c.stroke();
      c.restore();
      const hx2 = u2 > 0 ? xB : xA, hy2 = u2 > 0 ? yB : yA;
      tri(c, hx2, hy2 - 4, 30, true, C.green);
      const a = clamp((tb - t0) / 0.06), lx = cx0 + 74;
      M(E, c, "INVESTOR LOVE ▲", lx, ch.y - 12, { color: C.green, size: 22, weight: 800, alpha: a });
      if (tb >= O.love - 0.066) {
        const k = slam(tb, O.love, 1.3), size = 66, al = clamp((tb - O.love + 0.066) / 0.05);
        c.save();
        c.translate(lx, ch.y + 18 + size * CAP);
        c.scale(k, k);
        E.drawText(c, "LOVE IT.", 0, 0, { font: B.FONT.hero, weight: 900, size, color: C.white, align: "left", tracking: -0.035, baseline: "alphabetic", alpha: al });
        c.restore();
      }
    }
  },
  plates() {},
  front() {},
};

// ===================================================================================================== 2 · TEAM
// L5-8: "My co-founder's a Mac mini, sitting on a shelf. / It never sleeps, never eats. It's basically myself."
// Two circles that never move: the co-founder slot (dashed "?", then the Mac mini from HIS sheet, on its leash, dropped
// onto a shelf) and HIM (pop-out headshot: st.head; HIS lip-sync in verse1, an idle close-up in pre1) captioned ME.
// The stats build under them in place (SLEEP 0h | 0h, MEALS 0 | 0), then "=" lands between the circles: MAC MINI = ME.
function teamLay(U) {
  const P = U.P, R = U.R;
  return P
    ? { mini: [R.x + R.w * 0.24, 650], him: [R.x + R.w * 0.76, 650], rad: 128, ey: 450, capY: 852, subY: 890, cap: 60, sub: 20, rowY: [980, 1072], rowS: 62, xl: R.x + 40, xr: R.x + R.w - 40, eq: 110 }
    : { mini: [560, 400], him: [1360, 400], rad: 170, ey: 210, capY: 662, subY: 706, cap: 86, sub: 24, rowY: [800, 892], rowS: 72, xl: 140, xr: 1790, eq: 220 };
}
export const TEAM = {
  num: "03",
  lay: teamLay,
  back(E, c, st) {
    const { U, tb } = st, P = U.P, L = teamLay(U), rad = L.rad;
    eyebrow(E, c, "TEAM", L.xl, L.ey);
    // HIM: green disc (his headshot pops out of it in the plates pass)
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(L.him[0], L.him[1], rad, 0, 6.283);
    c.fill();
    // co-founder slot: dashed "?" until the Mac mini lands, then green
    const onMac = tb >= O.mac - 0.066;
    c.save();
    c.translate(L.mini[0], L.mini[1]);
    c.beginPath();
    c.arc(0, 0, rad, 0, 6.283);
    if (onMac) {
      c.fillStyle = C.green;
      c.globalAlpha = clamp((tb - O.mac + 0.066) / 0.1);
      c.fill();
      c.globalAlpha = 1;
    } else {
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
    // shelf under the Mac mini ("sitting on a shelf")
    const shp = tb >= O.sitting - 0.066 ? oc((tb - O.sitting + 0.066) / 0.2) : 0;
    if (shp > 0) {
      const w = rad * 1.5, y = L.mini[1] + rad * 0.34, x = L.mini[0];
      c.fillStyle = C.ink;
      c.fillRect(x - (w / 2) * shp, y, w * shp, P ? 9 : 12);
      if (shp > 0.6) {
        for (const sg of [-1, 1]) {
          c.beginPath();
          c.moveTo(x + sg * w * 0.3, y + 10);
          c.lineTo(x + sg * w * 0.3, y + 10 + rad * 0.22 * shp);
          c.lineTo(x + sg * w * 0.3 - sg * rad * 0.2 * shp, y + 10);
          c.closePath();
          c.fill();
        }
      }
    }
    // captions: [TBD -> MAC MINI] and [ME]
    const sN = L.cap, sR = L.sub, cy = L.capY, xm = L.mini[0], xh = L.him[0];
    if (tb >= O.mini - 0.066) {
      const w = tw(E, c, "MAC MINI", sN);
      marker(c, xm - w / 2, cy, w, sN, tb, O.mini - 0.066, 0.066);
      wordL(E, c, "MAC MINI", xm - w / 2, cy, tb, O.mini, { size: sN });
    } else T(E, c, "TBD", xm, cy, { size: sN, align: "center", baseline: "alphabetic", color: C.inkA(0.28) });
    M(E, c, "CO-FOUNDER · CTO", xm, L.subY, { size: sR, align: "center", color: C.inkA(0.55) });
    const wMe = tw(E, c, "ME", sN);
    marker(c, xh - wMe / 2, cy, wMe, sN, tb, O.myself - 0.066, 0.066);
    T(E, c, "ME", xh, cy, { size: sN, align: "center", baseline: "alphabetic" });
    M(E, c, "FOUNDER · CEO", xh, L.subY, { size: sR, align: "center", color: C.inkA(0.55) });
    // stats, in place: SLEEP 0h | 0h (on "sleeps"), MEALS 0 | 0 (on "eats")
    const rows = [["SLEEP", "0h", O.sleeps], ["MEALS", "0", O.eats]];
    rows.forEach(([lab, val, on], i) => {
      const y = L.rowY[i], sz = L.rowS;
      if (tb < on - 0.066) return;
      c.fillStyle = C.inkA(0.16);
      c.fillRect(L.xl, y + (P ? 14 : 16), (L.xr - L.xl) * oc((tb - on + 0.066) / 0.2), 2);
      M(E, c, lab, L.xl, y - sz * CAP * 0.45, { size: P ? 22 : 28, color: C.ink, weight: 800, alpha: clamp((tb - on + 0.066) / 0.05) });
      wordL(E, c, val, xm - tw(E, c, val, sz) / 2, y, tb, on, { size: sz });
      wordL(E, c, val, xh - tw(E, c, val, sz) / 2, y, tb, on, { size: sz });
    });
    // "It's basically myself.": "=" lands between the circles on "It's": [MAC MINI] = [ME]
    if (tb >= O.its8 - 0.066) {
      const k = slam(tb, O.its8, 1.4), a = clamp((tb - O.its8 + 0.066) / 0.05);
      c.save();
      c.translate((xm + xh) / 2, L.mini[1]);
      c.scale(k, k);
      T(E, c, "=", 0, (L.eq * CAP) / 2, { size: L.eq, align: "center", baseline: "alphabetic", alpha: a });
      c.restore();
    }
    footer(E, c, U, this.num);
  },
  plates(E, st) {
    const L = teamLay(st.U), h = st.head;
    if (!h || !h.v) return;
    headshot(E, h.v, h.key, sx(st, L.him[0]), sy(st, L.him[1]), ss(st, L.rad), h.uvC, h.ruv, { popUp: 1.62, popW: 0.66 });
  },
  front(E, c, st) {
    const { tb } = st, L = teamLay(st.U), rad = L.rad;
    // ring on the headshot (lower arc only: the cap breaks out of the top); lights while he sings
    bubbleRing(c, L.him[0], L.him[1], rad, st.head?.sing ? st.head.level ?? 0 : 0);
    // the Mac mini (prop, on its leash): lands on "Mac", drops onto the shelf on "shelf"
    if (tb >= O.mac - 0.066) {
      const k = slam(tb, O.mac, 1.4), a = clamp((tb - O.mac + 0.066) / 0.06);
      const drop = tb >= O.shelf - 0.066, bounce = drop ? settle(tb, O.shelf, rad * 0.05, 3.2, 8) : 0;
      const h = rad * 0.62, shelfY = L.mini[1] + rad * 0.34;
      const y = lerp(L.mini[1] + rad * 0.02, shelfY - h * 0.42, drop ? 1 : tb >= O.sitting ? oc((tb - O.sitting) / 0.25) * 0.4 : 0) - bounce;
      c.save();
      c.globalAlpha = a;
      c.translate(L.mini[0], y);
      c.scale(k, k);
      if (st.U.P) prop(c, "macmini", 0, 0, h);
      else prop(c, "macmini_leash", rad * 0.3, 0, h);
      c.restore();
      c.lineWidth = Math.max(4, rad * 0.035);
      c.strokeStyle = C.ink;
      c.beginPath();
      c.arc(L.mini[0], L.mini[1], rad, 0, 6.283);
      c.stroke();
    }
  },
  anchors(st) {
    const L = teamLay(st.U);
    return { mini: L.mini, rad: L.rad, him: L.him };
  },
};
function bubbleRing(c, cx, cy, r, lvl) {
  const gapA = Math.asin(0.66), a0 = -Math.PI / 2 + gapA, a1 = (3 * Math.PI) / 2 - gapA;
  c.save();
  c.lineCap = "round";
  if (lvl > 0.02) {
    c.strokeStyle = C.green;
    c.lineWidth = Math.max(5, r * 0.03);
    c.globalAlpha = lvl;
    c.beginPath();
    c.arc(cx, cy, r + Math.max(12, r * 0.07), a0 + 0.08, a1 - 0.08);
    c.stroke();
    c.globalAlpha = 1;
  }
  c.lineWidth = Math.max(4, r * 0.035);
  c.strokeStyle = C.ink;
  c.beginPath();
  c.arc(cx, cy, r, a0, a1);
  c.stroke();
  c.restore();
}

// ===================================================================================================== 3 · FUNDRAISING
// L9-12: "Closed my seed in a cold plunge, it was over in a flash. / He couldn't feel his fingers, but he wired me the cash."
// The VC (vc_plunge, 0.26-4.05 s, never past the 5.2 s flaw) shivers in his tub on the right; on the left a deal table
// builds row by row: ROUND SEED [CLOSED], VENUE COLD PLUNGE (frost grows on it), TERMS (the signature draws while he
// signs, SIGNED on "flash"), WIRE $3,000,000.00 typed with fingers he can't feel (every digit shivers), RECEIVED on
// "wired", its check on "cash". (The old FINGERS close-up and the separate WIRE slide live inside this table now.)
const AMT = "$3,000,000.00";
function vcFrame(U) {
  const { H0, P } = U;
  if (P) { const w = 1300, h = w * 9 / 16; return { x: 720 - 0.7 * w, y: 1000 - 0.3 * h, w, h }; }
  const w = 1700;
  return { x: 1400 - 0.7 * w, y: H0 - w * 9 / 16, w, h: w * 9 / 16 };
}
export const FUND = {
  num: "04",
  vcFrame,
  lay(U) {
    const P = U.P, R = U.R;
    return P
      ? { x: R.x + 40, vx: R.x + 200, ey: 450, rows: [560, 652, 742, 830], seedS: 84, venueS: 58, amtS: 54, lab: 19, pillH: 50, sigW: 300 }
      : { x: 120, vx: 330, ey: 230, rows: [400, 530, 660, 790], seedS: 120, venueS: 84, amtS: 76, lab: 24, pillH: 62, sigW: 380 };
  },
  amtLay(E, c, U) {
    const L = this.lay(U);
    return { x: L.vx, y: L.rows[3], size: L.amtS, w: tw(E, c, AMT, L.amtS, { tracking: -0.035 }) };
  },
  back(E, c, st) {
    const { U, tb, t } = st, P = U.P, L = this.lay(U), R = L.rows;
    eyebrow(E, c, "FUNDRAISING", L.x, L.ey);
    // row labels appear with their rows; hairlines between rows
    const labs = [["ROUND", O.closed], ["VENUE", O.cold], ["TERMS", O.it10], ["WIRE", O.he11]];
    const tops = [R[0] - L.seedS * CAP, R[1] - L.venueS * CAP, R[2] - (P ? 40 : 50), R[3] - L.amtS * CAP];
    labs.forEach(([lab, on], i) => {
      if (tb < on - 0.066) return;
      const a = clamp((tb - on + 0.066) / 0.08);
      M(E, c, lab, L.x, i === 2 ? R[2] - 18 : (R[i] + tops[i]) / 2 + 2, { size: L.lab, color: C.inkA(0.55), weight: 800, alpha: a });
      if (i > 0) {
        c.fillStyle = C.inkA(0.12);
        c.fillRect(L.x, Math.round((R[i - 1] + tops[i]) / 2) + (i === 2 ? 14 : 0), (P ? 760 : 780) * oc((tb - on + 0.066) / 0.2), 2);
      }
    });
    // ROUND: SEED [✓ CLOSED]
    const wSeed = tw(E, c, "SEED", L.seedS, { tracking: -0.045 });
    wordL(E, c, "SEED", L.vx, R[0], tb, O.seed, { size: L.seedS, tracking: -0.045 });
    pillAt(E, c, L.vx + wSeed + (P ? 24 : 36), R[0] - L.seedS * CAP * 0.5, L.pillH, "CLOSED", tb, O.closed, { icon: "check" });
    // VENUE: COLD PLUNGE
    const s = L.venueS;
    wordL(E, c, "COLD", L.vx, R[1], tb, O.cold, { size: s });
    wordL(E, c, "PLUNGE", L.vx + tw(E, c, "COLD", s) + s * 0.26, R[1], tb, O.plunge, { size: s });
    // TERMS: the signature draws while he signs ("it was over in a flash"), SIGNED on "flash"
    this.signature(E, c, st, L.vx, R[2], L.sigW);
    // WIRE: typed by fingers he can't feel, every glyph shivers; RECEIVED on "wired", the check on "cash"
    this.amount(E, c, st);
    if (tb >= O.wired - 0.066) {
      const cp = st.live ? clamp((tb - O.cash + 0.05) / 0.14) : 1;
      pillAt(E, c, L.vx, R[3] + (P ? 44 : 56), P ? 46 : 54, "RECEIVED", tb, O.wired, { icon: "check", bg: C.green, fg: C.ink, checkP: cp, from: 1.25 });
    }
    footer(E, c, U, this.num);
  },
  signature(E, c, st, x, y, w) {
    const { tb, U } = st, P = U.P;
    if (tb < O.it10 - 0.066) return;
    const a = clamp((tb - O.it10 + 0.066) / 0.1);
    c.save();
    c.globalAlpha = a;
    c.fillStyle = C.ink;
    c.fillRect(x, y, w, 3);
    M(E, c, "X", x + 2, y - 16, { size: P ? 16 : 20, color: C.inkA(0.6) });
    const p = clamp((tb - (O.it10 + 0.05)) / (O.flash - O.it10 - 0.08));
    if (p > 0) {
      c.beginPath();
      const N = 60, x0 = x + (P ? 30 : 40), ww = w * 0.72, amp = P ? 16 : 22, n = Math.floor(p * N);
      for (let i = 0; i <= n; i++) {
        const u = i / N, xx = x0 + u * ww + Math.sin(u * 31) * amp * 0.35, yy = y - 12 - Math.sin(u * 19 + 0.6) * amp * (0.6 + 0.4 * Math.sin(u * 5)) + (hsh(i * 3.7) - 0.5) * 4;
        if (i === 0) c.moveTo(xx, yy); else c.lineTo(xx, yy);
      }
      c.strokeStyle = "#1B2A6B";
      c.lineWidth = P ? 3.5 : 4.5;
      c.lineJoin = "round";
      c.lineCap = "round";
      c.stroke();
    }
    c.restore();
    pillAt(E, c, x + w + (P ? 20 : 30), y - (P ? 16 : 20), st.U.P ? 46 : 56, "SIGNED", tb, O.flash, { icon: "check", bg: C.green, fg: C.ink, rot: -0.06 });
  },
  amount(E, c, st) {
    const { U, tb, t } = st, A = this.amtLay(E, c, U), n = AMT.length;
    if (tb < O.he11 - 0.066) return;
    const typed = Math.floor(clamp((tb - O.he11 + 0.066) / (O.fingers - O.he11 + 0.02)) * n + 1e-6);
    const air = st.air ?? 0;
    let xx = A.x;
    for (let i = 0; i < Math.min(n, Math.max(1, typed)); i++) {
      const ch = AMT[i], cw = measure(E, c, ch, { size: A.size, tracking: -0.035 });
      const jx = E.noise1(t * 24 + i * 13.1) * A.size * 0.03, jy = E.noise1(t * 27 + i * 7.7 + 40) * A.size * 0.035, jr = E.noise1(t * 21 + i * 3.3 + 90) * 0.05;
      // HER "made of air" (pre1): the struck digits float up and evaporate in bubbles, one after another
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
  },
  plates(E, st) {
    const { U, v } = st;
    if (!v.vc) return;
    const Fr = vcFrame(U);
    plate(E, v.vc, { x: sx(st, Fr.x), y: sy(st, Fr.y), w: ss(st, Fr.w), h: ss(st, Fr.h) }, { clip: st.clipR });
  },
  front(E, c, st) {
    const { U, tb } = st, P = U.P, L = this.lay(U);
    // frost on the venue from "cold": icicles under COLD PLUNGE, crystals on the letters, frost in the corner by the VC
    const fr = st.live ? clamp((tb - O.cold + 0.05) / 1.1) : 1;
    if (fr <= 0) return;
    const s = L.venueS, vw = tw(E, c, "COLD", s) + s * 0.26 + tw(E, c, "PLUNGE", s), y = L.rows[1];
    icicles(c, L.vx + 6, L.vx + vw - 8, y + 2, fr, { len: P ? 40 : 58, step: P ? 30 : 38, seed: 3, w: P ? 13 : 18 });
    for (let i = 0; i < 6; i++) {
      const cx = L.vx + (i + 0.5) * (vw / 6) + (hsh(i * 2.1) - 0.5) * 30, cy = y - s * CAP * (0.2 + 0.6 * hsh(i * 5.3));
      crystal(c, cx, cy, (P ? 15 : 22) * (0.6 + 0.6 * hsh(i * 9.1)), fr * 1.4 - hsh(i) * 0.4, { rot: hsh(i * 4.4) * 3, lw: P ? 2.5 : 3.5, color: "#FFFFFF" });
    }
    const vcx = P ? U.R.x + U.R.w * 0.86 : 1820, vcy = P ? 520 : 200;
    for (let i = 0; i < 5; i++)
      crystal(c, vcx - hsh(i * 7.7) * (P ? 120 : 220), vcy + hsh(i * 3.3) * (P ? 100 : 200), (P ? 16 : 22) * (0.6 + hsh(i * 1.9)), fr * 1.5 - hsh(i * 2.2) * 0.5, { rot: hsh(i) * 3, lw: 2.5, color: C.inkA(0.35) });
  },
  anchors(st, E, c) {
    const U = st.U, Fr = vcFrame(U), L = this.lay(U);
    return { vcHead: fpt(Fr, [0.7, 0.24]), vcTub: fpt(Fr, [0.7, 0.8]), venueX: L.vx, venueY: L.rows[1], venueS: L.venueS, amt: E && c ? this.amtLay(E, c, U) : null };
  },
};

// ===================================================================================================== 4 · MARKET
// L13-16: "Matcha's at a record high, there's a shortage in Japan. / My valuation's at a record high. I don't have a plan."
// HE presents (him_pitch, toward the empty right, then square to camera on "don't"). MATCHA ▲ area chart draws on, the
// verified number lands (2026 Uji first-harvest tencha auction, ¥17,250/kg, July 2026, highest since 1996); on "My
// valuation's" the same chart's label rolls to VALUATION (his valuation is marked to matcha), on "high" the line spikes
// out of the chart; on "I" a plan.md card opens over the chart's flat early years: 404 on "don't", PLAN: null on "plan".
function sparkPts(n = 34) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    pts.push([u, 0.12 + 0.55 * Math.pow(u, 2.2) + (hsh(i * 3.7) - 0.5) * 0.08 * (1 - u * 0.5)]);
  }
  pts[n - 1][1] = 0.82;
  return pts;
}
const SPK = sparkPts();
export const MARKET = {
  num: "05",
  lay(U) {
    const P = U.P, R = U.R;
    return P
      ? { x: R.x + 40, x1: R.x + R.w - 40, ey: 450, labY: 590, labS: 120, priceY: 690, priceS: 72, srcY: 732, ch: { x: R.x + 40, y: 770, w: R.w - 80, h: 220 }, plan: { x: R.x + R.w - 420, y: 790, w: 380, h: 220 }, spike: 300 }
      : { x: 930, x1: 1820, ey: 250, labY: 400, labS: 150, priceY: 520, priceS: 96, srcY: 566, ch: { x: 930, y: 612, w: 890, h: 250 }, plan: { x: 950, y: 646, w: 420, h: 236 }, spike: 500 };
  },
  back(E, c, st) {
    const { U, tb } = st, P = U.P, L = this.lay(U);
    const val = tb >= O.my15 - 0.066;
    eyebrow(E, c, "MARKET", L.x, L.ey);
    // label slot-roll: MATCHA -> VALUATION (same chart: his valuation is marked to matcha)
    const roll = val ? io((tb - O.my15 + 0.066) / 0.22) : 0;
    const labA = "MATCHA", labB = "VALUATION";
    const sA = L.labS, sB = fit(E, c, labB, { size: L.labS, tracking: -0.04 }, L.x1 - L.x - (P ? 70 : 100));
    c.save();
    c.beginPath();
    c.rect(L.x - 20, L.labY - L.labS * CAP - 24, L.x1 - L.x + 40, L.labS * CAP + 48);
    c.clip();
    const lh = L.labS * 1.05;
    if (roll < 1) {
      wordL(E, c, labA, L.x, L.labY - roll * lh, tb, O.matcha, { size: sA, tracking: -0.04 });
      if (tb >= O.matcha - 0.066) tri(c, L.x + tw(E, c, labA, sA, { tracking: -0.04 }) + sA * 0.42, L.labY - roll * lh - sA * CAP * 0.45, sA * 0.44, true, C.green);
    }
    if (roll > 0) {
      T(E, c, labB, L.x, L.labY + (1 - roll) * lh, { size: sB, tracking: -0.04, baseline: "alphabetic" });
      tri(c, L.x + tw(E, c, labB, sB, { tracking: -0.04 }) + sB * 0.36, L.labY + (1 - roll) * lh - sB * CAP * 0.45, sB * 0.44, true, C.green);
    }
    c.restore();
    this.chart(E, c, st, L);
    // the verified number + RECORD HIGH (stays through the valuation lines: VALUATION ▲ ¥17,250/kg)
    if (tb >= O.record13 - 0.066) {
      const pw = tw(E, c, "¥17,250/kg", L.priceS);
      wordL(E, c, "¥17,250/kg", L.x, L.priceY, tb, O.record13, { size: L.priceS });
      pillAt(E, c, L.x + pw + (P ? 22 : 30), L.priceY - L.priceS * CAP * 0.5, P ? 50 : 62, "RECORD HIGH", tb, O.high13, { bg: C.green, fg: C.ink, icon: "dot", dot: C.ink });
      M(E, c, "UJI FIRST-HARVEST TENCHA · JULY 2026 AUCTION · HIGHEST SINCE 1996", L.x, L.srcY, { size: P ? 14 : 19, color: C.inkA(0.62), tracking: 0.05, weight: 700, alpha: clamp((tb - O.record13 + 0.066) / 0.1) });
    }
    this.plan(E, c, st, L.plan);
    footer(E, c, U, this.num);
  },
  chart(E, c, st, L) {
    const { tb, U } = st, P = U.P, ch = L.ch;
    if (tb < O.matcha - 0.066) return;
    // draws on from "Matcha's" to "high" (linear); "My valuation's at a record high." spikes it out of the chart
    const p = clamp((tb - O.matcha + 0.05) / (O.high13 - O.matcha + 0.05));
    const spike = tb >= O.my15 ? oexpo((tb - O.high15 + 0.066) / 0.34) : 0;
    const n = SPK.length, upto = p * (n - 1);
    const X = (u) => ch.x + u * ch.w, Y = (v) => ch.y + ch.h - v * ch.h;
    const pts = [];
    for (let i = 0; i <= Math.min(n - 1, Math.ceil(upto)); i++) {
      const [u, v] = SPK[i];
      if (i > upto) { const [u0, v0] = SPK[i - 1], f = upto - (i - 1); pts.push([X(lerp(u0, u, f)), Y(lerp(v0, v, f))]); }
      else pts.push([X(u), Y(v)]);
    }
    let [hx, hy] = pts[pts.length - 1];
    if (spike > 0) { hy = lerp(hy, ch.y - L.spike, spike); hx += 20 * spike; pts.push([hx, hy]); }
    c.beginPath();
    c.moveTo(pts[0][0], ch.y + ch.h);
    for (const q of pts) c.lineTo(q[0], q[1]);
    c.lineTo(hx, ch.y + ch.h);
    c.closePath();
    c.fillStyle = C.pale;
    c.fill();
    c.fillStyle = C.ink;
    c.fillRect(ch.x, ch.y + ch.h, ch.w, 3);
    M(E, c, "1996", ch.x, ch.y + ch.h + 24, { size: P ? 16 : 19, color: C.inkA(0.6), weight: 700 });
    M(E, c, "2026", ch.x + ch.w, ch.y + ch.h + 24, { size: P ? 16 : 19, color: C.inkA(0.6), align: "right", weight: 700 });
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (const q of pts) c.lineTo(q[0], q[1]);
    c.strokeStyle = C.ink;
    c.lineWidth = P ? 7 : 9;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.stroke();
    if (spike > 0.05) tri(c, hx, hy - 10, P ? 40 : 50, true, C.ink);
    c.fillStyle = C.green;
    c.beginPath();
    c.arc(hx, hy, P ? 12 : 15, 0, 6.283);
    c.fill();
    c.lineWidth = 4;
    c.strokeStyle = C.ink;
    c.stroke();
  },
  // ROADMAP: plan.md opens on "I" (loading), 404 on "don't", const plan = null; types on "plan"
  plan(E, c, st, r) {
    const { tb, t, U } = st, P = U.P;
    if (tb < O.i16 - 0.066) return;
    const a = clamp((tb - O.i16 + 0.066) / 0.1);
    c.save();
    c.globalAlpha = a;
    c.translate(0, (1 - a) * 16);
    const tabW = P ? 170 : 190, tabH = P ? 40 : 46;
    c.fillStyle = C.ink;
    rrect(c, r.x, r.y - tabH, tabW, tabH + 10, 10);
    c.fill();
    M(E, c, "plan.md", r.x + 20, r.y - tabH / 2 + 1, { size: P ? 19 : 22, color: C.white, weight: 700, tracking: 0.02 });
    c.fillStyle = "#FFFFFF";
    c.fillRect(r.x, r.y, r.w, r.h);
    c.lineWidth = 4;
    c.strokeStyle = C.ink;
    c.strokeRect(r.x, r.y, r.w, r.h);
    const cx = r.x + r.w / 2;
    if (tb < O.dont16 - 0.066) {
      c.save();
      c.translate(cx, r.y + r.h * 0.42);
      c.rotate(t * 8);
      c.strokeStyle = C.ink;
      c.lineWidth = 6;
      c.lineCap = "round";
      c.beginPath();
      c.arc(0, 0, 30, 0, 4.4);
      c.stroke();
      c.restore();
      M(E, c, "LOADING PLAN…", cx, r.y + r.h * 0.42 + 64, { size: P ? 17 : 20, align: "center", color: C.inkA(0.6) });
    } else {
      const s = P ? 104 : 120, k = slam(tb, O.dont16, 1.3), by = r.y + (P ? 112 : 124);
      c.save();
      c.translate(cx, by - (s * CAP) / 2);
      c.scale(k, k);
      T(E, c, "404", 0, (s * CAP) / 2, { size: s, align: "center", tracking: -0.05, baseline: "alphabetic" });
      c.restore();
      M(E, c, "NOT FOUND", cx, by + (P ? 30 : 36), { size: P ? 18 : 22, align: "center", color: C.ink, weight: 800, tracking: 0.3 });
      if (tb >= O.plan - 0.066) {
        const str = "const plan = null;", n = st.live ? Math.floor(clamp((tb - O.plan + 0.066) / 0.18) * str.length) : str.length;
        const ps = P ? 19 : 22, w = measure(E, c, str, { font: B.FONT.mono, weight: 700, size: ps, tracking: 0.02 }), py = by + (P ? 70 : 82);
        c.fillStyle = C.green;
        c.fillRect(cx - w / 2 - 12, py - ps * 0.8, w + 24, ps * 1.5);
        M(E, c, str.slice(0, n), cx - w / 2, py, { size: ps, color: C.ink, weight: 700, tracking: 0.02 });
      }
    }
    c.restore();
  },
  plates() {},
  front() {},
};
