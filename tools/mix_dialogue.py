"""Mix the voice-acted dialogue into the song's instrumental windows.

usage: .venv/bin/python tools/mix_dialogue.py <song.mp3> <out_prefix>
Writes <out_prefix>.wav (48 kHz stereo master) + <out_prefix>.mp3 + <out_prefix>_cues.json (every line's sung/spoken onset).
Each cue: (file, speech_onset_in_song, duck_db). The bridge Q&A is cut from two takes and quantised to the beat grid.
"""
import sys, json, numpy as np, librosa, soundfile as sf, scipy.signal as ss

song_path, out = sys.argv[1], sys.argv[2]
INTRO = sys.argv[3] if len(sys.argv) > 3 else 'N'   # which intro readings: L (first takes) or N (natural re-reads)
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

# INTRO: a party scene. Lines are timed backwards from the chant drop (~12.09) so "...You're a what?" lands right before it.
intro_keys = {'L': ['L01_her_tonight', 'L02_him_celsius', 'L03_him_cantdate', 'L04_her_whatt'],
              'N': ['N01_her_tonight', 'N02_him_celsius', 'N03_him_cantdate', 'N04_her_whatt']}[INTRO]
texts = ['Hey. What are you doing tonight?', 'Hold my Celsius.', "I can't go on a date. I'm an AI founder.", "...You're a what?"]
spk = ['HER', 'HIM', 'HIM', 'HER']; gaps = [0.77, 0.77, 1.10]   # pause before the next line
spans = [lines[f'assets/vo/{k}.mp3']['off'] - lines[f'assets/vo/{k}.mp3']['on'] for k in intro_keys]
onsets = [0.0] * 4; onsets[3] = 11.80 - spans[3]
for i in (2, 1, 0): onsets[i] = onsets[i + 1] - gaps[i] - spans[i]
for k, tx, sp, on in zip(intro_keys, texts, spk, onsets): place(k, tx, sp, on, -2)
ROOM_UNTIL = 12.2   # lines before this get the party-room treatment
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

# speech chain: high-pass, level to a fixed RMS, a room (early reflections + low-passed diffuse tail), mono to centre
b, a = ss.butter(2, 90 / (SR / 2), 'high')
lp_b, lp_a = ss.butter(2, 7500 / (SR / 2), 'low')
rng = np.random.default_rng(3)
def room_ir(length, decay, taps):
    n = int(length * SR); ir = rng.standard_normal(n) * np.exp(-np.linspace(0, decay, n))
    ir = ss.lfilter(*ss.butter(2, 5000 / (SR / 2), 'low'), ir); ir[:int(0.012 * SR)] = 0
    for d, g in taps: ir[int(d * SR)] += g * np.abs(ir).max() * 6
    return ir / (np.abs(ir).sum() / 2.5)
ir = room_ir(0.28, 9, [])
ir_party = room_ir(0.45, 7, [(0.007, 1.0), (0.013, 0.7), (0.019, 0.55), (0.027, 0.4)])
voice = np.zeros(N, np.float32); duck = np.zeros(N, np.float32)
for spk, text, y, onset, dk in cues:
    party = onset < 12.2
    y = ss.lfilter(b, a, y)
    if party: y = ss.lfilter(lp_b, lp_a, y)
    act = y[np.abs(y) > 0.02]
    y = y * ((0.075 if party else 0.105) / (np.sqrt(np.mean(act ** 2)) + 1e-9))
    rir = ir_party if party else ir
    wet = ss.fftconvolve(y, rir)[:len(y) + len(rir)]
    y = np.concatenate([y, np.zeros(len(wet) - len(y))]) + (0.22 if party else 0.13) * wet
    i0 = int(onset * SR); i1 = min(N, i0 + len(y)); voice[i0:i1] += y[:i1 - i0]
    # ducking envelope: dk dB under the line, 60 ms attack before, 300 ms release after
    a0, a1 = max(0, i0 - int(0.06 * SR)), min(N, i0 + len(y) - int(0.1 * SR) + int(0.30 * SR))
    duck[a0:a1] = np.minimum(duck[a0:a1], dk)
# smooth the duck envelope (no zipper), then apply
k = int(0.05 * SR); duck = np.convolve(duck, np.ones(k) / k, mode='same')
mix = music * (10 ** (duck / 20))[None, :] + voice[None, :]
# party ambience under the opening scene: in from 0, dips 5 dB under each line, fades out into the chant drop
amb, _ = librosa.load('assets/vo/amb_party.mp3', sr=SR, mono=False)
if amb.ndim == 1: amb = np.stack([amb, amb])
L = min(amb.shape[1], int(12.6 * SR)); amb = amb[:, :L] * (10 ** (-30 / 20) / (np.sqrt(np.mean(amb ** 2)) + 1e-9))
env = np.ones(L); fi = int(0.6 * SR); env[:fi] = np.linspace(0, 1, fi)
fo0, fo1 = int(11.9 * SR), int(12.5 * SR); env[fo0:fo1] = np.linspace(1, 0, fo1 - fo0); env[fo1:] = 0
dip = np.ones(L)
for spk, text, y, onset, dk in cues:
    if onset < 12.2:
        i0, i1 = int(onset * SR), min(L, int(onset * SR) + len(y)); dip[max(0, i0 - int(0.08 * SR)):i1] = 10 ** (-5 / 20)
dip = np.convolve(dip, np.ones(int(0.12 * SR)) / int(0.12 * SR), mode='same')
mix[:, :L] += amb * (env * dip)[None, :]
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
