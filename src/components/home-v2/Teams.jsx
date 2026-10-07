import React from 'react';
import { Check } from 'lucide-react';
import { teams } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import SectionHeader from './primitives/SectionHeader';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';
import { EVENT_ICONS } from './Moment';

/**
 * One team, one agent. The photo and its glass status chip share a canvas, so
 * the card can reveal as a whole without the glass losing its backdrop.
 * @param {any} props
 */
function TeamCard({ t }) {
  const Icon = EVENT_ICONS[t.chip.icon];
  return (
    <RevealItem as="article" y={28} className="flex flex-col">
      <div className="canvas relative aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: 'url(' + t.photo.lqip + ')' }}>
        <img
          src={t.photo.src}
          srcSet={t.photo.srcSet}
          sizes="(min-width: 1440px) 420px, (min-width: 1024px) 31vw, calc(100vw - 32px)"
          alt={t.photo.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <LiquidGlass className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-[16px] px-3 py-2.5 xs:inset-x-4 xs:bottom-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/85 text-ink shadow-[0_1px_2px_rgba(10,15,14,0.08)]">
            {Icon ? <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden="true" /> : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-medium text-slate">{t.agent}</span>
            <span className="block truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink">{t.chip.title}</span>
          </span>
          <span className="shrink-0 text-[11.5px] text-graphite lg:hidden xl:inline">{t.chip.detail}</span>
        </LiquidGlass>
      </div>

      <div className="flex flex-1 flex-col pt-6 md:pt-7">
        <p className="eyebrow">{t.label}</p>
        <h3 className="t-h3 balance mt-3">{t.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-graphite">
          <span className="font-medium text-ink">Who it helps: </span>
          {t.who}
        </p>
        <ul className="mt-5 grid gap-3 border-t border-ink/10 pt-5">
          {t.does.map((d) => (
            <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-graphite">
              <span className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand/[0.12] text-brand-ink">
                <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.05),0_12px_28px_-18px_rgba(10,15,14,0.3)] md:p-5">
            <p className="text-[12px] font-medium text-brand-ink">How the team gains</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{t.gain}</p>
            <p className="mt-4 border-t border-ink/[0.07] pt-3 text-[12px] font-medium text-slate">KPIs it owns</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {t.kpis.map((k) => (
                <li key={k} className="rounded-full bg-paper-2 px-2.5 py-1 text-[12px] font-medium text-graphite">
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </RevealItem>
  );
}

export default function Teams() {
  return (
    <section id="teams" data-nav-theme="light" aria-labelledby="teams-title" className="section relative">
      <div className="shell">
        <SectionHeader id="teams-title" eyebrow={teams.eyebrow} titleA={teams.titleA} titleB={teams.titleB} text={teams.text} layout="split" />
        <RevealGroup className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-3 lg:gap-6 xl:gap-8" amount={0.08}>
          {teams.items.map((t) => (
            <TeamCard key={t.key} t={t} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
