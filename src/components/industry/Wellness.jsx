import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Activity, Check, Flower2, HeartHandshake, Mail, MessageCircle, MessageSquareText, MessagesSquare, Phone, RefreshCw, ShieldCheck, Sparkles, UserPlus, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { Reveal } from '@/components/home-v2/primitives/MotionReveal';
import Closing from '@/components/home-v2/Closing';
import { CallOverlay, useCallClock } from '@/components/home-v2/CallBox';
import { useInViewport, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';
import { RxHero, useLoop } from '@/components/industry/RealEstateV3';

/*
 * Wellness & Healthcare page, in its own design: calm, airy, editorial. Linen and sand grounds, photographs and clips
 * framed in arches and circles (the studio's arched window), and slow motion that breathes rather than ticks. Only the
 * hero call is shared with the real estate page. Everything is one boutique studio's story (Linen & Light, Nina,
 * Chloe), then the clinics, all illustrative.
 */

const EASE = [0.22, 1, 0.36, 1];
const SAND = 'bg-[linear-gradient(170deg,#F6F1E9_0%,#EFE7DB_100%)]';
const ARCH = 'rounded-t-[999px] rounded-b-[28px]';

/** A muted clip that plays only while `active`, over its poster. */
function Clip({ film, active, className = '', style = undefined, rate = 1 }) {
  const ref = useRef(null);
  const loaded = usePageLoaded();
  const reduce = !!useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = rate;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, rate, loaded]);
  return (
    <>
      <img src={film.poster} alt={film.alt || ''} className={cn('absolute inset-0 h-full w-full object-cover', className)} style={style} loading="lazy" decoding="async" />
      {loaded && !reduce ? <video ref={ref} src={film.video} poster={film.poster} muted loop playsInline preload="metadata" aria-hidden="true" className={cn('absolute inset-0 h-full w-full object-cover', className)} style={style} /> : null}
    </>
  );
}

/** The hero: the studio after closing and Chloe's first call (shared with the real estate page's hero). */
export function WxHero({ it }) {
  return <RxHero it={{ ...it, v3: { hero: it.wx.hero } }} />;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* While you teach                                                                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

const MIN_MS = 600; // one class minute on screen
const CHANNELS = {
  instagram: { icon: MessageCircle, label: 'Instagram DM' },
  call: { icon: Phone, label: 'Call' },
  text: { icon: MessageSquareText, label: 'Text' },
  email: { icon: Mail, label: 'Email' },
  chat: { icon: MessagesSquare, label: 'Web chat' },
};

/** The class clock: a ring that fills slowly over the class, the minutes left in the middle. */
function ClassRing({ k, minute, reduce }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const left = Math.max(0, Math.ceil(k.minutes - minute));
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#FFFDF8]/95 py-2 pl-2 pr-5 shadow-[0_18px_40px_-24px_rgba(60,40,20,0.55)] backdrop-blur-md">
      <span className="relative h-[60px] w-[60px] shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(10,15,14,0.08)" strokeWidth="6" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="url(#wx-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - minute / k.minutes)} style={{ transition: reduce ? 'none' : 'stroke-dashoffset 0.6s linear' }} />
          <defs>
            <linearGradient id="wx-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF8A3D" />
              <stop offset="1" stopColor="#F25C2A" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[17px] font-medium tabular-nums text-ink">{left}</span>
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-[13.5px] font-medium leading-tight text-ink">{k.name}</span>
        <span className="block whitespace-nowrap text-[12px] leading-tight text-slate">
          {k.with} · {left} {k.left}
        </span>
      </span>
    </div>
  );
}

/** One conversation Aurora handled during the class: who, what they asked, and how it ended. */
function DeskItem({ x, reduce }) {
  const ch = CHANNELS[x.channel];
  const Icon = ch.icon;
  const care = x.tone === 'care';
  return (
    <motion.li
      layout={reduce ? false : 'position'}
      initial={reduce ? false : { opacity: 0, y: -14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex shrink-0 gap-3 rounded-[20px] bg-[#FFFDF8] p-3.5 shadow-[0_0_0_1px_rgba(10,15,14,0.05),0_14px_30px_-24px_rgba(60,40,20,0.5)] sm:gap-3.5 sm:p-4"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EBE1] text-ink/70">
        <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[13px] font-medium text-ink">
            {x.who} <span className="font-normal text-slate">· {ch.label}</span>
          </span>
          <span className="t-data shrink-0 text-[10.5px] text-ink/35">min {x.at}</span>
        </span>
        <span className="mt-0.5 block truncate text-[13.5px] leading-snug text-graphite">“{x.said}”</span>
        <span className={cn('mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium', care ? 'bg-[#FFF1E4] text-[#B4471A]' : 'bg-[#E9F4EC] text-[#2E7A48]')}>
          {care ? <HeartHandshake className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" /> : <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />}
          <span className="truncate">{x.done}</span>
        </span>
      </span>
    </motion.li>
  );
}

/** While you teach: one class plays in the arch; beside it, the conversations Aurora closes before the class ends. */
export function WxDesk({ it }) {
  const d = it.wx.desk;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const end = d.klass.minutes * MIN_MS + 3500;
  const t = useLoop(end, { active: inView && visible, still: reduce });
  const minute = Math.min(d.klass.minutes, t / MIN_MS);
  const shown = d.items.filter((x) => x.at <= minute);
  const recent = shown.slice(-4).reverse(); // newest on top; the oldest slides out under the fade

  return (
    <section id="desk" data-nav-theme="light" aria-labelledby="wx-desk-title" className="section relative !pt-[clamp(48px,6vw,88px)]">
      <div className="shell">
        <div ref={ref} className={cn('canvas canvas-grain relative grid gap-6 overflow-hidden p-4 xs:p-5 md:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-8 lg:p-10 xl:gap-x-20 xl:px-16', SAND)}>
          <div aria-hidden="true" className="pointer-events-none absolute left-[-8%] top-[-20%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,214,170,0.6),rgba(255,214,170,0))] blur-2xl" />

          {/* phones: headline, the class, then the desk. Laptops: the class in an arch on the left, the rest beside it */}
          <div className="relative lg:col-start-2 lg:row-start-1 lg:self-end">
            <h2 id="wx-desk-title" className="text-[clamp(30px,3vw,46px)] font-medium leading-[1.06] tracking-[-0.025em] text-ink">
              {d.titleA} <span className="block">{d.titleB}</span>
            </h2>
            <p className="pretty mt-4 max-w-[30em] text-[15px] leading-[1.6] text-graphite md:text-[16px]">{d.text}</p>
          </div>

          <div className="relative pb-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:pb-0">
            <div className={cn('relative mx-auto aspect-[5/4] w-full max-w-[460px] overflow-hidden bg-[#E9E1D4] shadow-[0_40px_80px_-50px_rgba(60,40,20,0.6)] sm:aspect-[4/5] lg:aspect-auto lg:h-[clamp(440px,calc(100svh_-_220px),600px)]', ARCH)}>
              <Clip film={d.film} active={inView && visible} className="object-[38%_50%]" />
              <span className="sr-only">{d.film.alt}</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 lg:-left-4 lg:bottom-8">
              <ClassRing k={d.klass} minute={minute} reduce={reduce} />
            </div>
          </div>

          {/* the latest few, newest on top; a fixed height so the column never jumps */}
          <div className="relative lg:col-start-2 lg:row-start-2 lg:self-start">
            <ul className="flex h-[222px] flex-col gap-2.5 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] sm:h-[330px]" aria-live="polite">
              {recent.map((x) => (
                <DeskItem key={x.at} x={x} reduce={reduce} />
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-[13px] font-medium text-ink">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2E9A58] text-white">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {d.tally.replace('{n}', String(shown.length))}
            </p>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{d.note}</p>
        <ul className="sr-only">
          {d.items.map((x) => (
            <li key={x.at}>
              Minute {x.at}, {CHANNELS[x.channel].label}, {x.who}: “{x.said}” {x.done}.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* The week: late cancellations, refilled                                                                              */
/* ------------------------------------------------------------------------------------------------------------------ */

const EVENT_MS = 3800;
const CANCEL_MS = 1300; // the spot sits open this long before Aurora fills it
const OFFER_MS = 700;

/** One class in the timetable. `state`: full, open (just cancelled), offer (Aurora is offering it), refilled. */
function Slot({ c, state, reduce }) {
  const [, , name, cap] = c;
  const open = state === 'open' || state === 'offer';
  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 flex-col justify-center overflow-hidden rounded-[14px] px-2.5 py-1.5 transition-colors duration-500',
        state === 'full' && 'bg-[#FFFDF8] shadow-[0_0_0_1px_rgba(10,15,14,0.05)]',
        open && 'bg-transparent shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.2)] [background-image:repeating-linear-gradient(135deg,rgba(10,15,14,0.045)_0_6px,transparent_6px_12px)]',
        state === 'offer' && 'shadow-[inset_0_0_0_1.5px_rgba(242,92,42,0.6)]',
        state === 'refilled' && 'bg-[#FFF3E8] shadow-[inset_0_0_0_1px_rgba(242,92,42,0.25)]'
      )}
    >
      {state === 'offer' && !reduce ? <span className="ring-ping absolute inset-0 rounded-[14px] bg-[#F25C2A]/10" /> : null}
      <span className="relative truncate text-[12px] font-medium leading-tight text-ink">{name}</span>
      <span className={cn('relative mt-0.5 flex items-center gap-1 text-[11px] tabular-nums leading-tight', open ? 'text-[#B4471A]' : 'text-ink/45')}>
        {state === 'refilled' ? <img src="/brand/aurora-symbol-color.svg" alt="" width="10" height="10" className="h-2.5 w-2.5" /> : null}
        {open ? cap - 1 : cap}/{cap}
      </span>
    </div>
  );
}

/** The week's timetable with each late cancellation refilled in turn, the member who took the spot in an arch beside it. */
export function WxWeek({ it }) {
  const w = it.wx.week;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const n = w.events.length;
  const end = n * EVENT_MS + 2600;
  const t = useLoop(end, { active: inView && visible, still: reduce });
  const k = Math.min(n - 1, Math.floor(t / EVENT_MS));
  const local = t - k * EVENT_MS;
  const done = reduce ? n : w.events.filter((_, i) => i < k || (i === k && local >= CANCEL_MS + OFFER_MS)).length;
  const ev = w.events[k];
  const cls = w.classes.find((c) => c[0] === ev.day && c[1] === ev.time);

  const stateOf = (c) => {
    const i = w.events.findIndex((e) => e.day === c[0] && e.time === c[1]);
    if (i < 0) return 'full';
    if (reduce || i < k) return 'refilled';
    if (i > k) return 'full';
    if (local < CANCEL_MS) return 'open';
    if (local < CANCEL_MS + OFFER_MS) return 'offer';
    return 'refilled';
  };
  const at = (d, ti) => w.classes.find((c) => c[0] === d && c[1] === ti);

  return (
    <section id="week" data-nav-theme="light" aria-labelledby="wx-week-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="wx-week-title" titleA={w.titleA} titleB={w.titleB} text={w.text} layout="split" />
        <div ref={ref} className="canvas relative mt-8 grid gap-6 overflow-hidden bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] xs:p-5 md:mt-10 md:p-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center lg:gap-10 lg:px-10 lg:py-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-14">
          {/* the timetable: days across, times down (phones: the day of the current cancellation) */}
          <div className="min-w-0">
            <div className="flex gap-1.5 md:hidden" role="tablist" aria-label="Days">
              {w.days.map((d, i) => (
                <span key={d} role="tab" aria-selected={i === ev.day} className={cn('flex-1 rounded-full py-1.5 text-center text-[12px] font-medium transition-colors duration-500', i === ev.day ? 'bg-ink text-white' : 'bg-[#F3EEE6] text-ink/55')}>
                  {d}
                </span>
              ))}
            </div>
            <div className="mt-3 grid gap-1.5 md:hidden">
              {w.times.map((ti, r) => {
                const c = at(ev.day, r);
                return (
                  <div key={ti} className="grid h-[46px] grid-cols-[48px_minmax(0,1fr)] items-center gap-2">
                    <span className="t-data text-[11px] text-ink/40">{ti}</span>
                    {c ? <Slot c={c} state={stateOf(c)} reduce={reduce} /> : <span className="h-full rounded-[14px] border border-dashed border-ink/[0.07]" />}
                  </div>
                );
              })}
            </div>

            <div className="hidden md:grid md:grid-cols-[48px_repeat(6,minmax(0,1fr))] md:gap-1.5" aria-hidden="true">
              <span />
              {w.days.map((d, i) => (
                <span key={d} className={cn('pb-1 text-center text-[12px] font-medium transition-colors duration-500', i === ev.day ? 'text-ink' : 'text-ink/40')}>
                  {d}
                </span>
              ))}
              {w.times.map((ti, r) => (
                <React.Fragment key={ti}>
                  <span className="t-data flex h-[56px] items-center text-[11px] text-ink/40 [@media(max-height:760px)]:h-[48px]">{ti}</span>
                  {w.days.map((d, di) => {
                    const c = at(di, r);
                    return <div key={d}>{c ? <Slot c={c} state={stateOf(c)} reduce={reduce} /> : <span className="block h-full rounded-[14px] border border-dashed border-ink/[0.07]" />}</div>;
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* the member who took the spot, in an arch, and what just happened */}
          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 lg:block">
            <div className={cn('relative aspect-[3/4] w-full overflow-hidden bg-[#E9E1D4] lg:aspect-[5/6] [@media(max-height:760px)]:lg:aspect-square', ARCH)}>
              <Clip film={w.film} active={inView && visible} className="object-[45%_40%]" />
            </div>
            <div className="min-w-0 lg:mt-5" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={k} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.5, ease: EASE }}>
                  <p className="t-data text-[11px] uppercase tracking-[0.08em] text-[#B4471A]">
                    {w.days[ev.day]} {w.times[ev.time]} · {cls[2]}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-snug text-ink">
                    {ev.out} {w.labels.cancel} at {ev.at}.{' '}
                    <span className="font-medium">
                      {ev.in} {w.labels.filled} {w.labels.in} {ev.took}
                    </span>
                    , {ev.how}.
                  </p>
                </motion.div>
              </AnimatePresence>
              <p className="mt-4 flex items-baseline gap-2 border-t border-ink/[0.08] pt-4">
                <span className="text-[34px] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">{done}</span>
                <span className="text-[13px] text-graphite">{w.labels.refilled}</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{w.note}</p>
        <ul className="sr-only">
          {w.events.map((e) => (
            <li key={e.day + '-' + e.time}>
              {w.days[e.day]} {w.times[e.time]}: {e.out} cancelled at {e.at}; {e.in} took the spot in {e.took}, {e.how}.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* The circle: intro class to habit                                                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

const STAGE_MS = 8000;
const QUIET_IDLE_MS = 12000;

/** A member's months as a circle: four stages around a ring, the current one playing in the round in the middle. */
export function WxCycle({ it }) {
  const cy = it.wx.cycle;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.25 });
  const visible = usePageVisible();
  const n = cy.stages.length;
  const ci = cy.stages.findIndex((s) => s.call);
  const cc = useCallClock(cy.call, { audioRef });
  const [k, setK] = useState(0);
  const [nonce, setNonce] = useState(0);
  const running = !reduce && inView && visible;
  const busy = k === ci && (cc.status === 'playing' || cc.status === 'paused');

  useEffect(() => {
    if (!running || busy) return undefined;
    const ms = k === ci ? (cc.status === 'done' ? 2500 : QUIET_IDLE_MS) : STAGE_MS;
    const id = setTimeout(() => setK((x) => (x + 1) % n), ms);
    return () => clearTimeout(id);
  }, [k, nonce, running, busy, cc.status, ci, n]);

  // leaving the quiet stage stops the call
  useEffect(() => {
    if (k !== ci) cc.reset();
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i) => {
    setK(i);
    setNonce((x) => x + 1);
  };
  const s = cy.stages[k];
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const R = 46; // ring radius, % of the box
  const arc = 2 * Math.PI * R;

  return (
    <section id="cycle" data-nav-theme="light" aria-labelledby="wx-cycle-title" className="section relative pt-0">
      <div className="shell">
        <div ref={ref} className={cn('canvas canvas-grain relative grid gap-8 overflow-hidden p-4 xs:p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-14 lg:gap-y-8 lg:p-10 xl:px-16', SAND)}>
          <div aria-hidden="true" className="pointer-events-none absolute right-[-6%] top-[-18%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,214,170,0.55),rgba(255,214,170,0))] blur-2xl" />

          {/* phones: headline, the ring, then the stage in words. Laptops: words on the left, the ring on the right */}
          <div className="relative min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
            <h2 id="wx-cycle-title" className="text-[clamp(30px,3vw,46px)] font-medium leading-[1.06] tracking-[-0.025em] text-ink">
              {cy.titleA} <span className="block">{cy.titleB}</span>
            </h2>
            <p className="pretty mt-4 max-w-[30em] text-[15px] leading-[1.6] text-graphite md:text-[16px]">{cy.text}</p>
          </div>

          <div className="relative min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
            {/* phones and tablets: the stages as chips (laptops click the ring) */}
            <div className="grid grid-cols-4 gap-1.5 lg:hidden">
              {cy.stages.map((x, i) => (
                <button key={x.key} type="button" onClick={() => go(i)} aria-pressed={i === k} className={cn('rounded-full px-1 py-1.5 text-[11.5px] font-medium leading-tight transition-colors', i === k ? 'bg-ink text-white' : 'bg-white/70 text-ink/60')}>
                  {x.name.split(',')[0]}
                </button>
              ))}
            </div>

            <div className="mt-5 min-h-[214px] lg:mt-0 lg:min-h-[236px]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={k} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.55, ease: EASE }}>
                  <p className="t-data text-[11px] uppercase tracking-[0.08em] text-[#B4471A]">
                    {s.when} · {s.name}
                  </p>
                  <p className="pretty mt-2 text-[17px] leading-[1.45] text-ink md:text-[19px]">{s.line}</p>
                  <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/40">{cy.did}</p>
                  <ul className="mt-2 grid gap-1.5">
                    {s.did.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-graphite">
                        <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F25C2A] text-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={3.2} aria-hidden="true" />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              {/* the quiet stage: the call itself */}
              <div className={cn('mt-5 max-w-[400px] transition-opacity duration-300', k === ci ? 'opacity-100' : 'pointer-events-none invisible h-0 opacity-0')}>
                <CallOverlay c={cy.call} clock={cc} reduce={reduce} />
              </div>
            </div>
          </div>

          {/* the ring */}
          <div className="relative mx-auto aspect-square w-full max-w-[240px] sm:max-w-[340px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-10 lg:max-w-[min(440px,calc(100svh_-_280px))] lg:self-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(10,15,14,0.1)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r={R} fill="none" stroke="#F25C2A" strokeWidth="0.8" strokeLinecap="round" strokeDasharray={arc} strokeDashoffset={arc * (1 - k / n)} style={{ transition: reduce ? 'none' : 'stroke-dashoffset 1.6s cubic-bezier(0.65,0,0.35,1)' }} />
            </svg>

            {/* the stage, playing in the round */}
            <div className="absolute inset-[15%] overflow-hidden rounded-full bg-[#E9E1D4] shadow-[0_40px_80px_-40px_rgba(60,40,20,0.6)]">
              {cy.stages.map((x, i) => (
                <div key={x.key} className={cn('absolute inset-0 transition-opacity duration-1000', i === k ? 'opacity-100' : 'opacity-0')}>
                  <Clip film={x.media} active={running && i === k} style={{ objectPosition: x.media.focus || '45% 40%' }} />
                </div>
              ))}
            </div>

            {/* the stages on the ring */}
            {cy.stages.map((x, i) => {
              const a = angle(i);
              const left = 50 + R * Math.cos(a);
              const top = 50 + R * Math.sin(a);
              const cur = i === k;
              const past = i < k;
              const side = i === 0 ? 'top' : i === 1 ? 'right' : i === 2 ? 'bottom' : 'left';
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => go(i)}
                  aria-pressed={cur}
                  aria-label={x.name}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: left + '%', top: top + '%' }}
                >
                  <span className={cn('relative block rounded-full transition-all duration-500', cur ? 'h-4 w-4 bg-[#F25C2A] shadow-[0_0_0_6px_rgba(242,92,42,0.18)]' : past ? 'h-3 w-3 bg-ink' : 'h-3 w-3 bg-[#F6F1E9] shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.3)] group-hover:shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.6)]')}>
                    {cur && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" /> : null}
                  </span>
                  <span
                    className={cn(
                      'pointer-events-none absolute hidden whitespace-nowrap text-[13px] font-medium transition-colors lg:block',
                      cur ? 'text-ink' : 'text-ink/45',
                      side === 'top' && 'bottom-6 left-1/2 -translate-x-1/2 text-center',
                      side === 'bottom' && 'left-1/2 top-6 -translate-x-1/2 text-center',
                      side === 'right' && 'left-6 top-1/2 -translate-y-1/2',
                      side === 'left' && 'right-6 top-1/2 -translate-y-1/2 text-right'
                    )}
                  >
                    {x.name}
                    <span className="t-data block text-[10.5px] font-normal text-ink/40">{x.when}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <audio ref={audioRef} src={cy.call.audio} preload="none" onEnded={cc.ended} />
        </div>
        <p className="mt-4 text-[12px] text-slate">{cy.note}</p>
        <ol className="sr-only">
          {cy.stages.map((x) => (
            <li key={x.key}>
              {x.when}, {x.name}: {x.line} {x.did.join('. ')}.
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Clinics                                                                                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

const CLINIC_ICONS = { activity: Activity, flower: Flower2, sparkles: Sparkles };

/** Clinics: three kinds of practice, each under an arch, and the clinical line across the bottom. */
export function WxClinics({ it }) {
  const c = it.wx.clinics;
  return (
    <section id="clinics" data-nav-theme="light" aria-labelledby="wx-clinics-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="wx-clinics-title" titleA={c.titleA} titleB={c.titleB} text={c.text} layout="split" />
        <div className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {c.kinds.map((k, i) => {
            const Icon = CLINIC_ICONS[k.icon];
            return (
              <Reveal key={k.key} delay={i * 0.08} className="w-[84%] shrink-0 snap-start rounded-[28px] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:w-auto md:p-6">
                <span className={cn('flex h-[84px] w-[66px] shrink-0 items-center justify-center pt-3 md:h-[112px] md:w-[88px] md:pt-5', ARCH, SAND)}>
                  <Icon className="h-6 w-6 text-[#D9481C] md:h-7 md:w-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="block min-w-0">
                  <span className="mt-4 block text-[17px] font-medium leading-snug tracking-[-0.01em] text-ink md:mt-5 md:text-[19px]">{k.name}</span>
                  <ul className="mt-2 grid gap-1 md:mt-3 md:gap-1.5">
                    {k.does.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-[14px] leading-snug text-graphite">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#F25C2A]" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </span>
              </Reveal>
            );
          })}
        </div>
        {/* the clinical line */}
        <Reveal delay={0.2} className="mt-3 grid overflow-hidden rounded-[28px] bg-ink text-white md:mt-5 md:grid-cols-2">
          <p className="flex items-start gap-3 p-5 md:p-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC857]" strokeWidth={1.8} aria-hidden="true" />
            <span className="text-[14.5px] leading-snug text-white/75">
              <span className="font-medium text-white">Aurora {c.line.never.toLowerCase()}</span> {c.line.neverText}
            </span>
          </p>
          <p className="flex items-start gap-3 border-t border-white/10 p-5 md:border-l md:border-t-0 md:p-6">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC857]" strokeWidth={1.8} aria-hidden="true" />
            <span className="text-[14.5px] leading-snug text-white/75">
              <span className="font-medium text-white">Aurora {c.line.always.toLowerCase()}</span> {c.line.alwaysText}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* The Monday letter                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

const LETTER_ICONS = { refill: RefreshCw, join: UserPlus, back: Undo2, answer: MessageCircle };

/** The owner's Monday letter: the week in four lines and the one goal the KPI Agent moved, beside a photo in an arch. */
export function WxJournal({ it }) {
  const j = it.wx.journal;
  const L = j.letter;
  const g = L.goal;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35, once: true });
  const on = reduce || inView;
  const line = (i) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(8px)', transition: reduce ? 'none' : `opacity 0.7s ease ${0.3 + i * 0.25}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.25}s` });

  return (
    <section id="journal" data-nav-theme="light" aria-labelledby="wx-journal-title" className="section relative pt-0">
      <div className="shell">
        <div ref={ref} className={cn('canvas canvas-grain relative grid gap-8 overflow-hidden p-4 xs:p-5 md:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14 lg:px-10 lg:py-8 xl:px-16', SAND)}>
          <div className="relative">
            <h2 id="wx-journal-title" className="text-[clamp(30px,3vw,46px)] font-medium leading-[1.06] tracking-[-0.025em] text-ink">
              {j.titleA} <span className="block">{j.titleB}</span>
            </h2>
            <p className="pretty mt-4 max-w-[28em] text-[15px] leading-[1.6] text-graphite md:text-[16px]">{j.text}</p>
            <div className={cn('relative mt-8 hidden aspect-[4/5] w-[min(260px,70%)] overflow-hidden bg-[#E9E1D4] shadow-[0_30px_60px_-40px_rgba(60,40,20,0.6)] lg:block', ARCH)}>
              <img src={j.photo.src} alt={j.photo.alt} className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" loading="lazy" decoding="async" />
            </div>
          </div>

          {/* the letter */}
          <article className="relative rounded-[6px] bg-[#FFFDF8] p-5 shadow-[0_1px_2px_rgba(60,40,20,0.08),0_40px_80px_-50px_rgba(60,40,20,0.55)] sm:p-7 lg:-rotate-[0.6deg] lg:px-8 lg:py-7">
            <header className="flex items-center justify-between gap-4 border-b border-ink/[0.08] pb-4">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
                  <img src="/brand/aurora-symbol-color.svg" alt="" width="16" height="16" className="h-4 w-4" />
                </span>
                <span className="text-[13px] font-medium text-ink">{L.from}</span>
              </span>
              <span className="t-data text-[11px] text-ink/40">{L.date}</span>
            </header>
            <p className="mt-4 text-[19px] font-medium tracking-[-0.01em] text-ink sm:text-[21px]">{L.hello}</p>
            <p className="mt-1 text-[14.5px] text-graphite">{L.intro}</p>

            <ul className="mt-4 grid gap-2.5">
              {L.lines.map((x, i) => {
                const Icon = LETTER_ICONS[x.icon];
                return (
                  <li key={x.text} className="flex items-center gap-3.5" style={line(i)}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDE4] text-[#B4471A]">
                      <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="text-[15px] leading-snug text-graphite">
                      <span className="mr-1.5 text-[19px] font-medium tracking-[-0.02em] text-ink">{x.n}</span>
                      {x.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* the one goal this week */}
            <div className="mt-5 grid gap-4 rounded-[18px] bg-[#F6F1E9] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5" style={line(L.lines.length)}>
              <div className="min-w-0">
                <p className="flex items-center gap-2">
                  <span className="rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-white">{g.badge}</span>
                  <span className="text-[14px] font-medium text-ink">{g.name}</span>
                  <span className="text-[12px] text-slate">· {g.target}</span>
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-graphite max-sm:hidden">{g.change}</p>
                <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-ink">{g.result}</p>
              </div>
              {/* six weeks as columns, the goal as a line across */}
              <div className="relative flex h-[72px] w-[150px] items-end gap-2 self-center sm:self-end" aria-hidden="true">
                <span className="absolute inset-x-0 border-t border-dashed border-[#B4471A]/80" style={{ bottom: (g.goal - 0.6) / 0.4 * 100 + '%' }} />
                {g.weeks.map((v, i) => (
                  <span
                    key={i}
                    className={cn('flex-1 rounded-t-[6px] rounded-b-[2px]', v >= g.goal ? 'bg-[linear-gradient(180deg,#FF8A3D,#F25C2A)]' : 'bg-ink/15')}
                    style={{ height: on ? Math.max(8, ((v - 0.6) / 0.4) * 100) + '%' : '8%', transition: reduce ? 'none' : `height 0.9s cubic-bezier(0.22,1,0.36,1) ${1.4 + i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>

            <p className="mt-5 text-[14.5px] text-graphite" style={line(L.lines.length + 1)}>
              {L.sign}
              <span className="mt-0.5 block text-[16px] font-medium text-ink">{L.name}</span>
            </p>
          </article>
        </div>
        <p className="mt-4 text-[12px] text-slate">{j.note}</p>
      </div>
    </section>
  );
}

// The closing illustration: the studio drawn in thin Amber-to-Gold line, like the house on the real estate page.
// An arched window at dawn, a reformer in front of it, a pendant lamp, a basket of rolled mats and an olive tree.
const STUDIO_MAIN = [
  'M10 270H630',
  // the arched window, and its inner frame
  'M372 270V122A68 68 0 0 1 508 122V270',
  'M384 270V124A56 56 0 0 1 496 124V270',
  'M440 68V270', 'M384 176H496',
  // the reformer: rails, legs, ends, the carriage, the riser with its pulley, the footbar
  'M56 236H336', 'M56 250H336', 'M68 250V270M324 250V270', 'M56 236V250M336 236V250',
  'M138 236V224H232V236', 'M58 236V198', 'M300 236L314 196H330',
  // the olive tree in its pot, beside the window
  'M528 270L522 234H560L554 270Z', 'M516 234H566',
  'M541 234C539 216 545 204 541 190',
  'M514 178C504 166 514 150 528 152C532 138 552 136 558 150C572 148 580 162 572 172C580 182 570 196 558 192C552 202 534 202 528 192C516 196 506 186 514 178Z',
  // the basket of rolled mats
  'M580 270L574 236H626L620 270Z',
  // the pendant lamp
  'M226 40V88', 'M206 104L226 88L246 104Z',
];
const STUDIO_DETAIL = [
  'M140 216H160', 'M238 212V224M246 212V224', // headrest, shoulder blocks
  'M246 230l4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4', // springs
  'M58 198L138 222', 'M54 198a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', // rope over the pulley
  'M584 236V212a5 5 0 0 1 10 0V236', 'M597 236V204a5 5 0 0 1 10 0V236', 'M610 236V216a5 5 0 0 1 10 0V236', // rolled mats
  'M584 224H594M597 216H607M610 228H620', // their straps
  'M577 250H623M579 260H621', // weave
  'M541 200C534 192 528 186 522 180M541 196C548 188 556 184 564 176', // branches
  'M418 176A22 22 0 0 1 462 176', // the sun, rising in the window
];
const STUDIO_LIT = [
  [386, 178, 52, 90],
  [442, 178, 52, 90],
];
const STUDIO_SUN = 'M418 176A22 22 0 0 1 462 176Z';

function StudioArt({ grow, reduce }) {
  const draw = (delay, dur = 1.2) => ({
    pathLength: 1,
    strokeDasharray: 1,
    style: { strokeDashoffset: grow ? 0 : 1, transition: reduce ? 'none' : `stroke-dashoffset ${dur}s cubic-bezier(0.65,0,0.35,1) ${delay}s` },
  });
  return (
    <svg viewBox="0 30 640 250" className="block h-auto w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wx-studio-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" stopColor="#FF9F45" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC857" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g fill="#FFC857" style={{ fillOpacity: grow ? 0.16 : 0, transition: reduce ? 'none' : 'fill-opacity 1s ease 1.9s' }}>
        {STUDIO_LIT.map(([x, y, w, h]) => (
          <rect key={x} x={x} y={y} width={w} height={h} />
        ))}
        <path d="M209 104H243L226 112Z" />
        <path d={STUDIO_SUN} style={{ fillOpacity: grow ? 0.34 : 0, transition: reduce ? 'none' : 'fill-opacity 1.2s ease 2.1s' }} />
      </g>
      <g stroke="url(#wx-studio-line)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {STUDIO_MAIN.map((d, i) => (
          <path key={i} d={d} {...draw(i * 0.06)} />
        ))}
      </g>
      <g stroke="url(#wx-studio-line)" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round">
        {STUDIO_DETAIL.map((d, i) => (
          <path key={i} d={d} {...draw(1 + i * 0.06, 0.9)} />
        ))}
      </g>
    </svg>
  );
}

export function WxClosing({ it }) {
  return <Closing c={it.wx.closing} industry={it.leadIndustry} art={(grow, reduce) => <StudioArt grow={grow} reduce={reduce} />} />;
}
