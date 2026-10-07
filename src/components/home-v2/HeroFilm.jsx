import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { CalendarDays, Check, Database, ListChecks, Mail, MessageCircle, MessagesSquare, Pause, PenLine, Phone, Play, ShieldCheck, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, heroFilm, media } from '@/data/site';
import Grow from './primitives/Grow';
import LiquidGlass from './primitives/LiquidGlass';
import MediaSlot from './primitives/MediaSlot';
import { EASE, EASE_IN_OUT } from './motion';
import { useInViewport, useMediaQuery, usePageVisible } from './hooks';

/*
 * Hero film: a scripted, interactive product sequence.
 *
 * The same request flow plays on four channels: listen → understand → act →
 * confirm, with one decision handed to a person. It is built like a motion
 * comp: fixed-size compositions (wide / tablet / phone) scaled to fit, one
 * linear clock driving every event, a slow camera pan with a key light, a
 * light sweep and text that streams in. Nothing reacts to hover: motion is
 * driven by the clock and by clicks only, so it stays steady under the mouse. Visitors can switch channels, approve the decision
 * themselves, take over the conversation, pause, or jump between chapters.
 * Reduced motion shows each scene's finished state.
 */

const SCENES = heroFilm.scenes;

// Shared timeline (ms).
const T = {
  line: [500, 4800, 5900, 8400, 13900],
  typing: [
    [3950, 4800],
    [7750, 8400],
    [13250, 13900],
  ],
  stepRun: [2200, 2800, 3400],
  stepDone: [2800, 3400, 4000],
  actRun: [6300, 6900, 7500],
  actDone: [6900, 7500, 8100],
  approvalPending: 9300,
  cursorIn: 11900,
  cursorClick: 12850,
  approvalDone: 12950,
  end: 17400,
};

const CHAPTERS = [
  { label: heroFilm.chapters[0], start: 0, end: 2000 },
  { label: heroFilm.chapters[1], start: 2000, end: 5900 },
  { label: heroFilm.chapters[2], start: 5900, end: 9300 },
  { label: heroFilm.chapters[3], start: 9300, end: T.end },
];

// Which groups the camera favours in each chapter (others dim slightly).
const FOCUS = [
  ['panel'],
  ['core', 'work', 'panel'],
  ['actions', 'audit', 'core', 'work'],
  ['approval', 'panel', 'audit'],
];

/*
 * Compositions (px at scale 1). The stage keeps each comp's aspect ratio and
 * scales it to the available width, the way a rendered video would.
 */
const COMPS = {
  wide: {
    w: 1200,
    h: 680,
    tabs: { x: 36, y: 26 },
    live: { x: 36, y: 28 },
    panel: { x: 36, y: 86, w: 384, h: 566 },
    core: { x: 482, y: 112, w: 290 },
    approval: { x: 482, y: 434, w: 320 },
    actions: { x: 850, y: 100, w: 314 },
    audit: { x: 850, y: 394, w: 314 },
    bar: { x: 482, y: 606, w: 682, h: 46 },
    flows: {
      in: ['M420,250 C500,250 520,206 627,206'],
      out: ['M627,206 C780,206 790,141 1007,141', 'M627,206 C780,206 790,237 1007,237', 'M627,206 C780,206 790,333 1007,333'],
      ok: ['M627,300 C627,380 642,420 642,494'],
    },
    focus: [
      [228, 369],
      [627, 250],
      [1007, 300],
      [642, 470],
    ],
    bounds: [36, 86, 1164, 652],
    safe: [12, 76, 1188, 676],
  },
  tablet: {
    w: 860,
    h: 720,
    tabs: { x: 24, y: 22 },
    live: { x: 24, y: 24 },
    panel: { x: 24, y: 76, w: 396, h: 562 },
    core: { x: 446, y: 76, w: 390 },
    actions: { x: 446, y: 278, w: 390 },
    approval: { x: 446, y: 528, w: 390 },
    bar: { x: 24, y: 656, w: 812, h: 44 },
    flows: null,
    focus: [
      [222, 357],
      [641, 170],
      [641, 397],
      [641, 584],
    ],
    bounds: [24, 76, 836, 638],
    safe: [10, 68, 850, 650],
  },
  phone: {
    w: 360,
    h: 680,
    tabs: { x: 12, y: 12 },
    panel: { x: 12, y: 58, w: 336, h: 288 },
    work: { x: 12, y: 356, w: 336 },
    approval: { x: 12, y: 566, w: 336 },
    bar: { x: 12, y: 642, w: 336, h: 28 },
    flows: null,
    focus: [
      [180, 202],
      [180, 300],
      [180, 456],
      [180, 597],
    ],
    bounds: [12, 58, 348, 628],
    safe: [5, 52, 355, 634],
  },
};

const CH = {
  chat: { icon: MessageCircle, chip: 'bg-[#E6F4EC] text-[#1C7A4F]' },
  voice: { icon: Phone, chip: 'bg-[#E4F2F0] text-[#0E6E66]' },
  web: { icon: MessagesSquare, chip: 'bg-[#ECEFF6] text-[#3B4A6B]' },
  email: { icon: Mail, chip: 'bg-[#F4EEE3] text-[#7A5A1E]' },
};

const SYS_ICON = { CRM: Database, Calendar: CalendarDays, Tasks: ListChecks };

/* ------------------------------------------------------------------ */
/* Clock + state                                                        */
/* ------------------------------------------------------------------ */

const speakDur = (text) => Math.min(3000, 500 + text.length * 30);

function computeState(scene, t) {
  const lines = T.line.filter((lt, i) => i < scene.lines.length && t >= lt).length;
  const typing = T.typing.some(([a, b]) => t >= a && t < b);
  const steps = T.stepRun.map((r, i) => (t >= T.stepDone[i] ? 'done' : t >= r ? 'run' : 'idle'));
  const actions = T.actRun.map((r, i) => (t >= T.actDone[i] ? 'done' : t >= r ? 'run' : 'idle'));
  const approval = t >= T.approvalDone ? 'done' : t >= T.approvalPending ? 'pending' : 'none';
  const cursor = t >= T.approvalDone + 900 ? 'off' : t >= T.cursorClick ? 'click' : t >= T.cursorIn ? 'move' : 'off';
  let chapter = 0;
  CHAPTERS.forEach((c, i) => {
    if (t >= c.start) chapter = i;
  });
  let speaking = null;
  for (let i = 0; i < lines; i += 1) {
    if (t < T.line[i] + speakDur(scene.lines[i].text)) speaking = scene.lines[i].who;
  }
  return { lines, typing, steps, actions, approval, cursor, chapter, speaking };
}

const sigOf = (s) => [s.lines, s.typing ? 1 : 0, s.steps.join(''), s.actions.join(''), s.approval, s.cursor, s.chapter, s.speaking || '-'].join('|');

/** One linear clock per film. Pause = stop, seek = set + replay. */
function useClock(endAt) {
  const time = useMotionValue(0);
  const ctl = useRef(null);
  const onEnd = useRef(null);
  const stop = useCallback(() => {
    if (ctl.current) ctl.current.stop();
    ctl.current = null;
  }, []);
  const play = useCallback(() => {
    stop();
    const from = Math.min(time.get(), endAt);
    ctl.current = animate(time, endAt, {
      duration: Math.max(0.001, (endAt - from) / 1000),
      ease: 'linear',
      onComplete: () => {
        ctl.current = null;
        if (onEnd.current) onEnd.current();
      },
    });
  }, [endAt, stop, time]);
  return { time, play, stop, onEnd };
}

/** Position of an element's centre inside `root`, in unscaled layout px. */
function centreWithin(el, root) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let n = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return n === root ? [x, y] : null;
}

/** Keeps the camera's framing inside the stage so no card is ever cut off. */
function frameCamera(c, z, x, y) {
  const [bx0, by0, bx1, by1] = c.bounds;
  const [sx0, sy0, sx1, sy1] = c.safe;
  const cx = c.w / 2;
  const cy = c.h / 2;
  const fit = (v, lo, hi) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
  return [fit(x, sx0 - (cx + z * (bx0 - cx)), sx1 - (cx + z * (bx1 - cx))), fit(y, sy0 - (cy + z * (by0 - cy)), sy1 - (cy + z * (by1 - cy)))];
}

const pseudo = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * True when the browser renders without a GPU (or the visitor asks for less):
 * the film then swaps glass blur for frosted solids and drops the heaviest layers.
 */
function detectLowPower() {
  try {
    const nav = /** @type {any} */ (navigator);
    if (nav.connection && nav.connection.saveData) return true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return true;
    const canvas = document.createElement('canvas');
    const gl = /** @type {WebGLRenderingContext | null} */ (canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }));
    if (!gl) return true;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Small parts                                                          */
/* ------------------------------------------------------------------ */

/** @param {any} props */
function Status({ state, size = 16 }) {
  if (state === 'done') {
    return (
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex shrink-0 items-center justify-center rounded-full bg-brand text-white"
        style={{ width: size, height: size }}
      >
        <Check strokeWidth={3} style={{ width: size * 0.62, height: size * 0.62 }} aria-hidden="true" />
      </motion.span>
    );
  }
  if (state === 'run') {
    return <span className="block shrink-0 animate-spin rounded-full border-[1.75px] border-brand/20 border-t-brand [animation-duration:0.9s]" style={{ width: size, height: size }} />;
  }
  return <span className="block shrink-0 rounded-full border-[1.5px] border-ink/15" style={{ width: size, height: size }} />;
}

function LiveDot({ className = '' }) {
  return (
    <span className={cn('relative flex h-2 w-2 shrink-0', className)}>
      <span className="absolute inset-0 animate-pulse-soft rounded-full bg-brand/50" />
      <span className="relative h-2 w-2 rounded-full bg-brand" />
    </span>
  );
}

/** Abstract activity ring: spins while Aurora works. */
/** @param {any} props */
function Ring({ active, done, small = false }) {
  return (
    <span className={cn('relative flex shrink-0 items-center justify-center', small ? 'h-6 w-6' : 'h-7 w-7')} aria-hidden="true">
      <span
        className={cn(
          'absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#3CE09A,#13A89C,rgba(19,168,156,0.08),#3CE09A)] transition-opacity duration-500',
          active ? 'animate-spin opacity-100 [animation-duration:2.2s]' : 'opacity-35'
        )}
      />
      <span className="absolute inset-[2.5px] rounded-full bg-white" />
      <span className={cn('relative h-2.5 w-2.5 rounded-full transition-colors duration-500', done ? 'bg-brand' : active ? 'bg-brand-glow' : 'bg-ink/20')} />
    </span>
  );
}

/** Words arrive one by one (Aurora's replies, live transcripts). */
/** @param {any} props */
function Stream({ text, step = 0.035, delay = 0.05, soft = true }) {
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: step, delayChildren: delay } } }}>
        {words.flatMap((w, i) => {
          const el = (
            <motion.span
              key={'w' + i}
              className="inline-block"
              variants={{
                h: soft ? { opacity: 0, y: 3, filter: 'blur(3px)' } : { opacity: 0, y: 3 },
                s: soft
                  ? { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.32, ease: EASE }, transitionEnd: { filter: 'none' } }
                  : { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          );
          return i < words.length - 1 ? [el, ' '] : [el];
        })}
      </motion.span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Conversation panels                                                  */
/* ------------------------------------------------------------------ */

/** @param {any} props */
function PanelHeader({ scene, phone, callTime, live }) {
  const ch = CH[scene.mode];
  const Icon = ch.icon;
  const web = scene.mode === 'web';
  return (
    <div className={cn('flex items-center gap-3 border-b border-ink/[0.07]', phone ? 'px-3.5 py-2.5' : 'px-4 py-3.5', web && 'border-transparent bg-ink text-white')}>
      {scene.mode === 'voice' ? (
        <span className={cn('relative flex shrink-0 items-center justify-center rounded-full bg-[#E4F2F0] text-[#0E6E66]', phone ? 'h-8 w-8' : 'h-9 w-9')}>
          {live ? <span className="ring-ping absolute inset-0 rounded-full bg-[#13A89C]/30" /> : null}
          <Phone className="relative h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : web ? (
        <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-white/10', phone ? 'h-8 w-8' : 'h-9 w-9')}>
          <UserRound className="h-4 w-4 text-white/80" strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(140deg,#E9E4DA,#D9D2C4)] font-semibold text-ink/70',
            phone ? 'h-8 w-8 text-[11px]' : 'h-9 w-9 text-[12px]'
          )}
        >
          {scene.initials}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-semibold leading-tight tracking-[-0.01em]', phone ? 'text-[12.5px]' : 'text-[13.5px]')}>
          {scene.mode === 'email' ? scene.subject : scene.contact}
        </p>
        <p className={cn('truncate', phone ? 'text-[10.5px]' : 'text-[11.5px]', web ? 'text-white/55' : 'text-slate')}>
          {scene.mode === 'voice' ? (
            <>
              Inbound call · <motion.span className="tabular-nums">{callTime}</motion.span>
            </>
          ) : scene.mode === 'email' ? (
            scene.contact + ' · ' + scene.sub
          ) : (
            scene.sub
          )}
        </p>
      </div>
      <span className={cn('ui-chip shrink-0', web ? 'bg-white/10 text-white' : ch.chip)}>
        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
        {phone ? null : scene.channel}
      </span>
    </div>
  );
}

/** @param {any} props */
function PanelFooter({ scene, phone, takeover, onTakeover }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 border-t border-ink/[0.07]', phone ? 'px-3.5 py-1.5' : 'px-4 py-2.5')}>
      <span className={cn('flex min-w-0 items-center gap-2 text-graphite', phone ? 'text-[10.5px]' : 'text-[11.5px]')}>
        {takeover ? <span className="h-2 w-2 shrink-0 rounded-full bg-ink" /> : <LiveDot />}
        <span className="truncate">{takeover ? 'You are in the conversation' : brand.product + (scene.mode === 'voice' ? ' is on the call' : ' is handling this')}</span>
      </span>
      <button
        type="button"
        onClick={onTakeover}
        aria-pressed={takeover}
        className={cn(
          'shrink-0 rounded-full font-semibold transition-colors',
          phone ? 'px-2 py-1 text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]',
          takeover ? 'bg-ink text-white hover:bg-[#1D2625]' : 'text-ink hover:bg-ink/[0.06]'
        )}
      >
        {takeover ? 'Hand back' : 'Take over'}
      </button>
    </div>
  );
}

function TypingDots() {
  return (
    <Grow>
      <div className="flex justify-end pt-2.5">
        <span className="flex items-center gap-1 rounded-[16px] rounded-br-[6px] bg-ink px-3.5 py-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-blink rounded-full bg-white/80" style={{ animationDelay: i * 0.18 + 's' }} />
          ))}
        </span>
      </div>
    </Grow>
  );
}

/** @param {any} props */
function ChatBody({ scene, st, phone, reduce }) {
  const shown = scene.lines.slice(0, st.lines);
  return (
    <div className={cn('absolute inset-0 flex flex-col justify-end [mask-image:linear-gradient(to_bottom,transparent,#000_16%)]', phone ? 'px-3 pb-3' : 'px-4 pb-4')}>
      <AnimatePresence initial={false}>
        {shown.map((l, i) => {
          const mine = l.who === 'aurora';
          return (
            <Grow key={scene.key + i}>
              <div className={cn('flex flex-col pt-2.5', mine ? 'items-end' : 'items-start')}>
                {mine ? <span className="mb-1 mr-1 text-[10.5px] font-medium text-slate">{brand.product}</span> : null}
                <span
                  className={cn(
                    'max-w-[86%] px-3.5 py-2.5 leading-[1.45] tracking-[-0.005em]',
                    phone ? 'text-[12.5px]' : 'text-[13.5px]',
                    mine ? 'rounded-[16px] rounded-br-[6px] bg-ink text-white' : 'rounded-[16px] rounded-bl-[6px] bg-[#F1EFE9] text-ink'
                  )}
                >
                  {mine && !reduce ? <Stream text={l.text} soft={!phone} /> : l.text}
                </span>
              </div>
            </Grow>
          );
        })}
        {st.typing ? <TypingDots key="typing" /> : null}
      </AnimatePresence>
    </div>
  );
}

const BARS = 44;

/** @param {any} props */
function Waveform({ speaking, thinking, phone }) {
  const tone = speaking === 'aurora' ? 'bg-brand' : speaking === 'customer' ? 'bg-ink/70' : 'bg-ink/20';
  const n = phone ? 34 : BARS;
  return (
    <div className={cn('flex items-center justify-between', phone ? 'h-[52px] gap-[2px]' : 'h-[76px] gap-[3px]', speaking ? 'wave-on' : thinking ? 'wave-think' : '')} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const r = pseudo(i);
        const env = Math.sin(((i + 0.5) / n) * Math.PI);
        const h = (phone ? 14 : 20) + env * (phone ? 34 : 54) * (0.5 + r * 0.5);
        return (
          <span
            key={i}
            className={cn('wave-bar w-[3px] rounded-full transition-colors duration-500', tone)}
            style={/** @type {any} */ ({ height: h + 'px', '--d': (0.62 + r * 0.7).toFixed(2) + 's', '--dl': (-r * 1.3).toFixed(2) + 's' })}
          />
        );
      })}
    </div>
  );
}

/** @param {any} props */
function VoiceBody({ scene, st, phone, reduce }) {
  const shown = scene.lines.slice(0, st.lines);
  const first = Math.max(0, shown.length - 3);
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className={cn(phone ? 'px-3.5 pt-3' : 'px-5 pt-6')}>
        <Waveform speaking={reduce ? null : st.speaking} thinking={st.typing} phone={phone} />
        <p className={cn('mt-2 text-center font-medium', phone ? 'text-[10.5px]' : 'text-[11.5px]', st.speaking === 'aurora' ? 'text-brand-ink' : 'text-slate')}>
          {st.speaking === 'aurora' ? brand.product + ' is speaking' : st.speaking === 'customer' ? scene.contact + ' is speaking' : st.typing ? 'Checking the schedule…' : 'Live transcript'}
        </p>
      </div>
      <div className={cn('relative min-h-0 flex-1 [mask-image:linear-gradient(to_bottom,transparent,#000_26%)]', phone ? 'px-3.5 pb-3' : 'px-5 pb-4')}>
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-[inherit] pb-[inherit]">
          <AnimatePresence initial={false}>
            {shown.slice(first).map((l, j) => {
              const i = first + j;
              const mine = l.who === 'aurora';
              const isLast = i === shown.length - 1;
              const words = l.text.split(' ').length;
              return (
                <Grow key={scene.key + i}>
                  <div className={cn('pt-3 transition-opacity duration-500', isLast ? 'opacity-100' : 'opacity-55')}>
                    <p className={cn('font-semibold uppercase tracking-[0.06em]', phone ? 'text-[9.5px]' : 'text-[10px]', mine ? 'text-brand-ink' : 'text-slate')}>
                      {mine ? brand.product : 'Caller'}
                    </p>
                    <p className={cn('mt-0.5 leading-[1.45] text-ink', phone ? 'text-[12.5px]' : 'text-[13.5px]')}>
                      {reduce ? l.text : <Stream text={l.text} step={Math.min(0.24, speakDur(l.text) / 1000 / words)} soft={false} />}
                    </p>
                  </div>
                </Grow>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** @param {any} props */
function EmailBody({ scene, st, phone, reduce }) {
  const shown = scene.lines.slice(0, st.lines);
  return (
    <div className={cn('absolute inset-0 flex flex-col justify-end [mask-image:linear-gradient(to_bottom,transparent,#000_18%)]', phone ? 'px-3 pb-3' : 'px-4 pb-4')}>
      <AnimatePresence initial={false}>
        {shown.map((l, i) => {
          const mine = l.who === 'aurora';
          return (
            <Grow key={scene.key + i}>
              <div className="pt-2.5">
                <div className={cn('rounded-[14px] border', phone ? 'p-2.5' : 'p-3', mine ? 'border-brand/20 bg-[#F3FAF6]' : 'border-ink/[0.07] bg-[#FAF9F6]')}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold', mine ? 'bg-brand text-white' : 'bg-ink/[0.08] text-ink/70')}>
                      {mine ? brand.product[0] : scene.initials}
                    </span>
                    <span className={cn('min-w-0 flex-1 truncate font-semibold', phone ? 'text-[11px]' : 'text-[12px]')}>{mine ? brand.product + (scene.desk ? ' · ' + scene.desk : '') : scene.contact}</span>
                    {mine ? <span className="ui-chip h-[18px] shrink-0 bg-brand/10 px-1.5 text-[10px] text-brand-ink">Sent</span> : null}
                    <span className="t-data shrink-0 text-ink/35">{'09:' + String(12 + i * 2).padStart(2, '0')}</span>
                  </div>
                  <p className={cn('leading-[1.45] text-ink', phone ? 'text-[12px]' : 'text-[13px]')}>{mine && !reduce ? <Stream text={l.text} soft={!phone} /> : l.text}</p>
                </div>
              </div>
            </Grow>
          );
        })}
        {st.typing ? (
          <Grow key="drafting">
            <div className={cn('flex items-center gap-2 pt-2.5 font-medium text-brand-ink', phone ? 'text-[11px]' : 'text-[12px]')}>
              <PenLine className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              {brand.product} is drafting a reply
              <span className="flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1 w-1 animate-blink rounded-full bg-brand" style={{ animationDelay: d * 0.18 + 's' }} />
                ))}
              </span>
            </div>
          </Grow>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** @param {any} props */
function Panel({ scene, st, phone, reduce, callTime, takeover, onTakeover }) {
  const Body = scene.mode === 'voice' ? VoiceBody : scene.mode === 'email' ? EmailBody : ChatBody;
  return (
    <div className={cn('ui-card flex h-full flex-col overflow-hidden transition-shadow duration-500', takeover && 'shadow-[0_0_0_2px_#0A0F0E,0_12px_32px_-10px_rgba(10,15,14,0.2)]')}>
      <PanelHeader scene={scene} phone={phone} callTime={callTime} live={st.lines > 0 && !reduce} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Body scene={scene} st={st} phone={phone} reduce={reduce} />
      </div>
      <PanelFooter scene={scene} phone={phone} takeover={takeover} onTakeover={onTakeover} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Aurora: reasoning, actions, audit, approval                           */
/* ------------------------------------------------------------------ */

const statusText = (st, takeover) =>
  takeover
    ? 'Standing by'
    : st.approval === 'done'
      ? 'Done'
      : st.approval === 'pending'
        ? 'Waiting for a person'
        : st.chapter === 0
          ? st.lines
            ? 'Reading the request'
            : 'Listening'
          : st.chapter === 1
            ? 'Understanding'
            : 'Working in your systems';

/** @param {any} props */
function CoreCard({ scene, st, takeover }) {
  const working = !takeover && (st.steps.includes('run') || st.actions.includes('run') || st.typing);
  const status = statusText(st, takeover);
  return (
    <LiquidGlass className="rounded-[22px] p-4">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <Ring active={working} done={st.approval === 'done'} />
          <span className="min-w-0">
            <span className="block text-[12.5px] font-semibold leading-tight text-ink">{brand.product}</span>
            <motion.span key={status} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="block truncate text-[11px] text-slate">
              {status}
            </motion.span>
          </span>
        </span>
        <span className="t-data shrink-0 text-slate">{scene.ref}</span>
      </div>
      <ul className="grid gap-2.5">
        {scene.steps.map((s, i) => {
          const state = st.steps[i];
          return (
            <li key={scene.key + s.title} className="flex items-start gap-2.5">
              <span className="mt-[1px]">
                <Status state={state} size={15} />
              </span>
              <div className="min-w-0">
                <p className={cn('text-[12.5px] font-medium leading-tight transition-colors duration-500', state === 'idle' ? 'text-ink/40' : 'text-ink')}>{s.title}</p>
                <p className={cn('mt-0.5 truncate text-[11.5px] transition-colors duration-500', state === 'done' ? 'text-graphite' : 'text-ink/30')}>{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </LiquidGlass>
  );
}

/** @param {any} props */
function ActionCard({ scene, a, state, tablet }) {
  const Icon = SYS_ICON[a.sys];
  return (
    <LiquidGlass tint={state === 'done'} className={cn('relative flex items-center gap-3 overflow-hidden rounded-[18px]', tablet ? 'p-3' : 'p-3.5')}>
      <AnimatePresence>
        {state === 'done' ? (
          <motion.span
            key={scene.key + 'flash'}
            initial={{ x: '-110%', opacity: 1 }}
            animate={{ x: '110%', opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE_IN_OUT }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.85)_50%,transparent_80%)]"
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/80 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
        <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate">{a.sys}</p>
        <p className={cn('truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] transition-colors duration-500', state === 'idle' ? 'text-ink/45' : 'text-ink')}>{a.title}</p>
        <p className={cn('truncate text-[11.5px] transition-colors duration-500', state === 'done' ? 'text-graphite' : 'text-ink/30')}>{a.detail}</p>
      </div>
      <span className="relative">
        <Status state={state} size={18} />
      </span>
    </LiquidGlass>
  );
}

/** Phone: reasoning and actions in one card. */
/** @param {any} props */
function WorkCard({ scene, st, takeover }) {
  const working = !takeover && (st.steps.includes('run') || st.actions.includes('run') || st.typing);
  const understood = st.steps[2] === 'done' ? 'done' : st.steps.includes('run') || st.steps.includes('done') ? 'run' : 'idle';
  const rows = [{ sys: null, title: scene.steps[0].title, detail: scene.steps[0].detail, state: understood }].concat(
    scene.actions.map((a, i) => ({ sys: a.sys, title: a.title, detail: a.detail, state: st.actions[i] }))
  );
  return (
    <LiquidGlass className="rounded-[20px] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <Ring active={working} done={st.approval === 'done'} small />
          <span className="min-w-0">
            <span className="block text-[12px] font-semibold leading-tight text-ink">{brand.product}</span>
            <motion.span key={statusText(st, takeover)} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className="block truncate text-[10.5px] text-slate">
              {statusText(st, takeover)}
            </motion.span>
          </span>
        </span>
        <span className="t-data shrink-0 text-[10.5px] text-slate">{scene.ref}</span>
      </div>
      <ul className="grid gap-[5px]">
        {rows.map((r) => {
          const Icon = r.sys ? SYS_ICON[r.sys] : null;
          return (
            <li key={scene.key + r.title} className={cn('flex items-center gap-2 rounded-[12px] px-2 py-[6px] transition-colors duration-500', r.state === 'done' ? 'bg-brand/[0.07]' : 'bg-white/55')}>
              <Status state={r.state} size={14} />
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-ink/45" strokeWidth={1.8} aria-hidden="true" /> : null}
              <span className={cn('shrink-0 text-[11.5px] font-semibold transition-colors duration-500', r.state === 'idle' ? 'text-ink/40' : 'text-ink')}>{r.title}</span>
              <span className={cn('min-w-0 flex-1 truncate text-right text-[10.5px] transition-colors duration-500', r.state === 'done' ? 'text-graphite' : 'text-ink/25')}>{r.detail}</span>
            </li>
          );
        })}
      </ul>
    </LiquidGlass>
  );
}

/** @param {any} props */
function AuditTrail({ scene, st, approvedBy }) {
  const ts = (ms) => '09:41:' + String(2 + Math.floor(ms / 1000)).padStart(2, '0');
  const entries = [];
  if (st.lines >= 1) entries.push({ k: 'msg', t: ts(T.line[0]), text: 'Message received · ' + scene.channel });
  if (st.steps[2] === 'done') entries.push({ k: 'und', t: ts(T.stepDone[2]), text: scene.steps[0].title });
  st.actions.forEach((a, i) => {
    const act = scene.actions[i];
    if (a === 'done' && act) entries.push({ k: 'a' + i, t: ts(T.actDone[i]), text: act.sys + ' · ' + act.title });
  });
  if (st.approval !== 'none') entries.push({ k: 'req', t: ts(T.approvalPending), text: 'Approval requested · ' + scene.approval.by });
  if (st.approval === 'done') entries.push({ k: 'ok', t: ts(T.approvalDone), text: 'Approved by ' + (approvedBy === 'you' ? 'you' : scene.approval.by) });
  const recent = entries.slice(-4);
  return (
    <LiquidGlass className="rounded-[20px] p-4">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-ink">Audit trail</p>
        <span className="text-[11px] text-slate">Every step, logged</span>
      </div>
      <div className="flex h-[138px] flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_16px)]">
        <AnimatePresence initial={false}>
          {recent.map((e, i) => (
            <Grow key={scene.key + e.k}>
              <div className={cn('flex items-baseline gap-3 border-t border-ink/[0.06] py-[7px] text-[11.5px] transition-opacity duration-500', i === recent.length - 1 ? 'opacity-100' : 'opacity-60')}>
                <span className="t-data shrink-0 text-ink/40">{e.t}</span>
                <span className="truncate text-graphite">{e.text}</span>
              </div>
            </Grow>
          ))}
        </AnimatePresence>
        {recent.length === 0 ? <p className="border-t border-ink/[0.06] py-[7px] text-[11.5px] text-ink/35">Waiting for the first message</p> : null}
      </div>
    </LiquidGlass>
  );
}

/** @param {any} props */
function ApprovalCard({ scene, st, phone, approvedBy, onApprove, btnRef }) {
  const state = st.approval;
  const by = approvedBy === 'you' ? 'you' : scene.approval.by;
  const control =
    state === 'done' ? (
      <motion.span
        key="done"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand font-semibold text-white', phone ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[12px]')}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        {phone ? 'Approved' : scene.approval.result}
      </motion.span>
    ) : (
      <button
        key="btn"
        ref={btnRef}
        type="button"
        onClick={onApprove}
        disabled={state !== 'pending'}
        aria-label={'Approve: ' + scene.approval.ask}
        className={cn(
          'relative inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold transition-colors duration-300',
          phone ? 'h-7 px-3 text-[11px]' : 'h-8 px-3.5 text-[12px]',
          state === 'pending' ? 'halo bg-ink text-white hover:bg-[#1D2625]' : 'cursor-default bg-ink/[0.06] text-ink/35'
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
        Approve
      </button>
    );
  return (
    <LiquidGlass className={cn('rounded-[20px] transition-opacity duration-700', phone ? 'p-2.5' : 'p-4', state === 'none' ? 'opacity-75' : 'opacity-100')}>
      <div className="flex items-center gap-3">
        <span className={cn('flex shrink-0 items-center justify-center rounded-[11px] bg-white/80 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]', phone ? 'h-8 w-8' : 'h-9 w-9')}>
          <ShieldCheck className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn('truncate font-medium', phone ? 'text-[10.5px]' : 'text-[11px]', state === 'pending' ? 'text-[#8A5A12]' : state === 'done' ? 'text-brand-ink' : 'text-slate')}>
            {state === 'none' ? 'Policy check' : state === 'pending' ? 'Needs a person · ' + scene.approval.by : 'Approved by ' + by + ' · logged'}
          </p>
          <p className={cn('truncate font-semibold leading-tight tracking-[-0.01em]', phone ? 'text-[12px]' : 'text-[13px]', state === 'none' ? 'text-ink/45' : 'text-ink')}>{scene.approval.ask}</p>
        </div>
        {phone ? control : null}
      </div>
      {phone ? null : (
        <div className="mt-3 flex items-center justify-between gap-3">
          {control}
          {state === 'done' ? null : <span className="min-w-0 truncate text-right text-[11px] text-slate">{scene.approval.by + ' · ' + scene.approval.role}</span>}
        </div>
      )}
    </LiquidGlass>
  );
}

/* ------------------------------------------------------------------ */
/* Chrome: tabs, live pill, chapter bar, cursor, flows                   */
/* ------------------------------------------------------------------ */

/** @param {any} props */
function ChannelTabs({ k, onSelect, phone }) {
  const refs = useRef([]);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  useLayoutEffect(() => {
    const el = refs.current[k];
    if (el) setPill((p) => ({ x: el.offsetLeft, w: el.offsetWidth, ready: p.w > 0 }));
  }, [k, phone]);
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + SCENES.length) % SCENES.length;
    onSelect(next);
    const el = refs.current[next];
    if (el) el.focus();
  };
  return (
    <LiquidGlass className={cn('relative inline-flex rounded-full', phone ? 'p-[3px]' : 'p-1')} role="tablist" aria-label="Channel">
      <motion.span
        aria-hidden="true"
        className={cn('absolute rounded-full bg-ink', phone ? 'inset-y-[3px]' : 'inset-y-1')}
        style={{ left: 0 }}
        initial={false}
        animate={{ x: pill.x, width: pill.w }}
        transition={pill.ready ? { duration: 0.5, ease: EASE } : { duration: 0 }}
      />
      {SCENES.map((s, i) => {
        const Icon = CH[s.mode].icon;
        const on = i === k;
        return (
          <button
            key={s.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls="film-scene"
            aria-label={phone && !on ? s.channel : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'relative z-[1] flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-colors duration-300',
              phone ? 'h-[30px] px-2.5 text-[11.5px]' : 'h-9 px-3.5 text-[13px]',
              on ? 'text-white' : 'text-graphite hover:text-ink'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            {phone && !on ? null : <span>{s.channel}</span>}
          </button>
        );
      })}
    </LiquidGlass>
  );
}

/** @param {any} props */
function Segment({ c, time, active, onSeek, phone }) {
  const fill = useTransform(time, [c.start, c.end], [0, 1], { clamp: true });
  return (
    <button
      type="button"
      onClick={() => onSeek(c.start)}
      aria-label={'Jump to ' + c.label}
      aria-current={active ? 'step' : undefined}
      className={cn('group flex min-w-0 flex-1 flex-col justify-center rounded-lg text-left', phone ? 'gap-0 px-0.5' : 'gap-1.5 px-1.5 py-1')}
    >
      {phone ? null : <span className={cn('truncate text-[11.5px] font-medium transition-colors duration-300', active ? 'text-ink' : 'text-ink/40 group-hover:text-ink/70')}>{c.label}</span>}
      <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
        <motion.span className="absolute inset-0 origin-left rounded-full bg-ink" style={{ scaleX: fill }} />
      </span>
    </button>
  );
}

/** @param {any} props */
function ChapterBar({ time, chapter, playing, onToggle, onSeek, phone, reduce }) {
  return (
    <LiquidGlass className={cn('flex h-full items-center rounded-full', phone ? 'gap-1.5 px-1' : 'gap-2 px-1.5')}>
      {reduce ? null : (
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? 'Pause the product demo' : 'Play the product demo'}
          className={cn('flex shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 hover:bg-[#1D2625]', phone ? 'h-[22px] w-[22px]' : 'h-8 w-8')}
        >
          {playing ? (
            <Pause className={cn('fill-current', phone ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5')} strokeWidth={0} aria-hidden="true" />
          ) : (
            <Play className={cn('ml-[1px] fill-current', phone ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5')} strokeWidth={0} aria-hidden="true" />
          )}
        </button>
      )}
      <div className={cn('flex min-w-0 flex-1 items-center', phone ? 'gap-1' : 'gap-1')}>
        {CHAPTERS.map((c, i) => (
          <Segment key={c.label} c={c} time={time} active={chapter === i} onSeek={onSeek} phone={phone} />
        ))}
      </div>
      {phone ? <span className="w-[76px] shrink-0 truncate pr-2 text-right text-[10.5px] font-medium text-ink">{CHAPTERS[chapter].label}</span> : null}
    </LiquidGlass>
  );
}

/** @param {any} props */
function LivePill({ scene, playing, takeover, reduce }) {
  const label = takeover ? 'You are in control' : playing || reduce ? 'Live' : 'Paused';
  return (
    <div className="flex items-center gap-2">
      <span className="hidden rounded-full bg-white/55 px-3 py-1.5 text-[12px] font-medium text-graphite backdrop-blur-sm sm:inline-flex">{scene.industry}</span>
      <LiquidGlass className="flex h-8 items-center gap-2 rounded-full px-3 text-[12px] font-medium text-ink">
        {playing && !takeover ? <LiveDot /> : <span className="h-2 w-2 rounded-full bg-ink/30" />}
        {brand.product} · {label}
      </LiquidGlass>
    </div>
  );
}

/** A person's cursor arriving to approve (multiplayer-style). */
/** @param {any} props */
function GhostCursor({ target, clicking, name }) {
  const [tx, ty] = target;
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-30"
      initial={{ x: tx + 230, y: ty + 170, opacity: 0 }}
      animate={{ x: tx, y: ty, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.9, ease: EASE_IN_OUT }}
      aria-hidden="true"
    >
      {clicking ? (
        <motion.span
          className="absolute -left-4 -top-4 h-8 w-8 rounded-full border-2 border-brand"
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        />
      ) : null}
      <motion.svg width="22" height="22" viewBox="0 0 24 24" className="-ml-[4px] -mt-[2px] drop-shadow-[0_2px_4px_rgba(10,15,14,0.3)]" animate={{ scale: clicking ? [1, 0.8, 1] : 1 }} transition={{ duration: 0.35 }}>
        <path d="M4 2 L4 19.2 L8.6 15 L11.6 21.6 L14.4 20.4 L11.5 14 L17.6 13.8 Z" fill="#0A0F0E" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
      <span className="absolute left-4 top-5 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(11,110,74,0.6)]">{name}</span>
    </motion.div>
  );
}

/** @param {any} props */
function Flows({ flows, st, intro, reduce }) {
  if (!flows) return null;
  const groups = [
    { key: 'in', paths: flows.in, on: st.steps.includes('run'), color: 'url(#hf-flow)', dur: '2.2s' },
    { key: 'out', paths: flows.out, on: st.actions.includes('run'), color: 'url(#hf-flow)', dur: '2.2s' },
    { key: 'ok', paths: flows.ok, on: st.approval === 'pending', color: '#D08A1E', dur: '1.8s' },
  ];
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hf-flow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#14A36B" stopOpacity="0" />
          <stop offset="0.5" stopColor="#14A36B" stopOpacity="0.95" />
          <stop offset="1" stopColor="#13A89C" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {groups.map((g, gi) =>
        g.paths.map((d, i) => (
          <g key={g.key + i}>
            <motion.path
              d={d}
              fill="none"
              stroke="rgba(10,15,14,0.15)"
              strokeWidth="1"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: intro || reduce ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.25 + gi * 0.2 + i * 0.08, ease: EASE_IN_OUT }}
            />
            {g.on && !reduce ? (
              <path d={d} fill="none" stroke={g.color} strokeWidth="2" strokeLinecap="round" pathLength={1} className="flow-pulse" style={{ animationDelay: i * 0.3 + 's', animationDuration: g.dur }} />
            ) : null}
          </g>
        ))
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Film                                                                 */
/* ------------------------------------------------------------------ */

/**
 * A positioned layer of the composition. Groups that contain glass only move
 * (transform) and dim their content through CSS, never their own opacity: a
 * fading wrapper would cut the glass off from its backdrop until the fade ends.
 * @param {any} props
 */
function Group({ p, index, dim = false, children, className = undefined, z = 1, glass = true }) {
  return (
    <div className={cn('absolute', className)} style={{ left: p.x, top: p.y, width: p.w, height: p.h, zIndex: z }}>
      <motion.div
        className="h-full"
        custom={index}
        variants={{
          hidden: glass ? { y: 26 } : { opacity: 0, y: 22 },
          show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.95, delay: 0.5 + i * 0.09, ease: EASE } }),
        }}
      >
        {glass ? (
          <div className={cn('film-group h-full', dim && 'film-dim')}>{children}</div>
        ) : (
          <motion.div className="h-full" initial={false} animate={{ opacity: dim ? 0.72 : 1 }} transition={{ duration: 0.9, ease: EASE }}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function HeroFilm() {
  const reduce = !!useReducedMotion();
  const wideUp = useMediaQuery('(min-width: 1024px)');
  const tabletUp = useMediaQuery('(min-width: 640px)');
  const compKey = wideUp ? 'wide' : tabletUp ? 'tablet' : 'phone';
  const comp = COMPS[compKey];
  const phone = compKey === 'phone';

  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const compRef = useRef(null);
  const btnRef = useRef(null);

  const [k, setK] = useState(0);
  const [loop, setLoop] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [takeover, setTakeover] = useState(false);
  const [approvedBy, setApprovedBy] = useState(null);
  const [introDone, setIntroDone] = useState(reduce);
  const [sweep, setSweep] = useState(0);
  const [scale, setScale] = useState(1);
  const [target, setTarget] = useState(null);
  const [lite, setLite] = useState(false);
  const userDriven = useRef(false);
  const scene = SCENES[k];

  const inView = useInViewport(stageRef, { threshold: 0.15 });
  const visible = usePageVisible();
  const running = introDone && inView && visible && playing && !takeover && !reduce;

  const { time, play, stop, onEnd } = useClock(T.end);
  // The film state belongs to one run (scene + replay). A new run uses its own
  // first frame from the very first render, so nothing from the previous run
  // (a finished audit trail, a sent reply) is ever mounted and then animated out.
  const run = k + ':' + loop;
  const t0 = reduce ? T.end - 1 : 0;
  const [box, setBox] = useState(() => ({ run, st: computeState(scene, t0) }));
  const st = box.run === run ? box.st : computeState(scene, t0);
  const sigRef = useRef(sigOf(box.st));
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const runRef = useRef(run);
  runRef.current = run;

  useMotionValueEvent(time, 'change', (t) => {
    const next = computeState(sceneRef.current, t);
    const sig = sigOf(next);
    if (sig !== sigRef.current) {
      sigRef.current = sig;
      setBox({ run: runRef.current, st: next });
    }
  });

  // Fit the composition to the stage width.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => setScale(el.clientWidth / comp.w);
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [comp.w]);

  // Check the renderer once the page is idle; software rendering gets the light version.
  useEffect(() => {
    const w = /** @type {any} */ (window);
    const run = () => setLite(detectLowPower());
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 1200 }) : window.setTimeout(run, 600);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  // Intro: layers assemble, then a light sweep, then the clock starts.
  useEffect(() => {
    if (reduce) return undefined;
    const a = window.setTimeout(() => setSweep((n) => n + 1), 1500);
    const b = window.setTimeout(() => setIntroDone(true), 1750);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [reduce]);

  // New scene or replay: reset the clock and per-scene choices.
  // Layout effect, so the reset lands before paint. The clock is stopped first:
  // a running clock would otherwise write the old time back on its next tick.
  const first = useRef(true);
  useLayoutEffect(() => {
    setApprovedBy(null);
    setTakeover(false);
    stop();
    const start = reduce ? T.end - 1 : 0;
    time.set(start);
    const next = computeState(SCENES[k], start);
    sigRef.current = sigOf(next);
    setBox({ run: k + ':' + loop, st: next });
    if (first.current) first.current = false;
    else if (!reduce) setSweep((n) => n + 1);
  }, [k, loop, reduce, time, stop]);

  // Play / stop the clock.
  useEffect(() => {
    if (running) play();
    else stop();
    return stop;
  }, [running, play, stop, k, loop]);

  onEnd.current = () => {
    if (userDriven.current) setLoop((n) => n + 1);
    else setK((i) => (i + 1) % SCENES.length);
  };

  const seek = (ms) => {
    userDriven.current = true;
    if (ms < T.approvalDone) setApprovedBy(null);
    // Reduced motion: show the finished state of the chosen chapter.
    const chapter = CHAPTERS.find((c) => c.start === ms);
    time.set(reduce && chapter ? chapter.end - 1 : ms);
    if (running) play();
  };
  const select = (i) => {
    userDriven.current = true;
    if (i === k) setLoop((n) => n + 1);
    else setK(i);
  };
  const approve = () => {
    if (st.approval !== 'pending') return;
    userDriven.current = true;
    setApprovedBy('you');
    time.set(T.approvalDone);
    if (running) play();
  };
  const toggleTakeover = () => {
    userDriven.current = true;
    setTakeover((v) => !v);
  };
  const togglePlay = () => {
    userDriven.current = true;
    setPlaying((v) => !v);
  };

  // Where the approver's cursor should land.
  useLayoutEffect(() => {
    if (st.approval !== 'pending' || !btnRef.current || !compRef.current) return;
    setTarget(centreWithin(btnRef.current, compRef.current));
  }, [st.approval, compKey, k, scale]);

  // Camera: a slow pan toward the active chapter (translate only: no zoom, so
  // text is never re-rasterised mid-move), framed so no card is cut off.
  const [fx, fy] = comp.focus[st.chapter];
  const [camX, camY] = frameCamera(comp, 1, -0.1 * (fx - comp.w / 2), -0.1 * (fy - comp.h / 2));
  const focus = FOCUS[st.chapter];
  const dim = (key) => !reduce && introDone && !focus.includes(key);
  const calm = lite || compKey !== 'wide'; // still backgrounds on phones, tablets and software rendering

  const callTime = useTransform(time, (t) => '00:' + String(Math.max(0, Math.floor((t - 200) / 1000))).padStart(2, '0'));
  const cursorOn = !reduce && approvedBy !== 'you' && st.cursor !== 'off' && !!target;

  return (
    <figure ref={stageRef} className={cn('relative m-0', phone && 'mx-auto max-w-[440px]')} aria-labelledby="film-caption">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 64 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, delay: 0.3, ease: EASE }}
      >
        <div
          className={cn(
            'canvas relative bg-[linear-gradient(180deg,#F1F1EC_0%,#E5E9E2_100%)] shadow-[0_0_0_1px_rgba(10,15,14,0.05),0_50px_100px_-55px_rgba(10,15,14,0.45)]',
            (!playing || takeover) && 'film-paused',
            calm && 'film-calm',
            lite && 'film-lite'
          )}
        >
          {/* Atmosphere the glass can refract */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <MediaSlot
              media={media.heroBackdrop}
              className="absolute inset-0"
              fallback={
                <>
                  <div className="orb left-[52%] top-[-22%] h-[80%] w-[52%] animate-drift bg-[radial-gradient(closest-side,rgba(60,224,154,0.42),rgba(60,224,154,0))]" />
                  <div className="orb bottom-[-30%] left-[-8%] h-[85%] w-[48%] animate-drift-slow bg-[radial-gradient(closest-side,rgba(19,168,156,0.3),rgba(19,168,156,0))]" />
                  <div className="orb left-[26%] top-[-30%] h-[70%] w-[40%] animate-drift-slow bg-[radial-gradient(closest-side,rgba(255,215,170,0.55),rgba(255,215,170,0))] [animation-delay:-9s]" />
                  <div className="orb bottom-[-26%] right-[-6%] h-[70%] w-[36%] animate-drift bg-[radial-gradient(closest-side,rgba(160,190,255,0.28),rgba(160,190,255,0))] [animation-delay:-14s]" />
                </>
              }
            />
            <div className="grid-lines absolute inset-0" />
          </div>

          <div ref={wrapRef} className="relative z-[2]" style={{ aspectRatio: comp.w + ' / ' + comp.h }}>
            <div ref={compRef} id="film-scene" className="absolute left-0 top-0 origin-top-left" style={{ width: comp.w, height: comp.h, transform: 'scale(' + scale + ')' }}>
              <motion.div className="absolute inset-0" initial={reduce ? false : 'hidden'} animate="show">
                {/* Key light that follows the action */}
                {reduce || lite ? null : (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 h-[760px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),rgba(255,255,255,0))]"
                    initial={false}
                    animate={{ x: fx - 380, y: fy - 380 }}
                    transition={{ duration: 1.8, ease: EASE_IN_OUT }}
                  />
                )}

                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={reduce ? { x: 0, y: 0 } : { x: camX, y: camY }}
                  transition={{ duration: 1.8, ease: EASE_IN_OUT }}
                >
                  <Flows flows={comp.flows} st={st} intro={introDone} reduce={reduce} />

                  <Group p={comp.panel} index={1} dim={dim('panel')} glass={false}>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={scene.key + '-' + loop}
                        className="absolute inset-0"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.12, ease: EASE } }}
                        exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                      >
                        <Panel scene={scene} st={st} phone={phone} reduce={reduce} callTime={callTime} takeover={takeover} onTakeover={toggleTakeover} />
                      </motion.div>
                    </AnimatePresence>
                  </Group>

                  {comp.core ? (
                    <Group p={comp.core} index={2} dim={dim('core')} z={2}>
                      <CoreCard scene={scene} st={st} takeover={takeover} />
                    </Group>
                  ) : null}

                  {comp.work ? (
                    <Group p={comp.work} index={2} dim={dim('work')} z={2}>
                      <WorkCard scene={scene} st={st} takeover={takeover} />
                    </Group>
                  ) : null}

                  {comp.actions ? (
                    <Group p={comp.actions} index={3} dim={dim('actions')} z={2}>
                      <div className={cn('grid', compKey === 'tablet' ? 'gap-2.5' : 'gap-[14px]')}>
                        {scene.actions.map((a, i) => (
                          <ActionCard key={a.sys} scene={scene} a={a} state={st.actions[i]} tablet={compKey === 'tablet'} />
                        ))}
                      </div>
                    </Group>
                  ) : null}

                  {comp.audit ? (
                    <Group p={comp.audit} index={4} dim={dim('audit')} z={2}>
                      <AuditTrail key={scene.key + '-' + loop} scene={scene} st={st} approvedBy={approvedBy} />
                    </Group>
                  ) : null}

                  <Group p={comp.approval} index={5} dim={dim('approval')} z={3}>
                    <ApprovalCard scene={scene} st={st} phone={phone} approvedBy={approvedBy} onApprove={approve} btnRef={btnRef} />
                  </Group>

                  <AnimatePresence>
                    {cursorOn ? <GhostCursor key={scene.key + loop} target={target} clicking={st.cursor === 'click'} name={scene.approval.by} /> : null}
                  </AnimatePresence>
                </motion.div>

                {/* Fixed chrome (outside the camera) */}
                <Group p={comp.tabs} index={0} z={5}>
                  <ChannelTabs k={k} onSelect={select} phone={phone} />
                </Group>
                {comp.live ? (
                  <div className="absolute z-[5]" style={{ right: comp.live.x, top: comp.live.y }}>
                    <motion.div variants={{ hidden: { y: -10 }, show: { y: 0, transition: { duration: 0.8, delay: 0.55, ease: EASE } } }}>
                      <LivePill scene={scene} playing={playing && introDone} takeover={takeover} reduce={reduce} />
                    </motion.div>
                  </div>
                ) : null}
                <Group p={comp.bar} index={6} z={5}>
                  <ChapterBar time={time} chapter={st.chapter} playing={playing} onToggle={togglePlay} onSeek={seek} phone={phone} reduce={reduce} />
                </Group>
              </motion.div>
            </div>
          </div>

          {/* Light sweep on intro and on every scene change */}
          {reduce ? null : (
            <motion.div
              key={sweep}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[6] bg-[linear-gradient(102deg,transparent_34%,rgba(255,255,255,0.3)_47%,rgba(255,255,255,0.1)_53%,transparent_64%)]"
              initial={{ x: '-105%', opacity: sweep ? 1 : 0 }}
              animate={{ x: '105%', opacity: sweep ? 1 : 0 }}
              transition={{ duration: 1.5, ease: EASE_IN_OUT }}
            />
          )}
        </div>
      </motion.div>
      <figcaption id="film-caption" className="sr-only">
        Interactive product demo: {brand.product} handles a {scene.channel.toLowerCase()} conversation for a {scene.industry.toLowerCase()} business. It replies to the customer,
        checks availability and policy, updates the CRM, books the appointment, sets a follow-up and asks a person to approve one decision. Use the channel tabs to switch
        conversations and the pause button to stop the animation.
      </figcaption>
    </figure>
  );
}
