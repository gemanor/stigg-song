# Research: benchmark, brand and viral craft for "I'M AI FOUNDER"

Compiled on 2026-10-11 from web-search snippets only. WebFetch could not resolve DNS, so no page or video was opened, and the search budget ran out near the end.

**Tags:** **[V]** stated in a cited source; **[C]** sources conflict; **[U]** unverified; **[I]** my inference. Put only [V] numbers and strings on screen. `[n]` points to the source list at the end.

## 0. Ten rules

1. **Frame 0 is a finished poster:** the founder plus giant hook text. No fade, no black, no logo. The premise must read muted within 1 s.
2. **Grid at 128 BPM:** 1 beat = 0.469 s = 28.125 frames at 60 fps. 1 bar = 1.875 s. 8 bars = 15.0 s. Snap cuts to the analysed `beats`/`downbeats`, not to a computed grid.
3. **Cut density:** in the chorus, a cut or designed event every beat. In the verse, a cut every 2 beats to every bar. A joke longer than 4 words holds for at least 1 bar.
4. **Burn in every lyric.** X autoplays muted [35].
5. **16:9 type sizes:** must-read text ≥ 54 px, captions 64–96 px, heroes ≥ 180 px. The HUD's 24 px subtitle can't be read on phones (§3.6).
6. **9:16 text-safe box:** x 120–960, y 290–1250.
7. **Cutdowns are whole bars** (4 bars = 7.5 s, 8 = 15 s, 16 = 30 s), and the last frame matches frame 0.
8. **At most 3 large flashes per second** [49]. Never strobe on 8ths, which is 4.3 per second at this tempo.
9. **Green is a state** (allowed, live, up). Use it sparingly on black.
10. **Stigg copy comes only from §2.** No Stigg hex value or font is verified.

## 1. Benchmark: "LGTM (Looks Good to Me)", YouTube 3TNpOD6bov8

| Item | Finding |
|---|---|
| Title | "LGTM (Looks Good to Me) - Claude Opus 5.5 music video" [V][1] |
| Posted | About 2026-10-06. Search results on 10-11 said "about five days ago" [V, approx.] |
| Description (truncated) | "LGTM stands for 'looks good to me'. Lately it's what engineers type on code they never had time to read, because leadership heard AI makes everyone ten times…" [V][1] |
| Subject | Satire of AI-assisted development: rubber-stamp code review under AI-productivity mandates [V][2][6]. A Substack published 10-11, probably about this video, names AI-first mandates, "make no mistakes" prompting and LGTM culture as targets [V][7]. |
| Production | The title credits Claude Opus 5.5. An HN commenter wrote: "Song made with Suno v6, though, not Opus" [V][2]. Goertz says Suno plus Claude [V][5]. A sibling upload with the same title format, "The Simulation's Ending", is "animated by Claude Opus 5.5 with a song produced by Suno v6" [V][8]. Most likely Suno audio plus animation written as code by Opus [I]. |
| Spread | Hacker News item 50010330 [2]. Lee Penkman shared it on X on 10-09 [3]. Blog posts by Kniebes (10-09) [4] and Goertz [5]. Hungarian news described "provocative lyrics and striking animation" [V][6]. |
| Reception | Split [V][2]. Praise: "sounds better than most other music made by real pop artists". Criticism: "LLMs are now fantastic at imitating mediocre art", plus complaints about Suno and copyright. |
| Context | Part of a wave of code-rendered "Claude Opus 5.5 music videos" after the model's 2026-09-22 release [V, third-party][11][12]. The wave was seeded by the "I'm Upping My P(doom)" Claude-Pop audio, posted on X on 09-09 (about 723k views) [V][9]. The PDoomVideo pipeline: storyboard → one JS painter per chapter → about 3,760 frames in headless Chrome → ffmpeg, for 156.6 s [V][10][11]. |

**Not verified [U]:** the creator or channel, views and likes, genre or BPM, the visual style beyond "striking animation", and the cut rate. I could not watch the video.

**Why it spread [I]:**
- **Shibboleth title:** every engineer types LGTM.
- **A live pain point:** AI mandates mean nobody really reviews the code.
- **Meta novelty:** "made by Claude", two weeks after launch, mid-wave.
- **Built-in argument:** the credit dispute and the "slop" debate keep comments going.
- **Easy to share:** you send it to your engineering manager.

**For us:**
- Put an instantly recognised cliché in the title, and release while the wave is hot.
- Make the making part of the joke, e.g. a HUD line "rendered in JavaScript".
- Beat the "mediocre art" critique with real craft (see Planet of the Bass, §3.1).

## 2. Stigg brand

### Verified strings for inserts

These come from search snippets. Re-check the live site before the final render.

- **Site title:** "Stigg - The Usage Runtime for AI Products" [V][13][15]
- **Hero:** "Every AI request is a spend decision. Make it in milliseconds."
- **Hero subline:** "Credits, entitlements, metering, and governance in a single enforcement layer." [V][13]
- **Stigg 2.0 launch post** [V][16]:
  - "Not billing. Not metering."
  - "Billing tells you what happened. Stigg decides what's allowed."
- **Credits page heading:** "Credits today. Hybrid tomorrow." [V][14]
- **Credits** [V][14][16][17]:
  - A ledger of "every burn, top-up, and expiration".
  - At zero, the product blocks usage, auto-charges, bills the overage or sends a low-balance alert.
  - Double-entry ledger with zero-overdraft enforcement.
  - "Free forever for AI startups".
- **Governance:** budgets and limits for teams, departments, users and agents, in private beta [V][19].
- **Dates:** Stigg 2.0 launched 2026-07-01 per Product Hunt, or "June 2026" per another source [C][17]. Stigg acquired Received.ai on 2026-08-18 [V][20].
- **Conflicting numbers; don't quote them:**
  - Latency: "under 10 ms" [13], "under five milliseconds" [18], "sub-millisecond" [17]. On screen, just say "milliseconds".
  - Pro pricing: $399/mo billed annually [21], or $331/mo per a third party.

### Identity [V]

- **nmore (studio&more, Tel Aviv)** made the original identity [22]:
  - The logo combines a package and an arrow.
  - Building blocks stand for modularity.
  - The key animation shows pricing changes flowing into a paywall.
  - The brand also uses illustrations, icons and doodles.
- **MakersTeam's Webflow rebuild** added scroll-triggered usage and credits charts and an entitlements panel [23]. Older positioning: "pricing and entitlement platform for modern SaaS".

### Not found [U]

- Any Stigg hex value, the typeface, and an official logo SVG.
- `assets/brand/` is empty, so the HUD `mark` stays empty until an official path arrives.
- **Next step:** eyedrop stigg.io (background, CTA, logo) or ask Stigg for its brand kit. Meanwhile, label the `E.PAL` placeholder green "NOT STIGG".

**Other brands' greens, for calibration only:**
- Brat: #8ACE00 [V][27]; one source gives #8ACF00 [C].
- Supabase: #3ECF8E on #121212 [V, third-party][53].
- Robinhood's "Robin Neon": no hex found.

## 3. What made satirical, tech and AI songs spread (2023–2026)

### 3.1 Case notes

| Case | Facts | Mechanism [I] |
|---|---|---|
| BBL Drizzy (Apr 2024) | Human-written satire with AI (Udio) vocals. 3.4M SoundCloud streams in a week. Metro Boomin beat plus a $10k contest. Drake cleared a sample [V][24][25]. | Topical, chantable title, remix kit |
| Planet of the Bass (2023) | A one-minute teaser of a 90s Eurodance pastiche. About 110M X views by 2023-08-16 [V][26]. | Satire built on genuinely good genre craft; teaser first |
| Brat (2024) | #8ACE00 with blurred lowercase Arial, by Special Offer, Inc. "Easy to recreate"; official generator; Grammy for packaging [V][27][28]. | Ownable, copyable template |
| P(doom) Claude-Pop (Sep 2026) | About 723k X views. Became the default soundtrack for code-made videos [V][9]. | Shared track plus a "can your model do this?" challenge |
| Breaking Rust, "Walk My Walk" (Nov 2025) | An AI track topped Billboard's Country Digital Song Sales. 3M+ Spotify streams in under a month [V][29]. | AI novelty plus a disclosure controversy |
| Tilly Norwood, "Take the Lead" (2026) | Panned as "abysmal slop" [V][30]. | Counter-example: AI with no joke and no craft |
| Cubicle comedians (Corporate Erin) | One video has about 11M views [V][31]. | Hyper-specific workplace truth |

**Type and format signals, 2025–26** (vendor roundups, weak evidence) [V][33][34]:
- Type that carries the animation itself.
- Variable fonts as standard.
- 3D and depth.
- Oversized sans that fills the frame; inflated letterforms.
- Expressive serifs returning.
- "Brainrot" pacing: fast cuts, bold word-by-word captions, layered audio.

"Text behind the subject" is a CapCut staple. The engine does it natively: plate, then MID type, then the matte plate.

### 3.2 First 3 seconds as a muted autoplay

- **X** autoplays muted (since 2015) and has had auto-captions since 2021 [V][35]. Burn in the lyrics; don't rely on auto-captions picking up sung vocals [I].
- **Verizon Media/Publicis survey** (2019, n = 5,616) [V][36]:
  - 69% watch with the sound off in public.
  - 80% are more likely to finish a video with captions.
  - A logo shown with captions on mobile cut ad memory by 12%. **Keep the Stigg mark out of the hook and the caption zone.**
- **TikTok is sound-on:** 88% of users say sound is vital [V][37]. The hook must work both muted and with sound.
- **Hook early:** vocals now arrive about 5 s into hits, against 20–23 s in 1986. A 2014 Spotify study found 21% of songs are skipped within the first 5 s [V][38]. **Start cutdowns on a vocal-hook downbeat.**
- **Unverified benchmarks [U]:** "63% of top ads state the message in 3 s" (an ads claim from one blog [39]) and "a 3-s hold of 65–70% is needed" (vendor claims).

**Recipe (about 6 beats):**
1. **Frame 0:** a poster frame, with "I'M AI FOUNDER" at 300 px or larger.
2. **Beat 1:** a sight gag that says "SF AI founder" with no sound.
3. **Beat 2:** the hook word slams in.
4. **Beat 4:** a chart spike or a counter jump.
5. **Beats 5–6:** cut to the performance.

A kick-driven `E.post.punch` shows "music" to viewers watching muted [I].

### 3.3 Cut rates at 128 BPM and 60 fps

| Unit | Seconds | Frames | Use |
|---|---|---|---|
| 16th | 0.117 | 7.03 | Stutters, no longer than 1 beat; no big flashes |
| 8th | 0.234 | 14.06 | Fills; the last bar of a riser |
| Beat | 0.469 | 28.125 | Chorus cuts; type events |
| 2 beats | 0.938 | 56.25 | Verse cuts |
| Bar | 1.875 | 112.5 | Joke holds; one slide per bar |
| 2 bars | 3.75 | 225 | Breakdown holds, which give the drop its contrast |

**Context:**
- Blogs advise a visual change every 1–2 s on Shorts and Reels; some say 2–4 s [C][40].
- One analysed hit has an average shot length of about 2 s [V][41].
- Type events on every beat make the piece feel faster than its cut rate.
- Reading budget: about 0.3 s per word plus 0.5 s [I].

### 3.4 Captions and lyrics on TikTok and Reels

- **Chunks:** 2–4 words per chunk in fast sections, 3–5 otherwise [V, vendor guides][42].
- **Active word:** highlight it by colour, box or size, and use emphasis sparingly [42].
- **Style:** bold sans with a stroke or a backing plate [42]. Engine note: never stroke the variable Archivo. Use Archivo Black or Anton, or a black plate.
- **Spelling:** a misspelled lyric is glaring on a phone [V][42]. Check every word against `lyrics.json`.
- **Placement:**
  - 9:16: lower-middle, baseline at y ≈ 1150–1240, above the Reels bottom 35%.
  - 16:9: lines at most 68% of the width, about 1306 px (BBC guidance, via a secondary source [43]).

### 3.5 Safe zones for 9:16 at 1080×1920

| Platform | Top | Bottom | Right | Left |
|---|---|---|---|---|
| Reels (Meta's percentages, via third parties [44]) | 14% ≈ 270 px | 35% ≈ 672 px; the right-hand button column reaches 40% ≈ 768 px | 6% ≈ 65 px | 6% ≈ 65 px |
| TikTok (third-party [45]) [C] | 108–131 px | 250–370 px | 100–120 px | 60–120 px |
| YouTube Shorts (third-party [45]) [C] | 100–288 px | 180–400 px | 80–192 px | n/a |

**Zone to use:**
- Keep text within x 120–960 (centred lines at most 840 px wide) and y 290–1250.
- Put nothing critical in the right-hand column below y ≈ 1150.
- I found no official spec from TikTok or YouTube.

### 3.6 Text sizes that read on phones (computed [I])

Apple's minimum text size is 11 pt and body text is 17 pt [V, secondary][46]. The table assumes a phone 393 pt wide, the iPhone 15/16 class [U].

| Viewing | pt per video px | 11 pt = | 17 pt = | Use |
|---|---|---|---|---|
| 9:16 full screen (1080 px → 393 pt) | 0.364 | 30 px | 47 px | Captions 64–80 px; heroes 160–360 px; floor 40 px |
| 16:9 inline in a portrait feed (1920 px → 393 pt) | 0.205 | 54 px | 83 px | Captions 64–96 px; heroes 180 px and up; floor 54 px |
| 16:9 full screen in landscape (1920 px → 852 pt) | 0.444 | 25 px | 38 px | n/a |

**Engine flag:** `scenes/hud.js` draws the subtitle at `24*S` and the chrome at `14*S` (1080p px). Inline on a phone, that is about 4.9 pt and 2.9 pt.
- **Fix:** raise the subtitle to 56–64 px, or give every line a designed hero word.
- **Fake UI:** draw it at 2–3× the size of the real UI.

### 3.7 Loops and lengths

- **Whole bars:**
  - 4 bars = 7.5 s, which fits Spotify Canvas: 3–8 s, 9:16, 720–1080 px tall, a seamless loop; avoid lip-sync, rapid cuts and flashing [V][47].
  - 8 bars = 15 s; 16 bars = 30 s.
- **Platform limits:** Shorts accept vertical videos up to 3 min (since 2024-10-15) and Reels up to 3 min (since January 2025) [V][59][60]. The X limit of about 140 s for non-Premium accounts is unverified [U].
- **Seamless restart:** end on the composition of frame 0, and make the final audio bar the one before the hook downbeat, so the replay lands on the hook [V][48] + [I].
- **Make the reset a gag** [I]: the waitlist counter overflows to 0, or "PIVOT" snaps back to "I'M AI FOUNDER". Render loops as `variant:'b'`.
- **Unsourced [U]:** the claim that "replays weigh 2–3×".

## 4. Techniques: timings and E-API sketches

**Shared setup for every sketch:**
- Use one cached `g = E.makeG2D(E.W, E.H)`, with `c = g.ctx` and `S = E.SCALE`.
- Finish each frame with `g.commit(); E.blitG2D(E, g, 1)`.
- Cache Path2D objects and offscreen canvases in `load()`.
- Sizes are for the 16:9 master. In 9:16, keep cards at most 840 px wide.

### 4.1 Fake post (X/LinkedIn parody)

Use a generic card: no real logos, fictional handles [I].

**Timing:**
- The card springs in over about 0.25 s, from y + 60 px and scale 0.94. It never scales from 0.
- Body words land on vocal onsets.
- Likes climb on a log curve from 1 to 100K over 1 bar, ticking on kicks.
- A "Community Note"-style correction slams in on a snare.

```js
const p = E.spring(t - T_IN, 220, 0.7), sc = 0.94 + 0.06 * p;
c.save(); c.translate(E.W/2, E.H/2 + (1-p)*60*S); c.scale(sc, sc);
c.fillStyle = E.PAL.ink; c.beginPath(); c.roundRect(-560*S, -300*S, 1120*S, 600*S, 32*S); c.fill();
E.drawText(c, 'Thrilled to announce', -500*S, -150*S, {font:'Archivo', weight:800, size:72*S, align:'left'});
const likes = Math.round(10 ** E.remap(t, T_IN, T_IN + 4*E.spb, 0, 5));
E.drawText(c, fmtShort(likes), -500*S, 210*S, {font:'JetBrains Mono', size:64*S, align:'left',
  color:E.PAL.accent, s: 1 + 0.15 * E.pulse('kicks', t, 0.08)});
c.restore();
```

### 4.2 Pitch-deck slides

**Timing:**
- Hard cut to the next slide every bar in the verse, and every beat in a chorus "deck flip".
- One bullet builds per beat, with a "07/12" slide counter in a corner.
- A "magic move" carries the founder headshot onto the team slide over 0.35 s (21 frames), in-out cubic.
- TAM circles pop with `outBack` on kicks, while the TAM figure counts up linearly.

```js
const b = E.beat(t), sl = SLIDES[(b.bar - BAR0) % SLIDES.length];
const shown = Math.min(b.inBar + 1, sl.bullets.length);   // one bullet per beat
E.post.flash = 0.06 * E.pulse('downbeats', t, 0.04);       // 2-3 frame flash on the cut
const m = E.tween(t, T_MOVE, 0.35, E.ease.inOutCubic);      // lerp rect A -> B
```

### 4.3 Growth chart ("up and to the right")

**Timing:**
- The flat line draws on over 2 bars, linear.
- A 1-beat `outExpo` spike then exits the top of the frame.
- The camera tilts up into 3D: `E.text3D('$100M ARR', {font:'ArchivoBlack'})`.
- The y-axis label swaps from "ARR" to "BURN" on a snare. Punch the camera on the spike.

```js
const p = E.tween(t, T0, 2*1.875, E.ease.linear);
c.setLineDash([L, L]); c.lineDashOffset = L * (1 - p);        // L = path length, from load()
c.lineWidth = 10*S; c.strokeStyle = E.PAL.accent; c.stroke(this.path);
const k = E.tween(t, T_DROP, E.spb, E.ease.outExpo);          // spike height = k * E.H
E.post.punch = 0.06 * E.pulse('kicks', t, 0.15);
```

### 4.4 Waitlist counter (odometer)

This makes a good HUD spine:
`counters:[{label:'WAITLIST', keys:[[0,3],[T_END,8.1e9]], interp:'log', fmt:'short'}]`. A last key of 1e15 or more prints "∞".

For a hero odometer, each kick adds a step with a 7-frame roll. Use tabular digits: JetBrains Mono, or Doto for an LED look.

```js
const k = E.last('kicks', t) ?? {i: K0, dt: 1}, roll = E.ease.outCubic(E.clamp(k.dt / 0.12));
const v = (k.i - K0 + roll) * STEP;
for (let i = 0; i < 7; i++) { const u = v / 10**i, d = Math.floor(u) % 10;
  const f = i ? E.clamp(E.fract(u) * 10**i - (10**i - 1)) : E.fract(u);
  /* clip to the cell; draw d at y - f*h and (d+1)%10 at y + (1-f)*h */ }
```

### 4.5 Term sheet

**Look:** Instrument Serif headings and JetBrains Mono figures.

**Timing:**
- On each snare, the old value gets a 6-frame linear strike-through and the new value pops in ("$8M → $80M → $800M"; "1x → 3x participating").
- The signature draws on over 1 bar, using the dash-offset trick from 4.3.
- Generic "Sign here" flags bounce on beats.

```js
let j = -1; while (j + 1 < row.t.length && row.t[j + 1] <= t) j++;   // last change <= t, no allocation
if (j >= 0) { const st = E.tween(t, row.t[j], 6/60, E.ease.linear);
  c.fillRect(x, y - 3*S, w * st, 6*S);                                 // strike through row.v[j]
  E.drawText(c, row.v[j+1], x + w + 24*S, y, {font:'JetBrains Mono', size:64*S, s:E.popScale(t, row.t[j] + 0.05)}); }
```

### 4.6 Token-burn meter (the Stigg payoff)

**Timing:**
- A "CREDITS" bar drains linearly (meters always move linearly), with a needle tremor from the hats envelope.
- Below 10%, it blinks every other beat, about 1.07 times per second.
- At zero, a green "allowed/blocked" gate stops the overdraft, and a verified line lands: "Every AI request is a spend decision."

This echoes nmore's "pricing flows into a paywall" animation.

```js
const fill = Math.max(0, E.remap(t, T0, T1, 1, 0) - 0.01 * E.env('hats', t));
const low = fill < 0.1, on = !low || (E.beat(t).i % 2 === 0);
c.fillStyle = low ? WARN : E.PAL.accent; if (on) c.fillRect(x, y, W * fill, H);
```

### 4.7 A green-on-black terminal that isn't cyberpunk

**Avoid** [I]: Matrix rain, RGB-split glitches, hex grids, HUD circles, CRT curvature, hoodie hackers.

**Do:**
- Set big, tight monospace on a 12-column grid, with lots of black.
- Use green only for states (pass, allowed, live), and amber or red for blocked.
- Add Doto dot-matrix numerals, receipt or usage-log tape (on-brand for metering), and ASCII box-drawing pricing tables.

**Timing:**
- Log lines print on 16ths, in bursts of 4 lines.
- A block cursor blinks with `E.beat(t).phase < 0.5`.
- The joke is latency: "allowed · 4 ms" next to "invoice · T+30d" [I].

**References:**
- Berkeley Mono's catalog look, "a love letter to the golden era of computing" [V][54]. Its commercial licence is restrictive, so borrow the feel only.
- Supabase's restraint: green as an identity marker, hairline borders, no shadows [V][53].

```js
// load(): pre-render the whole log once to an offscreen canvas `log` (lh = line height)
const n = Math.min(N, Math.floor((t - T0) / (E.spb / 4)));    // one line per 16th
c.drawImage(log, 0, 0, log.width, n*lh, X, Y, log.width, n*lh);
```

### 4.8 Reference studios for "black + acid green, premium tech"

- **Porto Rocha, Robinhood (2024)** [V][50]: black, white and mature neutrals with pops of "Robin Neon". A quill with an upward arrow. Type: Robinhood Phonic and Martina Plantijn.
- **Special Offer, Inc., Brat** [V][28].
- **DIA Studio (Mitch Paone)** [V][51]: kinetic identities and typographic systems, e.g. Squarespace with the Clarkson typeface.
- **Fitzroy, Fairphone (2025)** [V][52]: dark green with neon lime.
- **nmore:** Stigg's original identity [V][22].

### 4.9 Founder-cliché bank (sourced)

- "Founder mode": Paul Graham's essay, September 2024 [V][55].
- Artisan's "Stop Hiring Humans" billboards in San Francisco, December 2024. Artisan self-reports +$2M ARR from them [V][56].
- "$100M ARR in 8 months": Lovable, July 2025. Cursor took about 12 months, per a Sacra estimate [V][57].
- Cluely's admission of faked $7M ARR, reported March 2026 [V][58].
- The Thunkable CEO's freestyle at Tech Week, after which "San Francisco collectively winced" (November 2025) [V][32].
- Common tropes, not sourced [U]: Patagonia vests, 996 schedules, hacker houses, "AGI" talk.

## 5. Gaps

- **LGTM:** creator, views, genre and BPM, and visual style are unverified.
- **Stigg:** no hex value, font or official SVG; the latency and pricing figures conflict.
- **Platforms:**
  - No official TikTok or YouTube safe-zone spec.
  - Meta's 14/35/6% figures were seen only via third parties.
  - Hook-rate and replay-weight statistics are vendor claims.
- **Not searched (budget ran out):** UI-parody songs (e.g. Bo Burnham), Spotify Wrapped's motion design, and subtitle reading-speed standards.
- **WCAG [49]:** cited from prior knowledge; not fetched.

## Sources

1. https://www.youtube.com/watch?v=3TNpOD6bov8
2. https://news.ycombinator.com/item?id=50010330
3. https://x.com/LeeLeepenkman/status/2108370838873583888
4. https://kniebes.com/2026/10/09/126d62408ccb.html
5. https://marcgoertz.de/2026/lgtm-looks-good-to-me
6. https://hirnavigator.hu/hir/10878229-itt-a-dal-arrol-hogy-hogyan-is-nez-ki-a-modern-mesterseges-intelligencias-fejlesztes
7. https://thedriftingframe.substack.com/p/looks-good-to-me-said-nobody-who
8. https://www.youtube.com/watch?v=R_ErmTs7g9I
9. https://postcutoff.com/e/2026-09-09-deckard-claude-pop-p-doom/
10. https://github.com/JohnHeibel/PDoomVideo
11. https://www.orcarouter.ai/blog/claude-opus-5-5-video-plan-one-shot
12. https://officechai.com/ai/claude-opus-5-5-motion-graphic-videos/
13. https://www.stigg.io/
14. https://www.stigg.io/credits
15. https://www.stigg.io/blog-posts/announcing-stigg-2-0-the-usage-runtime-for-ai-products
16. https://linkedin.com/in/sandhyahegde
17. https://www.producthunt.com/products/stigg/launches/stigg-2-0
18. https://allmind.ai/news/133ccf4a865d7412ddb15f82ec95a30bd25641c619c6a88c92c35887f4ada2da (news aggregator)
19. https://docs.stigg.io/documentation/governance/overview
20. https://www.prnewswire.com/il/news-releases/stigg-acquires-receivedai-to-bring-contract-management-and-invoicing-into-its-runtime-ai-usage-platform-302853878.html
21. https://www.stigg.io/blog-posts/software-monetization-platform
22. https://www.nmore.co/stigg and https://www.g2.com/sellers/studio-more
23. https://webflow.com/made-in-webflow/website/stigg-mt
24. https://en.wikipedia.org/wiki/BBL_Drizzy
25. https://fortune.com/2024/06/06/metro-boomin-bbl-drizzy-drake-kendrick-ai-beats-pay
26. https://www.nbcnews.com/pop-culture/planet-of-the-bass-kyle-gordon-tiktok-viral-europop-parody-song-rcna98265
27. https://thenightly.com.au/politics/brat-green-aka-hex-8ace00-you-cant-escape-this-colour-thanks-to-charlie-xcx-c-15494520
28. https://www.aol.com/entertainment/charli-xcx-viral-brat-album-141800917.html
29. https://www.theneedledrop.com/news/ai-generated-country-song-tops-billboard-chart/ and https://boomchampionstt.com/ai-song-tops-billboard-sales-chart/
30. https://www.aol.com/news/finally-good-news-humans-tilly-220505600.html
31. https://www.npr.org/2024/03/20/1238810380/comedy-tiktok-cubicle-comedian-black-creator-corporate-america
32. https://sfstandard.com/2025/12/05/viral-rapping-tech-ceo-interview/
33. https://autoae.online/blog/motion-graphics-trends-2026 and https://www.designmonks.co/blog/typography-trends-2026
34. https://vidmuse.ai/blog/how-to-make-ai-brainrot-video
35. https://mediaweek.com.au/twitter-introduces-autoplay-for-videos and https://www.androidcentral.com/twitter-auto-captions-videos
36. https://www.3playmedia.com/blog/verizon-media-and-publicis-media-find-viewers-want-captions/
37. https://ads.tiktok.com/business/en-US/blog/evolution-of-sound-volume-1
38. https://scienceblog.com/music-streaming-killed-instrumental-intro/ and https://www.malaymail.com/news/showbiz/2017/04/06/as-streaming-booms-songs-getting-faster/1350605
39. https://houseofmarketers.com/importance-of-tiktok-ad-hooks-first-3-seconds/
40. https://opus.pro/blog/ideal-youtube-shorts-length-format-retention
41. https://doaj.org/article/81ae4b0f49464cc59acb7565f5d65055
42. https://www.opus.pro/blog/tiktok-caption-subtitle-best-practices, https://captions.ai/help/guides/engagement/caption-styles-by-platform and https://www.elyrics.net/blog/best-lyric-video-maker-for-tiktok.html
43. https://clevercast.com/bbc-subtitling-guidelines
44. https://www.hopperhq.com/blog/instagram-reel-size/ and https://www.houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories
45. https://www.aicarousels.com/free-tools/tiktok-safe-zone-checker, https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide and https://www.poster.ly/tools/youtube-shorts-safe-zone-checker
46. https://medium.com/@klaived/ios-human-interface-guidelines-be9a56a3cfcb
47. https://support.spotify.com/sg-en/artists/article/canvas-guidelines/
48. https://later.com/social-media-glossary/loop/
49. https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html
50. https://designcompass.org/en/2024/10/18/robinhood-rebranding, https://portorocha.com/robinhood and https://www.logolounge.com/news/robinhood-goes-minimal
51. https://www.itsnicethat.com/features/dia-mitch-paone-meg-donohoe-graphic-design-animation-typography-180918
52. https://support.fairphone.com/hc/en-us/articles/23478616310034-Fairphone-s-brand-identity
53. https://www.webdesignhot.com/design.md/supabase/
54. https://usgraphics.com/products/berkeley-mono
55. https://techcrunch.com/2024/09/04/those-founder-mode-memes-keep-coming
56. https://petapixel.com/2024/12/10/billboards-around-san-francisco-urge-you-to-stop-hiring-humans/ and https://artisan.co/blog/stop-hiring-humans
57. https://tech.eu/2025/07/23/lovable-becomes-fastest-software-company-ever-to-reach-100m-arr/ and https://sacra.com/research/cursor-at-100m-arr/
58. https://piunikaweb.com/2026/03/10/cluely-ceo-roy-lee-fires-back-techcrunch-revenue-lie-rant/
59. https://learn.headliner.app/hc/en-us/articles/34164986965271-Social-Media-Video-Length-Limits-2025 and https://viberoll.questera.ai/learn/short-form-video-specs/
60. https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/
