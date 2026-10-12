"""Render blog cover images from a text-free background plus editable type.

Backgrounds live in design/blog-covers/<slug>-bg.webp and never contain text. A cover entry
in design/blog-covers/covers.json that has a "palette" (3 to 5 hex colours, darkest first) and
no background file yet gets one drawn here: soft out-of-focus light on film grain, the same
look as the existing covers, with no image service needed. Titles live in covers.json too,
so a headline can be changed and the cover re-rendered without a new background:

    python3 scripts/make-blog-covers.py            # all covers
    python3 scripts/make-blog-covers.py <slug>     # one cover
    python3 scripts/make-blog-covers.py --missing  # only covers whose images do not exist yet

A cover entry can also carry "bg_url": a background made with an image service such as
Higgsfield. When the -bg.webp file is missing, the script downloads that URL first. Sessions
that cannot reach the image host just push covers.json; the "Blog covers" GitHub Action
(.github/workflows/blog-covers.yml) then downloads, renders and commits the images on the branch.

Writes public/img/blog/<slug>-1600.webp, -800.webp and -og.jpg (1200x675).
Needs Python Playwright with Chromium, Pillow and numpy. Not part of the Netlify build.
"""
import base64, hashlib, html, json, os, sys, io, urllib.request
import numpy as np
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DESIGN = ROOT / 'design' / 'blog-covers'
OUT = ROOT / 'public' / 'img' / 'blog'
FONT_FILE = ROOT / 'public' / 'fonts' / 'unbounded-latin-wght.woff'

def data_uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(Path(path).read_bytes()).decode()

PAGE = """<!doctype html><html><head><style>
@font-face {{ font-family: Unbounded; font-weight: 200 900; src: url({font}) format('woff'); }}
* {{ margin: 0; box-sizing: border-box; }}
body {{ width: 1600px; height: 900px; position: relative; overflow: hidden; font-family: Unbounded;
       background: url({bg}) center / cover no-repeat; }}
h1 {{ position: absolute; left: 160px; right: 160px; top: 50%; transform: translateY(-50%); text-align: center;
     font-size: 76px; line-height: 1.1; font-weight: 500; letter-spacing: -0.035em; color: {ink};
     text-wrap: balance; text-shadow: {shadow}; }}
img {{ position: absolute; left: 64px; bottom: 56px; height: 30px; }}
</style></head><body><h1>{title}</h1><img src="{logo}"></body></html>"""

def hex_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

def draw_background(cover, path):
    """Blurred colour field: a base colour with large soft glows of the other palette colours."""
    seed = int(hashlib.sha1(cover.get('seed', cover['slug']).encode()).hexdigest()[:8], 16)
    rng = np.random.default_rng(seed)
    W, H = 1600, 900
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    pal = [hex_rgb(c) for c in cover['palette']]
    img = np.zeros((H, W, 3), np.float32) + pal[0]
    # a gentle diagonal tilt toward the second colour keeps the field from looking flat
    t = ((xx / W) * rng.uniform(0.3, 0.7) + (yy / H) * rng.uniform(0.3, 0.7))[..., None]
    img = img * (1 - 0.35 * t) + pal[1] * (0.35 * t)
    for col in pal[1:]:
        cx, cy = rng.uniform(0.0, 1.0) * W, rng.uniform(0.0, 1.0) * H
        rx, ry = rng.uniform(0.22, 0.42) * W, rng.uniform(0.35, 0.65) * H
        g = np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))[..., None] * rng.uniform(0.85, 1.0)
        img = img * (1 - g) + col * g
    # lift saturation a little so the glows read as light, not mud
    grey = img.mean(axis=2, keepdims=True)
    img = grey + (img - grey) * 1.25
    img += rng.normal(0, 7, (H, W, 1)).astype(np.float32)  # film grain
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(path, quality=90)
    print('drew background', cover['slug'])

def download_background(cover, path):
    """Fetch a generated background, crop it to 16:9 and store it at 1600x900."""
    req = urllib.request.Request(cover['bg_url'], headers={'User-Agent': 'divine-blog-covers'})
    with urllib.request.urlopen(req, timeout=60) as r:
        im = Image.open(io.BytesIO(r.read())).convert('RGB')
    W, H = im.size
    if W / H > 16 / 9:
        w = round(H * 16 / 9); im = im.crop(((W - w) // 2, 0, (W - w) // 2 + w, H))
    else:
        h = round(W * 9 / 16); im = im.crop((0, (H - h) // 2, W, (H - h) // 2 + h))
    im.resize((1600, 900), Image.LANCZOS).save(path, quality=90)
    print('downloaded background', cover['slug'])

def render(page, cover):
    slug, dark = cover['slug'], cover.get('tone', 'dark') == 'dark'
    bg = DESIGN / f'{slug}-bg.webp'
    if not bg.exists() and cover.get('bg_url'):
        try:
            download_background(cover, bg)
        except Exception as e:  # unreachable host: fall back to the palette if there is one
            print(f'{slug}: could not download bg_url ({e})')
    if not bg.exists():
        if 'palette' not in cover:
            sys.exit(f'{slug}: no background file, no reachable bg_url and no palette in covers.json')
        draw_background(cover, bg)
    logo = ROOT / 'public' / 'brand' / ('divine-logo-horizontal-color-dark.svg' if dark else 'divine-logo-horizontal-color.svg')
    page.set_content(PAGE.format(
        font=data_uri(FONT_FILE, 'font/woff'),
        bg=data_uri(DESIGN / f'{slug}-bg.webp', 'image/webp'),
        logo=data_uri(logo, 'image/svg+xml'),
        title=html.escape(cover['title']),
        ink='#FFFFFF' if dark else '#0A0F0E',
        shadow='0 2px 24px rgba(0,0,0,0.18)' if dark else 'none',
    ))
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(200)
    im = Image.open(io.BytesIO(page.screenshot(type='png'))).convert('RGB')
    im.save(OUT / f'{slug}-1600.webp', quality=82)
    im.resize((800, 450), Image.LANCZOS).save(OUT / f'{slug}-800.webp', quality=80)
    im.resize((1200, 675), Image.LANCZOS).save(OUT / f'{slug}-og.jpg', quality=86)
    print('rendered', slug)

if __name__ == '__main__':
    covers = json.loads((DESIGN / 'covers.json').read_text())
    args = sys.argv[1:]
    missing = '--missing' in args
    only = [a for a in args if not a.startswith('--')]
    if missing:
        covers = [c for c in covers if not (OUT / f"{c['slug']}-og.jpg").exists()]
    exe = os.environ.get('CHROMIUM_PATH') or ('/opt/pw-browsers/chromium-1194/chrome-linux/chrome' if Path('/opt/pw-browsers/chromium-1194/chrome-linux/chrome').exists() else None)
    with sync_playwright() as p:
        b = p.chromium.launch(**({'executable_path': exe} if exe else {}))
        page = b.new_page(viewport={'width': 1600, 'height': 900})
        for c in covers:
            if not only or c['slug'] in only:
                render(page, c)
        b.close()
