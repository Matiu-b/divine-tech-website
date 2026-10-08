// Cookie consent state and Google Consent Mode v2 updates.
//
// Defaults are set in index.html before Google Tag Manager loads: granted
// everywhere except the EEA, UK and Switzerland, where they start denied.
// index.html also re-applies a saved choice before GTM loads, so returning
// visitors never fire a tag they turned off. This module saves new choices
// and pushes the matching consent update.

export const CONSENT_KEY = 'dt_consent';
export const CONSENT_VERSION = 1;
export const OPEN_CONSENT_EVENT = 'dt:open-consent';

/** @typedef {{ v: number, analytics: boolean, marketing: boolean, ts: string }} ConsentChoice */

/** @returns {ConsentChoice | null} */
export function readConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return c && c.v === CONSENT_VERSION ? c : null;
  } catch {
    return null;
  }
}

// gtag must push the `arguments` object itself (not an array) for GTM to read
// consent commands.
function gtag() {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** @param {{ analytics: boolean, marketing: boolean }} choice */
function consentUpdate(choice) {
  const ads = choice.marketing ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

/**
 * Save the visitor's choice and tell Google tags about it.
 * @param {{ analytics: boolean, marketing: boolean }} choice
 * @returns {ConsentChoice}
 */
export function saveConsent(choice) {
  /** @type {ConsentChoice} */
  const c = {
    v: CONSENT_VERSION,
    analytics: !!choice.analytics,
    marketing: !!choice.marketing,
    ts: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    // Storage blocked (e.g. some private modes): the choice still applies to this visit.
  }
  consentUpdate(c);
  window.dataLayer.push({ event: 'consent_update', consent_analytics: c.analytics, consent_marketing: c.marketing });
  return c;
}

/**
 * False only when the visitor has explicitly turned marketing off. With no saved
 * choice, the regional Consent Mode default decides whether Google tags may
 * send user data, so callers can rely on it.
 */
export function marketingNotRefused() {
  const c = readConsent();
  if (c) return c.marketing;
  return !hasGlobalPrivacyControl();
}

/** True when the browser sends a Global Privacy Control (opt-out) signal. */
export function hasGlobalPrivacyControl() {
  try {
    return /** @type {any} */ (navigator).globalPrivacyControl === true;
  } catch {
    return false;
  }
}

/** Reopen the cookie banner in settings mode (used by "Cookie settings" links). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
