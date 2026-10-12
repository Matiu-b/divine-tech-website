import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { closing, media } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import MediaSlot from './primitives/MediaSlot';
import { Reveal, RevealLines } from './primitives/MotionReveal';
import { LeadForm } from './LeadDrawer';
import { EASE } from './motion';

/**
 * Closing section with the demo form. On an industry page, pass `industry` (pre-selects it in the form)
 * and optionally `titleA` / `titleB` / `text` to speak to that industry.
 * @param {any} props
 */
export default function FinalCTA({ industry = '', titleA = closing.titleA, titleB = closing.titleB, text = closing.text }) {
  const reduce = useReducedMotion();
  // The form card is glass: it reveals itself rather than through a fading wrapper.
  const appear = reduce
    ? {}
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.9, delay: 0.1, ease: EASE } };
  return (
    <section id="contact" data-nav-theme="dark" aria-labelledby="contact-title" className="on-dark relative overflow-hidden bg-ink pb-[clamp(72px,7vw,112px)] pt-[clamp(88px,8vw,128px)] text-white">
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
        {/* the glow settles back to plain ink before the footer, so the footer reads as its own quiet area */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-ink/0 to-ink" />
      </div>

      <div className="shell relative">
        {/* Desktop: heading across the top, then the form laid out wide in two rows. Phones: everything stacks. */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 id="contact-title" className="t-display balance lg:col-span-7">
            <RevealLines lines={[titleA, titleB]} lineClassNames={['', '']} />
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="t-lead pretty max-w-[44ch] !text-white/65">{text}</p>
          </Reveal>
        </div>

        <LiquidGlass as={motion.div} {...appear} tone="dark" className="mt-10 rounded-[clamp(24px,2.6vw,34px)] p-5 xs:p-7 md:mt-14 md:p-8">
          <div className="mb-6 flex flex-col gap-1.5 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <h3 className="t-h3 text-white">Book a demo</h3>
            <p className="text-[15px] leading-snug text-white/55">Leave your details and Aurora, our AI agent, will call you right away.</p>
          </div>
          <LeadForm dark wide industry={industry} />
        </LiquidGlass>
      </div>
    </section>
  );
}
