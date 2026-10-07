import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, CalendarDays, Database, ListChecks, Mail, MessageCircle, MessageSquare, Phone, Smartphone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, platform } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import { EASE } from './motion';

const CH_ICONS = [MessageSquare, MessageCircle, Phone, Smartphone, Mail];
const SYS_ICONS = [Database, CalendarDays, ListChecks, BookOpen, Users];

// Diagram geometry (desktop), in a 1200 × 600 frame.
const W = 1200;
const H = 600;
const ROWS = [108, 204, 300, 396, 492];
const CORE = { x: 450, y: 56, w: 300, h: 488 };
const LEFT_X = 232;
const RIGHT_X = 968;
const pct = (v, total) => (v / total) * 100 + '%';
const squeeze = (y) => 300 + (y - 300) * 0.4;
const leftPath = (y) =>
  'M' + LEFT_X + ',' + y + ' C' + (LEFT_X + 120) + ',' + y + ' ' + (CORE.x - 110) + ',' + squeeze(y) + ' ' + CORE.x + ',' + squeeze(y);
const rightPath = (y) =>
  'M' + (CORE.x + CORE.w) + ',' + squeeze(y) + ' C' + (CORE.x + CORE.w + 110) + ',' + squeeze(y) + ' ' + (RIGHT_X - 120) + ',' + y + ' ' + RIGHT_X + ',' + y;

/** @param {any} props */
function Core({ active, compact = false }) {
  const layerIdx = active % 3;
  return (
    <div className={cn('relative flex h-full flex-col overflow-hidden rounded-[26px] bg-ink p-5 text-white shadow-[0_30px_60px_-30px_rgba(10,15,14,0.55)] md:p-6', compact && 'w-full')}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_55%_at_50%_0%,rgba(60,224,154,0.16),rgba(60,224,154,0)_70%)]" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[22px] font-[480] leading-none tracking-[-0.03em]">{brand.product}</p>
          <p className="mt-1.5 text-[13px] text-white/50">Operating layer</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-2.5 py-1 text-[11.5px] font-medium text-white/75">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-glow" />
          Live
        </span>
      </div>
      <ul className="relative mt-5 grid flex-1 content-center gap-2.5">
        {platform.layers.map((l, i) => (
          <li
            key={l.name}
            className={cn(
              'relative overflow-hidden rounded-[18px] border px-4 py-3.5 transition-colors duration-700',
              i === layerIdx ? 'border-white/[0.14] bg-white/[0.09]' : 'border-white/[0.06] bg-white/[0.03]'
            )}
          >
            <span
              aria-hidden="true"
              className={cn('absolute bottom-3 left-0 top-3 w-[2px] rounded-full bg-brand-glow transition-opacity duration-700', i === layerIdx ? 'opacity-100' : 'opacity-0')}
            />
            <p className="text-[15px] font-medium tracking-[-0.015em]">{l.name}</p>
            <p className="mt-0.5 text-[13px] text-white/55">{l.detail}</p>
          </li>
        ))}
      </ul>
      <div className="relative mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/[0.08] pt-4 text-[12px] text-white/55">
        {['Policies', 'Approvals', 'Audit log'].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white/40" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** @param {any} props */
function Node({ icon: Icon, label, detail = undefined, active = false, className = undefined, style = undefined }) {
  return (
    <div
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-[16px] border px-3.5 transition-[background-color,border-color,color,box-shadow] duration-500',
        active ? 'border-ink bg-ink text-white shadow-[0_12px_24px_-14px_rgba(10,15,14,0.6)]' : 'border-ink/[0.08] bg-paper text-ink',
        className
      )}
    >
      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-500', active ? 'bg-white/12 text-white' : 'bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.06)]')}>
        <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-medium tracking-[-0.01em]">{label}</span>
        {detail ? <span className={cn('block truncate text-[12px] transition-colors duration-500', active ? 'text-white/60' : 'text-slate')}>{detail}</span> : null}
      </span>
    </div>
  );
}

export default function Platform() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setActive((a) => (a + 1) % ROWS.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  return (
    <section id="platform" data-nav-theme="light" aria-labelledby="platform-title" className="section relative">
      <div className="shell">
        <SectionHeader id="platform-title" eyebrow={platform.eyebrow} titleA={platform.titleA} titleB={platform.titleB} text={platform.text} layout="split" />

        <Reveal y={40} className="mt-14 md:mt-20">
          <div ref={ref} className="rounded-[clamp(24px,3vw,40px)] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.04),0_30px_80px_-50px_rgba(10,15,14,0.3)] xs:p-6 md:p-10 lg:p-14">
            {/* Desktop architecture */}
            <div className="relative hidden xl:block" style={{ aspectRatio: W + ' / ' + H }}>
              <svg className="absolute inset-0 h-full w-full" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="pf-pulse" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#3CE09A" stopOpacity="0" />
                    <stop offset="0.55" stopColor="#14A36B" stopOpacity="1" />
                    <stop offset="1" stopColor="#13A89C" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {ROWS.map((y, i) => (
                  <g key={y}>
                    <path d={leftPath(y)} fill="none" stroke={i === active ? 'rgba(10,15,14,0.32)' : 'rgba(10,15,14,0.1)'} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 0.6s ease' }} />
                    <path d={rightPath(y)} fill="none" stroke={i === active ? 'rgba(10,15,14,0.32)' : 'rgba(10,15,14,0.1)'} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 0.6s ease' }} />
                    {!reduce && i === active ? (
                      <>
                        <path key={'l' + active} d={leftPath(y)} fill="none" stroke="url(#pf-pulse)" strokeWidth="2.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="flow-pulse" style={{ animationDuration: '1.3s', animationIterationCount: 1, animationFillMode: 'both' }} />
                        <path key={'r' + active} d={rightPath(y)} fill="none" stroke="url(#pf-pulse)" strokeWidth="2.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="flow-pulse" style={{ animationDuration: '1.3s', animationDelay: '1.1s', animationIterationCount: 1, animationFillMode: 'both' }} />
                      </>
                    ) : null}
                  </g>
                ))}
              </svg>

              <p className="absolute left-0 top-0 text-[12.5px] font-medium text-slate">Customer channels</p>
              <p className="absolute right-0 top-0 text-[12.5px] font-medium text-slate">Your systems</p>

              {platform.channels.map((c, i) => (
                <Node
                  key={c}
                  icon={CH_ICONS[i]}
                  label={c}
                  active={i === active}
                  className="absolute h-[8.8%]"
                  style={{ left: 0, top: pct(ROWS[i] - 26, H), width: pct(LEFT_X, W) }}
                />
              ))}

              <div className="absolute" style={{ left: pct(CORE.x, W), top: pct(CORE.y, H), width: pct(CORE.w, W), height: pct(CORE.h, H) }}>
                <Core active={active} />
              </div>

              {platform.systems.map((s, i) => (
                <Node
                  key={s.name}
                  icon={SYS_ICONS[i]}
                  label={s.name}
                  detail={s.detail}
                  active={i === active}
                  className="absolute h-[10.6%]"
                  style={{ left: pct(RIGHT_X, W), top: pct(ROWS[i] - 32, H), width: pct(W - RIGHT_X, W) }}
                />
              ))}
            </div>

            {/* Mobile / tablet architecture */}
            <div className="flex flex-col items-center xl:hidden">
              <p className="text-[12.5px] font-medium text-slate">Customer channels</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {platform.channels.map((c, i) => {
                  const Icon = CH_ICONS[i];
                  return (
                    <li key={c} className={cn('flex items-center gap-2 rounded-full border px-3 py-2 text-[13.5px] font-medium transition-colors duration-500', i === active ? 'border-ink bg-ink text-white' : 'border-ink/[0.08] bg-paper text-ink')}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                      {c}
                    </li>
                  );
                })}
              </ul>
              <Connector />
              <div className="w-full max-w-[420px]">
                <Core active={active} compact />
              </div>
              <Connector />
              <p className="text-[12.5px] font-medium text-slate">Your systems</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {platform.systems.map((s, i) => {
                  const Icon = SYS_ICONS[i];
                  return (
                    <li key={s.name} className={cn('flex items-center gap-2 rounded-full border px-3 py-2 text-[13.5px] font-medium transition-colors duration-500', i === active ? 'border-ink bg-ink text-white' : 'border-ink/[0.08] bg-paper text-ink')}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                      {s.name}
                    </li>
                  );
                })}
              </ul>
            </div>

            <RevealGroup className="mt-12 grid gap-8 border-t border-ink/[0.07] pt-10 md:mt-14 md:grid-cols-3 md:gap-10">
              {platform.notes.map(([title, text]) => (
                <RevealItem key={title}>
                  <h3 className="t-h4">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-graphite">{text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Connector() {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className="relative my-4 block h-12 w-px overflow-hidden bg-ink/10">
      {!reduce ? (
        <motion.span
          className="absolute left-0 top-0 block h-5 w-px bg-gradient-to-b from-transparent via-brand to-transparent"
          initial={{ y: -20 }}
          animate={{ y: 52 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: EASE, repeatDelay: 0.4 }}
        />
      ) : null}
    </span>
  );
}
