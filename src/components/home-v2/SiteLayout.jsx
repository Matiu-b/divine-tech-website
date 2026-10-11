import React, { useEffect } from 'react';
import { LeadProvider } from './LeadDrawer';
import SafeBoundary from './primitives/SafeBoundary';
import Nav from './Nav';
import Footer from './Footer';

const DEFAULT_TITLE = 'Divine Tech AI · Aurora runs the work. Your team runs the business.';

/** Sets the document title and meta description for the current page, restoring the defaults on leave. */
function usePageMeta(meta) {
  useEffect(() => {
    if (!meta) return undefined;
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc ? desc.getAttribute('content') : null;
    document.title = meta.title;
    if (desc && meta.description) desc.setAttribute('content', meta.description);
    return () => {
      document.title = DEFAULT_TITLE;
      if (desc && prevDesc !== null) desc.setAttribute('content', prevDesc);
    };
  }, [meta]);
}

/**
 * Shared shell for marketing pages: skip link, nav, main, footer and the demo drawer.
 * Each section sits in its own error boundary, so one failing section never takes the page down.
 * @param {any} props
 */
export default function SiteLayout({ children, industry = '', meta = undefined }) {
  usePageMeta(meta);
  return (
    <LeadProvider industry={industry}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="min-h-screen bg-paper text-ink">
        <SafeBoundary>
          <Nav />
        </SafeBoundary>
        <main id="main">
          {React.Children.map(children, (child) => (child ? <SafeBoundary>{child}</SafeBoundary> : null))}
        </main>
        <SafeBoundary>
          <Footer />
        </SafeBoundary>
      </div>
    </LeadProvider>
  );
}
