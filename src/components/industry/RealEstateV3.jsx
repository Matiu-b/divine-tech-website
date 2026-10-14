import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CircleDollarSign, Hand, MessageCircle, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import SmartLink from '@/components/home-v2/primitives/SmartLink';
import { Reveal, RevealGroup, RevealItem, RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { CollageTabs, GrowIn, Message, ResultRow } from '@/components/home-v2/TeamsCollage';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick, useInViewport, usePageVisible } from '@/components/home-v2/hooks';

/*
 * Real estate page, v3. One message per section, in this order:
 * promise (hero) -> the race for every lead -> one AI ISA for every desk -> your rules -> live in hours.
 * Everything sits on the site's warm light ground; the motion is the product at work.
 */

const EASE = [0.22, 1, 0.36, 1];
const HERO_BEATS = [0, 700, 2000, 3300, 4500]; // card, three messages, the result
const HERO_LOOP = 9500;

/** Plays the hero thread on a loop while it is on screen. The prerendered page shows it complete. */
function useHeroBeat(active, still) {
  const last = HERO_BEATS.length - 1;
  const [beat, setBeat] = useState(last);
  useEffect(() => {
    if (still || !active) return undefined;
    let timers = [];
    const run = () => {
      timers = HERO_BEATS.map((t, i) => window.setTimeout(() => setBeat(i), t));
      timers.push(window.setTimeout(run, HERO_LOOP));
    };
    run();
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, still]);
  return still ? last : beat;
}

/** Hero: the promise on the left, a buyer getting an answer on the right. */
export function RxHero({ it }) {
  const h = it.v3.hero;
  const { open } = useLead();
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const beat = useHeroBeat(inView && visible, reduce);
  const calm = reduce || !inView;
  const shown = h.messages.slice(0, Math.max(0, beat));
  const done = beat > h.messages.length;

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="rx-hero-title" className="relative overflow-hidden pb-[clamp(56px,7vw,104px)] pt-[calc(var(--nav-h)+36px)] md:pt-[calc(var(--nav-h)+56px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <p className="intro-rise eyebrow">{h.eyebrow}</p>
          <h1 id="rx-hero-title" className="t-display balance mt-5 md:mt-6">
            <RevealLines lines={[h.titleA, h.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
          </h1>
          <p className="intro-slide t-lead pretty mt-6 max-w-[34em]" style={{ animationDelay: '0.3s' }}>
            {h.text}
          </p>
          <div className="intro-slide mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3" style={{ animationDelay: '0.42s' }}>
            <CTAButton size="lg" onClick={open} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              Book a demo
            </CTAButton>
            <CTAButton size="lg" variant="glass" href="#desks" arrow={false} onClick={(e) => onAnchorClick(e, '#desks')} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              See it at work
            </CTAButton>
          </div>
        </div>

        <div ref={ref} className="relative lg:col-span-6">
          <div className="intro-fade relative ml-auto aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#E9D7BF] sm:w-[82%] lg:w-[88%]" style={{ animationDelay: '0.2s' }}>
            <img
              src={h.photo.src}
              srcSet={h.photo.srcSet}
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 100vw"
              alt={h.photo.alt}
              fetchpriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {/* the buyer's question and Aurora's answer, on the open side of the photo */}
          <LiquidGlass
            as={motion.div}
            initial={false}
            animate={beat >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: calm ? 0 : 0.6, ease: EASE }}
            className="relative z-[1] -mt-12 w-full rounded-[22px] p-3 sm:absolute sm:bottom-[6%] sm:left-0 sm:mt-0 sm:w-[50%] sm:p-3.5 lg:w-[48%]"
            style={{ '--lg-tint-a': 'rgba(255,250,242,0.7)', '--lg-tint-b': 'rgba(255,246,229,0.4)' }}
          >
            <p className="flex items-center justify-between text-[11px] font-medium text-ink/55">
              <span>{h.channel}</span>
              <span>now</span>
            </p>
            <div className="flex flex-col">
              {shown.map((m, i) => (
                <Message key={i} m={m} still={calm} last={i === shown.length - 1} />
              ))}
              <GrowIn show={done} still={calm}>
                <div className="pt-2.5">
                  <ResultRow r={h.result} className="rounded-[16px] bg-white/85 p-2" />
                </div>
              </GrowIn>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </section>
  );
}

/** The race for a lead: the same evening inquiry, with and without Aurora. */
export function RxRace({ it }) {
  const r = it.v3.race;
  const reduce = !!useReducedMotion();
  return (
    <section data-nav-theme="light" aria-labelledby="rx-race-title" className="section relative">
      <div className="shell">
        <SectionHeader id="rx-race-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} text={r.text} layout="split" />
        <div className="mt-8 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-5">
          {r.lanes.map((lane) => {
            const fast = lane.key === 'aurora';
            const gap = fast ? 0.35 : 0.9;
            return (
              <motion.div
                key={lane.key}
                initial={reduce ? false : 'off'}
                whileInView="on"
                viewport={{ once: true, amount: 0.4 }}
                className={cn(
                  'relative overflow-hidden rounded-[24px] p-5 md:p-7',
                  fast ? 'bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)]' : 'bg-ink/[0.035] shadow-[0_0_0_1px_rgba(10,15,14,0.05)]'
                )}
              >
                {fast ? (
                  <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[-30%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.28),rgba(255,159,69,0))] blur-2xl" />
                ) : null}
                <p className={cn('relative flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium', fast ? 'bg-ink text-white' : 'bg-white text-ink/60 shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
                  {fast ? <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className="h-3.5 w-3.5" /> : null}
                  {lane.label}
                </p>
                <ol className="relative mt-5 grid gap-4">
                  {/* the thread that joins the steps, drawn as they appear */}
                  <motion.span
                    aria-hidden="true"
                    variants={{ off: { scaleY: 0 }, on: { scaleY: 1, transition: { duration: gap * 3 + 0.4, ease: 'linear' } } }}
                    className={cn('absolute bottom-3 left-[5px] top-3 w-px origin-top', fast ? 'bg-[#F25C2A]/50' : 'border-l border-dashed border-ink/25')}
                  />
                  {lane.steps.map((s, i) => {
                    const lastBad = !fast && i === lane.steps.length - 1;
                    const lastGood = fast && i === lane.steps.length - 1;
                    return (
                      <motion.li
                        key={s.text}
                        variants={{ off: { opacity: 0, x: -6 }, on: { opacity: 1, x: 0, transition: { delay: i * gap, duration: 0.5, ease: EASE } } }}
                        className="relative grid grid-cols-[11px_1fr] items-start gap-3"
                      >
                        <span
                          className={cn(
                            'mt-[5px] h-[11px] w-[11px] rounded-full ring-4',
                            fast ? 'bg-[#F25C2A] ring-white' : 'bg-ink/30 ring-[#EFEEEA]',
                            lastGood && 'bg-[#2E9A58]',
                            lastBad && 'bg-[#C44B2B]'
                          )}
                        />
                        <span>
                          <span className={cn('t-data block text-[11.5px]', fast ? 'text-[#B4471A]' : 'text-ink/45')}>{s.time}</span>
                          <span className={cn('block text-[15px] leading-snug', lastBad ? 'text-[#A33E22]' : fast ? 'text-ink' : 'text-ink/70', (lastGood || lastBad) && 'font-medium')}>{s.text}</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </ol>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-4 text-[12px] text-slate">{r.note}</p>
      </div>
    </section>
  );
}

/** One AI ISA, every desk: buyers, sellers, showings and past clients, each as a collage in a tab. */
export function RxDesks({ it }) {
  const d = it.v3.desks;
  return <CollageTabs id="desks" eyebrow={d.eyebrow} titleA={d.titleA} titleB={d.titleB} items={d.items} tabsLabel="Desks" />;
}

const RULE_ICONS = { price: CircleDollarSign, fair: Scale, consent: MessageCircle, handoff: Hand };

/** Your rules: four short guarantees, specific to real estate. */
export function RxRules({ it }) {
  const r = it.v3.rules;
  return (
    <section data-nav-theme="light" aria-labelledby="rx-rules-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="rx-rules-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} layout="split" />
        <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-4" amount={0.2}>
          {r.items.map((x) => {
            const Icon = RULE_ICONS[x.icon] || Scale;
            return (
              <RevealItem key={x.title} as="article" className="flex gap-3.5 rounded-[22px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] sm:block sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[linear-gradient(140deg,#FFF1E6,#FFE3C4)] text-[#D9481C]">
                  <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink sm:mt-4 sm:text-[16px]">{x.title}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-graphite sm:text-[14px]">{x.text}</span>
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/** Live in hours: three steps and the tools Aurora works in. */
export function RxLive({ it }) {
  const l = it.v3.live;
  return (
    <section data-nav-theme="light" aria-labelledby="rx-live-title" className="section relative pt-0">
      <div className="shell">
        <Reveal y={28}>
          <div className="canvas canvas-grain relative overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-5 md:p-9 lg:p-11">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute right-[6%] top-[-20%] h-[80%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />
            </div>
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-4">
                <p className="eyebrow">{l.eyebrow}</p>
                <h2 id="rx-live-title" className="t-h1 balance mt-4">
                  {l.titleA}
                  <br />
                  <span className="text-ink/45">{l.titleB}</span>
                </h2>
              </div>
              <ol className="grid gap-3 sm:grid-cols-3 lg:col-span-8 lg:gap-4">
                {l.steps.map((s, i) => (
                  <li key={s.title} className="rounded-[20px] bg-white/80 p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.05)] md:p-5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white">{i + 1}</span>
                    <span className="mt-3 block text-[15px] font-medium tracking-[-0.01em] text-ink">{s.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-graphite">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative mt-7 flex flex-wrap items-center gap-1.5 border-t border-ink/10 pt-5 md:mt-9">
              <span className="mr-1.5 text-[12px] font-medium text-slate">Works with</span>
              {it.systems.map((s) => (
                <span key={s} className="rounded-full bg-white/80 px-3 py-1 text-[12.5px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.05)]">
                  {s}
                </span>
              ))}
              <SmartLink href="/#how-it-works" className="ml-auto mt-2 flex items-center gap-1.5 text-[13.5px] font-medium text-ink hover:underline sm:mt-0">
                See how setup works
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </SmartLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
