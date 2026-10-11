import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { brand } from '@/data/site';
import { cn } from '@/lib/utils';
import LiquidGlass from './primitives/LiquidGlass';
import { Reveal } from './primitives/MotionReveal';
import { EASE } from './motion';
import { EVENT_ICONS } from './eventIcons';
import { useInViewport, useMediaQuery, usePageVisible } from './hooks';

const CARD_H = 64;
const GAP = 8;
const SLOT = CARD_H + GAP;

/**
 * Live feed of glass notifications over the photo. A new card arrives on top
 * every few seconds and the others slide down one slot; the oldest fades out.
 * Each card moves and fades itself (no fading wrapper), so the glass keeps
 * blurring the photo through every transition.
 * @param {any} props
 */
function LiveFeed({ events, slots, running, still }) {
  const [head, setHead] = useState(slots);
  // A new set of events (a task button was pressed) replaces every card at once, and the timer restarts.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setHead((n) => n + slots);
  }, [events, slots]);
  useEffect(() => {
    if (!running || still) return undefined;
    const id = window.setInterval(() => setHead((n) => n + 1), 2800);
    return () => window.clearInterval(id);
  }, [running, still, events]);

  const items = Array.from({ length: slots }, (_, i) => {
    const n = head - 1 - i;
    return { n, i, e: events[((n % events.length) + events.length) % events.length] };
  });

  return (
    <div className="relative" style={{ height: slots * SLOT - GAP }} aria-hidden="true">
      <AnimatePresence initial={false}>
        {items.map(({ n, i, e }) => {
          const Icon = EVENT_ICONS[e.icon] || CalendarCheck;
          return (
            <LiquidGlass
              as={motion.div}
              key={n}
              className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-[18px] px-3"
              style={{ height: CARD_H }}
              initial={still ? false : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: i * SLOT }}
              exit={{ opacity: 0, y: slots * SLOT - GAP - CARD_H + 18 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/85 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium leading-tight text-ink">{e.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-graphite">{e.detail}</span>
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2 5 8.5 9.5 3.5" />
                </svg>
              </span>
            </LiquidGlass>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * Buttons that pick which kind of work the live feed shows. Pressing the active one again
 * goes back to the mix of everything.
 * @param {any} props
 */
function TaskButtons({ tasks, active, onPick, onPhoto }) {
  return (
    <div role="group" aria-label="Show Aurora doing" className={cn('flex flex-wrap', onPhoto ? 'gap-2' : 'gap-1.5')}>
      {tasks.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(on ? null : t.key)}
            className={cn(
              'rounded-full font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow',
              onPhoto ? 'h-9 px-4 text-[13px]' : 'h-8 px-3 text-[12px]',
              onPhoto
                ? on
                  ? 'bg-white text-ink'
                  : 'border border-white/35 bg-white/15 text-white backdrop-blur-md hover:bg-white/25'
                : on
                  ? 'bg-ink text-white'
                  : 'border border-ink/15 bg-white text-ink hover:border-ink/30'
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Rendered width of an element, measured before paint and kept current. */
function useWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setW(el.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/**
 * Hero visual for the home and industry pages: a real-life photo with Aurora's
 * work arriving as a live feed of small glass cards. (The full product film
 * lives on the Platform page only.)
 * photo: { src, srcSet, mobileSrcSet?, alt, lqip?, position? }
 * caption: one line at the bottom of the photo saying what the viewer is looking at
 * events: [{ icon, title, detail }]  (illustrative examples, not customer data)
 * @param {any} props
 */
export default function PhotoStage({ photo, events, caption = undefined, tasks = undefined, className = undefined }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const wide = useMediaQuery('(min-width: 640px)');
  const width = useWidth(ref);
  // New cards arrive on top and push the earlier ones down: three on wide photos, two on phones
  // (so the people and the caption stay visible).
  const slots = width === 0 || width >= 600 ? 3 : 2;
  const [task, setTask] = useState(/** @type {string | null} */ (null));
  const picked = tasks && task ? tasks.find((t) => t.key === task) : null;
  const feed = picked ? picked.events : events;

  return (
    <Reveal y={40} amount={0.05} className={className}>
      <figure
        ref={ref}
        className="canvas relative m-0 aspect-[4/5] bg-cover bg-center sm:aspect-[16/10] lg:aspect-[16/7]"
        style={photo.lqip ? { backgroundImage: 'url(' + (wide || !photo.lqipMobile ? photo.lqip : photo.lqipMobile) + ')' } : undefined}
      >
        <picture>
          {photo.mobileSrcSet ? <source media="(max-width: 639px)" srcSet={photo.mobileSrcSet} sizes="calc(100vw - 32px)" /> : null}
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 1440px) 1320px, calc(100vw - 48px)"
            alt={photo.alt}
            fetchPriority="high"
            decoding="async"
            className={cn('absolute inset-0 h-full w-full object-cover', photo.position || 'object-[50%_45%]')}
          />
        </picture>
        {caption ? (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(6,12,10,0.6)_0%,rgba(6,12,10,0.22)_45%,rgba(6,12,10,0)_100%)]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 xs:p-6 md:p-8">
              <p className="max-w-[30ch] text-[17px] font-medium leading-snug text-white sm:text-[20px] md:max-w-[34ch] md:text-[24px]">{caption}</p>
              {tasks ? (
                <div className="mt-4 hidden sm:block md:mt-5">
                  <TaskButtons tasks={tasks} active={task} onPick={setTask} onPhoto />
                </div>
              ) : null}
            </figcaption>
          </>
        ) : null}
        <div className="absolute left-4 right-4 top-4 xs:left-auto xs:w-[288px] sm:right-5 sm:top-5 md:right-6 md:top-6 md:w-[300px]">
          <LiquidGlass className="mb-2 hidden items-center gap-2 rounded-full px-3 py-1.5 md:inline-flex">
            <span className={cn('h-2 w-2 rounded-full bg-brand', !reduce && 'animate-blink')} aria-hidden="true" />
            <span className="text-[11.5px] font-medium text-ink">{brand.product} · working</span>
          </LiquidGlass>
          <LiveFeed events={feed} slots={slots} running={inView && visible} still={!!reduce} />
        </div>
      </figure>
      {tasks ? (
        <div className="mt-4 sm:hidden">
          <TaskButtons tasks={tasks} active={task} onPick={setTask} onPhoto={false} />
        </div>
      ) : null}
    </Reveal>
  );
}
