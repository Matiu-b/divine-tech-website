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
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:gap-4" amount={0.1}>
          {S.items.map((it) => {
            const Icon = ICONS[it.icon] || ShieldCheck;
            return (
              <RevealItem key={it.title} as="article" className="flex gap-4 rounded-[22px] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FFF1E6] text-[#D9481C]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[16px] font-medium tracking-[-0.01em] text-ink">{it.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-graphite">{it.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
