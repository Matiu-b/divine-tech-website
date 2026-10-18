import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Car, Package, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';

/*
 * A technician's day on a street map drawn like a maps app: a whole part of town (avenues, side streets, a highway, parks,
 * a golf course, buildings, neighbourhood and street names), and his route through it. The van drives the route stop by
 * stop; at each stop the plan beside the map opens that job: the time, the address, what the customer called about and
 * the parts to bring, and the drive to the next one.
 */
const W = 900;
const H = 500;
const EASE = [0.22, 1, 0.36, 1];

// streets: [d, kind] where kind is 'side' | 'avenue' | 'highway'
const STREETS = [
  ['M80 0 V500', 'side'],
  ['M170 0 V500', 'side'],
  ['M420 0 V500', 'side'],
  ['M520 0 V250', 'side'],
  ['M640 0 V500', 'side'],
  ['M760 0 V500', 'side'],
  ['M850 0 V500', 'side'],
  ['M0 70 H900', 'side'],
  ['M0 160 H900', 'side'],
  ['M0 340 H900', 'side'],
  ['M420 340 C470 296 560 296 640 340', 'side'],
  ['M520 250 C540 300 600 310 640 340', 'side'],
  ['M0 250 H900', 'avenue'],
  ['M300 0 V500', 'avenue'],
  ['M0 438 C200 418 420 478 620 448 S860 388 900 372', 'highway'],
];
const LABELS = [
  ['Main St', 60, 250, 0],
  ['Main St', 590, 250, 0],
  ['Oak Ave', 300, 40, -90],
  ['Oak Ave', 300, 300, -90],
  ['Elm St', 230, 160, 0],
  ['Elm St', 700, 160, 0],
  ['Birch St', 230, 340, 0],
  ['Birch St', 820, 340, 0],
  ['Pine St', 600, 70, 0],
  ['Cedar Ave', 420, 210, -90],
  ['Willow Ln', 530, 309, -8],
  ['Ridge Rd', 760, 110, -90],
  ['Lake St', 170, 110, -90],
  ['Park Ave', 640, 110, -90],
];
const NEIGHBOURHOODS = [
  ['OLD TOWN', 230, 210],
  ['MAPLE HEIGHTS', 700, 210],
  ['RIVERSIDE', 90, 400],
];
const PARKS = [
  { d: 'M426 76 H514 V154 H426 Z', name: 'Riverside Park', at: [470, 116] },
  { d: 'M766 166 H844 V244 H766 Z', name: 'Maple Golf Club', at: [805, 206] },
  { d: 'M176 346 H294 V420 C250 426 200 418 176 420 Z', name: 'Birch Commons', at: [235, 385] },
];
const POIS = [
  { at: [228, 115], name: 'Lincoln Elementary', icon: 'school' },
  { at: [580, 200], name: 'Corner Café', icon: 'cafe' },
  { at: [700, 295], name: 'Parts depot', icon: 'shop' },
];

// a small deterministic jitter, so buildings don't sit in a perfect grid
const jit = (a, b) => ((Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1 + 1) % 1;

function Buildings() {
  const out = [];
  for (let x = 6; x < W; x += 24)
    for (let y = 6; y < H; y += 19) {
      const w = 13 + jit(x, y) * 7;
      const h = 9 + jit(y, x) * 5;
      out.push(<rect key={`${x}-${y}`} x={x + jit(x + 1, y) * 4} y={y + jit(x, y + 1) * 3} width={w} height={h} rx={1.5} />);
    }
  return (
    <g fill="#E8E5DE" stroke="#DCD8CF" strokeWidth="0.6">
      {out}
    </g>
  );
}

function Town() {
  const road = (d, kind) => {
    const w = kind === 'highway' ? 12 : kind === 'avenue' ? 10 : 6.5;
    const edge = kind === 'highway' ? '#E9A23B' : kind === 'avenue' ? '#EDC66A' : '#D9D4C9';
    const fill = kind === 'highway' ? '#FFC96B' : kind === 'avenue' ? '#FFE7A3' : '#FFFFFF';
    return (
      <g key={d}>
        <path d={d} fill="none" stroke={edge} strokeWidth={w + 2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  const text = (t, x, y, rot, opts = {}) => (
    <text key={t + x} x={x} y={y} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} textAnchor="middle" dominantBaseline="central" fontSize={opts.size || 7.2} fontWeight={opts.weight || 500} letterSpacing={opts.spacing || 0.2} fill={opts.fill || '#7C766B'} stroke="#fff" strokeWidth="2.4" paintOrder="stroke" fontFamily="inherit">
      {t}
    </text>
  );
  return (
    <g>
      <rect width={W} height={H} fill="#F2EFE9" />
      <Buildings />
      {PARKS.map((p) => (
        <path key={p.name} d={p.d} fill="#CFE8C6" stroke="#BFDDB3" strokeWidth="0.8" />
      ))}
      {STREETS.filter(([, k]) => k === 'side').map(([d, k]) => road(d, k))}
      {STREETS.filter(([, k]) => k === 'avenue').map(([d, k]) => road(d, k))}
      {STREETS.filter(([, k]) => k === 'highway').map(([d, k]) => road(d, k))}
      {/* the highway's shield */}
      <g transform="translate(468 452)">
        <rect x="-11" y="-8" width="22" height="16" rx="4" fill="#fff" stroke="#E9A23B" strokeWidth="1.2" />
        <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill="#7C5A1A" fontFamily="inherit">
          9
        </text>
      </g>
      {LABELS.map(([t, x, y, r]) => text(t, x, y, r))}
      {NEIGHBOURHOODS.map(([t, x, y]) => text(t, x, y, 0, { size: 8.5, weight: 600, spacing: 2.2, fill: '#A39C8F' }))}
      {PARKS.map((p) => text(p.name, p.at[0], p.at[1], 0, { fill: '#3E7D4A', size: 7 }))}
      {POIS.map((p) => (
        <g key={p.name}>
          <circle cx={p.at[0]} cy={p.at[1]} r={5.5} fill={p.icon === 'shop' ? '#F25C2A' : p.icon === 'cafe' ? '#C98A1B' : '#7C766B'} stroke="#fff" strokeWidth="1.4" />
          {text(p.name, p.at[0] + 8, p.at[1], 0, { size: 6.8 })}
        </g>
      ))}
    </g>
  );
}

/** The map keeps its proportions and covers its frame, cropped evenly; this says where a map point lands on the frame. */
function useCover(ref) {
  const [box, setBox] = useState({ s: 1, ox: 0, oy: 0, w: W, h: H });
  useLayoutEffect(() => {
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

const DRIVE_MS = 2200;
const STOP_MS = 3200;

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

/** One job in the plan: closed it is a single line; the job the van is at (or driving to) opens with its details. */
function Stop({ s, i, open, here, reduce, labels }) {
  return (
    <li className={cn('rounded-[16px] transition-colors duration-300', open ? 'bg-white shadow-[0_1px_3px_rgba(10,15,14,0.08)]' : '')}>
      <div className="flex items-center gap-3 px-3 py-2">
        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-semibold transition-colors duration-300', open ? 'bg-[#F25C2A] text-white' : 'bg-ink/[0.07] text-ink/60')}>{i + 1}</span>
        <span className="w-[58px] shrink-0 whitespace-nowrap text-[12px] font-medium tabular-nums text-ink/60">{s.time}</span>
        <span className={cn('min-w-0 flex-1 truncate text-[13.5px] font-medium', open ? 'text-ink' : 'text-ink/70')}>{s.job}</span>
        {open ? <span className="shrink-0 rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[10.5px] font-medium text-[#B4471A]">{here ? labels.here : labels.next}</span> : null}
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="d" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <div className="px-3 pb-3 pl-12">
              <p className="text-[12.5px] text-slate">{s.address}</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-snug text-ink">
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
  const total = d.stops.reduce((a, s) => a + s.drive, 0);

  const plan = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-1">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F25C2A] text-[14px] font-semibold text-white">{d.tech.name[0]}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium leading-tight text-ink">{d.tech.title}</span>
          <span className="block truncate text-[12px] text-slate">
            {n} {d.labels.jobs} · {total} {d.labels.min} · {d.tech.sent}
          </span>
        </span>
      </div>
      <ol className="mt-3 grid gap-1">
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
              <span className="sm:hidden">{d.textShort}</span>
              <span className="max-sm:hidden">{d.text}</span>
            </>
          }
          layout="split"
        />

        <div ref={ref} className="canvas relative mt-5 grid overflow-hidden bg-[#FBF9F5] shadow-[0_0_0_1px_rgba(10,15,14,0.08),0_30px_60px_-40px_rgba(60,50,30,0.45)] sm:mt-8 md:mt-12 lg:h-[clamp(520px,calc(100svh_-_300px),640px)] lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* the map */}
          <div ref={frame} className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9] sm:aspect-[16/9] lg:aspect-auto lg:h-full">
            <div className="absolute" style={{ left: box.ox, top: box.oy, width: W * box.s, height: H * box.s }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" aria-hidden="true">
                <Town />
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

            {/* the job the van is at: a card on the map, like a place card */}
            <AnimatePresence>
              {here ? (
                <motion.div key={leg} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="pointer-events-none absolute z-[2] -translate-x-1/2 -translate-y-[calc(100%+18px)] whitespace-nowrap rounded-[12px] bg-white px-3 py-1.5 text-[12px] shadow-[0_4px_14px_rgba(10,15,14,0.18)]" style={toFrame(d.stops[leg].at)}>
                  <span className="font-medium text-ink">{d.stops[leg].job}</span>
                  <span className="text-slate"> · {d.stops[leg].time}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* the search bar and the map controls */}
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-3.5 shadow-[0_2px_6px_rgba(10,15,14,0.14)] sm:left-4 sm:top-4">
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
          <div className="relative border-t border-ink/[0.06] p-3 xs:p-4 lg:overflow-hidden lg:border-l lg:border-t-0 lg:p-5">{plan}</div>
        </div>

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
