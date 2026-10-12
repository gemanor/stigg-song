"""Visual pace of a rendered clip: hard changes (cuts, full-frame slams, look switches) and how often they come.
A hard change = mean absolute difference between consecutive frames > 7.0 on a 192x108 grey version (8-frame debounce).
usage: python tools/pace_check.py <clip.mp4> [song_t0=0]   (song_t0 = song time of the clip's first frame, for section labels)"""
import sys, numpy as np, cv2

mp4 = sys.argv[1]; t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
cap = cv2.VideoCapture(mp4); fps = cap.get(cv2.CAP_PROP_FPS) or 60; prev = None; D = []
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(f, (192, 108), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
    D.append(0.0 if prev is None else float(np.abs(g - prev).mean())); prev = g
D = np.array(D); n = len(D); dur = n / fps
hard = []
for i in range(1, n):
    if D[i] > 7.0 and (not hard or i - hard[-1] >= 8): hard.append(i)
iv = np.diff([0] + hard + [n]) / fps
print(f"{mp4}: {dur:.2f} s, {len(hard)} hard changes, one every {dur / (len(hard) + 1):.2f} s on average, "
      f"median gap {np.median(iv):.2f} s, {100 * (iv < 0.48).mean():.0f}% of gaps shorter than one beat")
print('hard changes at song time:', ' '.join(f'{t0 + i / fps:.2f}' for i in hard))
