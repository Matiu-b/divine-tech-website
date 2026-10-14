import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInViewport, usePageVisible } from './hooks';

/*
 * A photo with a hand-drafted line drawing over it. The drawing tells the agent's task in a few strokes and
 * draws itself on a loop with the Web Animations API, so each stroke has its own window in one shared timeline.
 * Without JS, and with reduced motion, the drawing is shown complete. Coordinates use a 400 x 500 frame (4:5).
 *
 * Every animated element carries data-k="start end" as fractions of the loop.
 */

const LOOP_MS = 10000;
const FADE_AT = 0.86;
const GONE_AT = 0.95;

const INK = {
  sales: { line: '#FFFFFF', accent: '#FFE3A8', soft: 'rgba(255,255,255,0.55)' },
  service: { line: '#2A1A10', accent: '#D9481C', soft: 'rgba(42,26,16,0.45)' },
  internal: { line: '#FFFFFF', accent: '#FF9F45', soft: 'rgba(255,255,255,0.45)' },
};

const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';

function keyframesFor(el, start, end) {
  const stroked = ['path', 'line', 'circle', 'rect', 'polyline'].includes(el.tagName) && el.getAttribute('stroke') !== 'none';
  if (stroked) {
    return [
      { strokeDashoffset: 1, opacity: 1, offset: 0 },
      { strokeDashoffset: 1, opacity: 1, offset: start, easing: ease },
      { strokeDashoffset: 0, opacity: 1, offset: end },
      { strokeDashoffset: 0, opacity: 1, offset: FADE_AT },
      { strokeDashoffset: 0, opacity: 0, offset: GONE_AT },
      { strokeDashoffset: 0, opacity: 0, offset: 1 },
    ];
  }
  // labels and dots: rise and fade in
  return [
    { opacity: 0, transform: 'translateY(6px) scale(0.96)', offset: 0 },
    { opacity: 0, transform: 'translateY(6px) scale(0.96)', offset: start, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    { opacity: 1, transform: 'translateY(0) scale(1)', offset: end },
    { opacity: 1, transform: 'translateY(0) scale(1)', offset: FADE_AT },
    { opacity: 0, transform: 'translateY(0) scale(1)', offset: GONE_AT },
    { opacity: 0, transform: 'translateY(0) scale(1)', offset: 1 },
  ];
}

function useDrawLoop(ref, active, still, delay) {
  useEffect(() => {
    const root = ref.current;
    if (!root || still || typeof root.animate !== 'function') return undefined;
    const els = [...root.querySelectorAll('[data-k]')];
    const anims = els.map((el) => {
      const [start, end] = el.getAttribute('data-k').split(' ').map(Number);
      if (el instanceof SVGElement && el.getAttribute('stroke') !== 'none') el.style.strokeDasharray = '1';
      if (el instanceof SVGElement && el.getAttribute('stroke') === 'none') {
        el.style.transformBox = 'fill-box';
        el.style.transformOrigin = 'center';
      }
      const a = el.animate(keyframesFor(el, start, end), { duration: LOOP_MS, iterations: Infinity, delay, fill: 'both' });
      a.pause();
      return a;
    });
    root.dataset.anims = '1';
    ref.current.__anims = anims;
    return () => anims.forEach((a) => a.cancel());
  }, [ref, still, delay]);

  useEffect(() => {
    const anims = ref.current && ref.current.__anims;
    if (!anims) return;
    anims.forEach((a) => (active ? a.play() : a.pause()));
  }, [ref, active, still]);
}

/* ---------- the three drawings ----------
 * Anchored to each photo: sales starts at the phone in her hands, service at the headset mic,
 * operations sits in the clear wall above the two heads. Captions are part of the drawing, not boxes.
 */

const TEXT = { fontFamily: 'inherit', fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em' };

function SalesDrawing({ c }) {
  return (
    <>
      {/* the reply leaves her phone */}
      <path data-k="0.02 0.12" pathLength="1" d="M226 258 C 214 252 200 244 188 234" stroke={c.soft} />
      <path data-k="0.08 0.20" pathLength="1" d="M186 236 l-8 -8 h-58 a10 10 0 0 1 -10 -10 v-16 a10 10 0 0 1 10 -10 h58 a10 10 0 0 1 10 10 v16 a10 10 0 0 1 -2 6 z" stroke={c.line} />
      <path data-k="0.18 0.24" pathLength="1" d="M124 212 h44" stroke={c.soft} />
      {/* down to the calendar */}
      <path data-k="0.22 0.32" pathLength="1" d="M140 240 C 130 256 112 262 104 282" stroke={c.soft} />
      <rect data-k="0.30 0.44" pathLength="1" x="30" y="292" width="136" height="112" rx="12" stroke={c.line} />
      <line data-k="0.40 0.46" pathLength="1" x1="30" y1="318" x2="166" y2="318" stroke={c.line} />
      <line data-k="0.42 0.46" pathLength="1" x1="62" y1="282" x2="62" y2="302" stroke={c.line} />
      <line data-k="0.43 0.47" pathLength="1" x1="134" y1="282" x2="134" y2="302" stroke={c.line} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((col) => (
          <circle key={r + '-' + col} data-k={`${0.46 + (r * 4 + col) * 0.005} ${0.49 + (r * 4 + col) * 0.005}`} cx={50 + col * 32} cy={340 + r * 22} r="2.2" fill={c.soft} stroke="none" />
        ))
      )}
      {/* Thursday gets circled, then the caption */}
      <path data-k="0.56 0.66" pathLength="1" d="M102 360 c6 -14 26 -14 30 -2 c4 12 -10 20 -22 16 c-10 -3 -12 -12 -4 -18" stroke={c.accent} strokeWidth="2.2" />
      <text data-k="0.66 0.74" x="30" y="430" fill={c.line} stroke="none" style={TEXT}>Booked · Thu 11:00</text>
    </>
  );
}

function ServiceDrawing({ c }) {
  return (
    <>
      {/* his voice from the headset mic */}
      <path data-k="0.02 0.10" pathLength="1" d="M182 166 q10 12 0 24" stroke={c.line} />
      <path data-k="0.06 0.14" pathLength="1" d="M194 158 q16 20 0 40" stroke={c.line} />
      <path data-k="0.10 0.18" pathLength="1" d="M206 150 q22 28 0 56" stroke={c.soft} />
      {/* email, chat and phone, sketched one by one */}
      <rect data-k="0.20 0.28" pathLength="1" x="282" y="66" width="58" height="40" rx="7" stroke={c.line} />
      <path data-k="0.26 0.32" pathLength="1" d="M284 70 l27 20 l27 -20" stroke={c.line} />
      <path data-k="0.32 0.42" pathLength="1" d="M290 130 h44 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-26 l-12 10 v-10 h-6 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 z" stroke={c.line} />
      <path data-k="0.44 0.54" pathLength="1" d="M300 202 c-6 0 -10 6 -6 14 c6 12 16 22 28 28 c8 4 14 0 14 -6 l-2 -8 l-10 -4 l-6 6 c-6 -3 -11 -8 -14 -14 l6 -6 l-4 -10 z" stroke={c.line} />
      {/* they meet in one place: resolved */}
      <path data-k="0.56 0.66" pathLength="1" d="M346 86 C 372 120 372 250 334 290" stroke={c.soft} />
      <path data-k="0.58 0.66" pathLength="1" d="M346 150 C 364 180 364 250 334 290" stroke={c.soft} />
      <path data-k="0.60 0.67" pathLength="1" d="M330 250 C 334 266 334 278 330 290" stroke={c.soft} />
      <circle data-k="0.66 0.74" pathLength="1" cx="320" cy="312" r="22" stroke={c.accent} strokeWidth="2.2" />
      <path data-k="0.72 0.78" pathLength="1" d="M310 312 l7 7 l14 -15" stroke={c.accent} strokeWidth="2.4" />
      <text data-k="0.76 0.82" x="320" y="356" textAnchor="middle" fill={c.line} stroke="none" style={TEXT}>Resolved</text>
    </>
  );
}

function InternalDrawing({ c }) {
  return (
    <>
      {/* from the two of them, up into the clear wall */}
      <path data-k="0.02 0.12" pathLength="1" d="M196 196 C 196 186 196 178 196 162" stroke={c.soft} />
      {/* the invoice */}
      <path data-k="0.10 0.24" pathLength="1" d="M 40 82 h 52 l 20 20 v 78 h -72 z M 92 82 v 20 h 20" stroke={c.line} />
      <line data-k="0.22 0.26" pathLength="1" x1="52" y1="114" x2="84" y2="114" stroke={c.line} />
      <line data-k="0.24 0.28" pathLength="1" x1="52" y1="130" x2="100" y2="130" stroke={c.soft} />
      <line data-k="0.26 0.30" pathLength="1" x1="52" y1="144" x2="96" y2="144" stroke={c.soft} />
      <line data-k="0.28 0.32" pathLength="1" x1="52" y1="166" x2="100" y2="166" stroke={c.line} />
      {/* checked and approved */}
      <path data-k="0.34 0.40" pathLength="1" d="M 124 131 h 34 M 152 125 l 7 6 l -7 6" stroke={c.line} />
      <circle data-k="0.40 0.50" pathLength="1" cx="196" cy="131" r="26" stroke={c.accent} strokeWidth="2.2" />
      <path data-k="0.48 0.54" pathLength="1" d="M 185 131 l 8 8 l 15 -16" stroke={c.accent} strokeWidth="2.6" />
      <text data-k="0.52 0.58" x="196" y="96" textAnchor="middle" fill={c.soft} stroke="none" style={{ ...TEXT, fontSize: 11 }}>Approved</text>
      {/* on to Finance */}
      <path data-k="0.58 0.64" pathLength="1" d="M 234 131 h 30 M 258 125 l 7 6 l -7 6" stroke={c.line} />
      <rect data-k="0.64 0.74" pathLength="1" x="276" y="108" width="88" height="46" rx="10" stroke={c.line} />
      <text data-k="0.72 0.80" x="320" y="136" textAnchor="middle" fill={c.line} stroke="none" style={TEXT}>Finance</text>
    </>
  );
}

const DRAWINGS = { sales: SalesDrawing, service: ServiceDrawing, internal: InternalDrawing };

/**
 * @param {{ t: any, i: number }} props
 */
export default function TeamSketch({ t, i }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.3 });
  const visible = usePageVisible();
  useDrawLoop(ref, inView && visible, !!reduce, i * 700);
  const Drawing = DRAWINGS[t.key];
  const c = INK[t.key] || INK.sales;
  return (
    <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[28px]" style={{ background: t.sketch.bg }}>
      <img
        src={t.sketch.src}
        alt={t.sketch.alt}
        width="928"
        height="1152"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: t.key === 'service' ? 'none' : 'drop-shadow(0 1px 6px rgba(60,20,0,0.25))' }}
      >
        {Drawing ? <Drawing c={c} /> : null}
      </svg>
      <span className={cn('absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 py-1 pl-1 pr-3 text-[12px] font-medium text-ink backdrop-blur')}>
        <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="h-5 w-5" />
        {t.agent}
      </span>
    </div>
  );
}
