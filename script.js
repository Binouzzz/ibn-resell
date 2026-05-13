// ---- COUNTDOWN ----
function initCountdown() {
  const KEY = 'ibn_countdown_end';
  let endTime = localStorage.getItem(KEY);

  if (!endTime || Date.now() > parseInt(endTime)) {
    // 48h rolling countdown
    endTime = Date.now() + 48 * 60 * 60 * 1000;
    localStorage.setItem(KEY, endTime);
  }

  function update() {
    const now = Date.now();
    const diff = parseInt(endTime) - now;

    if (diff <= 0) {
      localStorage.removeItem(KEY);
      location.reload();
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elH = document.getElementById('cd-hours');
    const elM = document.getElementById('cd-minutes');
    const elS = document.getElementById('cd-seconds');

    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(m);
    if (elS) elS.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}

// ---- FAQ ACCORDION ----
function initFaq() {
  document.querySelectorAll('.faq-question').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ---- MODULE PASSWORD GATE ----
const MODULE_PASSWORDS = {
  1: 'IBN2026',
  2: 'IBN2026',
  3: 'IBN2026',
};

function initGate(moduleNumber) {
  const storageKey = `ibn_module_${moduleNumber}_unlocked`;
  const gate = document.getElementById('gate');
  const content = document.getElementById('module-content');
  const input = document.getElementById('gate-input');
  const btn = document.getElementById('gate-btn');
  const error = document.getElementById('gate-error');

  if (!gate || !content) return;

  if (localStorage.getItem(storageKey) === 'true') {
    gate.style.display = 'none';
    content.style.display = 'block';
    return;
  }

  gate.style.display = 'flex';
  content.style.display = 'none';

  function tryUnlock() {
    const val = input.value.trim().toUpperCase();
    if (val === MODULE_PASSWORDS[moduleNumber].toUpperCase()) {
      localStorage.setItem(storageKey, 'true');
      gate.style.display = 'none';
      content.style.display = 'block';
    } else {
      error.style.display = 'block';
      input.style.borderColor = '#FF3C3C';
      setTimeout(() => {
        error.style.display = 'none';
        input.style.borderColor = '';
      }, 2500);
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
}

// ---- SCROLL ANIMATIONS ----
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate').forEach((el) => observer.observe(el));
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initFaq();
  initAnimations();
});
