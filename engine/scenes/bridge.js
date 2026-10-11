// BRIDGE (100.38-118.85) · look E TERMINAL · the due-diligence speed date · owner A4
// Half-time interrogation: every question / answer lands on the clap (beats 2 and 4), one cut per Q and per A,
// shot / reverse-shot: HER close-up (form on the right) <-> HIS close-up (form on the left). Kit: ./skit2/term.js
//
// PLAN (onsets: engine/data/lyrics.json "bridge"; beats/downbeats: engine/data/audio.json)
//  time     word / event             visual                                                              layer   cut / camera
//  100.38   (downbeat, hit)          TITLE: due_diligence.form, "DUE DILIGENCE", 7 empty fields, speed-   back    hard cut in; punch 0.03
//                                    round timer 00:15.26 starts counting down (linear)
//  100.86   Revenue? (100.886)       CUT her (her_cu_talk 0.00-0.96): field 01 label types in coral serif back    cut on the clap; punch
//  101.82   I annualized a Tuesday.  CUT him (him_cu_talk 2.30-4.20): answer types into the field (green  back    cut on the clap; punch
//           (101.826 .. 102.766)     hype) word by word; 52x7 contribution grid: one TUE cell = $6.15,
//                                    on "Tuesday." the TUE row copies x52 -> "$319.80 ARR*" (*his math)
//  103.72   Users? (103.746)         CUT her (3.05-4.01): field 02; history row 01 above                  back
//  104.68   Waitlist. (104.686)      CUT him (4.20-5.14): WAITLIST.; ACTIVE USERS 0 vs the skit-2 waitlist back
//                                    odometer, still rolling (1.4M/s since 67.13)
//  105.62   Product? (105.646)       CUT her (4.90-5.86): field 03
//  106.58   Next model. (106.606)    CUT him (0.00-0.67): NEXT MODEL.; progress bar 0 -> 99% and stuck  back
//  107.25   Co-founder? (107.28)     CUT her (0.96-2.19): field 04 (off-beat onset: cut 2 frames early)
//  108.48   Mac mini. (108.506)      CUT him (3.00-3.96): MAC MINI.; line-art box, LED on beats, stats   back    kick drops out at 108.0
//  109.44   Salary? (109.466)        CUT her (3.80-4.76): field 05
//  110.40   Tokens. (110.406)        CUT him (0.70-1.64): TOKENS.; the HUD token meter leaves its corner, front   HUD meter hidden while
//                                    lands in the field at 2.2x (still burning: "Tokens." costs tokens)          its copy is flown
//  111.34   Girlfriend? (111.366)    CUT her (0.30-1.26): field 06; the meter flies home on the cut
//  112.30   Series B. (112.326)      CUT him (4.40-5.82): SERIES B.; funding road PRE-SEED (you are here) back
//                                    -> SEED -> A -> B, a coral heart lands on "B." (112.566)
//  113.72   Five years? (113.746)    CUT her (4.95-5.89): field 07
//  114.66   Post-AGI. (114.700)      CUT him (2.20-3.18): POST-AGI.; 5-year Gantt, every row "-> post-AGI" back
//  115.64   (downbeat, near-silence) CUT her_facepalm (0.75-3.96): the full form, 7/7 SUBMITTED, timer 00:00, back
//                                    REVIEWING... bar fills linearly through the silence
//  116.89   Oh my god. (116.886)     DECLINED: giant coral stamp slams over the form (punch + shake); her  front   punch 0.035, shake
//                                    words type into "reviewer notes" in coral serif; "god." underlined
//  117.36   (drums return)           red-pen strikes through all 7 answers, one per 16th                  front
//  118.32/118.80 (beats)             small punches into the final chorus (118.85; "I'm" pickup 118.913)
// Half-time punch: E.post.punch on every Q/A cut (the clap on 2 and 4). HUD subtitle off: the form shows every line.
import * as B from "../brand.js";
import { K, F, tryClip, inClip, smoothPt, smoothMean, ground, panel, mono, serif, cursor, typedWords, odometer,
  tokenTicks, mouthOf, brackets, voiceBars, meterCopy, meterHome, shotAt, glowDisc } from "./skit2/term.js";

let g, HIM, HER, FP;
let QL = [], AL = [], OMG = null, SH = [], T = {};
const ODO_RATE = 1.4e6;   // the skit-2 waitlist odometer keeps rolling at this rate (agents per second)

// the form: one field per question. disp = display lines of the answer, as word index ranges into the sung line
const FIELDS = [
  { key: "revenue", disp: [[0, 2], [2, 4]], sum: "$319.80 ARR*" },
  { key: "users", disp: [[0, 1]], sum: "0 active" },
  { key: "product", disp: [[0, 2]], sum: "99%, stuck" },
  { key: "cofounder", disp: [[0, 2]], sum: "uptime 100%" },
  { key: "salary", disp: [[0, 1]], sum: "paid in tokens" },
  { key: "girlfriend", disp: [[0, 2]], sum: "unlocks at B" },
  { key: "fiveyears", disp: [[0, 1]], sum: "TBD" },
];
// close-up framings per shot (zoom, x, y in 1080p px) and clip in-points: never the same framing twice in a row
const HER_FR = [   // her_cu_talk talks at 0-2.0 and 3.25-4.25, sips 2.25-3.0, knowing smirk + side-eye 4.5-6.0 (footage.md)
  { lt: 0.0, L: { zoom: 1.0, x: -40, y: 6 }, P: { zoom: 1.75, x: 330, y: 300 } },        // Revenue?
  { lt: 3.25, L: { zoom: 1.16, x: -70, y: 76 }, P: { zoom: 2.0, x: 420, y: 360 } },      // Users?
  { lt: 1.0, L: { zoom: 0.93, x: -10, y: -14 }, P: { zoom: 1.65, x: 290, y: 280 } },     // Product?
  { lt: 4.5, L: { zoom: 1.08, x: -100, y: 40 }, P: { zoom: 1.85, x: 360, y: 330 } },     // Co-founder? (smirk)
  { lt: 0.5, L: { zoom: 1.22, x: -40, y: 112 }, P: { zoom: 2.1, x: 450, y: 380 } },      // Salary?
  { lt: 4.95, L: { zoom: 1.0, x: -120, y: 12 }, P: { zoom: 1.75, x: 300, y: 300 } },     // Girlfriend? (side-eye)
  { lt: 3.3, L: { zoom: 1.12, x: -60, y: 60 }, P: { zoom: 1.95, x: 400, y: 350 } },      // Five years?
];
const HIM_FR = [   // him_cu_talk: bored stare 0.5-2.0, hand up 2.5, open-palm "obviously" 3.0-4.75, flat stare 5.0-6.0 (footage.md)
  { lt: 0.05, L: { zoom: 1.0, x: 327, y: 20 }, P: { zoom: 1.65, x: -330, y: 300 } },     // I annualized a Tuesday.
  { lt: 5.0, L: { zoom: 1.08, x: 300, y: 70 }, P: { zoom: 1.9, x: -420, y: 360 } },      // Waitlist. (flat stare)
  { lt: 2.4, L: { zoom: 0.92, x: 353, y: -12 }, P: { zoom: 1.55, x: -290, y: 280 } },    // Next model.
  { lt: 3.2, L: { zoom: 1.04, x: 315, y: 50 }, P: { zoom: 1.75, x: -360, y: 330 } },     // Mac mini. (obviously)
  { lt: 0.6, L: { zoom: 1.12, x: 290, y: 110 }, P: { zoom: 2.0, x: -440, y: 380 } },     // Tokens. (deadpan)
  { lt: 4.3, L: { zoom: 0.96, x: 340, y: 8 }, P: { zoom: 1.65, x: -320, y: 300 } },      // Series B.
  { lt: 3.0, L: { zoom: 1.06, x: 307, y: 60 }, P: { zoom: 1.85, x: -400, y: 340 } },     // Post-AGI. (obviously)
];

// cut on the clap: the beat at or just before the onset, else 2 frames early
function cutFor(E, onset) {
  const b = E.last("beats", onset + 0.03);
  return b && onset + 0.03 - b.t < 0.15 ? b.t : onset - 0.034;
}

export default {
  async load(E, layer) {
    g = E.makeG2D(E.W, E.H);
    [HIM, HER, FP] = await Promise.all([tryClip(E, "him_cu_talk"), tryClip(E, "her_cu_talk"), tryClip(E, "her_facepalm")]);
    const lines = E.L.lines.filter((l) => l.section === "bridge");
    QL = []; AL = []; OMG = null;
    lines.forEach((l, i) => { if (i === lines.length - 1 && /god/i.test(l.text)) OMG = l; else if (l.speaker === "HER") QL.push(l); else AL.push(l); });
    const wait = E.words.find((w) => w.section === "skit2" && /^waitlist/i.test(w.w));
    T = { start: layer.start, end: layer.end, waitT: wait ? wait.s : 67.126 };
    T.f = E.A.downbeats.find((d) => d > (AL[6]?.e ?? 115.32) - 0.01) ?? 115.64;   // 115.64: the music drops out
    T.omg = OMG ? OMG.words[0].s : 116.886;
    T.god = OMG ? OMG.words[OMG.words.length - 1].s : 117.246;
    T.drums = E.A.downbeats.find((d) => d > T.omg) ?? 117.36;
    SH = [{ id: "title", t0: T.start }];
    for (let i = 0; i < 7; i++) {
      if (QL[i]) SH.push({ id: "q", i, t0: cutFor(E, QL[i].words[0].s) });
      if (AL[i]) SH.push({ id: "a", i, t0: cutFor(E, AL[i].words[0].s) });
    }
    SH.push({ id: "f", t0: T.f });
    SH.forEach((s, k) => (s.t1 = SH[k + 1]?.t0 ?? T.end));
    T.fly0 = AL[4] ? cutFor(E, AL[4].words[0].s) : 110.4;
    T.fly1 = QL[5] ? cutFor(E, QL[5].words[0].s) : 111.34;
  },

  async prepare(E, t) {
    const p = plateOf(E, t, shotAt(SH, t));
    if (p) await p.v.frame(p.lt);
  },

  render(E, t, rt, layer) {
    const S = E.SCALE, c = g.ctx, s = shotAt(SH, t), P = E.ORIENT === "portrait";
    E.renderer.setRenderTarget(rt);
    const p = plateOf(E, t, s);
    const box = panelBox(E, s);
    // ---------------------------------------------------------------- BACK: ground + the form
    g.clear();
    ground(E, c, { alpha: 0.4, offY: -(t - T.start) * 10 * S });
    if (p) glowDisc(c, p.face[0], p.face[1], 520 * S * (P ? 1.2 : 1), s.id === "a" ? "rgba(146,231,89,0.10)" : "rgba(255,119,109,0.09)", 1);
    if (s.id === "title") drawTitle(E, c, t);
    else if (s.id === "q") drawQ(E, c, t, s.i, box);
    else if (s.id === "a") drawA(E, c, t, s.i, box);
    else drawF(E, c, t, box);
    g.commit(); E.blitG2D(E, g, 1);
    // ---------------------------------------------------------------- the close-up (clean cut-out)
    if (p) E.drawPlate(E, p.v, p.o);
    // ---------------------------------------------------------------- FRONT
    g.clear();
    if (p) speakerTag(E, c, t, s, p);
    if (s.id === "a" && p) tokenTicks(E, c, t, AL[s.i].words, (ts) => mouthOf(E, p.v, inClip(p.v, p.lt0 + ts - s.t0), p.o), { size: P ? 34 : 30 });
    // the salary field: the HUD token meter flies into the form and home again
    const fly = meterFlight(E, t, box);
    if (fly) { E.hud.meter = false; meterCopy(E, c, t, fly.x, fly.y, fly.k, { label: fly.k > 1.4 ? "SALARY · TOKEN BUDGET" : undefined }); }
    if (s.id === "f") drawVerdict(E, c, t, box);
    g.commit(); E.blitG2D(E, g, 1);
    // ---------------------------------------------------------------- HUD + post
    E.hud.sub = false;
    E.hud.label = s.id === "title" ? "DD_FORM" : s.id === "f" ? (t >= T.omg ? "DECLINED" : "REVIEWING") : `${s.id === "q" ? "Q" : "A"}${s.i + 1}/7`;
    // half-time punch on every Q/A cut (the clap on 2 and 4), the title hit, the stamp, and the last two beats
    const cutAge = t - s.t0;
    let punch = s.id !== "f" ? 0.028 * Math.exp(-cutAge / 0.11) : 0;
    if (t >= T.omg) punch = Math.max(punch, 0.04 * Math.exp(-(t - T.omg) / 0.13));
    for (const bt of [T.end - 0.53, T.end - 0.05]) if (t >= bt) punch = Math.max(punch, 0.018 * Math.exp(-(t - bt) / 0.1));
    E.post.punch = punch;
    if (t >= T.omg && t < T.omg + 0.3) { const k = Math.exp(-(t - T.omg) / 0.07); E.post.shake = [0.004 * k * Math.sin((t - T.omg) * 90), -0.003 * k * Math.cos((t - T.omg) * 70)]; }
  },
};

// ---------------------------------------------------------------------------------------------------------------- plates
function plateOf(E, t, s) {
  const P = E.ORIENT === "portrait";
  let v = null, lt0 = 0, o = null;
  if (s.id === "q" && HER) { const f = HER_FR[s.i]; v = HER; lt0 = f.lt; o = { ...(P ? f.P : f.L) }; }
  else if (s.id === "a" && HIM) { const f = HIM_FR[s.i]; v = HIM; lt0 = f.lt; o = { ...(P ? f.P : f.L) }; }
  else if (s.id === "f") {
    // her_facepalm: usable 0-3.4 only (her face drifts after 3.5): 0.19-3.40 over the 3.21 s shot; the hand drags at clip 3.0
    if (FP) { v = FP; lt0 = 0.19; o = P ? { zoom: 1.7, x: 60, y: 300 } : { zoom: 1.0, x: -500, y: 10 }; }
    else if (HER) { v = HER; lt0 = 2.6; o = P ? { zoom: 1.75, x: 330, y: 300 } : { zoom: 1.0, x: -60, y: 6 }; }
  }
  if (!v) return null;
  const lt = inClip(v, lt0 + (t - s.t0));
  o.fit = E.plateFit(E, v); o.matte = true;
  o.zoom *= 1 + 0.018 * (t - s.t0);   // a slow push inside every shot
  // face anchor (for the glow behind the head): pose eyes, or the matte top
  const eyes = smoothMean(v, lt, [2, 5]);
  const tr = v.trackAt(lt);
  const face = eyes ? E.plateToScreen(E, v, eyes, o) : E.plateToScreen(E, v, [tr.top[0], tr.top[1] + 0.2], o);
  return { v, lt, lt0, o, face };
}

// ---------------------------------------------------------------------------------------------------------------- layout
function panelBox(E, s) {
  const S = E.SCALE, R = E.SAFE;
  if (E.ORIENT === "portrait") return { x: R.x + 6 * S, y: R.y + 18 * S, w: R.w - 12 * S, h: R.h * 0.6 };
  if (s.id === "a") return { x: E.W * 0.03, y: E.H * 0.15, w: E.W * 0.475, h: E.H * 0.785 };
  if (s.id === "title") return { x: E.W * 0.1, y: E.H * 0.15, w: E.W * 0.8, h: E.H * 0.785 };
  return { x: E.W * 0.53, y: E.H * 0.15, w: E.W * 0.44, h: E.H * 0.785 };
}
const timerAt = (t) => Math.max(0, T.f - Math.max(t, T.start));
const fmtTimer = (x) => `00:${x.toFixed(2).padStart(5, "0")}`;
function chrome(E, c, t, box, status) {
  const S = E.SCALE, left = timerAt(t);
  panel(E, c, box.x, box.y, box.w, box.h, { title: "due_diligence.form — founder_01", titleSize: E.ORIENT === "portrait" ? 19 : 17, dot: K.coral,
    status: status ?? `SPEED ROUND ${fmtTimer(left)}`, statusColor: left < 3 ? K.coral : K.grey });
}
const qWords = (i) => QL[i]?.words ?? [];
const aWords = (i) => AL[i]?.words ?? [];
const upper = (ws) => ws.map((w) => w.w.toUpperCase());

// HER question as a field label (coral serif), typed on her onsets
function labelText(t, i) { const ws = qWords(i); return typedWords(ws, ws.map((w) => w.w), t, 0.2); }
function labelFull(i) { return qWords(i).map((w) => w.w).join(" "); }
// HIS answer, display line k, typed into the field on his onsets
function answerLine(t, i, k) {
  const ws = aWords(i), [a, b] = FIELDS[i].disp[k];
  return typedWords(ws.slice(a, b), upper(ws.slice(a, b)), t, 0.22);
}
function answerFull(i) { return upper(aWords(i)).join(" "); }

// ---------------------------------------------------------------------------------------------------------------- title card
function drawTitle(E, c, t) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE;
  const box = P ? { x: R.x + 6 * S, y: R.y + 150 * S, w: R.w - 12 * S, h: R.h * 0.8 } : { x: E.W * 0.08, y: E.H * 0.15, w: E.W * 0.84, h: E.H * 0.785 };
  chrome(E, c, t, box);
  const x = box.x + 44 * S, f = { font: F.hero, weight: 900, size: (P ? 104 : 132) * S, tracking: -0.03 };
  const size = E.fitSize(c, "DUE DILIGENCE", f, box.w - 88 * S);
  E.drawText(c, "DUE DILIGENCE", x, box.y + (P ? 140 : 150) * S, { ...f, size, color: K.white, align: "left" });
  mono(E, c, "founder_01  ·  7 questions  ·  one take", x, box.y + (P ? 220 : 236) * S, { size: P ? 24 : 24, color: K.grey, upper: false });
  const rows = 7, y0 = box.y + (P ? 300 : 300) * S, rh = (box.y + box.h - 40 * S - y0) / rows;
  for (let k = 0; k < rows; k++) {
    const yy = y0 + k * rh + rh * 0.5;
    mono(E, c, String(k + 1).padStart(2, "0"), x, yy, { size: 22, weight: 700, color: k === 0 ? K.coral : K.dgrey });
    c.fillStyle = k === 0 ? K.coral : K.line; c.fillRect(x + 70 * S, yy + rh * 0.28, box.w - 160 * S, Math.max(1, S));
    mono(E, c, k === 0 ? "awaiting question" : "pending", x + 70 * S, yy, { size: 19, color: k === 0 ? K.ink : K.dgrey, upper: false, alpha: k === 0 ? 0.9 : 0.8 });
  }
  cursor(E, c, t, x + 290 * S, y0 + rh * 0.5 - 13 * S, 13 * S, 26 * S, K.coral);
}

// ---------------------------------------------------------------------------------------------------------------- Q: her shot
function drawQ(E, c, t, i, box) {
  const S = E.SCALE, P = E.ORIENT === "portrait";
  chrome(E, c, t, box);
  const x = box.x + 34 * S, iw = box.w - 68 * S, bottom = box.y + box.h - 30 * S;
  // current field, anchored at the bottom: "0i / 07", the label typed big, an empty input with his cursor
  const inH = (P ? 120 : 150) * S, inY = bottom - inH;
  const lf = { font: F.serif, italic: true, weight: 400, size: (P ? 150 : 168) * S, tracking: -0.01 };
  const lsize = E.fitSize(c, labelFull(i), lf, iw), lY = inY - 30 * S - lsize * 0.5;
  mono(E, c, `${String(i + 1).padStart(2, "0")} / 07`, x, lY - lsize * 0.62 - 16 * S, { size: P ? 22 : 21, weight: 700, color: K.coral });
  const txt = labelText(t, i);
  if (txt) E.drawText(c, txt, x, lY, { ...lf, size: lsize, color: K.coral, align: "left" });
  c.save(); c.beginPath(); c.roundRect(x, inY, iw, inH, 8 * S); c.fillStyle = K.well; c.fill();
  c.lineWidth = Math.max(1, 1.5 * S); c.strokeStyle = K.line; c.stroke(); c.restore();
  cursor(E, c, t, x + 26 * S, inY + inH * 0.22, inH * 0.3, inH * 0.56, K.green);
  mono(E, c, "founder is typing…", x + 26 * S + inH * 0.3 + 20 * S, inY + inH * 0.5, { size: P ? 20 : 19, color: K.dgrey, upper: false });
  // history: the answered fields, compact, stacked upward from the current field
  const top = box.y + 64 * S, rowH = (P ? 54 : 58) * S;
  let y = lY - lsize * 0.62 - 60 * S;
  for (let k = i - 1; k >= 0 && y - rowH > top; k--, y -= rowH) histRow(E, c, k, x, y - rowH * 0.5, iw, rowH, 1 - (i - 1 - k) * 0.13);
}
function histRow(E, c, k, x, y, w, h, a = 1, big = false) {
  const S = E.SCALE;
  c.fillStyle = K.line; c.fillRect(x, y + h * 0.5, w, Math.max(1, S));
  mono(E, c, String(k + 1).padStart(2, "0"), x, y, { size: big ? 22 : 18, weight: 700, color: K.dgrey, alpha: a });
  const lw = (big ? 250 : 210) * S;
  E.drawText(c, labelFull(k), x + 52 * S, y + 2 * S, { font: F.serif, italic: true, weight: 400, size: (big ? 46 : 38) * S, color: K.coral, align: "left", alpha: a });
  const af = { font: F.hero, weight: 800, size: (big ? 46 : 34) * S, tracking: -0.01 };
  const sz = E.fitSize(c, answerFull(k), af, w - lw - 60 * S);
  E.drawText(c, answerFull(k), x + 52 * S + lw, y + 2 * S, { ...af, size: sz, color: K.green, align: "left", alpha: a });
  return x + 52 * S + lw;
}

// ---------------------------------------------------------------------------------------------------------------- A: his shot
function drawA(E, c, t, i, box) {
  const S = E.SCALE, P = E.ORIENT === "portrait";
  chrome(E, c, t, box);
  const x = box.x + 34 * S, iw = box.w - 68 * S;
  // label (small coral serif) + the answer box with his words typed in green hype
  const ly = box.y + (P ? 92 : 104) * S;
  mono(E, c, `${String(i + 1).padStart(2, "0")} / 07`, x, ly, { size: P ? 21 : 20, weight: 700, color: K.coral });
  E.drawText(c, labelFull(i), x + 106 * S, ly + 2 * S, { font: F.serif, italic: true, weight: 400, size: (P ? 58 : 66) * S, color: K.coral, align: "left" });
  const lines = FIELDS[i].disp.length, inY = ly + 46 * S, inH = (P ? (lines > 1 ? 230 : 160) : lines > 1 ? 280 : 210) * S;
  c.save(); c.beginPath(); c.roundRect(x, inY, iw, inH, 8 * S); c.fillStyle = K.well; c.fill();
  c.lineWidth = Math.max(1, 2 * S); c.strokeStyle = "rgba(146,231,89,0.75)"; c.stroke(); c.restore();
  const af = { font: F.hero, weight: 900, size: (P ? 150 : 190) * S, tracking: -0.03 };
  const full = FIELDS[i].disp.map(([a, b]) => upper(aWords(i).slice(a, b)).join(" "));
  const size = Math.min(...full.map((s2) => E.fitSize(c, s2, af, iw - 70 * S)), lines > 1 ? (P ? 96 : 118) * S : af.size);
  let lastX = x + 30 * S, lastY = inY + inH / 2;
  for (let k = 0; k < lines; k++) {
    const yy = lines > 1 ? inY + inH * (0.3 + 0.42 * k) : inY + inH * 0.52, s2 = answerLine(t, i, k);
    if (!s2) continue;
    E.drawText(c, s2, x + 30 * S, yy, { ...af, size, color: K.green, align: "left" });
    lastX = x + 30 * S + E.measure(c, s2, { ...af, size }); lastY = yy;
  }
  cursor(E, c, t, lastX + 12 * S, lastY - size * 0.36, size * 0.12, size * 0.72, K.green, 0.9);
  // the answer's widget below the field
  const wy = inY + inH + (P ? 34 : 44) * S, wh = box.y + box.h - 30 * S - wy;
  WIDGET[FIELDS[i].key](E, c, t, i, x, wy, iw, wh);
}

// ---------------------------------------------------------------------------------------------------------------- widgets
const onAt = (t, t0, d = 0.06) => E_clamp((t - t0 + 0.034) / d);
const E_clamp = (x) => Math.min(1, Math.max(0, x));
const WIDGET = {
  // "I annualized a Tuesday": 52 weeks x 7 days of revenue. One Tuesday lit ($6.15), then the TUE row copied x52.
  revenue(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", ws = aWords(i);
    const tAnn = ws[1]?.s ?? 101.886, tTue = ws[3]?.s ?? 102.766, tEnd = ws[3]?.e ?? 103.046;
    const a = onAt(t, tAnn, 0.08);
    if (a <= 0) return;
    const lab = 34 * S, pitch = (w - lab) / 52, cell = pitch * 0.78, gy = y + 34 * S;
    mono(E, c, "REVENUE · LAST 52 WEEKS", x, y + 8 * S, { size: P ? 18 : 18, weight: 700, color: K.grey, alpha: a });
    const days = "MTWTFSS";
    const fill = E_clamp((t - tTue + 0.034) / 0.26);   // linear copy, right to left
    for (let r = 0; r < 7; r++) {
      mono(E, c, days[r], x, gy + r * pitch + cell / 2, { size: 13, weight: 700, color: r === 1 ? K.green : K.dgrey, alpha: a });
      for (let k = 0; k < 52; k++) {
        const lit = r === 1 && (k === 51 ? t >= tAnn + 0.1 : 51 - k < fill * 52);
        c.fillStyle = lit ? K.green : "#252824";
        c.globalAlpha = a; c.fillRect(x + lab + k * pitch, gy + r * pitch, cell, cell); c.globalAlpha = 1;
      }
    }
    // the one real sale
    if (t >= tAnn + 0.1) {
      const cx = x + lab + 51 * pitch + cell / 2, cy = gy + pitch + cell / 2;
      c.strokeStyle = K.white; c.lineWidth = 2 * S; c.strokeRect(cx - cell * 0.9, cy - cell * 0.9, cell * 1.8, cell * 1.8);
      mono(E, c, "TUE · 1 SALE · $6.15", cx - cell * 1.4, gy - 14 * S, { size: P ? 16 : 17, weight: 700, color: K.white, align: "right", alpha: onAt(t, tAnn + 0.1) });
    }
    if (fill >= 1) mono(E, c, "× 52", x + lab + 4 * S, gy + pitch * 7 + 20 * S, { size: 22, weight: 700, color: K.green, alpha: onAt(t, tTue + 0.26) });
    // the math
    const ra = onAt(t, tTue + 0.28, 0.05);
    if (ra > 0) {
      const ry = gy + pitch * 7 + (P ? 66 : 74) * S, sc = 0.94 + 0.06 * E.spring(t - tTue - 0.28, 420, 0.5);
      mono(E, c, "$6.15 × 52 =", x, ry, { size: P ? 26 : 30, weight: 600, color: K.grey, alpha: ra, upper: false });
      E.drawText(c, "$319.80 ARR*", x + (P ? 220 : 252) * S, ry + 2 * S, { font: F.hero, weight: 900, size: (P ? 60 : 72) * S, tracking: -0.02, color: K.green, align: "left", alpha: ra, s: sc });
      mono(E, c, "*annualized. his math.", x, ry + (P ? 44 : 52) * S, { size: 17, color: K.dgrey, alpha: ra, upper: false });
    }
  },
  // "Waitlist": 0 active users vs the skit-2 waitlist odometer, still rolling
  users(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", w0 = aWords(i)[0]?.s ?? 104.686, a = onAt(t, w0 + 0.12, 0.05);
    if (a <= 0) return;
    c.save(); c.globalAlpha = a;
    mono(E, c, "ACTIVE USERS", x, y + 10 * S, { size: 18, weight: 700, color: K.grey });
    E.drawText(c, "0", x, y + (P ? 80 : 96) * S, { font: F.mono, weight: 700, size: (P ? 96 : 120) * S, color: K.white, align: "left" });
    const ox = x + (P ? 150 : 190) * S;
    mono(E, c, "WAITLIST  ▲", ox, y + 10 * S, { size: 18, weight: 700, color: K.grey });
    odometer(E, c, ODO_RATE * Math.max(0, t - T.waitT) + 2187, ox, y + 36 * S, { digits: 9, cw: P ? 50 : 56, ch: P ? 76 : 88, size: P ? 48 : 56, gap: 4, commaW: 14 });
    mono(E, c, "agents. since the date started.", ox, y + (P ? 136 : 150) * S, { size: 17, color: K.dgrey, upper: false });
    c.restore();
  },
  // "Next model": the progress bar fills to 99% and stays there
  product(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", ws = aWords(i), t0 = ws[0]?.s ?? 106.606, t1 = ws[1]?.e ?? 106.966;
    const a = onAt(t, t0 + 0.06, 0.05);
    if (a <= 0) return;
    c.save(); c.globalAlpha = a;
    mono(E, c, "SHIPS WHEN", x, y + 10 * S, { size: 18, weight: 700, color: K.grey });
    const n = 24, bw = w - (P ? 150 : 170) * S, seg = bw / n, by = y + 40 * S, bh = (P ? 46 : 54) * S;
    const p = Math.min(0.99, 0.99 * E_clamp((t - t0) / (t1 - t0 + 0.1)));
    for (let k = 0; k < n; k++) {
      const on = (k + 1) / n <= p + 1e-6, last = k === n - 1;
      c.fillStyle = on ? K.green : last && E.beat(t).phase < 0.5 ? K.coral : "#252824";
      c.fillRect(x + k * seg, by, seg * 0.82, bh);
    }
    mono(E, c, `${Math.floor(p * 100)}%`, x + bw + 20 * S, by + bh / 2, { size: P ? 40 : 48, weight: 700, color: K.white });
    mono(E, c, p >= 0.989 ? "stuck at 99% · waiting on: next model" : "loading…", x, by + bh + 34 * S, { size: 18, color: K.dgrey, upper: false });
    c.restore();
  },
  // "Mac mini": the co-founder, in line art (a generic small box with a status LED), plus its stats
  cofounder(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", t0 = aWords(i)[0]?.s ?? 108.506, a = onAt(t, t0 + 0.08, 0.06);
    if (a <= 0) return;
    const bw = (P ? 250 : 310) * S, bh = bw * 0.28, cx = x + bw * 0.58, cy = y + bw * 0.4;
    c.save(); c.globalAlpha = a;
    // isometric slab: top face + front face
    const d = bw * 0.36;
    c.lineWidth = 2 * S; c.strokeStyle = K.ink; c.fillStyle = "#2A2D29";
    c.beginPath(); c.moveTo(cx - bw / 2, cy); c.lineTo(cx, cy - d); c.lineTo(cx + bw / 2, cy); c.lineTo(cx, cy + d); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#1E211F";
    c.beginPath(); c.moveTo(cx - bw / 2, cy); c.lineTo(cx, cy + d); c.lineTo(cx, cy + d + bh * 0.55); c.lineTo(cx - bw / 2, cy + bh * 0.55); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(cx + bw / 2, cy); c.lineTo(cx, cy + d); c.lineTo(cx, cy + d + bh * 0.55); c.lineTo(cx + bw / 2, cy + bh * 0.55); c.closePath(); c.fill(); c.stroke();
    const led = 0.35 + 0.65 * E.pulse("beats", t, 0.18);
    c.fillStyle = K.green; c.globalAlpha = a * led; c.beginPath(); c.arc(cx - bw * 0.36, cy + bh * 0.42, 4 * S, 0, 6.283); c.fill(); c.globalAlpha = a;
    mono(E, c, "co-founder.local", cx, cy + d + bh * 0.55 + 28 * S, { size: 16, color: K.dgrey, align: "center", upper: false });
    const sx = x + bw * 1.25, rows = [["ROLE", "co-founder, CTO"], ["UPTIME", "100%"], ["SLEEP", "never"], ["EQUITY", "50%"]];
    rows.forEach(([k, v], r) => {
      const ra = onAt(t, t0 + 0.12 + r * 0.12, 0.04);
      mono(E, c, k, sx, y + (22 + r * (P ? 46 : 56)) * S, { size: P ? 18 : 20, weight: 700, color: K.grey, alpha: a * ra });
      mono(E, c, v, sx + (P ? 118 : 136) * S, y + (22 + r * (P ? 46 : 56)) * S, { size: P ? 24 : 28, weight: 700, color: v === "never" ? K.coral : K.white, alpha: a * ra, upper: false });
    });
    c.restore();
  },
  // "Tokens": the slot the flown HUD meter lands in (the meter itself is drawn in front: meterFlight)
  salary(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, t0 = aWords(i)[0]?.s ?? 110.406, a = onAt(t, t0, 0.05);
    if (a <= 0) return;
    mono(E, c, "PAID IN", x, y + 10 * S, { size: 18, weight: 700, color: K.grey, alpha: a });
    c.save(); c.setLineDash([8 * S, 8 * S]); c.strokeStyle = K.line; c.lineWidth = Math.max(1, 1.5 * S); c.globalAlpha = a;
    c.strokeRect(x, y + 30 * S, w * 0.9, (E.ORIENT === "portrait" ? 170 : 190) * S); c.restore();
  },
  // "Series B": the funding road. You are at PRE-SEED; the girlfriend unlocks at B (a coral heart lands on "B.")
  girlfriend(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", ws = aWords(i), t0 = ws[0]?.s ?? 112.326, tB = ws[1]?.s ?? 112.566;
    const stops = ["PRE-SEED", "SEED", "SERIES A", "SERIES B"], ly = y + (P ? 120 : 150) * S, x0 = x + 50 * S, x1 = x + w - 80 * S;
    const a = onAt(t, t0 + 0.05, 0.05);
    if (a <= 0) return;
    c.save(); c.globalAlpha = a;
    c.setLineDash([10 * S, 9 * S]); c.strokeStyle = K.dgrey; c.lineWidth = 2 * S; c.beginPath(); c.moveTo(x0, ly); c.lineTo(x1, ly); c.stroke(); c.setLineDash([]);
    stops.forEach((st, k) => {
      const sx = x0 + (x1 - x0) * (k / 3), sa = onAt(t, t0 + 0.06 + k * 0.06, 0.04);
      c.globalAlpha = a * sa;
      c.beginPath(); c.arc(sx, ly, (k === 0 ? 17 : 14) * S, 0, 6.283);
      if (k === 0) { c.fillStyle = K.green; c.fill(); } else { c.fillStyle = K.bg; c.fill(); c.strokeStyle = K.grey; c.lineWidth = 3 * S; c.stroke(); }
      mono(E, c, st, sx, ly + 48 * S, { size: P ? 19 : 22, weight: 700, color: k === 0 ? K.green : K.grey, align: "center" });
    });
    c.globalAlpha = a * onAt(t, t0 + 0.2, 0.05);
    mono(E, c, "YOU ARE HERE ▼", x0 - 18 * S, ly - 44 * S, { size: P ? 19 : 21, weight: 700, color: K.green, align: "left" });
    // the heart, on "B."
    const ha = onAt(t, tB, 0.04);
    if (ha > 0) {
      const hx = x1, hy = ly - (P ? 66 : 80) * S, hs = (P ? 44 : 54) * S * (0.92 + 0.08 * E.spring(t - tB + 0.034, 480, 0.4));
      c.globalAlpha = a * ha; c.fillStyle = K.coral; heart(c, hx, hy, hs); c.fill();
      mono(E, c, "girlfriend: unlocks here", x1 - hs * 1.2, hy - hs * 0.2, { size: P ? 18 : 21, weight: 600, color: K.coral, align: "right", upper: false });
    }
    c.restore();
  },
  // "Post-AGI": five years planned, every row starts after the chart ends
  fiveyears(E, c, t, i, x, y, w, h) {
    const S = E.SCALE, P = E.ORIENT === "portrait", t0 = aWords(i)[0]?.s ?? 114.7, a = onAt(t, t0 + 0.05, 0.05);
    if (a <= 0) return;
    const years = ["2026", "2027", "2028", "2029", "2030"], lab = (P ? 140 : 170) * S, cw = (w - lab - (P ? 150 : 260) * S) / 5, gy = y + 40 * S, rh = (P ? 52 : 58) * S;
    c.save(); c.globalAlpha = a;
    years.forEach((yr, k) => {
      const xx = x + lab + k * cw;
      mono(E, c, yr, xx + 6 * S, y + 12 * S, { size: P ? 18 : 20, weight: 700, color: K.grey, upper: false });
      c.fillStyle = K.line; c.fillRect(xx, gy, Math.max(1, S), rh * 3 + 10 * S);
    });
    ["product", "revenue", "girlfriend"].forEach((row, r) => {
      const ra = onAt(t, t0 + 0.12 + r * 0.12, 0.04), yy = gy + 10 * S + r * rh + rh / 2;
      c.globalAlpha = a * ra;
      mono(E, c, row, x, yy, { size: P ? 21 : 24, weight: 600, color: K.ink, upper: false });
      const ex = x + lab + 5 * cw, sl = (1 - E.ease.outCubic(E_clamp((t - t0 - 0.12 - r * 0.12) / 0.2))) * 60 * S;
      c.fillStyle = K.green; c.fillRect(ex + 8 * S + sl, yy - 12 * S, 40 * S, 24 * S);
      mono(E, c, "→ post-AGI", ex + 58 * S + sl, yy, { size: P ? 19 : 22, weight: 700, color: K.green, upper: false });
    });
    c.restore();
  },
};
function heart(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s * 1.1, y - s * 0.35, x - s * 0.45, y - s * 1.05, x, y - s * 0.45);
  c.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s * 1.1, y - s * 0.35, x, y + s * 0.35);
  c.closePath();
}

// ---------------------------------------------------------------------------------------------------------------- the meter flight
// The HUD meter leaves its corner on the Tokens. cut, lands in the salary slot at 2.2x on the next 16th, burns there,
// and flies home on the next cut. Returns {x, y, k} or null.
function meterFlight(E, t, box) {
  if (t < T.fly0 || t >= T.fly1) return null;
  const S = E.SCALE, P = E.ORIENT === "portrait", home = meterHome(E);
  const wsA = aWords(4), inH = (P ? 160 : 210) * S, wy = box.y + (P ? 92 : 104) * S + 46 * S + inH + (P ? 34 : 44) * S;
  const k1 = P ? 1.75 : 2.15, dest = [box.x + 34 * S + 20 * S, wy + 44 * S];
  const tin = T.fly0, din = 0.15, tout = T.fly1 - 0.16;
  let u;
  if (t < tout) u = E.ease.outCubic(E_clamp((t - tin) / din));
  else u = 1 - E.ease.inCubic(E_clamp((t - tout) / 0.16));
  return { x: E.lerp(home[0], dest[0], u), y: E.lerp(home[1], dest[1], u), k: E.lerp(1, k1, u) };
}

// ---------------------------------------------------------------------------------------------------------------- F: review + verdict
function drawF(E, c, t, box) {
  const S = E.SCALE, P = E.ORIENT === "portrait";
  chrome(E, c, t, box, t < T.omg ? "7/7 · SUBMITTED" : "7/7 · DECLINED");
  const x = box.x + 34 * S, iw = box.w - 68 * S, rowH = (P ? 66 : 74) * S;
  let y = box.y + (P ? 96 : 104) * S;
  for (let k = 0; k < 7; k++, y += rowH) histRow(E, c, k, x, y, iw, rowH, 1, true);
  // reviewing bar through the silence (linear), then the reviewer's notes: her line, typed in coral serif
  const ry = y + (P ? 10 : 20) * S;
  if (t < T.omg) {
    const p = E_clamp((t - T.f) / (T.omg - T.f));
    mono(E, c, "REVIEWING", x, ry, { size: 20, weight: 700, color: K.grey });
    const bx = x + 170 * S, bw = iw - 260 * S;
    c.fillStyle = "#252824"; c.fillRect(bx, ry - 9 * S, bw, 18 * S);
    c.fillStyle = K.ink; c.fillRect(bx, ry - 9 * S, bw * p, 18 * S);
    mono(E, c, `${Math.floor(p * 100)}%`, bx + bw + 16 * S, ry, { size: 20, weight: 700, color: K.ink });
  } else {
    mono(E, c, "REVIEWER NOTES", x, ry, { size: 20, weight: 700, color: K.coral });
    const ws = OMG?.words ?? [];
    const txt = typedWords(ws, ws.map((w) => w.w), t, 0.16);
    const sf = { font: F.serif, italic: true, weight: 400, size: (P ? 84 : 96) * S, tracking: -0.01 };
    if (txt) E.drawText(c, txt, x + (P ? 0 : 230) * S, ry + (P ? 64 : 4) * S, { ...sf, color: K.coral, align: "left" });
    if (ws.length && t >= T.god) {
      const full = ws.map((w) => w.w).join(" "), pre = ws.slice(0, -1).map((w) => w.w).join(" ") + " ";
      const gx = x + (P ? 0 : 230) * S + E.measure(c, pre, sf), gw = E.measure(c, ws[ws.length - 1].w, sf);
      B.penUnderline(c, gx, ry + (P ? 64 : 4) * S + sf.size * 0.42, gx + gw, t, T.god + 0.05, { width: 6 * S, dur: 0.16, seed: 9 });
    }
  }
}
function drawVerdict(E, c, t, box) {
  const S = E.SCALE, P = E.ORIENT === "portrait";
  // red pen through every answer, one per 16th from the drums' return
  const x = box.x + 34 * S, iw = box.w - 68 * S, rowH = (P ? 66 : 74) * S, y0 = box.y + (P ? 96 : 104) * S;
  for (let k = 0; k < 7; k++) {
    const t0 = T.drums + k * (E.spb / 4), yy = y0 + k * rowH + 2 * S;
    const ax = x + 52 * S + 250 * S, af = { font: F.hero, weight: 800, size: 46 * S, tracking: -0.01 };
    const aw = Math.min(E.measure(c, answerFull(k), { ...af, size: E.fitSize(c, answerFull(k), af, iw - 250 * S - 60 * S) }), iw - 250 * S - 60 * S);
    B.penStrike(c, ax, yy, ax + aw, t, t0, { width: 6 * S, dur: 0.1, seed: 11 + k });
  }
  // DECLINED, on "Oh"
  const cx = P ? box.x + box.w * 0.5 : E.W * 0.655, cy = P ? box.y + box.h * 0.5 : E.H * 0.555;
  B.stamp(E, c, "DECLINED", cx, cy, t, T.omg - 0.034, { S, size: P ? 140 : 172, rot: -0.13 });
}

// ---------------------------------------------------------------------------------------------------------------- speaker tags
function speakerTag(E, c, t, s, p) {
  const S = E.SCALE, P = E.ORIENT === "portrait", her = s.id !== "a";
  const nose = smoothPt(p.v, p.lt, 0), eyes = smoothMean(p.v, p.lt, [2, 5]);
  if (!nose || !eyes) return;
  const [nx, ny] = E.plateToScreen(E, p.v, nose, p.o), [ex, ey] = E.plateToScreen(E, p.v, eyes, p.o);
  const fh = Math.max(120 * S, Math.abs(ny - ey) * 7.0), fw = fh * 0.84, bx = nx - fw / 2, by = ny - fh * 0.56;
  const col = her ? K.coral : K.green, a = E_clamp((t - s.t0) / 0.05);
  brackets(E, c, bx, by, fw, fh, { color: col, alpha: a * 0.9, len: 26, lw: 2 });
  if (her) voiceBars(E, c, t, bx + fw + 16 * S, by + fh * 0.75, { color: K.coral, alpha: a * 0.9, h: 34 });
}
