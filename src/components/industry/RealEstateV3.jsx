import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, CalendarCheck, Check, ChevronLeft, ChevronRight, CircleDollarSign, Database, Hand, Pause, Play, Scale, Volume2, Send, Clock, House, BellOff, Hourglass, ShieldCheck, User, ArrowRight, TrendingUp, Heart, MessageSquareText, MessagesSquare, Plus, PhoneOutgoing } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { LeadForm, useLead } from '@/components/home-v2/LeadDrawer';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { onAnchorClick, useInViewport, useMediaQuery, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';
import { useNavigate } from 'react-router-dom';
import { HubSpotMark, PhoneTile, WhatsAppMark } from '@/components/home-v2/BrandMarks';

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
  // play from a given moment (the journey's call jumps to a line when it is clicked)
  const seek = (ms) => {
    const a = audioRef.current;
    now.current = ms;
    setT(ms);
    silent.current = !a;
    if (a) {
      a.currentTime = ms / 1000;
      a.play().catch(() => {
        silent.current = true;
      });
    }
    setStatus('playing');
  };
  // back to the start, without playing (the journey uses it when its call step is left)
  const reset = () => {
    const a = audioRef.current;
    if (a && !a.paused) a.pause();
    now.current = 0;
    setT(0);
    setStatus('idle');
  };
  return { t, status, play, ended, reset, seek };
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
          under a tall block of text), so the header sits above a 3:2 photo.
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
          <div className="relative mt-5 aspect-[3/2] overflow-hidden rounded-[24px] bg-[#2B3550] shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)] min-[560px]:mt-0 min-[560px]:aspect-auto min-[560px]:h-[46.71cqw] min-[560px]:overflow-visible min-[560px]:rounded-none min-[560px]:bg-transparent min-[560px]:shadow-none lg:h-auto lg:flex-1">
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
    <section id="race" data-nav-theme="light" aria-labelledby="rx-race-title" className="section relative !pt-[clamp(48px,6vw,88px)]">
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

const RULE_ICONS = { price: CircleDollarSign, fair: Scale, stop: BellOff, handoff: Hand };
const TONES = {
  ok: { icon: Check, cls: 'bg-[#E4F4E8] text-[#2E7A48]' },
  wait: { icon: Hourglass, cls: 'bg-[#FFF1E4] text-[#B4471A]' },
  shield: { icon: ShieldCheck, cls: 'bg-[#E8EEF9] text-[#3A5A9A]' },
  stop: { icon: BellOff, cls: 'bg-ink/[0.06] text-ink/70' },
};
// how long each rule stays on screen (ms)
const SCENE_MS = 5600;

/** One setting in the playbook: its name on the left, its value on the right (a two-way switch for final prices). */
function PlaybookRow({ row, active, value, onPick, reduce, id = 'panel' }) {
  const Icon = row.icon ? RULE_ICONS[row.icon] : null;
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-300',
        active ? 'bg-[#FFF3E8]' : 'hover:bg-ink/[0.03]'
      )}
    >
      {active ? <motion.span layoutId={reduce ? undefined : id + '-mark'} className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#F25C2A]" /> : null}
      {Icon ? (
        <Icon className={cn('h-4 w-4 shrink-0 transition-colors', active ? 'text-[#D9481C]' : 'text-ink/40')} strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className={cn('w-4 shrink-0 text-center font-serif text-[18px] leading-none transition-colors', active ? 'text-[#D9481C]' : 'text-ink/30')}>
          ”
        </span>
      )}
      <span className={cn('min-w-0 flex-1 text-[14px] leading-snug transition-colors lg:truncate', active ? 'font-medium text-ink' : 'text-ink/75')}>{row.label}</span>
      {row.values.length > 1 ? (
        // a real choice: both options, the one in force highlighted
        <span className="flex shrink-0 whitespace-nowrap rounded-full bg-ink/[0.06] p-0.5 text-[11.5px] font-medium">
          {row.values.map((v, i) => (
            <span key={v} className="relative px-2.5 py-1">
              {i === value ? (
                <motion.span
                  layoutId={reduce ? undefined : id + '-switch'}
                  className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(10,15,14,0.15)]"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              ) : null}
              <span className={cn('relative transition-colors', i === value ? 'text-ink' : 'text-ink/45')}>{v}</span>
            </span>
          ))}
        </span>
      ) : (
        <span className={cn('shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors', active ? 'bg-white text-ink shadow-[0_1px_3px_rgba(10,15,14,0.12)]' : 'bg-ink/[0.05] text-ink/60')}>
          {row.values[0]}
        </span>
      )}
    </button>
  );
}

/** The rule in force, as three steps on a line: what the lead says, what Aurora does, and what comes of it. */
function RuleFlow({ r, sc, reduce }) {
  const tone = TONES[sc.tone] || TONES.ok;
  const ToneIcon = tone.icon;
  const enter = (d) => (reduce ? { initial: false } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: EASE, delay: d } });
  const line = (d) =>
    reduce ? null : (
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 h-2 w-2 -translate-x-[3px] rounded-full bg-[#F25C2A] shadow-[0_0_0_4px_rgba(242,92,42,0.18)]"
        initial={{ top: '0%', opacity: 0 }}
        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: d }}
      />
    );
  const label = 't-data text-[11px] uppercase tracking-[0.08em] text-ink/40';
  return (
    <div className="relative" aria-live="polite">
      {/* when */}
      <motion.div {...enter(0)} className="rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_18px_40px_-28px_rgba(90,50,20,0.35)]">
        {/* who wrote it: the buyer, and how it reached the brokerage */}
        <p className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-ink/60">
            <User className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="text-[13px] font-medium text-ink">{r.flow.when}</span>
          <span className="truncate text-[12.5px] text-slate">{sc.channel}</span>
        </p>
        <p className="mt-2 text-[16px] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[17px] xl:text-[18px]">“{sc.trigger}”</p>
      </motion.div>
      <div className="relative ml-6 h-7 w-[2px] bg-ink/10">{line(0.45)}</div>
      {/* then */}
      <motion.div {...enter(0.7)} className="rounded-[18px] bg-ink p-4 text-white shadow-[0_18px_40px_-24px_rgba(10,15,14,0.6)]">
        <p className="flex items-center gap-2">
          <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className="h-3.5 w-3.5" />
          <span className="t-data text-[11px] uppercase tracking-[0.08em] text-white/55">{r.flow.then}</span>
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-white/55">{sc.action}</p>
        {/* the message she actually sends */}
        <p className="mt-3 border-l-2 border-[#F25C2A] pl-3 text-[14.5px] leading-snug text-white sm:text-[15.5px] xl:text-[16.5px]">“{sc.reply}”</p>
      </motion.div>
      <div className="relative ml-6 h-7 w-[2px] bg-ink/10">{line(1.15)}</div>
      {/* result */}
      <motion.div {...enter(1.4)} className="flex items-center gap-3">
        <span className={label}>{r.flow.result}</span>
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium', tone.cls)}>
          <ToneIcon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
          {sc.result}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Phones and tablets: the playbook one setting at a time, the same row as on laptops, with its group, its place in the
 * list, arrows and dots to move through it.
 */
function PlaybookStepper({ r, sc, i, price, go, reduce }) {
  const row = r.rows.find((x) => x.key === sc.row);
  const group = r.groups.find((g) => g.key === row.group);
  const n = r.rows.findIndex((x) => x.key === row.key);
  const btn = 'flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.05] text-ink/70 transition-colors hover:bg-ink/[0.09]';
  return (
    <div className="rounded-[20px] bg-white/80 p-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_20px_40px_-32px_rgba(90,50,20,0.4)] backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-between gap-3 pb-1.5 pl-3 pr-0.5">
        <span className="t-data truncate text-[10.5px] uppercase tracking-[0.08em] text-ink/45">
          {group.label} · {n + 1}/{r.rows.length}
        </span>
        <span className="flex shrink-0 gap-1">
          <button type="button" className={btn} onClick={() => go(i - 1)} aria-label="Previous rule">
            <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <button type="button" className={btn} onClick={() => go(i + 1)} aria-label="Next rule">
            <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} aria-hidden="true" />
          </button>
        </span>
      </div>
      {/* the setting: its name on one line, its value under it, so nothing is squeezed on a narrow screen */}
      <div className="relative rounded-[14px] bg-[#FFF3E8] px-3.5 py-3">
        <span className="absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-[#F25C2A]" aria-hidden="true" />
        <p className="flex items-center gap-2 text-[15px] font-medium leading-snug text-ink">
          {row.icon ? (
            React.createElement(RULE_ICONS[row.icon], { className: 'h-4 w-4 shrink-0 text-[#D9481C]', strokeWidth: 1.9, 'aria-hidden': 'true' })
          ) : (
            <span aria-hidden="true" className="w-4 shrink-0 text-center font-serif text-[18px] leading-none text-[#D9481C]">
              ”
            </span>
          )}
          {row.label}
        </p>
        <div className="mt-2 flex pl-6">
          {row.values.length > 1 ? (
            <span className="flex whitespace-nowrap rounded-full bg-ink/[0.06] p-0.5 text-[12px] font-medium">
              {row.values.map((v, k) => (
                <span key={v} className="relative px-3 py-1">
                  {k === price ? <motion.span layoutId={reduce ? undefined : 'stepper-switch'} className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(10,15,14,0.15)]" transition={{ duration: 0.4, ease: EASE }} /> : null}
                  <span className={cn('relative', k === price ? 'text-ink' : 'text-ink/45')}>{v}</span>
                </span>
              ))}
            </span>
          ) : (
            <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink shadow-[0_1px_3px_rgba(10,15,14,0.12)]">{row.values[0]}</span>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 pb-1 pt-2" aria-hidden="true">
        {r.rows.map((x) => (
          <span key={x.key} className={cn('h-1.5 rounded-full transition-all duration-300', x.key === row.key ? 'w-5 bg-[#F25C2A]' : 'w-1.5 bg-ink/15')} />
        ))}
      </div>
    </div>
  );
}

/**
 * Your rules: the broker's playbook on the left, the rule in force on the right as when, what Aurora does, and the
 * result. It steps through the rules by itself (final prices twice: Never, then Ask me first); a click picks a rule.
 */
export function RxRules({ it }) {
  const r = it.v3.rules;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0); // restarts the timer after a click
  const sc = r.scenes[i];

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = setTimeout(() => setI((x) => (x + 1) % r.scenes.length), SCENE_MS);
    return () => clearTimeout(id);
  }, [i, tick, reduce, inView, visible, r.scenes.length]);

  // the value each setting shows: final prices follows the scene on screen, and stays where it was left
  const [price, setPrice] = useState(0);
  useEffect(() => {
    if (sc.row === 'price') setPrice(sc.value);
  }, [sc]);

  // a click shows that rule (on final prices, a second click flips the switch) and restarts the timer
  const pick = (key) => {
    const at = key === 'price' && sc.row === 'price' ? r.scenes.findIndex((x) => x.row === 'price' && x.value !== sc.value) : r.scenes.findIndex((x) => x.row === key);
    setI(at);
    setTick((x) => x + 1);
  };
  const go = (to) => {
    setI((to + r.scenes.length) % r.scenes.length);
    setTick((x) => x + 1);
  };

  return (
    <section data-nav-theme="light" aria-labelledby="rx-rules-title" className="section relative pt-0">
      <div className="shell">
        <div ref={ref} className="canvas canvas-grain relative grid gap-6 overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:p-8 lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-10 xl:gap-16 xl:px-14">
          <div aria-hidden="true" className="pointer-events-none absolute left-[8%] top-[-12%] h-[60%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.4),rgba(255,200,87,0))] blur-2xl" />

          {/* the headline and the rule in force (first on phones) */}
          <div className="relative min-w-0 lg:col-start-2 lg:row-start-1">
            <h2 id="rx-rules-title" className="text-[clamp(28px,2.6vw,42px)] font-medium leading-[1.08] tracking-[-0.022em] text-ink">
              {r.titleA} <span className="sm:block">{r.titleB}</span>
            </h2>
            <p className="pretty mt-3 max-w-[34em] text-[15px] leading-[1.6] text-graphite md:text-[15.5px]">{r.text}</p>
            <div className="mt-5 lg:hidden">
              <PlaybookStepper r={r} sc={sc} i={i} price={price} go={go} reduce={reduce} />
            </div>
            <div className="mt-5 min-h-[438px] max-w-[600px] xs:min-h-[400px] sm:min-h-[346px] lg:mt-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={i} exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}>
                  <RuleFlow r={r} sc={sc} reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* the broker's playbook (laptops; phones and tablets get the stepper above the rule) */}
          <div className="relative hidden rounded-[24px] bg-white/80 p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_30px_60px_-40px_rgba(90,50,20,0.4)] backdrop-blur-sm lg:col-start-1 lg:row-start-1 lg:block lg:p-4">
            <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1.5">
              <span>
                <span className="block text-[15px] font-medium text-ink">{r.panel.title}</span>
                <span className="block text-[12px] text-slate">{r.panel.sub}</span>
              </span>
              <span className="rounded-full bg-[#E4F4E8] px-2.5 py-1 text-[11.5px] font-medium text-[#2E7A48]">{r.panel.edited}</span>
            </div>
            {r.groups.map((g) => (
              <div key={g.key} className="border-t border-ink/[0.06] pt-2 first-of-type:border-0">
                <p className="t-data px-3 pb-1 pt-1 text-[10.5px] uppercase tracking-[0.08em] text-ink/40">{g.label}</p>
                {r.rows
                  .filter((x) => x.group === g.key)
                  .map((x) => (
                    <PlaybookRow key={x.key} row={x} active={sc.row === x.key} value={x.key === 'price' ? price : 0} onPick={() => pick(x.key)} reduce={reduce} />
                  ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[12px] text-slate">{r.note}</p>
      </div>
    </section>
  );
}


// The story of one goal, beat by beat (ms): the weeks so far and the dip, the cause, the change, then the weeks after it
const BEAT_AT = [0, 2700, 5200, 7700];
const GOAL_END = 12200;
const WEEK_STEP = 0.32; // seconds between weeks as they are drawn

/** Weeks that meet the goal, and the first week from which every week meets it. */
function goalState(g) {
  const met = g.values.map((v) => v >= g.goal);
  let since = met.length;
  for (let i = met.length - 1; i >= 0 && met[i]; i -= 1) since = i;
  return { met, since: since < met.length ? since : -1 };
}

/**
 * The KPI Agent, built around the brokerage's own goals. Each goal plays as a short story in step with its chart, the
 * way the platform page does it: the weeks up to the dip are drawn, the cause is named, the change drops in as a
 * marker, then the weeks after it are drawn one by one until they pass the goal. Last year's weeks stand beside them
 * the whole time. Then the next goal; a tap holds one and replays it. Off screen or with reduced motion: the whole run.
 */
function KpiGoals({ a, run, reduce, titleId }) {
  const K = a.kpi;
  const [g, setG] = useState(0);
  const [held, setHeld] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [beat, setBeat] = useState(3);
  useEffect(() => {
    if (!run) {
      setBeat(3);
      return undefined;
    }
    setBeat(0);
    const ids = BEAT_AT.slice(1).map((t, i) => setTimeout(() => setBeat(i + 1), t));
    ids.push(
      setTimeout(() => {
        if (held) setCycle((c) => c + 1);
        else setG((x) => (x + 1) % K.goals.length);
      }, GOAL_END)
    );
    return () => ids.forEach(clearTimeout);
  }, [g, cycle, run, held, K.goals.length]);

  const goal = K.goals[g];
  const { met, since } = goalState(goal);
  const n = goal.values.length;
  const at = goal.change.after;
  const cut = ((at + 1) / n) * 100;
  const playing = run && !reduce;
  const story = [
    { tag: K.weekLabel + ' ' + (at + 1), text: goal.dip, tone: 'text-[#B4471A]' },
    { tag: K.story.cause, text: goal.cause, tone: 'text-[#D9481C]' },
    { tag: K.story.change, text: goal.change.text, who: goal.change.who, tone: 'text-[#D9481C]' },
    { tag: K.story.result, text: K.result.replace('{n}', since + 1), tone: 'text-[#2E7A48]' },
  ][beat];
  const ink = (on) => ({ opacity: on ? 1 : 0, transition: 'opacity 0.45s ease' });

  return (
    <div className="relative grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-10">
      {/* what it is, and the goals */}
      <div className="flex min-w-0 flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11.5px] font-medium text-white">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
          {K.badge}
        </span>
        <h2 id={titleId} className="mt-4 text-[clamp(26px,2.2vw,34px)] font-medium leading-[1.1] tracking-[-0.022em] text-ink">{K.title}</h2>
        <p className="pretty mt-3 text-[15px] leading-[1.6] text-graphite">{K.text}</p>
        {/* the goals by area: pills that wrap under 1024 px, a list beside the chart on laptops */}
        <div role="tablist" aria-label={K.badge} className="mt-4 flex flex-wrap gap-1.5 lg:mt-auto lg:grid lg:gap-0 lg:pt-3">
          {K.goals.map((x, i) => {
            const cur = i === g;
            return (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={cur}
                aria-label={x.area + ': ' + x.name}
                onClick={() => {
                  setG(i);
                  setHeld(true);
                  setCycle((c) => c + 1);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-full px-3 py-1.5 text-left transition-colors duration-300 lg:rounded-[10px] lg:py-[5px]',
                  cur ? 'bg-[#F6F1E8]' : 'shadow-[inset_0_0_0_1px_rgba(10,15,14,0.1)] hover:bg-ink/[0.03] lg:shadow-none'
                )}
              >
                <span className={cn('whitespace-nowrap text-[12.5px] font-medium transition-colors lg:w-[98px] lg:shrink-0 lg:text-[10.5px] lg:uppercase lg:tracking-[0.06em]', cur ? 'text-ink lg:text-[#C2410C]' : 'text-ink/55 lg:text-ink/40')}>{x.area}</span>
                <span className={cn('hidden min-w-0 truncate text-[13.5px] font-medium transition-colors lg:block', cur ? 'text-ink' : 'text-ink/55')}>{x.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the goal, week by week */}
      <div className="flex min-w-0 flex-col rounded-[20px] bg-[#FBF8F3] p-3.5 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.05)] md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="min-w-0">
            <span className="block text-[15px] font-medium text-ink">
              <span className="t-data mr-2 text-[10.5px] uppercase tracking-[0.06em] text-[#C2410C]">{goal.area}</span>
              {goal.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate">
              <span aria-hidden="true" className="w-4 border-t-[1.5px] border-dashed border-ink/45" />
              {K.legend.goal}: {goal.target}
            </span>
          </p>
          <span
            className="inline-flex items-center gap-1 rounded-full bg-[#E4F4E8] px-2.5 py-1 text-[11.5px] font-medium text-[#2E7A48]"
            style={{ opacity: beat === 3 && since >= 0 ? 1 : 0, transition: beat === 3 && playing ? `opacity 0.4s ease ${(n - at - 1) * WEEK_STEP + 0.4}s` : 'opacity 0.2s ease' }}
          >
            <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
            {K.since} {since + 1}
          </span>
        </div>

        <div className="relative mt-4 h-[140px] sm:h-[170px] lg:h-auto lg:min-h-[190px] lg:flex-1" role="img" aria-label={goal.area + ', ' + goal.name + ', ' + K.goalLabel.toLowerCase() + ' ' + goal.target.toLowerCase() + (since >= 0 ? '. ' + K.since + ' ' + (since + 1) + '.' : '.')}>
          {/* the weeks: last year stands from the start, this year is drawn in step with the story */}
          <div key={goal.key + cycle} className="absolute inset-0 grid items-end" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {goal.values.map((v, i) => {
              const shown = beat >= 3 || i <= at;
              const delay = !playing ? 0 : i <= at ? 0.25 + i * WEEK_STEP : (i - at - 1) * WEEK_STEP;
              return (
                <span key={i} className="flex h-full items-end justify-center gap-[3px] sm:gap-1">
                  <motion.span
                    className="block w-[30%] max-w-[18px] rounded-t-[5px] rounded-b-[2px] bg-[#D3C5B0]"
                    style={{ height: goal.last[i] * 100 + '%', transformOrigin: 'bottom' }}
                    initial={playing ? { scaleY: 0 } : false}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.4, ease: EASE, delay: playing ? i * 0.03 : 0 }}
                  />
                  <motion.span
                    className={cn(
                      'block w-[30%] max-w-[18px] rounded-t-[5px] rounded-b-[2px] transition-shadow duration-500',
                      met[i] ? 'bg-[linear-gradient(180deg,#FF8A3D,#F25C2A)]' : 'bg-[#F25C2A]/55',
                      i === at && beat >= 1 && beat < 3 ? 'shadow-[0_0_0_2px_#FBF8F3,0_0_0_3.5px_#F25C2A]' : ''
                    )}
                    style={{ height: v * 100 + '%', transformOrigin: 'bottom' }}
                    initial={playing ? { scaleY: 0 } : false}
                    animate={{ scaleY: shown ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay }}
                  />
                </span>
              );
            })}
          </div>
          {/* the goal */}
          <span aria-hidden="true" className="absolute inset-x-0 border-t-[1.5px] border-dashed border-ink/45 transition-[bottom] duration-500" style={{ bottom: goal.goal * 100 + '%' }} />
          {/* the dip, named while its cause is found */}
          <span
            aria-hidden="true"
            className="absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FFF1E4] px-2 py-0.5 text-[10.5px] font-medium text-[#B4471A]"
            style={{ left: ((at + 0.5) / n) * 100 + '%', bottom: `calc(${goal.values[at] * 100}% + 8px)`, ...ink(beat === 1) }}
          >
            ↓ {K.slipping}
          </span>
          {/* the change */}
          <span aria-hidden="true" className="absolute -top-1 bottom-0 border-l-[1.5px] border-dotted border-[#F25C2A]" style={{ left: cut + '%', ...ink(beat >= 2) }}>
            <span className="absolute -left-[5px] -top-1 h-2.5 w-2.5 rounded-full bg-[#F25C2A] shadow-[0_0_0_3px_#FBF8F3]" />
          </span>
        </div>
        <div aria-hidden="true" className="mt-1.5 grid border-t border-ink/10 pt-1.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {K.weeks.map((w) => (
            <span key={w} className="t-data text-center text-[10.5px] text-ink/40">
              {w}
            </span>
          ))}
        </div>

        <p aria-hidden="true" className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#F25C2A]" />
            {K.legend.now}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#D3C5B0]" />
            {K.legend.last}
          </span>
        </p>

        {/* what is happening at this beat */}
        <div className="relative mt-3 min-h-[58px]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={goal.key + cycle + '-' + beat}
              initial={playing ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: EASE }}
              className="rounded-[14px] bg-white px-3 py-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.05)]"
            >
              <p className={cn('t-data text-[10.5px] uppercase tracking-[0.08em]', story.tone)}>
                {String(beat + 1).padStart(2, '0')} · {story.tag}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug text-ink">
                <span className="min-w-0">{story.text}</span>
                {story.who ? <span className="rounded-full bg-[#E4F4E8] px-2 py-0.5 text-[11px] font-medium text-[#2E7A48]">{story.who}</span> : null}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// One lead's journey: how long a step stays on screen before the next (ms). The call step holds while it plays.
const STEP_MS = 10000;
const CALL_IDLE_MS = 12000;
const AFTER_CALL_MS = 2500;
const MSG_GAP_MS = 2200; // between the texts of a step, as they arrive over the scene
const SUB_WORDS = 7; // the call's subtitles show at most this many words at a time

/** Which slice of a line is on screen as a subtitle: the chunk of words that holds the word being spoken. */
function subtitle(cap, t) {
  const words = cap.text.split(' ');
  let w = 0;
  cap.words.forEach((ms, i) => {
    if (t >= cap.at + ms) w = i;
  });
  const start = Math.floor(w / SUB_WORDS) * SUB_WORDS;
  return { words, start, end: Math.min(words.length, start + SUB_WORDS) };
}

/**
 * The call, laid over Emma's scene in one small glass box. Before it plays: a play button, the recording's own
 * waveform (Aurora's turns in orange, Emma's in ink) and its length. Once it plays, the same box shows the call as
 * live subtitles, word by word, with the speaker and the delivery the voice was given.
 */
function CallOverlay({ c, clock: cc, reduce }) {
  const { t, status, play } = cc;
  const live = status === 'playing' || status === 'paused';
  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const speaking = status === 'playing' && t >= cap.at && t <= cap.end + 150 ? cap.who : null;
  const sub = subtitle(cap, t);
  const bars = c.wave.filter((_, i) => i % 2 === 0);
  const n = bars.length;
  const whoAt = (ms) => {
    const x = c.captions.find((q) => ms >= q.at - 150 && ms <= q.end + 150);
    return x ? x.who : null;
  };
  const played = live || status === 'done' ? t : -1;
  return (
    <LiquidGlass className="rounded-[18px] p-3" style={{ '--lg-tint-a': 'rgba(255,252,247,0.9)', '--lg-tint-b': 'rgba(255,249,241,0.82)' }}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={play}
          aria-label={status === 'playing' ? c.pause : status === 'paused' ? c.resume : status === 'done' ? c.again : c.listen}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] text-white shadow-[0_10px_24px_-10px_rgba(242,92,42,0.8)] transition-transform hover:scale-105"
        >
          {status === 'idle' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" /> : null}
          {status === 'playing' ? <Pause className="relative h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className="relative ml-0.5 h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          {live ? (
            <>
              <p className={cn('flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.07em]', cap.who === 'aurora' ? 'text-[#B4471A]' : 'text-slate')}>
                {cap.who === 'aurora' ? 'Aurora' : c.caller}
                {cap.cue ? <span className="font-normal normal-case italic tracking-normal text-ink/40">[{cap.cue}]</span> : null}
              </p>
              <p className="mt-0.5 h-[38px] overflow-hidden text-[14px] leading-[1.35] text-ink" aria-live="off">
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
              <p className="truncate text-[14px] font-medium leading-tight text-ink">{status === 'done' ? c.again : c.listen}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-slate">
                <Volume2 className="h-3.5 w-3.5 shrink-0 text-[#B4471A]" strokeWidth={2.2} aria-hidden="true" />
                {c.meta}
              </p>
            </>
          )}
        </div>
        <span className="shrink-0 self-start text-[12px] font-medium tabular-nums text-ink/55">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
      </div>
      {/* the recording itself: one bar per slice, coloured by who is talking, brighter once it has played */}
      <div className={cn('mt-2.5 flex h-6 items-center gap-[2px]', !live && 'max-sm:hidden')} aria-hidden="true">
        {bars.map((v, i) => {
          const ms = ((i + 0.5) / n) * c.duration;
          const who = whoAt(ms);
          return (
            <span
              key={i}
              className={cn('min-w-0 flex-1 rounded-full transition-opacity duration-200', who === 'aurora' ? 'bg-[#F25C2A]' : who ? 'bg-ink' : 'bg-ink/30', played < 0 ? 'opacity-55' : played >= ms ? 'opacity-100' : 'opacity-20')}
              style={{ height: Math.max(14, v * 100) + '%' }}
            />
          );
        })}
      </div>
    </LiquidGlass>
  );
}

/** The texts of a step, laid over its scene: they arrive one at a time, like notifications on a phone. */
function TextsOverlay({ step, a, active, reduce }) {
  const n = step.thread.length;
  const [shown, setShown] = useState(reduce ? n : 0);
  useEffect(() => {
    if (reduce || !active) {
      setShown(reduce ? n : 0);
      return undefined;
    }
    setShown(0);
    const ids = step.thread.map((_, i) => setTimeout(() => setShown(i + 1), 500 + i * MSG_GAP_MS));
    return () => ids.forEach(clearTimeout);
  }, [active, reduce, n, step.thread]);
  const list = step.thread.slice(Math.max(0, shown - 1), shown);
  return (
    <div className="grid min-h-[64px] items-end">
      <AnimatePresence initial={false}>
        {list.map((m, j) => {
          const i = Math.max(0, shown - 1) + j;
          const mine = m.who === 'aurora';
          return (
            <motion.div
              key={i}
              className="[grid-area:1/1]"
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <LiquidGlass className="flex items-start gap-2.5 rounded-[16px] px-3 py-2.5" style={{ '--lg-tint-a': 'rgba(255,252,247,0.9)', '--lg-tint-b': 'rgba(255,249,241,0.82)' }}>
                <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-medium', mine ? 'bg-[#FFF1E6]' : 'bg-ink text-white')}>
                  {mine ? <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className="h-3.5 w-3.5" /> : a.lead.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-medium uppercase tracking-[0.07em] text-ink/45">{mine ? a.labels.you : a.lead.name.split(' ')[0]} · {a.labels.text}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-ink">{m.text}</span>
                </span>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** One step's explanation: the step and its date, one line on what changed, the steps Aurora took, what the team sees. */
function JourneyStep({ step, n, a, reduce, cc }) {
  const TeamIcon = step.icon === 'calendar' ? CalendarCheck : step.icon === 'phone' ? PhoneOutgoing : Database;
  const c = step.call;
  // during the call the team line follows it; otherwise it shows where things ended up
  const playing = c && cc && (cc.status === 'playing' || cc.status === 'paused');
  const team = playing ? c.notes[lastIndex(c.notes, cc.t)].text : step.team;
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="flex h-full flex-col">
      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span className="text-[20px] font-medium leading-tight tracking-[-0.015em] text-ink md:text-[22px]">{step.name}</span>
        <span className="t-data text-[11px] uppercase tracking-[0.08em] text-[#C2410C]">
          {String(n + 1).padStart(2, '0')} · {step.date}
        </span>
      </p>
      <p className="pretty mt-2 text-[15px] leading-snug text-ink md:mt-3 md:text-[17px] md:leading-[1.45]">{step.happened}</p>
      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-[14px] bg-[#FBF8F3] px-3.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.06)] md:mt-auto md:px-4 md:py-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45">
          <TeamIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {a.labels.team}
        </span>
        <span className="min-w-0 text-[13px] font-medium leading-snug text-ink md:text-[14px]">{team}</span>
      </p>
    </motion.div>
  );
}

/**
 * After the first reply: one lead's journey in three steps. Emma, the buyer from the speed-to-lead section, went
 * quiet; Aurora calls her back, Marcus shows her a house, and she closes. Each step is one screen: Emma's scene with
 * the live layer over it (the call to play, or the texts arriving), and beside it what happened and what the team
 * sees. Steps advance on their own while the section is on screen; the call holds its step while it plays.
 */
export function RxAfter({ it }) {
  const a = it.v3.after;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const videos = useRef([]);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.12 });
  const visible = usePageVisible();
  const n = a.steps.length;
  const ci = a.steps.findIndex((x) => x.call);
  const call = ci >= 0 ? a.steps[ci].call : null;
  const cc = useCallClock(call || { duration: 0 }, { audioRef });
  const [k, setK] = useState(0);
  const [nonce, setNonce] = useState(0);
  const callBusy = k === ci && (cc.status === 'playing' || cc.status === 'paused');
  const running = !reduce && inView && visible;
  // the later steps open once the call has been played (it is the point of the story)
  const [heard, setHeard] = useState(ci < 0);
  useEffect(() => {
    if (cc.status === 'playing') setHeard(true);
  }, [cc.status]);
  const locked = (i) => !heard && i > ci;

  useEffect(() => {
    if (!running || callBusy || (k === ci && !heard)) return undefined;
    const ms = k === ci ? (cc.status === 'done' ? AFTER_CALL_MS : CALL_IDLE_MS) : STEP_MS;
    const id = setTimeout(() => setK((x) => (x + 1) % n), ms);
    return () => clearTimeout(id);
  }, [k, nonce, running, callBusy, heard, cc.status, ci, n]);

  // leaving the call step stops the call; coming back to it starts fresh
  useEffect(() => {
    if (k !== ci) cc.reset();
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps

  // only the current step's scene plays, and only while the section is on screen
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === k && running) v.play().catch(() => {});
      else v.pause();
    });
  }, [k, running]);

  const go = (x) => {
    const to = (x + n) % n;
    if (locked(to)) return;
    setK(to);
    setNonce((v) => v + 1);
  };
  const arrows = (size) => (
    <>
      <button type="button" onClick={() => go(k - 1)} aria-label={a.labels.prev} className={cn('flex items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)]', size)}>
        <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(k + 1)}
        disabled={locked((k + 1) % n)}
        aria-label={locked((k + 1) % n) ? a.labels.locked : a.labels.next}
        title={locked((k + 1) % n) ? a.labels.locked : undefined}
        className={cn('flex items-center justify-center rounded-full bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.1)] hover:shadow-[0_0_0_1px_rgba(10,15,14,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-[0_0_0_1px_rgba(10,15,14,0.1)]', size)}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
    </>
  );

  return (
    <section data-nav-theme="light" aria-labelledby="rx-after-title" className="section relative pt-0">
      <div className="shell">
        <div ref={ref} className="canvas canvas-grain relative overflow-hidden bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:p-8 lg:px-10 lg:py-8 xl:px-14">
          <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-[-14%] h-[55%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.4),rgba(255,200,87,0))] blur-2xl" />

          <div className="relative grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-12">
            <h2 id="rx-after-title" className="text-[clamp(28px,2.4vw,36px)] font-medium leading-[1.08] tracking-[-0.022em] text-ink">
              {a.titleA} <span className="sm:block">{a.titleB}</span>
            </h2>
            <p className="pretty text-[15px] leading-[1.6] text-graphite md:text-[15.5px]">{a.text}</p>
          </div>

          {/* who this is, then the three steps (a marker for each step and a check once it's done; no fill bar) */}
          <div className="relative mt-6 grid gap-4 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_auto] xl:items-center xl:gap-8">
            <p className="flex items-center gap-3 max-sm:hidden">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-white">{a.lead.initials}</span>
              <span className="min-w-0">
                <span className="block text-[15px] font-medium text-ink">{a.lead.name}</span>
                <span className="block text-[12.5px] leading-snug text-slate">{a.lead.intro}</span>
              </span>
            </p>
            <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-label="Emma’s journey">
              <span aria-hidden="true" className="absolute top-[13px] h-px bg-ink/15" style={{ left: `${50 / n}%`, right: `${50 / n}%` }} />
              {a.steps.map((x, i) => {
                const cur = i === k;
                const done = i < k;
                return (
                  <li key={x.key} className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      disabled={locked(i)}
                      title={locked(i) ? a.labels.locked : undefined}
                      aria-current={cur ? 'step' : undefined}
                      className="group flex flex-col items-center gap-1.5 px-1 text-center transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span
                        className={cn(
                          'relative z-[1] flex h-[27px] w-[27px] items-center justify-center rounded-full text-[12px] font-medium transition-colors duration-300',
                          cur ? 'bg-[#F25C2A] text-white shadow-[0_0_0_5px_rgba(242,92,42,0.15)]' : done ? 'bg-ink text-white' : 'bg-[#F6F1E8] text-ink/45 shadow-[inset_0_0_0_1.5px_rgba(10,15,14,0.18)] group-hover:text-ink'
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" /> : i + 1}
                      </span>
                      <span className={cn('text-[12px] font-medium leading-tight transition-colors xs:text-[12.5px] sm:text-[13.5px]', cur ? 'text-ink' : 'text-ink/55')}>{x.name}</span>
                      <span className="t-data text-[10.5px] text-ink/40 max-sm:hidden">{x.date}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="flex gap-2 max-xl:hidden">{arrows('h-10 w-10')}</div>
          </div>

          {/* the stage: Emma's scene with the live layer over it, and beside it what happened */}
          <div className="relative mt-4 grid overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_30px_60px_-40px_rgba(90,50,20,0.45)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E1D4] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[340px]">
              {a.steps.map((x, i) =>
                reduce ? (
                  <img key={x.key} src={x.media.poster} alt="" className={cn('absolute inset-0 h-full w-full object-cover', i === k ? 'opacity-100' : 'opacity-0')} style={{ objectPosition: x.media.focus || '50% 35%' }} />
                ) : (
                  <video
                    key={x.key}
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    src={x.media.video}
                    poster={x.media.poster}
                    muted
                    loop
                    playsInline
                    preload={i === 0 ? 'metadata' : 'none'}
                    aria-hidden="true"
                    className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', i === k ? 'opacity-100' : 'opacity-0')}
                    style={{ objectPosition: x.media.focus || '50% 35%' }}
                  />
                )
              )}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(20,16,12,0),rgba(20,16,12,0.35))]" />
              {/* the live layer: the call to play, or the texts as they arrive */}
              <div className="absolute inset-x-3 bottom-3 grid sm:inset-x-4 sm:bottom-4 sm:right-auto sm:w-[min(380px,calc(100%_-_32px))]">
                {a.steps.map((x, i) => (
                  <div key={x.key} className={cn('[grid-area:1/1] self-end transition-opacity duration-300', i === k ? 'opacity-100' : 'pointer-events-none invisible opacity-0')} aria-hidden={i === k ? undefined : true}>
                    {x.call ? <CallOverlay c={x.call} clock={cc} reduce={reduce} /> : <TextsOverlay step={x} a={a} active={i === k && running} reduce={reduce} />}
                  </div>
                ))}
              </div>
              {call ? <audio ref={audioRef} src={call.audio} preload="none" onEnded={cc.ended} /> : null}
            </div>

            {/* every step's explanation in the same grid cell, so the stage is as tall as the longest and never jumps */}
            <div className="relative grid min-w-0 p-4 xs:p-5 md:p-6 lg:px-7 lg:py-6" aria-live="polite">
              {a.steps.map((x, i) => (
                <div key={x.key} className={cn('[grid-area:1/1]', i === k ? '' : 'invisible')} aria-hidden={i === k ? undefined : true}>
                  <JourneyStep key={i === k ? 'on' : 'off'} step={x} n={i} a={a} reduce={reduce || i !== k} cc={x.call ? cc : null} />
                </div>
              ))}
            </div>
          </div>

          {/* phones and tablets: the arrows under the stage */}
          <div className="mt-4 flex justify-center gap-2 xl:hidden">{arrows('h-11 w-11')}</div>

          {/* every step in the HTML, for search and screen readers */}
          <ol className="sr-only">
            {a.steps.map((x) => (
              <li key={x.key}>
                {x.name} ({x.date}). {x.happened}{' '}
                {(x.call ? x.call.captions : x.thread).map((m) => (m.who === 'aurora' ? 'Aurora: ' : a.lead.name.split(' ')[0] + ': ') + m.text).join(' ')} {x.team}
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-4 text-[12px] text-slate">{a.note}</p>
      </div>
    </section>
  );
}

/** The KPI Agent as its own section after the jobs: the brokerage's goals, each played as a story with its chart. */
export function RxKpi({ it }) {
  const a = it.v3.after;
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  const run = !reduce && inView && visible;
  if (!a || !a.kpi) return null;
  return (
    <section data-nav-theme="light" aria-labelledby="rx-kpi-title" className="section relative pt-0">
      <div className="shell">
        <motion.div
          ref={ref}
          {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 'some' }, transition: { duration: 0.6, ease: EASE } })}
          className="canvas relative overflow-hidden bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.07),0_30px_70px_-50px_rgba(90,50,20,0.45)] xs:p-5 md:p-8 lg:px-10 lg:py-9 xl:px-14"
        >
          <div aria-hidden="true" className="pointer-events-none absolute left-[-6%] top-[-30%] h-[70%] w-[38%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.16),rgba(255,159,69,0))] blur-2xl" />
          <KpiGoals a={a} run={run} reduce={reduce} titleId="rx-kpi-title" />
        </motion.div>
        {a.kpi.note ? <p className="mt-4 text-[12px] text-slate">{a.kpi.note}</p> : null}
      </div>
    </section>
  );
}

/** Under the FAQ: one line pointing to the platform page, for anyone who wants the whole picture. */
const MARKS = { hubspot: HubSpotMark, whatsapp: WhatsAppMark, phone: PhoneTile };
const GLYPHS = { text: MessageSquareText, chat: MessagesSquare };

/** One tool: its brand icon and name (a wordmark stands alone), or a plain glyph for a channel. */
function StackTile({ x }) {
  const Mark = x.mark ? MARKS[x.mark] : null;
  const Glyph = x.glyph ? GLYPHS[x.glyph] : null;
  return (
    <li className="flex h-10 items-center gap-2.5 rounded-[12px] bg-paper pl-2.5 pr-3.5 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.05)]" title={x.name}>
      {x.wordmark ? (
        <img src={x.icon} alt={x.name} height="16" loading="lazy" decoding="async" className="h-4 w-auto px-1" />
      ) : (
        <>
          {Mark ? (
            <Mark className="h-[22px] w-[22px] shrink-0" />
          ) : Glyph ? (
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-ink text-white">
              <Glyph className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
          ) : (
            <img src={x.icon} alt="" width="22" height="22" loading="lazy" decoding="async" className="h-[22px] w-[22px] shrink-0 rounded-[5px] object-contain" />
          )}
          <span className="whitespace-nowrap text-[13.5px] font-medium text-ink">{x.name}</span>
        </>
      )}
    </li>
  );
}

/**
 * The last tile of each kind: a + square. Its label ("and more") shows as a small tag above it on hover, keyboard focus
 * or a tap, laid over the page so the row never changes size.
 */
function MoreTile({ label }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="group/more flex h-10 w-10 items-center justify-center rounded-[12px] border border-dashed border-ink/20 text-ink/45 transition-colors duration-300 hover:border-ink/35 hover:text-ink/70 focus-visible:border-ink/35 focus-visible:text-ink/70 focus-visible:outline-none"
      >
        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1 text-[12px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(10,15,14,0.5)] transition-[opacity,transform] duration-200 group-hover/more:translate-y-0 group-hover/more:opacity-100 group-focus-visible/more:translate-y-0 group-focus-visible/more:opacity-100',
            open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          )}
        >
          {label}
        </span>
      </button>
    </li>
  );
}

/**
 * The tools Aurora connects to, by kind (CRM, lead sources, calendars, phone systems, email, channels), each as its
 * brand icon and name and each kind ending in a + ("and more"), then the languages it speaks. Brand icons only name the tools.
 */
export function RxStack({ it }) {
  const st = it.v3.stack;
  if (!st) return null;
  const label = 't-data text-[10.5px] uppercase tracking-[0.08em] text-ink/45';
  return (
    <section data-nav-theme="light" aria-labelledby="rx-stack-title" className="section relative pt-0">
      <div className="shell">
        <div className="rounded-[28px] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] xs:p-6 md:p-8 lg:p-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-12">
            <h2 id="rx-stack-title" className="text-[clamp(26px,2.2vw,34px)] font-medium leading-[1.1] tracking-[-0.022em] text-ink">
              {st.titleA} <span className="sm:block">{st.titleB}</span>
            </h2>
            <p className="pretty text-[15px] leading-[1.6] text-graphite">{st.text}</p>
          </div>
          <div className="mt-7 grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {st.groups.map((g) => (
              <div key={g.label}>
                <p className={label}>{g.label}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {g.items.map((x) => (
                    <StackTile key={x.name} x={x} />
                  ))}
                  <MoreTile label={st.more} />
                </ul>
              </div>
            ))}
            {st.languages ? (
              <div>
                <p className={label}>{st.languages.label}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {st.languages.items.map((l) => (
                    <li key={l} className="flex h-10 items-center rounded-[12px] bg-ink px-3.5 text-[13.5px] font-medium text-white">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <p className="mt-7 text-[11.5px] leading-snug text-slate">{st.note}</p>
        </div>
      </div>
    </section>
  );
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

// The closing illustration: one modern family home drawn as an architect's elevation, in thin Amber-to-Gold line:
// a two-storey gable, a garage wing, a flat-roofed wing, lit windows. The lines draw themselves in when the section shows.
const HOUSE_MAIN = ['M10 270H630', 'M86 270L58 298M184 270L206 298', 'M214 270V122M426 122V270', 'M196 128L320 56L444 128', 'M206 128L320 62L434 128', 'M378 93V70H398V104', 'M374 70H402', 'M62 270V176H214', 'M48 182L136 140L214 168', 'M86 270V198H184V270', 'M426 186H580V270', 'M420 180H586', 'M250 132H390V186H250Z', 'M216 192H424', 'M302 270V206H338V270', 'M286 198H354', 'M230 209H285V251H230Z', 'M356 209H411V251H356Z', 'M450 204H560V256H450Z'];
const HOUSE_DETAIL = ['M296.7 132V186M343.3 132V186', 'M257.5 209V251M383.5 209V251', 'M486.7 204V256M523.3 204V256', 'M86 214H184M86 230H184M86 246H184', 'M98 205H172', 'M311 92H329V104H311Z', 'M330 214V262', 'M292 198V204M348 198V204', 'M216 270C216 258 230 254 236 262C240 254 252 258 250 270', 'M412 270C412 256 428 252 434 262C438 254 452 258 448 270', 'M582 270C582 262 594 258 600 266C604 260 614 262 612 270'];
const HOUSE_BOARDS = 'M260 128V122M280 128V108M300 128V97M340 128V97M360 128V108M380 128V120';
const HOUSE_LIT = [
  [252, 134, 136, 50],
  [452, 206, 106, 48],
  [232, 211, 51, 38],
];

function HouseArt({ grow, reduce }) {
  const draw = (delay, dur = 1.2) => ({
    pathLength: 1,
    strokeDasharray: 1,
    style: { strokeDashoffset: grow ? 0 : 1, transition: reduce ? 'none' : `stroke-dashoffset ${dur}s cubic-bezier(0.65,0,0.35,1) ${delay}s` },
  });
  return (
    <svg viewBox="0 0 640 300" className="block h-auto w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rx-house-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="640" y2="0">
          <stop offset="0" stopColor="#FF9F45" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC857" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g fill="#FFC857" style={{ fillOpacity: grow ? 0.16 : 0, transition: reduce ? 'none' : 'fill-opacity 1s ease 1.9s' }}>
        {HOUSE_LIT.map(([x, y, w, h]) => (
          <rect key={x} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      <g stroke="url(#rx-house-line)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {HOUSE_MAIN.map((d, i) => (
          <path key={i} d={d} {...draw(i * 0.07)} />
        ))}
      </g>
      <g stroke="url(#rx-house-line)" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round">
        {HOUSE_DETAIL.map((d, i) => (
          <path key={i} d={d} {...draw(1 + i * 0.06, 0.9)} />
        ))}
        <path d={HOUSE_BOARDS} strokeOpacity="0.5" {...draw(1.6, 0.8)} />
      </g>
    </svg>
  );
}

/**
 * The closing for a brokerage, in Aurora's colours only: an ink night with a warm dawn. On the left the headline, the
 * line under it and a family home drawn as an architect's elevation; on the right the demo form in glass. Phones and
 * tablets: headline, drawing, form.
 */
export function RxClosing({ it }) {
  const c = it.v3.closing;
  const reduce = !!useReducedMotion();
  const ref = useRef(null);
  const seen = useInViewport(ref, { threshold: 0.2, once: true });
  const grow = reduce || seen;
  return (
    <section ref={ref} id="contact" data-nav-theme="dark" aria-labelledby="contact-title" className="on-dark relative overflow-hidden bg-ink pb-[clamp(72px,7vw,112px)] pt-[clamp(88px,8vw,128px)] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* the dawn: Sun, Amber and Gold glowing low across the section */}
        <div className="absolute bottom-[4%] left-[18%] h-[70%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(242,92,42,0.30),rgba(255,159,69,0.10)_50%,rgba(255,200,87,0)_75%)] blur-2xl" />
        <div className="absolute right-[-10%] top-[-20%] h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.10),rgba(255,200,87,0))] blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {/* the dawn settles back to plain ink before the footer, so the two meet without a seam */}
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-ink/0 to-ink" />
      </div>

      <div className="shell relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-end lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
        <div className="min-w-0">
          <h2 id="contact-title" className="t-display balance lg:text-[clamp(2.4rem,0.6rem+3vw,3.9rem)]">
            <RevealLines lines={[c.titleA, c.titleB]} lineClassNames={['', '']} />
          </h2>
          <p className="t-lead pretty mt-5 max-w-[32em] !text-white/70">{c.text}</p>
          <div className="mt-8 max-w-[560px] lg:mt-12">
            <HouseArt grow={grow} reduce={reduce} />
          </div>
        </div>
        <LiquidGlass tone="dark" className="rounded-[clamp(20px,2.2vw,28px)] p-5 xs:p-6 md:p-7">
          <p className="mb-5 text-[15px] leading-snug text-white/75">Leave your details and Aurora, our AI agent, will call you right away.</p>
          <LeadForm dark columns={2} industry={it.leadIndustry} />
        </LiquidGlass>
      </div>
    </section>
  );
}
