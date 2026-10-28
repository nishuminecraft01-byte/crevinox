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

    // [CONFIGURABLE] Owner's verified business WhatsApp number
    // Format: international phone without '+' or spaces, e.g., '919876543210'
    whatsappNumber: '', // Owner can input their direct phone/WhatsApp number here
    whatsappPrefilledMessage: "Hi CREVINOX! I'm interested in getting a website developed for my business.",

    // [CONFIGURABLE] Official business telephone (if separate from WhatsApp)
    telephone: '', // e.g. '+91-XXXXXXXXXX'

    // [CONFIGURABLE] Official studio location or operating jurisdictions
    location: 'Global Digital Studio'
  },

  // Helper method to construct the official WhatsApp dispatch URL
  getWhatsAppUrl() {
    const text = encodeURIComponent(this.contact.whatsappPrefilledMessage);
    if (this.contact.whatsappNumber && this.contact.whatsappNumber.trim()) {
      const cleanNum = this.contact.whatsappNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNum}?text=${text}`;
    }
    // Fallback: Opens WhatsApp interface with pre-filled message ready to send
    return `https://wa.me/?text=${text}`;
  }
};
