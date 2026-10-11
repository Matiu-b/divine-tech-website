import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { howItWorks as hiw } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport } from './hooks';

// Who does each phase decides its colour on the timeline: ink = you, green = Aurora.
const TONE = { you: 'bg-ink', aurora: 'bg-brand' };
// Relative length of each phase on the 7-day ruler (desktop): scoping, setup, approval.
const SPAN = ['md:col-span-1', 'md:col-span-2', 'md:col-span-1'];

/**
 * How it works (home page): the first week as one timeline. The content really is a
 * sequence in time, so it is drawn as a ruler from day 1 to day 7 with three phases,
 * coloured by who does the work, instead of a row of cards. Horizontal from tablet up,
 * vertical on phones. The bars fill once, in order, when the section comes into view.
 */
export default function Configure() {
  const ref = useRef(null);
  const seen = useInViewport(ref, { threshold: 0.35, once: true });
  const reduce = useReducedMotion();
  const fill = seen || reduce;

  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" titleA={hiw.titleA} titleB={hiw.titleB} text={hiw.text} layout="split" />

        <Reveal className="mt-14 md:mt-20">
          <div ref={ref}>
            <div className="mb-4 hidden justify-between text-[13px] text-slate md:flex" aria-hidden="true">
              <span>Day 1</span>
              <span>Day 7</span>
            </div>
            <p className="mb-4 text-[13px] text-slate md:hidden" aria-hidden="true">
              Day 1
            </p>

            <ol className="grid gap-0 md:grid-cols-4 md:gap-1.5">
              {hiw.steps.map((s, i) => (
                <li key={s.name} className={cn('flex gap-5 md:flex-col md:gap-7', SPAN[i])}>
                  {/* the phase on the ruler */}
                  <span aria-hidden="true" className="relative w-1.5 shrink-0 overflow-hidden rounded-full bg-ink/[0.08] md:h-2 md:w-full">
                    <span
                      className={cn(
                        'absolute inset-0 origin-top rounded-full transition-transform duration-700 ease-out md:origin-left',
                        TONE[s.tone],
                        fill ? 'scale-100' : 'scale-y-0 md:scale-x-0 md:scale-y-100'
                      )}
                      style={{ transitionDelay: reduce ? '0ms' : i * 450 + 'ms' }}
                    />
                  </span>
                  <div className="pb-10 md:pb-0 md:pr-6">
                    <p className="text-[13px] text-slate">{s.who}</p>
                    <h3 className="mt-2 text-[19px] font-medium leading-snug md:text-[21px]">{s.name}</h3>
                    <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-graphite">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="-mt-4 flex items-center gap-2 text-[13px] text-slate md:mt-6 md:justify-end">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              Day 7: live on your channels
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <dl className="grid gap-4 border-t border-ink/10 pt-6 text-[15px] leading-relaxed md:grid-cols-2 md:gap-10">
            {hiw.split.map(([k, v], i) => (
              <div key={k} className="flex gap-3">
                <span aria-hidden="true" className={cn('mt-[0.45em] h-2.5 w-2.5 shrink-0 rounded-[3px]', i === 0 ? 'bg-ink' : 'bg-brand')} />
                <div>
                  <dt className="font-medium text-ink">{k}</dt>
                  <dd className="text-graphite">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
