/* ============================================================
   TOP-AI TECHNOLOGIES — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  initBrandAnimation();
  initLoadingScreen();
  initStickyHeader();
  initHamburgerMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounterAnimations();
  initPortfolioFilter();
  initFAQAccordion();
  initContactForm();
  initExitIntent();
});

/* ── BRAND ANIMATION — "Technologies" letter scroll ──────── */
function initBrandAnimation() {
  const container = document.getElementById('brand-technologies');
  if (!container) return;

  const text = 'Technologies';
  container.innerHTML = '';

  // Animate letters one by one with stagger delay
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char;
    span.style.animationDelay = `${0.5 + i * 0.08}s`;
    container.appendChild(span);
  });
}

/* ── LOADING SCREEN ───────────────────────────────────────── */
function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  const dismiss = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Block scroll while loading
  document.body.style.overflow = 'hidden';

  // Dismiss after animation (2.5s fill + 0.3s buffer)
  setTimeout(dismiss, 2800);

  // Also dismiss on load if it takes longer
  window.addEventListener('load', () => {
    setTimeout(dismiss, 500);
  });
}

/* ── STICKY HEADER ────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── HAMBURGER MENU ───────────────────────────────────────── */
function initHamburgerMenu() {
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!btn || !overlay) return;

  const toggle = () => {
    const isActive = btn.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    btn.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  btn.addEventListener('click', toggle);

  // Close on link click
  overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      overlay.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── SCROLL ANIMATIONS (Intersection Observer) ────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger animation for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.anim-fade-up');
        let staggerIndex = 0;
        siblings.forEach((sibling, i) => {
          if (sibling === entry.target) staggerIndex = i;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(staggerIndex * 80, 400));

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── COUNTER ANIMATIONS ──────────────────────────────────── */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.trust-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── PORTFOLIO FILTER ─────────────────────────────────────── */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      items.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        if (matches) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ── FAQ ACCORDION ────────────────────────────────────────── */
function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── CONTACT FORM → WHATSAPP ──────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear errors
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Gather fields
    const name = form.querySelector('#cf-name');
    const email = form.querySelector('#cf-email');
    const phone = form.querySelector('#cf-phone');
    const company = form.querySelector('#cf-company');
    const service = form.querySelector('#cf-service');
    const description = form.querySelector('#cf-description');
    const startDate = form.querySelector('#cf-date');

    let valid = true;

    // Validate
    if (!name.value.trim()) {
      showError(name, 'err-name', 'Name is required');
      valid = false;
    }
    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'err-email', 'Valid email is required');
      valid = false;
    }
    if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
      showError(phone, 'err-phone', 'Valid phone number is required');
      valid = false;
    }
    if (!service.value) {
      showError(service, 'err-service', 'Please select a service');
      valid = false;
    }
    if (!description.value.trim()) {
      showError(description, 'err-description', 'Please describe your project');
      valid = false;
    }

    if (!valid) return;

    // Construct WhatsApp message
    const message = `Hi Top-Ai Technologies! 👋

I'm interested in your services. Here are my details:

📋 *PROJECT INQUIRY*

👤 Name: ${name.value.trim()}
📧 Email: ${email.value.trim()}
📱 Phone: ${phone.value.trim()}
🏢 Company: ${company.value.trim() || 'N/A'}

🎯 Service Needed: ${service.value}

📝 Project Details:
${description.value.trim()}

📅 Expected Start: ${startDate.value || 'Flexible'}

Please share the best price and get back to me at your earliest convenience.

Thank you! 🙏`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919958760596?text=${encoded}`;

    // Open WhatsApp
    window.open(url, '_blank');
  });

  function showError(input, errorId, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ── EXIT INTENT POPUP ────────────────────────────────────── */
function initExitIntent() {
  const popup = document.getElementById('exit-popup');
  const closeBtn = document.getElementById('exit-popup-close');
  const dismissBtn = document.getElementById('exit-popup-dismiss');
  const ctaBtn = document.getElementById('exit-popup-cta');

  if (!popup) return;

  let shown = false;

  const show = () => {
    if (shown) return;
    shown = true;
    popup.classList.add('active');
  };

  const hide = () => {
    popup.classList.remove('active');
  };

  // Exit intent: mouse leaves top of viewport (desktop only)
  document.addEventListener('mouseout', (e) => {
    if (e.clientY <= 5 && !shown) {
      // Small delay to avoid false triggers
      setTimeout(show, 200);
    }
  });

  // Also show after 45 seconds on page as fallback
  setTimeout(() => {
    if (!shown) show();
  }, 45000);

  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (dismissBtn) dismissBtn.addEventListener('click', hide);
  if (ctaBtn) ctaBtn.addEventListener('click', hide);

  // Close on overlay click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) hide();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
}
