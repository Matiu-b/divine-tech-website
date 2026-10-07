import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, Paperclip, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, howItWorks as hiw } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport } from './hooks';
import { EASE } from './motion';

/* ------------------------------------------------------------------ */
/* Step visuals                                                         */
/* ------------------------------------------------------------------ */

/** @param {any} props */
function DescribeView({ active }) {
  const reduce = useReducedMotion();
  const text = hiw.describe.prompt;
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) {
      setN(text.length);
      return undefined;
    }
    if (!active) return undefined;
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setN(Math.min(text.length, i));
      if (i >= text.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [active, reduce, text]);
  return (
    <div className="flex h-full flex-col">
      <p className="text-[12px] font-semibold text-ink">Describe your business</p>
      <p className="text-[11.5px] text-slate">Plain language. No forms.</p>
      <div className="ui-card mt-4 flex-1 p-4 text-[14px] leading-relaxed text-ink md:text-[15px]">
        <span className={cn(n < text.length && 'caret')}>{text.slice(0, n)}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {hiw.describe.files.map((f) => (
          <span key={f} className="ui-chip h-7 bg-white/80 px-2.5 text-[12px] text-graphite shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
            <Paperclip className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

/** @param {any} props */
function ConfigureView({ active }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? 99 : 0);
  useEffect(() => {
    if (reduce) return undefined;
    if (!active) return undefined;
    setN(0);
    const timers = hiw.configure.map((_, i) => window.setTimeout(() => setN(i + 1), 300 + i * 380));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active, reduce]);
  return (
    <div className="flex h-full flex-col">
      <p className="text-[12px] font-semibold text-ink">{brand.product} builds its setup</p>
      <p className="text-[11.5px] text-slate">Flows, integrations, knowledge, voice and rules</p>
      <ul className="mt-4 grid gap-2">
        {hiw.configure.map((m, i) => {
          const done = n > i;
          return (
            <li key={m} className="ui-card flex items-center gap-3 rounded-[14px] px-3.5 py-3">
              <Sparkles className={cn('h-4 w-4 shrink-0 transition-colors duration-500', done ? 'text-brand' : 'text-ink/25')} strokeWidth={1.7} aria-hidden="true" />
              <span className={cn('min-w-0 flex-1 truncate text-[13.5px] font-medium transition-colors duration-500', done ? 'text-ink' : 'text-ink/40')}>{m}</span>
              <span className="relative h-1 w-10 shrink-0 overflow-hidden rounded-full bg-ink/[0.07] sm:w-16">
                <span className={cn('absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-700 ease-out', done ? 'w-full' : 'w-0')} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** @param {any} props */
function AdaptView({ active }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? 99 : 0);
  useEffect(() => {
    if (reduce) return undefined;
    if (!active) return undefined;
    setN(0);
    const timers = hiw.adapt.map((_, i) => window.setTimeout(() => setN(i + 1), 350 + i * 520));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active, reduce]);
  return (
    <div className="flex h-full flex-col">
      <p className="text-[12px] font-semibold text-ink">Test cycles on your real cases</p>
      <p className="text-[11.5px] text-slate">Gaps found and fixed before anything goes live</p>
      <ul className="mt-4 grid gap-2">
        {hiw.adapt.map(([c, r], i) => {
          const shown = n > i;
          const pass = r === 'Pass';
          return (
            <li key={c} className={cn('ui-card flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[14px] px-3.5 py-3 transition-all duration-500', shown ? 'opacity-100' : 'opacity-40')}>
              <span className="flex min-w-[55%] flex-1 items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.7} aria-hidden="true" />
                <span className="min-w-0 truncate text-[13.5px] font-medium text-ink">{c}</span>
              </span>
              <span className={cn('ui-chip ml-auto shrink-0 transition-opacity duration-500', shown ? 'opacity-100' : 'opacity-0', pass ? 'bg-brand-mint text-brand-ink' : 'bg-[#EEF1F7] text-[#3D4E74]')}>
                {r}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** @param {any} props */
function RunView({ active }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[12px] font-semibold text-ink">Live</p>
      <p className="text-[11.5px] text-slate">Learning from every conversation</p>
      <ul className="mt-4 grid gap-2">
        {hiw.run.map((ch, i) => (
          <li key={ch} className="ui-card flex items-center justify-between rounded-[14px] px-3.5 py-3">
            <span className="text-[13.5px] font-medium text-ink">{ch}</span>
            <span className="flex items-center gap-2 text-[12px] text-graphite">
              <span className={cn('h-1.5 w-1.5 rounded-full bg-brand', active && 'animate-pulse-soft')} style={{ animationDelay: i * 0.3 + 's' }} />
              Live
            </span>
          </li>
        ))}
      </ul>
      <div className="ui-card mt-3 flex items-center justify-between gap-4 rounded-[14px] px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium text-ink">Changes wait for your approval</p>
          <p className="truncate text-[12px] text-slate">Anything that changes the business needs a person</p>
        </div>
        <span className="relative h-6 w-10 shrink-0 rounded-full bg-brand" aria-hidden="true">
          <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </div>
  );
}

const VIEWS = [DescribeView, ConfigureView, AdaptView, RunView];

/** @param {any} props */
function StepPanel({ step, compact = false }) {
  const View = VIEWS[step];
  const ref = useRef(null);
  const seen = useInViewport(ref, { threshold: 0.4, once: true });
  const active = compact ? seen : true;
  return (
    <div ref={ref} className={cn('canvas canvas-grain bg-[linear-gradient(165deg,#EEF0EB_0%,#E1E7DF_100%)]', compact ? 'p-4 xs:p-5' : 'h-full p-6 xl:p-8')}>
      <div aria-hidden="true" className="orb right-[-14%] top-[-26%] h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgba(60,224,154,0.22),rgba(60,224,154,0))]" />
      <div aria-hidden="true" className="orb bottom-[-30%] left-[-10%] h-[70%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.8),rgba(255,255,255,0))]" />
      <LiquidGlass className={cn('relative flex flex-col rounded-[24px]', compact ? 'p-4' : 'h-full p-5 xl:p-6')}>
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[12px] font-semibold text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">{step + 1}</span>
            {brand.product} setup
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {hiw.steps.map((s, i) => (
              <span key={s.name} className={cn('h-1 rounded-full transition-all duration-500', i === step ? 'w-6 bg-ink' : i < step ? 'w-2 bg-ink/40' : 'w-2 bg-ink/15')} />
            ))}
          </span>
        </div>
        <div className={cn('relative', compact ? '' : 'min-h-0 flex-1')}>
          <View active={active} />
        </div>
      </LiquidGlass>
    </div>
  );
}

/** @param {any} props */
function Step({ index, step, active, done, onActive }) {
  const ref = useRef(null);
  const inBand = useInViewport(ref, { rootMargin: '-30% 0px -60% 0px' });
  useEffect(() => {
    if (inBand) onActive(index);
  }, [inBand, index, onActive]);
  return (
    <div ref={ref} className="relative pb-14 lg:min-h-[var(--step-h)] lg:pb-0 lg:pt-[var(--step-pad)]">
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-[calc(var(--step-pad)+3px)] hidden h-[15px] w-[15px] rounded-full border-2 transition-colors duration-500 lg:block',
          done || active ? 'border-ink bg-ink' : 'border-ink/20 bg-paper'
        )}
      />
      <div className={cn('transition-opacity duration-700 lg:pl-12', active ? 'lg:opacity-100' : 'lg:opacity-35')}>
        <p className="text-[13px] font-medium tabular-nums text-slate">Step {index + 1}</p>
        <h3 className="t-h2 mt-3">{step.name}</h3>
        <p className="t-lead pretty mt-4 max-w-[40ch]">{step.text}</p>
      </div>
      <div className="mt-7 lg:hidden">
        <StepPanel step={index} compact />
      </div>
    </div>
  );
}

export default function Configure() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const onActive = React.useCallback((i) => setActive(i), []);

  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" eyebrow={hiw.eyebrow} titleA={hiw.titleA} titleB={hiw.titleB} text={hiw.text} layout="split" />

        <div className="relative mt-16 grid gap-0 [--step-h:min(68vh,620px)] [--step-pad:6vh] lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-5">
            {/* progress rail */}
            <div
              aria-hidden="true"
              className="absolute bottom-[calc(var(--step-h)-var(--step-pad)-10px)] left-[7px] top-[calc(var(--step-pad)+10px)] hidden w-px bg-ink/10 lg:block"
            >
              <motion.span
                className="absolute left-0 top-0 w-px origin-top bg-ink"
                animate={{ height: (active / (hiw.steps.length - 1)) * 100 + '%' }}
                transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
              />
            </div>
            {hiw.steps.map((s, i) => (
              <Step key={s.name} index={i} step={s} active={i === active} done={i < active} onActive={onActive} />
            ))}
          </div>

          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(50vh-var(--step-h)/2+12px)] h-[calc(var(--step-h)-24px)]">
              {/* Layered crossfade: steps can change quickly while scrolling, so panels overlap instead of queueing */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                >
                  <StepPanel step={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal className="mt-4 lg:mt-16">
          <div className="flex flex-col gap-4 rounded-[24px] border border-ink/[0.08] bg-white/60 p-5 text-[15px] leading-relaxed text-graphite md:flex-row md:items-center md:gap-10 md:p-7">
            <p className="md:flex-1">
              <span className="font-medium text-ink">What you do:</span> describe the business and approve the map.
            </p>
            <span className="hidden h-8 w-px bg-ink/10 md:block" aria-hidden="true" />
            <p className="md:flex-1">
              <span className="font-medium text-ink">What {brand.product} does:</span> everything between the description and the first live conversation.
            </p>
            <Check className="hidden h-5 w-5 text-brand md:block" strokeWidth={2} aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
