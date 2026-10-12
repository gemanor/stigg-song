// CHORUS 1 · 42.55-56.12 · HOOK_01 · owner A3 · CALM PASS (CALM_PASS.md): one shot per sung line, cuts only at line starts,
// looks C ↔ A per line, words pop on their onsets inside the shot, no impact lines, no punches or zoom pops.
// Beats 42.80D 43.28 43.76 44.22 | 44.70D 45.18 45.66 46.14 | 46.60D 47.08 47.56 48.04 | 48.50D 48.98 49.46 49.94 |
//       50.42D 50.90 51.38 51.84 | 52.32D 52.80 53.28 53.76 | 54.22D 54.70 55.18 55.66 | 56.12D (next section)
// Layers: MID = 2D surface #1 under the cut-out (type behind him), FRONT = surface #2 over it (only when needed).
//
// SHOT  span            line / words (onsets)                     visual                                            layer
//  1    42.55-44.17     L1 I'm 42.60 · an 42.93 · AI 43.05 ·        C · him_chant, ONE wide framing (clip ≈0.57-2.55,  MID / plate
//                       founder! 43.35                              pumps retimed onto the beats); "I'M AN AI" builds
//                                                                   word by word, FOUNDER! behind his legs; burn tag on
//                                                                   "I'm" held 1.25 s
//  2    44.17-44.65     L2 Founder! (GANG) 44.17                    A · stadium rows of FOUNDER!, held (slow drift, no   BACK
//                                                                   beat jumps) + "GANG CHANT −8,663 TOKENS"
//  3    44.65-48.38     L3 I 44.65 · can't 44.91 · come 45.29 ·     C · him_cu_talk (clip 2.10-5.83), hero line builds; MID / FRONT
//                       out 45.43 · tonight. 45.71                  "TONIGHT · BUSY" chip on his palm 44.95-46.15;
//                       HER note (unsung) 46.00                     "of course you can't" on an ink sticker + one
//                                                                   underline under CAN'T, written 46.00-46.38, held
//                                                                   2.0 s to the cut
//  4    48.38-49.93     L4 See 48.38 · you 48.45 · after 48.79 ·    A · LOCKUP #1 held; him_chant behind the board      FRONT board
//                       tokens! 49.11                               (clip ≈2.45-4.38, pumps on the beats)
//  5    49.93-51.79     L5 I'm 49.93 · an 50.57 · AI 50.67 ·        C · him_dance (clip ≈1.43-3.40); outlined letters    MID
//                       founder! 50.97                              fill on onsets ("I'M" like a meter); burn tag on "I'm"
//  6    51.79-52.33     L6 Founder! (GANG) 51.79                    A · one stadium wave across the FOUNDER! wall +      BACK
//                                                                   the gang readout
//  7    52.33-53.79     L7 No 52.33 · dating 52.55 · till 52.87 ·   C · NO DATING TILL SERIES B. + the funding-stage    MID
//                       Series 53.05 · B. 53.33                     track, complete by 52.60 (✕ DATING on "dating"),
//                                                                   padlock opens on "B."
//  8    53.79-56.12     L8 See 53.79 · you 54.17 · after 54.47 ·    A · LOCKUP #2, him_cu_talk deadpan (clip           MID / FRONT
//                       tokens! 54.85                               0.55-2.88; portrait: video-call window);
//                       HER note (unsung) 53.80                     "babe, you're pre-seed" written by 54.10 (2.0 s),
//                                                                   PRE-SEED stamp on the 54.70 beat (held 1.4 s)
// Every word is drawn by the scene, so the HUD subtitle is off; the HUD shows the token meter only (HUD.chrome = false).
import * as K from "./chorus1/kit.js";
const { B, C, FONT, clamp, lerp, ease } = K;
const INK = C.ink;
const POP = { from: 1.12, pre: 0.083, fade: "lin" }; // calm pop: in over the 5 frames before the onset, lands on it

export default K.makeScene({
  clips: ["him_chant", "him_cu_talk", "him_dance"],
  shots(E, V) {
    const L = E.section("chorus1"), w = (li, wi) => L[li].words[wi];
    const chant = V.him_chant, cu = V.him_cu_talk, dance = V.him_dance ?? V.him_chant;
    const kL1 = K.pumpKnots(E, chant, 42.8, 44.3, 0); // pumps 0.833 / 1.333 / 1.958 / 2.583 on 42.80 / 43.28 / 43.76 / 44.22 (the can is gone by 0.5)
    const kL4 = K.pumpKnots(E, chant, 48.5, 49.94, 3); // pumps 2.583 … 4.375 on 48.50 … 49.94 (before the can pops back at 4.75)
    const kDance = V.him_dance ? [[50.42, 1.958], [51.38, 3.0], [52.34, 3.917]] : K.pumpKnots(E, chant, 50.42, 51.4, 2);
    const lin = (v, t0, c0) => (F) => [[v, K.inClip(v, c0 + (F.t - t0))]];
    const drift = (F, a, b, amt) => K.creep(F.t, a, b, amt);
    const warped = (v, kn) => (F) => [[v, K.inClip(v, K.warp(kn, F.t))]];
    const S1 = [];
    const T = [42.55, w(1, 0).s, w(2, 0).s, w(3, 0).s, w(4, 0).s, w(5, 0).s, w(6, 0).s, w(7, 0).s, 56.2]; // shot starts = line starts

    // ---------------------------------------------------------------------------------------- 1 · I'M AN AI FOUNDER! (one framing)
    S1.push({ a: T[0], b: T[1], look: "C", clips: warped(chant, kL1), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v] = F.cl[0], ws = L[0].words;
      const dr = drift(F, T[0], T[1], 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.56 * H * dr, cx: 0.5 * W, bottom: 0.985 * H })
        : K.frameSub(E, v, { h: 0.9 * H * dr, cx: 0.66 * W, bottom: 0.975 * H });
      F.back((c) => {
        K.groundC(F, c);
        const row = { ...K.HERO, color: INK, align: "left", baseline: "alphabetic", size: (port ? 96 : 220) * S };
        let x = port ? R.x + R.w * 0.02 : 0.035 * W;
        const y = port ? F.PT + 74 * S : 0.38 * H;
        for (let i = 0; i < 3; i++) { // I'M · AN · AI build in the same frame
          const txt = ["I'M", "AN", "AI"][i];
          K.slamText(F, c, txt, x, y, ws[i].s, i ? { ...row, ...POP } : { ...row, from: 1.2 }); // "I'M" lands with the cut-in frame
          x += E.measure(c, txt + " ", row);
        }
        const o = { ...K.COND, color: C.white, align: "center", baseline: "alphabetic" }; // the accent: white on signal green
        o.size = port ? K.fit(F, c, "FOUNDER!", { ...o, size: 400 * S }, R.w * 0.98) : K.fit(F, c, "FOUNDER!", { ...o, size: 900 * S }, W * 0.88);
        K.slamText(F, c, "FOUNDER!", W / 2, port ? F.PT + 110 * S + o.size * K.CAP.cond : 0.955 * H, ws[3].s, { ...o, ...POP, from: 1.06, pre: 0.1 });
        K.shadow(c, port ? W / 2 : 0.66 * W, port ? 0.985 * H : 0.975 * H, port ? 0.3 * W : 0.2 * W, "light");
        K.burnTag(F, c, ws[0], port ? R.x + R.w * 0.6 : 0.04 * W, port ? F.PT + 40 * S : 0.47 * H, { color: INK, unit: " TOKENS", size: 34, hold: 1.25 });
      });
      F.plate(v, op);
    } });

    // ---------------------------------------------------------------------------------------- 2 · GANG: stadium rows, held
    S1.push({ a: T[1], b: T[2], look: "A", draw(F) {
      const { port } = F, gw = w(1, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.35 });
        K.wallTiers(F, c, gw.s, port ? { base: 250, rows: 16, speed: 24, bottom: 1.02, shrink: 0.88, fade: 0.05, jumpAmp: 0 } : { base: 330, rows: 10, speed: 30, bottom: 1.08, jumpAmp: 0 });
      });
    } });

    // ---------------------------------------------------------------------------------------- 3 · I CAN'T COME OUT TONIGHT. + her note
    const NOTE3 = 46.0; // right after "tonight." (ends 45.994)
    S1.push({ a: T[2], b: T[3], look: "C", clips: lin(cu, T[2], 2.1), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v, lt] = F.cl[0];
      const dr = 1 + 0.05 * clamp((F.t - T[2]) / (T[3] - T[2])); // linear slow push
      const op = port
        ? K.frameSub(E, v, { h: 0.5 * H * dr, au: 0.66, av: 0.996, cx: 0.64 * W, bottom: 0.935 * H }) // cap under TONIGHT., nose ≈0.62H
        : K.frameSub(E, v, { h: 1.04 * H * dr, au: 0.66, av: 0.996, cx: 0.78 * W, bottom: 1.04 * H });
      const ws = L[2].words;
      const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
      const x0 = port ? R.x + R.w * 0.03 : 0.045 * W;
      const sz = port ? [140, 96, 140] : [260, 140, 220];
      const y1 = port ? F.PT + 100 * S : 0.335 * H, y2 = port ? y1 + 100 * S : 0.47 * H, y3 = port ? y2 + 122 * S : 0.66 * H;
      F.back((c) => {
        K.groundC(F, c);
        const iw = E.measure(c, "I ", { ...hero, size: sz[0] * S }), cantW = E.measure(c, "CAN'T", { ...hero, size: sz[0] * S });
        K.slamText(F, c, "I", x0, y1, ws[0].s, { ...hero, size: sz[0] * S, color: INK, ...POP });
        K.slamText(F, c, "CAN'T", x0 + iw, y1, ws[1].s, { ...hero, size: sz[0] * S, color: INK, ...POP });
        const cw = E.measure(c, "COME ", { ...hero, size: sz[1] * S });
        K.slamText(F, c, "COME", x0, y2, ws[2].s, { ...hero, size: sz[1] * S, color: INK, ...POP });
        K.slamText(F, c, "OUT", x0 + cw, y2, ws[3].s, { ...hero, size: sz[1] * S, color: INK, ...POP });
        const ts = port ? K.fit(F, c, "TONIGHT.", { ...hero, size: sz[2] * S }, R.w * 0.95) : sz[2] * S;
        K.slamText(F, c, "TONIGHT.", x0, y3, ws[4].s, { ...hero, size: ts, color: C.white, ...POP });
        // HER comeback, part 1: her coral underline under his CAN'T
        if (t >= NOTE3) B.penUnderline(c, x0 + iw, y1 + sz[0] * S * 0.13, x0 + iw + cantW, t, NOTE3, { width: 10 * S, seed: 4, dur: 0.14 });
      });
      F.plate(v, op);
      // tracked chip on his open palm (pose 16): the 44.70 downbeat → 45.95 (1.25 s), gone before her note lands
      if (t >= 44.68 && t < 46.0) F.front((c) => {
        const p = K.lmScreen(E, v, lt, 16, op);
        const u = K.ease.outBack(clamp((t - 44.7) / 0.16)), a = 1 - clamp((t - 45.9) / 0.05);
        if (p) chip(F, c, p[0] + 20 * S, p[1] - (port ? 50 : 70) * S, "TONIGHT · BUSY", Math.max(0.92, u), Math.min(u, a));
      });
      // HER comeback, part 2: "of course you can't" on an ink sticker, slapped over the frame (never over his face)
      if (t >= NOTE3) F.front((c) => sticker(F, c, "of course you can't", x0 - 6 * S, port ? 0.585 * H : 0.86 * H, (port ? 50 : 100) * S, t, NOTE3));
    } });

    // ---------------------------------------------------------------------------------------- 4 · LOCKUP #1, held (he stands behind the board)
    S1.push({ a: T[3], b: T[4], look: "A", clips: warped(chant, kL4), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v] = F.cl[0];
      const op = port
        ? K.frameSub(E, v, { h: 0.95 * H * drift(F, T[3], T[4]), cx: 0.5 * W, ay: 0.19 * H, av: 0.104 })
        : K.frameSub(E, v, { h: 1.6 * H * drift(F, T[3], T[4]), cx: 0.5 * W, ay: 0.05 * H, av: 0.104 });
      const cx = port ? R.x + R.w / 2 : W / 2, cy = port ? R.y + R.h * 0.72 : 0.7 * H;
      const size = port ? 74 : 124;
      F.back((c) => K.groundA(F, c));
      F.plate(v, op);
      F.front((c) => {
        K.lockup(F, c, L[3].words, cx, cy, { size, band: C.bg, bandPad: port ? 16 : 26, seed: 3, lead: 0.4, build: 0.56 }); // legible on the onset (reveal 0.71)
        const bx = K.lockupBox(E, c, cx, cy, size); // the board runs to the bottom: he stands behind it
        c.fillStyle = C.bg; c.fillRect(0, bx.bot + (port ? 16 : 26) * S, W, H);
        B.hairGrid(c, 0, bx.bot + (port ? 16 : 26) * S, W, H, { step: 96 * S, alpha: 0.35 });
      });
    } });

    // ---------------------------------------------------------------------------------------- 5 · I'M AN AI FOUNDER! (outline → fill)
    S1.push({ a: T[4], b: T[5], look: "C", clips: warped(dance, kDance), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v] = F.cl[0];
      const dr = drift(F, T[4], T[5], 0.03);
      const op = port
        ? K.frameSub(E, v, { h: 0.52 * H * dr, cx: 0.5 * W, bottom: 0.99 * H })
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
        K.burnTag(F, c, ws[0], port ? R.x + R.w * 0.6 : 0.37 * W, port ? F.PT + 10 * S : 0.17 * H, { color: INK, unit: " TOKENS", size: 30, hold: 1.25 });
      });
      F.plate(v, op);
    } });

    // ---------------------------------------------------------------------------------------- 6 · GANG: one stadium wave
    S1.push({ a: T[5], b: T[6], look: "A", draw(F) {
      const { port } = F, gw = w(5, 0);
      F.back((c) => {
        K.groundA(F, c, { gridA: 0.3 });
        K.wallWave(F, c, gw.s - 0.05, { cols: port ? 2 : 4, rows: port ? 11 : 7, base: 170, dur: 0.6, calm: true });
      });
    } });

    // ---------------------------------------------------------------------------------------- 7 · NO DATING TILL SERIES B. + the funding-stage track
    S1.push({ a: T[6], b: T[7], look: "C", draw(F) {
      const { E, S, W, H, R, port } = F, ws = L[6].words;
      F.back((c) => {
        K.groundC(F, c);
        const hero = { ...K.HERO, baseline: "alphabetic", align: "left" };
        const x0 = port ? R.x + R.w * 0.03 : 0.045 * W;
        const s1 = port ? K.fit(F, c, "NO DATING", { ...hero, size: 200 * S }, R.w * 0.96) : 270 * S;
        const s2 = port ? K.fit(F, c, "TILL SERIES B.", { ...hero, size: 140 * S }, R.w * 0.96) : 170 * S;
        const y1 = port ? F.PT + s1 * 0.78 : 0.34 * H, y2 = port ? y1 + s2 * 1.15 : 0.55 * H;
        const nw = E.measure(c, "NO ", { ...hero, size: s1 });
        K.slamText(F, c, "NO", x0, y1, ws[0].s, { ...hero, size: s1, color: INK, ...POP });
        K.slamText(F, c, "DATING", x0 + nw, y1, ws[1].s, { ...hero, size: s1, color: INK, ...POP });
        const tw = E.measure(c, "TILL ", { ...hero, size: s2 }), sw = E.measure(c, "SERIES ", { ...hero, size: s2 });
        K.slamText(F, c, "TILL", x0, y2, ws[2].s, { ...hero, size: s2, color: INK, ...POP });
        K.slamText(F, c, "SERIES", x0 + tw, y2, ws[3].s, { ...hero, size: s2, color: C.white, ...POP });
        K.slamText(F, c, "B.", x0 + tw + sw, y2, ws[4].s, { ...hero, size: s2, color: C.white, ...POP });
        const tg = trackGeo(F);
        stageTrack(F, c, tg.y, tg.x0, tg.x1);
      });
    } });

    // ---------------------------------------------------------------------------------------- 8 · LOCKUP #2 + "babe, you're pre-seed" + PRE-SEED stamp
    // Landscape: lockup left, him_cu_talk deadpan right. Portrait: his close-up sits in a video-call window inside the safe band.
    const NOTE8 = 53.8, STAMP8 = 54.7;
    S1.push({ a: T[7], b: T[8], look: "A", clips: lin(cu, T[7], 0.55), draw(F) {
      const { E, t, S, W, H, R, port } = F, [v] = F.cl[0];
      const dr = drift(F, T[7], 56.12, 0.04);
      const win = { x: R.x + R.w * 0.47, y: 0.425 * H, w: R.w * 0.51, h: 0.215 * H };
      let op;
      if (port) { // crop of his head and shoulders with the window's aspect; the crop's bottom edge = the window's bottom edge
        const ca = win.w / win.h, ch = 0.6 / dr, cw = (ch * v.meta.h * ca) / v.meta.w, cx0 = 0.655 - cw / 2;
        op = { fit: "contain", crop: [cx0, 0.02, cw, ch], zoom: win.w / E.W, x: (win.x + win.w / 2 - E.W / 2) / S, y: (win.y + win.h / 2 - E.H / 2) / S, matte: true, feather: 0.12 };
      } else op = K.frameSub(E, v, { h: 0.98 * H * dr, au: 0.66, av: 0.996, cx: 0.84 * W, bottom: 1.02 * H });
      const lx = port ? R.x + R.w / 2 : 0.3 * W, ly = port ? F.PT + 95 * S : 0.315 * H, size = port ? 72 : 124;
      const nx = port ? R.x + R.w * 0.03 : 0.045 * W, ny = port ? 0.405 * H : 0.585 * H, ns = (port ? 54 : 96) * S;
      const tg = trackGeo(F), node0 = tg.n0; // his PRE-SEED node
      F.back((c) => {
        K.groundA(F, c);
        K.lockup(F, c, L[7].words, lx, ly, { size, seed: 5, lead: 0.36, build: 0.5 });
        stageTrack(F, c, tg.y, tg.x0, tg.x1, { ink: C.whiteA(0.78), lit: C.green, dating: false }); // carried over from line 7, settled
        if (port) { // the call window
          c.fillStyle = C.panel; c.strokeStyle = C.line; c.lineWidth = Math.max(1, 2 * S);
          c.beginPath(); c.roundRect(win.x, win.y, win.w, win.h, 14 * S); c.fill(); c.stroke();
          B.hairGrid(c, win.x, win.y, win.w, win.h, { step: 40 * S, alpha: 0.45 });
        }
        B.penNote(E, c, "babe, you're pre-seed", nx, ny, t, NOTE8, { size: ns, cps: 70, rot: -0.035 }); // complete by 54.10: 2.0 s on screen
        B.stamp(E, c, "PRE-SEED", node0, tg.y + (port ? 4 : 8) * S, t, STAMP8, { S, size: port ? 50 : 80, rot: -0.14 }); // on his node
      });
      F.plate(v, op);
      F.front((c) => {
        if (port) { // window chrome over the feed: name tag + mic-off dot
          E.drawText(c, "FOUNDER_01", win.x + 16 * S, win.y + win.h - 20 * S, { ...K.MONO, size: 18 * S, color: C.white, align: "left" });
          c.fillStyle = C.coral; c.beginPath(); c.arc(win.x + win.w - 22 * S, win.y + 22 * S, 7 * S, 0, 6.2832); c.fill();
          c.strokeStyle = C.line; c.lineWidth = Math.max(1, 2 * S); c.beginPath(); c.roundRect(win.x, win.y, win.w, win.h, 14 * S); c.stroke();
        }
      });
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
    // the funding-stage track's geometry, shared by shots 7 and 8 so it holds still across the cut
    function trackGeo(F) {
      const { W, H, R, port } = F;
      const S = F.S, g = port ? { y: R.y + R.h * 0.8, x0: R.x + R.w * 0.03, x1: R.x + R.w * 0.97 } : { y: 0.73 * H, x0: 0.045 * W, x1: 0.955 * W };
      g.n0 = g.x0 + (port ? 100 : 310) * S; g.n1 = g.x1 - (port ? 110 : 95) * S; // first / last node
      return g;
    }
    // HER note on green: coral serif on an ink sticker (coral on signal green is too low-contrast), written from t0
    function sticker(F, c, text, x, y, size, t, t0) {
      const { E, S } = F, f = { font: FONT.serif, italic: true, weight: 400, size };
      const tw = E.measure(c, text, f), pad = size * 0.32, a = clamp((t - t0) / 0.1);
      c.save(); c.translate(x, y); c.rotate(-0.04); c.globalAlpha = a;
      c.fillStyle = C.ink; c.fillRect(0, -size * 0.78, tw + pad * 2, size * 1.12);
      c.restore();
      B.penNote(E, c, text, x + pad, y - size * 0.22, t, t0, { size, cps: 60, rot: -0.04 }); // 19 chars in 0.32 s: complete 46.32, held 2.06 s
    }
    // funding-stage track: PRE-SEED → SEED → SERIES A → SERIES B (dating unlocks there)
    function stageTrack(F, c, y, x0, x1, opt = {}) {
      const { E, t, port } = F, ws = L[6].words, S = F.S * (port ? 0.8 : 1.35);
      const INK = opt.ink ?? C.ink, LIT = opt.lit ?? C.white; // shadows the module INK: the track can be redrawn on dark
      const st = ["PRE-SEED", "SEED", "SERIES A", "SERIES B"], n = st.length;
      const draw = clamp((t - ws[0].s) / 0.15); // the rule draws on fast so the diagram reads for the whole line
      c.fillStyle = INK; c.fillRect(x0, y - 3 * S, (x1 - x0) * draw, 6 * S);
      const lab = { ...K.MONO, size: (port ? 34 : 52) * F.S, color: INK, align: "center", tracking: port ? 0.02 : 0.08 };
      const g = trackGeo(F), xs = (i) => lerp(g.n0, g.n1, i / (n - 1));
      for (let i = 0; i < n; i++) {
        const x = xs(i), on = draw >= i / (n - 1) - 0.01;
        if (!on) continue;
        const last = i === n - 1, lit = last && t >= ws[3].s;
        c.fillStyle = lit ? LIT : INK; c.beginPath(); c.arc(x, y, (last ? 22 : 14) * S, 0, 6.2832); c.fill();
        if (lit) { c.strokeStyle = INK; c.lineWidth = 5 * S; c.stroke(); }
        E.drawText(c, st[i], x, y + (port ? 44 : 64) * F.S, { ...lab, color: INK });
        // DATING row: ✕ above the first three on "dating", padlock at SERIES B (opens on "B.")
        const rowY = y - 76 * S;
        if (opt.dating === false) continue; // shot 8: the DATING row already read in line 7
        if (!last && t >= ws[1].s) { const u = clamp((t - ws[1].s - i * 0.03) / 0.08); if (u > 0) cross(c, x, rowY, 17 * S * Math.max(0.92, u), 7 * S, INK); }
        if (last && t >= ws[1].s) padlock(c, x, rowY - 4 * S, t >= ws[4].s, S, INK);
      }
      if (t >= ws[1].s && opt.dating !== false) {
        const k = K.slam(t, ws[1].s, { from: 1.2 });
        if (port) E.drawText(c, "DATING", x0, y - 76 * S - 50 * F.S, { ...lab, align: "left", size: 38 * F.S, s: k ? k.sc : 1 }); // above the row
        else E.drawText(c, "DATING", x0, y - 76 * S, { ...lab, align: "left", size: 46 * F.S, s: k ? k.sc : 1 });
      }
      // his marker under PRE-SEED
      if (draw > 0.02) {
        const x = xs(0);
        const yy = y + (port ? 70 : 100) * F.S;
        c.fillStyle = INK; c.beginPath(); c.moveTo(x - 12 * S, yy + 18 * S); c.lineTo(x + 12 * S, yy + 18 * S); c.lineTo(x, yy); c.fill();
        E.drawText(c, "YOU", x, yy + 18 * S + (port ? 26 : 30) * F.S, { ...lab, size: (port ? 36 : 44) * F.S });
      }
    }
    function cross(c, x, y, r, lw, ink = INK) {
      c.save(); c.strokeStyle = ink; c.lineWidth = lw; c.lineCap = "round"; c.beginPath();
      c.moveTo(x - r, y - r); c.lineTo(x + r, y + r); c.moveTo(x + r, y - r); c.lineTo(x - r, y + r); c.stroke(); c.restore();
    }
    function padlock(c, x, y, open, S, ink = INK) {
      const w = 46 * S, h = 36 * S;
      c.save(); c.fillStyle = ink; c.strokeStyle = ink; c.lineWidth = 7 * S;
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
      const k = K.slam(t, wd.s, POP);
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
