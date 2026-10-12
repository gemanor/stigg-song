// Persistent frame (z=100) for "I'M AN AI FOUNDER". It holds every section together as one usage dashboard:
//   top-left     the TOKEN METER (the spine): state label, pixel-grid balance, usage bar, burn rate   (brand.tokensAt)
//   top-right    LIVE dot + section code + 4 beat squares
//   bottom-left  progress hairline + time code
//   corners      After Tokens crosshairs
//   bottom       the subtitle track: 60 px Inter Tight on a dark plate, every word lit on its onset (speaker colours)
// Scenes steer it per frame through E.hud:
//   { alpha:1, sub:true, corners:true, meter:true, label:'', theme:'dark'|'light', subY:null (px from the band's bottom) }
//   meter:false while a scene shows its own big meter; sub:false only while the scene shows the whole line itself.
import { clamp } from "../core.js";
import * as B from "../brand.js";
import * as TL from "../timeline.js";
const CFG = { sections: [[0, "SECTION_01"]], ...(TL.HUD ?? {}) };
let g;
const pad2 = (n) => String(Math.floor(n)).padStart(2, "0");
const clock = (s) => `${pad2(s / 60)}:${pad2(s % 60)}`;

export default {
  async load(E) {
    g = E.makeG2D(E.W, E.H);
    B.initMeter(E);
  },
  render(E, t, rt) {
    const H = E.hud;
    if (H.alpha <= 0.001 && !E.debugSafe) return 0;
    const S = E.SCALE, c = g.ctx, R = E.SAFE;
    g.clear();
    const dark = (H.theme ?? "dark") !== "light";
    const ink = dark ? B.C.white : B.C.ink, dim = dark ? B.C.whiteA(0.45) : B.C.inkA(0.5);
    const M = 44 * S, left = R.x + M, top = R.y + M, right = R.x + R.w - M, bottom = R.y + R.h - M;
    c.save();
    c.globalAlpha = H.alpha;
    if (H.corners !== false) {
      B.crosshairs(c, R.x + 18 * S, R.y + 18 * S, R.w - 36 * S, R.h - 36 * S, { len: 30 * S, inset: 10 * S, cross: 6 * S, lw: Math.max(1, S), color: dark ? B.C.greenA(0.5) : B.C.inkA(0.45) });
      // top-right: LIVE dot + section code + beat squares
      let si = 0;
      CFG.sections.forEach((s, i) => { if (t >= s[0]) si = i; });
      const sec = CFG.sections[si], b = E.beat(t);
      c.font = `600 ${15 * S}px "JetBrains Mono"`; c.textBaseline = "middle"; c.textAlign = "right"; c.letterSpacing = `${1.6 * S}px`;
      c.fillStyle = ink;
      const code = `${pad2(si + 1)} ${sec[1]}${H.label ? "  ·  " + H.label : ""}`;
      c.fillText(code, right, top + 8 * S);
      const cw = c.measureText(code).width, live = t < B.EV.musicStop || t >= B.EV.chime;
      c.fillStyle = live ? B.C.green : B.C.coral;
      c.globalAlpha = H.alpha * (live ? 0.55 + 0.45 * E.pulse("beats", t, 0.25) : 1);
      c.beginPath(); c.arc(right - cw - 16 * S, top + 8 * S, 5 * S, 0, 6.283); c.fill();
      c.globalAlpha = H.alpha; c.fillStyle = ink;
      c.fillText(live ? "LIVE" : "OFFLINE", right - cw - 30 * S, top + 8 * S);
      for (let k = 0; k < 4; k++) {
        c.globalAlpha = H.alpha * (live && k === b.inBar ? 1 : 0.22);
        c.fillStyle = live && k === b.inBar ? B.C.green : ink;
        c.fillRect(right - (4 - k) * 14 * S + 5 * S, top + 26 * S, 9 * S, 9 * S);
      }
      // bottom-left: progress + clock (landscape only: on 9:16 that row sits where faces fall, above the platform UI)
      c.globalAlpha = H.alpha;
      if (E.ORIENT === "landscape") {
      const p = clamp(t / E.dur), pw = 220 * S;
      c.fillStyle = dim; c.fillRect(left, bottom, pw, 2 * S);
      c.fillStyle = dark ? B.C.green : B.C.ink; c.fillRect(left, bottom, pw * p, 2 * S);
      c.font = `600 ${13 * S}px "JetBrains Mono"`; c.textAlign = "left"; c.fillStyle = dim;
      c.fillText(`${clock(t)} / ${clock(E.dur)}`, left + pw + 14 * S, bottom + 1 * S);
      }
    }
    if (H.meter !== false) drawMeter(E, c, t, left, top, dark, ink, dim);
    c.restore();
    if (H.sub) drawSub(E, c, t, H);
    if (E.debugSafe) {
      c.save(); c.strokeStyle = "#ff00ff"; c.lineWidth = 2 * S; c.setLineDash([12 * S, 8 * S]); c.strokeRect(R.x, R.y, R.w, R.h); c.restore();
    }
    g.commit();
    E.renderer.setRenderTarget(rt);
    E.blitG2D(E, g, 1.0);
  },
};

// The TOKEN METER: label · pixel-grid balance · usage bar · burn rate
function drawMeter(E, c, t, x, y, dark, ink, dim) {
  const S = E.SCALE, st = B.meterState(E, t), v = st.v;
  const warn = st.state === "low" || st.state === "blocked";
  const blink = st.state === "low" ? (E.beat(t).i % 2 === 0 ? 1 : 0.35) : 1;
  c.save();
  c.font = `700 ${14 * S}px "JetBrains Mono"`; c.textBaseline = "middle"; c.textAlign = "left"; c.letterSpacing = `${1.8 * S}px`;
  c.fillStyle = warn ? B.C.coral : st.state === "topup" ? B.C.green : ink;
  c.globalAlpha *= blink;
  c.fillText(st.label, x, y + 8 * S);
  c.globalAlpha = E.hud.alpha;   // back to the HUD's own fade (a partial E.hud.alpha must dim the meter too)
  const val = B.fmtInt(v), cell = Math.max(2, Math.round(4 * S));
  B.pixelText(c, val, x, y + 24 * S, { rows: 9, cell, alpha: E.hud.alpha, color: warn ? B.C.coral : dark ? B.C.green : B.C.ink, line: warn ? "#7a2a26" : dark ? B.C.cell : "#3d4a33" });
  const by = y + 24 * S + 10 * cell + 12 * S, bw = 300 * S, bh = 6 * S, f = clamp(v / 1e6);
  c.fillStyle = dark ? B.C.line : B.C.inkA(0.18); c.fillRect(x, by, bw, bh);
  c.fillStyle = warn ? B.C.coral : dark ? B.C.green : B.C.ink; c.fillRect(x, by, bw * f, bh);
  for (let k = 1; k < 10; k++) { c.fillStyle = dark ? B.C.bg : B.C.paper; c.fillRect(x + (bw * k) / 10 - 0.5 * S, by, 1 * S, bh); }
  const rate = B.burnRate(E, t, 1);
  c.font = `600 ${13 * S}px "JetBrains Mono"`; c.fillStyle = dim;
  const r = st.state === "topup" ? "PAID BY: HER" : st.state === "blocked" ? "0 TOKENS · 402" : `BURN ${B.fmtShort(rate)}/s`;
  c.fillText(r, x, by + 22 * S);
  c.restore();
}

// Subtitle: the current line (or a 4-word window of it when long), 60 px Inter Tight 700 on a dark plate.
// HIM's active word lights green, HER's coral, the gang white. Upcoming words are dim.
function drawSub(E, c, t, H) {
  const ln = E.lineAt(t, 0.2);
  if (!ln || t > ln.e + 0.45) return;
  const S = E.SCALE, R = E.SAFE, wide = E.ORIENT === "landscape";
  const size = (wide ? 60 : 64) * S, sp = ln.speaker ?? "HIM";
  const act = sp === "HER" ? B.C.coral : sp === "HIM" ? B.C.green : B.C.white;
  let ws = ln.words;
  if (ws.length > 6) {   // long line: a 4-word window around the current word
    let i = 0; ws.forEach((w, k) => { if (t >= w.s - 0.05) i = k; });
    const a = Math.min(Math.max(0, i - 1), ws.length - 4); ws = ws.slice(a, a + 4);
  }
  const font = { font: B.FONT.hero, weight: 700, size, tracking: -0.01 };
  const gap = size * 0.28, widths = ws.map((w) => E.measure(c, w.w, font));
  let tot = widths.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  const maxW = R.w * (wide ? 0.68 : 0.86), k = tot > maxW ? maxW / tot : 1;
  tot *= k;
  const cx = R.x + R.w / 2, cy = R.y + R.h - (H.subY ?? (wide ? 118 : 150)) * S;
  const fade = clamp((t - (ln.s - 0.2)) / 0.08) * (1 - clamp((t - (ln.e + 0.3)) / 0.15));
  c.save();
  c.globalAlpha = fade * H.alpha;
  c.fillStyle = B.C.inkA(0.88);
  const pw = tot + 56 * S, ph = size * k * 1.45;
  c.beginPath(); c.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, 10 * S); c.fill();
  c.fillStyle = act; c.fillRect(cx - pw / 2, cy - ph / 2, 5 * S, ph);
  let x = cx - tot / 2;
  ws.forEach((w, i) => {
    const lit = t >= w.s - 0.05, cur = lit && (i === ws.length - 1 || t < ws[i + 1].s - 0.05);
    E.drawText(c, w.w, x + (widths[i] * k) / 2, cy + size * k * 0.02, {
      ...font, size: size * k, align: "center", color: cur ? act : lit ? B.C.white : B.C.whiteA(0.32),
      s: lit ? E.popScale(t, w.s, { from: 0.92 }) : 0.92, alpha: fade * H.alpha,
    });
    x += widths[i] * k + gap * k;
  });
  c.restore();
}
