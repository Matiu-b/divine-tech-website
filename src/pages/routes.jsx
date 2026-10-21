import React, { lazy } from 'react';
import { useParams } from 'react-router-dom';

// Each page is its own chunk, so a visitor downloads only the page they open. main.jsx loads the
// current page's chunk before the first render (no blank frame over the prerendered HTML); other
// pages load on navigation.
const loaders = {
  home: () => import('./Home'),
  platform: () => import('./PlatformPage'),
  industry: () => import('./IndustryPage'),
  realEstate: () => import('./industries/RealEstatePage'),
  wellness: () => import('./industries/WellnessPage'),
  homeServices: () => import('./industries/HomeServicesPage'),
  blog: () => import('./Blog'),
  post: () => import('./BlogPost'),
  privacy: () => import('./PrivacyPolicy'),
  guide: () => import('./GuidePage'),
};

const ready = {};

// Industries with a design of their own have their own chunk; any other slug uses the shared layout (IndustryPage).
const industryPages = { 'real-estate': 'realEstate', 'wellness-healthcare': 'wellness', 'home-services': 'homeServices' };
const industryPage = (slug) => industryPages[slug] || 'industry';

export function preloadPage(name) {
  return loaders[name]().then((m) => (ready[name] = m.default));
}

const lazyPages = Object.fromEntries(Object.keys(loaders).map((name) => [name, lazy(() => preloadPage(name).then((C) => ({ default: C })))]));

/** The chunk name for a URL path, or null for the not-found page. */
export function pageForPath(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/platform') return 'platform';
  if (p === '/privacy') return 'privacy';
  if (p === '/blog') return 'blog';
  if (/^\/blog\/[^/]+$/.test(p)) return 'post';
  const industry = p.match(/^\/industries\/([^/]+)$/);
  if (industry) return industryPage(industry[1]);
  if (/^\/guides\/[^/]+$/.test(p)) return 'guide';
  return null;
}

/** Renders a page: synchronously once its chunk is loaded, otherwise through React.lazy. */
export function Page({ name }) {
  const C = ready[name] || lazyPages[name];
  return <C />;
}

/** /industries/:slug, as that industry's page. */
export function IndustryRoute() {
  const { slug } = useParams();
  return <Page name={industryPage(slug)} />;
}
