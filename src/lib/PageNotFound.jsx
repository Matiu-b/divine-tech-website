import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import SiteLayout from '@/components/home-v2/SiteLayout';
import SmartLink from '@/components/home-v2/primitives/SmartLink';
import LiquidGlass from '@/components/home-v2/primitives/LiquidGlass';
import { industries, industryPath } from '@/data/industries';

const meta = { title: 'Page not found · Divine Tech AI', description: 'This page does not exist on divine-tech.ai.' };

const LINKS = [
  ['/', 'Home', 'What Aurora is and how it works'],
  ['/platform', 'Platform', 'Watch one request go from message to done'],
  ...industries.map((i) => [industryPath(i.slug), i.label, i.short]),
  ['/blog', 'Blog', 'Guides on running a business with AI agents'],
];

// Shown for any path the router does not know. Netlify serves it from 404.html with a real 404 status.
export default function PageNotFound() {
  return (
    <SiteLayout meta={meta}>
      <section data-nav-theme="light" className="relative overflow-hidden pb-[var(--section-y)] pt-[calc(var(--nav-h)+48px)] md:pt-[calc(var(--nav-h)+80px)]">
        {/* warm dawn light behind the glass, as on the platform core */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-[6%] h-[460px] w-[620px] max-w-[120vw] rounded-full bg-[radial-gradient(closest-side,rgba(242,92,42,0.45),rgba(242,92,42,0))] blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[18%] top-[30%] h-[380px] w-[520px] max-w-[100vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,200,87,0.55),rgba(255,200,87,0))] blur-2xl" />
        <div className="shell relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="text-[13px] font-medium text-slate">Error 404</p>
            <h1 className="t-display mt-4">This page took a day off.</h1>
            <p className="t-lead mt-6 max-w-[44ch] text-graphite">The link may be old or mistyped. Aurora would have routed it, but here are the best places to pick up from.</p>
          </div>
          <LiquidGlass
            className="rounded-[28px] p-2 lg:col-span-6"
            style={{ '--lg-tint-a': 'rgba(255,250,242,0.55)', '--lg-tint-b': 'rgba(255,246,229,0.2)', '--lg-sheen': 'rgba(255,240,215,0.7)' }}
          >
            <ul className="grid">
              {LINKS.map(([href, label, detail], i) => (
                <li key={href} className={i ? 'border-t border-ink/[0.07]' : ''}>
                  <SmartLink href={href} className="group flex items-center gap-4 rounded-[20px] px-4 py-3.5 transition-colors hover:bg-white/60 md:px-5">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-ink">{label}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-graphite">{detail}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.8} aria-hidden="true" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </LiquidGlass>
        </div>
      </section>
    </SiteLayout>
  );
}
