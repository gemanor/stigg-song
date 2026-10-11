// SKIT 2 (56.12-68.02) · look E TERMINAL · "agents for agents" · owner A4
// Spoken over a lone kick. One cut per line, each on the beat before its line. Kit: ./skit2/term.js, graph: ./skit2/graph.js
// HUD subtitle off for the whole skit: her lines are set as coral-serif prompts, his as hype type, every word on its onset.
//
// PLAN (onsets from engine/data/lyrics.json "skit2"; beats/downbeats from engine/data/audio.json)
//  time    word / event              visual                                                              layer   cut / camera
//  56.12   (hard cut in, downbeat)   THE TABLE: date_table 2.60-5.94 (she sips + side-eyes, he ends on a  back    shot 1, slow 0.6%/s push
//                                    pleased smile), keyed over the terminal ground; floor line + contact
//                                    shadow; SESSION panel (HUMANS 1) + pitch.log panel; tracked brackets  front
//                                    HUMAN_01 (her anchor) / FOUNDER_01 (his pose) + her voice bars
//  56.47   So .. 58.59 do?           her line as the session prompt "HER >", coral serif, word by word     front
//  58.15   actually                  red-pen underline under "actually"                                    front
//  56.60/57.56/58.50 (beats)         pitch.log prints bursts of 4 lines on 16ths                            front
//  59.46   (beat)                    CUT him_cu_talk 2.40-5.26 (open-palm gesture), slow push              -       shot 2
//  59.77   We / 59.83 build          WE BUILD (hype, white); "-2,594 / -1,805" token receipt beside his face front  ticks = brand meter events
//  60.09   agents.                   AGENTS. (green) + AGENT card #1 pops (0.92->1) at the end of a green   back    beam tracked to his hand
//                                    deploy beam from his hand
//  61.21   For                       FOR; the chain pans left (in-out 0.32 s), arrow 1 draws               back
//  61.73   agents.                   AGENTS. + card #2                                                      back
//  61.85   (music drops out)         card #3 (-> AGENT), every card reveals the same chain inside           back
//  61.85-62.32 (dropout)             THE DIVE: inCubic zoom into card #2 (Droste, Z = 4.47 per level); he   back    the camera flies past him
//                                    scales up and slides out of frame; the hype type fades
//  62.32   (downbeat, kick returns)  CUT her_cu_talk 0.00-3.32 (wide) in front of the graph zooming forever mid     shot 3; a zoom step on
//                                    (DEPTH n · N AGENTS · 0 SHIPPED)                                              every beat (kick)
//  62.47   And .. 64.07 do?          her line in a her.ask() prompt panel, coral serif                       front
//  63.65   agents                    red-pen circle around one AGENT node, following it as it grows         front
//  62.80/63.74/64.70 (beats)         log: planning the plan / waiting on agent_0045 <-> agent_0044 / ...    front
//  65.64   (beat)                    CUT him_cu_talk 0.55-2.93 (tight, deadpan); scrim behind the type      mid     shot 4
//  65.67   ...They're .. 67.01 the   ...THEY'RE ON THE (hype); the zoom decelerates                         front
//  67.13   waitlist.                 WAITLIST. as a grey pill (inverse); EVERY node flips to a grey          front   zoom stops dead; punch 0.015
//                                    WAITLISTED pill (0.16 s flips rippling 0.30 s from the centre); the    back
//                                    AGENTS ON WAITLIST odometer slams in and rolls (1.4M/s, linear)        front
//  68.02   (downbeat)                hard cut to verse 2 (last frames: the pill + the odometer mid-roll)
// Meter: the HUD meter burns on each of his words (brand.tokensAt); every card carries a usage bar; "0 shipped" everywhere.
// Portrait: content starts under the HUD meter (R.y+160..), close-ups at zoom ~1.3 with faces inside the safe band.
import * as B from "../brand.js";
import { K, F, tryClip, inClip, smoothPt, smoothMean, ground, panel, mono, serif, hype, drawLog, burstTimes, odometer,
  tokenTicks, mouthOf, brackets, beatAtOrBefore, shotAt, voiceBars, statusBar } from "./skit2/term.js";
import { drawGraph, cardRect, Z } from "./skit2/graph.js";

let g, DT, HIM, HER, W = [], L = [], SH = [], LOG = [], LOG_T1 = [], T = {};
const ODO_RATE = 1.4e6;           // agents joining the waitlist per second after "waitlist" (the bridge's Users? field reuses it)

function words(E) {
  const ws = E.words.filter((w) => w.section === "skit2");
  return ws;
}

export default {
  async load(E, layer) {
    g = E.makeG2D(E.W, E.H);
    [DT, HIM, HER] = await Promise.all([tryClip(E, "date_table"), tryClip(E, "him_cu_talk"), tryClip(E, "her_cu_talk")]);
    W = words(E);
    // lines in order: HER, HIM, HER, HIM
    L = [];
    for (const w of W) { if (!L.length || L[L.length - 1].li !== w.li) L.push({ li: w.li, sp: B.speakerOf(w), ws: [] }); L[L.length - 1].ws.push(w); }
    const wq = (i, fb) => W[i]?.s ?? fb;
    T = {
      start: layer.start, end: layer.end,
      c2: beatAtOrBefore(E, wq(7, 59.766) - 0.05),        // 59.46
      c3: beatAtOrBefore(E, wq(12, 62.466)),              // 62.32
      c4: beatAtOrBefore(E, wq(18, 65.666)),              // 65.64
      agents1: wq(9, 60.086), forW: wq(10, 61.206), agents2: wq(11, 61.726),
      actually: wq(5, 58.146), those: wq(15, 63.306), agentsQ: wq(16, 63.646),
      wait: wq(21, 67.126),
    };
    T.card3 = T.agents2 + 0.12;     // the 16th after "agents."
    T.dive = T.agents2 + 0.13;
    SH = [
      { id: "table", t0: T.start, t1: T.c2 },
      { id: "build", t0: T.c2, t1: T.c3 },
      { id: "ask", t0: T.c3, t1: T.c4 },
      { id: "wait", t0: T.c4, t1: T.end },
    ];
    // ---- the log (bursts of 4 lines on 16ths, starting on beats)
    const beatsIn = (a, b) => E.A.beats.filter((x) => x >= a - 1e-3 && x < b);
    const G = K.green, I = K.ink, Gr = K.grey, Co = K.coral;
    const bursts = [
      { at: beatsIn(T.c2, T.c3)[1], lines: [["$ agents init --for agents", Gr], ["spawned agent_0001", G], ["agent_0001 -> building", I], ["   an agent for agent_0002", I]] },
      { at: beatsIn(T.c2, T.c3)[4], lines: [["agent_0003 -> building agent for agent_0004", I], ["recursion depth 4  max_depth=none", Gr], ["customers: agents  users: agents", Gr], ["revenue: agents (pending)", Gr]] },
      { at: beatsIn(T.c3, T.c4)[1], lines: [["agent_0042: planning the plan", I], ["agent_0044: waiting on agent_0045", I], ["agent_0045: waiting on agent_0044", I], ["agent_0107: summarizing agent_0106's summary", I]] },
      { at: beatsIn(T.c3, T.c4)[3], lines: [["agent_0108: scheduling a sync with agent_0109", I], ["agent_0109: writing a PRD for agent_0110", I], ["agent_0110: requesting more tokens", G], ["tokens: burning   shipped: 0", Co]] },
      { at: beatsIn(T.c3, T.c4)[5], lines: [["agent_0243: thinking...", Gr], ["agent_0244: thinking...", Gr], ["agent_0245: thinking...", Gr], ["agent_0246: thinking...", Gr]] },
      { at: T.wait, lines: [["agent_0001: WAITLISTED", Gr], ["agent_0002: WAITLISTED", Gr], ["agent_0003: WAITLISTED", Gr], ["agent_0004: WAITLISTED", Gr]] },
      { at: T.wait + E.spb, lines: [["agent_0005: WAITLISTED", Gr], ["agent_0006: WAITLISTED", Gr], ["... 1,048,570 more: WAITLISTED", Gr], ["shipped: 0", Co]] },
    ];
    const b1 = beatsIn(T.start, T.c2);
    LOG_T1 = [];
    for (const [k, lines] of [[1, [["$ date --table 04", Gr], ["her.ask(company?)", Co], ["load pitch_v47.key", I], ["tone=visionary", Gr]]],
                              [3, [["buzzwords: 12 loaded", Gr], ["product: null", Gr], ["answer.compose()", I], ["thinking... 812 tok", G]]],
                              [5, [["answer.ready = true", G], ["confidence: 100%", G], ["evidence: 0", Co], ["> speak", I]]]]) {
      if (b1[k] == null) continue;
      const ts = burstTimes(E, [b1[k]], lines.length);
      lines.forEach(([text, color], q) => LOG_T1.push({ t: ts[q], text, color }));
    }
    LOG = [];
    for (const b of bursts) { if (b.at == null) continue; const ts = burstTimes(E, [b.at], b.lines.length); b.lines.forEach(([text, color], k) => LOG.push({ t: ts[k], text, color })); }
    LOG.sort((a, b) => a.t - b.t);
  },

  async prepare(E, t, layer) {
    const s = shotAt(SH, t), jobs = [];
    for (const p of plates(E, t, s)) jobs.push(p.v.frame(p.lt));
    await Promise.all(jobs);
  },

  render(E, t, rt, layer) {
    const S = E.SCALE, c = g.ctx, s = shotAt(SH, t), P = E.ORIENT === "portrait";
    E.renderer.setRenderTarget(rt);
    const pl = plates(E, t, s);
    // ---------------------------------------------------------------- BACK: ground + graph
    g.clear();
    ground(E, c, { alpha: 0.42, offY: s.id === "table" ? 0 : -(t - T.c2) * 14 * S });
    const G = graphState(E, t, s);
    if (G) drawGraph(E, c, G);
    if (s.id === "build") buildBack(E, c, t, G, pl);
    if (s.id === "wait") scrim(E, c, P ? "top" : "left", 0.86);
    if (s.id === "table") tableBack(E, c, t);
    g.commit(); E.blitG2D(E, g, 1);
    // ---------------------------------------------------------------- the cut-outs (clean, matte only)
    for (const p of pl) E.drawPlate(E, p.v, p.o);
    // ---------------------------------------------------------------- FRONT
    g.clear();
    if (s.id === "table") tableFront(E, c, t, pl);
    else if (s.id === "build") buildFront(E, c, t, G, pl);
    else if (s.id === "ask") askFront(E, c, t, G, pl);
    else waitFront(E, c, t, G, pl);
    if (P && s.id !== "table" && pl.length) statusBar(E, c, t, E.H * 0.81, s.id === "wait" && t >= T.wait ? "agents.exe  ·  all agents waitlisted  ·  0 shipped" : `agents.exe  ·  depth ${G ? depthOf(G) : 1}  ·  0 shipped`);
    g.commit(); E.blitG2D(E, g, 1);

    // ---------------------------------------------------------------- HUD + post
    E.hud.sub = false;   // every line of the skit is set by the scene (her prompt lines, his hype lines)
    E.hud.label = s.id === "table" ? "TABLE_04" : s.id === "build" ? (t < T.dive ? "SPAWN" : "RECURSE") : t >= T.wait ? "WAITLISTED" : `DEPTH ${depthOf(G)}`;
    if (t >= T.wait) E.post.punch = 0.015 * Math.exp(-(t - T.wait) / 0.12);
  },
};

// ---------------------------------------------------------------------------------------------------------------- plates
// Each shot's footage: {v, lt, o} (o = drawPlate opts, always matte). Positions are 1080p px offsets (drawPlate scales them).
function plates(E, t, s) {
  const P = E.ORIENT === "portrait", out = [];
  const fitH = HIM && E.plateFit(E, HIM), fitR = HER && E.plateFit(E, HER);
  const lt = t - s.t0;
  if (s.id === "table") {
    if (DT) {
      out.push({ v: DT, lt: inClip(DT, 2.6 + lt), o: { fit: E.plateFit(E, DT), matte: true, ...(P ? { zoom: 1.25, x: 0, y: 276 } : { zoom: 0.76 + 0.006 * lt, x: 0, y: 128 }) }, who: "both" });
    } else {
      // slot fallback until date_table lands: her and him facing each other across a table
      if (HER) out.push({ v: HER, lt: inClip(HER, 2.55 + lt), o: { fit: fitR, matte: true, ...(P ? { zoom: 0.96, x: -110, y: 300 } : { zoom: 0.62, x: -170, y: 182 }) }, who: "her" });
      if (HIM) out.push({ v: HIM, lt: inClip(HIM, 0.5 + lt), o: { fit: fitH, matte: true, ...(P ? { zoom: 0.96, x: 130, y: 300 } : { zoom: 0.62, x: 182, y: 182 }) }, who: "him" });
    }
  } else if (s.id === "build" && HIM) {
    const o = { fit: fitH, matte: true, ...(P ? { zoom: 1.3, x: -131, y: 294 } : { zoom: 0.92, x: 330, y: 48 }) };
    o.zoom *= 1 + 0.035 * Math.min(1, lt / 2.4); o.x += (P ? 8 : 26) * Math.min(1, lt / 2.4);   // slow push toward him
    // the dive pushes him out of frame (scale + slide), so the camera seems to fly past him into the graph
    if (t > T.dive) {
      const p = E.ease.inCubic(E.clamp((t - T.dive) / (T.c3 - T.dive)));
      o.zoom *= 1 + 1.3 * p; o.x += (P ? 420 : 900) * p; o.y += (P ? 380 : 260) * p;
    }
    out.push({ v: HIM, lt: inClip(HIM, 2.4 + lt), o, who: "him" });
  } else if (s.id === "ask" && HER) {
    out.push({ v: HER, lt: inClip(HER, 0.0 + lt), o: { fit: fitR, matte: true, ...(P ? { zoom: 1.35, x: 202, y: 289 } : { zoom: 0.9 + 0.012 * lt, x: -150, y: 62 }) }, who: "her" });
  } else if (s.id === "wait" && HIM) {
    out.push({ v: HIM, lt: inClip(HIM, 0.55 + lt), o: { fit: fitH, matte: true, ...(P ? { zoom: 1.35, x: -228, y: 290 } : { zoom: 1.12 + 0.01 * lt, x: 175, y: 140 }) }, who: "him" });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- graph state
function graphState(E, t, s) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE;
  if (s.id === "table") return null;
  const G = { t, W: E.W, H: E.H, flipT: null, flipC: [E.W / 2, E.H / 2], alpha: 1, depth0: 0 };
  // zoom position u (levels). Beat steps: each beat adds a step that eases out over 0.28 s (the kick drives the dive).
  const steps = (a, b, k, te) => { let u = 0; for (const bt of E.A.beats) { if (bt < a - 1e-3 || bt >= b) continue; if (bt > te) break; u += k * E.ease.outCubic(E.clamp((te - bt) / 0.28)); } return u; };
  if (s.id === "build") {
    const p = t > T.dive ? E.ease.inCubic(E.clamp((t - T.dive) / (T.c3 - T.dive))) : 0;
    G.Wbase = (P ? R.w * 1.33 : E.W * 1.1) * (1 + 0.03 * E.clamp((t - T.c2) / 2.4));
    const step = 0.37 * G.Wbase;
    // card 1 alone first; on "For" the chain pans left so card 2 lands in frame; then the dive into card 2
    const pan = E.ease.inOutCubic(E.clamp((t - (T.forW - 0.05)) / 0.32));
    const x0 = (P ? R.x + R.w * 0.34 : E.W * 0.27) + step, x1 = P ? R.x + R.w * 0.56 : E.W * 0.43;
    const oy0 = P ? R.y + 470 * S : E.H * 0.62;
    const o1 = [E.W * 0.5, P ? R.y + R.h * 0.4 : E.H * 0.5];
    G.ox = E.lerp(E.lerp(x0, x1, pan), o1[0], p); G.oy = E.lerp(oy0, o1[1], p);
    G.u = 1.35 * p;
    G.cardOn = [T.agents1, T.agents2, T.card3];
    G.arrowOn = [T.forW, T.card3 - 0.04];
    G.innerOn = E.clamp((t - (T.card3 + 0.02)) / 0.1);
    G.labelFor = false;
  } else if (s.id === "ask") {
    G.ox = P ? R.x + R.w * 0.5 : E.W * 0.68; G.oy = P ? R.y + 560 * S : E.H * 0.62;
    G.Wbase = P ? R.w * 1.05 : E.W * 0.92;
    G.u = 0.35 + 0.14 * (t - T.c3) + steps(T.c3, T.c4, 0.2, t);
    G.depth0 = 2;
  } else {
    G.ox = P ? R.x + R.w * 0.5 : E.W * 0.46; G.oy = P ? R.y + 520 * S : E.H * 0.5;
    G.Wbase = P ? R.w * 1.05 : E.W * 0.86;
    // the zoom stops dead on "waitlist" (u frozen at that instant, then a 0.03 levels/s drift so nothing freezes);
    // u0 puts the frame at 3 nodes + their children on the flip
    const te = Math.min(t, T.wait);
    G.u = 0.57 + 0.1 * (te - T.c4) + steps(T.c4, T.wait, 0.12, te) + (t > T.wait ? 0.03 * (t - T.wait) : 0);
    G.flipT = T.wait; G.flipC = [G.ox, G.oy];
    G.depth0 = 5;
  }
  return G;
}
const depthOf = (G) => Math.floor(Math.max(0, G.u)) + (G.depth0 ?? 0) + 1;

// date_table clip UV anchors: the pose tracks HIM (nose ~0.65,0.21); HER sits still, chin on hand, face ~(0.272, 0.19)
const HER_FACE_DT = [0.272, 0.185], FEET_DT = 0.962;
function tableBack(E, c, t) {
  const S = E.SCALE, P = E.ORIENT === "portrait";
  if (!DT) {
    const ty = P ? 1300 * S : E.H * 0.935;
    c.save(); const gr = c.createLinearGradient(0, ty - 420 * S, 0, ty);
    gr.addColorStop(0, "rgba(146,231,89,0)"); gr.addColorStop(1, "rgba(146,231,89,0.06)");
    c.fillStyle = gr; c.fillRect(0, ty - 420 * S, E.W, 420 * S); c.restore();
    return;
  }
  // floor: a green hairline at their feet and a soft contact shadow under the table and chairs (a graphic, under the cut-out)
  const o = { fit: E.plateFit(E, DT), ...(P ? { zoom: 1.25, x: 0, y: 276 } : { zoom: 0.76 + 0.006 * (t - T.start), x: 0, y: 128 }) };   // same framing as plates()
  const [fx0, fy] = E.plateToScreen(E, DT, [0.15, FEET_DT], o), [fx1] = E.plateToScreen(E, DT, [0.85, FEET_DT], o);
  c.save();
  c.fillStyle = "rgba(146,231,89,0.28)"; c.fillRect(0, fy, E.W, Math.max(1, S));
  const cx = (fx0 + fx1) / 2, rx = (fx1 - fx0) * 0.56, ry = 26 * S * (P ? 1.4 : 1);
  const gr = c.createRadialGradient(cx, fy, 0, cx, fy, rx);
  gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  c.translate(cx, fy); c.scale(1, ry / rx); c.translate(-cx, -fy);
  c.fillStyle = gr; c.beginPath(); c.arc(cx, fy, rx, 0, 6.283); c.fill();
  c.restore();
}
function tableFront(E, c, t, pl) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE, lt = t - T.start;
  if (!DT) {
    const ty = P ? 1300 * S : E.H * 0.935;
    c.fillStyle = K.panel; c.fillRect(0, ty, E.W, E.H - ty);
    c.fillStyle = K.line; c.fillRect(0, ty, E.W, Math.max(1, S));
  }
  // tracked tags: HIM from the pose; HER from her anchor in the clip (she barely moves)
  for (const p of pl) {
    const faces = [];
    if (p.who === "both") {
      const nose = smoothPt(p.v, p.lt, 0), eyes = smoothMean(p.v, p.lt, [2, 5]);
      faces.push({ her: true, c: E.plateToScreen(E, p.v, HER_FACE_DT, p.o), fh: null });
      if (nose && eyes) faces.push({ her: false, n: E.plateToScreen(E, p.v, nose, p.o), e: E.plateToScreen(E, p.v, eyes, p.o) });
    } else {
      const nose = smoothPt(p.v, p.lt, 0), eyes = smoothMean(p.v, p.lt, [2, 5]);
      if (nose && eyes) faces.push({ her: p.who === "her", n: E.plateToScreen(E, p.v, nose, p.o), e: E.plateToScreen(E, p.v, eyes, p.o) });
    }
    const scl = p.o.zoom * (P ? 0.56 : 1);
    for (const f of faces) {
      let fx, fy, fw, fh;
      if (f.n) { fh = Math.max(70 * S, Math.abs(f.n[1] - f.e[1]) * 7.2); fw = fh * 0.82; fx = f.n[0] - fw / 2; fy = f.n[1] - fh * 0.56; }
      else { fh = 250 * S * scl; fw = fh * 0.8; fx = f.c[0] - fw / 2; fy = f.c[1] - fh * 0.5; }
      const on = 1;   // present on the hard cut in
      if (on <= 0) continue;
      const col = f.her ? K.coral : K.green;
      brackets(E, c, fx, fy, fw, fh, { color: col, alpha: on, len: 20, lw: 2 });
      const side = P ? 0 : f.her ? -1 : 1;
      const tx = P ? fx + fw / 2 : f.her ? fx - 16 * S : fx + fw + 46 * S, ty = P ? fy - 58 * S : fy + 16 * S;
      const al = P ? "center" : f.her ? "right" : "left";
      mono(E, c, f.her ? "HUMAN_01" : "FOUNDER_01", tx, ty, { size: P ? 26 : 21, weight: 700, color: col, align: al, alpha: on });
      mono(E, c, f.her ? "asking" : "pre-seed · 0 shipped", tx, ty + (P ? 30 : 27) * S, { size: P ? 21 : 17, color: K.grey, align: al, alpha: on, upper: false });
      if (f.her) voiceBars(E, c, t, P ? tx - 30 * S : tx - 60 * S, ty + (P ? 88 : 80) * S, { color: K.coral, alpha: on * 0.9, h: 28 });
    }
  }
  // her question, as the session prompt: "HER >" + the words in coral serif on their onsets
  const Lq = L[0];
  if (Lq) promptLine(E, c, t, Lq.ws, P ? { x: R.x + 20 * S, y: R.y + 210 * S, maxW: R.w - 40 * S, size: 88, lines: 3 } : { x: E.W * 0.06, y: E.H * 0.2, maxW: E.W * 0.9, size: 92, lines: 1 }, T.actually);
  if (P || !DT) return;
  // side panels: SESSION facts (left) and the log printing on 16ths (right)
  const a = 1, py = E.H * 0.37, ph = E.H * 0.33;
  panel(E, c, E.W * 0.03, py, E.W * 0.185, ph, { title: "session", titleSize: 15, titleH: 38, alpha: a, dot: K.green });
  const rows = [["SESSION", "date_01"], ["TABLE", "04"], ["GUESTS", "2"], ["HUMANS", "1"], ["ORDERS", "1 matcha"], ["BILL", "pending"]];
  rows.forEach(([k, v], i) => {
    const ra = a, yy = py + (70 + i * 39) * S;   // a full dashboard on the first frame
    mono(E, c, k, E.W * 0.03 + 22 * S, yy, { size: 16, color: K.grey, alpha: ra });
    mono(E, c, v, E.W * 0.03 + 128 * S, yy, { size: 17, weight: 600, color: k === "HUMANS" ? K.coral : K.ink, alpha: ra, upper: false });
  });
  panel(E, c, E.W * 0.785, py, E.W * 0.185, ph, { title: "pitch.log", titleSize: 15, titleH: 38, alpha: a, dot: K.green });
  drawLog(E, c, LOG_T1, t, E.W * 0.785 + 20 * S, py + 70 * S, { rows: 7, size: 15, lh: 31, alpha: a });
}

// HER's line as a terminal prompt. Words appear on their onsets (anticipation <= 2 frames), hero underline on `hero`.
function promptLine(E, c, t, ws, o, heroT) {
  const S = E.SCALE, size = o.size * S;
  const f = { font: F.serif, italic: true, weight: 400, size, tracking: -0.005 };
  // lay out (wrap to maxW), fit if needed
  let k = 1, lines;
  for (let pass = 0; pass < 6; pass++) {
    lines = [[]]; let x = 0;
    const sp = E.measure(c, " ", { ...f, size: size * k });
    for (const w of ws) {
      const ww = E.measure(c, w.w, { ...f, size: size * k });
      if (x > 0 && x + ww > o.maxW - 120 * S) { lines.push([]); x = 0; }
      lines[lines.length - 1].push({ w, x, ww }); x += ww + sp;
    }
    if (lines.length <= o.lines) break;
    k *= 0.9;
  }
  const lh = size * k * 1.08, first = ws[0];
  if (t < first.s - 0.6) return;
  mono(E, c, "HER ›", o.x, o.y + 4 * S, { size: 26, weight: 700, color: K.coral, alpha: E.clamp((t - first.s + 0.6) / 0.1) });
  let lastX = o.x + 110 * S, lastY = o.y;
  lines.forEach((ln, li) => ln.forEach(({ w, x, ww }) => {
    const a = E.clamp((t - w.s + 0.034) / 0.05);
    if (a <= 0) return;
    const yy = o.y + li * lh, dy = (1 - E.ease.outCubic(E.clamp((t - w.s + 0.034) / 0.16))) * 14 * S;
    E.drawText(c, w.w, o.x + 110 * S + x, yy + dy, { ...f, size: size * k, color: K.coral, align: "left", alpha: a });
    lastX = o.x + 110 * S + x + ww; lastY = yy;
    if (w.s === heroT) B.penUnderline(c, o.x + 110 * S + x, yy + size * k * 0.42, o.x + 110 * S + x + ww, t, w.s + 0.05, { width: 6 * S, dur: 0.2, seed: 4 });
  }));
  // cursor after the last typed word while the line is live
  const lw = ws[ws.length - 1];
  if (t < lw.e + 0.6) { const cs = 0.62 * size * k; if (E.beat(t).phase < 0.5) { c.fillStyle = K.coral; c.fillRect(lastX + 14 * S, lastY - cs * 0.55, 0.08 * cs * 2.2, cs); } }
}

// a dark gradient over the ground/graph behind a type column (never over the character: it is drawn before the cut-out)
function scrim(E, c, side, a) {
  const g2 = side === "left" ? c.createLinearGradient(0, 0, E.W * 0.62, 0) : c.createLinearGradient(0, 0, 0, E.H * 0.5);
  g2.addColorStop(0, `rgba(19,21,18,${a})`); g2.addColorStop(0.55, `rgba(19,21,18,${a * 0.7})`); g2.addColorStop(1, "rgba(19,21,18,0)");
  c.fillStyle = g2; c.fillRect(0, 0, side === "left" ? E.W * 0.62 : E.W, side === "left" ? E.H : E.H * 0.5);
}

// ---------------------------------------------------------------------------------------------------------------- shot 2: build
function handPos(E, p, lt) {
  const h = smoothPt(p.v, lt, 20, 0.5) ?? smoothPt(p.v, lt, 16, 0.5) ?? [0.42, 0.85];
  return E.plateToScreen(E, p.v, h, p.o);
}
function buildBack(E, c, t, G, pl) {
  // the deploy beam: a green line from his hand to each card as it spawns (tracked to the hand)
  const S = E.SCALE, p = pl[0];
  if (!p || !G) return;
  const ts = [T.agents1, T.agents2, T.card3];
  ts.forEach((ta, j) => {
    const age = t - ta + 0.034;
    if (age < 0 || age > 0.42) return;
    const [hx, hy] = handPos(E, p, p.lt);
    const r = cardRect(G, 0, j);
    const u = E.ease.outCubic(E.clamp(age / 0.12)), fade = 1 - E.clamp((age - 0.16) / 0.26);
    c.save(); c.strokeStyle = K.green; c.lineWidth = 3 * S; c.globalAlpha = fade;
    c.beginPath(); c.moveTo(hx, hy);
    const tx = E.lerp(hx, r.cx, u), ty = E.lerp(hy, r.y + r.h, u);
    c.quadraticCurveTo((hx + tx) / 2, Math.max(hy, ty) + 40 * S, tx, ty); c.stroke();
    c.fillStyle = K.green; c.beginPath(); c.arc(hx, hy, 9 * S * (1 + 0.6 * (1 - u)), 0, 6.283); c.fill();
    c.restore();
  });
}
function buildFront(E, c, t, G, pl) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE, p = pl[0];
  // his words burn tokens: ticks from his mouth (mouth position at each word's onset, clip time 2.4 + ts - cut)
  if (p) tokenTicks(E, c, t, L[1]?.ws ?? [], (ts) => mouthOf(E, p.v, inClip(p.v, 2.4 + ts - T.c2), p.o), { size: P ? 34 : 30 });
  // his line, hype type: WE BUILD AGENTS. / FOR AGENTS. (AGENTS in green, each word on its onset; it leaves with the dive)
  const ws = L[1]?.ws ?? [];
  const out = t > T.dive ? E.clamp((t - T.dive) / 0.12) : 0;
  if (ws.length >= 5 && out < 1) {
    const x = P ? R.x + 24 * S : E.W * 0.045, y1 = P ? R.y + 200 * S : E.H * 0.2, size = P ? 92 : 112;
    const push = 1 + 0.025 * E.clamp((t - ws[0].s) / 2.2);
    c.save(); c.translate(x, y1); c.scale(push, push); c.translate(-x, -y1);
    hypeWords(E, c, t, [ws[0], ws[1], ws[2]], ["WE", "BUILD", "AGENTS."], x, y1, size, [K.white, K.white, K.green], 1 - out);
    hypeWords(E, c, t, [ws[3], ws[4]], ["FOR", "AGENTS."], x, y1 + size * 1.02 * S, size, [K.white, K.green], 1 - out);
    c.restore();
  }
  if (!P) drawLog(E, c, LOG, t, E.W * 0.035, E.H * 0.84, { rows: 3, size: 17, lh: 30, alpha: 0.8 });
}

// HIS words in hype type, laid out left to right, each landing on its onset (2-frame anticipation, 0.94 -> 1 settle)
function hypeWords(E, c, t, ws, disp, x, y, size, cols, alpha = 1) {
  const S = E.SCALE, f = { font: F.hero, weight: 900, size: size * S, tracking: -0.025 };
  const sp = E.measure(c, " ", f) * 1.1;
  let xx = x;
  ws.forEach((w, i) => {
    const ww = E.measure(c, disp[i], f), a = E.clamp((t - w.s + 0.034) / 0.034) * alpha;
    if (a > 0) {
      const sc = E.popScale(t, w.s, { from: 0.94, k: 420, z: 0.5 });
      E.drawText(c, disp[i], xx + ww / 2, y, { ...f, color: cols[i] ?? K.white, align: "center", alpha: a, s: sc });
    }
    xx += ww + sp;
  });
  return xx - x;
}

// ---------------------------------------------------------------------------------------------------------------- shot 3: her question
function askFront(E, c, t, G, pl) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE, p = pl[0], Lq = L[2];
  // red pen: circle "those agents" (a node inside the graph, followed as the zoom grows it)
  if (G && t >= T.agentsQ - 0.05) {
    const lvl = Math.floor(Math.max(0, G.u)) + 1, r = cardRect(G, lvl, P ? 0 : 2);
    B.penCircle(c, r.cx, r.cy, r.w * 0.66, r.h * 0.7, t, T.agentsQ, { width: 7 * S, dur: 0.3, seed: 7 });
  }
  // her question on a dark prompt plate (the graph behind it keeps zooming)
  const bx = P ? R.x + 10 * S : E.W * 0.505, by = P ? R.y + 170 * S : E.H * 0.075, bw = P ? R.w - 20 * S : E.W * 0.455, bh = P ? 300 * S : 280 * S;
  if (Lq && t >= Lq.ws[0].s - 0.6) {
    panel(E, c, bx, by, bw, bh, { fill: "rgba(19,21,18,0.94)", border: K.line, title: "her.ask()", titleSize: 17, dot: K.coral });
    promptLine(E, c, t, Lq.ws, { x: bx + 34 * S, y: by + (P ? 110 : 100) * S, maxW: bw - 50 * S, size: P ? 80 : 84, lines: 2 }, -1);
  }
  if (!P) drawLog(E, c, LOG, t, E.W * 0.6, E.H * 0.935, { rows: 1, size: 17, lh: 30, alpha: 0.75 });
  // caption: depth / agents / shipped
  if (G) caption(E, c, t, G, P ? R.x + 20 * S : E.W * 0.6, P ? R.y + 520 * S : E.H * 0.885);
}

function caption(E, c, t, G, x, y) {
  const S = E.SCALE, P = E.ORIENT === "portrait", d = depthOf(G);
  const n = Math.round(Math.pow(3, Math.max(0, G.u) + (G.depth0 ?? 0) + 1));
  mono(E, c, `DEPTH ${d}  ·  ${B.fmtInt(n)} AGENTS  ·  0 SHIPPED`, x, y, { size: P ? 22 : 21, weight: 700, color: K.ink, alpha: 0.95 });
}

// ---------------------------------------------------------------------------------------------------------------- shot 4: waitlist
function waitFront(E, c, t, G, pl) {
  const S = E.SCALE, P = E.ORIENT === "portrait", R = E.SAFE, p = pl[0], ws = L[3]?.ws ?? [];
  if (p) tokenTicks(E, c, t, ws, (ts) => mouthOf(E, p.v, inClip(p.v, ts - T.c4 + 0.55), p.o), { size: P ? 34 : 30 });
  const x = P ? R.x + 24 * S : E.W * 0.045;
  // his line: ...THEY'RE ON THE  /  WAITLIST. (hero, lands with the flip)
  if (ws.length >= 4) {
    const y1 = P ? R.y + 200 * S : E.H * 0.22;
    hypeWords(E, c, t, [ws[0], ws[1], ws[2]], ["…THEY'RE", "ON", "THE"], x, y1, P ? 70 : 84, [K.white, K.white, K.white]);
    const w4 = ws[3], a = E.clamp((t - w4.s + 0.034) / 0.034);
    if (a > 0) {
      // the hero is itself a grey WAITLISTED pill (inverse video), like every node behind it
      const size = (P ? 140 : 160) * S, f = { font: F.hero, weight: 900, size, tracking: -0.03 };
      const sc = E.popScale(t, w4.s, { from: 1.1, k: 520, z: 0.55 });
      const ww = E.measure(c, "WAITLIST.", f), ph = size * 1.06, pw = ww + size * 0.62, cx = x + pw / 2, cy = y1 + (P ? 150 : 172) * S;
      c.save(); c.globalAlpha = a; c.translate(cx, cy); c.scale(sc, sc);
      c.beginPath(); c.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2); c.fillStyle = "#C9CAC6"; c.fill();
      c.restore();
      E.drawText(c, "WAITLIST.", cx, cy + size * 0.03 * sc, { ...f, color: K.bg, align: "center", alpha: a, s: sc });
    }
  }
  // the odometer: AGENTS ON WAITLIST, slams in on "waitlist" and keeps rolling (linear, never stops)
  if (t >= T.wait - 0.034) {
    const a = E.clamp((t - T.wait + 0.034) / 0.05), sc = 0.92 + 0.08 * E.spring(t - T.wait - 0.05, 420, 0.45);
    const ox = x, oy = P ? R.y + 446 * S : E.H * 0.58;
    const val = ODO_RATE * Math.max(0, t - T.wait) + 2187;
    c.save(); c.globalAlpha = a; c.translate(ox, oy); c.scale(sc, sc); c.translate(-ox, -oy);
    mono(E, c, "AGENTS ON WAITLIST  ▲", ox, oy + 6 * S, { size: P ? 24 : 22, weight: 700, color: K.grey });
    odometer(E, c, val, ox, oy + 30 * S, { digits: 9, cw: P ? 70 : 64, ch: P ? 106 : 96, size: P ? 68 : 62, gap: 5, commaW: 18, color: K.ink });
    c.restore();
  }
  if (t < T.wait && G) caption(E, c, t, G, x, P ? R.y + 470 * S : E.H * 0.6);
  if (!P) drawLog(E, c, LOG, t, x, E.H * 0.80, { rows: 3, size: 17, lh: 30, alpha: 0.85 });
}
