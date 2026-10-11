import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hero } from '@/data/site';
import CTAButton from './primitives/CTAButton';
import Logo from './primitives/Logo';
import { RevealLines } from './primitives/MotionReveal';
import HeroReel from './HeroReel';
import { useLead } from './LeadDrawer';
import { EASE } from './motion';

export default function Hero() {
  const { open } = useLead();
  const navigate = useNavigate();
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
    <section
      id="top"
      data-nav-theme="dark"
      aria-labelledby="hero-title"
      className="on-dark relative flex min-h-[100svh] items-center overflow-hidden text-white md:min-h-[min(100svh,960px)]"
    >
      <HeroReel />

      <div className="shell relative w-full pb-28 pt-[calc(var(--nav-h)+40px)] md:pb-32">
        {/* brand lockup, headline, one line and the two actions, all centred over the reel */}
        <motion.div className="flex items-center justify-center gap-2.5" {...rise(0)}>
          <Logo variant="aurora" tone="light" height={26} />
          <span className="text-[17px] font-medium text-white/70">{hero.lockup}</span>
        </motion.div>
        <h1 id="hero-title" className="t-display balance mx-auto mt-6 max-w-[20ch] text-center text-white md:mt-8">
          <RevealLines lines={hero.titleB ? [hero.titleA, hero.titleB] : [hero.titleA]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
        </h1>
        <motion.p className="t-lead pretty mx-auto mt-6 max-w-[46ch] text-center !text-white/80 md:mt-7" {...rise(0.3)}>
          {hero.text}
        </motion.p>
        <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" {...slide(0.42)}>
          <CTAButton size="lg" variant="light" onClick={open} motionProps={fade(0.42)} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
            {hero.primary}
          </CTAButton>
          <CTAButton
            size="lg"
            variant="glass-dark"
            href="/platform"
            arrow={false}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              navigate('/platform');
            }}
            motionProps={fade(0.48)}
            icon={
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                <Play className="ml-[1px] h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden="true" />
              </span>
            }
            className="pl-2.5 max-sm:h-12 max-sm:pr-5 max-sm:text-[15px]"
          >
            {hero.secondary}
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
