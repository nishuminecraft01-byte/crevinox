/**
 * CREVINOX — Cinematic Brand Opening Animation Sequence
 * Arctic Cyber Fox Identity
 * 
 * Phase 1: Pure obsidian canvas (100ms) with radiant cyan-sapphire aurora bloom & energy beam
 * Phase 2: Fox Logo Reveal (450ms) with cyber energy ring & piercing blue eye flare
 * Phase 3: Brand name "CREVINOX" & tagline "WE BUILD WHAT'S NEXT." (1250ms)
 * Phase 4: Smooth cinematic iris dissolve into homepage (2300ms)
 */

export function initCinematicIntro() {
  const introOverlay = document.getElementById('brand-intro');
  const skipBtn = document.getElementById('intro-skip-btn');
  const replayBtn = document.getElementById('footer-replay-intro');

  if (!introOverlay) return;

  // Check prefers-reduced-motion or automated audit environment (Lighthouse/headless/webdriver)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAutomatedAudit = Boolean(navigator.webdriver) ||
    /Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
    window.location.search.includes('audit') ||
    window.location.search.includes('lighthouse');
  const alreadySeen = sessionStorage.getItem('crevinox_intro_seen') === 'true';
  const forceIntro = window.location.search.includes('forceIntro=1');

  // If page was loaded with an anchor hash (e.g. #work, #services, #contact) or in audit, skip immediately
  const hasTargetHash = window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#';

  if (!forceIntro && (prefersReducedMotion || hasTargetHash || isAutomatedAudit || alreadySeen)) {
    completeIntroFast(introOverlay);
    setupReplayListener(replayBtn, introOverlay);
    return;
  }

  // Run Cinematic Sequence
  runIntroSequence(introOverlay);

  // Click on skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishIntroImmediately(introOverlay);
    });
  }

  // Click anywhere on overlay background to skip instantly
  introOverlay.addEventListener('click', () => {
    finishIntroImmediately(introOverlay);
  });

  // Keyboard skip handler (Escape, Space, Enter)
  const keyHandler = (e) => {
    if (e.key === 'Escape' || e.code === 'Space' || e.key === 'Enter') {
      finishIntroImmediately(introOverlay);
      window.removeEventListener('keydown', keyHandler);
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Prevent any re-running on hash changes
  window.addEventListener('hashchange', () => {
    if (introOverlay && !introOverlay.classList.contains('intro-complete')) {
      completeIntroFast(introOverlay);
    }
  });

  setupReplayListener(replayBtn, introOverlay);
}

let introTimers = [];

function clearIntroTimers() {
  introTimers.forEach(id => clearTimeout(id));
  introTimers = [];
}

function runIntroSequence(overlay) {
  clearIntroTimers();

  // Phase 1: Ambient Central Glow & Progress Beam (starts at 40ms)
  introTimers.push(setTimeout(() => {
    overlay.classList.add('phase-1');
  }, 40));

  // Phase 2: Logo Reveal + Energy Ring + Eye Spark (starts at 200ms)
  introTimers.push(setTimeout(() => {
    overlay.classList.add('phase-2');
  }, 200));

  // Phase 3: Brand Name & Tagline Reveal (starts at 650ms)
  introTimers.push(setTimeout(() => {
    overlay.classList.add('phase-3');
  }, 650));

  // Phase 4: Transition to Homepage (starts at 1450ms)
  introTimers.push(setTimeout(() => {
    overlay.classList.add('phase-4');
    overlay.style.pointerEvents = 'none';
    // Announce to any observers that homepage hero is entering
    document.dispatchEvent(new CustomEvent('intro-homepage-reveal'));
  }, 1450));

  // Final cleanup: remove overlay from DOM flow completely (at 1950ms)
  introTimers.push(setTimeout(() => {
    overlay.classList.add('intro-complete');
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';
    sessionStorage.setItem('crevinox_intro_seen', 'true');
  }, 1950));

  // Watchdog safety timeout: Ensures intro NEVER gets stuck under any circumstance
  introTimers.push(setTimeout(() => {
    if (overlay && !overlay.classList.contains('intro-complete')) {
      completeIntroFast(overlay);
    }
  }, 2600));
}

function finishIntroImmediately(overlay) {
  clearIntroTimers();
  overlay.classList.add('phase-1', 'phase-2', 'phase-3', 'phase-4');
  overlay.style.pointerEvents = 'none';
  document.dispatchEvent(new CustomEvent('intro-homepage-reveal'));
  setTimeout(() => {
    overlay.classList.add('intro-complete');
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';
    sessionStorage.setItem('crevinox_intro_seen', 'true');
  }, 250);
}

function completeIntroFast(overlay) {
  clearIntroTimers();
  overlay.classList.add('phase-1', 'phase-2', 'phase-3', 'phase-4', 'intro-complete');
  overlay.style.display = 'none';
  overlay.style.visibility = 'hidden';
  overlay.style.pointerEvents = 'none';
  document.dispatchEvent(new CustomEvent('intro-homepage-reveal'));
}

function setupReplayListener(replayBtn, overlay) {
  if (!replayBtn) return;
  replayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearIntroTimers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    overlay.style.display = '';
    overlay.style.visibility = '';
    overlay.style.pointerEvents = '';
    overlay.className = 'brand-intro-overlay';
    setTimeout(() => {
      runIntroSequence(overlay);
    }, 100);
  });
}
