# STYLE: "I'M AN AI FOUNDER" (the law)

## Concept (one line)

A deadpan SF AI founder sings his own pitch deck while his date live-corrects it in red pen, and the whole video runs on his **token meter**: every word he sings burns tokens, until the song itself runs out of tokens on the word "tokens".

## The spine: the TOKEN METER

A Stigg-style usage meter lives in the HUD for the whole video (`engine/brand.js → tokensAt(t)`; never re-implement it in a scene).

- 0:00 starts at **1,000,000 tokens**, labelled TOKEN BUDGET.
- Every word HE sings or says burns tokens. The burn is deterministic per word; chants cost more; HER words cost nothing.
- Fixed beats:
  - "burned a quarter-million" at 19.70: −250,000 in one roll.
  - The final chorus blinks LOW BALANCE below 10%.
  - The outro drains to exactly **0 at 144.00**, the music cut on "tokens". The screen hard-cuts to black: `0 TOKENS · USAGE BLOCKED`.
- **147.82** (the chime): she taps to pay, `TOP-UP APPROVED · +1,000,000`. The meter refills and the music comes back.
- End card: "MAKE EVERY TOKEN COUNT." (the director's slogan; "count" is the meter's own pun).

Scenes may show their own big versions of the meter (a hero counter, a burn chart), but always read `tokensAt(t)`, so the numbers never disagree.

## The duet's visual grammar

| | HIM: the founder | HER: the date |
|---|---|---|
| colour | Stigg green #92E759 ("allowed / live / up") | coral #FF776D (Stigg's own error/"blocked" red) |
| type | big, glossy, confident heavy grotesk, UPPERCASE hype, pitch-deck polish | Instrument Serif Italic, sentence case, plus hand-drawn coral strikes, circles, arrows and stamps |
| behaviour | slams in on beats, fills the frame, overclaims | annotates, strikes through, translates, deflates |
| sound role | sings / talk-sings, burns tokens | roasts; her words cost 0 |

Her chorus comebacks are **not sung** in the final take. They appear only as written coral red-pen notes on his type: "of course you can't" after "I can't come out tonight", "babe, you're pre-seed" after "No dating till Series B". Never style them like sung lyrics.

## Looks (cut hard between them on downbeats)

| look | ground | ink | accent | rendering rule | used in |
|---|---|---|---|---|---|
| **A · AFTER TOKENS** (dark) | #131512 (Stigg neutral-950) | #FFFFFF | #92E759 | hairline grid #393A38, green rules at 45% alpha, corner crosshairs, **pixel-grid green type** for TOKENS/counters (3-px cells split by 1-px #436633 lines, from Stigg's After Tokens banner) | intro party, drop, choruses, outro, end card |
| **B · PITCH DECK** (light) | #F9F8F5 | #131512 | #92E759 highlight bars | slide chrome: mono slide numbers ("07/12"), thin rules, bullet builds, a circle headshot, charts; it is HIS self-image, so it's slick | verse 1, pre-chorus (where she red-pens it) |
| **C · SIGNAL GREEN** (flat) | #92E759 full frame | #131512 | #FFFFFF | giant condensed type, no chrome, pure slam | chant hits in the drop and choruses |
| **D · DICTIONARY** (editorial) | #FFFFFF | #131512 | #FF776D | a dictionary page: Instrument Serif headwords, JetBrains Mono phonetics, two columns HE SAYS → IT MEANS | verse 2 (her rap) |
| **E · TERMINAL** (dark UI) | #131512 | #F9F8F5 | #92E759 / #FF776D | panels #1E211F with 1-px #393A38 borders, mono logs printing on 16ths, node graphs, form fields | skit 2 (agents for agents), bridge (due-diligence form) |

**Black:** #131512 is the ground. Pure #000000 is reserved for the 144.00 blackout ("the song ran out of tokens").

## Palette (roles)

`PAL` in `engine/core.js`:

| role | hex | use |
|---|---|---|
| `bg` / `black` | #131512 | ground |
| `void` | #000000 | the blackout only |
| `ink` | #131512 | type on light grounds |
| `white` | #FFFFFF | type on dark grounds |
| `paper` | #F9F8F5 | Stigg off-white |
| `accent` / `green` | #92E759 | HIM, allowed/live |
| `mint` | #6BF8C2 | secondary live state |
| `cyan` | #69FFF1 | gradient end only |
| `coral` | #FF776D | HER, blocked/denied |
| `line` | #393A38 | hairlines |
| `cell` | #436633 | pixel-grid cell lines |
| `panel` | #1E211F | UI panels |
| `grey` | #959595 | secondary text |
| `dgreen` | #1B4D39 | green shadows |
| `pale` | #DEFCCA | pale-green fills |

Stigg's gradient: #92E759 → #72B445 → #DEFCCA → #80BD56 (site) and #F9F8F5 → #92E759 → #69FFF1 (logo). Use gradients only on HIS hype heroes and the end card.

## Type roles

| role | font | use |
|---|---|---|
| HERO (his hype) | **Inter Tight 800-900** (Stigg's own title fallback), or **Archivo 800-900** with the width axis for condensed↔expanded morphs; **Archivo Black** / **Anton** for outlines and 3D | uppercase, tracking −0.02 to −0.04em |
| PIXEL (tokens, counters, the meter) | the pixel-grid renderer `brand.pixelText()` (Archivo Black rasterised into 3-px cells) | tokens, counts, the end card's TOKEN |
| MONO (UI, HUD, logs, numbers) | **JetBrains Mono** 500-700 | labels uppercase with +0.08em tracking |
| HER (red pen) | **Instrument Serif Italic** in coral, plus drawn strokes | sentence case, never uppercase |
| DECK / DICTIONARY body | Inter Tight 500-600 or Instrument Serif | sentence case |

Never stroke a variable font (Archivo, Inter Tight, JetBrains Mono). Outline type uses Archivo Black or Anton.

## Lyric display rules

- **Every sung or spoken word is visible at its onset** (`engine/data/lyrics.json`), as a designed hero or in the HUD subtitle. The subtitle is on by default; set `E.hud.sub = false` only while your scene shows the whole line itself.
- The subtitle is 60 px Inter Tight 700 on a #131512 plate (phones: see `analysis/research_craft.md` §3.6). Fast lines show in chunks of 2-4 words.
- Impact frame = `w.s`. Anticipation starts at most 4 frames early. Hold to at least `w.e`; exit 3× faster than the entry, or hard-cut on the next beat.
- 1-3 hero words per line. Never the same treatment on two consecutive lines.
- HIM's lines in hype type, HER's in serif/coral, dialogue in the speaker's colour, and the chant "FOUNDER!" as a crowd: many repeated words, a stadium wall.
- **"SEE YOU AFTER TOKENS"** is always set in the After Tokens banner style: TOKENS in pixel-grid green, corner crosshairs, hairline rules. It's the Stigg easter egg. Keep it consistent every time.

## Motion grammar

- **Kicks** drive camera punch (`E.post.punch` 0.015-0.04), in the drop and choruses only. **Snares** drive colour/shape events (stamps, strikes, flashes of rules). **Vocal onsets** drive type. **Bass** drives glow.
- Use 1-2 sync layers per moment.
- Springs with overshoot for pops, ease-out for arrivals, in-out for morphs, linear only for meters, counters and progress. UI never scales from 0 (min 0.92).
- Cut density per section:
  - skit 1: per line;
  - drop: every beat;
  - verse 1: a slide per line (≈ every 2 beats), with builds on beats;
  - pre-chorus: every 2 beats;
  - choruses: every beat (the final chorus adds half-beat stutters in its last 2 bars);
  - skit 2: per line;
  - verse 2: per line (a dictionary entry per couplet), with beat events;
  - bridge: per question/answer (each on its beat);
  - outro: per line, then the hard cut to black at 144.00;
  - end card: per bar.
- At most 3 full-frame luminance flips per second (photosensitivity). Never strobe on 8ths.
- At least one "how did they do that" moment per section: type behind a character via the matte, a deck slide that the character steps out of, a line from his chart that becomes type, a 3D token, a match cut on shape.

## Footage rules

- Characters are generated on a flat chroma-blue cyc and keyed (`tools/key_blue.py`; `meta.mask = true`). **Draw them clean**: `E.drawPlate(E, v, {matte:true})` over your designed backdrop. No filter, glow, grain, tint, outline or grade on the character pixels.
- You may reframe, crop, scale, mirror, speed-ramp, cut, tile, mask into shapes, or put the cut-out on a 3D card. A soft contact shadow under full-body shots is drawn as a graphic.
- The raw blue plate is **never** shown. Always draw the cut-out (`matte:true`) over a designed ground.
- Integration: every character moment has at least one graphic tracked to the character (`v.trackAt()` box/top/c, pose where it holds), timed to its motion, or sitting behind it via the matte. "Character + caption" alone fails.
- Never a frozen frame. Keep `localT` inside the clip. No cut-off heads except deliberate face close-ups. Type never covers a face.
- A character is always one of the two (or the VC in verse 1). No other people.

## Subject (the cast)

- **HIM**, the founder: curly dark hair; beige cap that just says "building"; grey oversized hoodie with a small black stair-step logo; black lanyard with a white/light-blue conference badge; white earbuds; smart band; black joggers; white socks; chunky white sneakers. Props: a lilac energy-drink can (his "Celsius"; never show a real logo), a Mac mini (his co-founder), a Zyn-style tin. Deadpan, half-lidded, smug.
- **HER**, the date: dark hair in a low messy bun; gold hoops; winged liner; red lips and nails; oversized black blazer, white tee, wide black trousers, white sneakers; an iced matcha with a green straw; a coral phone. Side-eye, eye-rolls, smirks. She's the actual adult in the room, and she pays.
- Graphic motifs from the cast: the cap's word "building", the badge (a usage card), the lilac can, the matcha cup (her "HOLD MY MATCHA" callback), the coral phone (the payment tap).

## Brand rules

- **No Stigg logo, wordmark or name before the end card** (director's rule). Stigg colours, the After Tokens visual language and Stigg-true ideas (metering, credits, "usage blocked", top-ups) are welcome throughout.
- End card: "MAKE EVERY TOKEN COUNT." → the official logo `assets/brand/stigg_logo_nav.svg` in its official gradient (never recoloured) + "The usage runtime for AI products". Variant b adds "AFTER TOKENS · NOV 10 · SAN FRANCISCO" (from stigg.io's own banner).
- Use only the verified strings in `analysis/research_craft.md` §2 for any Stigg copy.

## Bans

Matrix rain, RGB-split glitch spam, hex grids, CRT curvature, hoodie-hacker clichés, emoji fonts, real company logos (Celsius, Apple, Sequoia, Zyn, X/LinkedIn), fake quotes from real people, Comic Sans energy, drop shadows on type, lens flares, generic "AI brain" imagery, stock-photo looks, any effect on the character pixels.
