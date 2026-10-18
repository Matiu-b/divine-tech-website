import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { useInViewport, usePageVisible } from '@/components/home-v2/hooks';
import { EASE, H, MapBase, MapChrome, Pin, RouteLine, Tag, useCover, W } from './StreetMap';

const BEAT_MS = 5200;

/** A technician on the map: their initial in their colour, a ring while Aurora is talking to them. */
function Tech({ t, active, reduce }) {
  const [x, y] = t.at;
  return (
    <g>
      {active && !reduce ? (
        <circle cx={x} cy={y} r={11} fill={t.color} fillOpacity={0.25}>
          <animate attributeName="r" values="11;19;11" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      ) : null}
      {active ? (
        <g>
          <rect x={x + 14} y={y - 9} width={t.name.length * 6.2 + 14} height={18} rx={9} fill={t.color} />
          <text x={x + 21} y={y + 0.5} dominantBaseline="central" fontSize="9" fontWeight="600" fill="#fff" fontFamily="inherit">
            {t.name}
          </text>
        </g>
      ) : null}
      <circle cx={x} cy={y} r={11} fill={t.color} stroke="#fff" strokeWidth={2.5} />
      <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill="#fff" fontFamily="inherit">
        {t.name[0]}
      </text>
    </g>
  );
}

/** The thread with the technician Aurora is texting right now, then what it led to. */
function Thread({ beat, tech, k, reduce }) {
  return (
    <LiquidGlass className="rounded-[22px] p-3.5 sm:p-4" style={{ '--lg-tint-a': 'rgba(255,252,247,0.94)', '--lg-tint-b': 'rgba(255,249,241,0.88)' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={k} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: tech.color }}>
              {tech.name[0]}
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium leading-tight text-ink">{tech.name}</span>
              <span className="block truncate text-[12px] text-slate">{tech.role}</span>
            </span>
          </div>
          <p className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink/40">{tech.channel || 'Text message · now'}</p>
          <div className="mt-1.5 flex flex-col gap-2">
            {beat.thread.map((msg, i) => {
              const mine = msg.who === 'aurora';
              return (
                <motion.p
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : 0.1 + i * 0.7 }}
                  className={cn('max-w-[88%] rounded-[18px] px-3.5 py-2 text-[13.5px] leading-snug', mine ? 'self-end rounded-br-[6px] bg-ink text-white' : 'self-start rounded-bl-[6px] bg-white text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]')}
                >
                  {msg.text}
                </motion.p>
              );
            })}
          </div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: reduce ? 0 : 0.2 + beat.thread.length * 0.7 }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#E4F4E8] px-3 py-1 text-[12px] font-medium text-[#1F7A4C]"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />
            {beat.result}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </LiquidGlass>
  );
}

/**
 * Jobs to the field: one map and one thread. Aurora picks the technician for each job by area and skill and texts it
 * straight to them; the map draws their route to it. It moves on by itself while it is on screen: a new job for Jake,
 * a part for Mike from van 7, tomorrow's job offered to a freelancer.
 */
export default function FieldMap({ d }) {
  const ref = useRef(null);
  const frame = useRef(null);
  const box = useCover(frame);
  const reduce = !!useReducedMotion();
  const inView = useInViewport(ref, { threshold: 0.25 });
  const visible = usePageVisible();
  const n = d.beats.length;
  const [k, setK] = useState(0);
  const running = !reduce && inView && visible;

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setK((x) => (x + 1) % n), BEAT_MS);
    return () => clearTimeout(id);
  }, [k, running, n]);

  const beat = d.beats[k];
  const tech = d.techs.find((t) => t.key === beat.tech);

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

        <div ref={ref} className="relative mt-5 sm:mt-8 md:mt-12">
          <div ref={frame} className="canvas relative aspect-[4/3] overflow-hidden bg-[#F1EEE8] shadow-[0_0_0_1px_rgba(10,15,14,0.08),0_30px_60px_-40px_rgba(60,50,30,0.45)] sm:aspect-[16/9] lg:aspect-[16/7]">
            <div className="absolute" style={{ left: box.ox, top: box.oy, width: W * box.s, height: H * box.s }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" aria-hidden="true">
                <MapBase />
                {d.beats.map((b, i) => (
                  <RouteLine key={b.tech} d={b.route} color={d.techs.find((t) => t.key === b.tech).color} show={i === k} reduce={reduce} delay={0.15} duration={0.7} />
                ))}
                {d.beats.map((b, i) => (
                  <Pin key={b.tech} x={b.pin[0]} y={b.pin[1]} color={d.techs.find((t) => t.key === b.tech).color} show={i === k} delay={0.1} reduce={reduce} />
                ))}
                {d.techs.map((t) => (
                  <Tech key={t.key} t={t} active={t.key === beat.tech} reduce={reduce} />
                ))}
              </svg>
            </div>
            {d.beats.map((b, i) => (
              <Tag key={b.tech} at={b.pin} box={box} show={i === k} tone="white">
                {b.tag}
              </Tag>
            ))}

            <MapChrome title={d.title}>
              <span className="h-4 w-px bg-ink/10 max-sm:hidden" />
              <span className="flex items-center gap-2.5 max-sm:hidden">
                {d.techs.map((t) => (
                  <span key={t.key} className="flex items-center gap-1 text-[11.5px] text-ink/70">
                    <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                    {t.name}
                  </span>
                ))}
              </span>
            </MapChrome>

            {/* laptops: the thread over the map's right side */}
            <div className="absolute right-16 top-4 w-[360px] max-lg:hidden xl:w-[380px]">
              <Thread beat={beat} tech={tech} k={k} reduce={reduce} />
            </div>
          </div>

          {/* phones and tablets: the thread under the map */}
          <div className="relative z-[2] mx-3 -mt-8 sm:mx-auto sm:w-[460px] lg:hidden">
            <Thread beat={beat} tech={tech} k={k} reduce={reduce} />
          </div>

          {/* which job: a dot each, the current one long (no fill bar) */}
          <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Jobs">
            {d.beats.map((b, i) => (
              <button key={b.tech} type="button" onClick={() => setK(i)} aria-label={b.tag} aria-current={i === k ? 'step' : undefined} className="flex h-6 items-center">
                <span className={cn('block h-1.5 rounded-full transition-all duration-300', i === k ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25')} />
              </button>
            ))}
          </div>
        </div>

        <ol className="sr-only">
          {d.beats.map((b) => (
            <li key={b.tech}>
              {d.techs.find((t) => t.key === b.tech).name}: {b.thread.map((m) => m.text).join(' ')} {b.result}.
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
