import React from 'react';
import { cn } from '@/lib/utils';
import { brand } from '@/data/site';

// Approved brand-kit artwork (brand-kit/<brand>/svg), used exactly as supplied:
// the "-color" file on light surfaces and the "-color-dark" file on dark ones.
// Never recolour, stretch or retype these marks (brand guidelines, Oct 2026).
const ART = {
  divine: {
    light: '/brand/divine-logo-horizontal-color.svg',
    dark: '/brand/divine-logo-horizontal-color-dark.svg',
    ratio: 9567 / 1600,
    alt: brand.company,
  },
  aurora: {
    light: '/brand/aurora-logo-horizontal-color.svg',
    dark: '/brand/aurora-logo-horizontal-color-dark.svg',
    ratio: 6211 / 1600,
    alt: brand.product,
  },
  'aurora-by-divine': {
    light: '/brand/aurora-by-divine-color.svg',
    dark: '/brand/aurora-by-divine-color-dark.svg',
    ratio: 11511.2 / 1600,
    alt: brand.product + ' by ' + brand.company,
  },
};

/**
 * Brand logo.
 * tone: 'dark' (dark artwork, for light surfaces) | 'light' (light artwork, for dark surfaces)
 * variant: 'divine' | 'aurora' | 'aurora-by-divine'
 * Both versions are stacked so switching tone (e.g. the nav over a dark section) cross-fades.
 * @param {any} props
 */
export default function Logo({ tone = 'dark', height = 28, variant = 'divine', className = undefined, decorative = false }) {
  const art = ART[variant] || ART.divine;
  const width = Math.round(height * art.ratio);
  const onDark = tone === 'light';
  return (
    <span className={cn('relative inline-block shrink-0 align-middle', className)} style={{ width, height }}>
      <img
        src={art.light}
        alt={decorative || onDark ? '' : art.alt}
        aria-hidden={decorative || onDark ? 'true' : undefined}
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none transition-opacity duration-500 ease-out"
        style={{ opacity: onDark ? 0 : 1 }}
      />
      <img
        src={art.dark}
        alt={decorative || !onDark ? '' : art.alt}
        aria-hidden={decorative || !onDark ? 'true' : undefined}
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none transition-opacity duration-500 ease-out"
        style={{ opacity: onDark ? 1 : 0 }}
      />
    </span>
  );
}
