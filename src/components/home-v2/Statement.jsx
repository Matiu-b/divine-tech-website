import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { statement } from '@/data/site';
import { Reveal } from './primitives/MotionReveal';

/** @param {any} props */
function Word({ children, progress, range, to, still }) {
  const opacity = useTransform(progress, range, [0.13, to]);
  return (
    <motion.span style={{ opacity: still ? to : opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.52'] });
  const a = statement.a.split(' ');
  const b = statement.b.split(' ');
  const total = a.length + b.length;
  const range = (i) => [i / total, Math.min(1, (i + 1.6) / total)];

  return (
    <section ref={ref} data-nav-theme="light" aria-labelledby="statement-title" className="relative pb-[clamp(24px,4vw,64px)] pt-[clamp(88px,11vw,170px)]">
      <div className="shell flex flex-col items-center text-center">
        <h2 id="statement-title" className="t-display balance">
          <span className="block">
            {a.flatMap((w, i) => {
              const el = (
                <Word key={'a' + i} progress={scrollYProgress} range={range(i)} to={0.5} still={!!reduce}>
                  {w}
                </Word>
              );
              return i < a.length - 1 ? [el, ' '] : [el];
            })}
          </span>{' '}
          <span className="block">
            {b.flatMap((w, i) => {
              const el = (
                <Word key={'b' + i} progress={scrollYProgress} range={range(a.length + i)} to={1} still={!!reduce}>
                  {w}
                </Word>
              );
              return i < b.length - 1 ? [el, ' '] : [el];
            })}
          </span>
        </h2>
        <Reveal delay={0.1} className="mt-8 max-w-[52ch] md:mt-10">
          <p className="t-lead pretty">{statement.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
