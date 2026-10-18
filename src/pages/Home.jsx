import React from 'react';
import SiteLayout from '@/components/home-v2/SiteLayout';
import Hero from '@/components/home-v2/Hero';
import HearAurora from '@/components/home-v2/HearAurora';
import DayLanes from '@/components/home-v2/DayLanes';
import LiveSteps from '@/components/home-v2/LiveSteps';
import IndustryCards from '@/components/home-v2/IndustryCards';
import Faq from '@/components/home-v2/Faq';
import Closing from '@/components/home-v2/Closing';
import { homeClosing, homeFaq, homeMeta } from '@/data/site';

/** What happens after the form, in three short beats (under the closing headline). */
function NextSteps({ grow }) {
  return (
    <ol className="grid gap-3">
      {homeClosing.next.map((x, i) => (
        <li
          key={x.text}
          className="flex items-center gap-4 transition-all duration-700"
          style={{ opacity: grow ? 1 : 0, transform: grow ? 'none' : 'translateY(8px)', transitionDelay: `${0.2 + i * 0.15}s` }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[13px] font-medium text-white">{i + 1}</span>
          <span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#FFC857]/80">{x.time}</span>
            <span className="block text-[16px] text-white/85">{x.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

// Home: five scenes, each one screen. Who Aurora works for (customers and the team), what it sounds like, one working
// day behind the scenes, how a business goes live under its own rules, and the industries; then questions and the form.
export default function Home() {
  return (
    <SiteLayout meta={homeMeta}>
      <Hero />
      <HearAurora />
      <DayLanes />
      <LiveSteps />
      <IndustryCards />
      <Faq id="home-faq-title" items={homeFaq} title="Questions about Aurora." visible={6} />
      <Closing c={homeClosing} art={(grow) => <NextSteps grow={grow} />} />
    </SiteLayout>
  );
}
