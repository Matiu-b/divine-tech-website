import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, nav } from '@/data/site';
import { industries, industryPath } from '@/data/industries';
import LiquidGlass from './primitives/LiquidGlass';
import Logo from './primitives/Logo';
import SmartLink from './primitives/SmartLink';
import { useLead } from './LeadDrawer';
import { EASE } from './motion';
import { useScrollLock } from './hooks';

const industryLinks = industries.map((i) => ({ href: industryPath(i.slug), label: i.label, text: i.short }));

/** Watches sections marked data-nav-theme="dark" passing under the nav (re-run on every page). */
function useNavTheme() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(false);
    const targets = Array.from(document.querySelectorAll('[data-nav-theme="dark"]'));
    if (!targets.length || typeof IntersectionObserver === 'undefined') return undefined;
    const active = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => (en.isIntersecting ? active.add(en.target) : active.delete(en.target)));
        setDark(active.size > 0);
      },
      { rootMargin: '-3% 0px -95% 0px', threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);
  return dark;
}

/** Desktop "Industries" menu: opens on hover or click, closes on Escape, outside click or navigation. */
function IndustriesMenu({ label, onDark }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const wrap = useRef(null);
  const btn = useRef(null);
  const closeTimer = useRef(0);
  const { pathname } = useLocation();
  const current = pathname.startsWith('/industries/');

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        if (btn.current) btn.current.focus();
      }
    };
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const enter = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div ref={wrap} className="relative" onPointerEnter={(e) => e.pointerType === 'mouse' && enter()} onPointerLeave={(e) => e.pointerType === 'mouse' && leave()}>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls="nav-industries"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1 rounded-full px-4 py-2 text-[13.5px] font-normal transition-colors duration-300',
          onDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-graphite hover:bg-ink/[0.05] hover:text-ink',
          current && (onDark ? 'text-white' : 'text-ink')
        )}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open ? (
          <LiquidGlass
            as={motion.div}
            id="nav-industries"
            solid
            tone="light"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="absolute left-1/2 top-[calc(100%+12px)] w-[380px] -translate-x-1/2 rounded-[22px] p-2"
          >
            <ul>
              {industryLinks.map((l) => (
                <li key={l.href}>
                  <SmartLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === l.href ? 'page' : undefined}
                    className="group flex items-start justify-between gap-4 rounded-[16px] px-4 py-3.5 transition-colors hover:bg-ink/[0.05]"
                  >
                    <span>
                      <span className="block text-[14px] font-medium text-ink">{l.label}</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-graphite">{l.text}</span>
                    </span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.7} aria-hidden="true" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </LiquidGlass>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const { open } = useLead();
  const reduce = useReducedMotion();
  const dark = useNavTheme();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuBtn = useRef(null);
  const sheetRef = useRef(null);
  useScrollLock(menu);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    const first = sheetRef.current && sheetRef.current.querySelector('a');
    if (first) first.focus({ preventScroll: true });
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenu(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menu]);

  const closeMenu = (refocus = true) => {
    setMenu(false);
    if (refocus && menuBtn.current) menuBtn.current.focus({ preventScroll: true });
  };

  const onDark = dark && !menu;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[90]">
      <div className="shell pt-3 md:pt-4">
        <LiquidGlass
          tone={onDark ? 'dark' : 'light'}
          solid={scrolled || menu}
          className={cn(
            'pointer-events-auto flex h-[58px] items-center justify-between gap-3 rounded-full pl-4 pr-2 transition-[background,box-shadow] duration-500 sm:pl-5 md:h-[62px]',
            !scrolled && !menu && '[--lg-tint-a:rgba(255,255,255,0.28)] [--lg-tint-b:rgba(255,255,255,0.08)]',
            // over the home reel the light logo needs a dark backing even when a clip has a bright sky or a white van
            !scrolled && onDark && '[--lg-tint-a:rgba(10,15,14,0.46)] [--lg-tint-b:rgba(10,15,14,0.34)]'
          )}
        >
          <SmartLink
            href={pathname === '/' ? '/#top' : '/'}
            onClick={() => setMenu(false)}
            aria-label={brand.company + ' home'}
            className="flex items-center rounded-full py-1"
          >
            <Logo tone={onDark ? 'light' : 'dark'} height={22} className="md:hidden" decorative />
            <Logo tone={onDark ? 'light' : 'dark'} height={26} className="hidden md:inline-block" decorative />
          </SmartLink>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {nav.map((l) =>
              l.children ? (
                <IndustriesMenu key={l.label} label={l.label} onDark={onDark} />
              ) : (
                <SmartLink
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-[13.5px] font-normal transition-colors duration-300',
                    onDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-graphite hover:bg-ink/[0.05] hover:text-ink'
                  )}
                >
                  {l.label}
                </SmartLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                open();
              }}
              className={cn('btn btn-sm hidden min-[360px]:inline-flex', onDark ? 'btn-light' : 'btn-primary')}
            >
              <span>Book a demo</span>
              <ArrowRight aria-hidden="true" className="btn-arrow hidden h-4 w-4 md:block" strokeWidth={1.9} />
            </button>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu((m) => !m)}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden',
                onDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/[0.06]'
              )}
            >
              <span className="relative block h-3 w-[18px]" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-out',
                    menu ? 'top-[5px] rotate-45' : 'top-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-500 ease-out',
                    menu ? 'top-[5px] -rotate-45' : 'top-[10px]'
                  )}
                />
              </span>
            </button>
          </div>
        </LiquidGlass>
      </div>

      <AnimatePresence>
        {menu ? (
          <motion.div
            key="menu"
            className="pointer-events-auto fixed inset-0 -z-10 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: {}, closed: {} }}
          >
            {/* The blurred scrim and the glass sheet fade themselves; a fading wrapper would delay their blur to the end. */}
            <motion.div
              className="absolute inset-0 bg-paper/50 backdrop-blur-[10px]"
              onClick={() => closeMenu(false)}
              aria-hidden="true"
              variants={{ open: { opacity: 1, transition: { duration: 0.3 } }, closed: { opacity: 0, transition: { duration: 0.25 } } }}
            />
            <div ref={sheetRef} id="mobile-menu" className="shell relative mt-[84px]">
              <LiquidGlass
                as={motion.div}
                solid
                className="rounded-[28px] p-3"
                variants={{
                  open: reduce ? { opacity: 1, transition: { duration: 0.3 } } : { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                  closed: reduce ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } },
                }}
              >
                <nav aria-label="Mobile">
                  <ul>
                    {nav.map((l, i) =>
                      l.children ? (
                        <li key={l.label} className={cn('px-4 pb-2 pt-4', i > 0 && 'border-t border-ink/[0.07]')}>
                          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-slate">{l.label}</p>
                          <ul className="mt-1">
                            {industryLinks.map((c) => (
                              <li key={c.href}>
                                <SmartLink
                                  href={c.href}
                                  onClick={() => closeMenu(false)}
                                  aria-current={pathname === c.href ? 'page' : undefined}
                                  className="flex items-center justify-between rounded-2xl py-2.5 text-[17px] font-medium text-ink"
                                >
                                  {c.label}
                                  <ArrowRight className="h-4 w-4 text-ink/30" strokeWidth={1.6} aria-hidden="true" />
                                </SmartLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ) : (
                        <li key={l.href} className={cn(i > 0 && 'border-t border-ink/[0.07]')}>
                          <SmartLink
                            href={l.href}
                            onClick={() => closeMenu(false)}
                            className="flex items-center justify-between rounded-2xl px-4 py-4 text-[18px] font-medium text-ink transition-colors hover:bg-ink/[0.04]"
                          >
                            {l.label}
                            <ArrowRight className="h-5 w-5 text-ink/30" strokeWidth={1.6} aria-hidden="true" />
                          </SmartLink>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
                <div className="mt-2 grid gap-3 px-1 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenu(false);
                      open();
                    }}
                    className="btn btn-primary btn-lg w-full"
                  >
                    <span>Book a demo</span>
                    <ArrowRight aria-hidden="true" className="btn-arrow h-4 w-4" strokeWidth={1.9} />
                  </button>
                  <a href={'mailto:' + brand.email} className="px-3 pb-2 text-center text-[14px] text-graphite">
                    {brand.email}
                  </a>
                </div>
              </LiquidGlass>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
