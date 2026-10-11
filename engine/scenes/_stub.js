// Placeholder for a section that its agent hasn't built yet: the section id on the After Tokens ground.
import * as B from "../brand.js";
let g;
export default {
  async load(E) { g = E.makeG2D(E.W, E.H); },
  render(E, t, rt, layer) {
    const S = E.SCALE, c = g.ctx;
    g.clear();
    c.fillStyle = B.C.bg; c.fillRect(0, 0, E.W, E.H);
    B.hairGrid(c, 0, 0, E.W, E.H, { step: 96 * S, alpha: 0.6 });
    E.drawText(c, layer.id.toUpperCase(), E.W / 2, E.H * 0.45, { font: B.FONT.hero, weight: 900, size: 160 * S, color: B.C.white, align: "center" });
    E.drawText(c, `${layer.start.toFixed(2)} – ${layer.end.toFixed(2)}`, E.W / 2, E.H * 0.6, { font: B.FONT.mono, weight: 600, size: 28 * S, color: B.C.grey, align: "center" });
    g.commit(); E.renderer.setRenderTarget(rt); E.blitG2D(E, g, 1);
  },
};
