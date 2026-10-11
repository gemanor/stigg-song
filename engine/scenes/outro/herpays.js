// One continuous take of her_pays across the outro -> end-card boundary:
//   145.466 "Cute."   146.006 "Hold" 146.666 "my" 146.846 "matcha."   (outro, still in the blocked world: pure #000)
//   147.816 the chime = her phone tap: a ripple grows from the card terminal, flipping the world back to look A and
//           the blocked status to TOP-UP APPROVED (end card; the big counter reads brand.tokensAt, 0 -> 1,000,000).
// outro.js renders it for t < 147.80 and endcard.js for 147.80 <= t < 148.37, so the take never jumps.
// her_pays (6 s): his hand takes the cup at 1.58-1.85 s, the cup leaves the frame by 2.3 s, the phone tap lights the
// terminal's green light at 3.583 s (f87 faint, f88 full). Played at 1x from 1.275 s, so the grab lands on "Hold" and
// the green light is full on the chime.
import { B, slot, clipT, unionBox, frameBox, smoothPt, groundA, label, rippleR, pixelCount, pixelCountSize, CORAL_LINE, punchScreen, camOn, clamp, lerp, ease } from "./lib.js";
import { surfaces } from "./surf.js";

export const HP = { t0: 145.466, tap: 147.816, t1: 148.37 };
const KEYS = [[145.466, 1.275]]; // f88 (3.625 s, the terminal's green light at full) on the chime
const TERMINAL = [0.178, 0.84]; // the card terminal in the clip (video UV): the ripple's centre
let s = null, W = null, box = null;

export async function load(E) {
  s = await slot(E, "her_pays");
  const ow = E.words.filter((w) => w.section === "outro");
  W = { cute: ow[18], hold: ow[19], my: ow[20], matcha: ow[21] };
  box = s.v ? unionBox(s.v, clipT(s.v, KEYS, HP.t0), clipT(s.v, KEYS, HP.t1)) : [0.05, 0.05, 0.5, 1];
}
export async function prepare(E, t) {
  if (s?.v) await s.v.frame(clipT(s.v, KEYS, t));
}

function lay(E) {
  const S = E.SCALE, R = E.SAFE, wide = E.ORIENT === "landscape", cell = Math.max(2, Math.round(8 * S));
  if (wide)
    return {
      tgt: { h: 0.98 * E.H, y1: 1.0 * E.H, x0: 0.04 * E.W },
      cute: { x: 0.735 * E.W, y: 0.29 * E.H, size: 250 * S },
      hold: { x: 0.505 * E.W, y: 0.79 * E.H, size: 100 * S },
      toast: { x: 0.955 * E.W, y: 0.105 * E.H, rows: 11, cell: Math.max(2, Math.round(4 * S)), align: "right" }, // clear of the HUD row once it returns
      ap: { x: 0.715 * E.W, y: 0.37 * E.H, rows: 16, cell },
    };
  // portrait: frame her body (not the hand-off reach), big and centred; the cup leaves off the right edge
  return {
    box: [0.06, 0.02, 0.42, 1.0],
    tgt: { h: 0.527 * E.H, y0: 0.323 * E.H, cx: 0.45 * E.W },
    cute: { x: R.x + R.w * 0.62, y: R.y + R.h * 0.14, size: 180 * S },
    hold: { x: R.x + R.w * 0.2, y: R.y + R.h * 0.275, size: 78 * S },
    toast: { x: R.x + R.w * 0.5, y: R.y + 6 * S, rows: 10, cell: Math.max(2, Math.round(3 * S)), align: "center" },
    ap: { x: R.x + R.w * 0.5, y: R.y + R.h * 0.12, rows: 11, cell },
  };
}

export function render(E, t, rt) {
  const S = E.SCALE, [g1, g2] = surfaces(E), c = g1.ctx, f = g2.ctx, v = s.v, L = lay(E);
  const lt = v ? clipT(v, KEYS, t) : 0, opts = v ? frameBox(E, v, L.box ?? box, L.tgt) : null;
  const [tx, ty] = v ? E.plateToScreen(E, v, TERMINAL, opts) : [0.2 * E.W, 0.85 * E.H];
  const r = rippleR(E, t, HP.tap, tx, ty, 0.62), paid = t >= HP.tap;
  // one slow linear push across the whole take (it must never read as a hold), centred on her face
  const P = v ? E.plateToScreen(E, v, [0.33, 0.3], opts) : [0.3 * E.W, 0.4 * E.H], kc = 1 + 0.05 * clamp((t - HP.t0) / (HP.t1 - HP.t0));

  // ---------------- BACK + MID: the blocked void, and look A wherever her tap has reached
  g1.clear();
  c.fillStyle = B.C.void;
  c.fillRect(0, 0, E.W, E.H);
  c.save(); camOn(c, P, kc);
  if (r > 0) {
    c.save(); c.beginPath(); c.arc(tx, ty, r, 0, 6.2832); c.clip();
    groundA(c, E, t, { gridA: 0.5 });
    c.restore();
  }
  c.save();
  if (r > 0) { c.beginPath(); c.rect(0, 0, E.W, E.H); c.arc(tx, ty, r, 0, 6.2832); c.clip("evenodd"); }
  let tr = L.toast.rows; // fit the status line to the safe band at any --scale (cells round to whole px)
  while (tr > 7 && B.pixelSize("0 TOKENS · USAGE BLOCKED", { rows: tr, cell: L.toast.cell }).w > E.SAFE.w * 0.96) tr--;
  B.pixelText(c, "0 TOKENS · USAGE BLOCKED", L.toast.x, L.toast.y, { rows: tr, cell: L.toast.cell, color: B.C.coral, line: CORAL_LINE, align: L.toast.align });
  c.restore();
  if (paid) {
    // the meter rolls 0 -> 1,000,000 (brand.tokensAt), revealed by the ripple
    c.save(); c.beginPath(); c.arc(tx, ty, r, 0, 6.2832); c.clip();
    const o = { rows: L.ap.rows, cell: L.ap.cell, color: B.C.green, line: B.C.cell };
    const sz = pixelCountSize("+1,000,000", o), x = L.ap.x - sz.w / 2;
    label(E, c, "TOP-UP APPROVED", x, L.ap.y - 46 * S, { size: E.ORIENT === "landscape" ? 46 : 40, color: B.C.green, tracking: 0.1 });
    pixelCount(c, "+" + B.fmtInt(B.tokensAt(E, t)), x, L.ap.y, o);
    label(E, c, "PAID BY: HER  ·  1 TAP", x, L.ap.y + sz.h + 44 * S, { size: 30, weight: 600, color: B.C.whiteA(0.7) });
    c.restore();
  }
  c.restore();
  g1.commit();
  E.renderer.setRenderTarget(rt);
  E.blitG2D(E, g1, 1);

  // ---------------- the cut-out
  if (v) E.drawPlate(E, v, { ...punchScreen(E, v, opts, P, kc), matte: true });

  // ---------------- FRONT
  g2.clear();
  f.save(); camOn(f, P, kc);
  const out = paid ? 1 - clamp((t - HP.tap) / 0.1) : 1; // her line clears for the payment
  if (out > 0) {
    const wc = W.cute;
    if (t >= wc.s - 0.05) {
      const sc = E.popScale(t, wc.s, { from: 1.18, k: 260, z: 0.5 });
      E.drawText(f, "Cute.", L.cute.x, L.cute.y, { font: B.FONT.serif, italic: true, weight: 400, size: L.cute.size, color: B.C.coral, align: "center", s: sc, alpha: E.wordAlpha(t, wc.s, 1e9) * out, stroke: 1.6 * S, strokeColor: B.C.coral });
    }
    // "Hold my matcha." word by word; a pen arrow tracks the cup as his hand takes it off to the right
    const font = { font: B.FONT.serif, italic: true, weight: 400, size: L.hold.size, color: B.C.coral, align: "left", stroke: 1.2 * S, strokeColor: B.C.coral };
    let x = L.hold.x;
    for (const [w, txt] of [[W.hold, "Hold "], [W.my, "my "], [W.matcha, "matcha."]]) {
      const ww = E.measure(f, txt, font);
      if (t >= w.s - 0.05) {
        const u = ease.outCubic(clamp((t - (w.s - 0.05)) / 0.12));
        E.drawText(f, txt, x, L.hold.y + (1 - u) * 14 * S, { ...font, alpha: u * out });
      }
      x += ww;
    }
    if (v && t >= W.hold.s - 0.02) {
      const cupUV = smoothPt(v, Math.min(lt, 1.8), 19) ?? [0.74, 0.53];
      const [cx0, cy0] = E.plateToScreen(E, v, cupUV, opts), go = ease.inOutCubic(clamp((lt - 1.85) / 0.5));
      const ex = lerp(cx0 + 10 * S, E.W - 30 * S, go), ey = lerp(cy0 + 70 * S, cy0 + 20 * S, go);
      B.penArrow(f, L.hold.x + 120 * S, L.hold.y - 62 * S, ex, ey, t, W.hold.s - 0.02, { dur: 0.2, width: 6 * S, bend: -0.22, alpha: out, seed: 7 });
    }
  }
  // tap rings from the terminal
  if (paid && t < HP.tap + 0.9) {
    for (let k = 0; k < 3; k++) {
      const rr = rippleR(E, t, HP.tap + k * 0.09, tx, ty, 0.62) - k * 6 * S;
      if (rr <= 0) continue;
      f.save();
      f.globalAlpha = (1 - clamp((t - HP.tap - k * 0.09) / 0.75)) * (k ? 0.45 : 0.9);
      f.strokeStyle = B.C.green; f.lineWidth = (k ? 2 : 4) * S;
      f.beginPath(); f.arc(tx, ty, rr, 0, 6.2832); f.stroke();
      f.restore();
    }
  }
  f.restore();
  g2.commit();
  E.blitG2D(E, g2, 1);

  E.hud.sub = false;
  if (!paid) E.hud.alpha = 0; // the whole UI is offline until she pays
  else E.hud.meter = false; // the big counter is the meter for this beat
}
