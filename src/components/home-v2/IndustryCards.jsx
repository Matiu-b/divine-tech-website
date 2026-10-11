import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { industriesSection } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import SectionHeader from './primitives/SectionHeader';
import SmartLink from './primitives/SmartLink';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';

/** Home page: one card per industry, each leading to that industry's page. */
export default function IndustryCards() {
  return (
    <section id="industries" data-nav-theme="light" aria-labelledby="industries-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="industries-title"
          eyebrow={industriesSection.eyebrow}
          titleA={industriesSection.titleA}
          titleB={industriesSection.titleB}
          text={industriesSection.text}
          layout="split"
        />

        <RevealGroup className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-3" amount={0.1}>
          {industries.map((it) => (
            <RevealItem key={it.slug}>
              <SmartLink
                href={industryPath(it.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_20px_40px_-28px_rgba(10,15,14,0.35)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(10,15,14,0.1),0_30px_60px_-30px_rgba(10,15,14,0.45)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                  <img
                    src={it.how.photo.src}
                    srcSet={it.how.photo.srcSet}
                    sizes="(min-width: 1024px) 420px, calc(100vw - 40px)"
                    alt={it.how.photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="flex w-fit items-center gap-2 rounded-[12px] bg-white/90 px-3 py-2 text-[12px] font-medium text-ink shadow-sm backdrop-blur">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {it.how.chips[1]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="t-h4">{it.label}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-graphite">{it.short}</p>
                  <span className="mt-6 flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
                    Explore {it.label.toLowerCase()}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>
              </SmartLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
