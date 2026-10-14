import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { teams } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { EVENT_ICONS } from './eventIcons';
import { useInViewport, usePageVisible } from './hooks';

const ADVANCE_MS = 5000;
const GAP = 12;

// Card colours: Aurora's warm range, one per team, in the spirit of a bento grid.
const TONE = {
  sales: {
    bg: 'linear-gradient(155deg,#E2461B 0%,#F2672E 48%,#FF9F45 100%)',
    glow: 'radial-gradient(60% 50% at 85% 0%,rgba(255,214,150,0.55),rgba(255,214,150,0) 70%)',
    head: 'text-white',
    sub: 'text-white/70',
    out: 'bg-ink text-white',
  },
  service: {
    bg: 'linear-gradient(155deg,#FFAA3B 0%,#FFC857 52%,#FFE3A8 100%)',
    glow: 'radial-gradient(60% 50% at 15% 0%,rgba(255,255,255,0.55),rgba(255,255,255,0) 70%)',
    head: 'text-ink',
    sub: 'text-ink/60',
    out: 'bg-ink text-white',
  },
  internal: {
    bg: 'linear-gradient(155deg,#15100D 0%,#2B1A12 55%,#6E3016 100%)',
    glow: 'radial-gradient(55% 45% at 90% 100%,rgba(242,92,42,0.45),rgba(242,92,42,0) 70%)',
    head: 'text-white',
    sub: 'text-white/60',
    out: 'bg-[#F25C2A] text-white',
  },
};

const STEP_MS = 1400;
const HOLD_MS = 3800;

/**
 * Plays a card's steps one by one, holds, and starts again while the card is on screen.
 * The prerendered HTML shows every step; after hydration the card waits empty until it is seen.
 */
function useLoop(n, active, still, offset) {
  const [shown, setShown] = useState(n);
  useEffect(() => {
    if (!still) setShown(0);
  }, [still]);
  useEffect(() => {
    if (still || !active) return undefined;
    let timers = [];
    const run = (lead) => {
      timers = [];
      setShown(0);
      for (let k = 1; k <= n; k += 1) timers.push(window.setTimeout(() => setShown(k), lead + 450 + (k - 1) * STEP_MS));
      timers.push(window.setTimeout(() => run(0), lead + 450 + (n - 1) * STEP_MS + HOLD_MS));
    };
    run(offset);
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, still, n, offset]);
  return still ? n : shown;
}

/** One step of a card's scene: a message, Aurora's reply, its checks, an approval or the result. */
function Step({ s, tone, on }) {
  const Icon = s.icon ? EVENT_ICONS[s.icon] : null;
  const motion = cn('transition-[opacity,transform] duration-500 ease-out', on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0');
  if (s.kind === 'in') {
    return <p className={cn(motion, 'w-fit max-w-[84%] rounded-[16px] rounded-bl-[6px] bg-white px-3.5 py-2 text-[12.5px] leading-snug text-ink shadow-[0_8px_20px_-12px_rgba(40,20,10,0.45)]')}>{s.text}</p>;
  }
  if (s.kind === 'out') {
    return <p className={cn(motion, 'ml-auto w-fit max-w-[84%] rounded-[16px] rounded-br-[6px] px-3.5 py-2 text-[12.5px] leading-snug', tone.out)}>{s.text}</p>;
  }
  if (s.kind === 'work') {
    return (
      <ul className={cn(motion, 'ml-auto grid w-fit gap-1 rounded-[14px] bg-white/90 px-3 py-2 text-[12px] text-ink shadow-[0_8px_20px_-12px_rgba(40,20,10,0.45)]')}>
        {s.items.map((x) => (
          <li key={x} className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-[#2E9A58]" strokeWidth={2.4} aria-hidden="true" />
            {x}
          </li>
        ))}
      </ul>
    );
  }
  if (s.kind === 'approve') {
    return (
      <div className={cn(motion, 'rounded-[16px] bg-white p-3 shadow-[0_10px_24px_-14px_rgba(40,20,10,0.5)]')}>
        <p className="text-[12.5px] font-medium text-ink">{s.title}</p>
        <p className="mt-0.5 text-[11px] text-slate">{s.who}</p>
        <div className="mt-2 flex gap-1.5">
          <span className="flex h-7 flex-1 items-center justify-center rounded-full bg-ink text-[11.5px] font-medium text-white">Approve</span>
          <span className="flex h-7 flex-1 items-center justify-center rounded-full text-[11.5px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.12)]">Decline</span>
        </div>
      </div>
    );
  }
  return (
    <div className={cn(motion, 'flex items-center gap-3 rounded-[16px] bg-white p-3 shadow-[0_12px_28px_-14px_rgba(40,20,10,0.55)]')}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#FFF1E6] text-[#D9481C]">
        {Icon ? <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">{s.title}</span>
        <span className="block truncate text-[11.5px] text-slate">{s.detail}</span>
      </span>
      <Check className="h-4 w-4 shrink-0 text-[#2E9A58]" strokeWidth={2.4} aria-hidden="true" />
    </div>
  );
}

/** The card's visual: a coloured panel where the agent finishes one task, on a loop. */
function Scene({ t, i }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35 });
  const visible = usePageVisible();
  const steps = t.scene.steps;
  const shown = useLoop(steps.length, inView && visible, !!reduce, i * 500);
  const tone = TONE[t.key] || TONE.sales;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="canvas-grain relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[5/6] lg:aspect-[4/5]"
      style={{ backgroundImage: tone.glow + ',' + tone.bg }}
    >
      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
        <span className={cn('flex items-center gap-2 text-[13px] font-medium', tone.head)}>
          <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="h-5 w-5 rounded-full bg-white p-[3px]" />
          {t.agent}
        </span>
        <span className={cn('text-[11.5px]', tone.sub)}>{t.scene.channel}</span>
      </div>
      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2">
        {steps.map((s, k) => (
          <Step key={k} s={s} tone={tone} on={k < shown} />
        ))}
      </div>
    </div>
  );
}

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
      <Scene t={t} i={i} />

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
