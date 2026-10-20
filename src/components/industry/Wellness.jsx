import React, { useEffect, useRef } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, CalendarX, Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import Closing from '@/components/home-v2/Closing';
import { lastIndex } from '@/components/home-v2/CallBox';
import { useInViewport, useMediaQuery, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';
import { Bubble, Composer, Dots, MESSAGES, StepTimeline, ThreadHeader, useLoop } from '@/components/industry/RealEstateV3';

/*
 * Wellness & Healthcare page: the parts that are not shared with the real estate page. The waitlist scene (a late
 * cancellation at dawn, filled from the waitlist while the studio is closed) and the closing drawing of the studio.
 */

const EASE = [0.22, 1, 0.36, 1];

// The morning, in ms. The offer lands at OFFER and her clip (8 s) runs from there: she reads it, replies, grabs her mat.
const OFFER = 8200;
const CLIP_MS = 8000;
const T = {
  stepAt: [0, 3500, 7000, 11600, OFFER + CLIP_MS],
  end: 21000,
  typing: [7000, OFFER],
  reply: [10200, 11600], // she types, then sends
  typing2: [12000, 12900],
  booked: 12900,
  after: 14400,
  clip: [OFFER, OFFER + CLIP_MS],
  status: [0, 3500, OFFER, 12900], // full, open, offered, full again
  log: [3500, OFFER, 12900],
};
const STEP_ICONS = [Users, CalendarX, null, Check, CalendarCheck];

/** Where the morning is: one dot per step, the current one a short pill (orange once Aurora is at work). */
function StepDots({ steps, step, className = '' }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} aria-hidden="true">
      {steps.map((x, i) => (
        <span key={x.title} className={cn('h-1.5 rounded-full transition-all duration-300', i === step ? (i >= 2 ? 'w-5 bg-[#F25C2A]' : 'w-5 bg-ink') : i < step ? 'w-1.5 bg-ink/40' : 'w-1.5 bg-ink/15')} />
      ))}
    </div>
  );
}

function phoneClock(t) {
  if (t < 3500) return '6:02';
  if (t < 11600) return '6:12';
  if (t < 13500) return '6:14';
  return '6:15';
}

/** Chloe's phone, open on the studio's thread: yesterday's waitlist note, then this morning's offer and her yes. */
function MemberPhone({ p, t, reduce }) {
  const shown = [];
  if (t >= T.typing[1]) shown.push({ k: 'offer', m: { who: 'aurora', text: p.offer } });
  if (t >= T.reply[1]) shown.push({ k: 'reply', m: { who: 'buyer', text: p.reply } });
  if (t >= T.booked) shown.push({ k: 'booked', m: { who: 'aurora', booked: p.booked, text: '' } });
  if (t >= T.after) shown.push({ k: 'after', m: { who: 'aurora', text: p.after } });
  const typing = (t >= T.typing[0] && t < T.typing[1]) || (t >= T.typing2[0] && t < T.typing2[1]) || (t >= T.booked + 400 && t < T.after);
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[336px] rounded-[46px] bg-ink p-[9px] shadow-[0_40px_80px_-40px_rgba(60,35,10,0.55)] min-[400px]:h-[540px] sm:h-[620px] lg:h-[var(--stage-h)] lg:w-[clamp(272px,calc(var(--stage-h)*0.56),336px)]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[38px] bg-[#FBFAF7]">
        <div className="relative flex shrink-0 items-center justify-between px-7 pb-1 pt-3 text-[13px] font-medium text-ink">
          <span className="tabular-nums">{phoneClock(t)}</span>
          <span className="absolute left-1/2 top-2.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className="h-2 w-3 rounded-[2px] bg-ink/80" />
            <span className="h-2.5 w-5 rounded-[3px] border border-ink/50 p-[1.5px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-ink/80" />
            </span>
          </span>
        </div>
        <ThreadHeader name={p.studio} sub={p.sub} aurora />
        <div className={MESSAGES}>
          <p className="shrink-0 pb-1 pt-2 text-center text-[10.5px] text-ink/40">{p.earlier.time}</p>
          <Bubble m={{ who: 'aurora', text: p.earlier.text }} reduce />
          <p className="shrink-0 pb-1 pt-3 text-center text-[10.5px] text-ink/40">Today 6:12 AM</p>
          <AnimatePresence initial={false}>
            {shown.map((x) => (
              <Bubble key={x.k} m={x.m} reduce={reduce} note={x.k === 'offer' ? <span className="mt-1 text-[10.5px] font-medium text-[#B4471A]">{p.repliedIn}</span> : null} />
            ))}
            {typing ? (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex shrink-0">
                <span className="rounded-[18px] rounded-bl-[6px] bg-[#ECEAE5] px-3.5 py-3 text-ink/45">
                  <Dots />
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <Composer p={p} text={p.reply} from={T.reply[0]} to={T.reply[1] - 250} t={t} />
      </div>
    </div>
  );
}

/** The class roster at the studio: twelve beds, one freed by a late cancellation and filled from the waitlist. */
function RosterCard({ r, t, reduce, short = false }) {
  const phase = lastIndex(T.status.map((at) => ({ at })), t);
  const sw = r.swap;
  return (
    <div className={cn('rounded-[22px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)]', short ? 'px-4 py-3.5' : 'p-5')}>
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
            <CalendarCheck className="h-4 w-4 shrink-0 text-[#B4471A]" strokeWidth={1.9} aria-hidden="true" />
            {r.title}
          </span>
          <span className="mt-0.5 block pl-6 text-[12px] text-slate">{r.sub}</span>
        </span>
        <motion.span
          key={phase}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-medium', phase === 0 || phase === 3 ? 'bg-[#E4F4E8] text-[#2E7A48]' : 'bg-[#FFF1E4] text-[#B4471A]')}
        >
          {r.status[phase]}
        </motion.span>
      </div>

      {/* the beds: one tile each, by the member's initials */}
      <ol className={cn('grid grid-cols-6 gap-1.5', short ? 'mt-3' : 'mt-4 gap-2')} aria-label={r.title}>
        {r.beds.map((who, i) => {
          const mine = i === sw.bed;
          const state = !mine ? 'taken' : phase === 0 ? 'taken' : phase === 1 ? 'open' : phase === 2 ? 'held' : 'new';
          const label = mine && phase === 3 ? sw.to : who;
          return (
            <li
              key={i}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-[12px] text-[12px] font-medium transition-colors duration-500',
                state === 'taken' && 'bg-[#F3EFE8] text-ink/70',
                state === 'open' && 'bg-transparent text-ink/35 shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.18)] [background-image:repeating-linear-gradient(135deg,rgba(10,15,14,0.04)_0_6px,transparent_6px_12px)]',
                state === 'held' && 'bg-[#FFF1E4] text-[#B4471A] shadow-[inset_0_0_0_1.5px_rgba(242,92,42,0.55)]',
                state === 'new' && 'bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] text-white'
              )}
            >
              {state === 'held' && !reduce ? <span className="ring-ping absolute inset-0 rounded-[12px] bg-[#F25C2A]/15" /> : null}
              <span className="relative">{state === 'open' ? '·' : state === 'held' ? '…' : label}</span>
              <span className={cn('relative text-[9.5px] font-normal', state === 'new' ? 'text-white/75' : 'text-ink/35')}>
                {r.bedLabel} {i + 1}
              </span>
            </li>
          );
        })}
      </ol>

      <p className={cn('flex items-center gap-1.5 text-[12px] text-slate', short ? 'mt-2.5' : 'mt-3.5')}>
        <Users className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {r.waiting[phase]}
      </p>

      {/* what happened, as the studio's activity log */}
      <ul className={cn('grid border-t border-ink/[0.06]', short ? 'mt-2.5 gap-1.5 pt-2.5' : 'mt-3.5 gap-2 pt-3.5')}>
        {r.log.map((line, i) => (
          <li key={line} className="flex h-[18px] items-center gap-2 text-[12.5px]">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500', t < T.log[i] ? 'bg-ink/10' : i === 0 ? 'bg-ink/30' : 'bg-[#F25C2A]')} />
            {t >= T.log[i] ? (
              <motion.span key="on" className="text-ink/80" initial={reduce ? false : { opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                {line}
              </motion.span>
            ) : (
              // not yet: a placeholder line, as in an empty record
              <span className="inline-block h-2.5 rounded-full bg-ink/[0.07]" style={{ width: 100 + ((i * 37) % 60) + 'px' }} />
            )}
          </li>
        ))}
      </ul>
      <p className={cn('flex items-center gap-2 text-[12.5px] font-medium text-ink transition-opacity duration-500', short ? 'mt-2.5' : 'mt-3.5', t >= T.clip[1] ? 'opacity-100' : 'opacity-0')}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9A58] text-white">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
        </span>
        {r.done}
      </p>
    </div>
  );
}

/**
 * Her morning, from the moment the offer lands: kept in step with the phone on laptops, where it hands back to the
 * roster when it ends. Phones and tablets (`small`): a little square that loops beside the step.
 */
function DawnClip({ film, t, reduce, active, small = false }) {
  const ref = useRef(null);
  const loaded = usePageLoaded();
  const inClip = t >= T.clip[0] && t < T.clip[1];
  const on = small || inClip;
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (on && active) {
      if (!small) {
        const want = (t - T.clip[0]) / 1000;
        if (Math.abs(v.currentTime - want) > 0.35) v.currentTime = Math.max(0, Math.min(want, (v.duration || CLIP_MS / 1000) - 0.05));
      }
      if (v.paused) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  }, [on, active, t, reduce, small]);
  return (
    <motion.div
      className={cn('absolute inset-0 overflow-hidden bg-[#2A2420]', small ? 'rounded-[inherit]' : 'rounded-[24px] shadow-[0_24px_48px_-32px_rgba(90,50,20,0.45)]')}
      initial={false}
      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.97 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
      aria-hidden="true"
    >
      <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-[45%_40%]" loading="lazy" decoding="async" />
      {loaded && !reduce ? <video ref={ref} src={film.video} poster={film.poster} muted playsInline loop={small} preload="auto" className="absolute inset-0 h-full w-full object-cover object-[45%_40%]" /> : null}
    </motion.div>
  );
}

/** The waitlist: a late cancellation at dawn, filled from the waitlist before anyone at the studio is awake. */
export function WxWaitlist({ it }) {
  const r = it.v3.waitlist;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const t = useLoop(T.end, { active: inView && visible, still: reduce });
  const step = lastIndex(T.stepAt.map((at) => ({ at })), t);
  const s = r.steps[step];
  const wide = useMediaQuery('(min-width: 1024px)');
  const short = useMediaQuery('(max-height: 760px)');
  const n = String(r.steps.length).padStart(2, '0');
  const showClip = t >= T.clip[0] && t < T.clip[1];

  return (
    <section id="race" data-nav-theme="light" aria-labelledby="wx-wait-title" className="section relative !pt-[clamp(48px,6vw,88px)]">
      <div className="shell">
        <SectionHeader id="wx-wait-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} text={r.text} layout="split" className="xl:hidden" />
        <div
          ref={ref}
          className={cn(
            'canvas canvas-grain relative mt-8 grid gap-3 overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-14 md:gap-5 md:p-8',
            'lg:grid-cols-[max(332px,calc(var(--stage-h)_-_176px))_auto] lg:items-center lg:justify-center lg:gap-14 lg:p-8 lg:[--stage-h:clamp(440px,calc(100svh_-_200px),620px)] lg:[@media(max-height:820px)]:py-7',
            'xl:mt-0 xl:grid-cols-[minmax(240px,330px)_minmax(320px,calc(var(--stage-h)_*_0.8))_auto] xl:gap-12 xl:px-12 xl:[--stage-h:clamp(440px,calc(100svh_-_170px),620px)] 2xl:gap-16'
          )}
        >
          <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-[-10%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />

          {/* wide screens: the headline, and the morning as a timeline under it */}
          <div className="relative hidden xl:flex xl:flex-col xl:justify-center xl:gap-10 xl:self-stretch [@media(max-height:760px)]:xl:gap-7">
            <div>
              <h2 className="balance text-[clamp(31px,2.55vw,40px)] font-medium leading-[1.08] tracking-[-0.022em] text-ink [@media(max-height:760px)]:text-[30px]">
                {r.titleA} {r.titleB}
              </h2>
              <p className="pretty mt-4 max-w-[30em] text-[15.5px] leading-[1.6] text-graphite [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:text-[14.5px] [@media(max-height:760px)]:leading-[1.5]">{r.text}</p>
            </div>
            <div className="min-h-[330px] [@media(max-height:760px)]:min-h-[280px]">
              <StepTimeline steps={r.steps} T={T} t={t} step={step} reduce={reduce} icons={STEP_ICONS} auroraFrom={2} />
            </div>
          </div>

          {/* the step and, on laptops, the stage box: the roster, and her clip while she reads and replies */}
          <div className="relative lg:flex lg:flex-col lg:self-stretch">
            {wide ? (
              <div aria-live="polite" className="xl:hidden">
                <StepDots steps={r.steps} step={step} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="mt-3.5 min-h-[112px]" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
                    <p className="flex items-center justify-between text-[12px]">
                      <span className="t-data text-[#B4471A]">{s.time}</span>
                      <span className="t-data tabular-nums text-ink/35">
                        {String(step + 1).padStart(2, '0')} / {n}
                      </span>
                    </p>
                    <p className="balance mt-1.5 text-[22px] font-medium leading-tight tracking-[-0.015em] text-ink">{s.title}</p>
                    <p className="pretty mt-1 text-[15px] leading-snug text-graphite">{s.text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <>
                <StepDots steps={r.steps} step={step} className="mx-auto max-w-[352px]" />
                <div className="relative mx-auto mt-4 min-h-[124px] w-full max-w-[352px] [display:flow-root] min-[360px]:min-h-[136px]">
                  <div aria-hidden="true" className="float-right h-[48px] w-0 min-[360px]:h-[54px]" />
                  <div className="relative z-[3] float-right clear-right -mb-[38px] ml-3 h-[108px] w-[108px] overflow-hidden rounded-[20px] shadow-[0_0_0_3px_#FBFAF7,0_18px_36px_-12px_rgba(40,25,10,0.5)] min-[360px]:-mb-[44px] min-[360px]:h-[124px] min-[360px]:w-[124px] min-[400px]:h-[132px] min-[400px]:w-[132px]">
                    <DawnClip film={r.film} t={t} reduce={reduce} active={inView && visible} small />
                  </div>
                  <div aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
                        <p className="t-data text-[12px] text-[#B4471A]">{s.time}</p>
                        <p className="mt-1 text-[17px] font-medium leading-tight tracking-[-0.015em] text-ink min-[400px]:text-[18px]">{s.title}</p>
                        <p className="mt-1 text-[13.5px] leading-snug text-graphite min-[400px]:text-[14px]">{s.text}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
            <div className="relative mt-5 hidden min-h-[300px] lg:block lg:h-[max(332px,calc(var(--stage-h)_-_176px))] lg:w-full xl:mt-0 xl:h-auto xl:flex-1">
              {wide ? <DawnClip film={r.film} t={t} reduce={reduce} active={inView && visible} /> : null}
              <AnimatePresence initial={false}>
                {!showClip ? (
                  <motion.div
                    key="roster"
                    className="absolute inset-0 flex items-start xl:items-center"
                    initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <div className="w-full">
                      <RosterCard r={r.roster} t={t} reduce={reduce} short={short} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative">
            <MemberPhone p={r.phone} t={t} reduce={reduce} />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{r.note}</p>
        <ol className="sr-only">
          {r.steps.map((x) => (
            <li key={x.title}>
              {x.time}: {x.title}. {x.text}
            </li>
          ))}
        </ol>
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
  return <Closing c={it.v3.closing} industry={it.leadIndustry} art={(grow, reduce) => <StudioArt grow={grow} reduce={reduce} />} />;
}
