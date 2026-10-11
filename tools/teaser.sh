#!/usr/bin/env bash
# Teaser cut from a finished master: the hook + the drop (0:00-0:16.12), then straight to the check and the payoff
# (2:18.33 to the end). Both cuts sit on downbeats (16.12, 138.32) and on exact 60 fps frame boundaries, so audio and
# video splice at the same instant; 20 ms audio fades hide the seam.
# usage: bash tools/teaser.sh <master.mp4> <out.mp4>
set -euo pipefail
cd "$(dirname "$0")/.."
in="$1"; out="$2"
A=16.116667   # frame 967
B=138.333333  # frame 8300
ffmpeg -v error -y -i "$in" -filter_complex "
[0:v]trim=end=$A,setpts=PTS-STARTPTS[v1];
[0:v]trim=start=$B,setpts=PTS-STARTPTS[v2];
[0:a]atrim=end=$A,asetpts=PTS-STARTPTS,afade=t=out:st=16.096667:d=0.02[a1];
[0:a]atrim=start=$B,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.02[a2];
[v1][a1][v2][a2]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration,size -of compact "$out"
