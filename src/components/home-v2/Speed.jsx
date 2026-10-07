import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { speed } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';
import { useInViewport } from './hooks';
import { EASE } from './motion';

/** @param {any} props */
function Track({ data, accent = false, width, delay = 0, play, still }) {
  return (
    <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-center md:gap-8">
      <div>
        <p className={cn('text-[15.5px] font-medium tracking-[-0.015em]', accent ? 'text-ink' : 'text-graphite')}>{data.label}</p>
        <p className="text-[13.5px] text-slate">{data.sub}</p>
      </div>
      <div className="relative">
        <motion.div
          className="flex flex-wrap gap-1 md:flex-nowrap"
          style={{ width }}
          initial={still ? false : { clipPath: 'inset(0% 100% 0% 0%)' }}
          animate={still ? undefined : play ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(0% 100% 0% 0%)' }}
          transition={{ duration: accent ? 0.9 : 1.8, delay, ease: EASE }}
        >
          {data.segs.map((s) => (
            <span
              key={s}
              className={cn(
                'flex h-11 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[12px] px-1.5 text-[12px] font-medium tracking-[-0.005em] md:h-14 md:text-[13px]',
                accent ? 'basis-[calc(25%-3px)] md:basis-0' : 'basis-[calc(33.333%-3px)] md:basis-0',
                accent ? 'bg-ink text-white' : 'bg-paper-2 text-graphite shadow-[inset_0_0_0_1px_rgba(10,15,14,0.06)]'
              )}
            >
              <span className="truncate">{s}</span>
            </span>
          ))}
          {accent ? (
            <span className="ml-2 hidden shrink-0 items-center gap-2 self-center text-[13px] font-medium text-brand-ink md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-soft rounded-full bg-brand/50" />
                <span className="relative h-2 w-2 rounded-full bg-brand" />
              </span>
              Live
            </span>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

export default function Speed() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const play = useInViewport(ref, { threshold: 0.35, once: true });

  return (
    <section data-nav-theme="light" aria-labelledby="speed-title" className="section relative bg-paper-2/70">
      <div className="shell">
        <SectionHeader id="speed-title" eyebrow={speed.eyebrow} titleA={speed.titleA} titleB={speed.titleB} text={speed.text} layout="split" />

        <div ref={ref} className="mt-14 grid gap-8 rounded-[clamp(24px,3vw,36px)] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.04),0_30px_70px_-50px_rgba(10,15,14,0.3)] xs:p-6 md:mt-20 md:gap-10 md:p-10 lg:p-12">
          <Track data={speed.traditional} width="100%" play={play} still={!!reduce} />
          <div className="hairline" />
          <Track data={speed.aurora} accent width="min(100%, 520px)" delay={0.55} play={play} still={!!reduce} />
        </div>

        <RevealGroup className="mt-14 grid gap-10 md:mt-16 md:grid-cols-3">
          {speed.benefits.map(([title, text]) => (
            <RevealItem key={title} className="border-t border-ink/10 pt-6">
              <h3 className="t-h4">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-graphite">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
