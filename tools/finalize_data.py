"""Project-specific data fixes after audio_analysis.py + lyrics_align.py + fix_lyrics.py.

usage: .venv/bin/python tools/finalize_data.py
- lyrics.json: every line gets `speaker` (HIM | HER | GANG | ALL), from the duet's casting.
- audio.json: the beat tracker invents beats in the silence after the music cut (143.996 → 148.366) and drifts on the
  end-card reprise. The reprise is a sample copy of the drop, so its beats/downbeats/onsets are the drop's, shifted.
  Also adds `events` (music_stop, chime, reprise_start, stab) from the mix's cue file.
"""
import json, numpy as np

A = json.load(open('engine/data/audio.json')); L = json.load(open('engine/data/lyrics.json'))
cues = json.load(open('audio/im_an_ai_founder_v5_cues.json')); ev = cues['events']
SHIFT = ev['reprise_start'] - (12.06 - cues['head_trim'])          # +139.94
DROP_A, DROP_B = 12.06 - cues['head_trim'], ev['stab'] - SHIFT      # the copied span in drop time (8.426 → 16.126)

# speakers
QUESTIONS = {'Revenue?', 'Users?', 'Product?', 'Co-founder?', 'Salary?', 'Girlfriend?', 'Five years?', 'Oh my god.'}
HER_LINES = {'Hey. What are you doing tonight?', '...You\'re a what?', 'So what does your company actually do?',
             'And what do those agents do?', 'So... who\'s paying for our date?', 'Cute. Hold my matcha.'}
for l in L['lines']:
    sec, tx = l['section'], l['text']
    if sec in ('pre1', 'verse2'): sp = 'HER'
    elif sec == 'endcard': sp = 'ALL'
    elif tx == 'Founder!': sp = 'GANG'
    elif sec == 'bridge': sp = 'HER' if tx in QUESTIONS else 'HIM'
    elif tx in HER_LINES: sp = 'HER'
    else: sp = 'HIM'
    l['speaker'] = sp
json.dump(L, open('engine/data/lyrics.json', 'w'), indent=1)
print('speakers:', {s: sum(1 for l in L['lines'] if l['speaker'] == s) for s in ('HIM', 'HER', 'GANG', 'ALL')})

# beat grid: silence has no beats; the reprise = the drop's grid shifted
def fix(key):
    arr = np.array(A[key])
    keep = arr[(arr < ev['music_stop'] - 0.02) | (arr > ev['stab'] + 0.3)]
    rep = arr[(arr >= DROP_A - 0.005) & (arr < DROP_B - 0.02)] + SHIFT
    extra = [ev['stab']] if key in ('beats', 'downbeats', 'kicks') else []
    out = np.sort(np.concatenate([keep, rep, extra]))
    A[key] = [round(float(x), 4) for x in out]
    return len(arr), len(out)
for k in ('beats', 'downbeats', 'kicks', 'snares', 'vocal_onsets'):
    print(k, '%d -> %d' % fix(k))
A['events'] = ev
json.dump(A, open('engine/data/audio.json', 'w'))
db = np.array(A['downbeats']); print('downbeats 140-158:', np.round(db[db > 140], 2).tolist())
