import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

/**
 * Questions and answers as native <details>, so they open without JavaScript and every
 * answer is in the HTML for search and AI crawlers. Used on the home and industry pages. With `visible`, only the
 * first questions show and a button opens the rest; the hidden ones are still in the HTML.
 * @param {{ id: string, items: [string, string][], eyebrow?: string, title?: string, className?: string, more?: any, visible?: number }} props
 */
export default function Faq({ id, items, eyebrow = 'Questions', title = 'Good to know.', className = '', more = null, visible = 0 }) {
  const [all, setAll] = useState(false);
  const cut = visible && visible < items.length ? visible : items.length;
  const extra = items.length - cut;
  return (
    <section id="faq" data-nav-theme="light" aria-labelledby={id} className={'section relative ' + className}>
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader id={id} eyebrow={eyebrow} titleA={title} size="t-h2" />
        </div>
        <Reveal className="lg:col-span-8">
          <div id={id + '-list'} className="border-b border-ink/10">
            {items.map(([q, a], i) => (
              <details key={q} className={'group border-t border-ink/10' + (i >= cut && !all ? ' hidden' : '')}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  <h3 className="font-medium">{q}</h3>
                  <Plus className="h-4 w-4 shrink-0 text-ink/50 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.8} aria-hidden="true" />
                </summary>
                <p className="max-w-[55.37em] pb-6 text-[14px] leading-relaxed text-graphite">{a}</p>
              </details>
            ))}
          </div>
          {extra > 0 ? (
            <button
              type="button"
              aria-expanded={all}
              aria-controls={id + '-list'}
              onClick={() => setAll((v) => !v)}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.12)] transition-shadow hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]"
            >
              {all ? 'Show fewer questions' : `Show ${extra} more questions`}
              <ChevronDown className={'h-4 w-4 transition-transform duration-300' + (all ? ' rotate-180' : '')} strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
          {more}
        </Reveal>
      </div>
    </section>
  );
}
