import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { outcomes } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import OutcomeScene from './OutcomeScenes';
import { useInViewport, usePageVisible } from './hooks';

const BG = [
  'bg-[linear-gradient(160deg,#EEF0EA_0%,#E3E7DF_100%)]',
  'bg-[linear-gradient(160deg,#F1EDE6_0%,#E7E1D6_100%)]',
  'bg-[linear-gradient(160deg,#E9F1EC_0%,#DCE9E1_100%)]',
];
const ADVANCE_MS = 5000;

// Savings, efficiency, profitability, each with a small drawn scene (no figures until there
// is pilot data behind them). Three columns on desktop; on phones a swipeable carousel that
// moves on by itself until the visitor swipes.
export default function Outcomes() {
  const items = outcomes.items;
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  // Time of our own last scroll, so only the visitor's swipes stop the auto-advance.
  const autoAt = useRef(0);
  const reduce = useReducedMotion();
  const inView = useInViewport(track, { threshold: 0.4 });
  const visible = usePageVisible();

  // Which card is showing (phones only; on desktop the track does not scroll).
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : el.clientWidth;
      setActive(Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / (w + 12)))));
      if (Date.now() - autoAt.current > 1000) setTouched(true);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [items.length]);

  const go = (i) => {
    const el = track.current;
    const card = el && el.children[i];
    autoAt.current = Date.now();
    if (card) el.scrollTo({ left: i * (card.getBoundingClientRect().width + 12), behavior: reduce ? 'auto' : 'smooth' });
  };

  // Auto-advance on phones while in view, until the visitor takes over.
  useEffect(() => {
    if (reduce || touched || !inView || !visible) return undefined;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 767px)').matches) return undefined;
    const id = window.setTimeout(() => go((active + 1) % items.length), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, touched, inView, visible, reduce, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="outcomes" data-nav-theme="light" aria-labelledby="outcomes-title" className="section relative">
      <div className="shell">
        <SectionHeader id="outcomes-title" titleA={outcomes.titleA} text={outcomes.text} layout="split" />

        <div
          ref={track}
          className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
          aria-roledescription="carousel"
        >
          {items.map((o, i) => (
            <article
              key={o.key}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${o.label}`}
              className="w-[86%] shrink-0 snap-start xs:w-[78%] md:w-auto"
            >
              <Reveal delay={i * 0.08} className="flex flex-col">
                <div className={cn('overflow-hidden rounded-[22px] px-4 pb-2 pt-5', BG[i])}>
                  <OutcomeScene kind={o.key} />
                </div>
                <div className="px-1 pt-5 md:pt-6">
                  <p className="text-[12.5px] font-medium uppercase tracking-[0.08em] text-brand-ink">{o.label}</p>
                  <h3 className="mt-2 text-[21px] font-normal leading-[1.2] tracking-[-0.02em] text-ink md:text-[23px]">{o.title}</h3>
                  <p className="mt-2.5 max-w-[36ch] text-[15px] leading-relaxed text-graphite">{o.text}</p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>

        {/* phone pager: one bar per card, the active one fills while it waits to move on */}
        <div className="mt-6 flex gap-2 md:hidden">
          {items.map((o, i) => (
            <button
              key={o.key}
              type="button"
              onClick={() => {
                setTouched(true);
                go(i);
              }}
              aria-label={`Show ${o.label}`}
              aria-current={i === active ? 'true' : undefined}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <span
                key={`${active}-${touched}`}
                className={cn('absolute inset-y-0 left-0 rounded-full bg-ink', i < active || (i === active && (touched || reduce)) ? 'w-full' : 'w-0')}
                style={i === active && !touched && !reduce ? { animation: `outcomes-fill ${ADVANCE_MS}ms linear forwards` } : undefined}
              />
            </button>
          ))}
        </div>
        <style>{'@keyframes outcomes-fill { from { width: 0 } to { width: 100% } }'}</style>

        <Reveal delay={0.1}>
          <p className="mt-8 border-t border-ink/10 pt-6 text-[15px] text-graphite md:mt-14">{outcomes.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
