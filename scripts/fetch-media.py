"""Download generated media listed in design/media/manifest.json and write web-ready files.

Videos: <out>.mp4 (H.264, 720 px wide, no audio, fast start) and <out>-poster.webp (first frame).
Images: <out>-600.webp, <out>-900.webp and <out>-1200.webp.
Files that already exist are skipped, so the job only does new work. Needs ffmpeg on PATH.
"""
import json
import os
import subprocess
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)


def download(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': 'divine-tech-site-media'})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, 'wb') as f:
        f.write(r.read())


def video(src, out):
    mp4, poster = out + '.mp4', out + '-poster.webp'
    if not os.path.exists(mp4):
        run('ffmpeg', '-y', '-i', src, '-an', '-vf', 'scale=720:-2:flags=lanczos,fps=30', '-c:v', 'libx264', '-profile:v', 'high',
            '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart', mp4)
    if not os.path.exists(poster):
        run('ffmpeg', '-y', '-i', src, '-frames:v', '1', '-vf', 'scale=720:-2:flags=lanczos', '-quality', '80', poster)


def image(src, out):
    for w in (600, 900, 1200):
        dst = f'{out}-{w}.webp'
        if not os.path.exists(dst):
            run('ffmpeg', '-y', '-i', src, '-vf', f'scale={w}:-2:flags=lanczos', '-quality', '80', dst)


def main():
    manifest = json.load(open(os.path.join(ROOT, 'design/media/manifest.json')))
    with tempfile.TemporaryDirectory() as tmp:
        for i, item in enumerate(manifest['items']):
            out = os.path.join(ROOT, item['out'])
            os.makedirs(os.path.dirname(out), exist_ok=True)
            done = os.path.exists(out + '.mp4') if item['kind'] == 'video' else os.path.exists(out + '-1200.webp')
            if done:
                continue
            src = os.path.join(tmp, f'src{i}' + os.path.splitext(item['url'])[1])
            print('fetching', item['url'], flush=True)
            download(item['url'], src)
            (video if item['kind'] == 'video' else image)(src, out)
            print('wrote', item['out'], flush=True)


if __name__ == '__main__':
    sys.exit(main())
