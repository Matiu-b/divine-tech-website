import React from 'react';
import { ArrowRight, Check, MessagesSquare, Plug, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { howItWorks as hiw } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from './primitives/MotionReveal';

const ICONS = { talk: MessagesSquare, build: Plug, live: Power };

// Who does each step: the customer (with our experts), Aurora, or the customer approving.
const WHO_TONE = ['bg-[#F7EDDC] text-[#8A5A12]', 'bg-brand-mint text-brand-ink', 'bg-ink text-white'];

/**
 * How it works (home page): three plain steps from the customer's side, each
 * labelled with who does it, and a strip that splits "your part" from ours.
 * Deliberately simple: readable in a few seconds, the same on every screen size.
 */
export default function Configure() {
  return (
    <section id="how-it-works" data-nav-theme="light" aria-labelledby="hiw-title" className="section relative">
      <div className="shell">
        <SectionHeader id="hiw-title" eyebrow={hiw.eyebrow} titleA={hiw.titleA} titleB={hiw.titleB} text={hiw.text} layout="split" />

        <RevealGroup as="ol" className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5" amount={0.15}>
          {hiw.steps.map((s, i) => {
            const Icon = ICONS[s.icon] || MessagesSquare;
            return (
              <RevealItem as="li" key={s.name} className="relative">
                <div className="flex h-full flex-col rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_24px_48px_-36px_rgba(10,15,14,0.35)] md:p-7">
                  <div className="flex items-center justify-between">
                    <span className={cn('rounded-full px-3 py-1 text-[11.5px] font-medium', WHO_TONE[i])}>{s.who}</span>
                    <span className="text-[12px] font-medium tabular-nums text-slate">{'0' + (i + 1)}</span>
                  </div>
                  <span className="mt-8 flex h-14 w-14 items-center justify-center rounded-[18px] bg-paper-2 text-ink">
                    <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="t-h4 mt-6">{s.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-graphite">{s.text}</p>
                </div>
                {i < hiw.steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[18px] top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink/50 shadow-[0_0_0_1px_rgba(10,15,14,0.08)] md:flex"
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                ) : null}
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-5">
          <div className="grid gap-px overflow-hidden rounded-[24px] bg-ink/[0.08] md:grid-cols-2">
            {hiw.split.map(([k, v], i) => (
              <div key={k} className={cn('flex items-start gap-3 p-5 md:p-6', i === 0 ? 'bg-white/80' : 'bg-ink text-white')}>
                <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full', i === 0 ? 'bg-brand text-white' : 'bg-brand-glow text-ink')}>
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="text-[14px] leading-relaxed">
                  <span className="font-medium">{k}: </span>
                  <span className={i === 0 ? 'text-graphite' : 'text-white/70'}>{v}</span>
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
