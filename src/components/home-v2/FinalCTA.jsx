import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { brand, closing, media } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import MediaSlot from './primitives/MediaSlot';
import { Reveal, RevealLines } from './primitives/MotionReveal';
import { LeadForm } from './LeadDrawer';
import { EASE } from './motion';

export default function FinalCTA() {
  const reduce = useReducedMotion();
  // The form card is glass: it reveals itself rather than through a fading wrapper.
  const appear = reduce
    ? {}
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.9, delay: 0.1, ease: EASE } };
  return (
    <section id="contact" data-nav-theme="dark" aria-labelledby="contact-title" className="on-dark relative overflow-hidden bg-ink pb-[clamp(88px,10vw,150px)] pt-[clamp(104px,12vw,180px)] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <MediaSlot
          media={media.closing}
          className="absolute inset-0 opacity-60"
          fallback={
            <>
              <div className="orb right-[-6%] top-[2%] h-[90%] w-[62%] animate-breathe bg-[radial-gradient(closest-side,rgba(60,224,154,0.2),rgba(60,224,154,0))]" />
              <div className="orb bottom-[-30%] right-[18%] h-[80%] w-[48%] animate-drift-slow bg-[radial-gradient(closest-side,rgba(19,168,156,0.2),rgba(19,168,156,0))]" />
              <div className="orb left-[-10%] top-[-30%] h-[70%] w-[45%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.05),rgba(255,255,255,0))]" />
            </>
          }
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="contact-title" className="t-display balance">
            <RevealLines lines={[closing.titleA, closing.titleB]} lineClassNames={['', 'text-white/45']} />
          </h2>
          <Reveal delay={0.15}>
            <p className="t-lead pretty mt-8 max-w-[40ch] !text-white/65">{closing.text}</p>
            <div className="mt-10 grid gap-1.5 text-[15px] text-white/60">
              <a className="w-fit transition-colors hover:text-white" href={'mailto:' + brand.email}>
                {brand.email}
              </a>
              <a className="w-fit transition-colors hover:text-white" href={'tel:' + brand.phoneTel}>
                {brand.phone}
              </a>
              <span>{brand.address}</span>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
          <LiquidGlass as={motion.div} {...appear} tone="dark" className="rounded-[clamp(24px,2.6vw,34px)] p-5 xs:p-7 md:p-9">
            <h3 className="t-h3 text-white">Book a demo</h3>
            <p className="mb-7 mt-2 text-[15px] text-white/55">Tell us where to start. We will set up the conversation around your process.</p>
            <LeadForm dark columns={2} />
          </LiquidGlass>
        </div>
      </div>
    </section>
  );
}
