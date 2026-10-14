import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Check, CircleDollarSign, Hand, MessageCircle, Play, Scale, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { RevealGroup, RevealItem, RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { onAnchorClick, useInViewport, usePageLoaded, usePageVisible } from '@/components/home-v2/hooks';

/*
 * Real estate page, v3. One message per section, in this order:
 * the promise and a real call (hero) -> the race for every lead -> your rules. Sections the home and platform pages already tell are left out.
 * Everything sits on the site's warm light ground; the motion is the product at work.
 */

const EASE = [0.22, 1, 0.36, 1];
// How long the finished call stays on screen before it starts again (ms).
const HOLD = 4500;

const clock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};

/**
 * The call's clock. Runs silently while the stage is on screen, so the captions play like a
 * muted video; when the visitor turns the sound on, it follows the recording instead, so every
 * word appears as it is spoken. Reduced motion shows the finished call until sound is turned on.
 */
function useCallClock(c, { active, still, audioRef }) {
  const [sound, setSound] = useState(false);
  const [t, setT] = useState(still ? c.duration : 0);
  const now = useRef(t);
  const soundRef = useRef(false);
  soundRef.current = sound;

  useEffect(() => {
    if (still && !sound) {
      now.current = c.duration;
      setT(c.duration);
      return undefined;
    }
    if (!active && !sound) return undefined;
    let raf = 0;
    let last = performance.now();
    let shown = now.current;
    const tick = (stamp) => {
      const a = audioRef.current;
      let v = now.current;
      if (soundRef.current && a && !a.paused) v = a.currentTime * 1000;
      else v += stamp - last;
      last = stamp;
      if (v > c.duration + HOLD) v = still ? c.duration : 0;
      now.current = v;
      // ~20 updates a second is plenty for word timing and keeps React work small
      if (Math.abs(v - shown) >= 50 || v < shown) {
        shown = v;
        setT(v);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, still, sound, c.duration, audioRef]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (sound) {
      a.pause();
      setSound(false);
      return;
    }
    // Sound always plays the call from the top, so the visitor hears the whole conversation.
    now.current = 0;
    setT(0);
    a.currentTime = 0;
    setSound(true);
    a.play().catch(() => setSound(false));
  };
  const ended = () => setSound(false);
  return { t, sound, toggle, ended };
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
      <p className="mt-0.5 text-[15px] leading-[1.45] tracking-[-0.005em] text-ink md:text-[16px]">
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
            className={cn('wave-bar w-[2px] rounded-full', who === 'aurora' ? 'bg-[#F25C2A]' : who ? 'bg-ink/70' : 'bg-ink/20')}
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

/** The stage: the listing, and a buyer's call about it as live captions. Takes a still image or a muted clip. */
function CallStage({ h }) {
  const c = h.call;
  const f = h.film;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const loaded = usePageLoaded();
  const { t, sound, toggle, ended } = useCallClock(c, { active: inView && visible, still: reduce, audioRef });

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
  const speaking = t >= cap.at && t <= cap.end + 150 ? cap.who : null;
  const stage = lastIndex(c.stages, t);
  const notes = c.notes.filter((n) => t >= n.at);
  const latest = notes[notes.length - 1];

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-[28px] bg-[#2B3550] shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)]">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2/1]">
          <img
            src={f.image ? f.image.src : f.poster}
            srcSet={f.image ? f.image.srcSet : undefined}
            sizes="(min-width: 1440px) 1376px, 100vw"
            alt={f.video ? '' : f.alt}
            className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
            decoding="async"
            fetchpriority="high"
          />
          {wantVideo && f.video ? (
            <video
              ref={videoRef}
              src={f.video}
              poster={f.poster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
            />
          ) : null}
          {f.video ? <span className="sr-only">{f.alt}</span> : null}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,40,0.25)_0%,rgba(20,24,40,0)_30%,rgba(20,24,40,0)_60%,rgba(20,24,40,0.35)_100%)]" />

          <audio ref={audioRef} src={c.audio} preload="none" onEnded={ended} />
          <LiquidGlass
            as="button"
            type="button"
            onClick={toggle}
            aria-pressed={sound}
            className="absolute left-3 top-3 flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-[13px] font-medium text-ink sm:left-5 sm:top-5"
          >
            <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors', sound ? 'bg-[#F25C2A]' : 'bg-ink')}>
              {sound ? <Volume2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" /> : <Play className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={2.2} aria-hidden="true" />}
            </span>
            {sound ? c.mute : c.listen}
          </LiquidGlass>

          {/* Aurora's notes gather over the lawn on wide screens */}
          <div className="absolute bottom-6 right-6 hidden w-[260px] flex-col gap-2 lg:flex" aria-live="polite">
            <AnimatePresence initial={false}>
              {notes.map((n) => (
                <Note key={n.title} n={n} reduce={reduce} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The call: under the clip on phones, over its top corner on wide screens, so it is in view with the headline */}
      <LiquidGlass
        className="relative z-[1] mx-3 -mt-28 rounded-[24px] p-4 sm:mx-6 sm:-mt-24 sm:p-5 lg:absolute lg:right-6 lg:top-6 lg:mx-0 lg:mt-0 lg:w-[420px]"
        style={{ '--lg-tint-a': 'rgba(255,252,247,0.9)', '--lg-tint-b': 'rgba(255,249,241,0.82)' }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
            {speaking === 'aurora' ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/25" /> : null}
            <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="relative h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-medium leading-tight text-ink">{c.title}</span>
            <span className="block truncate text-[12px] text-slate">
              {c.listing} · <span className="tabular-nums">{clock(Math.min(t, c.duration))}</span>
            </span>
          </span>
          <Wave who={reduce ? null : speaking} />
        </div>

        <div className="relative mt-4 grid h-[172px] content-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%)] sm:h-[156px]">
          {prev ? <Caption key={k - 1} cap={prev} t={t} dim c={c} /> : null}
          <Caption key={k} cap={cap} t={t} c={c} />
        </div>

        <ol className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Where the call is">
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

        {/* phones and tablets: the latest note sits in the card */}
        <div className="mt-3 h-[46px] lg:hidden" aria-live="polite">
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

/** Hero: Aurora takes a buyer's call at night. The promise above, the call itself below. */
export function RxHero({ it }) {
  const h = it.v3.hero;
  const { open } = useLead();

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="rx-hero-title" className="relative overflow-hidden pb-[clamp(56px,7vw,104px)] pt-[calc(var(--nav-h)+36px)] md:pt-[calc(var(--nav-h)+56px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="intro-rise eyebrow">{h.eyebrow}</p>
            <h1 id="rx-hero-title" className="t-display balance mt-5 md:mt-6">
              <RevealLines lines={[h.titleA, h.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="intro-slide t-lead pretty max-w-[34em]" style={{ animationDelay: '0.3s' }}>
              {h.text}
            </p>
            <div className="intro-slide mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3" style={{ animationDelay: '0.42s' }}>
              <CTAButton size="lg" onClick={open} className="max-sm:h-12 max-sm:px-4 max-sm:text-[14px]">
                Book a demo
              </CTAButton>
              <CTAButton size="lg" variant="glass" href="#race" arrow={false} onClick={(e) => onAnchorClick(e, '#race')} className="max-sm:h-12 max-sm:px-4 max-sm:text-[14px]">
                Why speed wins
              </CTAButton>
            </div>
          </div>
        </div>
        <div className="intro-fade mt-10 md:mt-14" style={{ animationDelay: '0.2s' }}>
          <CallStage h={h} />
        </div>
      </div>
    </section>
  );
}

/** The race for a lead: the same evening inquiry, with and without Aurora. */
export function RxRace({ it }) {
  const r = it.v3.race;
  const reduce = !!useReducedMotion();
  return (
    <section id="race" data-nav-theme="light" aria-labelledby="rx-race-title" className="section relative">
      <div className="shell">
        <SectionHeader id="rx-race-title" eyebrow={r.eyebrow} titleA={r.titleA} titleB={r.titleB} text={r.text} layout="split" />
        <div className="mt-8 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-5">
          {r.lanes.map((lane) => {
            const fast = lane.key === 'aurora';
            const gap = fast ? 0.35 : 0.9;
            return (
              <motion.div
                key={lane.key}
                initial={reduce ? false : 'off'}
                whileInView="on"
                viewport={{ once: true, amount: 0.4 }}
                className={cn(
                  'relative overflow-hidden rounded-[24px] p-5 md:p-7',
                  fast ? 'bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)]' : 'bg-ink/[0.035] shadow-[0_0_0_1px_rgba(10,15,14,0.05)]'
                )}
              >
                {fast ? (
                  <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[-30%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.28),rgba(255,159,69,0))] blur-2xl" />
                ) : null}
                <p className={cn('relative flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium', fast ? 'bg-ink text-white' : 'bg-white text-ink/60 shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
                  {fast ? <img src="/brand/aurora-symbol-color.svg" alt="" width="14" height="14" className="h-3.5 w-3.5" /> : null}
                  {lane.label}
                </p>
                <ol className="relative mt-5 grid gap-4">
                  {/* the thread that joins the steps, drawn as they appear */}
                  <motion.span
                    aria-hidden="true"
                    variants={{ off: { scaleY: 0 }, on: { scaleY: 1, transition: { duration: gap * 3 + 0.4, ease: 'linear' } } }}
                    className={cn('absolute bottom-3 left-[5px] top-3 w-px origin-top', fast ? 'bg-[#F25C2A]/50' : 'border-l border-dashed border-ink/25')}
                  />
                  {lane.steps.map((s, i) => {
                    const lastBad = !fast && i === lane.steps.length - 1;
                    const lastGood = fast && i === lane.steps.length - 1;
                    return (
                      <motion.li
                        key={s.text}
                        variants={{ off: { opacity: 0, x: -6 }, on: { opacity: 1, x: 0, transition: { delay: i * gap, duration: 0.5, ease: EASE } } }}
                        className="relative grid grid-cols-[11px_1fr] items-start gap-3"
                      >
                        <span
                          className={cn(
                            'mt-[5px] h-[11px] w-[11px] rounded-full ring-4',
                            fast ? 'bg-[#F25C2A] ring-white' : 'bg-ink/30 ring-[#EFEEEA]',
                            lastGood && 'bg-[#2E9A58]',
                            lastBad && 'bg-[#C44B2B]'
                          )}
                        />
                        <span>
                          <span className={cn('t-data block text-[11.5px]', fast ? 'text-[#B4471A]' : 'text-ink/45')}>{s.time}</span>
                          <span className={cn('block text-[15px] leading-snug', lastBad ? 'text-[#A33E22]' : fast ? 'text-ink' : 'text-ink/70', (lastGood || lastBad) && 'font-medium')}>{s.text}</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </ol>
              </motion.div>
            );
          })}
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
