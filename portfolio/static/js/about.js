/* ============================================================
   ABOUT.JS — Timeline animated entrance · progress line draw
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Timeline items stagger on scroll ─────────────────── */
  function initTimelineReveal() {
    const items = document.querySelectorAll(".timeline-item");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item, i) => {
      // override transition delay for stagger
      item.style.transitionDelay = `${i * 80}ms`;
      observer.observe(item);
    });
  }

  /* ── 2. Draw timeline track on scroll ───────────────────── */
  function initTimelineDraw() {
    const timelines = document.querySelectorAll(".timeline");

    timelines.forEach((tl) => {
      const track = document.createElement("span");
      track.setAttribute("aria-hidden", "true");
      track.style.cssText = `
        position: absolute;
        left: 12px;
        top: 24px;
        width: 1px;
        height: 0;
        background: var(--accent-primary);
        opacity: 0.3;
        z-index: 0;
        transition: height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      `;
      tl.appendChild(track);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const totalHeight = tl.scrollHeight - 48;
            track.style.height = totalHeight + "px";
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(tl);
    });
  }

  /* ── 3. Dot pulse on hover (keyboard accessible) ─────────── */
  function initDotInteraction() {
    document.querySelectorAll(".timeline-card").forEach((card) => {
      card.setAttribute("tabindex", "0");

      card.addEventListener("focus", () => {
        const dot = card.closest(".timeline-item")?.querySelector(".timeline-dot");
        if (dot) dot.style.transform = "scale(1.15)";
      });

      card.addEventListener("blur", () => {
        const dot = card.closest(".timeline-item")?.querySelector(".timeline-dot");
        if (dot) dot.style.transform = "";
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initTimelineReveal();
    initTimelineDraw();
    initDotInteraction();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();