import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInViewport } from '../hooks';

/**
 * Isolated media slot for photography or After Effects exports.
 * Layout never depends on the media: the parent sizes the slot, the media fills it.
 *
 * media = null                                  → renders `fallback` (designed placeholder)
 * media = { type: 'image', src, alt, srcSet?, sizes? }
 * media = { type: 'video', sources: [{ src, type }], poster?, alt? }
 *         Transparent video: list a VP9-alpha WebM first and an HEVC-alpha MP4
 *         second (Safari), e.g. [{ src: '/media/x.webm', type: 'video/webm' },
 *         { src: '/media/x.mov', type: 'video/mp4; codecs="hvc1"' }]
 * media = { type: 'lottie', render: ({ className }) => <YourLottiePlayer … /> }
 *         Lottie needs a player (e.g. `npm i lottie-web`); pass a render function
 *         so the dependency is only added when an animation actually ships.
 *
 * Videos are muted, inline, lazy (preload="none"), play only while visible and
 * show the poster when the visitor prefers reduced motion.
 * @param {any} props
 */
export default function MediaSlot({ media, fallback = null, className = undefined, priority = false }) {
  const reduce = useReducedMotion();
  if (!media) return fallback;
  if (media.type === 'image') {
    return (
      <img
        className={cn('h-full w-full object-cover', className)}
        src={media.src}
        srcSet={media.srcSet}
        sizes={media.sizes}
        alt={media.alt || ''}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  if (media.type === 'video') return <LazyVideo media={media} className={className} still={reduce} />;
  if (typeof media.render === 'function') return media.render({ className });
  return fallback;
}

/** @param {any} props */
function LazyVideo({ media, className = undefined, still = false }) {
  const ref = useRef(null);
  const inView = useInViewport(ref, { rootMargin: '160px' });
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !still) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, still]);
  return (
    <video
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      muted
      loop
      playsInline
      preload="none"
      poster={media.poster}
      aria-label={media.alt || undefined}
      aria-hidden={media.alt ? undefined : true}
    >
      {(media.sources || []).map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
