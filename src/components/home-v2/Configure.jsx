import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, Database, FileText, Search } from 'lucide-react';
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
  SalesforceMark,
  SignalMark,
  SlackMark,
  StripeMark,
  TeamsMark,
  TelegramMark,
  WhatsAppMark,
  ZoomMark,
} from './BrandMarks';
import MappingScene from './MappingScene';

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
  // 0-6: the map is drawn on the board; 7-10: the plan rows are written; 11: approved; then a pause.
  const t = useLoop(ref, { steps: 16, final: 12 });
  const approved = t >= 11;
  return (
    <div ref={ref}>
      <Stage tone="sage">
        <MappingScene t={t} />
        <div className="ui-card relative mt-2 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-paper text-ink/70">
              <FileText className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-ink sm:truncate">Action plan · {hiw.plan.company}</p>
              <p className="text-[11.5px] text-slate sm:truncate">{hiw.plan.people.join(' · ')}</p>
            </div>
            <span className={cn('ui-chip shrink-0 transition-colors duration-500', approved ? 'bg-brand-mint text-brand-ink' : 'bg-paper text-graphite')}>
              {approved ? 'Approved' : 'Draft'}
            </span>
          </div>
          <ul className="grid gap-0.5 px-2 py-2">
            {rows.map((r, i) => {
              const on = t > 6 + i;
              return (
                <li
                  key={r.process}
                  className={cn(
                    'grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] px-2 py-1.5 transition-all duration-500',
                    on ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-ink">
                    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-500', approved ? 'border-brand bg-brand text-white' : 'border-ink/20 text-transparent')}>
                      <Check className="h-2.5 w-2.5" strokeWidth={3.2} aria-hidden="true" />
                    </span>
                    <span className="leading-snug sm:truncate">{r.process}</span>
                  </span>
                  <span className={cn('text-right text-[11.5px] font-medium', r.owner === 'Aurora' ? 'text-brand-ink' : 'text-[#8A5A12]')}>{r.owner}</span>
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
  pbx: [<TeamsMark key="tm" className="h-6 w-6" />, <ZoomMark key="z" className="h-6 w-6" />],
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
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {hiw.connect.map((c, i) => {
              const on = done > i;
              return (
                <li key={c.key} className={cn('flex flex-col items-center gap-2', c.wide && 'col-span-2')}>
                  <span
                    className={cn(
                      'relative flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] border bg-white px-2 transition-all duration-500',
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
                  <span className="text-center text-[11px] text-graphite">{c.label}</span>
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
        <div className="grid gap-3 md:grid-cols-[1.05fr_0.95fr]">
          {/* the test conversation */}
          <div className="ui-card flex flex-col overflow-hidden">
            <div className="border-b border-ink/[0.07] px-4 py-3">
              <p className="text-[13px] font-medium text-ink">Test run</p>
              <p className="text-[11.5px] text-slate">A real question from your business</p>
            </div>
            <div className="grid gap-2 px-4 py-4">
              <p className={cn('max-w-[90%] rounded-[16px] rounded-bl-[5px] bg-paper px-3 py-2 text-[12.5px] leading-snug text-ink transition-all duration-500', appear(t >= 1))}>{T.ask}</p>
              <p className={cn('ml-auto max-w-[90%] rounded-[16px] rounded-br-[5px] bg-ink px-3 py-2 text-[12.5px] leading-snug text-white transition-all duration-500', appear(t >= 4))}>{T.reply}</p>
            </div>
          </div>

          {/* the data lookup behind the answer */}
          <div className="ui-card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-4 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-paper text-ink/70">
                <Database className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{T.source}</p>
                <p className={cn('flex items-center gap-1 text-[11.5px] text-slate transition-opacity duration-500', t >= 2 ? 'opacity-100' : 'opacity-0')}>
                  <Search className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  {t >= 3 ? 'Searched ' + T.scanned + ' · ' + T.results.length + ' match' : 'Searching ' + T.scanned + '…'}
                </p>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className={cn('flex flex-wrap gap-1.5 transition-all duration-500', appear(t >= 2))}>
                {T.filters.map((f) => (
                  <span key={f} className="ui-chip bg-paper text-graphite">
                    {f}
                  </span>
                ))}
              </div>
              <ul className="mt-3 grid gap-1.5">
                {T.results.map(([addr, price, extra], i) => (
                  <li
                    key={addr}
                    className={cn('grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] bg-brand-mint/60 px-2.5 py-2 text-[12px] transition-all duration-500', appear(t >= 3))}
                    style={{ transitionDelay: t >= 3 ? i * 150 + 'ms' : '0ms' }}
                  >
                    <span className="truncate text-ink">{addr}</span>
                    <span className="t-data text-brand-ink">
                      {price} · {extra}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* what the test checked, and your approval */}
        <div className="ui-card mt-3 grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="grid gap-1.5 sm:grid-cols-3 sm:gap-3">
            {T.checks.map((c, i) => {
              const on = t >= 5 + i;
              return (
                <li key={c} className="flex items-center gap-2 text-[12px] text-ink">
                  <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-500', on ? 'scale-100 bg-brand text-white' : 'scale-90 bg-ink/10 text-transparent')}>
                    <Check className="h-2.5 w-2.5" strokeWidth={3.2} aria-hidden="true" />
                  </span>
                  <span className={cn('leading-snug transition-opacity duration-500', on ? 'opacity-100' : 'opacity-40')}>{c}</span>
                </li>
              );
            })}
          </ul>
          <div className={cn('flex items-center gap-2.5 rounded-[12px] border px-3 py-2 transition-all duration-500', t >= 8 ? 'border-brand/30 bg-brand-mint text-brand-ink' : 'border-ink/10 bg-paper text-slate')}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-medium text-ink">You</span>
            <span className="text-[12px] font-medium leading-tight">
              {t >= 8 ? 'Approved · live' : 'Waiting for your approval'}
              <span className="block text-[10.5px] font-normal opacity-80">{t >= 7 ? T.passed : 'Running test cases…'}</span>
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
