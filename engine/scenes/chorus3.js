// CHORUS 3 · 118.85-134.50 · HOOK_03 · owner A3 · the final chorus: the biggest one. A look change on every line (C A B A E C A
// D A E), the duo dance as the main footage, both "See you after tokens!" lines doubled, the token meter crosses 10% at 129.59
// (LOW BALANCE: a coral warning band + a big coral pixel balance draining), half-beat stutters in the last 2 bars (130.68-134.50:
// clip beat-repeats a-a-b-b + framing jumps on a constant ground, so no full-frame luminance flips).
// Beats 118.80 | 119.28D 119.74 120.22 120.70 | 121.16D 121.64 122.12 122.60 | 123.08D 123.56 124.02 124.50 |
//       124.98D 125.46 125.92 126.40 | 126.88D 127.36 127.84 128.32 | 128.80D 129.26 129.74 130.22 |
//       130.68D 131.16 131.64 132.12 | 132.58D 133.06 133.54 134.02 | 134.50D (outro)
//
// PLAN  t        word / event                    visual                                                         layer        cut / beat
//  S1   118.850  (hard cut in)                   C · duo_dance full body, her fist peaks beat-locked (≈1.3×)     plate        first frame = slam
//       118.913  I'm · 119.362 an · 119.522 AI   three marquee rows of I'M AN AI FOUNDER! scroll behind them;    MID
//       119.762  founder!                        every copy of the sung word lights white on its onset
//       119.28D / 119.74 / 120.22                fist peaks on the beats → coral (her) / white (him) impact lines  FRONT
//  S2   120.642  Founder! (GANG)                 A · wall of FOUNDER! + a giant pixel balance rolling −8,663       BACK         cut on word
//  S3   121.102  I · 121.422 can't · 121.782 come · 121.922 out · 122.222 tonight.                                MID          cut on word ≈ 121.16D
//                                                B · his pitch deck slide 07/12: him_pitch presents (clip 0.40→),
//                                                the headline builds word by word, TONIGHT. on a green highlighter bar
//       121.640  beat                            coral underline under CAN'T                                      FRONT
//       121.800  (HER note, unsung)              "of course you can't" written on his slide (red pen on his deck)  FRONT
//       122.120  beat                            slide number ticks 07/12 → 08/12 (deck build)                    MID
//  S4   122.622  See · 123.002 you · 123.302 after · 123.702 tokens!                                              MID          cut on word = 122.60 beat
//                                                A · LOCKUP #5 top; the duo dances below (clip 2.9→5.6), shadow
//       123.08D / 123.56 / 124.02                fist peaks + impact lines; he freezes at 124.1 (clip hold), she doesn't
//  S5   124.522  See · 124.822 you · 125.222 after · 125.562 tokens!                                              MID          cut on word = 124.50 beat
//                                                E · terminal: LOCKUP #6 in a tokens.log window, a log line prints per
//                                                word (word, burn, balance), the duo in a LIVE feed panel
//       124.98D / 125.46 / 125.92                cursor + log flush on beats                                      MID
//  S6   126.422  I'm (held to 127.042)           C · duo waist-up, big; behind them one giant word slot flips     MID          cut on word = 126.40 beat
//       127.042  an · 127.162 AI · 127.422 founder!  per word (split-flap) · FOUNDER! fills the width
//       126.88D / 127.36 / 127.84                fist peaks + lines                                               FRONT
//  S7   128.242  Founder! (GANG)                 A · wall of FOUNDER! that HER red pen strikes through row by row  BACK         cut on word ≈ 128.32
//  S8   128.762  No · 129.042 dating · 129.342 till · 129.522 Series · 129.802 B.                                 MID          cut on word = 128.80D
//                                                D · dictionary entry: Series B /ˈsɪə.riːz ˈbiː/ n. + his line big
//       129.590  meter < 10%                     LOW BALANCE: coral stamp slams on the page, coral warning band     FRONT
//                                                appears (blinks every other beat from here to the end)
//  S9   130.222  See · 130.642 you · 130.922 after · 131.302 tokens!                                              MID          cut on word = 130.22 beat
//                                                A · LOCKUP #7 + coral band + big coral pixel balance; duo right
//       130.250  (HER note, unsung)              "babe, you're pre-seed" writes, 131.16 arrow to him, underline     FRONT
//       130.680  downbeat                        HALF-BEAT STUTTERS begin: clip beat-repeat a-a-b-b + framing jumps  plate
//  S10  132.142  See · 132.562 you · 132.842 after · 133.182 tokens!                                              MID          cut on word = 132.12 beat
//                                                E · LOCKUP #8 in the terminal, the balance panel drains in coral,
//                                                duo feed stutters on half-beats; 134.02 last beat: "LOW BALANCE" flush
import * as K from "./chorus1/kit.js";
const { B, C, FONT, clamp, lerp, ease } = K;
const INK = C.ink;
const LOW_T = 129.59; // the meter crosses 10% (brand.tokensAt); measured once in shots()

export default K.makeScene({
  clips: ["duo_dance", "him_pitch", "him_chant", "her_mock_chant"],
  shots(E, V) {
    const L = E.section("chorus3"), w = (li, wi) => L[li].words[wi];
    // the duo: the regenerated clip, or (fallback) nothing — chorus 3 needs it
    const duo = V.duo_dance, pitch = V.him_pitch ?? V.him_chant;
    let lowT = LOW_T;
    for (let x = 118.85; x < 134.5; x += 0.005) if (B.tokensAt(E, x) < 1e5) { lowT = x; break; }
    const lin = (v, t0, c0) => (F) => [[v, K.inClip(v, c0 + (F.t - t0))]];
    const drift = (F, a, b, amt) => K.creep(F.t, a, b, amt);
    // her fist peaks (footage.md): the duo's shared pulse, beat-locked by a piecewise speed ramp (~1.3×)
    const PK = [0.9, 1.55, 2.2, 2.9, 3.5, 4.1, 4.8, 5.55, 6.3, 6.9, 7.5];
    const beats = E.A.beats;
    const knots = (b0, p0, n) => { const i0 = beats.findIndex((x) => x >= b0 - 0.01), k = []; for (let i = 0; i < n; i++) k.push([beats[i0 + i], PK[p0 + i]]); return k; };
    const kS1 = knots(118.8, 0, 5), kS4 = knots(123.08, 4, 4), kS5 = knots(124.98, 7, 4), kS6 = knots(126.88, 1, 4), kS9 = knots(130.68, 3, 4);
    // half-beat grid for the stutter bars
    const HB = [];
    for (let i = 0; i < beats.length - 1; i++) if (beats[i] >= 130.67 && beats[i] < 134.5) { HB.push(beats[i], (beats[i] + beats[i + 1]) / 2); }
    HB.push(134.5);
    const hbIndex = (t) => { let k = -1; for (let i = 0; i < HB.length - 1; i++) if (t >= HB[i]) k = i; return k; };
    // beat-repeat: slice k plays from the start of its pair (a-a-b-b), never a held frame
    const stutter = (kn) => (F) => {
      const k = hbIndex(F.t);
      if (k < 0) return [[duo, K.inClip(duo, K.warp(kn, F.t))]];
      const p0 = HB[2 * Math.floor(k / 2)], base = K.warp(kn, p0);
      return [[duo, K.inClip(duo, base + (F.t - HB[k]) * 1.25)]];
    };
    const duoOp = (F, o) => K.frameSub(F.E, duo, o);
    const SH = [];

    // ---------------------------------------------------------------------------------------- S1 duo + marquee
    SH.push({ a: 118.85, b: w(1, 0).s, look: "C", clips: (F) => [[duo, K.inClip(duo, K.warp(kS1, F.t))]], draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, 118.85, 120.64, 0.04);
      const op = port ? duoOp(F, { h: 0.5 * H * dr, cx: 0.5 * W, bottom: 0.99 * H }) : duoOp(F, { h: 0.9 * H * dr, cx: 0.5 * W, bottom: 0.975 * H });
      F.back((c) => {
        K.groundC(F, c);
        marquee(F, c, L[0].words, port ? [0.3, 0.47] : [0.4, 0.83], port ? 150 : 330);
        K.shadow(c, W / 2, port ? 0.99 * H : 0.975 * H, port ? 0.6 * W : 0.42 * W, "light");
        duoHits(F, c, v, lt, op, kS1);
        K.burnTag(F, c, w(0, 3), port ? R.x + R.w * 0.6 : 0.8 * W, port ? F.PT + 30 * S : 0.13 * H, { color: INK, unit: " TOKENS", size: 34 });
      });
      F.plate(v, op);
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S2 GANG: wall + giant balance roll
    SH.push({ a: w(1, 0).s, b: w(2, 0).s, look: "A", draw(F) {
      const { E, t, S, W, H, R, port } = F, gw = w(1, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.3 });
        K.wallTiers(F, c, gw.s, port ? { base: 220, rows: 16, speed: 500, bottom: 1.02, shrink: 0.9, fade: 0.04, ink: C.whiteA(0.5), acc: C.whiteA(0.5), alpha: 0.45 }
          : { base: 260, rows: 9, speed: 600, bottom: 1.06, ink: C.whiteA(0.5), acc: C.whiteA(0.5), alpha: 0.4 });
        // the giant balance: rolls down 8,663 on the chant
        const v = B.tokensAt(E, t), txt = B.fmtInt(v), cols = B.pixelSize("888,888", { rows: 13, cell: 1 }).w;
        const cell = Math.max(2, Math.min(Math.round((port ? 11 : 19) * S), Math.floor((port ? R.w * 0.9 : W * 0.8) / cols)));
        const sz = B.pixelSize(txt, { rows: 13, cell }), x = port ? R.x + R.w / 2 : W / 2, y = port ? R.y + R.h * 0.42 : 0.5 * H;
        c.fillStyle = C.bg; c.fillRect(x - sz.w / 2 - 40 * S, y - sz.h / 2 - 70 * S, sz.w + 80 * S, sz.h + 140 * S);
        E.drawText(c, "BALANCE", x - sz.w / 2, y - sz.h / 2 - 34 * S, { ...K.MONO, size: (port ? 24 : 34) * S, color: C.white, align: "left" });
        B.pixelText(c, txt, x, y - sz.h / 2, { rows: 13, cell, align: "center" });
        B.crosshairs(c, x - sz.w / 2 - 40 * S, y - sz.h / 2 - 70 * S, sz.w + 80 * S, sz.h + 140 * S, { len: 30 * S, inset: 10 * S, cross: 6 * S, color: C.greenA(0.7) });
        K.gangReadout(F, c, gw, port ? { y: R.y + R.h * 0.72, size: 30 } : { y: 0.83 * H, size: 46 });
      });
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S3 pitch deck slide + her red pen
    SH.push({ a: w(2, 0).s, b: w(3, 0).s, look: "B", clips: lin(pitch, w(2, 0).s, 0.4), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0], ws = L[2].words;
      const dr = drift(F, 121.1, 122.62, 0.03);
      const op = port ? K.frameSub(E, v, { h: 0.5 * H * dr, cx: 0.3 * W, bottom: 1.03 * H }) : K.frameSub(E, v, { h: 0.88 * H * dr, cx: 0.15 * W, bottom: 1.03 * H });
      const lay = slideLayout(F);
      F.back((c) => {
        K.groundFill(F, c, C.paper);
        slideChrome(F, c, t >= 122.12 ? "08/12" : "07/12");
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left", color: INK };
        const iw = E.measure(c, "I ", { ...hero, size: lay.s1 });
        K.slamText(F, c, "I", lay.x0, lay.y1, ws[0].s, { ...hero, size: lay.s1 });
        K.slamText(F, c, "CAN'T", lay.x0 + iw, lay.y1, ws[1].s, { ...hero, size: lay.s1 });
        const cw = E.measure(c, "COME ", { ...hero, size: lay.s2 });
        K.slamText(F, c, "COME", lay.x0, lay.y2, ws[2].s, { ...hero, size: lay.s2 });
        K.slamText(F, c, "OUT", lay.x0 + cw, lay.y2, ws[3].s, { ...hero, size: lay.s2 });
        if (t >= ws[4].s - 0.05) { // green highlighter bar (deck style) under TONIGHT.
          const u = ease.outCubic(clamp((t - ws[4].s + 0.05) / 0.12)), tw = E.measure(c, "TONIGHT.", { ...hero, size: lay.s3 });
          c.fillStyle = C.green; c.fillRect(lay.x0 - 12 * S, lay.y3 - lay.s3 * 0.5, (tw + 24 * S) * u, lay.s3 * 0.42);
        }
        K.slamText(F, c, "TONIGHT.", lay.x0, lay.y3, ws[4].s, { ...hero, size: lay.s3 });
        const cwid = E.measure(c, "CAN'T", { ...K.HERO, size: lay.s1 });
        B.penUnderline(c, lay.x0 + iw, lay.y1 + lay.s1 * 0.12, lay.x0 + iw + cwid, t, 121.64, { width: 10 * S, seed: 12, dur: 0.12 });
        B.penNote(E, c, "of course you can't", lay.nx, lay.ny, t, 121.8, { size: lay.ns, cps: 31, rot: -0.05 });
        // the presenting hand points at the slide: a thin tracked leader line from his palm (pose 16) to the headline
        const p = K.lmScreen(E, v, lt, 16, op);
        if (p) { c.strokeStyle = C.inkA(0.5); c.lineWidth = Math.max(1, 2 * S); c.setLineDash([6 * S, 6 * S]); c.beginPath(); c.moveTo(p[0] + 20 * S, p[1]); c.lineTo(lay.x0 - 24 * S, lay.y2 - lay.s2 * 0.35); c.stroke(); c.setLineDash([]); }
      });
      F.plate(v, op);
      K.punch(F, 0.025);
    } });

    // ---------------------------------------------------------------------------------------- S4 LOCKUP #5, the duo below
    SH.push({ a: w(3, 0).s, b: w(4, 0).s, look: "A", clips: (F) => [[duo, K.inClip(duo, K.warp(kS4, F.t))]], draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, 122.62, 124.52, 0.03);
      const lx = port ? R.x + R.w / 2 : W / 2, ly = port ? F.PT + 120 * S : 0.79 * H, lsz = port ? 72 : 128;
      const stage = port ? 0.955 * H : K.lockupBox(E, K.mctx(), lx, ly, lsz).top - 6 * S; // their feet on the lockup's top rule
      const op = port ? duoOp(F, { h: 0.43 * H * dr, cx: 0.5 * W, bottom: stage }) : duoOp(F, { h: 0.6 * H * dr, cx: 0.5 * W, bottom: stage });
      F.back((c) => {
        K.groundA(F, c, { offY: -(t - 122.62) * 24 * S });
        K.lockup(F, c, L[3].words, lx, ly, { size: lsz, seed: 13 });
        K.shadow(c, W / 2, stage, port ? 0.6 * W : 0.32 * W);
        duoHits(F, c, v, lt, op, kS4);
      });
      F.plate(v, op);
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S5 LOCKUP #6 in the terminal
    SH.push({ a: w(4, 0).s, b: w(5, 0).s, look: "E", clips: (F) => [[duo, K.inClip(duo, K.warp(kS5, F.t))]], draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const lay = termLayout(F, 0);
      const op = duoOp(F, { h: lay.feed.h * 0.9, cx: lay.feed.x + lay.feed.w / 2, bottom: lay.feed.y + lay.feed.h * 0.97 });
      F.back((c) => feedInterior(F, c, lay.feed));
      F.plate(v, op);
      F.front((c) => {
        uiAround(F, c, lay.feed);
        termWindow(F, c, lay.main, "tokens.log — zsh");
        prompt(F, c, lay.main, "see you --after tokens", 124.3);
        K.lockup(F, c, L[4].words, lay.main.x + lay.main.w / 2, lay.main.y + lay.main.h * 0.43, { size: port ? 62 : 112, seed: 17 });
        logLines(F, c, lay.main, L[4].words);
        termWindow(F, c, lay.feed, "cam_01 · LIVE", false);
        liveDot(F, c, lay.feed);
      });
      K.punch(F, 0.025);
    } });

    // ---------------------------------------------------------------------------------------- S6 duo waist-up + split-flap word slot
    SH.push({ a: w(5, 0).s, b: w(6, 0).s, look: "C", clips: (F) => [[duo, K.inClip(duo, K.warp(kS6, F.t))]], draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = drift(F, 126.42, 128.24, 0.05);
      const op = port ? duoOp(F, { h: 0.86 * H * dr, spanUV: 0.94, cx: 0.5 * W, av: 0.007, ay: 0.43 * H }) : duoOp(F, { h: 1.25 * H * dr, spanUV: 0.94, cx: 0.5 * W, av: 0.007, ay: 0.43 * H });
      F.back((c) => {
        K.groundC(F, c);
        flapSlot(F, c, L[5].words, port ? F.PT + 120 * S : 0.25 * H, port ? R.w * 0.98 : 0.8 * W, port ? R.x + R.w / 2 : 0.56 * W);
        duoHits(F, c, v, lt, op, kS6);
        K.burnTag(F, c, w(5, 3), port ? R.x + R.w * 0.6 : 0.8 * W, port ? F.PT + 20 * S : 0.13 * H, { color: INK, unit: " TOKENS", size: 34 });
      });
      F.plate(v, op);
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S7 GANG: her pen strikes the wall
    SH.push({ a: w(6, 0).s, b: w(7, 0).s, look: "A", draw(F) {
      const { E, t, S, W, H, R, port } = F, gw = w(6, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.3 });
        const rows = port ? 12 : 7, rh = H / rows, sz = Math.round(rh * 0.9);
        const sp = [K.sprite(E, "FOUNDER!", { size: sz, color: C.white }), K.sprite(E, "FOUNDER!", { size: sz, color: C.green })];
        for (let r = 0; r < rows; r++) {
          const y = r * rh + (rh - sp[0].h) / 2, off = (r % 2 ? 1 : -1) * 420 * S * (t - gw.s) + (r * 137 * S) % sp[0].w, gap = sp[0].w * 1.06;
          for (let i = -1, x = (off % gap) - gap; x < W; x += gap, i++) c.drawImage(sp[(i + r) % 4 === 0 ? 1 : 0].cv, x, y, sp[0].w, sp[0].h);
          // her strike through the row, staggered on 16ths from the chant
          const t0 = gw.s + 0.02 + (r % rows) * (0.4 / rows);
          B.penStrike(c, -20 * S, y + sp[0].h * 0.52, W + 20 * S, t, t0, { width: (port ? 7 : 10) * S, seed: 30 + r, dur: 0.1, amp: 6 * S, tilt: (r % 2 ? 8 : -8) * S });
        }
        K.gangReadout(F, c, gw, port ? { y: R.y + R.h * 0.5, size: 30 } : { y: 0.5 * H, size: 52 });
      });
      K.punch(F, 0.035);
    } });

    // ---------------------------------------------------------------------------------------- S8 dictionary page + the LOW BALANCE crossing
    SH.push({ a: w(7, 0).s, b: w(8, 0).s, look: "D", draw(F) {
      const { E, t, S, W, H, R, port } = F, ws = L[7].words;
      F.back((c) => {
        K.groundFill(F, c, "#FFFFFF");
        dictPage(F, c, ws);
        if (t >= lowT) {
          B.stamp(E, c, "LOW BALANCE", port ? R.x + R.w * 0.5 : 0.7 * W, port ? R.y + R.h * 0.78 : 0.7 * H, t, lowT, { S, size: port ? 70 : 120, rot: -0.1 });
          lowBand(F, c, lowT);
        }
      });
      K.punch(F, 0.025);
      if (t >= lowT) E.post.punch = Math.max(E.post.punch, 0.04 * Math.exp(-(t - lowT) / 0.12));
    } });

    // ---------------------------------------------------------------------------------------- S9 LOCKUP #7 + "babe, you're pre-seed" + stutter
    SH.push({ a: w(8, 0).s, b: w(9, 0).s, look: "A", clips: stutter(kS9), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const k = hbIndex(t), jump = k >= 0 && k % 2 === 1;
      const op = port
        ? duoOp(F, { h: 0.4 * H * (jump ? 1.1 : 1), cx: (jump ? 0.54 : 0.5) * W, bottom: (jump ? 1.0 : 0.97) * H })
        : duoOp(F, { h: 0.74 * H * (jump ? 1.1 : 1), cx: (jump ? 0.8 : 0.765) * W, bottom: (jump ? 1.03 : 0.985) * H });
      const lx = port ? R.x + R.w / 2 : 0.29 * W, ly = port ? F.PT + 170 * S : 0.3 * H;
      const nx = port ? R.x + R.w * 0.04 : 0.05 * W, ny = port ? F.PT + 345 * S : 0.5 * H, ns = (port ? 58 : 92) * S;
      const nf = { font: FONT.serif, italic: true, weight: 400, size: ns }, nw = E.measure(K.mctx(), "babe, you're pre-seed", nf), pw = E.measure(K.mctx(), "pre-seed", nf);
      F.back((c) => {
        K.groundA(F, c);
        K.lockup(F, c, L[8].words, lx, ly, { size: port ? 68 : 112, seed: 19 });
        bigBalance(F, c, port ? { x: R.x + R.w * 0.04, y: F.PT + 420 * S, cell: 7 } : { x: 0.05 * W, y: 0.6 * H, cell: 11 }, k);
        B.penNote(E, c, "babe, you're pre-seed", nx, ny, t, 130.25, { size: ns, cps: 30, rot: -0.035 });
        B.penUnderline(c, nx + nw - pw, ny + ns * 0.42, nx + nw, t, 131.64, { width: 7 * S, seed: 21, dur: 0.12 });
      });
      F.plate(v, op);
      F.front((c) => {
        lowBand(F, c, lowT, true);
        // arrow to HIM in the duo (pose locks onto him: nose = landmark 0)
        const face = K.lmScreen(E, v, lt, 0, op, [0.355, 0.14]);
        if (face) B.penArrow(c, nx + nw + 20 * S, ny - 10 * S, face[0] - 60 * S, face[1] + 50 * S, t, 131.16, { width: 7 * S, seed: 23, bend: port ? -0.3 : 0.25, dur: 0.16 });
      });
      K.punch(F, 0.03);
    } });

    // ---------------------------------------------------------------------------------------- S10 LOCKUP #8 in the terminal + stutter + drain
    SH.push({ a: w(9, 0).s, b: 134.6, look: "E", clips: stutter(kS9), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const k = hbIndex(t), jump = k >= 0 && k % 2 === 1;
      const lay = termLayout(F, 1);
      const fd = lay.feed;
      const op = duoOp(F, { h: fd.h * (jump ? 1.0 : 0.88), cx: fd.x + fd.w * (jump ? 0.47 : 0.5), bottom: fd.y + fd.h * (jump ? 1.04 : 0.97) });
      F.back((c) => feedInterior(F, c, fd));
      F.plate(v, op);
      F.front((c) => {
        uiAround(F, c, fd);
        termWindow(F, c, lay.main, "tokens.log — zsh");
        prompt(F, c, lay.main, "see you --after tokens", 131.95);
        K.lockup(F, c, L[9].words, lay.main.x + lay.main.w / 2, lay.main.y + lay.main.h * 0.56, { size: port ? 62 : 112, seed: 29 });
        termWindow(F, c, lay.bal, "balance");
        bigBalance(F, c, { x: lay.bal.x + 30 * S, y: lay.bal.y + 96 * S, cell: port ? 6 : 8 }, k);
        logLines(F, c, { ...lay.bal, x: lay.bal.x + lay.bal.w * (port ? 0.0 : 0.5), w: lay.bal.w * (port ? 1 : 0.5) }, L[9].words, true);
        termWindow(F, c, fd, "cam_01 · LIVE", false);
        liveDot(F, c, fd);
        lowBand(F, c, lowT, true);
      });
      K.punch(F, 0.03);
      if (t >= 134.02) E.post.punch = Math.max(E.post.punch, 0.04 * Math.exp(-(t - 134.02) / 0.12));
    } });
    return SH;

    // ------------------------------------------------------------------------------------------------ helpers
    // impact lines at the duo's fist peaks: her fist (fixed offset, the pose tracks him) coral, his both fists white
    function duoHits(F, c, v, lt, op, kn) {
      const { E, t, S } = F, z = Math.min(1.5, op.zoom);
      for (const k of kn) {
        if (t < k[0] - 0.02 || t > k[0] + 0.28) continue;
        const her = E.plateToScreen(E, v, [0.63, 0.05], op);
        K.burst(c, her[0], her[1], t, k[0], { color: C.coral, lw: 5 * S, r0: 30 * S * z, r1: 120 * S * z, n: 8, a0: -1.5708, spread: 3.2, seed: 41 });
        for (const j of [15, 16]) { const p = K.lmScreen(E, v, lt, j, op); if (p) K.burst(c, p[0], p[1] - 16 * S * z, t, k[0], { color: C.white, lw: 4 * S, r0: 26 * S * z, r1: 96 * S * z, n: 7, a0: -1.5708, spread: 3, seed: j }); }
      }
    }
    // three marquee rows of the line; every copy of a word lights white on its onset
    function marquee(F, c, ws, ys, size) {
      const { E, t, S, W, H } = F, sz = size * S, o = { ...K.COND, size: sz, align: "left", baseline: "alphabetic" };
      const words = ws.map((x) => x.w.toUpperCase());
      const widths = words.map((x) => E.measure(c, x, o)), gap = sz * 0.28;
      const unit = widths.reduce((a, b) => a + b, 0) + gap * words.length;
      ys.forEach((yf, r) => {
        const dir = r % 2 ? 1 : -1, off = dir * (240 + 90 * r) * S * (t - 118.85) - r * unit * 0.37;
        let x = ((off % unit) + unit) % unit - unit;
        for (; x < W; ) {
          for (let i = 0; i < words.length; i++) {
            const lit = t >= ws[i].s - 0.03, cur = lit && (i === words.length - 1 || t < ws[i + 1].s - 0.03);
            if (x + widths[i] > 0 && x < W) {
              if (cur) { // the sung word: white on an ink block
                const k = K.slam(t, ws[i].s, { from: 1.15 }), p = sz * 0.1;
                c.fillStyle = INK; c.fillRect(x - p, yf * H - sz * K.CAP.cond - p * 1.2, (widths[i] + 2 * p) * (k ? 1 : 1), sz * K.CAP.cond + p * 2.4);
              }
              E.drawText(c, words[i], x, yf * H, { ...o, color: cur ? C.white : lit ? INK : C.inkA(0.16) });
            }
            x += widths[i] + gap;
          }
        }
      });
    }
    function slideLayout(F) {
      const { S, W, H, R, port } = F;
      if (port) {
        const x0 = R.x + R.w * 0.06;
        return { x0, s1: 132 * S, s2: 92 * S, s3: 120 * S, y1: F.PT + 140 * S, y2: F.PT + 245 * S, y3: F.PT + 370 * S, nx: R.x + R.w * 0.3, ny: F.PT + 470 * S, ns: 60 * S };
      }
      const x0 = 0.47 * W;
      return { x0, s1: 210 * S, s2: 130 * S, s3: 190 * S, y1: 0.36 * H, y2: 0.51 * H, y3: 0.7 * H, nx: 0.52 * W, ny: 0.86 * H, ns: 100 * S };
    }
    function slideChrome(F, c, num) {
      const { E, S, W, H, R, port } = F, x0 = port ? R.x + R.w * 0.06 : 0.47 * W, x1 = port ? R.x + R.w * 0.96 : 0.95 * W;
      const top = port ? F.PT + 20 * S : 0.17 * H, bot = port ? R.y + R.h * 0.97 : 0.95 * H;
      const mono = { ...K.MONO, weight: 600, size: (port ? 20 : 26) * S, color: C.inkA(0.6) };
      E.drawText(c, "WHY I CAN'T — Q4 PRIORITIES", x0, top, { ...mono, align: "left" });
      E.drawText(c, num, x1, top, { ...mono, align: "right", color: INK });
      c.fillStyle = C.inkA(0.18); c.fillRect(x0, top + 22 * S, x1 - x0, Math.max(1, 2 * S)); c.fillRect(x0, bot - 26 * S, x1 - x0, Math.max(1, 2 * S));
      E.drawText(c, "CONFIDENTIAL · FOUNDER_01 · DO NOT FORWARD", x0, bot, { ...mono, align: "left", size: (port ? 16 : 20) * S });
    }
    // terminal layout: main window (lockup + logs), a feed window (the duo), a balance window (S10)
    function termLayout(F, variant) {
      const { S, W, H, R, port } = F;
      if (port) {
        if (!variant) {
          const main = { x: R.x, y: F.PT - 20 * S, w: R.w, h: 400 * S };
          return { main, feed: { x: R.x + R.w * 0.1, y: main.y + main.h + 20 * S, w: R.w * 0.8, h: 0.2 * H } };
        }
        const main = { x: R.x, y: F.PT + 52 * S, w: R.w, h: 340 * S };
        const bal = { x: R.x, y: main.y + main.h + 18 * S, w: R.w * 0.49, h: 0.2 * H };
        return { main, bal, feed: { x: R.x + R.w * 0.51, y: bal.y, w: R.w * 0.49, h: 0.2 * H } };
      }
      if (!variant) return { main: { x: 0.04 * W, y: 0.17 * H, w: 0.58 * W, h: 0.76 * H }, feed: { x: 0.645 * W, y: 0.17 * H, w: 0.315 * W, h: 0.76 * H } };
      return { main: { x: 0.04 * W, y: 0.17 * H, w: 0.58 * W, h: 0.43 * H }, bal: { x: 0.04 * W, y: 0.615 * H, w: 0.58 * W, h: 0.215 * H }, feed: { x: 0.645 * W, y: 0.17 * H, w: 0.315 * W, h: 0.66 * H } };
    }
    function termWindow(F, c, r, title, fill = true) {
      const { E, S } = F;
      c.fillStyle = C.panel; c.strokeStyle = C.line; c.lineWidth = Math.max(1, 2 * S);
      c.beginPath(); c.roundRect(r.x, r.y, r.w, r.h, 14 * S); if (fill) c.fill(); c.stroke();
      if (!fill) { c.beginPath(); c.roundRect(r.x, r.y, r.w, 45 * S, [14 * S, 14 * S, 0, 0]); c.fill(); c.stroke(); }
      c.fillStyle = C.line; c.fillRect(r.x, r.y + 44 * S, r.w, Math.max(1, 2 * S));
      for (let i = 0; i < 3; i++) { c.fillStyle = i === 0 ? C.coral : C.dgrey; c.beginPath(); c.arc(r.x + (24 + i * 22) * S, r.y + 22 * S, 7 * S, 0, 6.2832); c.fill(); }
      E.drawText(c, title, r.x + r.w / 2, r.y + 23 * S, { ...K.MONO, weight: 500, size: 20 * S, color: C.grey, align: "center", tracking: 0.04 });
    }
    function prompt(F, c, r, cmd, t0) {
      const { E, t, S } = F, n = Math.floor(clamp((t - t0) / 0.2) * cmd.length);
      const o = { ...K.MONO, weight: 600, size: 28 * S, align: "left", tracking: 0.02 };
      E.drawText(c, "$", r.x + 28 * S, r.y + 86 * S, { ...o, color: C.green });
      E.drawText(c, cmd.slice(0, n), r.x + 58 * S, r.y + 86 * S, { ...o, color: C.paper });
      if (E.beat(t).phase < 0.5) { c.fillStyle = C.paper; c.fillRect(r.x + 58 * S + E.measure(c, cmd.slice(0, n), o) + 4 * S, r.y + 72 * S, 14 * S, 28 * S); }
    }
    // a log line per sung word: [t] word  −burn  bal <balance>
    function logLines(F, c, r, ws, compact) {
      const { E, t, S } = F, o = { ...K.MONO, weight: 500, size: (compact ? 20 : 24) * S, align: "left", tracking: 0.02 }, lh = (compact ? 27 : 34) * S;
      let y = r.y + r.h - lh - (ws.length - 1) * lh;
      for (const wd of ws) {
        if (t < wd.s) break;
        const bal = B.tokensAt(E, wd.s + 0.12), low = bal < 1e5;
        E.drawText(c, `[${wd.s.toFixed(2)}]  ${wd.w.toLowerCase().replace(/[!.]/g, "").padEnd(7)} −${B.fmtInt(K.burnOf(E, wd))}`, r.x + 28 * S, y, { ...o, color: C.grey });
        E.drawText(c, `bal ${B.fmtInt(bal)}`, r.x + r.w - 28 * S, y, { ...o, align: "right", color: low ? C.coral : C.green });
        y += lh;
      }
    }
    function liveDot(F, c, r) {
      const { E, t, S } = F;
      c.fillStyle = C.coral; c.globalAlpha = 0.5 + 0.5 * E.pulse("beats", t, 0.25); c.beginPath(); c.arc(r.x + r.w - 26 * S, r.y + 22 * S, 7 * S, 0, 6.2832); c.fill(); c.globalAlpha = 1;
    }
    // the feed window's interior (BACK, under the cut-out) and the opaque UI around it (FRONT): the cut-out stays in its window
    function feedInterior(F, c, r) {
      const { W, H, S } = F;
      c.fillStyle = C.panel; c.fillRect(0, 0, W, H);
      B.hairGrid(c, r.x, r.y, r.w, r.h, { step: 40 * S, alpha: 0.5, offY: -(F.t * 30 * S) });
    }
    function uiAround(F, c, r) {
      const { W, H, S } = F;
      c.save(); c.beginPath(); c.rect(0, 0, W, H); c.roundRect(r.x + 1 * S, r.y + 45 * S, r.w - 2 * S, r.h - 46 * S, [0, 0, 13 * S, 13 * S]); c.clip("evenodd");
      c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
      B.hairGrid(c, 0, 0, W, H, { step: 48 * S, alpha: 0.35 });
      c.restore();
    }
    // split-flap word slot: one giant word at a time, each new word flips in on its onset
    function flapSlot(F, c, ws, cy, maxW, cx) {
      const { E, t, S, W } = F;
      const FL = 0.067; // the flip runs over the 4 frames before the onset and lands on it
      let i = -1;
      for (let k = 0; k < ws.length; k++) if (t >= ws[k].s - FL) i = k;
      if (i < 0) return;
      const o = { ...K.COND, align: "center", baseline: "middle", color: INK };
      const size = (txt) => Math.min(K.fit(F, c, txt, { ...o, size: 1000 * S }, maxW), F.port ? 300 * S : 520 * S);
      const cur = ws[i].w.toUpperCase(), prev = i > 0 ? ws[i - 1].w.toUpperCase() : null;
      const u = clamp((t - (ws[i].s - FL)) / FL), sz = size(cur), half = sz * 0.36;
      const drawHalf = (txt, top, sy) => {
        const s2 = size(txt);
        c.save(); c.beginPath(); top ? c.rect(0, cy - s2, W, s2) : c.rect(0, cy, W, s2); c.clip();
        c.translate(cx, cy); c.scale(1, sy); c.translate(-cx, -cy);
        E.drawText(c, txt, cx, cy + s2 * 0.02, { ...o, size: s2 });
        c.restore();
      };
      if (u >= 1 || !prev) { drawHalf(cur, true, 1); drawHalf(cur, false, 1); }
      else {
        drawHalf(cur, true, 1); // new top half behind the falling flap
        drawHalf(prev, false, 1); // old bottom half until the flap lands
        if (u < 0.5) drawHalf(prev, true, 1 - u * 2); else drawHalf(cur, false, (u - 0.5) * 2);
      }
      c.fillStyle = C.green; c.fillRect(cx - maxW / 2 - 40 * S, cy - Math.max(1, 3 * S), maxW + 80 * S, Math.max(2, 6 * S)); // the split line
      void half;
    }
    function dictPage(F, c, ws) {
      const { E, t, S, W, H, R, port } = F;
      const x0 = port ? R.x + R.w * 0.05 : 0.07 * W, y0 = port ? F.PT + 40 * S : 0.2 * H;
      const mono = { ...K.MONO, weight: 500, size: (port ? 22 : 30) * S, color: C.grey, align: "left", tracking: 0.02 };
      E.drawText(c, "FOUNDER → ENGLISH", x0, y0, { ...mono, color: C.coral, weight: 700 });
      c.fillStyle = C.inkA(0.15); c.fillRect(x0, y0 + 26 * S, (port ? R.w * 0.9 : 0.86 * W), Math.max(1, 2 * S));
      // his line, big, in his hype type
      const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
      const s1 = port ? K.fit(F, c, "NO DATING", { ...hero, size: 190 * S }, R.w * 0.9) : 210 * S, s2 = port ? K.fit(F, c, "TILL SERIES B.", { ...hero, size: 130 * S }, R.w * 0.9) : 150 * S;
      const y1 = y0 + 40 * S + s1 * 0.78, y2 = y1 + s2 * 1.1;
      K.slamText(F, c, "NO", x0, y1, ws[0].s, { ...hero, size: s1, color: INK });
      K.slamText(F, c, "DATING", x0 + E.measure(c, "NO ", { ...hero, size: s1 }), y1, ws[1].s, { ...hero, size: s1, color: INK });
      const tw = E.measure(c, "TILL ", { ...hero, size: s2 }), sw = E.measure(c, "SERIES ", { ...hero, size: s2 });
      K.slamText(F, c, "TILL", x0, y2, ws[2].s, { ...hero, size: s2, color: INK });
      if (t >= ws[3].s - 0.05) { const u = ease.outCubic(clamp((t - ws[3].s + 0.05) / 0.12)), bw = E.measure(c, "SERIES B.", { ...hero, size: s2 }); c.fillStyle = C.green; c.fillRect(x0 + tw - 10 * S, y2 - s2 * 0.48, (bw + 20 * S) * u, s2 * 0.4); }
      K.slamText(F, c, "SERIES", x0 + tw, y2, ws[3].s, { ...hero, size: s2, color: INK });
      K.slamText(F, c, "B.", x0 + tw + sw, y2, ws[4].s, { ...hero, size: s2, color: INK });
      // the entry
      const ey = y2 + (port ? 70 : 100) * S;
      if (t >= ws[3].s) {
        E.drawText(c, "Series B", x0, ey, { font: FONT.serif, weight: 400, size: (port ? 64 : 84) * S, color: INK, align: "left", baseline: "alphabetic" });
        const hw = E.measure(c, "Series B", { font: FONT.serif, weight: 400, size: (port ? 64 : 84) * S });
        E.drawText(c, "/ˈsɪə.riːz ˈbiː/  n.", x0 + hw + 24 * S, ey - 8 * S, { ...mono, baseline: "alphabetic" });
        E.drawText(c, "1. a funding round. 2. requires a Series A.", x0, ey + (port ? 50 : 62) * S, { ...mono, color: INK, size: (port ? 22 : 30) * S });
      }
    }
    // the coral LOW BALANCE band: slams in at the crossing, blinks every other beat (like the HUD), text scrolls
    function lowBand(F, c, t0, top) {
      const { E, t, S, W, H, R, port } = F;
      if (t < t0) return;
      const u = ease.outCubic(clamp((t - t0) / 0.12)), blink = E.beat(t).i % 2 === 0 ? 1 : 0.55;
      const h = (port ? 54 : 70) * S, y = port ? (top ? F.PT - 16 * S : R.y + R.h - h - 60 * S) : 0.86 * H - h / 2;
      c.save(); c.globalAlpha = blink;
      c.fillStyle = C.coral; c.fillRect(0, y, W * u, h);
      const pct = (B.tokensAt(E, t) / 1e6) * 100;
      const txt = `LOW BALANCE · ${pct.toFixed(1)}% LEFT · TOP UP TO CONTINUE · `;
      const o = { ...K.MONO, size: (port ? 24 : 32) * S, color: INK, align: "left", baseline: "middle" };
      const tw = E.measure(c, txt, o), off = -((t - t0) * 260 * S) % tw;
      c.beginPath(); c.rect(0, y, W * u, h); c.clip();
      for (let x = off; x < W; x += tw) E.drawText(c, txt, x, y + h / 2 + 1 * S, o);
      c.restore();
    }
    // big pixel-grid balance (coral once below 10%), stutter-nudged on half-beats
    function bigBalance(F, c, o, k) {
      const { E, t, S } = F, v = B.tokensAt(E, t), low = v < 1e5, cell = Math.max(2, Math.round(o.cell * S * 2));
      const dx = k >= 0 && k % 2 === 1 ? 10 * S : 0;
      E.drawText(c, low ? "BALANCE · LOW" : "BALANCE", o.x + dx, o.y - 22 * S, { ...K.MONO, size: 26 * S, color: low ? C.coral : C.white, align: "left" });
      B.pixelText(c, B.fmtInt(v), o.x + dx, o.y, { rows: 12, cell: Math.round(cell / 2), color: low ? C.coral : C.green, line: low ? "#7a2a26" : C.cell });
    }
  },
});
