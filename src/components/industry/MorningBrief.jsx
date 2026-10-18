import React, { useEffect, useRef } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { Check, Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { clock, lastIndex, subtitle, useCallClock } from '@/components/home-v2/CallBox';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';

const EASE = [0.22, 1, 0.36, 1];

/**
 * The morning brief, in one card: on the left the call itself (a play button, then the line being spoken, large, with
 * the recording's waveform); on the right what Aurora reported and did, ticked off as she says it.
 */
export default function MorningBrief({ d }) {
  const call = d.calls[0];
  const c = call.call;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const cc = useCallClock(c, { audioRef });
  const { t, status, play } = cc;
  const live = status === 'playing' || status === 'paused';

  useEffect(() => {
    if ((!inView || !visible) && status === 'playing') play();
  }, [inView, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const sub = subtitle(cap, t);
  const reached = status === 'idle' ? -1 : status === 'done' ? c.notes.length - 1 : lastIndex(c.notes, t);
  const bars = c.wave.filter((_, i) => i % 2 === 0);
  const nb = bars.length;
  const whoAt = (ms) => {
    const x = c.captions.find((q) => ms >= q.at - 150 && ms <= q.end + 150);
    return x ? x.who : null;
  };
  const played = live || status === 'done' ? t : -1;

  return (
    <section id="hear" data-nav-theme="light" aria-labelledby="hear-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="hear-title"
          titleA={d.titleA}
          text={
            <>
              <span className="sm:hidden">{d.textShort}</span>
              <span className="max-sm:hidden">{d.text}</span>
            </>
          }
          layout="split"
        />

        <div ref={ref} className="canvas canvas-grain relative mt-5 grid overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] sm:mt-8 md:mt-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div aria-hidden="true" className="pointer-events-none absolute left-[6%] top-[-30%] h-[70%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />

          {/* the call */}
          <div className="relative flex flex-col p-5 sm:p-7 lg:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
                <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-tight text-ink">{call.name}</span>
                <span className="block text-[12.5px] text-slate">{c.prompt}</span>
              </span>
              <span className="text-[13px] font-medium tabular-nums text-ink/55">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
            </div>

            <div className="mt-6 flex min-h-[112px] items-start gap-4 sm:min-h-[124px] lg:mt-8">
              <button
                type="button"
                onClick={play}
                aria-label={status === 'playing' ? c.pause : status === 'paused' ? c.resume : status === 'done' ? c.again : c.listen}
                className={cn(
                  'relative flex shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105',
                  live ? 'h-12 w-12 bg-ink' : 'h-16 w-16 bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] shadow-[0_12px_28px_-10px_rgba(242,92,42,0.75)]'
                )}
              >
                {status === 'idle' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" /> : null}
                {status === 'playing' ? <Pause className="relative h-5 w-5 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className="relative ml-1 h-5 w-5 fill-current" strokeWidth={2.2} aria-hidden="true" />}
              </button>
              <div className="min-w-0 flex-1 pt-1">
                {live ? (
                  <>
                    <p className={cn('text-[11px] font-medium uppercase tracking-[0.08em]', cap.who === 'aurora' ? 'text-[#B4471A]' : 'text-slate')}>{cap.who === 'aurora' ? 'Aurora' : c.caller}</p>
                    <p className="mt-1 text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-ink sm:text-[22px]" aria-live="off">
                      <span className="sr-only">{cap.text}</span>
                      <span aria-hidden="true">
                        {sub.words.slice(sub.start, sub.end).map((w, j) => {
                          const i = sub.start + j;
                          return (
                            <span key={i} className={cn('transition-opacity duration-200', t >= cap.at + (cap.words[i] || 0) ? 'opacity-100' : 'opacity-[0.18]')}>
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
                    <p className="text-[19px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[22px]">{status === 'done' ? c.again : c.listen}</p>
                    <p className="mt-2 text-[14px] leading-snug text-graphite sm:text-[15px]">{call.sentence}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-[#B4471A]">
                      <Volume2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                      {c.meta}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* the recording, coloured by who is talking */}
            <div className="mt-auto flex h-8 items-center gap-[2px] pt-6" aria-hidden="true">
              {bars.map((v, i) => {
                const ms = ((i + 0.5) / nb) * c.duration;
                const who = whoAt(ms);
                return (
                  <span
                    key={i}
                    className={cn('min-w-0 flex-1 rounded-full transition-opacity duration-200', who === 'aurora' ? 'bg-[#F25C2A]' : who ? 'bg-ink' : 'bg-ink/30', played < 0 ? 'opacity-45' : played >= ms ? 'opacity-100' : 'opacity-20')}
                    style={{ height: Math.max(14, v * 100) + '%' }}
                  />
                );
              })}
            </div>
          </div>

          {/* what she reported and did, ticked off as she says it */}
          <div className="relative border-t border-ink/[0.06] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45">{d.team}</p>
            <ul className="mt-3 grid gap-2">
              {c.notes.slice(1).map((note, i) => {
                const done = reached >= i + 1;
                return (
                  <li key={note.at} className={cn('flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[13.5px] transition-colors duration-500', done ? 'bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.06)]' : 'bg-white/40 text-ink/45')}>
                    <motion.span initial={false} animate={{ scale: done ? 1 : 0.85 }} transition={{ duration: 0.3, ease: EASE }} className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', done ? 'bg-[#14A36B] text-white' : 'bg-ink/10 text-transparent')}>
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                    <span className="min-w-0">{note.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <audio ref={audioRef} src={c.audio} preload="none" onEnded={cc.ended} />
        </div>
        <p className="mt-4 text-[12px] text-slate">{d.note}</p>

        <p className="sr-only">{c.captions.map((q) => (q.who === 'aurora' ? 'Aurora: ' : c.caller + ': ') + q.text).join(' ')}</p>
      </div>
    </section>
  );
}
