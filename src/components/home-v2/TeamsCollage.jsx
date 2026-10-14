import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { teams } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

const N = teams.items.length;
const ADVANCE_MS = 9000;
// when each beat of a scene appears (ms after the tab opens)
const BEATS = [0, 700, 1700, 2600, 3600];
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

const appear = (on, reduce, y = 10) => ({
  initial: false,
  animate: on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale: 0.98 },
  transition: { duration: reduce ? 0 : 0.6, ease: EASE },
});

/** One team's collage: a short clip of the person being helped, an object from their world, and Aurora's glass cards on top. */
function Collage({ t, beat, reduce }) {
  const c = t.collage;
  const AuroraMark = <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="h-[18px] w-[18px]" />;
  return (
    <div className="relative aspect-[4/5] sm:aspect-[6/5] lg:aspect-[7/6]">
      {/* the clip */}
      <motion.div
        {...appear(beat >= 0, reduce, 0)}
        className="absolute right-0 top-[6%] h-[80%] w-[58%] overflow-hidden rounded-[24px] sm:top-[4%] sm:h-[86%] sm:w-[46%]"
        style={{ background: TILE[t.key] }}
      >
        {c.video ? (
          <video key={c.video} src={c.video} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden="true" />
        ) : null}
      </motion.div>

      {/* the object */}
      <motion.div
        {...appear(beat >= 0, reduce, 0)}
        className="absolute bottom-0 left-[3%] h-[38%] w-[46%] overflow-hidden rounded-[24px] sm:left-[8%] sm:h-[46%] sm:w-[40%]"
        style={{ background: TILE[t.key] }}
      >
        {c.object.src ? <img key={c.object.src} src={c.object.src} alt={c.object.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}
      </motion.div>

      {/* the conversation, in glass */}
      <LiquidGlass
        as={motion.div}
        {...appear(beat >= 1, reduce)}
        className="absolute left-0 top-0 w-[82%] rounded-[22px] p-3 sm:w-[62%] sm:p-3.5"
        style={{ '--lg-tint-a': 'rgba(255,250,242,0.62)', '--lg-tint-b': 'rgba(255,246,229,0.3)' }}
      >
        <p className="flex items-center justify-between text-[11px] font-medium text-ink/55">
          <span>{c.channel}</span>
          <span>now</span>
        </p>
        <p className="ml-auto mt-2 w-fit max-w-[88%] rounded-[16px] rounded-br-[6px] bg-[linear-gradient(135deg,#E2461B,#FF9F45)] px-3.5 py-2 text-[13px] leading-snug text-white shadow-[0_10px_22px_-14px_rgba(226,70,27,0.9)]">
          {c.ask}
        </p>
        <motion.div {...appear(beat >= 2, reduce, 6)} className="mt-2 rounded-[16px] bg-white/75 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]">
          <p className="flex items-start gap-2.5 text-[13px] leading-snug text-ink">
            <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(10,15,14,0.12)]">{AuroraMark}</span>
            {c.reply}
          </p>
          <motion.div {...appear(beat >= 3, reduce, 4)} className="mt-2.5 flex flex-wrap gap-1.5 pl-[34px]">
            {c.options.map((o, i) => (
              <span
                key={o}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium',
                  i === 0 ? 'bg-ink text-white' : 'bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)]'
                )}
              >
                {t.key === 'service' ? <Check className="h-3 w-3 text-[#2E9A58]" strokeWidth={2.6} aria-hidden="true" /> : null}
                {o}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </LiquidGlass>

      {/* what got done */}
      <LiquidGlass
        as={motion.div}
        {...appear(beat >= 4, reduce, 12)}
        className="absolute bottom-[14%] right-[4%] flex items-center gap-2.5 rounded-[18px] py-2.5 pl-2.5 pr-4 sm:bottom-[12%] sm:right-[6%]"
        style={{ '--lg-tint-a': 'rgba(255,252,247,0.7)', '--lg-tint-b': 'rgba(255,248,236,0.4)' }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F4E8]">
          <Check className="h-4 w-4 text-[#2E7A48]" strokeWidth={2.6} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[13px] font-medium leading-tight text-ink">{c.result.title}</span>
          <span className="block text-[11.5px] text-ink/60">{c.result.detail}</span>
        </span>
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

        <Reveal y={28} className="mt-8 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <Collage key={t.key} t={t} beat={beat} reduce={reduce} />
          </div>

          <div className="lg:col-span-5">
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

            <motion.div key={t.key} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} role="tabpanel" className="mt-7">
              <p className="eyebrow">{t.agent}</p>
              <h3 className="t-h2 balance mt-3">{t.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-graphite md:text-[16px]">{t.line}</p>
              <p className="mt-6 text-[12px] font-medium text-slate">What it moves</p>
              <ul className="mt-2 grid gap-1.5" aria-label="What it moves">
                {t.kpis.map((k) => (
                  <li key={k} className="flex items-center gap-2 text-[14px] font-medium text-ink">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#D9481C]" strokeWidth={2} aria-hidden="true" />
                    {k}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
