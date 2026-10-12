import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Person, SKIN, Spin } from './MappingScene';

/*
 * Small drawn scenes for the outcomes section, in the same flat style as the mapping scene.
 * They show the idea (work leaves the desk, every team gets answers out, the business grows),
 * never a number. SMIL animations only; reduced motion shows a still frame.
 */

const INK = '#0A0F0E';
const GREEN = '#14A36B';
const MINT = '#3CE09A';
const WOOD = '#C9B596';
const WOOD_DARK = '#B9A384';
const LAPTOP = '#2B3332';

function Desk({ x, w, y = 112, legs = [x + 10, x + w - 17] }) {
  return (
    <g>
      {legs.map((lx) => (
        <rect key={lx} x={lx} y={y + 8} width="7" height={150 - y - 10} rx="3" fill={WOOD_DARK} />
      ))}
      <rect x={x} y={y} width={w} height="9" rx="4" fill={WOOD} />
    </g>
  );
}

function Check({ cx, cy, r = 9 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={GREEN} />
      <path d={`M${cx - r * 0.42} ${cy} l${r * 0.3} ${r * 0.32} l${r * 0.55} ${-r * 0.62}`} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
}

/** Pops in, holds, fades: one beat of a repeating loop. */
function Pop({ begin, dur = '3.6s', still, children }) {
  if (still) return <g>{children}</g>;
  return (
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.08;0.55;0.65;1" dur={dur} begin={begin} repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0 6;0 0;0 0;0 -4;0 -4" keyTimes="0;0.08;0.55;0.65;1" dur={dur} begin={begin} repeatCount="indefinite" />
      {children}
    </g>
  );
}

/* Savings: tasks leave the paper stack, go through Aurora and come out done. */
function SavingsScene({ still }) {
  return (
    <>
      <ellipse cx="140" cy="150" rx="128" ry="6" fill={INK} opacity="0.06" />
      <Person
        x={88}
        y={54}
        scale={0.9}
        skin={SKIN.c}
        hair="#3B2A20"
        top="#1F3B4D"
        hairStyle="short"
        extend={12}
        look={5}
        still={still}
        nod={{ values: '0 0 8;3 0 8;0 0 8;0 0 8', dur: '5.4s' }}
        arm={
          <g>
            <ellipse cx="30" cy="58" rx="6" ry="4.5" fill={SKIN.c} />
            <rect x="26" y="40" width="14" height="16" rx="3.5" fill="#fff" stroke={INK} strokeOpacity="0.15" />
            {still ? null : (
              <path d="M31 36 q-3 -5 0 -10 M36 36 q-3 -5 0 -10" stroke={INK} strokeOpacity="0.2" strokeWidth="1.5" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0;1;0" dur="2.6s" repeatCount="indefinite" />
              </path>
            )}
          </g>
        }
      />
      <Desk x={26} w={228} />
      {/* laptop with Aurora */}
      <path d="M120 112 L126 80 H170 L176 112 Z" fill={LAPTOP} />
      <circle cx="148" cy="96" r="5.5" fill={MINT} />
      <circle cx="148" cy="96" r="10" fill={MINT} opacity="0.22">
        {still ? null : <animate attributeName="r" values="7;12;7" dur="2.4s" repeatCount="indefinite" />}
      </circle>
      {/* the stack of routine work */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={196 + (i % 2) * 2} y={104 - i * 5} width="42" height="7" rx="1.5" fill="#fff" stroke={INK} strokeOpacity="0.14" />
        ))}
      </g>
      {/* papers travelling from the stack into Aurora */}
      {still
        ? null
        : [0, 0.8, 1.6].map((b) => (
            <g key={b} opacity="0">
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" dur="2.4s" begin={`${b}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values="217 76;186 58;150 90" keyTimes="0;0.5;1" dur="2.4s" begin={`${b}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
              <rect x="-10" y="-7" width="20" height="14" rx="2" fill="#fff" stroke={INK} strokeOpacity="0.2" />
              <path d="M-6 -2 H6 M-6 2 H3" stroke={INK} strokeOpacity="0.25" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          ))}
      {/* and coming out done */}
      {still ? (
        <Check cx={148} cy={52} />
      ) : (
        [1.2, 2.0, 2.8].map((b) => (
          <g key={b} opacity="0">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.7;1" dur="2.4s" begin={`${b}s`} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -44" dur="2.4s" begin={`${b}s`} repeatCount="indefinite" />
            <Check cx={148} cy={74} r={8} />
          </g>
        ))
      )}
    </>
  );
}

/* Efficiency: three departments, each getting work done in turn. */
const TEAM = [
  { x: 54, label: 'Sales', skin: SKIN.b, hair: '#1C1A18', top: '#1F3B4D', hairStyle: 'short', look: 3 },
  { x: 140, label: 'Service', skin: SKIN.c, hair: '#8A5A2B', top: '#D98E5B', hairStyle: 'long', look: 0 },
  { x: 226, label: 'Operations', skin: SKIN.a, hair: '#3B2A20', top: GREEN, hairStyle: 'bun', look: -3 },
];

function EfficiencyScene({ still }) {
  return (
    <>
      <ellipse cx="140" cy="150" rx="132" ry="6" fill={INK} opacity="0.06" />
      {TEAM.map((p, i) => (
        <Person
          key={p.label}
          x={p.x}
          y={66}
          scale={0.7}
          skin={p.skin}
          hair={p.hair}
          top={p.top}
          hairStyle={p.hairStyle}
          extend={10}
          look={p.look}
          blinkDelay={`${i * 1.1}s`}
          still={still}
          nod={{ values: '0 0 8;4 0 8;0 0 8;0 0 8', dur: '3.6s', begin: `${i * 0.6 + 0.3}s` }}
        />
      ))}
      <Desk x={12} w={256} legs={[94, 179]} />
      {TEAM.map((p) => (
        <path key={p.label} d={`M${p.x - 19} 112 L${p.x - 15} 94 H${p.x + 15} L${p.x + 19} 112 Z`} fill={LAPTOP} />
      ))}
      {TEAM.map((p) => (
        <circle key={p.label} cx={p.x} cy="103" r="3" fill={MINT} />
      ))}
      {/* each team gets a "done" in turn */}
      {TEAM.map((p, i) => (
        <Pop key={p.label} begin={`${i * 0.6}s`} still={still}>
          <rect x={p.x - 17} y="4" width="34" height="22" rx="11" fill="#fff" stroke={INK} strokeOpacity="0.08" />
          <path d={`M${p.x - 4} 26 l4 5 l4 -5 Z`} fill="#fff" />
          <Check cx={p.x} cy={15} r={7} />
        </Pop>
      ))}
      {TEAM.map((p) => (
        <text key={p.label} x={p.x} y="143" textAnchor="middle" fontSize="10.5" fill="#6B716F" fontFamily="inherit">
          {p.label}
        </text>
      ))}
    </>
  );
}

/* Profitability: the business growing on the board. */
const BARS = [20, 30, 42, 56, 76];

function ProfitScene({ still }) {
  return (
    <>
      <ellipse cx="140" cy="150" rx="128" ry="6" fill={INK} opacity="0.06" />
      {/* easel and board */}
      <path d="M150 114 L140 148 M236 114 L246 148" stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" />
      <rect x="116" y="12" width="154" height="104" rx="12" fill="#fff" stroke={INK} strokeOpacity="0.08" />
      <path d="M128 104 H258" stroke={INK} strokeOpacity="0.1" />
      {BARS.map((h, i) => {
        const x = 134 + i * 24;
        const last = i === BARS.length - 1;
        return (
          <rect key={h} x={x} y={104 - h} width="16" height={h} rx="4" fill={last ? GREEN : INK} fillOpacity={last ? 1 : 0.1 + i * 0.05}>
            {still ? null : (
              <>
                <animate attributeName="height" values={`${h * 0.25};${h};${h};${h * 0.25}`} keyTimes="0;0.35;0.85;1" dur="5s" begin={`${i * 0.12}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.2 1;0 0 1 1;0.4 0 0.6 1" />
                <animate attributeName="y" values={`${104 - h * 0.25};${104 - h};${104 - h};${104 - h * 0.25}`} keyTimes="0;0.35;0.85;1" dur="5s" begin={`${i * 0.12}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.2 1;0 0 1 1;0.4 0 0.6 1" />
              </>
            )}
          </rect>
        );
      })}
      {/* the trend arrow */}
      <g stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M134 72 L166 58 L196 54 L250 16" pathLength="1" strokeDasharray="1 1" strokeDashoffset={still ? 0 : 1}>
          {still ? null : <animate attributeName="stroke-dashoffset" values="1;0;0;1" keyTimes="0;0.4;0.85;1" dur="5s" repeatCount="indefinite" />}
        </path>
        <path d="M238 14 L251 15 L250 28" opacity={still ? 1 : 0}>
          {still ? null : <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.36;0.42;0.85;1" dur="5s" repeatCount="indefinite" />}
        </path>
      </g>
      {/* the person presenting it */}
      <rect x="57" y="104" width="12" height="42" rx="5.5" fill="#2A3640" />
      <rect x="71" y="104" width="12" height="42" rx="5.5" fill="#2A3640" />
      <rect x="53" y="142" width="16" height="7" rx="3.5" fill="#1C1A18" />
      <rect x="71" y="142" width="16" height="7" rx="3.5" fill="#1C1A18" />
      <Person
        x={70}
        y={52}
        scale={0.85}
        skin={SKIN.a}
        hair="#8A5A2B"
        top="#D98E5B"
        hairStyle="long"
        look={4}
        talk
        still={still}
        nod={{ values: '0 0 6;-3 0 6;3 0 6;0 0 6', dur: '4.8s' }}
        arm={
          <g>
            <Spin values="0 18 30;-8 18 30;4 18 30;0 18 30" dur="4s" still={still} />
            <path d="M18 30 L38 10 L50 0" stroke="#D98E5B" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="51" cy="-1" r="5" fill={SKIN.a} />
          </g>
        }
      />
    </>
  );
}

const SCENES = { cost: SavingsScene, speed: EfficiencyScene, margin: ProfitScene };
const LABELS = {
  cost: 'Routine tasks move from a paper stack into Aurora and come out done',
  speed: 'Sales, service and operations each get work done in turn',
  margin: 'A presenter points at a bar chart that keeps growing',
};

/** @param {{ kind: 'cost' | 'speed' | 'margin' }} props */
export default function OutcomeScene({ kind }) {
  const still = !!useReducedMotion();
  const Scene = SCENES[kind];
  return (
    <svg viewBox="0 0 280 156" className="block h-auto w-full" role="img" aria-label={LABELS[kind]}>
      <Scene still={still} />
    </svg>
  );
}
