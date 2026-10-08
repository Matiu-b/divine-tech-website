// Analytics events for Google Tag Manager (container GTM-KGSKS6PM).
// GTM turns these dataLayer events into GA4 and Google Ads tags; Consent Mode
// (index.html + lib/consent.js) decides what each tag may store or send.
// The same events also go to the Meta Pixel (lib/metaPixel.js), which checks
// marketing consent itself.

import { marketingNotRefused } from '@/lib/consent';
import { trackMetaContact, trackMetaLead } from '@/lib/metaPixel';

function push(data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/**
 * Best-effort E.164 phone (+972541234567) for Google enhanced conversions.
 * Israeli local numbers (05x..., 0x...) get +972; anything that doesn't end up
 * as + and 8 to 15 digits is dropped rather than sent in the wrong format.
 * @param {string} raw
 */
export function toE164(raw) {
  if (!raw) return '';
  let s = String(raw).trim().replace(/[\s().-]/g, '');
  if (s.startsWith('00')) s = '+' + s.slice(2);
  else if (/^0\d{8,9}$/.test(s)) s = '+972' + s.slice(1);
  return /^\+\d{8,15}$/.test(s) ? s : '';
}

/**
 * Report a successful "Book a demo" submission. Call only after the server
 * accepted the form, never on button click.
 * @param {{ email: string, phone?: string, industry?: string }} lead
 */
export function trackDemoRequest(lead) {
  const event = {
    event: 'demo_request',
    form_name: 'book_a_demo',
    lead_industry: lead.industry || '',
  };
  // Raw email/phone go to the dataLayer only for Google Ads enhanced conversions
  // (hashed by Google's tag, and only when ad_user_data consent allows it).
  if (marketingNotRefused()) {
    const phone = toE164(lead.phone || '');
    event.user_data = { email: (lead.email || '').trim().toLowerCase(), ...(phone ? { phone_number: phone } : {}) };
  }
  push(event);
  trackMetaLead({ email: lead.email, phone: toE164(lead.phone || '') });
}

let clicksBound = false;

/** Report clicks on mailto: and tel: links anywhere on the site. */
export function bindContactClickTracking() {
  if (clicksBound || typeof document === 'undefined') return;
  clicksBound = true;
  document.addEventListener('click', (e) => {
    const target = /** @type {Element | null} */ (e.target instanceof Element ? e.target : null);
    const a = target && target.closest('a[href^="mailto:"], a[href^="tel:"]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const isPhone = href.startsWith('tel:');
    push({ event: isPhone ? 'phone_click' : 'email_click', link_url: href });
    trackMetaContact(isPhone ? 'phone' : 'email');
  });
}
