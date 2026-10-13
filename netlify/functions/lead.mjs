// Demo-request intake for every "Book a demo" form on the site.
//
// The form posts here first. This function validates the lead and hands it
// straight to the Make lead webhook (HubSpot + WhatsApp), so a real lead can't
// be silently dropped by Netlify Forms' spam filter: spam-flagged Netlify
// submissions never fire outgoing webhooks. The browser still posts a backup
// copy to Netlify Forms (form "lead") for the dashboard record.
//
// Env (Functions scope): MAKE_LEAD_WEBHOOK_URL. Kept out of the code because
// the repository is public.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 4000;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function readFields(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const obj = await req.json();
    return obj && typeof obj === 'object' ? obj : {};
  }
  const params = new URLSearchParams(await req.text());
  return Object.fromEntries(params.entries());
}

const clean = (v) => (typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : '');

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });

  let raw;
  try {
    raw = await readFields(req);
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }

  const f = {
    name: clean(raw.name),
    company: clean(raw.company),
    email: clean(raw.email),
    phone: clean(raw.phone),
    industry: clean(raw.industry),
    message: clean(raw.message),
    page: clean(raw.page),
    source: clean(raw.source) || 'divine-tech.ai landing',
    website: clean(raw.website), // honeypot: real people never fill it
  };

  // Bots: answer like a success and store nothing.
  if (f.website) return json(200, { ok: true });

  const errors = {};
  if (!f.name) errors.name = 'required';
  if (!f.email || !EMAIL_RE.test(f.email)) errors.email = 'invalid';
  if ((f.phone.match(/\d/g) || []).length < 7) errors.phone = 'invalid';
  if (!f.industry) errors.industry = 'required';
  if (Object.keys(errors).length) return json(400, { ok: false, error: 'validation', fields: errors });

  const hook = Netlify.env.get('MAKE_LEAD_WEBHOOK_URL');
  if (!hook) {
    console.error('lead: MAKE_LEAD_WEBHOOK_URL is not set');
    return json(500, { ok: false, error: 'not_configured' });
  }

  const [first, ...rest] = f.name.split(/\s+/);
  // Shape matches what Make scenario 04 reads (top-level name/email/company,
  // details under data.*). No top-level form_name: that marks Netlify's own
  // outgoing-webhook payloads, which scenario 04 skips to avoid duplicates.
  const payload = {
    origin: 'site-function',
    name: f.name,
    first_name: first || '',
    last_name: rest.join(' '),
    email: f.email,
    company: f.company,
    data: {
      name: f.name,
      email: f.email,
      phone: f.phone,
      company: f.company,
      industry: f.industry,
      message: f.message,
      source: f.source,
      page: f.page,
      referrer: req.headers.get('referer') || '',
      user_agent: req.headers.get('user-agent') || '',
      ip: context.ip || '',
    },
    submitted_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(hook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error('lead: Make webhook answered', res.status, await res.text().catch(() => ''));
      return json(502, { ok: false, error: 'upstream' });
    }
  } catch (err) {
    console.error('lead: Make webhook failed', err);
    return json(502, { ok: false, error: 'upstream' });
  }

  return json(200, { ok: true });
};

export const config = {
  path: '/api/lead',
  method: 'POST',
};
