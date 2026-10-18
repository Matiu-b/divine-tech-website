import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { homeLive as L } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { ConnectVisual, PlanVisual } from './Configure';
import { useInViewport, usePageVisible } from './hooks';

const EASE = [0.22, 1, 0.36, 1];
const STEP_MS = 8000;

/** Step 3: the rules the business sets, who approves what, the log, then the switch goes on. */
function RulesVisual({ active, reduce }) {
  const n = L.rules.length;
  const [t, setT] = useState(reduce ? n + 2 : 0);
  useEffect(() => {
    if (reduce) return undefined;
    if (!active) {
      setT(0);
      return undefined;
    }
    setT(0);
    const ids = Array.from({ length: n + 2 }, (_, i) => setTimeout(() => setT(i + 1), 450 + i * 650));
    return () => ids.forEach(clearTimeout);
  }, [active, reduce, n]);
  const live = t >= n + 2;
  return (
    <div className="canvas relative bg-[linear-gradient(160deg,#E4EFEA_0%,#D3E6DC_100%)] p-3 xs:p-4 md:p-5">
      <div className="ui-card p-3.5 md:p-4">
        <p className="text-[13px] font-medium text-ink">Your rules</p>
        <ul className="mt-3 grid gap-2">
          {L.rules.map((r, i) => (
            <li
              key={r.text}
              className={cn('flex items-center justify-between gap-3 rounded-[12px] bg-[#F6F3EC] px-3 py-2 text-[13px] transition-all duration-500', t > i ? 'opacity-100' : 'translate-y-1 opacity-0')}
            >
              <span className="min-w-0 text-ink">{r.text}</span>
              <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium', r.who === 'Aurora approves' ? 'bg-[#E4F4E8] text-[#1F7A4C]' : r.who === 'Always a person' ? 'bg-[#FFF1E6] text-[#B4471A]' : 'bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
                {r.who}
              </span>
            </li>
          ))}
        </ul>
        <p className={cn('mt-3 flex items-center gap-2 text-[12px] text-slate transition-opacity duration-500', t > n ? 'opacity-100' : 'opacity-0')}>
          <ScrollText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {L.log}
        </p>
        <div className="mt-3 flex items-center justify-end">
          <span className={cn('flex h-8 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-medium transition-colors duration-500', live ? 'bg-ink text-white' : 'bg-white text-ink/50 shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
            <span className={cn('relative h-4 w-7 rounded-full transition-colors duration-500', live ? 'bg-[#3DDC97]' : 'bg-ink/15')}>
              <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-500', live ? 'left-[14px]' : 'left-0.5')} />
            </span>
            {live ? L.live.on : L.live.off}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Live in days, under your rules: three steps on one stage (the working session that maps the business, Aurora
 * connecting the tools, the rules and the switch). The steps advance on their own while the section is on screen; a
 * click on a step or an arrow jumps there. Every step's text is in the HTML.
 */
export default function LiveSteps() {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.15 });
  const visible = usePageVisible();
  const navigate = useNavigate();
  const n = L.steps.length;
  const [k, setK] = useState(0);
  const [nonce, setNonce] = useState(0);
  const running = !reduce && inView && visible;

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setK((x) => (x + 1) % n), STEP_MS);
    return () => clearTimeout(id);
  }, [k, nonce, running, n]);

  const go = (x) => {
    setK((x + n) % n);
    setNonce((v) => v + 1);
  };
  const visuals = [<PlanVisual key="p" />, <ConnectVisual key="c" />, <RulesVisual key="r" active={k === 2 && running} reduce={reduce} />];
  const arrows = (size) => (
    <>
      <button type="button" onClick={() => go(k - 1)} aria-label={L.labels.prev} className={cn('flex items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]', size)}>
        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => go(k + 1)} aria-label={L.labels.next} className={cn('flex items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]', size)}>
        <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
    </>
  );

  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="live-title" className="section relative">
      <div className="shell">
        <SectionHeader id="live-title" titleA={L.titleA} text={L.text} layout="split" />

        <div ref={ref} className="canvas canvas-grain relative mt-8 overflow-hidden bg-[linear-gradient(160deg,#F2F3EE_0%,#E4E8E1_100%)] p-4 xs:p-5 md:mt-12 md:p-8 lg:px-10 lg:py-8">
          {/* the three steps: a marker for each, a check once it's done (no fill bar) */}
          <ol className="relative grid grid-cols-3" aria-label="How Aurora goes live">
            <span aria-hidden="true" className="absolute left-[16.66%] right-[16.66%] top-[13px] h-px bg-ink/15" />
            {L.steps.map((x, i) => {
              const cur = i === k;
              const done = i < k;
              return (
                <li key={x.key} className="relative flex justify-center">
                  <button type="button" onClick={() => go(i)} aria-current={cur ? 'step' : undefined} className="group flex flex-col items-center gap-1.5 px-1 text-center">
                    <span
                      className={cn(
                        'relative z-[1] flex h-[27px] w-[27px] items-center justify-center rounded-full text-[12px] font-medium transition-colors duration-300',
                        cur ? 'bg-[#14A36B] text-white shadow-[0_0_0_5px_rgba(20,163,107,0.16)]' : done ? 'bg-ink text-white' : 'bg-[#F2F3EE] text-ink/45 shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.18)] group-hover:text-ink'
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cn('text-[12px] font-medium leading-tight transition-colors xs:text-[12.5px] sm:text-[13.5px]', cur ? 'text-ink' : 'text-ink/55')}>{x.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* the stage: every step in the same cell, so it never changes height */}
          <div className="relative mt-4 grid md:mt-6" aria-live="polite">
            {L.steps.map((x, i) => {
              const on = i === k;
              return (
                <div key={x.key} className={cn('[grid-area:1/1] grid gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-10', on ? '' : 'invisible')} aria-hidden={on ? undefined : true}>
                  <motion.div key={on ? 'on' : 'off'} initial={reduce || !on ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                    <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#14A36B]">
                      {String(i + 1).padStart(2, '0')} · {x.who}
                    </p>
                    <h3 className="mt-1.5 text-[19px] font-medium leading-tight tracking-[-0.015em] text-ink md:mt-2 md:text-[26px]">{x.name}</h3>
                    <p className="pretty mt-2 max-w-[30em] text-[14.5px] leading-snug text-ink md:mt-3 md:text-[17px] md:leading-[1.45]">{x.sentence}</p>
                    <div className="mt-6 flex items-center gap-2 max-md:hidden">
                      {arrows('h-10 w-10')}
                      <a
                        href={L.more.href}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                          e.preventDefault();
                          navigate(L.more.href);
                        }}
                        className="ml-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                      >
                        {L.more.label}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </a>
                    </div>
                  </motion.div>
                  <div className="mx-auto w-full min-w-0 max-w-[520px]">{visuals[i]}</div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-center md:hidden">
            <a href={L.more.href} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-ink/25 underline-offset-4">
              {L.more.label}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
