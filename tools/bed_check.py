"""Check an instrumental-bed take: vocal leakage in the bed windows (demucs vocal rms), beat continuity at seams, overall bpm."""
import sys, subprocess, numpy as np, librosa, os
from beat_this.inference import File2Beats
take = sys.argv[1]; windows = [tuple(map(float, w.split(':'))) for w in sys.argv[2].split(',')]; seams = [float(x) for x in sys.argv[3].split(',')]
name = os.path.splitext(os.path.basename(take))[0]
if not os.path.exists(f'stems_explore/htdemucs/{name}/vocals.wav'):
    subprocess.run([sys.executable, '-m', 'demucs', '--two-stems=vocals', '-n', 'htdemucs', '-o', 'stems_explore', take], check=True, capture_output=True)
v, sr = librosa.load(f'stems_explore/htdemucs/{name}/vocals.wav', sr=16000, mono=True)
y, _ = librosa.load(take, sr=16000, mono=True)
for a, b in windows:
    seg = v[int(a*sr):int(b*sr)]; mix = y[int(a*sr):int(b*sr)]
    r = librosa.feature.rms(y=seg, hop_length=320)[0]; rm = librosa.feature.rms(y=mix, hop_length=320)[0]
    print(f'bed {a:6.2f}-{b:6.2f}: vocal rms p95 {np.percentile(r,95):.4f}  frac>0.02 {np.mean(r>0.02):.2f}   mix rms mean {rm.mean():.3f}')
beats, db = File2Beats(checkpoint_path='tools/models/beat_this-final0.ckpt', device='cpu', dbn=False)(take)
beats = np.array(beats)
for s in seams:
    near = beats[(beats > s - 3) & (beats < s + 3)]
    d = np.diff(near); print(f'seam {s:7.2f}: max dt {d.max():.2f} min dt {d.min():.2f}')
print('bpm %.2f, duration %.2f' % (60 / np.median(np.diff(beats)), len(y)/sr))
np.save(f'out/takes/{name}_beats.npy', beats); np.save(f'out/takes/{name}_downbeats.npy', np.array(db))
