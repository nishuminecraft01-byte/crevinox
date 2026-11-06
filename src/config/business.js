/**
 * CREVINOX — Centralized Official Business Configuration
 * 
 * Central registry for official business information, verified social profiles,
 * and contact channels. Fields marked as [CONFIGURABLE] can be updated
 * by the website owner as official contact information changes.
 */

export const BUSINESS_CONFIG = {
  // Brand & Company Identity
  brandName: 'CREVINOX',
  legalName: 'CREVINOX Digital Studio',
  tagline: "WE BUILD WHAT'S NEXT.",
  websiteUrl: 'https://crevinox.com/',

  // Official Social Media Profiles
  social: {
    // Official Instagram profile provided by the website owner
    instagram: {
      handle: '@crevinox',
      username: 'crevinox',
      url: 'https://www.instagram.com/crevinox/',
      isVerified: true
    }
  },

  // Official Direct Communication Channels
  contact: {
    // Official Business email addresses
    email: 'crewinox@gmail.com',
    emails: ['crewinox@gmail.com'],
    isEmailVerified: true,

    // [CONFIGURABLE] Official business telephone
    telephone: '', // e.g. '+91-XXXXXXXXXX'

    // [CONFIGURABLE] Official studio location or operating jurisdictions
    location: 'Global Digital Studio'
  }
};
