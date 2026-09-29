/* ==========================================================================
   [YOUR BRAND] — script.js
   Vanilla JavaScript, tanpa dependency.
   Modul: theme, navigasi, scroll progress, reveal, hero flow, card glow,
          case study dialog, contact form, tahun footer.
   ========================================================================== */
(function () {
  'use strict';

  window.__siteReady = true;

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  /* ------------------------------------------------------------------ */
  /* 1. THEME (light / dark) disimpan di localStorage                   */
  /* ------------------------------------------------------------------ */
  var themeToggle = $('.theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#101216' : '#F6F6F4');
    if (themeToggle) {
      var isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    }
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* storage tidak tersedia */ }
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Ikuti perubahan tema sistem selama pengguna belum memilih sendiri
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var onSystemChange = function (e) {
    var saved = storedTheme();
    if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'dark' : 'light', false);
  };
  if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);

  /* ------------------------------------------------------------------ */
  /* 2. NAVBAR: status scroll + progress bar                            */
  /* ------------------------------------------------------------------ */
  var nav = $('#nav');
  var progressBar = $('.scroll-progress span');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* 3. MOBILE MENU                                                     */
  /* ------------------------------------------------------------------ */
  var menuToggle = $('.nav__toggle');
  var mobileMenu = $('#mobile-menu');
  var desktopQuery = window.matchMedia('(min-width: 1025px)');

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    mobileMenu.classList.toggle('is-open', open);
    if (nav) nav.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    if (open) {
      mobileMenu.removeAttribute('inert');
    } else {
      mobileMenu.setAttribute('inert', '');
    }
  }

  function isMenuOpen() {
    return menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () { setMenu(!isMenuOpen()); });

    $$('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    var onDesktop = function (e) { if (e.matches) setMenu(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onDesktop);
  }

  /* ------------------------------------------------------------------ */
  /* 4. ACTIVE NAV LINK berdasarkan section yang sedang terlihat        */
  /* ------------------------------------------------------------------ */
  var navLinks = $$('[data-nav]');
  var navSections = ['home', 'services', 'portfolio', 'process', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('data-nav') === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && navSections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navSections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ------------------------------------------------------------------ */
  /* 5. REVEAL saat elemen masuk viewport                               */
  /* ------------------------------------------------------------------ */
  var revealTargets = $$('.reveal, [data-observe]');

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------ */
  /* 6. COUNTER angka (dipakai di tahap "Informasi" pada hero)          */
  /* ------------------------------------------------------------------ */
  function formatNumber(value, decimals) {
    return value.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var render = function (v) { el.textContent = prefix + formatNumber(v, decimals) + suffix; };

    if (reducedMotion.matches) { render(target); return; }

    var duration = 900;
    var start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      render(target * eased);
      if (t < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */
  /* 7. HERO FLOW: Mentah → Terstruktur → Informasi → Keputusan         */
  /* ------------------------------------------------------------------ */
  var flow = $('#flow');

  if (flow) {
    var tabs = $$('[role="tab"]', flow);
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
    var flowTitle = $('#flow-title');
    var flowProgress = $('.window__progress', flow);
    var flowProgressFill = flowProgress ? $('span', flowProgress) : null;
    var pauseBtn = $('.window__pause', flow);
    var current = 0;
    var userPaused = false;
    var holds = {}; // alasan jeda sementara: hover, focus, offscreen, hidden

    var autoplayAllowed = !reducedMotion.matches;
    if (!autoplayAllowed) {
      if (pauseBtn) pauseBtn.hidden = true;
      if (flowProgress) flowProgress.hidden = true;
    }

    var isHeld = function () {
      return Object.keys(holds).some(function (k) { return holds[k]; });
    };

    var syncPauseState = function () {
      if (!flowProgress) return;
      flowProgress.classList.toggle('is-paused', userPaused || isHeld());
    };

    var restartProgress = function () {
      if (!flowProgress || !autoplayAllowed || userPaused) return;
      flowProgress.classList.remove('is-running');
      void flowProgress.offsetWidth; // paksa reflow agar animasi mulai ulang
      flowProgress.classList.add('is-running');
      syncPauseState();
    };

    var activate = function (index, moveFocus) {
      current = (index + tabs.length) % tabs.length;
      tabs.forEach(function (tab, i) {
        var selected = i === current;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].classList.toggle('is-active', selected);
      });
      var panel = panels[current];
      if (panel) {
        if (flowTitle) flowTitle.textContent = panel.getAttribute('data-file') || '';
        $$('[data-count]', panel).forEach(runCounter);
      }
      if (moveFocus) tabs[current].focus();
      restartProgress();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = current + 1;
        else if (e.key === 'ArrowLeft') next = current - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          activate(next, true);
        }
      });
    });

    if (flowProgressFill) {
      flowProgressFill.addEventListener('animationend', function () {
        if (autoplayAllowed && !userPaused) activate(current + 1, false);
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? 'Putar animasi' : 'Jeda animasi');
        if (userPaused) {
          if (flowProgress) flowProgress.classList.remove('is-running');
        } else {
          restartProgress();
        }
      });
    }

    // Jeda sementara saat pengguna sedang membaca / berinteraksi
    flow.addEventListener('mouseenter', function () { holds.hover = true; syncPauseState(); });
    flow.addEventListener('mouseleave', function () { holds.hover = false; syncPauseState(); });
    flow.addEventListener('focusin', function () { holds.focus = true; syncPauseState(); });
    flow.addEventListener('focusout', function (e) {
      if (!flow.contains(e.relatedTarget)) { holds.focus = false; syncPauseState(); }
    });
    document.addEventListener('visibilitychange', function () {
      holds.hidden = document.hidden;
      syncPauseState();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        holds.offscreen = !entries[0].isIntersecting;
        syncPauseState();
      }).observe(flow);
    }

    activate(0, false);
  }

  /* ------------------------------------------------------------------ */
  /* 8. CARD GLOW mengikuti posisi kursor (hanya perangkat dengan mouse)*/
  /* ------------------------------------------------------------------ */
  if (canHover.matches) {
    $$('.card-glow').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8b. KARTU NAMA: balik (flip) + efek miring mengikuti kursor         */
  /* ------------------------------------------------------------------ */
  var bizcard = $('[data-bizcard]');
  if (bizcard) {
    var flipButton = $('.bizcard__flip');
    var flipLabel = $('[data-flip-label]');
    var cardFront = $('.bizcard__face--front', bizcard);
    var cardBack = $('.bizcard__face--back', bizcard);

    var setFlipped = function (flipped) {
      bizcard.classList.toggle('is-flipped', flipped);
      cardBack.inert = !flipped;
      cardFront.setAttribute('aria-hidden', String(flipped));
      if (flipButton) flipButton.setAttribute('aria-pressed', String(flipped));
      if (flipLabel) flipLabel.textContent = flipped ? 'Lihat sisi depan' : 'Lihat kontak';
    };

    bizcard.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // link di sisi belakang tetap berfungsi
      setFlipped(!bizcard.classList.contains('is-flipped'));
    });
    if (flipButton) {
      flipButton.addEventListener('click', function () {
        setFlipped(!bizcard.classList.contains('is-flipped'));
      });
    }

    if (canHover.matches && !reducedMotion.matches) {
      bizcard.addEventListener('pointermove', function (e) {
        var rect = bizcard.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        bizcard.classList.add('is-tilting');
        bizcard.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
        bizcard.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
        bizcard.style.setProperty('--sx', (100 - (px + 0.5) * 100).toFixed(1) + '%');
      });
      bizcard.addEventListener('pointerleave', function () {
        bizcard.classList.remove('is-tilting');
        bizcard.style.removeProperty('--rx');
        bizcard.style.removeProperty('--ry');
        bizcard.style.removeProperty('--sx');
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 9. PREFILL jenis project dari tombol "Diskusikan"                  */
  /* ------------------------------------------------------------------ */
  var projectType = $('#project-type');

  function prefillService(value) {
    if (!projectType || !value) return;
    var match = Array.prototype.some.call(projectType.options, function (opt) { return opt.value === value; });
    if (match) {
      projectType.value = value;
      var field = projectType.closest('.field');
      if (field) field.classList.remove('is-invalid');
      var err = $('#f-type-err');
      if (err) err.textContent = '';
    }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-service]') : null;
    if (trigger) prefillService(trigger.getAttribute('data-service'));
  });

  /* ------------------------------------------------------------------ */
  /* 10. CASE STUDY DIALOG                                              */
  /* ------------------------------------------------------------------ */
  var dialog = $('#case-dialog');
  var dialogContent = $('#case-dialog-content');
  var lastTrigger = null;

  function onDialogClosed() {
    root.classList.remove('no-scroll');
    if (lastTrigger) lastTrigger.focus();
  }

  function closeDialog() {
    if (!dialog) return;
    root.classList.remove('no-scroll');
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      onDialogClosed();
    }
  }

  if (dialog && dialogContent) {
    $$('[data-case]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tpl = document.getElementById(btn.getAttribute('data-case'));
        if (!tpl || !tpl.content) return;
        dialogContent.innerHTML = '';
        dialogContent.appendChild(tpl.content.cloneNode(true));
        lastTrigger = btn;
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
        root.classList.add('no-scroll');
        var inner = $('.case-dialog__inner', dialog);
        if (inner) inner.scrollTop = 0;
      });
    });

    var closeBtn = $('.case-dialog__close', dialog);
    if (closeBtn) closeBtn.addEventListener('click', closeDialog);

    dialog.addEventListener('close', onDialogClosed);

    // Klik di area gelap (backdrop) menutup dialog
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDialog();
    });

    // Link di dalam dialog (misal ke #contact): tutup dulu, lalu scroll
    dialogContent.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      e.preventDefault();
      lastTrigger = null;
      closeDialog();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        var focusable = $('input, select, textarea', target);
        if (focusable) window.setTimeout(function () { focusable.focus({ preventScroll: true }); }, 500);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 11. CONTACT FORM (tanpa backend: mailto / WhatsApp)                */
  /* ------------------------------------------------------------------ */
  var form = $('#contact-form');

  if (form) {
    var status = $('#form-status');
    var waButton = $('#send-wa');
    var fields = {
      name: { el: $('#f-name'), err: $('#f-name-err'), msg: 'Nama perlu diisi.' },
      email: { el: $('#f-email'), err: $('#f-email-err'), msg: 'Email perlu diisi.' },
      type: { el: $('#project-type'), err: $('#f-type-err'), msg: 'Pilih jenis project.' },
      message: { el: $('#f-message'), err: $('#f-message-err'), msg: 'Ceritakan sedikit tentang project kamu.' }
    };
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var setFieldError = function (key, text) {
      var f = fields[key];
      if (!f || !f.el) return;
      var wrapper = f.el.closest('.field');
      if (wrapper) wrapper.classList.toggle('is-invalid', Boolean(text));
      f.el.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (f.err) f.err.textContent = text || '';
    };

    var setStatus = function (text, type) {
      if (!status) return;
      status.textContent = text;
      status.classList.remove('is-success', 'is-error');
      if (type) status.classList.add('is-' + type);
    };

    var validate = function () {
      var firstInvalid = null;
      Object.keys(fields).forEach(function (key) {
        var f = fields[key];
        if (!f.el) return;
        var value = f.el.value.trim();
        var error = '';
        if (!value) error = f.msg;
        else if (key === 'email' && !emailPattern.test(value)) error = 'Format email belum benar, contoh: nama@domain.com.';
        else if (key === 'message' && value.length < 10) error = 'Pesan terlalu singkat. Tambahkan sedikit detail.';
        setFieldError(key, error);
        if (error && !firstInvalid) firstInvalid = f.el;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        setStatus('Lengkapi kolom yang ditandai sebelum mengirim.', 'error');
        return false;
      }
      return true;
    };

    var composeBody = function () {
      return [
        'Halo, saya ' + fields.name.el.value.trim() + '.',
        '',
        'Jenis project: ' + fields.type.el.value,
        'Email: ' + fields.email.el.value.trim(),
        '',
        fields.message.el.value.trim()
      ].join('\n');
    };

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (!f.el) return;
      var evt = f.el.tagName === 'SELECT' ? 'change' : 'input';
      f.el.addEventListener(evt, function () {
        if (f.el.getAttribute('aria-invalid') === 'true') setFieldError(key, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var to = form.getAttribute('data-email') || '';
      var subject = 'Inquiry ' + fields.type.el.value + ' dari ' + fields.name.el.value.trim();
      var href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(composeBody());
      window.location.href = href;
      setStatus('Aplikasi email kamu dibuka dengan pesan yang sudah terisi. Jika tidak ada yang terbuka, kirim langsung ke ' + to + '.', 'success');
    });

    if (waButton) {
      waButton.addEventListener('click', function () {
        if (!validate()) return;
        var number = (form.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
        var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(composeBody());
        var win = window.open(url, '_blank');
        if (win) { win.opener = null; } else { window.location.href = url; }
        setStatus('WhatsApp dibuka di tab baru dengan pesan yang sudah terisi.', 'success');
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 12. TAHUN di footer                                                */
  /* ------------------------------------------------------------------ */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
