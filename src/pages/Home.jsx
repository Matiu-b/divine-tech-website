import React from 'react';
import SiteLayout from '@/components/home-v2/SiteLayout';
import Hero from '@/components/home-v2/Hero';
import Platform from '@/components/home-v2/Platform';
import Configure from '@/components/home-v2/Configure';
import IndustryCards from '@/components/home-v2/IndustryCards';
import Teams from '@/components/home-v2/Teams';
import Security from '@/components/home-v2/Security';
import FinalCTA from '@/components/home-v2/FinalCTA';

// Home: one story, no repeats. What Aurora does (hero film), how it sits between
// channels and systems, how it goes live, who it is for (each industry has its
// own page), the roles it covers, control, and the demo form.
export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Platform />
      <Configure />
      <IndustryCards />
      <Teams />
      <Security />
      <FinalCTA />
    </SiteLayout>
  );
}
