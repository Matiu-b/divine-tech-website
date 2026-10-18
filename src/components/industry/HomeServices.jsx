import React, { useEffect, useRef } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Database, Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hsClosing, hsHero as H } from '@/data/homeServices';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import { RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { clock, lastIndex, subtitle, useCallClock } from '@/components/home-v2/CallBox';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick, useInViewport, usePageVisible } from '@/components/home-v2/hooks';
import Closing from '@/components/home-v2/Closing';

const EASE = [0.22, 1, 0.36, 1];

/**
 * The hero card: the after-hours call that sent the technician in the photo. Before it plays, one large play button;
 * then live subtitles word by word, the recording's waveform coloured by speaker, and under it what lands in the
 * team's systems as the call goes. It pauses when the hero leaves the screen.
 */
function HeroCall({ c, reduce, active }) {
  const audioRef = useRef(null);
  const cc = useCallClock(c, { audioRef });
  const { t, status, play } = cc;
  const live = status === 'playing' || status === 'paused';
  useEffect(() => {
    if (!active && status === 'playing') play();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const sub = subtitle(cap, t);
  const speaking = status === 'playing' && t >= cap.at && t <= cap.end + 150 ? cap.who : null;
  const note = status === 'idle' ? null : c.notes[lastIndex(c.notes, t)];
  const bars = c.wave.filter((_, i) => i % 2 === 0);
  const n = bars.length;
  const whoAt = (ms) => {
    const x = c.captions.find((q) => ms >= q.at - 150 && ms <= q.end + 150);
    return x ? x.who : null;
  };
  const played = live || status === 'done' ? t : -1;

  return (
    <LiquidGlass className="rounded-[22px] p-3.5 sm:p-4" style={{ '--lg-tint-a': 'rgba(255,252,247,0.9)', '--lg-tint-b': 'rgba(255,249,241,0.82)' }}>
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
          {speaking === 'aurora' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/25" /> : null}
          <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="relative h-[18px] w-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium leading-tight text-ink">{c.title}</span>
          <span className="block truncate text-[12px] text-slate">{c.sub}</span>
        </span>
        <span className="shrink-0 text-[12.5px] font-medium tabular-nums text-ink/55">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
      </div>

      {/* the call: a play button until it starts, then the line being spoken */}
      <div className="mt-3 flex h-[64px] items-center gap-3">
        <button
          type="button"
          onClick={play}
          aria-label={status === 'playing' ? c.pause : status === 'paused' ? c.resume : status === 'done' ? c.again : c.listen}
          className={cn(
            'relative flex shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105',
            live ? 'h-11 w-11 bg-ink' : 'h-14 w-14 bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] shadow-[0_12px_28px_-10px_rgba(242,92,42,0.75)]'
          )}
        >
          {status === 'idle' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" /> : null}
          {status === 'playing' ? <Pause className="relative h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className={cn('relative ml-0.5 fill-current', live ? 'h-4 w-4' : 'h-5 w-5')} strokeWidth={2.2} aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          {live ? (
            <>
              <p className={cn('flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.07em]', cap.who === 'aurora' ? 'text-[#B4471A]' : 'text-slate')}>
                {cap.who === 'aurora' ? 'Aurora' : c.caller}
                {cap.cue ? <span className="font-normal normal-case italic tracking-normal text-ink/40">[{cap.cue}]</span> : null}
              </p>
              <p className="mt-0.5 h-[40px] overflow-hidden text-[14.5px] leading-[1.35] text-ink" aria-live="off">
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
              <p className="text-[16px] font-medium leading-tight tracking-[-0.01em] text-ink">{status === 'done' ? c.again : c.listen}</p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-slate">
                <Volume2 className="h-3.5 w-3.5 shrink-0 text-[#B4471A]" strokeWidth={2.2} aria-hidden="true" />
                {c.prompt} · {c.meta}
              </p>
            </>
          )}
        </div>
      </div>

      {/* the recording: one bar per slice, coloured by who is talking, brighter once played */}
      <div className="mt-2.5 flex h-6 items-center gap-[2px]" aria-hidden="true">
        {bars.map((v, i) => {
          const ms = ((i + 0.5) / n) * c.duration;
          const who = whoAt(ms);
          return (
            <span
              key={i}
              className={cn('min-w-0 flex-1 rounded-full transition-opacity duration-200', who === 'aurora' ? 'bg-[#F25C2A]' : who ? 'bg-ink' : 'bg-ink/30', played < 0 ? 'opacity-45' : played >= ms ? 'opacity-100' : 'opacity-20')}
              style={{ height: Math.max(14, v * 100) + '%' }}
            />
          );
        })}
      </div>

      {/* what lands in the team's systems while she talks */}
      <div className="mt-3 flex h-[42px] items-center gap-2.5 rounded-[14px] bg-white/75 px-3 shadow-[0_1px_2px_rgba(10,15,14,0.05)]" aria-live="polite">
        <Database className="h-4 w-4 shrink-0 text-[#14A36B]" strokeWidth={2} aria-hidden="true" />
        <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-[0.07em] text-[#14A36B]">{c.team}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={note ? note.at : 'wait'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className={cn('min-w-0 truncate text-[12.5px]', note ? 'font-medium text-ink' : 'text-slate')}>
            {note ? note.text : c.waiting}
          </motion.span>
        </AnimatePresence>
      </div>
      <audio ref={audioRef} src={c.audio} preload="none" onEnded={cc.ended} />
      <p className="sr-only">{c.captions.map((q) => (q.who === 'aurora' ? 'Aurora: ' : c.caller + ': ') + q.text).join(' ')}</p>
    </LiquidGlass>
  );
}

/**
 * Hero: one cinematic frame, a technician walking up to a customer's door at dusk. The promise sits in the sky; the card
 * plays the after-hours call that booked him, with what the team sees as it goes. Phones: the promise, then the photo
 * with the card under its bottom edge. The photo takes a looping clip when there is one.
 * The photo takes a looping clip when there is one.
 */
export function HsHero() {
  const { open } = useLead();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const m = H.media;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && visible) v.play().catch(() => {});
    else v.pause();
  }, [inView, visible]);

  const btn = 'max-sm:h-12 max-sm:px-4 max-sm:text-[14.5px] lg:h-12 lg:px-5 lg:text-[15px]';
  return (
    <section id="top" data-nav-theme="light" aria-labelledby="hs-hero-title" className="relative overflow-hidden pb-[clamp(56px,6vw,88px)] pt-[calc(var(--nav-h)+6px)] min-[560px]:pt-[calc(var(--nav-h)+16px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        {/*
          One cinematic frame, as tall as the screen allows on laptops: the promise in the dusk sky at the top left, the
          call card at the bottom right over the lawn. Phones: the promise above, the photo, the panel under its edge.
        */}
        <div ref={ref} className="relative">
          <div className="relative min-[560px]:aspect-[4/5] min-[560px]:overflow-hidden min-[560px]:rounded-[28px] min-[560px]:shadow-[0_40px_80px_-48px_rgba(30,30,60,0.55)] md:aspect-square lg:aspect-auto lg:h-[clamp(600px,calc(100svh_-_var(--nav-h)_-_40px),860px)]">
            <div className="relative z-[2] min-[560px]:absolute min-[560px]:inset-x-0 min-[560px]:top-0 min-[560px]:p-8 lg:p-10 lg:pr-[46%] xl:p-12 xl:pr-[48%]">
              <p className="intro-rise eyebrow min-[560px]:text-white/75">{H.eyebrow}</p>
              <h1 id="hs-hero-title" className="t-display balance mt-3 max-[559px]:text-[2.35rem] max-[559px]:leading-[1.04] min-[560px]:text-white min-[560px]:[text-shadow:0_2px_24px_rgba(10,16,40,0.35)] lg:text-[clamp(2.3rem,0.4rem+2.8vw,3.6rem)]">
                <RevealLines lines={[H.titleA, H.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
              </h1>
              <p className="intro-slide t-lead pretty mt-4 max-w-[34em] min-[560px]:!text-white/[0.88] lg:text-[16px] lg:leading-[1.55]" style={{ animationDelay: '0.3s' }}>
                <span className="sm:hidden">{H.textShort}</span>
                <span className="max-sm:hidden">{H.text}</span>
              </p>
              <div className="intro-slide mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 lg:mt-7" style={{ animationDelay: '0.42s' }}>
                <CTAButton size="lg" onClick={open} className={btn}>
                  Book a demo
                </CTAButton>
                <CTAButton size="lg" variant="glass" href={H.secondaryHref} arrow={false} onClick={(e) => onAnchorClick(e, H.secondaryHref)} className={btn}>
                  {H.secondary}
                </CTAButton>
              </div>
            </div>

            <figure className="intro-rise relative m-0 mt-5 aspect-[16/9] overflow-hidden rounded-[24px] bg-[#2B3550] max-[559px]:shadow-[0_30px_60px_-40px_rgba(30,30,60,0.55)] min-[560px]:absolute min-[560px]:inset-0 min-[560px]:mt-0 min-[560px]:aspect-auto min-[560px]:rounded-none" style={{ animationDelay: '0.2s' }}>
              <img
                src={m.poster}
                srcSet={m.srcSet}
                sizes="(min-width: 1440px) 1376px, calc(100vw - 32px)"
                alt={m.alt}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full origin-[50%_74%] scale-[1.45] object-cover min-[560px]:scale-100"
                style={{ objectPosition: m.focus }}
              />
              {m.video && !reduce ? (
                <video ref={videoRef} src={m.video} poster={m.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: m.focus }} />
              ) : null}
              {/* dusk shade: deeper behind the headline, a little along the bottom */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(14,20,44,0.55)_0%,rgba(14,20,44,0.18)_38%,rgba(14,20,44,0)_58%,rgba(14,20,44,0.28)_100%)] min-[560px]:block" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(60%_55%_at_0%_0%,rgba(14,20,44,0.45),rgba(14,20,44,0))] lg:block" />
            </figure>

            <div className="relative z-[3] mx-3 -mt-6 min-[560px]:absolute min-[560px]:bottom-5 min-[560px]:right-5 min-[560px]:mx-0 min-[560px]:mt-0 min-[560px]:w-[330px] lg:bottom-8 lg:right-8 lg:w-[400px] xl:w-[420px]">
              <HeroCall c={H.call} reduce={reduce} active={inView && visible} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** What happens after the form, in three short beats (under the closing headline). */
function NextSteps({ grow }) {
  return (
    <ol className="grid gap-3">
      {hsClosing.next.map((x, i) => (
        <li
          key={x.text}
          className="flex items-center gap-4 transition-all duration-700"
          style={{ opacity: grow ? 1 : 0, transform: grow ? 'none' : 'translateY(8px)', transitionDelay: `${0.2 + i * 0.15}s` }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[13px] font-medium text-white">{i + 1}</span>
          <span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#FFC857]/80">{x.time}</span>
            <span className="block text-[16px] text-white/85">{x.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function HsClosing({ it }) {
  return <Closing c={hsClosing} industry={it.leadIndustry} art={(grow) => <NextSteps grow={grow} />} />;
}
