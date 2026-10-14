import React, { useState } from 'react';
import { CalendarCheck, Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand } from '@/data/site';
import { Reveal } from '@/components/home-v2/primitives/MotionReveal';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';

// Product scenes for the v2 industry pages (real estate first). Plain HTML and CSS, no video or canvas,
// so phones get the designed page from the prerendered HTML. Names, times and amounts in them are examples.

function Tick({ className = undefined }) {
  return (
    <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-white', className)}>
      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

const DOTS = { green: 'bg-brand', amber: 'bg-[#FF9F45]', muted: 'bg-ink/15' };
const TAGS = { green: 'bg-brand/10 text-brand-ink', amber: 'bg-[#FF9F45]/20 text-[#8A4410]' };

function Tag({ tone = undefined, children }) {
  return <span className={cn('shrink-0 rounded-[6px] px-1.5 py-0.5 text-[10px]', TAGS[tone] || 'bg-paper-2 text-graphite')}>{children}</span>;
}

function Bubble({ dir, children, time = undefined, delay = undefined }) {
  const out = dir === 'out';
  return (
    <p
      className={cn(
        'max-w-[86%] rounded-[14px] px-3 py-2 text-[12.5px] leading-[1.45]',
        out ? 'self-end rounded-br-[4px] bg-ink text-white' : 'self-start rounded-bl-[4px] bg-paper-2 text-ink',
        delay !== undefined && 'convo-pop'
      )}
      style={delay !== undefined ? { animationDelay: delay + 's' } : undefined}
    >
      {children}
      {time || out ? <span className="mt-0.5 block text-[10px] opacity-55">{[time, out ? brand.product : null].filter(Boolean).join(' · ')}</span> : null}
    </p>
  );
}

function ContactHead({ initials, name, detail, source }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-ink/[0.08] pb-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[12px] font-medium">{initials}</span>
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium">{name}</p>
          <p className="truncate text-[11px] text-graphite">{detail}</p>
        </div>
      </div>
      <span className="shrink-0 rounded-[8px] bg-brand/10 px-2 py-0.5 text-[10.5px] text-brand-ink">{source}</span>
    </div>
  );
}

/** Hero: the photo with a sample conversation that plays once (CSS, so it runs on the prerendered HTML). */
export function ConversationStage({ photo, convo }) {
  const step = 0.75;
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[22px] bg-paper-2 md:rounded-[28px]">
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1440px) 1320px, calc(100vw - 32px)"
          alt={photo.alt}
          fetchPriority="high"
          decoding="async"
          width="1440"
          height="756"
          className={cn('aspect-[4/3] h-auto w-full object-cover md:aspect-[16/8.4]', photo.position || 'object-[50%_45%]')}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(10,15,14,0)_30%,rgba(10,15,14,0.35))] md:block" />
        <span className="absolute left-3.5 top-3.5 rounded-[8px] bg-ink/45 px-2 py-1 text-[10.5px] text-white md:left-7 md:top-6">Sample conversation</span>
        <p className="absolute bottom-6 left-7 hidden max-w-[46%] text-[clamp(15px,1.7vw,20px)] font-medium leading-snug text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] md:block">
          {convo.caption}
        </p>
      </div>
      <div
        aria-label="Sample conversation between a buyer and Aurora"
        className="relative z-[1] mx-2.5 -mt-16 flex flex-col rounded-[22px] bg-white p-4 shadow-[0_0_0_1px_rgba(10,15,14,0.06),0_20px_50px_-20px_rgba(10,15,14,0.45)] md:absolute md:inset-y-6 md:right-6 md:mx-0 md:mt-0 md:w-[min(380px,44%)] md:bg-white/90"
      >
        <ContactHead {...convo.contact} />
        <div className="flex flex-1 flex-col gap-2 overflow-hidden pt-3">
          {convo.messages.map(([dir, text, time], i) => (
            <Bubble key={i} dir={dir} time={time} delay={0.5 + i * step}>
              {text}
            </Bubble>
          ))}
        </div>
        <div className="convo-pop mt-2.5 flex items-center gap-2.5 rounded-[14px] bg-white p-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.07)]" style={{ animationDelay: 0.5 + convo.messages.length * step + 's' }}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand/10 text-brand-ink">
            <CalendarCheck className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium">{convo.booked.title}</p>
            <p className="truncate text-[11px] text-graphite">{convo.booked.detail}</p>
          </div>
          <Tick className="ml-auto" />
        </div>
      </div>
    </div>
  );
}

/** A day at the business: seven moments under a dawn-to-dusk sky (desktop), a list on phones. */
export function DayTimeline({ day }) {
  const n = day.stops.length;
  return (
    <section id="day" data-nav-theme="light" aria-labelledby="ind-day-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="ind-day-title" eyebrow="A day with Aurora" titleA={day.titleA} titleB={day.titleB} text={day.text} layout="split" size="t-h1" />
        <Reveal className="mt-10 md:mt-14">
          <div aria-hidden="true" className="relative hidden h-[112px] overflow-hidden rounded-t-[24px] bg-[linear-gradient(90deg,#1A2238_0%,#3B3554_12%,#F25C2A_26%,#FFC857_40%,#FFF2D6_55%,#FFC857_75%,#FF9F45_88%,#3B3554_100%)] lg:block">
            <svg viewBox="0 0 700 112" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 110 Q350 -36 700 110" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
            </svg>
            {day.stops.map((s, i) => {
              const x = (i + 0.5) / n;
              const y = 110 - 292 * x * (1 - x); // the dashed arc's height at x
              return <span key={s[0]} className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: x * 100 + '%', top: (y / 112) * 100 + '%' }} />;
            })}
          </div>
          <ol className="grid rounded-[24px] bg-white py-1.5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] lg:grid-cols-7 lg:rounded-t-none lg:py-0">
            {day.stops.map(([time, what, who], i) => (
              <li key={time} className={cn('grid grid-cols-[76px_1fr] gap-x-3 px-[18px] py-3.5 lg:block lg:px-3.5 lg:pb-5 lg:pt-[18px]', i > 0 && 'border-t border-ink/[0.07] lg:border-l lg:border-t-0')}>
                <p className="text-[12px] font-medium tabular-nums text-brand-ink">{time}</p>
                <p className="text-[13px] font-medium leading-snug lg:mt-2">{what}</p>
                <p className="col-start-2 mt-0.5 text-[11px] text-slate lg:mt-2">{who}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function AgentMock({ mock }) {
  if (mock.kind === 'calendar') {
    const busy = [1, 0, 1, 0, 2, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0];
    return (
      <>
        <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-slate">
          {mock.days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1">
          {busy.map((b, i) => (
            <span key={i} className={cn('h-[26px] rounded-[6px]', b === 2 ? 'bg-ink' : b ? 'bg-brand/20' : 'bg-white')} />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 rounded-[10px] bg-white px-2.5 py-2">
          <Tick />
          <span className="truncate">{mock.footer}</span>
        </div>
      </>
    );
  }
  const rows = (mock.rows || []).map((r) => (
    <div key={r.text} className="flex min-w-0 items-center gap-2 rounded-[10px] bg-white px-2.5 py-2">
      {r.done ? <Tick /> : r.dot ? <span className={cn('h-2 w-2 shrink-0 rounded-full', DOTS[r.dot])} /> : null}
      <span className="min-w-0 flex-1 truncate">{r.text}</span>
      {r.tag ? <Tag tone={r.tone}>{r.tag}</Tag> : null}
    </div>
  ));
  if (mock.kind === 'draft') {
    return (
      <>
        <div className="rounded-[10px] bg-white p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium">{mock.title}</p>
            {mock.badge ? <Tag tone="green">{mock.badge}</Tag> : null}
          </div>
          {mock.detail ? <p className="mt-1 text-[11px] text-graphite">{mock.detail}</p> : null}
          <span className="mt-2 block h-1.5 rounded-full bg-paper-2" />
          <span className="mt-1.5 block h-1.5 w-[80%] rounded-full bg-paper-2" />
          <span className="mt-1.5 block h-1.5 w-[55%] rounded-full bg-paper-2" />
        </div>
        {rows}
        {mock.actions ? (
          <div className="mt-auto flex gap-1.5">
            {mock.actions.map((a, i) => (
              <span key={a} className={cn('rounded-[8px] px-2.5 py-1 text-[11px]', i === 0 ? 'bg-ink text-white' : 'bg-white text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.08)]')}>
                {a}
              </span>
            ))}
          </div>
        ) : null}
      </>
    );
  }
  return rows;
}

/** The agents Aurora runs for this industry, each with a small product screen. */
export function AgentsGrid({ agents }) {
  return (
    <section data-nav-theme="light" aria-labelledby="ind-agents-title" className="section relative">
      <div className="shell">
        <SectionHeader id="ind-agents-title" eyebrow={brand.product + ' agents'} titleA={agents.titleA} titleB={agents.titleB} text={agents.text} layout="split" size="t-h1" />
        <Reveal className="mt-10 md:mt-14">
          <div className="flex items-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,rgba(242,92,42,0.1),rgba(255,200,87,0.16))] px-4 py-3 shadow-[0_0_0_1px_rgba(242,92,42,0.14)]">
            <img src="/brand/aurora-symbol-color.svg" alt="" width="26" height="26" className="h-[26px] w-[26px] shrink-0" />
            <p className="text-[12.5px] text-ink/80">
              <span className="font-medium text-ink">{brand.product}</span> · one memory, your rules and a full audit log across every agent
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-3.5 grid gap-3.5 md:grid-cols-2 lg:grid-cols-6" amount={0.1}>
          {agents.list.map((a, i) => (
            <article
              key={a.name}
              className={cn('flex flex-col rounded-[24px] bg-white p-[18px] shadow-[0_0_0_1px_rgba(10,15,14,0.06)] lg:col-span-2', agents.list.length === 5 && i === 3 && 'lg:col-start-2')}
            >
              <div aria-hidden="true" className="flex min-h-[150px] flex-col gap-1.5 rounded-[16px] bg-paper p-3 text-[11.5px]">
                <AgentMock mock={a.mock} />
              </div>
              <h3 className="t-h4 mt-5">{a.name}</h3>
              <p className="mt-1 text-[11.5px] text-slate">{a.desk}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-graphite">{a.text}</p>
            </article>
          ))}
        </Reveal>
        {agents.more ? (
          <Reveal className="mt-6">
            <p className="max-w-[52em] text-[13.5px] leading-relaxed text-graphite">
              <span className="font-medium text-ink">{agents.more[0]}</span> {agents.more[1]}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/** Scenarios in tabs: the conversation, and what Aurora did in the business's systems. */
export function Scenarios({ scenarios }) {
  const [active, setActive] = useState(0);
  const s = scenarios.list[active];
  return (
    <section data-nav-theme="light" aria-labelledby="ind-run-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="ind-run-title" eyebrow="See it run" titleA={scenarios.titleA} titleB={scenarios.titleB} text={scenarios.text} layout="split" size="t-h1" />
        <Reveal className="mt-10 md:mt-14">
          <div role="tablist" aria-label="Scenarios" className="flex w-fit max-w-full flex-wrap gap-1 rounded-[22px] bg-white p-1 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] sm:rounded-full">
            {scenarios.list.map((x, i) => (
              <button
                key={x.label}
                type="button"
                role="tab"
                id={'ind-tab-' + i}
                aria-selected={i === active}
                aria-controls="ind-scene"
                onClick={() => setActive(i)}
                className={cn('rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors', i === active ? 'bg-ink text-white' : 'text-graphite hover:text-ink')}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div id="ind-scene" role="tabpanel" aria-labelledby={'ind-tab-' + active} className="mt-3.5 grid gap-3.5 lg:grid-cols-2">
            <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate">Conversation</p>
              <div className="mt-3">
                <ContactHead initials={s.contact[0]} name={s.contact[1]} detail={s.contact[2]} source="Sample" />
              </div>
              <div className="flex flex-col gap-2 pt-3">
                {s.messages.map(([dir, text], i) => (
                  <Bubble key={active + '-' + i} dir={dir}>
                    {text}
                  </Bubble>
                ))}
              </div>
            </div>
            <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate">What {brand.product} did in your systems</p>
              <ul className="mt-3">
                {s.log.map(([time, what, where], i) => (
                  <li key={active + '-' + i} className={cn('grid grid-cols-[76px_16px_1fr] items-start gap-2.5 py-2.5 text-[13px]', i > 0 && 'border-t border-ink/[0.07]')}>
                    <span className="pt-px text-[11.5px] tabular-nums text-slate">{time}</span>
                    <Tick className="mt-0.5" />
                    <span className="min-w-0">
                      {what}
                      <span className="mt-0.5 block text-[11px] text-slate">{where}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-start gap-2.5 rounded-[14px] bg-[#FF9F45]/[0.12] px-3.5 py-3 text-[12.5px] leading-relaxed">
                <Users className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                {s.handoff}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const LEVELS = {
  never: ['Never', 'bg-[#F25C2A]/[0.12] text-[#A53A13]'],
  ask: ['Needs approval', 'bg-[#FFC857]/25 text-[#6E4A00]'],
  auto: ['On its own', 'bg-brand/10 text-brand-ink'],
};

/** Rules with their autonomy level, and what is on record. */
export function RulesPanel({ control }) {
  return (
    <section data-nav-theme="light" aria-labelledby="ind-rules-title" className="section relative pt-0">
      <div className="shell">
        <SectionHeader id="ind-rules-title" eyebrow="You stay in control" titleA={control.title} text={control.text} layout="split" size="t-h1" />
        <div className="mt-10 grid gap-3.5 md:mt-14 lg:grid-cols-12">
          <Reveal className="rounded-[24px] bg-white px-5 py-2 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] lg:col-span-7">
            <ul aria-label="Example rules">
              {control.rules.map(([rule, level], i) => (
                <li key={rule} className={cn('flex items-center justify-between gap-4 py-4 text-[14px]', i > 0 && 'border-t border-ink/[0.07]')}>
                  <span>{rule}</span>
                  <span className={cn('shrink-0 rounded-full px-3 py-1 text-[11.5px] font-medium', LEVELS[level][1])}>{LEVELS[level][0]}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="relative overflow-hidden rounded-[24px] bg-[#FFF6EA] p-6 shadow-[0_0_0_1px_rgba(242,92,42,0.12)] lg:col-span-5 md:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-[20%] bg-[radial-gradient(40%_40%_at_20%_20%,rgba(242,92,42,0.3),transparent_70%),radial-gradient(45%_45%_at_85%_85%,rgba(255,200,87,0.5),transparent_70%)]" />
            <div className="relative">
              <img src="/brand/aurora-symbol-color.svg" alt="" width="32" height="32" className="h-8 w-8" />
              <h3 className="t-h3 mt-5">Every step on record.</h3>
              <ul className="mt-4 grid gap-2.5 text-[13.5px] leading-relaxed text-ink/80">
                {control.record.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <Tick className="mt-1" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
