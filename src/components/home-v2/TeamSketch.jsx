import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
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

/* ---------- the three drawings ---------- */

function SalesDrawing({ c }) {
  return (
    <>
      {/* a new message leaves the phone */}
      <path data-k="0.02 0.12" pathLength="1" d="M258 214 c-10 -18 -6 -34 12 -40 h40 c14 0 20 8 20 20 v10 c0 12 -8 18 -20 18 h-24 l-14 12 z" stroke={c.line} />
      <path data-k="0.10 0.30" pathLength="1" d="M250 214 C 205 214 205 150 170 150" stroke={c.soft} />
      {/* the calendar sketch */}
      <rect data-k="0.24 0.38" pathLength="1" x="34" y="78" width="136" height="116" rx="12" stroke={c.line} />
      <line data-k="0.34 0.40" pathLength="1" x1="34" y1="104" x2="170" y2="104" stroke={c.line} />
      <line data-k="0.36 0.40" pathLength="1" x1="66" y1="68" x2="66" y2="88" stroke={c.line} />
      <line data-k="0.37 0.41" pathLength="1" x1="138" y1="68" x2="138" y2="88" stroke={c.line} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((col) => (
          <circle key={r + '-' + col} data-k={`${0.40 + (r * 4 + col) * 0.006} ${0.43 + (r * 4 + col) * 0.006}`} cx={54 + col * 32} cy={124 + r * 24} r="2.2" fill={c.soft} stroke="none" />
        ))
      )}
      {/* Thursday gets circled */}
      <path data-k="0.50 0.60" pathLength="1" d="M121 148 c10 -12 28 -8 30 4 c2 12 -14 20 -26 14 c-10 -5 -9 -16 2 -20" stroke={c.accent} strokeWidth="2.2" />
      <path data-k="0.60 0.66" pathLength="1" d="M152 172 l14 14" stroke={c.accent} strokeWidth="2.2" />
    </>
  );
}

function ServiceDrawing({ c }) {
  return (
    <>
      {/* the voice from the headset */}
      <path data-k="0.02 0.10" pathLength="1" d="M178 120 q12 18 0 36" stroke={c.line} />
      <path data-k="0.06 0.14" pathLength="1" d="M192 110 q20 28 0 56" stroke={c.line} />
      <path data-k="0.10 0.18" pathLength="1" d="M206 100 q28 38 0 76" stroke={c.soft} />
      {/* email, chat and phone, one by one */}
      <rect data-k="0.20 0.28" pathLength="1" x="262" y="84" width="58" height="40" rx="7" stroke={c.line} />
      <path data-k="0.26 0.32" pathLength="1" d="M264 88 l27 20 l27 -20" stroke={c.line} />
      <path data-k="0.32 0.42" pathLength="1" d="M262 160 h58 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-34 l-12 10 v-10 h-12 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 z" stroke={c.line} />
      <path data-k="0.44 0.54" pathLength="1" d="M276 236 c-6 0 -10 6 -6 14 c6 12 16 22 28 28 c8 4 14 0 14 -6 l-2 -8 l-10 -4 l-6 6 c-6 -3 -11 -8 -14 -14 l6 -6 l-4 -10 z" stroke={c.line} />
      {/* they meet in one place: resolved */}
      <path data-k="0.56 0.66" pathLength="1" d="M330 104 C 360 104 360 300 330 330" stroke={c.soft} />
      <path data-k="0.58 0.66" pathLength="1" d="M332 180 C 352 180 352 300 330 330" stroke={c.soft} />
      <path data-k="0.60 0.67" pathLength="1" d="M318 268 C 330 290 330 310 330 330" stroke={c.soft} />
      <circle data-k="0.66 0.74" pathLength="1" cx="314" cy="352" r="24" stroke={c.accent} strokeWidth="2.2" />
      <path data-k="0.72 0.78" pathLength="1" d="M303 352 l8 8 l15 -16" stroke={c.accent} strokeWidth="2.4" />
    </>
  );
}

function InternalDrawing({ c }) {
  return (
    <>
      {/* from the tablet up to the invoice */}
      <path data-k="0.02 0.16" pathLength="1" d="M232 300 C 232 250 150 250 128 196" stroke={c.soft} />
      {/* the invoice sketch */}
      <path data-k="0.14 0.28" pathLength="1" d="M70 62 h70 l22 22 v104 h-92 z M140 62 v22 h22" stroke={c.line} />
      <line data-k="0.26 0.30" pathLength="1" x1="84" y1="102" x2="128" y2="102" stroke={c.line} />
      <line data-k="0.28 0.32" pathLength="1" x1="84" y1="120" x2="146" y2="120" stroke={c.soft} />
      <line data-k="0.30 0.34" pathLength="1" x1="84" y1="136" x2="140" y2="136" stroke={c.soft} />
      <line data-k="0.32 0.36" pathLength="1" x1="84" y1="166" x2="146" y2="166" stroke={c.line} />
      {/* checked and approved */}
      <path data-k="0.40 0.48" pathLength="1" d="M170 124 h36" stroke={c.line} />
      <path data-k="0.46 0.50" pathLength="1" d="M200 118 l8 6 l-8 6" stroke={c.line} />
      <circle data-k="0.50 0.60" pathLength="1" cx="246" cy="124" r="28" stroke={c.accent} strokeWidth="2.2" />
      <path data-k="0.58 0.64" pathLength="1" d="M234 124 l9 9 l16 -18" stroke={c.accent} strokeWidth="2.6" />
      {/* to Finance */}
      <path data-k="0.66 0.72" pathLength="1" d="M280 124 h30" stroke={c.line} />
      <path data-k="0.70 0.73" pathLength="1" d="M304 118 l8 6 l-8 6" stroke={c.line} />
      <rect data-k="0.72 0.80" pathLength="1" x="318" y="102" width="56" height="44" rx="9" stroke={c.line} />
      <path data-k="0.78 0.82" pathLength="1" d="M330 118 h32 M330 130 h22" stroke={c.soft} />
    </>
  );
}

const DRAWINGS = { sales: SalesDrawing, service: ServiceDrawing, internal: InternalDrawing };

// Where each card's label sits (percent of the frame) and when it appears in the loop.
const LABEL = {
  sales: { style: { left: '7%', top: '41%' }, k: '0.62 0.70' },
  service: { style: { right: '6%', top: '77%' }, k: '0.74 0.80' },
  internal: { style: { left: '50%', top: '33%', translate: '-50% 0' }, k: '0.80 0.86' },
};

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
  const label = LABEL[t.key];
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
      {label ? (
        <p
          aria-hidden="true"
          data-k={label.k}
          className="absolute flex items-center gap-2 whitespace-nowrap rounded-full bg-white/90 py-1.5 pl-2 pr-3 text-[12px] font-medium text-ink shadow-[0_10px_24px_-12px_rgba(40,20,10,0.55)] backdrop-blur"
          style={label.style}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E4F4E8]">
            <Check className="h-3 w-3 text-[#2E7A48]" strokeWidth={2.8} />
          </span>
          {t.chip.title}
          <span className="font-normal text-slate">{t.chip.detail}</span>
        </p>
      ) : null}
      <span className={cn('absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 py-1 pl-1 pr-3 text-[12px] font-medium text-ink backdrop-blur')}>
        <img src="/brand/aurora-symbol-color.svg" alt="" width="20" height="20" className="h-5 w-5" />
        {t.agent}
      </span>
    </div>
  );
}
