// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== YEAR =====
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const indicator = document.querySelector('.nav-indicator');
  const sections = ['home', 'about', 'skills', 'projects', 'services', 'contact'];

  function updateIndicator(activeLink) {
    if (!activeLink || !indicator) return;
    const pill = activeLink.parentElement;
    const pillRect = pill.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicator.style.left = (linkRect.left - pillRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
  }

  function setActiveSection(id) {
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === id);
      if (l.dataset.section === id) updateIndicator(l);
    });
    drawerLinks.forEach(l => {
      const href = l.getAttribute('href').slice(1);
      l.classList.toggle('active', href === id);
    });
  }

  // Initialize indicator
  const firstActive = document.querySelector('.nav-link.active');
  if (firstActive) setTimeout(() => updateIndicator(firstActive), 100);

  window.addEventListener('scroll', () => {
    // Navbar background
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active section detection
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.getBoundingClientRect().top <= 120) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, { passive: true });

  // ===== MOBILE MENU =====
  const navToggle = document.getElementById('navToggle');
  const overlay = document.getElementById('mobileOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openMenu() {
    overlay.classList.add('open');
    navToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });
  drawerClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });
  drawerLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.querySelector('.drawer-cta').addEventListener('click', closeMenu);

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered delay from CSS variable
        const delay = getComputedStyle(entry.target).getPropertyValue('--delay');
        if (delay) {
          setTimeout(() => entry.target.classList.add('visible'), parseFloat(delay) * 1000);
        } else {
          entry.target.classList.add('visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-60px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== SKILL PROGRESS BARS =====
  const progressBars = document.querySelectorAll('.progress-bar');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // ===== PROJECT FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ===== TESTIMONIALS CAROUSEL (MOBILE) =====
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;

  // Create dots
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = index;
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('carousel-active', i === index);
    });
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Initialize first card
  goToSlide(0);

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? testimonialCards.length - 1 : currentSlide - 1);
  });
  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide === testimonialCards.length - 1 ? 0 : currentSlide + 1);
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('formToast');

  function showToast(type, message) {
    toast.className = 'form-toast ' + type + ' show';
    toast.querySelector('.toast-message').textContent = message;
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.classList.add('loading');

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then((res) => {
      submitBtn.classList.remove('loading');
      if (res.ok) {
        showToast('success', 'Message sent! I\'ll get back to you soon.');
        contactForm.reset();
      } else {
        showToast('error', 'Something went wrong. Please try again.');
      }
    })
    .catch(() => {
      submitBtn.classList.remove('loading');
      showToast('error', 'Network error. Please check your connection.');
    });
  });

  // ===== BACK TO TOP =====
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
