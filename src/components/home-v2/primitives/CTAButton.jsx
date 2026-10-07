import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  primary: 'btn-primary',
  light: 'btn-light',
  quiet: 'btn-quiet',
  glass: 'lg text-ink',
  'glass-dark': 'lg lg-dark text-white',
};

/**
 * Tactile pill button. Renders <a> when `href` is set, otherwise <button>.
 * `motionProps` (initial/animate/transition) animates the button itself, which
 * glass buttons need: fading a wrapper would make the glass "pop" at the end.
 * @param {any} props
 */
export default function CTAButton({
  href = undefined,
  onClick = undefined,
  variant = 'primary',
  size = 'md',
  arrow = true,
  icon = undefined,
  className = undefined,
  motionProps = undefined,
  children,
  ...rest
}) {
  const cls = cn('btn', size === 'sm' && 'btn-sm', size === 'lg' && 'btn-lg', VARIANTS[variant], className);
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow ? <ArrowRight aria-hidden="true" className="btn-arrow h-4 w-4" strokeWidth={1.9} /> : null}
    </>
  );
  const A = motionProps ? motion.a : 'a';
  const B = motionProps ? motion.button : 'button';
  if (href) {
    return (
      <A href={href} onClick={onClick} className={cls} {...motionProps} {...rest}>
        {inner}
      </A>
    );
  }
  return (
    <B type="button" onClick={onClick} className={cls} {...motionProps} {...rest}>
      {inner}
    </B>
  );
}
