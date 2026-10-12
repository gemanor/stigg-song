// VERSE 1 (17.40-32.80) · look B PITCH DECK · CALM PASS: HIM talk-sings his own deck, four slides of two couplets each.
// Designer A2. Shared deck + kit live in ./verse1/ (pre1 reuses TEAM and FUND for HER red-pen pass).
//
// CALM PASS (CALM_PASS.md): 11 slides -> 4. Each slide holds ~2 bars and builds in place on the onsets (elements add,
// nothing replaces). No slide pushes, no camera punch, no flash pop, no click rings; word landings are a third as big.
// Cuts only on line starts / downbeats. HIS lip-sync bubble holds still across each slide (no circle swaps).
//  t       cut / word                       visual                                                         clip
//  17.40   CUT 1 COMPENSATION (hard cut in)  SALARY ..... (dotted), dark TOKEN BUDGET card with the live pixel  him_lipsync
//                                            odometer + burn chart; HIS founder bubble right ("founder (host)")  (slot t-17.30)
//  18.39   salary,                          "$0" lands at the end of SALARY
//  18.76   I (take)                         his own clean ink strike wipes through SALARY $0, row dims
//  19.11 / 19.354  token / budget.          green marker bars + TOKEN, BUDGET
//  20.085  quarter-million,                 the -250,000 roll (B.tokensAt, 0.45 s), "−250,000 TOKENS", chart cliff
//  20.88 / 21.13  investors / love          INVESTOR LOVE line climbs out of the cliff, rockets on "love": LOVE IT.
//  21.84   CUT 2 TEAM (downbeat)            [? CO-FOUNDER] + [HIS headshot (lip-sync) · ME · FOUNDER]           him_lipsync
//  22.263 / 22.38  Mac / mini               the Mac mini (his sheet, on its leash) lands in the slot; MAC MINI
//  22.535 / 23.064 sitting / shelf.         a shelf builds under it; the mini drops onto it
//  23.76 / 24.358  sleeps / eats.           SLEEP 0h | 0h, MEALS 0 | 0 build under the two circles
//  24.474 / 24.938 It's / myself.           "=" lands between the circles: [MAC MINI] = [ME]; ME gets its marker
//  25.18   CUT 3 FUNDRAISING (beat; the lip-sync slot ends 25.22)  VC in his ice tub right; deal table left          vc_plunge
//  25.32 / 25.612  Closed / seed            ROUND  SEED [✓ CLOSED]                                                (0.26-4.05)
//  25.88 / 25.983  cold / plunge,           VENUE  COLD PLUNGE, frost grows on it
//  26.32 -> 26.97  it was over ... flash.   TERMS  the signature draws while he signs; SIGNED on "flash"
//  27.32 -> 27.934 He couldn't feel his fingers   WIRE  $3,000,000.00 typed by fingers he can't feel, digits shiver
//  28.36 / 28.86   wired / cash.            RECEIVED pill, its check on "cash"
//  28.967  CUT 4 MARKET (line start)        HE presents (him_pitch 1.0-4.83); MATCHA ▲ chart draws on              him_pitch
//  29.60 / 29.74   record / high,           ¥17,250/kg + RECORD HIGH (verified: Uji first-harvest tencha, July 2026,
//                                           highest since 1996)
//  30.894  My (valuation's)                 the same chart's label rolls MATCHA -> VALUATION
//  31.846  high.                            the line spikes out of the chart
//  32.12 / 32.32 / 32.68  I / don't / plan. plan.md opens (loading) -> 404 NOT FOUND -> const plan = null;  (he turns
//                                           square to camera at 4.3 s = 32.27)
// Cut in the calm pass: title card, separate BURN slide + magic move, BENCHMARKS circle swap, HQ: SHELF pill, FINGERS
// close-up, separate WIRE slide (FROM/MEMO rows), ticker tape, SHORTAGE/JAPAN chips, MARKED TO MATCHA, 2nd RECORD
// HIGH, chart scroll, separate ROADMAP slide, him_dance finger guns, click rings, slide pushes, punch, flash.
// Portrait: content in the upper safe band, faces above the house subtitle, a dark stage band across the platform-UI zone.
import * as K from "./verse1/kit.js";
import * as D from "./verse1/deck.js";

const { C, clamp } = K;
let KK, v = {};
const CLIPS = { pitch: "him_pitch", lip: "him_lipsync", vc: "vc_plunge" };
const LIP0 = 17.3; // him_lipsync slot (clip t = song t - 17.30, covers 17.30-25.22), never shifted
const T_TEAM = 21.84; // downbeat (gives LOVE IT. its read before the cut)
const T_FUND = 25.18; // beat before "Closed", the lip-sync slot runs out at 25.22
const LIP_UV = [0.66, 0.58], LIP_R = 0.34; // him_lipsync framing inside a circle: centre on his chin, radius (clip-height units)

function shot(t) {
  const O = D.O;
  if (t < T_TEAM) return "COMP";
  if (t < T_FUND) return "TEAM";
  if (t < O.matcha) return "FUND";
  return "MARKET";
}
const SL = { COMP: D.COMP, TEAM: D.TEAM, FUND: D.FUND, MARKET: D.MARKET };

function localTimes(t, s) {
  const O = D.O, lt = {};
  if (s === "COMP" || s === "TEAM") lt.lip = t - LIP0;
  if (s === "FUND") lt.vc = 0.26 + (t - T_FUND); // 0.26-4.05 (clean < 5.2)
  if (s === "MARKET") lt.pitch = 1.0 + (t - O.matcha); // presents right, turns square to camera at 4.3 (32.27)
  for (const k in lt) lt[k] = K.inClip(v[k], lt[k]);
  return lt;
}
// presenter framing (him_pitch) on the MARKET slide, units
function presFrame(U) {
  if (U.P) { const w = 1700; return { x: -25, y: 820, w, h: (w * 9) / 16 }; }
  const w = 2050;
  return { x: -205, y: 175, w, h: (w * 9) / 16 };
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
    const lt = localTimes(t, shot(t));
    for (const k in lt) if (v[k]) await v[k].frame(lt[k]);
  },
  render(E, t, rt) {
    const S = E.SCALE, U = K.units(E), P = U.P;
    const s = shot(t), lt = localTimes(t, s), slide = SL[s];
    const st = { t, tb: t, U, xf: { ox: 0, oy: 0, z: 1 }, v, lt, live: true };
    if (s === "TEAM" && v.lip) st.head = { v: v.lip, lt: lt.lip, key: "lip", uvC: LIP_UV, ruv: LIP_R, sing: true, level: K.voice(E, t, "HIM") };
    const bub = s === "COMP" && v.lip ? D.COMP.lay(U).bub : null;
    E.renderer.setRenderTarget(rt);

    // ------------------------------------------------------------------ BACK
    const gA = KK.gA, c = gA.ctx;
    gA.clear();
    c.setTransform(S, 0, 0, S, 0, 0);
    c.fillStyle = C.paper;
    c.fillRect(0, 0, U.W0, U.H0);
    slide.back(E, c, st);
    c.setTransform(S, 0, 0, S, 0, 0);
    K.stageBand(E, c, U, slide.num, { progress: (t - 17.4) / (32.8 - 17.4) });
    if (bub) K.bubbleBack(c, bub.cx, bub.cy, bub.r, { fill: C.pale });
    gA.commit();
    E.blitG2D(E, gA, 1);

    // ------------------------------------------------------------------ PLATES
    slide.plates(E, st);
    if (bub) K.headshot(E, v.lip, "lipB", bub.cx, bub.cy, bub.r, LIP_UV, LIP_R, { popUp: 1.62, popW: 0.66 });
    if (s === "MARKET" && v.pitch) K.plate(E, v.pitch, presFrame(U));

    // ------------------------------------------------------------------ FRONT
    const gB = KK.gB, f = gB.ctx;
    gB.clear();
    f.setTransform(S, 0, 0, S, 0, 0);
    slide.front(E, f, st);
    if (bub) K.bubbleFront(E, f, bub.cx, bub.cy, bub.r, { ring: C.ink, lw: bub.r * 0.028 + 2, popW: 0.66, level: K.voice(E, t, "HIM"), name: P ? null : "founder (host)", dot: true, nameSize: 26 });
    if (P && s === "MARKET") {
      // portrait: the stage band hides the presenter clip's thigh-line cut
      f.fillStyle = C.ink;
      f.fillRect(0, 1730, U.W0, U.H0 - 1730);
    }
    gB.commit();
    E.blitG2D(E, gB, 1);

    // ------------------------------------------------------------------ HUD (calm pass: token meter only)
    E.hud.theme = "light";
    if (s === "COMP") E.hud.meter = false; // the slide's own odometer IS the meter here
    if (P) E.hud.subY = 70;
  },
};
