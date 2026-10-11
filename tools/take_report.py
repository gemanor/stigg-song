"""Objective report on a generated song take (we can't listen, so we measure).

usage: .venv/bin/python tools/take_report.py <take.mp3> <stem_dir> <out_prefix>
  stem_dir: demucs output folder holding vocals.wav (htdemucs --two-stems=vocals)

Writes <out_prefix>.json and <out_prefix>.png:
  - faster-whisper large-v3 word timestamps on the vocal stem
  - lyric accuracy: fraction of expected key phrases found, and a rough word recall vs analysis/lyrics_v3.txt
  - vocal register per second (median pYIN f0 of voiced frames: < 165 Hz reads male, > 190 Hz reads female)
  - tempo from librosa beat tracking on the full mix
"""
import json, re, sys, difflib
import numpy as np, librosa
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from faster_whisper import WhisperModel

take, stem_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
voc_path = f"{stem_dir}/vocals.wav"

KEY = ["hold my celsius", "i'm an ai founder", "you're a what", "token budget", "mac mini", "cold plunge",
       "record high", "shortage in japan", "made of air", "anywhere", "can't come out tonight", "see you after tokens",
       "series b", "pre-seed", "agents for agents", "waitlist", "in stealth", "cron job", "roommates", "sequoia",
       "film crew", "insane", "building", "merch", "annualized a tuesday", "next model", "post-agi", "oh my god",
       "hold my matcha", "board meeting"]
norm = lambda s: re.sub(r"[^a-z0-9' ]+", " ", s.lower().replace("a.i.", "ai").replace("ay-eye", "ai").replace("a i ", "ai ")).split()

y, sr = librosa.load(take, sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
tempo = float(np.atleast_1d(tempo)[0])

model = WhisperModel("large-v3", device="cpu", compute_type="int8")
segs, info = model.transcribe(voc_path, language="en", word_timestamps=True, vad_filter=False, beam_size=5,
                              initial_prompt="I'm an AI founder. See you after tokens. Hold my Celsius. Mac mini. Series B. pre-seed. Sequoia. Zyn. matcha. cron job.")
words = []
for s in segs:
    for w in s.words or []:
        words.append({"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2), "p": round(w.probability, 2)})
text = " ".join(w["w"] for w in words)
tnorm = " ".join(norm(text))
key_hits = {k: (" ".join(norm(k)) in tnorm) for k in KEY}

exp = norm(open("analysis/lyrics_v3.txt").read())
got = norm(text)
sm = difflib.SequenceMatcher(a=exp, b=got, autojunk=False)
matched = sum(b.size for b in sm.get_matching_blocks())
recall = matched / max(1, len(exp))

# vocal register per 1 s window
v, vsr = librosa.load(voc_path, sr=16000, mono=True)
f0, vflag, vprob = librosa.pyin(v, fmin=70, fmax=500, sr=vsr, frame_length=1024, hop_length=320)
t_f0 = librosa.times_like(f0, sr=vsr, hop_length=320)
reg = []
for sec in range(int(len(v) / vsr)):
    m = (t_f0 >= sec) & (t_f0 < sec + 1) & vflag
    reg.append(float(np.nanmedian(f0[m])) if m.sum() > 8 else None)
rms = librosa.feature.rms(y=v, frame_length=2048, hop_length=320)[0]

rep = {"take": take, "duration": round(len(y) / sr, 2), "tempo": round(tempo, 1), "lyric_word_recall": round(recall, 3),
       "key_phrases_found": sum(key_hits.values()), "key_phrases_total": len(KEY), "missing": [k for k, h in key_hits.items() if not h],
       "register_hz_per_s": reg, "transcript": text, "words": words}
json.dump(rep, open(out + ".json", "w"), indent=1)

fig, ax = plt.subplots(3, 1, figsize=(26, 9), sharex=True, gridspec_kw={"height_ratios": [2, 1.2, 1]})
S = librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=2048, hop_length=512)), ref=np.max)
librosa.display.specshow(S, sr=sr, hop_length=512, x_axis="time", y_axis="log", ax=ax[0], cmap="magma")
ax[0].set_title(f"{take}  tempo {tempo:.1f}  recall {recall:.2f}  keys {sum(key_hits.values())}/{len(KEY)}")
ax[1].scatter(t_f0[vflag], f0[vflag], s=1, c=np.where(f0[vflag] < 175, "#3b82f6", "#ef4444"))
ax[1].axhline(175, color="k", lw=0.5); ax[1].set_ylabel("f0 Hz (blue=low/male, red=high/female)"); ax[1].set_ylim(60, 500)
ax[2].plot(librosa.times_like(rms, sr=vsr, hop_length=320), rms, lw=0.6); ax[2].set_ylabel("vocal rms")
for w in words[::3]:
    ax[2].text(w["s"], rms.max() * 0.9, w["w"], fontsize=6, rotation=90, va="top")
for a in ax: a.set_xticks(np.arange(0, len(y) / sr, 5))
plt.tight_layout(); plt.savefig(out + ".png", dpi=70)
print(json.dumps({k: rep[k] for k in ["take", "duration", "tempo", "lyric_word_recall", "key_phrases_found", "key_phrases_total", "missing"]}))
