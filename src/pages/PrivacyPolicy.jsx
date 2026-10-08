import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LeadProvider } from '@/components/home-v2/LeadDrawer';
import SafeBoundary from '@/components/home-v2/primitives/SafeBoundary';
import Logo from '@/components/home-v2/primitives/Logo';
import Footer from '@/components/home-v2/Footer';
import { openConsentSettings } from '@/lib/consent';
import { brand, legal } from '@/data/site';

const UPDATED = 'October 8, 2026';

/** @param {any} props */
function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ink/10 pt-10">
      <h2 className="text-[22px] font-medium tracking-[-0.015em] text-ink sm:text-[24px]">{title}</h2>
      <div className="legal-body mt-4">{children}</div>
    </section>
  );
}

const TOC = [
  ['who-we-are', 'Who we are'],
  ['what-we-collect', 'Information we collect'],
  ['how-we-use', 'How we use information'],
  ['legal-bases', 'Legal bases'],
  ['cookies', 'Cookies and similar technologies'],
  ['sharing', 'Who we share information with'],
  ['transfers', 'International transfers'],
  ['retention', 'How long we keep information'],
  ['security', 'Security'],
  ['your-rights', 'Your rights and choices'],
  ['children', 'Children'],
  ['changes', 'Changes to this policy'],
  ['contact', 'Contact us'],
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Privacy Policy · Divine Tech AI';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <LeadProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="min-h-screen bg-paper text-ink">
        <header className="shell flex items-center justify-between py-6">
          <a href="/" aria-label={brand.company + ' home'}>
            <Logo tone="dark" height={30} />
          </a>
          <a href="/" className="flex items-center gap-1.5 text-[14px] text-graphite transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Back to site
          </a>
        </header>

        <main id="main" className="shell pb-24 pt-10 sm:pt-16">
          <div className="mx-auto max-w-[760px]">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-4 text-[40px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[56px]">Privacy Policy</h1>
            <p className="mt-4 text-[15px] text-slate">Last updated: {UPDATED}</p>

            <div className="legal-body mt-8">
              <p>
                This policy explains how {legal.entity} ("{brand.company}", "we", "us") collects, uses and protects
                personal information when you visit {brand.domain} (the "Site") or contact us through it. It covers
                the Site only. Our products, including {brand.product}, are governed by the agreements and privacy
                terms we sign with each customer.
              </p>
            </div>

            <nav aria-label="On this page" className="mt-10 rounded-[22px] bg-paper-2 p-6">
              <p className="text-[13px] font-medium text-slate">On this page</p>
              <ol className="mt-3 grid gap-1.5 text-[15px] sm:grid-cols-2">
                {TOC.map(([id, label], i) => (
                  <li key={id}>
                    <a href={'#' + id} className="text-graphite underline-offset-4 hover:text-ink hover:underline">
                      {i + 1}. {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 grid gap-12">
              <Section id="who-we-are" title="1. Who we are">
                <p>
                  The Site is operated by {legal.entity}, {legal.address}. We are responsible for the personal
                  information collected through the Site. Our affiliated company in Israel may help us handle
                  inquiries and operate the Site, under this policy.
                </p>
                <p>
                  Questions about this policy can be sent to <a href={'mailto:' + brand.email}>{brand.email}</a> or by
                  phone to <a href={'tel:' + legal.phoneTel}>{legal.phone}</a>.
                </p>
              </Section>

              <Section id="what-we-collect" title="2. Information we collect">
                <p>
                  <strong>Information you give us.</strong> When you request a demo or contact us, we collect what you
                  enter in the form: your name, company, work email, phone number (optional), industry and your message.
                  We also record the page you sent it from. If you email or call us, we keep that correspondence.
                </p>
                <p>
                  <strong>Information collected automatically.</strong> When you visit the Site, our hosting provider and,
                  if you allow them, analytics and advertising tools collect technical information such as your IP
                  address, browser and device type, pages viewed, the site or ad that referred you, approximate location
                  (city or country level) and the date and time of your visit. See{' '}
                  <a href="#cookies">Cookies and similar technologies</a>.
                </p>
                <p>
                  <strong>Information from advertising platforms.</strong> If you reach the Site from one of our ads,
                  we receive reports from the advertising platform (for example Google Ads) about clicks and
                  conversions. These reports are aggregated and do not identify you to us.
                </p>
                <p>We do not ask for, and ask you not to send us, sensitive information through the Site.</p>
              </Section>

              <Section id="how-we-use" title="3. How we use information">
                <ul>
                  <li>To answer your inquiry, schedule and run demos, and follow up about our products.</li>
                  <li>To operate, secure and improve the Site, including detecting spam and abuse of our forms.</li>
                  <li>To understand how visitors use the Site, with analytics you have allowed.</li>
                  <li>
                    To measure and improve our advertising, for example learning which ads lead to demo requests, with
                    advertising cookies you have allowed.
                  </li>
                  <li>To comply with legal obligations and to protect our rights.</li>
                </ul>
                <p>
                  We do not sell your personal information. We may send you occasional updates about {brand.product}{' '}
                  after you contact us; you can unsubscribe at any time using the link in the message or by writing to
                  us.
                </p>
              </Section>

              <Section id="legal-bases" title="4. Legal bases">
                <p>
                  Where the law requires a legal basis (for example the GDPR for visitors in the European Economic Area,
                  the United Kingdom or Switzerland), we rely on: steps you ask us to take before entering into a
                  contract, when you request a demo; our legitimate interests in responding to inquiries, running and
                  securing the Site and promoting our business; your consent, for analytics and advertising cookies;
                  and compliance with legal obligations. You can withdraw consent at any time without affecting earlier
                  processing.
                </p>
              </Section>

              <Section id="cookies" title="5. Cookies and similar technologies">
                <p>
                  Cookies are small files stored on your device. We group them into three categories, and you choose
                  which non-essential categories to allow in our cookie banner. You can change your choice at any time
                  in{' '}
                  <button type="button" onClick={openConsentSettings} className="legal-link">
                    Cookie settings
                  </button>
                  .
                </p>
                <div className="mt-2 overflow-x-auto rounded-[18px] border border-ink/10">
                  <table className="w-full min-w-[560px] text-left text-[14.5px]">
                    <thead className="bg-paper-2 text-[13px] text-slate">
                      <tr>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Examples</th>
                        <th className="px-4 py-3 font-medium">Purpose</th>
                        <th className="px-4 py-3 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10 align-top text-graphite">
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Strictly necessary</td>
                        <td className="px-4 py-3">dt_consent (stored in your browser)</td>
                        <td className="px-4 py-3">Remembers your cookie choices. Always on.</td>
                        <td className="px-4 py-3">Until you change or clear it</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Analytics</td>
                        <td className="px-4 py-3">Google Analytics: _ga, _ga_*</td>
                        <td className="px-4 py-3">Counts visits and shows how the Site is used, so we can improve it.</td>
                        <td className="px-4 py-3">Up to 2 years</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Marketing</td>
                        <td className="px-4 py-3">Google Ads: _gcl_au, _gcl_aw; Google advertising cookies</td>
                        <td className="px-4 py-3">Measures which ads lead to demo requests and helps show relevant ads.</td>
                        <td className="px-4 py-3">Up to 90 days (Google cookies may last longer)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  We load these tools through Google Tag Manager and use Google Consent Mode, so Google's tags respect
                  your choice. If you allow marketing cookies and submit our form, the email address and phone number you
                  entered may be sent to Google in hashed (scrambled) form to help measure our ads ("enhanced
                  conversions"). If you allow analytics, Google signals may associate visits with Google accounts of
                  users who have turned on ad personalization, for aggregated cross-device reporting.
                </p>
                <p>
                  In some regions, including the European Economic Area, the United Kingdom and Switzerland, analytics
                  and marketing cookies stay off unless you turn them on. Elsewhere they are on by default and you can
                  turn them off in the banner or in Cookie settings. You can also block cookies in your browser, and
                  learn more about how Google uses information at{' '}
                  <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
                    policies.google.com/technologies/partner-sites
                  </a>
                  .
                </p>
              </Section>

              <Section id="sharing" title="6. Who we share information with">
                <p>We share personal information only as needed, with:</p>
                <ul>
                  <li>
                    <strong>Service providers</strong> who process it on our behalf: Netlify (website hosting and form
                    handling, including spam filtering), Google (Workspace email, Google Analytics, Google Ads and Google
                    Tag Manager) and other tools we use to manage customer relationships.
                  </li>
                  <li>
                    <strong>Our affiliates</strong>, including our affiliated company in Israel, to respond to you and
                    provide our services.
                  </li>
                  <li>
                    <strong>Authorities or other parties</strong> when required by law or to protect our rights, users
                    or the public.
                  </li>
                  <li>
                    <strong>A buyer or successor</strong> if our business, or part of it, is reorganized, merged or sold.
                  </li>
                </ul>
              </Section>

              <Section id="transfers" title="7. International transfers">
                <p>
                  We operate in the United States and Israel, and our service providers may process information in
                  other countries. When we transfer personal information from the European Economic Area, the United
                  Kingdom or Switzerland, we rely on appropriate safeguards such as adequacy decisions or standard
                  contractual clauses.
                </p>
              </Section>

              <Section id="retention" title="8. How long we keep information">
                <p>
                  We keep inquiry and contact information for as long as needed to respond and follow up, and generally
                  for up to 24 months after our last contact with you, unless you become a customer or the law requires
                  us to keep it longer. Google Analytics data is kept for 14 months. When information is no longer
                  needed, we delete or anonymize it.
                </p>
              </Section>

              <Section id="security" title="9. Security">
                <p>
                  We use reasonable technical and organizational measures to protect personal information, including
                  encrypted connections (HTTPS) and access controls. No method of transmission or storage is completely
                  secure, so we cannot guarantee absolute security.
                </p>
              </Section>

              <Section id="your-rights" title="10. Your rights and choices">
                <p>
                  Depending on where you live, you may have the right to access the personal information we hold about
                  you, ask us to correct or delete it, object to or restrict certain processing, receive a copy of it,
                  and withdraw consent. This includes your rights under the Israeli Protection of Privacy Law, the GDPR
                  and the privacy laws of some US states.
                </p>
                <ul>
                  <li>
                    To make a request, write to <a href={'mailto:' + brand.email}>{brand.email}</a>. We may need to
                    verify your identity, and we will reply within the time the law requires.
                  </li>
                  <li>
                    To stop marketing emails, use the unsubscribe link or tell us. To change cookie choices, use{' '}
                    <button type="button" onClick={openConsentSettings} className="legal-link">
                      Cookie settings
                    </button>
                    .
                  </li>
                  <li>
                    You may also complain to your data protection authority, such as the Israeli Privacy Protection
                    Authority or your local authority in the EEA or the UK.
                  </li>
                </ul>
              </Section>

              <Section id="children" title="11. Children">
                <p>
                  The Site is intended for businesses and is not directed to children. We do not knowingly collect
                  personal information from anyone under 18. If you believe a child has sent us information, contact us
                  and we will delete it.
                </p>
              </Section>

              <Section id="changes" title="12. Changes to this policy">
                <p>
                  We may update this policy from time to time. We will post the new version on this page and update the
                  date at the top. If changes are significant, we will take additional steps to let you know.
                </p>
              </Section>

              <Section id="contact" title="13. Contact us">
                <p>
                  {legal.entity}
                  <br />
                  {legal.address}
                  <br />
                  Email: <a href={'mailto:' + brand.email}>{brand.email}</a>
                  <br />
                  Phone: <a href={'tel:' + legal.phoneTel}>{legal.phone}</a>
                </p>
              </Section>
            </div>
          </div>
        </main>

        <SafeBoundary>
          <Footer />
        </SafeBoundary>
      </div>
    </LeadProvider>
  );
}
