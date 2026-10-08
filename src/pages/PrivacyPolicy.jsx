import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LeadProvider } from '@/components/home-v2/LeadDrawer';
import SafeBoundary from '@/components/home-v2/primitives/SafeBoundary';
import Logo from '@/components/home-v2/primitives/Logo';
import Footer from '@/components/home-v2/Footer';
import { openConsentSettings } from '@/lib/consent';
import { brand, legal } from '@/data/site';

const UPDATED = 'October 8, 2026';

const TOC = [
  ['scope', 'Who we are and what this policy covers'],
  ['what-we-collect', 'Information we collect'],
  ['how-we-use', 'How we use information'],
  ['ai', 'AI tools and your information'],
  ['legal-bases', 'Legal bases'],
  ['cookies', 'Cookies and similar technologies'],
  ['sharing', 'Who we share information with'],
  ['transfers', 'International transfers'],
  ['retention', 'How long we keep information'],
  ['security', 'Security'],
  ['your-rights', 'Your rights and how to use them'],
  ['us-notice', 'Additional notice for US residents'],
  ['children', 'Children'],
  ['changes', 'Changes to this policy'],
  ['contact', 'Contact us'],
];

/** @param {any} props */
function Section({ id, children }) {
  const i = TOC.findIndex(([key]) => key === id);
  return (
    <section id={id} className="scroll-mt-28 border-t border-ink/10 pt-10">
      <h2 className="text-[22px] font-medium tracking-[-0.015em] text-ink sm:text-[24px]">
        {i + 1}. {TOC[i][1]}
      </h2>
      <div className="legal-body mt-4">{children}</div>
    </section>
  );
}

const CookieSettingsLink = () => (
  <button type="button" onClick={openConsentSettings} className="legal-link">
    Cookie settings
  </button>
);

const Email = () => <a href={'mailto:' + brand.email}>{brand.email}</a>;

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
                This policy explains how {legal.entity} ("{brand.company}", "we", "us") collects, uses, shares and
                protects personal information when you visit {brand.domain} (the "Site"), contact us, book a demo or
                otherwise talk to us as a prospective customer. It also explains your choices and rights.
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
              <Section id="scope">
                <p>
                  {legal.entity}, {legal.address}, is responsible (the "controller") for the personal information
                  described in this policy. Our affiliated company in Israel helps us operate the Site and respond to
                  inquiries, under this policy.
                </p>
                <p>
                  <strong>What this policy does not cover.</strong> When businesses use {brand.product}, they may load
                  information about their own customers and staff into it (for example conversations, call recordings or
                  CRM records). For that information we act on the business's behalf as a processor or service provider,
                  under our agreement and data processing terms with that business, and that business's own privacy notice
                  applies. If you are a customer of one of our clients, please contact that business about your
                  information. This policy also does not cover job applicants or our employees, who receive separate
                  notices.
                </p>
              </Section>

              <Section id="what-we-collect">
                <p>
                  <strong>Information you give us.</strong> When you book a demo or contact us, we collect what you enter
                  in the form: your name, company, work email, phone number (optional), industry and message, together
                  with the page you sent it from. We also keep the emails, messages and call details you exchange with us.
                </p>
                <p>
                  <strong>Meetings and calls.</strong> Demos and sales calls may be held by video or phone. With notice,
                  and with your consent where the law requires it, we may record or transcribe them and keep notes or
                  summaries so we can follow up accurately.
                </p>
                <p>
                  <strong>Information collected automatically.</strong> When you visit the Site, our hosting provider and,
                  if you allow them, analytics and advertising tools collect technical information such as your IP address,
                  browser and device type, pages viewed, referring site or ad, approximate location (city or country level)
                  and the date and time of your visit. See <a href="#cookies">Cookies and similar technologies</a>.
                </p>
                <p>
                  <strong>Information from advertising platforms.</strong> If you reach the Site from one of our ads, we
                  receive aggregated reports from the advertising platform (for example Google Ads) about clicks and
                  conversions. These reports do not identify you to us.
                </p>
                <p>
                  <strong>Aggregated information.</strong> We may combine information into statistics that do not identify
                  anyone, such as the number of visitors per page. If we ever link such data to a person, we treat it as
                  personal information under this policy.
                </p>
                <p>We do not ask for, and ask you not to send us, sensitive information through the Site.</p>
              </Section>

              <Section id="how-we-use">
                <ul>
                  <li>To answer your inquiry, schedule and run demos, prepare proposals and follow up about our products.</li>
                  <li>To operate, secure and improve the Site, including detecting spam and abuse of our forms.</li>
                  <li>To understand how visitors use the Site, with analytics you have allowed.</li>
                  <li>
                    To measure and improve our advertising, for example learning which ads lead to demo requests, with
                    marketing cookies you have allowed.
                  </li>
                  <li>To send occasional updates about {brand.product}, which you can unsubscribe from at any time.</li>
                  <li>To comply with legal obligations, resolve disputes and protect our rights.</li>
                </ul>
              </Section>

              <Section id="ai">
                <p>
                  We build AI agents, and we use AI tools in our own work. For example, an AI assistant may help answer or
                  route your inquiry, and AI tools may transcribe or summarize our calls with you. When an AI assistant is
                  talking to you, we will let you know where the law requires it, and a person on our team is available
                  if you prefer.
                </p>
                <p>
                  We use third-party AI providers under business terms that do not allow them to use your information to
                  train their own models. We do not use personal information collected through the Site to train
                  general-purpose AI models. We may use inquiries and call notes, with personal details removed where
                  practical, to train our team and improve how we respond to prospects.
                </p>
              </Section>

              <Section id="legal-bases">
                <p>
                  Where the law requires a legal basis (for example the GDPR for visitors in the European Economic Area,
                  the United Kingdom or Switzerland), we rely on: steps you ask us to take before entering into a contract,
                  when you request a demo; our legitimate interests in responding to inquiries, running and securing the
                  Site and promoting our business; your consent, for analytics and marketing cookies and, where required,
                  for call recordings; and compliance with legal obligations. You can withdraw consent at any time without
                  affecting earlier processing.
                </p>
              </Section>

              <Section id="cookies">
                <p>
                  Cookies are small files stored on your device. We group them into three categories, and you choose which
                  non-essential categories to allow in our cookie banner. You can change your choice at any time in{' '}
                  <CookieSettingsLink />.
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
                        <td className="px-4 py-3">
                          Google Ads: _gcl_au, _gcl_aw; Google advertising cookies. Meta Pixel: _fbp, _fbc
                        </td>
                        <td className="px-4 py-3">Measures which ads lead to demo requests and helps show relevant ads.</td>
                        <td className="px-4 py-3">Up to 90 days (Google and Meta cookies may last longer)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  We load these tools through Google Tag Manager and use Google Consent Mode, so Google's tags respect your
                  choice. If you allow marketing cookies and submit our form, the email address and phone number you
                  entered may be sent to Google in hashed (scrambled) form to measure our ads ("enhanced conversions"). If
                  you allow analytics, Google signals may associate visits with Google accounts of users who have turned on
                  ad personalization, for aggregated cross-device reporting.
                </p>
                <p>
                  We also use the Meta Pixel (Meta Platforms) to measure our ads on Facebook and Instagram. It loads only
                  when marketing cookies are allowed and stops sending information if you turn them off. It reports page
                  views, demo requests and clicks on our phone and email links. If you submit our form, your email address
                  and phone number are hashed in your browser before they are sent to Meta, to match the request to our
                  ads. Meta explains how it uses this information at{' '}
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
                    facebook.com/privacy/policy
                  </a>
                  .
                </p>
                <p>
                  In the European Economic Area, the United Kingdom and Switzerland, analytics and marketing cookies stay
                  off unless you turn them on. Elsewhere they are on by default and you can turn them off in the banner or
                  in <CookieSettingsLink />. If your browser sends a Global Privacy Control signal, we treat it as a request
                  to turn marketing cookies off. Browsers' "Do Not Track" setting has no agreed standard, so we rely on your
                  cookie choices instead. You can also block cookies in your browser and read how Google uses information
                  at{' '}
                  <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
                    policies.google.com/technologies/partner-sites
                  </a>
                  .
                </p>
              </Section>

              <Section id="sharing">
                <p>We share personal information only as needed, with:</p>
                <ul>
                  <li>
                    <strong>Service providers</strong> who process it on our behalf under contract: Netlify (website hosting
                    and form handling, including spam filtering), Google (Workspace email, Google Analytics, Google Ads and
                    Google Tag Manager), AI and transcription providers, and tools we use to manage customer relationships
                    and meetings.
                  </li>
                  <li>
                    <strong>Advertising partners</strong> such as Google and Meta, only if you allow marketing cookies, to
                    measure and improve our ads.
                  </li>
                  <li>
                    <strong>Our affiliates</strong>, including our affiliated company in Israel, to respond to you and
                    provide our services.
                  </li>
                  <li>
                    <strong>Authorities and advisers</strong> when required by law, to protect our rights, users or the
                    public, or with our professional advisers under confidentiality.
                  </li>
                  <li>
                    <strong>A buyer or successor</strong> if our business, or part of it, is reorganized, merged or sold.
                  </li>
                </ul>
                <p>We do not sell personal information for money.</p>
              </Section>

              <Section id="transfers">
                <p>
                  We operate in the United States and Israel, and our service providers may process information in other
                  countries. Israel is recognized by the European Commission as providing adequate protection. For other
                  transfers from the European Economic Area, the United Kingdom or Switzerland, we rely on safeguards such
                  as the European Commission's standard contractual clauses and the UK International Data Transfer
                  Addendum.
                </p>
              </Section>

              <Section id="retention">
                <p>
                  We keep inquiry and contact information, including call notes and recordings, for as long as needed to
                  respond and follow up, and generally for up to 24 months after our last contact with you, unless you
                  become a customer or the law requires us to keep it longer. Google Analytics data is kept for 14 months.
                  If you unsubscribe from marketing, we keep a record of that so we respect your choice. When information is
                  no longer needed, we delete or anonymize it.
                </p>
              </Section>

              <Section id="security">
                <p>
                  We use reasonable administrative, technical and physical measures to protect personal information,
                  including encrypted connections (HTTPS), access controls and contractual commitments from our service
                  providers. No method of transmission or storage is completely secure, so we cannot guarantee absolute
                  security. If a security incident affects your personal information, we will notify you and the relevant
                  authorities as the law requires.
                </p>
              </Section>

              <Section id="your-rights">
                <p>
                  Depending on where you live, you may have the right to access the personal information we hold about
                  you, correct it, delete it, receive a copy of it, object to or restrict certain processing, and withdraw
                  consent. This includes your rights under the Israeli Protection of Privacy Law to review your information
                  and ask us to correct or delete it, your rights under the GDPR, and the rights described in the{' '}
                  <a href="#us-notice">notice for US residents</a>.
                </p>
                <ul>
                  <li>
                    <strong>How to make a request.</strong> Email <Email /> with the subject "Privacy request". We will
                    confirm your identity before acting, and reply within the time the law requires (for example, one month
                    under the GDPR, which can be extended in some cases).
                  </li>
                  <li>
                    <strong>Authorized agents.</strong> Someone you authorize may make a request for you, if they show us
                    your written permission and we can verify your identity.
                  </li>
                  <li>
                    <strong>Appeals and complaints.</strong> If we decline your request, you can ask us to reconsider by
                    replying to our answer. You can also complain to your data protection authority, such as the Israeli
                    Privacy Protection Authority or your local authority in the EEA or the UK.
                  </li>
                  <li>
                    <strong>Marketing and cookies.</strong> Unsubscribe using the link in any marketing email or by writing
                    to us. Change cookie choices in <CookieSettingsLink />.
                  </li>
                </ul>
                <p>We will not treat you differently for exercising your privacy rights.</p>
              </Section>

              <Section id="us-notice">
                <p>
                  If you live in California or another US state with a consumer privacy law, this section adds to the rest
                  of this policy.
                </p>
                <ul>
                  <li>
                    <strong>Categories we collect:</strong> identifiers and contact details (name, email, phone, IP
                    address), professional information (company, industry), internet activity on the Site, approximate
                    location, and audio or electronic information from recorded calls. Sources, purposes and recipients are
                    described in sections 2, 3 and 7. We do not collect sensitive personal information through the Site.
                  </li>
                  <li>
                    <strong>Sale and sharing:</strong> we do not sell personal information for money. Allowing marketing
                    cookies lets Google and Meta use online identifiers for advertising, which some state laws call "sharing" for
                    targeted advertising. You can opt out at any time in <CookieSettingsLink /> or by using a Global
                    Privacy Control signal. We have no actual knowledge of selling or sharing information of anyone under
                    16.
                  </li>
                  <li>
                    <strong>Your rights:</strong> to know and access, correct, delete, receive a portable copy, and opt out
                    of sale, sharing and targeted advertising. Make requests as described in section 11; we respond within
                    45 days, which may be extended once by another 45 days where the law allows.
                  </li>
                </ul>
              </Section>

              <Section id="children">
                <p>
                  The Site is for businesses and is not directed to children. We do not knowingly collect personal
                  information from anyone under 18. If you believe a child has sent us information, contact us and we will
                  delete it.
                </p>
              </Section>

              <Section id="changes">
                <p>
                  We may update this policy from time to time. We will post the new version here and update the date at
                  the top. If a change is significant, we will take reasonable steps to let you know before it applies.
                </p>
              </Section>

              <Section id="contact">
                <p>
                  {legal.entity}
                  <br />
                  {legal.address}
                  <br />
                  Email: <Email />
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
