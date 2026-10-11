// verse2 figures: the dictionary's illustration plates, the launch page, the reply cards, the anatomy callouts.
// All procedural, generic (no real logos, handles or domains), deterministic.
import * as B from "../../brand.js";
import { clamp, lerp, ease, hash1 } from "../../core.js";
import { FONT, T, tw, rrect } from "./kit.js";
const C = B.C;

// "fig. n  caption": mono number + serif italic caption on one baseline
export function figCap(E, c, num, cap, x, y, a = 1) {
  const S = E.SCALE, f = { font: FONT.mono, weight: 700, size: 22 * S, tracking: 0.1 };
  T(E, c, num, x, y, { ...f, color: C.ink, alpha: a });
  T(E, c, cap, x + E.measure(c, num, f) + 14 * S, y + 2 * S, { font: FONT.serif, italic: true, size: 38 * S, color: C.ink, alpha: a });
}
// a draw-on dashed outline (perimeter walk), u in 0..1
function dashRect(c, x, y, w, h, u, lw, dash) {
  if (u <= 0) return;
  c.save();
  c.lineWidth = lw;
  c.setLineDash(dash);
  c.beginPath();
  c.moveTo(x, y);
  let rem = 2 * (w + h) * u, px = x, py = y;
  for (const [qx, qy] of [[x + w, y], [x + w, y + h], [x, y + h], [x, y]]) {
    const d = Math.hypot(qx - px, qy - py);
    if (rem >= d) { c.lineTo(qx, qy); rem -= d; px = qx; py = qy; } else { c.lineTo(px + ((qx - px) * rem) / d, py + ((qy - py) * rem) / d); break; }
  }
  c.stroke();
  c.restore();
}

// ---------------------------------------------------------------------------------- fig. 1: the product (nothing)
export function figEmpty(E, c, t, t0, r, o = {}) {
  if (t < t0 - 0.066) return;
  const S = E.SCALE, u = tw(t, t0 - 0.066, 0.32, ease.inOutCubic), a = clamp((t - t0 + 0.066) / 0.06);
  c.strokeStyle = C.inkA(0.75);
  dashRect(c, r.x, r.y, r.w, r.h, u, 3 * S, [16 * S, 11 * S]);
  // corner ticks (crop marks) and a centre cross: an illustration frame with nothing in it
  c.save();
  c.globalAlpha = a;
  c.strokeStyle = C.inkA(0.35);
  c.lineWidth = Math.max(1, 1.5 * S);
  const m = 14 * S, cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  c.beginPath();
  c.moveTo(cx - m, cy); c.lineTo(cx + m, cy); c.moveTo(cx, cy - m); c.lineTo(cx, cy + m);
  c.stroke();
  c.restore();
  const ca = clamp((t - t0 - 0.1) / 0.08);
  if (ca > 0) {
    if (o.capIn) {
      // narrow canvases: the caption sits inside the empty frame
      T(E, c, "fig. 1", r.x + 22 * S, r.y + 44 * S, { font: FONT.mono, weight: 700, size: 22 * S, tracking: 0.1, color: C.ink, alpha: ca });
      T(E, c, "the product", r.x + 22 * S, r.y + r.h - 50 * S, { font: FONT.serif, italic: true, size: 42 * S, color: C.ink, alpha: ca });
      T(E, c, "(ACTUAL SIZE)", r.x + 22 * S, r.y + r.h - 18 * S, { font: FONT.mono, weight: 600, size: 18 * S, tracking: 0.1, color: C.inkA(0.55), alpha: ca });
    } else {
      const capY = r.y + r.h + (o.capGap ?? 46) * S;
      figCap(E, c, "fig. 1", "the product", r.x, capY, ca);
      const fw = E.measure(c, "fig. 1", { font: FONT.mono, weight: 700, size: 22 * S, tracking: 0.1 }) + 14 * S + E.measure(c, "the product", { font: FONT.serif, italic: true, size: 38 * S });
      T(E, c, "(ACTUAL SIZE)", r.x + fw + 16 * S, capY, { font: FONT.mono, weight: 600, size: 20 * S, tracking: 0.1, color: C.inkA(0.55), alpha: ca });
    }
  }
}

// ----------------------------------------------------------------------------------------- fig. 2: the crontab
export function figCron(E, c, t, r, tCron, tPray) {
  if (t < tCron - 0.066) return;
  const S = E.SCALE, a = clamp((t - tCron + 0.066) / 0.06), size = r.size;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = "#F4F4F1";
  rrect(c, r.x, r.y, r.w, r.h, 10 * S);
  c.fill();
  c.strokeStyle = C.inkA(0.16);
  c.lineWidth = Math.max(1, 1.5 * S);
  c.stroke();
  T(E, c, "$ crontab -l", r.x + 28 * S, r.y + size * 1.25, { font: FONT.mono, weight: 500, size: size * 0.62, color: C.inkA(0.45) });
  const line = "0 * * * *  ./agent.sh", n = Math.floor(clamp((t - tCron + 0.03) / 0.3) * line.length);
  const y2 = r.y + size * 2.6;
  T(E, c, line.slice(0, n), r.x + 28 * S, y2, { font: FONT.mono, weight: 700, size, color: C.ink });
  const lw = E.measure(c, line, { font: FONT.mono, weight: 700, size });
  if (t >= tPray - 0.066) {
    const pa = clamp((t - tPray + 0.066) / 0.05), p = E.popScale(t, tPray, { from: 1.35, k: 420, z: 0.45 });
    const px = r.wrap ? r.x + 28 * S : r.x + 28 * S + lw + size * 0.8, py = r.wrap ? y2 + size * 1.25 : y2;
    E.drawText(c, "# please work", px, py, { font: FONT.mono, weight: 700, size, color: C.coral, alpha: pa, s: p, align: "left", baseline: "alphabetic" });
  }
  // block cursor at the end of what is typed, blinking on the beat
  const b = E.beat(t), on = b.phase < 0.5;
  if (on && t < tPray) c.fillStyle = C.ink, c.fillRect(r.x + 28 * S + E.measure(c, line.slice(0, n), { font: FONT.mono, weight: 700, size }) + 4 * S, y2 - size * 0.78, size * 0.55, size * 0.95);
  c.restore();
  figCap(E, c, "fig. 2", "an autonomous agent", r.x, r.y + r.h + 42 * S, a);
}

// ------------------------------------------------------------------------------------------- fig. 3: the team
function avatar(c, x, y, R, S, seed) {
  c.fillStyle = "#EEEEEA";
  c.beginPath(); c.arc(x, y, R, 0, 6.2832); c.fill();
  c.save();
  c.beginPath(); c.arc(x, y, R, 0, 6.2832); c.clip();
  c.fillStyle = "#9A9A96";
  c.beginPath(); c.arc(x, y - R * 0.18, R * 0.36, 0, 6.2832); c.fill(); // head
  c.beginPath(); c.ellipse(x, y + R * 0.78, R * 0.7, R * 0.52, 0, 0, 6.2832); c.fill(); // shoulders (hoodie)
  // a hoodie hood line and a messy hair tuft, deterministic per seed
  c.fillStyle = "#6E6E6A";
  c.beginPath(); c.ellipse(x + (hash1(seed) - 0.5) * R * 0.2, y - R * 0.46, R * 0.34, R * 0.14, (hash1(seed + 1) - 0.5) * 0.6, 0, 6.2832); c.fill();
  c.restore();
  c.strokeStyle = C.ink; c.lineWidth = Math.max(1, 2 * S);
  c.beginPath(); c.arc(x, y, R, 0, 6.2832); c.stroke();
}
function macMini(c, x, y, w, S, ledOn) {
  const h = w * 0.34;
  c.fillStyle = "#DADAD6";
  rrect(c, x - w / 2, y - h / 2, w, h, h * 0.22); c.fill();
  c.strokeStyle = C.ink; c.lineWidth = Math.max(1, 2 * S); c.stroke();
  c.fillStyle = "#BDBDB8";
  rrect(c, x - w / 2 + w * 0.06, y + h * 0.08, w * 0.88, h * 0.16, h * 0.08); c.fill();
  if (ledOn) { c.fillStyle = C.green; c.beginPath(); c.arc(x + w * 0.38, y - h * 0.12, h * 0.07, 0, 6.2832); c.fill(); }
}
export function figTeam(E, c, t, r, tR, tM, o = {}) {
  const S = E.SCALE, n = 3, gap = r.w / n, R = Math.min(gap * 0.3, r.h * 0.3);
  const labels = ["roommate", "roommate", "a Mac"], ts = [tR, tR + 0.09, tM];
  for (let i = 0; i < n; i++) {
    const t0 = ts[i];
    if (t < t0 - 0.066) continue;
    const p = E.popScale(t, t0, { from: 0.92, k: 380, z: 0.45 }), a = clamp((t - t0 + 0.066) / 0.06);
    const cx = r.x + gap * (i + 0.5), cy = r.y + R + 6 * S;
    c.save();
    c.globalAlpha = a;
    c.translate(cx, cy); c.scale(p, p); c.translate(-cx, -cy);
    if (i < 2) avatar(c, cx, cy, R, S, 3 + i * 7);
    else macMini(c, cx, cy, R * 2.3, S, E.beat(t).phase < 0.5);
    c.restore();
    const ls = Math.min(46 * S, gap * 0.21);
    E.drawText(c, labels[i], cx, cy + R + ls * 1.2, { font: FONT.serif, italic: true, size: ls, color: i === 2 ? C.coral : C.ink, align: "center", baseline: "alphabetic", alpha: a });
  }
  const a0 = clamp((t - tR + 0.066) / 0.06);
  if (a0 > 0) figCap(E, c, "fig. 3", "the cracked team", r.x, r.y - 18 * S, a0);
}

// ------------------------------------------------------------------------------------- fig. 4: the cold email
export function figMail(E, c, t, r, ts, tBack) {
  const S = E.SCALE;
  if (t < ts[0] - 0.066) return;
  const a = clamp((t - ts[0] + 0.066) / 0.06), sz = r.size;
  c.save();
  c.globalAlpha = a;
  c.fillStyle = C.white;
  rrect(c, r.x, r.y, r.w, r.h, 14 * S); c.fill();
  c.strokeStyle = C.inkA(0.2); c.lineWidth = Math.max(1, 1.5 * S); c.stroke();
  T(E, c, "Re: Re: Re: quick intro?", r.x + 30 * S, r.y + sz * 1.45, { font: FONT.ui, weight: 700, size: sz, color: C.ink });
  c.fillStyle = C.inkA(0.12); c.fillRect(r.x + 30 * S, r.y + sz * 2.0, r.w - 60 * S, Math.max(1, 1.5 * S));
  c.restore();
  const msgs = ["following up!", "bumping this :)", "circling back"];
  let y = r.y + sz * 2.55;
  for (let i = 0; i < msgs.length; i++) {
    const t0 = ts[i];
    if (t < t0 - 0.066) break;
    const p = E.popScale(t, t0, { from: 0.92, k: 420, z: 0.5 }), al = clamp((t - t0 + 0.066) / 0.05);
    const f = { font: FONT.ui, weight: 600, size: sz * 0.86 }, w = E.measure(c, msgs[i], f) + sz * 1.1, h = sz * 1.5;
    const x = r.x + r.w - 30 * S - w;
    c.save();
    c.globalAlpha = al;
    c.translate(x + w, y + h / 2); c.scale(p, p); c.translate(-(x + w), -(y + h / 2));
    c.fillStyle = C.green;
    rrect(c, x, y, w, h, h * 0.5); c.fill();
    T(E, c, msgs[i], x + sz * 0.55, y + h * 0.66, { ...f, color: C.ink });
    c.restore();
    y += h + sz * 0.35;
  }
  if (t >= tBack - 0.066) {
    const p = E.popScale(t, tBack, { from: 1.4, k: 420, z: 0.45 });
    E.drawText(c, "0 replies", r.x + 30 * S, r.y + r.h - sz * 0.75, { font: FONT.mono, weight: 800, size: sz * 1.05, color: C.coral, align: "left", baseline: "alphabetic", s: p, alpha: clamp((t - tBack + 0.066) / 0.05) });
  }
  figCap(E, c, "fig. 4", "his outbox", r.x, r.y + r.h + 42 * S, a);
}

// ------------------------------------------------------------------------------------------ the launch page
// Browser window chrome (generic: no URL text, no logos).
export function browser(c, x, y, w, h, S, bar) {
  c.fillStyle = C.white;
  rrect(c, x, y, w, h, 16 * S); c.fill();
  c.save();
  rrect(c, x, y, w, h, 16 * S); c.clip();
  c.fillStyle = "#F1F1EE";
  c.fillRect(x, y, w, bar);
  c.fillStyle = C.inkA(0.12);
  c.fillRect(x, y + bar, w, Math.max(1, 1.5 * S));
  for (let i = 0; i < 3; i++) { c.fillStyle = "#DADAD5"; c.beginPath(); c.arc(x + 30 * S + i * 26 * S, y + bar / 2, 7 * S, 0, 6.2832); c.fill(); }
  c.fillStyle = C.white;
  rrect(c, x + w * 0.3, y + bar * 0.22, w * 0.4, bar * 0.56, bar * 0.28); c.fill();
  c.fillStyle = C.inkA(0.18);
  rrect(c, x + w * 0.3 + bar * 0.5, y + bar * 0.43, w * 0.16, bar * 0.14, bar * 0.07); c.fill();
  c.restore();
  c.strokeStyle = C.inkA(0.22); c.lineWidth = Math.max(1, 1.5 * S);
  rrect(c, x, y, w, h, 16 * S); c.stroke();
}
// HIS button: one green pill. hover 0..1 darkens it a touch.
export function button(E, c, cx, cy, w, h, label, size, o = {}) {
  const S = E.SCALE, sc = o.s ?? 1;
  c.save();
  c.translate(cx, cy); c.scale(sc, sc);
  c.fillStyle = C.ink;
  rrect(c, -w / 2 + 6 * S, -h / 2 + 8 * S, w, h, h / 2); c.fill(); // hard offset block (flat, not a blur shadow)
  c.fillStyle = o.hover ? "#86D94F" : C.green;
  rrect(c, -w / 2, -h / 2, w, h, h / 2); c.fill();
  c.strokeStyle = C.ink; c.lineWidth = Math.max(1, 3 * S); c.stroke();
  E.drawText(c, label, 0, size * 0.02, { font: FONT.ui, weight: 800, size, color: C.ink, align: "center", baseline: "middle", tracking: 0.02 });
  c.restore();
}
// classic arrow cursor (white with ink outline)
const CUR = [[0, 0], [0, 17], [4.2, 13.2], [7.2, 20], [10, 18.8], [7, 12.2], [12.4, 12.2]];
export function cursor(c, x, y, sz, S) {
  c.save();
  c.translate(x, y);
  c.scale(sz / 20, sz / 20);
  c.beginPath();
  CUR.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py)));
  c.closePath();
  c.fillStyle = C.white; c.fill();
  c.lineWidth = 1.6; c.strokeStyle = C.ink; c.lineJoin = "round"; c.stroke();
  c.restore();
}
// price tag with a string, hanging from (x, y0); swings on a spring after landing
export function priceTag(E, c, t, t0, x, y0, len, txt, size, label) {
  if (t < t0 - 0.066) return;
  const S = E.SCALE, d = t - t0, sw = Math.exp(-d * 3.2) * Math.sin(d * 11) * 0.22, drop = E.ease.outBack(clamp((t - t0 + 0.066) / 0.22), 1.2);
  c.save();
  c.translate(x, y0);
  c.rotate(sw);
  const ly = len * drop;
  c.strokeStyle = C.white; c.lineWidth = Math.max(1, 2 * S);
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, ly); c.stroke();
  const f = { font: FONT.ui, weight: 900, size, tracking: -0.01 }, w = E.measure(c, txt, f) + size * 0.9, h = size * 1.9;
  c.translate(0, ly);
  c.fillStyle = C.white;
  c.beginPath();
  c.moveTo(0, 0); c.lineTo(w / 2, h * 0.22); c.lineTo(w / 2, h); c.lineTo(-w / 2, h); c.lineTo(-w / 2, h * 0.22); c.closePath();
  c.fill();
  c.fillStyle = C.ink; c.beginPath(); c.arc(0, h * 0.2, size * 0.1, 0, 6.2832); c.fill();
  E.drawText(c, label, 0, h * 0.45, { font: FONT.mono, weight: 700, size: size * 0.24, tracking: 0.12, color: C.inkA(0.6), align: "center", baseline: "middle" });
  E.drawText(c, txt, 0, h * 0.74, { ...f, color: C.ink, align: "center", baseline: "middle" });
  c.restore();
}
// clapperboard: claps shut on tClap; drawn at (x, y) top-left of the board, width w
export function slate(E, c, t, tClap, x, y, w, S) {
  // 4-frame anticipation: rises in open, the stick claps shut exactly on the onset
  if (t < tClap - 0.066) return;
  const h = w * 0.62, a = clamp((t - tClap + 0.066) / 0.03), open = 1 - ease.inCubic(clamp((t - tClap + 0.04) / 0.04));
  const rise = (1 - ease.outCubic(clamp((t - tClap + 0.066) / 0.06))) * h * 0.5;
  c.save();
  c.globalAlpha = a;
  c.translate(x, y + rise);
  c.fillStyle = "#1E211F";
  c.fillRect(0, h * 0.2, w, h * 0.8);
  c.strokeStyle = C.white; c.lineWidth = Math.max(1, 2 * S); c.strokeRect(0, h * 0.2, w, h * 0.8);
  // stripes (top stick hinged at the left, opens by up to 24 degrees)
  for (const [yy, rot] of [[h * 0.2, 0], [h * 0.2, -0.42 * open]]) {
    c.save(); c.translate(0, yy); c.rotate(rot);
    c.fillStyle = C.white; c.fillRect(0, -h * 0.13, w, h * 0.13);
    c.fillStyle = "#1E211F";
    for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(i * w / 6 + w * 0.03, -h * 0.13); c.lineTo(i * w / 6 + w * 0.1, -h * 0.13); c.lineTo(i * w / 6 + w * 0.05, 0); c.lineTo(i * w / 6 - w * 0.02, 0); c.closePath(); c.fill(); }
    c.restore();
  }
  E.drawText(c, "LAUNCH VIDEO", w * 0.06, h * 0.42, { font: FONT.mono, weight: 700, size: w * 0.085, color: C.white, align: "left", baseline: "middle", tracking: 0.08 });
  E.drawText(c, "SC 1   TAKE 47", w * 0.06, h * 0.62, { font: FONT.mono, weight: 500, size: w * 0.07, color: C.white, align: "left", baseline: "middle", tracking: 0.06 });
  E.drawText(c, "DIR. / DP / GAFFER / DRONE", w * 0.06, h * 0.82, { font: FONT.mono, weight: 500, size: w * 0.05, color: C.whiteA(0.6), align: "left", baseline: "middle", tracking: 0.04 });
  c.restore();
}
// boom mic dipping into frame from the top edge (y0) on an angled pole, to depth d (the "film crew" sight gag)
export function boom(c, t, t0, x, y0, d, S, sz = 1) {
  if (t < t0 - 0.1) return;
  const u = E_outBack(clamp((t - t0 + 0.1) / 0.32));
  const yy = y0 - d + d * 2 * u, k = S * sz;
  c.save();
  c.translate(x, yy);
  c.rotate(0.18);
  c.fillStyle = "#2A2D2A";
  c.fillRect(-520 * k, -9 * k, 470 * k, 12 * k); // pole
  c.fillStyle = "#444744";
  c.fillRect(-70 * k, -16 * k, 40 * k, 26 * k); // clip
  // fluffy windshield: a capsule made of tufts
  c.fillStyle = "#6E706C";
  c.beginPath(); c.ellipse(60 * k, 0, 105 * k, 40 * k, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#858782";
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * 6.2832, rx = 105 * k, ry = 40 * k;
    c.beginPath(); c.ellipse(60 * k + Math.cos(a) * rx * 0.92, Math.sin(a) * ry * 0.9, 16 * k, 11 * k, a, 0, 6.2832); c.fill();
  }
  c.fillStyle = "#9A9C97";
  for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(-10 * k + i * 18 * k, -6 * k + Math.sin(i * 1.9) * 9 * k, 10 * k, 7 * k, i, 0, 6.2832); c.fill(); }
  c.restore();
}
const E_outBack = (x) => ease.outBack(x, 1.4);

// -------------------------------------------------------------------------------------- reply cards ("insane")
const REPLIES = ["insane", "insane.", "INSANE", "insane", "actually insane", "insane", "insane!!", "insane work", "insane", "this is insane"];
const AV = ["#E4E4DF", "#DEFCCA", "#FFD9D5", "#D9E6F2", "#EFE6D2", "#E4E4DF"];
// pre-render a card sprite (white card, avatar, name bar, reply text, generic icons)
export function makeCard(E, i, scale) {
  const S = scale, w = Math.round(330 * S), h = Math.round(128 * S);
  const cv = document.createElement("canvas");
  cv.width = w + 4; cv.height = h + 4;
  const c = cv.getContext("2d");
  c.translate(2, 2);
  c.fillStyle = C.white;
  rrect(c, 0, 0, w, h, 14 * S); c.fill();
  c.strokeStyle = C.inkA(0.2); c.lineWidth = Math.max(1, 1.5 * S); c.stroke();
  c.fillStyle = AV[i % AV.length];
  c.beginPath(); c.arc(34 * S, 34 * S, 18 * S, 0, 6.2832); c.fill();
  c.fillStyle = C.inkA(0.16);
  rrect(c, 62 * S, 22 * S, (70 + 60 * hash1(i * 3.1)) * S, 11 * S, 5 * S); c.fill();
  c.fillStyle = C.inkA(0.08);
  rrect(c, 62 * S + (80 + 60 * hash1(i * 3.1)) * S, 22 * S, 50 * S, 11 * S, 5 * S); c.fill();
  const txt = REPLIES[i % REPLIES.length];
  c.font = `700 ${Math.round(38 * S)}px "Inter Tight"`;
  c.fillStyle = C.ink;
  c.textBaseline = "alphabetic";
  c.fillText(txt, 62 * S, 78 * S);
  // generic icons: reply bubble, repost loop, heart (line drawings, no platform marks)
  c.strokeStyle = C.inkA(0.35); c.lineWidth = Math.max(1, 1.6 * S);
  const iy = 104 * S;
  c.beginPath(); c.roundRect(62 * S, iy - 7 * S, 16 * S, 12 * S, 4 * S); c.stroke();
  c.beginPath(); c.moveTo(118 * S, iy - 4 * S); c.lineTo(132 * S, iy - 4 * S); c.lineTo(132 * S, iy + 4 * S); c.moveTo(136 * S, iy + 4 * S); c.lineTo(122 * S, iy + 4 * S); c.lineTo(122 * S, iy - 4 * S); c.stroke();
  c.beginPath(); c.moveTo(186 * S, iy + 6 * S); c.bezierCurveTo(172 * S, iy - 4 * S, 180 * S, iy - 12 * S, 186 * S, iy - 4 * S); c.bezierCurveTo(192 * S, iy - 12 * S, 200 * S, iy - 4 * S, 186 * S, iy + 6 * S); c.stroke();
  return { cv, w: w + 4, h: h + 4 };
}

// ---------------------------------------------------------------------------------------- anatomy callouts
// A numbered field-guide callout: coral dot on the anchor, ink leader with an elbow, number disc, label + note.
// side: 1 = label to the right of the elbow, -1 = to the left. Draws on from t0 (anticipation 4 frames).
export function callout(E, c, t, t0, ax, ay, lx, ly, num, label, note, o = {}) {
  if (t < t0 - 0.066 || ax == null) return;
  const S = E.SCALE * (o.k ?? 1), u = tw(t, t0 - 0.066, 0.2, ease.outCubic), a = clamp((t - t0 + 0.066) / 0.05) * (o.alpha ?? 1);
  const side = lx >= ax ? 1 : -1;
  c.save();
  c.globalAlpha = a;
  // leader: anchor -> elbow (lx - side*40, ly) -> label start
  const ex = lx - side * 34 * S;
  const p1x = lerp(ax, ex, clamp(u * 1.6)), p1y = lerp(ay, ly, clamp(u * 1.6));
  c.strokeStyle = C.ink; c.lineWidth = Math.max(1, 2.2 * S);
  c.beginPath(); c.moveTo(ax, ay); c.lineTo(p1x, p1y);
  if (u > 0.62) c.lineTo(lerp(ex, lx, clamp((u - 0.62) / 0.38)), ly);
  c.stroke();
  // anchor dot (her coral) with a ring
  c.fillStyle = C.coral; c.beginPath(); c.arc(ax, ay, 7 * S, 0, 6.2832); c.fill();
  c.strokeStyle = C.white; c.lineWidth = Math.max(1, 2 * S); c.stroke();
  if (u > 0.85) {
    const la = clamp((u - 0.85) / 0.15), p = E.popScale(t, t0 + 0.08, { from: 1.25, k: 420, z: 0.5 });
    const R = 22 * S, nx = lx + side * R;
    c.globalAlpha = a * la;
    c.fillStyle = C.coral; c.beginPath(); c.arc(nx, ly, R * p, 0, 6.2832); c.fill();
    E.drawText(c, String(num), nx, ly + 1 * S, { font: FONT.mono, weight: 800, size: 26 * S, color: C.white, align: "center", baseline: "middle" });
    const tx = nx + side * (R + 14 * S), al = side > 0 ? "left" : "right";
    E.drawText(c, label, tx, ly + 12 * S, { font: FONT.mono, weight: 800, size: 46 * S, tracking: 0.06, color: C.ink, align: al, baseline: "alphabetic" });
    if (note) for (let i = 0; i < note.length; i++) {
      const n = note[i];
      if (t < n.t - 0.066) continue;
      const na = clamp((t - n.t + 0.066) / 0.05), np = n.hero ? E.popScale(t, n.t, { from: 1.3, k: 420, z: 0.45 }) : 1;
      const ny = ly + 66 * S + i * 54 * S;
      E.drawText(c, n.txt, tx, ny, { font: FONT.serif, italic: true, size: 50 * S, color: n.col ?? C.ink, align: al, baseline: "alphabetic", alpha: a * na, s: np });
    }
  }
  c.restore();
}
// the generic nicotine-pouch tin icon (a puck with a lid seam; no brand)
export function tin(c, x, y, r, S) {
  c.save();
  c.fillStyle = "#D7E3EA";
  c.beginPath(); c.ellipse(x, y + r * 0.18, r, r * 0.42, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#EEF4F7";
  c.beginPath(); c.ellipse(x, y, r, r * 0.42, 0, 0, 6.2832); c.fill();
  c.strokeStyle = C.ink; c.lineWidth = Math.max(1, 2 * S);
  c.beginPath(); c.ellipse(x, y, r, r * 0.42, 0, 0, 6.2832); c.stroke();
  c.beginPath(); c.moveTo(x - r, y); c.lineTo(x - r, y + r * 0.18); c.ellipse(x, y + r * 0.18, r, r * 0.42, 0, Math.PI, 0, true); c.lineTo(x + r, y); c.stroke();
  c.beginPath(); c.ellipse(x, y, r * 0.62, r * 0.25, 0, 0, 6.2832); c.stroke();
  c.restore();
}
