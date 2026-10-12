import React from 'react';
import { useLocation } from 'react-router-dom';
import usePageMeta from '@/lib/usePageMeta';
import { LeadProvider } from './LeadDrawer';
import SafeBoundary from './primitives/SafeBoundary';
import Nav from './Nav';
import Footer from './Footer';

/**
 * Shared shell for marketing pages: skip link, nav, main, footer and the demo drawer.
 * Each section sits in its own error boundary, so one failing section never takes the page down.
 * @param {any} props
 */
export default function SiteLayout({ children, industry = '', meta = undefined }) {
  const { pathname } = useLocation();
  usePageMeta(meta, pathname);
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
