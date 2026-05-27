/* ═══════════════════════════════════════════════
   ART OF PHARMA — main.js
═══════════════════════════════════════════════ */

'use strict';

// ─── Hamburger / Mobile Menu ─────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMenu(open) {
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');
  toggleMenu(!isOpen);
});

// Close menu on mobile link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    toggleMenu(false);
  }
});


// ─── Sticky Header Shadow ────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


// ─── Active Nav Link on Scroll ───────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

function setActiveNav() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();


// ─── Scroll Reveal (IntersectionObserver) ────
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback for old browsers
  revealElements.forEach(el => el.classList.add('visible'));
}


// ─── Etkinlik Tabs ───────────────────────────
const tabs = document.querySelectorAll('.etkinlik-tab');
const panels = document.querySelectorAll('.etkinlik-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const targetPanel = document.getElementById(`panel-${target}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      // Re-trigger reveal animations in the newly shown panel
      targetPanel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    }
  });

  // Keyboard navigation for tabs
  tab.addEventListener('keydown', (e) => {
    const tabList = [...tabs];
    const index = tabList.indexOf(tab);
    if (e.key === 'ArrowRight') {
      tabList[(index + 1) % tabList.length].focus();
    } else if (e.key === 'ArrowLeft') {
      tabList[(index - 1 + tabList.length) % tabList.length].focus();
    }
  });
});


// ─── Stats Counter Animation ─────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Trigger counters when stats bar is visible
const statsBar = document.querySelector('.stats-bar');
if (statsBar && 'IntersectionObserver' in window) {
  let counted = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statsBar.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el);
      });
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsBar);
}


// ─── Smooth Scroll for Anchor Links ──────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ─── Magical Cursor (Desktop Only) ───────────
(() => {
  const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursor = document.querySelector('.magic-cursor');
  const dot = document.querySelector('.magic-cursor-dot');

  if (!canUseCustomCursor || !cursor || !dot) return;

  document.body.classList.add('magic-cursor-enabled');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  const render = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  };

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add('cursor-ready');
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-ready');
  });

  window.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-ready');
  });

  document.querySelectorAll('a, button, .etkinlik-kart, .social-btn, .iletisim-kanal, .radix-sayi').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hovering'));
  });

  render();
})();


// ─── Mobile Bottom Nav Active State ──────────
const mobileBottomLinks = document.querySelectorAll('.mobile-bottom-link');

function setActiveBottomNav() {
  if (!mobileBottomLinks.length) return;
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.id;
  });

  mobileBottomLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveBottomNav, { passive: true });
setActiveBottomNav();

// ─── Mobile Touch Motion Feedback ────────────
if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
  document.querySelectorAll('.etkinlik-kart, .founder-timeline-item, .iletisim-kanal').forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => card.classList.remove('touch-active'), 160);
    }, { passive: true });
  });
}
