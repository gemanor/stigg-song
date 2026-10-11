#!/usr/bin/env bash
# Delivery encodes from a finished master render.
# usage: bash tools/deliver.sh <master.mp4> <name>      e.g. bash tools/deliver.sh out/final/master_16x9.mp4 im_an_ai_founder_16x9
#   out/final/<name>_x.mp4        X-ready: 2-pass x264 ~21 Mb/s (maxrate 25M), AAC 192k, faststart (< 512 MB)
#   out/final/<name>_web.mp4      a lighter CRF 20 copy for sharing/previews
set -euo pipefail
cd "$(dirname "$0")/.."
in="$1"; name="$2"; mkdir -p out/final
log="out/final/${name}_2pass"
ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -b:v 21M -maxrate 25M -bufsize 42M -pass 1 -passlogfile "$log" -an -f mp4 /dev/null
ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -b:v 21M -maxrate 25M -bufsize 42M -pass 2 -passlogfile "$log" -pix_fmt yuv420p \
  -profile:v high -c:a aac -b:a 192k -ar 48000 -movflags +faststart "out/final/${name}_x.mp4"
ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "out/final/${name}_web.mp4"
rm -f "${log}"*.log*
ls -la "out/final/${name}_x.mp4" "out/final/${name}_web.mp4"
