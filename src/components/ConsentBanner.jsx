import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent';
import { EASE } from '@/components/home-v2/motion';
import { useHydrated } from '@/components/home-v2/hooks';

/** @param {any} props */
function Toggle({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-start justify-between gap-5 py-3.5">
      <div>
        <p id={id + '-label'} className="text-[14.5px] font-medium text-ink">
          {label}
        </p>
        <p className="mt-0.5 text-[13.5px] leading-snug text-slate">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id + '-label'}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-brand' : 'bg-ink/20',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}

/**
 * Cookie banner. Shown until the visitor makes a choice; reopened in settings
 * mode by any "Cookie settings" link (openConsentSettings in lib/consent).
 */
export default function ConsentBanner() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const [open, setOpen] = useState(() => !readConsent());
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(() => readConsent()?.analytics ?? false);
  const [marketing, setMarketing] = useState(() => readConsent()?.marketing ?? false);
  // The saved choice lives in this browser only, so the prerendered HTML always has the first-view
  // banner, painted with the page rather than popping in later. index.html marks <html> with
  // .dt-consented before the first paint when a choice is saved, and CSS hides the banner; once the
  // page is hydrated, the saved choice decides.
  const hydrated = useHydrated();
  const show = hydrated ? open : true;

  useEffect(() => {
    const onOpen = () => {
      const c = readConsent();
      setAnalytics(c ? c.analytics : false);
      setMarketing(c ? c.marketing : false);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const decide = (choice) => {
    saveConsent(choice);
    setOpen(false);
    setCustom(false);
  };

  const titleId = 'consent-title-' + uid;
  const from = reduce ? { opacity: 0 } : { opacity: 0, y: 24 };
  const to = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.section
          key="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          data-consent-first-view={custom ? undefined : ''}
          initial={from}
          animate={to}
          exit={from}
          transition={{ duration: 0.45, ease: EASE }}
          className={cn(
            'lg lg-solid fixed z-[110] max-h-[85dvh] overflow-y-auto text-ink',
            custom
              ? // Settings: a compact card (full width on phones, bottom-left elsewhere).
                'inset-x-2 bottom-2 rounded-[20px] p-4 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[440px] sm:rounded-[26px] sm:p-6'
              : // First view: one slim bar. Stacked on phones; text left, buttons right from tablet up.
                'inset-x-2 bottom-2 rounded-[20px] p-4 sm:inset-x-5 sm:bottom-5 sm:mx-auto sm:flex sm:max-w-[1040px] sm:items-center sm:gap-6 sm:rounded-full sm:py-3 sm:pl-6 sm:pr-3'
          )}
        >
          <h2 id={titleId} className={cn('text-[15px] font-medium sm:text-[17px]', !custom && 'sr-only')}>
            {custom ? 'Cookie settings' : 'Cookies on this site'}
          </h2>
          <p className={cn('text-[13px] leading-relaxed text-graphite', custom ? 'mt-2 sm:text-[14px]' : 'sm:min-w-0 sm:flex-1')}>
            {custom ? (
              <>
                We use cookies to see how the site is used and to measure our ads. Choose what you allow. You can change it
                anytime in Cookie settings at the bottom of the page.{' '}
              </>
            ) : (
              <>We use cookies for analytics and to measure our ads. </>
            )}
            <Link to="/privacy#cookies" className="legal-link">
              Privacy Policy
            </Link>
          </p>

          {custom ? (
            <div className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
              <Toggle
                id={'c-nec-' + uid}
                label="Strictly necessary"
                description="Remembers your cookie choice. Always on."
                checked
                disabled
                onChange={() => {}}
              />
              <Toggle
                id={'c-ana-' + uid}
                label="Analytics"
                description="Google Analytics: visits and how pages are used."
                checked={analytics}
                onChange={setAnalytics}
              />
              <Toggle
                id={'c-mkt-' + uid}
                label="Marketing"
                description="Google Ads and Meta Pixel: measure which ads lead to demo requests."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          ) : null}

          <div className={cn(custom ? 'mt-3 grid grid-cols-2 gap-2.5 sm:mt-4' : 'mt-3 flex items-center gap-2 sm:mt-0 sm:shrink-0')}>
            {custom ? (
              <>
                <button
                  type="button"
                  onClick={() => decide({ analytics, marketing })}
                  className="btn btn-sm col-span-2 justify-center border border-ink/15 bg-white/70 text-ink hover:bg-white"
                >
                  Save choices
                </button>
                <button
                  type="button"
                  onClick={() => decide({ analytics: false, marketing: false })}
                  className="btn btn-sm justify-center border border-ink/15 bg-white/70 text-ink hover:bg-white"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={() => decide({ analytics: true, marketing: true })}
                  className="btn btn-sm btn-primary justify-center"
                >
                  Accept all
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => decide({ analytics: false, marketing: false })}
                  className="btn btn-sm flex-1 justify-center border border-ink/15 bg-white/70 text-ink hover:bg-white sm:flex-none sm:px-5"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={() => decide({ analytics: true, marketing: true })}
                  className="btn btn-sm btn-primary flex-1 justify-center sm:flex-none sm:px-5"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => setCustom(true)}
                  className="order-first shrink-0 px-1.5 py-1 text-[12.5px] text-graphite underline-offset-4 hover:text-ink hover:underline sm:px-3 sm:text-[13px]"
                >
                  Customize
                </button>
              </>
            )}
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
