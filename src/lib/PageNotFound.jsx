import React from 'react';
import SiteLayout from '@/components/home-v2/SiteLayout';
import SmartLink from '@/components/home-v2/primitives/SmartLink';

const meta = { title: 'Page not found · Divine Tech AI', description: 'This page does not exist on divine-tech.ai.' };

// Shown for any path the router does not know. Netlify serves it from 404.html with a real 404 status.
export default function PageNotFound() {
  return (
    <SiteLayout meta={meta}>
      <section data-nav-theme="light" className="section">
        <div className="shell max-w-[720px] pt-16 md:pt-24">
          <p className="eyebrow">404</p>
          <h1 className="t-h2 mt-4">This page does not exist.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-graphite">The link may be old or mistyped. These pages are a good place to start:</p>
          <ul className="mt-8 grid gap-3 text-[15px]">
            {[
              ['/', 'Home'],
              ['/platform', 'The Aurora platform'],
              ['/blog', 'Blog'],
            ].map(([href, label]) => (
              <li key={href}>
                <SmartLink href={href} className="font-medium text-ink underline underline-offset-4 hover:no-underline">
                  {label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
