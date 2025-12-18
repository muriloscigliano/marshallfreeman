/**
 * Landing page content data
 * All text content for the single-page landing
 */

export const landingData = {
  // Hero Section
  hero: {
    headline: "Recover what's owed — without stress, pressure, or aggressive tactics.",
    description: 'We help Australian businesses recover overdue payments through a professional, ethical, and transparent recovery process — supported by a powerful online portal that gives you full visibility and control.',
    cta: {
      label: 'Get a Free Debt Appraisal',
      href: '#contact',
    },
    subtext: 'No commission unless we recover. 100% confidential.',
  },

  // Trust Signals (below hero)
  trustSignals: [
    {
      text: 'No recovery, no commission',
      icon: 'shield',
    },
    {
      text: 'Trusted by 20,000+ Australian businesses',
      icon: 'users',
    },
    {
      text: 'Ethical, compliant recovery approach',
      icon: 'check',
    },
    {
      text: 'Real-time tracking via secure online portal',
      icon: 'dashboard',
    },
  ],

  // How It Works Section
  howItWorks: {
    id: 'how-it-works',
    tagline: 'How It Works',
    headline: 'A simple, transparent process designed to give you confidence.',
    steps: [
      {
        number: '01',
        title: 'Submit your case',
        description: 'Add debtor details quickly through our secure platform.',
      },
      {
        number: '02',
        title: 'We begin professional recovery',
        description: 'Our specialists contact debtors respectfully and strategically, following strict compliance standards.',
      },
      {
        number: '03',
        title: 'Track progress in real time',
        description: 'View updates, communication history, and case status anytime through your online portal.',
      },
      {
        number: '04',
        title: 'We recover. You get paid.',
        description: 'You only pay commission when funds are successfully recovered.',
      },
    ],
  },

  // Why Choose Us Section
  whyUs: {
    id: 'why-us',
    tagline: 'Why Businesses Choose Marshall Freeman',
    headline: 'Built to reduce stress, protect relationships, and restore cashflow.',
    benefits: [
      'Recover overdue payments faster',
      'Stop wasting time chasing invoices',
      'Maintain your business reputation',
      'Gain full transparency and visibility',
      'Work with experienced recovery specialists',
      "Know exactly what's happening at every stage",
    ],
    statement: 'This is debt recovery designed for modern businesses.',
  },

  // Portal Section
  portal: {
    id: 'portal',
    tagline: 'The Online Portal',
    headline: 'Your debt management dashboard.',
    description: 'Submit jobs, monitor progress, and stay in control — all in one place.',
    features: [
      'Fast job submission',
      'Real-time case tracking',
      'Communication history and notes',
      'Secure document storage',
      'Payment plan monitoring',
      'Automated reminders and templates',
      'Clear reporting and insights',
    ],
    closing: 'Everything you need, without uncertainty or guesswork.',
  },

  // Our Approach Section
  approach: {
    tagline: 'Our Approach',
    headline: 'Ethical. Professional. Results-driven.',
    paragraphs: [
      "We don't believe in intimidation or outdated collection methods.",
      'Our approach focuses on respectful communication, strategic negotiation, and compliance — maximising recovery while protecting your reputation.',
    ],
    statement: 'We work as an extension of your business, not a threat to it.',
  },

  // Testimonials Section
  testimonials: {
    tagline: 'Social Proof',
    headline: 'Trusted by over 20,000 Australian businesses.',
    items: [
      {
        quote: 'Recovered over $40,000 in outstanding invoices within weeks. The process was clear and stress-free.',
        author: 'Construction Business Owner',
      },
      {
        quote: 'Professional, transparent, and effective. The portal gave us complete visibility.',
        author: 'Medical Practice Manager',
      },
      {
        quote: 'We finally stopped chasing payments ourselves. MF handled everything.',
        author: 'Retail Business Owner',
      },
    ],
    industries: 'Across construction, trades, medical, retail, professional services, and more.',
  },

  // FAQ Section
  faq: {
    id: 'faq',
    tagline: 'FAQ',
    headline: 'Common questions, clear answers.',
    items: [
      {
        question: 'Do you chase debtors aggressively?',
        answer: 'No. We use respectful, professional, and compliant communication at all times.',
      },
      {
        question: 'What if nothing is recovered?',
        answer: 'You pay no commission.',
      },
      {
        question: "How do I know what's happening?",
        answer: 'All activity, updates, and progress are visible in real time via your online portal.',
      },
      {
        question: 'Is this compliant with Australian regulations?',
        answer: 'Yes. We follow strict legal and industry compliance standards.',
      },
      {
        question: 'How long does recovery take?',
        answer: 'Each case is different, but action begins immediately once submitted.',
      },
    ],
  },

  // Final CTA Section
  finalCta: {
    id: 'contact',
    headline: 'Take control of your overdue payments today.',
    cta: {
      label: 'Get a Free Debt Appraisal',
      href: '#contact',
    },
    subtext: 'No pressure. No commission unless we recover. Completely confidential.',
  },
} as const;

export type LandingData = typeof landingData;
