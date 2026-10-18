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

/*
 * The town, drawn like a street map in a maps app: land, blocks of houses, white side streets and two wider gold
 * avenues, a park, street names on the roads. The brief changes it as Aurora speaks (its notes are the beats):
 * 0 the town; 1 the overnight requests drop in as pins; 2 the day's routes draw along the streets and van 7 shows;
 * 3 Rivera's job turns amber (the hours don't match); 4 it turns green (paid for what was worked);
 * 5 Ana is off on Friday, her route fades and Jake's route picks up her jobs.
 */
const XS = [0, 70, 200, 330, 455, 575, 640]; // streets running north-south
const YS = [0, 48, 132, 196, 282, 360]; // streets running east-west
const MAJOR_X = 200; // Oak Ave
const MAJOR_Y = 196; // Main St
const DIAG = 'M455 132 L640 20'; // Lakeview Rd

// a small deterministic jitter, so the houses don't sit in a perfect grid
const jit = (a, b) => ((Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1 + 1) % 1;

function Town({ m, beat, reduce }) {
  const on = (b) => beat >= b;
  const half = (v, major) => (major ? 6 : 4);
  const blocks = [];
  for (let c = 0; c < XS.length - 1; c += 1)
    for (let r = 0; r < YS.length - 1; r += 1) {
      const x0 = XS[c] + (c === 0 ? 0 : half(XS[c], XS[c] === MAJOR_X)) + 2;
      const x1 = XS[c + 1] - (c + 1 === XS.length - 1 ? 0 : half(XS[c + 1], XS[c + 1] === MAJOR_X)) - 2;
      const y0 = YS[r] + (r === 0 ? 0 : half(YS[r], YS[r] === MAJOR_Y)) + 2;
      const y1 = YS[r + 1] - (r + 1 === YS.length - 1 ? 0 : half(YS[r + 1], YS[r + 1] === MAJOR_Y)) - 2;
      blocks.push({ c, r, x0, x1, y0, y1, park: c === 3 && r === 1 });
    }
  const street = (d, major) => (
    <g key={d}>
      <path d={d} fill="none" stroke={major ? '#EDC66A' : '#DCD7CC'} strokeWidth={major ? 13 : 9} strokeLinecap="square" />
      <path d={d} fill="none" stroke={major ? '#FFE7A3' : '#FFFFFF'} strokeWidth={major ? 11 : 7} strokeLinecap="square" />
    </g>
  );
  const label = (text, x, y, rot = 0, tone = '#7C766B') => (
    <text key={text} x={x} y={y} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} textAnchor="middle" dominantBaseline="central" fontSize="6.6" fontWeight="500" letterSpacing="0.2" fill={tone} stroke="#fff" strokeWidth="2.2" paintOrder="stroke" fontFamily="inherit">
      {text}
    </text>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <rect width={W} height={H} fill="#F1EEE8" />
      {/* blocks: houses on most, a park on one */}
      {blocks.map((b) =>
        b.park ? (
          <g key={`${b.c}-${b.r}`}>
            <rect x={b.x0} y={b.y0} width={b.x1 - b.x0} height={b.y1 - b.y0} rx={3} fill="#CFE8C6" />
            <path d={`M${b.x0 + 18} ${b.y1 - 14} C${b.x0 + 40} ${b.y0 + 30} ${b.x1 - 40} ${b.y1 - 10} ${b.x1 - 16} ${b.y0 + 16}`} fill="none" stroke="#E9F3E3" strokeWidth="2.4" strokeDasharray="0.1 4" strokeLinecap="round" />
          </g>
        ) : (
          <g key={`${b.c}-${b.r}`}>
            {Array.from({ length: Math.max(1, Math.floor((b.x1 - b.x0) / 22)) }, (_, i) =>
              [0, 1].map((j) => {
                const cols = Math.max(1, Math.floor((b.x1 - b.x0) / 22));
                const w = (b.x1 - b.x0) / cols - 5 - jit(b.c * 7 + i, b.r * 3 + j) * 4;
                const hh = Math.min(16, (b.y1 - b.y0) / 2 - 4) - jit(i + b.r, j + b.c) * 4;
                if (hh < 6) return null;
                const x = b.x0 + i * ((b.x1 - b.x0) / cols) + 2;
                const y = j ? b.y1 - hh - 2 : b.y0 + 2;
                return <rect key={`${i}${j}`} x={x} y={y} width={w} height={hh} rx={1.5} fill="#E5E1D9" stroke="#DAD5CA" strokeWidth="0.6" />;
              })
            )}
          </g>
        )
      )}
      {/* side streets, then the avenues on top */}
      {XS.slice(1, -1).filter((x) => x !== MAJOR_X).map((x) => street(`M${x} 0 V${H}`, false))}
      {YS.slice(1, -1).filter((y) => y !== MAJOR_Y).map((y) => street(`M0 ${y} H${W}`, false))}
      {street(`M${MAJOR_X} 0 V${H}`, true)}
      {street(`M0 ${MAJOR_Y} H${W}`, true)}
      {street(DIAG, true)}
      {/* names, the way a maps app writes them on the road */}
      {label('Main St', 590, MAJOR_Y)}
      {label('Main St', 120, MAJOR_Y)}
      {label('Oak Ave', MAJOR_X, 24, -90)}
      {label('Oak Ave', MAJOR_X, 322, -90)}
      {label('Lakeview Rd', 545, 77.5, -31.2)}
      {label('Elm St', 520, 132)}
      {label('Birch St', 395, 282)}
      {label('Cedar St', 330, 240, -90)}
      {label('Park Ln', 575, 320, -90)}
      {label('Riverside Park', 392, 90, 0, '#3E7D4A')}

      {/* the routes: drawn along the streets when Aurora says they are set, with a white edge like a maps app */}
      {m.routes.map((r, i) => {
        const faded = r.key === 'ana' && on(5);
        return (
          <g key={r.key}>
            <motion.path d={r.d} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on(2) ? 1 : 0, opacity: faded ? 0 : 1 }} transition={{ duration: reduce ? 0 : 1.3, ease: EASE, delay: reduce || !on(2) ? 0 : i * 0.35 }} />
            <motion.path
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={faded ? '1 7' : undefined}
              initial={false}
              animate={{ pathLength: on(2) ? 1 : 0, opacity: faded ? 0.45 : 1 }}
              transition={{ duration: reduce ? 0 : 1.3, ease: EASE, delay: reduce || !on(2) ? 0 : i * 0.35 }}
            />
            {r.stops.map(([x, y], j) => (
              <motion.g key={j} initial={false} animate={{ opacity: on(2) ? (faded ? 0.45 : 1) : 0, scale: on(2) ? 1 : 0.4 }} style={{ transformOrigin: `${x}px ${y}px` }} transition={{ duration: reduce ? 0 : 0.35, delay: reduce || !on(2) ? 0 : 0.7 + i * 0.35 + j * 0.12 }}>
                <circle cx={x} cy={y} r={7} fill="#fff" stroke={r.color} strokeWidth={2.4} />
                <text x={x} y={y + 0.4} textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="700" fill={r.color} fontFamily="inherit">
                  {j + 1}
                </text>
              </motion.g>
            ))}
          </g>
        );
      })}
      {/* Ana's Friday, picked up by Jake */}
      <motion.path d={m.handover} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on(5) ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: reduce ? 0 : 0.3 }} />
      <motion.path d={m.handover} fill="none" stroke={m.routes[0].color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on(5) ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: reduce ? 0 : 0.3 }} />

      {/* overnight requests: map pins */}
      {m.pins.map(([x, y], i) => (
        <motion.g key={i} initial={false} animate={{ opacity: on(1) ? 1 : 0, y: on(1) ? 0 : -10 }} transition={{ duration: reduce ? 0 : 0.4, ease: EASE, delay: reduce || !on(1) ? 0 : i * 0.1 }}>
          <ellipse cx={x} cy={y + 0.5} rx={3} ry={1.2} fill="#0A0F0E" fillOpacity={0.18} />
          <path d={`M${x} ${y} C${x - 2} ${y - 4} ${x - 6} ${y - 7} ${x - 6} ${y - 11} A6 6 0 1 1 ${x + 6} ${y - 11} C${x + 6} ${y - 7} ${x + 2} ${y - 4} ${x} ${y} Z`} fill="#F25C2A" stroke="#C94416" strokeWidth="0.6" />
          <circle cx={x} cy={y - 11} r={2.2} fill="#fff" />
        </motion.g>
      ))}
      {/* the yard, where every route starts */}
      <g>
        <circle cx={m.yard[0]} cy={m.yard[1]} r={11} fill="#0A0F0E" stroke="#fff" strokeWidth={2.5} />
        <path d={`M${m.yard[0] - 5} ${m.yard[1] + 4} V${m.yard[1] - 1.5} L${m.yard[0]} ${m.yard[1] - 6} L${m.yard[0] + 5} ${m.yard[1] - 1.5} V${m.yard[1] + 4} Z`} fill="#fff" />
      </g>
    </svg>
  );
}

/** Where a point of the town sits on the frame: the map keeps its proportions and covers the frame, cropped evenly. */
function useCover(ref) {
  const [box, setBox] = React.useState({ s: 1, ox: 0, oy: 0, w: W, h: H });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.max(w / W, h / H);
      setBox({ s, ox: (w - W * s) / 2, oy: (h - H * s) / 2, w, h });
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

/** A small tag pinned to a point on the map. */
function Tag({ at, box, tone = 'ink', children, show }) {
  const tones = { ink: 'bg-ink text-white', amber: 'bg-[#FFF1E6] text-[#9A3A12] shadow-[0_0_0_1px_rgba(242,92,42,0.35)]', green: 'bg-[#E4F4E8] text-[#1F7A4C] shadow-[0_0_0_1px_rgba(20,163,107,0.3)]', white: 'bg-white text-ink' };
  // near an edge the tag opens inward, so it is never cut off (the position sits on a plain span; the motion is inside)
  const x = at[0] * box.s + box.ox;
  const y = at[1] * box.s + box.oy;
  const shift = x > box.w * 0.62 ? '-translate-x-[88%]' : x < box.w * 0.34 ? '-translate-x-[12%]' : '-translate-x-1/2';
  return (
    <span className={cn('pointer-events-none absolute z-[2] -translate-y-[calc(100%+12px)]', shift)} style={{ left: x, top: y }}>
      <AnimatePresence>
        {show ? (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={cn('block whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium shadow-[0_6px_16px_-8px_rgba(10,15,14,0.35)] sm:text-[12px]', tones[tone])}
          >
            {children}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
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
  const frame = useRef(null);
  const box = useCover(frame);
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
          {/* the map: it keeps its proportions and covers the frame; the tags follow it */}
          <div ref={frame} className="canvas relative aspect-square overflow-hidden bg-[#F1EEE8] shadow-[0_0_0_1px_rgba(10,15,14,0.08),0_30px_60px_-40px_rgba(60,50,30,0.45)] sm:aspect-[16/9] lg:aspect-[16/8]">
            <div className="absolute" style={{ left: box.ox, top: box.oy, width: W * box.s, height: H * box.s }}>
              <Town m={m} beat={beat} reduce={reduce} />
            </div>
            <Tag at={m.van} box={box} show={beat >= 2} tone="white">
              {m.labels.van}
            </Tag>
            <Tag at={m.job} box={box} show={beat === 3} tone="amber">
              {m.labels.held}
            </Tag>
            <Tag at={m.job} box={box} show={beat >= 4} tone="green">
              {m.labels.paid}
            </Tag>
            <Tag at={m.friday} box={box} show={beat >= 5} tone="ink">
              {m.labels.friday}
            </Tag>

            {/* the search bar of a maps app: whose map this is, and whose route is whose */}
            <div className="absolute left-3 top-3 flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-2 pr-3.5 shadow-[0_2px_6px_rgba(10,15,14,0.14)] sm:left-4 sm:top-4">
              <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="h-[18px] w-[18px]" />
              <span className="text-[12.5px] font-medium text-ink">{m.labels.title}</span>
              <span className="h-4 w-px bg-ink/10 max-sm:hidden" />
              <span className="flex items-center gap-2.5 max-sm:hidden">
                {m.routes.map((r) => (
                  <span key={r.key} className="flex items-center gap-1 text-[11.5px] text-ink/70">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.who}
                  </span>
                ))}
              </span>
            </div>

            {/* map controls, for the look of it */}
            <div className="pointer-events-none absolute bottom-4 right-3 hidden flex-col items-end gap-2 sm:right-4 sm:flex" aria-hidden="true">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(10,15,14,0.14)]">
                <svg viewBox="0 0 16 16" className="h-4 w-4">
                  <path d="M8 2 L10.5 8 H5.5 Z" fill="#F25C2A" />
                  <path d="M8 14 L5.5 8 H10.5 Z" fill="#B8B2A6" />
                </svg>
              </span>
              <span className="flex w-8 flex-col overflow-hidden rounded-[8px] bg-white text-[16px] leading-none text-ink/60 shadow-[0_2px_6px_rgba(10,15,14,0.14)]">
                <span className="flex h-8 items-center justify-center">+</span>
                <span className="mx-1.5 h-px bg-ink/10" />
                <span className="flex h-8 items-center justify-center">−</span>
              </span>
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
