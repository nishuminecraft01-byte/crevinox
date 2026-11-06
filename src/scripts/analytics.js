import { SEO_CONFIG } from '../config/seo.js';

/**
 * CREVINOX — Conversion & Event Telemetry Module
 * 
 * Safely tracks business-critical conversion actions (form inquiries,
 * portfolio views, CTA interactions) in Google Analytics 4.
 */

export function initAnalytics() {
  const measurementId = window.CREVINOX_GA_ID || SEO_CONFIG.analytics.ga4MeasurementId;

  // Only inject gtag if a real, valid GA4 ID (starting with G-) is configured
  if (measurementId && measurementId.startsWith('G-') && measurementId !== 'G-XXXXXXXXXX') {
    loadGtagScript(measurementId);
  } else {
    // Development mode helper
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[CREVINOX Analytics] Running in local/unconfigured mode. Events will log to console without third-party beacons.');
    }
  }

  // Bind conversion tracking to interactive elements across the site
  bindConversionEvents();
}

/**
 * Injects Google tag script securely with async attributes
 */
function loadGtagScript(id) {
  if (document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', id, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
}

/**
 * Universal Event Dispatcher
 */
export function trackEvent(eventName, eventParams = {}) {
  // If gtag is available, dispatch to GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  // Developer feedback
  if (window.location.hostname === 'localhost') {
    console.debug(`[Telemetry Event: ${eventName}]`, eventParams);
  }
}

/**
 * Attach telemetry hooks to interactive CTA links and email
 */
function bindConversionEvents() {
  // 1. Email Direct Click Tracking
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('email_click', {
        event_category: 'lead_engagement',
        event_label: link.getAttribute('href')
      });
    });
  });

  // 3. Primary CTA Click Tracking
  document.querySelectorAll('.btn-primary, .nav-cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim().replace(/\s+/g, ' ');
      trackEvent('primary_cta_click', {
        event_category: 'conversion_funnel',
        event_label: text
      });
    });
  });

  // 4. Portfolio Project Card Click Tracking
  document.querySelectorAll('.project-card, .open-project-btn').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title')?.textContent.trim() || 'Project Inspection';
      trackEvent('portfolio_project_click', {
        event_category: 'work_showcase',
        project_name: title
      });
    });
  });
}
