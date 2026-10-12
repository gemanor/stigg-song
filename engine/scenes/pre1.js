// PRE-CHORUS 1 (32.80-42.55) · look B -> red pen -> green · CALM PASS: HER edits HIS deck in "suggesting" mode, 3 shots.
// Designer A2. Reuses HIS TEAM and FUND slides from ./verse1/deck.js in their final states.
//
// CALM PASS (CALM_PASS.md): the camera walk through the deck (4 pans) is gone. Three shots, cut on downbeats, every
// correction stays up until the shot ends; the rip on 40.88 stays, with no punches and no second rips.
//  t       cut / word                visual                                                            clip
//  32.80   CUT A deck view            HIS TEAM + FUND slides side by side on the light table, HER lip-synced her_lipsync
//                                     bubble ("her · suggesting", coral ring) holds bottom-left          (slot t-32.70)
//  33.64-33.96  a / computer,         her pen circles the Mac mini, note "a computer"                    him_cu_talk (his
//  35.062  money's                    pen strike through $3,000,000.00                                   idle headshot)
//  35.52   made                       note "made of air"; 35.886 air: the struck digits float up and evaporate
//  37.08   CUT B the freezer (downbeat)  HIS FUND slide large, the VC in his tub; HER bubble left        her_lipsync,
//  37.22   freeze                     strike COLD PLUNGE, note "freezer"                                  vc_plunge 3.0-4.92
//  37.767  VC                         pen arrow from the note into the VC's tub
//  39.00   CUT C poster (downbeat)    paper: "than take me" (just sung) small, the subtitle hides
//  39.253  anywhere?                  "anywhere?" fills the frame in coral serif; her held note draws a growing pen
//                                     underline (a cappella)
//  40.88   (beat back, D)             the paper RIPS down the middle and the halves fall away: SHE was behind it, on
//                                     #92E759 (her_cu_talk, mirrored), tag "her · presenting"; into the chorus
// Cut in the calm pass: the deck pans (PLAN -> TEAM -> WIRE -> FUND), the her_walkin_point cutaway, the lip-sync
// close-up beside "any / where?", the second rips at 41.36 / 41.84, the beat punches after the rip.
// Clips: her_lipsync 0.10-6.30 s at its slot (32.80-39.00, bubble); him_cu_talk 0.6-2.1 s (his idle TEAM headshot);
//        vc_plunge 0.3-4.58 s (deck view) and 3.0-4.92 s (freezer), never past 5.2 s; her_cu_talk 5.94 s back to 4.27 s.
import * as K from "./verse1/kit.js";
import * as D from "./verse1/deck.js";

const { C, B, clamp, lerp } = K;
let KK, v = {};
const CLIPS = { lip: "her_lipsync", cu: "him_cu_talk", vc: "vc_plunge", her: "her_cu_talk" };
const LIP0 = 32.7; // her_lipsync slot (clip t = song t - 32.70, covers 32.70-40.03), never shifted
const LIP_UV = [0.52, 0.6], LIP_R = 0.36;
const T1 = 37.08, T2 = 39.0, T_TEAR = 40.88; // shot B (downbeat), shot C (downbeat), the rip (downbeat, beat back)

export default {
  async load(E) {
    KK = await K.kit(E);
    D.initDeck(E);
    for (const [k, name] of Object.entries(CLIPS)) {
      try { v[k] = await E.loadVideo(name); } catch (e) { v[k] = null; }
    }
  },
  async prepare(E, t) {
    const lt = localTimes(t);
    for (const k in lt) if (v[k]) await v[k].frame(lt[k]);
  },
  render(E, t, rt) {
    const U = K.units(E), P = U.P;
    E.renderer.setRenderTarget(rt);
    const lt = localTimes(t);
    if (t < T2) renderDeck(E, t, U, lt);
    else renderPoster(E, t, U, lt);
    E.hud.theme = "light";
    if (P) E.hud.subY = 48; // portrait: the subtitle sits under her bubble, never across her face
    if (t >= T2) E.hud.sub = false; // the poster sets "than take me anywhere?" itself
  },
};

function localTimes(t) {
  const lt = {};
  if (t < T2) lt.lip = t - LIP0; // lip-synced slot
  if (t < T1) {
    lt.cu = K.inClip(v.cu, 0.6 + (t - 32.8) * 0.35); // his headshot idles in his TEAM slide
    lt.vc = K.inClip(v.vc, 0.3 + (t - 32.8)); // 0.3-4.58
  } else if (t < T2) lt.vc = K.inClip(v.vc, 3.0 + (t - T1)); // 3.0-4.92 (clean < 5.2)
  if (t >= T_TEAR) lt.her = K.inClip(v.her, 5.94 - (t - T_TEAR)); // knowing smirk (4.27-5.94) played back: idle
  return lt;
}

// ============================================================================================ A + B · HER pass on his deck
// card = one of HIS slides placed on the light table: xf (slide units -> screen units) and a vertical crop (slide units)
function deckLayout(U, t) {
  const P = U.P, R = U.R, W0 = U.W0;
  if (t < T1) {
    if (P) {
      const z = (R.w - 16) / 2160, y0 = 430, y1 = 1150, top = 430;
      return {
        cards: [
          { sl: D.TEAM, id: "TEAM", xf: { ox: R.x, oy: top - y0 * z, z }, crop: [y0, y1] },
          { sl: D.FUND, id: "FUND", xf: { ox: R.x + R.w - 1080 * z, oy: top - y0 * z, z }, crop: [y0, y1] },
        ],
        bub: { cx: R.x + R.w / 2, cy: 962, r: 138 }, noteS: 125,
      };
    }
    const z = 0.47;
    return {
      cards: [
        { sl: D.TEAM, id: "TEAM", xf: { ox: 48, oy: 172, z } },
        { sl: D.FUND, id: "FUND", xf: { ox: W0 - 48 - 1920 * z, oy: 172, z } },
      ],
      bub: { cx: 236, cy: 872, r: 160 }, noteS: 165,
    };
  }
  if (P) {
    const z = 0.8, y0 = 420, y1 = 1250;
    return { cards: [{ sl: D.FUND, id: "FUND", xf: { ox: (1080 - 1080 * z) / 2, oy: 400 - y0 * z, z }, crop: [y0, y1] }], bub: { cx: R.x + 128, cy: 1012, r: 108 }, noteS: 105 };
  }
  const z = 0.7;
  return { cards: [{ sl: D.FUND, id: "FUND", xf: { ox: W0 - 1920 * z - 20, oy: 150, z } }], bub: { cx: 292, cy: 640, r: 220 }, noteS: 135 };
}
const cardRect = (U, cd) => {
  const [y0, y1] = cd.crop ?? [0, U.H0];
  return { x: cd.xf.ox, y: cd.xf.oy + y0 * cd.xf.z, w: U.W0 * cd.xf.z, h: (y1 - y0) * cd.xf.z };
};
function renderDeck(E, t, U, lt) {
  const S = E.SCALE, Lay = deckLayout(U, t), bub = v.lip ? Lay.bub : null;
  // his TEAM headshot in HER pass: the idle close-up (he isn't singing now; his lip-sync slot is long over)
  const head = v.cu ? { v: v.cu, lt: lt.cu, key: "cu", uvC: [0.662, 0.6], ruv: 0.3, sing: false } : null;
  const stFor = (cd) => ({ t, tb: 99, U, xf: cd.xf, v, lt, live: true, air: airP(t), head, clipR: cardRect(U, cd), noteS: Lay.noteS });
  // ---------------------------------------------------------------- BACK: light table + his slides
  const gA = KK.gA, c = gA.ctx;
  gA.clear();
  c.setTransform(S, 0, 0, S, 0, 0);
  c.fillStyle = "#ECEAE4";
  c.fillRect(0, 0, U.W0, U.H0);
  for (const cd of Lay.cards) {
    const r = cardRect(U, cd), st = stFor(cd);
    c.setTransform(S, 0, 0, S, 0, 0);
    c.fillStyle = C.inkA(0.08);
    c.fillRect(r.x + 6, r.y + 8, r.w, r.h); // soft card shadow
    c.fillStyle = C.paper;
    c.fillRect(r.x, r.y, r.w, r.h);
    c.strokeStyle = C.inkA(0.25);
    c.lineWidth = 2;
    c.strokeRect(r.x, r.y, r.w, r.h);
    c.save();
    c.beginPath();
    c.rect(r.x, r.y, r.w, r.h);
    c.clip();
    c.setTransform(S * cd.xf.z, 0, 0, S * cd.xf.z, S * cd.xf.ox, S * cd.xf.oy);
    cd.sl.back(E, c, st);
    c.restore();
  }
  c.setTransform(S, 0, 0, S, 0, 0);
  K.stageBand(E, c, U, null, { accent: C.coral, progress: (t - 32.8) / (T2 - 32.8) });
  if (bub) K.bubbleBack(c, bub.cx, bub.cy, bub.r, { fill: C.pale });
  gA.commit();
  E.blitG2D(E, gA, 1);
  // ---------------------------------------------------------------- PLATES: slide footage, then HER
  for (const cd of Lay.cards) cd.sl.plates(E, stFor(cd));
  if (bub) K.headshot(E, v.lip, "herB", bub.cx, bub.cy, bub.r, LIP_UV, LIP_R, { popUp: 1.62, popW: 0.62 });
  // ---------------------------------------------------------------- FRONT: slide fronts, red pen, her cursor
  const gB = KK.gB, f = gB.ctx;
  gB.clear();
  let tip = null;
  for (const cd of Lay.cards) {
    const r = cardRect(U, cd), st = stFor(cd);
    f.save();
    f.setTransform(S, 0, 0, S, 0, 0);
    f.beginPath();
    f.rect(r.x - 400, r.y - 400, r.w + 800, r.h + 800); // her notes may run past the card edge (margin notes)
    f.clip();
    f.setTransform(S * cd.xf.z, 0, 0, S * cd.xf.z, S * cd.xf.ox, S * cd.xf.oy);
    f.save();
    f.beginPath();
    f.rect(0, cd.crop ? cd.crop[0] : 0, U.W0, cd.crop ? cd.crop[1] - cd.crop[0] : U.H0);
    f.clip();
    cd.sl.front(E, f, st);
    f.restore();
    const tp = pen(E, f, t, U, cd.id, st);
    if (tp) tip = [cd.xf.ox + tp[0] * cd.xf.z, cd.xf.oy + tp[1] * cd.xf.z];
    f.restore();
  }
  f.setTransform(S, 0, 0, S, 0, 0);
  if (bub) K.bubbleFront(E, f, bub.cx, bub.cy, bub.r, { ring: C.coral, lw: bub.r * 0.028 + 2, popW: 0.62, level: K.voice(E, t, "HER"), name: U.P ? null : "her · suggesting", dot: true, nameSize: 24 });
  if (tip) cursor(E, f, tip[0], tip[1], t);
  gB.commit();
  E.blitG2D(E, gB, 1);
}

// "made of air": progress of the evaporating digits on the FUND slide's WIRE row
function airP(t) { return clamp((t - D.O.air) / 0.9); }

// HER red pen per slide (slide units). Returns the pen tip (slide units) while a stroke is being drawn.
function pen(E, c, t, U, id, st) {
  const O = D.O, P = U.P, z = st.xf.z, pW = (P ? 9 : 10) / Math.max(0.5, z) * 0.75, nS = st.noteS;
  let tip = null;
  if (id === "TEAM") {
    // circle the Mac mini -> "a computer"
    const A = D.TEAM.anchors(st), [mx, my] = A.mini, r = A.rad * 1.2;
    const t0 = O.computer - 0.32, dur = 0.28;
    B.penCircle(c, mx, my, r, r * 0.92, t, t0, { width: pW, dur, seed: 4 });
    if (t >= t0 && t < t0 + dur) { const a = -2.2 + ((t - t0) / dur) * 1.12 * 6.283; tip = [mx + Math.cos(a) * r, my + Math.sin(a) * r * 0.92]; }
    const nx = P ? 70 : mx - r * 0.2, ny = my - r - (P ? 26 : 34);
    B.penNote(E, c, "a computer", nx, ny, t, O.computer - 0.03, { size: nS, cps: 60, rot: -0.06, align: P ? "left" : "center" });
    if (t >= O.computer - 0.03 && t < O.computer + 0.2) tip = [nx + (P ? 0 : -nS * 1.6) + nS * 3.2 * clamp((t - O.computer) / 0.17), ny];
  } else if (id === "FUND") {
    // strike the $3M on "money's", "made of air" on "made", the digits evaporate on "air"
    const A = D.FUND.amtLay(E, c, U), y = A.y - A.size * 0.36;
    B.penStrike(c, A.x, y, A.x + A.w, t, O.moneys - 0.04, { width: pW * 1.1, dur: 0.16, seed: 2, amp: 5 });
    if (t >= O.moneys - 0.04 && t < O.moneys + 0.12) tip = [lerp(A.x - 8, A.x + A.w + 8, (t - O.moneys + 0.04) / 0.16), y];
    const s2 = nS * 0.9, nx = A.x + A.w * 0.5, ny = A.y - A.size * 0.2;
    B.penNote(E, c, "made of air", nx, ny, t, O.made - 0.03, { size: s2, cps: 55, rot: -0.07, align: "center" });
    if (t >= O.made - 0.03 && t < O.made + 0.2) tip = [nx - s2 * 2 + s2 * 4 * clamp((t - O.made) / 0.2), ny];
    // strike COLD PLUNGE on "freeze" -> "freezer", arrow into the VC's tub on "VC"
    const A0 = D.FUND.anchors(st), s = A0.venueS, vx = A0.venueX;
    const w = K.measure(E, c, "COLD", { size: s, tracking: -0.035 }) + s * 0.26 + K.measure(E, c, "PLUNGE", { size: s, tracking: -0.035 }), yv = A0.venueY - s * 0.36;
    B.penStrike(c, vx, yv, vx + w, t, O.freeze - 0.04, { width: pW, dur: 0.14, seed: 5 });
    if (t >= O.freeze - 0.04 && t < O.freeze + 0.1) tip = [lerp(vx, vx + w, (t - O.freeze + 0.04) / 0.14), yv];
    const s3 = nS * 0.9, fx = vx + w * 0.5, fy = A0.venueY - s - (P ? 18 : 26);
    B.penNote(E, c, "freezer", fx, fy, t, O.freeze + 0.08, { size: s3, cps: 50, rot: -0.06, align: "center" });
    const [ax, ay] = A0.vcTub;
    const x0 = fx + s3 * 1.6, y0 = fy - s3 * 0.1, x1 = ax - (P ? 60 : 200), y1 = P ? Math.min(ay - 120, 1150) : ay - 180; // portrait: stay inside the card crop
    B.penArrow(c, x0, y0, x1, y1, t, O.vc - 0.1, { width: pW, dur: 0.16, seed: 3, bend: -0.25 });
    if (t >= O.vc - 0.1 && t < O.vc + 0.06) { const u = (t - O.vc + 0.1) / 0.16; tip = [lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(u * 3.14) * 60]; }
  }
  return tip;
}
// HER collaborator cursor (coral pointer + name flag), like a shared doc
function cursor(E, c, x, y, t) {
  c.save();
  c.translate(x, y);
  c.fillStyle = C.coral;
  c.strokeStyle = "#FFFFFF";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, 44);
  c.lineTo(12, 33);
  c.lineTo(22, 54);
  c.lineTo(31, 50);
  c.lineTo(21, 30);
  c.lineTo(37, 29);
  c.closePath();
  c.fill();
  c.stroke();
  c.restore();
  collabTag(E, c, x + 30, y + 72, "her", t, true);
}
function collabTag(E, c, x, y, label, t, small = false) {
  const size = small ? 24 : 28, w = K.measure(E, c, label, { font: B.FONT.mono, weight: 700, size, tracking: 0.04 }) + (small ? 26 : 56), h = size * 1.6;
  c.save();
  c.fillStyle = C.coral;
  K.rrect(c, x, y - h / 2, w, h, 6);
  c.fill();
  if (!small) {
    c.fillStyle = "#FFFFFF";
    c.beginPath();
    c.arc(x + 20, y, 6, 0, 6.283);
    c.fill();
  }
  K.M(E, c, label, x + (small ? 13 : 36), y + 1, { size, color: "#FFFFFF", weight: 700, tracking: 0.04 });
  c.restore();
}

// ============================================================================================ C · "anywhere?" poster + the rip
function herCuFrame(U) {
  if (U.P) { const w = 2000; return { x: U.R.x + U.R.w * 0.5 - 0.7 * w, y: 700, w, h: w * 9 / 16 }; }
  const w = 1880;
  return { x: 960 - 0.72 * w + 0.03 * w, y: 1080 - 0.985 * (w * 9 / 16), w, h: w * 9 / 16 };
}
// the two paper halves: polygons in screen units, torn top to bottom, falling away from 40.88
let PIECES = null;
function jagged(x0, y0, x1, y1, n, amp, seed) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, j = i === 0 || i === n ? 0 : (K.hsh(i * 7.3 + seed) - 0.5) * 2 * amp;
    const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    pts.push([lerp(x0, x1, u) + (nx / L) * j, lerp(y0, y1, u) + (ny / L) * j]);
  }
  return pts;
}
function buildPieces(U) {
  const W = U.W0, H = U.H0, M = 60;
  const r1 = jagged(W * 0.53, -M, W * 0.46, H + M, 26, 26, 1);
  PIECES = [
    { poly: [[-M, -M], ...r1, [-M, H + M]], v: [-520, -60], w: -0.22 },
    { poly: [[W + M, -M], [W + M, H + M], ...r1.slice().reverse()], v: [560, 40], w: 0.2 },
  ];
}
function pieceXf(p, t, U) {
  // a rip: snap apart, then gravity
  const dt = Math.max(0, t - T_TEAR), k = 1 - Math.exp(-dt * 5);
  return { dx: p.v[0] * (k * 0.32 + dt * 0.9), dy: p.v[1] * (k * 0.32 + dt * 0.6) + 1300 * dt * dt * 0.55, rot: p.w * (k * 0.35 + dt * 0.9), cx: U.W0 / 2, cy: U.H0 / 2 };
}
function tracePoly(c, poly) {
  c.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) c.lineTo(poly[i][0], poly[i][1]);
  c.closePath();
}
function renderPoster(E, t, U, lt) {
  const S = E.SCALE, P = U.P, torn = t >= T_TEAR;
  if (!PIECES) buildPieces(U);
  const paper = (ctx) => {
    ctx.fillStyle = C.paper;
    ctx.fillRect(-200, -200, U.W0 + 400, U.H0 + 400);
    B.hairGrid(ctx, 0, 0, U.W0, U.H0, { step: 96, color: C.inkA(0.05) });
  };
  // ---------------------------------------------------------------- BACK
  const gA = KK.gA, c = gA.ctx;
  gA.clear();
  c.setTransform(S, 0, 0, S, 0, 0);
  if (!torn) { paper(c); drawAnywhere(E, c, t, U); }
  else { c.fillStyle = C.green; c.fillRect(0, 0, U.W0, U.H0); }
  gA.commit();
  E.blitG2D(E, gA, 1);
  if (!torn) return;
  // ---------------------------------------------------------------- PLATES: SHE was behind the paper
  const Fh = herCuFrame(U);
  if (v.her) K.plate(E, v.her, Fh, { mirror: true });
  // ---------------------------------------------------------------- FRONT: her tag, then the falling halves
  const gB = KK.gB, f = gB.ctx;
  gB.clear();
  f.setTransform(S, 0, 0, S, 0, 0);
  const nose = v.her ? K.pose(v.her, lt.her, 0) : null;
  if (nose) {
    const [hx, hy] = K.fpt(Fh, nose, true), lab = "her · presenting";
    const lw = K.measure(E, f, lab, { font: B.FONT.mono, weight: 700, size: 28, tracking: 0.04 }) + 56;
    if (P) collabTag(E, f, U.R.x + U.R.w - lw, hy - 330, lab, t);
    else collabTag(E, f, hx - 260 - lw, hy - 230, lab, t);
  }
  for (const p of PIECES) {
    const X = pieceXf(p, t, U);
    f.save();
    f.setTransform(S, 0, 0, S, 0, 0);
    f.translate(X.cx + X.dx, X.cy + X.dy);
    f.rotate(X.rot);
    f.translate(-X.cx, -X.cy);
    f.beginPath();
    tracePoly(f, p.poly);
    f.clip();
    paper(f);
    drawAnywhere(E, f, t, U);
    f.lineWidth = 5; // torn edge: an ink outline (cartoon)
    f.strokeStyle = C.ink;
    f.beginPath();
    tracePoly(f, p.poly);
    f.stroke();
    f.restore();
  }
  gB.commit();
  E.blitG2D(E, gB, 1);
}
// The poster: "than take me" (just sung) small in coral serif, then "anywhere?" fills the frame on its onset; her held
// note is a pen underline that keeps drawing until the beat comes back.
function drawAnywhere(E, c, t, U) {
  const O = D.O, P = U.P, R = U.R;
  const ser = { font: B.FONT.serif, weight: 400, italic: true, color: C.coral };
  E.drawText(c, "than take me", P ? R.x + 30 : 120, P ? R.y + 260 : 250, { ...ser, size: P ? 84 : 104, align: "left", baseline: "alphabetic", alpha: c.globalAlpha });
  const on = O.anywhere;
  if (t < on - 0.066) return;
  const str = "anywhere?", base = P ? 300 : 470;
  const size = K.fit(E, c, str, { ...ser, size: base, tracking: -0.02 }, P ? R.w : U.W0 - 120);
  const k = K.slam(t, on, 1.12) * (1 + 0.03 * clamp((t - on) / (T_TEAR - on))), a = clamp((t - on + 0.066) / 0.06);
  const cx = P ? R.x + R.w / 2 : U.W0 / 2, cy = P ? R.y + 560 : 640;
  c.save();
  c.translate(cx, cy);
  c.scale(k, k);
  E.drawText(c, str, 0, 0, { ...ser, size, tracking: -0.02, align: "center", baseline: "middle", alpha: a * c.globalAlpha });
  const held = clamp((t - on - 0.1) / (T_TEAR - on - 0.1));
  const w = K.measure(E, c, str, { font: B.FONT.serif, weight: 400, size, tracking: -0.02, italic: true });
  if (held > 0) B.penUnderline(c, -w * 0.48, size * 0.42, w * 0.46, held, 0, { dur: 1, width: P ? 10 : 14, seed: 9 });
  c.restore();
}
