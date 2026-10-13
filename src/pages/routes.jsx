import React, { lazy } from 'react';

// Each page is its own chunk, so a visitor downloads only the page they open. main.jsx loads the
// current page's chunk before the first render (no blank frame over the prerendered HTML); other
// pages load on navigation.
const loaders = {
  home: () => import('./Home'),
  platform: () => import('./PlatformPage'),
  industry: () => import('./IndustryPage'),
  blog: () => import('./Blog'),
  post: () => import('./BlogPost'),
  privacy: () => import('./PrivacyPolicy'),
};

const ready = {};

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
  if (/^\/industries\/[^/]+$/.test(p)) return 'industry';
  return null;
}

/** Renders a page: synchronously once its chunk is loaded, otherwise through React.lazy. */
export function Page({ name }) {
  const C = ready[name] || lazyPages[name];
  return <C />;
}
