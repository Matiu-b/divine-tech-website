import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, CalendarCheck, Check, ChevronLeft, CircleDollarSign, Database, Hand, MessageCircle, Pause, Play, Scale, Volume2, Send, Clock, House } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { RevealGroup, RevealItem, RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { onAnchorClick, useInViewport, useMediaQuery, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';

/*
 * Real estate page, v3. One message per section, in this order:
 * the promise and a real call (hero) -> the race, seen on the buyer's phone for every lead -> your rules. Sections the home and platform pages already tell are left out.
 * Everything sits on the site's warm light ground; the motion is the product at work.
 */

const EASE = [0.22, 1, 0.36, 1];

const clock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};

/**
 * The call's clock. Nothing plays until the visitor presses play: then the recording starts from the top and the
 * captions follow it, so every word appears as it is spoken. If the audio can't play, the captions run on their own.
 * status: idle (not started) -> playing <-> paused -> done (finished; play again starts over).
 */
function useCallClock(c, { audioRef }) {
  const [status, setStatus] = useState('idle');
  const [t, setT] = useState(0);
  const now = useRef(0);
  const silent = useRef(false);

  useEffect(() => {
    if (status !== 'playing') return undefined;
    let raf = 0;
    let last = performance.now();
    let shown = now.current;
    const tick = (stamp) => {
      const a = audioRef.current;
      let v = now.current;
      if (!silent.current && a) v = a.currentTime * 1000;
      else v += Math.max(0, stamp - last);
      last = Math.max(last, stamp);
      now.current = v;
      if (silent.current && v >= c.duration) {
        now.current = c.duration;
        setT(c.duration);
        setStatus('done');
        return;
      }
      // ~20 updates a second is plenty for word timing and keeps React work small
      if (Math.abs(v - shown) >= 50 || v < shown) {
        shown = v;
        setT(v);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, c.duration, audioRef]);

  const play = () => {
    const a = audioRef.current;
    if (status === 'playing') {
      if (a) a.pause();
      setStatus('paused');
      return;
    }
    if (status !== 'paused') {
      // a new listen always starts from the top
      now.current = 0;
      setT(0);
      if (a) a.currentTime = 0;
    }
    silent.current = !a;
    if (a)
      a.play().catch(() => {
        silent.current = true;
      });
    setStatus('playing');
  };
  const ended = () => {
    now.current = c.duration;
    setT(c.duration);
    setStatus('done');
  };
  return { t, status, play, ended };
}

const lastIndex = (list, t) => {
  let k = 0;
  list.forEach((x, i) => {
    if (t >= x.at) k = i;
  });
  return k;
};

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
          under a tall block of text), so the header sits above a 4:3 photo.
        */}
        <div
          className={cn(
            'relative flex flex-col min-[560px]:overflow-hidden min-[560px]:rounded-[28px] min-[560px]:shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)]',
            'min-[560px]:bg-[linear-gradient(180deg,rgba(22,34,72,0.45),rgba(22,34,72,0)_220px),linear-gradient(90deg,#396299,#4e72aa_20%,#4e6ea8_40%,#536ea7_60%,#6371a8_80%,#737aac)]',
            'lg:h-[clamp(600px,calc(100svh_-_var(--nav-h)_-_40px),860px)]'
          )}
        >
          {/* a soft shade under the header and along the bottom edge */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(180deg,rgba(16,22,46,0.38)_0%,rgba(16,22,46,0)_42%,rgba(16,22,46,0)_72%,rgba(16,22,46,0.3)_100%)] min-[560px]:block" />
          <div className="relative z-[2] min-[560px]:px-7 min-[560px]:pt-7 sm:px-8 sm:pt-8 lg:pr-[calc(var(--card-w)_+_72px)] lg:[@media(max-height:760px)]:pt-6">{header}</div>

          {/* the photo: from 560 px its tree line meets the header and its top edge fades into the sky */}
          <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-[24px] bg-[#2B3550] shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)] min-[560px]:mt-0 min-[560px]:aspect-auto min-[560px]:h-[46.71cqw] min-[560px]:overflow-visible min-[560px]:rounded-none min-[560px]:bg-transparent min-[560px]:shadow-none lg:h-auto lg:flex-1">
            <img
              src={f.image ? f.image.src : f.poster}
              srcSet={f.image ? f.image.srcSet : undefined}
              sizes="(min-width: 1440px) 1376px, 100vw"
              alt={f.video ? '' : f.alt}
              className="absolute inset-0 h-full w-full object-cover object-[30%_50%] motion-safe:animate-[intro-fade_0.9s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] min-[560px]:inset-auto min-[560px]:left-0 min-[560px]:top-[-9.16cqw] min-[560px]:h-[calc(100%_+_9.16cqw)] min-[560px]:min-h-[55.87cqw] min-[560px]:object-[30%_0%] min-[560px]:[mask-image:linear-gradient(to_bottom,transparent,#000_7%)]"
              decoding="async"
              fetchpriority="high"
            />
            {wantVideo && f.video ? (
              <video ref={videoRef} src={f.video} poster={f.poster} muted loop playsInline preload="auto" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[30%_50%] motion-safe:animate-[intro-fade_0.9s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] min-[560px]:inset-auto min-[560px]:left-0 min-[560px]:top-[-9.16cqw] min-[560px]:h-[calc(100%_+_9.16cqw)] min-[560px]:min-h-[55.87cqw] min-[560px]:object-[30%_0%] min-[560px]:[mask-image:linear-gradient(to_bottom,transparent,#000_7%)]" />
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

      <div className="mt-4 flex flex-col gap-2 px-1 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-[12px] text-slate">{c.note}</p>
        <details className="group text-[13px] text-graphite sm:max-w-[560px]">
          <summary className="cursor-pointer list-none font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink sm:text-right">{c.transcriptLabel}</summary>
          <ol className="mt-3 grid gap-2">
            {c.captions.map((x, i) => (
              <li key={i}>
                <span className={cn('font-medium', x.who === 'aurora' ? 'text-[#B4471A]' : 'text-ink')}>{x.who === 'aurora' ? 'Aurora' : c.caller}:</span> {x.text}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}

/** Hero: Aurora takes a buyer's call at night. On laptops the promise sits in the photo's sky, the call card beside it. */
export function RxHero({ it }) {
  const h = it.v3.hero;
  const { open } = useLead();

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="rx-hero-title" className="relative overflow-hidden pb-[clamp(56px,7vw,104px)] pt-[calc(var(--nav-h)+36px)] min-[560px]:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <CallStage
          h={h}
          header={
            // phones: above the photo; from 560 px in its evening sky (full width on tablets, left of the call card on laptops)
            <div>
              <div>
                <p className="intro-rise eyebrow min-[560px]:text-white/75">{h.eyebrow}</p>
                <h1 id="rx-hero-title" className="t-display balance mt-5 min-[560px]:mt-3 min-[560px]:text-white min-[560px]:[text-shadow:0_2px_24px_rgba(10,16,40,0.35)] lg:text-[clamp(2.2rem,0.4rem+2.7vw,3.4rem)] lg:[@media(max-height:760px)]:mt-2">
                  <RevealLines lines={[h.titleA, h.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
                </h1>
              </div>
              <div className="mt-6 min-[560px]:mt-4 lg:[@media(max-height:760px)]:mt-3">
                <p className="intro-slide t-lead pretty max-w-[36em] min-[560px]:!text-white/[0.88] lg:text-[15.5px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
                  {h.text}
                </p>
                <div className="intro-slide mt-6 flex flex-wrap items-center gap-2 min-[560px]:mt-5 min-[560px]:gap-2.5 sm:gap-3 lg:[@media(max-height:760px)]:mt-4" style={{ animationDelay: '0.42s' }}>
                  <CTAButton size="lg" onClick={open} className="max-sm:h-12 max-sm:px-3.5 max-sm:text-[14px] max-sm:[&_.btn-arrow]:hidden lg:h-12 lg:px-5 lg:text-[15px] lg:[@media(max-height:760px)]:h-11">
                    Book a demo
                  </CTAButton>
                  <CTAButton size="lg" variant="glass" href="#race" arrow={false} onClick={(e) => onAnchorClick(e, '#race')} className="max-sm:h-12 max-sm:px-3.5 max-sm:text-[14px] max-sm:[&_.btn-arrow]:hidden lg:h-12 lg:px-5 lg:text-[15px] lg:[@media(max-height:760px)]:h-11">
                    Why speed wins
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

/*
 * The buyer's evening, as a timeline built from the script (ms). She opens three listings and
 * messages each listing agent: no one answers. The fourth listing belongs to a brokerage that runs
 * Aurora, which answers in seconds while its CRM fills in. She reads and types at a person's pace;
 * Aurora replies quickly.
 */
const typeMs = (text, min = 600, max = 1600) => Math.min(max, Math.max(min, text.length * 34));

// Her first message to the brokerage with Aurora lands at exactly this moment: the clip of her on the
// sofa runs until then, and the CRM opens with the new lead.
const RACE_INTRO_MS = 15000;

function buildRace(p, crm) {
  const screens = [];
  const sends = []; // the agent messages: when each is typed and sent
  let t = 0;
  p.listings.slice(0, 3).forEach((l, i) => {
    screens.push({ id: 'l' + i, kind: 'listing', i, at: t, tap: t + 800 });
    screens.push({ id: 't' + i, kind: 'agent', i, at: t + 1000 });
    const typeAt = t + 1250;
    sends.push({ i, typeAt, sent: typeAt + 1400 });
    t += 3600;
  });
  const stale = t;
  screens.push({ id: 'inbox1', kind: 'inbox', at: t });
  t += 2000;
  const ours = p.listings.length - 1;
  screens.push({ id: 'l3', kind: 'listing', i: ours, at: t, tap: t + 700 });
  const listing4 = t;
  screens.push({ id: 'chat', kind: 'aurora', at: t + 900 });
  // the conversation with Aurora
  const chat = [];
  let c = RACE_INTRO_MS;
  p.chat.forEach((m, k) => {
    if (k === 0) {
      chat.push({ typeAt: RACE_INTRO_MS - 1100, at: RACE_INTRO_MS });
      c = RACE_INTRO_MS + 250;
    } else if (m.who === 'buyer') {
      const prev = p.chat[k - 1];
      const think = Math.min(1700, 800 + (prev ? prev.text.length * 7 : 0));
      const typeAt = c + think;
      const at = typeAt + typeMs(m.text);
      chat.push({ typeAt, at });
      c = at + 250;
    } else {
      const typingAt = c + 400;
      const at = typingAt + (k === 1 ? 2400 : 1000); // the first reply lands about 3 seconds after her message
      chat.push({ typingAt, at });
      c = at;
    }
  });
  const done = c + 2200;
  screens.push({ id: 'inbox2', kind: 'inbox', at: done });
  const end = done + 3800;

  const fill = {};
  p.chat.forEach((m, k) => (m.crm || []).forEach((key) => (fill[key] = chat[k].at)));
  const first = chat[1].at;
  const opened = chat[0].at;
  const qualified = chat[p.chat.findIndex((m) => (m.crm || []).includes('budget'))].at;
  const booked = chat[p.chat.findIndex((m) => m.booked)].at;
  const last = chat[chat.length - 1].at;
  return {
    screens,
    sends,
    stale,
    listing4,
    chat,
    done,
    end,
    fill,
    statusAt: [opened, qualified, booked],
    assigned: last,
    stepAt: [0, stale, listing4, first, booked],
    lucy: sends[1].sent + 600,
    keys: crm.fields.map((f) => f.key),
  };
}

/** What the phone's clock says at time t. */
function clockOf(p, T, t) {
  if (t >= T.done) return '9:52';
  if (t >= T.listing4) {
    const k = T.chat.filter((x) => t >= x.at).length;
    return '9:' + String(47 + Math.floor(k / 2)).padStart(2, '0');
  }
  if (t >= T.stale) return '9:46';
  const s = [...T.sends].reverse().find((x) => t >= x.typeAt - 2000);
  return (s ? p.listings[s.i].time : p.listings[0].time).replace(/ ?[AP]M$/, '');
}

/** A clock for timed scenes: runs while `active`, loops at `end`, and holds the last frame when `still`. */
function useLoop(end, { active, still }) {
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

function Dots({ className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-[3px]', className)} aria-label="typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[5px] w-[5px] animate-blink rounded-full bg-current" style={{ animationDelay: i * 0.18 + 's' }} />
      ))}
    </span>
  );
}

function Avatar({ initials, aurora = false, size = 'h-10 w-10' }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full text-[12.5px] font-medium', size, aurora ? 'bg-ink' : 'bg-[linear-gradient(140deg,#E9E4DA,#D9D2C4)] text-ink/70')}>
      {aurora ? <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="h-1/2 w-1/2" /> : initials}
    </span>
  );
}

/** The inbox: her own threads, the agents she messaged, and at the end Aurora's thread on top. */
function Inbox({ p, T, t, reduce }) {
  const rows = p.personal
    .filter((x) => x.key !== 'lucy' || t >= T.lucy)
    .map((x) => ({ key: x.key, name: x.name, initials: x.initials, preview: x.preview, time: x.time, order: x.order }));
  T.sends.forEach((s) => {
    if (t < s.sent) return;
    const l = p.listings[s.i];
    rows.push({ key: l.key, name: l.agent.name, initials: l.agent.initials, tag: p.agentTag, preview: 'You: ' + l.message, time: l.time, order: l.order, meta: t >= T.stale ? p.noReply : p.delivered });
  });
  if (t >= T.done) {
    const l = p.listings[p.listings.length - 1];
    rows.push({ key: l.key, name: l.agent.name, aurora: true, tag: l.agent.office, done: p.booked, time: '9:52 PM', order: 999 });
  }
  rows.sort((a, b) => b.order - a.order);
  return (
    <div className="px-4 pt-1">
      <p className="text-[26px] font-medium tracking-[-0.02em] text-ink">{p.title}</p>
      <ul className="mt-2">
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.key}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex gap-3 border-b border-ink/[0.07] py-2.5"
            >
              <Avatar initials={r.initials} aurora={r.aurora} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-medium text-ink">{r.name}</span>
                  <span className="shrink-0 text-[11.5px] text-slate">{r.time}</span>
                </span>
                {r.tag ? <span className={cn('block text-[10.5px] font-medium', r.aurora ? 'text-[#B4471A]' : 'text-ink/40')}>{r.tag}</span> : null}
                {r.done ? (
                  <span className="mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#E4F4E8] px-2 py-0.5 text-[11.5px] font-medium text-[#2E7A48]">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
                    {r.done}
                  </span>
                ) : (
                  <span className="block truncate text-[12.5px] leading-snug text-graphite">{r.preview}</span>
                )}
                {r.meta ? <span className={cn('block text-[11px]', r.meta === p.noReply ? 'text-[#B4471A]/80' : 'text-ink/40')}>{r.meta}</span> : null}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/** One listing in the listings app, with the Message agent button she taps. */
function Listing({ p, l, tap, t, reduce }) {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-1">
      <p className="text-[15px] font-medium text-ink">{p.app}</p>
      <div className="mt-3 max-h-[260px] min-h-[120px] flex-1 overflow-hidden rounded-[18px] bg-[#E8E2D8]">
        <img src={l.image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
      <p className="mt-3 text-[22px] font-medium tracking-[-0.02em] text-ink">{l.price}</p>
      <p className="text-[13px] text-graphite">{l.facts}</p>
      <p className="mt-1 text-[13px] font-medium text-ink">{l.address}</p>
      <p className="text-[12px] text-slate">
        {p.listedBy} {l.agent.aurora || l.aurora ? l.agent.name : l.agent.name + ' · ' + l.agent.office}
      </p>
      <span className="relative mt-4 flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-[14px] font-medium text-white">
        {p.cta}
        {t >= tap && !reduce ? (
          <motion.span className="absolute h-24 w-24 rounded-full bg-white/30" initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
        ) : null}
      </span>
    </div>
  );
}

/** The message field at the bottom of a thread; shows her text as she types it. */
function Composer({ p, text, from, to, t }) {
  const typing = text && t >= from && t < to;
  const shown = typing ? text.slice(0, Math.max(1, Math.round(((t - from) / (to - from)) * text.length))) : '';
  return (
    <div className="flex items-end gap-2 border-t border-ink/[0.06] px-3 pb-3 pt-2">
      <span className="min-h-[34px] flex-1 rounded-[18px] border border-ink/[0.12] px-3 py-[7px] text-[13px] leading-[1.4] text-ink">
        {shown ? (
          <>
            {shown}
            <span className="ml-px inline-block h-[14px] w-[1.5px] translate-y-[2px] animate-blink bg-[#0A84FF]" />
          </>
        ) : (
          <span className="text-ink/35">{p.typingField}</span>
        )}
      </span>
      <span className={cn('flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors', shown ? 'bg-[#0A84FF] text-white' : 'bg-ink/[0.08] text-white')}>
        <ArrowUp className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
      </span>
    </div>
  );
}

function Bubble({ m, reduce, note = null }) {
  const mine = m.who === 'buyer';
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn('flex shrink-0 flex-col', mine ? 'items-end' : 'items-start')}
    >
      <span className={cn('max-w-[84%] px-3 py-2 text-[13px] leading-[1.4]', mine ? 'rounded-[18px] rounded-br-[6px] bg-[#0A84FF] text-white' : 'rounded-[18px] rounded-bl-[6px] bg-[#ECEAE5] text-ink')}>
        {m.booked ? (
          <span className="mb-1.5 flex items-center gap-2 rounded-[12px] bg-white px-2.5 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E9A58] text-white">
              <CalendarCheck className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-medium leading-tight text-ink">{m.booked.title}</span>
              <span className="block text-[11.5px] leading-tight text-graphite">{m.booked.detail}</span>
            </span>
          </span>
        ) : null}
        {m.text}
      </span>
      {note}
    </motion.div>
  );
}

function ThreadHeader({ name, sub, initials, aurora }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-3 pb-2.5 pt-1">
      <ChevronLeft className="h-5 w-5 text-[#0A84FF]" strokeWidth={2.2} aria-hidden="true" />
      <Avatar initials={initials} aurora={aurora} size="h-8 w-8" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium leading-tight text-ink">{name}</span>
        <span className={cn('block truncate text-[11px] font-medium', aurora ? 'text-[#B4471A]' : 'text-ink/40')}>{sub}</span>
      </span>
    </div>
  );
}

const MESSAGES = 'flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 pb-2 [mask-image:linear-gradient(to_bottom,transparent,#000_12%)]';

/** Her message to a listing agent: typed, sent, delivered, and then nothing. */
function AgentThread({ p, T, i, t, reduce }) {
  const l = p.listings[i];
  const s = T.sends.find((x) => x.i === i);
  return (
    <div className="flex h-full flex-col">
      <ThreadHeader name={l.agent.name} sub={p.agentTag + ' · ' + l.agent.office} initials={l.agent.initials} />
      <div className={MESSAGES}>
        <AnimatePresence initial={false}>
          {t >= s.sent ? (
            <Bubble key="m" m={{ who: 'buyer', text: l.message }} reduce={reduce} note={t >= s.sent + 500 ? <span className="mt-1 text-[10.5px] text-ink/40">{p.delivered}</span> : null} />
          ) : null}
        </AnimatePresence>
      </div>
      <Composer p={p} text={l.message} from={s.typeAt} to={s.sent - 250} t={t} />
    </div>
  );
}

/** Her conversation with the brokerage that runs Aurora. */
function AuroraThread({ p, T, t, reduce }) {
  const l = p.listings[p.listings.length - 1];
  const shown = p.chat.filter((m, k) => t >= T.chat[k].at);
  const typing = T.chat.some((x) => x.typingAt !== undefined && t >= x.typingAt && t < x.at);
  const next = p.chat.findIndex((m, k) => m.who === 'buyer' && t >= T.chat[k].typeAt && t < T.chat[k].at);
  return (
    <div className="flex h-full flex-col">
      <ThreadHeader name={l.agent.name} sub={l.agent.office} aurora />
      <div className={MESSAGES}>
        <AnimatePresence initial={false}>
          {shown.map((m, k) => (
            <Bubble key={k} m={m} reduce={reduce} note={k === 1 ? <span className="mt-1 text-[10.5px] font-medium text-[#B4471A]">{p.repliedIn}</span> : null} />
          ))}
          {typing ? (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex shrink-0">
              <span className="rounded-[18px] rounded-bl-[6px] bg-[#ECEAE5] px-3.5 py-3 text-ink/45">
                <Dots />
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <Composer p={p} text={next >= 0 ? p.chat[next].text : ''} from={next >= 0 ? T.chat[next].typeAt : 0} to={next >= 0 ? T.chat[next].at : 0} t={t} />
    </div>
  );
}

/** The buyer's phone: each screen pushes in from the right, the way apps and threads open. */
function BuyerPhone({ p, T, t, reduce, children = null }) {
  const active = T.screens.filter((x) => t >= x.at).length - 1;
  const prev = useRef(active);
  const back = active < prev.current; // the loop starting over: jump, don't slide
  useEffect(() => {
    prev.current = active;
  }, [active]);
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[336px] rounded-[46px] min-[400px]:h-[540px] bg-ink p-[9px] shadow-[0_40px_80px_-40px_rgba(60,35,10,0.55)] sm:h-[620px] lg:h-[var(--stage-h)] lg:w-[clamp(272px,calc(var(--stage-h)*0.56),336px)]">
      <div className="relative h-full overflow-hidden rounded-[38px] bg-[#FBFAF7]">
        <div className="relative flex items-center justify-between px-7 pb-1 pt-3 text-[13px] font-medium text-ink">
          <span className="tabular-nums">{clockOf(p, T, t)}</span>
          <span className="absolute left-1/2 top-2.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className="h-2 w-3 rounded-[2px] bg-ink/80" />
            <span className="h-2.5 w-5 rounded-[3px] border border-ink/50 p-[1.5px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-ink/80" />
            </span>
          </span>
        </div>
        <div className="relative h-[calc(100%-36px)]">
          {T.screens.map((sc, k) => {
            const near = Math.abs(k - Math.max(0, active)) <= 1;
            if (!near) return null;
            const x = k < active ? '-28%' : k === active ? '0%' : '104%';
            return (
              <motion.div
                key={sc.id}
                className={cn('absolute inset-0 bg-[#FBFAF7]', k === active && 'shadow-[-12px_0_24px_-16px_rgba(10,15,14,0.25)]')}
                initial={false}
                animate={{ x, opacity: k < active ? 0.4 : 1 }}
                transition={{ duration: reduce || back ? 0 : 0.45, ease: EASE }}
                aria-hidden={k !== active}
              >
                {sc.kind === 'inbox' ? (
                  <Inbox p={p} T={T} t={t} reduce={reduce} />
                ) : sc.kind === 'listing' ? (
                  <Listing p={p} l={p.listings[sc.i]} tap={sc.tap} t={t} reduce={reduce} />
                ) : sc.kind === 'agent' ? (
                  <AgentThread p={p} T={T} i={sc.i} t={t} reduce={reduce} />
                ) : (
                  <AuroraThread p={p} T={T} t={t} reduce={reduce} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}

/** The brokerage's CRM, filling in while Aurora talks. */
function CrmCard({ c, T, t, reduce, compact = false, short = false }) {
  const live = t >= T.statusAt[0];
  // on short laptop screens the card gets less room: tighter rows, still one field per line
  const tight = !compact && short;
  const status = c.status[lastIndex(T.statusAt.map((at) => ({ at })), t)];
  return (
    <div className={cn('rounded-[22px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)]', compact ? 'p-3.5' : tight ? 'px-4 py-3.5' : 'p-5')}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <Database className="h-4 w-4 text-[#B4471A]" strokeWidth={1.9} aria-hidden="true" />
          {c.title}
        </span>
        {live ? (
          <motion.span
            key={status}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('rounded-full px-2.5 py-0.5 text-[11.5px] font-medium', status === c.status[2] ? 'bg-[#E4F4E8] text-[#2E7A48]' : 'bg-[#FFF1E4] text-[#B4471A]')}
          >
            {status}
          </motion.span>
        ) : (
          <span className="text-[11.5px] text-slate">{c.empty}</span>
        )}
      </div>
      <dl className={cn('grid', compact ? 'mt-3 grid-cols-2 gap-x-3 gap-y-2' : tight ? 'mt-2 gap-1.5' : 'mt-3 gap-2.5')}>
        {c.fields.map((f) => {
          const on = T.fill[f.key] !== undefined && t >= T.fill[f.key];
          return (
            <div key={f.key} className={cn('min-w-0', compact ? '' : cn('flex items-baseline justify-between gap-4 border-b border-ink/[0.06] last:border-0 last:pb-0', tight ? 'pb-1.5' : 'pb-2.5'))}>
              <dt className={cn('shrink-0 text-ink/45', compact ? 'text-[10.5px]' : 'text-[12.5px]')}>{f.label}</dt>
              <dd className={cn('min-w-0 truncate font-medium text-ink', compact ? 'text-[12px]' : tight ? 'text-[13px]' : 'text-[13.5px]')}>
                {on ? (
                  <motion.span
                    key="v"
                    className="-mx-1 rounded-[6px] px-1"
                    initial={reduce ? false : { backgroundColor: 'rgba(255,159,69,0.35)', opacity: 0 }}
                    animate={{ backgroundColor: 'rgba(255,159,69,0)', opacity: 1 }}
                    transition={{ duration: 1.4, ease: EASE }}
                  >
                    {f.value}
                  </motion.span>
                ) : (
                  <span className={cn('inline-block h-2.5 rounded-full bg-ink/[0.07] align-middle', compact ? 'w-16' : 'w-24')} />
                )}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className={cn('flex items-center gap-2 text-ink transition-opacity duration-500', tight ? 'mt-2' : 'mt-3', compact ? 'text-[11.5px]' : 'text-[12.5px]', t >= T.assigned ? 'opacity-100' : 'opacity-0')}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-white">{c.initial}</span>
        {c.assigned}
      </p>
    </div>
  );
}

/**
 * Her evening on the sofa: a clip as long as the scene before her message reaches Aurora's brokerage, kept in step
 * with the phone's clock. Laptops: it hands over to the brokerage's CRM the moment her message lands. Phones and
 * tablets (`small`): the little square keeps playing, looping, to the end of the conversation.
 */
function SofaClip({ film, T, t, reduce, active, small = false }) {
  const ref = useRef(null);
  const loaded = usePageLoaded();
  const intro = t < T.chat[0].at;
  const on = small || intro;
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    if (on && active) {
      // in step with the phone until her message lands (the clip is exactly that long); after that it just loops
      if (intro && Math.abs(v.currentTime - t / 1000) > 0.35) v.currentTime = Math.min(t / 1000, Math.max(0, (v.duration || 15) - 0.05));
      if (v.paused) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  }, [on, intro, active, t, reduce]);
  return (
    <motion.div
      className={cn(
        'absolute inset-0 overflow-hidden bg-[#2A2420]',
        small ? 'rounded-[inherit]' : 'rounded-[24px] shadow-[0_24px_48px_-32px_rgba(90,50,20,0.45)]'
      )}
      initial={false}
      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.97 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
      aria-hidden="true"
    >
      <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" loading="lazy" decoding="async" />
      {loaded && !reduce ? <video ref={ref} src={film.video} poster={film.poster} muted playsInline loop={small} preload="auto" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" /> : null}
    </motion.div>
  );
}

/**
 * Where the evening is: one segment per step, filling as the step plays (like stories). The steps where Aurora is
 * at work fill in her orange.
 */
function StepBars({ steps, T, t, className = '' }) {
  return (
    <div className={cn('flex w-full gap-1.5', className)} aria-hidden="true">
      {steps.map((x, i) => {
        const from = T.stepAt[i];
        const to = i < steps.length - 1 ? T.stepAt[i + 1] : T.end;
        const f = Math.min(1, Math.max(0, (t - from) / Math.max(1, to - from)));
        return (
          <span key={x.title} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink/[0.09]">
            <span
              className={cn('absolute inset-y-0 left-0 rounded-full', i >= 3 ? 'bg-[linear-gradient(90deg,#FF8A3D,#F25C2A)]' : 'bg-ink/80')}
              style={{ width: f * 100 + '%' }}
            />
          </span>
        );
      })}
    </div>
  );
}

const STEP_ICONS = [Send, Clock, House, null, CalendarCheck];

/**
 * Wide screens: the evening as an activity log under the headline, the way a brokerage would read it. Each event has
 * an icon on a line that fills as the event plays; the current one opens with its detail. Aurora's events are orange.
 */
function StepTimeline({ steps, T, t, step, reduce }) {
  return (
    <ol className="grid" aria-live="polite">
      {steps.map((x, i) => {
        const from = T.stepAt[i];
        const to = i < steps.length - 1 ? T.stepAt[i + 1] : T.end;
        const f = Math.min(1, Math.max(0, (t - from) / Math.max(1, to - from)));
        const cur = i === step;
        const past = i < step;
        const aurora = i >= 3;
        const Icon = STEP_ICONS[i];
        const last = i === steps.length - 1;
        return (
          <li key={x.title} className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-3.5" aria-current={cur ? 'step' : undefined}>
            <span aria-hidden="true" className="flex flex-col items-center">
              <span
                className={cn(
                  'relative flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors duration-500',
                  cur || past
                    ? aurora
                      ? 'bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] text-white'
                      : cur
                        ? 'bg-ink text-white'
                        : 'bg-ink/[0.12] text-ink/60'
                    : 'bg-white/70 text-ink/30 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.1)]'
                )}
              >
                {cur && !reduce ? <span className={cn('ring-ping absolute inset-0 rounded-full', aurora ? 'bg-[#F25C2A]/25' : 'bg-ink/15')} /> : null}
                {Icon ? (
                  <Icon className="relative h-[14px] w-[14px]" strokeWidth={2} />
                ) : (
                  <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className={cn('relative h-[14px] w-[14px]', cur || past ? 'brightness-0 invert' : 'opacity-40')} />
                )}
              </span>
              {last ? null : (
                <span className="relative my-1 w-[2px] flex-1 overflow-hidden rounded-full bg-ink/[0.09]">
                  <span className={cn('absolute inset-x-0 top-0 rounded-full', aurora || i === 2 ? 'bg-[linear-gradient(180deg,#FF8A3D,#F25C2A)]' : 'bg-ink/60')} style={{ height: f * 100 + '%' }} />
                </span>
              )}
            </span>
            <div className={cn('min-w-0 pt-[3px]', last ? '' : 'pb-4 [@media(max-height:760px)]:pb-2.5')}>
              <p className={cn('t-data text-[11px] transition-colors duration-500', cur ? (aurora ? 'text-[#D9481C]' : 'text-[#B4471A]') : 'text-ink/35')}>{x.time}</p>
              <p className={cn('mt-0.5 text-[16px] font-medium leading-snug tracking-[-0.01em] transition-colors duration-500', cur ? 'text-ink' : past ? 'text-ink/50' : 'text-ink/30')}>{x.title}</p>
              <AnimatePresence initial={false}>
                {cur ? (
                  <motion.p
                    key="text"
                    className="overflow-hidden text-[14px] leading-snug text-graphite"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="block min-h-[4.125em] pt-1">{x.text}</span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Speed to lead: she messages three listing agents and waits; the brokerage with Aurora answers in seconds. */
export function RxRace({ it }) {
  const r = it.v3.race;
  const T = useMemo(() => buildRace(r.phone, r.crm), [r]);
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const t = useLoop(T.end, { active: inView && visible, still: reduce });
  const step = lastIndex(T.stepAt.map((at) => ({ at })), t);
  const s = r.steps[step];
  // one copy of the clip: beside the step text on phones and tablets, in the stage box on laptops
  const wide = useMediaQuery('(min-width: 1024px)');
  const short = useMediaQuery('(max-height: 760px)');
  const n = String(r.steps.length).padStart(2, '0');

  return (
    <section id="race" data-nav-theme="light" aria-labelledby="rx-race-title" className="section relative">
      <div className="shell">
        {/* wide screens: the headline moves into the canvas, as its left column */}
        <SectionHeader id="rx-race-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} text={r.text} layout="split" className="xl:hidden" />
        <div
          ref={ref}
          className={cn(
            'canvas canvas-grain relative mt-8 grid gap-3 overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-14 md:gap-5 md:p-8',
            'lg:grid-cols-[max(332px,calc(var(--stage-h)_-_176px))_auto] lg:items-center lg:justify-center lg:gap-14 lg:p-8 lg:[--stage-h:clamp(440px,calc(100svh_-_200px),620px)] lg:[@media(max-height:820px)]:py-7',
            'xl:mt-0 xl:grid-cols-[minmax(240px,330px)_minmax(320px,calc(var(--stage-h)_*_0.8))_auto] xl:gap-12 xl:px-12 xl:[--stage-h:clamp(440px,calc(100svh_-_170px),620px)] 2xl:gap-16'
          )}
        >
          <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-[-10%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />

          {/* wide screens: the section's headline, and the evening as a timeline under it; centred as one group */}
          <div className="relative hidden xl:flex xl:flex-col xl:justify-center xl:gap-10 xl:self-stretch [@media(max-height:760px)]:xl:gap-7">
            <div>
              <h2 className="balance text-[clamp(31px,2.55vw,40px)] font-medium leading-[1.08] tracking-[-0.022em] text-ink [@media(max-height:760px)]:text-[30px]">
                {r.titleA} {r.titleB}
              </h2>
              <p className="pretty mt-4 max-w-[30em] text-[15.5px] leading-[1.6] text-graphite [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:text-[14.5px] [@media(max-height:760px)]:leading-[1.5]">{r.text}</p>
            </div>
            {/* a fixed height for the timeline, so the group stays put while steps open and close */}
            <div className="min-h-[330px] [@media(max-height:760px)]:min-h-[280px]">
              <StepTimeline steps={r.steps} T={T} t={t} step={step} reduce={reduce} />
            </div>
          </div>

          {/* the step and, on laptops, the stage box: her clip, then the brokerage's CRM once her message lands. From 1280 px the box alone, as tall as the phone */}
          <div className="relative lg:flex lg:flex-col lg:self-stretch">
            {wide ? (
              // 1024 to 1279: the step above the stage box (wider screens show it as the timeline on the left)
              <div aria-live="polite" className="xl:hidden">
                <StepBars steps={r.steps} T={T} t={t} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="mt-3.5 min-h-[112px]" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
                    <p className="flex items-center justify-between text-[12px]">
                      <span className="t-data text-[#B4471A]">{s.time}</span>
                      <span className="t-data tabular-nums text-ink/35">
                        {String(step + 1).padStart(2, '0')} / {n}
                      </span>
                    </p>
                    <p className="balance mt-1.5 text-[22px] font-medium leading-tight tracking-[-0.015em] text-ink xl:text-[24px]">{s.title}</p>
                    <p className="pretty mt-1 text-[15px] leading-snug text-graphite">{s.text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              // phones and tablets: the step, with her clip as a square on the right that runs down over the
              // phone's top corner. Floats let the first lines use the full width and wrap around the square.
              <>
                <StepBars steps={r.steps} T={T} t={t} className="mx-auto max-w-[352px]" />
                <div className="relative mx-auto mt-4 min-h-[124px] w-full max-w-[352px] [display:flow-root] min-[360px]:min-h-[136px]">
                  <div aria-hidden="true" className="float-right h-[48px] w-0 min-[360px]:h-[54px]" />
                  <div className="relative z-[3] float-right clear-right -mb-[38px] ml-3 h-[108px] w-[108px] overflow-hidden rounded-[20px] shadow-[0_0_0_3px_#FBFAF7,0_18px_36px_-12px_rgba(40,25,10,0.5)] min-[360px]:-mb-[44px] min-[360px]:h-[124px] min-[360px]:w-[124px] min-[400px]:h-[132px] min-[400px]:w-[132px]">
                    <SofaClip film={r.film} T={T} t={t} reduce={reduce} active={inView && visible} small />
                  </div>
                  <div aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: EASE }}>
                        <p className="t-data text-[12px] text-[#B4471A]">{s.time}</p>
                        <p className="mt-1 text-[17px] font-medium leading-tight tracking-[-0.015em] text-ink min-[400px]:text-[18px]">{s.title}</p>
                        <p className="mt-1 text-[13.5px] leading-snug text-graphite min-[400px]:text-[14px]">{s.text}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
            <div className="relative mt-5 hidden min-h-[300px] lg:block lg:h-[max(332px,calc(var(--stage-h)_-_176px))] lg:w-full xl:mt-0 xl:h-auto xl:flex-1">
              {wide ? <SofaClip film={r.film} T={T} t={t} reduce={reduce} active={inView && visible} /> : null}
              <AnimatePresence initial={false}>
                {t >= T.chat[0].at ? (
                  <motion.div
                    key="crm"
                    className="absolute inset-0 flex items-start xl:items-center"
                    initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <div className="w-full">
                      <CrmCard c={r.crm} T={T} t={t} reduce={reduce} short={short} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative">
            <BuyerPhone p={r.phone} T={T} t={t} reduce={reduce} />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{r.note}</p>
      </div>
    </section>
  );
}

const RULE_ICONS = { price: CircleDollarSign, fair: Scale, consent: MessageCircle, handoff: Hand };

/** Your rules: four short guarantees, specific to real estate. */
export function RxRules({ it }) {
  const r = it.v3.rules;
  return (
    <section data-nav-theme="light" aria-labelledby="rx-rules-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="rx-rules-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} layout="split" />
        <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-4" amount={0.2}>
          {r.items.map((x) => {
            const Icon = RULE_ICONS[x.icon] || Scale;
            return (
              <RevealItem key={x.title} as="article" className="flex gap-3.5 rounded-[22px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] sm:block sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[linear-gradient(140deg,#FFF1E6,#FFE3C4)] text-[#D9481C]">
                  <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink sm:mt-4 sm:text-[16px]">{x.title}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-graphite sm:text-[14px]">{x.text}</span>
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
