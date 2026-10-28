import '../styles/index.css';
import { initNavigation } from './navigation.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initAnalytics, trackEvent } from './analytics.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Navigation
  initNavigation();

  // 2. Initialize Scroll Reveal Observers
  initScrollReveal();

  // 3. Initialize Analytics Telemetry
  initAnalytics();

  // 4. Initialize FAQ Accordion Handlers
  initFaqAccordions();
});

function initFaqAccordions() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains('is-open');

      // Close other accordions for sleek single-open behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('is-open');
          item.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        parentItem.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        trackEvent('faq_accordion_open', {
          question: btn.textContent.trim()
        });
      }
    });
  });
}
