import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { platformPage } from '@/data/site';
import SiteLayout from '@/components/home-v2/SiteLayout';
import HeroFilm from '@/components/home-v2/HeroFilm';
import Teams from '@/components/home-v2/Teams';
import FinalCTA from '@/components/home-v2/FinalCTA';
import Faq from '@/components/home-v2/Faq';
import PlatformArchitecture from '@/components/home-v2/PlatformArchitecture';
import PlatformSecurity from '@/components/home-v2/PlatformSecurity';
import ConsoleTour from '@/components/home-v2/ConsoleTour';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SafeBoundary from '@/components/home-v2/primitives/SafeBoundary';
import { RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick } from '@/components/home-v2/hooks';
import { EASE } from '@/components/home-v2/motion';

/** Platform hero: the product film (shown on this page only). */
function PlatformHero() {
  const { open } = useLead();
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: EASE } };
  const slide = (delay) => (reduce ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.9, delay, ease: EASE } });
  const fade = (delay) => (reduce ? undefined : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay, ease: EASE } });
  const p = platformPage;

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="platform-hero-title" className="relative overflow-hidden pb-[clamp(64px,8vw,120px)] pt-[calc(var(--nav-h)+44px)] md:pt-[calc(var(--nav-h)+64px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <h1 id="platform-hero-title" className="t-display">
          <RevealLines lines={[p.titleA, p.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
        </h1>
        <div className="mt-7 grid gap-7 md:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <motion.p className="t-lead pretty max-w-[56ch] lg:col-span-7" {...rise(0.3)}>
            {p.text}
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-2.5 sm:gap-3 lg:col-span-5 lg:justify-end" {...slide(0.42)}>
            <CTAButton size="lg" onClick={open} motionProps={fade(0.42)} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              Book a demo
            </CTAButton>
            <CTAButton
              size="lg"
              variant="glass"
              href="#console"
              arrow={false}
              onClick={(e) => onAnchorClick(e, '#console')}
              motionProps={fade(0.48)}
              className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]"
            >
              See the console
            </CTAButton>
          </motion.div>
        </div>
      </div>
      <div className="shell relative mt-10 md:mt-12">
        <SafeBoundary>
          <HeroFilm />
        </SafeBoundary>
        <p className="mt-4 text-center text-[12px] text-slate">{p.note}</p>
      </div>
    </section>
  );
}

export default function PlatformPage() {
  return (
    <SiteLayout meta={platformPage.meta}>
      <PlatformHero />
      <ConsoleTour />
      <PlatformArchitecture />
      <PlatformSecurity />
      <Teams />
      <Faq id="platform-faq-title" items={platformPage.faq} title="Questions about the platform." className="pt-0" />
      <FinalCTA />
    </SiteLayout>
  );
}
