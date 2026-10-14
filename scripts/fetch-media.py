"""Download generated media listed in design/media/manifest.json and write web-ready files.

Videos: <out>.mp4 (H.264, 720 px wide unless the item sets "width", no audio, fast start) and <out>-poster.webp (first frame).
Images: <out>-600.webp, <out>-900.webp and <out>-1200.webp.
Audio: <out>.mp3 with the speakers levelled to one loudness (quiet or whispered lines lifted), and
<out>-segments.json with the start and end of each stretch of speech, and <out>-words.json with
each spoken word and its time (when faster-whisper is installed), for timing captions.
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


def video(src, out, width=720):
    mp4, poster = out + '.mp4', out + '-poster.webp'
    if not os.path.exists(mp4):
        run('ffmpeg', '-y', '-i', src, '-an', '-vf', f'scale={width}:-2:flags=lanczos,fps=30', '-c:v', 'libx264', '-profile:v', 'high',
            '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart', mp4)
    if not os.path.exists(poster):
        run('ffmpeg', '-y', '-i', src, '-frames:v', '1', '-vf', f'scale={width}:-2:flags=lanczos', '-quality', '80', poster)


def image(src, out):
    for w in (600, 900, 1200):
        dst = f'{out}-{w}.webp'
        if not os.path.exists(dst):
            run('ffmpeg', '-y', '-i', src, '-vf', f'scale={w}:-2:flags=lanczos', '-quality', '80', dst)


# Evens out loudness phrase by phrase (two voices, a whispered line) and then sets the whole file to
# about -16 LUFS, a comfortable level for speech on the web.
LEVEL = ','.join([
    'highpass=f=70',
    'dynaudnorm=f=200:g=11:p=0.9:m=12',
    'acompressor=threshold=-22dB:ratio=3:attack=5:release=150:makeup=2',
    'loudnorm=I=-16:TP=-1.5:LRA=6',
])


def audio(src, out):
    mp3, seg = out + '.mp3', out + '-segments.json'
    if not os.path.exists(mp3):
        run('ffmpeg', '-y', '-i', src, '-af', LEVEL, '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '96k', mp3)
    if not os.path.exists(seg):
        r = subprocess.run(['ffmpeg', '-i', mp3, '-af', 'silencedetect=noise=-40dB:d=0.3', '-f', 'null', '-'],
                           check=True, capture_output=True, text=True)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3],
                                   check=True, capture_output=True, text=True).stdout.strip())
        silences, start = [], None
        for line in r.stderr.splitlines():
            if 'silence_start:' in line:
                start = float(line.split('silence_start:')[1].split()[0])
            elif 'silence_end:' in line and start is not None:
                silences.append((max(0.0, start), float(line.split('silence_end:')[1].split()[0])))
                start = None
        if start is not None:
            silences.append((start, dur))
        speech, t = [], 0.0
        for a, b in silences:
            if a - t > 0.05:
                speech.append([round(t, 2), round(a, 2)])
            t = b
        if dur - t > 0.05:
            speech.append([round(t, 2), round(dur, 2)])
        json.dump({'duration': round(dur, 2), 'speech': speech}, open(seg, 'w'), indent=1)
    words = out + '-words.json'
    if not os.path.exists(words):
        try:
            from faster_whisper import WhisperModel
        except ImportError:
            return
        try:
            model = WhisperModel('small.en', device='cpu', compute_type='int8')
            import numpy as np  # decode with ffmpeg: faster-whisper's own decoder breaks with some PyAV versions
            pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                                 check=True, capture_output=True).stdout
            parts, _ = model.transcribe(np.frombuffer(pcm, np.float32), word_timestamps=True, beam_size=5, vad_filter=False)
            found = [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for p in parts for w in p.words]
            json.dump(found, open(words, 'w'), indent=0)
        except Exception:  # timing is a nice-to-have: keep the audio and leave a note for whoever reads the branch
            import traceback
            open(os.path.join(ROOT, 'design/media/last-error.txt'), 'w').write(traceback.format_exc())


def audio_done(out):
    try:
        import faster_whisper  # noqa: F401
        need = ('.mp3', '-segments.json', '-words.json')
    except ImportError:
        need = ('.mp3', '-segments.json')
    return all(os.path.exists(out + n) for n in need)


DONE = {'video': '.mp4', 'image': '-1200.webp'}
HANDLERS = {'video': video, 'image': image, 'audio': audio}


def main():
    manifest = json.load(open(os.path.join(ROOT, 'design/media/manifest.json')))
    note = os.path.join(ROOT, 'design/media/last-error.txt')
    if os.path.exists(note):
        os.remove(note)
    with tempfile.TemporaryDirectory() as tmp:
        for i, item in enumerate(manifest['items']):
            out = os.path.join(ROOT, item['out'])
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if audio_done(out) if item['kind'] == 'audio' else os.path.exists(out + DONE[item['kind']]):
                continue
            src = os.path.join(tmp, f'src{i}' + os.path.splitext(item['url'])[1])
            print('fetching', item['url'], flush=True)
            try:
                download(item['url'], src)
                if item['kind'] == 'video' and item.get('width'):
                    video(src, out, item['width'])
                else:
                    HANDLERS[item['kind']](src, out)
            except Exception:
                import traceback
                open(os.path.join(ROOT, 'design/media/last-error.txt'), 'a').write(item['out'] + '\n' + traceback.format_exc())
                continue
            print('wrote', item['out'], flush=True)


if __name__ == '__main__':
    sys.exit(main())
