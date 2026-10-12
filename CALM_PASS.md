# CALM PASS: re-time for readability

Viewer note on the finished cut: "There are many things to enjoy, but no time to see or understand them." The director agrees. The reference for good pace is the "LGTM" video.

The measured problem in the current master:
- 255 hard visual changes (cuts, full-frame slams, look switches) in 2:38, one every 0.62 s.
- 54% of them land less than one beat (0.48 s) after the previous one.
- Choruses: one every 0.31–0.39 s. Verse 1: 0.64 s. Bridge: 0.92 s.
- Skit 2 (1.5 s) and the outro (1.7 s) read well. That is the target feel.

This pass changes **pace, not ideas**. Same looks, same clips, same story beats, no new generations. You make fewer, longer shots and cut the weakest jokes, so the strong ones get time.

## The rules (they override AGENTS_BRIEF.md where they conflict)

1. **Shot length.** A *shot* is one composition: a slide, a layout or a framing. A cut, look switch or full-frame slam starts a new shot.
   - **Choruses:** one shot per sung line, about 1.9 s. Cut only at line starts, never inside a line. Words still pop on their onsets inside the shot.
   - **Verses, pre-chorus, skits and bridge:** one shot per two sung lines, about 3.8 s. The shot *builds* on the onsets: elements add, nothing replaces.
   - **Intro, outro and end card:** they already read well. Change them only to follow rules 3–5.
2. **Read time.** Once a joke string is complete (a label, number, callout, red-pen note or dictionary line), it stays on screen at least **2.0 s**. One- or two-word strings need at least 1.2 s. If a joke can't get that time, cut it.
3. **Cut the weakest third.** Keep the jokes that carry the story: the token burns, her corrections, the punchlines. Drop decoration jokes and secondary callouts. Report what you cut.
4. **One focal point.** At most two text elements compete at once: the sung words (the hero type or the HUD subtitle) plus one joke. Hide the HUD subtitle when your hero type shows the same words.
5. **Motion.**
   - No camera punches, shakes or flash pops on kicks. The engine already zeroes `E.post.punch` and `shake` (`TL.CALM`). Remove your own 2D canvas punches and zoom pops too.
   - A slow push is optional.
   - Graphics may hold completely still for up to about 2.5 s while footage keeps playing. Only a frozen *footage* frame is a defect now. A still graphic is fine.
6. **Sync stays exact.** Words land on onsets, and new shots start on line starts or downbeats.
7. **HUD.** The persistent HUD is now the token meter only; the top-right cluster, crosshairs, clock and burn line are gone (`HUD.chrome = false`). Your `E.hud.*` switches still work.

## Deliver

- A 30 fps, half-scale preview of your section with audio.
- A contact sheet at 0.5 s steps.
- Hard-change counts, before and after, measured the same way the lead does: mean absolute frame difference over 7.0 on a 192×108 grey version.
- A list of what you cut and what you held longer.
