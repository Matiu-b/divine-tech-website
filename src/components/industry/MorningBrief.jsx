import React, { useEffect, useRef } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Check, Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { clock, lastIndex, subtitle, useCallClock } from '@/components/home-v2/CallBox';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';

const EASE = [0.22, 1, 0.36, 1];

/**
 * The morning brief, as one scene: Dana in her kitchen at 8 am, coffee in hand, listening. The call plays over her with
 * large subtitles, and what Aurora reported and did is ticked off beside her as she says it (on phones, one line at a
 * time above the subtitles).
 */
export default function MorningBrief({ d }) {
  const call = d.calls[0];
  const c = call.call;
  const m = d.media;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const cc = useCallClock(c, { audioRef });
  const { t, status, play } = cc;
  const live = status === 'playing' || status === 'paused';

  useEffect(() => {
    if ((!inView || !visible) && status === 'playing') play();
  }, [inView, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // the scene moves only while it is on screen
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduce) return;
    if (inView && visible) el.play().catch(() => {});
    else el.pause();
  }, [inView, visible, reduce]);

  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const sub = subtitle(cap, t);
  const reached = status === 'idle' ? -1 : status === 'done' ? c.notes.length - 1 : lastIndex(c.notes, t);
  const items = c.notes.slice(1);
  const current = reached >= 1 ? items[reached - 1] : null;
  const bars = c.wave.filter((_, i) => i % 3 === 0);
  const nb = bars.length;
  const played = live || status === 'done' ? t : -1;

  return (
    <section id="hear" data-nav-theme="light" aria-labelledby="hear-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="hear-title"
          titleA={d.titleA}
          text={
            <>
              <span className="lg:hidden">{d.textShort}</span>
              <span className="max-lg:hidden">{d.text}</span>
            </>
          }
          layout="split"
        />

        <div ref={ref} className="canvas relative mt-5 aspect-[4/5] overflow-hidden bg-ink min-[480px]:aspect-[4/3] sm:mt-8 md:mt-12 md:aspect-[16/9] lg:aspect-auto lg:h-[clamp(520px,calc(100svh_-_300px),640px)]">
          {/* the scene */}
          <img src={m.poster} srcSet={m.srcSet} sizes="(min-width: 1280px) 1240px, 100vw" alt={m.alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.focus }} />
          {m.video && !reduce ? <video ref={videoRef} src={m.video} poster={m.poster} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.focus }} muted loop playsInline preload="metadata" aria-hidden="true" /> : null}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,15,14,0.82)_0%,rgba(10,15,14,0.45)_32%,rgba(10,15,14,0)_58%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,15,14,0.35)_0%,rgba(10,15,14,0)_22%)]" />

          {/* the call, top left */}
          <div className="absolute left-3 top-3 flex items-center gap-2.5 rounded-full bg-white/90 py-1.5 pl-1.5 pr-3.5 shadow-[0_2px_10px_rgba(10,15,14,0.18)] backdrop-blur-md sm:left-5 sm:top-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
              <img src="/brand/aurora-symbol-color.svg" alt="" width="16" height="16" className="h-4 w-4" />
            </span>
            <span className="text-[12.5px] font-medium text-ink">{call.name}</span>
            <span className="text-[12.5px] tabular-nums text-ink/55">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
          </div>

          {/* what she reported and did, beside Dana */}
          <div className="absolute bottom-6 right-6 top-6 hidden w-[330px] lg:block xl:w-[360px]">
          <LiquidGlass className="flex h-full flex-col rounded-[22px] p-4" style={{ '--lg-tint-a': 'rgba(255,252,247,0.88)', '--lg-tint-b': 'rgba(255,249,241,0.8)' }}>
            <p className="px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">{d.team}</p>
            <ul className="mt-3 grid gap-2">
              {items.map((note, i) => {
                const done = reached >= i + 1;
                return (
                  <li key={note.at} className={cn('flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[13.5px] transition-all duration-500', done ? 'bg-white text-ink shadow-[0_1px_3px_rgba(10,15,14,0.08)]' : 'bg-white/35 text-ink/45')}>
                    <motion.span initial={false} animate={{ scale: done ? 1 : 0.85 }} transition={{ duration: 0.3, ease: EASE }} className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', done ? 'bg-[#14A36B] text-white' : 'bg-ink/10 text-transparent')}>
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                    <span className="min-w-0">{note.text}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-auto px-1 pt-3 text-[12px] leading-snug text-ink/55">{call.sentence}</p>
          </LiquidGlass>
          </div>

          {/* the brief itself, bottom left: play, then the line being spoken, large */}
          <div className="absolute inset-x-0 bottom-0 p-4 xs:p-5 sm:p-7 lg:right-[380px] lg:p-9 xl:right-[410px]">
            {/* on phones and tablets, the latest thing she did, one line at a time */}
            <div className="mb-3 h-8 lg:hidden" aria-hidden="true">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.span key={current.at} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }} className="inline-flex max-w-full items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] text-ink shadow-[0_2px_10px_rgba(10,15,14,0.2)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14A36B] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="truncate">{current.text}</span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="flex items-end gap-4">
              <button
                type="button"
                onClick={play}
                aria-label={status === 'playing' ? c.pause : status === 'paused' ? c.resume : status === 'done' ? c.again : c.listen}
                className={cn(
                  'relative flex shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105',
                  live ? 'h-12 w-12 bg-white/20 backdrop-blur-md' : 'h-14 w-14 bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] shadow-[0_12px_28px_-10px_rgba(242,92,42,0.85)] sm:h-16 sm:w-16'
                )}
              >
                {status === 'idle' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/40" /> : null}
                {status === 'playing' ? <Pause className="relative h-5 w-5 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className="relative ml-1 h-5 w-5 fill-current" strokeWidth={2.2} aria-hidden="true" />}
              </button>
              <div className="min-h-[56px] min-w-0 flex-1 sm:min-h-[64px]">
                {live ? (
                  <>
                    <p className={cn('text-[11px] font-medium uppercase tracking-[0.08em]', cap.who === 'aurora' ? 'text-[#FFB27A]' : 'text-white/70')}>{cap.who === 'aurora' ? 'Aurora' : c.caller}</p>
                    <p className="mt-1 text-[18px] font-medium leading-[1.3] tracking-[-0.01em] text-white [text-shadow:0_1px_12px_rgba(10,15,14,0.45)] sm:text-[22px] lg:text-[26px]" aria-live="off">
                      <span className="sr-only">{cap.text}</span>
                      <span aria-hidden="true">
                        {sub.words.slice(sub.start, sub.end).map((w, j) => {
                          const i = sub.start + j;
                          return (
                            <span key={i} className={cn('transition-opacity duration-200', t >= cap.at + (cap.words[i] || 0) ? 'opacity-100' : 'opacity-30')}>
                              {w}
                              {i < sub.end - 1 ? ' ' : ''}
                            </span>
                          );
                        })}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[18px] font-medium leading-tight tracking-[-0.01em] text-white sm:text-[22px] lg:text-[26px]">{status === 'done' ? c.again : c.listen}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-white/75">
                      <Volume2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                      {c.prompt} · {c.meta}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* the recording, coloured by who is talking */}
            <div className="mt-4 flex h-6 items-center gap-[2px] max-[559px]:hidden sm:mt-5" aria-hidden="true">
              {bars.map((v, i) => {
                const ms = ((i + 0.5) / nb) * c.duration;
                const x = c.captions.find((q) => ms >= q.at - 150 && ms <= q.end + 150);
                const who = x ? x.who : null;
                return (
                  <span
                    key={i}
                    className={cn('min-w-0 flex-1 rounded-full transition-opacity duration-200', who === 'aurora' ? 'bg-[#FF8A3D]' : 'bg-white', played < 0 ? 'opacity-40' : played >= ms ? 'opacity-100' : 'opacity-25')}
                    style={{ height: Math.max(14, v * 100) + '%' }}
                  />
                );
              })}
            </div>
          </div>

          <audio ref={audioRef} src={c.audio} preload="none" onEnded={cc.ended} />
        </div>
        <p className="mt-3 text-[12px] text-slate sm:mt-4">{d.note}</p>

        <p className="sr-only">{c.captions.map((q) => (q.who === 'aurora' ? 'Aurora: ' : c.caller + ': ') + q.text).join(' ')}</p>
      </div>
    </section>
  );
}
