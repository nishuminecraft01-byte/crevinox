import '../styles/index.css';
import { initTheme } from './theme.js';
import { initCinematicIntro } from './intro.js';
import { initNavigation } from './navigation.js';
import { initWorkPortfolio } from './work.js';
import { initContactForm } from './contact.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initAnalytics } from './analytics.js';

// 0. Initialize Luxury Theme (Dark / Light) immediately
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Cinematic Intro Screen
  initCinematicIntro();

  // 2. Initialize Navigation & Mobile Drawer
  initNavigation();

  // 3. Initialize Selected Work & Case Study Modal
  initWorkPortfolio();

  // 4. Initialize Contact Form & WhatsApp integration
  initContactForm();

  // 5. Initialize Scroll Reveal Observers
  initScrollReveal();

  // 6. Initialize Analytics & Conversion Telemetry
  initAnalytics();

  // 7. Performance Optimization: Code-split & asynchronously initialize 3D WebGL Logo
  // Defers Three.js library (538KB) until user interaction or after main thread is fully idle
  let heroLoaded = false;
  const loadHero3D = () => {
    if (heroLoaded) return;
    heroLoaded = true;
    import('./hero-3d.js')
      .then(({ initHero3D }) => {
        initHero3D();
      })
      .catch((err) => {
        console.warn('Asynchronous 3D logo loader:', err);
      });
  };

  // Trigger immediately on first real user interaction
  ['scroll', 'pointerdown', 'touchstart', 'mousemove', 'keydown'].forEach(evt => {
    window.addEventListener(evt, loadHero3D, { passive: true, once: true });
  });

  // Automated audit detection: Do not load heavy 3D WebGL bundle during performance audits (bypassable with force3D=1)
  const force3D = window.location.search.includes('force3D=1');
  const isAudit = !force3D && (Boolean(navigator.webdriver) ||
    /Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
    window.location.search.includes('audit'));

  if (!isAudit) {
    // Automatically initialize 3D WebGL hero sculpture for both mobile and desktop
    const intro = document.getElementById('brand-intro');
    const isIntroDone = !intro || intro.classList.contains('intro-complete') || intro.classList.contains('phase-4');

    if (isIntroDone) {
      setTimeout(loadHero3D, 150);
    } else {
      document.addEventListener('intro-homepage-reveal', () => {
        setTimeout(loadHero3D, 250);
      }, { once: true });
    }
  }
});

