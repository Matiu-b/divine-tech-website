import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { outcomes } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import AuroraScreen from './AuroraScreen';

const CLIP_MAX_MS = 10500; // if a clip can't play, the turn still moves on

export default function Outcomes() {
  const items = outcomes.items;
  const track = useRef(null);
  const videos = useRef([]);
  const [active, setActive] = useState(0); // the card in view on phones
  const [playing, setPlaying] = useState(0); // the film whose turn it is
  const [touched, setTouched] = useState(false);
  const [phone, setPhone] = useState(false);
  const [clipT, setClipT] = useState(0); // where the playing film is, in ms
  const reduce = !!useReducedMotion();
  const inView = useInViewport(track, { threshold: 0.4 });
  const visible = usePageVisible();
  const running = inView && visible && !reduce;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Which card is showing (phones only; on desktop the track does not scroll).
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : el.clientWidth;
      setActive(Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / (w + 12)))));
    };
    // Only a real swipe stops the auto-advance: a touch on the track, or a sideways wheel/trackpad gesture.
    const onTouch = () => setTouched(true);
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) setTouched(true);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', onTouch, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('wheel', onWheel);
    };
  }, [items.length]);

  const go = (i) => {
    const el = track.current;
    const card = el && el.children[i];
    if (card) el.scrollTo({ left: i * (card.getBoundingClientRect().width + 12), behavior: reduce ? 'auto' : 'smooth' });
  };

  // on phones the film in view is the one that plays
  useEffect(() => {
    if (phone) setPlaying(active);
  }, [phone, active]);

  // the film whose turn it is plays from the start; the others rest on their first frame
  useEffect(() => {
    setClipT(0);
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (running && i === playing) {
        v.play().catch(() => {});
      } else {
        v.pause();
        if (i !== playing) v.currentTime = 0;
      }
    });
    if (!running) return undefined;
    const id = window.setTimeout(() => next(), CLIP_MAX_MS);
    return () => window.clearTimeout(id);
  }, [running, playing, phone, touched]); // eslint-disable-line react-hooks/exhaustive-deps

  // follow the playing film frame by frame, so what is drawn on its monitor moves smoothly with it
  useEffect(() => {
    if (!running || !items[playing].screen) return undefined;
    let raf = 0;
    const tick = () => {
      const v = videos.current[playing];
      if (v) setClipT(v.currentTime * 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, playing, items]);

  function next() {
    const n = (playing + 1) % items.length;
    if (phone) {
      if (touched) {
        // the visitor chose this card: play it again rather than move them on
        const v = videos.current[playing];
        if (v) {
          v.currentTime = 0;
          v.play().catch(() => {});
        }
        return;
      }
      go(n);
    } else {
      setPlaying(n);
    }
  }

  return (
    <section id="outcomes" data-nav-theme="light" aria-labelledby="outcomes-title" className="section relative !pt-0">
      <div className="shell">
        {/* a rule closes the platform section above, instead of two stacked section paddings */}
        <div aria-hidden="true" className="hairline mb-[clamp(56px,7vw,104px)]" />
        <SectionHeader id="outcomes-title" titleA={outcomes.titleA} text={outcomes.text} layout="split" />

        <div
          ref={track}
          className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
          aria-roledescription="carousel"
        >
          {items.map((o, i) => (
            <article
              key={o.key}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${o.label}`}
              className="w-[86%] shrink-0 snap-start xs:w-[78%] md:w-auto"
            >
              <Reveal delay={i * 0.08} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-[#E7E1D6]">
                  <img src={o.poster} alt={o.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={o.mirror ? { transform: 'scaleX(-1)' } : undefined} />
                  {!reduce ? (
                    <video
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      src={o.video}
                      poster={o.poster}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={o.mirror ? { transform: 'scaleX(-1)' } : undefined}
                      muted
                      playsInline
                      preload={i === 0 ? 'auto' : 'metadata'}
                      onEnded={() => {
                        if (i === playing) next();
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {o.screen ? <AuroraScreen kind={o.screen.kind} quad={o.screen.quad} aspect={o.screen.aspect} p={reduce || !running || i !== playing ? 1 : Math.max(0, Math.min(1, (clipT - o.screen.from) / o.screen.span))} /> : null}
                </div>
                <div className="px-1 pt-5 md:pt-6">
                  <p className={cn('text-[12.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-500', !phone && running && i !== playing ? 'text-brand-ink/50' : 'text-brand-ink')}>{o.label}</p>
                  <h3 className="mt-2 text-[21px] font-normal leading-[1.2] tracking-[-0.02em] text-ink md:text-[23px]">{o.title}</h3>
                  <p className="mt-2.5 max-w-[32.15em] text-[15px] leading-relaxed text-graphite">{o.text}</p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>

        {/* phone pager: one dot per card */}
        <div className="mt-6 flex justify-center gap-2 md:hidden">
          {items.map((o, i) => (
            <button
              key={o.key}
              type="button"
              onClick={() => {
                setTouched(true);
                go(i);
              }}
              aria-label={`Show ${o.label}`}
              aria-current={i === active ? 'true' : undefined}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={cn('block h-2 rounded-full transition-all duration-300', i === active ? 'w-5 bg-ink' : 'w-2 bg-ink/20')} />
            </button>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 border-t border-ink/10 pt-6 text-[15px] text-graphite md:mt-14">{outcomes.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
