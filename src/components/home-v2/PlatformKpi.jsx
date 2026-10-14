import React from 'react';
import { Activity, ArrowDownRight, CircleCheck, Sparkles, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { platformPage } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';

const K = platformPage.kpi;
const SHEET = 'rounded-[16px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_18px_36px_-24px_rgba(90,50,20,0.35)]';

/** One KPI: name, a bar against the dashed target line, and its state. No figures on purpose. */
function KpiRow({ row, target }) {
  const slipping = row.state === 'slipping';
  return (
    <li className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-ink">{row.name}</span>
        {slipping ? (
          <span className="flex items-center gap-1 rounded-full bg-[#FFF1E4] px-2 py-0.5 text-[11px] font-medium text-[#B4471A]">
            <ArrowDownRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            Slipping
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-[#E4F4E8] px-2 py-0.5 text-[11px] font-medium text-[#2E7A48]">
            <CircleCheck className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            On target
          </span>
        )}
      </div>
      <span className="relative block h-2 rounded-full bg-ink/[0.06]">
        <span
          className={cn('kpi-fill absolute inset-y-0 left-0 rounded-full', slipping ? 'bg-[#F25C2A]' : 'bg-[#2E9A58]')}
          style={{ width: `${row.fill * 100}%` }}
        />
        <span className="absolute inset-y-[-3px] w-0 border-l border-dashed border-ink/40" style={{ left: `${target * 100}%` }} />
      </span>
    </li>
  );
}

/** The illustrative board: three KPIs for one agent, then the change the KPI Agent proposes. */
function KpiBoard() {
  const b = K.board;
  return (
    <div className="relative grid gap-3">
      <div className={cn(SHEET, 'p-4 md:p-5')}>
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate">
          <Activity className="h-3.5 w-3.5 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
          {b.title}
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-normal">
            <span className="h-0 w-3 border-t border-dashed border-ink/40" />
            Target
          </span>
        </p>
        <ul className="mt-4 grid gap-3.5">
          {b.rows.map((r) => (
            <KpiRow key={r.name} row={r} target={b.target} />
          ))}
        </ul>
      </div>
      <div className={cn(SHEET, 'p-4 md:ml-10 md:p-5')}>
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#B4471A]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          {b.change.tag}
        </p>
        <p className="mt-1 text-[15px] font-medium tracking-[-0.01em] text-ink">{b.change.what}</p>
        <p className="mt-0.5 text-[12px] text-slate">{b.change.why}</p>
        <p className="mt-3 flex w-fit items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-[11.5px] text-graphite shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
          <Timer className="h-3.5 w-3.5 text-[#D9481C]" strokeWidth={1.8} aria-hidden="true" />
          {b.change.who}
        </p>
      </div>
    </div>
  );
}

/**
 * KPI Agent: how Aurora's agents get better over time. Points on the left, an illustrative board on the right.
 * The only motion is the bars filling in (CSS, .kpi-fill in index.css). Target of /platform#kpi-agent.
 */
export default function PlatformKpi() {
  return (
    <section id="kpi-agent" data-nav-theme="light" aria-labelledby="kpi-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="kpi-title" eyebrow={K.eyebrow} titleA={K.titleA} titleB={K.titleB} text={K.text} layout="split" />

        <Reveal y={36}>
          <div className="canvas canvas-grain relative mt-8 bg-[linear-gradient(160deg,#F6F1E8_0%,#ECE4D7_100%)] p-4 xs:p-5 md:mt-16 md:p-8 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute right-[5%] top-[-10%] h-[70%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.45),rgba(255,200,87,0))] blur-2xl" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
              <div>
                <p className="w-fit rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-white">{K.badge}</p>
                <ul className="mt-5 grid gap-5 md:mt-6">
                  {K.points.map((pt, i) => (
                    <li key={pt.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF1E6] text-[11px] font-medium text-[#B4471A]">{i + 1}</span>
                      <span>
                        <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink md:text-[16px]">{pt.title}</span>
                        <span className="mt-1 block text-[14px] leading-relaxed text-graphite md:text-[15px]">{pt.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div aria-hidden="true">
                <KpiBoard />
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-center text-[12px] text-slate">{K.note}</p>
      </div>
    </section>
  );
}
