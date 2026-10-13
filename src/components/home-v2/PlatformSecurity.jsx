import React from 'react';
import { FlaskConical, Hand, Lock, ShieldCheck, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

const S = platformPage.security;
const ICONS = { roles: UsersRound, handoff: Hand, data: Lock, golive: FlaskConical };
const CHIP = {
  auto: 'bg-[#E4F4E8] text-[#2E7A48]',
  approval: 'bg-[#FFF1E4] text-[#B4471A]',
  never: 'bg-ink text-white',
};
const DOT = { auto: 'bg-[#2E9A58]', approval: 'bg-[#F25C2A]', never: 'bg-white' };

/** Security and trust, kept short: three levels of autonomy, then four guarantees. Target of /platform#security. */
export default function PlatformSecurity() {
  return (
    <section id="security" data-nav-theme="light" aria-labelledby="security-title" className="section relative pb-0 pt-0">
      <div className="shell">
        <SectionHeader id="security-title" eyebrow={S.eyebrow} titleA={S.titleA} titleB={S.titleB} text={S.text} layout="split" />

        <Reveal y={28} className="mt-8 md:mt-14">
          <ul className="grid divide-y divide-ink/[0.06] rounded-[24px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {S.tiers.map((t) => (
              <li key={t.mode} className="px-4 py-3.5 sm:p-6">
                <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium', CHIP[t.mode])}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', DOT[t.mode])} aria-hidden="true" />
                  {t.label}
                </span>
                <p className="mt-2 text-[13px] leading-relaxed text-ink sm:mt-4 sm:text-[15px]">
                  {t.examples.map((ex, i) => (
                    <span key={ex} className="whitespace-nowrap sm:block">
                      {i > 0 && <span className="px-1.5 text-ink/30 sm:hidden" aria-hidden="true">·</span>}
                      {ex}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>

          <ul className="mt-5 grid gap-2.5 px-1 sm:grid-cols-2 sm:gap-x-3 md:mt-6 md:flex md:flex-wrap md:justify-between">
            {S.items.map((it) => {
              const Icon = ICONS[it.icon] || ShieldCheck;
              return (
                <li key={it.title} className="flex items-center gap-2 text-[12.5px] text-graphite md:text-[14px]">
                  <Icon className="h-4 w-4 shrink-0 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
                  {it.title}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
