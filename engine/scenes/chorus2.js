// CHORUS 2 · 86.96-100.38 · HOOK_02 · owner A3 · looks A ↔ C per sung line (flipped against chorus 1: A on odd lines)
// Escalation over chorus 1: HER is in the footage now, mocking him (her_mock_chant fist pump on the first gang chant, the
// eye-roll, the side-eye smirk, the sip under his gate), her red pen gets ruder (air-quotes around his FOUNDER!, a strike instead
// of an underline, LEFT ON READ), every line gets a new treatment, and the meter reads visibly lower (his badge's pixel balance).
// Beats 87.06D 87.54 88.02 88.50 | 88.96D 89.44 89.92 90.40 | 90.88D 91.36 91.82 92.30 | 92.78D 93.26 93.72 94.20 |
//       94.68D 95.16 95.64 96.10 | 96.58D 97.06 97.54 98.02 | 98.48D 98.96 99.44 99.90 | 100.38D (bridge)
// Layers: BACK/MID = 2D surface #1 under the cut-out, FRONT = surface #2 over it (only when needed).
//
// PLAN  t        word / event                    visual                                                         layer        cut / beat
//  S1   86.960   (hard cut in)                   A · him_chant chest-up right, pumps beat-locked (clip 1.96→3.75)  plate        first frame = slam + punch
//       87.013   I'm · 87.200 an · 87.300 AI     "I'M AN AI" white, words slam on onsets (left column)            MID
//       87.06D / 87.54                           pump peaks → green impact lines on both fists                   MID
//       87.600   founder!                        "FOUNDER!" giant condensed green · burn tag                     MID
//       88.020   beat                            HER red pen: coral air-quotes slam around “FOUNDER!”             FRONT
//  S2   88.420   Founder! (GANG)                 C · HER mock fist pump (her_mock_chant 1.6→2.6, pump on 88.50) in  MID / plate  cut on word
//                                                front of a stadium of ink FOUNDER! tiers · GANG CHANT −8,663 TOKENS
//  S3   88.940   I                               A · AUTO-REPLY card (RE: tonight?) + him_dance chest-up, smug guns MID         cut on word ≈ 88.96D
//       89.200   can't                           hero CAN'T                                                      MID
//       89.440   beat                            finger-gun pop · footer types "— sent from my Mac mini"          MID
//       89.580   come · 89.720 out · 90.0 tonight.  words slam into the card                                       MID
//  S4   90.400   (HER note, unsung)              A · her_unimpressed full body (eye-roll → sip, clip 0.30→2.60)   plate        cut on the beat
//       90.400   beat                            coral STRIKE through CAN'T                                      MID
//       90.880   downbeat                        note "of course you can't" writes under the card                 MID
//       91.360   beat                            coral circle around "Mac mini"                                  MID
//       91.820   beat                            "SEEN ✓✓" receipt (coral mono)                                  MID
//       92.300   beat                            coral LEFT ON READ stamp on the card · push-in, she sips          MID / post
//  S5   92.697   See · 92.740 you                C · LOCKUP #3 on a tilted dark banner slapped across the green;   FRONT band   cut on word
//       93.020   after · 93.380 tokens!          her_cu_talk knowing smirk + side-eye at it (clip 4.55→5.77)
//       92.78D / 93.26 / 93.72                   punch · banner settle wobble · crosshair flash
//  S6   93.920   (after "tokens!")               A · push-in: his tracked lanyard badge (him_chant, pose 11/12/23/24)  plate→card  lands on 94.20
//                                                grows into a full-frame usage card (area grows linearly: no flash)
//       94.220   I'm (held)                      "I'M" slams on the card                                          MID
//       94.820   an · 94.940 AI · 95.220 founder!  words land; FOUNDER! on a green highlighter bar                MID
//       94.68D / 95.16 / 95.64                   the badge header band flips on each beat; pixel balance drains   MID
//  S7   96.020   Founder! (GANG)                 C · a stadium of 15 tiled hims (him_chant, pump on 96.10) behind  plate / MID  cut on word
//                                                LED ribbon boards scrolling FOUNDER! · GANG CHANT readout
//  S8   96.560   No · 96.840 dating              A · entitlement gate: DATING feature card, padlock, toggle OFF;   MID / plate  cut on word ≈ 96.58D
//                                                her_unimpressed sips beside it (clip 2.55→4.0)
//       97.060   beat                            toggle tries ON, snaps back OFF (denied shake)                   MID
//       97.140   till · 97.320 Series · 97.600 B.  "TILL SERIES B." · LOCKED · requires plan: SERIES B            MID
//       97.540   beat                            can(him, "dating") → false                                       MID
//  S9   98.020   See / you / after / tokens!     C · LOCKUP #4 in a tall dark band; him_dance in front, right       MID / plate  cut on the 98.02 beat
//       98.080   (HER note, unsung)              "babe, you're pre-seed" writes inside the band (coral on dark)    MID
//       98.48D / 99.44                           finger-gun pops + muzzle lines (pose 19/20)                      MID
//       98.960   beat                            double underline under "pre-seed" · 99.44 arrow to his face        MID / FRONT
//       99.900   beat                            crosshair flash around the lockup + punch                       MID / post
import * as K from "./chorus1/kit.js";
const { B, C, FONT, clamp, lerp, ease } = K;
const INK = C.ink;
let GREEN = null; // THREE.Color of the signal green for GL clears (set in shots())

export default K.makeScene({
  clips: ["him_chant", "her_mock_chant", "him_dance", "her_unimpressed", "her_cu_talk"],
  shots(E, V) {
    const L = E.section("chorus2"), w = (li, wi) => L[li].words[wi];
    GREEN = new E.THREE.Color(C.green);
    const chant = V.him_chant, mock = V.her_mock_chant ?? V.her_unimpressed, dance = V.him_dance ?? V.him_chant;
    const unimp = V.her_unimpressed, herCu = V.her_cu_talk;
    const lin = (v, t0, c0) => (F) => [[v, K.inClip(v, c0 + (F.t - t0))]];
    const warped = (v, kn) => (F) => [[v, K.inClip(v, K.warp(kn, F.t))]];
    const drift = (F, a, b, amt) => K.creep(F.t, a, b, amt);
    const kHim1 = K.pumpKnots(E, chant, 87.06, 88.5, 2); // pumps 1.958 / 2.583 / 3.125 / 3.75 on 87.06 … 88.50 (can-free span)
    const kHer2 = K.pumpKnots(E, mock, 88.5, 89.0, 2); // her pump 2.125 on 88.50
    const kGun3 = V.him_dance ? [[89.44, 1.958], [90.4, 3.0]] : K.pumpKnots(E, dance, 89.44, 90.4, 2);
    const kGun9 = V.him_dance ? [[98.48, 1.0], [99.44, 1.958], [100.4, 3.0]] : K.pumpKnots(E, dance, 98.48, 100.4, 1);
    const kCrowd = K.pumpKnots(E, chant, 96.1, 96.6, 2);
    const SH = [];

    // ---------------------------------------------------------------------------------------- S1 I'M AN AI “FOUNDER!”
    SH.push({ a: 86.96, b: w(1, 0).s, look: "A", clips: warped(chant, kHim1), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, 86.96, 88.42, 0.04);
      const op = port
        ? K.frameSub(E, v, { h: 0.95 * H * dr, cx: 0.5 * W, ay: 0.4 * H, av: 0.104 })
        : K.frameSub(E, v, { h: 1.36 * H * dr, cx: 0.81 * W, ay: 0.08 * H, av: 0.104 });
      const ws = L[0].words, lay = s1Layout(F);
      F.back((c) => {
        K.groundA(F, c);
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left", size: lay.s1, color: C.white };
        let x = lay.x0;
        for (let i = 0; i < 3; i++) {
          const txt = ["I'M", "AN", "AI"][i];
          K.slamText(F, c, txt, x, lay.y1, ws[i].s, hero);
          x += E.measure(c, txt + " ", hero);
        }
        K.slamText(F, c, "FOUNDER!", lay.x0, lay.y2, ws[3].s, { ...K.COND, size: lay.s2, color: C.green, baseline: "alphabetic", align: "left" });
        K.fistBursts(F, c, v, lt, op, kHim1, C.green);
        K.burnTag(F, c, ws[3], lay.x0 + lay.fw * 0.62, lay.y2 - lay.s2 * 0.8, { color: C.green, unit: " TOKENS", size: 30 });
      });
      F.plate(v, op);
      if (t < 87.1) E.post.punch = Math.max(E.post.punch, 0.04 * Math.exp(-(t - 86.96) / 0.1)); // the cut-in slam
      // her air-quotes around FOUNDER! (over the cut-out: the closing quote overlaps his arm)
      if (t >= 87.98) F.front((c) => {
        const k = K.slam(t, 88.02, { from: 1.5 });
        if (k) {
          const q = { font: FONT.serif, italic: true, weight: 400, size: lay.s2 * 0.9, color: C.coral, baseline: "alphabetic" };
          const capTop = lay.y2 - lay.s2 * K.CAP.cond;
          E.drawText(c, "“", lay.x0 - lay.s2 * 0.08, capTop + lay.s2 * 0.5, { ...q, align: "right", s: k.sc, rot: -0.08 });
          E.drawText(c, "”", lay.x0 + lay.fw + lay.s2 * 0.02, capTop + lay.s2 * 0.5, { ...q, align: "left", s: k.sc, rot: 0.06 });
        }
      });
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S2 GANG: she mock-chants in his stadium
    SH.push({ a: w(1, 0).s, b: w(2, 0).s, look: "C", clips: warped(mock, kHer2), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0], gw = w(1, 0);
      const op = port
        ? K.frameSub(E, v, { h: 0.56 * H, cx: 0.5 * W, bottom: 1.0 * H })
        : K.frameSub(E, v, { h: 0.95 * H, cx: 0.5 * W, bottom: 0.985 * H });
      F.back((c) => {
        K.groundC(F, c);
        K.wallTiers(F, c, gw.s, port ? { base: 240, rows: 16, speed: 560, bottom: 1.02, shrink: 0.88, fade: 0.05, ink: INK, acc: C.white }
          : { base: 300, rows: 10, speed: 700, bottom: 1.06, ink: INK, acc: C.white, fade: 0.07 });
        K.shadow(c, W / 2, port ? H : 0.985 * H, port ? 0.3 * W : 0.16 * W, "light");
        K.fistBursts(F, c, v, lt, op, kHer2, C.coral, [16]);
        K.gangReadout(F, c, gw, port ? { y: F.PT + 40 * S, size: 30 } : { x: 0.24 * W, y: 0.24 * H, size: 40, rot: -0.04 });
      });
      F.plate(v, op);
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S3 AUTO-REPLY card
    SH.push({ a: w(2, 0).s, b: 90.4, look: "A", clips: warped(dance, kGun3), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(2, 0).s, 90.4, 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.8 * H * dr, cx: 0.55 * W, ay: 0.475 * H, av: 0.015 })
        : K.frameSub(E, v, { h: 1.75 * H * dr, cx: 0.78 * W, ay: 0.08 * H, av: 0.015 });
      const card = port ? { x: R.x + R.w * 0.03, y: F.PT - 10 * S, k: 0.7 } : { x: 0.05 * W, y: 0.17 * H, k: 0.92 };
      F.back((c) => {
        K.groundA(F, c, { offX: (t - 88.94) * 20 * S });
        autoReply(F, c, card, true);
        gunPops(F, c, v, lt, op, kGun3, C.green);
      });
      F.plate(v, op);
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S4 HER note: strike, "of course you can't", SEEN
    SH.push({ a: 90.4, b: w(3, 0).s, look: "A", clips: lin(unimp, 90.4, 0.3), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const push = 1 + 0.05 * ease.inCubic(clamp((t - 92.3) / 0.4));
      const op = port
        ? K.frameSub(E, v, { h: 0.47 * H * push, cx: 0.5 * W, bottom: 1.0 * H })
        : K.frameSub(E, v, { h: 0.93 * H * push, cx: 0.2 * W, bottom: 0.98 * H });
      const card = port ? { x: R.x + R.w * 0.12, y: F.PT - 20 * S, k: 0.66 } : { x: 0.4 * W, y: 0.07 * H, k: 0.84 };
      let pos = null;
      F.back((c) => {
        K.groundA(F, c, { offX: (t - 88.94) * 20 * S });
        pos = autoReply(F, c, card, false);
        K.shadow(c, port ? 0.5 * W : 0.2 * W, port ? H : 0.98 * H, port ? 0.26 * W : 0.14 * W);
        B.penStrike(c, pos.cant[0], pos.cant[1], pos.cant[2], t, 90.4, { width: 12 * S * card.k * 1.6, seed: 5, dur: 0.12 });
        const nx = port ? R.x + R.w * 0.08 : 0.43 * W, ny = port ? F.PT + 500 * S : 0.84 * H;
        B.penNote(E, c, "of course you can't", nx, ny, t, 90.88, { size: (port ? 64 : 120) * S, cps: 28, rot: -0.04 });
        B.penCircle(c, pos.mac[0], pos.mac[1], pos.mac[2], pos.mac[3], t, 91.36, { width: 5 * S, seed: 3, dur: 0.22 });
        const k = K.slam(t, 91.82, { from: 1.3 });
        if (k) seen(F, c, pos.seen[0], pos.seen[1], k.sc, card.k);
        B.stamp(E, c, "LEFT ON READ", pos.read[0], pos.read[1], t, 92.3, { S, size: 52 * card.k * 1.25, rot: -0.13 });
      });
      F.plate(v, op);
      E.post.punch = Math.max(E.post.punch, 0.018 * E.pulse("downbeats", t, 0.1));
    } });

    // ---------------------------------------------------------------------------------------- S5 LOCKUP #3 on a tilted banner, she side-eyes it
    SH.push({ a: w(3, 0).s, b: 93.92, look: "C", clips: lin(herCu, w(3, 0).s, 4.55), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(3, 0).s, 93.92, 0.04);
      const op = port
        ? K.frameSub(E, v, { h: 0.6 * H * dr, au: 0.3, av: 0.996, cx: 0.62 * W, bottom: 1.0 * H })
        : K.frameSub(E, v, { h: 1.0 * H * dr, au: 0.3, av: 0.996, cx: 0.19 * W, bottom: 1.04 * H });
      const settle = 1 - Math.exp(-Math.max(0, t - 93.26) / 0.06) * (t >= 93.26 ? 1 : 0);
      const rot = -0.06 + 0.012 * (t >= 93.26 ? Math.exp(-(t - 93.26) / 0.12) * Math.sin((t - 93.26) * 40) : 0);
      const lx = port ? R.x + R.w * 0.5 : 0.6 * W, ly = port ? F.PT + 170 * S : 0.69 * H;
      F.back((c) => K.groundC(F, c));
      F.plate(v, op);
      F.front((c) => {
        K.lockup(F, c, L[3].words, lx, ly, { size: port ? 70 : 140, rot, band: C.bg, bandPad: port ? 22 : 34, seed: 7 });
        if (t >= 93.72 && t < 93.9) { const bx = K.lockupBox(E, c, lx, ly, port ? 70 : 140); B.crosshairs(c, bx.x - 60 * S, bx.y - 50 * S, bx.w + 120 * S, bx.h + 100 * S, { color: C.white, len: 50 * S, inset: 12 * S, cross: 10 * S, lw: 2 * S }); }
        void settle;
      });
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S6 badge whip-zoom → usage card
    SH.push({ a: 93.92, b: w(5, 0).s, look: "A", clips: lin(chant, 93.92, 2.3), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const z = Math.sqrt(clamp((t - 93.92) / 0.29)); // card area grows linearly: luminance ramps, never flashes
      // final card rect
      const cw = port ? R.w * 0.98 : 0.78 * W, ch = port ? R.h * 0.86 : 0.84 * H;
      const cx1 = port ? R.x + R.w / 2 : W / 2, cy1 = port ? R.y + R.h * 0.53 : 0.53 * H;
      const op0 = port ? K.frameSub(E, v, { h: 0.95 * H, cx: 0.5 * W, ay: 0.36 * H, av: 0.104 }) : K.frameSub(E, v, { h: 1.5 * H, cx: 0.5 * W, ay: 0.06 * H, av: 0.104 });
      const bu = K.badgeUV(v, lt) ?? { c: [0.7735, 0.4385], h: 0.069 };
      const b0 = E.plateToScreen(E, v, bu.c, op0);
      const bh0 = E.plateToScreen(E, v, [bu.c[0], bu.c[1] + bu.h / 2], op0)[1] - E.plateToScreen(E, v, [bu.c[0], bu.c[1] - bu.h / 2], op0)[1];
      const bw0 = bh0 * 0.56;
      // camera: zoom the plate around the badge while the card grows from the badge rect to the full card
      const zs = 1 + 1.6 * z * z; // a mild push: the card grows over him (no hoodie-filled frames, so no luminance flash)
      const op = { ...op0, zoom: op0.zoom * zs, x: op0.x + ((W / 2 + op0.x * S - b0[0]) * (zs - 1)) / S, y: op0.y + ((H / 2 + op0.y * S - b0[1]) * (zs - 1)) / S };
      const ccx = lerp(b0[0], cx1, z), ccy = lerp(b0[1], cy1, z), cww = lerp(bw0, cw, z), chh = lerp(bh0, ch, z);
      if (z < 0.98) {
        F.back((c) => K.groundA(F, c, { gridA: 0.4 }));
        F.plate(v, op);
        F.front((c) => badgeCard(F, c, ccx, ccy, cww, chh, z));
      } else F.back((c) => { K.groundA(F, c, { gridA: 0.4 }); badgeCard(F, c, ccx, ccy, cww, chh, z); });
      K.punch(F, 0.03);
      if (t < 94.21) E.post.punch = Math.max(E.post.punch, 0.02 * z);
    } });

    // ---------------------------------------------------------------------------------------- S7 GANG: a stadium of hims
    // Ground by GL clear, back row of cut-outs, LED ribbon board (2D #1), front row, ribbon board + readout (2D #2).
    SH.push({ a: w(5, 0).s, b: w(6, 0).s, look: "C", clips: warped(chant, kCrowd), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0], gw = w(5, 0);
      const jump = (t >= 96.1 ? Math.exp(-(t - 96.1) / 0.09) : 0) * 16 * S;
      const rows = port
        ? [{ n: 4, h: 0.2, y: 0.5, band: [0.42, 0.5] }, { n: 3, h: 0.33, y: 0.86, band: [0.75, 0.86] }]
        : [{ n: 9, h: 0.36, y: 0.6, band: [0.47, 0.6] }, { n: 6, h: 0.62, y: 1.08, band: [0.84, 1.0] }];
      E.renderer.setClearColor(GREEN, 1); E.renderer.clear(true, false, false); E.renderer.setClearColor(0x000000, 1);
      rows.forEach((T, ri) => {
        for (let i = 0; i < T.n; i++) {
          const x = ((i + 0.5 + (ri ? 0 : 0.0)) / T.n) * W;
          F.plate(v, K.frameSub(E, v, { h: T.h * H, cx: x, bottom: T.y * H - jump * (ri ? 1.3 : 1) }));
        }
        (ri ? F.front : F.back)((c) => {
          board(F, c, T.band[0] * H, T.band[1] * H, gw.s, ri);
          if (ri) K.gangReadout(F, c, gw, port ? { y: F.PT + 40 * S, size: 30 } : { y: 0.1 * H, size: 40, bg: C.bg });
        });
      });
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S8 NO DATING TILL SERIES B. (entitlement gate)
    SH.push({ a: w(6, 0).s, b: w(7, 0).s, look: "A", clips: lin(unimp, w(6, 0).s, 2.55), draw(F) {
      const { E, t, S, W, H, R, port } = F, ws = L[6].words, [v, lt] = F.cl[0];
      const op = port
        ? K.frameSub(E, v, { h: 0.5 * H * drift(F, 96.56, 98.02, 0.03), cx: 0.74 * W, bottom: 1.0 * H })
        : K.frameSub(E, v, { h: 0.9 * H * drift(F, 96.56, 98.02, 0.03), cx: 0.84 * W, bottom: 0.98 * H });
      F.back((c) => {
        K.groundA(F, c);
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
        const x0 = port ? R.x + R.w * 0.03 : 0.05 * W;
        const s1 = port ? K.fit(F, c, "NO DATING", { ...hero, size: 200 * S }, R.w * 0.96) : K.fit(F, c, "NO DATING", { ...hero, size: 260 * S }, 0.64 * W);
        const s2 = port ? K.fit(F, c, "TILL SERIES B.", { ...hero, size: 140 * S }, R.w * 0.96) : 140 * S;
        const y1 = port ? F.PT + s1 * 0.78 : 0.36 * H, y2 = port ? y1 + s2 * 1.12 : 0.52 * H;
        K.slamText(F, c, "NO", x0, y1, ws[0].s, { ...hero, size: s1, color: C.white });
        K.slamText(F, c, "DATING", x0 + E.measure(c, "NO ", { ...hero, size: s1 }), y1, ws[1].s, { ...hero, size: s1, color: C.white });
        const tw = E.measure(c, "TILL ", { ...hero, size: s2 }), sw = E.measure(c, "SERIES ", { ...hero, size: s2 });
        K.slamText(F, c, "TILL", x0, y2, ws[2].s, { ...hero, size: s2, color: C.white });
        K.slamText(F, c, "SERIES", x0 + tw, y2, ws[3].s, { ...hero, size: s2, color: C.green });
        K.slamText(F, c, "B.", x0 + tw + sw, y2, ws[4].s, { ...hero, size: s2, color: C.green });
        gate(F, c, port ? { x: R.x + R.w * 0.02, y: F.PT + 330 * S, w: R.w * 0.96, k: 0.62 } : { x: 0.05 * W, y: 0.62 * H, w: 0.62 * W, k: 1 });
        K.shadow(c, port ? 0.74 * W : 0.84 * W, port ? H : 0.98 * H, port ? 0.24 * W : 0.13 * W);
      });
      F.plate(v, op);
      K.punch(F, 0.025);
    } });

    // ---------------------------------------------------------------------------------------- S9 LOCKUP #4 in a tall band + "babe, you're pre-seed"
    SH.push({ a: w(7, 0).s, b: 100.45, look: "C", clips: warped(dance, kGun9), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, w(7, 0).s, 100.38, 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.43 * H * dr, cx: 0.62 * W, bottom: 0.94 * H })
        : K.frameSub(E, v, { h: 0.95 * H * dr, cx: 0.8 * W, bottom: 0.99 * H });
      const lx = port ? R.x + R.w / 2 : 0.38 * W, ly = port ? F.PT + 110 * S : 0.36 * H, size = port ? 70 : 128;
      const band = port ? [F.PT - 30 * S, F.PT + 480 * S] : [0.12 * H, 0.84 * H];
      const nx = port ? R.x + R.w * 0.04 : 0.08 * W, ny = port ? F.PT + 300 * S : 0.66 * H, ns = (port ? 60 : 118) * S;
      const nf = { font: FONT.serif, italic: true, weight: 400, size: ns }, mc = K.mctx();
      const nw = E.measure(mc, "babe, you're pre-seed", nf), pw = E.measure(mc, "pre-seed", nf);
      F.back((c) => {
        K.groundC(F, c);
        c.fillStyle = C.bg; c.fillRect(0, band[0], W, band[1] - band[0]);
        B.hairGrid(c, 0, band[0], W, band[1] - band[0], { step: 96 * S, alpha: 0.5, offX: -(t - 98.02) * 30 * S });
        K.lockup(F, c, L[7].words, lx, ly, { size, seed: 11 });
        if (t >= 99.9 && t < 100.08) { const bx = K.lockupBox(E, c, lx, ly, size); B.crosshairs(c, bx.x - 70 * S, bx.y - 60 * S, bx.w + 140 * S, bx.h + 120 * S, { color: C.white, len: 56 * S, inset: 12 * S, cross: 12 * S, lw: 3 * S }); }
        K.shadow(c, port ? 0.66 * W : 0.8 * W, port ? H : 0.99 * H, port ? 0.24 * W : 0.14 * W, "light");
        B.penNote(E, c, "babe, you're pre-seed", nx, ny, t, 98.08, { size: ns, cps: 30, rot: -0.03 });
        B.penUnderline(c, nx + nw - pw, ny + ns * 0.42, nx + nw, t, 98.96, { width: 7 * S, seed: 2, dur: 0.12 });
        B.penUnderline(c, nx + nw - pw + 8 * S, ny + ns * 0.56, nx + nw - 6 * S, t, 99.06, { width: 6 * S, seed: 8, dur: 0.1 });
        gunPops(F, c, v, lt, op, kGun9, C.white);
      });
      F.plate(v, op);
      // the arrow ends at his face: over the cut-out
      if (t >= 99.42) F.front((c) => {
        const face = K.lmScreen(E, v, lt, 0, op);
        if (face && !port) B.penArrow(c, nx + nw + 24 * S, ny - 20 * S, face[0] - 90 * S, face[1] + 40 * S, t, 99.44, { width: 7 * S, seed: 4, bend: 0.25, dur: 0.18 });
        if (face && port) B.penArrow(c, nx + nw * 0.6, ny + 40 * S, face[0] - 60 * S, face[1] - 30 * S, t, 99.44, { width: 6 * S, seed: 4, bend: -0.2, dur: 0.18 });
      });
      K.punch(F, 0.03);
    } });
    return SH;

    // ------------------------------------------------------------------------------------------------ helpers
    function s1Layout(F) {
      const { E, S, W, H, R, port } = F, c = K.mctx();
      const x0 = port ? R.x + R.w * 0.1 : 0.07 * W;
      const s1 = (port ? 100 : 196) * S;
      const s2 = port ? K.fit(F, c, "FOUNDER!", { ...K.COND, size: 400 * S }, R.w * 0.78) : K.fit(F, c, "FOUNDER!", { ...K.COND, size: 700 * S }, 0.5 * W);
      const y1 = port ? F.PT + 95 * S : 0.4 * H, y2 = port ? y1 + 40 * S + s2 * K.CAP.cond : 0.84 * H;
      return { x0, s1, s2, y1, y2, fw: E.measure(c, "FOUNDER!", { ...K.COND, size: s2 }) };
    }
    function gunPops(F, c, v, lt, op, kn, col) {
      const { E, t, S } = F;
      for (const k of kn) {
        if (t < k[0] - 0.02 || t > k[0] + 0.3) continue;
        for (const j of [19, 20]) {
          const p = K.lmScreen(E, v, lt, j, op);
          if (p) K.burst(c, p[0], p[1], t, k[0], { color: col, lw: 4 * S, r0: 24 * S * Math.min(1.5, op.zoom), r1: 110 * S * Math.min(1.5, op.zoom), n: 7, a0: j === 20 ? 3.4 : -0.25, spread: 1.6, seed: j });
        }
      }
    }
    // AUTO-REPLY card. o: {x, y, k}. live: words slam on their onsets (else all shown). Returns pen anchor points.
    function autoReply(F, c, o, live) {
      const { E, t, S } = F, k = o.k * S, ws = L[2].words;
      const cw = 1000 * k, ch = 690 * k, x = o.x, y = o.y;
      c.save();
      c.fillStyle = C.panel; c.strokeStyle = C.line; c.lineWidth = Math.max(1, 2 * S);
      c.beginPath(); c.roundRect(x, y, cw, ch, 30 * k); c.fill(); c.stroke();
      c.fillStyle = C.green; c.beginPath(); c.arc(x + 52 * k, y + 64 * k, 9 * k, 0, 6.2832); c.fill();
      E.drawText(c, "AUTO-REPLY", x + 76 * k, y + 66 * k, { ...K.MONO, size: 28 * k, color: C.white, align: "left" });
      E.drawText(c, "RE: tonight?", x + cw - 46 * k, y + 66 * k, { ...K.MONO, weight: 500, size: 26 * k, color: C.grey, align: "right", tracking: 0.02 });
      c.fillStyle = C.line; c.fillRect(x + 40 * k, y + 108 * k, cw - 80 * k, Math.max(1, 2 * S));
      const hero = { ...K.HERO, baseline: "alphabetic", align: "left" }, x0 = x + 46 * k;
      const r1 = y + 300 * k, r2 = y + 430 * k, r3 = y + 580 * k;
      const iw = E.measure(c, "I ", { ...hero, size: 200 * k }), cwid = E.measure(c, "CAN'T", { ...hero, size: 200 * k });
      const word = (txt, xx, yy, wi, size, col) => live ? K.slamText(F, c, txt, xx, yy, ws[wi].s, { ...hero, size, color: col }) : E.drawText(c, txt, xx, yy, { ...hero, size, color: col });
      word("I", x0, r1, 0, 200 * k, C.white);
      word("CAN'T", x0 + iw, r1, 1, 200 * k, C.white);
      const cmw = E.measure(c, "COME ", { ...hero, size: 116 * k });
      word("COME", x0, r2, 2, 116 * k, C.white);
      word("OUT", x0 + cmw, r2, 3, 116 * k, C.white);
      word("TONIGHT.", x0, r3, 4, 160 * k, C.green);
      // footer types on at 89.44
      const foot = "— sent from my Mac mini", n = live ? Math.floor(clamp((t - 89.44) / 0.4) * foot.length) : foot.length;
      const fo = { ...K.MONO, weight: 500, size: 28 * k, color: C.grey, align: "left", tracking: 0.02 };
      if (n > 0) E.drawText(c, foot.slice(0, n), x0, y + ch - 44 * k, fo);
      const pre = E.measure(c, "— sent from my ", fo), mw = E.measure(c, "Mac mini", fo);
      c.restore();
      return { cant: [x0 + iw, r1 - 200 * k * 0.36, x0 + iw + cwid], mac: [x0 + pre + mw / 2, y + ch - 44 * k, mw * 0.62, 30 * k], seen: [x + cw - 46 * k, y + ch - 44 * k], read: [x + cw * 0.9, y + ch * 0.25] };
    }
    function seen(F, c, x, y, sc, k) {
      const { E, S } = F;
      c.save(); c.translate(x, y); c.scale(sc, sc);
      E.drawText(c, "SEEN", -64 * S * k, 0, { ...K.MONO, size: 30 * S * k, color: C.coral, align: "right" });
      c.strokeStyle = C.coral; c.lineWidth = 4 * S * k; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
      for (const dx of [-52, -30]) { c.moveTo((dx - 6) * S * k, 0); c.lineTo(dx * S * k, 7 * S * k); c.lineTo((dx + 14) * S * k, -9 * S * k); }
      c.stroke(); c.restore();
    }
    // the badge: a paper usage card with a lanyard slot; words of L5 land on it; live pixel balance drains
    function badgeCard(F, c, cx, cy, w, h, z) {
      const { E, t, S, port } = F, ws = L[4].words;
      const x = cx - w / 2, y = cy - h / 2, k = w / ((port ? 0.98 * F.R.w : 0.78 * F.W));
      c.save();
      // lanyard straps
      c.strokeStyle = "#0b0c0b"; c.lineWidth = Math.max(2, 26 * S * k);
      c.beginPath(); c.moveTo(cx - 70 * S * k, y + 30 * S * k); c.lineTo(cx - 230 * S * k, y - 900 * S * k); c.moveTo(cx + 70 * S * k, y + 30 * S * k); c.lineTo(cx + 230 * S * k, y - 900 * S * k); c.stroke();
      c.fillStyle = C.paper; c.beginPath(); c.roundRect(x, y, w, h, 38 * S * k); c.fill();
      c.fillStyle = "#0b0c0b"; c.beginPath(); c.roundRect(cx - 90 * S * k, y + 26 * S * k, 180 * S * k, 30 * S * k, 15 * S * k); c.fill();
      if (k < 0.12) { c.restore(); return; } // still tiny: just a badge
      // header band
      const lb = E.last("beats", t), bf = t >= 94.6 && lb && lb.dt < 0.1; // the header band flips on each beat (94.68 D, 95.16, 95.64)
      c.fillStyle = bf ? INK : C.green; c.fillRect(x, y + 84 * S * k, w, 70 * S * k);
      E.drawText(c, "ATTENDEE · ALL ACCESS", x + 50 * S * k, y + 120 * S * k, { ...K.MONO, size: 30 * S * k, color: bf ? C.green : INK, align: "left" });
      E.drawText(c, "FOUNDER_01", x + w - 50 * S * k, y + 120 * S * k, { ...K.MONO, size: 30 * S * k, color: bf ? C.green : INK, align: "right" });
      const hero = { ...K.HERO, baseline: "alphabetic", align: "left", color: INK };
      const x0 = x + 60 * S * k, s1 = (port ? 150 : 210) * S * k, s2 = port ? K.fit(F, c, "FOUNDER!", { ...hero, size: 300 * S * k }, w - 120 * S * k) : 270 * S * k;
      const y1 = y + (port ? 330 : 400) * S * k, y2 = y1 + (port ? 20 : 30) * S * k + s2 * K.CAP.hero + (port ? 30 : 40) * S * k;
      let xx = x0;
      ["I'M", "AN", "AI"].forEach((txt, i) => { K.slamText(F, c, txt, xx, y1, ws[i].s, { ...hero, size: s1 }); xx += E.measure(c, txt + " ", { ...hero, size: s1 }); });
      if (t >= ws[3].s - 0.05) { // green highlighter bar under FOUNDER!
        const u = ease.outCubic(clamp((t - ws[3].s + 0.05) / 0.12)), fw = E.measure(c, "FOUNDER!", { ...hero, size: s2 });
        c.fillStyle = C.green; c.fillRect(x0 - 16 * S * k, y2 - s2 * 0.62, (fw + 32 * S * k) * u, s2 * 0.5);
      }
      K.slamText(F, c, "FOUNDER!", x0, y2, ws[3].s, { ...hero, size: s2 });
      // footer: live balance
      const fy = y + h - (port ? 150 : 170) * S * k;
      c.fillStyle = C.inkA(0.15); c.fillRect(x + 50 * S * k, fy - 40 * S * k, w - 100 * S * k, Math.max(1, 2 * S));
      E.drawText(c, "TOKEN BALANCE", x0, port ? fy - 6 * S * k : fy + 20 * S * k, { ...K.MONO, size: 28 * S * k, color: INK, align: "left" });
      B.pixelText(c, B.fmtInt(B.tokensAt(E, t)), x + w - 60 * S * k, port ? fy + 20 * S * k : fy - 12 * S * k, { rows: 11, cell: Math.max(2, Math.round((port ? 7 : 9) * S * k)), color: INK, line: "#3d4a33", align: "right" });
      c.restore();
    }
    // stadium LED ribbon board: a dark band, FOUNDER! scrolling (rows alternate direction), a beat flash on the rules
    function board(F, c, y0, y1, t0, i) {
      const { E, t, S, W } = F, h = y1 - y0;
      c.fillStyle = C.bg; c.fillRect(0, y0, W, h);
      const bp = E.pulse("beats", t, 0.1);
      c.fillStyle = C.greenA(0.45 + 0.5 * bp); c.fillRect(0, y0, W, Math.max(1, 2 * S)); c.fillRect(0, y1 - Math.max(1, 2 * S), W, Math.max(1, 2 * S));
      const sp = K.sprite(E, "FOUNDER!", { size: Math.round(h * 0.8), color: i ? C.white : C.green });
      const off = (i % 2 ? 1 : -1) * 700 * S * (t - t0), gap = sp.w * 1.12;
      for (let x = ((off % gap) + gap) % gap - gap; x < W; x += gap) c.drawImage(sp.cv, x, y0 + (h - sp.h) / 2, sp.w, sp.h);
    }
    // entitlement gate: DATING feature card, padlock, toggle OFF (denied on 97.06), requires SERIES_B
    function gate(F, c, o) {
      const { E, t, S } = F, k = o.k * S, ws = L[6].words;
      if (t < ws[1].s - 0.05) return;
      const x = o.x, y = o.y, w = o.w, h = 250 * k;
      c.save();
      c.fillStyle = C.panel; c.strokeStyle = C.line; c.lineWidth = Math.max(1, 2 * S);
      c.beginPath(); c.roundRect(x, y, w, h, 24 * k); c.fill(); c.stroke();
      padlock(c, x + 90 * k, y + h / 2, 1.5 * k, C.coral);
      E.drawText(c, "DATING", x + 170 * k, y + 104 * k, { ...K.HERO, size: 72 * k, color: C.white, align: "left", tracking: -0.01 });
      const req = ws[3].s;
      E.drawText(c, t >= req ? "LOCKED · requires plan: SERIES B" : "LOCKED", x + 172 * k, y + 176 * k, { ...K.MONO, weight: 600, size: 30 * k, color: C.coral, align: "left", tracking: 0.04 });
      // toggle: tries ON on 97.06, snaps back
      const tx = x + w - 230 * k, ty = y + h / 2, tw = 150 * k, th = 76 * k;
      const tryOn = t >= 97.06 ? Math.exp(-(t - 97.06) / 0.07) * Math.sin(Math.min(Math.PI, (t - 97.06) * 30)) : 0;
      const shake = t >= 97.06 ? Math.exp(-(t - 97.06) / 0.1) * Math.sin((t - 97.06) * 70) * 10 * k : 0;
      c.fillStyle = C.line; c.beginPath(); c.roundRect(tx + shake, ty - th / 2, tw, th, th / 2); c.fill();
      c.fillStyle = tryOn > 0.4 ? C.green : C.grey; c.beginPath(); c.arc(tx + shake + th / 2 + (tw - th) * clamp(tryOn), ty, th * 0.38, 0, 6.2832); c.fill();
      E.drawText(c, "OFF", tx + tw + 26 * k, ty + 2 * k, { ...K.MONO, size: 28 * k, color: C.grey, align: "left" });
      c.restore();
      // the check, like a log line
      if (t >= 97.54) E.drawText(c, "can(him, \"dating\")  →  false", x + 8 * k, y + h + 70 * k, { ...K.MONO, weight: 500, size: 34 * k, color: C.grey, align: "left", tracking: 0.02, alpha: clamp((t - 97.54) / 0.06) });
    }
    function padlock(c, x, y, s, col) {
      c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 8;
      c.beginPath(); c.roundRect(-28, -6, 56, 46, 8); c.fill();
      c.beginPath(); c.arc(0, -10, 18, Math.PI, 0); c.moveTo(-18, -10); c.lineTo(-18, -2); c.moveTo(18, -10); c.lineTo(18, -2); c.stroke();
      c.restore();
    }
  },
});
