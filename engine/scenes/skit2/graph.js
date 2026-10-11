// The recursive agent graph for skit 2: AGENT -> AGENT -> AGENT, where every AGENT card contains the same chain again.
// Zooming into the middle card's body by Z = 1/(0.86*0.26) lands exactly on the next level, so the zoom loops forever
// (a Droste zoom). Pure Canvas2D vector drawing, culled to the screen, no allocation per card beyond small arrays.
// Owner: A4.
import { clamp, lerp, ease, hash1 } from "../../core.js";
import { K, F } from "./term.js";

const CW = 0.26;               // card width as a fraction of the chain width
const STEP = 0.37;             // card centre spacing (fraction of chain width)
const INNER = 0.86;            // inner chain width as a fraction of the card width
export const Z = 1 / (INNER * CW); // 4.472: zoom factor between levels
// card geometry, in units of the card width (origin = body centre)
const HEAD = 0.19, BODY = 0.53, FOOT = 0.12, HGT = HEAD + BODY + FOOT, TOP = -(HEAD + BODY / 2); // origin = body centre

const STATUS = ["thinking", "planning", "delegating", "waiting", "syncing", "summarizing", "spawning", "retrying"];
const pad4 = (n) => String(n).padStart(4, "0");
const agentId = (d, key) => 1 + Math.floor(hash1(d * 17.31 + key * 0.731 + 3.3) * 9998);

// G: { ox, oy, Wbase, u, t, S, W, H,
//      cardOn:[t0,t1,t2] (level-0 build, null = always on), arrowOn:[t0,t1], innerOn (alpha 0..1 of inner chains at level 0),
//      flipT (WAITLISTED time or null), flipC:[x,y], beamFrom (unused here), labelFor (draw "FOR" on level-0 arrow 1),
//      depth0 (absolute depth label offset), alpha, dim }
// returns the screen rects of the cards of the level that currently spans the frame: [{x,y,w,h,d,j}]
export function drawGraph(E, c, G) {
  const u = Math.max(0, G.u), n = Math.floor(u), f = u - n;
  const start = Math.max(0, n - 1);
  const Wc = G.Wbase * Math.pow(Z, u - start);
  const out = [];
  G._focus = n;   // the level whose 3 cards span the frame
  G._out = out;
  c.save();
  c.globalAlpha = G.alpha ?? 1;
  // the key of the middle-card spine at depth d is (3^d - 1)/2, so ids never jump when the start level advances
  chain(E, c, G, G.ox, G.oy, Wc, start, (Math.pow(3, start) - 1) / 2, 1, 1);
  c.restore();
  return out;
}

function chain(E, c, G, ox, oy, Wc, d, key, a, sx) {
  const S = E.SCALE, cw = CW * Wc;
  if (cw < 2.5 * S) return;
  const x0 = ox - 0.5 * Wc, x1 = ox + 0.5 * Wc, y0 = oy + TOP * cw, y1 = y0 + HGT * cw;
  if (x1 < -4 || x0 > E.W + 4 || y1 < -4 || y0 > E.H + 4) return;
  const lvl0 = d === 0;
  // arrows between cards (behind the cards)
  for (let j = 0; j < 2; j++) {
    let p = 1;
    if (lvl0 && G.arrowOn) { const ta = G.arrowOn[j]; p = ta == null ? 1 : ease.outCubic(clamp((G.t - ta) / 0.22)); }
    if (p <= 0) continue;
    const ax0 = ox + (j - 1) * STEP * Wc + 0.5 * cw, ax1 = ox + (j - 0) * STEP * Wc - 0.5 * cw;
    const ay = oy + (TOP + HEAD * 0.5) * cw;       // arrows run at header height
    arrow(E, c, G, ax0, lerp(ax0, ax1, p), ay, cw, d, key * 3 + j, a, lvl0 && j === 0 && G.labelFor ? p : 0);
  }
  for (let j = 0; j < 3; j++) {
    let on = 1;
    if (lvl0 && G.cardOn && G.cardOn[j] != null) on = clamp((G.t - G.cardOn[j] + 0.034) / 0.05);
    if (on <= 0) continue;
    const cx = ox + (j - 1) * STEP * Wc;
    if (cx + 0.5 * cw < -4 || cx - 0.5 * cw > E.W + 4) continue;
    const pop = lvl0 && G.cardOn && G.cardOn[j] != null ? popK(G.t, G.cardOn[j]) : 1;
    card(E, c, G, cx, oy, cw * pop, d, key * 3 + j, a * on, j);
    if (d === G._focus) G._out.push({ x: cx - 0.5 * cw, y: oy + TOP * cw, w: cw, h: HGT * cw, d, j });
  }
}

// UI pop: 0.92 -> overshoot -> 1 (never from 0)
function popK(t, t0) {
  const dt = t - t0 + 0.034;
  if (dt <= 0) return 0.92;
  const w = Math.sqrt(380), z = 0.42, wd = w * Math.sqrt(1 - z * z);
  const s = 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + ((z * w) / wd) * Math.sin(wd * dt));
  return 0.92 + 0.08 * s;
}

function flipOf(G, cx, cy) {
  if (G.flipT == null || G.t < G.flipT - 0.001) return 0;
  const dx = cx - G.flipC[0], dy = cy - G.flipC[1], dist = Math.sqrt(dx * dx + dy * dy);
  const delay = 0.30 * clamp(dist / (0.85 * G.W));
  return clamp((G.t - G.flipT - delay) / 0.16);
}

function card(E, c, G, cx, oy, cw, d, key, a, j) {
  const S = E.SCALE, h = HGT * cw, y = oy + TOP * cw, x = cx - 0.5 * cw;
  const fu = flipOf(G, cx, oy), sxf = Math.max(0.03, Math.abs(Math.cos(Math.PI * fu))), back = fu >= 0.5;
  const big = cw > 70 * S, mid = cw > 26 * S, lw = Math.max(1, Math.min(3 * S, cw * 0.006));
  // LOD: a card that has grown past ~half the frame is the zoom's frame; its labels fade so they never fight the HUD
  const lod = 1 - E.ease.smooth(clamp((cw - 0.3 * G.W) / (0.25 * G.W)));
  const GA = G.alpha ?? 1, ta = a * lod * GA;
  c.save();
  if (sxf < 0.999) { c.translate(cx, 0); c.scale(sxf, 1); c.translate(-cx, 0); }
  c.globalAlpha = a * GA;
  const r = cw * 0.045;
  // frame + panel
  c.beginPath(); c.roundRect(x, y, cw, h, r);
  c.fillStyle = K.panel; c.fill();
  c.lineWidth = lw; c.strokeStyle = back ? K.dgrey : "rgba(146,231,89,0.85)"; c.stroke();
  // body well
  const by = y + HEAD * cw, bh = BODY * cw;
  c.fillStyle = K.well; c.fillRect(x + lw, by, cw - 2 * lw, bh);
  c.fillStyle = back ? K.line : "rgba(146,231,89,0.22)"; c.fillRect(x, by, cw, Math.max(1, lw * 0.6)); c.fillRect(x, by + bh, cw, Math.max(1, lw * 0.6));
  if (mid) {
    const hy = y + HEAD * cw * 0.52;
    if (!back) {
      c.fillStyle = K.green; c.globalAlpha = ta; c.beginPath(); c.arc(x + 0.075 * cw, hy, 0.026 * cw, 0, 6.283); c.fill(); c.globalAlpha = a * GA;
      if (big) {
        E.drawText(c, "AGENT", x + 0.13 * cw, hy + 0.004 * cw, { font: F.hero, weight: 800, size: 0.112 * cw, tracking: -0.01, color: K.ink, align: "left", alpha: ta });
        E.drawText(c, "_" + pad4(agentId(d + (G.depth0 ?? 0), key)), x + 0.955 * cw, hy + 0.004 * cw, { font: F.mono, weight: 500, size: 0.05 * cw, tracking: 0.02, color: K.grey, align: "right", alpha: ta });
      } else { c.fillStyle = K.ink; c.globalAlpha = ta * 0.7; c.fillRect(x + 0.13 * cw, hy - 0.035 * cw, 0.36 * cw, 0.07 * cw); c.globalAlpha = a * GA; }
    } else {
      // WAITLISTED: the node becomes a grey pill
      const pw = 0.86 * cw, ph = 0.14 * cw, px = cx - pw / 2;
      c.beginPath(); c.roundRect(px, hy - ph / 2, pw, ph, ph / 2); c.fillStyle = "#4A4B49"; c.globalAlpha = a * GA * Math.max(lod, 0.5); c.fill(); c.globalAlpha = a * GA;
      if (big) E.drawText(c, "WAITLISTED", cx, hy + 0.004 * cw, { font: F.mono, weight: 700, size: 0.07 * cw, tracking: 0.08, color: "#C9CAC6", align: "center", alpha: ta });
    }
    // footer: usage bar (this agent's token burn) + status
    const fy = by + bh + FOOT * cw * 0.5, bx0 = x + 0.07 * cw, bw = 0.40 * cw, bh2 = Math.max(1.5 * S, 0.024 * cw);
    c.fillStyle = K.line; c.fillRect(bx0, fy - bh2 / 2, bw, bh2);
    if (!back) {
      const fill = clamp(0.18 + 0.62 * hash1(key * 1.7 + d) + (G.t - 59.5) * 0.06);
      c.fillStyle = K.green; c.fillRect(bx0, fy - bh2 / 2, bw * fill, bh2);
      if (big) {
        const st = STATUS[Math.floor(hash1(key * 3.3 + d * 1.9) * STATUS.length + G.t / (2 * E.spb)) % STATUS.length];
        const dots = ".".repeat(1 + (Math.floor(G.t / (E.spb / 2) + key) % 3));
        E.drawText(c, st + dots, x + 0.52 * cw, fy + 0.002 * cw, { font: F.mono, weight: 500, size: 0.05 * cw, tracking: 0.02, color: K.grey, align: "left", alpha: ta });
      }
    } else if (big) E.drawText(c, "0 shipped", x + 0.52 * cw, fy + 0.002 * cw, { font: F.mono, weight: 500, size: 0.05 * cw, tracking: 0.02, color: K.dgrey, align: "left", alpha: ta });
  }
  c.restore();
  // body content: the same chain again (recursion), or a cursor while the level-0 build has not revealed it yet
  const innerA = d === 0 && G.innerOn != null ? G.innerOn : 1;
  const Wi = INNER * cw;
  if (cw > 9 * S) {
    if (innerA > 0.001) {
      c.save();
      if (sxf < 0.999) { c.translate(cx, 0); c.scale(sxf, 1); c.translate(-cx, 0); }
      chain(E, c, G, cx, oy, Wi, d + 1, key, a * innerA, sxf);
      c.restore();
    }
    if (innerA < 0.999 && big && !back) {
      c.save(); c.globalAlpha = a * GA * (1 - innerA) * (E.beat(G.t).phase < 0.5 ? 1 : 0.25);
      c.fillStyle = K.green; c.fillRect(x + 0.08 * cw, oy - 0.045 * cw, 0.04 * cw, 0.09 * cw);
      c.restore();
      E.drawText(c, "idle", x + 0.15 * cw, oy, { font: F.mono, weight: 500, size: 0.06 * cw, tracking: 0.02, color: K.grey, align: "left", alpha: a * GA * (1 - innerA) });
    }
  }
}

function arrow(E, c, G, x0, x1, y, cw, d, key, a, labelP) {
  const S = E.SCALE, lw = Math.max(1, Math.min(2.5 * S, cw * 0.007));
  if (x1 - x0 < 1) return;
  const waiting = G.flipT != null && G.t >= G.flipT;
  c.save();
  c.globalAlpha = a * (G.alpha ?? 1);
  c.strokeStyle = waiting ? K.line : K.dgrey; c.lineWidth = lw;
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
  const hl = Math.max(4 * S, cw * 0.03);
  c.beginPath(); c.moveTo(x1 - hl, y - hl * 0.6); c.lineTo(x1, y); c.lineTo(x1 - hl, y + hl * 0.6); c.stroke();
  // a packet travels each arrow once per beat (a designed event on every beat)
  if (!waiting && cw > 20 * S) {
    const ph = E.beat(G.t).phase, px = lerp(x0, x1 - hl, ease.inOutCubic(ph));
    c.fillStyle = K.green; c.globalAlpha = a * (G.alpha ?? 1) * (1 - ph * 0.6);
    c.fillRect(px - hl * 0.35, y - hl * 0.35, hl * 0.7, hl * 0.7);
  }
  c.restore();
  if (labelP > 0 && cw > 60 * S)
    E.drawText(c, "FOR", (x0 + x1) / 2, y - 0.05 * cw, { font: F.mono, weight: 700, size: Math.max(12 * S, 0.06 * cw), tracking: 0.1, color: K.green, align: "center", alpha: a * labelP });
}

// screen rect of card j at absolute level `lvl` for a graph state (for annotations that follow a card)
export function cardRect(G, lvl, j) {
  const u = Math.max(0, G.u), Wc = G.Wbase * Math.pow(Z, u - lvl), cw = CW * Wc;
  // level lvl is nested along the middle cards, so its origin is the graph origin
  const cx = G.ox + (j - 1) * STEP * Wc;
  return { x: cx - 0.5 * cw, y: G.oy + TOP * cw, w: cw, h: HGT * cw, cx, cy: G.oy + (TOP + HGT / 2) * cw };
}
