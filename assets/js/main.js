/* assets/js/main.js
 * React components (Navbar, Hero, CustomCursor, ScrollToTop, Projects modal, Contact form)
 * નું vanilla JavaScript version – framer-motion / React ની જરૂર નથી.
 */
(function () {
  'use strict';

  var CFG = window.PORTFOLIO || {};

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- Lucide icons ---------------- */
  function renderIcons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  renderIcons();

  /* ---------------- Scroll reveal (whileInView, once) ---------------- */
  (function () {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Navbar ---------------- */
  (function () {
    var nav = $('#navbar');
    var desktop = $('#nav-desktop');
    var pill = $('#nav-pill');
    var desktopBtns = $$('.nav-btn');
    var mobileBtns = $$('.mobile-nav-btn');
    var mobileMenu = $('#mobile-menu');
    var toggle = $('#menu-toggle');
    var iconMenu = $('#icon-menu');
    var iconClose = $('#icon-close');
    var active = '#about';
    var menuOpen = false;

    var SCROLLED = ['bg-slate-950/85', 'border-slate-800/80', 'backdrop-blur-xl', 'shadow-xl', 'shadow-blue-950/15'];
    var TOP = ['bg-transparent', 'border-transparent'];

    function setActive(href) {
      active = href;
      desktopBtns.forEach(function (b) {
        var on = b.getAttribute('data-nav') === href;
        b.classList.toggle('text-blue-300', on);
        b.classList.toggle('text-slate-400', !on);
        if (on) movePill(b);
      });
      mobileBtns.forEach(function (b) {
        var on = b.getAttribute('data-nav') === href;
        ['bg-blue-600/20', 'text-blue-400', 'border', 'border-blue-500/40', 'shadow-sm'].forEach(function (c) { b.classList.toggle(c, on); });
        b.classList.toggle('text-slate-300', !on);
      });
    }

    function movePill(btn) {
      if (!pill || !btn) return;
      pill.style.left = btn.offsetLeft + 'px';
      pill.style.width = btn.offsetWidth + 'px';
    }

    function onScroll() {
      var y = window.scrollY;
      var scrolled = y > 20;
      SCROLLED.forEach(function (c) { nav.classList.toggle(c, scrolled); });
      TOP.forEach(function (c) { nav.classList.toggle(c, !scrolled); });
      nav.classList.toggle('border-b', true);

      var pos = y + 200;
      desktopBtns.forEach(function (b) {
        var id = b.getAttribute('data-nav');
        var el = document.querySelector(id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight && active !== id) {
          setActive(id);
        }
      });
    }

    function goTo(href) {
      var target = document.querySelector(href);
      if (!target) return;
      var top = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    function setMenu(open) {
      menuOpen = open;
      mobileMenu.classList.toggle('hidden', !open);
      mobileMenu.classList.toggle('flex', open);
      iconMenu.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }

    $$('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var href = el.getAttribute('data-nav');
        setActive(href);
        setMenu(false);
        goTo(href);
      });
    });

    toggle.addEventListener('click', function () { setMenu(!menuOpen); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      var cur = desktopBtns.filter(function (b) { return b.getAttribute('data-nav') === active; })[0];
      movePill(cur);
    });

    onScroll();
    setActive(active);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { setActive(active); });
    }
    window.addEventListener('load', function () { setActive(active); });
  })();

  /* ---------------- Hero typing effect ---------------- */
  (function () {
    var el = $('#typed-text');
    if (!el) return;
    var phrases = [
      'Responsive Web Designs',
      'Modern Web Applications',
      'Clean & Interactive UI',
      'Pixel-Perfect Experiences',
      'Dynamic Full-Stack Apps'
    ];
    var idx = 0, text = '', deleting = false;

    function tick() {
      var full = phrases[idx];
      var speed = deleting ? 35 : 75;
      var wait = speed;

      if (!deleting) {
        text = full.substring(0, text.length + 1);
        if (text === full) { deleting = true; wait = 1800; }
      } else {
        text = full.substring(0, text.length - 1);
        if (text === '') { deleting = false; idx = (idx + 1) % phrases.length; }
      }
      el.textContent = text;
      setTimeout(tick, wait);
    }
    setTimeout(tick, 75);
  })();

  /* ---------------- Custom cursor ---------------- */
  (function () {
    var dot = $('#cursor-dot');
    var ring = $('#cursor-ring');
    if (!dot || !ring) return;

    var mx = -100, my = -100, rx = -100, ry = -100;
    var visible = false, started = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx; ry = my;
        dot.classList.add('visible');
        ring.classList.add('visible');
      }
      if (!started) { started = true; requestAnimationFrame(loop); }
    });

    window.addEventListener('mouseover', function (e) {
      var hit = e.target.closest && e.target.closest("a, button, input, textarea, select, [role='button']");
      dot.classList.toggle('hover', !!hit);
      ring.classList.toggle('hover', !!hit);
    });

    document.addEventListener('mouseleave', function () {
      visible = false;
      dot.classList.remove('visible');
      ring.classList.remove('visible');
    });

    function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
  })();

  /* ---------------- Scroll to top ---------------- */
  (function () {
    var btn = $('#scroll-top');
    if (!btn) return;
    function onScroll() {
      var about = document.getElementById('about') || document.querySelector('main');
      var trigger = about ? about.offsetTop + 350 : 400;
      btn.classList.toggle('show', window.scrollY > trigger);
    }
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------------- Web3Forms helper ---------------- */
  function nowIST() {
    try {
      return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    } catch (e) {
      return new Date().toString();
    }
  }

  function submitWeb3Forms(payload) {
    payload.access_key = CFG.web3formsKey;
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  function showState(btn, state) {
    $$('[data-state]', btn).forEach(function (s) {
      s.style.display = s.getAttribute('data-state') === state ? 'inline-flex' : 'none';
    });
  }

  /* ---------------- Contact form ---------------- */
  (function () {
    var form = $('#contact-form');
    if (!form) return;
    var btn = $('#contact-submit');
    var ok = $('#contact-success');
    var err = $('#contact-error');
    var timer;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = d.get('name'), email = d.get('email'), message = d.get('message');

      ok.style.display = 'none';
      err.style.display = 'none';
      btn.disabled = true;
      showState(btn, 'sending');

      submitWeb3Forms({
        subject: '💼 New Client Inquiry: ' + name + ' reached out via Portfolio',
        from_name: name + ' (Portfolio Inquiry)',
        replyto: email,
        'Client Name': name,
        'Client Email': email,
        'Inquiry Message': message,
        'Source': 'Contact Form (#contact)',
        'Submission Time': nowIST()
      }).then(function (res) {
        btn.disabled = false;
        showState(btn, 'idle');
        if (res && res.success) {
          ok.style.display = 'flex';
          form.reset();
          clearTimeout(timer);
          timer = setTimeout(function () { ok.style.display = 'none'; }, 4000);
        } else {
          err.style.display = 'block';
        }
      }).catch(function () {
        btn.disabled = false;
        showState(btn, 'idle');
        err.style.display = 'block';
      });
    });
  })();

  /* ---------------- Project "Request Demo" modal ---------------- */
  (function () {
    var modal = $('#demo-modal');
    if (!modal) return;
    var form = $('#demo-form');
    var btn = $('#demo-submit');
    var err = $('#demo-error');
    var label = $('#modal-project');
    var current = '';

    function open(title) {
      current = title;
      label.textContent = title;
      form.reset();
      err.style.display = 'none';
      btn.disabled = false;
      showState(btn, 'idle');
      modal.classList.add('open');
    }
    function close() {
      modal.classList.remove('open');
      err.style.display = 'none';
    }

    $$('[data-demo]').forEach(function (b) {
      b.addEventListener('click', function () { open(b.getAttribute('data-demo')); });
    });
    $('#modal-close').addEventListener('click', close);
    $('#modal-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = d.get('name'), email = d.get('email'), message = d.get('message');

      err.style.display = 'none';
      btn.disabled = true;
      showState(btn, 'sending');

      submitWeb3Forms({
        subject: '🚀 Demo Request: [' + current + '] from ' + name,
        from_name: name + ' (Demo Request)',
        replyto: email,
        'Requested Project': current,
        'Client Name': name,
        'Client Email': email,
        'Client Requirement / Note': message,
        'Source': 'Project Showcase Modal',
        'Submission Time': nowIST()
      }).then(function (res) {
        if (res && res.success) {
          showState(btn, 'success');
          setTimeout(close, 2000);
        } else {
          btn.disabled = false;
          showState(btn, 'idle');
          err.style.display = 'block';
        }
      }).catch(function () {
        btn.disabled = false;
        showState(btn, 'idle');
        err.style.display = 'block';
      });
    });
  })();
})();
