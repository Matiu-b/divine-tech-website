import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Check } from 'lucide-react';
import { EVENT_ICONS } from './eventIcons';
import { industriesSection } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import SectionHeader from './primitives/SectionHeader';
import SmartLink from './primitives/SmartLink';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

const ADVANCE_MS = 5000;
const SIDE_MS = 3200; // each card's chip switches between a customer moment and a team moment
const GAP = 12;

/**
 * Home page: one card per industry, each leading to that industry's page.
 * Three columns on desktop; on phones and tablets a swipe carousel that moves on by itself
 * until the visitor swipes (same behaviour as the outcomes section).
 */
export default function IndustryCards() {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInViewport(track, { threshold: 0.4 });
  const visible = usePageVisible();
  const n = industries.length;
  const [inside, setInside] = useState(false);
  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setInside((v) => !v), SIDE_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const onScroll = () => {
      const w = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : el.clientWidth;
      setActive(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / (w + GAP)))));
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
  }, [n]);

  const go = (i) => {
    const el = track.current;
    const card = el && el.children[i];
    if (card) el.scrollTo({ left: i * (card.getBoundingClientRect().width + GAP), behavior: reduce ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (reduce || touched || !inView || !visible) return undefined;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1023px)').matches) return undefined;
    const id = window.setTimeout(() => go((active + 1) % n), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, touched, inView, visible, reduce, n]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="industries" data-nav-theme="light" aria-labelledby="industries-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="industries-title"
          eyebrow={industriesSection.eyebrow}
          titleA={industriesSection.titleA}
          text={industriesSection.text}
          layout="split"
        />

        <div
          ref={track}
          aria-roledescription="carousel"
          className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] md:mt-12 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
        >
          {industries.map((it, i) => (
            <Reveal key={it.slug} delay={i * 0.08} className="w-[84%] shrink-0 snap-start sm:w-[60%] md:w-[46%] lg:w-auto" aria-roledescription="slide" aria-label={`${i + 1} of ${n}: ${it.label}`}>
              <SmartLink
                href={industryPath(it.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_20px_40px_-28px_rgba(10,15,14,0.35)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(10,15,14,0.1),0_30px_60px_-30px_rgba(10,15,14,0.45)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 lg:aspect-[16/11]">
                  <img
                    src={it.how.photo.src}
                    srcSet={it.how.photo.srcSet}
                    sizes="(min-width: 1024px) 420px, 84vw"
                    alt={it.how.photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                  {it.how.video && !reduce ? (
                    <video src={it.how.video} poster={it.how.photo.src} muted loop autoPlay playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
                  ) : null}
                  {/* one moment out front, then one behind the scenes, in turn */}
                  <div className="absolute inset-x-4 bottom-4">
                    {[false, true].map((side) => {
                      const c = side ? it.cardInside || it.card : it.card;
                      const on = side === inside;
                      return (
                        <span
                          key={String(side)}
                          aria-hidden={on ? undefined : true}
                          className={cn('flex w-fit max-w-full items-center gap-2.5 rounded-[14px] bg-white/90 px-3 py-2.5 text-ink shadow-sm backdrop-blur transition-all duration-500', on ? 'opacity-100' : 'pointer-events-none absolute bottom-0 left-0 translate-y-1 opacity-0')}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-paper-2">
                            {React.createElement(EVENT_ICONS[c.icon] || Check, { className: 'h-3.5 w-3.5', strokeWidth: 1.8, 'aria-hidden': 'true' })}
                          </span>
                          <span className="min-w-0">
                            <span className="mb-0.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-graphite">
                              <span className={cn('h-1.5 w-1.5 rounded-full', side ? 'bg-[#14A36B]' : 'bg-[#F25C2A]')} />
                              {side ? industriesSection.sides.team : industriesSection.sides.customers}
                            </span>
                            <span className="block truncate text-[12.5px] font-medium">{c.title}</span>
                            <span className="block truncate text-[11px] text-graphite">{c.detail}</span>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="t-h4">{it.label}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-graphite">{it.short}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </div>

        {/* pager on phones and tablets: one dot per card, the current one wider (no filling bar) */}
        <div className="mt-5 flex justify-center gap-2 lg:hidden">
          {industries.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              onClick={() => {
                setTouched(true);
                go(i);
              }}
              aria-label={`Show ${it.label}`}
              aria-current={i === active ? 'true' : undefined}
              className="flex h-6 items-center"
            >
              <span className={cn('block h-1.5 rounded-full transition-all duration-500', i === active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25')} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
