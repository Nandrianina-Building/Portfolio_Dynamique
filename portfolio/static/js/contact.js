/* ============================================================
   CONTACT.JS — Form validation · Submit state · Input focus fx
   ============================================================ */

(function () {
  "use strict";

  /* ── 1. Floating label effect on inputs ──────────────────── */
  function initInputFocus() {
    document.querySelectorAll(".contact-form input, .contact-form textarea").forEach((input) => {

      // Add wrapper class when filled
      function checkFilled() {
        input.classList.toggle("filled", input.value.trim().length > 0);
      }

      input.addEventListener("input",  checkFilled);
      input.addEventListener("change", checkFilled);
      checkFilled();

      // Subtle scale on focus
      input.addEventListener("focus", () => {
        const group = input.closest(".form-group");
        if (group) group.style.transform = "translateY(-1px)";
      });

      input.addEventListener("blur", () => {
        const group = input.closest(".form-group");
        if (group) group.style.transform = "";
      });
    });
  }

  /* ── 2. Client-side validation ───────────────────────────── */
  function validateForm(form) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll(".field-error").forEach((el) => el.remove());
    form.querySelectorAll("input, textarea").forEach((el) => el.classList.remove("error"));

    const fields = [
      { name: "name",    label: "Name",    minLen: 2 },
      { name: "email",   label: "Email",   type: "email" },
      { name: "subject", label: "Subject", minLen: 3 },
      { name: "message", label: "Message", minLen: 10 },
    ];

    fields.forEach(({ name, label, minLen, type }) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (!input) return;

      const val = input.value.trim();
      let error = "";

      if (!val) {
        error = `${label} is required.`;
      } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        error = "Please enter a valid email address.";
      } else if (minLen && val.length < minLen) {
        error = `${label} must be at least ${minLen} characters.`;
      }

      if (error) {
        valid = false;
        input.classList.add("error");
        const span = document.createElement("span");
        span.className = "field-error";
        span.textContent = error;
        input.closest(".form-group")?.appendChild(span);
      }
    });

    return valid;
  }

  /* ── 3. Submit loading state ─────────────────────────────── */
  function initSubmitState() {
    const form = document.getElementById("contact-form");
    const btn  = document.getElementById("submit-btn");
    if (!form || !btn) return;

    form.addEventListener("submit", (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
        // Shake animation on invalid
        btn.style.animation = "none";
        requestAnimationFrame(() => {
          btn.style.animation = "btnShake 0.4s ease";
        });
        return;
      }

      // Show loading
      btn.classList.add("loading");
      btn.disabled = true;
    });
  }

  /* ── 4. Auto-dismiss alerts ──────────────────────────────── */
  function initAlerts() {
    document.querySelectorAll(".form-alert").forEach((alert) => {
      setTimeout(() => {
        alert.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        alert.style.opacity    = "0";
        alert.style.transform  = "translateY(-8px)";
        setTimeout(() => alert.remove(), 400);
      }, 5000);
    });
  }

  /* ── 5. Character counter for textarea ───────────────────── */
  function initCharCounter() {
    const textarea = document.querySelector(".contact-form textarea");
    if (!textarea) return;

    const counter = document.createElement("span");
    counter.style.cssText = `
      display: block;
      text-align: right;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
      transition: color 0.2s ease;
    `;

    textarea.parentNode.appendChild(counter);

    function update() {
      const len = textarea.value.length;
      counter.textContent = `${len} character${len !== 1 ? "s" : ""}`;
      counter.style.color = len > 800 ? "#f87171" : "var(--text-muted)";
    }

    textarea.addEventListener("input", update);
    update();
  }

  /* ── 6. Inject shake keyframes ───────────────────────────── */
  function injectKeyframes() {
    if (document.getElementById("contact-keyframes")) return;
    const style = document.createElement("style");
    style.id = "contact-keyframes";
    style.textContent = `
      @keyframes btnShake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    injectKeyframes();
    initInputFocus();
    initSubmitState();
    initAlerts();
    initCharCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();