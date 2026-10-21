import React from 'react';
import { industryBySlug } from '@/data/industries';
import { realEstate } from '@/data/realEstate';
import { postPath } from '@/data/postPath';
import SiteLayout from '@/components/home-v2/SiteLayout';
import FinalCTA from '@/components/home-v2/FinalCTA';
import Faq from '@/components/home-v2/Faq';
import OtherIndustries from '@/components/industry/OtherIndustries';
import { RxFaqMore, RxHero } from '@/components/industry/CallHero';
import { RxAfter, RxClosing, RxKpi, RxRace, RxRules, RxStack } from '@/components/industry/RealEstateV3';

// Its own chunk (src/pages/routes.jsx), so visitors to the other industry pages don't download it.
const it = { ...industryBySlug['real-estate'], v3: realEstate };

/** Real estate (v3): the call, the race for the lead, your rules, then what changes. */
export default function RealEstatePage() {
  return (
    <SiteLayout key={it.slug} industry={it.leadIndustry} meta={it.meta}>
      <RxHero it={it} />
      <RxRace it={it} />
      <RxRules it={it} />
      {it.v3.after ? <RxAfter it={it} /> : null}
      {it.v3.after ? <RxKpi it={it} /> : null}
      {it.v3.stack ? <RxStack it={it} /> : null}
      <Faq id="ind-faq-title" items={it.faq} visible={it.faqVisible || 0} className="pt-0" more={it.v3.faqMore ? <RxFaqMore m={it.v3.faqMore} guide={it.article ? postPath(it.article) : null} /> : null} />
      <OtherIndustries it={it} />
      {it.v3.closing ? <RxClosing it={it} /> : <FinalCTA industry={it.leadIndustry} />}
    </SiteLayout>
  );
}
