import React from 'react';
import { industryBySlug } from '@/data/industries';
import { hsField, hsHear, hsLive } from '@/data/homeServices';
import SiteLayout from '@/components/home-v2/SiteLayout';
import Faq from '@/components/home-v2/Faq';
import LiveSteps from '@/components/home-v2/LiveSteps';
import OtherIndustries from '@/components/industry/OtherIndustries';
import FieldMap from '@/components/industry/FieldMap';
import MorningBrief from '@/components/industry/MorningBrief';
import { HsClosing, HsHero } from '@/components/industry/HomeServices';

// Its own chunk (src/pages/routes.jsx), so visitors to the other industry pages don't download it.
const it = industryBySlug['home-services'];

/**
 * Home services, each scene one screen: the promise with the customer call, jobs to the field on the map, the morning
 * brief, going live under your rules, then the form.
 */
export default function HomeServicesPage() {
  return (
    <SiteLayout key={it.slug} industry={it.leadIndustry} meta={it.meta}>
      <HsHero />
      <FieldMap d={hsField} />
      <MorningBrief d={hsHear} />
      <LiveSteps d={hsLive} id="how" />
      <Faq id="ind-faq-title" items={it.faq} className="pt-0" />
      <OtherIndustries it={it} />
      <HsClosing it={it} />
    </SiteLayout>
  );
}
