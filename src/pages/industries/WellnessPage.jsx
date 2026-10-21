import React from 'react';
import { industryBySlug } from '@/data/industries';
import { wellness } from '@/data/wellness';
import { postPath } from '@/data/postPath';
import SiteLayout from '@/components/home-v2/SiteLayout';
import Faq from '@/components/home-v2/Faq';
import OtherIndustries from '@/components/industry/OtherIndustries';
import { RxFaqMore } from '@/components/industry/CallHero';
import { WxClosing, WxClinics, WxCycle, WxDesk, WxHero, WxJournal, WxWeek } from '@/components/industry/Wellness';

// Its own chunk (src/pages/routes.jsx), so visitors to the other industry pages don't download it.
const it = { ...industryBySlug['wellness-healthcare'], wx: wellness };

/** Wellness & Healthcare: its own design, one studio's story, then clinics. */
export default function WellnessPage() {
  return (
    <SiteLayout key={it.slug} industry={it.leadIndustry} meta={it.meta}>
      <WxHero it={it} />
      <WxDesk it={it} />
      <WxWeek it={it} />
      <WxCycle it={it} />
      <WxClinics it={it} />
      <WxJournal it={it} />
      <Faq id="ind-faq-title" items={it.faq} visible={it.faqVisible || 0} className="pt-0" more={it.wx.faqMore ? <RxFaqMore m={it.wx.faqMore} guide={it.article ? postPath(it.article) : null} /> : null} />
      <OtherIndustries it={it} />
      <WxClosing it={it} />
    </SiteLayout>
  );
}
