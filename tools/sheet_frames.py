"""Tile style frames into one contact sheet. usage: python tools/sheet_frames.py out.jpg a.png b.png ... (2 per row)"""
import sys
from PIL import Image, ImageDraw
out, paths = sys.argv[1], sys.argv[2:]
W, H = 768, 432; cols = 2; rows = (len(paths) + cols - 1) // cols
s = Image.new('RGB', (W * cols, H * rows), 'white'); d = ImageDraw.Draw(s)
for i, p in enumerate(paths):
    im = Image.open(p).convert('RGB').resize((W, H)); x, y = (i % cols) * W, (i // cols) * H
    s.paste(im, (x, y)); d.rectangle([x, y, x + 300, y + 22], fill='black'); d.text((x + 6, y + 5), p.split('/')[-1], fill='white')
s.save(out, quality=88)
