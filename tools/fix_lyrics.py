"""Second-pass corrections for engine/data/lyrics.json (run after lyrics_align.py align).

usage: .venv/bin/python tools/fix_lyrics.py
1. Choruses: re-transcribe each chorus region on the vocal stem with a chorus-only prompt (the whole-song pass drifts on
   repeated chant lines) and sequence-match those word times onto the chorus lines.
2. The end-card chant is a sample copy of the drop (mix_dialogue.py END CARD), so its words copy the drop's times.
3. Silence snap: a word that starts while the vocal envelope is silent moves to where the voice actually rises
   (whisper stretches the first word after a pause back into the gap).
"""
import json, re, difflib, subprocess, tempfile, os, numpy as np

L = json.load(open('engine/data/lyrics.json')); A = json.load(open('engine/data/audio.json'))
cues = json.load(open('audio/im_an_ai_founder_v5_cues.json'))
voc = f"stems/htdemucs/{os.path.splitext(os.path.basename(A['master']))[0]}/vocals.wav"
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
lines = L['lines']

# 1. choruses
from faster_whisper import WhisperModel
m = WhisperModel('large-v3', device='cpu', compute_type='int8')
PROMPT = "I'm an AI founder! Founder! I can't come out tonight. See you after tokens! No dating till Series B."
for sec in ('chorus1', 'chorus2', 'chorus3'):
    ls = [l for l in lines if l['section'] == sec]
    a, b = ls[0]['s'] - 1.0, ls[-1]['e'] + 0.6
    tmp = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', voc, '-ac', '1', '-ar', '16000', tmp], check=True)
    segs, _ = m.transcribe(tmp, language='en', word_timestamps=True, beam_size=5, vad_filter=False,
                           condition_on_previous_text=False, initial_prompt=PROMPT)
    W = [{'w': w.word.strip(), 's': a + w.start, 'e': a + w.end} for s in segs for w in s.words]
    os.remove(tmp)
    C = [(l, w) for l in ls for w in l['words']]
    sm = difflib.SequenceMatcher(a=[norm(w['w']) for _, w in C], b=[norm(w['w']) for w in W], autojunk=False)
    hit = 0
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            _, w = C[blk.a + k]; x = W[blk.b + k]; w['s'], w['e'] = round(x['s'], 3), round(x['e'], 3); hit += 1
    print(f'{sec}: {hit}/{len(C)} words re-timed')

# 1b. dialogue: every voice-acted line is timed on its own clean take (assets/vo), then mapped into the master with the
#     placement the mixer recorded (file time file_t0 plays at master_t0, at the cue's tempo). The first word of each cue
#     starts exactly at the cue start (the measured speech onset).
DIALOGUE = ('intro', 'skit2', 'bridge', 'outro')
Wd = []
for c in cues['cues']:
    dur = (c['end'] - c['master_t0']) * c['tempo']
    tmp = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(c['file_t0']), '-t', str(dur), '-i', c['file'], '-ac', '1', '-ar', '16000', tmp], check=True)
    segs, _ = m.transcribe(tmp, language='en', word_timestamps=True, beam_size=5, vad_filter=False, condition_on_previous_text=False,
                           initial_prompt=c['text'])
    os.remove(tmp)
    ws = [w for sg in segs for w in sg.words]
    for k, w in enumerate(ws):
        Wd.append({'w': w.word.strip(), 's': round(c['start'] if k == 0 else c['master_t0'] + w.start / c['tempo'], 3),
                   'e': round(c['master_t0'] + w.end / c['tempo'], 3)})
C = [(l, w) for l in lines if l['section'] in DIALOGUE for w in l['words']]
sm = difflib.SequenceMatcher(a=[norm(w['w']) for _, w in C], b=[norm(x['w']) for x in Wd], autojunk=False)
done = set()
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        _, w = C[blk.a + k]; x = Wd[blk.b + k]; w['s'], w['e'] = x['s'], x['e']; done.add(blk.a + k)
for i, (l, w) in enumerate(C):   # unmatched (e.g. "waitlist" heard as "wait list"): keep inside its neighbours
    if i in done: continue
    prev = C[i - 1][1]['s'] if i and C[i - 1][0] is l else None
    if prev is not None and not (prev < w['s'] < prev + 1.0): w['s'] = round(prev + 0.15, 3)
print(f'dialogue: {len(done)}/{len(C)} words timed from the clean takes')

# the drop's first "I'm" sits on the visible vocal rise (the pass above lands it ~90 ms early)
drop0 = [l for l in lines if l['section'] == 'drop'][0]; drop0['words'][0]['s'] = 8.44

# 2. end card = drop shifted by the reprise offset
shift = cues['events']['reprise_start'] - (12.06 - cues['head_trim'])
for d, e in zip([l for l in lines if l['section'] == 'drop'], [l for l in lines if l['section'] == 'endcard']):
    e['words'] = [{'w': ew['w'], 's': round(dw['s'] + shift, 3), 'e': round(dw['e'] + shift, 3)} for dw, ew in zip(d['words'], e['words'])]

# 3. silence snap on the vocal envelope
env = np.array(A['env']['vocal']); fps = A['env_fps']
def snap(s):
    i = int(s * fps)
    if i >= len(env) or env[i:i + 6].max() > 0.05: return s   # only a truly silent start moves
    j = i
    while j < min(len(env), i + int(0.7 * fps)) and env[j] < 0.07: j += 1   # first rise of the voice, soft onsets included
    return round(j / fps - 0.02, 3) if j < i + int(0.7 * fps) else s
moved = 0
for l in lines:
    if l['section'] in ('endcard',) + DIALOGUE: continue   # copied from the drop / timed on clean takes: already exact
    for w in l['words']:
        s2 = snap(w['s'])
        if s2 != w['s']: moved += 1; w['s'] = s2; w['e'] = max(w['e'], s2 + 0.12)
print('silence-snapped words:', moved)

# the punchline: "tokens" lands on the music cut (the /t/ burst is 20 ms after it by construction in mix_dialogue.py)
for l in lines:
    if l['section'] == 'outro' and 'out of tokens' in l['text']:
        l['words'][-1]['s'] = round(cues['events']['music_stop'] + 0.024, 3)

# tidy: monotonic starts inside each line, ends never past the next start, line bounds
for l in lines:
    ws = l['words']
    for i in range(1, len(ws)): ws[i]['s'] = max(ws[i]['s'], ws[i - 1]['s'] + 0.03)
    for i in range(len(ws) - 1): ws[i]['e'] = round(min(max(ws[i]['e'], ws[i]['s'] + 0.1), ws[i + 1]['s']), 3)
    l['s'], l['e'] = ws[0]['s'], ws[-1]['e']
json.dump(L, open('engine/data/lyrics.json', 'w'), indent=1)
for l in lines:
    if l['section'] in ('chorus1', 'chorus2', 'chorus3', 'endcard'):
        print(f"{l['s']:7.2f}-{l['e']:7.2f} {l['section']:8s} " + ' '.join(f"{w['w']}@{w['s']:.2f}" for w in l['words']))
