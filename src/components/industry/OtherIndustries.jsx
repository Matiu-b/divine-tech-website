import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { brand } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import SmartLink from '@/components/home-v2/primitives/SmartLink';

/** Near the end of every industry page: links to the other industries and to the home page. */
export default function OtherIndustries({ it }) {
  const others = industries.filter((o) => o.slug !== it.slug);
  return (
    <section data-nav-theme="light" aria-label="Other industries" className="relative pb-[var(--section-y)]">
      <div className="shell">
        <p className="text-[13px] font-medium text-slate">Aurora in other industries</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {others.map((o) => (
            <SmartLink
              key={o.slug}
              href={industryPath(o.slug)}
              className="group flex items-center justify-between gap-6 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] transition-shadow hover:shadow-[0_0_0_1px_rgba(10,15,14,0.12)] md:p-7"
            >
              <span>
                <span className="t-h4 block">{o.label}</span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-graphite">{o.short}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.7} aria-hidden="true" />
            </SmartLink>
          ))}
        </div>
        <SmartLink href="/" className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-graphite hover:text-ink">
          {'See everything ' + brand.product + ' does'}
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </SmartLink>
      </div>
    </section>
  );
}
