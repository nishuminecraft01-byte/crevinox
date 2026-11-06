/**
 * CREVINOX — Master SEO & Business Configuration
 * 
 * Central registry for canonical URLs, business schema, analytics,
 * and search engine verification tokens.
 */

export const SEO_CONFIG = {
  // Production Domain (Replace with client's actual custom domain upon DNS deployment)
  siteUrl: 'https://crevinox.com',
  siteName: 'CREVINOX',
  defaultTitle: 'CREVINOX | Website Design & Development Agency',
  defaultDescription: 'CREVINOX creates premium, responsive websites for businesses, brands and growing companies. Explore our web design, development and digital solutions.',
  tagline: "WE BUILD WHAT'S NEXT.",

  // Official Business Identity (Updated with verified business contact channels)
  business: {
    legalName: 'CREVINOX Digital Studio',
    brandName: 'CREVINOX',
    email: 'crewinox@gmail.com',
    operatingModel: 'Independent Global Digital Studio & Web Development Agency',
    serviceAreas: ['Global', 'India', 'United States', 'United Kingdom', 'United Arab Emirates'],
    priceRange: '$$$',
    logoUrl: 'https://crevinox.com/crevinox-logo.png',
    ogImageUrl: 'https://crevinox.com/crevinox-og-banner.jpg',
    sameAs: [
      // Official verified company social profile:
      'https://www.instagram.com/crevinox/'
    ]
  },

  // Google Analytics 4 & Tag Manager (Leave placeholder until client inputs their G-XXXXXX ID)
  analytics: {
    ga4MeasurementId: '', // e.g., 'G-XXXXXXXXXX'
    googleSiteVerification: '' // e.g., 'google-site-verification=abc123xyz'
  },

  // Service Pages Registry for Sitemaps & Internal Linking
  services: [
    {
      slug: 'website-development',
      path: '/services/website-development/',
      title: 'Custom Website Design & Development Services | CREVINOX',
      metaDescription: 'High-performance bespoke websites built with modern web technologies, responsive layouts, 60fps animations, and business-focused conversion architecture.',
      h1: 'BESPOKE WEBSITE DESIGN & DEVELOPMENT',
      category: 'Core Service',
      keywords: ['Website development agency', 'Custom website design', 'Professional website development', 'Responsive web development']
    },
    {
      slug: 'business-websites',
      path: '/services/business-websites/',
      title: 'Professional Business Website Development | CREVINOX',
      metaDescription: 'Authoritative, credible business websites engineered for companies and ambitious startups to command authority and generate qualified inquiries.',
      h1: 'HIGH-IMPACT BUSINESS WEBSITES',
      category: 'Corporate & SME',
      keywords: ['Business website development', 'Website design company for business', 'Corporate website design']
    },
    {
      slug: 'ecommerce-development',
      path: '/services/ecommerce-development/',
      title: 'Luxury E-Commerce Experiences & Online Stores | CREVINOX',
      metaDescription: 'Bespoke e-commerce solutions and luxury product showcases engineered for high-average-order-value brands with frictionless checkout flows.',
      h1: 'BESPOKE E-COMMERCE EXPERIENCES',
      category: 'Commerce Solutions',
      keywords: ['E-commerce website development', 'Luxury online store development', 'Custom e-commerce design']
    },
    {
      slug: 'landing-page-design',
      path: '/services/landing-page-design/',
      title: 'High-Converting Landing Page Design & Development | CREVINOX',
      metaDescription: 'Strategic, high-speed landing pages engineered for paid campaigns, product launches, and lead capture with uncompromising visual excellence.',
      h1: 'HIGH-CONVERTING LANDING PAGES',
      category: 'Performance Marketing',
      keywords: ['Landing page design', 'Conversion rate optimization landing pages', 'Campaign landing pages']
    },
    {
      slug: 'website-redesign',
      path: '/services/website-redesign/',
      title: 'Website Redesign, Optimization & Speed Tuning | CREVINOX',
      metaDescription: 'Transform outdated websites into modern, 60fps digital experiences with Core Web Vitals optimization and modern technical architecture.',
      h1: 'WEBSITE REDESIGN & PERFORMANCE TUNING',
      category: 'Optimization & Modernization',
      keywords: ['Website redesign services', 'Website performance optimization', 'Core Web Vitals speed optimization']
    }
  ]
};
