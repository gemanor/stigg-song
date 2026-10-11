"""Transcribe given regions of a take and check beat continuity at seams.
usage: region_check.py <take.mp3> <a:b,a:b,...> <seam,seam,...>"""
import sys, numpy as np, librosa, subprocess, tempfile, os
from faster_whisper import WhisperModel
take, regs, seams = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(',')]
m = WhisperModel("large-v3", device="cpu", compute_type="int8")
for r in regs.split(','):
    a, b = map(float, r.split(':'))
    tmp = tempfile.mktemp(suffix='.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', take, '-ac', '1', '-ar', '16000', tmp], check=True)
    segs, _ = m.transcribe(tmp, language='en', word_timestamps=True, vad_filter=False, beam_size=5,
                           initial_prompt="Hold my Celsius. I'm an AI founder. Series B. Mac mini. post-AGI. Board meeting. Hold my matcha.")
    print(f'--- {a:.2f}-{b:.2f}')
    for s in segs:
        print(f'  {a + s.start:7.2f} {s.text.strip()}')
    os.remove(tmp)
from beat_this.inference import File2Beats
beats, db = File2Beats(checkpoint_path='tools/models/beat_this-final0.ckpt', device='cpu', dbn=False)(take)
beats = np.array(beats)
for s in seams:
    near = beats[(beats > s - 4) & (beats < s + 4)]
    print(f'seam {s:.2f}: beat dts', np.round(np.diff(near), 3))
print('overall bpm %.2f' % (60 / np.median(np.diff(beats))))
