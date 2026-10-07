import React from 'react';
import { duo } from '@/data/site';
import { cn } from '@/lib/utils';
import LiquidGlass from './primitives/LiquidGlass';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';
import { EVENT_ICONS } from './Moment';

/**
 * Two real-life moments side by side (wide + tall on desktop, stacked on
 * phones). Each tile is one canvas holding its photo and glass chip, so a
 * tile can reveal as a whole without the glass losing its backdrop.
 */
export default function PhotoDuo() {
  return (
    <section data-nav-theme="light" aria-label={duo.label} className="relative pt-[clamp(64px,8vw,120px)]">
      <div className="shell">
        <RevealGroup className="grid gap-4 md:grid-cols-12 md:gap-5" amount={0.12}>
          {duo.items.map((it, i) => {
            const Icon = EVENT_ICONS[it.chip.icon];
            return (
              <RevealItem key={it.key} as="figure" y={32} className={cn('m-0', i === 0 ? 'md:col-span-7' : 'md:col-span-5')}>
                <div
                  className={cn('canvas relative bg-cover bg-center md:aspect-auto md:h-[clamp(420px,44vw,600px)]', it.mobileAspect)}
                  style={{ backgroundImage: 'url(' + it.photo.lqip + ')' }}
                >
                  <img
                    src={it.photo.src}
                    srcSet={it.photo.srcSet}
                    sizes={it.photo.sizes}
                    alt={it.photo.alt}
                    loading="lazy"
                    decoding="async"
                    className={cn('absolute inset-0 h-full w-full object-cover', it.photo.position)}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,12,10,0.6)_0%,rgba(6,12,10,0.22)_32%,rgba(6,12,10,0)_55%)]"
                  />
                  <LiquidGlass className="absolute left-3 top-3 flex max-w-[calc(100%-24px)] items-center gap-2.5 rounded-[14px] py-2 pl-2 pr-3.5 xs:left-4 xs:top-4 md:left-5 md:top-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/85 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
                      {Icon ? <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-semibold leading-tight tracking-[-0.01em] text-ink">{it.chip.title}</span>
                      <span className="block truncate text-[11px] text-graphite">{it.chip.detail}</span>
                    </span>
                  </LiquidGlass>
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 xs:p-6 md:p-7">
                    <p className="t-h3 balance max-w-[20ch] text-white">{it.caption}</p>
                  </figcaption>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
