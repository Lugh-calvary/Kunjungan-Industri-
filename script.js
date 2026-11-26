/* ============================================================
   Kunjungan Industri BEI – Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }

  // ==================== PARTICLES ====================
  createParticles();

  // ==================== NAVBAR ====================
  initNavbar();

  // ==================== SMOOTH SCROLL ====================
  initSmoothScroll();

  // ==================== STAT COUNTER ====================
  initStatCounter();

  // ==================== GALLERY ====================
  initGallery();

  // ==================== LIGHTBOX ====================
  initLightbox();

  // ==================== VIDEO PLAYER ====================
  initVideoPlayer();

  // ==================== BACK TO TOP ====================
  initBackToTop();
});

/* ============================================================
   PARTICLES BACKGROUND
   ============================================================ */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 40;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    container.appendChild(particle);
  }
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink(navLinks);
  });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

function updateActiveNavLink(navLinks) {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
function initStatCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);

    element.textContent = current.toLocaleString('id-ID');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   GALLERY FILTER
   ============================================================ */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s both`;
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');

  if (!lightbox) return;

  let currentIndex = 0;
  let visibleItems = [];

  // Open lightbox on gallery item click
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      currentIndex = visibleItems.indexOf(item);
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    if (index < 0 || index >= visibleItems.length) return;
    currentIndex = index;

    const item = visibleItems[index];
    const overlay = item.querySelector('.gallery-overlay');
    const title = overlay ? overlay.querySelector('h4').textContent : '';
    const desc = overlay ? overlay.querySelector('p').textContent : '';

    // Update lightbox image
    const lightboxImageEl = document.getElementById('lightboxImage');
    const img = item.querySelector('img');
    if (img && lightboxImageEl) {
      // Replace placeholder with actual image
      lightboxImageEl.innerHTML = '';
      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.maxWidth = '100%';
      lightboxImg.style.maxHeight = '75vh';
      lightboxImg.style.borderRadius = '12px';
      lightboxImg.style.objectFit = 'contain';
      lightboxImageEl.style.border = 'none';
      lightboxImageEl.style.background = 'transparent';
      lightboxImageEl.appendChild(lightboxImg);
    } else if (lightboxImageEl) {
      // Reset to placeholder for items without images
      lightboxImageEl.innerHTML = '<i class="fas fa-image"></i><span>Preview Foto</span>';
      lightboxImageEl.style.border = '2px dashed rgba(255, 255, 255, 0.15)';
      lightboxImageEl.style.background = 'rgba(255, 255, 255, 0.05)';
    }

    lightboxCaption.textContent = `${title} — ${desc}`;
    lightboxCounter.textContent = `${index + 1} / ${visibleItems.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  });
  if (lightboxNext) lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  });

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });
}

/* ============================================================
   VIDEO PLAYER
   ============================================================ */
function initVideoPlayer() {
  const video = document.getElementById('vlogVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  const playBtn = document.getElementById('playBtn');

  if (!video || !overlay) return;

  function playVideo() {
    video.play().then(() => {
      overlay.classList.add('hidden');
    }).catch(() => {
      // If autoplay is blocked, show controls
      video.controls = true;
      overlay.classList.add('hidden');
    });
  }

  if (overlay) overlay.addEventListener('click', playVideo);
  if (playBtn) playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playVideo();
  });

  // Show overlay again when video ends
  if (video) {
    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
    });

    video.addEventListener('pause', () => {
      if (video.currentTime > 0 && !video.ended) {
        // Don't show overlay if paused mid-play
      }
    });
  }
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   FADE IN UP ANIMATION (for gallery filter)
   ============================================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);
