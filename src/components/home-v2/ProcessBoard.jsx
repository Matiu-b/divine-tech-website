import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/*
 * "We map your business", without people: a compact shared board where the business's sources
 * (calls, emails, CRM, calendar) feed a process map that appears step by step. Three cursors
 * work on it together, like a multiplayer whiteboard: our expert, the client and the AI agent.
 * `t` drives the map; the AI agent's cursor follows it.
 */

const INK = '#0A0F0E';
const GREEN = '#14A36B';

const SOURCES = [
  { label: 'Calls', x: 18, w: 72 },
  { label: 'Emails', x: 98, w: 74 },
  { label: 'CRM', x: 180, w: 72 },
  { label: 'Calendar', x: 260, w: 82 },
];

const NODES = [
  { id: 'lead', x: 18, y: 118, w: 86, label: 'New lead' },
  { id: 'qualify', x: 132, y: 118, w: 76, label: 'Qualify' },
  { id: 'book', x: 236, y: 118, w: 106, label: 'Book viewing' },
  { id: 'approve', x: 122, y: 176, w: 96, label: 'Manager OK', tone: 'amber' },
  { id: 'crm', x: 236, y: 176, w: 106, label: 'Update CRM', tone: 'green' },
];

const EDGES = [
  { d: 'M104 131 H132', at: 1 },
  { d: 'M208 131 H236', at: 2 },
  { d: 'M170 144 V176', at: 3, dashed: true },
  { d: 'M289 144 V176', at: 4 },
];

// Where the AI agent's cursor sits at each step: next to what was just added.
const AI_AT = [
  [56, 96],
  [92, 146],
  [196, 146],
  [286, 104],
  [206, 198],
  [286, 198],
  [286, 198],
  [210, 94],
];

/** A whiteboard cursor with a name tag. @param {any} props */
function Cursor({ color, name, width }) {
  return (
    <g transform="scale(0.8)">
      <path d="M0 0 L0 17 L4.6 12.8 L7.8 20 L10.6 18.8 L7.4 11.8 L13.6 11.6 Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="11" y="18" width={width} height="19" rx="6" fill={color} />
      <text x={11 + width / 2} y="31" textAnchor="middle" fontSize="10" fill="#fff" fontFamily="inherit">
        {name}
      </text>
    </g>
  );
}

/** Moves a cursor around a loop of points (SMIL), so it looks like someone working. */
function Wander({ points, dur, still }) {
  if (still) return null;
  const values = [...points, points[0]].map((p) => p.join(' ')).join(';');
  const splines = points.map(() => '0.45 0 0.55 1').join(';');
  return <animateTransform attributeName="transform" type="translate" values={values} dur={dur} repeatCount="indefinite" calcMode="spline" keySplines={splines} />;
}

/**
 * Another business can bring its own title, source labels (four) and step labels (five, in the same places).
 * @param {{ t: number, className?: string, title?: string, sourceLabels?: string[], nodeLabels?: string[] }} props
 */
export default function ProcessBoard({ t, className = undefined, title = 'How Maple Realty works', sourceLabels = undefined, nodeLabels = undefined }) {
  const sources = SOURCES.map((x, i) => ({ ...x, label: (sourceLabels && sourceLabels[i]) || x.label }));
  const nodes = NODES.map((x, i) => ({ ...x, label: (nodeLabels && nodeLabels[i]) || x.label }));
  const still = !!useReducedMotion();
  const shown = (i) => still || t > i;
  const [ax, ay] = still ? AI_AT[7] : AI_AT[Math.max(0, Math.min(AI_AT.length - 1, t))];
  return (
    <svg
      viewBox="0 0 360 236"
      className={cn('block h-auto w-full', className)}
      role="img"
      aria-label="A shared board where our expert, the client and an AI agent map the business's processes from its calls, emails, CRM and calendar"
    >
      <rect x="4" y="4" width="352" height="228" rx="16" fill="#fff" stroke={INK} strokeOpacity="0.08" />
      <defs>
        <pattern id="pb-grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill={INK} opacity="0.08" />
        </pattern>
      </defs>
      <path d="M4 56 H356 V216 a16 16 0 0 1 -16 16 H20 a16 16 0 0 1 -16 -16 Z" fill="url(#pb-grid)" />
      <path d="M4 56 H356" stroke={INK} strokeOpacity="0.06" />

      <text x="18" y="28" fontSize="12" fill={INK} fontFamily="inherit">{title}</text>
      <text x="18" y="44" fontSize="9.5" fill="#6B716F" fontFamily="inherit">Mapped together with our expert</text>
      {[
        ['E', '#1F3B4D'],
        ['Y', '#C98A1B'],
        ['AI', GREEN],
      ].map(([l, c], i) => (
        <g key={l} transform={`translate(${300 + i * 18} 30)`}>
          <circle r="10" fill={c} stroke="#fff" strokeWidth="2" />
          <text y="3" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="inherit">{l}</text>
        </g>
      ))}

      {/* sources the agent reads, flowing into the first step */}
      {sources.map((s) => (
        <g key={s.label}>
          <path
            d={`M${s.x + s.w / 2} 88 C${s.x + s.w / 2} 106 61 100 61 118`}
            fill="none"
            stroke={GREEN}
            strokeOpacity={shown(0) ? 0.55 : 0.2}
            strokeWidth="1.4"
            strokeDasharray="3 4"
            className="transition-[stroke-opacity] duration-500"
          >
            {still ? null : <animate attributeName="stroke-dashoffset" values="14;0" dur="0.9s" repeatCount="indefinite" />}
          </path>
          <rect x={s.x} y="66" width={s.w} height="22" rx="7" fill="#F6F5F1" stroke={INK} strokeOpacity="0.1" />
          <text x={s.x + s.w / 2} y="80.5" textAnchor="middle" fontSize="9.5" fill={INK} fontFamily="inherit">
            {s.label}
          </text>
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
          strokeWidth="1.5"
          strokeDasharray="1 1"
          strokeDashoffset={shown(e.at) ? 0 : 1}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.id} className="transition-opacity duration-500" opacity={shown(i) ? 1 : 0}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={26}
            rx={8}
            fill={n.tone === 'amber' ? '#F7EDDC' : n.tone === 'green' ? '#DDF5E9' : '#F6F5F1'}
            stroke={n.tone === 'amber' ? '#C98A1B' : n.tone === 'green' ? GREEN : INK}
            strokeOpacity={n.tone ? 0.6 : 0.12}
          />
          <text x={n.x + n.w / 2} y={n.y + 17} textAnchor="middle" fontSize="10" fill={INK} fontFamily="inherit">
            {n.label}
          </text>
        </g>
      ))}

      {/* a note from the client */}
      <g className="transition-opacity duration-500" opacity={shown(5) ? 1 : 0}>
        <rect x="24" y="172" width="62" height="38" rx="4" fill="#FCE9A8" transform="rotate(-4 55 191)" />
        <text x="55" y="194" textAnchor="middle" fontSize="9" fill={INK} transform="rotate(-4 55 191)" fontFamily="inherit">Exceptions</text>
      </g>

      {/* cursors: our expert and the client wander; the AI agent follows the newest step */}
      <g transform={still ? 'translate(150 94)' : undefined}>
        <Wander points={[[150, 94], [214, 98], [176, 156], [124, 100]]} dur="9s" still={still} />
        <Cursor color="#1F3B4D" name="Our expert" width={66} />
      </g>
      <g transform={still ? 'translate(70 196)' : undefined}>
        <Wander points={[[70, 196], [96, 188], [44, 192], [82, 200]]} dur="8s" still={still} />
        <Cursor color="#C98A1B" name="You" width={32} />
      </g>
      <g style={{ transform: `translate(${ax}px, ${ay}px)`, transition: still ? undefined : 'transform 700ms cubic-bezier(0.22,1,0.36,1)' }}>
        <Cursor color={GREEN} name="AI agent" width={56} />
      </g>
    </svg>
  );
}
