import React, { useEffect, useRef } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { clock, lastIndex, subtitle, useCallClock } from '@/components/home-v2/CallBox';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';

const EASE = [0.22, 1, 0.36, 1];
const W = 640;
const H = 360;
const pct = (x, y) => ({ left: (x / W) * 100 + '%', top: (y / H) * 100 + '%' });

/*
 * The town on one map, drawn as the brief is spoken. Each beat of the brief (its notes) changes the map:
 * 0 the yard and the streets; 1 the overnight requests land as pins; 2 the day's routes draw and van 7 lights up;
 * 3 Rivera's job turns amber (the hours don't match); 4 it turns green (paid for what was worked);
 * 5 Ana's Friday is off, her route fades and Jake picks it up.
 */
function Town({ m, beat, reduce }) {
  const on = (b) => beat >= b;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width={W} height={H} fill="#F7F3EA" />
      {/* blocks between the streets, each with its houses; one block is a park */}
      {Array.from({ length: 7 }, (_, c) =>
        Array.from({ length: 5 }, (_, r) => {
          const x = c * 90 + 7;
          const y = r * 72 + 7;
          const park = c === 3 && r === 1;
          return (
            <g key={`${c}-${r}`}>
              <rect x={x} y={y} width={76} height={58} rx={6} fill={park ? '#DCEAD9' : '#EEE8DC'} />
              {park
                ? [
                    [18, 16],
                    [40, 30],
                    [58, 14],
                    [26, 42],
                    [56, 44],
                  ].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={6} fill="#C5DCC1" />)
                : [0, 1, 2, 3].flatMap((i) =>
                    [0, 1].map((j) => <rect key={`${i}${j}`} x={x + 6 + i * 17} y={y + (j ? 33 : 6)} width={13} height={19} rx={2.5} fill="#E3DCCD" />)
                  )}
            </g>
          );
        })
      )}
      {/* a few street names, so it reads as a town */}
      {[
        ['Maple St', 316, 69, 0],
        ['Oak Ave', 87, 112, -90],
        ['Pine Ave', 447, 336, -90],
      ].map(([n, x, y, rot]) => (
        <text key={n} x={x} y={y} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} fontSize="7.5" letterSpacing="0.6" fill="#0A0F0E" fillOpacity="0.32" fontFamily="inherit">
          {n.toUpperCase()}
        </text>
      ))}
      {/* the routes: faint before the brief, drawn when Aurora says they are set */}
      {m.routes.map((r, i) => {
        const faded = r.key === 'ana' && on(5);
        return (
          <g key={r.key}>
            <path d={r.d} fill="none" stroke={r.color} strokeOpacity={0.14} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <motion.path
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={faded ? '2 8' : undefined}
              initial={false}
              animate={{ pathLength: on(2) ? 1 : 0, opacity: faded ? 0.35 : 1 }}
              transition={{ duration: reduce ? 0 : 1.2, ease: EASE, delay: reduce || !on(2) ? 0 : i * 0.35 }}
            />
            {r.stops.map(([x, y], j) => (
              <motion.circle
                key={j}
                cx={x}
                cy={y}
                r={6}
                fill="#fff"
                stroke={r.color}
                strokeWidth={2.5}
                initial={false}
                animate={{ opacity: on(2) ? (faded ? 0.35 : 1) : 0, scale: on(2) ? 1 : 0.4 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
                transition={{ duration: reduce ? 0 : 0.35, delay: reduce || !on(2) ? 0 : 0.6 + i * 0.35 + j * 0.1 }}
              />
            ))}
          </g>
        );
      })}
      {/* Ana's Friday, picked up by Jake */}
      <motion.path
        d={m.handover}
        fill="none"
        stroke={m.routes[0].color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: on(5) ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: reduce ? 0 : 0.3 }}
      />
      {/* overnight requests */}
      {m.pins.map(([x, y], i) => (
        <motion.g key={i} initial={false} animate={{ opacity: on(1) ? 1 : 0, y: on(1) ? 0 : -8 }} transition={{ duration: reduce ? 0 : 0.35, delay: reduce || !on(1) ? 0 : i * 0.12 }}>
          <circle cx={x} cy={y} r={5} fill="#F25C2A" />
          <circle cx={x} cy={y} r={9} fill="#F25C2A" fillOpacity={0.18} />
        </motion.g>
      ))}
      {/* the yard */}
      <rect x={m.yard[0] - 11} y={m.yard[1] - 11} width={22} height={22} rx={6} fill="#0A0F0E" />
      <path d={`M${m.yard[0] - 5} ${m.yard[1] + 4} V${m.yard[1] - 2} L${m.yard[0]} ${m.yard[1] - 6} L${m.yard[0] + 5} ${m.yard[1] - 2} V${m.yard[1] + 4} Z`} fill="#fff" />
    </svg>
  );
}

/** A small tag pinned to a point on the map. */
function Tag({ at, tone = 'ink', children, show }) {
  const tones = { ink: 'bg-ink text-white', amber: 'bg-[#FFF1E6] text-[#9A3A12] shadow-[0_0_0_1px_rgba(242,92,42,0.35)]', green: 'bg-[#E4F4E8] text-[#1F7A4C] shadow-[0_0_0_1px_rgba(20,163,107,0.3)]', white: 'bg-white text-ink' };
  return (
    <AnimatePresence>
      {show ? (
        <motion.span
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={cn('pointer-events-none absolute z-[2] -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium shadow-[0_6px_16px_-8px_rgba(10,15,14,0.35)] sm:text-[12px]', tones[tone])}
          style={pct(at[0], at[1])}
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Hear Aurora brief the owner: one map of the town and one small player. The map is what the team's systems hold, and
 * it changes as Aurora speaks: the overnight bookings land, the routes draw, the invoice that doesn't match turns amber
 * and then green, and Ana's Friday moves to Jake. Before it plays, the map shows the town and a large play button.
 */
export default function BriefMap({ d }) {
  const call = d.calls[0];
  const c = call.call;
  const m = d.map;
  const ref = useRef(null);
  const audioRef = useRef(null);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.2 });
  const visible = usePageVisible();
  const cc = useCallClock(c, { audioRef });
  const { t, status, play } = cc;
  const live = status === 'playing' || status === 'paused';

  useEffect(() => {
    if ((!inView || !visible) && status === 'playing') play();
  }, [inView, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // before the brief: the town as it is; after it: everything it changed
  const beat = status === 'idle' ? 0 : status === 'done' ? c.notes.length - 1 : lastIndex(c.notes, t);
  const k = lastIndex(c.captions, t);
  const cap = c.captions[k];
  const sub = subtitle(cap, t);

  return (
    <section id="hear" data-nav-theme="light" aria-labelledby="hear-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="hear-title"
          titleA={d.titleA}
          text={
            <>
              <span className="sm:hidden">{d.textShort}</span>
              <span className="max-sm:hidden">{d.text}</span>
            </>
          }
          layout="split"
        >
          {/* laptops: the player sits under the intro, so the map stays clear */}
          <div className="mt-5 max-lg:hidden">
            <Player c={c} cc={cc} live={live} cap={cap} sub={sub} reduce={reduce} />
          </div>
        </SectionHeader>

        <div ref={ref} className="relative mt-5 sm:mt-8 md:mt-12">
          {/* the map */}
          <div className="canvas relative aspect-[4/3] overflow-hidden shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_30px_60px_-40px_rgba(90,50,20,0.45)] sm:aspect-[16/9] lg:aspect-[16/7]">
            <Town m={m} beat={beat} reduce={reduce} />
            <Tag at={m.van} show={beat >= 2} tone="white">
              {m.labels.van}
            </Tag>
            <Tag at={m.job} show={beat === 3} tone="amber">
              {m.labels.held}
            </Tag>
            <Tag at={m.job} show={beat >= 4} tone="green">
              {m.labels.paid}
            </Tag>
            <Tag at={m.friday} show={beat >= 5} tone="ink">
              {m.labels.friday}
            </Tag>

            {/* what the map is, and who drives which route */}
            <div className="absolute left-3 top-3 rounded-[14px] bg-white/85 px-3 py-2 shadow-[0_1px_2px_rgba(10,15,14,0.08)] backdrop-blur-sm sm:left-4 sm:top-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-ink/50">{m.labels.title}</p>
              <ul className="mt-1 grid gap-0.5 max-sm:hidden">
                {m.routes.map((r) => (
                  <li key={r.key} className="flex items-center gap-2 text-[12px] text-ink">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.who}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-[12px] text-ink">
                  <span className="h-2 w-2 rounded-full bg-[#F25C2A] opacity-60" />
                  {m.labels.pins}
                </li>
              </ul>
            </div>

          </div>
          {/* phones and tablets: the player just under the map's bottom edge */}
          <div className="relative z-[2] mx-3 -mt-8 sm:mx-auto sm:w-[460px] lg:hidden">
            <Player c={c} cc={cc} live={live} cap={cap} sub={sub} reduce={reduce} />
          </div>
          <audio ref={audioRef} src={c.audio} preload="none" onEnded={cc.ended} />
        </div>
        <p className="mt-4 text-[12px] text-slate">{d.note}</p>

        <div className="sr-only">
          <p>
            {call.name}. {call.sentence}
          </p>
          <p>{c.captions.map((q) => (q.who === 'aurora' ? 'Aurora: ' : c.caller + ': ') + q.text).join(' ')}</p>
        </div>
      </div>
    </section>
  );
}

/** The brief's player: a play button, then the line being spoken, word by word. */
function Player({ c, cc, live, cap, sub, reduce }) {
  const { t, status, play } = cc;
  return (
    <LiquidGlass className="flex h-[76px] items-center gap-3 rounded-[20px] px-3.5" style={{ '--lg-tint-a': 'rgba(255,252,247,0.92)', '--lg-tint-b': 'rgba(255,249,241,0.86)' }}>
      <button
        type="button"
        onClick={play}
        aria-label={status === 'playing' ? c.pause : status === 'paused' ? c.resume : status === 'done' ? c.again : c.listen}
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105',
          live ? 'h-11 w-11 bg-ink' : 'h-12 w-12 bg-[linear-gradient(140deg,#FF8A3D,#F25C2A)] shadow-[0_12px_28px_-10px_rgba(242,92,42,0.75)]'
        )}
      >
        {status === 'idle' && !reduce ? <span className="ring-ping absolute inset-0 rounded-full bg-[#F25C2A]/30" /> : null}
        {status === 'playing' ? <Pause className="relative h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" /> : <Play className="relative ml-0.5 h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" />}
      </button>
      <div className="min-w-0 flex-1">
        {live ? (
          <>
            <p className={cn('flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.07em]', cap.who === 'aurora' ? 'text-[#B4471A]' : 'text-slate')}>
              {cap.who === 'aurora' ? 'Aurora' : c.caller}
              {cap.cue ? <span className="truncate font-normal normal-case italic tracking-normal text-ink/40">[{cap.cue}]</span> : null}
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
            <p className="truncate text-[15.5px] font-medium leading-tight tracking-[-0.01em] text-ink">{status === 'done' ? c.again : c.listen}</p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-slate">
              <Volume2 className="h-3.5 w-3.5 shrink-0 text-[#B4471A]" strokeWidth={2.2} aria-hidden="true" />
              {c.prompt} · {c.meta}
            </p>
          </>
        )}
      </div>
      <span className="shrink-0 self-start pt-3 text-[12px] font-medium tabular-nums text-ink/55">{clock(live ? Math.min(t, c.duration) : c.duration)}</span>
    </LiquidGlass>
  );
}
