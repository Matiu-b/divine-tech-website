import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE } from '../motion';

/**
 * Enters by growing from zero height, so the items above it glide up instead
 * of jumping. Use inside a bottom-anchored stack (flex-col + justify-end) and
 * an AnimatePresence. Height is measured in layout pixels, so it also works
 * inside scaled or scrolling containers, where layout animations would not.
 * Space items with padding inside the child, not with `gap` (gaps jump).
 * @param {any} props
 */
export default function Grow({ children, className = undefined }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ height: { duration: 0.5, ease: EASE }, opacity: { duration: 0.4, delay: 0.08 } }}
      className={cn('shrink-0 overflow-hidden', className)}
    >
      {children}
    </motion.div>
  );
}
