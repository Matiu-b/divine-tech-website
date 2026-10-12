import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
/** Three-dot typing indicator inside a bubble. */
function Typing({ dark }) {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="typing">
      {[0, 1, 2].map((d) => (
        <span key={d} className={cn('h-1.5 w-1.5 animate-blink rounded-full', dark ? 'bg-white/70' : 'bg-ink/40')} style={{ animationDelay: d * 0.18 + 's' }} />
      ))}
    </span>
  );
}

function GoLiveVisual() {
  const ref = useRef(null);
  const T = hiw.test;
  const reduce = useReducedMotion();
  // The conversation plays inside a fixed window: older messages scroll up as new ones arrive.
  // 1 ask · 2 typing · 3 two options · 5 customer picks · 6 typing · 7 photos · 9 test passed · 10 approved · pause
  const t = useLoop(ref, { steps: 14, final: 11, ms: 1000 });

  const msgs = [];
  if (t >= 1) msgs.push({ id: 'ask', who: 'customer', body: T.ask });
  if (t === 2) msgs.push({ id: 'typing1', who: 'aurora', typing: true });
  if (t >= 3)
    msgs.push({
      id: 'options',
      who: 'aurora',
      body: (
        <span className="grid gap-1.5">
          <span>Yes, I have 2 options:</span>
          {T.options.map((o, i) => (
            <span key={o.addr} className="grid grid-cols-[auto_1fr] gap-x-2 rounded-[12px] bg-white/80 px-2.5 py-1.5">
              <span className="text-ink/40">{i + 1}</span>
              <span>
                {o.addr} · {o.price}
                <span className="block text-[11.5px] text-ink/55">{o.note}</span>
              </span>
            </span>
          ))}
          <span>Which one works better for you?</span>
        </span>
      ),
    });
  if (t >= 5) msgs.push({ id: 'pick', who: 'customer', body: T.pick });
  if (t === 6) msgs.push({ id: 'typing2', who: 'aurora', typing: true });
  if (t >= 7)
    msgs.push({
      id: 'photos',
      who: 'aurora',
      body: (
        <span className="grid gap-1.5">
          <span className="grid grid-cols-3 gap-1">
            {T.photos.map((src, i) => (
              <img key={src} src={src} alt={['Living room', 'Kitchen', 'Bedroom'][i] + ' at 42 Maple St'} loading="lazy" className="aspect-[4/3] w-full rounded-[8px] object-cover" />
            ))}
          </span>
          <span>{T.photosText}</span>
        </span>
      ),
    });

  const bubble = 'max-w-[84%] w-fit px-3.5 py-2 text-[13px] leading-snug';
  const styles = {
    customer: cn(bubble, 'rounded-[20px] rounded-bl-[6px] bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.06)]'),
    aurora: cn(bubble, 'ml-auto rounded-[20px] rounded-br-[6px] bg-[linear-gradient(160deg,rgba(235,236,238,0.75),rgba(214,216,220,0.55))] text-ink ring-1 ring-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_16px_-10px_rgba(10,15,14,0.35)] backdrop-blur-md'),
  };
  const enter = reduce ? {} : { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } };

  return (
    <div ref={ref}>
      <div className="canvas relative bg-[linear-gradient(160deg,#F3F1EC_0%,#E9E5DD_100%)] p-3 xs:p-4 md:p-5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={cn('absolute -left-[10%] -top-[20%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.22),rgba(255,159,69,0))] blur-2xl', !reduce && 'animate-drift')} />
          <div className={cn('absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.3),rgba(255,200,87,0))] blur-2xl', !reduce && 'animate-drift [animation-delay:-8s]')} />
        </div>

        <LiquidGlass className="relative overflow-hidden rounded-[26px]" style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.25)' }}>
          <div className="flex items-center justify-between border-b border-white/50 px-4 py-2 text-[10.5px] font-medium text-ink/45">
            <span>Customer</span>
            <span>{brand.product}, your AI agent</span>
          </div>

          {/* fixed-height window, anchored to the bottom like a chat app */}
          <div className="relative h-[300px] overflow-hidden px-3.5 py-3">
            <div className="absolute inset-x-3.5 bottom-3 flex flex-col gap-1.5">
              <AnimatePresence initial={false}>
                {msgs.map((m) => (
                  <motion.div key={m.id} layout={!reduce} {...enter} className={cn('flex', m.who === 'aurora' ? 'justify-end' : 'justify-start')}>
                    <div className={styles[m.who]}>{m.typing ? <Typing /> : m.body}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#FBF7F0]/80 to-transparent" />
          </div>

          <div className={cn('flex items-center justify-between gap-3 border-t border-white/50 px-4 py-2.5 transition-colors duration-500', t >= 10 ? 'bg-white/45' : 'bg-white/15')}>
            <span className="min-w-0 text-[11.5px] leading-snug text-ink/70">
              {t >= 10 ? 'Approved. Customers now get these answers.' : t >= 9 ? 'Test passed: 24 of 24 answers correct' : 'Testing on real questions…'}
            </span>
            <span
              className={cn(
                'flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-medium transition-all duration-500',
                t >= 10 ? 'bg-ink text-white' : t >= 9 ? 'bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.1)]' : 'bg-white/40 text-ink/40'
              )}
            >
              {t >= 10 ? <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" /> : null}
              {t >= 10 ? 'Live' : 'Approve'}
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
