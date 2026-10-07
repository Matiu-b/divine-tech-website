import React from 'react';
import { cn } from '@/lib/utils';
import { Reveal, RevealLines } from './MotionReveal';

/**
 * Two-tone editorial section header.
 * layout: 'stack' (eyebrow, title, text) | 'split' (title left, text right on desktop) | 'center'
 * @param {any} props
 */
export default function SectionHeader({
  eyebrow = undefined,
  titleA,
  titleB = undefined,
  text = undefined,
  id = undefined,
  as: H = 'h2',
  size = 't-h1',
  layout = 'stack',
  dark = false,
  className = undefined,
  titleClassName = undefined,
  textClassName = undefined,
  children = undefined,
}) {
  const muted = dark ? 'text-white/45' : 'text-mute';
  const title = (
    <H id={id} className={cn(size, 'balance', titleClassName)}>
      <RevealLines lines={titleB ? [titleA, titleB] : [titleA]} lineClassNames={['', muted]} blur={false} y={22} />
    </H>
  );
  const body = text ? (
    <Reveal delay={0.12}>
      <p className={cn('t-lead pretty', dark && '!text-white/65', textClassName)}>{text}</p>
      {children}
    </Reveal>
  ) : (
    children
  );

  if (layout === 'split') {
    return (
      <div className={cn('grid gap-8 md:grid-cols-12 md:items-end md:gap-10', className)}>
        <div className="md:col-span-7">
          {eyebrow ? (
            <Reveal y={12}>
              <p className="eyebrow mb-6">{eyebrow}</p>
            </Reveal>
          ) : null}
          {title}
        </div>
        <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">{body}</div>
      </div>
    );
  }

  return (
    <div className={cn(layout === 'center' && 'mx-auto flex flex-col items-center text-center', className)}>
      {eyebrow ? (
        <Reveal y={12}>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
      ) : null}
      {title}
      {body ? <div className={cn('mt-6 max-w-[46ch]', layout === 'center' && 'mx-auto')}>{body}</div> : null}
    </div>
  );
}
