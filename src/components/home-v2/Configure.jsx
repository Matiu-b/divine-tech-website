import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CalendarDays, Check, Database, Hash, MessageCircle, Phone, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { howItWorks as hiw } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

// Who does each phase decides its colour on the timeline: ink = our experts with you, green = Aurora.
const TONE = { you: 'bg-ink', aurora: 'bg-brand' };
// Relative length of each phase on the ruler (desktop): mapping, setup, approval.
const SPAN = ['md:col-span-1', 'md:col-span-2', 'md:col-span-1'];
const CONNECT_ICON = { WhatsApp: MessageCircle, Phone, Slack: Hash, CRM: Database, Calendar: CalendarDays };

// One loop of the story, in ticks: the plan fills in (1-3), Aurora connects (4-8),
// the test conversation runs (9-10), the switch goes on (11), then a pause and it starts again.
const TICK_MS = 850;
const LOOP = 15;
const FINAL = 12;

/** Step 1: the action plan being written, line by line. */
function PlanVisual({ t }) {
  return (
    <div className="ui-card flex min-h-[172px] flex-col p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-paper text-ink/70">
          <ListChecks className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-[12px] font-medium text-ink">Action plan</span>
      </div>
      <ul className="mt-2.5 grid gap-1.5">
        {hiw.plan.map((line, i) => {
          const on = t > i;
          return (
            <li
              key={line}
              className={cn(
                'flex items-center gap-2 rounded-[9px] border border-ink/[0.06] px-2 py-1.5 text-[11.5px] text-ink transition-all duration-500',
                on ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              )}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              <span className="truncate">{line}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Step 2: Aurora connecting each channel and system from the plan. */
function ConnectVisual({ t }) {
  const done = Math.max(0, Math.min(hiw.connect.length, t - 3));
  const ready = done === hiw.connect.length;
  return (
    <div className="ui-card flex min-h-[172px] flex-col p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-ink">{ready ? 'Connected' : 'Connecting…'}</span>
        <span className="t-data text-[11px] text-slate">
          {done}/{hiw.connect.length}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[0.08]">
        <div className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out" style={{ width: (done / hiw.connect.length) * 100 + '%' }} />
      </div>
      <ul className="mt-auto grid grid-cols-3 gap-x-1.5 gap-y-2.5 pt-3 sm:grid-cols-5 sm:gap-y-1.5">
        {hiw.connect.map((name, i) => {
          const Icon = CONNECT_ICON[name] || Database;
          const on = done > i;
          return (
            <li key={name} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center rounded-[11px] transition-colors duration-500',
                  on ? 'bg-brand-mint text-brand-ink' : 'bg-paper text-ink/35'
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                <span
                  className={cn(
                    'absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300',
                    on ? 'scale-100' : 'scale-0'
                  )}
                >
                  <Check className="h-2 w-2" strokeWidth={3.4} aria-hidden="true" />
                </span>
              </span>
              <span className="max-w-full truncate text-[10px] text-slate">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Step 3: a test conversation, then the go-live switch. */
function GoLiveVisual({ t }) {
  const ask = t >= 9;
  const reply = t >= 10;
  const live = t >= 11;
  return (
    <div className="ui-card flex min-h-[172px] flex-col p-3.5">
      <div className="mb-3 grid gap-1.5">
        <p className={cn('w-fit max-w-[92%] rounded-[12px] rounded-bl-[4px] bg-paper px-2.5 py-1.5 text-[11.5px] leading-snug text-ink transition-opacity duration-500', ask ? 'opacity-100' : 'opacity-0')}>
          {hiw.test.ask}
        </p>
        <p
          className={cn(
            'ml-auto w-fit max-w-[92%] rounded-[12px] rounded-br-[4px] bg-ink px-2.5 py-1.5 text-[11.5px] leading-snug text-white transition-opacity duration-500',
            reply ? 'opacity-100' : 'opacity-0'
          )}
        >
          {hiw.test.reply}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-ink/[0.07] pt-2.5">
        <span className={cn('text-[12px] font-medium transition-colors duration-500', live ? 'text-brand-ink' : 'text-slate')}>{live ? 'Live' : 'Go live'}</span>
        <span className={cn('relative h-5 w-9 rounded-full transition-colors duration-500', live ? 'bg-brand' : 'bg-ink/15')}>
          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] duration-500', live ? 'left-[18px]' : 'left-0.5')} />
        </span>
      </div>
    </div>
  );
}

const VISUALS = [PlanVisual, ConnectVisual, GoLiveVisual];

/**
 * How it works (home page): going live as one timeline from start to live, coloured by who does
 * the work. Each phase has a small live illustration, and together they play the story in order:
 * the plan is written, Aurora connects, a test runs, the switch goes on.
 */
export default function Configure() {
  const ref = useRef(null);
  const seen = useInViewport(ref, { threshold: 0.35, once: true });
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const reduce = useReducedMotion();
  const fill = seen || reduce;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce || !seen || !inView || !visible) return undefined;
    const id = window.setInterval(() => setTick((n) => (n + 1) % LOOP), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduce, seen, inView, visible]);

  const t = reduce ? FINAL : tick;

  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" titleA={hiw.titleA} text={hiw.text} layout="split" />

        <Reveal className="mt-12 md:mt-16">
          <div ref={ref}>
            <div className="mb-4 hidden justify-between text-[13px] text-slate md:flex" aria-hidden="true">
              <span>Start</span>
              <span>Live</span>
            </div>

            <ol className="grid gap-0 md:grid-cols-4 md:gap-1.5">
              {hiw.steps.map((s, i) => {
                const Visual = VISUALS[i];
                return (
                  <li key={s.name} className={cn('flex gap-5 md:flex-col md:gap-6', SPAN[i])}>
                    {/* the phase on the ruler */}
                    <span aria-hidden="true" className="relative w-1.5 shrink-0 overflow-hidden rounded-full bg-ink/[0.08] md:h-2 md:w-full">
                      <span
                        className={cn(
                          'absolute inset-0 origin-top rounded-full transition-transform duration-700 ease-out md:origin-left',
                          TONE[s.tone],
                          fill ? 'scale-100' : 'scale-y-0 md:scale-x-0 md:scale-y-100'
                        )}
                        style={{ transitionDelay: reduce ? '0ms' : i * 450 + 'ms' }}
                      />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col pb-10 md:pb-0 md:pr-4">
                      <p className="text-[13px] text-slate">{s.who}</p>
                      <h3 className="mt-1.5 text-[19px] font-medium leading-snug md:text-[20px]">{s.name}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-graphite">{s.text}</p>
                      <div className={cn('pt-4 md:mt-auto', i === 1 && 'md:max-w-[440px]')} aria-hidden="true">
                        <Visual t={t} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
