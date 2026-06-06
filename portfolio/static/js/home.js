/* ============================================================
   HOME.JS — Animated counters · Typed title · Hero entrance
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Animated counters ────────────────────────────────── */
  function animateCounter(el, target, duration) {
    const start     = performance.now();
    const startVal  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".stat-number[data-target]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target, 1400);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ── 2. Typed subtitle effect ────────────────────────────── */
  function initTyped() {
    const el = document.querySelector(".hero-subtitle");
    if (!el) return;

    const original = el.textContent.trim();
    el.textContent  = "";
    el.style.borderRight = "2px solid var(--accent-primary)";
    el.style.display     = "inline-block";
    el.style.whiteSpace  = "nowrap";
    el.style.overflow    = "hidden";

    let index = 0;

    function type() {
      if (index <= original.length) {
        el.textContent = original.slice(0, index);
        index++;
        setTimeout(type, 45);
      } else {
        // Blinking cursor then stop
        let blink = 0;
        const cursor = setInterval(() => {
          el.style.borderRightColor = blink++ % 2 === 0
            ? "var(--accent-primary)"
            : "transparent";
          if (blink > 6) {
            clearInterval(cursor);
            el.style.borderRight = "none";
          }
        }, 400);
      }
    }

    // Start after hero entrance delay
    setTimeout(type, 600);
  }

  /* ── 3. Hero entrance animation ─────────────────────────── */
  function initHeroEntrance() {
    // Force reveal on hero items (no scroll needed — above fold)
    const heroReveals = document.querySelectorAll(
      ".hero .reveal, .hero .stagger"
    );

    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 80);
    });
  }

  /* ── 4. Service card tilt ────────────────────────────────── */
  function initCardTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const cx      = rect.width  / 2;
        const cy      = rect.height / 2;
        const tiltX   = ((y - cy) / cy) * -6;
        const tiltY   = ((x - cx) / cx) *  6;

        card.style.transform = `
          translateY(-4px)
          perspective(600px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = `transform 0.4s var(--ease-out, cubic-bezier(0.16,1,0.3,1))`;
        setTimeout(() => { card.style.transition = ""; }, 400);
      });
    });
  }

  /* ── 5. Parallax hero blobs (subtle) ─────────────────────── */
  function initParallax() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blobs = document.querySelectorAll(".blob");

    window.addEventListener("mousemove", (e) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;

      blobs.forEach((blob, i) => {
        const depth  = (i + 1) * 12;
        const x      = dx * depth;
        const y      = dy * depth;
        blob.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, { passive: true });
  }

  /* ── 6. Active section highlight (scroll-spy) ────────────── */
  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute("href") || "";
              link.classList.toggle("active", href.includes(id));
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    initHeroEntrance();
    initTyped();
    initCounters();
    initCardTilt();
    initParallax();
    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();