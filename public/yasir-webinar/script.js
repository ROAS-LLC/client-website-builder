/* ============================================================
   Speak Like a CEO. Page interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Countdown to Thursday, July 2nd 7:00 PM EST ----------
     EST = UTC-5. 7:00 PM EST = 00:00 UTC next day.
     Year auto-rolls so it never shows expired in the future demo. */
  function nextTargetDate() {
    var now = new Date();
    var year = now.getUTCFullYear();
    // July 2, 00:00 UTC July 3 (7:00 PM EST July 2)
    var t = Date.UTC(year, 6, 3, 0, 0, 0);
    if (t < now.getTime()) {
      t = Date.UTC(year + 1, 6, 3, 0, 0, 0);
    }
    return t;
  }
  var target = nextTargetDate();

  var els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    if (!els.d) return;
    var diff = Math.max(0, target - Date.now());
    var sec = Math.floor(diff / 1000);
    var days = Math.floor(sec / 86400);
    var hrs = Math.floor((sec % 86400) / 3600);
    var min = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    els.d.textContent = pad(days);
    els.h.textContent = pad(hrs);
    els.m.textContent = pad(min);
    els.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Registration popup modal + forms ---------- */
  var modal = document.getElementById('reg-modal');

  // Clone the hero form into the modal (unique ids so labels stay valid).
  var heroCard = document.querySelector('.reg-card.in-hero');
  var mount = document.getElementById('modal-mount');
  if (heroCard && mount) {
    var clone = heroCard.cloneNode(true);
    clone.classList.remove('in-hero');
    clone.querySelectorAll('[id]').forEach(function (el) { el.id = el.id + '-m'; });
    clone.querySelectorAll('label[for]').forEach(function (l) {
      l.setAttribute('for', l.getAttribute('for') + '-m');
    });
    mount.appendChild(clone);
  }

  // Generic submit handler for every registration form (hero + modal).
  function attachForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fn = form.querySelector('[name="first_name"]');
      var em = form.querySelector('[name="email"]');
      var ph = form.querySelector('[name="phone"]');
      var ok = true;
      [fn, em, ph].forEach(function (f) {
        if (!f.value.trim()) { f.style.borderColor = '#e0556b'; ok = false; }
        else { f.style.borderColor = ''; }
      });
      if (!ok) return;
      var btn = form.querySelector('.btn');
      btn.innerHTML = 'Saving your seat…';
      btn.disabled = true;
      var params = new URLSearchParams({ name: fn.value.trim() });
      window.location.href = '/yasir-webinar/vip?' + params.toString();
    });
  }
  document.querySelectorAll('.js-reg-form').forEach(attachForm);

  // Open / close
  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    var f = modal.querySelector('[name="first_name"]');
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  if (modal) {
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  // Every CTA / the video opens the popup.
  var openers = document.querySelectorAll('.tb-cta, .hv-frame, .final .cta-wrap .btn');
  openers.forEach(function (el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---------- Hero video: fast gif-style photo shuffle ---------- */
  var slides = document.querySelectorAll('#hv-slides .hv-slide');
  if (slides.length > 1) {
    var si = 0;
    setInterval(function () {
      slides[si].classList.remove('is-active');
      si = (si + 1) % slides.length;
      slides[si].classList.add('is-active');
    }, 520);
  }

  /* ---------- Testimonials carousel ---------- */
  (function () {
    var track = document.getElementById('ttrack');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);
    var prev = document.getElementById('t-prev');
    var next = document.getElementById('t-next');
    var dotsWrap = document.getElementById('tdots');
    var idx = 0, gap = 20;

    function visibleCount() {
      var w = window.innerWidth;
      if (w <= 600) return 1;
      if (w <= 900) return 2;
      return 3;
    }
    function maxIdx() { return Math.max(0, cards.length - visibleCount()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIdx(); i++) {
        var d = document.createElement('button');
        d.className = 'tdot' + (i === idx ? ' on' : '');
        d.type = 'button';
        d.setAttribute('aria-label', 'Go to testimonial group ' + (i + 1));
        (function (n) { d.addEventListener('click', function () { idx = n; update(); }); })(i);
        dotsWrap.appendChild(d);
      }
    }
    function update() {
      if (idx > maxIdx()) idx = maxIdx();
      var cw = cards[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(' + (-idx * (cw + gap)) + 'px)';
      prev.disabled = idx <= 0;
      next.disabled = idx >= maxIdx();
      var dots = dotsWrap.querySelectorAll('.tdot');
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }
    prev.addEventListener('click', function () { if (idx > 0) { idx--; update(); } });
    next.addEventListener('click', function () { if (idx < maxIdx()) { idx++; update(); } });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildDots(); update(); }, 150);
    });
    buildDots();
    update();
  })();

  /* ---------- Animated stat counters ---------- */
  (function () {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    function fmt(v, dec, comma) {
      var s = dec ? v.toFixed(dec) : String(Math.round(v));
      if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return s;
    }
    function run(el) {
      var to = parseFloat(el.getAttribute('data-to'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var comma = el.getAttribute('data-comma') === '1';
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1500, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * eased, dec, comma) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(to, dec, comma) + suffix;
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { run(en.target); so.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      nums.forEach(function (n) { so.observe(n); });
    } else {
      nums.forEach(run);
    }
  })();
})();
