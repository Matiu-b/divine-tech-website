import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, CalendarDays, Check, Database, Hash, ListChecks, Mail, MessageCircle, MessageSquare, Phone, Smartphone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, platform } from '@/data/site';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './primitives/SectionHeader';
import CTAButton from './primitives/CTAButton';
import { Reveal, RevealGroup, RevealItem } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import { EASE } from './motion';

const CH_ICONS = [Phone, Smartphone, MessageSquare, Mail, MessageCircle, Hash];
const SYS_ICONS = [Database, CalendarDays, ListChecks, BookOpen, Users];

// Diagram geometry (desktop), in a 1200 × 600 frame.
const W = 1200;
const H = 600;
const ROWS = [108, 204, 300, 396, 492]; // systems (right)
const CH_ROWS = [92, 175, 258, 342, 425, 508]; // channels (left): six, incl. Slack for internal requests
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
          <p className="text-[22px] font-normal leading-none tracking-[-0.03em]">{brand.product}</p>
          <p className="mt-1.5 text-[13px] text-white/50">AI operating system</p>
        </div>
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
      <div className="relative mt-5 flex flex-wrap gap-y-1.5 border-t border-white/[0.08] pt-4 text-[12px] text-white/55">
        {['Policies', 'Approvals', 'Audit log'].map((t, i) => (
          <span key={t} className={cn(i > 0 && 'ml-3 border-l border-white/15 pl-3')}>
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
  const navigate = useNavigate();
  const goTo = (e, to) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(to);
  };
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setActive((a) => (a + 1) % CH_ROWS.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  return (
    <section id="platform" data-nav-theme="light" aria-labelledby="platform-title" className="section relative">
      <div className="shell">
        <SectionHeader id="platform-title" eyebrow={platform.eyebrow} titleA={platform.titleA} titleB={platform.titleB} text={platform.text} layout="split" />

        <Reveal y={40} className="mt-14 md:mt-20">
          <div ref={ref} className="rounded-[clamp(24px,3vw,40px)] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.04),0_30px_80px_-50px_rgba(10,15,14,0.3)] xs:p-6 md:p-10 lg:p-14">
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
                {CH_ROWS.map((y, i) => (
                  <g key={'c' + y}>
                    <path d={leftPath(y)} fill="none" stroke={i === active ? 'rgba(10,15,14,0.32)' : 'rgba(10,15,14,0.1)'} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 0.6s ease' }} />
                    {!reduce && i === active ? (
                      <path key={'l' + active} d={leftPath(y)} fill="none" stroke="url(#pf-pulse)" strokeWidth="2.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="flow-pulse" style={{ animationDuration: '1.3s', animationIterationCount: 1, animationFillMode: 'both' }} />
                    ) : null}
                  </g>
                ))}
                {ROWS.map((y, i) => (
                  <g key={'s' + y}>
                    <path d={rightPath(y)} fill="none" stroke={i === active % ROWS.length ? 'rgba(10,15,14,0.32)' : 'rgba(10,15,14,0.1)'} strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 0.6s ease' }} />
                    {!reduce && i === active % ROWS.length ? (
                      <path key={'r' + active} d={rightPath(y)} fill="none" stroke="url(#pf-pulse)" strokeWidth="2.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="flow-pulse" style={{ animationDuration: '1.3s', animationDelay: '1.1s', animationIterationCount: 1, animationFillMode: 'both' }} />
                    ) : null}
                  </g>
                ))}
              </svg>

              <p className="absolute left-0 top-0 text-[12.5px] font-medium text-slate">Channels</p>
              <p className="absolute right-0 top-0 text-[12.5px] font-medium text-slate">Your systems</p>

              {platform.channels.map((c, i) => (
                <Node
                  key={c}
                  icon={CH_ICONS[i]}
                  label={c}
                  active={i === active}
                  className="absolute h-[8.8%]"
                  style={{ left: 0, top: pct(CH_ROWS[i] - 26, H), width: pct(LEFT_X, W) }}
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
                  active={i === active % ROWS.length}
                  className="absolute h-[10.6%]"
                  style={{ left: pct(RIGHT_X, W), top: pct(ROWS[i] - 32, H), width: pct(W - RIGHT_X, W) }}
                />
              ))}
            </div>

            {/* Phone / tablet: the same story in one screen, one request at a time */}
            <div className="xl:hidden">
              <StoryCompact />
            </div>

            <RevealGroup className="mt-12 hidden gap-8 border-t border-ink/[0.07] pt-10 md:mt-14 md:grid md:grid-cols-3 md:gap-10">
              {platform.notes.map(([title, text]) => (
                <RevealItem key={title}>
                  <h3 className="t-h4">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-graphite">{text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
        {platform.link ? (
          <Reveal className="mt-8 flex justify-center">
            <CTAButton href="/platform" variant="primary" size="lg" onClick={(e) => goTo(e, '/platform')}>
              {platform.link}
            </CTAButton>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/** A short vertical link with a pulse travelling down it. */
function Link({ on }) {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className="relative mx-auto my-1.5 block h-5 w-px overflow-hidden bg-ink/10">
      {!reduce && on ? (
        <motion.span
          className="absolute left-0 top-0 block h-3 w-px bg-brand"
          initial={{ y: -12 }}
          animate={{ y: 20 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: EASE, repeatDelay: 0.3 }}
        />
      ) : null}
    </span>
  );
}

/** A row of icon tiles; the one in use is dark. @param {any} props */
function IconRow({ label, items, icons, active }) {
  return (
    <div>
      <p className="text-center text-[11.5px] font-medium text-slate">{label}</p>
      <ul className="mt-2 flex justify-center gap-1.5 xs:gap-2">
        {items.map((name, i) => {
          const Icon = icons[i];
          const on = i === active;
          return (
            <li
              key={name}
              title={name}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-[12px] border transition-colors duration-500 xs:h-11 xs:w-11',
                on ? 'border-ink bg-ink text-white' : 'border-ink/[0.08] bg-paper text-ink/70'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              <span className="sr-only">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The platform story for phones and tablets, sized to fit one screen: a request arrives on a
 * channel, Aurora understands, decides and acts, and the work lands in one of your systems.
 */
function StoryCompact() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const [step, setStep] = useState(0);
  const PHASES = 5; // 0 ask · 1 understand · 2 decide · 3 act · 4 done
  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setStep((n) => n + 1), 900);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);
  const ex = platform.examples[Math.floor(step / PHASES) % platform.examples.length];
  const phase = reduce ? 4 : step % PHASES;
  const layer = phase >= 1 && phase <= 3 ? phase - 1 : -1;
  const sysName = platform.systems[ex.sys].name;
  return (
    <div ref={ref} className="mx-auto max-w-[440px]">
      <IconRow label="Channels" items={platform.channels} icons={CH_ICONS} active={ex.ch} />

      <div className="mt-3 rounded-[16px] rounded-bl-[6px] bg-paper px-3.5 py-2.5">
        <p className="text-[11px] text-slate">{platform.channels[ex.ch]}</p>
        <p className="mt-0.5 text-[13.5px] leading-snug text-ink">{ex.ask}</p>
      </div>

      <Link on={phase >= 1} />

      <div className="relative overflow-hidden rounded-[18px] bg-ink px-4 py-3.5 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(60,224,154,0.18),rgba(60,224,154,0)_70%)]" />
        <div className="relative flex items-baseline justify-between gap-3">
          <p className="text-[17px] leading-none tracking-[-0.02em]">{brand.product}</p>
          <p className="text-[11px] text-white/45">AI operating system</p>
        </div>
        <ol className="relative mt-3 grid grid-cols-3 gap-1.5">
          {platform.layers.map((l, i) => (
            <li
              key={l.name}
              className={cn(
                'rounded-[10px] border px-1 py-2 text-center text-[11px] font-medium tracking-[-0.01em] transition-colors duration-500 xs:text-[12px]',
                i === layer ? 'border-brand-glow/50 bg-brand-glow/15 text-white' : i < layer || phase === 4 ? 'border-white/[0.08] bg-white/[0.06] text-white/70' : 'border-white/[0.06] bg-transparent text-white/40'
              )}
            >
              {l.name}
            </li>
          ))}
        </ol>
      </div>

      <Link on={phase >= 3} />

      <IconRow label="Your systems" items={platform.systems.map((x) => x.name)} icons={SYS_ICONS} active={phase >= 3 ? ex.sys : -1} />

      <div
        className={cn(
          'mt-3 flex items-center gap-2.5 rounded-[14px] border px-3.5 py-2.5 transition-colors duration-500',
          phase === 4 ? 'border-brand/25 bg-brand-mint text-brand-ink' : 'border-ink/[0.06] bg-paper/60 text-slate'
        )}
      >
        <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-500', phase === 4 ? 'bg-brand text-white' : 'bg-ink/10 text-transparent')}>
          <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden="true" />
        </span>
        <span className="min-w-0 truncate text-[12.5px] font-medium">{["New request…", 'Understanding the request…', 'Checking your rules…', 'Working in ' + sysName + '…', ex.done][phase]}</span>
      </div>
    </div>
  );
}
