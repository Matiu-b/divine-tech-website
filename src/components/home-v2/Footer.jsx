import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { brand, footer, nav } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import { openConsentSettings } from '@/lib/consent';
import Logo from './primitives/Logo';
import SmartLink from './primitives/SmartLink';
import { useLead } from './LeadDrawer';
import { scrollToHash } from './hooks';

export default function Footer() {
  const { open } = useLead();
  useLocation(); // re-render on navigation so SmartLink picks the right behaviour
  const sections = nav.filter((l) => !l.children);
  const linkClass = 'text-[14px] text-white/75 transition-colors hover:text-white';
  return (
    <footer data-nav-theme="dark" className="on-dark relative bg-ink text-white">
      <div className="shell">
        <div className="hairline" />
        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-4">
            <Logo tone="light" height={30} />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-white/55">{footer.tagline}</p>
            <button type="button" onClick={open} className="btn btn-light btn-sm mt-8">
              <span>Book a demo</span>
            </button>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4 md:col-start-6">
            <div>
              <p className="text-[12px] font-medium text-white/40">Explore</p>
              <ul className="mt-4 grid gap-2.5">
                {sections.map((l) => (
                  <li key={l.href}>
                    <SmartLink href={l.href} className={linkClass}>
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/40">Industries</p>
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
            <p className="text-[12px] font-medium text-white/40">Contact</p>
            <address className="mt-4 grid gap-2.5 text-[14px] not-italic text-white/75">
              <a href={'mailto:' + brand.email} className="w-fit transition-colors hover:text-white">
                {brand.email}
              </a>
              {brand.phones.map((p) => (
                <a key={p.tel} href={'tel:' + p.tel} className="w-fit transition-colors hover:text-white">
                  {p.display} <span className="text-white/40">({p.label})</span>
                </a>
              ))}
              <span className="text-white/55">{brand.address}</span>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.company}. All rights reserved.
          </p>
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
