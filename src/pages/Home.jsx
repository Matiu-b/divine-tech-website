import React from 'react';
import SiteLayout from '@/components/home-v2/SiteLayout';
import Hero from '@/components/home-v2/Hero';
import Platform from '@/components/home-v2/Platform';
import Outcomes from '@/components/home-v2/Outcomes';
import Configure from '@/components/home-v2/Configure';
import IndustryCards from '@/components/home-v2/IndustryCards';
import FinalCTA from '@/components/home-v2/FinalCTA';
import Faq from '@/components/home-v2/Faq';
import { homeFaq, homeMeta } from '@/data/site';

// Home: one story, no repeats. What Aurora does (hero), how it sits between
// channels and systems (links to /platform, where the product film, capabilities,
// teams and control live), how it goes live, who it is for (each industry has
// its own page), and the demo form.
export default function Home() {
  return (
    <SiteLayout meta={homeMeta}>
      <Hero />
      <Platform />
      <Outcomes />
      <Configure />
      <IndustryCards />
      <Faq id="home-faq-title" items={homeFaq} title="Questions about Aurora." />
      <FinalCTA />
    </SiteLayout>
  );
}
