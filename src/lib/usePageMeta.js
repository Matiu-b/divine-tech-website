import { useEffect } from 'react';

const SITE_URL = 'https://divine-tech.ai';
export const DEFAULT_TITLE = 'Aurora · AI operating system for business | Divine Tech AI';

const setAttr = (selector, attr, value) => {
  const el = document.querySelector(selector);
  const prev = el ? el.getAttribute(attr) : null;
  if (el && value) el.setAttribute(attr, value);
  return () => {
    if (el && prev !== null) el.setAttribute(attr, prev);
  };
};

/**
 * Keeps the title, description, canonical and og:url in step with the current page during
 * client-side navigation. The first load already has them in the prerendered HTML.
 * @param {{ title: string, description?: string } | undefined} meta
 * @param {string} [path] canonical path, e.g. '/platform'
 */
export default function usePageMeta(meta, path) {
  useEffect(() => {
    if (!meta) return undefined;
    const prevTitle = document.title;
    document.title = meta.title;
    const url = path ? SITE_URL + (path === '/' ? '/' : path) : null;
    const restore = [
      setAttr('meta[name="description"]', 'content', meta.description),
      setAttr('meta[property="og:title"]', 'content', meta.title),
      setAttr('meta[property="og:description"]', 'content', meta.description),
      setAttr('link[rel="canonical"]', 'href', url),
      setAttr('meta[property="og:url"]', 'content', url),
    ];
    return () => {
      document.title = prevTitle;
      restore.forEach((r) => r());
    };
  }, [meta, path]);
}
