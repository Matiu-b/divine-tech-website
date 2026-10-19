import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import LiquidGlass from './primitives/LiquidGlass';

// A recorded call, played as a call: its clock, and the small glass box that shows it over a scene (a play button, the
// recording's waveform coloured by speaker, then live subtitles). Shared by the home page and the industry pages.

const SUB_WORDS = 7; // the call's subtitles show at most this many words at a time

export const clock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};

/**
 * The call's clock. Nothing plays until the visitor presses play: then the recording starts from the top and the
 * captions follow it, so every word appears as it is spoken. If the audio can't play, the captions run on their own.
 * status: idle (not started) -> playing <-> paused -> done (finished; play again starts over).
 */
export function useCallClock(c, { audioRef }) {
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

export const lastIndex = (list, t) => {
  let k = 0;
  list.forEach((x, i) => {
    if (t >= x.at) k = i;
  });
  return k;
};

/** Which slice of a line is on screen as a subtitle: the chunk of words that holds the word being spoken. */
export function subtitle(cap, t) {
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
export function CallOverlay({ c, clock: cc, reduce }) {
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

