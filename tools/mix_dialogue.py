"""Mix the voice-acted dialogue into the song's instrumental windows.

usage: .venv/bin/python tools/mix_dialogue.py <song.mp3> <out_prefix>
Writes <out_prefix>.wav (48 kHz stereo master) + <out_prefix>.mp3 + <out_prefix>_cues.json (every line's sung/spoken onset).
Each cue: (file, speech_onset_in_song, duck_db). The bridge Q&A is cut from two takes and quantised to the beat grid.
"""
import sys, json, numpy as np, librosa, soundfile as sf, scipy.signal as ss

song_path, out = sys.argv[1], sys.argv[2]
SR = 48000
song, _ = librosa.load(song_path, sr=SR, mono=False)
if song.ndim == 1: song = np.stack([song, song])
lines = json.load(open('assets/vo/lines.json'))
splits = json.load(open('assets/vo/bridge_splits.json'))
beats = np.load('out/takes/beds_s1201_beats.npy')

def load(f, a=None, b=None):
    y, _ = librosa.load(f, sr=SR, mono=True)
    if a is not None: y = y[int(a * SR):int(b * SR)]
    return y

cues = []  # (speaker, text, audio, onset_in_song, duck_db)
def place(key, text, speaker, onset, duck):
    info = lines[f'assets/vo/{key}.mp3']
    y = load(f'assets/vo/{key}.mp3')[int(max(0, info['on'] - 0.06) * SR):int((info['off'] + 0.12) * SR)]
    cues.append((speaker, text, y, onset - 0.06, duck))

# INTRO (muffled bed 0-12.0; the chant drop hits at ~12.09)
place('L01_her_tonight', 'Hey. What are you doing tonight?', 'HER', 0.90, -3)
place('L02_him_celsius', 'Hold my Celsius.', 'HIM', 3.90, -3)
place('L03_him_cantdate', "I can't go on a date. I'm an AI founder.", 'HIM', 6.00, -3)
place('L04_her_whatt', "...You're a what?", 'HER', 10.65, -3)
# SKIT 2 (lone-kick bed 59.73-71.73; verse 2 vocal at 72.27)
place('L05_her_whatdo', 'So what does your company actually do?', 'HER', 60.10, -8)
place('L06_him_agents', 'We build agents. For agents.', 'HIM', 63.40, -8)
place('L07_her_thoseagents', 'And what do those agents do?', 'HER', 66.10, -8)
place('L08_him_waitlist', "...They're on the waitlist.", 'HIM', 69.30, -8)

# BRIDGE Q&A: questions and answers from two takes, each landing on the next beat (half-time bed 104.0-121.0)
Q = ['Revenue?', 'Users?', 'Product?', 'Co-founder?', 'Salary?', 'Girlfriend?', 'Five years?', 'Oh my god.']
A = ['I annualized a Tuesday.', 'Waitlist.', 'Next model.', 'Mac mini.', 'Tokens.', 'Series B.', 'Post-AGI.']
def next_beat(t):
    return float(beats[beats >= t][0])
t = 104.50
for i in range(8):
    qa, qb = splits['q'][i]
    qy = load('assets/vo/L09_her_questions.mp3', max(0, qa - 0.04), qb + 0.08)
    qt = next_beat(t)
    cues.append(('HER', Q[i], qy, qt - 0.04, -6))
    t = qt + (qb - qa) + 0.10
    if i < 7:
        aa, ab = splits['a'][i]
        ay = load('assets/vo/L10_him_answers.mp3', max(0, aa - 0.04), ab + 0.08)
        at = next_beat(t)
        cues.append(('HIM', A[i], ay, at - 0.04, -6))
        t = at + (ab - aa) + 0.25

# OUTRO (bed 138.15-147.7 then a hard stop into silence)
place('L11_him_gottago', 'Anyway. Gotta go. See you after tokens.', 'HIM', 138.70, -8)
place('L12_her_holdmatcha', 'Cute. Hold my matcha.', 'HER', 142.60, -8)
info = lines['assets/vo/L13_her_seriesb.mp3']
place('L13_her_seriesb', "I'm an AI founder too. Series B.", 'HER', 147.70 - (info['off'] - info['on']), -8)  # 'Series B.' lands on the stop
place('L14_him_tonight', '...So what are you doing tonight?', 'HIM', 148.90, 0)
place('L15_her_boardmeeting', 'Board meeting.', 'HER', 151.75, 0)

end = max(c[3] + len(c[2]) / SR for c in cues) + 1.2
N = int(end * SR)
music = np.zeros((2, N), np.float32); music[:, :min(N, song.shape[1])] = song[:, :N]

# speech chain: high-pass, level to a fixed RMS, short room reverb (synthetic IR), mono to centre
b, a = ss.butter(2, 90 / (SR / 2), 'high')
rng = np.random.default_rng(3)
ir = rng.standard_normal(int(0.28 * SR)) * np.exp(-np.linspace(0, 9, int(0.28 * SR))); ir /= np.abs(ir).sum() / 2.5
voice = np.zeros(N, np.float32); duck = np.zeros(N, np.float32)
for spk, text, y, onset, dk in cues:
    y = ss.lfilter(b, a, y)
    act = y[np.abs(y) > 0.02]
    y = y * (0.105 / (np.sqrt(np.mean(act ** 2)) + 1e-9))
    wet = ss.fftconvolve(y, ir)[:len(y) + int(0.28 * SR)]
    y = np.concatenate([y, np.zeros(len(wet) - len(y))]) + 0.13 * wet
    i0 = int(onset * SR); i1 = min(N, i0 + len(y)); voice[i0:i1] += y[:i1 - i0]
    # ducking envelope: dk dB under the line, 60 ms attack before, 300 ms release after
    a0, a1 = max(0, i0 - int(0.06 * SR)), min(N, i0 + len(y) - int(0.1 * SR) + int(0.30 * SR))
    duck[a0:a1] = np.minimum(duck[a0:a1], dk)
# smooth the duck envelope (no zipper), then apply
k = int(0.05 * SR); duck = np.convolve(duck, np.ones(k) / k, mode='same')
mix = music * (10 ** (duck / 20))[None, :] + voice[None, :]
peak = np.abs(mix).max()
lim = 0.89  # about -1 dBFS
over = np.abs(mix) > lim
mix = np.where(over, np.sign(mix) * (lim + (1 - lim) * np.tanh((np.abs(mix) - lim) / (1 - lim))), mix)
mix = np.clip(mix, -0.98, 0.98)
sf.write(out + '.wav', mix.T, SR, subtype='PCM_24')
cue_out = [{'speaker': s, 'text': tx, 'start': round(o + 0.06, 3), 'end': round(o + len(y) / SR, 3)} for s, tx, y, o, d in cues]
json.dump({'duration': round(N / SR, 3), 'cues': cue_out}, open(out + '_cues.json', 'w'), indent=1)
print(f'wrote {out}.wav  {N / SR:.2f} s  input peak {peak:.3f}  lines {len(cues)}')
for c in cue_out: print(f"  {c['start']:7.2f}-{c['end']:7.2f} {c['speaker']}: {c['text']}")
