import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

const K = platformPage.kpi;
const C = K.chart;
const EASE = [0.22, 1, 0.36, 1];

// When each step starts (ms), and how long the whole story runs before it starts again.
const STEP_AT = [0, 3200, 6200, 9200];
const LOOP_MS = 13500;

/*
 * The chart, in a 560 x 240 frame. One week of one KPI: on target, a dip on Wednesday, back above
 * target after the fix. Values are illustrative. `upTo` is the share of the line drawn at each step.
 */
const W = 560;
const H = 240;
const TARGET_Y = 112;
const X = (i) => 36 + i * 81; // seven days across
const LINE = 'M36 88 C 78 86 96 90 117 96 C 150 108 170 152 198 162 C 222 170 248 160 279 142 C 312 122 330 100 360 88 C 400 76 430 72 441 70 C 470 66 500 64 522 62';
const DIP = { x: 198, y: 162 };
const END = { x: 522, y: 62 };
const DRAWN = [0.38, 0.38, 0.52, 1]; // step 1 draws to the dip, step 3 starts the recovery, step 4 finishes it
const AREA_W = [DIP.x, DIP.x, 300, W];

function useStep(active, still) {
  const [step, setStep] = useState(3);
  useEffect(() => {
    if (still) {
      setStep(3);
      return undefined;
    }
    if (!active) return undefined;
    let timers = [];
    // -1 clears the chart without animating, so each loop draws the week from Monday again
    const run = () => {
      setStep(-1);
      timers = STEP_AT.map((t, i) => window.setTimeout(() => setStep(i), t + 80));
      timers.push(window.setTimeout(run, LOOP_MS));
    };
    run();
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active, still]);
  return step;
}

function Chart({ step, calm }) {
  const reset = step < 0;
  const tr = calm || reset ? 'none' : 'stroke-dashoffset 1.8s cubic-bezier(0.65,0,0.35,1), transform 1.8s cubic-bezier(0.65,0,0.35,1)';
  const drawn = reset ? 0 : DRAWN[step];
  const area = reset ? 0 : AREA_W[step];
  const recovered = step >= 3;
  const dipped = step >= 0;
  const late = (on) => ({ opacity: on ? 1 : 0, transition: calm || !on ? 'none' : 'opacity 0.5s ease 1.4s' });
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="kpi-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9F45" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FF9F45" stopOpacity="0" />
          </linearGradient>
          <clipPath id="kpi-reveal">
            <rect x="0" y="0" width={W} height={H} style={{ transform: `scaleX(${area / W})`, transformOrigin: '0 0', transition: tr }} />
          </clipPath>
        </defs>

        {/* days */}
        {C.days.map((d, i) => (
          <g key={d}>
            <line x1={X(i)} y1="24" x2={X(i)} y2="200" stroke="rgba(10,15,14,0.05)" />
            <text x={X(i)} y="228" textAnchor="middle" fill="rgba(10,15,14,0.45)" style={{ fontSize: 15 }}>
              {d}
            </text>
          </g>
        ))}

        {/* target */}
        <line x1="24" y1={TARGET_Y} x2={W - 16} y2={TARGET_Y} stroke="rgba(10,15,14,0.35)" strokeDasharray="5 5" />
        <text x="26" y={TARGET_Y - 8} textAnchor="start" fill="rgba(10,15,14,0.5)" style={{ fontSize: 15 }}>
          Target
        </text>

        {/* the week so far */}
        <path d={`${LINE} L 522 200 L 36 200 Z`} fill="url(#kpi-area)" clipPath="url(#kpi-reveal)" />
        <path
          d={LINE}
          pathLength="1"
          stroke="#1A1410"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          style={{ strokeDashoffset: 1 - drawn, transition: tr }}
        />

        {/* the dip and the recovery */}
        <circle cx={DIP.x} cy={DIP.y} r="6" fill="#F25C2A" stroke="#fff" strokeWidth="2.5" style={late(dipped)} />
        <circle
          cx={END.x}
          cy={END.y}
          r="6"
          fill="#2E9A58"
          stroke="#fff"
          strokeWidth="2.5"
          style={late(recovered)}
        />
      </svg>

      {/* labels on the chart */}
      <span
        className="absolute flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[#FFF1E4] px-2 py-0.5 text-[11px] font-medium text-[#B4471A]"
        style={{ left: `${(DIP.x / W) * 100}%`, top: `${((DIP.y + 14) / H) * 100}%`, ...late(dipped) }}
      >
        <ArrowDownRight className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
        {C.slipping}
      </span>
      <span
        className="absolute flex -translate-x-full items-center gap-1 whitespace-nowrap rounded-full bg-[#E4F4E8] px-2 py-0.5 text-[11px] font-medium text-[#2E7A48]"
        style={{
          left: `${(END.x / W) * 100}%`,
          top: `${((END.y - 36) / H) * 100}%`,
          ...late(recovered),
        }}
      >
        <CircleCheck className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
        {C.recovered}
      </span>
    </div>
  );
}

/**
 * KPI Agent: one week of one agent's KPI, in four steps. The line drops below target, the cause is found,
 * a fix is approved, the line recovers. Loops while on screen; reduced motion shows the finished week.
 */
export default function PlatformKpi() {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35 });
  const visible = usePageVisible();
  const still = reduce || !inView;
  const raw = useStep(inView && visible, reduce);
  const step = Math.max(0, raw);
  const story = C.story[step];

  return (
    <section id="kpi-agent" data-nav-theme="light" aria-labelledby="kpi-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="kpi-title" eyebrow={K.eyebrow} titleA={K.titleA} titleB={K.titleB} text={K.text} layout="split" />

        <Reveal y={32}>
          <div
            ref={ref}
            className="canvas canvas-grain relative mt-8 grid gap-6 bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-14 md:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:items-center lg:gap-10 lg:p-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute right-[8%] top-[-12%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />
            </div>

            {/* the four steps: a list on desktop, a progress bar and the current step on phones */}
            <div className="relative">
              <p className="w-fit rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-white">{K.badge}</p>
              <ol className="mt-5 hidden gap-1 lg:grid">
                {K.steps.map((s, i) => (
                  <li
                    key={s.title}
                    className={cn('flex gap-3 rounded-[16px] p-3 transition-colors duration-500', i === step ? 'bg-white/80 shadow-[0_0_0_1px_rgba(10,15,14,0.05)]' : 'bg-transparent')}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors duration-500',
                        i === step ? 'bg-ink text-white' : i < step ? 'bg-[#FFF1E6] text-[#B4471A]' : 'bg-ink/[0.06] text-ink/50'
                      )}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className={cn('block text-[15px] font-medium tracking-[-0.01em] transition-colors duration-500', i === step ? 'text-ink' : 'text-ink/55')}>{s.title}</span>
                      <span className={cn('mt-0.5 block text-[13.5px] leading-snug transition-colors duration-500', i === step ? 'text-graphite' : 'text-ink/40')}>{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 lg:hidden">
                <div className="flex gap-1.5" aria-hidden="true">
                  {K.steps.map((s, i) => (
                    <span key={s.title} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', i <= step ? 'bg-ink' : 'bg-ink/10')} />
                  ))}
                </div>
                <p className="mt-3 text-[16px] font-medium tracking-[-0.01em] text-ink">
                  <span className="mr-2 text-ink/40">{step + 1}</span>
                  {K.steps[step].title}
                </p>
                <p className="mt-0.5 text-[14px] leading-snug text-graphite">{K.steps[step].text}</p>
              </div>
            </div>

            {/* the chart, then what happened at this step */}
            <div className="relative grid gap-3">
              <div className="rounded-[22px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)] md:p-5">
                <p className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <span className="text-[14px] font-medium text-ink">{C.metric}</span>
                  <span className="text-[12px] text-slate">{C.agent} · this week</span>
                </p>
                <div className="mt-3">
                  <Chart step={raw} calm={still} />
                </div>
              </div>

              <div className="relative min-h-[84px]">
                <AnimatePresence mode="wait" initial={false}>
                  <LiquidGlass
                    as={motion.div}
                    key={step}
                    initial={still ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="rounded-[18px] p-4"
                    style={{ '--lg-tint-a': 'rgba(255,252,247,0.75)', '--lg-tint-b': 'rgba(255,248,236,0.45)' }}
                  >
                    <p className={cn('text-[11.5px] font-medium', step === 0 ? 'text-[#B4471A]' : step === 3 ? 'text-[#2E7A48]' : 'text-[#D9481C]')}>{story.tag}</p>
                    <p className="mt-1 text-[15px] leading-snug text-ink">{story.text}</p>
                    {story.who ? (
                      <p className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#E4F4E8] px-2.5 py-1 text-[11.5px] font-medium text-[#2E7A48]">
                        <CircleCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                        {story.who}
                      </p>
                    ) : null}
                  </LiquidGlass>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-center text-[12px] text-slate">{K.note}</p>
      </div>
    </section>
  );
}
