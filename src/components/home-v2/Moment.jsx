import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, Database, FileCheck2, Headset, MessageCircle, Send, UserCheck } from 'lucide-react';
import { brand, moment } from '@/data/site';
import { cn } from '@/lib/utils';
import LiquidGlass from './primitives/LiquidGlass';
import { Reveal, RevealLines } from './primitives/MotionReveal';
import { EASE } from './motion';
import { useInViewport, useMediaQuery, usePageVisible } from './hooks';

export const EVENT_ICONS = {
  calendar: CalendarCheck,
  message: MessageCircle,
  qualified: UserCheck,
  send: Send,
  service: Headset,
  approval: FileCheck2,
  crm: Database,
};

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
function LiveFeed({ slots, running, still }) {
  const events = moment.events;
  const [head, setHead] = useState(slots);
  useEffect(() => {
    if (!running || still) return undefined;
    const id = window.setInterval(() => setHead((n) => n + 1), 2800);
    return () => window.clearInterval(id);
  }, [running, still]);

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
                <span className="block truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink">{e.title}</span>
                <span className="mt-0.5 block truncate text-[11.5px] text-graphite">{e.detail}</span>
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
 * Atmosphere band: a real-life moment with the work happening in the
 * background. The photo and the glass share one canvas, so the glass always
 * has its backdrop, including while the whole figure reveals.
 */
export default function Moment() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const wide = useMediaQuery('(min-width: 640px)');
  const width = useWidth(ref);
  // Three cards only where the sky leaves room beside the people; one elsewhere.
  const slots = width >= 1240 ? 3 : 1;
  const p = moment.photo;

  return (
    <section data-nav-theme="light" aria-labelledby="moment-title" className="relative pb-[clamp(72px,9vw,140px)] pt-[clamp(32px,4vw,64px)]">
      <div className="shell">
        <Reveal y={40} amount={0.12}>
          <figure
            ref={ref}
            className="canvas relative m-0 aspect-square bg-cover bg-center sm:aspect-[4/3] lg:aspect-[16/9] min-[1400px]:aspect-[16/8.4]"
            style={{ backgroundImage: 'url(' + (wide ? p.lqip : p.lqipMobile) + ')' }}
          >
            <picture>
              <source media="(max-width: 639px)" srcSet={p.mobileSrcSet} sizes="calc(100vw - 32px)" />
              <img
                src={p.src}
                srcSet={p.srcSet}
                sizes="(min-width: 1440px) 1320px, calc(100vw - 48px)"
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[50%_45%] sm:object-[54%_50%]"
              />
            </picture>

            {/* Legibility: a soft shade behind the caption only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,12,10,0.62)_0%,rgba(6,12,10,0.24)_34%,rgba(6,12,10,0)_56%)] sm:bg-[radial-gradient(130%_80%_at_0%_100%,rgba(6,12,10,0.7)_0%,rgba(6,12,10,0.34)_42%,rgba(6,12,10,0)_72%)]"
            />

            <figcaption className="absolute inset-x-0 bottom-0 p-5 xs:p-6 md:p-10">
              <h2 id="moment-title" className="t-h2 balance max-w-[16ch] text-white">
                <RevealLines lines={[moment.titleA, moment.titleB]} lineClassNames={['', 'text-white/80']} blur={false} y={18} />
              </h2>
              <p className="mt-3 hidden max-w-[40ch] text-[15px] leading-relaxed text-white/80 sm:block md:mt-4 md:text-[16px]">{moment.text}</p>
            </figcaption>

            <div
              className={cn(
                'absolute',
                slots === 3 ? 'right-5 top-5 w-[272px]' : 'left-4 right-4 top-4 xs:left-auto xs:w-[288px] sm:right-5 sm:top-5 md:right-6 md:top-6'
              )}
            >
              <LiquidGlass className="mb-2 hidden items-center gap-2 rounded-full px-3 py-1.5 md:inline-flex">
                <span className={cn('h-2 w-2 rounded-full bg-brand', !reduce && 'animate-blink')} aria-hidden="true" />
                <span className="text-[12px] font-medium text-ink">{brand.product} · working</span>
              </LiquidGlass>
              <LiveFeed slots={slots} running={inView && visible} still={!!reduce} />
            </div>
          </figure>
        </Reveal>
        <p className="mt-4 text-[15px] leading-relaxed text-graphite sm:hidden">{moment.text}</p>
      </div>
    </section>
  );
}
