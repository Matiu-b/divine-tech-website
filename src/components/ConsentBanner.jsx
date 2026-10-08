import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent';
import { EASE } from '@/components/home-v2/motion';

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
    <AnimatePresence>
      {open ? (
        <motion.section
          key="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={from}
          animate={to}
          exit={from}
          transition={{ duration: 0.45, ease: EASE }}
          className="lg lg-solid fixed inset-x-3 bottom-3 z-[110] max-h-[85dvh] overflow-y-auto rounded-[26px] p-5 text-ink sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[420px] sm:p-6"
        >
          <h2 id={titleId} className="text-[17px] font-medium tracking-[-0.01em]">
            {custom ? 'Cookie settings' : 'Cookies on this site'}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-graphite">
            We use cookies to see how the site is used and to measure our ads. Choose what you allow. You can change it
            anytime in Cookie settings at the bottom of the page.{' '}
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

          <div className="mt-4 grid grid-cols-2 gap-2.5">
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
                <button
                  type="button"
                  onClick={() => setCustom(true)}
                  className="col-span-2 py-1 text-[13.5px] text-graphite underline-offset-4 hover:text-ink hover:underline"
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
