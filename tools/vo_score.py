"""Score voice auditions: words (whisper) + timbre similarity to the singer (MFCC mean, active frames).
usage: vo_score.py male|female file.wav ..."""
import sys, numpy as np, librosa
from faster_whisper import WhisperModel
REF = {'male': ('stems_explore/htdemucs/EL_full_s404/vocals.wav', 18, 33), 'female': ('stems_explore/htdemucs/EL_full_s404/vocals.wav', 67, 84)}
def prof(path, off=0, dur=None):
    y, sr = librosa.load(path, sr=16000, mono=True, offset=off, duration=dur)
    m = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)[1:]; r = librosa.feature.rms(y=y, hop_length=512)[0][:m.shape[1]]
    return m[:, r > np.percentile(r, 50)].mean(1)
cos = lambda a, b: float(np.dot(a, b) / np.linalg.norm(a) / np.linalg.norm(b))
who = sys.argv[1]; p, a, b = REF[who]; ref = prof(p, a, b - a)
other = prof(*REF['female' if who == 'male' else 'male'][0:1], *(REF['female' if who == 'male' else 'male'][1], REF['female' if who == 'male' else 'male'][2] - REF['female' if who == 'male' else 'male'][1]))
wm = WhisperModel("large-v3", device="cpu", compute_type="int8")
for f in sys.argv[2:]:
    segs, _ = wm.transcribe(f, language='en', beam_size=5)
    txt = ' '.join(s.text.strip() for s in segs)
    pr = prof(f)
    print(f'{f}: sim_to_{who}_singer {cos(pr, ref):.3f} (other singer {cos(pr, other):.3f}) dur {librosa.get_duration(path=f):.2f} | "{txt}"')
