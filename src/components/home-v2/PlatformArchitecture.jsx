import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, platformPage } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { useInViewport, usePageVisible } from './hooks';

const A = platformPage.architecture;

/** A hairline with a small light travelling along it: a request moving between columns. */
function Beam({ vertical = false, delay = 0, reduce }) {
  return (
    <span aria-hidden="true" className={cn('relative block', vertical ? 'mx-auto h-8 w-px' : 'h-px w-full')}>
      <span className={cn('absolute bg-ink/15', vertical ? 'inset-y-0 left-0 w-px' : 'inset-x-0 top-0 h-px')} />
      {reduce ? null : (
        <span
          className={cn(
            'absolute h-1.5 w-1.5 rounded-full bg-[#F25C2A] shadow-[0_0_10px_2px_rgba(242,92,42,0.45)]',
            vertical ? 'left-[-2.5px] animate-[beam-y_2.4s_linear_infinite]' : 'top-[-2.5px] animate-[beam-x_2.4s_linear_infinite]'
          )}
          style={{ animationDelay: delay + 's' }}
        />
      )}
    </span>
  );
}

function Column({ title, children, className = '' }) {
  return (
    <div className={cn('rounded-[24px] bg-white/70 p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] backdrop-blur md:p-5', className)}>
      <p className="text-[12px] font-medium text-slate">{title}</p>
      {children}
    </div>
  );
}

/**
 * How it's built: channels in, Aurora's three layers, your systems out. A light steps through
 * one channel, each layer and one system in turn, the way a single request travels.
 */
export default function PlatformArchitecture() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const visible = usePageVisible();
  const inView = useInViewport(ref, { threshold: 0.25 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce || !inView || !visible) return undefined;
    const id = window.setInterval(() => setTick((t) => t + 1), 900);
    return () => window.clearInterval(id);
  }, [reduce, inView, visible]);

  // Each request takes 5 beats: channel, Understand, Decide, Act, system.
  const run = Math.floor(tick / 5);
  const beat = tick % 5;
  const ch = run % A.channels.length;
  const sys = (run * 2 + 1) % A.systems.length;
  const layerOn = (i) => !reduce && beat === i + 1;

  return (
    <section id="how-it-is-built" data-nav-theme="light" aria-labelledby="arch-title" className="section relative">
      <div className="shell">
        <SectionHeader id="arch-title" eyebrow={A.eyebrow} titleA={A.titleA} titleB={A.titleB} text={A.text} layout="split" />

        <Reveal y={36}>
          <div ref={ref} className="canvas canvas-grain relative mt-10 bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-6 md:mt-16 md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className={cn('absolute left-[30%] top-[-10%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.32),rgba(242,92,42,0))] blur-2xl', !reduce && 'animate-drift')} />
              <div className={cn('absolute bottom-[-20%] left-[40%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.5),rgba(255,200,87,0))] blur-2xl', !reduce && 'animate-drift [animation-delay:-8s]')} />
            </div>

            <div className="relative grid items-center gap-0 lg:grid-cols-[minmax(0,0.72fr)_40px_minmax(0,2fr)_40px_minmax(0,0.95fr)]">
              {/* Channels */}
              <Column title="Channels in">
                <ul className="mt-3 flex flex-wrap gap-1.5 lg:grid lg:gap-1.5">
                  {A.channels.map((c, i) => (
                    <li
                      key={c}
                      className={cn(
                        'rounded-[12px] px-3 py-2 text-[13px] font-medium transition-colors duration-500',
                        !reduce && beat === 0 && i === ch ? 'bg-[#FFF1E6] text-[#B4471A] ring-1 ring-[#F25C2A]/25' : 'bg-paper text-ink'
                      )}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </Column>

              <div className="py-1 lg:hidden">
                <Beam vertical reduce={reduce} />
              </div>
              <div className="hidden lg:block">
                <Beam reduce={reduce} />
              </div>

              {/* Aurora: three layers */}
              <LiquidGlass
                className="relative rounded-[28px] p-4 md:p-6"
                style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.2)', '--lg-sheen': 'rgba(255,240,215,0.7)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <img src="/brand/aurora-logo-horizontal-color.svg" alt={brand.product} width="124" height="32" className="h-7 w-auto" />
                  <span className="whitespace-nowrap text-[12px] text-ink/55">One memory · one set of rules · one record</span>
                </div>
                <ol className="mt-4 grid gap-2.5 md:grid-cols-3">
                  {A.layers.map((l, i) => (
                    <li
                      key={l.name}
                      className={cn(
                        'rounded-[18px] p-3.5 transition-[background-color,box-shadow] duration-500',
                        layerOn(i) ? 'bg-white shadow-[0_10px_26px_-16px_rgba(242,92,42,0.7)] ring-1 ring-[#F25C2A]/25' : 'bg-white/55'
                      )}
                    >
                      <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
                        <span className={cn('h-2 w-2 rounded-full transition-colors duration-500', layerOn(i) ? 'bg-[#F25C2A]' : 'bg-ink/20')} />
                        {l.name}
                      </p>
                      {/* phones: the first point only, so the card never changes height */}
                      <ul className="mt-2 grid gap-1.5">
                        {l.points.map((pt, j) => (
                          <li key={pt} className={cn('text-[12.5px] leading-snug text-ink/70', j > 0 && 'hidden md:block')}>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </LiquidGlass>

              <div className="py-1 lg:hidden">
                <Beam vertical delay={1.2} reduce={reduce} />
              </div>
              <div className="hidden lg:block">
                <Beam delay={1.2} reduce={reduce} />
              </div>

              {/* Systems */}
              <Column title="Your systems">
                <ul className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                  {A.systems.map((s, i) => (
                    <li
                      key={s.name}
                      className={cn(
                        'rounded-[12px] px-3 py-2 transition-colors duration-500',
                        !reduce && beat === 4 && i === sys ? 'bg-[#FFF1E6] ring-1 ring-[#F25C2A]/25' : 'bg-paper'
                      )}
                    >
                      <span className="block text-[13px] font-medium text-ink">{s.name}</span>
                      <span className="block truncate text-[11.5px] text-slate">{s.examples}</span>
                    </li>
                  ))}
                </ul>
              </Column>
            </div>

            <p className="relative mt-5 flex items-center justify-center gap-1.5 text-center text-[12px] text-ink/55 lg:hidden">
              <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              One request, from the channel it came in on to the system where the work is done
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
