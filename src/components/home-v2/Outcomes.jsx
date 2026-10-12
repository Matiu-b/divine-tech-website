import React from 'react';
import { cn } from '@/lib/utils';
import { outcomes } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import OutcomeScene from './OutcomeScenes';

// Savings, efficiency, profitability: each with a small drawn scene (no figures until there
// is pilot data behind them).
export default function Outcomes() {
  return (
    <section id="outcomes" data-nav-theme="light" aria-labelledby="outcomes-title" className="section relative">
      <div className="shell">
        <SectionHeader id="outcomes-title" titleA={outcomes.titleA} text={outcomes.text} layout="split" />

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {outcomes.items.map((o, i) => (
            <Reveal key={o.key} delay={i * 0.08} className="flex flex-col">
              <div
                className={cn(
                  'overflow-hidden rounded-[22px] px-4 pb-2 pt-5',
                  i === 0 && 'bg-[linear-gradient(160deg,#EEF0EA_0%,#E3E7DF_100%)]',
                  i === 1 && 'bg-[linear-gradient(160deg,#F1EDE6_0%,#E7E1D6_100%)]',
                  i === 2 && 'bg-[linear-gradient(160deg,#E9F1EC_0%,#DCE9E1_100%)]'
                )}
              >
                <OutcomeScene kind={o.key} />
              </div>
              <div className="px-1 pt-5 md:pt-6">
                <p className="text-[12.5px] font-medium uppercase tracking-[0.08em] text-brand-ink">{o.label}</p>
                <h3 className="mt-2 text-[21px] font-normal leading-[1.2] tracking-[-0.02em] text-ink md:text-[23px]">{o.title}</h3>
                <p className="mt-2.5 max-w-[36ch] text-[15px] leading-relaxed text-graphite">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 border-t border-ink/10 pt-6 text-[15px] text-graphite md:mt-14">{outcomes.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
