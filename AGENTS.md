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
- `index.html` sets Google Consent Mode v2 defaults (granted, denied in EEA/UK/CH), re-applies a saved choice, then loads Google Tag Manager `GTM-KGSKS6PM` on the visitor's first scroll, tap, key press or pointer move, or 10 s after load (`window.dtWhenEngaged`; earlier dataLayer pushes queue), only on `divine-tech.ai` / `www.divine-tech.ai` (not on Netlify deploy previews or localhost, so they don't pollute GA4/Ads data or appear as extra domains in Google tag diagnostics). GA4 and Google Ads are configured inside GTM, not in the code.
- `src/lib/tracking.js` pushes `demo_request` (after a successful form submission only), `phone_click` and `email_click` to the dataLayer. `bindCallTracking()` listens to every `<audio>` on the site (the recorded AI calls) and pushes `call_play` (first play per page view; `call_name`, `call_page`, `call_start`), `call_progress` (`call_percent` 25/50/75) and `call_complete`; give a new recording a readable name in `CALL_NAMES`. In GTM all film and call tags live in the folder "Media - Film & Calls" and send GA4 events with the same names and parameters. If you add a new tool that sets cookies, add it to the policy's cookie table and gate it on consent.
- Meta Pixel (dataset `1659090295741872`, Divine Tech AI business) lives in `src/lib/metaPixel.js`, in code rather than GTM. Its script waits for `window.dtWhenEngaged` too (calls before that queue in `fbq`). It loads only when marketing is allowed (saved choice, else no GPC and not an EEA/UK/CH time zone) and follows banner changes through the `dt:consent-change` event. Events: `PageView` (load and route changes, from `App.jsx`), `Lead` with hashed email/phone after a successful form submission, `Contact` on tel:/mailto: clicks.

## Pages and Content

- Routes (`src/App.jsx`): `/` (home; right under the hero sits the 90 s launch film `LaunchFilm`, copy in `launchFilm` in `src/data/site.js`, video in `public/video/aurora-launch-film.mp4`, posters in `public/img/film/`; before play a 10 s silent teaser (`public/video/aurora-launch-teaser.mp4`) loops while the section is on screen, under a play button and chapter chips that jump into the film; the hero's "See it in action" button scrolls to it and plays it with sound; dataLayer events `film_view`, `film_play` (`film_source`: hero/poster/chapter, `film_start`), `film_progress` (25/50/75) and `film_complete`), `/platform` (the product in depth; the coded product film `HeroFilm` appears on this page only), `/industries/:slug` (one page per vertical: `real-estate`, `wellness-healthcare`, `home-services`), `/privacy`.
- `src/data/site.js`: home page copy, contact details and navigation. `src/data/industries.js`: each industry's name, hero, FAQ and card copy. Add an industry there and it appears in the nav menu, the footer, the home page cards and its own page (the shared layout in `src/pages/IndustryPage.jsx`). The nav and footer import `industries.js` on every page, so keep it small.
- Real estate, wellness and home services have designs of their own: `src/pages/industries/*Page.jsx`, with their long copy in `src/data/realEstate.js`, `wellness.js` and `homeServices.js`, so each page downloads only its own code and copy. To give another industry its own page, add it to `industryPages` in `src/pages/routes.jsx` and in `scripts/prerender.mjs`. Industry pages link to blog posts through `postPath` (`src/data/postPath.js`), not `blog.js`, which would pull in every article.
- Clips further down a page add their `<video>` only once they first come into view (`Clip` in `src/components/industry/Wellness.jsx`). Mounting them all with the page made phones download about 300 KB of video before anyone scrolled, and Lighthouse counted their start-up as blocking time.
- Home and industry pages share `SiteLayout` (nav, footer, demo drawer, per-page title and description). Use `SmartLink` for links: `/#section` scrolls on the home page and routes there from other pages.
- Each page is its own JS chunk (`src/pages/routes.jsx`): add a new page there and in `pageForPath`, and in `pageSource` in `scripts/prerender.mjs` (which adds `modulepreload` links for the page's chunk). `main.jsx` loads the current page's chunk before the first render. Small modules that several pages share (icons, buttons, sections) go into one `shared` chunk with the framework (the `codeSplitting` group in `vite.config.js`), so a page loads about six files instead of twenty.
- Prerendering: `npm run build` also builds `src/entry-server.jsx` for Node (`dist-ssr/`), and `scripts/prerender.mjs` writes each page's full React HTML into `#root` (marked `data-path`), so phones see the designed page before any JavaScript runs. On industry pages it also preloads the hero photo (the image marked `fetchPriority="high"`) ahead of the font and scripts, since that photo is the page's largest paint. `main.jsx` then hydrates that HTML (attaches to it) instead of re-rendering; the 404 page under another URL and reduced-motion visitors get a fresh render. Keep the first render the same on the server and in the browser: no `window`, `document`, `localStorage` or `matchMedia` in module scope or during render. Read browser state through the hooks in `src/components/home-v2/hooks.js` (`useMediaQuery`, `useHydrated`, `usePageLoaded`), which return their server value during hydration and the real one right after.
- First-screen entrances (hero headline, text, buttons, hero photo) are CSS animations (`.intro-*` in `index.css`), not framer-motion, so they play on the prerendered HTML. framer-motion's `initial` styles would keep them hidden until the scripts load. Don't start a preloaded hero photo at opacity 0: Chrome doesn't count an image that first paints invisible as the largest paint, so a later paint (such as the hero clip) counts instead. Hero photos fade up from dark with `intro-dim`.
- Animations: `App.jsx` wraps the site in `<LazyMotion strict>` and loads framer-motion's features in their own chunk. Import `m` (`import { m as motion } from 'framer-motion'`), never the full `motion` component, or strict mode throws.
- Guides (`/guides/:slug`, `src/pages/GuidePage.jsx`, data in `src/data/guides.js`): landing pages for the free PDFs promoted on social (the Instagram comment-to-DM links point here). The PDFs live in `public/guides/`. Pages are prerendered with `noindex` and left out of the sitemap. The download button pushes `guide_download` to the dataLayer and sends the Meta custom event `GuideDownload`; the page view is the usual `PageView`.
- No performance numbers, customer names or testimonials on the site until they are verified with the team.

## Brand

- Approved brand kit only: logos and favicons in `public/brand/` and the site root are copied unchanged from the kit (never recolour, stretch or retype them). `Logo.jsx` picks the `-color` file on light surfaces and `-color-dark` on dark ones.
- Typeface: Unbounded only (`public/fonts/unbounded-latin-wght.woff2`, with a `.woff` fallback, SIL OFL), Medium 500 for headlines and Regular 400 for body. While it loads, `Unbounded Fallback` in `index.css` (Arial or Roboto scaled to Unbounded's size) stands in so the text doesn't jump on the swap. For that to hold, size text measures in `em`, not `ch` (1ch of Unbounded = 0.893em at 400, 0.909em at 500).

## Key Files

- `src/`: frontend application source.
- `vite.config.js`: Vite config, including the `@` → `src` alias.
- `netlify.toml`: Netlify build and header settings.

## Working Notes

- `npm install`, then `npm run dev` for local work; `npm run build` to check a production build.
- Run `npm run lint` before finishing code changes.
- `@base44/sdk` and `@base44/vite-plugin` are still listed in `package.json` but are no longer imported; they can be removed together with a lockfile refresh.
