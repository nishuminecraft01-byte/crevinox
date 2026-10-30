/**
 * CREVINOX — Navigation & Mobile Drawer Controller
 */

export function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // 1. Header scroll effect with rAF throttling (Zero layout recalculation)
  let ticking = false;
  let isScrolled = false;
  const updateScrollState = () => {
    if (!header) return;
    const shouldScroll = window.scrollY > 30;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      header.classList.toggle('scrolled', isScrolled);
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // High-performance IntersectionObserver for scroll spy (0 forced reflows)
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          if (currentId) {
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // 2. Mobile drawer open/close
  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('is-open');
    if (shouldOpen) {
      mobileDrawer.classList.add('is-open');
      mobileBackdrop.classList.add('is-open');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('is-open');
      mobileBackdrop.classList.remove('is-open');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // 3. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
