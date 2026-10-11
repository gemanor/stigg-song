#!/usr/bin/env bash
# Teaser cut from a finished master: the hook + the drop (0:00-0:16.12), then straight to the check and the payoff
# (2:18.33 to the end). Both cuts sit on downbeats (16.12, 138.32) and on 60 fps frame boundaries (frames 967 and 8300),
# so audio and video splice at the same instant; 20 ms audio fades hide the seam.
# The master is opened twice (a duration-limited input and a seeked input), so nothing is buffered between the parts.
# usage: bash tools/teaser.sh <master.mp4> <out.mp4>
set -euo pipefail
cd "$(dirname "$0")/.."
in="$1"; out="$2"
A=16.1166      # just under 967/60: frames 0-966
B=138.33333    # just under 8300/60 (138.333333…): frames 8300-
ffmpeg -v error -y -t "$A" -i "$in" -ss "$B" -i "$in" -filter_complex "
[0:a]afade=t=out:st=16.0966:d=0.02[a1];
[1:a]afade=t=in:st=0:d=0.02[a2];
[0:v][a1][1:v][a2]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$out"
ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames:format=duration,size -of compact "$out"
