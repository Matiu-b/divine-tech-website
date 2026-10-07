import React from 'react';
import { ArrowUp } from 'lucide-react';
import { brand, footer, nav } from '@/data/site';
import Logo from './primitives/Logo';
import { useLead } from './LeadDrawer';
import { onAnchorClick } from './hooks';

export default function Footer() {
  const { open } = useLead();
  return (
    <footer data-nav-theme="dark" className="on-dark relative bg-ink text-white">
      <div className="shell">
        <div className="hairline" />
        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-5">
            <Logo tone="light" height={36} />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-white/55">{footer.tagline}</p>
            <button type="button" onClick={open} className="btn btn-light btn-sm mt-8">
              <span>Book a demo</span>
            </button>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="text-[13px] font-medium text-white/40">Explore</p>
            <ul className="mt-4 grid gap-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => onAnchorClick(e, l.href)} className="text-[15px] text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#demo" onClick={(e) => onAnchorClick(e, '#demo')} className="text-[15px] text-white/75 transition-colors hover:text-white">
                  Product demo
                </a>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-[13px] font-medium text-white/40">Contact</p>
            <address className="mt-4 grid gap-2.5 text-[15px] not-italic text-white/75">
              <a href={'mailto:' + brand.email} className="w-fit transition-colors hover:text-white">
                {brand.email}
              </a>
              <a href={'tel:' + brand.phoneTel} className="w-fit transition-colors hover:text-white">
                {brand.phone}
              </a>
              <span className="text-white/55">{brand.address}</span>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.company}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>{brand.domain}</span>
            <a href="#top" onClick={(e) => onAnchorClick(e, '#top')} className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-white">
              Back to top
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
