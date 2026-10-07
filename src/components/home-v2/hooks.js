import { useEffect, useState } from 'react';

export function useMediaQuery(query, initial = false) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : initial
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatch(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return match;
}

/** True while the element intersects the viewport (or once, if `once`). */
export function useInViewport(ref, { rootMargin = '0px', threshold = 0, once = false } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}

export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

/**
 * Runs a timed sequence. `times` must be a stable array of ms offsets.
 * Returns the index of the latest event reached (-1 before the first).
 * `still` (reduced motion) jumps straight to the final state.
 */
export function useSequence(times, { running = true, loop = false, duration = 0, still = false, restartKey = 0 } = {}) {
  const [idx, setIdx] = useState(still ? times.length - 1 : -1);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (still) {
      setIdx(times.length - 1);
      return undefined;
    }
    setIdx(-1);
    if (!running) return undefined;
    const timers = times.map((t, i) => window.setTimeout(() => setIdx(i), t));
    if (loop && duration) timers.push(window.setTimeout(() => setCycle((c) => c + 1), duration));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [times, running, loop, duration, still, cycle, restartKey]);
  return idx;
}

/** Locks page scroll while `locked` (menus, sheets) without layout shift. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPadding = html.style.paddingRight;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) html.style.paddingRight = scrollbar + 'px';
    return () => {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
    };
  }, [locked]);
}

/** Native smooth scroll to an in-page anchor; honours reduced motion. */
export function scrollToHash(href) {
  const id = String(href || '').replace(/^#/, '');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduce ? 'auto' : 'smooth';
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, behavior });
    if (window.history.replaceState) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: 'start' });
  if (window.history.replaceState) window.history.replaceState(null, '', '#' + id);
  return true;
}

export function onAnchorClick(event, href, after = undefined) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
  if (scrollToHash(href)) {
    event.preventDefault();
    if (after) after();
  }
}
