import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { brand, footer, footerLinks } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import { openConsentSettings } from '@/lib/consent';
import Logo from './primitives/Logo';
import SmartLink from './primitives/SmartLink';
import { scrollToHash } from './hooks';
import SocialLinks from './SocialLinks';

export default function Footer() {
  useLocation(); // re-render on navigation so SmartLink picks the right behaviour
  const linkClass = 'text-[14px] text-white/75 transition-colors hover:text-white';
  return (
    <footer data-nav-theme="dark" className="on-dark relative overflow-hidden bg-ink text-white">
      {/* Aurora dawn light rising from the bottom edge, as in the platform glass core */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px] bg-[radial-gradient(60%_55%_at_82%_118%,rgba(242,92,42,0.4),rgba(242,92,42,0)_70%),radial-gradient(30%_45%_at_58%_125%,rgba(255,159,69,0.22),rgba(255,159,69,0)_70%),radial-gradient(26%_40%_at_96%_100%,rgba(255,200,87,0.16),rgba(255,200,87,0)_70%)]" />
      <div className="shell relative">
        <div className="hairline" />
        <div className="grid gap-12 py-14 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-4">
            <Logo tone="light" height={30} />
            <p className="mt-6 max-w-[32.15em] text-[15px] leading-relaxed text-white/55">{footer.tagline}</p>
            <SocialLinks className="mt-7" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4 md:col-start-6">
            <div>
              <p className="text-[12px] font-medium text-white/55">Explore</p>
              <ul className="mt-4 grid gap-2.5">
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <SmartLink href={l.href} className={linkClass}>
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/55">Industries</p>
              <ul className="mt-4 grid gap-2.5">
                {industries.map((i) => (
                  <li key={i.slug}>
                    <SmartLink href={industryPath(i.slug)} className={linkClass}>
                      {i.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="md:col-span-3 md:col-start-10">
            <p className="text-[12px] font-medium text-white/55">Contact</p>
            <address className="mt-4 grid gap-2.5 text-[14px] not-italic text-white/75">
              <a href={'mailto:' + brand.email} className="w-fit transition-colors hover:text-white">
                {brand.email}
              </a>
              {brand.phones.map((p) => (
                <a key={p.tel} href={'tel:' + p.tel} className="w-fit transition-colors hover:text-white">
                  {p.display} <span className="text-white/55">({p.label})</span>
                </a>
              ))}
              <span className="text-white/55">{brand.address}</span>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          {/* The prerendered HTML carries the build year; the browser's year wins without a hydration error. */}
          <p suppressHydrationWarning>{`© ${new Date().getFullYear()} ${brand.company}. All rights reserved.`}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/privacy" className="text-white/60 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <button type="button" onClick={openConsentSettings} className="text-white/60 transition-colors hover:text-white">
              Cookie settings
            </button>
            <button type="button" onClick={() => scrollToHash('#top')} className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-white">
              Back to top
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
