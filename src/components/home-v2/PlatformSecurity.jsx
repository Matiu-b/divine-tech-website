import React from 'react';
import { CircleCheck, ScrollText, ShieldCheck, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { RevealGroup, RevealItem } from './primitives/MotionReveal';

const S = platformPage.security;
const CHIP = {
  auto: 'bg-[#E4F4E8] text-[#2E7A48]',
  approval: 'bg-[#FFF1E4] text-[#B4471A]',
  never: 'bg-ink text-white',
};
const SHEET = 'rounded-[16px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_18px_36px_-24px_rgba(90,50,20,0.35)]';

/* Small product snippets, one per card. They sit in a soft panel and may run past its edge. */

function RulesMock({ m }) {
  return (
    <div className={cn(SHEET, 'absolute left-6 right-[-28px] top-1/2 -translate-y-1/2 p-4 lg:left-7')}>
      <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate">
        <ShieldCheck className="h-3.5 w-3.5 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
        {m.title}
      </p>
      <ul className="mt-3 grid gap-2.5">
        {m.rows.map(([mode, label, action]) => (
          <li key={action} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className={cn('w-[70px] shrink-0 rounded-full py-0.5 text-center text-[11px] font-medium', CHIP[mode])}>{label}</span>
            <span className="text-[13px] text-ink">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApprovalMock({ m }) {
  return (
    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 lg:inset-x-7">
      <div className={cn(SHEET, 'p-4')}>
        <p className="text-[11px] font-medium text-[#B4471A]">{m.tag}</p>
        <p className="mt-1 text-[16px] font-medium tracking-[-0.01em] text-ink">{m.what}</p>
        <p className="t-data mt-0.5 text-[11px] text-slate">{m.why}</p>
        <div className="mt-3 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white">Approve</span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-full text-[12px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.12)]">Decline</span>
        </div>
      </div>
      <p className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11.5px] text-graphite shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
        <Timer className="h-3.5 w-3.5 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
        {m.who}
      </p>
    </div>
  );
}

function AuditMock({ m }) {
  return (
    <div className={cn(SHEET, 'absolute bottom-[-28px] left-6 right-6 top-8 p-4 lg:left-7 lg:right-7')}>
      <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate">
        <ScrollText className="h-3.5 w-3.5 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
        {m.title}
      </p>
      <ul className="mt-3 grid gap-3">
        {m.rows.map(([what, by]) => (
          <li key={what} className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-ink">{what}</span>
              <span className="block truncate text-[11.5px] text-slate">{by}</span>
            </span>
            <CircleCheck className="h-4 w-4 shrink-0 text-[#2E9A58]" strokeWidth={1.8} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function HandoffMock({ m }) {
  return (
    <div className="absolute inset-x-6 top-1/2 grid -translate-y-1/2 gap-3 lg:inset-x-7">
      <p className="w-fit max-w-[85%] rounded-[16px] rounded-bl-[6px] bg-white px-3.5 py-2 text-[13px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">{m.ask}</p>
      <p className="flex items-center gap-2 text-[11px] text-slate">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F25C2A] text-[8.5px] font-medium text-white">D</span>
          {m.joined}
        </span>
        <span className="h-px flex-1 bg-ink/10" />
      </p>
      <p className="ml-auto w-fit max-w-[85%] rounded-[16px] rounded-br-[6px] bg-ink px-3.5 py-2 text-[13px] text-white">{m.reply}</p>
    </div>
  );
}

const MOCKS = { rules: RulesMock, approval: ApprovalMock, audit: AuditMock, handoff: HandoffMock };

/** Security and trust: four cards, each a small product snippet with one line under it. Target of /platform#security. */
export default function PlatformSecurity() {
  return (
    <section id="security" data-nav-theme="light" aria-labelledby="security-title" className="section relative pb-0 pt-0">
      <div className="shell">
        <SectionHeader id="security-title" eyebrow={S.eyebrow} titleA={S.titleA} titleB={S.titleB} text={S.text} layout="split" />

        <RevealGroup
          className="no-scrollbar mx-[calc(-1*var(--gutter))] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-[var(--gutter)] px-[var(--gutter)] md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4"
          amount={0.15}
        >
          {S.items.map((it) => {
            const Mock = MOCKS[it.key];
            return (
              <RevealItem key={it.key} as="article" className="w-[78%] shrink-0 snap-start xs:w-[68%] sm:w-[46%] md:w-auto">
                <div
                  aria-hidden="true"
                  className="relative h-[240px] overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#FBF6EF_0%,#F2E9DC_100%)] shadow-[inset_0_0_0_1px_rgba(10,15,14,0.04)] lg:h-[260px]"
                >
                  {Mock && <Mock m={it.mock} />}
                </div>
                <h3 className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-ink md:text-[17px]">{it.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-graphite md:text-[15px]">{it.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
