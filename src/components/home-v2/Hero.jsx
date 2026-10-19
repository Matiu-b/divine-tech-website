import React from 'react';
import { Play } from 'lucide-react';
import { hero } from '@/data/site';
import CTAButton from './primitives/CTAButton';
import Logo from './primitives/Logo';
import { RevealLines } from './primitives/MotionReveal';
import HeroReel from './HeroReel';
import { useLead } from './LeadDrawer';
import { PLAY_FILM_EVENT } from './LaunchFilm';

export default function Hero() {
  const { open } = useLead();
  // Entrances are CSS animations (.intro-* in index.css), so the prerendered hero animates in on
  // its first paint, before any JavaScript. The CTA row holds a glass button: the row only moves,
  // each button fades itself.

  return (
    <section
      id="top"
      data-nav-theme="dark"
      aria-labelledby="hero-title"
      className="on-dark relative flex min-h-[100svh] items-center overflow-hidden text-white md:min-h-[min(100svh,960px)]"
    >
      <HeroReel />

      <div className="shell relative pb-28 pt-[calc(var(--nav-h)+40px)] md:pb-32">
        {/* brand lockup, headline, one line and the two actions, all centred over the reel */}
        <div className="intro-rise flex items-center justify-center gap-2.5">
          <Logo variant="aurora" tone="light" height={26} />
          <span className="text-[17px] font-medium text-white/70">{hero.lockup}</span>
        </div>
        <h1 id="hero-title" className="t-display balance mx-auto mt-6 max-w-[18.18em] text-center text-white max-sm:px-4 max-sm:text-[27px] max-sm:leading-[1.12] md:mt-8">
          <RevealLines lines={hero.titleB ? [hero.titleA, hero.titleB] : [hero.titleA]} lineClassNames={['', '']} immediate delay={0.08} stagger={0.14} />
        </h1>
        <p className="intro-rise t-lead pretty mx-auto mt-6 max-w-[41.08em] text-center !text-white/80 max-sm:px-4 md:mt-7" style={{ animationDelay: '0.3s' }}>
          {hero.text}
        </p>
        <div className="intro-slide mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" style={{ animationDelay: '0.42s' }}>
          <CTAButton size="lg" variant="light" onClick={open} style={{ animationDelay: '0.42s' }} className="intro-fade max-sm:h-12 max-sm:px-5 max-sm:text-[15px]">
            {hero.primary}
          </CTAButton>
          <CTAButton
            size="lg"
            variant="glass-dark"
            href="#film"
            arrow={false}
            onClick={(e) => {
              // "See it in action" plays the launch film right under the hero, with sound, in this click
              e.preventDefault();
              const film = document.getElementById('film');
              if (film) film.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.dispatchEvent(new Event(PLAY_FILM_EVENT));
            }}
            style={{ animationDelay: '0.48s' }}
            icon={
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-ink">
                <Play className="ml-[1px] h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden="true" />
              </span>
            }
            className="intro-fade pl-2.5 max-sm:h-12 max-sm:pr-5 max-sm:text-[15px]"
          >
            {hero.secondary}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
