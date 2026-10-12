import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { outcomes } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport } from './hooks';

const INK = '#0A0F0E';
const GREEN = '#14A36B';

/**
 * Small trend drawings, deliberately without axes or numbers: they show the direction
 * of each outcome, not a measured result.
 * @param {{ kind: string, on: boolean }} props
 */
function Trend({ kind, on }) {
  const reduce = useReducedMotion();
  const drawn = reduce || on;
  const line = (d, color, delay = 0, dashed = false) => (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '4 5' : undefined}
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      animate={drawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
  return (
    <svg viewBox="0 0 240 96" className="block h-auto w-full" aria-hidden="true">
      <path d="M0 95.5 H240" stroke={INK} strokeOpacity="0.1" />
      {kind === 'cost' ? (
        <>
          {line('M4 22 C60 24 84 34 120 50 S196 76 236 80', GREEN)}
          <motion.circle
            cx="236"
            cy="80"
            r="4"
            fill={GREEN}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          />
        </>
      ) : null}
      {kind === 'speed'
        ? [34, 46, 60, 72, 84].map((h, i) => (
            <motion.rect
              key={h}
              x={8 + i * 48}
              width="32"
              rx="6"
              fill={i === 4 ? GREEN : INK}
              fillOpacity={i === 4 ? 1 : 0.1 + i * 0.04}
              initial={reduce ? false : { y: 95, height: 0 }}
              animate={drawn ? { y: 95 - h, height: h } : { y: 95, height: 0 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          ))
        : null}
      {kind === 'margin' ? (
        <>
          {line('M4 70 C70 66 150 62 236 58', INK + '55', 0, true)}
          {line('M4 72 C70 60 140 36 236 12', GREEN, 0.2)}
          <motion.path
            d="M4 72 C70 60 140 36 236 12 L236 58 C150 62 70 66 4 70 Z"
            fill={GREEN}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: drawn ? 0.1 : 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          />
        </>
      ) : null}
    </svg>
  );
}

const LEGEND = {
  cost: [['Cost per task', GREEN]],
  margin: [
    ['Revenue', GREEN],
    ['Cost', INK + '80'],
  ],
};

export default function Outcomes() {
  const ref = useRef(null);
  const on = useInViewport(ref, { once: true, threshold: 0.35 });
  return (
    <section id="outcomes" data-nav-theme="light" aria-labelledby="outcomes-title" className="section relative">
      <div className="shell">
        <SectionHeader id="outcomes-title" titleA={outcomes.titleA} text={outcomes.text} layout="split" />

        <div ref={ref} className="mt-12 grid border-t border-ink/10 md:mt-16 md:grid-cols-3">
          {outcomes.items.map((o, i) => (
            <Reveal
              key={o.key}
              delay={i * 0.08}
              className={cn('flex flex-col gap-4 py-7 md:gap-5 md:py-10', i > 0 && 'border-t border-ink/10 md:border-l md:border-t-0 md:pl-8 lg:pl-10', i < 2 && 'md:pr-8 lg:pr-10')}
            >
              <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-brand-ink">{o.label}</p>
              <div className="max-w-[220px] md:max-w-[300px]">
                <Trend kind={o.key} on={on} />
                <div className="mt-2 flex h-4 flex-wrap gap-x-4 text-[11.5px] text-slate">
                  {o.departments
                    ? o.departments.map((d) => <span key={d}>{d}</span>)
                    : (LEGEND[o.key] || []).map(([name, color]) => (
                        <span key={name} className="flex items-center gap-1.5">
                          <span className="h-[2px] w-3 rounded-full" style={{ background: color }} aria-hidden="true" />
                          {name}
                        </span>
                      ))}
                </div>
              </div>
              <div>
                <h3 className="text-[21px] font-normal leading-[1.2] tracking-[-0.02em] text-ink md:text-[23px]">{o.title}</h3>
                <p className="mt-2.5 max-w-[34ch] text-[15px] leading-relaxed text-graphite">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="border-t border-ink/10 pt-6 text-[15px] text-graphite">{outcomes.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
