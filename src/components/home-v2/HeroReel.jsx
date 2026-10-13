import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { heroStage } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import { EVENT_ICONS } from './eventIcons';
import { EASE } from './motion';
import { useMediaQuery, usePageVisible } from './hooks';

/**
 * Home hero background: short clips that cross-fade in place (no sliding), one after another.
 * Phones get vertical versions, wider screens the 16:9 ones. Only the clip on screen plays; the
 * next one is fetched while it runs. Reduced motion shows the first still only.
 * A small glass card says what Aurora did in each scene, and thin bars show the progress.
 */
export default function HeroReel({ className = undefined }) {
  const clips = heroStage.clips;
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const tall = useMediaQuery('(max-aspect-ratio: 4/5)', false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const refs = useRef([]);
  const next = (active + 1) % clips.length;

  // Play only the active clip; rewind it first so every scene starts from its beginning.
  useEffect(() => {
    if (reduce) return;
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && visible) {
        if (v.currentTime > 0 && v.ended) v.currentTime = 0;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (i !== active) {
        v.pause();
        v.currentTime = 0;
      } else {
        v.pause();
      }
    });
  }, [active, visible, reduce, tall]);

  const onTime = (i) => (e) => {
    if (i !== active) return;
    const v = e.currentTarget;
    if (v.duration) setProgress(v.currentTime / v.duration);
  };
  const onEnded = (i) => () => {
    if (i !== active) return;
    setProgress(0);
    setActive((a) => (a + 1) % clips.length);
  };

  const card = clips[active];
  const Icon = EVENT_ICONS[card.icon] || CalendarCheck;

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-ink', className)} aria-hidden="true">
      {clips.map((c, i) => {
        const poster = tall ? c.posterTall : c.poster;
        if (reduce) {
          return i === 0 ? <img key={c.key} src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null;
        }
        // The active clip and the next one load; the rest wait until their turn comes near.
        const load = i === active || i === next;
        return (
          <video
            key={c.key + (tall ? '-t' : '-w')}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out', i === active ? 'opacity-100' : 'opacity-0')}
            src={load ? (tall ? c.tall : c.wide) : undefined}
            poster={poster}
            muted
            playsInline
            preload={load ? 'auto' : 'none'}
            onTimeUpdate={onTime(i)}
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
          <div className="hidden items-center gap-1.5 sm:flex">
            {clips.map((c, i) => (
              <span key={c.key} className="h-[3px] w-10 overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full rounded-full bg-white"
                  style={{ width: i < active ? '100%' : i === active ? progress * 100 + '%' : '0%', transition: i === active ? 'width 250ms linear' : 'none' }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
