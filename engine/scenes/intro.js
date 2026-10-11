// INTRO · 0.00-8.40 · look A (AFTER TOKENS dark) · skit 1 over a muffled party.        motion designer A1
//
// PLAN (onsets from engine/data/lyrics.json; no reliable beat until the snare build at ~5.2; downbeat 6.60)
//   t      word / event              visual                                                   layer        cut
//   0.00   (hard cut in)             POSTER: HIM cut out (party_wide, his half only, 0.6x       PLATE        S1 poster
//                                    slow-mo, can + phone at his chest). I'M AN AI / FOUNDER    MID
//                                    giant behind him (his sleeve overlaps the R), SF dateline,
//                                    green banner rules, bokeh = the party, HUD token meter;
//                                    coral bubble "THE DATE IS TYPING…" with live dots          FRONT
//   0.70   HER "Hey."                the typing bubble resolves into her coral serif line      FRONT
//   0.83-1.72 "What are you doing tonight?"  words type on at their onsets; "THE DATE · 0 TOKENS"
//   2.30   (cut, match on action)    2-shot party_wide 1x: his can push starts on the cut       PLATE        S2 can
//   2.42   HIM "Hold" 2.49 "my"      green target brackets lock on the can; HOLD MY ink tag    FRONT
//   3.02   "Celsius."                CELSIUS. green tag slapped under it; the line's burn       FRONT
//                                    (tags + leader tracked to his index finger -> the can)
//   3.95   (cut)                     him_cu_talk medium, palm-up shrug                         PLATE        S3 date
//   4.04-4.62 "I can't go on a"      HIS green "sent" bubble beside his face (tail tracked to  MID (matte)
//   4.71   "date."                   his mouth), words type on; DATE. drops a second row;
//                                    "THE FOUNDER · −N TOKENS" (his words cost, hers are free)
//   5.12   (punch-in jump cut)       same clip, tighter (portrait: the poster framing again)    PLATE        S4 title
//   5.18 "I'm" 5.54 "an" 5.60 "AI" 5.86 "founder."   the title breaks the chat format: each word shoots
//                                    out from BEHIND his head (matte) into the poster masthead;
//                                    camera punch per word; the snare build starts
//   6.60   (cut on downbeat)         her_cu_talk close-up, skeptical                           PLATE        S5 what
//   7.03 "...You're" 7.34 "a"        coral serif, set on the giant "?"'s baseline               FRONT
//   7.40   "what?"                   the "?" IS the hero: ~1100 px coral serif behind her       MID (matte)
//   7.80-8.40                        snare build: "?" trembles + creeps in, bokeh swells (the door opens)
//   8.30                             accent: "?" kick + bokeh flare; hard cut to the drop at 8.40
import * as B from "../brand.js";
import * as K from "./intro/kit.js";

let vPW, vHC, vHR, g, W_ = [];
const shotAt = (t) => (t < 2.3 ? "poster" : t < 3.95 ? "can" : t < 5.12 ? "date" : t < 6.6 ? "title" : "what");
// clip-local times (closed-form speed maps; always inside [0, dur))
const lt = {
  poster: (t) => 4.55 + 0.6 * t, //         4.55 -> 5.93 (slow-mo poster: can + phone at his chest)
  can: (t) => 1.45 + (t - 2.3), //          1.45 -> 3.10 (the push; he hands the can over at 2.4-2.55, she inspects it)
  date: (t) => 2.85 + (t - 3.95), //        2.85 -> 4.02 (palm-up shrug)
  title: (t) => 4.02 + (t - 5.12), //       4.02 -> 5.50
  titleP: (t) => 4.4 + (t - 5.12), //       portrait: party_wide 4.40 -> 5.88 (the poster pose again)
  what: (t) => 0.0 + (t - 6.6), //          0 -> 1.80
};

const HERO = { font: B.FONT.hero, weight: 900, tracking: -0.035 };
const SERIF = { font: B.FONT.serif, italic: true, weight: 400 };
const MONO = { font: B.FONT.mono, weight: 700, tracking: 0.08 };

export default {
  async load(E) {
    [vPW, vHC, vHR] = await Promise.all([E.loadVideo("party_wide"), E.loadVideo("him_cu_talk"), E.loadVideo("her_cu_talk"), K.loadCanTrack()]);
    g = E.makeG2D(E.W, E.H);
    K.initBokeh();
    B.initMeter(E);
    W_ = E.words.filter((w) => w.section === "intro");
  },
  async prepare(E, t) {
    const s = shotAt(t);
    if (s === "title" && K.P(E)) return void (await vPW.frame(lt.titleP(t)));
    const v = s === "poster" || s === "can" ? vPW : s === "what" ? vHR : vHC;
    await v.frame(lt[s](t));
  },
  render(E, t, rt) {
    E.renderer.setRenderTarget(rt);
    const s = shotAt(t);
    E.hud.sub = false; // every line of the skit is set by the scene itself
    E.hud.theme = "dark";
    if (s === "poster") poster(E, t);
    else if (s === "can") can(E, t);
    else if (s === "date") date(E, t);
    else if (s === "title") title(E, t);
    else what(E, t);
  },
};

// ======================================================================================== helpers
function back(E, c, t, o = {}) {
  K.ground(E, c);
  B.hairGrid(c, 0, 0, E.W, E.H, { step: 96 * E.SCALE, alpha: o.grid ?? 0.42, offX: -t * 6 * E.SCALE, offY: -t * 3 * E.SCALE });
  K.drawBokeh(E, c, t, { alpha: o.bokeh ?? 1, boost: o.boost ?? 0, seed: o.seed ?? 7 });
  K.vignette(E, c, o.vig ?? 1);
}
function costTag(E, c, t, ws, x, y, o = {}) {
  const v = K.runBurn(E, t, ws);
  if (v <= 0) return;
  E.drawText(c, `−${K.fmt(v)} TOKENS`, x, y, { ...MONO, size: (o.size ?? 28) * E.SCALE, color: o.color ?? B.C.green, align: o.align ?? "left", alpha: o.alpha ?? 1 });
}
// I'M AN AI / FOUNDER masthead, left-aligned at x0; line 2 fitted to maxW. Per-word alpha/scale/offset for slams.
function masthead(E, c, L, o = {}) {
  const S = E.SCALE, l2 = o.l2 ?? "FOUNDER";
  const f2 = E.fitSize(c, l2, { ...HERO, size: 900 * S }, L.maxW);
  const f1 = Math.min(f2 * 0.84, E.fitSize(c, "I’M AN AI", { ...HERO, size: 900 * S }, L.maxW));
  const al = o.al ?? [1, 1, 1, 1], sc = o.s ?? [1, 1, 1, 1], dx = o.dx ?? [0, 0, 0, 0];
  const words = ["I’M ", "AN ", "AI"];
  let x = L.x0;
  words.forEach((wd, i) => {
    const ww = E.measure(c, wd, { ...HERO, size: f1 });
    if (al[i] > 0) E.drawText(c, wd.trim(), x + dx[i], L.l1y, { ...HERO, size: f1, color: B.C.white, align: "left", baseline: "alphabetic", alpha: al[i], s: sc[i] });
    x += ww;
  });
  if (al[3] > 0) {
    const grd = c.createLinearGradient(0, -f2 * 0.74, 0, 0); // local coords: drawText translates to (x, baseline)
    grd.addColorStop(0, B.C.pale); grd.addColorStop(0.55, B.C.green); grd.addColorStop(1, "#80BD56");
    E.drawText(c, l2, L.x0 + dx[3], L.l2y, { ...HERO, size: f2, color: grd, align: "left", baseline: "alphabetic", alpha: al[3], s: sc[3] });
  }
  return { f1, f2 };
}
function dateline(E, c, L) {
  const S = E.SCALE, dl = { ...MONO, size: (K.P(E) ? 22 : 26) * S, align: "left" };
  E.drawText(c, "SAN FRANCISCO", L.loc.x, L.loc.y, { ...dl, color: B.C.white });
  E.drawText(c, K.P(E) ? "  ·  FRI 11:48 PM  ·  PARTY" : "  ·  SOMA  ·  FRI 11:48 PM  ·  HOUSE PARTY", L.loc.x + E.measure(c, "SAN FRANCISCO", dl), L.loc.y, { ...dl, color: B.C.whiteA(0.55) });
}

// ======================================================================================== S1 POSTER
function posterLayout(E) {
  const S = E.SCALE, W = E.W, H = E.H, R = E.SAFE;
  if (!K.P(E)) {
    return {
      plate: { u: 0.705, v: 0.22, X: 0.855 * W, Y: 0.29 * H, h: 1.06 * H, crop: [0.43, 0, 0.57, 1] },
      x0: 0.05 * W, l1y: 0.4 * H, l2y: 0.715 * H, maxW: 0.637 * W,
      loc: { x: 0.058 * W, y: 0.165 * H },
      bub: { x: 0.062 * W, y: 0.915 * H, maxW: 0.56 * W },
      zc: [0.6 * W, 0.45 * H],
    };
  }
  // portrait: type in the band under the HUD, him below (his cap grazes FOUNDER), the clip's cut edge off-canvas
  return {
    plate: { u: 0.705, v: 0.22, X: 0.57 * W, Y: 0.518 * H, h: 0.625 * H, crop: [0.43, 0, 0.57, 1] },
    x0: R.x + 14 * S, l1y: 0.333 * H, l2y: 0.432 * H, maxW: R.w - 30 * S,
    loc: { x: R.x + 16 * S, y: 0.248 * H },
    bub: { x: R.x + 22 * S, y: R.y + R.h - 8 * S, maxW: R.w * 0.9 },
    zc: [0.5 * W, 0.45 * H],
  };
}

function poster(E, t, o = {}) {
  const S = E.SCALE, c = g.ctx, L = posterLayout(E);
  // slow push-in on the whole poster (type + him together), 1.0 -> 1.035
  const k = o.title ? 1.02 : 1 + 0.035 * E.ease.inOutQuad(K.clamp(t / 2.3));
  const [cx, cy] = L.zc;
  g.clear();
  back(E, c, t, o.back);
  c.setTransform(k, 0, 0, k, cx * (1 - k), cy * (1 - k));
  // After Tokens banner furniture around the masthead: green rules + the dateline
  B.rules(c, L.loc.y + 22 * S, L.l2y + 34 * S, E.W / k + 400 * S, { color: B.C.greenA(0.32), lw: Math.max(1, S) });
  dateline(E, c, L);
  masthead(E, c, L, o.mast);
  c.setTransform(1, 0, 0, 1, 0, 0);
  g.commit();
  E.blitG2D(E, g, 1);
  const po = K.placePlate(E, vPW, { ...L.plate, X: cx + (L.plate.X - cx) * k, Y: cy + (L.plate.Y - cy) * k, h: L.plate.h * k });
  E.drawPlate(E, vPW, { ...po, matte: true });
  g.clear();
  if (o.front) o.front(L);
  else herBubble(E, c, t, L.bub);
  g.commit();
  E.blitG2D(E, g, 1);
}

// HER: "Hey. What are you doing tonight?" as a chat bubble (anchored at Bx.x, Bx.y = bubble bottom)
function herBubble(E, c, t, Bx) {
  const S = E.SCALE, ws = W_.slice(0, 6), t0 = ws[0].s;
  const pad = 32 * S, fs = 78 * S;
  const line = ws.map((x) => x.w).join(" ");
  const k2 = Math.min(1, (Bx.maxW - pad * 2) / E.measure(c, line, { ...SERIF, size: fs }));
  const typing = t < t0 - 0.05;
  const bw = typing ? 176 * S : E.measure(c, line, { ...SERIF, size: fs * k2 }) + pad * 2;
  const bh = typing ? 96 * S : fs * k2 * 1.05 + pad * 1.5;
  const p = typing ? 1 : 0.92 + 0.08 * E.spring(t - (t0 - 0.05), 300, 0.45); // UI never scales from 0
  const x = Bx.x, y = Bx.y - bh;
  c.save();
  c.translate(x, Bx.y); c.scale(p, p); c.translate(-x, -Bx.y);
  K.bubble(c, x, y, bw, bh, 34 * S, { tail: "left" });
  c.fillStyle = B.C.panel; c.fill();
  c.lineWidth = 3 * S; c.strokeStyle = B.C.coral; c.stroke();
  if (typing) {
    for (let i = 0; i < 3; i++) {
      const ph = Math.sin(t * 9 - i * 0.9) * 0.5 + 0.5;
      c.globalAlpha = 0.35 + 0.65 * ph; c.fillStyle = B.C.coral;
      c.beginPath(); c.arc(x + 50 * S + i * 38 * S, y + bh / 2 - ph * 6 * S, 11 * S, 0, 6.283); c.fill();
    }
    c.globalAlpha = 1;
  } else {
    let xx = x + pad;
    const yy = y + pad * 0.7 + fs * k2 * 0.78;
    ws.forEach((wd) => {
      const ww = E.measure(c, wd.w + " ", { ...SERIF, size: fs * k2 });
      const a = K.clamp((t - (wd.s - 0.05)) / 0.05);
      if (a > 0) E.drawText(c, wd.w, xx, yy, { ...SERIF, size: fs * k2, color: B.C.coral, align: "left", baseline: "alphabetic", alpha: a });
      xx += ww;
    });
  }
  c.restore();
  const lab = typing ? "THE DATE IS TYPING…" : "THE DATE  ·  0 TOKENS";
  E.drawText(c, lab, x + 4 * S, y - 26 * S, { ...MONO, size: 26 * S, color: B.C.coral, align: "left" });
}

// ======================================================================================== S2 CAN: HOLD MY CELSIUS.
function canBrackets(c, x, y, w, h, l, lw, col, a) {
  c.save(); c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const px = x + sx * w / 2, py = y + sy * h / 2;
    c.moveTo(px - sx * l, py); c.lineTo(px, py); c.lineTo(px, py - sy * l);
  }
  c.stroke(); c.restore();
}
function tag(E, c, txt, x, y, size, o) {
  // a sticker: solid plate + type, rotated about its baseline-left
  const tw = E.measure(c, txt, { ...HERO, size });
  c.save(); c.globalAlpha = o.a; c.translate(x, y); c.rotate(o.rot ?? 0); c.scale(o.s ?? 1, o.s ?? 1);
  c.fillStyle = o.bg; c.fillRect(-0.12 * size, -0.86 * size, tw + 0.24 * size, size * 1.03);
  E.drawText(c, txt, 0, -0.1 * size, { ...HERO, size, color: o.ink, align: "left", baseline: "alphabetic" });
  c.restore();
  return tw;
}
function can(E, t) {
  const S = E.SCALE, c = g.ctx, loc = lt.can(t), u = K.clamp((t - 2.3) / 1.65), P = K.P(E), R = E.SAFE;
  const k = 1 + 0.06 * E.ease.outCubic(u);
  // portrait: both of them stand on the canvas bottom (the clip's cut edge stays off-canvas), faces inside the band
  const base = P ? { u: 0.49, v: 1.0, X: E.W * 0.5, Y: E.H, h: E.H * 0.47 } : { u: 0.47, v: 0.45, X: E.W * 0.47, Y: E.H * 0.43, h: E.H };
  const po = K.placePlate(E, vPW, { ...base, h: base.h * k });
  g.clear();
  back(E, c, t, { seed: 11 });
  g.commit(); E.blitG2D(E, g, 1);
  E.drawPlate(E, vPW, { ...po, matte: true });
  // track the can itself (colour track: it changes hands at clip 2.4-2.55 and the tags go with it)
  const cu = K.canAt(loc) ?? [0.4, 0.51];
  const [cx, cy] = E.plateToScreen(E, vPW, cu, po);
  const [sx, sy] = K.plateScale(E, vPW, po);
  g.clear();
  const wH = W_[6], wM = W_[7], wC = W_[8];
  const br = K.popIn(E, t, wH.s, { from: 1.5, k: 420, z: 0.62 });
  if (br.a > 0) canBrackets(c, cx, cy, 0.052 * sx * br.s, 0.16 * sy * br.s, 22 * S, 4 * S, B.C.green, br.a);
  // the tags hang on a leader from the can, stacked like stickers: HOLD MY (ink) / CELSIUS. (green)
  const fs1 = (P ? 76 : 92) * S, fs2 = (P ? 150 : 196) * S;
  let tx, t1y, t2y, lead0, lead1;
  if (!P) {
    tx = cx - 0.035 * sx; t1y = cy + 0.115 * sy + fs1 * 0.86; t2y = t1y + fs1 * 0.3 + fs2 * 0.95;
    lead0 = cy + 0.08 * sy * br.s; lead1 = t1y - fs1 * 0.86;
  } else {
    // portrait: the can sits low (under the platform UI), so the tags ride ABOVE their heads in the band
    const tw2 = E.measure(c, "CELSIUS.", { ...HERO, size: fs2 });
    tx = Math.max(R.x + 30 * S, Math.min(R.x + R.w - tw2 - 30 * S, cx - 0.3 * tw2));
    t1y = 0.335 * E.H; t2y = t1y + fs1 * 0.3 + fs2 * 0.95;
    lead0 = cy - 0.08 * sy * br.s; lead1 = t2y + fs2 * 0.2;
  }
  if (br.a > 0) {
    c.save(); c.strokeStyle = B.C.green; c.lineWidth = 2.5 * S; c.globalAlpha = br.a;
    c.beginPath(); c.moveTo(cx, lead0); c.lineTo(cx, lead1); c.stroke(); c.restore();
  }
  const pH = K.popIn(E, t, wH.s), pM = K.popIn(E, t, wM.s);
  if (pH.a > 0) tag(E, c, pM.a > 0 ? "HOLD MY" : "HOLD", tx, t1y, fs1, { a: pH.a, s: pM.a > 0 ? pM.s : pH.s, rot: 0.02, bg: B.C.ink, ink: B.C.white });
  const pC = K.popIn(E, t, wC.s, { from: 1.12, k: 420, z: 0.45 });
  if (pC.a > 0) tag(E, c, "CELSIUS.", tx - 0.01 * sx, t2y, fs2, { a: pC.a, s: pC.s, rot: -0.035, bg: B.C.green, ink: B.C.ink });
  costTag(E, c, t, [wH, wM, wC], tx - 0.01 * sx, t2y + fs2 * 0.17 + 40 * S);
  g.commit(); E.blitG2D(E, g, 1);
}

// ======================================================================================== S3 DATE: I can't go on a date.
// HIS sent bubble (green, ink hype type) with a wedge tail tracked to his mouth. The chat thread: her coral bubble,
// his green bubble, then the title breaks the format.
function date(E, t) {
  const S = E.SCALE, c = g.ctx, loc = lt.date(t), P = K.P(E), R = E.SAFE;
  const po = K.placePlate(E, vHC, P ? { u: 0.66, v: 1.0, X: E.W * 0.68, Y: E.H, h: E.H * 0.698 } : { u: 0.66, v: 0.37, X: E.W * 0.72, Y: E.H * 0.4, h: E.H * 1.02 });
  const ws = W_.slice(9, 15);
  g.clear();
  back(E, c, t, { seed: 19 });
  const m9 = K.poseAt(vHC, loc, 9), m10 = K.poseAt(vHC, loc, 10);
  const mu = m9 && m10 ? [(m9[0] + m10[0]) / 2, (m9[1] + m10[1]) / 2] : [0.66, 0.45];
  const [mx, my] = E.plateToScreen(E, vHC, mu, po);
  const f1 = (P ? 72 : 98) * S, f2 = (P ? 132 : 228) * S, pad = (P ? 30 : 44) * S;
  // landscape: one line + DATE. ; portrait: I CAN'T / GO ON A / DATE.
  const rows = P ? [["I ", "CAN’T"], ["GO ", "ON ", "A"]] : [["I ", "CAN’T ", "GO ", "ON ", "A"]];
  const rw = rows.map((r) => r.reduce((a, x) => a + E.measure(c, x, { ...HERO, size: f1 }), 0));
  const wD = E.measure(c, "DATE.", { ...HERO, size: f2 });
  const gD = E.ease.outCubic(K.clamp((t - (ws[5].s - 0.05)) / 0.1));
  const bw = Math.max(...rw, wD) + pad * 2;
  const bh = rows.length * f1 * 1.05 + pad * 1.4 + (f2 * 0.86 + pad * 0.5) * gD;
  const bx = P ? R.x + 12 * S : Math.min(0.6 * E.W, mx - 230 * S) - bw, by = P ? 0.236 * E.H : 0.31 * E.H;
  const p0 = K.popIn(E, t, ws[0].s, { from: 0.92, k: 320, z: 0.5 });
  if (p0.a > 0) {
    const ax = bx + bw * 0.85, ay = by + bh; // pop about the tail's root, never from 0
    c.save(); c.globalAlpha = p0.a; c.translate(ax, ay); c.scale(p0.s, p0.s); c.translate(-ax, -ay);
    c.fillStyle = B.C.green;
    c.beginPath(); c.roundRect(bx, by, bw, bh, (P ? 30 : 36) * S); c.fill();
    // wedge tail toward his mouth (tracked; stops short of it, his face sits in front of it)
    const r0 = bx + Math.max(bw - 150 * S, bw * 0.55), r1 = bx + bw - 36 * S;
    const tx = mx - (mx - r1) * 0.2, ty = my - (my - (by + bh)) * 0.2;
    c.beginPath(); c.moveTo(r0, by + bh - 2 * S); c.lineTo(r1, by + bh - 2 * S); c.lineTo(tx, ty); c.closePath(); c.fill();
    let wi = 0;
    rows.forEach((r, ri) => {
      let xx = bx + pad;
      const yy = by + pad * 0.75 + f1 * 0.74 + ri * f1 * 1.05;
      r.forEach((part) => {
        const a = K.clamp((t - (ws[wi].s - 0.05)) / 0.05);
        if (a > 0) E.drawText(c, part.trim(), xx, yy, { ...HERO, size: f1, color: B.C.ink, align: "left", baseline: "alphabetic", alpha: a });
        xx += E.measure(c, part, { ...HERO, size: f1 });
        wi++;
      });
    });
    const pD = K.popIn(E, t, ws[5].s, { from: 1.18, k: 380, z: 0.42 });
    if (pD.a > 0) E.drawText(c, "DATE.", bx + pad, by + bh - pad * 0.8, { ...HERO, size: f2, color: B.C.ink, align: "left", baseline: "alphabetic", alpha: pD.a, s: pD.s });
    c.restore();
    E.drawText(c, `THE FOUNDER  ·  −${K.fmt(K.runBurn(E, t, ws))} TOKENS`, bx + 4 * S, by - 26 * S, { ...MONO, size: (P ? 22 : 26) * S, color: B.C.green, align: "left", alpha: p0.a });
  }
  g.commit(); E.blitG2D(E, g, 1);
  E.drawPlate(E, vHC, { ...po, matte: true });
}

// ======================================================================================== S4 TITLE: I'm an AI founder.
function titleSlams(E, t, hx, x0) {
  // each word shoots out from behind his head into its slot (the matte hides it until it clears him)
  const ws = W_.slice(15, 19), al = [], sc = [], dx = [];
  ws.forEach((w, i) => {
    const d = t - (w.s - 0.067);
    if (d < 0) { al.push(0); sc.push(1); dx.push(0); return; }
    const u = E.ease.outExpo(K.clamp(d / 0.16));
    al.push(1); sc.push(1 + 0.12 * (1 - E.spring(d, 300, 0.4)));
    dx.push((1 - u) * (hx - x0 - (i === 3 ? 0 : 0.2 * E.W)));
  });
  return { ws, al, sc, dx };
}
function title(E, t) {
  const S = E.SCALE, c = g.ctx, P = K.P(E);
  let ws;
  if (P) {
    // portrait: the poster framing comes back and the masthead re-slams on his words (a callback to frame 0)
    const L = posterLayout(E);
    const [hx] = E.plateToScreen(E, vPW, [0.705, 0.22], K.placePlate(E, vPW, L.plate));
    const ts = titleSlams(E, t, hx, L.x0);
    ws = ts.ws;
    poster(E, t, {
      title: true, back: { seed: 23, boost: 0.35 * E.envAvg("snare", t, 0.25) },
      mast: { al: ts.al, s: ts.sc, dx: ts.dx.map((d) => d * 0.4), l2: "FOUNDER." },
      front: (L2) => costTag(E, c, t, ws, L2.x0 + 4 * S, L2.l2y + 50 * S, { size: 24 }),
    });
  } else {
    const loc = lt.title(t);
    const po = K.placePlate(E, vHC, { u: 0.665, v: 0.37, X: E.W * 0.79, Y: E.H * 0.47, h: E.H * 1.3 });
    const L = { x0: 0.05 * E.W, l1y: 0.42 * E.H, l2y: 0.73 * E.H, maxW: 0.585 * E.W };
    const nose = K.poseAt(vHC, loc, 0) ?? [0.665, 0.37];
    const [hx] = E.plateToScreen(E, vHC, nose, po);
    const ts = titleSlams(E, t, hx, L.x0);
    ws = ts.ws;
    g.clear();
    back(E, c, t, { seed: 23, boost: 0.35 * E.envAvg("snare", t, 0.25) });
    B.rules(c, L.l1y - 300 * S, L.l2y + 34 * S, E.W, { color: B.C.greenA(0.3), lw: Math.max(1, S) });
    masthead(E, c, L, { al: ts.al, s: ts.sc, dx: ts.dx, l2: "FOUNDER." });
    g.commit(); E.blitG2D(E, g, 1);
    E.drawPlate(E, vHC, { ...po, matte: true });
    g.clear();
    costTag(E, c, t, ws, L.x0 + 4 * S, L.l2y + 58 * S);
    g.commit(); E.blitG2D(E, g, 1);
  }
  let pk = 0;
  for (const w of ws) if (t >= w.s) pk = Math.max(pk, Math.exp(-(t - w.s) / 0.09));
  E.post.punch = 0.022 * pk;
}

// ======================================================================================== S5 WHAT: ...You're a what?
function what(E, t) {
  const S = E.SCALE, c = g.ctx, P = K.P(E), R = E.SAFE;
  const po = K.placePlate(E, vHR, P ? { u: 0.31, v: 1.0, X: E.W * 0.36, Y: E.H, h: E.H * 0.693 } : { u: 0.3, v: 0.35, X: E.W * 0.26, Y: E.H * 0.42, h: E.H * 1.08 });
  const ws = W_.slice(19, 22);
  const build = K.clamp((t - 7.8) / 0.6);
  const acc = t >= 8.3 ? Math.exp(-(t - 8.3) / 0.06) : 0;
  g.clear();
  back(E, c, t, { seed: 31, boost: 1.4 * E.ease.inQuad(build) + 0.8 * acc });
  // the giant "?" is the hero of "what?": it lands with the word (landscape: on the line's baseline)
  const fs = (P ? 88 : 128) * S, qs = (P ? 800 : 1080) * S;
  const qx = P ? E.W * 0.74 : E.W * 0.8, base = P ? 0.615 * E.H : E.H * 0.855;
  const pQ = K.popIn(E, t, ws[2].s, { from: 1.35, k: 240, z: 0.42 });
  if (pQ.a > 0) {
    const sn = E.env("snare", t);
    const tremble = build * 7 * S * Math.sin(t * 71) * (0.5 + sn);
    const sc = pQ.s * (1 + 0.06 * E.ease.inCubic(build) + 0.06 * acc);
    E.drawText(c, "?", qx + tremble, base, { ...SERIF, size: qs, color: B.C.coral, align: "center", baseline: "alphabetic", alpha: pQ.a, s: sc, rot: 0.05 * build });
  }
  g.commit(); E.blitG2D(E, g, 1);
  E.drawPlate(E, vHR, { ...po, matte: true });
  // FRONT: the line, flowing into the "?"
  g.clear();
  const qw = E.measure(c, "?", { ...SERIF, size: qs });
  const txt = ["…You’re ", "a ", "what"];
  const widths = txt.map((x) => E.measure(c, x, { ...SERIF, size: fs }));
  const tot = widths.reduce((a, b) => a + b, 0);
  const lx = P ? R.x + 16 * S : qx - qw * 0.43 - tot, ly = P ? 0.29 * E.H : base;
  let xx = lx;
  ws.forEach((wd, i) => {
    const pp = K.popIn(E, t, wd.s);
    if (pp.a > 0) E.drawText(c, txt[i].trim() + (P && i === 2 ? "?" : ""), xx, ly, { ...SERIF, size: fs, color: B.C.coral, align: "left", baseline: "alphabetic", alpha: pp.a });
    xx += widths[i];
  });
  B.penUnderline(c, xx - widths[2] - fs * 0.05, ly + fs * 0.16, xx - fs * 0.02, t, ws[2].s + 0.12, { width: (P ? 6 : 7) * S, dur: 0.22 });
  E.drawText(c, "THE DATE  ·  0 TOKENS", lx + 4 * S, ly - fs * 1.0, { ...MONO, size: (P ? 22 : 26) * S, color: B.C.coral, align: "left", alpha: K.clamp((t - ws[0].s) / 0.2) });
  g.commit(); E.blitG2D(E, g, 1);
}
