/* ================================================
   Lakshita Kande – Portfolio JavaScript
   Features: loader, cursor, particles, typing,
             AOS, counters, skill bars, project filter,
             form validation, theme toggle, back-to-top
   ================================================ */

'use strict';

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
    initAOS();
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ===== CUSTOM CURSOR ===== */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function followCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(followCursor);
})();

/* Hover state on interactive elements */
document.querySelectorAll('a, button, .project-card, .skill-category, .service-card, .counter-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ===== SCROLL PROGRESS ===== */
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
  /* Sticky header */
  if (window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  /* Active link highlighting */
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });

  /* Back-to-top */
  const btt = document.getElementById('back-to-top');
  if (window.scrollY > 400) btt.classList.add('visible');
  else btt.classList.remove('visible');
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ===== DARK/LIGHT THEME TOGGLE ===== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
});

/* ===== TYPING EFFECT ===== */
const typingLines = [
  'B.Tech CSE Student',
  'Frontend Developer',
  'UI/UX Designer',
  'Problem Solver',
  'Creative Thinker'
];

const typedEl = document.getElementById('typed-text');
let lineIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const current = typingLines[lineIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    lineIdx = (lineIdx + 1) % typingLines.length;
    delay = 400;
  }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 2400); /* start after loader */

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const colors = ['rgba(139,92,246,', 'rgba(59,130,246,', 'rgba(6,182,212,'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.r     = Math.random() * 2.5 + 0.5;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 100)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== AOS (SCROLL REVEAL) ===== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay ? parseInt(entry.target.dataset.aosDelay) : 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
          /* Trigger counters if inside counters row */
          if (entry.target.classList.contains('counters-row')) startCounters();
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));

  /* Skill bar observer */
  const skillBars = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        setTimeout(() => {
          target.style.width = target.dataset.width + '%';
        }, 300);
        skillObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObserver.observe(bar));
}

/* ===== ANIMATED COUNTERS ===== */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll('.counter-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

/* Counter observer as fallback */
const counterSection = document.querySelector('.counters-row');
if (counterSection) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) startCounters();
  }, { threshold: 0.4 }).observe(counterSection);
}

/* ===== PROJECT FILTER ===== */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInCard 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== CONTACT FORM VALIDATION ===== */
const form = document.getElementById('contact-form');

function showError(id, msg) {
  document.getElementById(id + '-error').textContent = msg;
  document.getElementById(id).classList.add('error');
}
function clearError(id) {
  const el = document.getElementById(id + '-error');
  if (el) el.textContent = '';
  document.getElementById(id)?.classList.remove('error');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  ['name', 'email', 'message'].forEach(id => clearError(id));

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) { showError('name', 'Please enter your name.'); valid = false; }
  if (!email) { showError('email', 'Please enter your email.'); valid = false; }
  else if (!validateEmail(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
  if (!message) { showError('message', 'Please write a message.'); valid = false; }

  if (valid) {
    /* Simulate send – replace with Formspree / EmailJS in production */
    const btn = form.querySelector('.form-submit span');
    btn.textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      const success = document.getElementById('form-success');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  }
});

/* Clear errors on input */
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => clearError(id));
});

/* ===== BACK TO TOP ===== */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect  = btn.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) * 0.25;
    const dy    = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== CARD REVEAL KEYFRAME (injected) ===== */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}`;
document.head.appendChild(style);

/* ===== ORBIT DOTS (pure CSS approach backed by JS spin) ===== */
/* The CSS handles visual placement; JS ensures the orbit animation
   correctly counter-spins each dot so icons stay upright */
(function setupOrbits() {
  const orbit1 = document.querySelector('.orbit-1');
  const orbit2 = document.querySelector('.orbit-2');
  if (!orbit1 || !orbit2) return;

  let angle1 = 0, angle2 = 0;
  function spinOrbits() {
    angle1 += 0.3;
    angle2 -= 0.18;
    orbit1.style.transform = `rotate(${angle1}deg)`;
    orbit2.style.transform = `rotate(${angle2}deg)`;

    orbit1.querySelectorAll('.orbit-dot').forEach(dot => {
      dot.style.transform = `rotate(${-angle1}deg)`;
    });
    orbit2.querySelectorAll('.orbit-dot').forEach(dot => {
      dot.style.transform = `rotate(${-angle2}deg)`;
    });
    requestAnimationFrame(spinOrbits);
  }
  spinOrbits();
})();

/* ===== CONSOLE EASTER EGG ===== */
console.log('%c👩‍💻 Lakshita Kande | Portfolio', 'font-size:18px;font-weight:bold;background:linear-gradient(135deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;color:transparent;padding:4px');
console.log('%c Built with HTML · CSS · JavaScript', 'color:#a78bfa;font-size:12px');