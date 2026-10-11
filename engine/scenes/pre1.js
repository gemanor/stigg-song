// PRE-CHORUS 1 (32.80-42.55) · look B -> red pen -> green · HER walks into HIS deck and edits it in "suggesting" mode.
// Designer A2. Reuses HIS slides from ./verse1/deck.js (final states) laid out as a strip the camera walks through.
//
// PLAN (onsets from lyrics.json; beats 32.80 33.26D 33.74 34.22 34.70 35.18D 35.66 36.14 36.60 37.08D 37.56 38.04 38.52
// 39.00D 39.46 39.94 40.40 40.88D 41.36 41.84 42.32 | music stops 39.2-40.9: her "anywhere" a cappella, beat back 40.88)
//  t       word / event              visual                                                         layer        cut
//  32.80   (hard cut in)             his ROADMAP slide (404) full frame, HE is gone; SHE walks in from   BACK slides  hard cut
//                                    the left (her_walkin_point 0.0s, 1.6x) into his presenter spot;    PLATE her
//                                    coral collaborator tag "her · suggesting" tracks her head          FRONT tag
//  32.86   So / 33.02 your           camera pans right through his deck (strip: PLAN, TEAM, WIRE, FUND)  camera
//  33.16   co-founder's              lands on 04 TEAM (him_cu_talk headshot live in its circle)          (≈33.26D)
//  33.66-33.92                       HER cursor circles the Mac mini (B.penCircle, cursor rides the tip)  FRONT pen
//  33.96   computer,                 note "a computer" (Instrument Serif Italic coral)                    FRONT pen
//  34.24   and (held)                pan to 08 WIRE (34.22 beat)
//  35.062  money's                   B.penStrike through $3,000,000.00                                    FRONT pen
//  35.886  air,                      note "made of air"; the struck digits float up and evaporate         BACK + pen
//  36.142  and (held)                pan to 06 FUNDRAISING (36.14 beat), VC live in his tub
//  36.78   (point)                   she points at the VC (her_walkin_point 4.75s)
//  37.22   freeze                    strike COLD PLUNGE, note "freezer"; frost floods the slide          FRONT pen
//  37.767  VC                        B.penArrow from the note into the VC's tub                          FRONT pen
//  38.04   (beat)                    cut: HER close-up (her_cu_talk mirrored, right), paper              PLATE        cut
//  38.29   than / 38.754 take / 38.986 me    coral serif words land one by one (top left)              FRONT
//  39.253  anywhere?                 "anywhere?" fills the frame in coral serif, over her blazer (never   FRONT
//                                    her face); a cappella: slow push, the "?" breathes with her voice
//  40.88   (beat back, D)            the paper RIPS down the middle (jagged), halves fly apart: GREEN     BACK tear    punch
//  41.36 / 41.84                     each half rips again, pieces tumble off with the type on them       BACK         punch
//  42.32                             last scraps fall; she stands alone on #92E759 into the chorus
// Clips: her_walkin_point 0-5.95s (32.80-38.04, time-remapped 1.6x walk then 0.95x), him_cu_talk 2.4-7 (TEAM headshot,
//        clamped), vc_plunge 2.6-4.9s (WIRE/FUND), her_cu_talk 0.2-4.7s mirrored (38.04-42.55).
import * as K from "./verse1/kit.js";
import * as D from "./verse1/deck.js";

const { C, B, clamp, lerp, oc, io, hsh } = K;
let KK, v = {};
const CLIPS = { lip: "her_lipsync", walk: "her_walkin_point", cu: "him_cu_talk", vc: "vc_plunge", her: "her_cu_talk" };
const LIP0 = 32.7, LIP1 = 32.7 + 7.3; // her_lipsync slot (clip t = song t - 32.70), never shifted
const LIP_UV = [0.52, 0.6], LIP_R = 0.36;
const GAP = 180;

// ------------------------------------------------------------------------------------------- timing
const T_CLOSE = 38.04, T_TEAR = 40.88;
// her_walkin_point: only the clean ranges (lead's footage notes: a second cup 0.25-3.25, her cup vanishes ≈3.9).
// 32.80-33.26 local 3.39-3.85 (stops, side-eye) while she "moves in"; 33.26 punch-in cut to 4.0 (skeptical frown),
// 0.8x so the point (4.75) lands at 34.20 as the camera pans to the WIRE slide; 35.66 cut to her_unimpressed.
const T_IN = 32.8, T_POINT = 36.6, T_BIG = 39.94; // her bubble (lip-sync) -> full-body point at the VC -> close-up
const walkLocal = (t) => 4.56 + (t - T_POINT); // her_walkin_point 4.56-6.0: the point (4.75) lands at 36.79
// camera keyframes: [t, slide index, zoom, screen-x of slide centre (units, landscape)]
function camKeys(U) {
  const P = U.P;
  const zx = P ? 0.58 : 0.76, cx = P ? U.W0 / 2 : 1240;
  return [
    [32.8, 0, 1, U.W0 / 2],
    [33.02, 0, 1, U.W0 / 2],
    [33.5, 1, zx, cx],
    [34.22, 1, zx, cx],
    [34.6, 2, zx, cx],
    [36.14, 2, zx, cx],
    [36.52, 3, zx, cx],
    [99, 3, zx, cx],
  ];
}
function camAt(U, t) {
  const Kf = camKeys(U);
  let i = 0;
  while (i < Kf.length - 2 && t >= Kf[i + 1][0]) i++;
  const a = Kf[i], b = Kf[i + 1], u = io((t - a[0]) / (b[0] - a[0]));
  const idx = lerp(a[1], b[1], u), sxc = lerp(a[3], b[3], u);
  const z = lerp(a[2], b[2], u) * (1 + 0.01 * Math.max(0, t - 33.5)); // slow push through the review
  // world x of the screen centre
  const camX = idx * (U.W0 + GAP) + U.W0 / 2 - (sxc - U.W0 / 2) / z;
  // portrait: the slides' content band (slide y 469-1049) rides high, her bubble lives under it
  return { camX, camY: U.H0 / 2, z, oyP: U.P ? lerp(0, 430 - z * 469, clamp((1 - z) / (1 - 0.58))) : null };
}
const SLIDES = () => [D.PLAN, D.TEAM, D.WIRE, D.FUND];
// frozen build time per slide (final state as he presented it)
const buildT = (O) => [O.plan + 0.4, O.it7 - 0.08, O.cash + 0.4, O.flash + 0.4];

export default {
  async load(E) {
    KK = await K.kit(E);
    D.initDeck(E);
    for (const [k, name] of Object.entries(CLIPS)) {
      try { v[k] = await E.loadVideo(name); } catch (e) { v[k] = null; }
    }
    if (!v.walk) v.walk = v.her; // fallback while a clip is missing
  },
  async prepare(E, t) {
    const lt = localTimes(t);
    for (const k in lt) if (v[k]) await v[k].frame(lt[k]);
  },
  render(E, t, rt) {
    const S = E.SCALE, U = K.units(E), O = D.O, P = U.P;
    E.renderer.setRenderTarget(rt);
    const lt = localTimes(t);
    if (t < T_CLOSE) renderDeck(E, t, U, lt);
    else renderClose(E, t, U, lt);
    // HUD
    E.hud.theme = "light";
    if (P) E.hud.subY = 70;
    if (t >= O.than - 0.3) E.hud.sub = false; // the scene sets "than take me anywhere?" itself
    // the beat comes back: punches on the build kicks only
    if (t >= T_TEAR - 0.02) {
      const b = E.last("beats", t);
      if (b && b.t >= T_TEAR - 0.02) E.post.punch = 0.03 * Math.exp(-b.dt / 0.11);
    }
  },
};

function localTimes(t) {
  const lt = {};
  if (t < LIP1 - 0.05) lt.lip = t - LIP0; // lip-synced slot
  if (t < T_CLOSE) {
    if (t >= T_POINT) lt.walk = K.inClip(v.walk, walkLocal(t));
    lt.cu = K.inClip(v.cu, 0.6 + (t - 32.8) * 0.35); // his headshot idles in his TEAM slide (bored stare, 0.5-2.0)
    lt.vc = Math.min(5.2, K.inClip(v.vc, 1.2 + (t - 34.3))); // vc_plunge 0-5.2 only
  } else if (t < T_BIG) {
    // (her lip-sync close-up)
  } else if (t < T_TEAR) {
    lt.her = K.inClip(v.her, 3.1 + (t - T_CLOSE)); // talks 3.25-4.25, knowing smirk 4.5-6.0
  } else {
    lt.her = K.inClip(v.her, 5.94 - (t - T_TEAR)); // idle smirk, ping-pong back during the rip
  }
  return lt;
}

// ============================================================================================ A · the deck walk
function slideXf(U, cam, i) {
  const x = i * (U.W0 + GAP);
  return { ox: (x - cam.camX) * cam.z + U.W0 / 2, oy: cam.oyP != null ? cam.oyP : (0 - cam.camY) * cam.z + U.H0 / 2, z: cam.z };
}
// HER in the deck walk: her lip-synced bubble takes over HIS bubble spot, moving in from the left like a slide object;
// 36.60-38.04 a cutaway to her full body pointing at the frozen VC (her_walkin_point 4.56-6.0).
function herBubble(U, t) {
  const P = U.P, R = U.R, mv = 1 - K.oq((t - T_IN) / 0.32);
  if (P) return { cx: R.x + R.w / 2 - mv * 1100, cy: 1160, r: 230 };
  return { cx: 410 - mv * 900, cy: 640, r: 292 };
}
function walkFrame(U) {
  if (U.P) { const w = 1500; return { x: 230 - 0.22 * w, y: 950 - 0.14 * (w * 9 / 16), w, h: w * 9 / 16 }; }
  const w = 1700;
  return { x: 330 - 0.24 * w, y: 1046 - 0.975 * (w * 9 / 16), w, h: w * 9 / 16 };
}
function renderDeck(E, t, U, lt) {
  const S = E.SCALE, O = D.O, cam = camAt(U, t), SL = SLIDES(), BT = buildT(O);
  // his TEAM headshot in HER pass: the idle close-up (he isn't singing now; the lip-sync slot is long over)
  const head = v.cu ? { v: v.cu, lt: lt.cu, key: "cu", uvC: [0.662, 0.6], ruv: 0.3, sing: false } : null;
  // ---------------------------------------------------------------- BACK: light table + visible slides
  const gA = KK.gA, c = gA.ctx;
  gA.clear();
  c.setTransform(S, 0, 0, S, 0, 0);
  c.fillStyle = "#ECEAE4";
  c.fillRect(0, 0, U.W0, U.H0);
  const vis = [];
  SL.forEach((sl, i) => {
    const xf = slideXf(U, cam, i), w = U.W0 * xf.z;
    if (xf.ox > U.W0 || xf.ox + w < 0) return;
    vis.push(i);
    const st = { t, tb: BT[i], U, xf, v, lt, live: true, air: airP(E, t), head };
    c.setTransform(S, 0, 0, S, 0, 0);
    // card + hairline border
    c.fillStyle = C.paper;
    c.fillRect(xf.ox, xf.oy, w, U.H0 * xf.z);
    if (xf.z < 0.995) { c.strokeStyle = C.inkA(0.25); c.lineWidth = 2; c.strokeRect(xf.ox, xf.oy, w, U.H0 * xf.z); }
    c.save();
    c.beginPath();
    c.rect(xf.ox, xf.oy, w, U.H0 * xf.z);
    c.clip();
    c.setTransform(S * xf.z, 0, 0, S * xf.z, S * xf.ox, S * xf.oy);
    sl.back(E, c, st);
    c.restore();
  });
  c.setTransform(S, 0, 0, S, 0, 0);
  K.stageBand(E, c, U, null, { accent: C.coral, progress: (t - 32.8) / (T_CLOSE - 32.8) });
  if (t < T_POINT && v.lip) { const b = herBubble(U, t); K.bubbleBack(c, b.cx, b.cy, b.r, { fill: C.pale }); }
  gA.commit();
  E.blitG2D(E, gA, 1);
  // ---------------------------------------------------------------- PLATES: slide footage, then HER
  for (const i of vis) {
    const xf = slideXf(U, cam, i);
    const st = { t, tb: BT[i], U, xf, v, lt, live: true, noVC: true, head, clipR: { x: xf.ox, y: xf.oy, w: U.W0 * xf.z, h: U.H0 * xf.z } };
    SL[i].plates(E, st);
  }
  const walk = t >= T_POINT && v.walk, bub = !walk && v.lip ? herBubble(U, t) : null, Fw = walk ? walkFrame(U) : null;
  if (bub) K.headshot(E, v.lip, "herB", bub.cx, bub.cy, bub.r, LIP_UV, LIP_R, { popUp: 1.62, popW: 0.62 });
  if (walk) K.plate(E, v.walk, Fw);
  // ---------------------------------------------------------------- FRONT: slide fronts, red pen, cursor, her tag
  const gB = KK.gB, f = gB.ctx;
  gB.clear();
  let tip = null;
  for (const i of vis) {
    const xf = slideXf(U, cam, i);
    const st = { t, tb: BT[i], U, xf, v, lt, live: true, head };
    f.save();
    f.setTransform(S, 0, 0, S, 0, 0);
    f.beginPath();
    f.rect(xf.ox, xf.oy, U.W0 * xf.z, U.H0 * xf.z);
    f.clip();
    f.setTransform(S * xf.z, 0, 0, S * xf.z, S * xf.ox, S * xf.oy);
    SL[i].front(E, f, st);
    const tp = pen(E, f, t, U, i, st);
    if (tp) tip = [xf.ox + tp[0] * xf.z, xf.oy + tp[1] * xf.z];
    f.restore();
  }
  f.setTransform(S, 0, 0, S, 0, 0);
  if (bub) K.bubbleFront(E, f, bub.cx, bub.cy, bub.r, { ring: C.coral, lw: bub.r * 0.028 + 2, popW: 0.62, level: K.voice(E, t, "HER"), name: U.P ? null : "her (host)", dot: true, nameSize: 26 });
  if (walk) {
    // contact shadow (a faint floor ellipse under her sneakers), then her collaborator tag tracked to her head
    const lw = lt.walk, a = K.pose(v.walk, lw, 27), b = K.pose(v.walk, lw, 28);
    if (a && b) {
      const pa = K.fpt(Fw, a), pb = K.fpt(Fw, b), cx = (pa[0] + pb[0]) / 2, cy = Math.max(pa[1], pb[1]) + 26;
      f.save();
      f.globalCompositeOperation = "destination-over";
      f.fillStyle = C.inkA(0.16);
      f.beginPath();
      f.ellipse(cx, cy, Math.abs(pa[0] - pb[0]) / 2 + 70, 16, 0, 0, 6.283);
      f.fill();
      f.restore();
    }
    const nose = K.pose(v.walk, lw, 0), top = K.box(v.walk, lw);
    if (nose && top) {
      const [hx] = K.fpt(Fw, nose), hy = K.fpt(Fw, [0, top[1]])[1];
      collabTag(E, f, hx + 40, hy - 26, "her · suggesting", t);
    }
  }
  if (tip) cursor(E, f, tip[0], tip[1], t);
  gB.commit();
  E.blitG2D(E, gB, 1);
}

// "made of air": progress of the evaporating digits on the WIRE slide
function airP(E, t) { return clamp((t - D.O.air) / 0.9); }

// HER red pen per slide (slide units). Returns the pen tip (slide units) while a stroke is being drawn.
function pen(E, c, t, U, i, st) {
  const O = D.O, P = U.P, W = 9, col = C.coral;
  let tip = null;
  const pW = P ? 8 : 10;
  if (i === 1) {
    // TEAM: circle the Mac mini -> "a computer"
    const A = D.TEAM.anchors(st), [mx, my] = A.mini, r = A.rad * 1.18;
    const t0 = O.computer - 0.32, dur = 0.28;
    B.penCircle(c, mx, my, r, r * 0.92, t, t0, { width: pW, dur, seed: 4 });
    if (t >= t0 && t < t0 + dur) { const a = -2.2 + ((t - t0) / dur) * 1.12 * 6.283; tip = [mx + Math.cos(a) * r, my + Math.sin(a) * r * 0.92]; }
    const nx = P ? mx - r * 0.35 : mx - r * 1.05, ny = P ? my - r - 60 : my - r - 40;
    B.penNote(E, c, "a computer", nx, ny, t, O.computer - 0.03, { size: P ? 84 : 104, cps: 60, rot: -0.06, align: "center" });
    if (t >= O.computer - 0.03 && t < O.computer + 0.2) tip = [nx + 150 * clamp((t - O.computer) / 0.17), ny];
  } else if (i === 2) {
    // WIRE: strike the $3M, "made of air"
    const A = D.WIRE.amtLay(E, c, U), y = A.y - A.size * 0.36;
    B.penStrike(c, A.x, y, A.x + A.w, t, O.moneys - 0.04, { width: pW * 1.2, dur: 0.16, seed: 2, amp: 6 });
    if (t >= O.moneys - 0.04 && t < O.moneys + 0.12) tip = [lerp(A.x - 8, A.x + A.w + 8, (t - O.moneys + 0.04) / 0.16), y];
    const nx = A.x + A.w * 0.6, ny = A.y - A.size * 1.18;
    B.penNote(E, c, "made of air", nx, ny, t, O.air - 0.03, { size: P ? 76 : 100, cps: 55, rot: -0.07, align: "center" });
    if (t >= O.air - 0.03 && t < O.air + 0.2) tip = [nx + 200 * clamp((t - O.air) / 0.2) - 100, ny];
  } else if (i === 3) {
    // FUND: strike COLD PLUNGE -> "freezer", arrow into the VC
    const L = D.FUND.lay(U), A0 = D.FUND.anchors(st), s = A0.venueS, vx = A0.venueX;
    const w = K.measure(E, c, "COLD", { size: s, tracking: -0.035 }) + s * 0.26 + K.measure(E, c, "PLUNGE", { size: s, tracking: -0.035 }), y = L.venueY - s * 0.36;
    B.penStrike(c, vx, y, vx + w, t, O.freeze - 0.04, { width: pW, dur: 0.14, seed: 5 });
    if (t >= O.freeze - 0.04 && t < O.freeze + 0.1) tip = [lerp(vx, vx + w, (t - O.freeze + 0.04) / 0.14), y];
    const nx = vx + w * 0.55, ny = L.venueY - s - (P ? 30 : 40);
    B.penNote(E, c, "freezer", nx, ny, t, O.freeze + 0.08, { size: P ? 80 : 100, cps: 50, rot: -0.06, align: "center" });
    const A = D.FUND.anchors(st), [ax, ay] = A.vcTub;
    const x0 = nx + (P ? 120 : 170), y0 = ny - 10, x1 = ax - (P ? 120 : 200), y1 = ay - (P ? 120 : 180);
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
    c.globalAlpha = 0.55 + 0.45 * E.pulse("beats", t, 0.3);
    c.beginPath();
    c.arc(x + 20, y, 6, 0, 6.283);
    c.fill();
    c.globalAlpha = 1;
  }
  K.M(E, c, label, x + (small ? 13 : 36), y + 1, { size, color: "#FFFFFF", weight: 700, tracking: 0.04 });
  c.restore();
}

// ============================================================================================ B · "anywhere?" + C · the tear
function herCuFrame(U, t) {
  if (U.P) { const w = 2000; return { x: U.R.x + U.R.w * 0.5 - 0.7 * w, y: 700, w, h: w * 9 / 16 }; }
  // before the poster: right side, big; revealed behind the rip: centred a touch, slightly smaller
  if (t >= T_TEAR) { const w = 1880; return { x: 960 - 0.72 * w + 0.03 * w, y: 1080 - 0.985 * (w * 9 / 16), w, h: w * 9 / 16 }; }
  const w = 1920;
  return { x: 0, y: 0, w, h: 1080 };
}
// paper pieces for the tear: polygons in screen units with split times and motions
let PIECES = null;
function jagged(x0, y0, x1, y1, n, amp, seed) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, j = i === 0 || i === n ? 0 : (hsh(i * 7.3 + seed) - 0.5) * 2 * amp;
    const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    pts.push([lerp(x0, x1, u) + (nx / L) * j, lerp(y0, y1, u) + (ny / L) * j]);
  }
  return pts;
}
function buildPieces(U) {
  const W = U.W0, H = U.H0, M = 60;
  // first rip: top to bottom, slightly diagonal
  const r1 = jagged(W * 0.53, -M, W * 0.46, H + M, 26, 26, 1);
  const left = [[-M, -M], ...r1, [-M, H + M]], right = [[W + M, -M], [W + M, H + M], ...r1.slice().reverse()];
  // second rips: across each half
  const rL = jagged(-M, H * 0.58, W * 0.5, H * 0.42, 18, 22, 2), rR = jagged(W * 0.49, H * 0.47, W + M, H * 0.62, 18, 22, 3);
  const clipPoly = (poly, line, keepAbove) => {
    // half-plane split by a polyline that crosses the polygon left->right: keep the region above/below via a big polygon
    const big = keepAbove ? [[-1e4, -1e4], [1e4, -1e4], [1e4, line[line.length - 1][1]], ...line.slice().reverse(), [-1e4, line[0][1]]] : [[-1e4, 1e4], [-1e4, line[0][1]], ...line, [1e4, line[line.length - 1][1]], [1e4, 1e4]];
    return { poly, mask: big };
  };
  PIECES = [
    { id: "L", poly: left, mask: null, t1: T_TEAR, v: [-520, -60], w: -0.22, parent: null },
    { id: "R", poly: right, mask: null, t1: T_TEAR, v: [560, 40], w: 0.2, parent: null },
    { id: "LT", poly: left, ...clipPoly(left, rL, true), t1: T_TEAR + 0.48, v: [-260, -520], w: -0.5, parent: "L" },
    { id: "LB", poly: left, ...clipPoly(left, rL, false), t1: T_TEAR + 0.48, v: [-120, 260], w: 0.32, parent: "L" },
    { id: "RT", poly: right, ...clipPoly(right, rR, true), t1: T_TEAR + 0.96, v: [380, -460], w: 0.55, parent: "R" },
    { id: "RB", poly: right, ...clipPoly(right, rR, false), t1: T_TEAR + 0.96, v: [160, 300], w: -0.3, parent: "R" },
  ];
}
// cumulative transform of a piece at time t: {dx, dy, rot, cx, cy}
function pieceXf(p, t, U) {
  const W = U.W0, H = U.H0;
  let dx = 0, dy = 0, rot = 0;
  const chain = [];
  for (let q = p; q; q = q.parent ? PIECES.find((z) => z.id === q.parent) : null) chain.unshift(q);
  for (const q of chain) {
    const dt = Math.max(0, t - q.t1);
    if (dt <= 0) continue;
    // a rip: snap apart, then gravity
    const k = 1 - Math.exp(-dt * 5);
    dx += q.v[0] * (k * 0.32 + dt * 0.9);
    dy += q.v[1] * (k * 0.32 + dt * 0.6) + 1300 * dt * dt * (q.parent ? 1.2 : 0.55);
    rot += q.w * (k * 0.35 + dt * 0.9);
  }
  return { dx, dy, rot, cx: W / 2, cy: H / 2 };
}
function leaves(t) {
  // the pieces that exist at time t (a parent is replaced by its children after their split)
  const out = [];
  for (const p of PIECES) {
    const kids = PIECES.filter((q) => q.parent === p.id);
    if (kids.length && t >= kids[0].t1) continue;
    if (p.parent && t < p.t1) continue;
    out.push(p);
  }
  return out;
}
function tracePoly(c, poly) {
  c.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i++) c.lineTo(poly[i][0], poly[i][1]);
  c.closePath();
}

function lipCloseFrame(U, t) {
  // her lip-sync close-up, mirrored to the right third; the left stays clear for the type; a slow push on her face
  const k = 1 + 0.025 * Math.max(0, t - T_CLOSE);
  if (U.P) { const w = 1500 * k, h = (w * 9) / 16; return { x: U.R.x + U.R.w * 0.5 - 0.48 * w, y: 695 - 0.41 * 844 * (k - 1), w, h }; }
  const w = 2000 * k, h = (w * 9) / 16;
  return { x: 1360 - 0.48 * w, y: 60 - 0.41 * 1125 * (k - 1), w, h };
}
function renderClose(E, t, U, lt) {
  const S = E.SCALE, O = D.O, P = U.P;
  if (!PIECES) buildPieces(U);
  const close = t < T_BIG; // 38.04-39.94: her singing close-up beside the words
  const torn = t >= T_TEAR;
  const list = torn ? leaves(t) : null;
  const paper = (ctx) => {
    ctx.fillStyle = C.paper;
    ctx.fillRect(-200, -200, U.W0 + 400, U.H0 + 400);
    B.hairGrid(ctx, 0, 0, U.W0, U.H0, { step: 96, color: C.inkA(0.05) });
  };
  const type = (ctx) => drawAnywhere(E, ctx, t, U, close);
  // ---------------------------------------------------------------- BACK
  const gA = KK.gA, c = gA.ctx;
  gA.clear();
  c.setTransform(S, 0, 0, S, 0, 0);
  if (close) paper(c);
  else { c.fillStyle = C.green; c.fillRect(0, 0, U.W0, U.H0); }
  gA.commit();
  E.blitG2D(E, gA, 1);
  // ---------------------------------------------------------------- PLATES
  const Fl = lipCloseFrame(U, t), Fh = herCuFrame(U, t);
  if (close && v.lip) K.plate(E, v.lip, Fl, { mirror: true });
  if (torn && v.her) K.plate(E, v.her, Fh, { mirror: true });
  // ---------------------------------------------------------------- FRONT
  const gB = KK.gB, f = gB.ctx;
  gB.clear();
  f.setTransform(S, 0, 0, S, 0, 0);
  // collaborator tag tracked to her head (close-up, and again once the rip reveals her; under the flying paper)
  const tagClip = close ? [v.lip, lt.lip, Fl] : torn ? [v.her, lt.her, Fh] : null;
  if (tagClip && tagClip[0]) {
    const nose = K.pose(tagClip[0], tagClip[1], 0);
    if (nose) {
      const [hx, hy] = K.fpt(tagClip[2], nose, true);
      const lab = t >= T_TEAR + 0.96 ? "her · presenting" : "her · suggesting";
      const lw = K.measure(E, f, lab, { font: B.FONT.mono, weight: 700, size: 28, tracking: 0.04 }) + 56;
      if (P) collabTag(E, f, U.R.x + U.R.w - lw, hy - 330, lab, t);
      else collabTag(E, f, hx - (close ? 250 : 260) - lw, hy - (close ? 400 : 230), lab, t);
    }
  }
  if (close) type(f);
  else if (!torn) { paper(f); type(f); }
  else withPieces(f, S, U, t, list, (ctx) => { paper(ctx); type(ctx); }, true);
  gB.commit();
  E.blitG2D(E, gB, 1);
}
function withPieces(c, S, U, t, list, draw, edges) {
  for (const p of list) {
    const X = pieceXf(p, t, U);
    c.save();
    c.setTransform(S, 0, 0, S, 0, 0);
    c.translate(X.cx + X.dx, X.cy + X.dy);
    c.rotate(X.rot);
    c.translate(-X.cx, -X.cy);
    c.beginPath();
    tracePoly(c, p.poly);
    c.clip();
    if (p.mask) { c.beginPath(); tracePoly(c, p.mask); c.clip(); }
    draw(c);
    if (edges) {
      // torn edge: an ink outline (cartoon) around the piece
      c.lineWidth = 5;
      c.strokeStyle = C.ink;
      c.beginPath();
      tracePoly(c, p.poly);
      c.stroke();
      if (p.mask) { c.beginPath(); tracePoly(c, p.mask); c.stroke(); }
    }
    c.restore();
  }
}
// "than take me anywhere?": three coral words land; "any / where?" stacks beside her close-up; at 39.94 the one-line
// poster fills the frame while she holds the note (a cappella), her held note drawn as a growing pen underline.
function drawAnywhere(E, c, t, U, close) {
  const O = D.O, P = U.P, R = U.R;
  const words = [["than", O.than], ["take", O.take], ["me", O.me]];
  const sz = P ? 84 : close ? 110 : 96;
  let x = P ? R.x + 30 : 120;
  const y = P ? (close ? 520 : R.y + 230) : close ? 270 : 230;
  for (const [w, on] of words) {
    if (t >= on - 0.066) {
      const k = K.slam(t, on, 1.3);
      const ww = K.measure(E, c, w + " ", { font: B.FONT.serif, weight: 400, size: sz, tracking: 0, italic: true });
      c.save();
      c.translate(x + ww / 2, y);
      c.scale(k, k);
      E.drawText(c, w, -ww / 2, 0, { font: B.FONT.serif, weight: 400, italic: true, size: sz, color: C.coral, align: "left", baseline: "alphabetic" });
      c.restore();
      x += ww;
    }
  }
  const on = O.anywhere;
  if (t < on - 0.066) return;
  const ser = { font: B.FONT.serif, weight: 400, italic: true, color: C.coral, tracking: -0.02 };
  if (close && P) {
    // portrait: one line above her head
    const s2 = K.fit(E, c, "anywhere?", { ...ser, size: 200 }, R.w - 40), k = K.slam(t, on, 1.25);
    c.save();
    c.translate(R.x + R.w / 2, 670);
    c.scale(k, k);
    E.drawText(c, "anywhere?", 0, 0, { ...ser, size: s2, align: "center", baseline: "alphabetic" });
    c.restore();
    return;
  }
  if (close) {
    // two lines left of her face, never on it
    const s2 = P ? 210 : 300, x0 = P ? R.x + 20 : 96, y1 = P ? R.y + 470 : 600, y2 = y1 + s2 * 0.86;
    const k = K.slam(t, on, 1.25);
    c.save();
    c.translate(x0, y1);
    c.scale(k, k);
    E.drawText(c, "any", 0, 0, { ...ser, size: s2, align: "left", baseline: "alphabetic" });
    c.restore();
    const k2 = K.slam(t, on + 0.14, 1.25);
    if (t >= on + 0.14 - 0.066) {
      c.save();
      c.translate(x0, y2);
      c.scale(k2, k2);
      E.drawText(c, "where?", 0, 0, { ...ser, size: s2, align: "left", baseline: "alphabetic" });
      c.restore();
    }
    return;
  }
  const str = "anywhere?", base = P ? 300 : 470;
  const size = K.fit(E, c, str, { font: B.FONT.serif, weight: 400, size: base, tracking: -0.02, italic: true }, P ? R.w : U.W0 - 120);
  const k = K.slam(t, T_BIG, 1.12) * (1 + 0.035 * clamp((t - T_BIG) / 0.94));
  const cx = P ? R.x + R.w / 2 : U.W0 / 2, cy = P ? R.y + 560 : 640;
  c.save();
  c.translate(cx, cy);
  c.scale(k, k);
  E.drawText(c, str, 0, 0, { ...ser, size, align: "center", baseline: "middle" });
  // her held note: a pen underline that keeps drawing while she holds it
  const held = clamp((t - T_BIG + 0.05) / (T_TEAR - T_BIG));
  const w = K.measure(E, c, str, { font: B.FONT.serif, weight: 400, size, tracking: -0.02, italic: true });
  if (held > 0) B.penUnderline(c, -w * 0.48, size * 0.42, w * 0.46, held, 0, { dur: 1, width: P ? 10 : 14, seed: 9 });
  c.restore();
}
