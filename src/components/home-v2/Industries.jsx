import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, media, solutions } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import MediaSlot from './primitives/MediaSlot';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { EASE } from './motion';

/*
 * Designed atmospheres stand in until approved photography exists.
 * Drop images or AE exports into `media.industries` in src/data/site.js.
 */
const ATMOSPHERE = {
  stone: {
    base: 'bg-[linear-gradient(165deg,#EFE7DA_0%,#D9CCB8_100%)]',
    light: 'bg-[radial-gradient(60%_70%_at_82%_8%,rgba(255,247,232,0.95),rgba(255,247,232,0)_70%)]',
    bands: 'bg-[repeating-linear-gradient(100deg,rgba(255,255,255,0)_0px,rgba(255,255,255,0)_70px,rgba(255,255,255,0.22)_90px,rgba(255,255,255,0)_130px)]',
  },
  mist: {
    base: 'bg-[linear-gradient(170deg,#EAF1F0_0%,#CBDCDA_100%)]',
    light: 'bg-[radial-gradient(55%_65%_at_20%_12%,rgba(255,255,255,0.95),rgba(255,255,255,0)_70%)]',
    bands: 'bg-[radial-gradient(40%_40%_at_75%_70%,rgba(19,168,156,0.18),rgba(19,168,156,0)_70%)]',
  },
  dusk: {
    base: 'bg-[linear-gradient(170deg,#F0E3D3_0%,#D5B394_100%)]',
    light: 'bg-[radial-gradient(70%_60%_at_50%_105%,rgba(255,206,150,0.75),rgba(255,206,150,0)_70%)]',
    bands: 'bg-[linear-gradient(180deg,rgba(255,255,255,0)_58%,rgba(255,255,255,0.28)_59%,rgba(255,255,255,0)_61%)]',
  },
};

/** @param {any} props */
function Atmosphere({ tone }) {
  const a = ATMOSPHERE[tone] || ATMOSPHERE.stone;
  return (
    <div className={cn('absolute inset-0', a.base)} aria-hidden="true">
      <div className={cn('absolute inset-0', a.light)} />
      <div className={cn('absolute inset-0 opacity-80', a.bands)} />
      <div className="canvas-grain absolute inset-0" />
    </div>
  );
}

export default function Industries() {
  const [k, setK] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef([]);
  const item = solutions.items[k];

  const onKey = (e, i) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (i + keys[e.key] + solutions.items.length) % solutions.items.length;
    setK(next);
    const el = tabs.current[next];
    if (el) el.focus();
  };

  return (
    <section id="solutions" data-nav-theme="light" aria-labelledby="solutions-title" className="section relative">
      <div className="shell">
        <SectionHeader id="solutions-title" eyebrow={solutions.eyebrow} titleA={solutions.titleA} titleB={solutions.titleB} text={solutions.text} layout="split" />

        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Industry rail */}
          <Reveal className="lg:col-span-4">
            <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 no-scrollbar lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:p-0">
              {solutions.items.map((it, i) => {
                const on = i === k;
                return (
                  <button
                    key={it.key}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={'ind-tab-' + it.key}
                    aria-selected={on}
                    aria-controls="ind-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setK(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      'group relative shrink-0 rounded-full px-4 py-2.5 text-left transition-colors duration-500 lg:rounded-none lg:border-t lg:px-0 lg:py-6',
                      on ? 'bg-ink text-white lg:bg-transparent lg:text-ink' : 'bg-white/60 text-graphite hover:text-ink lg:bg-transparent',
                      'lg:border-ink/10'
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-6">
                      <span className="text-[15px] font-medium tracking-[-0.015em] lg:text-[clamp(1.6rem,1.1rem+1vw,2.15rem)] lg:font-[440] lg:leading-tight lg:tracking-[-0.03em]">
                        <span className={cn('transition-colors duration-500', !on && 'lg:text-ink/30 lg:group-hover:text-ink/60')}>{it.label}</span>
                      </span>
                      <span className="hidden text-[13px] font-medium tabular-nums text-slate lg:inline">{'0' + (i + 1)}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.p
                          key="short"
                          initial={reduce ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="hidden overflow-hidden lg:block"
                        >
                          <span className="block pt-3 text-[15px] leading-relaxed text-graphite">{it.short}</span>
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                    {on ? <motion.span layoutId="ind-rail" className="absolute left-0 top-[-1px] hidden h-px w-full bg-ink lg:block" transition={{ duration: 0.5, ease: EASE }} /> : null}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Immersive panel */}
          <Reveal y={36} delay={0.08} className="lg:col-span-8">
            <div id="ind-panel" role="tabpanel" aria-labelledby={'ind-tab-' + item.key}>
              <div className="canvas relative aspect-[4/3.4] xs:aspect-[4/3] md:aspect-[16/9.5]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={item.key}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <MediaSlot media={media.industries[item.key]} fallback={<Atmosphere tone={item.tone} />} className="absolute inset-0" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex flex-col justify-between p-4 xs:p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <LiquidGlass className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-ink">
                      {item.label}
                    </LiquidGlass>
                    <span className="hidden rounded-full bg-white/50 px-3 py-1.5 text-[12px] font-medium text-graphite backdrop-blur-sm sm:inline-flex">
                      {brand.product} · Live
                    </span>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={item.key}
                      className="grid max-w-[340px] gap-2"
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
                    >
                      {item.chips.map((c) => (
                        <LiquidGlass
                          key={c}
                          as={motion.li}
                          variants={{
                            hidden: { opacity: 0, y: reduce ? 0 : 10, transition: { duration: 0.25 } },
                            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                          }}
                          className="flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[13px] font-medium text-ink"
                        >
                          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand text-white">
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                          </span>
                          <span className="truncate">{c}</span>
                        </LiquidGlass>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.key}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="mt-8 grid gap-8 md:grid-cols-3 md:gap-8"
                >
                  <div>
                    <p className="text-[13px] font-medium text-slate">The problem</p>
                    <ul className="mt-3 grid gap-3">
                      {item.problem.map((t) => (
                        <li key={t} className="text-[15px] leading-relaxed text-graphite">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate">How {brand.product} joins the process</p>
                    <ul className="mt-3 grid gap-3">
                      {item.fit.map((t) => (
                        <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
                          <span className="mt-[0.62em] h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate">Where the value shows up</p>
                    <dl className="mt-3 grid gap-3">
                      {item.value.map(([kk, v]) => (
                        <div key={kk} className="border-t border-ink/[0.08] pt-3 first:border-t-0 first:pt-0">
                          <dt className="text-[14px] font-medium text-ink">{kk}</dt>
                          <dd className="text-[14px] leading-relaxed text-graphite">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
