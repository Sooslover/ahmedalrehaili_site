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
    const response = await fetch('data/metrics.json');
    const metrics = await response.json();

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

    if (citationsEl) animateValue(citationsEl, metrics.citations);
    if (hindexEl) animateValue(hindexEl, metrics.h_index);
    if (i10El) animateValue(i10El, metrics.i10_index);

  } catch (error) {
    console.error('Error loading metrics:', error);
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
            <div class="meta">${pub.venue || ''} ${pub.venue && pub.year ? '·' : ''} ${pub.year || ''}</div>
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
          (pub.venue && pub.venue.toLowerCase().includes(query))
        );
        renderPublications(filtered);
      });
    }

  } catch (error) {
    console.error('Error loading publications:', error);
  }
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
