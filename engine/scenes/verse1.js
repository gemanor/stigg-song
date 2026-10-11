// VERSE 1 (17.40-32.80) · look B PITCH DECK · HIM talk-sings his own deck, one slide per line, builds on onsets/beats.
// Designer A2. Shared deck + kit live in ./verse1/ (pre1 reuses the same slides for HER red-pen pass).
//
// PLAN (onsets from engine/data/lyrics.json; beats 18.04D 18.52 18.98 19.46 | 19.94D 20.42 20.90 21.38 | 21.84D 22.32
// 22.80 23.28 | 23.76D 24.22 24.70 25.18 | 25.66D 26.14 26.60 27.08 | 27.56D 28.04 28.52 28.98 | 29.46D 29.94 30.42 30.90 |
// 31.36D 31.84 32.32 32.80)
//  t       word / event             visual                                                        layer          cut
//  17.40   (hard cut in)            dark stage, slide 01 card "building." + "v47_FINAL_final(2).key";  BACK card,     hard cut
//                                   HIM (him_pitch 0.25s) steps OUT of the card: clipped at its       MID type behind
//                                   bottom edge, head/arm over the dark stage; title behind his hand  his hand, FRONT
//  18.013  I                        CLICK (ring at his clicker hand, pose 16) -> 02 COMPENSATION        FRONT ring      cut (≈18.04D)
//  18.39   salary,                  "$0" slams at the end of SALARY ........                            BACK
//  18.76   I (take)                 his own clean ink strike wipes through SALARY $0, row dims          BACK
//  19.11   token / 19.354 budget.   green marker bars + TOKEN, BUDGET slam; live meter pill "/ MONTH"  BACK
//  19.70   Burned                   03 BURN: dark dashboard card, giant pixel ODOMETER of tokensAt     BACK (HUD meter off) cut
//  20.085  quarter-million,         the -250,000 roll (B.tokensAt, 0.45 s linear) + "−250,000 TOKENS" slam, punch
//                                   burn chart line falls off the cliff (live from tokensAt)
//  20.88   investors                INVESTOR LOVE line rises out of the cliff (scissors chart)
//  21.13   love                     it rockets off the chart, "LOVE IT." slams                          BACK
//  21.525  My / 21.734 co-founder's 04 TEAM: HIM pop-out headshot (him_cu_talk masked in a circle, cap   PLATE + FRONT   cut
//                                   breaks out the top) + dashed "?" co-founder slot
//  22.263  Mac / 22.38 mini         Mac mini prop (from his sheet) slams into the circle; MAC MINI caption
//  22.535  sitting / 23.064 shelf.  a shelf builds under it; the mini drops onto it; "HQ: SHELF" chip
//  23.44   It (never sleeps)        magic move -> 05 BENCHMARKS: circles become column heads (ME | MAC MINI)
//  23.76   sleeps,  24.358 eats.    rows SLEEP 0h|0h, MEALS 0|0 slam                                     BACK
//  24.938  myself.                  "MAC MINI = ME" slams, marker on "= ME"
//  25.32   Closed                   06 FUNDRAISING: VC (vc_plunge 0.4s) in his ice tub on the right;    PLATE           cut
//                                   CLOSED pill; 25.612 SEED; 25.88/25.983 COLD PLUNGE; frost grows    FRONT frost
//  26.32   it (was over)            TERM SHEET card; signature draws while the VC scribbles             BACK
//  26.97   flash.                   camera FLASH (post.flash, 1 flash) + SIGNED badge                   post
//  27.32   He                       07 FINGERS: extreme close-up of his shaking hands (vc 2.4s)         PLATE           cut
//  27.934  fingers,                 "FINGERS" (shivering) + OFFLINE pill + leader to the stylus hand   FRONT
//  28.22   but (he wired)           08 WIRE RECEIVED card (28.36 wired), every digit of $3,000,000.00   BACK            cut
//                                   shivers; the small VC keeps shivering at the card's corner; 28.86 cash: ✓ draws
//  28.967  Matcha's                 09 MARKET: HIM presents (him_pitch 1.0s); MATCHA ▲ ticker draws on  BACK + PLATE    cut (≈28.98)
//  29.60   record / 29.74 high,     ¥17,250/kg (verified) + RECORD HIGH pill; source line (Uji, July 2026, highest since 1996)
//  30.26   shortage / 30.778 Japan  SUPPLY ▼ SHORTAGE + JAPAN chips
//  30.894  My (valuation's)         same chart, label slot-rolls MATCHA -> VALUATION ("MARKED TO MATCHA")
//  31.846  high.                    the line spikes out of the frame, camera tilts up, RECORD HIGH again
//  32.12   I (don't have a plan)    11 ROADMAP: plan.md loading; 32.32 don't -> "404 NOT FOUND";         BACK            cut
//  32.68   plan.                    "const plan = null;" types on; HIM (him_dance) fires finger guns on "plan" (peak 3.0s)
// Clips: him_pitch 0.25-2.55s (17.40-19.70) and 1.0-4.15s (28.967-32.12, bigger framing); him_cu_talk 0.25-4.05s (headshot);
//        vc_plunge 0.4-4.05s (25.32-28.967, never past the 5.2s flaw); him_dance 2.44-3.12s (32.12-32.80).
import * as K from "./verse1/kit.js";
import * as D from "./verse1/deck.js";

const { C, B, clamp, lerp, oc, io } = K;
let KK, v = {};
const CLIPS = { pitch: "him_pitch", lip: "him_lipsync", vc: "vc_plunge", dance: "him_dance" };
const LIP0 = 17.3, LIP1 = 17.3 + 7.9; // him_lipsync slot (clip t = song t - 17.30), never shifted
const T_FUND = 25.18; // cut to the cold plunge on the beat, before the lip-sync slot runs out (25.22)
// him_lipsync framing inside a circle: centre on his chin, radius in clip-height units
const LIP_UV = [0.66, 0.58], LIP_R = 0.34;

// ---------------------------------------------------------------------------------------------- shot table
function shot(E, t) {
  const O = D.O;
  if (t < 18.013) return { s: "TITLE", pres: "A" };
  if (t < O.burned) return { s: "COMP", bub: "COMP" };
  if (t < O.my5) return { s: "BURN", bub: "BURN" };
  if (t < T_FUND) return { s: "TEAM" };
  if (t < O.he11) return { s: "FUND" };
  if (t < O.but12) return { s: "FINGERS" };
  if (t < O.matcha) return { s: "WIRE" };
  if (t < O.i16) return { s: "MARKET", pres: "B" };
  return { s: "PLAN", pres: "D" };
}
const SL = () => ({ TITLE: D.TITLE, COMP: D.COMP, BURN: D.BURN, TEAM: D.TEAM, FUND: D.FUND, FINGERS: D.FINGERS, WIRE: D.WIRE, MARKET: D.MARKET, PLAN: D.PLAN });
const CUT_TIMES = () => [18.013, D.O.burned, D.O.my5, T_FUND, D.O.he11, D.O.but12, D.O.matcha, D.O.i16];

// clip-local times
function localTimes(E, t, sh) {
  const O = D.O, lt = {};
  if (sh.pres === "A") lt.pitch = 0.25 + (t - 17.4);
  if (sh.pres === "B") lt.pitch = 1.0 + (t - O.matcha);
  if (sh.pres === "D") lt.dance = 3.0 + (t - O.plan); // finger-gun peak (≈3.0) on "plan"
  if (sh.bub || sh.s === "TEAM") lt.lip = t - LIP0; // lip-synced slot
  if (sh.s === "FUND" || sh.s === "FINGERS" || sh.s === "WIRE") lt.vc = 0.4 + (t - O.closed); // 0.4-4.05 (clean < 5.2)
  for (const k in lt) lt[k] = K.inClip(v[k], lt[k]);
  return lt;
}

// presenter framing (him_pitch), units
function presFrame(U, which, t) {
  const { W0, H0, P, R } = U;
  if (which === "D") {
    // him_dance full body, scaled down for headroom (cap is 8 px from the clip's top edge)
    if (P) { const w = 1500; return { x: R.x + 260 - 0.485 * w, y: 975, w, h: (w * 9) / 16 }; }
    const w = 1700;
    return { x: 400 - 0.485 * w, y: 150, w, h: (w * 9) / 16 };
  }
  if (P) {
    // portrait: lower third, face above the house subtitle; the chart sits behind him
    const w = which === "B" ? 1700 : 1500;
    return { x: which === "B" ? -25 : 15, y: which === "B" ? 820 : 835, w, h: (w * 9) / 16 };
  }
  if (which === "B") { const w = 2050; return { x: -205, y: 175, w, h: (w * 9) / 16 }; }
  const w = 1920;
  return { x: -150, y: 150, w, h: 1080 };
}
// founder bubble (Loom-style webcam circle) per shot, units
function bubbleSpec(U, which) {
  const P = U.P, R = U.R;
  if (which === "COMP") return P ? { cx: R.x + R.w - 175, cy: 1085, r: 195, fill: C.pale, ring: C.ink, name: "founder (host)" } : { cx: 440, cy: 640, r: 292, fill: C.pale, ring: C.ink, name: "founder (host)" };
  return P ? { cx: R.x + 150, cy: 990, r: 128, fill: C.pale, ring: C.green, name: null } : { cx: 200, cy: 826, r: 152, fill: C.pale, ring: C.green, name: null };
}
// title card placement (units): the slide drawn at z inside a dark stage
function titleXf(U) {
  const { W0, H0, P } = U;
  if (P) return { ox: 0, oy: 0, z: 1, card: { x: 40, y: 240, w: 1000, h: 1060 } };
  return { ox: 330, oy: 112, z: 0.79, card: { x: 330, y: 112, w: 1920 * 0.79, h: 1080 * 0.79 } };
}

export default {
  async load(E) {
    KK = await K.kit(E);
    D.initDeck(E);
    for (const [k, name] of Object.entries(CLIPS)) {
      try { v[k] = await E.loadVideo(name); } catch (e) { v[k] = null; }
    }
  },
  async prepare(E, t) {
    const sh = shot(E, t), lt = localTimes(E, t, sh);
    for (const k in lt) if (v[k]) await v[k].frame(lt[k]);
  },
  render(E, t, rt) {
    const S = E.SCALE, U = K.units(E), O = D.O, P = U.P;
    const sh = shot(E, t), lt = localTimes(E, t, sh), slide = SL()[sh.s];
    const isTitle = sh.s === "TITLE";
    const xf = isTitle ? titleXf(U) : { ox: 0, oy: 0, z: 1 };
    const st = { t, tb: t, U, xf, v, lt, live: true };
    E.renderer.setRenderTarget(rt);

    // ------------------------------------------------------------------ BACK
    const gA = KK.gA, c = gA.ctx;
    gA.clear();
    c.setTransform(S, 0, 0, S, 0, 0);
    if (isTitle) {
      c.fillStyle = C.bg;
      c.fillRect(0, 0, U.W0, U.H0);
      B.hairGrid(c, 0, 0, U.W0, U.H0, { step: 96, alpha: 0.6 });
      // card
      const cd = xf.card;
      c.fillStyle = C.paper;
      c.fillRect(cd.x, cd.y, cd.w, cd.h);
      B.crosshairs(c, cd.x - 20, cd.y - 20, cd.w + 40, cd.h + 40, { color: C.greenA(0.6), len: 30, inset: 10, cross: 6 });
      c.save();
      c.beginPath();
      c.rect(cd.x, cd.y, cd.w, cd.h);
      c.clip();
      c.setTransform(S * xf.z, 0, 0, S * xf.z, S * xf.ox, S * xf.oy);
    } else {
      c.fillStyle = C.paper;
      c.fillRect(0, 0, U.W0, U.H0);
    }
    // TEAM/BENCH headshot = the lip-synced slot
    if (sh.s === "TEAM" && v.lip) st.head = { v: v.lip, lt: lt.lip, key: "lip", uvC: LIP_UV, ruv: LIP_R, sing: true, level: K.voice(E, t, "HIM") };
    slide.back(E, c, st);
    if (isTitle) c.restore();
    const bub = sh.bub && v.lip ? bubbleSpec(U, sh.bub) : null;
    if (bub) { c.setTransform(S, 0, 0, S, 0, 0); K.bubbleBack(c, bub.cx, bub.cy, bub.r, { fill: bub.fill }); }
    gA.commit();
    E.blitG2D(E, gA, 1);

    // ------------------------------------------------------------------ PLATES
    slide.plates(E, st);
    if (bub) K.headshot(E, v.lip, "lipB", bub.cx, bub.cy, bub.r, LIP_UV, LIP_R, { popUp: 1.62, popW: 0.66 });
    let Fp = null;
    const pv = sh.pres === "D" ? v.dance : v.pitch;
    if (sh.pres && pv) {
      Fp = presFrame(U, sh.pres, t);
      let clip = null;
      if (isTitle) {
        // he steps out of the slide: cut at the card's bottom edge
        const cardB = xf.card.y + xf.card.h;
        clip = { x: -1e4, y: -1e4, w: 2e4, h: cardB + 1e4 };
        Fp = P ? { x: 15, y: 835, w: 1500, h: 843.75 } : { x: -60, y: 185, w: 1700, h: 956.25 };
      }
      K.plate(E, pv, Fp, { clip });
    }

    // ------------------------------------------------------------------ FRONT
    const gB = KK.gB, f = gB.ctx;
    gB.clear();
    f.setTransform(S * xf.z, 0, 0, S * xf.z, S * xf.ox, S * xf.oy);
    slide.front(E, f, st);
    f.setTransform(S, 0, 0, S, 0, 0);
    // clicker: a ring pulses at his clicker hand on every slide change while he presents
    if (Fp && v.pitch && sh.pres !== "D") {
      const last = lastCut(t);
      const p = K.pose(v.pitch, lt.pitch, 16);
      if (p && last != null && t - last < 0.35) {
        const [hx, hy] = K.fpt(Fp, p), u = clamp((t - last) / 0.35);
        f.strokeStyle = C.green;
        f.lineWidth = 6 * (1 - u) + 1;
        f.globalAlpha = 1 - u;
        f.beginPath();
        f.arc(hx, hy, 18 + 70 * oc(u), 0, 6.283);
        f.stroke();
        f.globalAlpha = 1;
        K.M(E, f, "CLICK", hx + 40 + 30 * u, hy - 40, { size: 20, color: C.ink, weight: 800, alpha: 1 - u });
      }
    }
    if (bub) K.bubbleFront(E, f, bub.cx, bub.cy, bub.r, { ring: bub.ring, lw: bub.r * 0.028 + 2, popW: 0.66, level: K.voice(E, t, "HIM"), name: bub.name, dot: true, nameSize: 26 });
    if (P && sh.pres && sh.pres !== "D" && !isTitle) {
      // portrait: a stage band hides the clip's thigh-line cut
      f.fillStyle = C.ink;
      f.fillRect(0, 1730, U.W0, U.H0 - 1730);
    }
    gB.commit();
    E.blitG2D(E, gB, 1);

    // ------------------------------------------------------------------ post / HUD
    E.hud.theme = isTitle ? "dark" : "light";
    if (sh.s === "BURN") E.hud.meter = false;
    if (P) E.hud.subY = 70;
    // the quarter-million roll punches the camera once; the flash is the deal closing
    E.post.punch = 0.035 * Math.exp(-Math.max(0, t - O.quarter) / 0.12) * (t >= O.quarter - 0.02 ? 1 : 0);
    if (t >= O.flash - 0.02 && t < O.flash + 0.2) {
      E.post.flash = 0.16 * Math.exp(-(t - O.flash) / 0.06);
      E.post.flashCol = [1, 1, 1];
    }
  },
};
function lastCut(t) {
  let r = null;
  for (const x of CUT_TIMES()) if (x <= t) r = x;
  return r;
}
