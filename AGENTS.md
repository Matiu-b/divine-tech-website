# AGENTS.md

## Project Context

Divine Tech AI company website (divine-tech.ai). React, Vite and Tailwind CSS, built as a static single-page site and hosted on Netlify. It was originally exported from Base44; all Base44 dependencies have been removed from the code.

## Hosting and Deploys

- Hosting: Netlify. Every push to `main` deploys to production; pull requests and branches get preview URLs.
- Build settings live in `netlify.toml` (build command, publish dir, Node version, SPA redirect, security headers).
- Domain: registered and DNS-managed at GoDaddy. Only the `@` A record and the `www` CNAME point at Netlify. Do not touch the email records (Google Workspace MX/SPF/DKIM/DMARC, Resend `send.*` and `resend._domainkey`).

## Lead Form

- `src/components/home-v2/LeadDrawer.jsx` submits to Netlify Forms (form name `lead`).
- `public/__forms.html` is the hidden static copy Netlify uses to detect the form. If you add, rename or remove a field in the component, update this file to match exactly, or submissions will fail.

## Privacy, Cookies and Tracking

- `/privacy` (`src/pages/PrivacyPolicy.jsx`): the privacy policy. Legal entity details live in `legal` in `src/data/site.js`. Update the "Last updated" date when the text changes.
- Cookie banner: `src/components/ConsentBanner.jsx`, state and Consent Mode updates in `src/lib/consent.js` (localStorage key `dt_consent`, version 1). Footer "Cookie settings" reopens it.
- `index.html` sets Google Consent Mode v2 defaults (granted, denied in EEA/UK/CH), re-applies a saved choice, then loads Google Tag Manager `GTM-KGSKS6PM`. GA4 and Google Ads are configured inside GTM, not in the code.
- `src/lib/tracking.js` pushes `demo_request` (after a successful form submission only), `phone_click` and `email_click` to the dataLayer. If you add a new tool that sets cookies, add it to the policy's cookie table and gate it on consent.
- Meta Pixel (dataset `1659090295741872`, Divine Tech AI business) lives in `src/lib/metaPixel.js`, in code rather than GTM. It loads only when marketing is allowed (saved choice, else no GPC and not an EEA/UK/CH time zone) and follows banner changes through the `dt:consent-change` event. Events: `PageView` (load and route changes, from `App.jsx`), `Lead` with hashed email/phone after a successful form submission, `Contact` on tel:/mailto: clicks.

## Key Files

- `src/`: frontend application source. `src/data/site.js` holds most of the page copy.
- `vite.config.js`: Vite config, including the `@` → `src` alias.
- `netlify.toml`: Netlify build and header settings.

## Working Notes

- `npm install`, then `npm run dev` for local work; `npm run build` to check a production build.
- Run `npm run lint` before finishing code changes.
- `@base44/sdk` and `@base44/vite-plugin` are still listed in `package.json` but are no longer imported; they can be removed together with a lockfile refresh.
