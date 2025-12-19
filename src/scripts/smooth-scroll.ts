import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { animateSplitLines } from './animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

// Make GSAP available globally for components that need it
declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
  }
}
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Initialize button character stagger animation
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01;
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach((button) => {
    // Skip if already processed
    if (button.getAttribute('data-chars-processed')) return;
    button.setAttribute('data-chars-processed', 'true');

    const text = button.textContent || '';
    button.innerHTML = '';

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }

      button.appendChild(span);
    });
  });
}

// Initialize footer parallax
function initFooterParallax() {
  const footerWrap = document.querySelector('[data-footer-parallax]');
  if (!footerWrap) return;

  const inner = footerWrap.querySelector('[data-footer-parallax-inner]');
  const dark = footerWrap.querySelector('[data-footer-parallax-dark]');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footerWrap,
      start: 'clamp(top bottom)',
      end: 'clamp(top top)',
      scrub: true,
    },
  });

  if (inner) {
    tl.fromTo(inner, { yPercent: -25 }, { yPercent: 0, ease: 'none' });
  }

  if (dark) {
    tl.fromTo(dark, { opacity: 0.5 }, { opacity: 0, ease: 'none' }, '<');
  }
}

// Detect scrolling direction for nav hide/show
function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10;
  const thresholdTop = 50;

  window.addEventListener('scroll', () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      const direction = nowScrollTop > lastScrollTop ? 'down' : 'up';
      document.querySelectorAll('[data-scrolling-direction]').forEach((el) => {
        el.setAttribute('data-scrolling-direction', direction);
      });

      const started = nowScrollTop > thresholdTop;
      document.querySelectorAll('[data-scrolling-started]').forEach((el) => {
        el.setAttribute('data-scrolling-started', started ? 'true' : 'false');
      });

      lastScrollTop = nowScrollTop;
    }
  });
}

// Initialize header reveal animation
function initHeaderReveal() {
  const headerElements = document.querySelectorAll('[data-header-reveal]');

  if (headerElements.length > 0) {
    headerElements.forEach((el) => {
      const element = el as HTMLElement;
      const delay = parseFloat(element.dataset.headerDelay || '0') * 0.08;

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: delay,
        ease: 'power3.out',
      });
    });
  }
}

// Initialize overlapping slider for testimonials
function initOverlappingSlider() {
  const inits = document.querySelectorAll('[data-overlap-slider-init]');
  if (!inits.length) return;

  inits.forEach((init) => {
    const initEl = init as HTMLElement;

    // Get attributes with defaults
    const minScale = parseFloat(initEl.dataset.scale || '0.45');
    const maxRotation = parseFloat(initEl.dataset.rotate || '-8');

    const wrap = initEl.querySelector('[data-overlap-slider-collection]') as HTMLElement;
    const slider = initEl.querySelector('[data-overlap-slider-list]') as HTMLElement;
    const slides = Array.from(initEl.querySelectorAll('[data-overlap-slider-item]')) as HTMLElement[];

    if (!wrap || !slider || !slides.length) return;

    // Prevent text selection and touch scrolling
    wrap.style.touchAction = 'none';
    wrap.style.userSelect = 'none';

    let spacing = 0;
    let maxDrag = 0;
    let dragX = 0;
    let draggable: Draggable;

    // Clamp function using latest maxDrag
    function clamp(value: number): number {
      if (maxDrag <= 0) return 0;
      return Math.min(Math.max(value, 0), maxDrag);
    }

    // Update slide transforms
    function update() {
      // Move the whole list
      gsap.set(slider, { x: -dragX });

      // Update each slide's overlap transform
      slides.forEach((slide, i) => {
        const threshold = i * spacing;
        const local = Math.max(0, dragX - threshold);
        const t = spacing > 0 ? Math.min(local / spacing, 1) : 0;

        gsap.set(slide, {
          x: local,
          scale: 1 - (1 - minScale) * t,
          rotation: maxRotation * t,
          transformOrigin: '75% center',
        });
      });
    }

    // Recalculate dimensions
    function recalc() {
      if (!slides.length) return;

      // Measure one slide to get width + margin-right as gap
      const style = getComputedStyle(slides[0]);
      const gapRight = parseFloat(style.marginRight) || 0;
      const slideW = slides[0].offsetWidth;

      spacing = slideW + gapRight;
      maxDrag = spacing * (slides.length - 1);

      // Keep dragX within new bounds
      dragX = clamp(dragX);
      update();

      if (draggable) {
        draggable.applyBounds({ minX: -maxDrag, maxX: 0 });
      }
    }

    // Create draggable
    draggable = Draggable.create(slider, {
      type: 'x',
      bounds: { minX: -maxDrag, maxX: 0 },
      inertia: true,
      maxDuration: 1,
      snap: (raw: number) => {
        const d = clamp(-raw);
        const idx = spacing > 0 ? Math.round(d / spacing) : 0;
        return -idx * spacing;
      },
      onDrag: function () {
        dragX = clamp(-this.x);
        update();
      },
      onThrowUpdate: function () {
        dragX = clamp(-this.x);
        update();
      },
    })[0];

    // Recalc on resize
    const ro = new ResizeObserver(() => {
      recalc();
    });
    ro.observe(initEl);

    // Keyboard navigation
    let active = false;
    let currentIndex = 0;

    function goToSlide(idx: number) {
      idx = Math.max(0, Math.min(idx, slides.length - 1));
      currentIndex = idx;
      const targetX = idx * spacing;

      gsap.to({ value: dragX }, {
        value: targetX,
        duration: 0.35,
        ease: 'power4.out',
        onUpdate: function () {
          dragX = (this.targets()[0] as { value: number }).value;
          gsap.set(slider, { x: -dragX });
          update();
        },
      });

      wrap.setAttribute('aria-label', `Slide ${idx + 1} of ${slides.length}`);
    }

    // Observe visibility for keyboard nav
    const io = new IntersectionObserver((entries) => {
      active = entries[0].isIntersecting;
    }, { threshold: 0.25 });

    io.observe(initEl);

    // ARIA labels for accessibility
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-roledescription', 'carousel');
    wrap.setAttribute('aria-label', 'Testimonial slider');

    // Key listener
    function onKey(e: KeyboardEvent) {
      if (!active) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    }

    window.addEventListener('keydown', onKey);

    // Arrow button navigation
    const prevBtn = initEl.querySelector('[data-overlap-slider-prev]') as HTMLElement;
    const nextBtn = initEl.querySelector('[data-overlap-slider-next]') as HTMLElement;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }

    // Initial layout
    recalc();
  });
}

// Initialize animations when DOM is ready
function initAnimations() {
  // Initialize utility functions first
  initButtonCharacterStagger();
  initDetectScrollingDirection();

  // Header reveal animation
  initHeaderReveal();

  // Overlapping slider for testimonials
  initOverlappingSlider();

  // Hero elements
  const heroHeadline = document.querySelector('.hero__headline') as HTMLElement;
  const heroTagline = document.querySelector('.hero__tagline') as HTMLElement;
  const heroDescription = document.querySelector('.hero__description') as HTMLElement;
  const heroCta = document.querySelector('.hero__cta') as HTMLElement;
  const trustSignals = document.querySelectorAll('.trust-signals__item');

  // Hero headline - SplitText with mask for overflow hidden reveal
  if (heroHeadline) {
    gsap.set(heroHeadline, { autoAlpha: 1 });
    SplitText.create(heroHeadline, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      onSplit(instance: { lines: Element[] }) {
        return gsap.from(instance.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
          delay: 0.2,
        });
      },
    });
  }

  // Hero tagline - SplitText with mask
  if (heroTagline) {
    gsap.set(heroTagline, { autoAlpha: 1 });
    SplitText.create(heroTagline, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      onSplit(instance: { lines: Element[] }) {
        return gsap.from(instance.lines, {
          yPercent: 110,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out',
          delay: 0.5,
        });
      },
    });
  }

  // Hero description - SplitText with mask
  if (heroDescription) {
    gsap.set(heroDescription, { autoAlpha: 1 });
    SplitText.create(heroDescription, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      onSplit(instance: { lines: Element[] }) {
        return gsap.from(instance.lines, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.7,
        });
      },
    });
  }

  // Hero CTA
  if (heroCta) {
    gsap.fromTo(heroCta,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1 }
    );
  }

  // Trust signals
  if (trustSignals.length > 0) {
    gsap.fromTo(trustSignals,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1.2 }
    );
  }

  // Hero video container
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    gsap.fromTo(heroVideo,
      { autoAlpha: 0, y: 40, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.9 }
    );
  }

  // Hero signals (footer items)
  const heroSignals = document.querySelectorAll('.hero__signal');
  if (heroSignals.length > 0) {
    gsap.fromTo(heroSignals,
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 1.3 }
    );
  }

  // Section headlines with SplitText - scroll triggered
  const sectionHeadlines = document.querySelectorAll(
    '.how-it-works__headline, .why-us__headline, .portal__headline, .approach__headline, .testimonials__headline, .faq__headline, .final-cta__headline, .clients__headline, .features__headline, .compliance__headline'
  ) as NodeListOf<HTMLElement>;

  sectionHeadlines.forEach((headline) => {
    animateSplitLines(headline, {
      duration: 1,
      stagger: 0.12,
      start: 'top 85%',
    });
  });

  // Section descriptions/paragraphs with SplitText
  const sectionDescriptions = document.querySelectorAll(
    '.how-it-works__description, .portal__description, .approach__paragraph, .why-us__statement, .portal__closing'
  ) as NodeListOf<HTMLElement>;

  sectionDescriptions.forEach((desc) => {
    animateSplitLines(desc, {
      duration: 0.8,
      stagger: 0.06,
      start: 'top 88%',
    });
  });

  // How It Works steps - stagger animation
  const howItWorksSteps = document.querySelectorAll('.how-it-works__step');
  if (howItWorksSteps.length > 0) {
    gsap.fromTo(howItWorksSteps,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.how-it-works__steps',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Features cards - stagger animation
  const featureCards = document.querySelectorAll('.features__card');
  if (featureCards.length > 0) {
    gsap.fromTo(featureCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features__grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Compliance items - stagger animation
  const complianceItems = document.querySelectorAll('.compliance__item');
  if (complianceItems.length > 0) {
    gsap.fromTo(complianceItems,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.compliance__list',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Why Us benefits - stagger animation
  const whyUsBenefits = document.querySelectorAll('.why-us__benefit');
  if (whyUsBenefits.length > 0) {
    gsap.fromTo(whyUsBenefits,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.why-us__benefits',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Why Us image - clip-path reveal from top to bottom
  const whyUsImage = document.querySelector('.why-us__image-placeholder');
  if (whyUsImage) {
    gsap.fromTo(whyUsImage,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: whyUsImage,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Portal preview - scale in
  const portalPreview = document.querySelector('.portal__preview');
  if (portalPreview) {
    gsap.fromTo(portalPreview,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: portalPreview,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Portal features - stagger
  const portalFeatures = document.querySelectorAll('.portal__feature');
  if (portalFeatures.length > 0) {
    gsap.fromTo(portalFeatures,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.portal__features',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Testimonial slider section - reveal animation
  const testimonialSlider = document.querySelector('.testimonials__slider-wrap');
  if (testimonialSlider) {
    gsap.fromTo(testimonialSlider,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: testimonialSlider,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // FAQ items - stagger
  const faqItems = document.querySelectorAll('.faq__item');
  if (faqItems.length > 0) {
    gsap.fromTo(faqItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq__list',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Footer brand logo - reveal
  const footerBrandLogo = document.querySelector('.footer__logo');
  if (footerBrandLogo) {
    gsap.fromTo(footerBrandLogo,
      { opacity: 0, y: 40 },
      {
        opacity: 0.95,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerBrandLogo,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Clients cards - stagger
  const clientCards = document.querySelectorAll('.clients__card');
  if (clientCards.length > 0) {
    gsap.fromTo(clientCards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.clients__grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Final CTA section
  const finalCtaSubtext = document.querySelector('.final-cta__subtext') as HTMLElement;
  if (finalCtaSubtext) {
    animateSplitLines(finalCtaSubtext, {
      duration: 0.8,
      stagger: 0.06,
      y: 40,
      start: 'top 88%',
    });
  }

  const finalCtaBtn = document.querySelector('.final-cta__btn');
  if (finalCtaBtn) {
    gsap.fromTo(finalCtaBtn,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: finalCtaBtn,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Initialize footer parallax last
  initFooterParallax();
}

// Run animations after DOM is loaded AND fonts are ready
function startAnimations() {
  document.fonts.ready.then(() => {
    // Check if intro has already played (session storage set by IntroOverlay)
    if (sessionStorage.getItem('introPlayed')) {
      // Intro already played, start animations immediately
      initAnimations();
    } else {
      // Wait for intro to complete before starting animations
      window.addEventListener('introComplete', () => {
        initAnimations();
      }, { once: true });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startAnimations);
} else {
  startAnimations();
}

// Export for use in other scripts
export { lenis, gsap, ScrollTrigger };
