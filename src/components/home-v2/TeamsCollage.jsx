import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { teams } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

const N = teams.items.length;
const ADVANCE_MS = 12000;
// when each beat of a scene appears (ms after the tab opens)
const BEATS = [0, 500, 1800, 3100, 4400, 5700, 7000]; // tiles, five messages, the result
const EASE = [0.22, 1, 0.36, 1];

// The tile colours behind the media while it loads, one per team.
const TILE = { sales: '#F2672E', service: '#FFC857', internal: '#2B1A12' };

/** The latest beat reached for `key`. A new key starts from beat 0 on its very first render, so nothing flashes. */
function useBeats(key, still) {
  const last = BEATS.length - 1;
  const [state, setState] = useState({ key, beat: last });
  useEffect(() => {
    if (still) return undefined;
    setState({ key, beat: 0 });
    const timers = BEATS.slice(1).map((t, i) => window.setTimeout(() => setState({ key, beat: i + 1 }), t));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [key, still]);
  if (still) return last;
  return state.key === key ? state.beat : 0;
}

/** Grows from zero height so the glass card extends smoothly instead of holding empty space. */
function GrowIn({ show = true, still, children, className = undefined }) {
  if (!show) return null;
  return (
    <motion.div
      initial={still ? false : { height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ height: { duration: 0.6, ease: EASE }, opacity: { duration: 0.45, delay: 0.12 } }}
      className={cn('shrink-0 overflow-hidden', className)}
    >
      {children}
    </motion.div>
  );
}

const appear = (on, reduce, y = 10) => ({
  initial: false,
  animate: on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale: 0.98 },
  transition: { duration: reduce ? 0 : 0.6, ease: EASE },
});

function Message({ m, still, last }) {
  const AuroraMark = <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="h-[18px] w-[18px]" />;
  return (
    <GrowIn show still={still}>
      <div className="pt-2">
        {m.from === 'aurora' ? (
          <div className="mr-6 rounded-[16px] rounded-bl-[6px] bg-white/80 p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.8)] sm:mr-8 sm:p-3">
            <p className="flex items-start gap-2 text-[12.5px] leading-snug text-ink sm:text-[13px]">
              <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(10,15,14,0.12)]">{AuroraMark}</span>
              <span className="pt-[3px]">{m.text}</span>
            </p>
            {m.chips ? (
              <div className="mt-2 flex flex-wrap gap-1.5 pl-8">
                {m.chips.map((o, i) => (
                  <span key={o} className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium', i === 0 ? 'bg-ink text-white' : 'bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)]')}>
                    {o}
                  </span>
                ))}
              </div>
            ) : null}
            {m.checks ? (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 pl-8">
                {m.checks.map((o) => (
                  <span key={o} className="flex items-center gap-1 text-[11.5px] text-ink/70">
                    <Check className="h-3 w-3 text-[#2E9A58]" strokeWidth={2.6} aria-hidden="true" />
                    {o}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="ml-auto w-fit max-w-[84%]">
            {m.name ? <p className="mb-0.5 mr-1 text-right text-[10.5px] font-medium text-ink/50">{m.name}</p> : null}
            <p
              className={cn(
                'rounded-[16px] rounded-br-[6px] bg-[linear-gradient(135deg,#E2461B,#FF9F45)] px-3 py-2 text-[12.5px] leading-snug text-white sm:px-3.5 sm:text-[13px]',
                last && 'shadow-[0_10px_22px_-14px_rgba(226,70,27,0.9)]'
              )}
            >
              {m.text}
            </p>
          </div>
        )}
      </div>
    </GrowIn>
  );
}

function ResultRow({ r, className = undefined }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4F4E8]">
        <Check className="h-4 w-4 text-[#2E7A48]" strokeWidth={2.6} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium leading-tight text-ink">{r.title}</span>
        <span className="block truncate text-[11.5px] text-ink/60">{r.detail}</span>
      </span>
    </span>
  );
}

/**
 * One team's collage: a short clip of the person being helped, an object from their world, and the conversation
 * with Aurora in glass. Phones stack the media above the conversation; wider screens overlap them.
 */
function Collage({ t, beat, reduce, still }) {
  const c = t.collage;
  const msgs = c.messages;
  const shownMsgs = msgs.slice(0, Math.max(0, beat));
  const done = beat > msgs.length;
  const calm = still || reduce;
  return (
    <div className="relative sm:aspect-[6/5] lg:aspect-[7/6]">
      <div className="flex items-end gap-2.5 sm:contents">
        {/* the object */}
        <motion.div
          {...appear(true, reduce, 0)}
          className="relative aspect-[4/5] w-[41%] shrink-0 overflow-hidden rounded-[20px] sm:absolute sm:bottom-0 sm:left-[8%] sm:aspect-auto sm:h-[46%] sm:w-[40%] sm:rounded-[24px]"
          style={{ background: TILE[t.key] }}
        >
          {c.object.src ? <img key={c.object.src} src={c.object.src} srcSet={c.object.srcSet} sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 42vw" alt={c.object.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : null}
        </motion.div>
        {/* the clip */}
        <motion.div
          {...appear(true, reduce, 0)}
          className="relative aspect-[3/4] min-w-0 flex-1 overflow-hidden rounded-[20px] sm:absolute sm:right-0 sm:top-[4%] sm:aspect-auto sm:h-[86%] sm:w-[46%] sm:rounded-[24px]"
          style={{ background: TILE[t.key] }}
        >
          {c.video ? (
            <video key={c.video} src={c.video} poster={c.poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          ) : null}
        </motion.div>
      </div>

      {/* the conversation, in glass; on phones it overlaps the bottom of the media a little */}
      <LiquidGlass
        as={motion.div}
        {...appear(beat >= 1, reduce)}
        className="relative z-[1] -mt-8 rounded-[22px] p-3 sm:absolute sm:left-0 sm:top-0 sm:mt-0 sm:w-[60%] sm:p-3.5"
        style={{ '--lg-tint-a': 'rgba(255,250,242,0.66)', '--lg-tint-b': 'rgba(255,246,229,0.34)' }}
      >
        <p className="flex items-center justify-between text-[11px] font-medium text-ink/55">
          <span>{c.channel}</span>
          <span>now</span>
        </p>
        {/* a fixed window that keeps the latest messages in view, like a real thread */}
        <div className="relative mt-1 flex h-[200px] flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_28px)] sm:h-[248px] lg:h-[268px]">
          {shownMsgs.map((m, i) => (
            <Message key={i} m={m} still={calm} last={i === shownMsgs.length - 1} />
          ))}
          {/* phones: the result closes the thread instead of floating over the photos */}
          <div className="sm:hidden">
            <GrowIn show={done} still={calm}>
              <div className="pt-2.5">
                <ResultRow r={c.result} className="rounded-[16px] bg-white/85 p-2" />
              </div>
            </GrowIn>
          </div>
        </div>
      </LiquidGlass>

      {/* wider screens: what got done, floating over the clip */}
      <LiquidGlass
        as={motion.div}
        {...appear(done, reduce, 12)}
        className="absolute bottom-[10%] right-[5%] hidden rounded-[18px] py-2.5 pl-2.5 pr-4 sm:flex"
        style={{ '--lg-tint-a': 'rgba(255,252,247,0.72)', '--lg-tint-b': 'rgba(255,248,236,0.42)' }}
      >
        <ResultRow r={c.result} />
      </LiquidGlass>
    </div>
  );
}

/** Teams: one tab per team. Each shows a collage of the work Aurora finishes for that team, and what it moves. */
export default function TeamsCollage() {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.35 });
  const visible = usePageVisible();
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const t = teams.items[active];
  const beat = useBeats(active + (inView ? ':on' : ':off'), reduce || !inView);

  useEffect(() => {
    if (reduce || touched || !inView || !visible) return undefined;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % N), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, touched, inView, visible, reduce]);

  const pick = (i) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <section id="teams" data-nav-theme="light" aria-labelledby="teams-title" className="section relative">
      <div className="shell" ref={ref}>
        <SectionHeader id="teams-title" eyebrow={teams.eyebrow} titleA={teams.titleA} titleB={teams.titleB} text={teams.text} layout="split" />

        <Reveal y={28} className="mt-8 grid gap-5 md:mt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-0">
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">
              <div role="tablist" aria-label="Teams" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {teams.items.map((x, i) => (
                <button
                  key={x.key}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => pick(i)}
                  className={cn(
                    'relative h-10 shrink-0 overflow-hidden rounded-full px-4 text-[13.5px] font-medium transition-colors duration-300',
                    i === active ? 'bg-ink text-white' : 'bg-white text-ink/70 shadow-[0_0_0_1px_rgba(10,15,14,0.08)] hover:text-ink'
                  )}
                >
                  {x.label}
                  {i === active && !touched && !reduce ? (
                    <span
                      key={active + (inView && visible ? 'run' : 'stop')}
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-1.5 h-px origin-left bg-white/50"
                      style={inView && visible ? { animation: `outcomes-fill ${ADVANCE_MS}ms linear forwards` } : { transform: 'scaleX(0)' }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
            <motion.div key={t.key} initial={reduce || !inView ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} role="tabpanel" className="lg:mt-7">
              <p className="eyebrow hidden lg:block">{t.agent}</p>
              <h3 className="t-h2 balance lg:mt-3">{t.title}</h3>
              <p className="mt-1 max-w-[40ch] text-[14px] leading-snug text-graphite lg:mt-3 lg:leading-relaxed lg:text-[16px]">{t.line}</p>
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <Collage key={t.key} t={t} beat={beat} reduce={reduce} still={reduce || !inView} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
