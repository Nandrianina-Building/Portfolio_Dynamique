/* ============================================================
   SKILLS.JS — Line progress bars · Stagger · Counter · Glow
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Animate fill + glow width on scroll ──────────────── */
  function initBars() {
    var fills = document.querySelectorAll(".skill-fill[data-level]");
    var glows = document.querySelectorAll(".skill-glow[data-level]");
    if (!fills.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var fill  = entry.target;
        var level = parseInt(fill.dataset.level, 10) || 0;
        var row   = fill.closest(".skill-row");
        var glow  = row && row.querySelector(".skill-glow[data-level]");

        setTimeout(function () {
          fill.style.width = level + "%";
          if (glow) glow.style.width = level + "%";

          /* show tip dot after bar finishes */
          setTimeout(function () {
            fill.classList.add("animated");
          }, 1000);
        }, 100);

        observer.unobserve(fill);
      });
    }, { threshold: 0.5 });

    fills.forEach(function (f) { observer.observe(f); });
  }

  /* ── 2. Stagger rows per section on scroll ───────────────── */
  function initRowStagger() {
    var lists = document.querySelectorAll(".skills-list");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var rows = entry.target.querySelectorAll(".skill-row");
        rows.forEach(function (row, i) {
          setTimeout(function () {
            row.classList.add("visible");
          }, i * 70);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

    lists.forEach(function (l) { observer.observe(l); });
  }

  /* ── 3. Animated % counter synced to bar ─────────────────── */
  function initCounters() {
    var fills = document.querySelectorAll(".skill-fill[data-level]");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var fill   = entry.target;
        var row    = fill.closest(".skill-row");
        var pctEl  = row && row.querySelector(".skill-pct");
        if (!pctEl) return;

        var target   = parseInt(fill.dataset.level, 10) || 0;
        var start    = performance.now();
        var duration = 1000;

        (function tick(now) {
          var elapsed  = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var ease     = 1 - Math.pow(1 - progress, 3);
          pctEl.textContent = Math.round(target * ease) + "%";
          if (progress < 1) requestAnimationFrame(tick);
        })(start);

        observer.unobserve(fill);
      });
    }, { threshold: 0.5 });

    fills.forEach(function (f) { observer.observe(f); });
  }

  /* ── 4. Hover: brief fill pulse ──────────────────────────── */
  function initHoverPulse() {
    document.querySelectorAll(".skill-row").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var fill = row.querySelector(".skill-fill");
        if (!fill) return;

        var current = parseFloat(fill.style.width) || 0;
        fill.style.transition = "width 0.15s ease";
        fill.style.width = Math.min(current + 3, 100) + "%";

        setTimeout(function () {
          fill.style.transition = "width 0.25s ease";
          fill.style.width = current + "%";
          setTimeout(function () { fill.style.transition = ""; }, 260);
        }, 160);
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
    initBars();
    initRowStagger();
    initCounters();
    initHoverPulse();
    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
