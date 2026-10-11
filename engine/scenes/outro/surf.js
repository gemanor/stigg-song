// Two full-res 2D surfaces shared by outro.js and endcard.js (only one of the two scenes is live per frame):
// g1 = BACK + MID (blitted under the cut-out), g2 = FRONT (blitted over it).
let G = null;
export function surfaces(E) {
  if (!G) G = [E.makeG2D(E.W, E.H), E.makeG2D(E.W, E.H)];
  return G;
}
