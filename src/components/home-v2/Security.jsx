import React from 'react';
import { KeyRound, ScrollText, ShieldCheck, UserCheck } from 'lucide-react';
import { security } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';

const ICONS = { data: ShieldCheck, approval: UserCheck, audit: ScrollText, access: KeyRound };

export default function Security() {
  return (
    <section id="security" data-nav-theme="light" aria-labelledby="security-title" className="section relative">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeader id="security-title" eyebrow={security.eyebrow} titleA={security.titleA} titleB={security.titleB} text={security.text} size="t-h1" />
          </div>
        </div>
        <RevealGroup className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6" amount={0.15}>
          {security.items.map((it) => {
            const Icon = ICONS[it.key];
            return (
              <RevealItem key={it.key} className="border-t border-ink/10 py-8 sm:py-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_8px_20px_-12px_rgba(10,15,14,0.25)]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="t-h4 mt-6">{it.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-graphite">{it.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
