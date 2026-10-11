// Smoke test: keyed cut-out over the After Tokens ground, hero type BEHIND him via the matte, pixel-grid TOKENS,
// a tracked label on his box top, a red-pen strike and a stamp. Not part of the timeline.
import * as B from "../brand.js";
let v, g;
export default {
  async load(E) { v = await E.loadVideo("him_chant"); g = E.makeG2D(E.W, E.H); },
  async prepare(E, t, layer) { await v.frame(Math.min(v.meta.dur - 0.05, (t - layer.start) % v.meta.dur)); },
  render(E, t, rt, layer) {
    const S = E.SCALE, c = g.ctx, lt = (t - layer.start) % v.meta.dur;
    E.renderer.setRenderTarget(rt);
    g.clear();
    c.fillStyle = B.C.bg; c.fillRect(0, 0, E.W, E.H);
    B.hairGrid(c, 0, 0, E.W, E.H, { step: 96 * S, alpha: 0.7 });
    E.drawText(c, "I'M AN AI", E.W * 0.36, E.H * 0.36, { font: B.FONT.hero, weight: 900, size: 230 * S, color: B.C.white, align: "center", tracking: -0.03 });
    E.drawText(c, "FOUNDER", E.W * 0.40, E.H * 0.62, { font: B.FONT.hero, weight: 900, size: 300 * S, color: B.C.green, align: "center", tracking: -0.03 });
    g.commit(); E.blitG2D(E, g, 1);
    E.drawPlate(E, v, { fit: "cover", matte: true, x: 120 });
    g.clear();
    const tr = v.trackAt(lt), [x, y] = E.plateToScreen(E, v, tr.top, { fit: "cover", x: 120 });
    c.strokeStyle = B.C.green; c.lineWidth = 2 * S; c.beginPath(); c.moveTo(x, y - 10 * S); c.lineTo(x + 120 * S, y - 90 * S); c.lineTo(x + 360 * S, y - 90 * S); c.stroke();
    E.drawText(c, "FOUNDER_01 · PRE-SEED", x + 130 * S, y - 108 * S, { font: B.FONT.mono, weight: 700, size: 20 * S, color: B.C.green, align: "left" });
    B.pixelText(c, "TOKENS", E.W * 0.06, E.H * 0.74, { rows: 13, cell: Math.round(9 * S), reveal: B.EV ? Math.min(1, (t - layer.start) / 1.2) : 1 });
    B.penStrike(c, E.W * 0.05, E.H * 0.83, E.W * 0.36, t, layer.start + 1.5, { width: 9 * S });
    B.penNote(E, c, "of course you can't", E.W * 0.06, E.H * 0.91, t, layer.start + 1.7, { size: 54 * S });
    B.stamp(E, c, "DECLINED", E.W * 0.78, E.H * 0.80, t, layer.start + 2.2, { S, size: 90 });
    g.commit(); E.blitG2D(E, g, 1);
    E.hud.label = "SMOKE";
  },
};
