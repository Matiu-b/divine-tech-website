// Build-time renderer for scripts/prerender.mjs: turns a route into the same HTML React renders in
// the browser, so the first paint is the designed page rather than a blank or plain-text one.
// main.jsx then hydrates this HTML instead of replacing it.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LazyMotion } from 'framer-motion';
import { AppRoutes, motionFeatures } from '@/App';
import { pageForPath, preloadPage } from '@/pages/routes';

/** @param {string} url path such as '/platform' */
export async function render(url) {
  const page = pageForPath(url);
  // Load the page's chunk first, so it renders in place instead of as a Suspense fallback.
  if (page) await preloadPage(page);
  return renderToString(
    <LazyMotion features={motionFeatures} strict>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </LazyMotion>
  );
}
