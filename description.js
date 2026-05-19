/* ── Scroll reveal fallback (only for browsers without CSS scroll-driven animations) ── */
if (!CSS.supports('animation-timeline', 'view()')) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ── Media toggle ── */
const tabs           = document.querySelectorAll('.media-tab');
const fsImg          = document.getElementById('fullscreen-img');
const imgPh          = document.getElementById('img-ph');
const videoContainer = document.getElementById('video-container');
const videoPlayer    = document.getElementById('video-player');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (tab.dataset.mode === 'image') {
      fsImg.style.display = '';
      videoContainer.classList.remove('visible');
      videoPlayer.pause();
    } else {
      fsImg.style.display = 'none';
      imgPh.style.display = 'none';
      videoContainer.classList.add('visible');
    }
  }, { passive: true });
});

/* ── Lightbox ── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
let currentIdx  = 0;
let photoCards  = [];

function cachePhotoCards() {
  photoCards = [...document.querySelectorAll('.photo-card')]
    .filter(c => c.style.display !== 'none' && c.querySelector('img'));
}

function getCards() {
  return photoCards.length ? photoCards : cachePhotoCards();
}

function openLightbox(idx) {
  const cards = getCards();
  if (!cards[idx]) return;
  currentIdx = idx;
  const src = cards[idx].querySelector('img').src;
  lbImg.src = src;
  lbImg.alt = cards[idx].querySelector('img').alt;
  lbCounter.textContent = `${idx + 1} / ${cards.length}`;
  lbImg.style.willChange = 'transform, opacity'; /* promote only while open */
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  /* release GPU layer after transition ends */
  lightbox.addEventListener('transitionend', () => {
    lbImg.style.willChange = 'auto';
  }, { once: true });
}

function navigate(dir) {
  const cards = getCards();
  currentIdx = (currentIdx + dir + cards.length) % cards.length;
  lbImg.style.opacity = '0';
  lbImg.style.transform = 'scale(0.95)';
  requestAnimationFrame(() => {
    lbImg.src = cards[currentIdx].querySelector('img').src;
    lbImg.style.transition = 'none';
    requestAnimationFrame(() => {
      lbImg.style.transition = '';
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    });
    lbCounter.textContent = `${currentIdx + 1} / ${cards.length}`;
  });
}

/* Event delegation for gallery clicks */
const photoMasonry = document.getElementById('photo-masonry');
photoMasonry?.addEventListener('click', (e) => {
  const card = e.target.closest('.photo-card');
  if (card) {
    const idx = Array.from(photoMasonry.querySelectorAll('.photo-card')).indexOf(card);
    openLightbox(idx);
  }
});

document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
document.getElementById('lb-prev')?.addEventListener('click', () => navigate(-1));
document.getElementById('lb-next')?.addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
}, { passive: true });

/* Touch/swipe in lightbox */
let touchX = 0;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
}, { passive: true });

/* Cache photo cards on load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cachePhotoCards);
} else {
  cachePhotoCards();
}