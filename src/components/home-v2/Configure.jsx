import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, howItWorks as hiw } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import {
  GmailMark,
  GoogleCalendarMark,
  HubSpotMark,
  IMessageMark,
  OutlookMark,
  PayPalMark,
  PhoneTile,
  RingCentralMark,
  SalesforceMark,
  SignalMark,
  SlackMark,
  StripeMark,
  TelegramMark,
  ThreeCXMark,
  WhatsAppMark,
} from './BrandMarks';
import ProcessBoard from './ProcessBoard';

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
        'canvas canvas-grain relative p-3 xs:p-4 md:p-5',
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
  // 0-5: the map is drawn on the board step by step; then a pause before it starts again.
  const t = useLoop(ref, { steps: 11, final: 7, ms: 850 });
  return (
    <div ref={ref}>
      <Stage tone="sage">
        <ProcessBoard t={t} />
      </Stage>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Aurora connects the tools in the plan                            */
/* ------------------------------------------------------------------ */
const MARKS = {
  phone: [<PhoneTile key="p" className="h-9 w-9" />],
  email: [<GmailMark key="g" className="h-6 w-6" />, <OutlookMark key="o" className="h-6 w-6" />],
  calendar: [<GoogleCalendarMark key="c" className="h-6 w-6" />],
  crm: [<HubSpotMark key="h" className="h-6 w-6" />, <SalesforceMark key="s" className="h-6 w-9" />],
  messaging: [
    <WhatsAppMark key="w" className="h-6 w-6" />,
    <IMessageMark key="i" className="h-6 w-6" />,
    <SignalMark key="si" className="h-6 w-6" />,
    <TelegramMark key="t" className="h-6 w-6" />,
    <SlackMark key="sl" className="h-6 w-6" />,
  ],
  pbx: [<RingCentralMark key="rc" className="h-4 w-[84px]" />, <ThreeCXMark key="3cx" className="h-6 w-6 rounded-[5px]" />],
  payments: [<StripeMark key="st" className="h-[18px] w-11" />, <PayPalMark key="pp" className="h-6 w-5" />],
};

function ConnectVisual() {
  const ref = useRef(null);
  const n = hiw.connect.length;
  const t = useLoop(ref, { steps: n + 5, final: n + 1, ms: 650 });
  const done = Math.max(0, Math.min(n, t));
  return (
    <div ref={ref}>
      <Stage tone="sand">
        <div className="ui-card p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">{done === n ? brand.product + ' is connected' : 'Connecting your tools…'}</p>
            <span className="t-data text-[11.5px] text-slate">
              {done}/{n}
            </span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink/[0.08]">
            <div className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out" style={{ width: (done / n) * 100 + '%' }} />
          </div>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {hiw.connect.map((c, i) => {
              const on = done > i;
              return (
                <li key={c.key} title={c.label} className={cn('flex', (c.wide || c.key === 'pbx') && 'col-span-2')}>
                  <span
                    className={cn(
                      'relative flex h-11 w-full items-center justify-center gap-2.5 rounded-[12px] border bg-white px-2 transition-all duration-500',
                      on ? 'border-ink/[0.08] opacity-100 grayscale-0' : 'border-transparent opacity-45 grayscale'
                    )}
                  >
                    {MARKS[c.key]}
                    <span
                      className={cn(
                        'absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-transform duration-300',
                        on ? 'scale-100' : 'scale-0'
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3.4} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="sr-only">{c.label}</span>
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
  const T = hiw.test;
  // 1 question · 2 lookup · 3 results · 4 reply · 5-7 checks · 8 approved · pause
  const t = useLoop(ref, { steps: 13, final: 9, ms: 850 });
  const appear = (on) => (on ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0');
  return (
    <div ref={ref}>
      <Stage tone="mint">
        {/* one compact card with the whole test: question, lookup, answer, your approval */}
        <div className="ui-card overflow-hidden">
          <div className="grid gap-2 px-3.5 py-3.5">
            <p className={cn('max-w-[92%] rounded-[16px] rounded-bl-[5px] bg-paper px-3 py-2 text-[12.5px] leading-snug text-ink transition-all duration-500', appear(t >= 1))}>{T.ask}</p>
            <p className={cn('flex items-center gap-1.5 px-1 text-[11px] text-slate transition-opacity duration-500', t >= 2 ? 'opacity-100' : 'opacity-0')}>
              <Database className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
              {t >= 3 ? T.source + ' · ' + T.results.length + ' matches' : 'Searching ' + T.scanned + '…'}
            </p>
            <p className={cn('ml-auto max-w-[92%] rounded-[16px] rounded-br-[5px] bg-ink px-3 py-2 text-[12.5px] leading-snug text-white transition-all duration-500', appear(t >= 4))}>{T.reply}</p>
          </div>
          <div className={cn('flex items-center gap-2.5 border-t px-3.5 py-2.5 transition-colors duration-500', t >= 8 ? 'border-brand/20 bg-brand-mint text-brand-ink' : 'border-ink/[0.07] bg-paper/60 text-slate')}>
            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-500', t >= 8 ? 'bg-brand text-white' : 'bg-ink/10 text-transparent')}>
              <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden="true" />
            </span>
            <span className="text-[12px] font-medium leading-tight">
              {t >= 8 ? 'You approved · live' : t >= 5 ? 'Checks passed · waiting for your approval' : 'Running test cases…'}
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

        <ol className="relative mt-10 grid gap-8 md:mt-14 md:gap-12">
          {hiw.steps.map((s, i) => {
            const Visual = VISUALS[i];
            return (
              <li key={s.name} className="relative grid gap-4 pl-5 md:grid-cols-12 md:items-center md:gap-10 md:pl-10">
                {/* the rail: one segment per step, coloured by who does it */}
                <span aria-hidden="true" className={cn('absolute bottom-0 left-0 top-0 w-1.5 rounded-full', TONE[s.tone])} />
                <Reveal y={16} className="md:col-span-5">
                  <p className="text-[13px] text-slate">{s.who}</p>
                  <h3 className="t-h3 mt-2">{s.name}</h3>
                  <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-graphite">{s.text}</p>
                </Reveal>
                <Reveal y={28} delay={0.08} className="w-full max-w-[440px] md:col-span-7">
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
