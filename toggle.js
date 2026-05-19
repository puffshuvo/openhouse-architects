(function () {
  'use strict';

  var easeInOutCubic = function(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // ==================== NAV TOGGLE ====================
  document.addEventListener('DOMContentLoaded', function () {

    var header = document.querySelector('.top-header');
    var nav    = document.querySelector('.dropdown-nav');
    if (!header || !nav) return;

    // --- Inject hamburger button ---
    var btn = document.createElement('button');
    btn.className = 'nav-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="bar"></span>' +
      '<span class="bar"></span>' +
      '<span class="bar"></span>';
    header.appendChild(btn);

    function openNav()  {
      nav.classList.add('nav-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closeNav() {
      nav.classList.remove('nav-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    // Button tap (mobile/tablet)
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });

    // Close when nav link tapped
    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeNav);
    }

    // Close on outside tap/click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && !nav.contains(e.target)) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Desktop: keep original CSS hover working — JS doesn't interfere
    // The CSS .top-header:hover .dropdown-nav rule still does the job on desktop
  });

  // ==================== SMOOTH SCROLL ====================
  function smoothScrollTo(element, duration) {
    duration = duration || 800;
    document.documentElement.style.scrollSnapType = 'none';
    var start    = window.scrollY;
    var target   = element.getBoundingClientRect().top + window.scrollY;
    var distance = target - start;
    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var elapsed  = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        document.documentElement.style.scrollSnapType = '';
      }
    }
    requestAnimationFrame(step);
  }

  function initSmoothScrollLinks() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, 800);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(initSmoothScrollLinks, 100);
    });
  } else {
    setTimeout(initSmoothScrollLinks, 100);
  }

  window.reinitSmoothScroll = initSmoothScrollLinks;

})();