import React, { useEffect, useRef, useState } from 'react';

/*
 * The Aurora dashboard on a monitor in the outcome films (the owner's phone in his van, or the owner's margin). It is drawn as real UI at a
 * fixed size and fitted onto the screen in the footage (a perspective transform from the screen's four
 * corners), so it stays sharp and can animate with the film. Figures belong to a fictional business.
 */
// each screen is drawn at its own fixed size: a 16:9 monitor, or a phone held upright
const SIZES = { margin: [640, 360], phone: [360, 760] };

// Solves the perspective transform that takes the BW×BH rectangle to the four corners (tl, tr, br, bl).
function matrix3d(pts, BW, BH) {
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
  ['Routine hours', '41 h', '−126 h vs last quarter', 'up'],
  ['Handled by Aurora', '1,284', 'calls, chats, follow-ups', 'flat'],
];
// Revenue climbs, costs hold: the gap is the margin. Points over twelve weeks (0 = bottom, 100 = top).
const REVENUE = [30, 33, 32, 37, 41, 44, 47, 52, 55, 61, 66, 72];
const COSTS = [26, 27, 26, 27, 27, 28, 27, 28, 28, 28, 29, 28];

function line(vals, w, h) {
  return vals.map((v, i) => `${i ? 'L' : 'M'}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - (v / 100) * h).toFixed(1)}`).join(' ');
}

function MarginBoard({ p }) {
  // drawn bold: on the monitor it is only a few hundred pixels wide, so it reads as shapes and big numbers
  const cw = 592;
  const ch = 150;
  return (
    <div className="h-full w-full bg-[#FBF9F5] px-6 pb-5 pt-5 text-ink" style={{ fontFamily: 'inherit' }}>
      <div className="flex items-center justify-between">
        <img src="/brand/aurora-logo-horizontal-color.svg" alt="" className="h-[24px] w-auto" />
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#E4F4E8] px-3 py-1 text-[13px] font-medium text-[#2E7A48]">Margin up</span>
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white">JR</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {KPIS.map(([l, v, s, t], i) => (
          <div key={l} className="rounded-[14px] bg-white px-3.5 py-3 shadow-[0_0_0_1.5px_rgba(10,15,14,0.08)]" style={{ opacity: p > 0.05 + i * 0.12 ? 1 : 0.3, transition: 'opacity 500ms' }}>
            <p className="truncate text-[12px] text-graphite">{l}</p>
            <p className="mt-1 text-[30px] font-medium leading-none tracking-[-0.03em]">{v}</p>
            <p className={t === 'up' ? 'mt-1.5 truncate text-[11px] font-medium text-[#2E7A48]' : 'mt-1.5 truncate text-[11px] text-slate'}>{s}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[14px] bg-white px-4 pb-3 pt-3 shadow-[0_0_0_1.5px_rgba(10,15,14,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium">Revenue vs. costs</p>
          <div className="flex items-center gap-4 text-[12px] text-graphite">
            <span className="flex items-center gap-1.5">
              <span className="h-[4px] w-4 rounded-full bg-[#14A36B]" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[4px] w-4 rounded-full bg-[#F25C2A]" /> Costs
            </span>
          </div>
        </div>
        <svg viewBox={`-4 -6 ${cw + 8} ${ch + 10}`} className="mt-1.5 block w-full" style={{ height: 112 }} preserveAspectRatio="none">
          {[0.33, 0.66].map((y) => (
            <line key={y} x1="0" x2={cw} y1={ch * y} y2={ch * y} stroke="#0A0F0E" strokeOpacity="0.07" strokeWidth="1.5" />
          ))}
          <path d={`${line(REVENUE, cw, ch)} L${cw} ${ch} L0 ${ch} Z`} fill="#14A36B" fillOpacity="0.12" style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }} />
          <path d={line(COSTS, cw, ch)} fill="none" stroke="#F25C2A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
          <path d={line(REVENUE, cw, ch)} fill="none" stroke="#14A36B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
      </div>
    </div>
  );
}


// The owner's phone in his van: what Aurora did while he drove. Figures belong to a fictional business.
const DONE = [
  { tag: 'Booked', t: 'ok', text: 'Tue 10:00 · Ben Carter', sub: 'AC not cooling' },
  { tag: 'Answered', t: 'ok', text: 'Hours and parking', sub: 'Website chat' },
  { tag: 'Quote sent', t: 'ok', text: 'Lena Ortiz · $420', sub: 'Follow-up Fri' },
  { tag: 'Rescheduled', t: 'wait', text: 'Sam Lee · to Thu 2 pm', sub: 'Text message' },
  { tag: 'Booked', t: 'ok', text: 'Wed 8:30 · Priya Shah', sub: 'Water heater' },
];
const PHONE_TAG = { ok: 'bg-[#E4F4E8] text-[#2E7A48]', wait: 'bg-[#FFF0D9] text-[#A8640F]' };

function PhoneBoard({ p }) {
  const n = DONE.length;
  const shown = Math.max(1, Math.min(n, Math.floor(p * n) + 1));
  return (
    <div className="h-full w-full bg-[#FBF9F5] px-5 pb-6 pt-7 text-ink" style={{ fontFamily: 'inherit' }}>
      <div className="flex items-center justify-between">
        <img src="/brand/aurora-symbol-color.svg" alt="" className="h-[30px] w-[30px]" />
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white">RT</span>
      </div>
      <p className="mt-6 text-[15px] text-graphite">While you drove</p>
      <p className="mt-1 text-[38px] font-medium leading-none tracking-[-0.03em]">
        {shown} <span className="text-[20px] font-normal text-graphite">handled</span>
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full bg-[#E4F4E8] px-3 py-1 text-[13px] font-medium text-[#2E7A48]">0 missed calls</span>
      </div>
      <div className="mt-5 grid gap-2.5">
        {DONE.map((d, i) => {
          const on = i < shown;
          return (
            <div key={d.text} className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-3 shadow-[0_0_0_1.5px_rgba(10,15,14,0.08)]" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(10px)', transition: 'opacity 450ms, transform 450ms' }}>
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_1.5px_rgba(10,15,14,0.08)]">
                <img src="/brand/aurora-symbol-color.svg" alt="" className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{d.text}</span>
                <span className="block truncate text-[12.5px] text-slate">{d.sub}</span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${PHONE_TAG[d.t]}`}>{d.tag}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Fits the dashboard onto the monitor in the footage. `quad` is the screen's corners as fractions of the video frame. */
export default function AuroraScreen({ kind = 'margin', quad, aspect = 16 / 9, p = 1 }) {
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
    const [BW, BH] = SIZES[kind];
    style = { width: BW, height: BH, transform: matrix3d(pts, BW, BH), transformOrigin: '0 0', borderRadius: kind === 'phone' ? 44 : 0, overflow: 'hidden' };
  }
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 top-0" style={style}>
        {kind === 'phone' ? <PhoneBoard p={p} /> : <MarginBoard p={p} />}
        {/* the screen's own light: a soft sheen so it sits in the room */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_40%,rgba(255,226,180,0.08)_100%)]" />
      </div>
    </div>
  );
}
