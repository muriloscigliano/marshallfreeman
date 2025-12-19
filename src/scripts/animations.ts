import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Default animation settings
const defaults = {
  duration: 1,
  ease: 'power3.out',
};

// Configuration for different split types
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

/**
 * Animate split text with scroll trigger using GSAP SplitText
 * Following official GSAP documentation pattern
 */
export function animateSplitLines(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
    ease?: string;
    type?: 'lines' | 'words' | 'chars';
    useScrollTrigger?: boolean;
  } = {}
) {
  const {
    duration,
    stagger,
    delay = 0,
    start = 'top 80%',
    ease = 'expo.out',
    type = 'lines',
    useScrollTrigger = true,
  } = options;

  // Use config defaults if not specified
  const config = splitConfig[type];
  const finalDuration = duration ?? config.duration;
  const finalStagger = stagger ?? config.stagger;

  // Determine which types to split - only split what we need
  const typesToSplit =
    type === 'lines' ? 'lines' :
    type === 'words' ? 'lines,words' :
    'lines,words,chars';

  // Show element before animating (prevent FOUC)
  gsap.set(element, { autoAlpha: 1 });

  // Use SplitText.create following GSAP docs pattern
  SplitText.create(element, {
    type: typesToSplit,
    mask: 'lines',
    autoSplit: true,
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'char',
    onSplit(instance: { lines: Element[]; words: Element[]; chars: Element[] }) {
      // Get targets based on type
      const targets = instance[type];

      // Build animation config
      const animConfig: gsap.TweenVars = {
        yPercent: 110,
        duration: finalDuration,
        stagger: finalStagger,
        delay,
        ease,
      };

      // Add ScrollTrigger if enabled
      if (useScrollTrigger) {
        animConfig.scrollTrigger = {
          trigger: element,
          start: `clamp(${start})`,
          once: true,
        };
      }

      // Return the tween so it gets cleaned up on resize
      return gsap.from(targets, animConfig);
    },
  });
}

/**
 * Initialize split text animations for elements with data-split attribute
 */
export function initSplitTextAnimations() {
  // Wait for fonts to load for accurate measurements
  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-split]').forEach((el) => {
      const element = el as HTMLElement;
      const type = (element.dataset.splitReveal as 'lines' | 'words' | 'chars') || 'lines';
      const start = element.dataset.splitStart || 'top 80%';

      animateSplitLines(element, { type, start });
    });
  });
}

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

// Export GSAP and SplitText for custom animations
export { gsap, ScrollTrigger, SplitText };
