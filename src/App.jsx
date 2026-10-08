import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { trackMetaPageView } from '@/lib/metaPixel';
import ScrollToTop from './components/ScrollToTop';
import ConsentBanner from './components/ConsentBanner';
import Home from '@/pages/Home';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

// Meta PageView on first load and on every client-side route change.
function MetaPageViews() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackMetaPageView();
  }, [pathname]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <MetaPageViews />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <ConsentBanner />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
