#!/usr/bin/env bash
# Final masters, rendered in section-aligned segments so any one segment can be re-rendered and re-spliced.
# usage: bash tools/render_final.sh <landscape|portrait> [segment ...]     (no segments = all; segments: s1 s2 s3 s4 s5a s5b)
#   out/final/<canvas>/seg_<id>.mp4   video-only segments (1080p60, CRF 17)
#   out/final/master_<canvas>.mp4     segments s1-s4 + s5a + the master audio
#   out/final/master_<canvas>_b.mp4   same with the variant-b end card (s5b: AFTER TOKENS · NOV 10 / SAN FRANCISCO)
set -euo pipefail
cd "$(dirname "$0")/.."
canvas="$1"; shift
dir="out/final/$canvas"; mkdir -p "$dir"
W="${WORKERS:-4}"
# boundaries on section starts (frames at 60 fps: 2553, 5218, 7131, 8868)
declare -A FROM=([s1]=0 [s2]=42.55 [s3]=86.96 [s4]=118.85 [s5a]=147.8 [s5b]=147.8)
declare -A TO=([s1]=42.55 [s2]=86.96 [s3]=118.85 [s4]=147.8 [s5a]="" [s5b]="")
segs=("$@"); [ ${#segs[@]} -eq 0 ] && segs=(s1 s2 s3 s4 s5a s5b)
for s in "${segs[@]}"; do
  extra=(); [ -n "${TO[$s]}" ] && extra+=(--to "${TO[$s]}"); [ "$s" = s5b ] && extra+=(--variant b)
  echo "== $canvas $s from ${FROM[$s]} ${extra[*]}"
  node tools/render.mjs --canvas "$canvas" --from "${FROM[$s]}" "${extra[@]}" --fps 60 --scale 1 --workers "$W" --crf 17 --noaudio --force --out "$dir/seg_$s.mp4"
done
master=$(.venv/bin/python -c "import json;print(json.load(open('engine/data/audio.json'))['master'])")
for v in a b; do
  [ -f "$dir/seg_s5$v.mp4" ] || continue
  list="$dir/concat_$v.txt"; : > "$list"
  for s in s1 s2 s3 s4 "s5$v"; do echo "file '$(realpath "$dir/seg_$s.mp4")'" >> "$list"; done
  out="out/final/master_${canvas}$([ $v = b ] && echo _b).mp4"
  ffmpeg -v error -y -f concat -safe 0 -i "$list" -i "$master" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -af apad -shortest -movflags +faststart "$out"
  ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames -of compact "$out"
done
