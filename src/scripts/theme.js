/**
 * CREVINOX — Luxury Theme Management System
 * Dual Dark Theme (Cyber Midnight) & Light Mode (Porcelain Alabaster)
 * 
 * Features:
 * - Instant zero-FOUC theme application
 * - LocalStorage persistence with graceful fallback
 * - System preference detection (prefers-color-scheme)
 * - Animated icon morphing for sun/moon toggle buttons
 * - Custom event 'crevinox-theme-change' dispatched to sync WebGL 3D canvas
 * - Multi-page support (index, 404, privacy, and services subpages)
 */

const THEME_STORAGE_KEY = 'crevinox_theme';

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {
    // LocalStorage restricted or unavailable
  }

  // If user OS prefers light, start with light, else luxury dark default
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function applyTheme(theme, persist = true) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }

  // Update mobile browser chrome color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#030712' : '#F8FAFC');
  }

  // Update all theme toggle elements
  const toggles = document.querySelectorAll('.nav-theme-toggle, #theme-toggle-btn, #mobile-theme-toggle');
  toggles.forEach(toggle => {
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Theme';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.classList.toggle('is-dark', isDark);
    toggle.classList.toggle('is-light', !isDark);

    // Update mobile text label if present
    const labelSpan = toggle.querySelector('.mobile-theme-text');
    if (labelSpan) {
      labelSpan.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
    const pillSpan = toggle.querySelector('.mobile-theme-pill');
    if (pillSpan) {
      pillSpan.textContent = isDark ? 'Dark' : 'Light';
    }
  });

  // Dispatch global event for 3D WebGL renderer and listeners
  window.dispatchEvent(new CustomEvent('crevinox-theme-change', {
    detail: { theme }
  }));
}

export function initTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || getInitialTheme();
  applyTheme(currentTheme, false);

  // Bind click handlers to all theme buttons
  function bindToggles() {
    const toggles = document.querySelectorAll('.nav-theme-toggle, #theme-toggle-btn, #mobile-theme-toggle');
    toggles.forEach(toggle => {
      // Avoid duplicate bindings
      if (toggle.dataset.themeBound) return;
      toggle.dataset.themeBound = 'true';

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const active = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = active === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    });
  }

  bindToggles();

  // Re-bind when mobile drawer opens or dynamic DOM renders
  document.addEventListener('DOMContentLoaded', bindToggles);

  // Listen to OS system color scheme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {}
    });
  }
}
