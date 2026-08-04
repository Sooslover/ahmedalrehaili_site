// ========================================
// CONTACT FORM CONFIGURATION
// ========================================
// Choose one of the following services and add your credentials:

// OPTION 1: FORMSPREE (Recommended - Easiest Setup)
// 1. Go to https://formspree.io/
// 2. Sign up for a free account
// 3. Create a new form and get your form ID
// 4. Replace 'YOUR_FORM_ID' below with your actual form ID
const CONTACT_CONFIG = {
  service: 'formspree', // Options: 'formspree' or 'emailjs'
  formspree: {
    formId: 'mgvnjorq' // Your Formspree form ID
  },
  // OPTION 2: EMAILJS (More Features)
  // 1. Go to https://www.emailjs.com/
  // 2. Sign up and create an email service
  // 3. Create an email template
  // 4. Get your User ID, Service ID, and Template ID
  emailjs: {
    userId: '040f9f3d5a6ffd4c6c139776c9e30b41',
    serviceId: 'YOUR_SERVICE_ID', // Still needed: Get from EmailJS Email Services
    templateId: 'YOUR_TEMPLATE_ID' // Still needed: Get from EmailJS Email Templates
  }
};

// ========================================
// Theme Management
// ========================================
const themeToggle = () => {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('prefers-dark', isDark ? '1' : '0');

  // Add smooth transition
  root.style.transition = 'background 0.3s ease, color 0.3s ease';
};

// ========================================
// Mobile Menu Toggle
// ========================================
const initMobileMenu = () => {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!mobileMenuToggle || !navLinks) return;

  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
};

// ========================================
// Smooth Scroll Enhancement
// ========================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ========================================
// Scroll to Top Functionality
// ========================================
const initScrollToTop = () => {
  const scrollButton = document.createElement('button');
  scrollButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  scrollButton.className = 'scroll-to-top';
  scrollButton.setAttribute('aria-label', 'Scroll to top');
  scrollButton.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
    z-index: 999;
  `;

  document.body.appendChild(scrollButton);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollButton.style.display = 'flex';
    } else {
      scrollButton.style.display = 'none';
    }
  });

  // Scroll to top on click
  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Hover effect
  scrollButton.addEventListener('mouseenter', () => {
    scrollButton.style.transform = 'translateY(-4px) scale(1.05)';
  });

  scrollButton.addEventListener('mouseleave', () => {
    scrollButton.style.transform = 'translateY(0) scale(1)';
  });
};

// ========================================
// Loading Animation for Cards
// ========================================
let revealObserver = null;

const initCardAnimations = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
  }

  // Reveal cards below the hero; the hero must appear instantly
  document.querySelectorAll('.section .card, .section .pub, .profile-link').forEach(el => {
    if (el.classList.contains('reveal')) return; // already handled

    // Stagger by sibling position within the parent (capped at 5)
    const siblings = Array.from(el.parentElement.children);
    el.style.setProperty('--i', siblings.indexOf(el) % 5);

    el.classList.add('reveal');
    revealObserver.observe(el);
  });
};

// Cursor-tracking glow across card grids
const initCardGlow = () => {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.research-areas, .profile-links, .kpi-grid').forEach(grid => {
    grid.addEventListener('pointermove', (e) => {
      grid.querySelectorAll('.research-card, .profile-link, .kpi').forEach(card => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  });
};

// Scroll progress bar (JS fallback for browsers without scroll timelines)
const initScrollProgress = () => {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  if (CSS.supports('animation-timeline: scroll()')) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      ticking = false;
    });
  }, { passive: true });
};

// ========================================
// Fetch and Display KPIs
// ========================================
const loadMetrics = async () => {
  try {
    const response = await fetch('data/metrics.json');
    const metrics = await response.json();

    // Animate numbers with ease-out deceleration
    const animateValue = (element, end) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = end.toLocaleString();
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = Math.round(eased * end).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const citationsEl = document.getElementById('citations');
    const hindexEl = document.getElementById('hindex');
    const i10El = document.getElementById('i10');

    // Stagger the three tiles left-to-right
    [[citationsEl, metrics.citations], [hindexEl, metrics.h_index], [i10El, metrics.i10_index]]
      .forEach(([el, value], i) => {
        if (el) setTimeout(() => animateValue(el, value || 0), i * 150);
      });

    // Update about section
    const citationsTextEl = document.getElementById('citations-text');
    if (citationsTextEl && metrics.citations) {
      citationsTextEl.textContent = `${metrics.citations}+`;
    }

  } catch (error) {
    console.error('Error loading metrics:', error);
    // Set default values
    const citationsEl = document.getElementById('citations');
    const hindexEl = document.getElementById('hindex');
    const i10El = document.getElementById('i10');

    if (citationsEl) citationsEl.textContent = '188';
    if (hindexEl) hindexEl.textContent = '7';
    if (i10El) i10El.textContent = '6';
  }
};

// ========================================
// Fetch and Display Publications
// ========================================
const loadPublications = async () => {
  try {
    const response = await fetch('data/publications.json');
    const items = await response.json();

    const list = document.getElementById('pub-list');
    const count = document.getElementById('pub-count');
    const searchInput = document.getElementById('pub-search');

    if (!list || !count) return;

    const renderPublications = (publications) => {
      list.innerHTML = publications.map(pub => `
        <div class="pub">
          <div>
            <div class="title">${pub.title}</div>
            <div class="meta">
              ${pub.authors ? `<span class="pub-authors">${pub.authors}</span>` : ''}
              ${pub.authors && (pub.venue || pub.year) ? ' · ' : ''}
              ${pub.venue || ''}
              ${pub.venue && pub.year ? ' · ' : ''}
              ${pub.year || ''}
              ${pub.citations ? `<span class="pub-citations"> · Cited by ${pub.citations}</span>` : ''}
            </div>
          </div>
          <div>
            ${pub.link
              ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${pub.link}">View Paper</a>`
              : `<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}">Search on Scholar</a>`
            }
          </div>
        </div>
      `).join('');

      count.textContent = publications.length;

      // Update total count in about section
      const pubTotalCount = document.getElementById('pub-total-count');
      if (pubTotalCount) {
        pubTotalCount.textContent = publications.length;
      }

      // Re-observe new cards for animation
      setTimeout(() => initCardAnimations(), 100);
    };

    renderPublications(items);
    initPublicationSpotlight(items);

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = items.filter(pub =>
          pub.title.toLowerCase().includes(query) ||
          String(pub.year).includes(query) ||
          (pub.venue && pub.venue.toLowerCase().includes(query)) ||
          (pub.authors && pub.authors.toLowerCase().includes(query))
        );
        renderPublications(filtered);
      });
    }

  } catch (error) {
    console.error('Error loading publications:', error);
  }
};

// ========================================
// Announcements
// ========================================
const loadAnnouncements = async () => {
  const list = document.getElementById('announcement-list');
  if (!list) return;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  try {
    const response = await fetch('data/announcements.json');
    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      list.innerHTML = '<p class="meta">No announcements at the moment — check back soon.</p>';
      return;
    }

    // Pinned first, then newest first
    const sorted = [...items].sort((a, b) =>
      ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) ||
      (new Date(b.date) - new Date(a.date))
    );

    const now = Date.now();
    const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

    list.innerHTML = sorted.map(item => {
      const d = new Date(`${item.date}T00:00:00`);
      const valid = !isNaN(d.getTime());
      const day = valid ? d.getDate() : '–';
      const month = valid ? d.toLocaleString('en', { month: 'short' }) : '';
      const year = valid ? d.getFullYear() : esc(item.date);
      const isNew = valid && (now - d.getTime()) < NEW_WINDOW_MS && (now - d.getTime()) >= 0;

      return `
        <article class="card announcement">
          <div class="announcement-date" aria-label="${esc(item.date)}">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
            <span class="year">${year}</span>
          </div>
          <div>
            <div class="announcement-meta">
              ${item.tag ? `<span class="announcement-tag">${esc(item.tag)}</span>` : ''}
              ${isNew ? '<span class="announcement-new">NEW</span>' : ''}
              ${item.pinned ? '<span class="announcement-pin">📌 Pinned</span>' : ''}
            </div>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
            ${item.link ? `<a class="announcement-link" href="${esc(item.link)}" target="_blank" rel="noopener">Read more →</a>` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Observe the new cards for the reveal animation
    initCardAnimations();

  } catch (error) {
    console.error('Error loading announcements:', error);
    list.innerHTML = '<p class="meta">No announcements at the moment — check back soon.</p>';
  }
};

// ========================================
// Publication Spotlight (flip card)
// ========================================
const initPublicationSpotlight = (items) => {
  const spotlight = document.getElementById('pub-spotlight');
  const card = document.getElementById('flip-card');
  const front = document.getElementById('flip-front');
  const back = document.getElementById('flip-back');
  const ghost = document.getElementById('spotlight-ghost');
  const dotsWrap = document.getElementById('spotlight-dots');

  if (!spotlight || !card || !front || !back || !ghost || !dotsWrap) return;
  if (!Array.isArray(items) || items.length === 0) return;

  // Feature the most-cited publications
  const featured = [...items]
    .sort((a, b) => (b.citations || 0) - (a.citations || 0))
    .slice(0, 6);

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const clockIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

  const faceHTML = (pub) => {
    const link = pub.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}`;
    const venue = pub.venue && pub.venue.length > 34 ? pub.venue.slice(0, 32) + '…' : pub.venue;
    return `
      <h3 class="spotlight-title">${esc(pub.title)}</h3>
      ${pub.authors ? `<p class="spotlight-authors">${esc(pub.authors)}</p>` : ''}
      <div class="spotlight-segments">
        <span class="spotlight-segment">${clockIcon}&nbsp;${esc(pub.year)} <span class="seg-label">year</span></span>
        ${venue ? `<span class="spotlight-segment">${esc(venue)}</span>` : ''}
        ${pub.citations ? `<span class="spotlight-segment">${esc(pub.citations)} <span class="seg-label">citations</span></span>` : ''}
      </div>
      <div class="spotlight-actions">
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${esc(link)}">Read Paper →</a>
      </div>
    `;
  };

  let index = 0;
  let rotation = 0;
  let paused = false;
  let timer = null;

  const pad = (n) => String(n + 1).padStart(2, '0');

  const dots = featured.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'spotlight-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show publication ${i + 1}`);
    dot.addEventListener('click', () => {
      if (i !== index) flipTo(i);
      restartTimer();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const updateIndicators = () => {
    ghost.textContent = pad(index);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const flipTo = (nextIndex) => {
    index = nextIndex % featured.length;
    rotation += 180;
    // The face about to become visible gets the new content
    const showingBack = (rotation / 180) % 2 === 1;
    (showingBack ? back : front).innerHTML = faceHTML(featured[index]);
    card.style.transform = `rotateY(${rotation}deg)`;
    // Sync ghost number + dots mid-flip
    setTimeout(updateIndicators, 450);
  };

  const restartTimer = () => {
    if (timer) clearInterval(timer);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || featured.length < 2) return;
    timer = setInterval(() => {
      if (!paused && !document.hidden) flipTo(index + 1);
    }, 6000);
  };

  spotlight.addEventListener('mouseenter', () => { paused = true; });
  spotlight.addEventListener('mouseleave', () => { paused = false; });

  front.innerHTML = faceHTML(featured[0]);
  updateIndicators();
  spotlight.hidden = false;
  restartTimer();
};

// ========================================
// Contact Form Submission
// ========================================
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (!form || !submitBtn || !formStatus) return;

  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  if (!btnText || !btnLoading) return;

  // --- Human check (math captcha) ---
  const captchaQuestion = document.getElementById('captcha-question');
  const captchaAnswer = document.getElementById('captcha-answer');
  const captchaRefresh = document.getElementById('captcha-refresh');
  let expectedAnswer = null;

  const newCaptcha = () => {
    if (!captchaQuestion || !captchaAnswer) return;
    const a = 2 + Math.floor(Math.random() * 8); // 2-9
    const b = 2 + Math.floor(Math.random() * 8); // 2-9
    if (Math.random() < 0.5) {
      expectedAnswer = a + b;
      captchaQuestion.textContent = `What is ${a} + ${b}?`;
    } else {
      const hi = Math.max(a, b);
      const lo = Math.min(a, b);
      expectedAnswer = hi - lo;
      captchaQuestion.textContent = `What is ${hi} − ${lo}?`;
    }
    captchaAnswer.value = '';
  };

  newCaptcha();
  if (captchaRefresh) captchaRefresh.addEventListener('click', newCaptcha);

  const showError = (message, field) => {
    formStatus.className = 'form-status error';
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    if (field) {
      field.classList.add('input-error');
      field.focus();
      field.addEventListener('input', () => field.classList.remove('input-error'), { once: true });
    }
  };

  // Stricter than the browser's type=email (requires a real domain with a TLD)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const honeypot = document.getElementById('website');

    // Honeypot: bots fill hidden fields — silently drop, never call Formspree
    if (honeypot && honeypot.value.trim() !== '') {
      formStatus.className = 'form-status success';
      formStatus.textContent = '✓ Message sent successfully!';
      formStatus.style.display = 'block';
      form.reset();
      newCaptcha();
      return;
    }

    // Validate email format strictly
    const email = emailField.value.trim();
    if (!EMAIL_RE.test(email)) {
      showError('✗ Please enter a valid email address (e.g. name@example.com).', emailField);
      return;
    }

    // Validate the human check BEFORE sending — wrong answers never
    // reach Formspree, so spam cannot consume the submission quota
    const given = captchaAnswer ? captchaAnswer.value.trim() : '';
    if (expectedAnswer === null || given === '' || Number(given) !== expectedAnswer) {
      newCaptcha();
      showError('✗ Wrong answer to the human check — please try the new question.', captchaAnswer);
      return;
    }

    // Get form data
    const formData = {
      name: nameField.value.trim(),
      email: email,
      message: messageField.value.trim()
    };

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    try {
      let success = false;

      if (CONTACT_CONFIG.service === 'formspree') {
        success = await sendViaFormspree(formData);
      } else if (CONTACT_CONFIG.service === 'emailjs') {
        success = await sendViaEmailJS(formData);
      } else {
        throw new Error('No contact service configured. Please update CONTACT_CONFIG in main.js');
      }

      if (success) {
        // Success
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        form.reset();
        newCaptcha();
      }
    } catch (error) {
      // Error
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';
      formStatus.textContent = '✗ Failed to send message. Please try again or email me directly at Alrehailiium@gmail.com';
      console.error('Form submission error:', error);
      newCaptcha();
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });
};

// Send via Formspree
const sendViaFormspree = async (formData) => {
  const formId = CONTACT_CONFIG.formspree.formId;

  if (!formId || formId === 'YOUR_FORM_ID') {
    throw new Error('Formspree form ID not configured');
  }

  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error('Formspree submission failed');
  }

  return true;
};

// Send via EmailJS
const sendViaEmailJS = async (formData) => {
  const { userId, serviceId, templateId } = CONTACT_CONFIG.emailjs;

  if (!userId || userId === 'YOUR_USER_ID' ||
      !serviceId || serviceId === 'YOUR_SERVICE_ID' ||
      !templateId || templateId === 'YOUR_TEMPLATE_ID') {
    throw new Error('EmailJS credentials not configured');
  }

  // Load EmailJS library if not already loaded
  if (typeof emailjs === 'undefined') {
    await loadEmailJSLibrary();
  }

  // Initialize EmailJS
  emailjs.init(userId);

  // Send email
  const response = await emailjs.send(serviceId, templateId, {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_email: 'Alrehailiium@gmail.com'
  });

  if (response.status !== 200) {
    throw new Error('EmailJS submission failed');
  }

  return true;
};

// Dynamically load EmailJS library
const loadEmailJSLibrary = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme preference
  if (localStorage.getItem('prefers-dark') === '1') {
    document.documentElement.classList.add('dark');
  }

  // Initialize features
  initMobileMenu();
  initSmoothScroll();
  initScrollToTop();
  initCardAnimations();
  loadMetrics();
  loadAnnouncements();
  loadPublications();
  initContactForm();
  initCardGlow();
  initScrollProgress();

  // Theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', themeToggle);
  }

  // Add active state to navigation links based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

// ========================================
// Loading State
// ========================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
