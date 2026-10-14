import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ScrollText, ShieldCheck, UserCheck } from 'lucide-react';
import { brand } from '@/data/site';
import { industries, industryBySlug, industryPath } from '@/data/industries';
import { posts, postPath, readMinutes } from '@/data/blog';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
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
import { RxHero, RxRace, RxRules } from '@/components/industry/RealEstateV3';

/** @param {any} props */
function IndustryHero({ it }) {
  const { open } = useLead();
  // Entrances are CSS animations (.intro-* in index.css), so they run on the prerendered HTML's first paint.

  return (
    <section id="top" data-nav-theme="light" aria-labelledby="ind-hero-title" className="relative overflow-hidden pb-[clamp(64px,8vw,112px)] pt-[calc(var(--nav-h)+44px)] md:pt-[calc(var(--nav-h)+64px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(55%_55%_at_82%_0%,rgba(255,214,170,0.75),rgba(246,245,241,0)_70%),radial-gradient(40%_50%_at_10%_10%,rgba(240,232,218,0.7),rgba(246,245,241,0)_70%)]" />
      <div className="shell relative">
        <p className="intro-rise eyebrow">{it.hero.eyebrow}</p>
        <h1 id="ind-hero-title" className="t-display balance mt-5 max-w-[18.18em] md:mt-7">
          <RevealLines lines={[it.hero.titleA, it.hero.titleB]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
        </h1>
        <div className="mt-7 grid gap-7 md:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <p className="intro-slide t-lead pretty max-w-[50.01em] lg:col-span-7" style={{ animationDelay: '0.3s' }}>
            {it.hero.text}
          </p>
          <div className="intro-slide flex flex-wrap items-center gap-2.5 sm:gap-3 lg:col-span-5 lg:justify-end" style={{ animationDelay: '0.42s' }}>
            <CTAButton size="lg" onClick={open} style={{ animationDelay: '0.42s' }} className="intro-fade max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
              Book a demo
            </CTAButton>
            <CTAButton
              size="lg"
              variant="glass"
              href="#how"
              arrow={false}
              onClick={(e) => onAnchorClick(e, '#how')}
              style={{ animationDelay: '0.48s' }}
              className="intro-fade max-sm:h-12 max-sm:px-5 max-sm:text-[15px]"
            >
              How it works
            </CTAButton>
          </div>
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

/** The problem and what it costs (StoryBrand: problem + failure). Compact rows on phones. */
function Problem({ it }) {
  return (
    <section data-nav-theme="dark" aria-labelledby="ind-problem-title" className="on-dark section relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_88%_0%,rgba(242,92,42,0.2),rgba(242,92,42,0)_70%),radial-gradient(35%_45%_at_70%_8%,rgba(255,200,87,0.1),rgba(255,200,87,0)_70%)]" />
      <div className="shell relative">
        <SectionHeader id="ind-problem-title" eyebrow="The problem" titleA={it.problem.titleA} titleB={it.problem.titleB} dark size="t-h1" />
        <RevealGroup className="mt-10 grid gap-x-10 md:mt-20 md:grid-cols-3" amount={0.15}>
          {it.problem.points.map(([title, text], i) => (
            <RevealItem key={title} className="grid grid-cols-[28px_1fr] gap-x-3 border-t border-white/15 py-5 md:block md:py-9">
              <p className="pt-1 text-[12px] font-medium tabular-nums text-white/40">{'0' + (i + 1)}</p>
              <div>
                <h3 className="text-[16px] font-medium text-white md:t-h4 md:mt-4">{title}</h3>
                <p className="mt-1.5 max-w-[30.36em] text-[13.5px] leading-relaxed text-white/60 md:mt-2 md:text-[14px]">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-6 md:mt-14">
          <LiquidGlass tone="dark" className="flex flex-col gap-2 rounded-[24px] p-5 md:flex-row md:items-center md:gap-8 md:p-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#FF9F45]">The cost</p>
            <p className="text-[19px] font-medium leading-snug tracking-[-0.01em] text-white md:t-h3">{it.problem.cost}</p>
          </LiquidGlass>
        </Reveal>
      </div>
    </section>
  );
}

/** How Aurora joins the process (StoryBrand: the plan). A vertical timeline on phones, four columns on desktop. */
function How({ it }) {
  return (
    <section id="how" data-nav-theme="light" aria-labelledby="ind-how-title" className="section relative">
      <div className="shell">
        <SectionHeader id="ind-how-title" eyebrow={'How ' + brand.product + ' works'} titleA={it.how.titleA} titleB={it.how.titleB} layout="split" />
        <RevealGroup as="ol" className="relative mt-10 grid md:mt-16 lg:grid-cols-4 lg:gap-5" amount={0.15}>
          {/* the thread that joins the steps */}
          <span aria-hidden="true" className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-ink/15 via-ink/15 to-transparent lg:hidden" />
          <span aria-hidden="true" className="absolute left-6 right-6 top-[15px] hidden h-px bg-ink/10 lg:block" />
          {it.how.steps.map(([title, text], i) => (
            <RevealItem key={title} as="li" className="relative grid grid-cols-[32px_1fr] gap-x-4 pb-7 last:pb-0 lg:block lg:pb-0">
              <span className="relative z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-medium tabular-nums text-white ring-4 ring-paper">{i + 1}</span>
              <div className="lg:mt-6 lg:rounded-[24px] lg:bg-white lg:p-6 lg:shadow-[0_0_0_1px_rgba(10,15,14,0.06)]">
                <h3 className="pt-1 text-[16px] font-medium lg:pt-0 lg:t-h4">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-graphite lg:mt-2 lg:text-[14px]">{text}</p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-[12px] bg-white px-3 py-2 text-[12px] font-medium text-ink shadow-[0_0_0_1px_rgba(10,15,14,0.07)] lg:mt-5 lg:bg-paper">
                  <Check className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.4} aria-hidden="true" />
                  {it.how.chips[i] || it.how.chips[it.how.chips.length - 1]}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const CONTROLS = [
  { icon: ShieldCheck, label: 'Policies' },
  { icon: UserCheck, label: 'Approvals' },
  { icon: ScrollText, label: 'Audit log' },
];

/** Where people stay in control (Aurora glass over its dawn light), and what changes. */
function ControlAndValue({ it }) {
  return (
    <section data-nav-theme="light" aria-labelledby="ind-value-title" className="section relative pt-0">
      <div className="shell grid gap-5 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-5">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-4">
            <div className="absolute left-[4%] top-[2%] h-[55%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.6),rgba(242,92,42,0))] blur-2xl" />
            <div className="absolute bottom-[4%] right-0 h-[50%] w-[72%] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.75),rgba(255,200,87,0))] blur-2xl" />
            <div className="absolute left-[20%] top-[40%] h-[36%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,69,0.6),rgba(255,159,69,0))] blur-2xl" />
          </div>
          <LiquidGlass
            className="relative flex h-full flex-col rounded-[28px] p-6 md:p-8"
            style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.2)', '--lg-sheen': 'rgba(255,240,215,0.7)' }}
          >
            <img src="/brand/aurora-logo-horizontal-color.svg" alt={brand.product} width="124" height="32" className="h-7 w-auto self-start" />
            <h2 className="mt-6 text-[20px] font-medium leading-snug tracking-[-0.015em] text-ink md:t-h3 md:mt-8">{it.control.title}</h2>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">{it.control.text}</p>
            <ul className="mt-6 grid grid-cols-3 gap-2 border-t border-ink/10 pt-5">
              {CONTROLS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 text-center text-[12px] font-medium text-ink/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white/70 ring-1 ring-white">
                    <Icon className="h-4 w-4 text-[#F25C2A]" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </LiquidGlass>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="h-full rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-9">
            <p className="eyebrow">What changes</p>
            <h2 id="ind-value-title" className="mt-4 text-balance text-[20px] font-medium leading-snug tracking-[-0.015em] md:t-h3 md:mt-5">
              {it.success}
            </h2>
            <dl className="mt-6 grid grid-cols-2 gap-x-5 md:mt-8 md:gap-x-8">
              {it.value.map(([k, v]) => (
                <div key={k} className="border-t border-ink/[0.08] py-4 md:py-5">
                  <dt className="text-[13px] font-medium text-ink">{k}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-graphite md:text-[14px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Going live: one line (the full story is on the home page), the tools Aurora works in, and the industry guide. */
function GoLive({ it }) {
  const post = it.article ? posts.find((p) => p.slug === it.article) : null;
  return (
    <section data-nav-theme="light" aria-labelledby="ind-live-title" className="relative pb-[var(--section-y)]">
      <div className="shell grid gap-5 lg:grid-cols-12">
        <Reveal className={post ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="flex h-full flex-col gap-6 rounded-[28px] bg-white p-6 shadow-[0_0_0_1px_rgba(10,15,14,0.06)] md:p-8">
            <div>
              <h2 id="ind-live-title" className="t-h3">
                Live in hours.
              </h2>
              <p className="mt-2 max-w-[46.44em] text-[14px] leading-relaxed text-graphite">
                Our experts and AI agents map your business with you and build an action plan for {brand.product}. Then it sets itself up, connects and is tested. You only approve.
              </p>
              <p className="mt-5 text-[12px] font-medium text-slate">Works with</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {it.systems.map((s) => (
                  <li key={s} className="rounded-[10px] bg-paper px-2.5 py-1.5 text-[12px] text-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <SmartLink href="/#how-it-works" className="mt-auto flex w-fit items-center gap-1.5 text-[13.5px] font-medium text-ink hover:underline">
              See how setup works
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </SmartLink>
          </div>
        </Reveal>
        {post ? (
          <Reveal delay={0.08} className="lg:col-span-5">
            <SmartLink href={postPath(post.slug)} className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_rgba(10,15,14,0.06)] transition-shadow hover:shadow-[0_0_0_1px_rgba(10,15,14,0.12)]">
              <img src={`${post.image.base}-800.webp`} alt="" width="800" height="450" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[12px] font-medium text-slate">From the blog · {readMinutes(post.bodyHtml)} min read</p>
                <p className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.01em] text-ink">{post.title}</p>
                <span className="mt-4 flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
                  Read the guide
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden="true" />
                </span>
              </div>
            </SmartLink>
          </Reveal>
        ) : null}
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
  if (it.v3) {
    return (
      <SiteLayout key={it.slug} industry={it.leadIndustry} meta={it.meta}>
        <RxHero it={it} />
        <RxRace it={it} />
        <RxRules it={it} />
        <Faq id="ind-faq-title" items={it.faq} className="pt-0" />
        <OtherIndustries it={it} />
        <FinalCTA industry={it.leadIndustry} />
      </SiteLayout>
    );
  }
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
