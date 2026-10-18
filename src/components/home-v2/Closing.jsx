import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { RevealLines } from './primitives/MotionReveal';
import { LeadForm } from './LeadDrawer';
import LiquidGlass from './primitives/LiquidGlass';
import { useInViewport } from './hooks';

/**
 * The closing section shared across the site: ink with a low dawn glow (Sun, Amber, Gold) that settles back to plain
 * ink before the footer; the headline and one line on the left with the page's own drawing or content under them, and
 * the demo form in glass on the right. `art(grow, reduce)` draws what sits under the text once the section is seen.
 * @param {{ c: { titleA: string, titleB?: string, text: string, form?: string }, industry?: string, art?: (grow: boolean, reduce: boolean) => any }} props
 */
export default function Closing({ c, industry = undefined, art = undefined }) {
  const reduce = !!useReducedMotion();
  const ref = useRef(null);
  const seen = useInViewport(ref, { threshold: 0.2, once: true });
  const grow = reduce || seen;
  return (
    <section ref={ref} id="contact" data-nav-theme="dark" aria-labelledby="contact-title" className="on-dark relative overflow-hidden bg-ink pb-[clamp(72px,7vw,112px)] pt-[clamp(88px,8vw,128px)] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* the dawn: Sun, Amber and Gold glowing low across the section */}
        <div className="absolute bottom-[4%] left-[18%] h-[70%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(242,92,42,0.30),rgba(255,159,69,0.10)_50%,rgba(255,200,87,0)_75%)] blur-2xl" />
        <div className="absolute right-[-10%] top-[-20%] h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.10),rgba(255,200,87,0))] blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {/* the dawn settles back to plain ink before the footer, so the two meet without a seam */}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-ink/0 to-ink" />
      </div>

      <div className="shell relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-end lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
        <div className="min-w-0">
          <h2 id="contact-title" className="t-display balance lg:text-[clamp(2.4rem,0.6rem+3vw,3.9rem)]">
            <RevealLines lines={c.titleB ? [c.titleA, c.titleB] : [c.titleA]} lineClassNames={['', '']} />
          </h2>
          <p className="t-lead pretty mt-5 max-w-[32em] !text-white/70">{c.text}</p>
          {art ? <div className="mt-8 max-w-[560px] lg:mt-12">{art(grow, reduce)}</div> : null}
        </div>
        <LiquidGlass tone="dark" className="rounded-[clamp(20px,2.2vw,28px)] p-5 xs:p-6 md:p-7">
          <p className="mb-5 text-[15px] leading-snug text-white/75">{c.form || 'Leave your details and Aurora, our AI agent, will call you right away.'}</p>
          <LeadForm dark columns={2} industry={industry} />
        </LiquidGlass>
      </div>
    </section>
  );
}
