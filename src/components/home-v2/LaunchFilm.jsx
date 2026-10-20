import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { launchFilm } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

/** Event the hero's "See it in action" button sends to start the film. */
export const PLAY_FILM_EVENT = 'dt:play-film';

function push(data) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

const MARKS = [25, 50, 75, 100];

/**
 * Home launch film, right under the hero.
 * Before play: a 10 s silent teaser loops while the section is on screen (poster only for reduced motion),
 * under a play button and a row of chapter chips. Pressing play, a chapter, or the hero's
 * "See it in action" starts the full film with sound in that same click; native controls take over.
 * Both <video> elements are in the prerendered HTML with preload="none", so nothing downloads early.
 * Analytics: film_view (section seen), film_play (source, start second), film_progress (25/50/75/100 %).
 */
export default function LaunchFilm() {
  const section = useRef(null);
  const teaser = useRef(null);
  const video = useRef(null);
  const marks = useRef(new Set());
  const viewed = useRef(false);
  const [started, setStarted] = useState(false);
  const [now, setNow] = useState(0);
  const reduce = !!useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(section, { threshold: 0.35 });

  const play = (source, at = 0) => {
    const v = video.current;
    if (!v) return;
    setStarted(true);
    const seek = () => {
      try { v.currentTime = at; } catch (e) { /* not seekable yet */ }
    };
    if (at > 0) {
      if (v.readyState >= 1) seek();
      else v.addEventListener('loadedmetadata', seek, { once: true });
    } else if (v.ended) {
      v.currentTime = 0;
    }
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    if (teaser.current) teaser.current.pause();
    push({ event: 'film_play', film_name: 'aurora_launch', film_source: source, film_start: Math.round(at) });
  };

  // the hero button plays the film from the start
  useEffect(() => {
    const onPlay = () => play('hero', 0);
    window.addEventListener(PLAY_FILM_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_FILM_EVENT, onPlay);
  }, []);

  // section seen once: the denominator for the play rate
  useEffect(() => {
    if (inView && !viewed.current) {
      viewed.current = true;
      push({ event: 'film_view', film_name: 'aurora_launch' });
    }
  }, [inView]);

  // teaser loops only while on screen, the page is visible, and the film hasn't started
  useEffect(() => {
    const t = teaser.current;
    if (!t || reduce) return;
    if (inView && visible && !started) {
      t.preload = 'auto';
      const p = t.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      t.pause();
    }
  }, [inView, visible, started, reduce]);

  // the film pauses when scrolled away
  useEffect(() => {
    const v = video.current;
    if (started && !inView && v && !v.paused) v.pause();
  }, [inView, started]);

  const onTime = () => {
    const v = video.current;
    if (!v || !v.duration) return;
    setNow(v.currentTime);
    const pct = (v.currentTime / v.duration) * 100;
    MARKS.forEach((m) => {
      if (pct >= m - (m === 100 ? 1 : 0) && !marks.current.has(m)) {
        marks.current.add(m);
        push({ event: 'film_progress', film_name: 'aurora_launch', film_percent: m });
      }
    });
  };

  const chapters = launchFilm.chapters;
  const current = started ? chapters.reduce((acc, c, i) => (now >= c.t ? i : acc), -1) : -1;

  return (
    <section id="film" ref={section} data-nav-theme="light" aria-labelledby="film-title" className="section relative">
      <div className="shell">
        <SectionHeader id="film-title" titleA={launchFilm.titleA} titleB={launchFilm.titleB} text={launchFilm.text} layout="center" />
        <Reveal delay={0.1}>
          <figure className="relative mx-auto mt-10 aspect-video w-full max-w-[1120px] overflow-hidden rounded-[22px] bg-[#F6F5F1] shadow-[0_1px_2px_rgba(10,15,14,0.06),0_30px_70px_-30px_rgba(178,60,20,0.35)] ring-1 ring-black/5 md:mt-12 md:rounded-[28px]">
            <video
              ref={video}
              src={launchFilm.video}
              preload="none"
              playsInline
              controls={started}
              onTimeUpdate={onTime}
              onEnded={() => setStarted(false)}
              className={cn('absolute inset-0 h-full w-full', !started && 'invisible')}
              aria-label={launchFilm.alt}
            />
            {!started && (
              <button
                type="button"
                onClick={() => play('poster', 0)}
                className="group absolute inset-0 block h-full w-full cursor-pointer text-left"
                aria-label={launchFilm.cta + '. ' + launchFilm.label + ', ' + launchFilm.duration}
              >
                <img
                  src={launchFilm.poster}
                  srcSet={launchFilm.posterSrcSet}
                  sizes="(min-width: 1180px) 1120px, 100vw"
                  alt=""
                  loading="lazy"
                  width="1600"
                  height="900"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <video
                  ref={teaser}
                  src={launchFilm.teaser}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* soft veil so the button reads on any frame */}
                <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,rgba(246,245,241,0.55),rgba(246,245,241,0)_70%)] transition-opacity duration-300 group-hover:opacity-70" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 md:gap-5">
                  <span className="relative flex h-20 w-20 items-center justify-center md:h-28 md:w-28">
                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#F25C2A]/35 motion-safe:animate-ping [animation-duration:2.2s]" />
                    <span className="relative flex h-full w-full items-center justify-center rounded-full bg-ink text-white shadow-[0_18px_44px_-14px_rgba(10,15,14,0.6)] transition-transform duration-300 group-hover:scale-[1.06]">
                      <Play className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" strokeWidth={0} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="rounded-full bg-white/85 px-4 py-2 text-center shadow-[0_8px_24px_-12px_rgba(10,15,14,0.35)] backdrop-blur-md md:px-5 md:py-2.5">
                    <span className="block text-[15px] font-medium text-ink md:text-[18px]">{launchFilm.cta}</span>
                    <span className="mt-0.5 block text-[12px] text-ink/60 md:text-[13px]">
                      {launchFilm.label} · {launchFilm.duration}
                    </span>
                  </span>
                </span>
              </button>
            )}
          </figure>
          {/* chapters: what's inside, and a shortcut to each part */}
          <nav aria-label="Film chapters" className="mx-auto mt-5 max-w-[1120px] md:mt-6">
            <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible">
              {chapters.map((c, i) => (
                <li key={c.label} className="flex-none">
                  <button
                    type="button"
                    onClick={() => play('chapter', c.t)}
                    className={cn(
                      'flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors',
                      current === i ? 'border-ink bg-ink text-white' : 'border-black/10 bg-white/70 text-ink/75 hover:border-black/25 hover:text-ink',
                    )}
                  >
                    <span className={cn('tabular-nums text-[12px]', current === i ? 'text-white/60' : 'text-ink/45')}>
                      {Math.floor(c.t / 60)}:{String(c.t % 60).padStart(2, '0')}
                    </span>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
