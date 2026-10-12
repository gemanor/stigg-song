// "I'M AN AI FOUNDER" edit decision list. Sections cut on downbeats or just before a vocal pickup (TREATMENT.md).
export const CANVAS = "landscape";
// export const SAFE = { landscape: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 } };

export const TIMELINE = [
  { id: "intro", start: 0.0, end: 8.4, z: 0, direct: true },
  { id: "drop", start: 8.4, end: 17.4, z: 0, direct: true },
  { id: "verse1", start: 17.4, end: 32.8, z: 0, direct: true },
  { id: "pre1", start: 32.8, end: 42.55, z: 0, direct: true },
  { id: "chorus1", start: 42.55, end: 56.12, z: 0, direct: true },
  { id: "skit2", start: 56.12, end: 68.02, z: 0, direct: true },
  { id: "verse2", start: 68.02, end: 86.96, z: 0, direct: true },
  { id: "chorus2", start: 86.96, end: 100.38, z: 0, direct: true },
  { id: "bridge", start: 100.38, end: 118.85, z: 0, direct: true },
  { id: "chorus3", start: 118.85, end: 134.5, z: 0, direct: true },
  { id: "outro", start: 134.5, end: 147.8, z: 0, direct: true },
  { id: "endcard", start: 147.8, end: 157.99, z: 0, variant: "a", direct: true },
  { id: "endcard_b", file: "endcard.js", start: 147.8, end: 157.99, z: 0, variant: "b", direct: true }, // + AFTER TOKENS · NOV 10 · SAN FRANCISCO
  { id: "endcard_t", file: "endcard.js", start: 147.8, end: 157.99, z: 0, variant: "t", direct: true }, // teaser slate: b without the TOP-UP meter (she hasn't paid yet in teasers 1-2)
  { id: "_smoke", start: 0.0, end: 6.0, z: 0, variant: "smoke", direct: true }, // lead's smoke test, never in a delivery
  { id: "hud", start: 0.0, end: 9999, z: 100, direct: true },
];

export const HUD = {
  sections: [
    [0, "SKIT_01"],
    [8.4, "DROP"],
    [17.4, "VERSE_01"],
    [32.8, "PRE_HOOK"],
    [42.55, "HOOK_01"],
    [56.12, "SKIT_02"],
    [68.02, "VERSE_02"],
    [86.96, "HOOK_02"],
    [100.38, "DUE_DILIGENCE"],
    [118.85, "HOOK_03"],
    [134.5, "CHECKOUT"],
    [147.8, "TOP_UP"],
  ],
};

// Neutral grade: footage passes through untouched. Bloom off by default (CPU render budget); a scene may set E.post.bloom.
export const POST = { bloom: 0 };
