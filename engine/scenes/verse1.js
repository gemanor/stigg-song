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
const CLIPS = { pitch: "him_pitch", cu: "him_cu_talk", vc: "vc_plunge", dance: "him_dance" };

// ---------------------------------------------------------------------------------------------- shot table
function shot(E, t) {
  const O = D.O;
  if (t < 18.013) return { s: "TITLE", pres: "A" };
  if (t < O.burned) return { s: "COMP", pres: "A" };
  if (t < O.my5) return { s: "BURN" };
  if (t < O.closed) return { s: "TEAM" };
  if (t < O.he11) return { s: "FUND" };
  if (t < O.but12) return { s: "FINGERS" };
  if (t < O.matcha) return { s: "WIRE" };
  if (t < O.i16) return { s: "MARKET", pres: "B" };
  return { s: "PLAN", pres: "D" };
}
const SL = () => ({ TITLE: D.TITLE, COMP: D.COMP, BURN: D.BURN, TEAM: D.TEAM, FUND: D.FUND, FINGERS: D.FINGERS, WIRE: D.WIRE, MARKET: D.MARKET, PLAN: D.PLAN });
const CUT_TIMES = () => [18.013, D.O.burned, D.O.my5, D.O.closed, D.O.he11, D.O.but12, D.O.matcha, D.O.i16];

// clip-local times
function localTimes(E, t, sh) {
  const O = D.O, lt = {};
  if (sh.pres === "A") lt.pitch = 0.25 + (t - 17.4);
  if (sh.pres === "B") lt.pitch = 1.0 + (t - O.matcha);
  if (sh.pres === "D") lt.dance = 3.0 + (t - O.plan); // finger-gun peak (≈3.0) on "plan"
  if (sh.s === "TEAM") lt.cu = 0.25 + (t - O.my5);
  if (sh.s === "FUND" || sh.s === "FINGERS" || sh.s === "WIRE") lt.vc = 0.4 + (t - O.closed); // 0.4-4.05 (clean < 5.2)
  for (const k in lt) lt[k] = K.inClip(v[k], lt[k]);
  return lt;
}

// presenter framing (him_pitch), units
function presFrame(U, which, t) {
  const { W0, H0, P, R } = U;
  if (which === "D") {
    // him_dance full body, scaled down for headroom (cap is 8 px from the clip's top edge)
    if (P) { const w = 1500; return { x: R.x + 260 - 0.485 * w, y: 1060, w, h: (w * 9) / 16 }; }
    const w = 1700;
    return { x: 400 - 0.485 * w, y: 150, w, h: (w * 9) / 16 };
  }
  if (P) {
    const w = which === "B" ? 1700 : 1600;
    return { x: R.x + 250 - 0.2 * w, y: which === "B" ? 860 : 880, w, h: (w * 9) / 16 };
  }
  if (which === "B") { const w = 2050; return { x: -205, y: 175, w, h: (w * 9) / 16 }; }
  const w = 1920;
  return { x: -150, y: 150, w, h: 1080 };
}
// title card placement (units): the slide drawn at z inside a dark stage
function titleXf(U) {
  const { W0, H0, P } = U;
  if (P) return { ox: 40, oy: 250, z: 1000 / W0 };
  return { ox: 330, oy: 112, z: 0.79 };
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
      const cw = U.W0 * xf.z, chh = U.H0 * xf.z;
      c.fillStyle = C.paper;
      c.fillRect(xf.ox, xf.oy, cw, chh);
      B.crosshairs(c, xf.ox - 20, xf.oy - 20, cw + 40, chh + 40, { color: C.greenA(0.6), len: 30, inset: 10, cross: 6 });
      c.setTransform(S * xf.z, 0, 0, S * xf.z, S * xf.ox, S * xf.oy);
    } else {
      c.fillStyle = C.paper;
      c.fillRect(0, 0, U.W0, U.H0);
    }
    slide.back(E, c, st);
    gA.commit();
    E.blitG2D(E, gA, 1);

    // ------------------------------------------------------------------ PLATES
    slide.plates(E, st);
    let Fp = null;
    const pv = sh.pres === "D" ? v.dance : v.pitch;
    if (sh.pres && pv) {
      Fp = presFrame(U, sh.pres, t);
      let clip = null;
      if (isTitle) {
        // he steps out of the slide: cut at the card's bottom edge
        const cardB = xf.oy + U.H0 * xf.z;
        clip = { x: -1e4, y: -1e4, w: 2e4, h: cardB + 1e4 };
        Fp = P ? { x: 40 + 250 - 0.2 * 1500, y: 1720 - 0.62 * 843, w: 1500, h: 843 } : { x: -60, y: 185, w: 1700, h: 956 };
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
    if (P && sh.pres && !isTitle) {
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
