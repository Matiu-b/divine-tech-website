import React from 'react';
import { useReducedMotion } from 'framer-motion';
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

/**
 * Small SVG animations (SMIL), so they stay in the drawing's own coordinates.
 * Skipped entirely for reduced motion.
 */
function Spin({ values, dur, begin = '0s', still }) {
  if (still) return null;
  return <animateTransform attributeName="transform" type="rotate" values={values} dur={dur} begin={begin} repeatCount="indefinite" calcMode="spline" keySplines={values.split(';').slice(1).map(() => '0.45 0 0.55 1').join(';')} />;
}

/** Eyes that blink every few seconds, looking a little to one side. @param {any} props */
function Eyes({ look = 0, delay = '0s', still }) {
  return (
    <g fill="#1C1A18">
      {[-7, 7].map((ex) => (
        <ellipse key={ex} cx={ex + look} cy={-8} rx={2} ry={2.4}>
          {still ? null : <animate attributeName="ry" values="2.4;2.4;0.3;2.4;2.4" keyTimes="0;0.9;0.94;0.98;1" dur="4.6s" begin={delay} repeatCount="indefinite" />}
        </ellipse>
      ))}
    </g>
  );
}

/** A seated or standing person, drawn flat, with a simple friendly face. @param {any} props */
function Person({ x, y, scale = 1, skin, hair, top, hairStyle = 'short', arm = null, extend = 0, look = 0, nod = null, talk = false, blinkDelay = '0s', still }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* torso (extended down behind the table when seated) */}
      {extend ? <rect x="-30" y="50" width="60" height={extend} fill={top} /> : null}
      <path d="M-30 64 C-30 28 -18 18 0 18 C18 18 30 28 30 64 Z" fill={top} />
      <rect x="-6" y="6" width="12" height="16" rx="5" fill={skin} />
      {/* the head nods around the neck */}
      <g>
        {nod ? <Spin values={nod.values} dur={nod.dur} begin={nod.begin} still={still} /> : null}
        {hairStyle === 'long' ? <path d="M-22 -6 C-25 -36 25 -36 22 -6 L23 24 C14 22 15 6 13 -2 L-13 -2 C-15 6 -14 22 -23 24 Z" fill={hair} /> : null}
        <circle cx="0" cy="-8" r="19" fill={skin} />
        {hairStyle === 'short' ? <path d="M-19 -10 C-19 -31 19 -33 19 -12 C14 -21 -8 -23 -19 -10 Z" fill={hair} /> : null}
        {hairStyle === 'long' ? <path d="M-19 -8 C-20 -31 20 -31 19 -8 C12 -19 -10 -19 -19 -8 Z" fill={hair} /> : null}
        {hairStyle === 'bun' ? (
          <>
            <circle cx="0" cy="-31" r="8" fill={hair} />
            <path d="M-19 -8 C-20 -30 20 -30 19 -8 C12 -18 -10 -18 -19 -8 Z" fill={hair} />
          </>
        ) : null}
        {/* face */}
        <path d={`M${-10 + look} -14 q3 -2 6 0 M${4 + look} -14 q3 -2 6 0`} stroke="#1C1A18" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <Eyes look={look} delay={blinkDelay} still={still} />
        <ellipse cx={-11 + look} cy="0" rx="3.2" ry="2" fill="#E0846F" opacity="0.35" />
        <ellipse cx={11 + look} cy="0" rx="3.2" ry="2" fill="#E0846F" opacity="0.35" />
        {talk && !still ? (
          <ellipse cx={look} cy="2" rx="3.4" ry="1.4" fill="#7A3B2E">
            <animate attributeName="ry" values="1.2;2.6;1;2.2;1.2" dur="0.9s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <path d={`M${-4.5 + look} 1 q4.5 4 9 0`} stroke="#7A3B2E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        )}
      </g>
      {arm}
    </g>
  );
}

/** @param {{ t: number, className?: string }} props */
export default function MappingScene({ t, className = undefined }) {
  const still = !!useReducedMotion();
  const shown = (i) => t > i;
  return (
    <svg viewBox="20 10 690 318" className={cn('block h-auto w-full', className)} role="img" aria-label="Two experts and a client around a table, mapping the business's processes on a board while an AI agent maps along on a laptop">
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
      {/* legs and shoes of the standing expert, behind the table */}
      <rect x="278" y="184" width="21" height="132" rx="9" fill="#2A3640" />
      <rect x="301" y="184" width="21" height="132" rx="9" fill="#2A3640" />
      <rect x="272" y="310" width="28" height="10" rx="5" fill="#1C1A18" />
      <rect x="300" y="310" width="28" height="10" rx="5" fill="#1C1A18" />
      <Person
        x={300}
        y={108}
        scale={1.25}
        skin={SKIN.b}
        hair="#1C1A18"
        top="#1F3B4D"
        hairStyle="short"
        look={4}
        talk
        still={still}
        nod={{ values: '0 0 6;-4 0 6;3 0 6;0 0 6', dur: '5s' }}
        arm={
          <g>
            <Spin values="0 18 30;-9 18 30;5 18 30;-3 18 30;0 18 30" dur="4.4s" still={still} />
            <path d="M18 30 L40 6 L52 -6" stroke="#1F3B4D" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="53" cy="-7" r="5" fill={SKIN.b} />
          </g>
        }
      />

      {/* the client, seated on the left, nodding along */}
      <Person
        x={104}
        y={178}
        skin={SKIN.c}
        hair="#8A5A2B"
        top="#D98E5B"
        hairStyle="long"
        extend={30}
        look={4}
        blinkDelay="1.3s"
        still={still}
        nod={{ values: '0 0 8;6 0 8;0 0 8;5 0 8;0 0 8;0 0 8', dur: '3.6s', begin: '0.8s' }}
      />
      {/* our second expert, seated, typing on the laptop */}
      <Person
        x={206}
        y={182}
        skin={SKIN.a}
        hair="#3B2A20"
        top="#14A36B"
        hairStyle="bun"
        extend={26}
        look={-3}
        blinkDelay="2.4s"
        still={still}
        nod={{ values: '0 0 8;-5 0 8;-5 0 8;4 0 8;0 0 8', dur: '6s', begin: '0.4s' }}
        arm={
          <g fill={SKIN.a}>
            <ellipse cx="26" cy="64" rx="5" ry="3.5">
              {still ? null : <animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="0.42s" repeatCount="indefinite" />}
            </ellipse>
            <ellipse cx="38" cy="66" rx="5" ry="3.5">
              {still ? null : <animateTransform attributeName="transform" type="translate" values="0 -2.5;0 0;0 -2.5" dur="0.42s" repeatCount="indefinite" />}
            </ellipse>
          </g>
        }
      />

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
        <rect x="166" y="281" width="208" height="28" rx="14" fill="#fff" stroke={INK} strokeOpacity="0.08" />
        <circle cx="183" cy="295" r="4" fill="#14A36B" />
        <text x="194" y="299" fontSize="10.5" fill={INK} fontFamily="inherit" textLength="166" lengthAdjust="spacing">AI agent mapping along</text>
      </g>
    </svg>
  );
}
