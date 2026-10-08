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

## Key Files

- `src/`: frontend application source. `src/data/site.js` holds most of the page copy.
- `vite.config.js`: Vite config, including the `@` → `src` alias.
- `netlify.toml`: Netlify build and header settings.

## Working Notes

- `npm install`, then `npm run dev` for local work; `npm run build` to check a production build.
- Run `npm run lint` before finishing code changes.
- `@base44/sdk` and `@base44/vite-plugin` are still listed in `package.json` but are no longer imported; they can be removed together with a lockfile refresh.
