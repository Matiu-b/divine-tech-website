# divine-tech-website

Divine Tech AI company website (divine-tech.ai): React, Vite and Tailwind CSS, hosted on Netlify.

## Run locally

```bash
npm install
npm run dev     # local dev server
npm run build   # production build into dist/
```

## Deploy

Netlify builds and deploys automatically from this repository. Pushes to `main` go to production; other branches and pull requests get preview URLs. Build settings are in `netlify.toml`.

## Lead form

The "Book a demo" form posts to Netlify Forms (form name `lead`). Submissions show up in the Netlify dashboard under Forms, and email notifications are configured there. The hidden form in `public/__forms.html` must list the same fields as `src/components/home-v2/LeadDrawer.jsx`.
