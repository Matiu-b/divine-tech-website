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

## 1b. Trend scan (every run, about 10 minutes)

The blog must track what is happening in AI right now, not repeat generic explainers.

1. Search the news from the last 30 days, using several of these searches:
   - AI agents enterprise;
   - agent protocols (MCP, A2A, agent payments, personal agents);
   - AI voice agents and regulation;
   - new model or agent launches from OpenAI, Anthropic, Google and Microsoft;
   - AI agent security, audits and certification;
   - AI customer service funding and acquisitions;
   - state and federal AI rules in the US.

   Prefer primary sources: the company announcement, the spec, the regulator.
2. Add 2 to 4 new lines to `docs/blog/trends.md` (newest first) for developments that matter to
   businesses running AI agents. Skip anything already logged.
3. Use the trends:
   - **Every new article** gets a short, sourced "What changed recently" angle. It can be a
     paragraph or a section, tied to a logged trend when one fits the topic. Mark that trend as
     used in the log.
   - **Queue items with `"type": "trend"`** are trend-led articles. Before writing, re-check that
     the news is still current. If something bigger and more relevant happened this month, write
     about that instead. Add it to the queue as a trend item and say why in the PR.
   - **Fridays (refresh):** update the article with the latest developments from the log.
4. Trends must be real and dated, with a link. No speculation presented as news. No hype words.

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

Covers are soft out-of-focus light on film grain with the headline centered in the brand font,
like the real-estate, clinics and contractors covers. No line drawings and no image model: Yuri
found text over technical drawings hard to read. The cover script draws the background from a
palette, so titles stay editable and nothing is downloaded.

1. Choose a short headline of 2 to 6 words, not the article title. Examples:
   "The brokerage, on autopilot", "Dispatch, without the dispatcher", "When the caller is an agent".
2. Choose a **new palette** of 4 colours, darkest first, clearly different from the covers already
   in `design/blog-covers/covers.json`. A hint of the brand kit is welcome (Divine green `#14A36B` /
   `#3DDC97`, Aurora `#FFC857` / `#FF9F45` / `#F25C2A`) but not required. Keep the middle of the
   frame calm enough for the headline. Use saturated, lively colours: no greyed-out, dusty or tired
   mixes (Yuri's note). Recent examples: violet-blue + yellow + pink, crimson + violet + tangerine.
3. Add the entry to `design/blog-covers/covers.json`:
   ```json
   { "slug": "<slug>", "title": "<headline>", "tone": "dark", "seed": "<any word>", "palette": ["#0B3B40", "#127A78", "#F27BA0", "#FFC9A8"] }
   ```
   - `"tone": "dark"` gives white text; use `"light"` (dark text) for pale palettes.
   - Change `seed` to move the glows around if the first draw puts a bright glow behind the text.
4. Render it: `python3 scripts/make-blog-covers.py <slug>` (Playwright with Chromium; in cloud
   sessions set `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`). If it cannot
   run, push `covers.json` alone and the **Blog covers** GitHub Action renders and commits the images.
5. Open `public/img/blog/<slug>-800.webp` with Read and check that the headline is spelled
   correctly and readable, and that the colours look like soft light, not mud.
6. Set `image.alt` to describe the cover: colours, headline, logo.

## 4. Validate

```bash
node -e "import('./src/data/blog.js').then(m=>console.log(m.posts.length, m.posts[0].slug))"
npm run build   # vite build + SSR build + prerender (the prerender needs dist/.vite/manifest.json)
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
