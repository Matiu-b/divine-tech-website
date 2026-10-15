import React from 'react';
import { Plus } from 'lucide-react';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

/**
 * Questions and answers as native <details>, so they open without JavaScript and every
 * answer is in the HTML for search and AI crawlers. Used on the home and industry pages.
 * @param {{ id: string, items: [string, string][], eyebrow?: string, title?: string, className?: string }} props
 */
export default function Faq({ id, items, eyebrow = 'Questions', title = 'Good to know.', className = '', more = null }) {
  return (
    <section id="faq" data-nav-theme="light" aria-labelledby={id} className={'section relative ' + className}>
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader id={id} eyebrow={eyebrow} titleA={title} size="t-h2" />
        </div>
        <Reveal className="lg:col-span-8">
          <div className="border-b border-ink/10">
            {items.map(([q, a]) => (
              <details key={q} className="group border-t border-ink/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  <h3 className="font-medium">{q}</h3>
                  <Plus className="h-4 w-4 shrink-0 text-ink/50 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.8} aria-hidden="true" />
                </summary>
                <p className="max-w-[55.37em] pb-6 text-[14px] leading-relaxed text-graphite">{a}</p>
              </details>
            ))}
          </div>
          {more}
        </Reveal>
      </div>
    </section>
  );
}
