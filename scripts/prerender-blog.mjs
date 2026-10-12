// Runs after `vite build`. The site is a single-page app, so without this the blog would reach
// search engines and link previews as an empty <div id="root">. For /blog and each post this
// writes dist/<path>/index.html with the right title, description, canonical, Open Graph tags,
// JSON-LD and the article text already in the page (React replaces it on load).
// Also writes dist/sitemap.xml and dist/robots.txt. No dependencies.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, blog, posts, postPath } from '../src/data/blog.js';
import { industries } from '../src/data/industries.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function setMeta(html, { title, description, url, image, type = 'website', jsonld = [] }) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  if (image) {
    out = out
      .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`)
      .replace(/<meta property="og:image:height" content="[^"]*" \/>/, '<meta property="og:image:height" content="675" />');
  }
  const extra = [`<link rel="canonical" href="${url}" />`, ...jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)].join('\n    ');
  return out.replace('</head>', `    ${extra}\n  </head>`);
}

const withBody = (html, body) => html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

function write(path, html) {
  const file = join(dist, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('prerendered', path);
}

// Blog index
const indexUrl = `${SITE_URL}/blog`;
const indexBody = `<main><h1>${esc(blog.title)}</h1><p>${esc(blog.intro)}</p><ul>${posts
  .map((p) => `<li><a href="${postPath(p.slug)}">${esc(p.title)}</a> <time datetime="${p.date}">${fmt(p.date)}</time><p>${esc(p.dek)}</p></li>`)
  .join('')}</ul></main>`;
write(
  'blog',
  withBody(
    setMeta(template, {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: indexUrl,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'Divine Tech AI Blog', url: indexUrl, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: SITE_URL + postPath(p.slug), datePublished: p.date })) }],
    }),
    indexBody
  )
);

// Posts
for (const p of posts) {
  const url = SITE_URL + postPath(p.slug);
  const body = `<main><article><p><a href="/blog">Blog</a> · ${esc(p.category)}</p><h1>${esc(p.title)}</h1><p>${esc(p.dek)}</p><p>${esc(p.author)} · <time datetime="${p.date}">${fmt(p.date)}</time></p><img src="${p.image.base}-1600.webp" alt="${esc(p.image.alt)}" width="1600" height="900" />${p.bodyHtml}</article></main>`;
  write(
    postPath(p.slug).slice(1),
    withBody(setMeta(template, { title: p.titleTag, description: p.description, url, image: SITE_URL + p.image.og, type: 'article', jsonld: p.schema }), body)
  );
}

// Sitemap and robots
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', today],
  ['/platform', today],
  ...industries.map((i) => [`/industries/${i.slug}`, today]),
  ['/blog', posts[0] ? posts[0].updated : today],
  ...posts.map((p) => [postPath(p.slug), p.updated]),
  ['/privacy', today],
];
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(([u, d]) => `  <url><loc>${SITE_URL}${u === '/' ? '/' : u}</loc><lastmod>${d}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('wrote sitemap.xml and robots.txt');
