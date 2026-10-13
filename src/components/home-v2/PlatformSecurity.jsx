import React, { useState } from 'react';
import { Check, FlaskConical, Hand, Lock, ScrollText, ShieldCheck, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from './primitives/MotionReveal';

const S = platformPage.security;
const ICONS = { roles: UsersRound, handoff: Hand, data: Lock, golive: FlaskConical };
const MODES = [
  ['auto', 'Auto'],
  ['approval', 'Approval'],
  ['never', 'Never'],
];
const MODE_ON = {
  auto: 'bg-[#E4F4E8] text-[#2E7A48] shadow-[0_0_0_1px_rgba(46,122,72,0.18)]',
  approval: 'bg-[#FFF1E4] text-[#B4471A] shadow-[0_0_0_1px_rgba(242,92,42,0.25)]',
  never: 'bg-ink text-white',
};

/** The rules, as they look in the product. Visitors can move a row between Auto, Approval and Never. */
function PolicyEditor() {
  const P = S.policy;
  const [modes, setModes] = useState(() => P.rows.map((r) => r.mode));
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-32px_rgba(90,50,20,0.35)] md:p-5">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
          <ShieldCheck className="h-4 w-4 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
          {P.title}
        </p>
        <p className="pl-6 text-[11.5px] text-slate sm:pl-0">{P.hint}</p>
      </div>
      <ul className="mt-3 divide-y divide-ink/[0.06]">
        {P.rows.map((r, i) => {
          const mode = modes[i];
          return (
            <li key={r.action} className={cn('items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3', r.phone === false ? 'hidden sm:flex' : 'flex')}>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug text-ink sm:text-[13.5px]">{r.action}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate sm:text-[11.5px]">
                  {mode === 'auto' ? 'Aurora does it on its own' : mode === 'approval' ? 'Waits for ' + (r.who || 'a manager') : 'Aurora never does this'}
                </p>
              </div>
              <div role="radiogroup" aria-label={r.action} className="flex shrink-0 gap-0.5 rounded-full bg-paper p-1 sm:gap-1">
                {MODES.map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setModes((all) => all.map((x, j) => (j === i ? m : x)))}
                    className={cn(
                      'h-7 rounded-full px-2 text-[11px] font-medium transition-colors duration-300 sm:px-3 sm:text-[11.5px]',
                      mode === m ? MODE_ON[m] : 'text-ink/50 hover:text-ink'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11.5px] text-slate">{P.note}</p>
    </div>
  );
}

/** What was done, under which rule, and who said yes. */
function AuditLog() {
  const A = S.audit;
  return (
    <div className="flex h-full flex-col rounded-[24px] bg-[#FBF6EF] p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.05)] md:p-5">
      <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
        <ScrollText className="h-4 w-4 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
        {A.title}
      </p>
      <ol className="mt-3 grid gap-2">
        {A.entries.map((e) => (
          <li key={e.ref} className="flex gap-3 rounded-[14px] bg-white p-3 shadow-[0_0_0_1px_rgba(10,15,14,0.04)]">
            <span className="t-data shrink-0 pt-0.5 text-[11px] text-slate">{e.time}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-medium text-ink">{e.what}</span>
                <span className="t-data shrink-0 text-[10.5px] text-slate">{e.ref}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-graphite">
                <Check className="h-3 w-3 shrink-0 text-[#2E7A48]" strokeWidth={2.6} aria-hidden="true" />
                {e.by}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Security and trust: the rules and the record, shown as product, then the four guarantees. Target of /platform#security. */
export default function PlatformSecurity() {
  return (
    <section id="security" data-nav-theme="light" aria-labelledby="security-title" className="section relative pb-0 pt-0">
      <div className="shell">
        <SectionHeader id="security-title" eyebrow={S.eyebrow} titleA={S.titleA} titleB={S.titleB} text={S.text} layout="split" />
        <Reveal y={32} className="mt-10 grid gap-3 md:mt-14 lg:grid-cols-12 lg:gap-4">
          <div className="lg:col-span-7">
            <PolicyEditor />
          </div>
          <div className="lg:col-span-5">
            <AuditLog />
          </div>
        </Reveal>
        <RevealGroup className="mt-3 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4" amount={0.2}>
          {S.items.map((it) => {
            const Icon = ICONS[it.icon] || ShieldCheck;
            return (
              <RevealItem key={it.title} as="article" className="rounded-[20px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#FFF1E6] text-[#D9481C]">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[14px] font-medium tracking-[-0.01em] text-ink md:text-[15px]">{it.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-graphite md:text-[13px]">{it.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
