// Motion tokens. Calm, confident, no bounce.

/** @type {[number, number, number, number]} */
export const EASE = [0.22, 1, 0.36, 1];

/** @type {[number, number, number, number]} */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
};

// Gentle spring for pointer-driven parallax (critically damped, no overshoot).
export const SOFT_SPRING = { stiffness: 70, damping: 22, mass: 0.9 };
