/* ============================================================
   BASE.JS — Global interactions
   Scroll header · Active nav · Hamburger · Reveal animations
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Header scroll state ─────────────────────────────── */
  const header = document.getElementById("site-header");

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader(); // run on load

  /* ── 2. Active nav link ─────────────────────────────────── */
  const currentPath = window.location.pathname;

  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isHome = (href === "/" || href.endsWith("/home/") || href === currentPath);
    const isMatch = currentPath === href || currentPath.startsWith(href) && href !== "/";

    if (isMatch || (currentPath === "/" && (href === "/" || href.includes("home")))) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ── 3. Hamburger / Mobile Drawer ──────────────────────── */
  const hamburger     = document.getElementById("hamburger");
  const mobileDrawer  = document.getElementById("mobile-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");

  function openDrawer() {
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileDrawer.classList.add("open");
    mobileDrawer.removeAttribute("aria-hidden");
    drawerOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileDrawer.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    drawerOverlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.contains("open") ? closeDrawer() : openDrawer();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  // Close drawer on nav link click
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeDrawer();
  });

  /* ── 4. Scroll Reveal (IntersectionObserver) ────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  function initReveal() {
    document.querySelectorAll(".reveal, .stagger").forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* ── 5. Cursor glow (subtle, desktop only) ──────────────── */
  function initCursorGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch

    const glow = document.createElement("div");
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
      will-change: left, top;
    `;
    document.body.appendChild(glow);

    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    }, { passive: true });
  }

  /* ── 6. Smooth anchor links ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue("--header-height")) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── 7. Init ────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initCursorGlow();
  });

  // Also run if DOM already loaded
  if (document.readyState !== "loading") {
    initReveal();
    initCursorGlow();
  }

})();