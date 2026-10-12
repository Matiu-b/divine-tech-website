import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { brand } from '@/data/site';
import { industries, industryBySlug, industryPath } from '@/data/industries';
import SiteLayout from '@/components/home-v2/SiteLayout';
import FinalCTA from '@/components/home-v2/FinalCTA';
import Faq from '@/components/home-v2/Faq';
import PhotoStage from '@/components/home-v2/PhotoStage';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import SafeBoundary from '@/components/home-v2/primitives/SafeBoundary';
import SectionHeader from '@/components/home-v2/primitives/SectionHeader';
import SmartLink from '@/components/home-v2/primitives/SmartLink';
import { Reveal, RevealGroup, RevealItem, RevealLines } from '@/components/home-v2/primitives/MotionReveal';
import { useLead } from '@/components/home-v2/LeadDrawer';
import { onAnchorClick } from '@/components/home-v2/hooks';
import { EASE } from '@/components/home-v2/motion';

/** @param {any} props */
function IndustryHero({ it }) {
  const { open } = useLead();
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: EASE } };
  const slide = (delay) => (reduce ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.9, delay, ease: EASE } });
  const fade = (delay) => (reduce ? undefined : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay, ease: EASE } });

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="ind-hero-title" className="relative overflow-hidden pb-[clamp(64px,8vw,112px)] pt-[calc(var(--nav-h)+44px)] md:pt-[calc(var(--nav-h)+64px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_78%_0%,rgba(220,236,226,0.9),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <motion.p className="eyebrow" {...rise(0)}>
          {it.hero.eyebrow}
        </motion.p>
        <h1 id="ind-hero-title" className="t-display balance mt-5 max-w-[20ch] md:mt-7">
          <RevealLines lines={[it.hero.titleA, it.hero.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
        </h1>
        <div className="mt-7 grid gap-7 md:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <motion.p className="t-lead pretty max-w-[56ch] lg:col-span-7" {...rise(0.3)}>
            {it.hero.text}
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-2.5 sm:gap-3 lg:col-span-5 lg:justify-end" {...slide(0.42)}>
            <CTAButton size="lg" onClick={open} motionProps={fade(0.42)} className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              Book a demo
            </CTAButton>
            <CTAButton
              size="lg"
              variant="glass"
              href="#how"
              arrow={false}
              onClick={(e) => onAnchorClick(e, '#how')}
              motionProps={fade(0.48)}
              className="max-sm:h-12 max-sm:px-5 max-sm:text-[15px]"
            >
              How it works
            </CTAButton>
          </motion.div>
        </div>
      </div>
      <div className="shell relative mt-10 md:mt-12">
        <SafeBoundary>
          <PhotoStage photo={it.how.photo} events={it.events} caption={it.caption} />
        </SafeBoundary>
      </div>
    </section>
  );
}

/** The problem and what it costs (StoryBrand: problem + failure). */
function Problem({ it }) {
  return (
    <section data-nav-theme="dark" aria-labelledby="ind-problem-title" className="on-dark section relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_0%,rgba(60,224,154,0.12),rgba(60,224,154,0)_70%)]" />
      <div className="shell relative">
        <SectionHeader id="ind-problem-title" eyebrow="The problem" titleA={it.problem.titleA} titleB={it.problem.titleB} dark size="t-h1" />
        <RevealGroup className="mt-14 grid gap-x-10 md:mt-20 md:grid-cols-3" amount={0.15}>
          {it.problem.points.map(([title, text], i) => (
            <RevealItem key={title} className="border-t border-white/15 py-7 md:py-9">
              <p className="text-[12px] font-medium tabular-nums text-white/40">{'0' + (i + 1)}</p>
              <h3 className="t-h4 mt-4 text-white">{title}</h3>
              <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-white/60">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10 md:mt-14">
          <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center md:gap-8 md:p-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-brand-glow">The cost</p>
            <p className="t-h3 text-white">{it.problem.cost}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** How Aurora joins the process (StoryBrand: the plan). */
function How({ it }) {
  return (
    <section id="how" data-nav-theme="light" aria-labelledby="ind-how-title" className="section relative">
      <div className="shell">
        <SectionHeader id="ind-how-title" eyebrow={'How ' + brand.product + ' works'} titleA={it.how.titleA} titleB={it.how.titleB} layout="split" />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4" amount={0.15}>
          {it.how.steps.map(([title, text], i) => (
            <RevealItem key={title} className="flex flex-col rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-7">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-medium tabular-nums text-white">{i + 1}</span>
              <h3 className="t-h4 mt-6">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-graphite">{text}</p>
              <p className="mt-auto flex items-center gap-2 pt-6 text-[12px] font-medium text-ink">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {it.how.chips[i] || it.how.chips[it.how.chips.length - 1]}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** Where people stay in control, and what changes (StoryBrand: agreement plan + success). */
function ControlAndValue({ it }) {
  return (
    <section data-nav-theme="light" aria-labelledby="ind-value-title" className="section relative pt-0">
      <div className="shell grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="flex h-full flex-col rounded-[28px] bg-ink p-7 text-white md:p-9">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.08]">
              <ShieldCheck className="h-5 w-5 text-brand-glow" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h2 className="t-h3 mt-8 text-white">{it.control.title}</h2>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-white/65">{it.control.text}</p>
            <ul className="mt-8 grid gap-2 text-[13px] text-white/75">
              {['Approvals on what matters', 'Permissions per role and channel', 'Every action on record'].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check className="h-3.5 w-3.5 text-brand-glow" strokeWidth={2.4} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="h-full rounded-[28px] bg-white p-7 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-9">
            <p className="eyebrow">What changes</p>
            <h2 id="ind-value-title" className="t-h3 balance mt-5">
              {it.success}
            </h2>
            <dl className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {it.value.map(([k, v]) => (
                <div key={k} className="border-t border-ink/[0.08] py-5">
                  <dt className="text-[13px] font-medium text-ink">{k}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-graphite">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Going live: one line (the full four-step story is on the home page) plus the tools Aurora works in. */
function GoLive({ it }) {
  return (
    <section data-nav-theme="light" aria-labelledby="ind-live-title" className="relative pb-[var(--section-y)]">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:flex-row md:items-center md:justify-between md:gap-10 md:p-8">
            <div>
              <h2 id="ind-live-title" className="t-h3">
                Live in hours.
              </h2>
              <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-graphite">
                Our experts and AI agents map your business with you and build an action plan for {brand.product}. Then it sets itself up, connects and is tested. You only approve.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {it.systems.map((s) => (
                  <li key={s} className="rounded-full border border-ink/10 px-3 py-1 text-[12px] text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <SmartLink href="/#how-it-works" className="flex shrink-0 items-center gap-1.5 text-[13.5px] font-medium text-ink hover:underline">
              See how setup works
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </SmartLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OtherIndustries({ it }) {
  const others = industries.filter((o) => o.slug !== it.slug);
  return (
    <section data-nav-theme="light" aria-label="Other industries" className="relative pb-[var(--section-y)]">
      <div className="shell">
        <p className="text-[13px] font-medium text-slate">Aurora in other industries</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {others.map((o) => (
            <SmartLink
              key={o.slug}
              href={industryPath(o.slug)}
              className="group flex items-center justify-between gap-6 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] transition-shadow hover:shadow-[0_0_0_1px_rgba(10,15,14,0.12)] md:p-7"
            >
              <span>
                <span className="t-h4 block">{o.label}</span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-graphite">{o.short}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.7} aria-hidden="true" />
            </SmartLink>
          ))}
        </div>
        <SmartLink href="/" className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-graphite hover:text-ink">
          {'See everything ' + brand.product + ' does'}
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </SmartLink>
      </div>
    </section>
  );
}

export default function IndustryPage() {
  const { slug } = useParams();
  const it = industryBySlug[slug];
  if (!it) return <Navigate to="/" replace />;
  return (
    <SiteLayout key={it.slug} industry={it.leadIndustry} meta={it.meta}>
      <IndustryHero it={it} />
      <Problem it={it} />
      <How it={it} />
      <ControlAndValue it={it} />
      <GoLive it={it} />
      <Faq id="ind-faq-title" items={it.faq} className="pt-0" />
      <OtherIndustries it={it} />
      <FinalCTA industry={it.leadIndustry} />
    </SiteLayout>
  );
}
