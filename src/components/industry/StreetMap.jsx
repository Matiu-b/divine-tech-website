import React from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// A small town drawn like a street map in a maps app: land, blocks of houses, white side streets, gold avenues, a park and
// street names on the roads. The home services page draws its routes and messages on it. (viewBox 640 x 360)

export const W = 640;
export const H = 360;
export const EASE = [0.22, 1, 0.36, 1];

const XS = [0, 70, 200, 330, 455, 575, 640]; // streets running north-south
const YS = [0, 48, 132, 196, 282, 360]; // streets running east-west
const MAJOR_X = 200; // Oak Ave
const MAJOR_Y = 196; // Main St
const DIAG = 'M455 132 L640 20'; // Lakeview Rd

// a small deterministic jitter, so the houses don't sit in a perfect grid
const jit = (a, b) => ((Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1 + 1) % 1;

export function MapBase() {
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
    <g>
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
    </g>
  );
}

/** Where a point of the town sits on the frame: the map keeps its proportions and covers the frame, cropped evenly. */
export function useCover(ref) {
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
export function Tag({ at, box, tone = 'ink', children, show }) {
  const tones = { ink: 'bg-ink text-white', amber: 'bg-[#FFF1E6] text-[#9A3A12] shadow-[0_0_0_1px_rgba(242,92,42,0.35)]', green: 'bg-[#E4F4E8] text-[#1F7A4C] shadow-[0_0_0_1px_rgba(20,163,107,0.3)]', white: 'bg-white text-ink' };
  // near an edge the tag opens inward, so it is never cut off (the position sits on a plain span; the motion is inside)
  const x = Math.min(box.w - 10, Math.max(10, at[0] * box.s + box.ox));
  const y = at[1] * box.s + box.oy;
  const shift = x > box.w * 0.62 ? '-translate-x-full' : x < box.w * 0.38 ? 'translate-x-0' : '-translate-x-1/2';
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


/** A route along the streets, with a white edge like a maps app; it draws itself when `show` turns on. */
export function RouteLine({ d, color, show, delay = 0, dashed = false, reduce = false, width = 4.5 }) {
  const t = { duration: reduce ? 0 : 1.2, ease: EASE, delay: reduce || !show ? 0 : delay };
  return (
    <g>
      <motion.path d={d} fill="none" stroke="#fff" strokeWidth={width + 3.5} strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }} transition={t} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '1 7' : undefined} initial={false} animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }} transition={t} />
    </g>
  );
}

/** A map pin, dropped in when `show` turns on. */
export function Pin({ x, y, color = '#F25C2A', show = true, delay = 0, reduce = false }) {
  return (
    <motion.g initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : -10 }} transition={{ duration: reduce ? 0 : 0.4, ease: EASE, delay: reduce || !show ? 0 : delay }}>
      <ellipse cx={x} cy={y + 0.5} rx={3} ry={1.2} fill="#0A0F0E" fillOpacity={0.18} />
      <path d={`M${x} ${y} C${x - 2} ${y - 4} ${x - 6} ${y - 7} ${x - 6} ${y - 11} A6 6 0 1 1 ${x + 6} ${y - 11} C${x + 6} ${y - 7} ${x + 2} ${y - 4} ${x} ${y} Z`} fill={color} stroke="#0A0F0E" strokeOpacity="0.2" strokeWidth="0.6" />
      <circle cx={x} cy={y - 11} r={2.2} fill="#fff" />
    </motion.g>
  );
}

/** Map controls and a search bar, for the look of a maps app. */
export function MapChrome({ title, children = null }) {
  return (
    <>
      <div className="absolute left-3 top-3 flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-2 pr-3.5 shadow-[0_2px_6px_rgba(10,15,14,0.14)] sm:left-4 sm:top-4">
        <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="h-[18px] w-[18px]" />
        <span className="text-[12.5px] font-medium text-ink">{title}</span>
        {children}
      </div>
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
    </>
  );
}
