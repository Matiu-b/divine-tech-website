import React from 'react';
import { useParams } from 'react-router-dom';
import SiteLayout from '@/components/home-v2/SiteLayout';
import CTAButton from '@/components/home-v2/primitives/CTAButton';
import { useLead } from '@/components/home-v2/LeadDrawer';
import PageNotFound from '@/lib/PageNotFound';
import { guides } from '@/data/guides';
import { trackGuideDownload } from '@/lib/tracking';

function DemoButton() {
  const { open } = useLead();
  return (
    <CTAButton variant="quiet" size="lg" onClick={() => open()}>
      Book a demo
    </CTAButton>
  );
}

export default function GuidePage() {
  const { slug } = useParams();
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return <PageNotFound />;
  return (
    <SiteLayout meta={guide.meta}>
      <section aria-labelledby="guide-title" className="pb-[clamp(72px,9vw,128px)] pt-[calc(var(--nav-h)+40px)] md:pt-[calc(var(--nav-h)+72px)]">
        <div className="shell grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-slate">{guide.eyebrow}</p>
            <h1 id="guide-title" className="t-h1 mt-4 text-balance">
              {guide.title}
            </h1>
            <p className="t-lead mt-5 max-w-[34em]">{guide.dek}</p>
            <ul className="mt-8 grid gap-3 text-[15px]">
              {guide.highlights.map((h) => (
                <li key={h} className="relative pl-6">
                  <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-2 w-2 rounded-full bg-[#F25C2A]" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CTAButton variant="primary" size="lg" href={guide.pdf} download onClick={() => trackGuideDownload(guide.slug)}>
                Download the PDF
              </CTAButton>
              <DemoButton />
            </div>
          </div>
          <aside aria-label="What's inside" className="rounded-[20px] border border-ink/10 bg-white p-8 shadow-[0_30px_80px_rgba(10,15,14,0.12)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-slate">Inside</p>
            <ol className="mt-5 grid list-decimal gap-2.5 pl-5 text-[15px]">
              {guide.inside.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-7 rounded-[14px] border border-[#FF9F45] bg-[#FFF6E5] p-4 text-[14px] leading-relaxed">{guide.auroraNote}</p>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
