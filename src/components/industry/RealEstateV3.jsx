import React from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { CircleDollarSign, Hand, MessageCircle, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { RevealGroup, RevealItem, RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick } from '@/components/home-v2/hooks';

/*
 * Real estate page, v3. One message per section, in this order:
 * promise (hero) -> the race for every lead -> your rules. Sections the home and platform pages already tell are left out.
 * Everything sits on the site's warm light ground; the motion is the product at work.
 */

const EASE = [0.22, 1, 0.36, 1];
/** Hero: the promise on the left, a buyer getting an answer on the right. */
export function RxHero({ it }) {
  const h = it.v3.hero;
  const { open } = useLead();

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
            <CTAButton size="lg" onClick={open} className="max-sm:h-12 max-sm:px-4 max-sm:text-[14px]">
              Book a demo
            </CTAButton>
            <CTAButton size="lg" variant="glass" href="#race" arrow={false} onClick={(e) => onAnchorClick(e, '#race')} className="max-sm:h-12 max-sm:px-4 max-sm:text-[14px]">
              Why speed wins
            </CTAButton>
          </div>
        </div>

        <div className="relative lg:col-span-6">
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
    <section id="race" data-nav-theme="light" aria-labelledby="rx-race-title" className="section relative">
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
