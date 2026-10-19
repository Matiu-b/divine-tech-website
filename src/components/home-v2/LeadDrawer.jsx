import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackDemoRequest } from '@/lib/tracking';
import { brand, leadIndustries } from '@/data/site';
import { EASE } from './motion';
import { useMediaQuery, useScrollLock } from './hooks';

const LeadCtx = createContext({ open: () => {}, close: () => {}, isOpen: false });
export const useLead = () => useContext(LeadCtx);

/** @param {any} props */
export function LeadProvider({ children, industry = '' }) {
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
      <LeadSheet isOpen={isOpen} onClose={close} industry={industry} />
    </LeadCtx.Provider>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** @param {any} props */
function Field({ id, label, optional = false, hint = undefined, error = undefined, dark = false, children }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={cn('text-[13.5px] font-medium tracking-[-0.005em]', dark ? 'text-white/80' : 'text-graphite')}>
        {label}
        {optional ? <span className={cn('ml-1.5 font-normal', dark ? 'text-white/40' : 'text-slate')}>Optional</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={id + '-hint'} className={cn('text-[12.5px] leading-snug', dark ? 'text-white/55' : 'text-slate')}>
          {hint}
        </p>
      ) : null}
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
 * Lead form, used by every "Book a demo" entry point. Submits to /api/lead
 * (Netlify Function -> Make: HubSpot + WhatsApp) and, as a backup record, to
 * Netlify Forms (form "lead").
 * @param {any} props
 */
export function LeadForm({ dark = false, columns = 1, wide = false, onDone = undefined, autoFocus = false, industry = '', compact = false }) {
  // compact: only what Aurora needs to call (name, email, phone); the page already knows the industry
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
    if (!d.phone) next.phone = 'Please enter your phone number, so Aurora can call you.';
    else if ((d.phone.match(/\d/g) || []).length < 7) next.phone = 'Please enter a full phone number, with the country code.';
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
      const lead = {
        name: d.name,
        company: d.company || '',
        email: d.email,
        phone: d.phone,
        industry: d.industry,
        message: d.message || '',
        source: 'divine-tech.ai landing',
        page: window.location.href,
      };
      // Two deliveries in parallel:
      // 1. /api/lead (netlify/functions/lead.mjs) hands the lead straight to Make
      //    (HubSpot + WhatsApp), so Netlify's spam filter can't swallow it.
      // 2. Netlify Forms keeps a backup copy in the dashboard.
      // The visitor sees the success screen if either one accepted the lead.
      const post = (url, init) =>
        fetch(url, { method: 'POST', ...init }).then((res) => {
          if (!res.ok) throw new Error(url + ' ' + res.status);
          return res;
        });
      const results = await Promise.allSettled([
        post('/api/lead', {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        }),
        post('/__forms.html', {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': LEAD_FORM_NAME,
            subject: 'New demo request from divine-tech.ai: ' + d.name,
            ...lead,
          }).toString(),
        }),
      ]);
      if (!results.some((r) => r.status === 'fulfilled')) throw new Error('Form submission failed');
      // Conversion is reported only after the lead was accepted.
      try {
        trackDemoRequest({ email: d.email, phone: d.phone, industry: d.industry });
      } catch {
        // Never let analytics break the form.
      }
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
        <h3 className={cn('t-h3 mt-5', dark && 'text-white')}>Aurora is calling you now</h3>
        <p className={cn('mt-2 text-[15px] leading-relaxed', dark ? 'text-white/65' : 'text-graphite')}>
          Keep your phone close. Aurora, our AI agent, will call you in a moment to hear about your business and book your demo.
          This is the same agent your customers would talk to.
        </p>
      </div>
    );
  }

  const grid = columns === 2 ? 'grid gap-3.5 sm:grid-cols-2' : 'grid gap-3.5';

  const nameField = (
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
  );
  const companyField = (
    <Field id={ids.company} label="Company" optional dark={dark}>
      <input id={ids.company} name="company" autoComplete="organization" className="field" />
    </Field>
  );
  const emailField = (
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
  );
  const phoneField = (
    <Field id={ids.phone} label="Phone" error={errors.phone} dark={dark}>
      <input
        id={ids.phone}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+1 212 555 0100"
        className="field"
        aria-invalid={errors.phone ? 'true' : 'false'}
        aria-describedby={errors.phone ? ids.phone + '-error' : undefined}
        required
      />
    </Field>
  );
  const industryField = (
    <Field id={ids.industry} label="Industry" error={errors.industry} dark={dark}>
      <div className={cn('select-wrap', dark ? 'text-white' : 'text-ink')}>
        <select
          id={ids.industry}
          name="industry"
          defaultValue={leadIndustries.includes(industry) ? industry : ''}
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
  );
  const messageField = wide ? (
    <Field id={ids.message} label="Which process should we start with?" optional dark={dark}>
      <input id={ids.message} name="message" placeholder="E.g. inbound calls and web leads" className="field" />
    </Field>
  ) : (
    <Field id={ids.message} label="Which process should we start with?" optional dark={dark}>
      <textarea id={ids.message} name="message" rows={2} placeholder="For example: inbound calls and leads from our website" className="field" />
    </Field>
  );
  const submitButton = (
    <button
      type="submit"
      disabled={state === 'sending'}
      className={cn('btn w-full disabled:cursor-progress disabled:opacity-70', wide ? 'h-[46px]' : 'btn-lg mt-0.5', dark ? 'btn-light' : 'btn-primary')}
    >
      <span>{state === 'sending' ? 'Sending…' : 'Book a demo'}</span>
      {state === 'sending' ? null : <ArrowRight aria-hidden="true" className="btn-arrow h-4 w-4" strokeWidth={1.9} />}
    </button>
  );
  const consent = (
    <p
      role={failure ? 'alert' : undefined}
      className={cn('min-h-[1.4em] text-[12.5px] leading-snug', failure ? (dark ? 'text-[#FF9C93]' : 'text-[#B3372F]') : dark ? 'text-white/45' : 'text-slate')}
    >
      {failure || 'By sending, you agree that Aurora, our AI agent, may call and text you about this request.'}
    </p>
  );

  return (
    <form onSubmit={submit} noValidate className={cn('grid gap-3.5', dark && 'on-dark')} aria-label="Book a demo">
      {wide ? (
        <>
          {/* Wide screens: two rows across. Phones and tablets: one field under another. */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {nameField}
            {emailField}
            {phoneField}
            {industryField}
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            {companyField}
            <div className="lg:col-span-2">{messageField}</div>
            <div className="sm:col-span-2 lg:col-span-1">{submitButton}</div>
          </div>
        </>
      ) : compact ? (
        <>
          {nameField}
          <div className={grid}>
            {emailField}
            {phoneField}
          </div>
          <input type="hidden" name="industry" value={leadIndustries.includes(industry) ? industry : 'Other'} />
        </>
      ) : (
        <>
          <div className={grid}>
            {nameField}
            {companyField}
          </div>
          <div className={grid}>
            {emailField}
            {phoneField}
          </div>
          {industryField}
          {messageField}
        </>
      )}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {wide ? null : submitButton}
      {consent}
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
function LeadSheet({ isOpen, onClose, industry }) {
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
                ? 'bottom-3 right-3 top-3 w-[min(540px,calc(100%-24px))] rounded-[30px]'
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
                  Leave your details and {brand.product}, our AI agent, will call you right away to hear about your business.
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-8 sm:pb-7">
              <LeadForm autoFocus={wide} columns={2} industry={industry} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
