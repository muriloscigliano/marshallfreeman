import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Default animation settings
const defaults = {
  duration: 1,
  ease: 'power3.out',
};

/**
 * Fade in animation with optional direction
 */
export function fadeIn(
  elements: gsap.TweenTarget,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
  } = {}
) {
  const {
    direction = 'up',
    distance = 50,
    duration = defaults.duration,
    delay = 0,
    stagger = 0.1,
    ease = defaults.ease,
  } = options;

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return gsap.from(elements, {
    opacity: 0,
    ...directionMap[direction],
    duration,
    delay,
    stagger,
    ease,
  });
}

/**
 * Reveal animation triggered by scroll
 */
export function scrollReveal(
  elements: gsap.TweenTarget,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
    stagger?: number;
    start?: string;
    markers?: boolean;
  } = {}
) {
  const {
    direction = 'up',
    distance = 80,
    duration = defaults.duration,
    stagger = 0.15,
    start = 'top 85%',
    markers = false,
  } = options;

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return gsap.from(elements, {
    opacity: 0,
    ...directionMap[direction],
    duration,
    stagger,
    ease: defaults.ease,
    scrollTrigger: {
      trigger: elements,
      start,
      markers,
    },
  });
}

/**
 * Text split reveal animation (word by word)
 */
export function textReveal(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
  } = {}
) {
  const { duration = 0.8, stagger = 0.02, delay = 0 } = options;

  // Split text into words
  const text = element.textContent || '';
  const words = text.split(' ');

  element.innerHTML = words
    .map((word) => `<span class="word"><span class="word-inner">${word}</span></span>`)
    .join(' ');

  const wordInners = element.querySelectorAll('.word-inner');

  return gsap.from(wordInners, {
    yPercent: 100,
    opacity: 0,
    duration,
    stagger,
    delay,
    ease: 'power3.out',
  });
}

/**
 * Parallax effect on scroll
 */
export function parallax(
  element: gsap.TweenTarget,
  options: {
    speed?: number;
    direction?: 'vertical' | 'horizontal';
  } = {}
) {
  const { speed = 0.5, direction = 'vertical' } = options;

  const property = direction === 'vertical' ? 'y' : 'x';
  const distance = 100 * speed;

  return gsap.to(element, {
    [property]: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Scale reveal animation
 */
export function scaleReveal(
  element: gsap.TweenTarget,
  options: {
    scale?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  const { scale = 0.8, duration = 1.2, start = 'top 80%' } = options;

  return gsap.from(element, {
    scale,
    opacity: 0,
    duration,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start,
    },
  });
}

// Export GSAP for custom animations
export { gsap, ScrollTrigger };
