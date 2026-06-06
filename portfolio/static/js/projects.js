/* ============================================================
   PROJECTS.JS — Card tilt · Stagger reveal · Image lazy load
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Card 3D tilt (desktop only) ─────────────────────── */
  function initCardTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll(".project-card, .featured-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect  = card.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const tiltX = ((y - cy) / cy) * -5;
        const tiltY = ((x - cx) / cx) *  5;

        card.style.transform = `translateY(-5px) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
        card.style.transform  = "";
        setTimeout(() => { card.style.transition = ""; }, 500);
      });
    });
  }

  /* ── 2. Stagger reveal for project grid ─────────────────── */
  function initGridReveal() {
    const grids = document.querySelectorAll(".projects-grid, .featured-grid");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const cards = entry.target.querySelectorAll(".project-card, .featured-card");
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add("visible"), i * 90);
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05 }
    );

    grids.forEach((g) => observer.observe(g));
  }

  /* ── 3. Image progressive load (blur-up) ────────────────── */
  function initImageReveal() {
    const imgs = document.querySelectorAll(".featured-img, .project-img");

    imgs.forEach((img) => {
      img.style.filter     = "blur(8px)";
      img.style.transition = "filter 0.5s ease";

      if (img.complete) {
        img.style.filter = "blur(0)";
      } else {
        img.addEventListener("load", () => {
          img.style.filter = "blur(0)";
        });
      }
    });
  }

  /* ── 4. Featured card — animate overlay buttons on enter ── */
  function initOverlayAnimation() {
    document.querySelectorAll(".featured-thumb, .project-thumb").forEach((thumb) => {
      const btns = thumb.querySelectorAll(".thumb-action-btn, .overlay-icon-btn");

      thumb.addEventListener("mouseenter", () => {
        btns.forEach((btn, i) => {
          btn.style.transitionDelay = `${i * 60}ms`;
          btn.style.transform = "translateY(0) scale(1)";
          btn.style.opacity   = "1";
        });
      });

      thumb.addEventListener("mouseleave", () => {
        btns.forEach((btn) => {
          btn.style.transitionDelay = "0ms";
        });
      });

      // Init state
      btns.forEach((btn) => {
        btn.style.transform  = "translateY(10px) scale(0.95)";
        btn.style.opacity    = "0";
        btn.style.transition = "transform 0.3s var(--ease-out, cubic-bezier(0.16,1,0.3,1)), opacity 0.3s ease";
      });
    });
  }

  /* ── 5. Scroll-to-section from nav ──────────────────────── */
  function initSectionNav() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id     = a.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initGridReveal();
    initCardTilt();
    initImageReveal();
    initOverlayAnimation();
    initSectionNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();