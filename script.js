/* ============================================================
   CULTURA CORTESANA — script.js
   ============================================================
   ZONA DE EDITABLES RÁPIDOS — cambiá estos valores cuando quieras.
   ============================================================ */

/* WhatsApp: número en formato internacional, sin "+", sin espacios, sin guiones.
   Ejemplo argentino: 549 (código de país y celulares) + código de área sin 0 + número sin 15.
   549 3492 + número de Rafaela típicamente: "5493492XXXXXX".
   REEMPLAZÁ por el número real cuando lo tengas. */
const WHATSAPP_NUMBER = '5493492717777';

/* Alias para transferencias (se muestra en la página y se usa en los mensajes de WhatsApp). */
const ALIAS = 'loscortesanosmacro';

/* URL del Web App de Google Apps Script.
   Pegá acá la URL que termina en /exec después de publicar el Apps Script como Web App. */
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwrdbf6MXWKzR5c5u08yYcbb7FHCCKOjdo-67OVNG8GUtTkH0-qGb57celpxi2GDGdB/exec';

/* Mensajes predeterminados de WhatsApp.
   Se arman distintos según desde dónde haga clic el cliente. */
const WHATSAPP_MESSAGES = {
  default: `¡Hola! Quiero reservar mi entrada para Cultura Cortesana — Feria de Vinos del sábado 13 de junio de 2026. ¿Me confirman disponibilidad y los datos de pago? (Alias: ${ALIAS})`,
  general: `¡Hola! Me interesa la Entrada GENERAL para Cultura Cortesana del sábado 13 de junio. ¿Me confirman cupo y los datos para transferir al alias "${ALIAS}"?`,
  vip:     `¡Hola! Me interesa la Entrada VIP para Cultura Cortesana del sábado 13 de junio. ¿Me confirman cupo y los datos para transferir al alias "${ALIAS}"?`
};

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

  function prettyTicketType(type) {
    return String(type).toLowerCase() === 'vip' ? 'VIP' : 'GENERAL';
  }

  function buildReservationMessage(data) {
    const ticketType = prettyTicketType(data.tipoEntrada);
    const fullName = `${data.nombre} ${data.apellido}`.trim();
    return `¡Hola! Soy ${fullName}. Quiero reservar una Entrada ${ticketType} para Cultura Cortesana del sábado 13 de junio. DNI: ${data.dni}. Teléfono: ${data.telefono}. Forma de pago: ${data.formaPago}. ¿Me confirman cupo?`;
  }

  async function saveReservationToSheet(data) {
    if (!GOOGLE_SHEET_WEB_APP_URL) return { skipped: true };

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    return { skipped: false };
  }

  /* Cada link/botón con [data-wa] se transforma automáticamente en un link de WhatsApp.
     El valor de data-wa elige el mensaje: "default" | "general" | "vip". */
  $$('[data-wa]').forEach(el => {
    const key = el.getAttribute('data-wa') || 'default';
    const message = WHATSAPP_MESSAGES[key] || WHATSAPP_MESSAGES.default;
    el.href = buildWaUrl(WHATSAPP_NUMBER, message);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });


  /* ---------- 3a. Reserva: Google Sheets + WhatsApp ---------- */
  const reservationModal = $('#reservationModal');
  const reservationForm = $('#reservationForm');
  const reservationTypeInput = $('#reservationType');
  const reservationTicketLabel = $('#reservationTicketLabel');
  const reservationStatus = $('#reservationStatus');
  const reservationSubmit = $('#reservationSubmit');
  const reservationPaymentMethod = $('#reservationPaymentMethod');
  const reservationAliasBox = $('#reservationAliasBox');

  function setReservationStatus(message, type = '') {
    if (!reservationStatus) return;
    reservationStatus.textContent = message;
    reservationStatus.dataset.status = type;
  }

  function openReservationModal(type) {
    if (!reservationModal || !reservationForm || !reservationTypeInput) return;
    const ticketType = prettyTicketType(type);
    reservationTypeInput.value = ticketType;
    if (reservationTicketLabel) reservationTicketLabel.textContent = `Entrada ${ticketType}`;
    setReservationStatus('');
    toggleReservationAlias();
    reservationModal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => $('#reservationName')?.focus(), 40);
  }

  function closeReservationModal() {
    if (!reservationModal || !reservationForm) return;
    reservationModal.hidden = true;
    document.body.classList.remove('modal-open');
    reservationForm.reset();
    setReservationStatus('');
    toggleReservationAlias();
    if (reservationSubmit) reservationSubmit.disabled = false;
  }

  function toggleReservationAlias() {
    if (!reservationPaymentMethod || !reservationAliasBox) return;
    reservationAliasBox.hidden = reservationPaymentMethod.value !== 'Transferencia';
  }

  $$('[data-reserve]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openReservationModal(btn.getAttribute('data-reserve'));
    });
  });

  $$('[data-reservation-close]').forEach(btn => {
    btn.addEventListener('click', closeReservationModal);
  });

  reservationPaymentMethod?.addEventListener('change', toggleReservationAlias);

  reservationModal?.addEventListener('click', (e) => {
    if (e.target === reservationModal) closeReservationModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reservationModal && !reservationModal.hidden) {
      closeReservationModal();
    }
  });

  reservationForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reservationForm);
    const reservationData = {
      nombre: String(formData.get('nombre') || '').trim(),
      apellido: String(formData.get('apellido') || '').trim(),
      dni: String(formData.get('dni') || '').trim(),
      telefono: String(formData.get('telefono') || '').trim(),
      tipoEntrada: String(formData.get('tipoEntrada') || '').trim(),
      formaPago: String(formData.get('formaPago') || '').trim(),
      pago: 'Pendiente'
    };

    if (
      !reservationData.nombre ||
      !reservationData.apellido ||
      !reservationData.dni ||
      !reservationData.telefono ||
      !reservationData.tipoEntrada ||
      !reservationData.formaPago
    ) {
      setReservationStatus('Completá todos los campos para continuar.', 'error');
      return;
    }

    if (reservationSubmit) reservationSubmit.disabled = true;
    setReservationStatus('Guardando la reserva y abriendo WhatsApp...', 'loading');

    const waMessage = buildReservationMessage(reservationData);
    const waUrl = buildWaUrl(WHATSAPP_NUMBER, waMessage);
    const whatsappWindow = window.open('about:blank', '_blank');

    try {
      await saveReservationToSheet(reservationData);
    } catch (err) {
      console.warn('No se pudo guardar la reserva en Google Sheets.', err);
    } finally {
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = waUrl;
      } else {
        window.location.href = waUrl;
      }
      closeReservationModal();
    }
  });


  /* ---------- 3b. Copiar alias ---------- */
  const aliasButtons = $$('[data-copy-alias]');
  aliasButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const original = btn.dataset.originalLabel || btn.querySelector('.alias-copy-label')?.textContent || btn.textContent;
      if (!btn.dataset.originalLabel) btn.dataset.originalLabel = original;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(ALIAS);
        } else {
          // Fallback para http o navegadores viejos
          const tmp = document.createElement('textarea');
          tmp.value = ALIAS;
          tmp.style.position = 'fixed';
          tmp.style.opacity = '0';
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand('copy');
          document.body.removeChild(tmp);
        }
        const labelEl = btn.querySelector('.alias-copy-label');
        if (labelEl) labelEl.textContent = '¡Copiado!';
        else btn.textContent = '¡Copiado!';
        btn.classList.add('is-copied');
        setTimeout(() => {
          if (labelEl) labelEl.textContent = original;
          else btn.textContent = original;
          btn.classList.remove('is-copied');
        }, 1800);
      } catch (err) {
        console.warn('No se pudo copiar el alias automáticamente.', err);
      }
    });
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
    '.gallery-item',
    '.alias-card',
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
