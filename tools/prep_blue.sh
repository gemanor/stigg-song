#!/usr/bin/env bash
# Generated chroma-blue clip -> engine frames + keyed mattes + contact sheet.
# usage: bash tools/prep_blue.sh <clip> [<clip> ...]   (expects assets/clips/<clip>.mp4)
cd "$(dirname "$0")/.."
for n in "$@"; do
  f="assets/clips/$n.mp4"; [ -f "$f" ] || { echo "missing $f"; continue; }
  .venv/bin/python tools/prep_video.py "$f" "$n" --fps 24 --width 1920 > /dev/null 2>&1
  .venv/bin/python tools/key_blue.py "$n" --check | tail -1
  .venv/bin/python tools/track.py "$n" 2>&1 | grep -E "tracked" | tail -1
  mkdir -p out/clips; ffmpeg -v error -y -i "$f" -vf "fps=4,scale=320:-2,tile=6x4" -frames:v 1 "out/clips/sheet_$n.jpg"
  echo "$n: $(jq -r '"\(.n) frames, \(.dur) s"' "assets/video/$n/meta.json" 2>/dev/null || python3 -c "import json;m=json.load(open('assets/video/$n/meta.json'));print(m['n'],'frames',m['dur'],'s')")"
done
