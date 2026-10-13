import React from 'react';
import { FlaskConical, Hand, Lock, ScrollText, ShieldCheck, UsersRound } from 'lucide-react';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';

const S = platformPage.security;
const ICONS = { rules: ShieldCheck, roles: UsersRound, audit: ScrollText, handoff: Hand, data: Lock, golive: FlaskConical };

/** Security and trust: the controls a buyer checks before letting agents act. Target of /platform#security. */
export default function PlatformSecurity() {
  return (
    <section id="security" data-nav-theme="light" aria-labelledby="security-title" className="section relative pt-0">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader id="security-title" eyebrow={S.eyebrow} titleA={S.titleA} titleB={S.titleB} size="t-h2" />
        </div>
        <RevealGroup className="grid border-b border-ink/10 sm:grid-cols-2 sm:gap-3 sm:border-0 lg:col-span-8 lg:gap-4" amount={0.1}>
          {S.items.map((it) => {
            const Icon = ICONS[it.icon] || ShieldCheck;
            return (
              <RevealItem key={it.title} as="article" className="flex gap-3.5 border-t border-ink/10 py-4 sm:gap-4 sm:rounded-[22px] sm:border-0 sm:bg-white sm:p-5 sm:shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1E6] text-[#D9481C] sm:h-10 sm:w-10 sm:rounded-[13px]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink sm:text-[16px]">{it.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-graphite sm:mt-1.5 sm:text-[13.5px]">{it.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
