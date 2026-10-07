import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Liquid Glass surface. Use sparingly: navigation, floating controls,
 * product overlays and selected CTAs.
 *
 * tone:  'light' (on light/colourful backdrops) | 'dark' (on ink backdrops)
 * solid: more opaque state (e.g. nav after scroll, sheets with text)
 * tint:  faint brand-green tint
 * as:    element or motion component to render. Pass a motion component
 *        (e.g. motion.div) to animate the glass itself.
 *
 * Animation rule: fade or blur the glass element itself, never a wrapper
 * around it. A wrapper with opacity < 1 (or a filter) cuts the glass off from
 * its backdrop until the animation ends, which shows as a "pop" from clear to
 * frosted. Wrappers may move (transform) freely.
 *
 * @param {any} props
 */
export default function LiquidGlass({ as: Tag = 'div', tone = 'light', solid = false, tint = false, className = undefined, children = undefined, ...rest }) {
  return (
    <Tag className={cn('lg', tone === 'dark' && 'lg-dark', solid && 'lg-solid', tint && 'lg-tint', className)} {...rest}>
      {children}
    </Tag>
  );
}
