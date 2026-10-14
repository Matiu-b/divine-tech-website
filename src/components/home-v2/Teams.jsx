import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { teams } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import TeamSketch from './TeamSketch';
import { useInViewport, usePageVisible } from './hooks';

const ADVANCE_MS = 5000;
const GAP = 12;

/**
 * One team, one agent: a coloured scene of the agent at work, then what the team gets.
 * @param {any} props
 */
function TeamCard({ t, i, n }) {
  return (
    <Reveal
      delay={i * 0.08}
      y={28}
      className="flex w-[84%] shrink-0 snap-start flex-col sm:w-[60%] md:w-[46%] lg:w-auto"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${n}: ${t.label}`}
    >
      <TeamSketch t={t} i={i} />

      <div className="flex flex-1 flex-col pt-6 md:pt-7">
        <p className="eyebrow">{t.label}</p>
        <h3 className="t-h3 balance mt-3">{t.title}</h3>
        <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-graphite">{t.line}</p>
        <p className="mt-5 text-[12px] font-medium text-slate">What it moves</p>
        <ul className="mt-2 grid gap-1.5" aria-label="What it moves">
          {t.kpis.map((k) => (
            <li key={k} className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#D9481C]" strokeWidth={2} aria-hidden="true" />
              {k}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/** Three teams: columns on desktop, a swipe carousel that moves on by itself on phones and tablets. */
export default function Teams() {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInViewport(track, { threshold: 0.4 });
  const visible = usePageVisible();
  const n = teams.items.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : el.clientWidth;
      setActive(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / (w + GAP)))));
    };
    const onTouch = () => setTouched(true);
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) setTouched(true);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', onTouch, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('wheel', onWheel);
    };
  }, [n]);

  const go = (i) => {
    const el = track.current;
    const card = el && el.children[i];
    if (card) el.scrollTo({ left: i * (card.getBoundingClientRect().width + GAP), behavior: reduce ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (reduce || touched || !inView || !visible) return undefined;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1023px)').matches) return undefined;
    const id = window.setTimeout(() => go((active + 1) % n), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, touched, inView, visible, reduce, n]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="teams" data-nav-theme="light" aria-labelledby="teams-title" className="section relative">
      <div className="shell">
        <SectionHeader id="teams-title" eyebrow={teams.eyebrow} titleA={teams.titleA} titleB={teams.titleB} text={teams.text} layout="split" />
        <div
          ref={track}
          aria-roledescription="carousel"
          className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] md:mt-16 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 xl:gap-8"
        >
          {teams.items.map((t, i) => (
            <TeamCard key={t.key} t={t} i={i} n={n} />
          ))}
        </div>
        <div className="mt-6 flex gap-2 lg:hidden">
          {teams.items.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTouched(true);
                go(i);
              }}
              aria-label={`Show ${t.label}`}
              aria-current={i === active ? 'true' : undefined}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <span
                key={`${active}-${touched}`}
                className={cn('absolute inset-y-0 left-0 rounded-full bg-ink', i <= active ? 'w-full' : 'w-0')}
                style={i === active && !touched && !reduce ? { animation: `outcomes-fill ${ADVANCE_MS}ms linear forwards` } : undefined}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
