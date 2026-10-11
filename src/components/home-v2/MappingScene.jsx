import React from 'react';
import { cn } from '@/lib/utils';

/*
 * "We map your business": a drawn scene, all in SVG. Two of our experts and the client sit around
 * a table while one expert maps the business's processes on a board; an AI agent on the laptop
 * maps along. `t` drives the drawing: the process map appears node by node, the connections draw in.
 */

const SKIN = { a: '#E9B48C', b: '#B97A52', c: '#F3CDB0' };
const INK = '#0A0F0E';

// The process map on the board.
const NODES = [
  { id: 'lead', x: 356, y: 70, w: 86, label: 'New lead' },
  { id: 'qualify', x: 468, y: 70, w: 86, label: 'Qualify' },
  { id: 'book', x: 580, y: 70, w: 92, label: 'Book viewing' },
  { id: 'approve', x: 440, y: 136, w: 114, label: 'Manager OK', tone: 'amber' },
  { id: 'follow', x: 580, y: 136, w: 92, label: 'Follow up' },
  { id: 'crm', x: 580, y: 196, w: 92, label: 'Update CRM', tone: 'green' },
];
const EDGES = [
  { d: 'M442 85 H468', at: 1 },
  { d: 'M554 85 H580', at: 2 },
  { d: 'M511 100 V136', at: 3, dashed: true },
  { d: 'M626 100 V136', at: 4 },
  { d: 'M626 166 V196', at: 5 },
];

/** A seated or standing person, drawn flat. @param {any} props */
function Person({ x, y, scale = 1, skin, hair, top, hairStyle = 'short', arm = null, flip = false, extend = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* torso (extended down behind the table when seated) */}
      {extend ? <rect x="-30" y="50" width="60" height={extend} fill={top} /> : null}
      <path d="M-30 64 C-30 28 -18 18 0 18 C18 18 30 28 30 64 Z" fill={top} />
      {/* neck and head */}
      <rect x="-6" y="6" width="12" height="16" rx="5" fill={skin} />
      <circle cx="0" cy="-8" r="19" fill={skin} />
      {hairStyle === 'short' ? <path d="M-19 -10 C-19 -30 19 -32 19 -12 C14 -20 -8 -22 -19 -10 Z" fill={hair} /> : null}
      {hairStyle === 'long' ? <path d="M-21 -6 C-24 -34 24 -34 21 -6 L22 22 C14 18 16 4 14 -8 C4 -16 -8 -16 -14 -8 C-16 4 -14 18 -22 22 Z" fill={hair} /> : null}
      {hairStyle === 'bun' ? (
        <>
          <circle cx="0" cy="-30" r="8" fill={hair} />
          <path d="M-19 -8 C-20 -30 20 -30 19 -8 C12 -18 -10 -18 -19 -8 Z" fill={hair} />
        </>
      ) : null}
      {arm}
    </g>
  );
}

/** @param {{ t: number, className?: string }} props */
export default function MappingScene({ t, className = undefined }) {
  const shown = (i) => t > i;
  return (
    <svg viewBox="0 0 720 340" className={cn('block h-auto w-full', className)} role="img" aria-label="Two experts and a client around a table, mapping the business's processes on a board while an AI agent maps along on a laptop">
      {/* floor shadow */}
      <ellipse cx="300" cy="322" rx="290" ry="12" fill={INK} opacity="0.06" />

      {/* the board */}
      <g>
        <rect x="336" y="22" width="356" height="224" rx="16" fill="#fff" stroke={INK} strokeOpacity="0.08" />
        <text x="356" y="50" fontSize="11" fill="#6B716F" fontFamily="inherit">How Maple Realty works</text>
        <circle cx="672" cy="46" r="4" fill="#14A36B" opacity={t > 0 ? 1 : 0.2} className="transition-opacity duration-500" />
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
              stroke={n.tone === 'amber' ? '#C98A1B' : n.tone === 'green' ? '#14A36B' : INK}
              strokeOpacity={n.tone ? 0.6 : 0.12}
            />
            <text x={n.x + n.w / 2} y={n.y + 19} textAnchor="middle" fontSize="10.5" fill={INK} fontFamily="inherit">
              {n.label}
            </text>
          </g>
        ))}
        {/* sticky notes */}
        <g className="transition-opacity duration-500" opacity={shown(6) ? 1 : 0}>
          <rect x="356" y="192" width="58" height="40" rx="4" fill="#FCE9A8" transform="rotate(-4 385 212)" />
          <text x="385" y="215" textAnchor="middle" fontSize="9.5" fill={INK} transform="rotate(-4 385 212)" fontFamily="inherit">Exceptions</text>
          <rect x="424" y="196" width="50" height="38" rx="4" fill="#CDEFDF" transform="rotate(3 449 215)" />
          <text x="449" y="218" textAnchor="middle" fontSize="9.5" fill={INK} transform="rotate(3 449 215)" fontFamily="inherit">Rules</text>
        </g>
      </g>

      {/* the expert at the board, standing and pointing */}
      <Person
        x={300}
        y={108}
        scale={1.25}
        skin={SKIN.b}
        hair="#1C1A18"
        top="#1F3B4D"
        hairStyle="short"
        arm={<path d="M18 30 L40 6 L52 -6" stroke="#1F3B4D" strokeWidth="9" strokeLinecap="round" fill="none" />}
      />
      <rect x="276" y="186" width="48" height="80" rx="10" fill="#2A3640" />

      {/* the client, seated on the left */}
      <Person x={104} y={178} skin={SKIN.c} hair="#8A5A2B" top="#D98E5B" hairStyle="long" extend={30} />
      {/* our second expert, seated, with the laptop */}
      <Person x={206} y={182} skin={SKIN.a} hair="#3B2A20" top="#14A36B" hairStyle="bun" extend={26} />

      {/* the table */}
      <rect x="40" y="252" width="420" height="14" rx="7" fill="#CDB89A" />
      <rect x="70" y="266" width="10" height="56" rx="4" fill="#B9A384" />
      <rect x="420" y="266" width="10" height="56" rx="4" fill="#B9A384" />

      {/* laptop with the AI agent */}
      <path d="M232 252 L240 214 H300 L308 252 Z" fill="#2B3332" />
      <circle cx="270" cy="232" r={t > 0 ? 7 : 5} fill="#3CE09A" opacity="0.9" className="transition-all duration-700" />
      <circle cx="270" cy="232" r="12" fill="#3CE09A" opacity={t > 0 ? 0.25 : 0} className="transition-opacity duration-700" />
      {/* papers and a cup */}
      <rect x="128" y="244" width="46" height="8" rx="2" fill="#fff" transform="rotate(-3 151 248)" />
      <rect x="360" y="236" width="18" height="16" rx="4" fill="#fff" stroke={INK} strokeOpacity="0.1" />

      {/* label for the AI agent */}
      <g className="transition-opacity duration-500" opacity={t > 0 ? 1 : 0}>
        <rect x="196" y="282" width="148" height="26" rx="13" fill="#fff" stroke={INK} strokeOpacity="0.08" />
        <circle cx="212" cy="295" r="4" fill="#14A36B" />
        <text x="222" y="299" fontSize="10.5" fill={INK} fontFamily="inherit">AI agent mapping along</text>
      </g>
    </svg>
  );
}
