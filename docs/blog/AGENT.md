# Blog agent runbook

A scheduled Claude session runs this three times a week (Mon, Wed, Fri). Each run produces
**one pull request** for Yuri to review and merge. The agent never merges and never pushes to `main`.

- **Mon and Wed:** a new article from the queue in `docs/blog/plan.json`.
- **Fri:** a refresh of the published article whose `updated` date is oldest, if it is at least 30
  days old. Otherwise, a new article.

Repository: `Matiu-b/divine-tech-website` (React + Vite on Netlify; every PR gets a deploy preview).

## 0. Guardrails (read first)

- If **two or more open PRs** already have titles starting with `Blog:` or `Blog refresh:`, stop.
  Report that reviews are pending. Do not pile up work.
- One article per run. Pace matters more than volume, because Google acts on scaled, thin content.
- Do not invent customers, testimonials, results, prices or performance numbers about Aurora.
  - Aurora pricing is set per client: never state a price.
  - Any example company must be clearly labeled fictional.
- Do not claim certifications or compliance for Aurora (HIPAA, SOC 2 or others). Buyer guidance in
  general terms is fine.
- Every external statistic must come from a page you opened, and must be linked. If you cannot
  verify a number, drop it. Research is read-only browsing: never sign in, submit forms or send data.
- Write like a person:
  - no em dashes;
  - none of "delve", "seamless", "game-changer", "unlock" or "in today's fast-paced world";
  - no hype.
- Only link to URLs that exist. Check `src/data/blog.js` and the site routes: `/`, `/platform`,
  `/industries/<slug>`, `/blog`, `/blog/<slug>` and `/#how-it-works`. If a queue item suggests a
  link that does not exist yet, skip that link.
- GitHub: use `gh api` REST endpoints (GraphQL is not available in these sessions).

## 1. Set up

```bash
git fetch origin
git checkout -b blog/$(date +%Y-%m-%d)-<slug> origin/main
```

Read `src/data/site.js`, `src/data/industries.js`, `src/data/blog.js` and the newest package in
`docs/blog/*.json`. They are the brand facts and the house style.

Then sync the queue. Move every `in_review` item in `plan.json` whose slug is already in
`src/data/blog.js` on `main` into `published` (Yuri merged it). Then:
- If a `Blog:` PR for an `in_review` item was **closed without merging**, set that item back to
  `queued`, or remove it if the PR comments say to drop it.
- Read any review comments on recently merged blog PRs. They are style feedback for this run.

## 2a. New article

1. Take the first item in `plan.json` → `queue` with `status: "queued"`.
2. Invoke the **`anthropic-skills:seo-geo-article-writer`** skill and follow it end to end:
   keyword research, outline, draft, GEO formatting, schema and quality gate.
   - Use the queue item's `topic` and `angle`.
   - Target 1,400 to 2,000 words.
   - Use American English for the US market.
   - Open with an answer-first bold paragraph.
   - Use question H2s and tables where they help.
   - End with FAQ H3s and a closing section with internal links.
   - Prefer a technical, systems-level angle: how agents, rules, memory and integrations work.
     Avoid generic "lead" talk.
3. Run the draft through **`anthropic-skills:humanizer`**.
4. Write `docs/blog/<slug>.json` with the full package from the skill.
5. Add the post object to `src/data/blog.js` as the **first** element of `posts`.
   - It must have the same keys as the existing posts: `slug`, `title`, `titleTag` (≤60 chars),
     `description` (≤155 chars), `dek`, `category`, `date`, `updated`, `author` ("Divine Tech AI"),
     `image` {`base`, `alt`, `og`}, `bodyHtml` and `schema` (BlogPosting, BreadcrumbList, FAQPage).
   - Image paths are `/img/blog/<slug>-1600.webp` (via `base`) and `/img/blog/<slug>-og.jpg`.
6. In `plan.json`, set the item's `status` to `in_review` and add `"slug": "<slug>"`.

## 2b. Refresh (Fridays)

1. Pick the post in `src/data/blog.js` with the oldest `updated` date (≥30 days old).
2. Re-open every external source. Update or remove numbers that changed, and add newer
   authoritative data if it exists.
3. Improve the article:
   - add at least one new section, table or FAQ that answers a real follow-up question;
   - add links to newer posts on the site.
4. Set `updated` and the schema `dateModified` to today. Keep the slug and URL.
5. Do not regenerate the cover unless the title changed.

## 3. Cover image (new articles)

Covers are a text-free background plus a headline rendered in the brand font, so titles stay
editable. Do not generate covers with text baked in.

1. Add an entry to `design/blog-covers/covers.json`:
   ```json
   { "slug": "<slug>", "title": "<2 to 6 word technical headline, not the article title>", "tone": "dark", "palette": ["#0B1640", "#1E4BD8", "#E8743B", "#F2C9A0"] }
   ```
   - The palette has 3 to 5 hex colours. Put a deep base colour first, then 2 or 3 bright,
     saturated accents.
   - Make it clearly different from the last three covers.
   - Use `"tone": "light"` (dark text) only for pale palettes.
   - Headline examples: "The brokerage, on autopilot", "Dispatch, without the dispatcher",
     "Rules before autonomy".
2. Run `python3 scripts/make-blog-covers.py <slug>`.
   - The script draws `design/blog-covers/<slug>-bg.webp` from the palette.
   - It then writes `public/img/blog/<slug>-1600.webp`, `-800.webp` and `-og.jpg`.
3. Open `public/img/blog/<slug>-800.webp` with Read and check two things:
   - the headline is spelled correctly and readable;
   - the colours look like soft light, not mud.
   If needed, adjust the palette or add a `"seed"`, delete the `-bg.webp` and re-run.
4. Set `image.alt` to describe the cover: colours, headline, logo.

## 4. Validate

```bash
node -e "import('./src/data/blog.js').then(m=>console.log(m.posts.length, m.posts[0].slug))"
rm -rf dist && mkdir dist && cp index.html dist && node scripts/prerender.mjs && rm -rf dist
```

Then check:
- `titleTag` is 60 characters or fewer and `description` is 155 or fewer;
- there are no em dashes in `bodyHtml`;
- every FAQ in the schema matches an H3 in the body.

## 5. Open the PR

1. Commit with a clear message and push the branch.
2. Open a **ready (not draft)** PR to `main` through `gh api repos/Matiu-b/divine-tech-website/pulls`.
   - Title: `Blog: <title>` or `Blog refresh: <title>`.
   - Body:
     - **Summary:** 3 lines.
     - **SEO:** primary keyword, word count, sources used (linked).
     - **Preview link:** `https://deploy-preview-<PR number>--divine-tech-ai.netlify.app/blog/<slug>`.
       Post it as a comment once you know the number.
     - **Review checklist for Yuri (5 minutes):**
       - [ ] Facts and claims about Aurora are accurate
       - [ ] Add one real insight, number or example from our own work, if available
       - [ ] Cover headline reads well
       - [ ] Compliance-sensitive parts read correctly (if any)
3. Wait for the Netlify deploy status on the head commit to be `success`. Use
   `gh api repos/Matiu-b/divine-tech-website/commits/<sha>/statuses`, and fix the build if it fails.
4. End the run with a short summary: PR link, preview link, topic and keyword.

After Yuri merges, the production build pings IndexNow and updates the sitemap automatically.
