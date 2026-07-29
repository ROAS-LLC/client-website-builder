/* Digital Services US — interaction & scroll choreography
   Lenis smooth scroll + GSAP/ScrollTrigger. Everything here is
   progressive enhancement: content renders fully without JS. */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var desktop = window.matchMedia("(min-width: 1024px)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!reducedMotion && typeof window.Lenis !== "undefined" && hasGsap) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Smooth anchor navigation (works with or without Lenis) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- Navigation ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("nav-burger");
  var links = document.getElementById("nav-links");

  function onScrollNav() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  function closeMenu() {
    links.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  /* ---------- Preloader + cinematic hero reveal ---------- */
  var preloader = document.getElementById("preloader");
  function heroReveal() {
    if (!hasGsap || reducedMotion) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero .line", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.12 }, 0.1)
      .from(".hero .eyebrow", { opacity: 0, y: 14, duration: 0.7 }, 0.35)
      .from(".hero__sub", { opacity: 0, y: 24, duration: 0.8 }, 0.55)
      .from(".hero__actions", { opacity: 0, y: 24, duration: 0.8 }, 0.7)
      .from(".hero__chip", { opacity: 0, y: 30, scale: 0.92, duration: 0.9, stagger: 0.12 }, 0.65)
      .from(".hero__scrollhint", { opacity: 0, duration: 0.6 }, 1.1);
  }

  var preloaderDone = false;
  function dismissPreloader() {
    if (!preloader || preloaderDone) return;
    preloaderDone = true;
    if (!hasGsap || reducedMotion) {
      preloader.style.display = "none";
      return;
    }
    var tl = gsap.timeline();
    tl.to(".preloader__bar span", { width: "100%", duration: 0.55, ease: "power2.inOut" })
      .to(preloader, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: function () { preloader.style.display = "none"; }
      }, "+=0.1")
      .add(heroReveal, "-=0.35");
  }
  if (document.readyState === "complete") dismissPreloader();
  else window.addEventListener("load", dismissPreloader);
  /* Safety: never trap the page behind the preloader */
  setTimeout(dismissPreloader, 3500);

  /* ---------- Custom cursor (desktop only) ---------- */
  var cursor = document.getElementById("cursor");
  if (cursor && finePointer && !reducedMotion && hasGsap) {
    var dotX = gsap.quickTo(".cursor__dot", "x", { duration: 0.08, ease: "power2.out" });
    var dotY = gsap.quickTo(".cursor__dot", "y", { duration: 0.08, ease: "power2.out" });
    var ringX = gsap.quickTo(".cursor__ring", "x", { duration: 0.35, ease: "power3.out" });
    var ringY = gsap.quickTo(".cursor__ring", "y", { duration: 0.35, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) {
      cursor.classList.add("is-on");
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    }, { passive: true });
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("[data-view]")) {
        cursor.classList.add("is-view");
        cursor.classList.remove("is-link");
      } else if (e.target.closest("a, button")) {
        cursor.classList.add("is-link");
        cursor.classList.remove("is-view");
      } else {
        cursor.classList.remove("is-link", "is-view");
      }
    });
  }

  /* ---------- Magnetic CTAs ---------- */
  if (finePointer && !reducedMotion && hasGsap) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 22;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        var y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        gsap.to(el, { x: x, y: y, duration: 0.4, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reducedMotion && hasGsap) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        gsap.to(el, {
          rotateX: rx, rotateY: ry, z: 14,
          transformPerspective: 900, duration: 0.5, ease: "power2.out"
        });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { rotateX: 0, rotateY: 0, z: 0, duration: 0.8, ease: "power3.out" });
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  if (hasGsap && !reducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) return; // hero handled by load timeline
      gsap.from(el, {
        opacity: 0,
        y: 42,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    document.querySelectorAll("[data-reveal-lines]").forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 56,
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

    /* gentle continuous float on data-float elements */
    document.querySelectorAll("[data-float]").forEach(function (el, i) {
      gsap.to(el, {
        y: i % 2 ? 10 : -10,
        duration: 3.2 + (i % 3) * 0.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.25
      });
    });

    /* hero chips parallax out on scroll */
    gsap.to(".hero__stage", {
      yPercent: 18,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---------- Stat counters ---------- */
  var counters = document.querySelectorAll(".stat__num");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reducedMotion || !hasGsap) { el.textContent = String(target); return; }
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: function () { el.textContent = String(Math.round(obj.v)); }
    });
  }
  if ("IntersectionObserver" in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          runCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Portfolio: 3D orbital showcase (scroll-scrubbed) ---------- */
  var orbitCapable = desktop && finePointer && !reducedMotion && hasGsap && window.ScrollTrigger;
  if (orbitCapable) {
    document.documentElement.classList.add("orbit-3d");
    var stage = document.getElementById("orbit-stage");
    var panels = Array.prototype.slice.call(stage.querySelectorAll(".panel"));
    var n = panels.length;
    var step = 360 / n;

    function layoutOrbit() {
      var w = Math.min(380, window.innerWidth * 0.3);
      var radius = Math.round((n * (w + 64)) / (2 * Math.PI));
      panels.forEach(function (panel, i) {
        panel.style.transform =
          "translate(-50%, -50%) rotateY(" + i * step + "deg) translateZ(" + radius + "px)";
      });
    }
    layoutOrbit();
    window.addEventListener("resize", layoutOrbit);

    var orbitState = { rot: 0 };
    function setActive(idx) {
      panels.forEach(function (p, i) { p.classList.toggle("is-active", i === idx); });
    }
    setActive(0);

    gsap.to(orbitState, {
      rot: -step * (n - 1),
      ease: "none",
      onUpdate: function () {
        stage.style.transform = "translateZ(-160px) rotateY(" + orbitState.rot + "deg)";
        var idx = Math.min(n - 1, Math.max(0, Math.round(-orbitState.rot / step)));
        setActive(idx);
      },
      scrollTrigger: {
        trigger: "#portfolio-pin",
        start: "top top",
        end: "+=" + n * 520,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });
  }

  /* ---------- Process timeline ---------- */
  var processLine = document.getElementById("process-line");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".process .step"));
  if (processLine && hasGsap && window.ScrollTrigger && !reducedMotion) {
    var len = processLine.getTotalLength();
    processLine.style.strokeDasharray = String(len);
    processLine.style.strokeDashoffset = String(len);
    gsap.to(processLine, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#process-track",
        start: "top 70%",
        end: "bottom 45%",
        scrub: 0.6
      }
    });
    steps.forEach(function (stepEl, i) {
      ScrollTrigger.create({
        trigger: stepEl,
        start: "top 62%",
        onEnter: function () {
          stepEl.classList.add("is-active");
          steps.slice(0, i).forEach(function (prev) { prev.classList.add("is-dim"); });
        },
        onLeaveBack: function () {
          stepEl.classList.remove("is-active");
          steps.slice(0, i).forEach(function (prev) { prev.classList.remove("is-dim"); });
        }
      });
    });
  } else {
    steps.forEach(function (s) { s.classList.add("is-active"); });
  }

  /* ---------- Testimonials 3D carousel ---------- */
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var cards = Array.prototype.slice.call(carousel.querySelectorAll(".tcard"));
    var dotsWrap = document.getElementById("t-dots");
    var current = 0;

    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Testimonial " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;
      cards.forEach(function (card, i) {
        card.classList.remove("is-active", "is-behind", "is-far");
        var d = (i - current + cards.length) % cards.length;
        if (d === 0) card.classList.add("is-active");
        else if (d === 1) card.classList.add("is-behind");
        else card.classList.add("is-far");
        card.setAttribute("aria-hidden", String(d !== 0));
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
        dot.setAttribute("aria-selected", String(i === current));
      });
    }
    document.getElementById("t-prev").addEventListener("click", function () { goTo(current - 1); });
    document.getElementById("t-next").addEventListener("click", function () { goTo(current + 1); });
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    });
    goTo(0);
  }

  /* ---------- Final CTA intensification ---------- */
  if (hasGsap && window.ScrollTrigger && !reducedMotion) {
    gsap.fromTo(".finale__portal",
      { scale: 0.82, opacity: 0.4 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: ".finale", start: "top 90%", end: "center center", scrub: true }
      });
  }
})();
