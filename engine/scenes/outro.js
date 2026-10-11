// OUTRO · 134.50-147.80 · HUD "CHECKOUT" · look A, then the only pure #000 in the video. Owner: A6.
// He bails, she slides him the check, his last tokens burn on his own apology, the song runs out of tokens on
// "tokens", and she pays (the tap itself lands on the chime in endcard.js).
//
// GRID  downbeats 134.50 136.42 138.32 140.22 142.12 · beats 134.98 135.46 135.94 136.88 137.36 137.84 138.80 139.26
//       139.74 140.70 141.18 141.64 142.60 143.08 143.56 · music_stop 143.996 (no beats until 148.37)
// METER brand.tokensAt: 60,000 at 134.50 → his 7 words burn ~2.5K each → 40,063 at 142.12 → the drain (inQuad)
//       from "...Sorry." 142.593 hits exactly 0 at 143.996.
//
// PLAN  t        word / event                visual                                                    layer
// S1  134.500 DB  (hard cut in)               date_table again, clip 4.00→5.92 s (his hands drop ≈135.6) BACK grid, shadow
//     135.066     Anyway.                     ANYWAY. white Inter Tight 900, tucked behind his cap        MID (matte)
//     135.366     Gotta                       ANYWAY. clears 3× fast; GOTTA lands                         MID
//     136.066     go.                         GO. lands; at 136.27 GOTTA GO. bolts off right (he's leaving) MID
// S2  136.420 DB  (cut)                       him_gottago: half-turn, finger guns, wink                   plate
//     137.066     See / 137.466 you /         SEE YOU AFTER TOKENS (brand.afterTokens, small + dry) in      MID, rules pass
//     137.646 after / 137.846 tokens.         the empty left half; finger-gun ticks at his fingertip,      behind him;
//                                             a wink spark at his eye (pose 19/20, 2/5)                    FRONT tracked
// S3  138.320 DB  (cut)                       her_whopays: she slides the bill folder right               plate
//     138.32→138.95                           THE CHECK slides out from under her fingers (tracked) and    FRONT
//                                             lands in the right half: itemised from the meter, TOTAL DUE
//                                             1,000,000 TOKENS, check #402 (402 = payment required)
//     138.989 So... / 139.458 who's /         her line handwritten on the check, coral serif, per word    FRONT
//     140.382 paying / 140.590 for /          140.382 pen arrow from her note to the total
//     140.854 our / 141.043 date?             141.043 pen circle round 1,000,000; 141.18 / 141.64 her two taps
// S4  142.120 DB  (cut)                       him_outoftokens: frozen smile, pats the empty pocket         plate
//                                             giant meter (HUD meter off): LOW BALANCE blinking per beat,  MID
//                                             pixel counter 40,063 rolling down, usage bar, burn rate
//     142.593 ...Sorry. / 143.393 I'm /       each word leaves his mouth as a cost tag (SORRY. −13,026 …)  FRONT tracked
//     143.713 out / 143.813 of                and flies into the counter: talking is what burns his tokens  (pose 9/10)
// S5  143.996     MUSIC STOPS → HARD CUT      pure #000, HUD off. Only the counter's "0" stays where it was
//     144.020     tokens.                     TOKENS lands beside it + USAGE BLOCKED, pixel-grid coral     —
//     144.0-145.4 silence                     block cursor blinks 1 Hz; "0 / 1,000,000 · LIMIT RESETS IN
//                                             4:59:59" types on and ticks: alive, minimal
// S6  145.466     Cute. (cut)                 her_pays in the blocked void: "Cute." huge coral serif;      herpays.js
//     146.006 Hold / 146.666 my /             "Hold my matcha." + pen arrow tracked to the cup she hands    FRONT tracked
//     146.846 matcha.                         off to the right (callback to "Hold my Celsius.")
//     147.800     → endcard.js continues the take: the tap on the chime 147.816
import { B, slot, clipT, unionBox, frameBox, poseMid, smoothPt, punch, groundA, contactShadow, label, blinkOn, pixelCount, pixelCountSize, pixelBlock, CORAL_LINE, checkItems, buildCheck, clamp, lerp, ease } from "./outro/lib.js";
import { surfaces } from "./outro/surf.js";
import * as HP from "./outro/herpays.js";

const CUT = { s1: 134.5, s2: 136.42, s3: 138.32, s4: 142.12, s5: B.EV.musicStop, s6: 145.466 };
// clip keys (song t → clip t). Clips that haven't landed use stand-ins; retune when they arrive.
// date_table: his hands drop at ~5.1 s ("Gotta go."). him_gottago: wink 0-1.0 s, finger gun held to 1.75 s.
// her_whopays: slides 0-3.4 s, lifts her fingers 3.54 s, taps the folder 4.08 s (= 141.80). him_outoftokens: pocket
// pat 0.5-1.9 s, then a crash zoom on the beat 143.56 to his shock face (3.12 s →).
const K = {
  s1: [[134.5, 4.0]],
  s2: [[136.42, 0.0]],
  s3: [[138.32, 0.6]],
  s4: [[142.12, 0.55]],
  s4b: [[143.56, 3.12]],
};
const ZOOM4 = 143.56, TAP3 = 141.8;
let W, slots = {}, box = {}, chk = null;

function shotAt(t) {
  return t < CUT.s2 ? 1 : t < CUT.s3 ? 2 : t < CUT.s4 ? 3 : t < CUT.s5 ? 4 : t < CUT.s6 ? 5 : 6;
}

export default {
  async load(E) {
    surfaces(E);
    W = E.words.filter((w) => w.section === "outro");
    const pairs = [["s1", "date_table"], ["s2", "him_gottago"], ["s3", "her_whopays"], ["s4", "him_outoftokens"]];
    for (const [k, name] of pairs) {
      slots[k] = await slot(E, name);
      const v = slots[k].v, t0 = CUT[k], t1 = { s1: CUT.s2, s2: CUT.s3, s3: CUT.s4, s4: ZOOM4 }[k];
      box[k] = v ? unionBox(v, clipT(v, K[k], t0), clipT(v, K[k], t1)) : [0.2, 0.05, 0.8, 1];
    }
    chk = buildCheck(E, checkItems(E));
    await HP.load(E);
  },
  async prepare(E, t) {
    const sh = shotAt(t);
    if (sh <= 4) { const k = "s" + sh, v = slots[k].v; if (v) await v.frame(clipT(v, keys4(k, t), t)); }
    else if (sh === 6) await HP.prepare(E, t);
  },
  render(E, t, rt) {
    const sh = shotAt(t);
    E.renderer.setRenderTarget(rt);
    if (sh === 1) s1(E, t, rt);
    else if (sh === 2) s2(E, t, rt);
    else if (sh === 3) s3(E, t, rt);
    else if (sh === 4) s4(E, t, rt);
    else if (sh === 5) s5(E, t, rt);
    else HP.render(E, t, rt);
  },
};

// ------------------------------------------------------------------------------------------------ helpers
const wide = (E) => E.ORIENT === "landscape";
const keys4 = (k, t) => (k === "s4" && t >= ZOOM4 ? K.s4b : K[k]);
function plateOpts(E, k, tgt) {
  const v = slots[k].v;
  return v ? frameBox(E, v, box[k], tgt) : null;
}
function begin(E, rt) {
  const [g1, g2] = surfaces(E);
  g1.clear();
  return g1.ctx;
}
function mid(E, rt, k, opts) {
  const [g1, g2] = surfaces(E);
  g1.commit();
  E.renderer.setRenderTarget(rt);
  E.blitG2D(E, g1, 1);
  const v = slots[k]?.v;
  if (v && opts) E.drawPlate(E, v, { ...opts, matte: true });
  g2.clear();
  return g2.ctx;
}
function end(E) {
  const [, g2] = surfaces(E);
  g2.commit();
  E.blitG2D(E, g2, 1);
}
const hype = (S, size, color = B.C.white) => ({ font: B.FONT.hero, weight: 900, size, tracking: -0.035, color });

// ------------------------------------------------------------------------------------------------ S1 the table again
function s1(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = slots.s1.v;
  const tgt = wide(E) ? { h: 0.75 * E.H, y1: 0.995 * E.H, cx: 0.5 * E.W } : { h: 0.42 * E.H, y1: 0.8 * E.H, cx: 0.5 * E.W };
  let opts = plateOpts(E, "s1", tgt);
  if (v) opts = punch(E, v, opts, [0.5, 0.6], 1 + 0.05 * ease.inOutQuad(clamp((t - CUT.s1) / (CUT.s2 - CUT.s1)))); // slow push-in
  const c = begin(E, rt);
  groundA(c, E, t, { offY: (t - CUT.s1) * 10 * S });
  if (v) {
    const r = E.plateRect(E, v, opts), bx = box.s1, fx = r.x + ((bx[0] + bx[2]) / 2) * r.w, fy = r.y + bx[3] * r.h;
    // a pool of light on the floor under the table (the last table lit in the room), then the contact shadow
    c.save(); c.translate(fx, fy - 20 * S); c.scale(1, 0.16);
    const pool = c.createRadialGradient(0, 0, 0, 0, 0, (bx[2] - bx[0]) * r.w * 0.75);
    pool.addColorStop(0, "rgba(146,231,89,0.10)"); pool.addColorStop(0.6, "rgba(146,231,89,0.035)"); pool.addColorStop(1, "rgba(146,231,89,0)");
    c.fillStyle = pool; c.beginPath(); c.arc(0, 0, (bx[2] - bx[0]) * r.w * 0.75, 0, 6.2832); c.fill(); c.restore();
    contactShadow(c, fx, fy - 6 * S, (bx[2] - bx[0]) * r.w * 0.55, 34 * S, 0.6);
  }
  // MID: ANYWAY. → GOTTA GO. (one hero at a time), its baseline tucked behind his cap
  const y = wide(E) ? 0.165 * E.H : R.y + R.h * 0.24;
  const size = wide(E) ? 230 * S : E.fitSize(c, "ANYWAY.", hype(S, 230 * S), R.w * 0.9);
  const [wA, wG, wGo] = [W[0], W[1], W[2]];
  if (t >= wA.s - 0.05 && t < wG.s) {
    const out = 1 - clamp((t - (wG.s - 0.06)) / 0.05);
    E.drawText(c, "ANYWAY.", E.W / 2, y, { ...hype(S, size), align: "center", s: E.popScale(t, wA.s, { from: 1.3, k: 320, z: 0.5 }), alpha: E.wordAlpha(t, wA.s, 1e9) * out });
  }
  if (t >= wG.s - 0.05) {
    const f = hype(S, size), wg = E.measure(c, "GOTTA ", f), wgo = E.measure(c, "GO.", f), x0 = E.W / 2 - (wg + wgo) / 2;
    const bolt = ease.inCubic(clamp((t - (wGo.e + 0.0)) / 0.15)) * E.W * 1.1; // he's leaving: the words bolt right
    E.drawText(c, "GOTTA", x0 + bolt, y, { ...f, align: "left", s: 1, sx: E.popScale(t, wG.s, { from: 1.25 }), alpha: E.wordAlpha(t, wG.s, 1e9) });
    if (t >= wGo.s - 0.05) E.drawText(c, "GO.", x0 + wg + bolt * 1.15, y, { ...f, align: "left", color: B.C.green, s: E.popScale(t, wGo.s, { from: 1.3 }), alpha: E.wordAlpha(t, wGo.s, 1e9) });
  }
  const f = mid(E, rt, "s1", opts);
  end(E);
  E.hud.sub = false;
}

// ------------------------------------------------------------------------------------------------ S2 gotta go
function s2(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = slots.s2.v, lt = v ? clipT(v, K.s2, t) : 0;
  const tgt = wide(E) ? { h: 0.95 * E.H, y1: 1.0 * E.H, x0: 0.5 * E.W } : { h: 0.5 * E.H, y1: 0.92 * E.H, cx: 0.55 * E.W };
  const opts = plateOpts(E, "s2", tgt), c = begin(E, rt);
  groundA(c, E, t, { offX: -(t - CUT.s2) * 14 * S });
  // MID: SEE YOU AFTER TOKENS, small and dry, in the empty half; its rules pass behind him
  const ws = W.slice(3, 7);
  if (t >= ws[0].s - 0.1) {
    const cx = wide(E) ? 0.285 * E.W : R.x + R.w / 2, cy = wide(E) ? 0.44 * E.H : R.y + R.h * 0.2;
    B.afterTokens(E, c, cx, cy, t, { size: wide(E) ? 86 : 66, words: ws, seed: 11 });
  }
  const f = mid(E, rt, "s2", opts);
  // FRONT: his finger gun "fires" each word of the lockup (it points straight at it); a wink spark at the head of the take
  if (v) {
    for (const w of ws) {
      const u = (t - (w.s - 0.02)) / 0.24;
      if (u < 0 || u > 1) continue;
      const p = smoothPt(v, lt, 20) ?? smoothPt(v, lt, 16);
      if (!p) continue;
      const [x, y] = E.plateToScreen(E, v, p, opts), e = ease.outCubic(u);
      f.save(); f.strokeStyle = B.C.green; f.lineWidth = 5 * S; f.lineCap = "round"; f.globalAlpha = 1 - u * u;
      for (let k = -1; k <= 1; k++) {
        const a = Math.PI + k * 0.5, r0 = (34 + 46 * e) * S, r1 = (70 + 80 * e) * S;
        f.beginPath(); f.moveTo(x - 20 * S + Math.cos(a) * r0, y + Math.sin(a) * r0); f.lineTo(x - 20 * S + Math.cos(a) * r1, y + Math.sin(a) * r1); f.stroke();
      }
      f.restore();
    }
    const tw = CUT.s2 + 0.06, uw = (t - tw) / 0.55; // the wink is at the head of the take
    if (uw > 0 && uw < 1) {
      const p = smoothPt(v, lt, 2) ?? smoothPt(v, lt, 5);
      if (p) {
        const [x, y] = E.plateToScreen(E, v, [p[0] - 0.035, p[1] - 0.035], opts), k = Math.sin(uw * Math.PI), rr = 30 * S * k;
        f.save(); f.fillStyle = B.C.white; f.globalAlpha = k; f.translate(x, y); f.rotate(uw * 0.6); f.beginPath();
        for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4, rad = i % 2 ? rr * 0.28 : rr; f.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
        f.closePath(); f.fill(); f.restore();
      }
    }
  }
  end(E);
  E.hud.sub = false;
}

// ------------------------------------------------------------------------------------------------ S3 the check
function s3(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = slots.s3.v, lt = v ? clipT(v, K.s3, t) : 0;
  const tgt = wide(E) ? { h: 0.97 * E.H, y1: 1.0 * E.H, x0: 0.03 * E.W } : { h: 0.4 * E.H, y1: 0.92 * E.H, cx: 0.38 * E.W };
  const opts = plateOpts(E, "s3", tgt), c = begin(E, rt);
  groundA(c, E, t, { offY: -(t - CUT.s3) * 8 * S });
  // the table: her_whopays ends in a hard horizontal cut at y≈906 px (an invisible table edge) with the folder on the
  // same plane, so a tabletop goes under her (her elbow and the folder rest on it)
  if (v) {
    const ty = E.plateToScreen(E, v, [0, 906 / 1080], opts)[1];
    const gr = c.createLinearGradient(0, ty, 0, E.H);
    gr.addColorStop(0, "#2B2E2A"); gr.addColorStop(1, "#1A1C19");
    c.fillStyle = gr; c.fillRect(0, ty, E.W, E.H - ty);
    c.fillStyle = "#4A4D47"; c.fillRect(0, ty, E.W, Math.max(1, 2 * S));
    c.fillStyle = B.C.greenA(0.35); c.fillRect(0, ty + 9 * S, E.W, Math.max(1, S));
  }
  const f = mid(E, rt, "s3", opts);
  // the check: from under her fingers to its spot
  const sc = wide(E) ? 1 : 0.8, cw = chk.w * sc, ch = chk.h * sc;
  const X1 = wide(E) ? 0.575 * E.W : R.x + R.w / 2 - cw / 2, Y1 = wide(E) ? 0.07 * E.H : R.y + 18 * S;
  const tip = v ? (smoothPt(v, lt, 20) ?? smoothPt(v, lt, 16) ?? [0.42, 0.85]) : [0.42, 0.85];
  const [hx, hy] = v ? E.plateToScreen(E, v, tip, opts) : [0.4 * E.W, 0.85 * E.H];
  const u = ease.outCubic(clamp((t - CUT.s3) / 0.62));
  const x = lerp(hx - 40 * S, X1, u), y = lerp(hy - ch * 0.3, Y1, u), rot = lerp(-0.16, -0.028, u), k = lerp(0.82, 1, u);
  f.save();
  f.translate(x + cw / 2, y + ch / 2); f.rotate(rot); f.scale(k * sc, k * sc); f.translate(-chk.w / 2, -chk.h / 2);
  f.drawImage(chk.cv, 0, 0);
  // live: the total, her handwriting, her pen
  E.drawText(f, "1,000,000", chk.pad - 4 * S, chk.totalY - 30 * S, { font: B.FONT.mono, weight: 800, size: 88 * S, tracking: -0.02, color: B.C.ink, align: "left" });
  const note = { font: B.FONT.serif, italic: true, weight: 400, size: 62 * S, color: B.C.coral, align: "left", stroke: 1.2 * S, strokeColor: B.C.coral };
  const lines = [[W[7], W[8], W[9]], [W[10], W[11], W[12]]];
  lines.forEach((ln, li) => {
    let xx = chk.pad, yy = chk.noteY + li * 74 * S;
    for (const w of ln) {
      const txt = w.w + " ", ww = E.measure(f, txt, note);
      if (t >= w.s - 0.04) {
        const p = clamp((t - (w.s - 0.04)) / 0.11);
        f.save(); f.beginPath(); f.rect(xx - 6 * S, yy - 60 * S, (ww + 12 * S) * p, 110 * S); f.clip();
        E.drawText(f, txt, xx, yy, { ...note, rot: -0.03 });
        f.restore();
      }
      xx += ww;
    }
  });
  const tw = E.measure(f, "1,000,000", { font: B.FONT.mono, weight: 800, size: 88 * S, tracking: -0.02 });
  B.penArrow(f, chk.pad + 300 * S, chk.noteY - 46 * S, chk.pad + tw + 40 * S, chk.totalY - 10 * S, t, W[9].s, { dur: 0.18, width: 5 * S, bend: 0.35, seed: 3 });
  B.penCircle(f, chk.pad + tw / 2 - 4 * S, chk.totalY - 34 * S, tw * 0.6, 62 * S, t, W[12].s, { dur: 0.28, width: 6 * S, seed: 5 });
  B.penUnderline(f, chk.pad, chk.totalY + 24 * S, chk.pad + tw, t, TAP3 - 0.02, { dur: 0.1, width: 5 * S, seed: 13 });
  B.penUnderline(f, chk.pad + 10 * S, chk.totalY + 40 * S, chk.pad + tw - 20 * S, t, TAP3 + 0.1, { dur: 0.1, width: 5 * S, seed: 17 });
  f.restore();
  // her tap on the folder: a small coral ring at her fingertips
  if (v && t >= TAP3 - 0.02 && t < TAP3 + 0.4) {
    const p = smoothPt(v, lt, 19) ?? [0.64, 0.76], [px, py] = E.plateToScreen(E, v, p, opts), u = (t - TAP3 + 0.02) / 0.42;
    f.save(); f.globalAlpha = 1 - u; f.strokeStyle = B.C.coral; f.lineWidth = 4 * S;
    f.beginPath(); f.arc(px, py + 10 * S, (14 + 60 * ease.outCubic(u)) * S, 0, 6.2832); f.stroke(); f.restore();
  }
  end(E);
  E.hud.sub = false;
}

// ------------------------------------------------------------------------------------------------ S4 out of tokens
function meterLay(E) {
  const S = E.SCALE, R = E.SAFE, cell = Math.max(2, Math.round(8 * S));
  return wide(E)
    ? { x0: 0.07 * E.W, y: 0.36 * E.H, rows: 20, cell, sub: 9, logY: 0.07 * E.H, logH: 0.06 * E.H }
    : { x0: R.x + 34 * S, y: R.y + R.h * 0.36, rows: 13, cell, sub: 7, logY: R.y + 30 * S, logH: 52 * S };
}
function s4(E, t, rt) {
  const S = E.SCALE, R = E.SAFE, v = slots.s4.v, lt = v ? clipT(v, keys4("s4", t), t) : 0, M = meterLay(E);
  const tgt = wide(E) ? { h: 0.93 * E.H, y1: 1.0 * E.H, x1: 0.965 * E.W } : { h: 0.42 * E.H, y1: 0.88 * E.H, cx: 0.5 * E.W };
  let opts = plateOpts(E, "s4", tgt);
  if (v && t >= ZOOM4) opts = punch(E, v, opts, [0.5, 0.36], 1.24); // crash zoom on his face on the beat
  const c = begin(E, rt);
  groundA(c, E, t, { offY: (t - CUT.s4) * 12 * S });
  // MID: the giant meter (reads brand.tokensAt), coral = LOW BALANCE
  const val = B.tokensAt(E, t), o = { rows: M.rows, cell: M.cell, color: B.C.coral, line: CORAL_LINE };
  const blink = E.beat(t).i % 2 === 0 ? 1 : 0.35;
  label(E, c, "LOW BALANCE", M.x0, M.y - 40 * S, { size: wide(E) ? 30 : 26, color: B.C.coral, alpha: blink, tracking: 0.16 });
  const sz = pixelCount(c, B.fmtInt(val), M.x0, M.y, o);
  const bw = wide(E) ? 0.42 * E.W : R.w - 68 * S, by = M.y + M.rows * M.cell + 40 * S, bh = 14 * S;
  c.fillStyle = B.C.line; c.fillRect(M.x0, by, bw, bh);
  c.fillStyle = B.C.coral; c.fillRect(M.x0, by, bw * clamp(val / 60000), bh);
  for (let i = 1; i < 10; i++) { c.fillStyle = B.C.bg; c.fillRect(M.x0 + (bw * i) / 10 - S, by, 2 * S, bh); }
  label(E, c, `BURN ${B.fmtShort(B.burnRate(E, t, 0.25))}/s`, M.x0, by + bh + 30 * S, { size: 22, weight: 600, color: B.C.coralA(0.75) });
  const f = mid(E, rt, "s4", opts);
  // FRONT: every word he says leaves his mouth as a cost tag and lands as a ledger line above the balance (entries, then
  // the balance): the apology itemised (−13,026 "SORRY." / −12,505 "I'M" / −4,762 "OUT" / −9,770 "OF"), then "TOKENS."
  // lands on black.
  const mouth = v ? (poseMid(v, lt, [9, 10]) ?? poseMid(v, lt, [0])) : null;
  const [mx, my] = mouth ? E.plateToScreen(E, v, mouth, opts) : [0.72 * E.W, 0.38 * E.H];
  const tags = [W[13], W[14], W[15], W[16]], px = (wide(E) ? 48 : 38) * S, lh = M.logH, ly0 = M.logY;
  f.font = `800 ${px}px "JetBrains Mono"`;
  f.letterSpacing = "0px";
  const amtW = f.measureText("−00,000 ").width;
  tags.forEach((w, i) => {
    const t0 = w.s - 0.04, u = clamp((t - t0) / 0.3);
    if (t < t0) return;
    const nxt = i < 3 ? tags[i + 1].s : B.EV.musicStop, cost = B.tokensAt(E, w.s) - B.tokensAt(E, nxt);
    const word = `"${w.w.replace(/^\.+/, "").toUpperCase()}"`, e = ease.outCubic(u);
    const x = lerp(mx - 40 * S, M.x0, e), y = lerp(my + 10 * S, ly0 + i * lh, e) - Math.sin(e * Math.PI) * 60 * S, s = lerp(1.25, 1, e);
    f.save(); f.translate(x, y); f.scale(s, s); f.globalAlpha = clamp(u / 0.12);
    f.font = `800 ${px}px "JetBrains Mono"`; f.textBaseline = "middle"; f.textAlign = "left"; f.letterSpacing = "0px";
    const amt = "−" + B.fmtInt(cost);
    f.fillStyle = B.C.coral; f.fillText(amt, amtW - f.measureText(amt + " ").width, 0);
    f.fillStyle = B.C.white; f.fillText(word, amtW, 0);
    f.restore();
  });
  end(E);
  E.hud.sub = false;
  E.hud.meter = false;
}

// ------------------------------------------------------------------------------------------------ S5 the blackout
function s5(E, t, rt) {
  const S = E.SCALE, M = meterLay(E), [g1] = surfaces(E), c = g1.ctx;
  g1.clear();
  c.fillStyle = B.C.void;
  c.fillRect(0, 0, E.W, E.H);
  const o = { rows: M.rows, cell: M.cell, color: B.C.coral, line: CORAL_LINE };
  const zero = pixelCount(c, "0", M.x0, M.y, o);
  const wT = W[17]; // tokens. 144.020
  const lineY = M.y + M.rows * M.cell + 54 * S;
  if (t >= wT.s - 1 / 60) {
    B.pixelText(c, "TOKENS", M.x0 + zero.w + M.rows * M.cell * 0.36, M.y, { rows: M.rows, cell: M.cell, color: B.C.coral, line: CORAL_LINE });
    const ub = B.pixelText(c, "USAGE BLOCKED", M.x0, lineY, { rows: M.sub, cell: M.cell, color: B.C.coral, line: CORAL_LINE });
    // the block cursor: alive in the silence
    if (blinkOn(t, wT.s, 1.0)) pixelBlock(c, M.x0 + ub.w + M.cell * 3, lineY, Math.round(M.sub * 0.6), M.sub, M.cell, B.C.coral, CORAL_LINE);
    // the reset clock types on and ticks (he'd have to wait five hours)
    const secs = 5 * 3600 - 1 - Math.floor(t - B.EV.musicStop), hh = Math.floor(secs / 3600), mm = Math.floor((secs % 3600) / 60), ss = secs % 60;
    const txt = `0 / 1,000,000 · LIMIT RESETS IN ${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    const n = Math.floor(clamp((t - 144.42) * 34, 0, txt.length));
    if (n > 0) label(E, c, txt.slice(0, n), M.x0, lineY + M.sub * M.cell + 52 * S, { size: wide(E) ? 24 : 22, weight: 600, color: B.C.coralA(0.7), tracking: 0.1 });
  }
  g1.commit();
  E.renderer.setRenderTarget(rt);
  E.blitG2D(E, g1, 1);
  E.hud.alpha = 0;
  E.hud.sub = false;
}
