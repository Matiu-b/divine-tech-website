import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hsClosing, hsHero as H } from '@/data/homeServices';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import { RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { EVENT_ICONS } from '@/components/home-v2/eventIcons';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick, useInViewport, useMediaQuery, usePageVisible } from '@/components/home-v2/hooks';
import Closing from '@/components/home-v2/Closing';

const EASE = [0.22, 1, 0.36, 1];
const LANE = { customers: '#F25C2A', team: '#14A36B' };
const CARD_H = 60;
const GAP = 8;

/**
 * Aurora's work arriving over the photo, one card at a time: one for a customer, then one for the team. Each new card
 * lands on top and pushes the others down; the oldest fades out. Each card says which side it was for.
 */
function Feed({ events, slots, running, still }) {
  const [head, setHead] = useState(slots);
  useEffect(() => {
    if (!running || still) return undefined;
    const id = window.setInterval(() => setHead((n) => n + 1), 2800);
    return () => window.clearInterval(id);
  }, [running, still]);
  const items = Array.from({ length: slots }, (_, i) => {
    const n = head - 1 - i;
    return { n, i, e: events[((n % events.length) + events.length) % events.length] };
  });
  return (
    <div className="relative" style={{ height: slots * (CARD_H + GAP) - GAP }} aria-hidden="true">
      <AnimatePresence initial={false}>
        {items.map(({ n, i, e }) => {
          const Icon = EVENT_ICONS[e.icon] || CalendarCheck;
          return (
            <LiquidGlass
              as={motion.div}
              key={n}
              className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-[18px] px-3"
              style={{ height: CARD_H }}
              initial={still ? false : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: i * (CARD_H + GAP) }}
              exit={{ opacity: 0, y: slots * (CARD_H + GAP) - GAP - CARD_H + 18 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/85 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium leading-tight text-ink">{e.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-graphite">{e.detail}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-2 py-0.5 text-[10.5px] font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: LANE[e.lane] }} />
                {H.lanes[e.lane]}
              </span>
            </LiquidGlass>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hero: the promise on the left; on the right a technician on a job, with Aurora's work for customers and for the
 * team arriving over the photo. Phones: the text, then the photo. Laptops: both side by side, one screen tall.
 * The photo takes a looping clip when there is one.
 */
export function HsHero() {
  const { open } = useLead();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const wide = useMediaQuery('(min-width: 1024px)');
  const m = H.media;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && visible) v.play().catch(() => {});
    else v.pause();
  }, [inView, visible]);

  const btn = 'max-sm:h-12 max-sm:px-4 max-sm:text-[14.5px] lg:h-12 lg:px-5 lg:text-[15px]';
  return (
    <section id="top" data-nav-theme="light" aria-labelledby="hs-hero-title" className="relative overflow-hidden pb-[clamp(56px,6vw,88px)] pt-[calc(var(--nav-h)+24px)] lg:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative grid gap-7 md:gap-9 lg:h-[clamp(560px,calc(100svh_-_var(--nav-h)_-_40px),820px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
        <div>
          <p className="intro-rise eyebrow">{H.eyebrow}</p>
          <h1 id="hs-hero-title" className="t-display balance mt-4 lg:text-[clamp(2.1rem,0.3rem+2.5vw,3.3rem)]">
            <RevealLines lines={[H.titleA, H.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
          </h1>
          <p className="intro-slide t-lead pretty mt-5 max-w-[34em] lg:text-[16px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
            <span className="sm:hidden">{H.textShort}</span>
            <span className="max-sm:hidden">{H.text}</span>
          </p>
          <div className="intro-slide mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 lg:mt-8" style={{ animationDelay: '0.42s' }}>
            <CTAButton size="lg" onClick={open} className={btn}>
              Book a demo
            </CTAButton>
            <CTAButton size="lg" variant="glass" href={H.secondaryHref} arrow={false} onClick={(e) => onAnchorClick(e, H.secondaryHref)} className={btn}>
              {H.secondary}
            </CTAButton>
          </div>
        </div>

        <figure ref={ref} className="intro-rise relative m-0 aspect-[4/3] overflow-hidden rounded-[24px] bg-[#D9D2C4] shadow-[0_40px_80px_-48px_rgba(60,40,20,0.55)] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-[28px]" style={{ animationDelay: '0.3s' }}>
          <img
            src={m.poster}
            srcSet={m.srcSet}
            sizes="(min-width: 1024px) 760px, calc(100vw - 32px)"
            alt={m.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: m.focus }}
          />
          {m.video && !reduce ? (
            <video ref={videoRef} src={m.video} poster={m.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.focus }} />
          ) : null}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(20,16,12,0.35),rgba(20,16,12,0))]" />
          <div className="absolute inset-x-3 bottom-3 sm:bottom-4 sm:left-auto sm:right-4 sm:w-[350px] lg:bottom-6 lg:right-6 lg:w-[360px]">
            <Feed events={H.events} slots={wide ? 3 : 2} running={inView && visible} still={reduce} />
          </div>
          <ul className="sr-only">
            {H.events.map((e) => (
              <li key={e.title}>
                {H.lanes[e.lane]}: {e.title}, {e.detail}
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}

/** What happens after the form, in three short beats (under the closing headline). */
function NextSteps({ grow }) {
  return (
    <ol className="grid gap-3">
      {hsClosing.next.map((x, i) => (
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

export function HsClosing({ it }) {
  return <Closing c={hsClosing} industry={it.leadIndustry} art={(grow) => <NextSteps grow={grow} />} />;
}
