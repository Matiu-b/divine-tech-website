import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Car, Package, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';

/*
 * A technician's day across the whole service area, drawn like a maps app zoomed out: towns with their street grids,
 * an interstate and state routes with their shields, county roads, woods. Two routes: the order the jobs were booked
 * in (dashed, a zigzag across the county) and the order Aurora set (the van drives it). Beside the map, the plan she
 * texted to the tech, open at the job he is at or driving to: the call, the address and the parts to bring.
 */
const W = 1000;
const H = 560;
const EASE = [0.22, 1, 0.36, 1];

// roads: [points, kind]; kind is 'interstate' | 'route' | 'county'
const ROADS = [
  [[[0, 340], [275, 330], [520, 322], [760, 300], [1000, 292]], 'interstate'],
  [[[262, 0], [270, 150], [275, 330], [268, 400], [255, 560]], 'route'],
  [[[520, 322], [640, 150], [720, 40], [760, 0]], 'route'],
  [[[0, 160], [110, 160], [270, 150], [640, 150], [1000, 170]], 'county'],
  [[[268, 400], [520, 450], [800, 472], [1000, 480]], 'county'],
  [[[180, 440], [268, 400]], 'county'],
  [[[180, 440], [120, 330]], 'county'],
  [[[520, 322], [520, 450]], 'county'],
  [[[760, 300], [830, 330], [800, 472]], 'county'],
  [[[268, 400], [120, 330], [110, 160]], 'county'],
];
/** The part of the map that must always be seen: every town on the route. */
const FOCUS = [40, 72, 905, 525];
const onEdge = ([x, y]) => x <= 0 || x >= W || y <= 0 || y >= H;
const reach = (q, r) => {
  const dx = q[0] - r[0];
  const dy = q[1] - r[1];
  const k = 400 / Math.hypot(dx, dy);
  return [q[0] + dx * k, q[1] + dy * k];
};
/** A road that leaves the map keeps going the same way, so a frame wider than the map still shows it running on. */
const grow = (p) => [...(onEdge(p[0]) ? [reach(p[0], p[1])] : []), ...p, ...(onEdge(p[p.length - 1]) ? [reach(p[p.length - 1], p[p.length - 2])] : [])];

const TOWNS = [
  { name: 'Elmwood', box: [100, 400, 260, 488], label: [180, 512] },
  { name: 'Oakridge', box: [200, 95, 345, 205], label: [215, 82] },
  { name: 'Maple Heights', box: [565, 95, 720, 205], label: [642, 82] },
  { name: 'Cedar Falls', box: [770, 280, 905, 392], label: [850, 410] },
  { name: 'Brookside', box: [455, 405, 590, 500], label: [522, 518] },
  { name: 'Lakeview', box: [40, 110, 180, 215], label: [110, 97] },
];
const WOODS = [
  'M380 210 C420 190 480 200 490 240 C500 280 450 300 410 290 C370 280 350 240 380 210 Z',
  'M880 60 C930 50 990 70 995 120 C1000 170 940 190 900 175 C860 160 850 90 880 60 Z',
  'M600 522 C650 505 720 515 730 545 C735 565 600 565 590 548 C585 535 590 527 600 522 Z',
  'M20 255 C60 240 105 255 108 290 C110 320 60 330 30 315 C5 302 0 268 20 255 Z',
  'M360 40 C400 20 470 30 480 70 C488 100 430 115 395 105 C360 95 340 60 360 40 Z',
];
const SHIELDS = [
  { at: [395, 326], text: '90', kind: 'interstate' },
  { at: [271, 245], text: '9', kind: 'route' },
  { at: [600, 210], text: '32', kind: 'route' },
];

const hm = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
const pts = (p) => 'M' + p.map(([x, y]) => `${x} ${y}`).join(' L');

function Region() {
  const style = {
    interstate: { w: 7.5, edge: '#E9A23B', fill: '#FFC96B' },
    route: { w: 5.5, edge: '#EDC66A', fill: '#FFE3A0' },
    county: { w: 3.6, edge: '#D6D0C4', fill: '#FFFFFF' },
  };
  const order = ['county', 'route', 'interstate'];
  return (
    <g>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#EEEBE4" />
      <defs>
        <pattern id="fm-grid" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 0.4 H7 M0.4 0 V7" stroke="#FFFFFF" strokeWidth="0.8" />
        </pattern>
      </defs>
      {WOODS.map((d) => (
        <path key={d} d={d} fill="#D3E8C9" />
      ))}
      {/* towns: built-up land with their street grids */}
      {TOWNS.map((t) => {
        const [x0, y0, x1, y1] = t.box;
        return (
          <g key={t.name}>
            <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={26} fill="#E6E1D8" />
            <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={26} fill="url(#fm-grid)" opacity="0.75" />
          </g>
        );
      })}
      {order.map((k) =>
        ROADS.filter(([, kind]) => kind === k).map(([p]) => (
          <g key={k + p[0].join()}>
            <path d={pts(grow(p))} fill="none" stroke={style[k].edge} strokeWidth={style[k].w + 2} strokeLinecap="round" strokeLinejoin="round" />
            <path d={pts(grow(p))} fill="none" stroke={style[k].fill} strokeWidth={style[k].w} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))
      )}
      {SHIELDS.map((s) => (
        <g key={s.text} transform={`translate(${s.at[0]} ${s.at[1]})`}>
          {s.kind === 'interstate' ? (
            <path d="M-10 -9 H10 V2 C10 8 4 11 0 12 C-4 11 -10 8 -10 2 Z" fill="#0A0F0E" stroke="#fff" strokeWidth="1.4" />
          ) : (
            <rect x="-9" y="-8" width="18" height="16" rx="4" fill="#fff" stroke="#E9A23B" strokeWidth="1.3" />
          )}
          <text x="0" y={s.kind === 'interstate' ? 0 : 0.5} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill={s.kind === 'interstate' ? '#fff' : '#7C5A1A'} fontFamily="inherit">
            {s.text}
          </text>
        </g>
      ))}
      {TOWNS.map((t) => (
        <text key={'l' + t.name} x={t.label[0]} y={t.label[1]} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600" fill="#5F594E" stroke="#EEEBE4" strokeWidth="3" paintOrder="stroke" fontFamily="inherit">
          {t.name}
        </text>
      ))}
    </g>
  );
}

/** The map keeps its proportions and covers its frame, but never crops the towns on the route (the land runs on past
 * the edges if the frame is narrower); this says where a map point lands on the frame. */
function useCover(ref) {
  const [box, setBox] = useState({ s: 1, ox: 0, oy: 0, w: W, h: H });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const [fx0, fy0, fx1, fy1] = FOCUS;
      const s = Math.min(Math.max(w / W, h / H), w / (fx1 - fx0), h / (fy1 - fy0));
      const place = (size, full, a, b) => {
        const o = size / 2 - ((a + b) / 2) * s;
        return full * s >= size ? Math.min(0, Math.max(size - full * s, o)) : o;
      };
      setBox({ s, ox: place(w, W, fx0, fx1), oy: place(h, H, fy0, fy1), w, h });
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

const DRIVE_MS = 2200;
const STOP_MS = 7000; // long enough to watch the job's clip

/**
 * The van's day: leg i drives to stop i, then it waits at the stop. Returns the leg, whether it is driving, and how far
 * along the leg it is (0 to 1). Runs while the map is on screen; holds the first stop for reduced motion.
 */
function useDrive(n, running, still) {
  const [state, setState] = useState({ leg: 0, driving: !still, p: still ? 1 : 0 });
  useEffect(() => {
    if (still) {
      setState({ leg: 0, driving: false, p: 1 });
      return undefined;
    }
    if (!running) return undefined;
    let raf = 0;
    let timer = 0;
    const drive = (leg) => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / DRIVE_MS);
        setState({ leg, driving: p < 1, p });
        if (p < 1) raf = requestAnimationFrame(tick);
        else timer = window.setTimeout(() => drive((leg + 1) % n), leg === n - 1 ? STOP_MS + 1500 : STOP_MS);
      };
      raf = requestAnimationFrame(tick);
    };
    drive(state.leg);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [running, still, n]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

/** Jake on the job: the clip plays once, muted, while the van is there; the still stands in when it can't play. */
function JobClip({ s, play }) {
  return (
    <span className="relative block aspect-video w-full overflow-hidden rounded-[9px] sm:rounded-[10px]">
      <img src={s.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {play ? <video src={s.video} poster={s.poster} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline preload="auto" aria-hidden="true" /> : null}
    </span>
  );
}

/** One job in the plan: closed it is a single line; the job the van is at (or driving to) opens with its details. */
function Stop({ s, i, open, here, reduce, labels }) {
  return (
    <li className={cn('rounded-[16px] transition-colors duration-300', open ? 'bg-white shadow-[0_1px_3px_rgba(10,15,14,0.08)]' : '')}>
      <div className="flex items-center gap-3 px-3 py-2">
        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-semibold transition-colors duration-300', open ? 'bg-[#F25C2A] text-white' : 'bg-ink/[0.07] text-ink/60')}>{i + 1}</span>
        <span className="w-[58px] shrink-0 whitespace-nowrap text-[12px] font-medium tabular-nums text-ink/60">{s.time}</span>
        <span className={cn('min-w-0 flex-1 text-[13.5px] font-medium', open ? 'leading-snug text-ink' : 'truncate text-ink/70')}>{s.job}</span>
        {open ? <span className="shrink-0 rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[10.5px] font-medium text-[#B4471A]">{here ? labels.here : labels.next}</span> : null}
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="d" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <div className="px-3 pb-3 pl-12">
              <p className="text-[12.5px] text-slate">{s.address}</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-snug text-ink max-sm:hidden">
                <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/45" strokeWidth={2} aria-hidden="true" />
                {s.detail}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-ink/45" strokeWidth={2} aria-hidden="true" />
                {s.bring.map((b) => (
                  <span key={b} className="rounded-full bg-[#F6F3EC] px-2 py-0.5 text-[11.5px] text-ink">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

/**
 * Every tech's day, planned to the street: the map with the route and the van on it, and the plan Aurora texted to the
 * technician, open at the job he is at or driving to.
 */
export default function FieldMap({ d }) {
  const ref = useRef(null);
  const frame = useRef(null);
  const legs = useRef([]);
  const box = useCover(frame);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.25 });
  const visible = usePageVisible();
  const n = d.stops.length;
  const { leg, driving, p } = useDrive(n, inView && visible, reduce);

  // where the van is: along leg `leg`, `p` of the way
  const [van, setVan] = useState(d.yard);
  useLayoutEffect(() => {
    const el = legs.current[leg];
    if (!el) return;
    const pt = el.getPointAtLength(el.getTotalLength() * p);
    setVan([pt.x, pt.y]);
  }, [leg, p]);

  const here = !driving;
  const toFrame = ([x, y]) => ({ left: x * box.s + box.ox, top: y * box.s + box.oy });
  const wide = box.w >= 600;
  // on a wide map the clip sits low in the middle, over the empty south of the county and clear of the route
  const cw = box.w >= 900 ? 340 : box.w >= 700 ? 250 : 220;
  const clipAt = { width: cw, left: Math.round(Math.min(box.w - cw - 64, Math.max(220, (box.w - cw) / 2 + 30))), bottom: 16 };
  const total = d.stops.reduce((a, s) => a + s.drive, 0);

  const plan = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-1">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F25C2A] text-[14px] font-semibold text-white">{d.tech.name[0]}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium leading-tight text-ink">{d.tech.title}</span>
          <span className="block truncate text-[12px] text-slate">
            {n} {d.labels.jobs} · {hm(total)} · {d.tech.sent}
          </span>
        </span>
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-[12px] bg-[#E4F4E8] px-3 py-2 text-[12.5px] font-medium text-[#1F7A4C]">
        <Car className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
        {d.labels.saved} {hm(d.booked.drive - total)} · {d.labels.vsBooked}
      </p>
      <ol className="mt-2 grid gap-0.5">
        {d.stops.map((s, i) => (
          <React.Fragment key={s.job}>
            <li className="flex items-center gap-2 pl-[22px] text-[11.5px] text-ink/45" aria-hidden="true">
              <span className="h-3 w-px bg-ink/15" />
              <Car className="h-3 w-3" strokeWidth={2} />
              {s.drive} {d.labels.min}
              {i === 0 ? ` · ${d.labels.fromYard}` : ''}
            </li>
            <Stop s={s} i={i} open={i === leg} here={here && i === leg} reduce={reduce} labels={d.labels} />
          </React.Fragment>
        ))}
      </ol>
    </div>
  );

  return (
    <section id="field" data-nav-theme="light" aria-labelledby="field-title" className="section relative">
      <div className="shell">
        <SectionHeader
          id="field-title"
          titleA={d.titleA}
          text={
            <>
              <span className="lg:hidden">{d.textShort}</span>
              <span className="max-lg:hidden">{d.text}</span>
            </>
          }
          layout="split"
        />

        <div ref={ref} className="canvas relative mt-5 grid overflow-hidden bg-[#FBF9F5] shadow-[0_0_0_1px_rgba(10,15,14,0.08),0_30px_60px_-40px_rgba(60,50,30,0.45)] sm:mt-8 md:mt-12 lg:h-[clamp(520px,calc(100svh_-_300px),640px)] lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* the map */}
          <div ref={frame} className="relative aspect-[3/2] overflow-hidden bg-[#EEEBE4] sm:aspect-[16/9] lg:aspect-auto lg:h-full">
            <div className="absolute" style={{ left: box.ox, top: box.oy, width: W * box.s, height: H * box.s }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full overflow-visible" aria-hidden="true">
                <Region />
                {/* the order the jobs were booked in: a zigzag across the county */}
                <path d={pts([d.yard, ...d.booked.order.map((k) => d.stops[k].at)])} fill="none" stroke="#0A0F0E" strokeOpacity="0.28" strokeWidth={1.8} strokeDasharray="4 6" strokeLinecap="round" strokeLinejoin="round" />
                {/* the route, leg by leg, with a white edge like a maps app */}
                {d.stops.map((s, i) => (
                  <path key={'e' + i} d={s.leg} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {d.stops.map((s, i) => (
                  <path
                    key={'r' + i}
                    ref={(el) => {
                      legs.current[i] = el;
                    }}
                    d={s.leg}
                    fill="none"
                    stroke="#F25C2A"
                    strokeOpacity={i < leg || (i === leg && !driving) ? 0.45 : 1}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {/* the yard */}
                <g>
                  <circle cx={d.yard[0]} cy={d.yard[1]} r={10} fill="#0A0F0E" stroke="#fff" strokeWidth={2.5} />
                  <path d={`M${d.yard[0] - 4.5} ${d.yard[1] + 3.5} V${d.yard[1] - 1.5} L${d.yard[0]} ${d.yard[1] - 5.5} L${d.yard[0] + 4.5} ${d.yard[1] - 1.5} V${d.yard[1] + 3.5} Z`} fill="#fff" />
                </g>
                {/* the stops */}
                {d.stops.map((s, i) => (
                  <g key={'s' + i}>
                    <circle cx={s.at[0]} cy={s.at[1]} r={10} fill={i === leg ? '#F25C2A' : '#fff'} stroke="#F25C2A" strokeWidth={2.5} />
                    <text x={s.at[0]} y={s.at[1] + 0.5} textAnchor="middle" dominantBaseline="central" fontSize="9.5" fontWeight="700" fill={i === leg ? '#fff' : '#F25C2A'} fontFamily="inherit">
                      {i + 1}
                    </text>
                  </g>
                ))}
                {/* the van */}
                <g transform={`translate(${van[0]} ${van[1]})`}>
                  <circle r={13} fill="#F25C2A" fillOpacity={0.18} />
                  <circle r={8.5} fill="#0A0F0E" stroke="#fff" strokeWidth={2.2} />
                  <path d="M-4.5 1.8 V-2.4 H1.2 L3.2 -0.4 H4.5 V1.8 Z" fill="#fff" />
                </g>
              </svg>
            </div>

            {/* drive times on the route, like a maps app */}
            {d.stops.map((s, i) => (
              <span key={'t' + i} className={cn('pointer-events-none absolute z-[1] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-[0_1px_4px_rgba(10,15,14,0.18)] transition-colors duration-300 max-sm:hidden', i === leg && driving ? 'bg-ink text-white' : 'bg-white text-ink')} style={toFrame(s.mid)}>
                <Car className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
                {s.drive} {d.labels.min}
              </span>
            ))}

            {/* the job the van is at: a card with a clip of Jake on the job, like a maps app's street view */}
            <AnimatePresence>
              {here ? (
                <motion.div
                  key={leg}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className={cn('pointer-events-none absolute z-[3] overflow-hidden rounded-[12px] bg-white p-1 shadow-[0_10px_30px_-8px_rgba(10,15,14,0.35)] sm:rounded-[14px] sm:p-1.5', wide ? '' : 'bottom-2 right-2 w-[56%] sm:w-[250px]')}
                  style={wide ? clipAt : undefined}
                >
                  <JobClip s={d.stops[leg]} play={inView && visible && !reduce} />
                  <span className="block truncate px-1 pb-0.5 pt-1 text-[11px] sm:px-1.5 sm:pt-1.5 sm:text-[12px]">
                    <span className="mr-1.5 inline-flex h-4 w-4 sm:h-[18px] sm:w-[18px] items-center justify-center rounded-full bg-[#F25C2A] align-[-3px] text-[10.5px] font-semibold text-white">{leg + 1}</span>
                    <span className="font-medium text-ink">{d.stops[leg].job}</span>
                    <span className="text-slate max-sm:hidden"> · {d.stops[leg].time}</span>
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* the two routes, like a maps app's route options */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-[14px] bg-white px-3 py-2 text-[11.5px] shadow-[0_2px_6px_rgba(10,15,14,0.14)] max-sm:hidden sm:bottom-4 sm:left-4">
              <span className="flex items-center gap-2 font-medium text-ink">
                <span className="h-[3px] w-5 rounded-full bg-[#F25C2A]" />
                {d.labels.aurora} · {hm(total)}
              </span>
              <span className="flex items-center gap-2 text-ink/55">
                <span className="w-5 border-t-2 border-dashed border-ink/35" />
                {d.labels.asBooked} · {hm(d.booked.drive)}
              </span>
            </div>

            {/* the search bar and the map controls */}
            <div className="absolute left-3 top-3 hidden items-center gap-2 rounded-full bg-white py-1.5 sm:flex pl-2 pr-3.5 shadow-[0_2px_6px_rgba(10,15,14,0.14)] sm:left-4 sm:top-4">
              <img src="/brand/aurora-symbol-color.svg" alt="" width="18" height="18" className="h-[18px] w-[18px]" />
              <span className="text-[12.5px] font-medium text-ink">{d.title}</span>
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
          </div>

          {/* the plan Aurora texted to the tech */}
          <div className="relative border-t border-ink/[0.06] p-3 xs:p-4 lg:overflow-hidden lg:border-l lg:border-t-0 lg:p-5">
            <div className="max-lg:hidden">{plan}</div>
            {/* phones and tablets: the day as a row of stops, and the job the van is at or driving to */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F25C2A] text-[13px] font-semibold text-white">{d.tech.name[0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium leading-tight text-ink">{d.tech.title}</span>
                  <span className="block truncate text-[11.5px] text-slate">
                    {n} {d.labels.jobs} · {hm(total)} · {d.tech.sent}
                  </span>
                </span>
              </div>
              <ol className="mt-3 flex items-center" aria-hidden="true">
                {d.stops.map((s, i) => (
                  <li key={s.job} className="flex flex-1 items-center last:flex-none">
                    <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300', i === leg ? 'bg-[#F25C2A] text-white' : i < leg ? 'bg-ink/15 text-ink/60' : 'bg-white text-ink/60 shadow-[inset_0_0_0_1px_rgba(10,15,14,0.15)]')}>{i + 1}</span>
                    {i < n - 1 ? (
                      <span className="flex flex-1 items-center justify-center gap-0.5 text-[10.5px] text-ink/40">
                        {d.stops[i + 1].drive}′
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
              <ul className="mt-2">
                <Stop s={d.stops[leg]} i={leg} open here={here} reduce={reduce} labels={d.labels} />
              </ul>
            </div>
          </div>
        </div>

        {d.note ? (
          <p className="mt-3 text-[12px] text-slate sm:mt-4">
            <span className="sm:hidden">{d.noteShort}</span>
            <span className="max-sm:hidden">{d.note}</span>
          </p>
        ) : null}

        <ol className="sr-only">
          {d.stops.map((s, i) => (
            <li key={s.job}>
              Stop {i + 1}, {s.time}, {s.address}: {s.job}. {s.detail} Bring: {s.bring.join(', ')}. {s.drive} minutes' drive.
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
