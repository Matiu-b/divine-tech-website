import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BookOpen, CalendarDays, Database, Hash, ListChecks, Mail, MessageCircle, MessageSquare, Phone, Smartphone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, platform } from '@/data/site';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './primitives/SectionHeader';
import CTAButton from './primitives/CTAButton';
import { Reveal, RevealGroup, RevealItem } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

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


/*
 * Phone and tablet view: Aurora as the operating system of the company. Its core sits in the
 * middle with the departments around it. A request arrives, from a customer or from your own
 * team; the core's three cut arcs light in turn (understand, decide, act) and a ray reaches into
 * the department that owns the work, like the rays in the Aurora symbol. Then the result.
 */
const VB = { w: 320, h: 250 };
const C = { x: 160, y: 122 };
const DEPT_AT = [-90, -18, 54, 126, 198].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return { x: C.x + 104 * Math.cos(r), y: C.y + 90 * Math.sin(r), deg };
});
const CORE_ARCS = [
  [-80, -10],
  [40, 110],
  [160, 230],
];
const polar = (deg, r) => [C.x + r * Math.cos((deg * Math.PI) / 180), C.y + r * Math.sin((deg * Math.PI) / 180)];
const arcPath = (from, to, r) => {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
const PHASE_TEXT = ['', 'Understanding', 'Deciding', 'Acting', 'Done', 'Done'];
const PHASES = 6; // 0 request · 1 understand · 2 decide · 3 act · 4-5 done

/** @param {{ phase: number, dept: number, still: boolean }} props */
function OrgMap({ phase, dept, still }) {
  const layer = phase >= 1 && phase <= 3 ? phase - 1 : phase >= 4 ? 3 : -1;
  const reaching = phase >= 3;
  const target = DEPT_AT[dept];
  const [rx, ry] = polar(target.deg, 50);
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" role="img" aria-label="Aurora at the centre of the company, working inside sales, service, operations, finance and people">
      <defs>
        <radialGradient id="org-core" cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#FFD98A" />
          <stop offset="0.55" stopColor="#FF9F45" />
          <stop offset="1" stopColor="#F25C2A" />
        </radialGradient>
        <linearGradient id="org-ray" gradientUnits="userSpaceOnUse" x1={rx} y1={ry} x2={target.x} y2={target.y}>
          <stop offset="0" stopColor="#FF9F45" />
          <stop offset="1" stopColor="#F25C2A" />
        </linearGradient>
      </defs>

      {/* quiet spokes: Aurora is present in every department */}
      {DEPT_AT.map((d, i) => {
        const [sx, sy] = polar(d.deg, 50);
        return <line key={i} x1={sx} y1={sy} x2={d.x} y2={d.y} stroke="#0A0F0E" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 4" />;
      })}

      {/* the ray reaching into the department doing the work */}
      <line
        key={dept + '-' + reaching}
        x1={rx}
        y1={ry}
        x2={target.x}
        y2={target.y}
        stroke="url(#org-ray)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={reaching ? 0 : 1}
        style={{ transition: still ? undefined : 'stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)' }}
      />

      {/* departments */}
      {DEPT_AT.map((d, i) => {
        const on = i === dept && reaching;
        const top = d.y < C.y - 40;
        return (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={on ? 7 : 5} fill={on ? '#F25C2A' : '#fff'} stroke={on ? '#F25C2A' : '#0A0F0E'} strokeOpacity={on ? 1 : 0.25} strokeWidth="1.5" style={{ transition: 'all 400ms ease' }} />
            <text
              x={d.x}
              y={top ? d.y - 14 : d.y + 23}
              textAnchor="middle"
              fontSize="12.5"
              fontFamily="inherit"
              fontWeight={on ? 500 : 400}
              fill="#0A0F0E"
              fillOpacity={on ? 1 : 0.5}
              style={{ transition: 'fill-opacity 400ms ease' }}
            >
              {platform.departments[i]}
            </text>
          </g>
        );
      })}

      {/* Aurora's core: sun, ring, and the outer ring cut into three (understand, decide, act) */}
      <circle cx={C.x} cy={C.y} r="24" fill="url(#org-core)" />
      <circle cx={C.x} cy={C.y} r="33" fill="none" stroke="#FF9F45" strokeOpacity="0.7" strokeWidth="2" />
      {CORE_ARCS.map(([from, to], i) => {
        const on = i === layer;
        const lit = i <= layer;
        return (
          <path
            key={i}
            d={arcPath(from, to, 43)}
            fill="none"
            stroke={lit ? '#F25C2A' : '#FFC857'}
            strokeOpacity={lit ? 1 : 0.55}
            strokeWidth={on ? 6 : 3}
            strokeLinecap="round"
            style={{ transition: 'stroke 400ms ease, stroke-width 400ms ease, stroke-opacity 400ms ease' }}
          />
        );
      })}
      <text x={C.x} y={C.y + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="500" fontFamily="inherit" fill="#fff">
        {brand.product}
      </text>
      <text x={C.x} y={C.y + 66} textAnchor="middle" fontSize="10.5" fontFamily="inherit" fill="#9A5A1E" style={{ opacity: PHASE_TEXT[phase] ? 1 : 0, transition: 'opacity 300ms ease' }}>
        {PHASE_TEXT[phase] || ' '}
      </text>
    </svg>
  );
}

function StoryCompact() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setStep((n) => n + 1), 950);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);
  const n = Math.floor(step / PHASES) % platform.examples.length;
  const ex = platform.examples[n];
  const phase = reduce ? 4 : step % PHASES;
  const Icon = CH_ICONS[ex.ch];
  const team = ex.from !== 'Customer';
  const done = phase >= 4;
  return (
    <div ref={ref} className="mx-auto max-w-[400px]">
      {/* the request, from a customer or from your own team */}
      <div className={cn('flex gap-3', team && 'flex-row-reverse text-right')}>
        <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', team ? 'bg-ink text-white' : 'bg-paper text-ink')}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[11.5px] text-slate">
            {ex.from}, by {platform.channels[ex.ch]}
          </p>
          <p key={n} className="mt-1 text-[15px] leading-snug text-ink">
            {ex.ask}
          </p>
        </div>
      </div>

      <div className="-mx-2 mt-2">
        <OrgMap phase={phase} dept={ex.dept} still={!!reduce} />
      </div>

      {/* the result, in the system where it happened */}
      <div className={cn('flex items-baseline justify-between gap-3 border-t pt-3 transition-colors duration-500', done ? 'border-[#F25C2A]/40' : 'border-ink/10')}>
        <p className={cn('min-w-0 text-[14px] leading-snug transition-colors duration-500', done ? 'text-ink' : 'text-ink/35')}>
          {done ? ex.done : 'Working on it'}
        </p>
        <p className="shrink-0 text-[11.5px] text-slate">{ex.sys}</p>
      </div>
    </div>
  );
}
