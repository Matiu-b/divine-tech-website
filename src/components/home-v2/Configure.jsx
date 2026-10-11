import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, howItWorks as hiw } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import { GmailMark, GoogleCalendarMark, HubSpotMark, PhoneTile, SalesforceMark, SlackMark, WhatsAppMark } from './BrandMarks';

// Who does each phase decides its colour on the rail: ink = our experts with you, green = Aurora.
const TONE = { you: 'bg-ink', aurora: 'bg-brand' };

/**
 * A looping counter for one illustration: runs while the illustration is on screen and the tab is
 * visible, and holds the final frame for reduced motion.
 */
function useLoop(ref, { steps, final, ms = 800 }) {
  const reduce = useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35 });
  const visible = usePageVisible();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setT((n) => (n + 1) % steps), ms);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible, steps, ms]);
  return reduce ? final : t;
}

/** Soft backdrop shared by the three illustrations. @param {any} props */
function Stage({ tone, children }) {
  return (
    <div
      className={cn(
        'canvas canvas-grain relative p-4 xs:p-6 md:p-8',
        tone === 'sage' && 'bg-[linear-gradient(160deg,#E9EEE7_0%,#DCE4DB_100%)]',
        tone === 'sand' && 'bg-[linear-gradient(160deg,#EFEBE4_0%,#E2DDD3_100%)]',
        tone === 'mint' && 'bg-[linear-gradient(160deg,#E4EFEA_0%,#D3E6DC_100%)]'
      )}
    >
      <div aria-hidden="true" className="orb right-[-10%] top-[-30%] h-[80%] w-[60%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. The action plan: a work plan written row by row, then approved   */
/* ------------------------------------------------------------------ */
function PlanVisual() {
  const ref = useRef(null);
  const rows = hiw.plan.rows;
  const t = useLoop(ref, { steps: rows.length + 6, final: rows.length + 2 });
  const approved = t >= rows.length + 1;
  return (
    <div ref={ref}>
      <Stage tone="sage">
        <div className="ui-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-paper text-ink/70">
              <FileText className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">Action plan · {hiw.plan.company}</p>
              <p className="truncate text-[11.5px] text-slate">{hiw.plan.people.join(' · ')}</p>
            </div>
            <span className={cn('ui-chip shrink-0 transition-colors duration-500', approved ? 'bg-brand-mint text-brand-ink' : 'bg-paper text-graphite')}>
              {approved ? 'Approved' : 'Draft'}
            </span>
          </div>
          <div className="hidden gap-3 px-4 pb-1 pt-3 text-[10.5px] font-medium text-slate sm:grid sm:grid-cols-[1.6fr_1fr_0.9fr]">
            <span className="pl-8">Process</span>
            <span>Channels</span>
            <span>Owner</span>
          </div>
          <ul className="grid gap-1 px-2 pb-3 pt-2 sm:pt-0">
            {rows.map((r, i) => {
              const on = t > i;
              return (
                <li
                  key={r.process}
                  className={cn(
                    'grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] px-2 py-2 transition-all duration-500 sm:grid-cols-[1.6fr_1fr_0.9fr]',
                    on ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-ink">
                    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-500', approved ? 'border-brand bg-brand text-white' : 'border-ink/20 text-transparent')}>
                      <Check className="h-2.5 w-2.5" strokeWidth={3.2} aria-hidden="true" />
                    </span>
                    <span className="truncate">{r.process}</span>
                  </span>
                  <span className="hidden truncate text-[11.5px] text-graphite sm:block">{r.channels}</span>
                  <span className={cn('truncate text-[11.5px] font-medium', r.owner === 'Aurora' ? 'text-brand-ink' : 'text-[#8A5A12]')}>{r.owner}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Stage>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Aurora connects the tools in the plan                            */
/* ------------------------------------------------------------------ */
const TOOL = {
  Phone: () => <PhoneTile className="h-9 w-9" />,
  Email: () => <GmailMark className="h-6 w-6" />,
  Calendar: () => <GoogleCalendarMark className="h-6 w-6" />,
  CRM: () => (
    <span className="flex items-center gap-1">
      <HubSpotMark className="h-5 w-5" />
      <SalesforceMark className="h-[18px] w-[26px]" />
    </span>
  ),
  Slack: () => <SlackMark className="h-6 w-6" />,
  WhatsApp: () => <WhatsAppMark className="h-6 w-6" />,
};

function ConnectVisual() {
  const ref = useRef(null);
  const n = hiw.connect.length;
  const t = useLoop(ref, { steps: n + 5, final: n + 1, ms: 700 });
  const done = Math.max(0, Math.min(n, t));
  return (
    <div ref={ref}>
      <Stage tone="sand">
        <div className="ui-card p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">{done === n ? brand.product + ' is connected' : 'Connecting your tools…'}</p>
            <span className="t-data text-[11.5px] text-slate">
              {done}/{n}
            </span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink/[0.08]">
            <div className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out" style={{ width: (done / n) * 100 + '%' }} />
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {hiw.connect.map((name, i) => {
              const Mark = TOOL[name];
              const on = done > i;
              return (
                <li key={name} className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      'relative flex h-14 w-full items-center justify-center rounded-[14px] border bg-white transition-all duration-500',
                      on ? 'border-ink/[0.08] opacity-100 grayscale-0' : 'border-transparent opacity-45 grayscale'
                    )}
                  >
                    <Mark />
                    <span
                      className={cn(
                        'absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-transform duration-300',
                        on ? 'scale-100' : 'scale-0'
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3.4} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="text-[11px] text-graphite">{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Stage>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. A test conversation, then the go-live switch                     */
/* ------------------------------------------------------------------ */
function GoLiveVisual() {
  const ref = useRef(null);
  const t = useLoop(ref, { steps: 9, final: 5, ms: 900 });
  const live = t >= 4;
  const bubble = 'max-w-[85%] rounded-[16px] px-3 py-2 text-[12.5px] leading-snug transition-all duration-500';
  return (
    <div ref={ref}>
      <Stage tone="mint">
        <div className="ui-card mx-auto max-w-[460px] overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-ink">Test run</p>
              <p className="text-[11.5px] text-slate">Text message · real example from your business</p>
            </div>
            <span className={cn('ui-chip', live ? 'bg-brand-mint text-brand-ink' : 'bg-paper text-graphite')}>{live ? 'Passed' : 'Testing'}</span>
          </div>
          <div className="grid gap-2 px-4 py-4">
            <p className={cn(bubble, 'rounded-bl-[5px] bg-paper text-ink', t >= 1 ? 'opacity-100' : 'translate-y-1 opacity-0')}>{hiw.test.ask}</p>
            <p className={cn(bubble, 'ml-auto rounded-br-[5px] bg-ink text-white', t >= 2 ? 'opacity-100' : 'translate-y-1 opacity-0')}>{hiw.test.reply}</p>
            <p className={cn(bubble, 'rounded-bl-[5px] bg-paper text-ink', t >= 3 ? 'opacity-100' : 'translate-y-1 opacity-0')}>{hiw.test.ok}</p>
          </div>
          <div className="flex items-center justify-between border-t border-ink/[0.07] px-4 py-3">
            <span className={cn('text-[13px] font-medium transition-colors duration-500', live ? 'text-brand-ink' : 'text-ink')}>{live ? 'Live on your channels' : 'Go live'}</span>
            <span className={cn('relative h-6 w-11 rounded-full transition-colors duration-500', live ? 'bg-brand' : 'bg-ink/15')}>
              <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-500', live ? 'left-[22px]' : 'left-0.5')} />
            </span>
          </div>
        </div>
      </Stage>
    </div>
  );
}

const VISUALS = [PlanVisual, ConnectVisual, GoLiveVisual];

/**
 * How it works (home page): three steps one under the other along a rail, each with its own
 * live illustration: the action plan is written and approved, Aurora connects the tools,
 * a test conversation runs and the switch goes on.
 */
export default function Configure() {
  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" titleA={hiw.titleA} text={hiw.text} layout="split" />

        <ol className="relative mt-12 grid gap-12 md:mt-16 md:gap-16">
          {hiw.steps.map((s, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={s.name} className="relative grid gap-6 pl-7 md:grid-cols-12 md:items-center md:gap-10 md:pl-10">
                {/* the rail: one segment per step, coloured by who does it */}
                <span aria-hidden="true" className={cn('absolute bottom-0 left-0 top-0 w-1.5 rounded-full', TONE[s.tone])} />
                <Reveal y={16} className="md:col-span-4">
                  <p className="text-[13px] text-slate">{s.who}</p>
                  <h3 className="t-h3 mt-2">{s.name}</h3>
                  <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-graphite">{s.text}</p>
                </Reveal>
                <Reveal y={28} delay={0.08} className="md:col-span-8">
                  <Visual />
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
