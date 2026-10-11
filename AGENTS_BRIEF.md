# Scene-agent brief: "I'M AN AI FOUNDER"

You are one of 6 motion designers. Each of you builds one or more sections of a 2:38 music video for **"I'M AN AI FOUNDER"**, a satirical electroclash × hyperpop duet about a clichéd San Francisco AI founder and the date who roasts him. It is commissioned by **Stigg** (stigg.io, "the usage runtime for AI products").

The video is rendered entirely in JavaScript (three.js + Canvas2D) by a deterministic frame-stepping engine at 1080p60, over AI-generated 2D cartoon footage of the two characters, keyed out of a flat blue backdrop. It ships on **two canvases**: landscape 1920×1080 (the master) and portrait 1080×1920 (the vertical cut). **Your scene file must lay out on both** (see Canvases).

**The director's brief, in their words:** "go all out", a showreel-level piece, viral like the "LGTM" song. Stigg brand colours and theme (black/green), and **no Stigg logo until the end screen**. Insider-authentic: "think like a person from the scene joking from inside, not like a marketer". The song is a duet where she makes fun of him. Treat this as your showreel.

## Read first (in this order)

1. `STYLE.md`: the law. The concept and the **token meter spine**, the duet grammar (HIM green hype vs HER coral red pen), the 5 looks, palette, type, lyric rules, motion grammar, footage rules, bans.
2. `TREATMENT.md`: your section's row (times, lyrics, look, must-haves). `analysis/footage.md` is the footage map: every clip with its key moments in clip seconds and framing (clips keep landing while you work).
3. `ENGINE_API.md`: the full engine API.
4. `engine/brand.js`: the shared Stigg kit. **Use it; don't re-implement it.** It has:
   - `C` palette, `FONT`, `EV` song events
   - `tokensAt(E, t)` / `meterState` / `burnRate` (the spine)
   - `pixelText()` (After Tokens pixel-grid type), `crosshairs()`, `hairGrid()`, `rules()`
   - HER's red pen: `penStrike`, `penCircle`, `penUnderline`, `penArrow`, `penNote`, `stamp`
   - `afterTokens()`, the SEE YOU AFTER TOKENS lockup, used every time that line is sung
   - `speakerOf(w)` (HIM / HER / GANG / ALL per lyric line)
   - If you need a shared helper added, tell the lead in your report; meanwhile write it locally in your own folder.
5. `analysis/research_craft.md` (techniques, timings, phone type sizes, the 9:16 safe zones, Stigg's verified strings in §2) and `analysis/research_culture.md` (the insider facts behind each joke). Only put verified numbers on screen.
6. `engine/scenes/_smoke.js`: a working example of a ground → hero type behind the character → keyed cut-out → tracked label → pixel type → red pen → stamp. And `engine/scenes/_template.js`.
7. Your clips: `out/clips/sheet_<clip>.jpg` (4 fps contact sheet; tile k = k × 0.25 s) and `out/key_<clip>.jpg` (the cut-out over 4 grounds). Read them before designing.

## Ownership

- You own ONLY your scene files `engine/scenes/<id>.js` (they currently re-export a stub; replace the whole file), plus an optional `engine/scenes/<id>/` helper folder and `assets/<id>/` for generated data.
- Don't edit `engine/main.js`, `core.js`, `plate.js`, `typekit.js`, `roto.js`, `timeline.js`, `brand.js`, `scenes/hud.js` or anyone else's files. On an engine bug, work around it locally and report it.
- **Deterministic only:** no `Math.random`, `Date`, `performance.now` or rAF timing. Use `E.rng(seed)`, `E.hash1`, `E.noise1/2`, closed-form motion.
- **Your layer is `direct`:** it draws straight into the frame buffer, which is cleared to black each frame. So:
  - paint your own full-frame ground every frame;
  - never return an opacity number from `render()`;
  - don't rely on layer blend modes. Do fades yourself, e.g. a black rect with alpha.
- **Performance** (this machine renders on CPU, so it matters):
  - at most 2 full-res `makeG2D` surfaces redrawn per frame;
  - cache text canvases, Path2Ds, geometry and bitmaps in `load()`;
  - no allocation in hot loops;
  - prefer Canvas2D over heavy 3D;
  - bloom is off project-wide: don't enable it.
- Don't generate AI images or video. The lead owns Scenario. Procedural graphics in code are encouraged.

## Footage rules

- Every character clip is a **keyed cut-out**: `meta.mask` is set and the matte comes from the blue backdrop.
  - **Always** draw it with `E.drawPlate(E, v, { matte: true, … })` over your own designed ground.
  - **Never** draw the raw plate: the blue backdrop must never appear.
- **The pixels are untouched**: no filter, glow, grain, outline, halftone, tint or grade on the character.
  - You may reframe (`zoom`, `x`, `y`, `crop`), mirror, scale, cut, speed-ramp (map local time), mask it into a shape, tile it, or put it on a 3D card (`E.plateMaterialFor`).
  - A soft contact shadow under full-body shots, drawn as a graphic, is welcome.
- **Integration:** every footage moment needs at least one graphic that is one of:
  - tracked to the character (`v.trackAt(localT)`: `box`, `top`, `c`, and `pose` (works on these cartoons: 33 MediaPipe landmarks; smooth over ±2 frames));
  - timed to its motion;
  - sitting behind it via the cut-out (type behind the character).
  A plain "character + caption" is a failure.
- **Never a frozen frame.** Keep `localT` inside `[0, v.meta.dur)`. Clips are 24 fps, 4-8 s. Plan your shot lengths, or loop and ping-pong cleanly (ping-pong only on idle moments).
- **Never cover a face** with type. MID-layer type behind a character must stay readable, so move it if a key letter is hidden.
- No cut-off heads except deliberate face close-ups, and give full-body shots room.
- **Clip double-use:**
  - A shared clip (e.g. `him_chant`) can appear in several sections, but **vary** it: different crop, scale, mirror, timing, ground.
  - Never the same framing twice in a row.

## Lyric rules

- **Every sung or spoken word visible** at its onset, either as a designed hero or in the HUD subtitle (on by default). Set `E.hud.sub = false` only while your scene shows the whole line itself. Data: `E.words` (`{w, s, e, li, wi, section, line}`, `line.speaker`), `E.lineAt`, `E.wordAt`, `E.section('chorus1')`.
- **Impact on the onset:** the impact frame is `w.s`, anticipation starts at most 4 frames earlier, and nothing lands late.
- **Hold until at least `w.e`**, then exit 3× faster than the entry, or hard-cut on the next beat.
- **Hierarchy:** 1-3 hero words per line. Never the same treatment on two consecutive lines, and never repeat another chorus's treatments line for line.
- **The duet grammar:**
  - HIS words in hype type (Inter Tight / Archivo 800-900, white/green);
  - HER words in Instrument Serif Italic coral, or as red-pen marks on his type;
  - the GANG "FOUNDER!" as a crowd/stadium wall.
  - Her unsung chorus comebacks ("of course you can't", "babe, you're pre-seed") are coral handwritten notes only.
- **SEE YOU AFTER TOKENS** always uses `B.afterTokens()`. Pass the line's 4 words so each lands on its onset, and size/position it for your layout.
- Type sizes that read on phones (research §3.6): captions ≥ 64 px, heroes ≥ 180 px on 16:9, nothing important under 54 px.

## Motion rules

- Springs with overshoot for pops, ease-out for arrivals, in-out for morphs, linear only for meters, counters and progress. UI never scales from 0 (min 0.92).
- Kicks drive camera punch (`E.post.punch` 0.015-0.04), only in high-energy moments. Snares drive colour/shape events, vocals drive type, bass drives glow. Use 1-2 sync layers per moment.
- Cut density follows TREATMENT.md, and a designed event lands on every beat. Use `E.beat(t)`, `E.last/next('beats'|'downbeats'|'kicks'|'snares', t)` and `E.pulse()`. Never hard-code BPM: it's 125 (0.48 s beats, 1.90 s bars) but use the lists.
- At least one "how did they do that" moment per section. For example:
  - type behind a character;
  - a slide he steps out of;
  - a chart line that becomes type;
  - a 3D token coin;
  - a match cut on shape;
  - pixel cells that assemble into a word.
- Photosensitivity: at most 3 full-frame luminance flips per second; never strobe on 8ths.
- Set `E.hud.theme = 'light'` on white or green grounds. You may set `E.hud.meter = false` while your scene shows a bigger version of the token meter. Always read `B.tokensAt(E, t)`.

## Canvases (landscape master + portrait cut)

- Lay out from `E.W`, `E.H`, `E.SAFE` and `E.ORIENT`, never from 1920/1080 constants, and size every px as `n * E.SCALE`.
- On portrait (`E.ORIENT === 'portrait'`):
  - restack: characters lower/center and type above;
  - fit hero type to `E.SAFE.w` (`E.fitSize`);
  - keep words and faces inside `E.SAFE` (it excludes the platform UI);
  - full-bleed grounds and characters may extend outside it.
- Characters are cut-outs, so reposition and rescale them freely per canvas (`drawPlate` x/y/zoom; use `fit: 'cover'` math as in the smoke scene, or `fit: 'contain'` + zoom).
- Check both: `--canvas portrait` stills at the end of each iteration.

## Tools (run from the project root)

This machine renders on CPU: about 0.45 s per 1080p frame, and 6 designers share 4 cores. **Iterate at `--scale 0.5`, run one render process at a time, keep previews short.**

- **Stills and sheet:** `node tools/still.mjs --only <id>,hud --range <a>:<b>:<step> --scale 0.5 --dir out/<id>/it1 --sheet sheet --cols 4`, then Read the sheet. `--t 1.2,3.4` for exact times. `--canvas portrait` for the vertical cut. `--safe` outlines the portrait safe band.
- **Preview with audio:** `node tools/render.mjs --only <id>,hud --from <a> --to <b> --fps 30 --scale 0.5 --out out/<id>/preview.mp4 --force`.
- **Frame timing:** `node tools/profile.mjs --only <id>,hud --t0 <a> --n 12` prints the median per-frame cost (renderFrame + grab). Keep yours under ~1.2 s at scale 1.
- **Freeze check:** `ffmpeg -i out/<id>/preview.mp4 -vf "freezedetect=n=0.003:d=0.25" -map 0:v -f null - 2>&1 | grep freeze_`.

## Required verification loop

1. **Plan first.** Write a beat-by-beat plan as a comment block at the top of your file: each lyric word with its onset (from `engine/data/lyrics.json`), the visual event, the layer (back/mid/front), and where each cut lands (`engine/data/audio.json` beats/downbeats).
2. **Build, then contact-sheet** the whole section at 0.25 s steps (scale 0.5) and critique it.
3. **Onset check:** stills at `w.s + 0.03` for every hero word (legible and at its peak) and at `w.s − 0.10` (not fully in yet).
4. **Preview mp4** at 30 fps with audio (scale 0.5) for one or two key passages. Confirm the cuts land on beat frames, and run the freeze check.
5. **Iterate at least 3 times on the look:**
   - Would a top motion designer repost this?
   - Is there one focal point?
   - Is the character clean and untouched?
   - Is the type hierarchy strong?
   - Is it too empty, too busy, or generic?
   - Is it funny? The jokes must land visually for a muted viewer.
6. **Portrait pass:** a contact sheet with `--canvas portrait`, then fix the layouts.
7. **Boundaries:** your first frame is a hard cut in and must be striking; check the first and last 3 frames of each section.

## Final report (to the lead)

- What you built, moment by moment (time → visual → layer), and which clips you used where (clip + clip-time range).
- Measured per-frame cost.
- Paths to your 4 best full-res stills (`--scale 1`, landscape) and 2 portrait stills.
- Engine issues, shared-helper requests, lyric-timing doubts and freeze-check results.
