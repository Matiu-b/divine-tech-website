import React from 'react';
import { LeadProvider } from '@/components/home-v2/LeadDrawer';
import SafeBoundary from '@/components/home-v2/primitives/SafeBoundary';
import Nav from '@/components/home-v2/Nav';
import Hero from '@/components/home-v2/Hero';
import Statement from '@/components/home-v2/Statement';
import Moment from '@/components/home-v2/Moment';
import Platform from '@/components/home-v2/Platform';
import Capabilities from '@/components/home-v2/Capabilities';
import Demo from '@/components/home-v2/Demo';
import Configure from '@/components/home-v2/Configure';
import Speed from '@/components/home-v2/Speed';
import PhotoDuo from '@/components/home-v2/PhotoDuo';
import Industries from '@/components/home-v2/Industries';
import Teams from '@/components/home-v2/Teams';
import Security from '@/components/home-v2/Security';
import FinalCTA from '@/components/home-v2/FinalCTA';
import Footer from '@/components/home-v2/Footer';

// Each section sits in its own error boundary: if one ever throws while
// rendering, only that section is skipped and the rest of the page stays up.
export default function Home() {
  return (
    <LeadProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="min-h-screen bg-paper text-ink">
        <SafeBoundary>
          <Nav />
        </SafeBoundary>
        <main id="main">
          <SafeBoundary>
            <Hero />
          </SafeBoundary>
          <SafeBoundary>
            <Statement />
          </SafeBoundary>
          <SafeBoundary>
            <Moment />
          </SafeBoundary>
          <SafeBoundary>
            <Platform />
          </SafeBoundary>
          <SafeBoundary>
            <Capabilities />
          </SafeBoundary>
          <SafeBoundary>
            <Demo />
          </SafeBoundary>
          <SafeBoundary>
            <Configure />
          </SafeBoundary>
          <SafeBoundary>
            <Speed />
          </SafeBoundary>
          <SafeBoundary>
            <PhotoDuo />
          </SafeBoundary>
          <SafeBoundary>
            <Industries />
          </SafeBoundary>
          <SafeBoundary>
            <Teams />
          </SafeBoundary>
          <SafeBoundary>
            <Security />
          </SafeBoundary>
          <SafeBoundary>
            <FinalCTA />
          </SafeBoundary>
        </main>
        <SafeBoundary>
          <Footer />
        </SafeBoundary>
      </div>
    </LeadProvider>
  );
}
