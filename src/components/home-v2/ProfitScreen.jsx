import React, { useEffect, useRef, useState } from 'react';
import { Bell, Search } from 'lucide-react';

/*
 * The Aurora dashboard on the owner's monitor in the profitability film. It is drawn as real UI at a
 * fixed size and fitted onto the screen in the footage (a perspective transform from the screen's four
 * corners), so it stays sharp and can animate with the film. Figures belong to a fictional business.
 */
const BW = 640;
const BH = 360;

// Solves the perspective transform that takes the BW×BH rectangle to the four corners (tl, tr, br, bl).
function matrix3d(pts) {
  const src = [
    [0, 0],
    [BW, 0],
    [BW, BH],
    [0, BH],
  ];
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = pts[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  // Gaussian elimination
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const h = b.map((v, i) => v / A[i][i]);
  const [a, bb, c, d, e, f, g, hh] = h;
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

const KPIS = [
  ['Leads converted', '312', '+48 vs last quarter', 'up'],
  ['Hours on routine work', '41 h', '−126 h vs last quarter', 'up'],
  ['Handled by Aurora', '1,284', 'calls, chats, follow-ups', 'flat'],
];
// Revenue climbs, costs hold: the gap is the margin. Points over twelve weeks (0 = bottom, 100 = top).
const REVENUE = [30, 33, 32, 37, 41, 44, 47, 52, 55, 61, 66, 72];
const COSTS = [26, 27, 26, 27, 27, 28, 27, 28, 28, 28, 29, 28];

function line(vals, w, h) {
  return vals.map((v, i) => `${i ? 'L' : 'M'}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - (v / 100) * h).toFixed(1)}`).join(' ');
}

function Dashboard({ p }) {
  const cw = 584;
  const ch = 130;
  return (
    <div className="h-full w-full bg-[#FBF9F5] p-6 text-ink" style={{ fontFamily: 'inherit' }}>
      <div className="flex items-center justify-between">
        <img src="/brand/aurora-logo-horizontal-color.svg" alt="" className="h-[18px] w-auto" />
        <div className="flex items-center gap-3 text-ink/50">
          <span className="flex h-[24px] items-center gap-1.5 rounded-full bg-[#F1ECE4] px-3 text-[10px]">
            <Search className="h-3 w-3" strokeWidth={2} /> Search or jump to…
          </span>
          <Bell className="h-4 w-4" strokeWidth={1.8} />
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-ink text-[9px] font-medium text-white">JR</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[19px] font-medium leading-none tracking-[-0.02em]">This quarter</p>
          <p className="mt-1.5 text-[10.5px] text-graphite">Revenue is growing faster than costs.</p>
        </div>
        <span className="rounded-full bg-[#E4F4E8] px-2.5 py-1 text-[10px] font-medium text-[#2E7A48]">Margin up</span>
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {KPIS.map(([l, v, s, t], i) => (
          <div key={l} className="rounded-[12px] bg-white p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.07)]" style={{ opacity: p > 0.05 + i * 0.12 ? 1 : 0.35, transition: 'opacity 500ms' }}>
            <p className="text-[9.5px] text-graphite">{l}</p>
            <p className="mt-1.5 text-[20px] font-medium leading-none tracking-[-0.02em]">{v}</p>
            <p className={t === 'up' ? 'mt-1.5 text-[9px] font-medium text-[#2E7A48]' : 'mt-1.5 text-[9px] text-slate'}>{s}</p>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-[12px] bg-white px-4 pb-2 pt-3 shadow-[0_0_0_1px_rgba(10,15,14,0.07)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium">Revenue vs. costs</p>
          <div className="flex items-center gap-3 text-[9px] text-slate">
            <span className="flex items-center gap-1.5">
              <span className="h-[3px] w-3.5 rounded-full bg-[#14A36B]" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[3px] w-3.5 rounded-full bg-[#F25C2A]" /> Costs
            </span>
          </div>
        </div>
        <svg viewBox={`0 0 ${cw} ${ch}`} className="mt-1 block w-full" style={{ height: ch * 0.82 }}>
          {[0.25, 0.5, 0.75].map((y) => (
            <line key={y} x1="0" x2={cw} y1={ch * y} y2={ch * y} stroke="#0A0F0E" strokeOpacity="0.06" />
          ))}
          <path d={`${line(REVENUE, cw, ch)} L${cw} ${ch} L0 ${ch} Z`} fill="#14A36B" fillOpacity="0.08" style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }} />
          <path d={line(COSTS, cw, ch)} fill="none" stroke="#F25C2A" strokeWidth="2.2" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
          <path d={line(REVENUE, cw, ch)} fill="none" stroke="#14A36B" strokeWidth="2.8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
      </div>
    </div>
  );
}

/** Fits the dashboard onto the monitor in the footage. `quad` is the screen's corners as fractions of the video frame. */
export default function ProfitScreen({ quad, aspect = 16 / 9, p = 1 }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  let style = { visibility: 'hidden' };
  if (box) {
    // the film covers its card: scale to fill, centred
    const s = Math.max(box.w / aspect, box.h);
    const vw = s * aspect;
    const vh = s;
    const ox = (box.w - vw) / 2;
    const oy = (box.h - vh) / 2;
    const pts = quad.map(([u, v]) => [ox + u * vw, oy + v * vh]);
    style = { width: BW, height: BH, transform: matrix3d(pts), transformOrigin: '0 0' };
  }
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 top-0" style={style}>
        <Dashboard p={p} />
        {/* the screen's own light: a soft sheen so it sits in the room */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_40%,rgba(255,226,180,0.08)_100%)]" />
      </div>
    </div>
  );
}
