"""Cut a cartoon character out of a flat chroma-blue cyc: soft matte + edge-only despill.

usage: .venv/bin/python tools/key_blue.py <clip> [--check]
Run after tools/prep_video.py has written assets/video/<clip>/f_#####.jpg + meta.json.
Writes m_#####.png (white = subject), sets meta.mask = true and meta.key (the measured backdrop colour).

- The backdrop colour is measured per clip from the frame borders (video models drift it slightly), then every pixel's
  distance to it in the CbCr plane gives the matte, with a luma guard so dark ink lines and black clothes never key out.
- Edge-only despill: where the matte is partial (anti-aliased outlines, motion blur) the blue cast is pulled to
  max(r, g). Fully opaque pixels are never touched, so blue details inside the character (a badge stripe) survive.
- A 1-px erode + 0.6-px blur keeps the edge clean on any backdrop.
--check writes out/key_<clip>.jpg: 4 frames composited over black, Stigg green, off-white and coral.
"""
import sys, glob, json, numpy as np, cv2

clip = sys.argv[1]; check = '--check' in sys.argv
d = f'assets/video/{clip}'
meta = json.load(open(f'{d}/meta.json'))
frames = sorted(glob.glob(f'{d}/f_*.jpg'))

def ycc(img):
    f = img.astype(np.float32) / 255
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    y = 0.299 * r + 0.587 * g + 0.114 * b
    return y, (b - y) * 0.564, (r - y) * 0.713

# backdrop colour: median of a 12-px border on a few frames
samp = []
for p in frames[::max(1, len(frames) // 8)]:
    im = cv2.imread(p); bd = np.concatenate([im[:12].reshape(-1, 3), im[-12:].reshape(-1, 3), im[:, :12].reshape(-1, 3), im[:, -12:].reshape(-1, 3)])
    samp.append(bd)
key_bgr = np.median(np.concatenate(samp), axis=0)
ky, kcb, kcr = [float(np.asarray(v).ravel()[0]) for v in ycc(key_bgr[None, None, :].astype(np.uint8))]
print(f'{clip}: backdrop BGR {key_bgr.round().tolist()}  (Y {ky:.3f} Cb {kcb:.3f} Cr {kcr:.3f})')

LO, HI = 0.07, 0.16   # CbCr distance: <= LO is backdrop, >= HI is subject
k_er = np.ones((3, 3), np.uint8)
for i, p in enumerate(frames, 1):
    im = cv2.imread(p)
    y, cb, cr = ycc(im)
    dist = np.sqrt((cb - kcb) ** 2 + (cr - kcr) ** 2)
    a = np.clip((dist - LO) / (HI - LO), 0, 1)
    a = np.maximum(a, np.clip((0.22 - y) / 0.1, 0, 1) * (dist > 0.03))   # luma guard: dark ink and black cloth stay opaque
    a = cv2.erode(a, k_er, iterations=1)
    a = cv2.GaussianBlur(a, (0, 0), 0.6)
    edge = (a > 0.001) & (a < 0.98)
    if edge.any():
        f = im.astype(np.float32)
        lim = np.maximum(f[..., 1], f[..., 2])          # despill: blue never exceeds max(green, red) on the edge
        f[..., 0] = np.where(edge, np.minimum(f[..., 0], lim), f[..., 0])
        cv2.imwrite(p, f.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
    cv2.imwrite(f'{d}/m_{i:05d}.png', (a * 255).astype(np.uint8))
meta['mask'] = True; meta['key'] = [int(v) for v in key_bgr[::-1]]
json.dump(meta, open(f'{d}/meta.json', 'w'), indent=1)
print(f'{clip}: {len(frames)} mattes written')

if check:
    picks = [frames[int(len(frames) * q)] for q in (0.05, 0.35, 0.65, 0.95)]
    bgs = [(0, 0, 0), (89, 231, 146), (245, 248, 249), (109, 119, 255)]   # BGR: black, #92E759, #F9F8F5, #FF776D
    rows = []
    for p in picks:
        im = cv2.imread(p).astype(np.float32); m = cv2.imread(p.replace('/f_', '/m_').replace('.jpg', '.png'), 0).astype(np.float32)[..., None] / 255
        x0, x1 = 0, im.shape[1]
        cols = [(im * m + np.array(bg, np.float32) * (1 - m))[:, x0:x1] for bg in bgs]
        rows.append(np.concatenate([cv2.resize(c, (480, 270)) for c in cols], axis=1))
    cv2.imwrite(f'out/key_{clip}.jpg', np.concatenate(rows, axis=0).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f'wrote out/key_{clip}.jpg')
