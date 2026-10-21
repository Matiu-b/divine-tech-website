import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Check, Pause, Play, Volume2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import { RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { onAnchorClick, useInViewport, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';
import { useNavigate } from 'react-router-dom';
import { clock, lastIndex, useCallClock } from '@/components/home-v2/CallBox';
import { EASE } from '@/components/home-v2/motion';

/*
 * The parts the real estate and wellness pages share: the hero with a recorded call (RxHero), the scene clock
 * (useLoop) and the line under the FAQ (RxFaqMore). Kept apart from RealEstateV3.jsx so the wellness page
 * does not load the rest of the real estate page.
 */

/** One caption: every word is laid out from the start and lights up when it is spoken. */
function Caption({ cap, t, dim, c }) {
  const mine = cap.who === 'aurora';
  const words = cap.text.split(' ');
  return (
    <div className={cn('transition-opacity duration-500', dim ? 'opacity-45' : 'opacity-100')}>
      <p className={cn('text-[10.5px] font-medium uppercase tracking-[0.07em]', mine ? 'text-[#B4471A]' : 'text-slate')}>{mine ? 'Aurora' : c.caller}</p>
      <p className="mt-0.5 text-[14.5px] leading-[1.42] tracking-[-0.005em] text-ink sm:text-[15px] md:text-[16px] xl:text-[17px]">
        <span className="sr-only">{cap.text}</span>
        <span aria-hidden="true">
          {words.map((w, i) => (
            <span key={i} className={cn('transition-opacity duration-200', t >= cap.at + (cap.words[i] || 0) ? 'opacity-100' : 'opacity-[0.14]')}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}

function Wave({ who }) {
  const n = 28;
  return (
    <span className={cn('flex h-6 items-center gap-[2px]', who ? 'wave-on' : '')} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const env = Math.sin(((i + 0.5) / n) * Math.PI);
        return (
          <span
            key={i}
            className={cn('wave-bar w-[2px] rounded-full', who === 'aurora' ? 'bg-[#F25C2A]' : who ? 'bg-ink/70' : 'bg-ink/20', (i < 6 || i >= 22) && 'max-sm:hidden lg:hidden', (i < 9 || i >= 19) && 'max-[400px]:hidden')}
            style={/** @type {any} */ ({ height: 8 + env * 16 * (0.5 + r * 0.5) + 'px', '--d': (0.6 + r * 0.7).toFixed(2) + 's', '--dl': (-r * 1.3).toFixed(2) + 's' })}
          />
        );
      })}
    </span>
  );
}

/** What Aurora writes down while she talks: one glass chip per note, as it happens. */
function Note({ n, reduce }) {
  return (
    <LiquidGlass
      as={motion.div}
      initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex items-center gap-2.5 rounded-[14px] px-3 py-2"
      style={{ '--lg-tint-a': 'rgba(255,252,247,0.86)', '--lg-tint-b': 'rgba(255,248,236,0.7)' }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E9A58] text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-medium leading-tight text-ink">{n.title}</span>
        <span className="block truncate text-[11.5px] leading-tight text-graphite">{n.detail}</span>
      </span>
    </LiquidGlass>
  );
}

/**
 * The stage: the listing, and a buyer's call about it as live captions. Takes a still image or a muted clip.
 * Phones and tablets: the header sits above the photo and the call under it. Laptops and up: one frame as tall
 * as the screen allows, the header in the evening sky above the house, the call card over the field on the right.
 */
function CallStage({ h, header }) {
  const c = h.call;
  const f = h.film;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const loaded = usePageLoaded();
  const { t, status, play, ended } = useCallClock(c, { audioRef });
  const live = status === 'playing' || status === 'paused';

  // the clip loads after the page itself, and only plays while it can be seen
  const wantVideo = loaded && !reduce;
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !wantVideo) return;
    v.playbackRate = 0.85;
    if (inView && visible) v.play().catch(() => {});
    else v.pause();
  }, [wantVideo, inView, visible]);

  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const prev = k > 0 ? c.captions[k - 1] : null;
  const speaking = status === 'playing' && t >= cap.at && t <= cap.end + 150 ? cap.who : null;
  const stage = status === 'idle' ? -1 : lastIndex(c.stages, t);
  const notes = status === 'idle' ? [] : c.notes.filter((n) => t >= n.at);
  const latest = notes[notes.length - 1];

  return (
    <div ref={ref} className="relative">
      <div className="relative [container-type:inline-size] lg:[--card-w:400px] xl:[--card-w:460px] 2xl:[--card-w:500px]">
        {/*
          The frame, from 560 px (small tablets) up: the header sits in the photo's evening sky, whose colours continue
          upward behind it. Tablets: header, then the whole photo at its own shape. Laptops: as tall as the screen allows,
          the header on the left, the call card on the right. Phones: there isn't room (the house would shrink to a strip
          under a tall block of text), so the header sits above a 3:2 photo.
        */}
        <div
          className={cn(
            'relative flex flex-col min-[560px]:overflow-hidden min-[560px]:rounded-[28px] min-[560px]:shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)]',
            f.sky ? '' : 'min-[560px]:bg-[linear-gradient(180deg,rgba(22,34,72,0.45),rgba(22,34,72,0)_220px),linear-gradient(90deg,#396299,#4e72aa_20%,#4e6ea8_40%,#536ea7_60%,#6371a8_80%,#737aac)]',
            'lg:h-[clamp(600px,calc(100svh_-_var(--nav-h)_-_40px),860px)]'
          )}
          style={f.sky ? /** @type {any} */ ({ '--sky': f.sky }) : undefined}
        >
          {f.sky ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden [background:var(--sky)] min-[560px]:block" /> : null}
          {/* a soft shade under the header and along the bottom edge */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(180deg,rgba(16,22,46,0.38)_0%,rgba(16,22,46,0)_42%,rgba(16,22,46,0)_72%,rgba(16,22,46,0.3)_100%)] min-[560px]:block" />
          <div className="relative z-[2] min-[560px]:px-7 min-[560px]:pt-7 sm:px-8 sm:pt-8 lg:pr-[calc(var(--card-w)_+_72px)] lg:[@media(max-height:760px)]:pt-6">{header}</div>

          {/* the photo: from 560 px its tree line meets the header and its top edge fades into the sky */}
          <div className="relative mt-5 aspect-[3/2] overflow-hidden rounded-[24px] bg-[#2B3550] shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)] min-[560px]:mt-0 min-[560px]:aspect-auto min-[560px]:h-[46.71cqw] min-[560px]:overflow-visible min-[560px]:rounded-none min-[560px]:bg-transparent min-[560px]:shadow-none lg:h-auto lg:flex-1">
            <img
              src={f.image ? f.image.src : f.poster}
              srcSet={f.image ? f.image.srcSet : undefined}
              sizes="(min-width: 1440px) 1376px, 100vw"
              alt={f.video ? '' : f.alt}
              className="absolute inset-0 h-full w-full object-cover object-[30%_50%] motion-safe:animate-[intro-fade_0.9s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] min-[560px]:inset-auto min-[560px]:left-0 min-[560px]:top-[-9.16cqw] min-[560px]:h-[calc(100%_+_9.16cqw)] min-[560px]:min-h-[55.87cqw] min-[560px]:object-[30%_0%] min-[560px]:[mask-image:linear-gradient(to_bottom,transparent,#000_7%)]"
              style={f.mirror ? { transform: 'scaleX(-1)' } : undefined}
              decoding="async"
              fetchPriority="high"
            />
            {wantVideo && f.video ? (
              <video ref={videoRef} src={f.video} poster={f.poster} muted loop playsInline preload="auto" aria-hidden="true" style={f.mirror ? { transform: 'scaleX(-1)' } : undefined} className="absolute inset-0 h-full w-full object-cover object-[30%_50%] motion-safe:animate-[intro-fade_0.9s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] min-[560px]:inset-auto min-[560px]:left-0 min-[560px]:top-[-9.16cqw] min-[560px]:h-[calc(100%_+_9.16cqw)] min-[560px]:min-h-[55.87cqw] min-[560px]:object-[30%_0%] min-[560px]:[mask-image:linear-gradient(to_bottom,transparent,#000_7%)]" />
            ) : null}
            {f.video ? <span className="sr-only">{f.alt}</span> : null}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,40,0.25)_0%,rgba(20,24,40,0)_30%,rgba(20,24,40,0)_60%,rgba(20,24,40,0.35)_100%)] min-[560px]:hidden" />
            <audio ref={audioRef} src={c.audio} preload="none" onEnded={ended} />
          </div>
        </div>

        {/* The call: over the photo's bottom edge on phones; on tablets over the road and sidewalk, up to just below the For Sale sign; on laptops the right-hand column of the frame, from the top */}
        <LiquidGlass
          className="relative z-[3] mx-3 -mt-10 rounded-[22px] p-3.5 min-[560px]:mx-5 min-[560px]:-mt-[14cqw] sm:mx-6 sm:p-5 lg:absolute lg:right-8 lg:top-8 lg:mx-0 lg:mt-0 lg:w-[var(--card-w)] lg:rounded-[26px] xl:p-6"
          style={{ '--lg-tint-a': 'rgba(255,252,247,0.9)', '--lg-tint-b': 'rgba(255,249,241,0.82)' }}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
              {speaking === 'aurora' ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/25" /> : null}
              <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="relative h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium leading-tight text-ink xl:text-[15px]">{c.title}</span>
              <span className="block truncate text-[12px] text-slate xl:text-[12.5px]">
                {c.listing} · <span className="tabular-nums">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
              </span>
            </span>
            {live ? <Wave who={reduce ? null : speaking} /> : null}
            {live ? (
              <button
                type="button"
                onClick={play}
                aria-label={status === 'playing' ? c.pause : c.resume}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-[#1D2625]"
              >
                {status === 'playing' ? <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={2.2} aria-hidden="true" />}
              </button>
            ) : null}
          </div>

          <div
            className={cn(
              'relative mt-3 grid h-[128px] overflow-hidden sm:mt-4 sm:h-[156px] lg:h-[150px] xl:mt-5 xl:h-[190px]',
              live ? 'content-end gap-2.5 [mask-image:linear-gradient(to_bottom,transparent,#000_22%)] sm:gap-3' : 'items-center'
            )}
          >
            {live ? (
              <>
                {prev ? <Caption key={k - 1} cap={prev} t={t} dim c={c} /> : null}
                <Caption key={k} cap={cap} t={t} c={c} />
              </>
            ) : (
              // the call waits for the visitor: one large play button, so it is clear it has to be pressed
              <button type="button" onClick={play} className="group flex w-full items-center gap-4 rounded-[18px] text-left sm:gap-5">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] text-white shadow-[0_12px_28px_-10px_rgba(242,92,42,0.75)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 xl:h-[72px] xl:w-[72px]">
                  {reduce ? null : <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" />}
                  <Play className="relative ml-1 h-6 w-6 fill-current xl:h-7 xl:w-7" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[19px] xl:text-[21px]">{status === 'done' ? c.again : c.listen}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-graphite sm:text-[14px]">{c.prompt}</span>
                  <span className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#B4471A]">
                    <Volume2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                    {c.sound} · <span className="tabular-nums">{clock(c.duration)}</span>
                  </span>
                </span>
              </button>
            )}
          </div>

          <ol className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-4 xl:mt-5" aria-label="Where the call is">
            {c.stages.map((s, i) => (
              <li key={s.label} className="min-w-0">
                <span className="block h-1 overflow-hidden rounded-full bg-ink/10">
                  <span
                    className="block h-full rounded-full bg-ink transition-[width] duration-300 ease-linear"
                    style={{
                      width:
                        i < stage ? '100%' : i > stage ? '0%' : Math.min(100, ((t - s.at) / ((i < c.stages.length - 1 ? c.stages[i + 1].at : c.duration) - s.at)) * 100) + '%',
                    }}
                  />
                </span>
                <span className={cn('mt-1.5 block truncate text-[11.5px] font-medium transition-colors', i === stage ? 'text-ink' : i < stage ? 'text-ink/55' : 'text-ink/35')}>{s.label}</span>
              </li>
            ))}
          </ol>

          {/* the latest note Aurora wrote down sits in the card */}
          <div className="mt-2.5 h-[46px] xl:mt-3" aria-live="polite">
            <AnimatePresence initial={false} mode="wait">
              {latest ? (
                <Note key={latest.title} n={latest} reduce={reduce} />
              ) : (
                <motion.p key="none" initial={false} exit={{ opacity: 0 }} className="flex h-full items-center text-[12px] text-slate">
                  {c.waiting}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </LiquidGlass>
      </div>

      <p className="mt-3 px-1 text-[12px] text-slate">{c.note}</p>
    </div>
  );
}

/** Hero: Aurora takes a buyer's call at night. On laptops the promise sits in the photo's sky, the call card beside it. */
export function RxHero({ it }) {
  const h = it.v3.hero;
  const { open } = useLead();

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="rx-hero-title" className="relative overflow-hidden pb-0 pt-[calc(var(--nav-h)+20px)] min-[560px]:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <CallStage
          h={h}
          header={
            // phones: above the photo; from 560 px in its evening sky (full width on tablets, left of the call card on laptops)
            <div>
              <div>
                <p className="intro-rise eyebrow min-[560px]:text-white/75">{h.eyebrow}</p>
                <h1 id="rx-hero-title" className="t-display balance mt-3 min-[560px]:mt-3 min-[560px]:text-white min-[560px]:[text-shadow:0_2px_24px_rgba(10,16,40,0.35)] lg:text-[clamp(2.2rem,0.4rem+2.7vw,3.4rem)] lg:[@media(max-height:760px)]:mt-2">
                  <RevealLines lines={[h.titleA, h.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
                </h1>
              </div>
              <div className="mt-4 min-[560px]:mt-4 lg:[@media(max-height:760px)]:mt-3">
                <p className="intro-slide t-lead pretty max-w-[36em] min-[560px]:!text-white/[0.88] lg:text-[15.5px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
                  {h.textShort ? (
                    <>
                      <span className="sm:hidden">{h.textShort}</span>
                      <span className="max-sm:hidden">{h.text}</span>
                    </>
                  ) : (
                    h.text
                  )}
                </p>
                <div className="intro-slide mt-5 flex flex-wrap items-center gap-2 min-[560px]:mt-5 min-[560px]:gap-2.5 sm:gap-3 lg:[@media(max-height:760px)]:mt-4" style={{ animationDelay: '0.42s' }}>
                  <CTAButton size="lg" onClick={open} className="max-sm:h-12 max-sm:px-3.5 max-sm:text-[14px] max-sm:[&_.btn-arrow]:hidden lg:h-12 lg:px-5 lg:text-[15px] lg:[@media(max-height:760px)]:h-11">
                    Book a demo
                  </CTAButton>
                  <CTAButton size="lg" variant="glass" href={h.more ? h.more.href : '#race'} arrow={false} onClick={(e) => onAnchorClick(e, h.more ? h.more.href : '#race')} className="max-sm:h-12 max-sm:px-3.5 max-sm:text-[14px] max-sm:[&_.btn-arrow]:hidden lg:h-12 lg:px-5 lg:text-[15px] lg:[@media(max-height:760px)]:h-11">
                    {h.more ? h.more.label : 'Why speed wins'}
                  </CTAButton>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}

/** A clock for timed scenes: runs while `active`, loops at `end`, and holds the last frame when `still`. */
export function useLoop(end, { active, still }) {
  const [t, setT] = useState(still ? end : 0);
  const now = useRef(t);
  useEffect(() => {
    if (still) {
      now.current = end;
      setT(end);
      return undefined;
    }
    if (!active) return undefined;
    let raf = 0;
    let last = performance.now();
    let shown = now.current;
    const tick = (stamp) => {
      // a frame's timestamp can be a little older than the moment the loop started: never step backwards
      let v = now.current + Math.max(0, stamp - last);
      last = Math.max(last, stamp);
      if (v > end) v = 0;
      now.current = v;
      if (Math.abs(v - shown) >= 50 || v < shown) {
        shown = v;
        setT(v);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, still, end]);
  return t;
}

/** Under the FAQ: the blog guide and the platform page, as links in one line. */
export function RxFaqMore({ m, guide = null }) {
  const navigate = useNavigate();
  const go = (href) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(href);
  };
  const link = 'font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink';
  return (
    <p className="mt-6 text-[14px] leading-relaxed text-graphite">
      {m.text}{' '}
      {guide && m.guide ? (
        <>
          <a href={guide} onClick={go(guide)} className={link}>
            {m.guide}
          </a>{' '}
          {m.join}{' '}
        </>
      ) : null}
      <a href={m.href} onClick={go(m.href)} className={cn('inline-flex items-center gap-1', link)}>
        {m.link}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </a>
    </p>
  );
}
