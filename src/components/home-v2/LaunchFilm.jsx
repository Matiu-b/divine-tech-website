import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { launchFilm } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport } from './hooks';

/** Event the hero's "See it in action" button sends to start the film. */
export const PLAY_FILM_EVENT = 'dt:play-film';

/**
 * Home launch film, right under the hero. The <video> is in the prerendered HTML with preload="none",
 * so nothing downloads until the visitor presses play; a poster image and a play button sit on top.
 * Pressing play (here or on the hero button) starts it with sound in the same click, then native
 * controls take over. It pauses when scrolled out of view.
 */
export default function LaunchFilm() {
  const section = useRef(null);
  const video = useRef(null);
  const [started, setStarted] = useState(false);
  const inView = useInViewport(section, { threshold: 0.25 });

  const play = () => {
    const v = video.current;
    if (!v) return;
    setStarted(true);
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'film_play', film_name: 'aurora_launch' });
    }
  };

  useEffect(() => {
    const onPlay = () => play();
    window.addEventListener(PLAY_FILM_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_FILM_EVENT, onPlay);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (started && !inView && v && !v.paused) v.pause();
  }, [inView, started]);

  return (
    <section id="film" ref={section} data-nav-theme="light" aria-labelledby="film-title" className="section relative">
      <div className="shell">
        <SectionHeader id="film-title" titleA={launchFilm.titleA} titleB={launchFilm.titleB} text={launchFilm.text} layout="center" />
        <Reveal delay={0.1}>
          <figure className="relative mx-auto mt-10 aspect-video w-full max-w-[1120px] overflow-hidden rounded-[22px] bg-[#F6F5F1] shadow-[0_1px_2px_rgba(10,15,14,0.06),0_30px_70px_-30px_rgba(178,60,20,0.35)] ring-1 ring-black/5 md:mt-14 md:rounded-[28px]">
            <video
              ref={video}
              src={launchFilm.video}
              preload="none"
              playsInline
              controls={started}
              onEnded={() => setStarted(false)}
              className="absolute inset-0 h-full w-full"
              aria-label={launchFilm.alt}
            />
            {!started && (
              <button
                type="button"
                onClick={play}
                className="group absolute inset-0 block h-full w-full cursor-pointer text-left"
                aria-label={launchFilm.label + ', ' + launchFilm.duration}
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
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex items-center gap-3 rounded-full bg-ink py-2.5 pl-2.5 pr-5 text-white shadow-[0_16px_40px_-14px_rgba(10,15,14,0.55)] transition-transform duration-300 group-hover:scale-[1.04] md:gap-4 md:py-3 md:pl-3 md:pr-7">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink md:h-12 md:w-12">
                      <Play className="ml-[2px] h-4 w-4 fill-current md:h-5 md:w-5" strokeWidth={0} aria-hidden="true" />
                    </span>
                    <span className="text-[15px] font-medium md:text-[17px]">
                      {launchFilm.label}
                      <span className="ml-2 font-normal text-white/60">{launchFilm.duration}</span>
                    </span>
                  </span>
                </span>
              </button>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
