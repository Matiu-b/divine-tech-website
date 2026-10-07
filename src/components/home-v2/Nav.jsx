import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brand, nav } from '@/data/site';
import LiquidGlass from './primitives/LiquidGlass';
import Logo from './primitives/Logo';
import { useLead } from './LeadDrawer';
import { EASE } from './motion';
import { onAnchorClick, useScrollLock } from './hooks';

/** Watches sections marked data-nav-theme="dark" passing under the nav. */
function useNavTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
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
  }, []);
  return dark;
}

export default function Nav() {
  const { open } = useLead();
  const reduce = useReducedMotion();
  const dark = useNavTheme();
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
            !scrolled && onDark && '[--lg-tint-a:rgba(255,255,255,0.06)] [--lg-tint-b:rgba(255,255,255,0.02)]'
          )}
        >
          <a
            href="#top"
            onClick={(e) => onAnchorClick(e, '#top', () => setMenu(false))}
            aria-label={brand.company + ' — back to top'}
            className="flex items-center rounded-full py-1"
          >
            <Logo tone={onDark ? 'light' : 'dark'} height={30} className="md:hidden" />
            <Logo tone={onDark ? 'light' : 'dark'} height={33} className="hidden md:inline-block" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {nav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => onAnchorClick(e, l.href)}
                className={cn(
                  'rounded-full px-4 py-2 text-[14.5px] font-medium tracking-[-0.01em] transition-colors duration-300',
                  onDark ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-graphite hover:bg-ink/[0.05] hover:text-ink'
                )}
              >
                {l.label}
              </a>
            ))}
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
                    {nav.map((l, i) => (
                      <li key={l.href} className={cn(i > 0 && 'border-t border-ink/[0.07]')}>
                        <a
                          href={l.href}
                          onClick={(e) => onAnchorClick(e, l.href, () => closeMenu(false))}
                          className="flex items-center justify-between rounded-2xl px-4 py-4 text-[22px] font-[460] tracking-[-0.025em] text-ink transition-colors hover:bg-ink/[0.04]"
                        >
                          {l.label}
                          <ArrowRight className="h-5 w-5 text-ink/30" strokeWidth={1.6} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
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
