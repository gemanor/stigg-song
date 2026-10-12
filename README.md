# I'M AN AI FOUNDER

A 2:38 satirical music video: an electroclash × hyperpop duet about a San Francisco AI founder who can't go on a date. She keeps correcting the record. Every word he sings burns tokens on an on-screen usage meter. The meter hits 0 on the frame the music stops. She pays, and the music comes back on her dime. End line: **MAKE EVERY TOKEN COUNT.** The Stigg logo appears only on the last stab (2:36.07).

## Deliverables

| File | What it is |
|---|---|
| `out/final/master_landscape.mp4` | 16:9 master, end card a. 1920×1080, 60 fps, H.264 CRF 17, AAC 320k. Upload-ready for YouTube, X and LinkedIn. |
| `out/final/master_landscape_b.mp4` | 16:9 master, end card b: adds AFTER TOKENS · NOV 10 / SAN FRANCISCO under the logo. |
| `out/final/master_portrait.mp4`, `master_portrait_b.mp4` | 9:16 cut (1080×1920, 60 fps) for Shorts, Reels and TikTok, end cards a and b. |
| `deliver/im_an_ai_founder_16x9.mp4` (92.6 MB), `deliver/im_an_ai_founder_9x16.mp4` (85.9 MB) | Sharing copies at full 1080p60, under GitHub's 100 MB limit, committed to this repo. |
| `deliver/teaser_16x9.mp4` (29.6 MB), `deliver/teaser_9x16.mp4` (24.8 MB) | 35.8 s teasers: the hook and drop (0:00–0:16), then the check and the payoff (2:18 to the end). Both cuts sit on downbeats. |

| `deliver/shorts/short1_im_an_ai_founder.mp4` (42.8 s), `short2_agents_for_agents.mp4` (34.7 s), `short3_out_of_tokens.mp4` (41.9 s) | Vertical shorts (1080×1920, 60 fps) for teasing. 1: the hook and drop, then her red-pen pre-chorus and chorus 1. 2: the agents skit and her Founder → English verse. 3: the due-diligence Q&A, then the check, "out of tokens", her paying and the end card. Shorts 1-2 end on the teaser slate (`--variant t`). Rebuild with `.venv/bin/python tools/shorts.py`. |

Making-of page (film, token-meter chart, stills, lyrics with what every line cost, credits): https://claude.ai/artifact/EEo1dsGZjdSgagSNHtuqqE

`out/` is not tracked by git: the full-quality masters are about 165 MB each, over GitHub's 100 MB file limit. Rebuild them with the commands below.

Posting notes:
- X caps standard accounts at 2:20. The full film needs a Premium account; otherwise post a teaser.
- YouTube Shorts takes vertical videos up to 3 minutes, so the 9:16 cut fits.

## Re-render

```bash
npm install && npx playwright install chromium                          # once: the renderer (headless Chromium)
python3.11 -m venv .venv && .venv/bin/pip install -r requirements.txt   # once: the Python tools (ffmpeg must be on PATH)
bash tools/render_final.sh landscape        # all segments + both end cards -> out/final/master_landscape{,_b}.mp4
bash tools/render_final.sh portrait
bash tools/render_final.sh landscape s3     # re-render one segment (s1 s2 s3 s4 s5a s5b), then:
bash tools/render_final.sh landscape mux    # splice the segments again
bash tools/teaser.sh out/final/master_landscape.mp4 deliver/teaser_16x9.mp4
bash tools/deliver.sh out/final/master_landscape.mp4 deliver/im_an_ai_founder_16x9.mp4
```

- **Rendering:** every frame is a pure function of song time, so segments and workers can render in any order and splice exactly. On a 4-core Linux box with software WebGL, one canvas takes about 65 minutes.
- **Previews and stills:**
  - `node tools/render.mjs --from 42.55 --to 56.12 --fps 30 --scale 0.5 --out out/preview.mp4`
  - `node tools/still.mjs --t 20.45,55.9 --canvas portrait`
- **Media not in git:** the generated footage (`assets/clips/*.mp4`) and its keyed frame sequences (`assets/video/`).
  - The clips are assets in the Scenario project. Their asset IDs are listed in `analysis/footage.md`; download them with `tools/fetch.sh`.
  - Rebuild the keyed frames with `bash tools/prep_blue.sh <clip>`.
  - The song master `audio/im_an_ai_founder_v5.wav` is tracked.

## How it is built

- **Song:** ElevenLabs Music v2.5 on Scenario, voice-acted skits (ElevenLabs v4 Turbo) mixed in with `tools/mix_dialogue.py`. 125 BPM, 157.99 s.
- **Timing data:**
  - `engine/data/audio.json`: beats, downbeats, kicks, snares and song events.
  - `engine/data/lyrics.json`: 98 lines and 395 words, with per-word onsets and the speaker (HIM, HER, GANG, ALL).
- **Characters and footage:** GPT Image 2.5 style frames on flat chroma blue. Animated with Gemini Omni 1.1 Flash, keyed with `tools/key_blue.py`, pose-tracked with `tools/track.py`. Lip-sync by MiniMax H3 Max Lip Sync.
- **Engine:** `engine/` (three.js and Canvas2D). `timeline.js` maps the 12 sections to `scenes/*.js`, and `brand.js` holds the shared kit:
  - the palette;
  - the token meter (`tokensAt`): the film's spine;
  - the After Tokens pixel type;
  - her red pen;
  - the SEE YOU AFTER TOKENS lockup.

  `scenes/hud.js` draws the persistent meter and the subtitles.
- **Docs:** `PLAN.md` (one-page pitch), `TREATMENT.md` (section-by-section brief), `STYLE.md` (looks and type), `ENGINE_API.md`, `analysis/footage.md` (every clip, with usable ranges), `analysis/jobs.md` (every Scenario job and its cost).

Scenario usage for this film: 5,604 CU. That's 1,533 for the song and characters plus 4,071 for footage and lip-sync. The project's October total is 5,746.75 CU, including 142.75 CU of earlier tests.
