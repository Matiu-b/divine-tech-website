import React from 'react';
import { cn } from '@/lib/utils';
import { brand, platformPage } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

const A = platformPage.architecture;

/** A still hairline from one column to the next, with a small dot where it lands. */
function Beam({ vertical = false }) {
  return (
    <span aria-hidden="true" className={cn('relative block', vertical ? 'mx-auto h-5 w-px' : 'h-px w-full')}>
      <span className={cn('absolute bg-ink/20', vertical ? 'inset-y-0 left-0 w-px' : 'inset-x-0 top-0 h-px')} />
      <span className={cn('absolute h-1.5 w-1.5 rounded-full bg-[#F25C2A]', vertical ? 'bottom-[-3px] left-[-2.5px]' : 'right-[-3px] top-[-2.5px]')} />
    </span>
  );
}

function Column({ title, children, className = '' }) {
  return (
    <div className={cn('rounded-[20px] bg-white/70 p-3.5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] backdrop-blur lg:rounded-[24px] lg:p-5', className)}>
      <p className="text-[12px] font-medium text-slate">{title}</p>
      {children}
    </div>
  );
}

/**
 * How it's built: channels in, Aurora's three layers, your systems out. Kept still on purpose:
 * the hero film is the one moving piece on this page.
 */
export default function PlatformArchitecture() {
  return (
    <section id="how-it-is-built" data-nav-theme="light" aria-labelledby="arch-title" className="section relative">
      <div className="shell">
        <SectionHeader id="arch-title" eyebrow={A.eyebrow} titleA={A.titleA} titleB={A.titleB} text={A.text} layout="split" />

        <Reveal y={36}>
          <div className="canvas canvas-grain relative mt-8 bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-3 xs:p-4 md:mt-16 md:p-8 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className={cn('absolute left-[30%] top-[-10%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.32),rgba(242,92,42,0))] blur-2xl')} />
              <div className={cn('absolute bottom-[-20%] left-[40%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.5),rgba(255,200,87,0))] blur-2xl')} />
            </div>

            <div className="relative grid items-center gap-0 lg:grid-cols-[minmax(0,0.72fr)_40px_minmax(0,2fr)_40px_minmax(0,0.95fr)]">
              {/* Channels */}
              <Column title="Channels in">
                <ul className="mt-2 flex flex-wrap gap-1 lg:mt-3 lg:grid lg:gap-1.5">
                  {A.channels.map((c) => (
                    <li key={c} className="rounded-[10px] bg-paper px-2.5 py-1 text-[12px] font-medium text-ink lg:rounded-[12px] lg:px-3 lg:py-2 lg:text-[13px]">
                      {c}
                    </li>
                  ))}
                </ul>
              </Column>

              <div className="py-1 lg:hidden">
                <Beam vertical />
              </div>
              <div className="hidden lg:block">
                <Beam />
              </div>

              {/* Aurora: three layers */}
              <LiquidGlass
                className="relative rounded-[22px] p-3.5 lg:rounded-[28px] lg:p-6"
                style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.2)', '--lg-sheen': 'rgba(255,240,215,0.7)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <img src="/brand/aurora-logo-horizontal-color.svg" alt={brand.product} width="124" height="32" className="h-6 w-auto lg:h-7" />
                  <span className="whitespace-nowrap text-[11px] text-ink/55 lg:text-[12px]">One memory · one set of rules · one record</span>
                </div>
                <ol className="mt-3 grid gap-1.5 md:grid-cols-3 lg:mt-4 lg:gap-2.5">
                  {A.layers.map((l, i) => (
                    <li
                      key={l.name}
                      className="rounded-[14px] bg-white/70 px-3 py-2.5 lg:rounded-[18px] lg:p-3.5"
                    >
                      <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink lg:text-[14px]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF1E6] text-[10px] font-medium text-[#B4471A]">{i + 1}</span>
                        {l.name}
                      </p>
                      {/* below lg: the first point only, so the diagram fits on one phone screen */}
                      <ul className="mt-1 grid gap-1.5 pl-7 lg:mt-2 lg:pl-0">
                        {l.points.map((pt, j) => (
                          <li key={pt} className={cn('text-[12.5px] leading-snug text-ink/70', j > 0 && 'hidden lg:block')}>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </LiquidGlass>

              <div className="py-1 lg:hidden">
                <Beam vertical />
              </div>
              <div className="hidden lg:block">
                <Beam />
              </div>

              {/* Systems */}
              <Column title="Your systems">
                <ul className="mt-2 flex flex-wrap gap-1 lg:mt-3 lg:grid lg:grid-cols-1 lg:gap-1.5">
                  {A.systems.map((s) => (
                    <li key={s.name} className="rounded-[10px] bg-paper px-2.5 py-1 lg:rounded-[12px] lg:px-3 lg:py-2">
                      <span className="block text-[12px] font-medium text-ink lg:text-[13px]">{s.name}</span>
                      <span className="hidden truncate text-[11.5px] text-slate lg:block">{s.examples}</span>
                    </li>
                  ))}
                </ul>
              </Column>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
