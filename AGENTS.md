# AGENTS.md

## Project Context

Divine Tech AI company website (divine-tech.ai). React, Vite and Tailwind CSS, built as a static single-page site and hosted on Netlify. It was originally exported from Base44; all Base44 dependencies have been removed from the code.

## Hosting and Deploys

- Hosting: Netlify. Every push to `main` deploys to production; pull requests and branches get preview URLs.
- Build settings live in `netlify.toml` (build command, publish dir, Node version, SPA redirect, security headers).
- Domain: registered and DNS-managed at GoDaddy. Only the `@` A record and the `www` CNAME point at Netlify. Do not touch the email records (Google Workspace MX/SPF/DKIM/DMARC, Resend `send.*` and `resend._domainkey`).

## Lead Form

- Every "Book a demo" entry point (nav, hero, platform/industry/blog buttons, the footer CTA form) renders the same `LeadForm` in `src/components/home-v2/LeadDrawer.jsx`.
- On submit it posts in parallel to `/api/lead` (`netlify/functions/lead.mjs`) and to Netlify Forms (form name `lead`). The success screen shows if either accepted the lead.
- `/api/lead` validates the lead and forwards it to the Make lead webhook (env var `MAKE_LEAD_WEBHOOK_URL`, Functions scope), which creates the HubSpot contact and posts to the Business WhatsApp group. This path exists because Netlify never fires outgoing webhooks for submissions its spam filter flags, so real leads could vanish.
- Netlify Forms is now a backup record only. Make scenario 04 skips Netlify's own outgoing-webhook payloads (they carry a top-level `form_name`) so a lead is not posted twice.
- `public/__forms.html` is the hidden static copy Netlify uses to detect the form. If you add, rename or remove a field in the component, update this file and `lead.mjs` to match exactly.

## Privacy, Cookies and Tracking

- `/privacy` (`src/pages/PrivacyPolicy.jsx`): the privacy policy. Legal entity details live in `legal` in `src/data/site.js`. Update the "Last updated" date when the text changes.
- Cookie banner: `src/components/ConsentBanner.jsx`, state and Consent Mode updates in `src/lib/consent.js` (localStorage key `dt_consent`, version 1). Footer "Cookie settings" reopens it.
- `index.html` sets Google Consent Mode v2 defaults (granted, denied in EEA/UK/CH), re-applies a saved choice, then loads Google Tag Manager `GTM-KGSKS6PM` once the page has loaded (idle, at most 2 s after load; earlier dataLayer pushes queue), only on `divine-tech.ai` / `www.divine-tech.ai` (not on Netlify deploy previews or localhost, so they don't pollute GA4/Ads data or appear as extra domains in Google tag diagnostics). GA4 and Google Ads are configured inside GTM, not in the code.
- `src/lib/tracking.js` pushes `demo_request` (after a successful form submission only), `phone_click` and `email_click` to the dataLayer. If you add a new tool that sets cookies, add it to the policy's cookie table and gate it on consent.
- Meta Pixel (dataset `1659090295741872`, Divine Tech AI business) lives in `src/lib/metaPixel.js`, in code rather than GTM. Its script is fetched once the page has loaded (calls before that queue in `fbq`). It loads only when marketing is allowed (saved choice, else no GPC and not an EEA/UK/CH time zone) and follows banner changes through the `dt:consent-change` event. Events: `PageView` (load and route changes, from `App.jsx`), `Lead` with hashed email/phone after a successful form submission, `Contact` on tel:/mailto: clicks.

## Pages and Content

- Routes (`src/App.jsx`): `/` (home), `/platform` (the product in depth; the product film `HeroFilm` appears on this page only), `/industries/:slug` (one page per vertical: `real-estate`, `wellness-healthcare`, `home-services`), `/privacy`.
- `src/data/site.js`: home page copy, contact details and navigation. `src/data/industries.js`: everything on the industry pages (copy, hero photo and live-feed events, FAQ). Add an industry there and it appears in the nav menu, the footer, the home page cards and its own page.
- Home and industry pages share `SiteLayout` (nav, footer, demo drawer, per-page title and description). Use `SmartLink` for links: `/#section` scrolls on the home page and routes there from other pages.
- Each page is its own JS chunk (`src/pages/routes.jsx`): add a new page there and in `pageForPath`, and in `pageSource` in `scripts/prerender.mjs` (which adds `modulepreload` links for the page's chunk). `main.jsx` loads the current page's chunk before the first render.
- Animations: `App.jsx` wraps the site in `<LazyMotion strict>` and loads framer-motion's features in their own chunk. Import `m` (`import { m as motion } from 'framer-motion'`), never the full `motion` component, or strict mode throws.
- No performance numbers, customer names or testimonials on the site until they are verified with the team.

## Brand

- Approved brand kit only: logos and favicons in `public/brand/` and the site root are copied unchanged from the kit (never recolour, stretch or retype them). `Logo.jsx` picks the `-color` file on light surfaces and `-color-dark` on dark ones.
- Typeface: Unbounded only (`public/fonts/unbounded-latin-wght.woff2`, with a `.woff` fallback, SIL OFL), Medium 500 for headlines and Regular 400 for body.

## Key Files

- `src/`: frontend application source.
- `vite.config.js`: Vite config, including the `@` → `src` alias.
- `netlify.toml`: Netlify build and header settings.

## Working Notes

- `npm install`, then `npm run dev` for local work; `npm run build` to check a production build.
- Run `npm run lint` before finishing code changes.
- `@base44/sdk` and `@base44/vite-plugin` are still listed in `package.json` but are no longer imported; they can be removed together with a lockfile refresh.
