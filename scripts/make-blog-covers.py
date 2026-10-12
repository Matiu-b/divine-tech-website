"""Render blog cover images from a text-free background plus editable type.

Backgrounds live in design/blog-covers/<slug>-bg.webp (generated without any text).
Titles live in design/blog-covers/covers.json, so a headline can be changed and the
cover re-rendered without generating a new image:

    python3 scripts/make-blog-covers.py            # all covers
    python3 scripts/make-blog-covers.py <slug>     # one cover

Writes public/img/blog/<slug>-1600.webp, -800.webp and -og.jpg (1200x675).
Needs Python Playwright with Chromium and Pillow. Runs locally, not in the Netlify build.
"""
import base64, html, json, sys, io
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

def render(page, cover):
    slug, dark = cover['slug'], cover.get('tone', 'dark') == 'dark'
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
    only = sys.argv[1:]
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
        page = b.new_page(viewport={'width': 1600, 'height': 900})
        for c in covers:
            if not only or c['slug'] in only:
                render(page, c)
        b.close()
