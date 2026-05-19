/* ============================================================
   CULTURA CORTESANA — script.js
   ============================================================
   ZONA DE EDITABLES RÁPIDOS — cambiá estos valores cuando quieras.
   ============================================================ */

/* WhatsApp: número en formato internacional, sin "+", sin espacios, sin guiones.
   Ejemplo argentino: 549 (código de país y celulares) + código de área sin 0 + número sin 15.
   549 3492 + número de Rafaela típicamente: "5493492XXXXXX".
   REEMPLAZÁ por el número real cuando lo tengas. */
const WHATSAPP_NUMBER = '5493492000000';

/* Mensaje predeterminado para WhatsApp (se carga automáticamente en el chat). */
const WHATSAPP_MESSAGE = '¡Hola! Quiero reservar mi entrada para Cultura Cortesana — Feria de Vinos del sábado 13 de junio. ¿Me podrían dar más información?';

/* ============================================================
   No es necesario editar nada debajo de esta línea
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));


  /* ---------- 2. Año dinámico en el footer ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- 3. WhatsApp links ---------- */
  function buildWaUrl(number, message) {
    const cleanNumber = String(number).replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }

  const waUrl = buildWaUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
  ['waFloat', 'ctaWhatsapp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.href = waUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });


  /* ---------- 4. Header con efecto scrolled ---------- */
  const header = $('#siteHeader');
  if (header) {
    const toggleHeader = () => {
      if (window.scrollY > 24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    toggleHeader();
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }


  /* ---------- 5. Menú móvil ---------- */
  const navToggle = $('#navToggle');
  const navList   = $('#navList');

  function closeMenu() {
    if (!navList || !navToggle) return;
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu() {
    if (!navList || !navToggle) return;
    navList.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Cerrar al tocar un link
    $$('a', navList).forEach(a => a.addEventListener('click', closeMenu));

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Cerrar si se agranda la ventana (rotación, redimensión)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }


  /* ---------- 6. Smooth scroll a los anchors con offset por header ---------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ---------- 7. Reveal al hacer scroll ---------- */
  const revealTargets = [
    '.section-head',
    '.evento-grid',
    '.evento-categories',
    '.bodega-card',
    '.ticket',
    '.compare',
    '.menu-section',
    '.exp-card',
    '.ubicacion-grid',
    '.faq-item',
    '.cta-box'
  ];

  const revealEls = revealTargets.flatMap(sel => $$(sel));
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: mostrar todo
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

})();
