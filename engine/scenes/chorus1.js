// CHORUS 1 · 42.55-56.12 · HOOK_01 · owner A3 · looks C ↔ A per sung line (C on odd lines, A on even lines)
// Beats 42.80D 43.28 43.76 44.22 | 44.70D 45.18 45.66 46.14 | 46.60D 47.08 47.56 48.04 | 48.50D 48.98 49.46 49.94 |
//       50.42D 50.90 51.38 51.84 | 52.32D 52.80 53.28 53.76 | 54.22D 54.70 55.18 55.66 | 56.12D (next section)
//
// PLAN  t        word / event                     visual                                                        layer        cut / beat
//  S1a  42.550   (hard cut in)                    C · ECU him_chant shouting, fist up (clip 0.05→); giant "I'M"   BACK / plate  first frame = slam
//       42.597   I'm                              "I'M" condensed ink slams (3-frame anticipation), burn tag      MID
//       42.800   downbeat                         camera punch                                                   post
//  S1b  42.934   an                               cut: MCU (pumps beat-locked) "AN" left of him                  MID          cut on word
//       43.054   AI                               "AI" right of him (he stands between the letters)              MID
//       43.280   beat                             fist-pump peak lands on the beat · impact lines at his fists   FRONT        pump knots
//  S1c  43.354   founder!                         cut: wide full body standing IN "FOUNDER!" (behind his legs)    MID          cut on word
//                                                 "I'M AN AI" small ink top-left · burn tag · contact shadow
//       43.760   beat                             pump peak + white impact bursts tracked to both wrists          FRONT
//  S2   44.174   Founder! (GANG)                  A · stadium tiers of FOUNDER! (rows scroll, jump on the beat)    BACK         cut on word
//                                                 "GANG CHANT −8,663 TOKENS" readout
//  S3   44.654   I                                C · him_cu_talk MCU shrug (clip 2.45→), "I" ink                  MID          cut on word ≈ 44.70D
//       44.914   can't                            hero CAN'T (ink)                                               MID
//       45.180   beat                             tracked "TONIGHT · BUSY" chip pops onto his open palm           FRONT
//       45.294   come / 45.434 out                "COME OUT" medium                                              MID
//       45.714   tonight.                         hero TONIGHT. (white accent)                                    MID
//  S4   45.994   (HER note, unsung)               A · her_cu_talk CU side-eye (clip 0.30→2.69, sips at the end)    plate        cut after "tonight."
//                                                 his line re-set small white on the right
//       46.140   beat                             coral underline #1 under CAN'T                                   FRONT
//       46.600   downbeat                         note "of course you can't" writes (penNote)                      FRONT
//       47.080   beat                             underline #2 · 47.56 coral arrow note→CAN'T · "COST: 0 TOKENS"   FRONT
//       48.040   beat                             slow push-in (anticipation), she sips                           post
//  S5   48.380   See · 48.454 you                 A · LOCKUP #1 (B.afterTokens): him_chant mirrored, big, stands    FRONT band   cut on word
//       48.794   after · 49.114 tokens!           BEHIND the lockup banner (head + fists above it); pumps on beats
//       48.50D / 48.98 / 49.46                    pump peaks beat-locked, impact bursts                           FRONT
//  S6   49.934   I'm (held to 50.574)             C · him_dance finger guns (pops on 50.42 / 51.38), outline type  MID          cut on word
//                                                 "I'M" fills bottom→top like a usage meter while he holds it
//       50.574   an · 50.674 AI                   fill on onset
//       50.974   founder!                         FOUNDER! fills white · burn tags; finger-gun muzzle lines        MID / FRONT
//  S7   51.794   Founder! (GANG)                  A · wave grid: a stadium wave sweeps the wall of FOUNDER!        BACK         cut on word
//  S8   52.334   No                               C · funding-stage track PRE-SEED → SERIES B draws (linear)       BACK         cut on word ≈ 52.32D
//       52.554   dating                           "NO DATING" hero · padlock + "DATING" at SERIES B                MID
//       52.800   beat                             ✕ DATING under PRE-SEED / SEED / SERIES A                        MID
//       52.874   till · 53.054 Series             SERIES B node lights                                            MID
//       53.280   beat · 53.334 B.                 padlock opens · "SERIES B." lands                               MID
//  S9   53.794   See / you / after / tokens!      A · LOCKUP #2 left, him_cu_talk deadpan right (clip 0.55→)        MID / plate  cut on word
//       53.850   (HER note, unsung)               "babe, you're pre-seed" writes, 54.70 coral arrow to his face      FRONT
//       55.180   beat                             double underline under "pre-seed"                                FRONT
//       55.660   beat                             coral PRE-SEED stamp slams next to him (last accent)              FRONT
// Every word is drawn by the scene, so the HUD subtitle is off; the HUD meter stays on (chorus words burn ×1.6).
import * as K from "./chorus1/kit.js";
const { B, C, FONT, clamp, lerp, ease } = K;
const INK = C.ink;

export default K.makeScene({
  clips: ["him_chant", "him_cu_talk", "her_cu_talk", "him_dance"],
  shots(E, V) {
    const L = E.section("chorus1"), w = (li, wi) => L[li].words[wi];
    const chant = V.him_chant, cu = V.him_cu_talk, herCu = V.her_cu_talk, dance = V.him_dance ?? V.him_chant;
    const kL1 = K.pumpKnots(E, chant, 43.28, 44.3, 1); // pumps 1.333 / 1.958 / 2.583 on 43.28 / 43.76 / 44.22
    const kL4 = K.pumpKnots(E, chant, 48.5, 49.94, 3); // pumps 2.583 … 4.375 on 48.50 … 49.94 (stays before the can pops back at 4.75)
    const kDance = V.him_dance ? [[50.42, 1.958], [51.38, 3.0], [52.34, 3.917]] : K.pumpKnots(E, chant, 50.42, 51.4, 2);
    const lin = (v, t0, c0) => (F) => [[v, K.inClip(v, c0 + (F.t - t0))]];
    const drift = (F, a, b, amt) => K.creep(F.t, a, b, amt);
    const warped = (v, kn) => (F) => [[v, K.inClip(v, K.warp(kn, F.t))]];
    const S1 = [];

    // ---------------------------------------------------------------------------------------- S1a "I'M" (ECU)
    S1.push({ a: 42.55, b: w(0, 1).s, look: "C", clips: lin(chant, 42.55, 0.05), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, 42.55, w(0, 1).s, 0.05);
      const op = port
        ? K.frameSub(E, v, { h: 0.4 * H * dr, spanUV: 0.2, au: 0.771, av: 0.22, cx: 0.5 * W, ay: 0.56 * H })
        : K.frameSub(E, v, { h: 0.74 * H * dr, spanUV: 0.2, au: 0.771, av: 0.22, cx: 0.69 * W, ay: 0.5 * H });
      F.back((c) => {
        K.groundC(F, c);
        const o = { ...K.COND, color: INK, align: "left", baseline: "alphabetic" };
        if (port) { o.size = K.fit(F, c, "I'M", { ...o, size: 500 * S }, R.w * 0.9); K.slamText(F, c, "I'M", R.x + R.w * 0.04, F.PT + o.size * K.CAP.cond, w(0, 0).s, o); }
        else { o.size = K.fit(F, c, "I'M", { ...o, size: 0.98 * H }, 0.4 * W); K.slamText(F, c, "I'M", 0.04 * W, 0.94 * H, w(0, 0).s, o); }
        K.burnTag(F, c, w(0, 0), port ? R.x + R.w * 0.62 : 0.05 * W, port ? F.PT + 40 * S : 0.2 * H, { color: INK, unit: " TOKENS", size: 34 });
      });
      F.plate(v, op);
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S1b "AN" "AI" (MCU)
    S1.push({ a: w(0, 1).s, b: w(0, 3).s, look: "C", clips: warped(chant, kL1), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(0, 1).s, w(0, 3).s);
      const op = port
        ? K.frameSub(E, v, { h: 0.6 * H * dr, spanUV: 0.5, av: 0.1, cx: 0.5 * W, ay: 0.4 * H })
        : K.frameSub(E, v, { h: 0.84 * H * dr, spanUV: 0.5, av: 0.1, cx: 0.5 * W, ay: 0.1 * H });
      F.back((c) => {
        K.groundC(F, c);
        const o = { ...K.COND, color: INK, baseline: "alphabetic" };
        if (port) {
          o.size = K.fit(F, c, "AN", { ...o, size: 360 * S }, R.w * 0.44);
          const y = F.PT + o.size * K.CAP.cond;
          K.slamText(F, c, "AN", R.x + R.w * 0.25, y, w(0, 1).s, { ...o, align: "center" });
          K.slamText(F, c, "AI", R.x + R.w * 0.75, y, w(0, 2).s, { ...o, align: "center" });
        } else {
          o.size = Math.min(K.fit(F, c, "AN", { ...o, size: 0.9 * H }, 0.25 * W), K.fit(F, c, "AI", { ...o, size: 0.9 * H }, 0.25 * W));
          K.slamText(F, c, "AN", 0.285 * W, 0.92 * H, w(0, 1).s, { ...o, align: "right" });
          K.slamText(F, c, "AI", 0.715 * W, 0.92 * H, w(0, 2).s, { ...o, align: "left" });
        }
        K.fistBursts(F, c, v, lt, op, kL1, C.white);
      });
      F.plate(v, op);
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S1c "FOUNDER!" (wide)
    S1.push({ a: w(0, 3).s, b: w(1, 0).s, look: "C", clips: warped(chant, kL1), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(0, 3).s, w(1, 0).s, 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.56 * H * dr, cx: 0.5 * W, bottom: 0.985 * H })
        : K.frameSub(E, v, { h: 0.9 * H * dr, cx: 0.5 * W, bottom: 0.975 * H });
      const fw = w(0, 3);
      F.back((c) => {
        K.groundC(F, c);
        const o = { ...K.COND, color: INK, align: "center", baseline: "alphabetic" };
        if (port) {
          o.size = K.fit(F, c, "FOUNDER!", { ...o, size: 400 * S }, R.w * 0.98);
          small(F, c, R.x + R.w * 0.02, F.PT + 70 * S, 92 * S);
          K.slamText(F, c, "FOUNDER!", W / 2, F.PT + 110 * S + o.size * K.CAP.cond, fw.s, o);
        } else {
          o.size = K.fit(F, c, "FOUNDER!", { ...o, size: 900 * S }, W * 0.96);
          K.slamText(F, c, "FOUNDER!", W / 2, 0.955 * H, fw.s, o);
          small(F, c, 0.035 * W, 0.33 * H, 128 * S);
        }
        K.shadow(c, W / 2, port ? 0.985 * H : 0.975 * H, port ? 0.3 * W : 0.2 * W, "light");
        K.fistBursts(F, c, v, lt, op, kL1, C.white);
        K.burnTag(F, c, fw, port ? R.x + R.w * 0.6 : 0.79 * W, port ? F.PT + 40 * S : 0.3 * H, { color: INK, unit: " TOKENS", size: 34 });
      });
      F.plate(v, op);
      K.punch(F, 0.03);
      function small(F, c, x, y, size) { // "I'M AN AI" — the line so far, small and tight
        F.E.drawText(c, "I'M AN AI", x, y, { ...K.HERO, size, color: INK, align: "left", baseline: "alphabetic" });
      }
    } });

    // ---------------------------------------------------------------------------------------- S2 GANG wall (tiers)
    S1.push({ a: w(1, 0).s, b: w(2, 0).s, look: "A", draw(F) {
      const { E, t, S, W, H, R, port } = F, gw = w(1, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.35 });
        K.wallTiers(F, c, gw.s, port ? { base: 250, rows: 16, speed: 520, bottom: 1.02, shrink: 0.88, fade: 0.05 } : { base: 330, rows: 10, speed: 640, bottom: 1.08 });
        K.gangReadout(F, c, gw);
      });
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S3 I CAN'T COME OUT TONIGHT.
    S1.push({ a: w(2, 0).s, b: w(2, 4).e, look: "C", clips: lin(cu, w(2, 0).s, 2.45), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(2, 0).s, w(2, 4).e, 0.04);
      const op = port
        ? K.frameSub(E, v, { h: 0.62 * H * dr, au: 0.66, av: 0.996, cx: 0.64 * W, bottom: 1.02 * H })
        : K.frameSub(E, v, { h: 1.04 * H * dr, au: 0.66, av: 0.996, cx: 0.78 * W, bottom: 1.04 * H });
      const ws = L[2].words;
      F.back((c) => {
        K.groundC(F, c);
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
        const x0 = port ? R.x + R.w * 0.03 : 0.045 * W;
        const sz = port ? [140, 96, 140] : [260, 140, 220];
        const y1 = port ? F.PT + 105 * S : 0.335 * H, y2 = port ? y1 + 112 * S : 0.47 * H, y3 = port ? y2 + 132 * S : 0.66 * H;
        // row 1: I CAN'T
        const iw = E.measure(c, "I ", { ...hero, size: sz[0] * S });
        K.slamText(F, c, "I", x0, y1, ws[0].s, { ...hero, size: sz[0] * S, color: INK });
        K.slamText(F, c, "CAN'T", x0 + iw, y1, ws[1].s, { ...hero, size: sz[0] * S, color: INK });
        // row 2: COME OUT
        const cw = E.measure(c, "COME ", { ...hero, size: sz[1] * S });
        K.slamText(F, c, "COME", x0, y2, ws[2].s, { ...hero, size: sz[1] * S, color: INK });
        K.slamText(F, c, "OUT", x0 + cw, y2, ws[3].s, { ...hero, size: sz[1] * S, color: INK });
        // row 3: TONIGHT. (accent)
        const ts = port ? K.fit(F, c, "TONIGHT.", { ...hero, size: sz[2] * S }, R.w * 0.95) : sz[2] * S;
        K.slamText(F, c, "TONIGHT.", x0, y3, ws[4].s, { ...hero, size: ts, color: C.white });
        K.burnTag(F, c, ws[1], port ? R.x + R.w * 0.6 : 0.55 * W, port ? F.PT + 20 * S : 0.25 * H, { color: INK, size: 30, unit: " TOKENS" });
        K.burnTag(F, c, ws[4], port ? R.x + R.w * 0.6 : 0.6 * W, port ? F.PT + 240 * S : 0.6 * H, { color: INK, size: 30, unit: " TOKENS" });
      });
      F.plate(v, op);
      // tracked chip on his open palm (pose 16 = his right wrist), over the cut-out from the 45.18 beat
      if (t >= 45.16) F.front((c) => {
        const p = K.lmScreen(E, v, lt, 16, op);
        const u = K.ease.outBack(clamp((t - 45.18) / 0.16));
        if (p) chip(F, c, p[0] + 20 * S, p[1] - (port ? 50 : 70) * S, "TONIGHT · BUSY", Math.max(0.92, u), u);
      });
      K.punch(F, 0.025);
    } });

    // ---------------------------------------------------------------------------------------- S4 HER note
    S1.push({ a: w(2, 4).e, b: w(3, 0).s, look: "A", clips: lin(herCu, w(2, 4).e, 0.3), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const push = 1 + 0.05 * ease.inCubic(clamp((t - 48.04) / 0.34));
      const op = port
        ? K.frameSub(E, v, { h: 0.62 * H * push, au: 0.3, av: 0.996, cx: 0.5 * W, bottom: 1.03 * H })
        : K.frameSub(E, v, { h: 1.06 * H * push, au: 0.3, av: 0.996, cx: 0.25 * W, bottom: 1.07 * H });
      const lay = noteLayout(F);
      F.back((c) => {
        K.groundA(F, c);
        hisLine(F, c, lay); // "I CAN'T COME OUT / TONIGHT." in his type, small, white
        const { y1, cantX0, cantX1, size } = lay;
        B.penUnderline(c, cantX0, y1 + size * 0.13, cantX1, t, 46.14, { width: 10 * S, seed: 4, dur: 0.14 });
        B.penUnderline(c, cantX0 + 10 * S, y1 + size * 0.25, cantX1 - 8 * S, t, 47.08, { width: 8 * S, seed: 7, dur: 0.14 });
        B.penNote(E, c, "of course you can't", lay.nx, lay.ny, t, 46.6, { size: lay.ns, cps: 26, rot: -0.04 });
        const k = K.slam(t, 47.56, { from: 1.25 });
        if (k) E.drawText(c, "HER WORDS COST 0 TOKENS", lay.nx + 6 * S, lay.ny + lay.ns * 0.8, { ...K.MONO, size: (port ? 22 : 30) * S, color: C.coral, align: "left", s: k.sc });
      });
      F.plate(v, op);
      E.post.punch = Math.max(E.post.punch, 0.018 * E.pulse("downbeats", t, 0.1));
    } });

    // ---------------------------------------------------------------------------------------- S5 LOCKUP #1 (he stands behind the banner)
    S1.push({ a: w(3, 0).s, b: w(4, 0).s, look: "A", clips: warped(chant, kL4), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const op = port
        ? K.frameSub(E, v, { h: 0.95 * H * drift(F, w(3, 0).s, w(4, 0).s), cx: 0.5 * W, ay: 0.19 * H, av: 0.104 })
        : K.frameSub(E, v, { h: 1.6 * H * drift(F, w(3, 0).s, w(4, 0).s), cx: 0.5 * W, ay: 0.05 * H, av: 0.104 });
      const cx = port ? R.x + R.w / 2 : W / 2, cy = port ? R.y + R.h * 0.72 : 0.7 * H;
      const size = port ? 74 : 160;
      F.back((c) => K.groundA(F, c, { offY: (t - 48.38) * 30 * S }));
      F.plate(v, op);
      F.front((c) => {
        K.lockup(F, c, L[3].words, cx, cy, { size, band: C.bg, bandPad: port ? 16 : 26, seed: 3 });
        // band runs to the bottom: he stands behind a dark board
        const bx = K.lockupBox(E, c, cx, cy, size);
        c.fillStyle = C.bg; c.fillRect(0, bx.bot + (port ? 16 : 26) * S, W, H);
        B.hairGrid(c, 0, bx.bot + (port ? 16 : 26) * S, W, H, { step: 96 * S, alpha: 0.35, offY: (t - 48.38) * 30 * S });
        K.fistBursts(F, c, v, lt, op, kL4, C.green);
      });
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S6 I'M AN AI FOUNDER! (outline → fill)
    S1.push({ a: w(4, 0).s, b: w(5, 0).s, look: "C", clips: warped(dance, kDance), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(4, 0).s, w(5, 0).s, 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.6 * H * dr, cx: 0.5 * W, bottom: 0.995 * H })
        : K.frameSub(E, v, { h: 0.93 * H * dr, cx: 0.2 * W, bottom: 0.985 * H });
      const ws = L[4].words;
      F.back((c) => {
        K.groundC(F, c);
        const o = { font: FONT.black, weight: 400, tracking: -0.02, baseline: "alphabetic", align: "left" };
        let x0, y1, y2, s1, s2;
        if (port) { x0 = R.x + R.w * 0.03; s1 = 120 * S; s2 = K.fit(F, c, "FOUNDER!", { ...o, size: 400 * S }, R.w * 0.95); y1 = F.PT + 110 * S; y2 = y1 + s2 * 0.95; }
        else { x0 = 0.37 * W; s1 = 230 * S; s2 = K.fit(F, c, "FOUNDER!", { ...o, size: 600 * S }, 0.6 * W); y1 = 0.36 * H; y2 = 0.78 * H; }
        const gap = E.measure(c, " ", { ...o, size: s1 });
        let x = x0;
        const parts = [["I'M", ws[0], s1, y1], ["AN", ws[1], s1, y1], ["AI", ws[2], s1, y1]];
        for (const [txt, wd, sz, y] of parts) {
          fillWord(F, c, txt, x, y, wd, { ...o, size: sz }, INK, txt === "I'M");
          x += E.measure(c, txt, { ...o, size: sz }) + gap;
        }
        fillWord(F, c, "FOUNDER!", x0, y2, ws[3], { ...o, size: s2 }, C.white, false);
        K.shadow(c, port ? 0.5 * W : 0.2 * W, port ? 0.995 * H : 0.985 * H, port ? 0.3 * W : 0.15 * W, "light");
        // finger-gun muzzle lines on the pops (pose 19/20 = index fingers)
        for (const kn of kDance) {
          if (t < kn[0] - 0.02 || t > kn[0] + 0.3) continue;
          for (const j of [19, 20]) {
            const p = K.lmScreen(E, v, lt, j, op);
            if (p) K.burst(c, p[0], p[1], t, kn[0], { color: C.white, lw: 4 * S, r0: 24 * S, r1: 110 * S, n: 7, a0: j === 20 ? 3.4 : -0.25, spread: 1.6, seed: j });
          }
        }
        K.burnTag(F, c, ws[0], port ? R.x + R.w * 0.6 : 0.37 * W, port ? F.PT + 10 * S : 0.17 * H, { color: INK, unit: " TOKENS", size: 30 });
        K.burnTag(F, c, ws[3], port ? R.x + R.w * 0.6 : 0.8 * W, port ? F.PT + 330 * S : 0.5 * H, { color: INK, unit: " TOKENS", size: 30 });
      });
      F.plate(v, op);
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S7 GANG wall (wave)
    S1.push({ a: w(5, 0).s, b: w(6, 0).s, look: "A", draw(F) {
      const { E, t, S, W, H, port } = F, gw = w(5, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.3 });
        K.wallWave(F, c, gw.s - 0.05, { cols: port ? 2 : 4, rows: port ? 11 : 7, base: 170, dur: 0.48 });
        K.gangReadout(F, c, gw);
      });
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S8 NO DATING TILL SERIES B.
    S1.push({ a: w(6, 0).s, b: w(7, 0).s, look: "C", draw(F) {
      const { E, t, S, W, H, R, port } = F, ws = L[6].words;
      F.back((c) => {
        K.groundC(F, c);
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
        const x0 = port ? R.x + R.w * 0.03 : 0.045 * W;
        const s1 = port ? K.fit(F, c, "NO DATING", { ...hero, size: 200 * S }, R.w * 0.96) : 270 * S;
        const s2 = port ? K.fit(F, c, "TILL SERIES B.", { ...hero, size: 140 * S }, R.w * 0.96) : 170 * S;
        const y1 = port ? F.PT + s1 * 0.78 : 0.34 * H, y2 = port ? y1 + s2 * 1.15 : 0.55 * H;
        const nw = E.measure(c, "NO ", { ...hero, size: s1 });
        K.slamText(F, c, "NO", x0, y1, ws[0].s, { ...hero, size: s1, color: INK });
        K.slamText(F, c, "DATING", x0 + nw, y1, ws[1].s, { ...hero, size: s1, color: INK });
        const tw = E.measure(c, "TILL ", { ...hero, size: s2 }), sw = E.measure(c, "SERIES ", { ...hero, size: s2 });
        K.slamText(F, c, "TILL", x0, y2, ws[2].s, { ...hero, size: s2, color: INK });
        K.slamText(F, c, "SERIES", x0 + tw, y2, ws[3].s, { ...hero, size: s2, color: C.white });
        K.slamText(F, c, "B.", x0 + tw + sw, y2, ws[4].s, { ...hero, size: s2, color: C.white });
        stageTrack(F, c, port ? R.y + R.h * 0.8 : 0.73 * H, x0, port ? R.x + R.w * 0.97 : 0.955 * W);
      });
      K.punch(F, 0.025);
    } });

    // ---------------------------------------------------------------------------------------- S9 LOCKUP #2 + "babe, you're pre-seed"
    S1.push({ a: w(7, 0).s, b: 56.2, look: "A", clips: lin(cu, w(7, 0).s, 0.55), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(7, 0).s, 56.12, 0.04);
      const op = port
        ? K.frameSub(E, v, { h: 0.66 * H * dr, au: 0.66, av: 0.996, cx: 0.68 * W, bottom: 1.02 * H })
        : K.frameSub(E, v, { h: 0.98 * H * dr, au: 0.66, av: 0.996, cx: 0.84 * W, bottom: 1.02 * H });
      const lx = port ? R.x + R.w / 2 : 0.31 * W, ly = port ? F.PT + 120 * S : 0.4 * H, size = port ? 72 : 132;
      F.back((c) => {
        K.groundA(F, c, { offX: -(t - 53.79) * 24 * S });
        K.lockup(F, c, L[7].words, lx, ly, { size, seed: 5 });
      });
      F.plate(v, op);
      F.front((c) => {
        const nx = port ? R.x + R.w * 0.03 : 0.07 * W, ny = port ? F.PT + 330 * S : 0.76 * H, ns = port ? 54 : 104;
        B.penNote(E, c, "babe, you're pre-seed", nx, ny, t, 53.85, { size: ns * S, cps: 30, rot: -0.035 });
        // arrow from the note to his face (nose, tracked)
        const face = K.lmScreen(E, v, lt, 0, op);
        const nw = E.measure(c, "babe, you're pre-seed", { font: FONT.serif, italic: true, weight: 400, size: ns * S });
        if (face) B.penArrow(c, port ? nx + nw * 0.5 : nx + nw + 20 * S, port ? ny + 40 * S : ny - 10 * S, face[0] - (port ? 110 : 150) * S, face[1] + (port ? 30 : 90) * S, t, 54.7, { width: 7 * S, seed: 9, bend: port ? -0.3 : 0.3, dur: 0.18 });
        const pw = E.measure(c, "pre-seed", { font: FONT.serif, italic: true, weight: 400, size: ns * S });
        B.penUnderline(c, nx + nw - pw, ny + ns * 0.42 * S, nx + nw, t, 55.18, { width: 6 * S, seed: 3, dur: 0.12 });
        B.penUnderline(c, nx + nw - pw + 10 * S, ny + ns * 0.55 * S, nx + nw - 6 * S, t, 55.3, { width: 5 * S, seed: 6, dur: 0.1 });
        B.stamp(E, c, "PRE-SEED", port ? R.x + R.w * 0.24 : 0.79 * W, port ? 0.58 * H : 0.86 * H, t, 55.66, { S, size: port ? 52 : 92, rot: -0.14 });
      });
      K.punch(F, 0.025);
    } });
    return S1;

    // ------------------------------------------------------------------------------------------------ helpers
    function chip(F, c, x, y, txt, sc, a) {
      const { E, S } = F, o = { ...K.MONO, size: 30 * S, align: "center" };
      const tw = E.measure(c, txt, o) + 44 * S, h = 62 * S;
      c.save(); c.globalAlpha = clamp(a * 3); c.translate(x, y); c.scale(sc, sc);
      c.fillStyle = C.bg; c.beginPath(); c.roundRect(-tw / 2, -h / 2, tw, h, h / 2); c.fill();
      c.fillStyle = C.coral; c.beginPath(); c.arc(-tw / 2 + 26 * S, 0, 7 * S, 0, 6.2832); c.fill();
      E.drawText(c, txt, 12 * S, 2 * S, { ...o, color: C.white });
      c.restore();
    }
    function noteLayout(F) {
      const { E, S, W, H, R, port } = F, size = (port ? 120 : 220) * S, size2 = (port ? 54 : 96) * S;
      const x0 = port ? R.x + R.w * 0.04 : 0.47 * W, y1 = port ? F.PT + 100 * S : 0.33 * H, y2 = y1 + (port ? 80 : 168) * S;
      const cv = K.mctx();
      const hero = { ...K.HERO, size, baseline: "alphabetic", align: "left" };
      const iw = E.measure(cv, "I ", hero), cw = E.measure(cv, "CAN'T", hero);
      const ns = (port ? 80 : 132) * S, nx = x0, ny = port ? y2 + 130 * S : 0.69 * H;
      return { x0, y1, y2, size, size2, cantX0: x0 + iw, cantX1: x0 + iw + cw, ns, nx, ny };
    }
    function hisLine(F, c, lay) {
      const { E } = F, hero = { ...K.HERO, size: lay.size, baseline: "alphabetic", align: "left" };
      E.drawText(c, "I CAN'T", lay.x0, lay.y1, { ...hero, color: C.white });
      const h2 = { ...hero, size: lay.size2 }, cw = E.measure(c, "COME OUT ", h2);
      E.drawText(c, "COME OUT", lay.x0, lay.y2, { ...h2, color: C.white });
      E.drawText(c, "TONIGHT.", lay.x0 + cw, lay.y2, { ...h2, color: C.green });
    }
    // funding-stage track: PRE-SEED → SEED → SERIES A → SERIES B (dating unlocks there)
    function stageTrack(F, c, y, x0, x1) {
      const { E, t, port } = F, ws = L[6].words, S = F.S * (port ? 0.8 : 1.35);
      const st = ["PRE-SEED", "SEED", "SERIES A", "SERIES B"], n = st.length;
      const draw = clamp((t - ws[0].s) / 0.4); // linear rule draw-on
      c.fillStyle = INK; c.fillRect(x0, y - 3 * S, (x1 - x0) * draw, 6 * S);
      const lab = { ...K.MONO, size: 30 * S, color: INK, align: "center" };
      const xs = (i) => lerp(x0 + 230 * S, x1 - 70 * S, i / (n - 1));
      for (let i = 0; i < n; i++) {
        const x = xs(i), on = draw >= i / (n - 1) - 0.01;
        if (!on) continue;
        const last = i === n - 1, lit = last && t >= ws[3].s;
        c.fillStyle = lit ? C.white : INK; c.beginPath(); c.arc(x, y, (last ? 22 : 14) * S, 0, 6.2832); c.fill();
        if (lit) { c.strokeStyle = INK; c.lineWidth = 5 * S; c.stroke(); }
        E.drawText(c, st[i], x, y + 52 * S, { ...lab, color: lit ? C.white : INK });
        // DATING row: ✕ above the first three (on the 52.80 beat), padlock at SERIES B (opens on 53.28)
        const rowY = y - 76 * S;
        if (!last && t >= 52.8) { const u = clamp((t - 52.8 - i * 0.04) / 0.08); if (u > 0) cross(c, x, rowY, 17 * S * Math.max(0.92, u), 7 * S); }
        if (last && t >= ws[1].s) padlock(c, x, rowY - 4 * S, t >= 53.28, S);
      }
      if (t >= ws[1].s) {
        const k = K.slam(t, ws[1].s, { from: 1.2 });
        E.drawText(c, "DATING", x0, y - 76 * S, { ...lab, align: "left", size: 34 * S, s: k ? k.sc : 1 });
      }
      // his marker under PRE-SEED
      if (draw > 0.02) {
        const x = xs(0);
        c.fillStyle = INK; c.beginPath(); c.moveTo(x - 12 * S, y + 108 * S); c.lineTo(x + 12 * S, y + 108 * S); c.lineTo(x, y + 90 * S); c.fill();
        E.drawText(c, "YOU", x, y + 132 * S, { ...lab, size: 26 * S });
      }
    }
    function cross(c, x, y, r, lw) {
      c.save(); c.strokeStyle = INK; c.lineWidth = lw; c.lineCap = "round"; c.beginPath();
      c.moveTo(x - r, y - r); c.lineTo(x + r, y + r); c.moveTo(x + r, y - r); c.lineTo(x - r, y + r); c.stroke(); c.restore();
    }
    function padlock(c, x, y, open, S) {
      const w = 46 * S, h = 36 * S;
      c.save(); c.fillStyle = INK; c.strokeStyle = INK; c.lineWidth = 7 * S;
      c.beginPath(); c.roundRect(x - w / 2, y - h / 2 + 8 * S, w, h, 6 * S); c.fill();
      c.beginPath();
      const lift = open ? 16 * S : 0;
      c.arc(x, y - 6 * S - lift, 15 * S, Math.PI, open ? Math.PI * 1.9 : 0); if (!open) c.lineTo(x + 15 * S, y + 6 * S);
      c.moveTo(x - 15 * S, y - 6 * S - lift); c.lineTo(x - 15 * S, y + 6 * S);
      c.stroke(); c.restore();
    }
    // outline word that fills solid on its onset; `meter`: fills bottom→top over the held word (linear, like a meter)
    function fillWord(F, c, txt, x, y, wd, o, col, meter) {
      const { E, t, S } = F, size = o.size, capH = size * K.CAP.black;
      E.drawText(c, txt, x, y, { ...o, color: INK, strokeOnly: true, stroke: Math.max(1.5, 4 * S), strokeColor: INK, alpha: 0.8 });
      if (t < wd.s - 0.05) return;
      const k = K.slam(t, wd.s, { from: 1.12 });
      const u = meter ? clamp((t - wd.s + 0.05) / Math.max(0.1, wd.e - wd.s)) : 1;
      c.save();
      if (meter) { c.beginPath(); c.rect(x - 10 * S, y + size * 0.05 - (capH + size * 0.1) * u, E.measure(c, txt, o) + 20 * S, (capH + size * 0.1) * u + 4 * S); c.clip(); }
      const wdt = E.measure(c, txt, o), cx = x + wdt / 2, cy = y - capH / 2;
      c.translate(cx, cy); c.scale(k.sc, k.sc); c.translate(-cx, -cy);
      E.drawText(c, txt, x, y, { ...o, color: col, alpha: k.a });
      c.restore();
    }
  },
});
