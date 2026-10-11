# Colour track of the lilac can in party_wide (A1, intro S2). The pose tracker follows HIM only, and the can changes
# hands (clip 2.4-2.55 he hands it over; she holds it until ~3.2), so the "HOLD MY CELSIUS." stickers follow this.
# Output: assets/intro/can_track.json = [[t, u, v, px], ...] per clip frame (u, v in video UV; None when not found).
# Re-run if party_wide is regenerated:  .venv/bin/python -I assets/intro/make_can_track.py
import json
import numpy as np
from PIL import Image

out = []
for i in range(1, 145):
    im = np.asarray(Image.open(f"assets/video/party_wide/f_{i:05d}.jpg").convert("RGB")).astype(np.int16)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    # lilac: light purple (b > r > g), bright, not the blue backdrop (backdrop r ~ 33)
    m = (b > 170) & (r > 150) & (g > 130) & (b - g > 25) & (r - g > 5) & (b - r > 8) & (b - r < 70)
    ys, xs = np.nonzero(m)
    if len(xs) > 150:
        mx, my = np.median(xs), np.median(ys)
        k = (abs(xs - mx) < 90) & (abs(ys - my) < 160)
        xs, ys = xs[k], ys[k]
        out.append([round((i - 1) / 24, 4), round(float(xs.mean()) / 1920, 4), round(float(ys.mean()) / 1080, 4), int(len(xs))])
    else:
        out.append([round((i - 1) / 24, 4), None, None, int(len(xs))])
json.dump(out, open("assets/intro/can_track.json", "w"))
