// Runs after the two `vite build`s (see package.json). The site is a single-page app, so without
// this every page would reach visitors, search engines, AI crawlers and link previews as an empty
// <div id="root">. For every route this writes dist/<path>.html with its own title, description,
// canonical, Open Graph tags and JSON-LD, and the page itself rendered by React from the server
// build (dist-ssr/entry-server.js), which the browser then hydrates (src/main.jsx). It also writes
// 404.html (served by Netlify with a real 404 status), sitemap.xml, robots.txt and llms.txt.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL, blog, posts, postPath } from '../src/data/blog.js';
import { industries, industryPath } from '../src/data/industries.js';
import { guides, guidePath } from '../src/data/guides.js';
import * as site from '../src/data/site.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
// The preloaded script chunks load at low priority: the HTML is already rendered, so the stylesheet,
// font and hero image get the bandwidth for the first paint, and the code that makes the page
// interactive follows. (PageSpeed counted the 130 KB of chunks toward the first paint.) The small
// entry script keeps its normal priority, so on HTTP/1.1 the browser doesn't queue it behind images.
const lowPriority = (html) => html.replace(/<link rel="modulepreload" crossorigin/g, '<link rel="modulepreload" fetchpriority="low" crossorigin');
const template = lowPriority(readFileSync(join(dist, 'index.html'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path) => SITE_URL + (path === '/' ? '/' : path);
const ld = (j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`;

const { brand, legal } = site;
const ORG_ID = SITE_URL + '/#organization';

// Organization: on every page, so any entry point identifies the company behind the site.
const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: brand.company,
  legalName: legal.entity,
  url: SITE_URL + '/',
  logo: SITE_URL + '/icon-512.png',
  email: brand.email,
  telephone: brand.phone,
  description: site.footer.tagline,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1441 Broadway, Suite 6171',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10018',
    addressCountry: 'US',
  },
  sameAs: site.social.map((s) => s.href),
  contactPoint: brand.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.display, contactType: 'sales', areaServed: p.label === 'US' ? 'US' : 'IL', availableLanguage: ['English'] })),
};

const software = {
  '@type': 'SoftwareApplication',
  '@id': SITE_URL + '/#aurora',
  name: brand.product,
  alternateName: 'Aurora AI operating system',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'AI operating system',
  operatingSystem: 'Web',
  url: SITE_URL + '/platform',
  description: site.homeMeta.description,
  publisher: { '@id': ORG_ID },
  featureList: [
    ...site.capabilities.map((c) => `${c.title}: ${c.text}`),
    `Channels: ${site.integrations.channels.join(', ')}`,
    `Works with ${[...site.integrations.crm, ...site.integrations.calendars].join(', ')}`,
  ],
};

const website = { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: brand.company, url: SITE_URL + '/', publisher: { '@id': ORG_ID } };

const faqPage = (items, url) => ({
  '@type': 'FAQPage',
  '@id': url + '#faq',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

const breadcrumbs = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

const og = (key) => `${SITE_URL}/img/og/${key}.jpg`;

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': [organization, ...nodes] });

function setMeta(html, { title, description, path, image, imageHeight = 630, type = 'website', jsonld = [], noindex = false }) {
  const url = abs(path);
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
      .replace(/<meta property="og:image:height" content="[^"]*" \/>/, `<meta property="og:image:height" content="${imageHeight}" />`);
  }
  const head = noindex ? ['<meta name="robots" content="noindex" />'] : [`<link rel="canonical" href="${url}" />`];
  const extra = [...head, ...jsonld.map(ld)].join('\n    ');
  return out.replace('</head>', `    ${extra}\n  </head>`);
}

const withBody = (html, body, path) => html.replace('<div id="root"></div>', `<div id="root" data-path="${path}">${body}</div>`);

// Written as <path>.html, not <path>/index.html: Netlify serves /blog/x from blog/x.html as is,
// while a folder index would 301 to a trailing-slash URL that no longer matches the canonical.
function write(path, html) {
  const file = join(dist, path === '/' ? 'index.html' : `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('prerendered', path);
}

// Each page's code is its own chunk (src/pages/routes.jsx). Preloading it, and the chunks it
// imports, lets the browser fetch it alongside the entry script instead of after it.
const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'));
rmSync(join(dist, '.vite'), { recursive: true, force: true }); // build metadata, not for the site
const entryChunks = new Set((template.match(/\/assets\/[^"]+\.js/g) || []).map((s) => s.slice(1)));
// Industries with their own page module (as in src/pages/routes.jsx).
const industryPages = { 'real-estate': 'industries/RealEstatePage', 'wellness-healthcare': 'industries/WellnessPage', 'home-services': 'industries/HomeServicesPage' };
const pageSource = (path) =>
  path === '/' ? 'Home' : path === '/platform' ? 'PlatformPage' : path === '/privacy' ? 'PrivacyPolicy' : path === '/blog' ? 'Blog'
    : path.startsWith('/blog/') ? 'BlogPost' : path.startsWith('/industries/') ? industryPages[path.slice('/industries/'.length)] || 'IndustryPage'
    : path.startsWith('/guides/') ? 'GuidePage' : null;
function preloads(path) {
  const name = pageSource(path);
  if (!name) return '';
  const files = new Set();
  const visit = (key) => {
    const chunk = manifest[key];
    if (!chunk || files.has(chunk.file)) return;
    files.add(chunk.file);
    (chunk.imports || []).forEach(visit);
  };
  visit(`src/pages/${name}.jsx`);
  return [...files].filter((f) => !entryChunks.has(f)).map((f) => `<link rel="modulepreload" fetchpriority="low" crossorigin href="/${f}">`).join('\n    ');
}

// The page itself, rendered by React from the server build (src/entry-server.jsx), with React's
// production build like the site.
process.env.NODE_ENV ||= 'production';
const { render: renderApp } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

// Industry pages open on a photo, their largest paint. Preloading it ahead of the font and the
// scripts lets phones start it first instead of queueing it behind a dozen chunks.
function heroPreload(path, body) {
  if (!path.startsWith('/industries/')) return '';
  const img = body.match(/<img [^>]*fetchPriority="high"[^>]*>/);
  if (!img) return '';
  const attr = (name) => (img[0].match(new RegExp(` ${name}="([^"]*)"`)) || [])[1];
  const set = attr('srcSet');
  return `<link rel="preload" as="image" href="${attr('src')}"${set ? ` imagesrcset="${set}" imagesizes="${attr('sizes')}"` : ''} fetchpriority="high" />`;
}

async function render(path, meta) {
  const links = preloads(path);
  const body = await renderApp(path);
  const hero = heroPreload(path, body);
  let html = setMeta(template, { ...meta, path });
  if (hero) html = html.replace('<link rel="preload" href="/fonts/', `${hero}\n    <link rel="preload" href="/fonts/`);
  write(path, withBody(links ? html.replace('</head>', `  ${links}\n  </head>`) : html, body, path));
}

// Pages
await render('/', { ...site.homeMeta, image: og('home'), jsonld: [graph(website, software, faqPage(site.homeFaq, SITE_URL + '/'))] });

{
  const p = site.platformPage;
  await render('/platform', { ...p.meta, image: og('platform'), jsonld: [graph(software, breadcrumbs([['Home', '/'], ['Platform', '/platform']]), faqPage(p.faq, abs('/platform')))] });
}

for (const it of industries) {
  const path = industryPath(it.slug);
  await render(path, { ...it.meta, image: og(it.slug), jsonld: [graph(breadcrumbs([['Home', '/'], [it.label, path]]), faqPage(it.faq, abs(path)))] });
}

await render('/privacy', { ...site.privacyMeta, jsonld: [graph(breadcrumbs([['Home', '/'], ['Privacy Policy', '/privacy']]))] });

await render('/blog', {
  title: blog.metaTitle,
  description: blog.metaDescription,
  image: og('home'),
  jsonld: [graph({ '@type': 'Blog', name: 'Divine Tech AI Blog', url: abs('/blog'), publisher: { '@id': ORG_ID }, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(postPath(p.slug)), datePublished: p.date })) })],
});

for (const p of posts) {
  await render(postPath(p.slug), { title: p.titleTag, description: p.description, image: SITE_URL + p.image.og, imageHeight: 675, type: 'article', jsonld: p.schema });
}

// Guide landing pages for social traffic: prerendered, but kept out of search and the sitemap.
for (const g of guides) {
  await render(guidePath(g.slug), { ...g.meta, image: og('home'), noindex: true });
}

// 404: Netlify serves this for any path without a file, with status 404. React then shows the not-found page.
writeFileSync(
  join(dist, '404.html'),
  withBody(
    setMeta(template, { title: 'Page not found · Divine Tech AI', description: 'This page does not exist on divine-tech.ai.', path: '/404', noindex: true }),
    await renderApp('/404'),
    '/404'
  )
);
console.log('wrote 404.html');

// Sitemap, robots and llms.txt
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', today],
  ['/platform', today],
  ...industries.map((i) => [industryPath(i.slug), today]),
  ['/blog', posts[0] ? posts[0].updated : today],
  ...posts.map((p) => [postPath(p.slug), p.updated]),
  ['/privacy', today],
];
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(([u, d]) => `  <url><loc>${abs(u)}</loc><lastmod>${d}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const llms = `# ${brand.company}

> ${brand.company} builds ${brand.product}, the AI operating system for business. ${site.homeMeta.description.replace(/^Aurora by Divine Tech AI is the AI operating system for business: /, 'It runs ')}

${brand.product} works across sales, customer service and internal operations. Customers and employees reach it on ${site.integrations.channels.join(', ')}. It works inside the tools a company already uses, including ${site.integrations.crm.join(' and ')}, ${site.integrations.calendars.join(' and ')}, email, phone systems and payments. Setup takes hours, and nothing goes live until the customer approves it.

## Company

- Legal name: ${legal.entity}
- Address: ${legal.address}
- Email: ${brand.email}
- Profiles: ${site.social.map((s) => `[${s.label}](${s.href})`).join(', ')}
- Phone: ${brand.phones.map((p) => `${p.display} (${p.label})`).join(', ')}

## Pages

- [Home](${abs('/')}): what Aurora is, how it works and how setup goes
- [Platform](${abs('/platform')}): capabilities, teams and how control and approvals work
${industries.map((i) => `- [Aurora for ${i.label.toLowerCase()}](${abs(industryPath(i.slug))}): ${i.short}`).join('\n')}
- [Blog](${abs('/blog')}): ${blog.intro}
${posts.map((p) => `- [${p.title}](${abs(postPath(p.slug))}): ${p.description}`).join('\n')}
- [Privacy Policy](${abs('/privacy')})

## FAQ

${site.homeFaq.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}
`;
writeFileSync(join(dist, 'llms.txt'), llms);
console.log('wrote sitemap.xml, robots.txt and llms.txt');

// IndexNow: on production deploys only, tell Bing (and the engines that share IndexNow, which also
// feeds ChatGPT search and Copilot) which URLs exist, so new and changed pages are crawled right away.
// The key file public/e747df91f8dc7308857fda06c15a8e41.txt proves the site owns the key. A failure never fails the build.
const INDEXNOW_KEY = 'e747df91f8dc7308857fda06c15a8e41';
if (process.env.CONTEXT === 'production') {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(SITE_URL).host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList: urls.map(([u]) => abs(u)) }),
      signal: AbortSignal.timeout(10000),
    });
    console.log('IndexNow:', res.status);
  } catch (e) {
    console.log('IndexNow skipped:', e.message);
  }
}
