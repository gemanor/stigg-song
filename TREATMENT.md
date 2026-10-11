# TREATMENT: "I'M AN AI FOUNDER"

## Song facts

- Master: `audio/im_an_ai_founder_v5.wav`, 157.99 s at 48 kHz. Intro C, the new ending, and the end-card chant reprise.
- **Measured tempo: 125.0 BPM.** 1 beat = 0.48 s (28.8 frames at 60 fps). 1 bar = 1.90 s. Use `beats`/`downbeats` from `engine/data/audio.json`, never a computed grid. The tracker invents beats in the silence: none exist between 144.00 and 148.37.
- Genre: electroclash × hyperpop duet. HIM is deadpan talk-sing; HER is a sharp rap. Gang "FOUNDER!" chants.
- Words: `engine/data/lyrics.json` (98 lines, 395 words). Dialogue words are timed from the clean voice takes. The punchline "tokens." sits at **144.020** on the music cut (143.996).
- Key events: `audio/im_an_ai_founder_v5_cues.json → events`:
  - music_stop 143.996
  - chime 147.816
  - reprise_start 148.366
  - stab 156.066

## Energy map and arc

The party is muffled (low), then the DROP (high). Verse 1 is medium: smug, the deck. The pre-chorus is HER (rising). Chorus 1 is high. Skit 2 is low (a lone kick). Verse 2 is HER (medium-high, fast). Chorus 2 is high. The bridge is half-time (medium; a punchline every beat). The final chorus is highest. The outro is low, then **silence**. The end card is high again: she paid, and the music came back.

**Arc:** he thinks he's the main character. She keeps correcting the record. His tokens burn down the whole time. He runs out at the exact moment the song does. She pays, and the music comes back on her dime. MAKE EVERY TOKEN COUNT.

## The hook (first 3 s, muted autoplay)

**Frame 0 is a finished poster.** HIM, cut out on the After Tokens dark ground, holding his lilac can and staring at his phone. Behind him (via the matte) is a giant **I'M AN AI FOUNDER** in white heavy grotesk. Top-left, the TOKEN METER reads 1,000,000 in pixel-grid green.

- 0.70: her coral line "Hey. What are you doing tonight?" types on as a chat-bubble-sized serif line.
- 2.42: "HOLD MY CELSIUS." is tracked to the can he holds out.
- Muted viewers get the whole premise in under a second: an SF AI founder, a token budget, a date.

## Sections (scene ids, times on downbeats or just before a pickup)

| id | time | lyrics | look | must-haves |
|---|---|---|---|---|
| `intro` | 0.00-8.40 | Skit 1: "Hey. What are you doing tonight?" / "Hold my Celsius." / "I can't go on a date." / "I'm an AI founder." / "...You're a what?" | A | The hook poster at frame 0. Party is implied, not shown: slow out-of-focus bokeh dots in green/white, the party's hum. HOLD MY CELSIUS tracked to the can. "I'M AN AI FOUNDER" in his hype type; "...You're a what?" in coral serif with a huge "?" |
| `drop` | 8.40-17.40 | "I'm an AI founder!" (8.44) · "Founder!" (11.54) · "I'm an AI founder!" (12.10); instrumental 13.6-17.4 | C ↔ A | Per-syllable slams on the beat (I'M / AN / AI / FOUN / DER). FOUNDER! as a stadium wall of repeated words. The meter's first big burn (each chant costs 10k). Instrumental bars: a fighting-game **VS card**, "THE FOUNDER (pre-seed · runway: 3 weeks · sleep: no)" vs "THE DATE (iced matcha · patience: low)" |
| `verse1` | 17.40-32.80 | His 16 half-lines (salary/token budget → no plan) | B | His pitch deck, one slide per line, builds on beats: COMPENSATION (SALARY $0 struck → TOKEN BUDGET); BURN (−250,000 roll on the meter at "quarter-million"); TEAM (his circle headshot + a Mac mini as CO-FOUNDER/CTO, uptime 100% vs sleep 0h → "MAC MINI = ME"); the cold plunge (the VC clip, frost on the type, TERM SHEET signed); the wire ("WIRE RECEIVED" with shivering digits); MATCHA ▲ ticker (verified: Uji first-harvest tencha ¥17,250/kg, July 2026, highest since 1996); VALUATION ▲ chart; "PLAN: null" / "plan.md: 404" |
| `pre1` | 32.80-42.55 | HER: "So your co-founder's a computer, / and your money's made of air, / and you'd rather freeze a VC / than take me anywhere?" (+ held "anywhere" into the chorus) | B → red pen | She walks into his deck and red-pens it: circles "MAC MINI" → "a computer"; strikes "$3M" → "air"; the frozen VC gets a coral "→ freezer"; then "anywhere?" fills the frame in coral serif. The held note (39.8-42.5) builds: the deck slides tear away to green |
| `chorus1` | 42.55-56.12 | I'm an AI founder! / Founder! / I can't come out tonight. / See you after tokens! / I'm an AI founder! / Founder! / No dating till Series B. / See you after tokens! | A ↔ C every line | A cut or designed event every beat. **SEE YOU AFTER TOKENS** in the After Tokens banner style every time. Her written coral comebacks: "of course you can't" and "babe, you're pre-seed" (not sung: notes only) |
| `skit2` | 56.12-68.02 | "So what does your company actually do?" / "We build agents. For agents." / "And what do those agents do?" / "...They're on the waitlist." | E | The date table. A node graph builds live: AGENT → AGENT → AGENT, recursion zooming in forever. On "waitlist" every node flips to WAITLISTED (grey pills) and a waitlist odometer rolls. The meter keeps burning with nothing shipped |
| `verse2` | 68.02-86.96 | HER's dictionary rap (17 half-lines) through "...the merch is in demand." + the instrumental bar | D | The FOUNDER → ENGLISH dictionary: each "When he says X" is his phrase in green hype type, struck through in coral, with the translation set in Instrument Serif. Headwords with mono phonetics (stealth /stɛlθ/ n. nothing there). "Eighty grand on a film crew for a button on a page": a launch-video frame with ONE button and "0 clicks". "Every comment says 'insane'": a wall of reply cards that all say insane. "Zyn in his lip…": an anatomy/teardown diagram of HIM with tracked callouts (ZYN · CAP: "building" · HOODIE: brand, no product · MERCH: in demand) |
| `chorus2` | 86.96-100.38 | Same 8 lines as chorus 1 | A ↔ C | Escalate over chorus 1: different hero treatments per line (never repeat chorus 1's), HER now mocking him in the footage, the meter visibly lower |
| `bridge` | 100.38-118.85 | Q&A: Revenue? / I annualized a Tuesday. / Users? / Waitlist. / Product? / Next model. / Co-founder? / Mac mini. / Salary? / Tokens. / Girlfriend? / Series B. / Five years? / Post-AGI. / Oh my god. | E | A due-diligence form (terminal): each question is a field label, each answer types into its field on the beat; she asks (coral), he answers (green). "I annualized a Tuesday": one Tuesday × 52 = ARR. On "Oh my god": a giant coral **DECLINED** stamp and her facepalm clip. Half-time feel: punches on the half-time snare |
| `chorus3` | 118.85-134.50 | Final chorus with doubled "See you after tokens!" lines | all looks, fastest | The biggest chorus: duo dance, a look change every line, half-beat stutters in the last 2 bars. The meter drops below 10% and LOW BALANCE blinks (every other beat) |
| `outro` | 134.50-147.80 | "Anyway. Gotta go." / "See you after tokens." / "So... who's paying for our date?" / "...Sorry. I'm out of tokens." / [music stops 143.996] / "Cute. Hold my matcha." | A → black | The table again. The bill folder slides in. The meter drains fast through "Sorry. I'm out of" and hits **0 on the cut**. **144.00: hard cut to pure black** with `0 TOKENS · USAGE BLOCKED` in pixel-grid coral. Silence. 145.47: "Cute. Hold my matcha.": she hands him her matcha and taps her coral phone to pay |
| `endcard` | 147.80-158.00 | Chime 147.82 → the chant comes back: "I'm an AI founder!" (148.38) · "Founder!" (151.48) · "I'm an AI founder!" (152.04) → stab 156.07 → hold | A | 147.82: TOP-UP APPROVED · +1,000,000, the meter refills, and the music comes back on HER dime. She chants (it's hers now), he holds the matcha. Then **MAKE EVERY TOKEN COUNT.** with TOKEN in pixel-grid green. Stab at 156.07: the Stigg logo (official file and gradient) + "The usage runtime for AI products". Hold to the end. Variant b adds "AFTER TOKENS · NOV 10 · SAN FRANCISCO" |

## Footage map

All clips: Gemini Omni 1.1 Flash image-to-video from a GPT Image 2.5 style frame, 1080p, 24 fps, flat chroma blue, keyed with `tools/key_blue.py`. Draw them with `matte:true` over your designed ground. "Slot" is a suggestion; any clip can be reused, cropped, mirrored or speed-ramped, but tell the lead.

| clip | content (clip seconds) | for |
|---|---|---|
| `him_chant` | full body, right third. 0-1.4: one fist up, shouting. 1.4-5: two-fist deadpan pumps with knee bounces (a pump about every 0.9 s). 5-6: he lifts the lilac can | drop, choruses |
| (more as they land; the lead fills this table in) | | |

## Defaults chosen without the director (flag at delivery)

- Her chorus comebacks are written, not sung (they aren't in the take).
- End card: a 4-bar reprise of the opening chant after she pays (variant without it: `mix_dialogue.py … noreprise`).
- End-card variant b with the After Tokens event line.
