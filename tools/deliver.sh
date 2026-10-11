#!/usr/bin/env bash
# Sharing copy from a finished master, sized to stay under GitHub's 100 MB file limit (and friendly to chat apps).
# CRF 20 first; if that lands over the cap, a 2-pass encode at the bitrate that fits.
# The masters themselves are already upload-ready (H.264 High, yuv420p, AAC, fast start) for YouTube, X, LinkedIn, TikTok.
# usage: bash tools/deliver.sh <master.mp4> <out.mp4> [max_MB=95]
set -euo pipefail
cd "$(dirname "$0")/.."
in="$1"; out="$2"; max="${3:-95}"
mkdir -p "$(dirname "$out")"
ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$out"
size=$(stat -c %s "$out")
if [ "$size" -gt $((max * 1000000)) ]; then
  dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$in")
  vb=$(python3 -c "print(int(($max * 8e6 * 0.97) / $dur - 192e3))")
  log="$(dirname "$out")/.2pass_$(basename "$out")"
  echo "CRF 20 gave $((size / 1000000)) MB; 2-pass at $((vb / 1000)) kb/s"
  ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -b:v "$vb" -maxrate $((vb * 2)) -bufsize $((vb * 4)) \
    -pass 1 -passlogfile "$log" -an -f mp4 /dev/null
  ffmpeg -v error -y -i "$in" -c:v libx264 -preset slow -b:v "$vb" -maxrate $((vb * 2)) -bufsize $((vb * 4)) \
    -pass 2 -passlogfile "$log" -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$out"
  rm -f "$log"*
fi
ls -la "$out"
