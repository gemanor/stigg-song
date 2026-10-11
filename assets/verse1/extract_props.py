# Cut the props out of HIM's sheet: flood-fill the paper background from the crop border (and large enclosed
# paper-coloured holes, e.g. inside the leash loop), soft edges, un-premultiplied colour. Output: assets/verse1/*.png
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage
src, outdir = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
bg = np.array([248, 247, 244], np.float32)
CROPS = {  # name: (x0, y0, x1, y1) in sheet px
    'can': (86, 896, 210, 1135),
    'macmini_leash': (378, 958, 941, 1119),
    'macmini': (378, 958, 661, 1119),
    'tin': (980, 943, 1232, 1127),
}
for name, (x0, y0, x1, y1) in CROPS.items():
    c = im[y0:y1, x0:x1]
    diff = np.abs(c - bg).max(axis=2)
    bgish = diff <= 22
    lab, n = ndimage.label(bgish)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    # enclosed holes: very close to paper and large
    tight = diff <= 5
    lab2, n2 = ndimage.label(tight)
    sizes = ndimage.sum(np.ones_like(diff), lab2, range(1, n2 + 1))
    holes = [i + 1 for i, s in enumerate(sizes) if s > 600]
    B = np.isin(lab, list(border))
    H = np.isin(lab2, holes)
    # grow the holes into their soft edge (pixels with diff<=22 adjacent to the hole)
    Hg = ndimage.binary_dilation(H, iterations=2) & bgish
    B = B | Hg
    a = np.ones(diff.shape, np.float32)
    a[B] = np.clip((diff[B] - 5) / 17, 0, 1)
    a3 = a[..., None]
    rgb = np.where(a3 > 0.02, (c - (1 - a3) * bg) / np.maximum(a3, 0.02), 0)
    rgb = np.clip(rgb, 0, 255)
    out = np.concatenate([rgb, a3 * 255], axis=2).astype(np.uint8)
    ys, xs = np.where(out[..., 3] > 8)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(out, 'RGBA').save(os.path.join(outdir, f'{name}.png'))
    print(name, out.shape)
