/* ====== Sozlamalar ====== */
const CONTACT_EMAIL = 'sizning@email.com'; // <- o'z emailingizni yozing

(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (s) => document.querySelector(s);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Theme: dark / light ---------- */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    store.set('theme', t);
  }
  $('#themeBtn').addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Language: UZ / EN ---------- */
  let lang = store.get('lang');
  if (lang !== 'uz' && lang !== 'en') lang = (navigator.language || 'uz').toLowerCase().startsWith('en') ? 'en' : 'uz';

  function applyLang(l) {
    lang = l;
    store.set('lang', l);
    root.lang = l;
    const dict = window.I18N[l];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = dict[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.title = dict['meta.title'];
    typeCode();
  }
  $('#langBtn').addEventListener('click', () => applyLang(lang === 'uz' ? 'en' : 'uz'));

  /* ---------- Code card typing effect ---------- */
  let job = 0;
  function typeCode() {
    const my = ++job;
    const el = $('#code');
    el.textContent = '';
    const segs = window.I18N[lang].code;

    if (reduced) {
      segs.forEach(([c, t]) => {
        const s = document.createElement('span');
        s.className = c; s.textContent = t; el.appendChild(s);
      });
      return;
    }
    let i = 0, j = 0, span = null;
    (function step() {
      if (my !== job || i >= segs.length) return;
      const [cls, text] = segs[i];
      if (j === 0) {
        span = document.createElement('span');
        span.className = cls;
        el.appendChild(span);
      }
      span.textContent += text[j++];
      if (j >= text.length) { i++; j = 0; }
      setTimeout(step, 26);
    })();
  }

  /* ---------- Mobile menu ---------- */
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#navLinks a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- Photo tilt (mouse) ---------- */
  const tilt = $('#tilt');
  if (tilt && !reduced && window.matchMedia('(hover: hover)').matches) {
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'perspective(900px) rotateY(' + x * 9 + 'deg) rotateX(' + -y * 9 + 'deg)';
    });
    tilt.addEventListener('mouseleave', () => { tilt.style.transform = ''; });
  }

  /* ---------- Contact form -> mailto ---------- */
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#cName').value.trim();
    const msg = $('#cMsg').value.trim();
    const subject = encodeURIComponent('Portfolio: ' + name);
    const body = encodeURIComponent(msg + '\n\n— ' + name);
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Start ---------- */
  applyLang(lang);
})();
