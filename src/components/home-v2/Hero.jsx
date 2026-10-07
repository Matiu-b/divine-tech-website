import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { hero } from '@/data/site';
import CTAButton from './primitives/CTAButton';
import { RevealLines } from './primitives/MotionReveal';
import HeroFilm from './HeroFilm';
import SafeBoundary from './primitives/SafeBoundary';
import { useLead } from './LeadDrawer';
import { EASE } from './motion';
import { onAnchorClick } from './hooks';

export default function Hero() {
  const { open } = useLead();
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };
  // The CTA row holds a glass button: the row only moves, each button fades itself.
  const slide = (delay) => (reduce ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.9, delay, ease: EASE } });
  const fade = (delay) => (reduce ? undefined : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay, ease: EASE } });

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="hero-title" className="relative overflow-hidden pb-[clamp(64px,8vw,120px)] pt-[calc(var(--nav-h)+44px)] md:pt-[calc(var(--nav-h)+64px)]">
      {/* faint warm light at the top of the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_78%_0%,rgba(220,236,226,0.9),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />

      <div className="shell relative">
        <motion.p className="eyebrow" {...rise(0)}>
          {hero.eyebrow}
        </motion.p>

        <h1 id="hero-title" className="t-display mt-5 max-w-[16ch] md:mt-7 lg:max-w-none">
          <RevealLines lines={[hero.titleA, hero.titleB]} lineClassNames={['', 'text-mute']} immediate delay={0.08} stagger={0.14} />
        </h1>

        <div className="mt-7 grid gap-7 md:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <motion.p className="t-lead pretty max-w-[54ch] lg:col-span-7" {...rise(0.3)}>
            {hero.text}
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-2.5 sm:gap-3 lg:col-span-5 lg:justify-end" {...slide(0.42)}>
            <CTAButton size="lg" onClick={open} motionProps={fade(0.42)} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              {hero.primary}
            </CTAButton>
            <CTAButton
              size="lg"
              variant="glass"
              href="#demo"
              arrow={false}
              onClick={(e) => onAnchorClick(e, '#demo')}
              motionProps={fade(0.48)}
              icon={
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
                  <Play className="ml-[1px] h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden="true" />
                </span>
              }
              className="pl-2.5 max-sm:h-12 max-sm:pr-5 max-sm:text-[15px]"
            >
              {hero.secondary}
            </CTAButton>
          </motion.div>
        </div>
      </div>

      <div className="shell relative mt-10 md:mt-12">
        <SafeBoundary>
          <HeroFilm />
        </SafeBoundary>
      </div>
    </section>
  );
}
