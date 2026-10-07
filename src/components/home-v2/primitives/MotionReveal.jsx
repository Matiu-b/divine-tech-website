import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE } from '../motion';

const TAGS = {
  div: motion.div,
  p: motion.p,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  figure: motion.figure,
  article: motion.article,
};

/**
 * Fade-and-rise reveal on first view. Transform + opacity only.
 * @param {any} props
 */
export function Reveal({
  as = 'div',
  children = undefined,
  className = undefined,
  delay = 0,
  y = 24,
  duration = 0.9,
  amount = 0.2,
  once = true,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Comp = TAGS[as] || motion.div;
  if (reduce) {
    return (
      <Comp className={className} {...rest}>
        {children}
      </Comp>
    );
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Headline lines that resolve from a soft blur. Each line is a block; a real
 * space is kept between lines so the accessible name reads naturally.
 * `immediate` animates on mount (hero) instead of on scroll.
 * @param {any} props
 */
export function RevealLines({
  lines,
  lineClassNames = [],
  delay = 0,
  stagger = 0.12,
  y = 18,
  blur = true,
  immediate = false,
}) {
  const reduce = useReducedMotion();
  const target = { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } };
  // Flat [line, ' ', line] list: no keyed Fragments (Base44's visual editor tags every element).
  return (
    <>
      {lines.flatMap((line, i) => {
        const el = (
          <motion.span
            key={'line-' + i}
            className={cn('block', lineClassNames[i])}
            initial={reduce ? false : { opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
            animate={immediate && !reduce ? target : undefined}
            whileInView={!immediate && !reduce ? target : undefined}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.05, delay: delay + i * stagger, ease: EASE }}
          >
            {line}
          </motion.span>
        );
        return i < lines.length - 1 ? [el, ' '] : [el];
      })}
    </>
  );
}

/**
 * Staggered children wrapper: each direct <RevealItem> rises in sequence.
 * @param {any} props
 */
export function RevealGroup({ as = 'div', children = undefined, className = undefined, stagger = 0.08, delay = 0, amount = 0.2 }) {
  const reduce = useReducedMotion();
  const Comp = TAGS[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

/** @param {any} props */
export function RevealItem({ as = 'div', children = undefined, className = undefined, y = 18 }) {
  const Comp = TAGS[as] || motion.div;
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </Comp>
  );
}
