import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, FileText, Globe, Database, Lock } from 'lucide-react';
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
          <p className="text-[12px] font-medium text-ink">Sources</p>
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
              <p className="text-[12px] font-medium text-ink">How your business runs</p>
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
            <p className="text-[12.5px] font-medium text-ink">Activity</p>
            <p className="text-[11.5px] text-slate">Completed by {brand.product}, in your tools</p>
          </div>
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
  const [t, setT] = useState(reduce ? 8 : 0);
  // One real case, start to finish:
  // 1 customer asks for a $340 refund · 2 the rule applies · 3 Aurora tells the customer
  // 4 the manager gets the request · 6 approves · 7 Aurora confirms to the customer · pause
  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setT((n) => (n + 1) % 12), 1100);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  const C = controlVisual;
  const approved = t >= 6;
  const logged = t >= 7 ? 3 : t >= 6 ? 2 : t >= 1 ? 1 : 0;

  const bubble = 'max-w-[84%] w-fit px-3.5 py-2 text-[13px] leading-snug';
  const customer = cn(bubble, 'rounded-[20px] rounded-bl-[6px] bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.06)]');
  const aurora = cn(bubble, 'ml-auto rounded-[20px] rounded-br-[6px] bg-[linear-gradient(160deg,rgba(214,216,220,0.85),rgba(190,193,198,0.7))] text-ink ring-1 ring-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_16px_-10px_rgba(10,15,14,0.35)] backdrop-blur-md');
  const enter = reduce ? {} : { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: EASE } };

  const items = [];
  if (t >= 1) items.push({ id: 'ask', side: 'left', el: <div className={customer}>{C.story.ask}</div> });
  if (t >= 2)
    items.push({
      id: 'rule',
      side: 'center',
      el: (
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink/55">
          <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          {C.story.rule}
        </p>
      ),
    });
  if (t >= 3) items.push({ id: 'hold', side: 'right', el: <div className={aurora}>{C.story.hold}</div> });
  if (t >= 4)
    items.push({
      id: 'approval',
      side: 'center',
      el: (
        <div className="mx-auto w-full max-w-[300px] rounded-[18px] bg-white p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_12px_28px_-16px_rgba(10,15,14,0.35)]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper-2 text-[10.5px] font-medium text-ink">DK</span>
            <div className="min-w-0 text-[11.5px] leading-tight">
              <p className="font-medium text-ink">{C.story.manager}</p>
              <p className="text-ink/50">Approval request from {brand.product}</p>
            </div>
          </div>
          <p className="mt-2 text-[13px] font-medium text-ink">{C.item}</p>
          {approved ? (
            <p className="mt-2.5 flex h-8 items-center justify-center gap-1 rounded-full bg-[#E4F3EA] text-[12px] font-medium text-[#2F8F5B]">
              <Check className="h-3.5 w-3.5" strokeWidth={2.8} aria-hidden="true" />
              Approved by Dana
            </p>
          ) : (
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              <span className="flex h-8 items-center justify-center rounded-full bg-paper-2 text-[12px] font-medium text-ink/60">Decline</span>
              <span className={cn('relative flex h-8 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white', t === 5 && !reduce && 'halo')}>Approve</span>
            </div>
          )}
        </div>
      ),
    });
  if (t >= 7) items.push({ id: 'done', side: 'right', el: <div className={aurora}>{C.story.done}</div> });

  return (
    <div ref={ref} className="canvas relative bg-[linear-gradient(160deg,#F3F1EC_0%,#E9E5DD_100%)] p-3 xs:p-4 md:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={cn('absolute -left-[10%] -top-[20%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.22),rgba(255,159,69,0))] blur-2xl', !reduce && 'animate-drift')} />
        <div className={cn('absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.3),rgba(255,200,87,0))] blur-2xl', !reduce && 'animate-drift [animation-delay:-8s]')} />
      </div>
      <LiquidGlass className="relative overflow-hidden rounded-[26px]" style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.25)' }}>
        <div className="flex items-center justify-between border-b border-white/50 px-4 py-2 text-[10.5px] font-medium text-ink/45">
          <span>Customer</span>
          <span>{brand.product}, your AI agent</span>
        </div>
        <div className="relative h-[340px] overflow-hidden px-3.5 py-3">
          <div className="absolute inset-x-3.5 bottom-3 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {items.map((m) => (
                <motion.div key={m.id} layout={!reduce} {...enter} className={cn('flex', m.side === 'right' ? 'justify-end' : m.side === 'left' ? 'justify-start' : 'justify-center')}>
                  {m.el}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#FBF7F0]/80 to-transparent" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/50 bg-white/20 px-4 py-2.5 text-[11.5px] text-ink/70">
          <span>Every step is on record</span>
          <span className="font-medium text-ink">
            Audit log · {logged} {logged === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </LiquidGlass>
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
        <div className="grid gap-[clamp(72px,8vw,120px)]">
          {capabilities.map((c, i) => {
            const Visual = VISUALS[c.key];
            const flip = i % 2 === 1;
            return (
              <article key={c.key} id={c.key === 'control' ? 'security' : undefined} aria-labelledby={'cap-' + c.key} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className={cn('lg:col-span-5', flip ? 'lg:order-2 lg:col-start-8' : 'lg:order-1')}>
                  <h3 id={'cap-' + c.key} className="t-h1 balance">
                    <RevealLines lines={[c.title]} blur={false} y={20} />
                  </h3>
                  <Reveal delay={0.1}>
                    <p className="t-lead pretty mt-5 max-w-[40ch]">{c.text}</p>
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
