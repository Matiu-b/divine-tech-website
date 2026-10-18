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
import { onAnchorClick, useInViewport, usePageVisible } from '@/components/home-v2/hooks';
import Closing from '@/components/home-v2/Closing';

const EASE = [0.22, 1, 0.36, 1];
const LANE = { customers: '#F25C2A', team: '#14A36B' };

/**
 * Over the photo: one moment of the day, and what Aurora did in it on both sides, for a customer and for the team.
 * Each side first shows Aurora at work, then what got done, with a check; then the next moment.
 */
function Moments({ running, still }) {
  const list = H.moments;
  const [k, setK] = useState(0);
  const [phase, setPhase] = useState(still ? 2 : 0);
  useEffect(() => {
    if (still) {
      setPhase(2);
      return undefined;
    }
    if (!running) return undefined;
    setPhase(0);
    const ids = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600), setTimeout(() => setK((x) => (x + 1) % list.length), 4600)];
    return () => ids.forEach(clearTimeout);
  }, [k, running, still, list.length]);
  const mo = list[k];
  return (
    <LiquidGlass className="rounded-[22px] p-2.5 sm:p-3" style={{ '--lg-tint-a': 'rgba(255,252,247,0.86)', '--lg-tint-b': 'rgba(255,249,241,0.78)' }} aria-hidden="true">
      <div className="flex items-center gap-2 px-1.5 pt-0.5">
        <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className="h-3.5 w-3.5" />
        <span className="text-[12.5px] font-medium text-ink">{H.panel.title}</span>
        <span className="ml-auto flex items-center gap-1.5 text-[12.5px] font-medium tabular-nums text-ink/60">
          <span className="relative flex h-2 w-2">
            {still ? null : <span className="absolute inset-0 animate-ping rounded-full bg-[#3DDC97] opacity-60" />}
            <span className="relative h-2 w-2 rounded-full bg-[#14A36B]" />
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={mo.time} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}>
              {mo.time}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="mt-2 grid gap-1.5">
        {['customers', 'team'].map((side, i) => {
          const e = mo[side];
          const Icon = EVENT_ICONS[e.icon] || CalendarCheck;
          const done = phase > i;
          return (
            <div key={side} className="flex items-center gap-3 rounded-[16px] bg-white/75 px-2.5 py-2 shadow-[0_1px_2px_rgba(10,15,14,0.05)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-white transition-colors duration-500" style={{ background: done ? LANE[side] : 'rgba(10,15,14,0.12)' }}>
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-medium uppercase tracking-[0.07em]" style={{ color: LANE[side] }}>
                  {H.sides[side]}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.span key={k + side} className="block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                      <span className="block truncate text-[13.5px] font-medium leading-tight text-ink">{e.title}</span>
                      <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-graphite">{e.detail}</span>
                    </motion.span>
                  ) : (
                    <motion.span key={'w' + side} className="flex h-[32px] items-center gap-1.5 text-[12.5px] text-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      {H.panel.working}
                      <span className="flex gap-0.5">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-1 w-1 animate-pulse rounded-full bg-ink/40" style={{ animationDelay: d * 0.18 + 's' }} />
                        ))}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300', done ? 'scale-100 opacity-100' : 'scale-50 opacity-0')} style={{ background: LANE[side] }}>
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2 5 8.5 9.5 3.5" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>
      {/* where in the day: a dot per moment */}
      <div className="mt-2 flex justify-center gap-1.5">
        {list.map((x, i) => (
          <span key={x.time} className={cn('h-1.5 rounded-full transition-all duration-300', i === k ? 'w-4 bg-ink/70' : 'w-1.5 bg-ink/20')} />
        ))}
      </div>
    </LiquidGlass>
  );
}

/**
 * Hero: the promise on the left; on the right a technician on a job, and over the photo one moment of the day with
 * what Aurora did in it for a customer and for the team. Phones: the text, the photo, the panel under its bottom edge.
 * Laptops: both side by side, one screen tall.
 * The photo takes a looping clip when there is one.
 */
export function HsHero() {
  const { open } = useLead();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const m = H.media;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && visible) v.play().catch(() => {});
    else v.pause();
  }, [inView, visible]);

  const btn = 'max-sm:h-12 max-sm:px-4 max-sm:text-[14.5px] lg:h-12 lg:px-5 lg:text-[15px]';
  return (
    <section id="top" data-nav-theme="light" aria-labelledby="hs-hero-title" className="relative overflow-hidden pb-[clamp(56px,6vw,88px)] pt-[calc(var(--nav-h)+12px)] sm:pt-[calc(var(--nav-h)+24px)] lg:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative grid gap-6 md:gap-9 lg:h-[clamp(560px,calc(100svh_-_var(--nav-h)_-_40px),820px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
        <div>
          <p className="intro-rise eyebrow">{H.eyebrow}</p>
          <h1 id="hs-hero-title" className="t-display balance mt-3 max-sm:text-[2.35rem] max-sm:leading-[1.04] sm:mt-4 lg:text-[clamp(2.1rem,0.3rem+2.5vw,3.3rem)]">
            <RevealLines lines={[H.titleA, H.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
          </h1>
          <p className="intro-slide t-lead pretty mt-4 max-w-[34em] sm:mt-5 lg:text-[16px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
            <span className="sm:hidden">{H.textShort}</span>
            <span className="max-sm:hidden">{H.text}</span>
          </p>
          <div className="intro-slide mt-5 flex flex-wrap sm:mt-6 items-center gap-2.5 sm:gap-3 lg:mt-8" style={{ animationDelay: '0.42s' }}>
            <CTAButton size="lg" onClick={open} className={btn}>
              Book a demo
            </CTAButton>
            <CTAButton size="lg" variant="glass" href={H.secondaryHref} arrow={false} onClick={(e) => onAnchorClick(e, H.secondaryHref)} className={btn}>
              {H.secondary}
            </CTAButton>
          </div>
        </div>

        <div ref={ref} className="intro-rise relative lg:h-full" style={{ animationDelay: '0.3s' }}>
          <figure className="relative m-0 aspect-[16/10] overflow-hidden rounded-[24px] bg-[#D9D2C4] shadow-[0_40px_80px_-48px_rgba(60,40,20,0.55)] lg:aspect-auto lg:h-full lg:rounded-[28px]">
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
          </figure>
          <div className="relative z-[2] mx-3 -mt-14 sm:absolute sm:bottom-4 sm:right-4 sm:mx-0 sm:mt-0 sm:w-[380px] lg:bottom-6 lg:right-6 lg:w-[390px]">
            <Moments running={inView && visible} still={reduce} />
          </div>
          <ul className="sr-only">
            {H.moments.map((x) => (
              <li key={x.time}>
                {x.time}. {H.sides.customers}: {x.customers.title}, {x.customers.detail}. {H.sides.team}: {x.team.title}, {x.team.detail}.
              </li>
            ))}
          </ul>
        </div>
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
