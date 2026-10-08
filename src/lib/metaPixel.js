// Meta Pixel (dataset "Divine tech", 1659090295741872, Divine Tech AI business).
//
// Meta has no equivalent of Google Consent Mode, so the pixel script is only
// loaded once marketing cookies are allowed, following the same rules as the
// Google tags in index.html:
// - a saved choice in the cookie banner always wins;
// - with no saved choice, a Global Privacy Control signal counts as a refusal;
// - with no saved choice, visitors who appear to be in the EEA, UK or
//   Switzerland (judged from the browser time zone, erring towards opt-in)
//   get nothing until they turn marketing on;
// - everyone else gets the pixel by default and can turn it off in the banner.
// Turning marketing off after the pixel has loaded sends fbq('consent',
// 'revoke'), so no further events are sent.

import { CONSENT_CHANGE_EVENT, hasGlobalPrivacyControl, readConsent } from '@/lib/consent';

export const META_PIXEL_ID = '1659090295741872';

// Time zones where marketing cookies start off (EEA, UK, Switzerland and a
// margin around them). Over-matching only means asking first.
const OPT_IN_TIME_ZONES = /^(Europe\/|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)|Arctic\/Longyearbyen)/;

let loaded = false;
let listening = false;

function inOptInRegion() {
  try {
    return OPT_IN_TIME_ZONES.test(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  } catch {
    return false;
  }
}

/** True when the Meta Pixel may run for this visitor right now. */
export function metaPixelAllowed() {
  const c = readConsent();
  if (c) return c.marketing;
  if (hasGlobalPrivacyControl()) return false;
  return !inOptInRegion();
}

function loadPixel() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', META_PIXEL_ID);
}

/** @param {...any} args */
function fbq(...args) {
  if (loaded && typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq(...args);
}

/** Report a page view (called on load and on every client-side route change). */
export function trackMetaPageView() {
  if (metaPixelAllowed()) fbq('track', 'PageView');
}

/** @param {{ marketing: boolean }} choice */
function applyChoice(choice) {
  if (choice.marketing) {
    const firstLoad = !loaded;
    loadPixel();
    fbq('consent', 'grant');
    if (firstLoad) fbq('track', 'PageView');
  } else if (loaded) {
    fbq('consent', 'revoke');
  }
}

/** Load the pixel if allowed, and follow later changes made in the cookie banner. */
export function initMetaPixel() {
  if (typeof window === 'undefined') return;
  if (metaPixelAllowed()) loadPixel();
  if (!listening) {
    listening = true;
    window.addEventListener(CONSENT_CHANGE_EVENT, (e) => {
      const detail = /** @type {CustomEvent} */ (e).detail;
      if (detail) applyChoice(detail);
    });
  }
}

/**
 * Report a successful "Book a demo" submission as a Meta Lead. The email and
 * phone are passed as advanced matching data; the pixel hashes them in the
 * browser before sending.
 * @param {{ email?: string, phone?: string }} lead  phone in E.164 (+972...) or empty
 */
export function trackMetaLead(lead) {
  if (!metaPixelAllowed()) return;
  /** @type {Record<string, string>} */
  const userData = {};
  const em = (lead.email || '').trim().toLowerCase();
  const ph = (lead.phone || '').replace(/\D/g, '');
  if (em) userData.em = em;
  if (ph) userData.ph = ph;
  if (Object.keys(userData).length) fbq('init', META_PIXEL_ID, userData);
  fbq('track', 'Lead', { content_name: 'book_a_demo' });
}

/** Report a click on a phone or email link as a Meta Contact. @param {'phone' | 'email'} method */
export function trackMetaContact(method) {
  if (metaPixelAllowed()) fbq('track', 'Contact', { content_category: method });
}
