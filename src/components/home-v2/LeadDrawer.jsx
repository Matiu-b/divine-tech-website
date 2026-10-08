import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, leadIndustries } from '@/data/site';
import { EASE } from './motion';
import { useMediaQuery, useScrollLock } from './hooks';

const LeadCtx = createContext({ open: () => {}, close: () => {}, isOpen: false });
export const useLead = () => useContext(LeadCtx);

/** @param {any} props */
export function LeadProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const returnFocus = useRef(null);
  const open = useCallback(() => {
    returnFocus.current = document.activeElement;
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!isOpen && returnFocus.current) {
      const el = returnFocus.current;
      returnFocus.current = null;
      if (el && typeof el.focus === 'function') el.focus();
    }
  }, [isOpen]);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);
  return (
    <LeadCtx.Provider value={value}>
      {children}
      <LeadSheet isOpen={isOpen} onClose={close} />
    </LeadCtx.Provider>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** @param {any} props */
function Field({ id, label, optional = false, error = undefined, dark = false, children }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={cn('text-[13.5px] font-medium tracking-[-0.005em]', dark ? 'text-white/80' : 'text-graphite')}>
        {label}
        {optional ? <span className={cn('ml-1.5 font-normal', dark ? 'text-white/40' : 'text-slate')}>Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={id + '-error'} className={cn('text-[13px]', dark ? 'text-[#FF9C93]' : 'text-[#B3372F]')}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Netlify Forms form name. The hidden copy in public/__forms.html must list the same fields. */
const LEAD_FORM_NAME = 'lead';

/**
 * Lead form. Submits to Netlify Forms (form "lead"); submissions appear in the
 * Netlify dashboard and trigger the email notifications configured there.
 * @param {any} props
 */
export function LeadForm({ dark = false, columns = 1, onDone = undefined, autoFocus = false }) {
  const uid = useId().replace(/:/g, '');
  const ids = {
    name: 'lf-name-' + uid,
    company: 'lf-company-' + uid,
    email: 'lf-email-' + uid,
    phone: 'lf-phone-' + uid,
    industry: 'lf-industry-' + uid,
    message: 'lf-message-' + uid,
  };
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [failure, setFailure] = useState('');
  const firstRef = useRef(null);

  useEffect(() => {
    if (!autoFocus) return undefined;
    const t = window.setTimeout(() => {
      if (firstRef.current) firstRef.current.focus({ preventScroll: true });
    }, 380);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const d = /** @type {Record<string, string>} */ ({});
    fd.forEach((v, k) => {
      d[k] = typeof v === 'string' ? v.trim() : '';
    });
    if (d.website) {
      setState('done'); // honeypot: silently accept bots, store nothing
      return;
    }
    const next = /** @type {Record<string, string>} */ ({});
    if (!d.name) next.name = 'Please enter your name.';
    if (!d.email) next.email = 'Please enter your work email.';
    else if (!EMAIL_RE.test(d.email)) next.email = 'Please enter a valid email address.';
    if (!d.industry) next.industry = 'Please choose an industry.';
    setErrors(next);
    const firstKey = Object.keys(next)[0];
    if (firstKey) {
      const el = /** @type {HTMLElement | null} */ (form.querySelector('[name="' + firstKey + '"]'));
      if (el) el.focus();
      return;
    }
    setFailure('');
    setState('sending');
    try {
      const body = new URLSearchParams({
        'form-name': LEAD_FORM_NAME,
        subject: 'New demo request from divine-tech.ai: ' + d.name,
        name: d.name,
        company: d.company || '',
        email: d.email,
        phone: d.phone || '',
        industry: d.industry,
        message: d.message || '',
        source: 'divine-tech.ai landing',
        page: window.location.href,
      });
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error('Form submission failed: ' + res.status);
      setState('done');
      if (onDone) onDone();
    } catch {
      setState('error');
      setFailure('We could not send your request. Please email us at ' + brand.email + '.');
    }
  };

  if (state === 'done') {
    return (
      <div className="flex flex-col items-start py-6" role="status" aria-live="polite">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-full', dark ? 'bg-brand-glow/15 text-brand-glow' : 'bg-brand-mint text-brand-ink')}>
          <Check className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h3 className={cn('t-h3 mt-5', dark && 'text-white')}>Request received</h3>
        <p className={cn('mt-2 text-[15px] leading-relaxed', dark ? 'text-white/65' : 'text-graphite')}>
          Thank you. We reply within one business day from {brand.email}.
        </p>
      </div>
    );
  }

  const grid = columns === 2 ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4';

  return (
    <form onSubmit={submit} noValidate className={cn('grid gap-4', dark && 'on-dark')} aria-label="Book a demo">
      <div className={grid}>
        <Field id={ids.name} label="Name" error={errors.name} dark={dark}>
          <input
            ref={firstRef}
            id={ids.name}
            name="name"
            autoComplete="name"
            className="field"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? ids.name + '-error' : undefined}
            required
          />
        </Field>
        <Field id={ids.company} label="Company" optional dark={dark}>
          <input id={ids.company} name="company" autoComplete="organization" className="field" />
        </Field>
      </div>
      <div className={grid}>
        <Field id={ids.email} label="Work email" error={errors.email} dark={dark}>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? ids.email + '-error' : undefined}
            required
          />
        </Field>
        <Field id={ids.phone} label="Phone" optional dark={dark}>
          <input id={ids.phone} name="phone" type="tel" autoComplete="tel" className="field" />
        </Field>
      </div>
      <Field id={ids.industry} label="Industry" error={errors.industry} dark={dark}>
        <div className={cn('select-wrap', dark ? 'text-white' : 'text-ink')}>
          <select
            id={ids.industry}
            name="industry"
            defaultValue=""
            className="field pr-11"
            aria-invalid={errors.industry ? 'true' : 'false'}
            aria-describedby={errors.industry ? ids.industry + '-error' : undefined}
            required
          >
            <option value="" disabled>
              Choose your industry
            </option>
            {leadIndustries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </Field>
      <Field id={ids.message} label="Which process should we start with?" optional dark={dark}>
        <textarea
          id={ids.message}
          name="message"
          rows={3}
          placeholder="For example: inbound leads from our website and WhatsApp"
          className="field"
        />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={state === 'sending'}
        className={cn('btn btn-lg mt-1 w-full disabled:cursor-progress disabled:opacity-70', dark ? 'btn-light' : 'btn-primary')}
      >
        <span>{state === 'sending' ? 'Sending…' : 'Book a demo'}</span>
        {state === 'sending' ? null : <ArrowRight aria-hidden="true" className="btn-arrow h-4 w-4" strokeWidth={1.9} />}
      </button>
      <p
        role={failure ? 'alert' : undefined}
        className={cn('min-h-[1.4em] text-[13.5px]', failure ? (dark ? 'text-[#FF9C93]' : 'text-[#B3372F]') : dark ? 'text-white/45' : 'text-slate')}
      >
        {failure || 'No commitment. We reply within one business day.'}
      </p>
    </form>
  );
}

/** Focus trap for the dialog. */
function trapTab(e, root) {
  if (e.key !== 'Tab' || !root) return;
  const nodes = root.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!nodes.length) return;
  const first = /** @type {HTMLElement} */ (nodes[0]);
  const last = /** @type {HTMLElement} */ (nodes[nodes.length - 1]);
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** @param {any} props */
function LeadSheet({ isOpen, onClose }) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 640px)', true);
  const panelRef = useRef(null);
  const titleId = 'lead-sheet-title';
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else trapTab(e, panelRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const from = reduce ? { opacity: 0 } : wide ? { opacity: 0, x: 36 } : { opacity: 1, y: '100%' };
  const to = reduce ? { opacity: 1 } : wide ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div key="lead-sheet" className="fixed inset-0 z-[120]" initial="closed" animate="open" exit="closed" variants={{ open: {}, closed: {} }}>
          {/* Scrim and sheet fade themselves: a fading wrapper would hold back their blur until the end. */}
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden="true"
            variants={{ open: { opacity: 1, transition: { duration: 0.35, ease: EASE } }, closed: { opacity: 0, transition: { duration: 0.3, ease: EASE } } }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={{ open: { ...to, transition: { duration: 0.55, ease: EASE } }, closed: { ...from, transition: { duration: 0.4, ease: EASE } } }}
            className={cn(
              'lg lg-solid absolute flex flex-col overflow-hidden text-ink',
              wide
                ? 'bottom-3 right-3 top-3 w-[min(480px,calc(100%-24px))] rounded-[30px]'
                : 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[28px]'
            )}
          >
            {!wide ? <span className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-ink/15" aria-hidden="true" /> : null}
            <div className="flex items-start justify-between gap-6 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
              <div>
                <h2 id={titleId} className="t-h3">
                  See {brand.product} run on your business
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-graphite">
                  Bring one real process. We describe it together, and you watch the system configure itself.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-colors hover:bg-ink/10"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
              <LeadForm autoFocus={wide} />
              <div className="mt-6 grid gap-1 border-t border-ink/10 pt-5 text-[14px] text-graphite">
                <a className="w-fit hover:text-ink" href={'mailto:' + brand.email}>
                  {brand.email}
                </a>
                <a className="w-fit hover:text-ink" href={'tel:' + brand.phoneTel}>
                  {brand.phone}
                </a>
                <span>{brand.address}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
