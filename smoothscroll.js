// ==================== ENHANCED SMOOTH SCROLL EFFECT ====================
// Provides smooth section-to-section scrolling with easing

(function() {
  'use strict';

  // Easing function for smooth animations
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Smooth scroll to element with easing
  function smoothScrollTo(element, duration = 800) {
    const start = window.scrollY;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const distance = elementPosition - start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, start + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  // Initialize smooth scroll for all anchor links
  function initSmoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#' || href === '') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          smoothScrollTo(targetElement, 800);
        }
      });
    });
  }

  // Intersection Observer for section highlighting/tracking
  function initSectionObserver() {
    const sections = document.querySelectorAll('section, .hero-section, .content-section, .gallery-section');
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-50px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            // Update URL without reloading
            window.history.replaceState({}, '', `#${id}`);
            
            // Update active nav links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        initSmoothScrollLinks();
        initSectionObserver();
      }, 100);
    });
  } else {
    setTimeout(() => {
      initSmoothScrollLinks();
      initSectionObserver();
    }, 100);
  }

  // Re-initialize on dynamic content changes
  window.reinitSmoothScroll = function() {
    initSmoothScrollLinks();
    initSectionObserver();
  };

})();


function smoothScrollTo(element, duration = 800) {
  // Temporarily disable snap so JS scroll isn't fought by CSS
  document.documentElement.style.scrollSnapType = 'none';

  const start = window.scrollY;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const distance = elementPosition - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      // Re-enable snap after scroll finishes
      document.documentElement.style.scrollSnapType = '';
    }
  }

  requestAnimationFrame(animation);
}
