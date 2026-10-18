import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, FileCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { homeDay } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { useInViewport, usePageVisible } from './hooks';

const D = homeDay;
const EASE = [0.22, 1, 0.36, 1];
const STEP_MS = 5600;
const START = 9 * 60;
const SPAN = 8 * 60;
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const LANE_TONE = { team: '#14A36B', customers: '#F25C2A' };

const minutes = (t) => {
  const [h, mm] = t.split(':').map(Number);
  return h * 60 + mm;
};
const xOf = (t) => ((minutes(t) - START) / SPAN) * 100;
const hourLabel = (h) => (h === 12 ? '12 pm' : h > 12 ? `${h - 12} pm` : `${h} am`);
const clockLabel = (t) => {
  const [h, mm] = t.split(':').map(Number);
  return `${h > 12 ? h - 12 : h}:${String(mm).padStart(2, '0')}`;
};
const ampm = (t) => (minutes(t) >= 12 * 60 ? 'pm' : 'am');

/** Items of an artifact appear one after another once the event is on screen. */
const rise = (reduce, i, base = 0.15) =>
  reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: EASE, delay: base + i * 0.35 } };

function Card({ children, className = undefined }) {
  return <div className={cn('rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(60,40,20,0.35)] md:p-5', className)}>{children}</div>;
}

/** The day's routes on a small street map: each technician's route draws itself, then the stops. */
function Routes({ e, reduce }) {
  return (
    <Card>
      <svg viewBox="0 0 320 180" className="block h-auto w-full" aria-hidden="true">
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#FBF9F4" />
        {/* city blocks between the streets, one of them a park */}
        {[0, 70, 140, 210, 280].map((x) =>
          [0, 50, 100, 150].map((y) => (
            <rect key={`${x}-${y}`} x={x + 5} y={y + 5} width={x === 280 ? 35 : 55} height={y === 150 ? 25 : 35} rx="4" fill={x === 140 && y === 100 ? '#DCEBDD' : '#EFEAE0'} />
          ))
        )}
        {e.routes.map((r, i) => (
          <g key={r.who}>
            <motion.path
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.45 }}
            />
            {r.stops.map(([x, y], j) => (
              <motion.g key={j} initial={reduce ? false : { scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 + i * 0.45 + j * 0.12 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                <circle cx={x} cy={y} r="7" fill={j === 0 ? r.color : '#fff'} stroke={r.color} strokeWidth="2" />
                {j > 0 ? (
                  <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fontWeight="600" fill={r.color}>
                    {j}
                  </text>
                ) : null}
              </motion.g>
            ))}
          </g>
        ))}
      </svg>
      <ul className="mt-3 grid gap-1.5">
        {e.routes.map((r, i) => (
          <motion.li key={r.who} {...rise(reduce, i, 0.4)} className="flex items-center gap-2.5 text-[13px] text-ink">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
            <span className="min-w-0 flex-1 truncate">{r.who}</span>
            <span className="shrink-0 tabular-nums text-slate">{r.jobs} jobs</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

/** A short text thread, then what it led to. */
function Thread({ e, reduce }) {
  return (
    <Card className="flex flex-col gap-2.5 bg-[#FBF8F3]">
      {e.thread.map((m, i) => {
        const mine = m.who === 'aurora';
        return (
          <motion.div key={i} {...rise(reduce, i)} className={cn('flex max-w-[86%] flex-col', mine ? 'items-end self-end' : 'items-start')}>
            <span className="mb-1 flex items-center gap-1.5 px-1 text-[10.5px] font-medium uppercase tracking-[0.07em] text-ink/40">
              {mine ? <img src="/brand/aurora-symbol-color.svg" alt="" width="11" height="11" className="h-[11px] w-[11px]" /> : null}
              {mine ? 'Aurora' : m.name}
            </span>
            <p className={cn('rounded-[18px] px-3.5 py-2.5 text-[14px] leading-snug', mine ? 'rounded-br-[6px] bg-ink text-white' : 'rounded-bl-[6px] bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]')}>{m.text}</p>
          </motion.div>
        );
      })}
      <motion.p {...rise(reduce, e.thread.length)} className="mt-1 inline-flex w-fit items-center gap-1.5 self-center rounded-full bg-[#E4F4E8] px-3 py-1 text-[12.5px] font-medium text-[#1F7A4C]">
        <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
        {e.result}
      </motion.p>
    </Card>
  );
}

/** A freelancer's invoice, checked line by line; the line that does not match is held for approval. */
function Invoice({ e, reduce }) {
  const v = e.invoice;
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-[11px] font-medium uppercase tracking-[0.07em] text-ink/45">{v.number}</span>
          <span className="mt-0.5 block text-[15px] font-medium text-ink">{v.from}</span>
        </span>
        <span className="text-[22px] font-medium tabular-nums tracking-[-0.02em] text-ink">{v.total}</span>
      </div>
      <ul className="mt-4 grid gap-2">
        {v.checks.map((c, i) => (
          <motion.li key={c.text} {...rise(reduce, i, 0.3)} className={cn('flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-[13.5px]', c.ok ? 'bg-[#F4F8F5] text-ink' : 'bg-[#FFF3E6] font-medium text-[#9A3A12]')}>
            {c.ok ? <Check className="h-4 w-4 shrink-0 text-[#14A36B]" strokeWidth={2.6} aria-hidden="true" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-[#F25C2A]" strokeWidth={2.2} aria-hidden="true" />}
            {c.text}
          </motion.li>
        ))}
      </ul>
      <motion.p {...rise(reduce, v.checks.length, 0.4)} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-medium text-white">
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
        {v.status}
      </motion.p>
    </Card>
  );
}

function Quote({ e, reduce }) {
  const q = e.quote;
  return (
    <Card>
      <span className="block text-[11px] font-medium uppercase tracking-[0.07em] text-ink/45">Quote</span>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <span className="text-[16px] font-medium text-ink">{q.item}</span>
        <span className="text-[26px] font-medium tabular-nums tracking-[-0.02em] text-ink">{q.amount}</span>
      </div>
      <ul className="mt-4 grid gap-2 text-[13.5px]">
        <motion.li {...rise(reduce, 0, 0.2)} className="flex items-center gap-2.5 text-slate">
          <span className="h-2 w-2 rounded-full bg-ink/25" /> Sent last Tuesday
        </motion.li>
        <motion.li {...rise(reduce, 1, 0.2)} className="flex items-center gap-2.5 text-slate">
          <span className="h-2 w-2 rounded-full bg-[#F25C2A]" /> Aurora followed up this morning
        </motion.li>
      </ul>
      <motion.p {...rise(reduce, 2, 0.3)} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#E4F4E8] px-3 py-1.5 text-[12.5px] font-medium text-[#1F7A4C]">
        <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
        {q.status}
      </motion.p>
    </Card>
  );
}

function Reroute({ e, reduce }) {
  return (
    <Card className="grid gap-2.5">
      {e.moves.map((mv, i) => (
        <motion.div key={mv.job} {...rise(reduce, i, 0.2)} className="rounded-[14px] bg-[#FBF8F3] p-3">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
            <span className="text-ink/40 line-through">{mv.job}</span>
            <ArrowRight className="h-3.5 w-3.5 text-ink/40" strokeWidth={2} aria-hidden="true" />
            <span className="font-medium text-ink">{mv.to}</span>
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#1F7A4C]">
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
            {mv.ok}
          </p>
        </motion.div>
      ))}
    </Card>
  );
}

function Compliance({ e, reduce }) {
  const d = e.doc;
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F4F1EA] text-ink">
          <FileCheck2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-[14.5px] font-medium leading-snug text-ink">{d.name}</span>
      </div>
      <ul className="mt-4 grid gap-2 text-[13.5px]">
        <motion.li {...rise(reduce, 0, 0.2)} className="flex items-center gap-2.5 rounded-[12px] bg-[#FFF3E6] px-3 py-2 text-[#9A3A12]">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#F25C2A]" strokeWidth={2.2} aria-hidden="true" />
          {d.was}
        </motion.li>
        <motion.li {...rise(reduce, 1, 0.3)} className="flex items-center gap-2.5 px-3 text-slate">
          <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          Asked Rivera for the renewal
        </motion.li>
        <motion.li {...rise(reduce, 2, 0.4)} className="flex items-center gap-2.5 rounded-[12px] bg-[#F4F8F5] px-3 py-2 font-medium text-ink">
          <Check className="h-4 w-4 shrink-0 text-[#14A36B]" strokeWidth={2.6} aria-hidden="true" />
          {d.now}
        </motion.li>
      </ul>
    </Card>
  );
}

function Summary({ e, reduce }) {
  return (
    <Card>
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-ink/45">
        <img src="/brand/aurora-symbol-color.svg" alt="" width="12" height="12" className="h-3 w-3" />
        End of day · to the owner
      </span>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {e.summary.map(([k, v], i) => (
          <motion.li key={k} {...rise(reduce, i, 0.15)} className={cn('rounded-[14px] p-3', k === 'Needs your OK' ? 'bg-[#FFF3E6]' : 'bg-[#F6F3EC]')}>
            <span className="block text-[24px] font-medium tabular-nums leading-none tracking-[-0.02em] text-ink">{v}</span>
            <span className="mt-1.5 block text-[12.5px] leading-snug text-slate">{k}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

const ARTIFACT = { routes: Routes, thread: Thread, invoice: Invoice, quote: Quote, reroute: Reroute, compliance: Compliance, summary: Summary };

/**
 * One working day, 9 to 5, at a home services company: a timeline with two lanes (the customers out front, the
 * team behind the scenes) and, under it, the moment that is on: the time, what Aurora did, and what it produced
 * (a route plan, an invoice check, a text thread). The day plays on its own while it is on screen; a click on any
 * moment jumps there. Every moment's text is in the HTML.
 */
export default function DayLanes() {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const n = D.events.length;
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
  const cur = D.events[k];

  return (
    <section id="day" data-nav-theme="light" aria-labelledby="day-title" className="section relative">
      <div className="shell">
        <SectionHeader id="day-title" titleA={D.titleA} text={D.text} layout="split" />

        <div ref={ref} className="canvas canvas-grain relative mt-8 overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-12 md:p-8 lg:px-10 lg:py-8">
          <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-[-18%] h-[60%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.4),rgba(255,200,87,0))] blur-2xl" />

          {/* the day: hours across, the two lanes under them, a marker for every moment */}
          <div className="relative">
            <p className="mb-2 flex gap-4 text-[12px] font-medium text-ink sm:hidden">
              {['customers', 'team'].map((lane) => (
                <span key={lane} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: LANE_TONE[lane] }} />
                  {D.lanes[lane]}
                </span>
              ))}
            </p>
            <div className="relative ml-0 h-5 sm:ml-[132px]">
              {HOURS.map((h) => (
                <span
                  key={h}
                  className={cn('absolute whitespace-nowrap text-[11px] tabular-nums text-ink/40', h === 9 ? '' : h === 17 ? '-translate-x-full' : '-translate-x-1/2', h % 2 === 0 && 'max-sm:hidden')}
                  style={{ left: `${((h - 9) / 8) * 100}%` }}
                >
                  {hourLabel(h)}
                </span>
              ))}
            </div>
            {['customers', 'team'].map((lane) => (
              <div key={lane} className="relative mt-2 flex items-center sm:mt-3">
                <span className="flex w-[132px] shrink-0 items-center gap-2 whitespace-nowrap text-[12.5px] font-medium text-ink max-sm:hidden">
                  <span className="h-2 w-2 rounded-full" style={{ background: LANE_TONE[lane] }} />
                  {D.lanes[lane]}
                </span>
                <div className="relative h-8 flex-1">
                  <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/12" />
                  {D.events.map((ev, i) =>
                    ev.lane === lane ? (
                      <button
                        key={ev.key}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`${ev.time} · ${ev.title}`}
                        aria-current={i === k ? 'step' : undefined}
                        className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                        style={{ left: `${xOf(ev.time)}%` }}
                      >
                        <span
                          className={cn(
                            'block rounded-full transition-all duration-300',
                            i === k ? 'h-4 w-4 shadow-[0_0_0_5px_rgba(242,92,42,0.16)]' : i < k ? 'h-2.5 w-2.5' : 'h-2.5 w-2.5 bg-[#F6F1E8] shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.25)]'
                          )}
                          style={i <= k ? { background: LANE_TONE[lane] } : undefined}
                        />
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* the moment that is on: every moment sits in the same cell, so the stage never changes height */}
          <div className="relative mt-4 grid md:mt-6" aria-live="polite">
            {D.events.map((ev, i) => {
              const Art = ARTIFACT[ev.kind];
              const on = i === k;
              return (
                <div key={ev.key} className={cn('[grid-area:1/1] grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-10', on ? '' : 'invisible')} aria-hidden={on ? undefined : true}>
                  <motion.div key={on ? 'on' : 'off'} initial={reduce || !on ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:block">
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-[32px] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums md:text-[48px]">{clockLabel(ev.time)}</span>
                        <span className="text-[14px] font-medium text-ink/45 md:text-[15px]">{ampm(ev.time)}</span>
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-medium text-ink md:mt-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: LANE_TONE[ev.lane] }} />
                        {D.lanes[ev.lane]}
                      </p>
                    </div>
                    <h3 className="mt-3 text-[18px] font-medium leading-tight tracking-[-0.015em] text-ink md:text-[24px]">{ev.title}</h3>
                    <p className="pretty mt-1.5 max-w-[30em] text-[14.5px] leading-[1.5] text-graphite md:mt-2 md:text-[15px] md:leading-[1.55]">{ev.text}</p>
                    <div className="mt-5 flex gap-2 max-md:hidden">
                      <button type="button" onClick={() => go(k - 1)} aria-label={D.labels.prev} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]">
                        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => go(k + 1)} aria-label={D.labels.next} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]">
                        <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                  <div className="mx-auto w-full min-w-0 max-w-[440px]">{on ? <Art key={`a-${k}-${nonce}`} e={ev} reduce={reduce} /> : <Art e={ev} reduce />}</div>
                </div>
              );
            })}
          </div>

          {/* the whole day in the HTML, for search and screen readers */}
          <ol className="sr-only">
            {D.events.map((ev) => (
              <li key={ev.key}>
                {ev.time}, {D.lanes[ev.lane]}: {ev.title}. {ev.text}
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-4 text-[12px] text-slate">
          {cur ? D.company : null} · {D.note}
        </p>
      </div>
    </section>
  );
}
