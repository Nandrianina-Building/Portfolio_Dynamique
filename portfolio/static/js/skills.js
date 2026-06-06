/* ============================================================
   SKILLS.JS — Circular SVG ring animation · Stagger · Counter
   ============================================================ */

(function () {
  "use strict";

  /* circumference = 2 * PI * r = 2 * 3.14159 * 40 ≈ 251.2 */
  var CIRCUMFERENCE = 251.2;

  /* ── 1. Animate ring fills when card enters viewport ──────── */
  function initRings() {
    var rings = document.querySelectorAll(".ring-fill[data-level]");
    if (!rings.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var ring  = entry.target;
        var level = parseInt(ring.dataset.level, 10) || 0;
        var offset = CIRCUMFERENCE - (level / 100) * CIRCUMFERENCE;

        /* slight delay so card reveal animation finishes first */
        setTimeout(function () {
          ring.style.strokeDashoffset = offset;
        }, 150);

        observer.unobserve(ring);
      });
    }, { threshold: 0.4 });

    rings.forEach(function (ring) { observer.observe(ring); });
  }

  /* ── 2. Stagger cards per grid on scroll ─────────────────── */
  function initCardStagger() {
    var grids = document.querySelectorAll(".skills-grid");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var cards = entry.target.querySelectorAll(".skill-card");
        cards.forEach(function (card, i) {
          setTimeout(function () { card.classList.add("visible"); }, i * 55);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

    grids.forEach(function (g) { observer.observe(g); });
  }

  /* ── 3. Animated % counter in the ring centre ────────────── */
  function initCounters() {
    var cards = document.querySelectorAll(".skill-card");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var card    = entry.target;
        var pctEl   = card.querySelector(".skill-ring-pct");
        var ringFill = card.querySelector(".ring-fill[data-level]");
        if (!pctEl || !ringFill) return;

        var target   = parseInt(ringFill.dataset.level, 10) || 0;
        var start    = performance.now();
        var duration = 1100;

        (function tick(now) {
          var elapsed  = now - start;
          var progress = Math.min(elapsed / duration, 1);
          /* ease-out cubic */
          var ease     = 1 - Math.pow(1 - progress, 3);
          pctEl.textContent = Math.round(target * ease) + "%";
          if (progress < 1) requestAnimationFrame(tick);
        })(start);

        observer.unobserve(card);
      });
    }, { threshold: 0.4 });

    cards.forEach(function (c) { observer.observe(c); });
  }

  /* ── 4. Hover: pulse ring once ───────────────────────────── */
  function initRingPulse() {
    document.querySelectorAll(".skill-card").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        var ring = card.querySelector(".ring-fill");
        if (!ring) return;
        ring.style.transition = "stroke-dashoffset 0.3s ease, filter 0.25s ease";
        /* tiny bounce: shrink offset then restore */
        var current = parseFloat(ring.style.strokeDashoffset) || 0;
        var bounce  = current + 8;
        ring.style.strokeDashoffset = bounce;
        setTimeout(function () {
          ring.style.strokeDashoffset = current;
        }, 160);
      });

      card.addEventListener("mouseleave", function () {
        var ring = card.querySelector(".ring-fill");
        if (ring) ring.style.transition = "";
      });
    });
  }

  /* ── 5. Scroll-spy: keep Skills nav link active ──────────── */
  function initScrollSpy() {
    var sections = document.querySelectorAll(".skills-section[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              (link.getAttribute("href") || "").includes("skills")
            );
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initRings();
    initCardStagger();
    initCounters();
    initRingPulse();
    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();