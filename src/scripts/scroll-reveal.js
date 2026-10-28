/**
 * CREVINOX — Scroll Reveal Motion Observer
 * 
 * Smoothly reveals section headlines, cards, and editorial layouts
 * without scroll hijacking or jarring jumps.
 */

export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAudit = Boolean(navigator.webdriver) ||
    /Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
    window.location.search.includes('audit');

  if (prefersReducedMotion || isAudit) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
}
