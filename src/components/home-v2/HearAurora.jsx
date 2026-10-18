import React, { useEffect, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { Database, Headset, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { homeHear as H } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { CallOverlay, lastIndex, useCallClock } from './CallBox';
import { useInViewport, usePageVisible } from './hooks';

const EASE = [0.22, 1, 0.36, 1];
const TAB_ICON = { customer: Headset, team: Sun };

/**
 * Hear Aurora: two recorded calls, one with a customer and one with the team (the owner's morning brief). Each plays
 * over its own scene in a small glass box that turns into live subtitles; beside it, one line on what happens and what
 * the team sees as the call goes. Switching calls stops the one that is playing. Scenes take a looping clip when there
 * is one, a still until then.
 */
export default function HearAurora() {
  const ref = useRef(null);
  const audioRef = useRef(null);
  const videos = useRef([]);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.15 });
  const visible = usePageVisible();
  const [k, setK] = useState(0);
  const cur = H.calls[k];
  const cc = useCallClock(cur.call, { audioRef });
  const live = cc.status === 'playing' || cc.status === 'paused';

  // a new call starts fresh; leaving the section pauses the one that is playing
  useEffect(() => {
    cc.reset();
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if ((!inView || !visible) && cc.status === 'playing') cc.play();
  }, [inView, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === k && inView && visible && !reduce) v.play().catch(() => {});
      else v.pause();
    });
  }, [k, inView, visible, reduce]);

  const team = live ? cur.call.notes[lastIndex(cur.call.notes, cc.t)].text : cur.team;

  return (
    <section id="hear" data-nav-theme="light" aria-labelledby="hear-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hear-title" titleA={H.titleA} text={H.text} layout="split" />

        <div ref={ref} className="canvas canvas-grain relative mt-8 overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-12 md:p-8 lg:px-10 lg:py-8">
          <div aria-hidden="true" className="pointer-events-none absolute left-[8%] top-[-20%] h-[60%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.4),rgba(255,200,87,0))] blur-2xl" />

          {/* which call: one with a customer, one with the team */}
          <div className="relative flex gap-2" role="tablist" aria-label="Choose a call">
            {H.calls.map((x, i) => {
              const Icon = TAB_ICON[x.key];
              const on = i === k;
              return (
                <button
                  key={x.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setK(i)}
                  className={cn('flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-medium transition-colors', on ? 'bg-ink text-white' : 'bg-white/70 text-ink hover:bg-white')}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {x.tab}
                </button>
              );
            })}
          </div>

          {/* the stage: the scene with the call over it, and beside it what happens */}
          <div className="relative mt-4 grid overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_30px_60px_-40px_rgba(90,50,20,0.45)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E1D4] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[400px]">
              {H.calls.map((x, i) => (
                <React.Fragment key={x.key}>
                  <img
                    src={x.media.poster}
                    srcSet={x.media.srcSet}
                    sizes="(min-width: 1024px) 700px, 100vw"
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', i === k ? 'opacity-100' : 'opacity-0')}
                    style={{ objectPosition: x.media.focus }}
                  />
                  {x.media.video && !reduce ? (
                    <video
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      src={x.media.video}
                      poster={x.media.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', i === k ? 'opacity-100' : 'opacity-0')}
                      style={{ objectPosition: x.media.focus }}
                    />
                  ) : null}
                </React.Fragment>
              ))}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(20,16,12,0),rgba(20,16,12,0.35))]" />
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 sm:right-auto sm:w-[min(400px,calc(100%_-_32px))]">
                <CallOverlay key={cur.key} c={cur.call} clock={cc} reduce={reduce} />
              </div>
              <audio key={cur.key} ref={audioRef} src={cur.call.audio} preload="none" onEnded={cc.ended} />
            </div>

            <div className="relative flex min-w-0 flex-col p-4 xs:p-5 md:p-6 lg:px-7 lg:py-6" aria-live="polite">
              <motion.div key={cur.key} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="text-[20px] font-medium leading-tight tracking-[-0.015em] text-ink md:text-[22px]">{cur.name}</p>
                <p className="pretty mt-2 text-[15px] leading-snug text-ink md:mt-3 md:text-[17px] md:leading-[1.45]">{cur.sentence}</p>
              </motion.div>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-[14px] bg-[#FBF8F3] px-3.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.06)] md:px-4 md:py-3 lg:mt-auto">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45">
                  <Database className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  {H.team}
                </span>
                <span className="min-w-0 text-[13px] font-medium leading-snug text-ink md:text-[14px]">{team}</span>
              </p>
            </div>
          </div>

          {/* both calls in the HTML, for search and screen readers */}
          <div className="sr-only">
            {H.calls.map((x) => (
              <p key={x.key}>
                {x.name}. {x.sentence} {x.call.captions.map((q) => (q.who === 'aurora' ? 'Aurora: ' : x.call.caller + ': ') + q.text).join(' ')}
              </p>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{H.note}</p>
      </div>
    </section>
  );
}
