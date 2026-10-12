import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
 * "We map your business", without people: a shared board where the business's sources
 * (calls, emails, CRM, calendar) feed a process map that appears step by step. Three cursors
 * work on it together, like a multiplayer whiteboard: our expert, the client and the AI agent.
 * `t` drives the map; the cursors follow it.
 */

const INK = '#0A0F0E';
const GREEN = '#14A36B';

const SOURCES = [
  { label: 'Phone calls', y: 86 },
  { label: 'Emails', y: 128 },
  { label: 'CRM', y: 170 },
  { label: 'Calendar', y: 212 },
];

const NODES = [
  { id: 'lead', x: 212, y: 135, w: 92, label: 'New lead' },
  { id: 'qualify', x: 332, y: 135, w: 86, label: 'Qualify' },
  { id: 'book', x: 446, y: 135, w: 104, label: 'Book viewing' },
  { id: 'approve', x: 318, y: 207, w: 114, label: 'Manager OK', tone: 'amber' },
  { id: 'follow', x: 578, y: 135, w: 92, label: 'Follow up' },
  { id: 'crm', x: 578, y: 207, w: 92, label: 'Update CRM', tone: 'green' },
];

const EDGES = [
  { d: 'M304 150 H332', at: 1 },
  { d: 'M418 150 H446', at: 2 },
  { d: 'M375 165 V207', at: 3, dashed: true },
  { d: 'M550 150 H578', at: 4 },
  { d: 'M624 165 V207', at: 5 },
];

// Where the AI agent's cursor sits at each step: next to the node it just added.
const AI_AT = [
  [168, 104],
  [290, 172],
  [404, 172],
  [536, 172],
  [420, 240],
  [598, 172],
  [600, 244],
  [600, 92],
];

/** A whiteboard cursor with a name tag. @param {any} props */
function Cursor({ color, name, width, children = null }) {
  return (
    <g>
      {children}
      <path d="M0 0 L0 17 L4.6 12.8 L7.8 20 L10.6 18.8 L7.4 11.8 L13.6 11.6 Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="11" y="18" width={width} height="20" rx="6" fill={color} />
      <text x={11 + width / 2} y="31.5" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="inherit">
        {name}
      </text>
    </g>
  );
}

/** Moves a cursor around a loop of points (SMIL), so it looks like someone working. */
function Wander({ points, dur, still }) {
  if (still) return null;
  const values = [...points, points[0]].map((p) => p.join(' ')).join(';');
  const n = points.length;
  const splines = Array.from({ length: n }, () => '0.45 0 0.55 1').join(';');
  return <animateTransform attributeName="transform" type="translate" values={values} dur={dur} repeatCount="indefinite" calcMode="spline" keySplines={splines} />;
}

/** @param {{ t: number, className?: string }} props */
export default function ProcessBoard({ t, className = undefined }) {
  const still = !!useReducedMotion();
  const shown = (i) => still || t > i;
  const [ax, ay] = still ? AI_AT[7] : AI_AT[Math.max(0, Math.min(AI_AT.length - 1, t))];
  return (
    <svg
      viewBox="0 0 700 300"
      className={cn('block h-auto w-full', className)}
      role="img"
      aria-label="A shared board where our expert, the client and an AI agent map the business's processes from its calls, emails, CRM and calendar"
    >
      <rect x="10" y="10" width="680" height="280" rx="18" fill="#fff" stroke={INK} strokeOpacity="0.08" />
      {/* faint dot grid, like a whiteboard canvas */}
      <defs>
        <pattern id="pb-grid" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={INK} opacity="0.07" />
        </pattern>
      </defs>
      <rect x="10" y="64" width="680" height="226" fill="url(#pb-grid)" />
      <path d="M10 64 H690" stroke={INK} strokeOpacity="0.06" />

      <text x="34" y="34" fontSize="12" fill={INK} fontFamily="inherit">How Maple Realty works</text>
      <text x="34" y="52" fontSize="10.5" fill="#6B716F" fontFamily="inherit">Our expert, you and the AI agent, mapping together</text>
      {/* who is on the board */}
      <g>
        {[
          ['E', '#1F3B4D'],
          ['Y', '#C98A1B'],
          ['AI', GREEN],
        ].map(([l, c], i) => (
          <g key={l} transform={`translate(${612 + i * 22} 37)`}>
            <circle r="12" fill={c} stroke="#fff" strokeWidth="2" />
            <text y="3.5" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="inherit">{l}</text>
          </g>
        ))}
      </g>

      {/* sources the agent reads */}
      {SOURCES.map((s, i) => (
        <g key={s.label} className="transition-opacity duration-500" opacity={shown(0) || i === 0 ? 1 : 0.35}>
          <rect x="34" y={s.y} width="118" height="30" rx="9" fill="#F6F5F1" stroke={INK} strokeOpacity="0.1" />
          <text x="93" y={s.y + 19} textAnchor="middle" fontSize="10.5" fill={INK} fontFamily="inherit">
            {s.label}
          </text>
          <path
            d={`M152 ${s.y + 15} C182 ${s.y + 15} 182 150 212 150`}
            fill="none"
            stroke={GREEN}
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          >
            {still ? null : <animate attributeName="stroke-dashoffset" values="14;0" dur="0.9s" repeatCount="indefinite" />}
          </path>
        </g>
      ))}

      {/* the process map */}
      {EDGES.map((e) => (
        <path
          key={e.d}
          d={e.d}
          pathLength={1}
          fill="none"
          stroke={e.dashed ? '#C98A1B' : INK}
          strokeOpacity={e.dashed ? 0.9 : 0.35}
          strokeWidth="1.6"
          strokeDasharray="1 1"
          strokeDashoffset={shown(e.at) ? 0 : 1}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      ))}
      {NODES.map((n, i) => (
        <g key={n.id} className="transition-opacity duration-500" opacity={shown(i) ? 1 : 0}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={30}
            rx={9}
            fill={n.tone === 'amber' ? '#F7EDDC' : n.tone === 'green' ? '#DDF5E9' : '#F6F5F1'}
            stroke={n.tone === 'amber' ? '#C98A1B' : n.tone === 'green' ? GREEN : INK}
            strokeOpacity={n.tone ? 0.6 : 0.12}
          />
          <text x={n.x + n.w / 2} y={n.y + 19} textAnchor="middle" fontSize="10.5" fill={INK} fontFamily="inherit">
            {n.label}
          </text>
        </g>
      ))}

      {/* notes added by the expert and the client */}
      <g className="transition-opacity duration-500" opacity={shown(6) ? 1 : 0}>
        <rect x="452" y="206" width="66" height="44" rx="4" fill="#FCE9A8" transform="rotate(-4 485 228)" />
        <text x="485" y="232" textAnchor="middle" fontSize="9.5" fill={INK} transform="rotate(-4 485 228)" fontFamily="inherit">Exceptions</text>
        <rect x="212" y="212" width="58" height="40" rx="4" fill="#CDEFDF" transform="rotate(3 241 232)" />
        <text x="241" y="235" textAnchor="middle" fontSize="9.5" fill={INK} transform="rotate(3 241 232)" fontFamily="inherit">Rules</text>
      </g>

      {/* cursors: our expert and the client wander; the AI agent follows the newest step */}
      <g transform={still ? 'translate(430 92)' : undefined}>
        <Wander points={[[430, 92], [480, 100], [420, 186], [396, 104]]} dur="9s" still={still} />
        <Cursor color="#1F3B4D" name="Our expert" width={70} />
      </g>
      <g transform={still ? 'translate(250 236)' : undefined}>
        <Wander points={[[250, 236], [300, 226], [520, 240], [380, 234]]} dur="11s" still={still} />
        <Cursor color="#C98A1B" name="You" width={34} />
      </g>
      <g style={{ transform: `translate(${ax}px, ${ay}px)`, transition: still ? undefined : 'transform 700ms cubic-bezier(0.22,1,0.36,1)' }}>
        <Cursor color={GREEN} name="AI agent" width={58} />
      </g>
    </svg>
  );
}
