import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Check, Database, ListChecks, MessageCircle, Phone, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, demo } from '@/data/site';
import Grow from './primitives/Grow';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import { EASE } from './motion';

/*
 * Scripted product demonstration: one conversation per industry while the CRM,
 * calendar and task list update. Starts when in view, replays on demand.
 */
const SCENARIOS = [
  {
    key: 're',
    label: 'Real estate',
    channel: 'WhatsApp',
    icon: MessageCircle,
    contact: 'Sarah K.',
    steps: [
      { t: 0, who: 'user', text: 'Hi, is the 2-bed on Maple St still available? Looking to move in October.' },
      { t: 900, sys: 'crm', title: 'New lead created', lines: ['Sarah K. · WhatsApp · Maple St', 'Stage: Qualifying'] },
      { t: 1500, who: 'typing' },
      { t: 2800, who: 'aurora', text: 'It is. I can show it Thursday at 5:30 pm or Saturday at 11 am. Which works for you?' },
      { t: 4500, who: 'user', text: "Saturday at 11 works. Budget's around $3,200." },
      { t: 5200, sys: 'crm', title: 'Lead updated', lines: ['Budget $3,200 · Move-in October', 'Stage: Viewing booked'] },
      { t: 5500, who: 'typing' },
      { t: 6800, who: 'aurora', text: 'Booked: Saturday 11:00 with Dana at 42 Maple St. I sent you the address and a calendar invite.' },
      { t: 7200, sys: 'cal', title: 'Viewing booked', lines: ['Sat 11:00 · Agent: Dana', 'Invite sent to Sarah'], slot: 'Sat 11:00' },
      { t: 7800, sys: 'task', title: 'Follow-up scheduled', lines: ['Reminder: Fri 6:00 pm', 'If no reply: call Sat 9:00 am'] },
      { t: 8500, done: true },
    ],
  },
  {
    key: 'hc',
    label: 'Wellness & Healthcare',
    channel: 'Phone',
    icon: Phone,
    contact: 'Patient · verified',
    steps: [
      { t: 0, who: 'user', text: 'Hi, I need to move my appointment with Dr. Levi to next week.' },
      { t: 900, sys: 'crm', title: 'Patient record found', lines: ['Verified by phone number', 'Next visit: Tue 9:20 am · Dr. Levi'] },
      { t: 1500, who: 'typing' },
      { t: 2800, who: 'aurora', text: 'Of course. Dr. Levi has Tuesday at 9:20 am or Thursday at 2:10 pm next week. Which do you prefer?' },
      { t: 4500, who: 'user', text: 'Thursday at 2:10, please.' },
      { t: 5100, who: 'typing' },
      { t: 6300, who: 'aurora', text: "Done. Thursday 2:10 pm with Dr. Levi. You'll get a reminder the day before. Anything else I can help with?" },
      { t: 6700, sys: 'cal', title: 'Appointment moved', lines: ['Thu 2:10 pm · Dr. Levi', 'Previous slot released'], slot: 'Thu 2:10' },
      { t: 7300, sys: 'task', title: 'Reminders set', lines: ['SMS: Wed 2:10 pm', 'Front desk notified'] },
      { t: 8100, done: true },
    ],
  },
  {
    key: 'hs',
    label: 'Home services',
    channel: 'Phone',
    icon: Phone,
    contact: 'New caller',
    steps: [
      { t: 0, who: 'user', text: "My AC stopped cooling and it's 90 degrees in here. Can someone come today?" },
      { t: 900, sys: 'crm', title: 'Job request captured', lines: ['AC not cooling · Urgent', 'Address confirmed from caller ID'] },
      { t: 1500, who: 'typing' },
      { t: 2800, who: 'aurora', text: 'I can get a technician to you today between 3 and 5 pm. The diagnostic is $89 and is credited toward the repair. Shall I book it?' },
      { t: 4500, who: 'user', text: 'Yes please, 3 to 5 works.' },
      { t: 5100, who: 'typing' },
      { t: 6200, who: 'aurora', text: 'Booked. Mike will text you 20 minutes before he arrives. I sent a confirmation with the details.' },
      { t: 6600, sys: 'cal', title: 'Technician dispatched', lines: ['Today 3:00–5:00 pm · Mike', 'Diagnostic $89 from price book'], slot: 'Today 3–5 pm' },
      { t: 7200, sys: 'task', title: 'After the job', lines: ['Invoice draft prepared', 'Review request queued'] },
      { t: 8000, done: true },
    ],
  },
];

const SYSTEMS = [
  { key: 'crm', label: 'CRM', icon: Database },
  { key: 'cal', label: 'Calendar', icon: CalendarDays },
  { key: 'task', label: 'Tasks', icon: ListChecks },
];

const MILESTONES = [
  { key: 'msg', label: 'Message' },
  { key: 'reply', label: 'Reply' },
  { key: 'crm', label: 'CRM' },
  { key: 'cal', label: 'Calendar' },
  { key: 'task', label: 'Follow-up' },
  { key: 'done', label: 'Done' },
];

/**
 * Plays a scenario's steps on a timer and returns the index of the last step
 * shown. The index belongs to one scenario run (scenario + replay): a new run
 * starts at -1 in the same render, so a finished run never leaks into the next
 * one (no stale frame, no out-of-range step). Pausing (tab hidden) keeps the
 * position and resumes from it.
 */
function useScript(scenario, running, replayKey, still) {
  const last = scenario.steps.length - 1;
  const run = scenario.key + ':' + replayKey;
  const [pos, setPos] = useState(() => ({ run, idx: -1 }));
  const posRef = useRef(pos);
  posRef.current = pos;
  useEffect(() => {
    if (still || !running) return undefined;
    const from = posRef.current.run === run ? posRef.current.idx : -1;
    if (from >= last) return undefined;
    const base = from >= 0 ? scenario.steps[from].t : -500;
    const timers = scenario.steps.slice(from + 1).map((s, j) => window.setTimeout(() => setPos({ run, idx: from + 1 + j }), Math.max(0, s.t - base)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [scenario, running, run, still, last]);
  if (still) return last;
  return pos.run === run ? Math.min(pos.idx, last) : -1;
}

/** @param {any} props */
function Bubble({ who, text }) {
  const mine = who === 'aurora';
  return (
    <Grow>
      <div className={cn('flex flex-col pt-3', mine ? 'items-end' : 'items-start')}>
        {mine ? <span className="mb-1 mr-1 text-[11px] font-medium text-white/45">{brand.product}</span> : null}
        <span
          className={cn(
            'max-w-[86%] px-4 py-3 text-[14px] leading-[1.5] tracking-[-0.005em]',
            mine ? 'rounded-[18px] rounded-br-[6px] bg-white text-ink' : 'rounded-[18px] rounded-bl-[6px] bg-white/[0.08] text-white/90'
          )}
        >
          {text}
        </span>
      </div>
    </Grow>
  );
}

function TypingBubble() {
  return (
    <Grow>
      <div className="flex justify-end pt-3">
        <span className="flex items-center gap-1 rounded-[18px] rounded-br-[6px] bg-white px-4 py-3.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-blink rounded-full bg-ink/60" style={{ animationDelay: i * 0.18 + 's' }} />
          ))}
        </span>
      </div>
    </Grow>
  );
}

export default function Demo() {
  const [k, setK] = useState(0);
  const [replay, setReplay] = useState(0);
  const ref = useRef(null);
  const tabsRef = useRef([]);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.25, once: true });
  const scenario = SCENARIOS[k];
  const idx = useScript(scenario, inView && visible, replay, !!reduce);
  // Glass elements reveal themselves (a fading wrapper would make the glass pop).
  const appear = (delay = 0, y = 0) =>
    reduce ? {} : { initial: { opacity: 0, y }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.9, delay, ease: EASE } };

  const view = useMemo(() => {
    const shown = scenario.steps.slice(0, idx + 1);
    const sys = {};
    shown.forEach((s) => {
      if (s.sys) sys[s.sys] = s;
    });
    const msgs = shown.filter((s) => s.who && s.who !== 'typing');
    const typing = idx >= 0 && scenario.steps[idx]?.who === 'typing';
    const done = shown.some((s) => s.done);
    const reached = {
      msg: msgs.length > 0,
      reply: msgs.some((m) => m.who === 'aurora'),
      crm: !!sys.crm,
      cal: !!sys.cal,
      task: !!sys.task,
      done,
    };
    return { msgs, sys, typing, done, reached };
  }, [scenario, idx]);

  const select = (i) => {
    setK(i);
    setReplay((r) => r + 1);
  };
  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + SCENARIOS.length) % SCENARIOS.length;
    select(next);
    const el = tabsRef.current[next];
    if (el) el.focus();
  };

  const Icon = scenario.icon;
  const reachedCount = MILESTONES.filter((m) => view.reached[m.key]).length;

  return (
    <section id="demo" ref={ref} data-nav-theme="dark" aria-labelledby="demo-title" className="on-dark section relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[70%] w-[90%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(60,224,154,0.13),rgba(60,224,154,0))]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[60%] w-[55%] bg-[radial-gradient(closest-side,rgba(19,168,156,0.12),rgba(19,168,156,0))]" />
        <div className="grid-lines grid-lines-dark absolute inset-0 opacity-60" />
      </div>

      <div className="shell relative">
        <SectionHeader id="demo-title" dark eyebrow={demo.eyebrow} titleA={demo.titleA} titleB={demo.titleB} text={demo.text} layout="split" />

        <div className="mt-12 md:mt-16">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <LiquidGlass as={motion.div} {...appear(0, 24)} tone="dark" className="segmented max-w-full overflow-x-auto no-scrollbar" role="tablist" aria-label="Industry scenario">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.key}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={'demo-tab-' + s.key}
                  aria-selected={i === k}
                  aria-controls="demo-panel"
                  tabIndex={i === k ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(i === k ? 'text-ink' : 'text-white/65 hover:text-white')}
                >
                  {i === k ? (
                    <motion.span
                      layoutId="demo-seg"
                      className="absolute inset-0 -z-10 rounded-full bg-white"
                      transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    />
                  ) : null}
                  {s.label}
                </button>
              ))}
            </LiquidGlass>
            <motion.button
              {...appear(0.06, 24)}
              type="button"
              onClick={() => setReplay((r) => r + 1)}
              className="flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Replay
            </motion.button>
          </div>

          <LiquidGlass
            as={motion.div}
            {...appear(0.1, 40)}
            tone="dark"
            className="rounded-[clamp(22px,2.4vw,32px)] p-2 md:p-2.5"
            id="demo-panel"
            role="tabpanel"
            aria-labelledby={'demo-tab-' + scenario.key}
          >
            <p className="sr-only" aria-live="polite">
              {view.done ? scenario.label + ' scenario complete: conversation answered, CRM, calendar and tasks updated.' : ''}
            </p>
            <div className="flex items-center justify-between gap-3 px-3 pb-2.5 pt-1.5 text-[13px] md:px-4">
              <span className="flex min-w-0 items-center gap-2 text-white/75">
                <Icon className="h-4 w-4 shrink-0 text-white/60" strokeWidth={1.8} aria-hidden="true" />
                <span className="truncate">
                  {scenario.channel} · {scenario.contact}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-white/60">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-glow" />
                {brand.product} · Live
              </span>
            </div>

            <div className="grid gap-2 lg:grid-cols-[1.3fr_1fr] md:gap-2.5" aria-hidden="true">
              <div className="relative h-[400px] overflow-hidden rounded-[22px] bg-black/25 md:h-[460px]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={scenario.key + '-' + replay}
                    className="absolute inset-0 flex flex-col justify-end p-4 pt-0 [mask-image:linear-gradient(to_bottom,transparent,#000_16%)] md:p-5 md:pt-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE } }}
                    exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE } }}
                  >
                    <AnimatePresence initial={false}>
                      {view.msgs.map((m, i) => (
                        <Bubble key={'m' + i} who={m.who} text={m.text} />
                      ))}
                      {view.typing ? <TypingBubble key="typing" /> : null}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 md:gap-2.5 lg:grid-cols-1">
                {SYSTEMS.map(({ key, label, icon: SIcon }) => {
                  const s = view.sys[key];
                  return (
                    <div
                      key={key}
                      className={cn(
                        'relative min-h-[132px] overflow-hidden rounded-[22px] border p-4 transition-colors duration-700',
                        s ? 'border-white/[0.12] bg-white/[0.07]' : 'border-white/[0.05] bg-white/[0.025]'
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between text-[12.5px] font-medium text-white/60">
                        <span className="flex items-center gap-2">
                          <SIcon className={cn('h-4 w-4 transition-colors duration-500', s ? 'text-brand-glow' : 'text-white/45')} strokeWidth={1.8} />
                          {label}
                        </span>
                        {s ? (
                          <motion.span
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-glow text-ink"
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.span>
                        ) : null}
                      </div>
                      <AnimatePresence mode="wait">
                        {s ? (
                          <motion.div key={s.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                            <p className="text-[15px] font-medium tracking-[-0.015em] text-white">{s.title}</p>
                            {s.lines.map((l) => (
                              <p key={l} className="mt-1 text-[13px] text-white/55">
                                {l}
                              </p>
                            ))}
                            {s.slot ? (
                              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-glow/15 px-2.5 py-1 text-[11.5px] font-medium text-brand-glow">
                                <CalendarDays className="h-3 w-3" strokeWidth={2} />
                                {s.slot}
                              </span>
                            ) : null}
                          </motion.div>
                        ) : (
                          <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-white/35">
                            Waiting for the conversation…
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-3 pb-2 pt-4 md:px-4">
              <div className="relative h-px bg-white/10">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-brand-glow"
                  animate={{ width: ((Math.max(reachedCount, 1) - 1) / (MILESTONES.length - 1)) * 100 + '%' }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
              <ol className="mt-3 grid grid-cols-6 text-[11.5px]">
                {MILESTONES.map((m, i) => (
                  <li
                    key={m.key}
                    className={cn(
                      'flex flex-col gap-1.5 transition-colors duration-500',
                      i === 0 ? 'items-start' : i === MILESTONES.length - 1 ? 'items-end text-right' : 'items-center text-center',
                      view.reached[m.key] ? 'text-white/85' : 'text-white/30'
                    )}
                  >
                    <span className={cn('-mt-[21px] h-[9px] w-[9px] rounded-full border transition-colors duration-500', view.reached[m.key] ? 'border-brand-glow bg-brand-glow' : 'border-white/25 bg-ink')} />
                    <span className="hidden sm:block">{m.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </LiquidGlass>
          <Reveal>
            <p className="mt-5 text-[13px] text-white/40">{demo.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
