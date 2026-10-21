import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { heroStage } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import { EVENT_ICONS } from './eventIcons';
import { EASE } from './motion';
import { useHydrated, useMediaQuery, usePageLoaded, usePageVisible } from './hooks';

/**
 * Home hero background: short clips that cross-fade in place (no sliding), one after another.
 * Phones get vertical versions, wider screens the 16:9 ones. Only the clip on screen plays; the
 * next one is fetched once it is running. The first clip waits for the page's load event, so the
 * poster, code and font come first. Reduced motion shows the first still only.
 * The first still is also a <picture> under the clips, which picks the phone or wide version with a
 * media query: the prerendered HTML can't know the screen, so the clips only get their posters
 * once the page is hydrated, and the picture covers the first paint until then. The later clips get
 * their posters when they start loading, so the first screen doesn't download all four stills.
 * A small glass card says what Aurora did in each scene, and a dot per scene shows where the reel is.
 * Hand-offs are soft: the next clip starts a moment before the current one ends and fades in over it,
 * while the outgoing clip keeps playing to its last frame; it is only rewound once it is fully hidden.
 */
const FADE_MS = 1400;
const LEAD_S = 1.1; // start the next clip this long before the current one ends
export default function HeroReel({ className = undefined }) {
  const clips = heroStage.clips;
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const tall = useMediaQuery('(max-aspect-ratio: 4/5)', false);
  const [active, setActive] = useState(0);
  const pageLoaded = usePageLoaded();
  const hydrated = useHydrated();
  const [playing, setPlaying] = useState(-1);
  const refs = useRef([]);
  const handedOff = useRef(-1); // the clip that has already handed off to the next one
  const next = (active + 1) % clips.length;

  const advance = (i) => {
    if (i !== active || handedOff.current === i) return;
    handedOff.current = i;
    setActive((a) => (a + 1) % clips.length);
  };

  // The active clip plays from its beginning. The one that just handed off keeps playing under the
  // fade and is rewound only once it is fully hidden, so nothing jumps while it is still on screen.
  useEffect(() => {
    if (reduce) return undefined;
    const prev = (active - 1 + clips.length) % clips.length;
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        if (!visible) {
          v.pause();
          return;
        }
        if (v.ended || (handedOff.current !== i && v.currentTime > 0 && v.paused)) v.currentTime = 0;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (i !== prev) {
        v.pause();
        if (v.currentTime) v.currentTime = 0;
      } else if (!visible) {
        v.pause();
      }
    });
    if (handedOff.current === active) handedOff.current = -1;
    const t = window.setTimeout(() => {
      const v = refs.current[prev];
      if (v && prev !== active) {
        v.pause();
        v.currentTime = 0;
      }
    }, FADE_MS + 150);
    return () => window.clearTimeout(t);
  }, [active, visible, reduce, tall, pageLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const onTime = (i) => (e) => {
    const v = e.currentTarget;
    if (i === active && v.duration && v.duration - v.currentTime <= LEAD_S) advance(i);
  };
  const onPlaying = (i) => () => {
    if (i === active) setPlaying(i);
  };
  const onEnded = (i) => () => advance(i);

  const card = clips[active];
  const Icon = EVENT_ICONS[card.icon] || CalendarCheck;

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-ink', className)} aria-hidden="true">
      {reduce ? null : (
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={clips[0].posterTall} />
          <img
            src={clips[0].poster}
            alt=""
            fetchPriority="high"
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out', active === 0 ? 'opacity-100' : 'opacity-0')}
          />
        </picture>
      )}
      {clips.map((c, i) => {
        const poster = tall ? c.posterTall : c.poster;
        if (reduce) {
          return i === 0 ? <img key={c.key} src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null;
        }
        // After the page has loaded, the active clip loads; the next one once the active clip is
        // playing; the rest wait until their turn comes near.
        const load = pageLoaded && (i === active || (i === next && playing === active));
        return (
          <video
            key={c.key + (tall ? '-t' : '-w')}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out', i === active ? 'opacity-100' : 'opacity-0')}
            src={load ? (tall ? c.tall : c.wide) : undefined}
            poster={hydrated && (i === 0 || load) ? poster : undefined}
            muted
            playsInline
            preload={load ? 'auto' : 'none'}
            onTimeUpdate={onTime(i)}
            onPlaying={onPlaying(i)}
            onEnded={onEnded(i)}
          />
        );
      })}

      {/* legibility: darker top and bottom, a soft vignette in the middle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,12,10,0.74)_0%,rgba(6,12,10,0.5)_16%,rgba(6,12,10,0.38)_42%,rgba(6,12,10,0.5)_72%,rgba(6,12,10,0.78)_100%)]" />

      {/* what Aurora did in this scene, and progress through the reel */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="shell flex items-end justify-between gap-6 pb-6 md:pb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={card.key}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <LiquidGlass tone="dark" className="flex items-center gap-3 rounded-[16px] py-2.5 pl-2.5 pr-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/90 text-ink">
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-[12.5px] font-medium leading-tight text-white">{card.title}</span>
                  <span className="mt-0.5 block text-[11px] text-white/60">{card.detail}</span>
                </span>
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.2 5 8.5 9.5 3.5" />
                  </svg>
                </span>
              </LiquidGlass>
            </motion.div>
          </AnimatePresence>
          <div className="hidden items-center gap-2 sm:flex">
            {clips.map((c, i) => (
              <span key={c.key} className={cn('block h-1.5 rounded-full transition-all duration-500 ease-out', i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/35')} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
