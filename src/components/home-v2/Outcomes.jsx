import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { outcomes } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';
import ProfitScreen from './ProfitScreen';

const CLIP_MAX_MS = 10500; // if a clip can't play, the turn still moves on

/**
 * What the film is about, said on top of it: small cards that arrive in step with the picture (Aurora's
 * work, a person's work, or a result). The film behind them stays wordless.
 */
function Beats({ beats, t, show, still }) {
  if (!beats) return null;
  return (
    <div className="pointer-events-none absolute bottom-2.5 left-2.5 flex max-w-[86%] flex-col items-start gap-1.5 sm:bottom-3 sm:left-3" aria-hidden="true">
      {beats.map((b) => {
        const on = still || (show && t >= b.at);
        return (
          <span
            key={b.text}
            className={cn(
              'flex max-w-full items-center gap-1.5 rounded-full bg-white/95 py-1 pl-1 pr-2.5 text-[11px] font-medium text-ink shadow-[0_2px_10px_rgba(10,15,14,0.22)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[11.5px]',
              on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            )}
          >
            <span className={cn('flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full', b.who === 'aurora' ? 'bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.08)]' : b.who === 'done' ? 'bg-[#14A36B] text-white' : 'bg-ink/[0.07] text-ink/60')}>
              {b.who === 'aurora' ? <img src="/brand/aurora-symbol-color.svg" alt="" width="11" height="11" className="h-[11px] w-[11px]" /> : b.who === 'done' ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <User className="h-2.5 w-2.5" strokeWidth={2.4} />}
            </span>
            <span className="truncate">{b.text}</span>
          </span>
        );
      })}
    </div>
  );
}

// Savings, efficiency, profitability, each with a short film (no figures until there is pilot data
// behind them). The films take turns: one plays while the others hold their first frame, then the
// next one starts. Three columns on desktop; on phones a swipeable carousel that moves on when the
// film ends, until the visitor swipes.
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
                  <img src={o.poster} alt={o.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  {!reduce ? (
                    <video
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      src={o.video}
                      poster={o.poster}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      playsInline
                      preload={i === 0 ? 'auto' : 'metadata'}
                      onTimeUpdate={(e) => {
                        if (i === playing) setClipT(e.currentTarget.currentTime * 1000);
                      }}
                      onEnded={() => {
                        if (i === playing) next();
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {o.screen ? <ProfitScreen quad={o.screen.quad} aspect={o.screen.aspect} p={reduce || !running || i !== playing ? 1 : Math.max(0, Math.min(1, (clipT - o.screen.from) / o.screen.span))} /> : null}
                  <Beats beats={o.beats} t={i === playing ? clipT : 0} show={running && i === playing} still={reduce} />
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
