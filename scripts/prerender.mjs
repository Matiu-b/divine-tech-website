// Runs after `vite build`. The site is a single-page app, so without this every page would reach
// search engines, AI crawlers and link previews as an empty <div id="root">. For every route this
// writes dist/<path>.html with its own title, description, canonical, Open Graph tags, JSON-LD and
// the page text already in the HTML (React replaces it on load). It also writes 404.html (served by
// Netlify with a real 404 status), sitemap.xml, robots.txt and llms.txt. No dependencies.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, blog, posts, postPath } from '../src/data/blog.js';
import { industries, industryPath } from '../src/data/industries.js';
import * as site from '../src/data/site.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

// Static header and footer around each page body, so crawlers see the same links visitors do.
const header = `<header><a href="/">${esc(brand.company)}</a><nav aria-label="Main"><a href="/platform">Platform</a> ${industries
  .map((i) => `<a href="${industryPath(i.slug)}">${esc(i.label)}</a>`)
  .join(' ')} <a href="/#how-it-works">How it works</a> <a href="/blog">Blog</a></nav></header>`;
const footerHtml = `<footer><p>${esc(site.footer.tagline)}</p><p>${esc(legal.entity)} · ${esc(legal.address)} · <a href="mailto:${brand.email}">${brand.email}</a> · ${brand.phones
  .map((p) => `<a href="tel:${p.tel}">${esc(p.display)}</a>`)
  .join(' · ')}</p><p><a href="/privacy">Privacy Policy</a></p></footer>`;

const page = (main) => `${header}<main id="main">${main}</main>${footerHtml}`;
const withBody = (html, body) => html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
const faqHtml = (items, title = 'Questions') =>
  `<section id="faq"><h2>${esc(title)}</h2>${items.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`;
const pairs = (list) => `<ul>${list.map(([t, d]) => `<li><strong>${esc(t)}</strong> ${esc(d)}</li>`).join('')}</ul>`;

// Written as <path>.html, not <path>/index.html: Netlify serves /blog/x from blog/x.html as is,
// while a folder index would 301 to a trailing-slash URL that no longer matches the canonical.
function write(path, html) {
  const file = join(dist, path === '/' ? 'index.html' : `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('prerendered', path);
}

function render(path, meta, main) {
  write(path, withBody(setMeta(template, { ...meta, path }), page(main)));
}

// Home
{
  const s = site;
  const main = [
    `<section><h1>${esc(s.hero.titleA)}</h1><p>${esc(s.hero.text)}</p><p><a href="/#contact">${esc(s.hero.primary)}</a></p></section>`,
    `<section><h2>${esc(s.platform.titleA)} ${esc(s.platform.titleB)}</h2><p>${esc(s.platform.text)}</p><p>Channels: ${esc(s.platform.channels.join(', '))}.</p>${pairs(
      s.platform.layers.map((l) => [l.name, l.detail])
    )}${pairs(s.platform.notes)}<p><a href="/platform">${esc(s.platform.link)}</a></p></section>`,
    `<section><h2>${esc(s.outcomes.titleA)}</h2><p>${esc(s.outcomes.text)}</p>${pairs(s.outcomes.items.map((o) => [`${o.label}: ${o.title}.`, o.text]))}</section>`,
    `<section id="how-it-works"><h2>${esc(s.howItWorks.titleA)}</h2><p>${esc(s.howItWorks.text)}</p><ol>${s.howItWorks.steps
      .map((st) => `<li><strong>${esc(st.name)}</strong> (${esc(st.who)}). ${esc(st.text)}</li>`)
      .join('')}</ol></section>`,
    `<section id="industries"><h2>${esc(s.industriesSection.titleA)} ${esc(s.industriesSection.titleB)}</h2><p>${esc(s.industriesSection.text)}</p><ul>${industries
      .map((i) => `<li><a href="${industryPath(i.slug)}">${esc(i.label)}</a>: ${esc(i.short)}</li>`)
      .join('')}</ul></section>`,
    faqHtml(s.homeFaq, 'Questions about Aurora'),
    `<section id="contact"><h2>${esc(s.closing.titleA)} ${esc(s.closing.titleB)}</h2><p>${esc(s.closing.text)}</p></section>`,
  ].join('');
  render('/', { ...s.homeMeta, image: og('home'), jsonld: [graph(website, software, faqPage(s.homeFaq, SITE_URL + '/'))] }, main);
}

// Platform
{
  const s = site;
  const p = s.platformPage;
  const main = [
    `<section><h1>${esc(p.titleA)} ${esc(p.titleB)}</h1><p>${esc(p.text)}</p></section>`,
    `<section id="capabilities"><h2>What Aurora does</h2>${s.capabilities.map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>`).join('')}</section>`,
    `<section id="teams"><h2>${esc(s.teams.titleA)} ${esc(s.teams.titleB)}</h2>${s.teams.items
      .map((t) => `<h3>${esc(t.label)}: ${esc(t.title)}</h3><p>${esc(t.line)}</p><p>Measured by: ${esc(t.kpis.join(', '))}.</p>`)
      .join('')}</section>`,
    `<section><h2>${esc(s.platform.titleA)} ${esc(s.platform.titleB)}</h2>${pairs(s.platform.notes)}<p>Works with: ${esc(
      [...s.integrations.crm, ...s.integrations.calendars].join(', ')
    )}, and channels including ${esc(s.integrations.channels.join(', '))}.</p></section>`,
    `<section id="contact"><h2>${esc(s.closing.titleA)} ${esc(s.closing.titleB)}</h2><p>${esc(s.closing.text)}</p></section>`,
  ].join('');
  render('/platform', { ...p.meta, image: og('platform'), jsonld: [graph(software, breadcrumbs([['Home', '/'], ['Platform', '/platform']]))] }, main);
}

// Industry pages
for (const it of industries) {
  const path = industryPath(it.slug);
  const main = [
    `<section><p>${esc(it.hero.eyebrow)}</p><h1>${esc(it.hero.titleA)} ${esc(it.hero.titleB)}</h1><p>${esc(it.hero.text)}</p></section>`,
    `<section><h2>${esc(it.problem.titleA)} ${esc(it.problem.titleB)}</h2>${pairs(it.problem.points)}<p>${esc(it.problem.cost)}</p></section>`,
    `<section><h2>${esc(it.how.titleA)} ${esc(it.how.titleB)}</h2><ol>${it.how.steps.map(([t, d]) => `<li><strong>${esc(t)}</strong> ${esc(d)}</li>`).join('')}</ol></section>`,
    `<section><h2>${esc(it.control.title)}</h2><p>${esc(it.control.text)}</p></section>`,
    `<section><h2>What changes</h2>${pairs(it.value)}<p>${esc(it.success)}</p><p>Works with: ${esc(it.systems.join(', '))}.</p></section>`,
    faqHtml(it.faq),
    `<section><h2>Aurora in other industries</h2><ul>${industries
      .filter((o) => o.slug !== it.slug)
      .map((o) => `<li><a href="${industryPath(o.slug)}">${esc(o.label)}</a>: ${esc(o.short)}</li>`)
      .join('')}</ul></section>`,
  ].join('');
  render(path, { ...it.meta, image: og(it.slug), jsonld: [graph(breadcrumbs([['Home', '/'], [it.label, path]]), faqPage(it.faq, abs(path)))] }, main);
}

// Privacy: the policy text lives in JSX, so turn that markup into plain HTML here.
{
  const src = readFileSync(join(root, 'src/pages/PrivacyPolicy.jsx'), 'utf8');
  const toc = Object.fromEntries([...src.matchAll(/\['([a-z-]+)', '([^']+)'\]/g)].map((m) => [m[1], m[2]]));
  const order = Object.keys(toc);
  const updated = (src.match(/const UPDATED = '([^']+)'/) || [])[1];
  const vars = {
    'legal.entity': legal.entity,
    'legal.address': legal.address,
    'legal.phone': legal.phone,
    'brand.company': brand.company,
    'brand.domain': brand.domain,
    'brand.product': brand.product,
    "'tel:' + legal.phoneTel": 'tel:' + legal.phoneTel,
  };
  let body = src.slice(src.indexOf('<div className="mt-12 grid gap-12">'), src.lastIndexOf('</main>'));
  body = body
    .replace(/<Section id="([a-z-]+)">/g, (_, id) => `<section id="${id}"><h2>${order.indexOf(id) + 1}. ${esc(toc[id])}</h2>`)
    .replace(/<\/Section>/g, '</section>')
    .replace(/<Email \/>/g, `<a href="mailto:${brand.email}">${brand.email}</a>`)
    .replace(/<CookieSettingsLink \/>/g, 'Cookie settings')
    .replace(/\{' '\}/g, ' ')
    .replace(/=\{([^}]+)\}/g, (m, expr) => (expr in vars ? `="${esc(vars[expr])}"` : ''))
    .replace(/\{([^}]+)\}/g, (m, expr) => (expr in vars ? esc(vars[expr]) : ''))
    .replace(/\s(className|target|rel)="[^"]*"/g, '')
    .replace(/\s+/g, ' ');
  if (/<[A-Z]|\{|\}/.test(body)) throw new Error('privacy prerender: unconverted JSX left in the policy body');
  const intro = `<p>This policy explains how ${esc(legal.entity)} ("${esc(brand.company)}", "we", "us") collects, uses, shares and protects personal information when you visit ${esc(
    brand.domain
  )} (the "Site"), contact us, book a demo or otherwise talk to us as a prospective customer. It also explains your choices and rights.</p>`;
  render(
    '/privacy',
    { ...site.privacyMeta, jsonld: [graph(breadcrumbs([['Home', '/'], ['Privacy Policy', '/privacy']]))] },
    `<h1>Privacy Policy</h1><p>Last updated: ${esc(updated)}</p>${intro}${body}`
  );
}

// Blog index
render(
  '/blog',
  {
    title: blog.metaTitle,
    description: blog.metaDescription,
    image: og('home'),
    jsonld: [graph({ '@type': 'Blog', name: 'Divine Tech AI Blog', url: abs('/blog'), publisher: { '@id': ORG_ID }, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(postPath(p.slug)), datePublished: p.date })) })],
  },
  `<h1>${esc(blog.title)}</h1><p>${esc(blog.intro)}</p><ul>${posts
    .map((p) => `<li><a href="${postPath(p.slug)}">${esc(p.title)}</a> <time datetime="${p.date}">${fmt(p.date)}</time><p>${esc(p.dek)}</p></li>`)
    .join('')}</ul>`
);

// Posts
for (const p of posts) {
  const path = postPath(p.slug);
  render(
    path,
    { title: p.titleTag, description: p.description, image: SITE_URL + p.image.og, imageHeight: 675, type: 'article', jsonld: p.schema },
    `<article><p><a href="/blog">Blog</a> · ${esc(p.category)}</p><h1>${esc(p.title)}</h1><p>${esc(p.dek)}</p><p>${esc(p.author)} · <time datetime="${p.date}">${fmt(p.date)}</time></p><img src="${p.image.base}-1600.webp" alt="${esc(p.image.alt)}" width="1600" height="900" />${p.bodyHtml}</article>`
  );
}

// 404: Netlify serves this for any path without a file, with status 404. React then shows the not-found page.
writeFileSync(
  join(dist, '404.html'),
  withBody(
    setMeta(template, { title: 'Page not found · Divine Tech AI', description: 'This page does not exist on divine-tech.ai.', path: '/404', noindex: true }),
    page('<h1>This page does not exist.</h1><p><a href="/">Go to the home page</a></p>')
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
