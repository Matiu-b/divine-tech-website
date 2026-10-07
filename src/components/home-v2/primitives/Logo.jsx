import React from 'react';
import { cn } from '@/lib/utils';
import { brand } from '@/data/site';

// Source artwork: 948 × 263. The glass mark occupies the left ~21%, the
// wordmark starts at ~29%, so a 25% split cleanly separates the two.
const RATIO = 948 / 263;

/**
 * The approved Divine Tech AI logo, unaltered. For light backgrounds the white
 * wordmark is colour-adapted to ink (allowed: dark/light adaptation only);
 * the glass mark is never recoloured.
 * tone: 'dark' (ink wordmark, for light surfaces) | 'light' (white wordmark, for dark surfaces)
 * @param {any} props
 */
export default function Logo({ tone = 'dark', height = 32, className = undefined }) {
  const width = Math.round(height * RATIO);
  return (
    <span className={cn('relative inline-block shrink-0 align-middle', className)} style={{ width, height }}>
      <img
        src={brand.logo}
        alt={brand.company}
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
        style={{ clipPath: 'inset(0 75% 0 0)' }}
      />
      <img
        src={brand.logo}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none transition-[filter,opacity] duration-500 ease-out"
        style={{
          clipPath: 'inset(0 0 0 25%)',
          filter: tone === 'dark' ? 'brightness(0)' : 'brightness(1)',
          opacity: tone === 'dark' ? 0.9 : 1,
        }}
      />
    </span>
  );
}
