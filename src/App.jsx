import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { LazyMotion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { trackMetaPageView } from '@/lib/metaPixel';
import ScrollToTop from './components/ScrollToTop';
import ConsentBanner from './components/ConsentBanner';
import { Page } from '@/pages/routes';

// Animation features (including layout animations) load in their own chunk after the first render;
// components use `m` from framer-motion, which needs them.
export const motionFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

// Meta PageView on first load and on every client-side route change.
function MetaPageViews() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackMetaPageView();
  }, [pathname]);
  return null;
}

/** Everything inside the router. The browser wraps it in BrowserRouter, the prerender (src/entry-server.jsx) in StaticRouter. */
export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <MetaPageViews />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/platform" element={<Page name="platform" />} />
          <Route path="/industries/:slug" element={<Page name="industry" />} />
          <Route path="/blog" element={<Page name="blog" />} />
          <Route path="/blog/:slug" element={<Page name="post" />} />
          <Route path="/privacy" element={<Page name="privacy" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <ConsentBanner />
    </>
  );
}

function App() {
  return (
    <LazyMotion features={motionFeatures} strict>
      <Router>
        <AppRoutes />
      </Router>
    </LazyMotion>
  );
}

export default App
