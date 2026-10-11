import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, Paperclip, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, howItWorks as hiw } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
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
      <p className="text-[12px] font-medium text-ink">Describe your business</p>
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
      <p className="text-[12px] font-medium text-ink">{brand.product} builds its setup</p>
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
      <p className="text-[12px] font-medium text-ink">Test cycles on your real cases</p>
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
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full flex-col">
      <p className="text-[12px] font-medium text-ink">Live</p>
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
      <motion.div
        className="ui-card mt-3 rounded-[14px] px-3.5 py-3"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.9, ease: EASE }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-slate">WhatsApp · first conversation</p>
          <span className="ui-chip bg-brand-mint text-brand-ink">Answered</span>
        </div>
        <p className="mt-1.5 truncate text-[13.5px] font-medium text-ink">“Hi, is the 2-bedroom still available?”</p>
      </motion.div>
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
const STEP_MS = 6500; // time on each step while the player runs on its own
const RESUME_MS = 14000; // after a click, the player waits this long before moving on again

/** @param {any} props */
function StepPanel({ step, active }) {
  const View = VIEWS[step];
  return (
    <div className="canvas canvas-grain relative h-full bg-[linear-gradient(165deg,#EEF0EB_0%,#E1E7DF_100%)] p-3 xs:p-4 sm:p-6 xl:p-8">
      <div aria-hidden="true" className="orb right-[-14%] top-[-26%] h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgba(60,224,154,0.22),rgba(60,224,154,0))]" />
      <div aria-hidden="true" className="orb bottom-[-30%] left-[-10%] h-[70%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.8),rgba(255,255,255,0))]" />
      <LiquidGlass className="relative flex h-full flex-col rounded-[24px] p-4 sm:p-5 xl:p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[12px] font-medium text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-white">{step + 1}</span>
            {brand.product} setup
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {hiw.steps.map((s, i) => (
              <span key={s.name} className={cn('h-1 rounded-full transition-all duration-500', i === step ? 'w-6 bg-ink' : i < step ? 'w-2 bg-ink/40' : 'w-2 bg-ink/15')} />
            ))}
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <View active={active} />
        </div>
      </LiquidGlass>
    </div>
  );
}

/**
 * How it works: a small player. The four steps sit in a track (a column on desktop,
 * a swipeable row on phones) and advance on their own while the section is on screen;
 * the panel shows each step happening. Clicking a step jumps to it and pauses the player.
 */
export default function Configure() {
  const reduce = !!useReducedMotion();
  const ref = useRef(null);
  const tabs = useRef([]);
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const running = inView && visible && !held && !reduce;
  const n = hiw.steps.length;

  useEffect(() => {
    if (!running) return undefined;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), STEP_MS);
    return () => window.clearTimeout(t);
  }, [running, active, n]);

  useEffect(() => {
    if (!held) return undefined;
    const t = window.setTimeout(() => setHeld(false), RESUME_MS);
    return () => window.clearTimeout(t);
  }, [held, active]);

  // Keep the active step visible in the swipeable row on phones.
  useEffect(() => {
    const el = tabs.current[active];
    const row = el && el.parentElement;
    if (!el || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: el.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }, [active, reduce]);

  const pick = (i) => {
    setActive(i);
    setHeld(true);
  };
  const onKey = (e, i) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = (i + d + n) % n;
    pick(next);
    const el = tabs.current[next];
    if (el) el.focus();
  };

  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" eyebrow={hiw.eyebrow} titleA={hiw.titleA} titleB={hiw.titleB} text={hiw.text} layout="split" />

        <Reveal y={36} className="mt-12 md:mt-16">
          <div ref={ref} className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            <div
              role="tablist"
              aria-label="Setup steps"
              className="-mx-[var(--gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--gutter)] pb-1 no-scrollbar lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {hiw.steps.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.name}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={'hiw-tab-' + i}
                    aria-selected={on}
                    aria-controls="hiw-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => pick(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      'relative w-[232px] shrink-0 snap-start overflow-hidden rounded-[20px] p-4 text-left transition-[background,box-shadow] duration-500 lg:w-auto lg:flex-1 lg:p-5',
                      on ? 'bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_18px_40px_-26px_rgba(10,15,14,0.35)]' : 'bg-white/40 hover:bg-white/70'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium tabular-nums transition-colors duration-500',
                          on ? 'bg-ink text-white' : i < active ? 'bg-brand-mint text-brand-ink' : 'bg-ink/[0.06] text-graphite'
                        )}
                      >
                        {i < active && !on ? <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" /> : i + 1}
                      </span>
                      <span className={cn('text-[15px] font-medium transition-colors duration-500', on ? 'text-ink' : 'text-graphite')}>{s.name}</span>
                    </span>
                    <span className={cn('mt-2.5 block text-[13px] leading-relaxed transition-colors duration-500', on ? 'text-graphite' : 'text-slate')}>{s.short}</span>
                    <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full bg-ink/[0.06] lg:inset-x-5">
                      {on ? (
                        <motion.span
                          key={active + (running ? ':run' : ':hold')}
                          className="absolute inset-y-0 left-0 bg-ink"
                          initial={{ width: running ? '0%' : '100%' }}
                          animate={{ width: '100%' }}
                          transition={running ? { duration: STEP_MS / 1000, ease: 'linear' } : { duration: 0 }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div id="hiw-panel" role="tabpanel" aria-labelledby={'hiw-tab-' + active} className="relative h-[440px] sm:h-[460px] lg:col-span-8 lg:h-auto lg:min-h-[480px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE } }}
                >
                  <StepPanel step={active} active={inView || reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 lg:mt-8">
          <div className="flex flex-col gap-4 rounded-[24px] border border-ink/[0.08] bg-white/60 p-5 text-[14px] leading-relaxed text-graphite md:flex-row md:items-center md:gap-10 md:p-7">
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
