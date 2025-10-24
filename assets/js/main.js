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
const initCardAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';

        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
};

// ========================================
// Fetch and Display KPIs
// ========================================
const loadMetrics = async () => {
  try {
    // Try to fetch from Google Scholar first (automatic)
    const scholarMetrics = await fetchGoogleScholarMetrics();

    let metrics;
    if (scholarMetrics) {
      metrics = scholarMetrics;
      // Update the text mentions in the about section
      updateAboutSectionMetrics(metrics);
    } else {
      // Fallback to local JSON
      const response = await fetch('data/metrics.json');
      metrics = await response.json();
    }

    // Animate numbers
    const animateValue = (element, end) => {
      const duration = 1000;
      const start = 0;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    const citationsEl = document.getElementById('citations');
    const hindexEl = document.getElementById('hindex');
    const i10El = document.getElementById('i10');

    if (citationsEl) animateValue(citationsEl, metrics.citations || metrics.h_index || 0);
    if (hindexEl) animateValue(hindexEl, metrics.h_index || 0);
    if (i10El) animateValue(i10El, metrics.i10_index || 0);

  } catch (error) {
    console.error('Error loading metrics:', error);
    // Set default values
    const citationsEl = document.getElementById('citations');
    const hindexEl = document.getElementById('hindex');
    const i10El = document.getElementById('i10');

    if (citationsEl) citationsEl.textContent = '188+';
    if (hindexEl) hindexEl.textContent = '7';
    if (i10El) i10El.textContent = '6';
  }
};

// Fetch metrics directly from Google Scholar
const fetchGoogleScholarMetrics = async () => {
  try {
    // Google Scholar user ID
    const scholarId = 'tMmhq2MAAAAJ';

    // Using a CORS proxy to fetch Google Scholar data
    // Note: This is a basic implementation. For production, consider using a backend API
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const scholarUrl = `https://scholar.google.com/citations?user=${scholarId}&hl=en`;

    const response = await fetch(proxyUrl + encodeURIComponent(scholarUrl));
    const html = await response.text();

    // Parse the HTML to extract metrics
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract citations, h-index, and i10-index from the page
    const statsTable = doc.querySelectorAll('.gsc_rsb_std');

    if (statsTable && statsTable.length >= 3) {
      return {
        citations: parseInt(statsTable[0].textContent) || 188,
        h_index: parseInt(statsTable[1].textContent) || 7,
        i10_index: parseInt(statsTable[2].textContent) || 6
      };
    }

    return null;
  } catch (error) {
    console.log('Could not fetch Google Scholar metrics automatically, using fallback');
    return null;
  }
};

// Update about section with live metrics
const updateAboutSectionMetrics = (metrics) => {
  const citationsTextEl = document.getElementById('citations-text');
  if (citationsTextEl && metrics.citations) {
    citationsTextEl.textContent = `${metrics.citations}+`;
  }
};

// ========================================
// Fetch and Display Publications
// ========================================
const loadPublications = async () => {
  try {
    // Try to fetch from Google Scholar first
    let items = await fetchGoogleScholarPublications();

    if (!items || items.length === 0) {
      // Fallback to local JSON
      const response = await fetch('data/publications.json');
      items = await response.json();
    }

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
              ${pub.authors ? `<span class="pub-authors">${pub.authors}</span> · ` : ''}
              ${pub.venue || ''} ${pub.venue && pub.year ? '·' : ''} ${pub.year || ''}
              ${pub.citations ? `<span class="pub-citations"> · Cited by ${pub.citations}</span>` : ''}
            </div>
          </div>
          <div>
            ${pub.link
              ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${pub.link}">View Paper</a>`
              : `<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(pub.title)}">Google Scholar</a>`
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

// Fetch all publications from Google Scholar
const fetchGoogleScholarPublications = async () => {
  try {
    const scholarId = 'tMmhq2MAAAAJ';

    // Using CORS proxy
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const scholarUrl = `https://scholar.google.com/citations?user=${scholarId}&hl=en&cstart=0&pagesize=100`;

    const response = await fetch(proxyUrl + encodeURIComponent(scholarUrl));
    const html = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const publications = [];
    const rows = doc.querySelectorAll('.gsc_a_tr');

    rows.forEach(row => {
      try {
        const titleElement = row.querySelector('.gsc_a_at');
        const authorsElement = row.querySelector('.gs_gray:nth-of-type(1)');
        const venueElement = row.querySelector('.gs_gray:nth-of-type(2)');
        const yearElement = row.querySelector('.gsc_a_y span');
        const citationsElement = row.querySelector('.gsc_a_c a');

        if (titleElement) {
          const publication = {
            title: titleElement.textContent.trim(),
            link: titleElement.href ? 'https://scholar.google.com' + titleElement.getAttribute('data-href') : null,
            authors: authorsElement ? authorsElement.textContent.trim() : '',
            venue: venueElement ? venueElement.textContent.trim() : '',
            year: yearElement ? yearElement.textContent.trim() : '',
            citations: citationsElement ? parseInt(citationsElement.textContent) || 0 : 0
          };

          // Get the actual link
          if (titleElement.hasAttribute('href')) {
            publication.link = titleElement.href;
          }

          publications.push(publication);
        }
      } catch (err) {
        console.log('Error parsing publication row:', err);
      }
    });

    console.log(`Successfully fetched ${publications.length} publications from Google Scholar`);
    return publications.length > 0 ? publications : null;

  } catch (error) {
    console.log('Could not fetch publications from Google Scholar:', error);
    return null;
  }
};

// ========================================
// Contact Form Submission
// ========================================
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const formStatus = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
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
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        form.reset();
      }
    } catch (error) {
      // Error
      formStatus.className = 'form-status error';
      formStatus.textContent = '✗ Failed to send message. Please try again or email me directly at Ahmed_murayshid@hotmail.com';
      console.error('Form submission error:', error);
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
    to_email: 'Ahmed_murayshid@hotmail.com'
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
  loadPublications();
  initContactForm();

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
