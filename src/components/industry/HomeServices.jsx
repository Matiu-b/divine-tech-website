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
      <div className="mt-2 flex justify-center gap-1.5 max-sm:hidden">
        {list.map((x, i) => (
          <span key={x.time} className={cn('h-1.5 rounded-full transition-all duration-300', i === k ? 'w-4 bg-ink/70' : 'w-1.5 bg-ink/20')} />
        ))}
      </div>
    </LiquidGlass>
  );
}

/**
 * Hero: one cinematic frame, a technician walking up to a customer's door at dusk. The promise sits in the sky; the
 * panel shows one moment of the day and what Aurora did in it for a customer and for the team. Phones: the promise,
 * then the photo with the panel under its bottom edge. The photo takes a looping clip when there is one.
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
    <section id="top" data-nav-theme="light" aria-labelledby="hs-hero-title" className="relative overflow-hidden pb-[clamp(56px,6vw,88px)] pt-[calc(var(--nav-h)+6px)] min-[560px]:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        {/*
          One cinematic frame, as tall as the screen allows on laptops: the promise in the dusk sky at the top left, the
          moment panel at the bottom right over the lawn. Phones: the promise above, the photo, the panel under its edge.
        */}
        <div ref={ref} className="relative">
          <div className="relative min-[560px]:aspect-[4/5] min-[560px]:overflow-hidden min-[560px]:rounded-[28px] min-[560px]:shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)] md:aspect-square lg:aspect-auto lg:h-[clamp(600px,calc(100svh_-_var(--nav-h)_-_40px),860px)]">
            <div className="relative z-[2] min-[560px]:absolute min-[560px]:inset-x-0 min-[560px]:top-0 min-[560px]:p-8 lg:p-10 lg:pr-[46%] xl:p-12 xl:pr-[48%]">
              <p className="intro-rise eyebrow min-[560px]:text-white/75">{H.eyebrow}</p>
              <h1 id="hs-hero-title" className="t-display balance mt-3 max-[559px]:text-[2.35rem] max-[559px]:leading-[1.04] min-[560px]:text-white min-[560px]:[text-shadow:0_2px_24px_rgba(10,16,40,0.35)] lg:text-[clamp(2.3rem,0.4rem+2.8vw,3.6rem)]">
                <RevealLines lines={[H.titleA, H.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
              </h1>
              <p className="intro-slide t-lead pretty mt-4 max-w-[34em] min-[560px]:!text-white/[0.88] lg:text-[16px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
                <span className="sm:hidden">{H.textShort}</span>
                <span className="max-sm:hidden">{H.text}</span>
              </p>
              <div className="intro-slide mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 lg:mt-7" style={{ animationDelay: '0.42s' }}>
                <CTAButton size="lg" onClick={open} className={btn}>
                  Book a demo
                </CTAButton>
                <CTAButton size="lg" variant="glass" href={H.secondaryHref} arrow={false} onClick={(e) => onAnchorClick(e, H.secondaryHref)} className={btn}>
                  {H.secondary}
                </CTAButton>
              </div>
            </div>

            <figure className="intro-rise relative m-0 mt-5 aspect-[16/9] overflow-hidden rounded-[24px] bg-[#2B3550] max-[559px]:shadow-[0_30px_60px_-40px_rgba(30,30,60,0.55)] min-[560px]:absolute min-[560px]:inset-0 min-[560px]:mt-0 min-[560px]:aspect-auto min-[560px]:rounded-none" style={{ animationDelay: '0.2s' }}>
              <img
                src={m.poster}
                srcSet={m.srcSet}
                sizes="(min-width: 1440px) 1376px, calc(100vw - 32px)"
                alt={m.alt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full origin-[50%_74%] scale-[1.45] object-cover min-[560px]:scale-100"
                style={{ objectPosition: m.focus }}
              />
              {m.video && !reduce ? (
                <video ref={videoRef} src={m.video} poster={m.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.focus }} />
              ) : null}
              {/* dusk shade: deeper behind the headline, a little along the bottom */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(14,20,44,0.55)_0%,rgba(14,20,44,0.18)_38%,rgba(14,20,44,0)_58%,rgba(14,20,44,0.28)_100%)] min-[560px]:block" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(60%_55%_at_0%_0%,rgba(14,20,44,0.45),rgba(14,20,44,0))] lg:block" />
            </figure>

            <div className="relative z-[3] mx-3 -mt-6 min-[560px]:absolute min-[560px]:bottom-5 min-[560px]:right-5 min-[560px]:mx-0 min-[560px]:mt-0 min-[560px]:w-[330px] lg:bottom-8 lg:right-8 lg:w-[400px] xl:w-[420px]">
              <Moments running={inView && visible} still={reduce} />
            </div>
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
