"""The three vertical shorts (9:16, 1080x1920 60 fps), cut from the finished masters.

Every splice sits on the song's beat grid and on exact 60 fps frame boundaries. Audio comes straight from the master WAV
for the same song times (20 ms fades at each internal join), so picture and sound splice at the same instant.

  short1  "I'm an AI founder"  0:08.40-0:15.67 (the drop: opens on the I'M slam) + 0:32.80-0:56.12 (her red-pen pre-chorus + chorus 1) + slate
  short2  "Agents for agents"  0:56.12-1:26.97 (skit 2 + her FOUNDER -> ENGLISH verse, ends on "see fig. 2") + slate
  short3  "Out of tokens"      1:40.38-1:58.80 (the due-diligence Q&A) + 2:14.50-2:37.98 (outro + end card b)

The slate is the teaser end card (render: --canvas portrait --variant t --from 154.16667): MAKE EVERY TOKEN COUNT,
then the logo + AFTER TOKENS line on the stab, without the TOP-UP meter (she hasn't paid yet in shorts 1-2).
usage: .venv/bin/python tools/shorts.py [out_dir=deliver/shorts]"""
import json, os, subprocess, sys

FPS = 60
OUT = sys.argv[1] if len(sys.argv) > 1 else 'deliver/shorts'
M, MB, SLATE = 'out/final/master_portrait.mp4', 'out/final/master_portrait_b.mp4', 'out/final/slate_t_portrait.mp4'
SLATE_F0 = 9250                       # song frame of the slate file's first frame (154.1667 s)
WAV = json.load(open('engine/data/audio.json'))['master']
# (video source, first song frame, end song frame exclusive)
SHORTS = {
    'short1_im_an_ai_founder': [(M, 504, 940), (M, 1968, 3367), (SLATE, 9250, 9479)],   # no intro skit: a feed short opens on the chant
    'short2_agents_for_agents': [(M, 3367, 5218), (SLATE, 9250, 9479)],
    'short3_out_of_tokens': [(MB, 6023, 7128), (MB, 8070, 9479)],
}


def build(name, parts):
    args, fl, cat = ['ffmpeg', '-v', 'error', '-y'], [], ''
    for i, (src, f0, f1) in enumerate(parts):
        n = f1 - f0
        local0 = f0 - SLATE_F0 if src == SLATE else f0   # frame index inside the source file
        args += ['-ss', f'{local0 / FPS - 0.0005:.6f}', '-t', f'{n / FPS:.6f}', '-i', src]
        args += ['-ss', f'{f0 / FPS:.6f}', '-t', f'{n / FPS:.6f}', '-i', WAV]
        v, a = 2 * i, 2 * i + 1
        fades = []
        if i > 0: fades.append('afade=t=in:st=0:d=0.02')
        elif f0 > 0: fades.append('afade=t=in:st=0:d=0.01')   # a mid-song start: no click
        if i < len(parts) - 1: fades.append(f'afade=t=out:st={n / FPS - 0.02:.6f}:d=0.02')
        fl.append(f'[{v}:v]setpts=PTS-STARTPTS[v{i}]')
        fl.append(f'[{a}:a]aresample=48000,asetpts=PTS-STARTPTS{"," + ",".join(fades) if fades else ""}[a{i}]')
        cat += f'[v{i}][a{i}]'
    fl.append(f'{cat}concat=n={len(parts)}:v=1:a=1[v][a]')
    out = f'{OUT}/{name}.mp4'
    args += ['-filter_complex', ';'.join(fl), '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
             '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', out]
    subprocess.run(args, check=True)
    want = sum(f1 - f0 for _, f0, f1 in parts)
    got = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames',
                          '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip()
    print(f'{out}: {want} frames expected, {got} written, {want / FPS:.2f} s, {os.path.getsize(out) / 2**20:.1f} MiB')


os.makedirs(OUT, exist_ok=True)
for name, parts in SHORTS.items():
    build(name, parts)
