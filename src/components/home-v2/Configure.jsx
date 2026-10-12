import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
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
import LiquidGlass from './primitives/LiquidGlass';

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
  const reduce = useReducedMotion();
  // 1 question · 2 Aurora checks the data (typing) · 3 answer · 4 the listings · 5 test summary · 7 approved · pause
  const t = useLoop(ref, { steps: 12, final: 8, ms: 900 });
  const show = (on) => (on ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.98] opacity-0');
  const bubble = 'max-w-[82%] w-fit px-3.5 py-2 text-[13px] leading-snug transition-all duration-500 ease-out origin-bottom';
  const them = cn(bubble, 'rounded-[20px] rounded-bl-[6px] bg-white/80 text-ink shadow-[0_1px_1px_rgba(10,15,14,0.04)]');
  const me = cn(bubble, 'ml-auto rounded-[20px] rounded-br-[6px] bg-[linear-gradient(160deg,#FFB86A,#FF9F45)] text-ink origin-bottom-right');
  return (
    <div ref={ref}>
      <div className="canvas relative bg-[linear-gradient(160deg,#FFF6E5_0%,#FCEBD0_100%)] p-3 xs:p-4 md:p-5">
        {/* warm Aurora light behind the glass */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={cn('absolute -left-[10%] -top-[20%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.55),rgba(242,92,42,0))] blur-2xl', !reduce && 'animate-drift')} />
          <div className={cn('absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.8),rgba(255,200,87,0))] blur-2xl', !reduce && 'animate-drift [animation-delay:-8s]')} />
        </div>

        <LiquidGlass
          className="relative overflow-hidden rounded-[26px]"
          style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.25)' }}
        >
          {/* conversation header, as on a phone */}
          <div className="flex flex-col items-center gap-1 border-b border-white/50 px-4 pb-2.5 pt-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
              <img src="/brand/aurora-symbol-color.svg" alt="" className="h-5 w-5" />
            </span>
            <p className="text-[12px] font-medium leading-none text-ink">Maple Realty</p>
            <p className="text-[10.5px] leading-none text-ink/50">Test run · answered by {brand.product}</p>
          </div>

          <div className="flex min-h-[236px] flex-col gap-1.5 px-3.5 py-3.5">
            {/* the customer (this phone's owner) asks */}
            <p className={cn(me, show(t >= 1))}>{T.ask}</p>

            {/* Aurora looks it up, then answers */}
            <p className={cn('my-1 text-center text-[10.5px] text-ink/50 transition-opacity duration-500', t >= 2 ? 'opacity-100' : 'opacity-0')}>
              {t >= 3 ? `Checked ${T.scanned}` : 'Checking your listings…'}
            </p>
            {t === 2 && !reduce ? (
              <span className={cn(them, 'flex items-center gap-1 py-3')} aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-blink rounded-full bg-ink/40" style={{ animationDelay: d * 0.18 + 's' }} />
                ))}
              </span>
            ) : null}
            <p className={cn(them, show(t >= 3), t < 3 && 'hidden')}>Yes, two match.</p>
            <div className={cn(them, show(t >= 4), t < 4 && 'hidden', 'grid gap-1')}>
              {T.results.map(([addr, price]) => (
                <span key={addr}>
                  {addr}, <span className="text-ink/60">{price}</span>
                </span>
              ))}
              <span className="mt-0.5">Both have parking. Want the details?</span>
            </div>
          </div>

          {/* your sign-off, as a quiet system line under the chat */}
          <div className={cn('flex items-center justify-between gap-3 border-t border-white/50 px-4 py-2.5 transition-colors duration-500', t >= 7 ? 'bg-white/45' : 'bg-white/15')}>
            <span className="min-w-0 text-[11.5px] leading-snug text-ink/70">{t >= 5 ? T.passed : 'Running test questions…'}</span>
            <span
              className={cn(
                'flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-medium transition-all duration-500',
                t >= 7 ? 'bg-ink text-white' : t >= 5 ? 'bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.1)]' : 'bg-white/40 text-ink/40'
              )}
            >
              {t >= 7 ? <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" /> : null}
              {t >= 7 ? 'Live' : 'Approve'}
            </span>
          </div>
        </LiquidGlass>
      </div>
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
