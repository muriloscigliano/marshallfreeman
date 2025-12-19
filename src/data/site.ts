/**
 * Site-wide metadata and configuration
 * Central location for all content that may need updates
 */

export const siteConfig = {
  name: 'Marshall Freeman',
  title: 'Marshall Freeman | Professional Debt Recovery for Australian Businesses',
  description: 'Recover overdue payments without stress. Professional, ethical debt recovery with full transparency via our online portal. No recovery, no commission.',
  url: 'https://marshallfreeman.com.au',
  locale: 'en_AU',
  author: 'Marshall Freeman',
  twitterHandle: '@marshallfreeman',

  // Default OG image
  ogImage: '/og-image.jpg',

  // Navigation (anchor links for landing page)
  navigation: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Portal', href: '#portal' },
    { label: 'FAQ', href: '#faq' },
  ],

  // CTA buttons
  cta: {
    primary: { label: 'Get a Free Debt Appraisal', href: '#contact' },
    login: { label: 'Client Login', href: '/login' },
  },

  // Footer navigation
  footerNavigation: {
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Ethics & Compliance', href: '/ethics' },
    ],
  },

  // Contact info - Australia
  contactAU: {
    country: 'Australia',
    company: 'Marshall Freeman Collections Pty Ltd',
    phone: '1300 136 271',
    email: 'info@marshallfreeman.com.au',
  },

  // Contact info - New Zealand
  contactNZ: {
    country: 'New Zealand',
    company: 'Marshall Freeman Collections (NZ) Limited',
    phone: '09 580 2444',
    email: 'info@marshallfreeman.co.nz',
  },

  // Footer content
  footer: {
    tagline: 'Professional debt recovery for Australian and New Zealand businesses.',
    headings: {
      navigate: 'Navigate',
      legal: 'Legal',
    },
    disclaimer: 'Registered debt collection agency',
  },
} as const;

export type SiteConfig = typeof siteConfig;
