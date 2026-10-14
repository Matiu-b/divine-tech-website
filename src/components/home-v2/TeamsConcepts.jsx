import React from 'react';
import { Check, TrendingUp } from 'lucide-react';
import { teams } from '@/data/site';
import SectionHeader from './primitives/SectionHeader';
import { Reveal } from './primitives/MotionReveal';
import { EVENT_ICONS } from './eventIcons';

/*
 * PREVIEW ONLY: three alternative visuals for the Teams section, stacked so they can be compared.
 * A: the agent at work (live product UI). B: tactile 3D objects. C: Aurora at the centre of the team's systems.
 * The text under each visual is the same as today's Teams section.
 */

// Illustrative flows, one per team (fictional requests, no figures).
const FLOWS = {
  sales: {
    from: 'New lead · Web chat',
    msg: 'Hi, is the 2 bedroom still available? Could I see it this week?',
    steps: ['Lead qualified', 'Rep calendars checked', 'Meeting booked · Thu 11:00', 'CRM updated'],
  },
  service: {
    from: 'Customer · SMS',
    msg: 'Something came up. Can I move my appointment to Thursday?',
    steps: ['Customer and booking found', 'Thursday slot held', 'Appointment moved', 'Confirmation sent'],
  },
  internal: {
    from: 'Vendor invoice · Email',
    msg: 'Attached is invoice INV-482 for the October service visit.',
    steps: ['Matched to the purchase order', 'Sent to Finance for approval', 'Approved by Alex', 'Scheduled for payment'],
  },
};

// Systems around Aurora in concept C (names as text only, no partner logos).
const ORBITS = {
  sales: { in: ['Web chat', 'Phone', 'SMS'], out: ['CRM', 'Calendar', 'Email'] },
  service: { in: ['SMS', 'Email', 'WhatsApp'], out: ['Booking system', 'Help desk', 'Knowledge'] },
  internal: { in: ['Email', 'Slack', 'Forms'], out: ['Accounting', 'Approvals', 'Reports'] },
};

// Preview only: Higgsfield renders served from its CDN. If a concept is picked, they move into public/img as webp.
const HF = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Jg2ZFpVL5E1jVl8P4jJhoRmINj/';
const IMAGES = {
  sales: HF + 'hf_20261014_074814_cfa5042b-d1fb-402a-8c85-18d8b310d9be.png',
  service: HF + 'hf_20261014_074815_82e51739-f8a2-41eb-b3d7-ec67d356a724.png',
  internal: HF + 'hf_20261014_074815_a69590ab-fdd1-4e2e-bac4-f9ce7ff6cbf8.png',
};

function TeamText({ t }) {
  return (
    <div className="flex flex-1 flex-col pt-6 md:pt-7">
      <p className="eyebrow">{t.label}</p>
      <h3 className="t-h3 balance mt-3">{t.title}</h3>
      <p className="mt-3 max-w-[35.72em] text-[15px] leading-relaxed text-graphite">{t.line}</p>
      <p className="mt-5 text-[12px] font-medium text-slate">What it moves</p>
      <ul className="mt-2 grid gap-1.5">
        {t.kpis.map((k) => (
          <li key={k} className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#D9481C]" strokeWidth={2} aria-hidden="true" />
            {k}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- A: the agent at work ---------- */
function AgentAtWork({ t }) {
  const f = FLOWS[t.key];
  const Icon = EVENT_ICONS[t.chip.icon];
  return (
    <div className="canvas relative aspect-[4/3] overflow-hidden bg-[linear-gradient(160deg,#FBF6EF_0%,#F0E6D8_100%)] p-4 xs:p-5">
      <div className="flex items-center gap-2 text-[11px] font-medium text-slate">
        <span className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-ink text-white">
          {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" /> : null}
        </span>
        {t.agent}
        <span className="ml-auto flex items-center gap-1.5">
          <span className="concept-live h-1.5 w-1.5 rounded-full bg-[#2E9A58]" />
          Working
        </span>
      </div>
      <div className="mt-3 rounded-[14px] rounded-tl-[4px] bg-white px-3 py-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
        <p className="text-[10.5px] font-medium text-slate">{f.from}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-ink">{f.msg}</p>
      </div>
      <ol className="mt-3 grid gap-1.5">
        {f.steps.map((s, i) => (
          <li
            key={s}
            className="concept-step flex items-center gap-2 rounded-[10px] bg-white/70 px-2.5 py-1.5 text-[12px] text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.04)]"
            style={{ animationDelay: `${0.6 + i * 0.9}s` }}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E4F4E8] text-[#2E7A48]">
              <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- B: tactile 3D objects ---------- */
function Tactile3D({ t }) {
  const Icon = EVENT_ICONS[t.chip.icon];
  return (
    <div className="canvas relative aspect-[4/3] overflow-hidden bg-[#F4EEE4]">
      <img src={IMAGES[t.key]} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-[16px] bg-white/75 px-3 py-2.5 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] backdrop-blur-md xs:inset-x-4 xs:bottom-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-ink text-white">
          {Icon ? <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} aria-hidden="true" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-medium text-slate">{t.agent}</span>
          <span className="block truncate text-[13px] font-medium leading-tight text-ink">{t.chip.title}</span>
        </span>
        <span className="shrink-0 text-[11.5px] text-graphite">{t.chip.detail}</span>
      </div>
    </div>
  );
}

/* ---------- C: Aurora at the centre ---------- */
function Orbit({ t }) {
  const o = ORBITS[t.key];
  const chip = 'rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] whitespace-nowrap';
  return (
    <div className="canvas relative aspect-[4/3] overflow-hidden bg-[#0A0F0E] p-4 xs:p-5">
      <div aria-hidden="true" className="concept-glow absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.55),rgba(255,200,87,0.18)_55%,rgba(10,15,14,0))]" />
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {[60, 150, 240].map((y) => (
          <path key={'i' + y} d={`M70 ${y} C 140 ${y}, 160 150, 200 150`} className="concept-beam" fill="none" stroke="rgba(255,200,87,0.55)" strokeWidth="1.2" />
        ))}
        {[60, 150, 240].map((y, i) => (
          <path key={'o' + y} d={`M200 150 C 240 150, 260 ${y}, 330 ${y}`} className="concept-beam" style={{ animationDelay: `${1.2 + i * 0.3}s` }} fill="none" stroke="rgba(242,92,42,0.7)" strokeWidth="1.2" />
        ))}
      </svg>
      <div className="relative flex h-full items-center justify-between">
        <ul className="grid h-[80%] content-between">
          {o.in.map((c) => (
            <li key={c} className={chip}>{c}</li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-2">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF6E5] shadow-[0_0_0_6px_rgba(255,200,87,0.18),0_0_40px_rgba(242,92,42,0.6)]">
            <span className="h-7 w-7 rounded-full bg-[#F25C2A]" />
          </span>
          <span className="text-[11px] font-medium text-white/80">{t.agent}</span>
        </div>
        <ul className="grid h-[80%] content-between justify-items-end">
          {o.out.map((c) => (
            <li key={c} className={chip}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const CONCEPTS = [
  { key: 'a', name: 'Concept A · The agent at work', note: 'Each card shows the agent doing one real task, step by step. Built in code, so it stays sharp and light.', Visual: AgentAtWork },
  { key: 'b', name: 'Concept B · Tactile 3D objects', note: 'One calm 3D object per team in the Aurora palette, with the live status chip on top. Images made with Higgsfield.', Visual: Tactile3D },
  { key: 'c', name: 'Concept C · Aurora at the centre', note: 'Dark cards: requests flow in from the channels, through the agent, out to the team’s systems. Built in code.', Visual: Orbit },
];

export default function TeamsConcepts() {
  return (
    <>
      {CONCEPTS.map(({ key, name, note, Visual }) => (
        <section key={key} id={`teams-${key}`} data-nav-theme="light" aria-labelledby={`teams-${key}-title`} className="section relative border-t border-dashed border-ink/15">
          <div className="shell">
            <p className="mb-8 w-fit rounded-full bg-[#F25C2A] px-3 py-1 text-[12px] font-medium text-white">{name}</p>
            <p className="-mt-5 mb-8 max-w-[40em] text-[13px] text-slate">{note}</p>
            <SectionHeader id={`teams-${key}-title`} titleA={teams.titleA} titleB={teams.titleB} layout="split" />
            <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-3 lg:gap-6 xl:gap-8">
              {teams.items.map((t, i) => (
                <Reveal key={t.key} delay={i * 0.08} y={28} className="flex flex-col">
                  <Visual t={t} />
                  <TeamText t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
