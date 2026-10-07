import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, Globe, Database, Lock, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, capabilities, controlVisual, understandVisual, workVisual } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import { Reveal, RevealLines } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import { EASE } from './motion';

const KIND_ICON = { PDF: FileText, DOC: FileText, WEB: Globe, CRM: Database };
const RULE_TONE = {
  Rule: 'bg-[#EEF1F7] text-[#3D4E74]',
  Process: 'bg-brand-mint text-brand-ink',
  Approval: 'bg-[#F7EDDC] text-[#8A5A12]',
  Exception: 'bg-[#F1ECF6] text-[#5F4A7A]',
  Escalation: 'bg-[#F8E9E7] text-[#93382F]',
};

/* ------------------------------------------------------------------ */
/* 01 — Understands the business                                       */
/* ------------------------------------------------------------------ */
function UnderstandVisual() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35, once: true });
  const [n, setN] = useState(reduce ? 99 : 0);

  useEffect(() => {
    if (reduce || !inView) return undefined;
    const total = understandVisual.sources.length + understandVisual.rules.length;
    const timers = Array.from({ length: total }, (_, i) => window.setTimeout(() => setN(i + 1), 500 + i * 420));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce]);

  const S = understandVisual.sources.length;
  return (
    <div ref={ref} className="canvas canvas-grain bg-[linear-gradient(160deg,#E9EEE7_0%,#DCE4DB_100%)] p-4 xs:p-6 md:p-10">
      <div aria-hidden="true" className="orb right-[-10%] top-[-30%] h-[80%] w-[60%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.75),rgba(255,255,255,0))]" />
      <div className="relative grid gap-3 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-4 lg:grid-cols-1 xl:grid-cols-[0.85fr_1.15fr]">
        <LiquidGlass className="rounded-[20px] p-4">
          <p className="text-[12px] font-semibold text-ink">Sources</p>
          <p className="text-[11.5px] text-slate">What you already have</p>
          <ul className="mt-3 grid gap-2">
            {understandVisual.sources.map((src, i) => {
              const Icon = KIND_ICON[src.kind] || FileText;
              const done = n > i;
              return (
                <li key={src.name} className="flex items-center gap-2.5 rounded-[12px] bg-white/70 px-2.5 py-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-paper text-ink/70">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{src.name}</span>
                  <span className={cn('flex h-4 w-4 items-center justify-center rounded-full transition-all duration-500', done ? 'scale-100 bg-brand text-white' : 'scale-75 bg-ink/10 text-transparent')}>
                    <Check className="h-2.5 w-2.5" strokeWidth={3.2} aria-hidden="true" />
                  </span>
                </li>
              );
            })}
          </ul>
        </LiquidGlass>

        <div className="ui-card p-4 md:mt-8 lg:mt-0 xl:mt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-ink">How your business runs</p>
              <p className="text-[11.5px] text-slate">Mapped by {brand.product} · review and approve</p>
            </div>
            <span className="ui-chip bg-paper text-graphite">Draft</span>
          </div>
          <ul className="mt-3 grid gap-1.5">
            {understandVisual.rules.map((r, i) => {
              const show = n > S + i;
              return (
                <li
                  key={r.text}
                  className={cn(
                    'flex items-start gap-2.5 rounded-[12px] border border-ink/[0.06] px-2.5 py-2 transition-all duration-700 ease-out',
                    show ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-25'
                  )}
                >
                  <span className={cn('ui-chip mt-[1px] w-[74px] shrink-0 justify-center', RULE_TONE[r.kind])}>{r.kind}</span>
                  <span className="text-[12.5px] leading-snug text-ink">{r.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Does the work                                                  */
/* ------------------------------------------------------------------ */
function WorkVisual() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const [head, setHead] = useState(4);

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setHead((h) => h + 1), 2200);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  const len = workVisual.length;
  const rows = Array.from({ length: 5 }, (_, k) => {
    const i = head - k;
    return { key: i, item: workVisual[((i % len) + len) % len] };
  });

  return (
    <div ref={ref} className="canvas canvas-grain bg-[linear-gradient(160deg,#EFEBE4_0%,#E2DDD3_100%)] p-4 xs:p-6 md:p-10">
      <div aria-hidden="true" className="orb left-[-10%] top-[-20%] h-[70%] w-[55%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
      <div className="ui-card relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-3.5">
          <div>
            <p className="text-[12.5px] font-semibold text-ink">Activity</p>
            <p className="text-[11.5px] text-slate">Completed by {brand.product}, in your tools</p>
          </div>
          <span className="ui-chip bg-brand-mint text-brand-ink">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" />
            Live
          </span>
        </div>
        <ul className="relative px-2 py-2" aria-hidden="true">
          {/* popLayout: the leaving row is lifted out of the flow, so the card never changes height */}
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map(({ key, item }, k) => (
              <motion.li
                key={key}
                layout="position"
                initial={reduce ? false : { opacity: 0, y: -14 }}
                animate={{ opacity: k === 4 ? 0.35 : 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex items-center gap-3 rounded-[12px] px-2.5 py-2.5"
              >
                <span className="t-data w-10 shrink-0 text-slate">{item.t}</span>
                <span className="ui-chip w-[72px] shrink-0 justify-center bg-paper text-graphite">{item.ch}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{item.text}</span>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {['CRM', 'Calendar', 'Tasks', 'SMS', 'Email'].map((t) => (
          <LiquidGlass key={t} className="rounded-full px-3 py-1.5 text-[12px] font-medium text-ink">
            {t}
          </LiquidGlass>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Operates with control                                          */
/* ------------------------------------------------------------------ */
function ControlVisual() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.35 });
  const [approved, setApproved] = useState(!!reduce);

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    let t2 = 0;
    const cycle = () => {
      setApproved(false);
      t2 = window.setTimeout(() => setApproved(true), 2600);
    };
    cycle();
    const id = window.setInterval(cycle, 8200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t2);
    };
  }, [reduce, inView, visible]);

  const audit = approved ? controlVisual.audit : controlVisual.audit.slice(0, 1);
  const tone = { Allowed: 'text-brand-glow', 'Needs approval': 'text-[#F2B45A]', 'Not allowed': 'text-white/40' };

  return (
    <div ref={ref} className="canvas on-dark bg-[linear-gradient(160deg,#121918_0%,#0A0F0E_100%)] p-4 text-white xs:p-6 md:p-10">
      <div aria-hidden="true" className="orb left-[20%] top-[-40%] h-[90%] w-[70%] animate-breathe bg-[radial-gradient(closest-side,rgba(60,224,154,0.22),rgba(60,224,154,0))]" />
      <div aria-hidden="true" className="orb bottom-[-40%] right-[-10%] h-[80%] w-[50%] bg-[radial-gradient(closest-side,rgba(19,168,156,0.2),rgba(19,168,156,0))]" />
      <div className="relative grid gap-3 md:grid-cols-[1.1fr_0.9fr] md:gap-4 lg:grid-cols-1 xl:grid-cols-[1.1fr_0.9fr]">
        <LiquidGlass tone="dark" className="rounded-[22px] p-4 md:p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
              <Lock className="h-3.5 w-3.5 text-white/70" strokeWidth={1.8} aria-hidden="true" />
              {controlVisual.title}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={approved ? 'ok' : 'wait'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={cn('ui-chip', approved ? 'bg-brand-glow/15 text-brand-glow' : 'bg-[#F2B45A]/15 text-[#F2B45A]')}
              >
                {approved ? 'Approved' : 'Waiting'}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="mt-4 text-[17px] font-medium tracking-[-0.02em] text-white">{controlVisual.item}</p>
          <p className="mt-1 text-[13px] text-white/55">{controlVisual.reason}</p>
          <div className="mt-4 flex items-center gap-2.5 rounded-[14px] bg-white/[0.05] px-3 py-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">DK</span>
            <div className="min-w-0 text-[12px] leading-tight">
              <p className="truncate text-white/85">{controlVisual.approver}</p>
              <p className="truncate text-white/45">{controlVisual.requester}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="flex h-10 items-center justify-center rounded-full bg-white/[0.06] text-[13px] font-medium text-white/70">Decline</span>
            <span
              className={cn(
                'flex h-10 items-center justify-center gap-1.5 rounded-full text-[13px] font-medium transition-all duration-500',
                approved ? 'scale-[0.97] bg-brand-glow text-ink' : 'bg-white text-ink'
              )}
            >
              {approved ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : null}
              {approved ? 'Approved' : 'Approve'}
            </span>
          </div>
        </LiquidGlass>

        <div className="grid gap-3 md:gap-4">
          <LiquidGlass tone="dark" className="rounded-[22px] p-4">
            <p className="text-[12px] font-semibold text-white">Permissions</p>
            <ul className="mt-2.5 grid gap-2">
              {controlVisual.permissions.map(([what, rule]) => (
                <li key={what} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="min-w-0 truncate text-white/70">{what}</span>
                  <span className={cn('shrink-0 font-medium', tone[rule])}>{rule}</span>
                </li>
              ))}
            </ul>
          </LiquidGlass>
          <LiquidGlass tone="dark" className="rounded-[22px] p-4">
            <p className="text-[12px] font-semibold text-white">Audit trail</p>
            <ul className="mt-2.5 grid gap-1.5">
              <AnimatePresence initial={false}>
                {audit.map(([t, what, who]) => (
                  <motion.li
                    key={t + what}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="flex items-center gap-2.5 text-[12px]"
                  >
                    <span className="t-data text-white/40">{t}</span>
                    <span className="min-w-0 flex-1 truncate text-white/75">{what}</span>
                    <span className="flex shrink-0 items-center gap-1 text-white/45">
                      <UserRound className="h-3 w-3" strokeWidth={1.8} aria-hidden="true" />
                      {who}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}

const VISUALS = { understand: UnderstandVisual, work: WorkVisual, control: ControlVisual };

export default function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" data-nav-theme="light" className="section relative pt-0">
      <div className="shell">
        <h2 id="capabilities-title" className="sr-only">
          What {brand.product} does
        </h2>
        <div className="grid gap-[clamp(96px,12vw,180px)]">
          {capabilities.map((c, i) => {
            const Visual = VISUALS[c.key];
            const flip = i % 2 === 1;
            return (
              <article key={c.key} aria-labelledby={'cap-' + c.key} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className={cn('lg:col-span-5', flip ? 'lg:order-2 lg:col-start-8' : 'lg:order-1')}>
                  <Reveal y={12}>
                    <p className="text-[13px] font-medium tabular-nums text-slate">{c.index} <span className="text-ink/25">/ 03</span></p>
                  </Reveal>
                  <h3 id={'cap-' + c.key} className="t-h1 balance mt-5">
                    <RevealLines lines={[c.title]} blur={false} y={20} />
                  </h3>
                  <Reveal delay={0.1}>
                    <p className="t-lead pretty mt-6 max-w-[44ch]">{c.text}</p>
                    <ul className="mt-8 flex max-w-[44ch] flex-wrap gap-x-5 gap-y-2.5">
                      {c.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-ink">
                          <span className="h-1 w-1 rounded-full bg-brand" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
                <Reveal y={40} className={cn('lg:col-span-7', flip ? 'lg:order-1 lg:col-start-1 lg:row-start-1' : 'lg:order-2 lg:col-start-6')}>
                  <Visual />
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
