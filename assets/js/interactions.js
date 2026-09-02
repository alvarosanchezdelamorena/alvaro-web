// Álvaro Sánchez de la Morena del Olmo — interacciones de UI
// Scroll reveal, header con sombra al hacer scroll, y auto-marcado de reveal en bloques clave.
(function () {
  "use strict";

  function markRevealTargets() {
    var selectors = [
      ".hero-inner > div", ".hero-card",
      ".card", ".stat",
      ".notice", ".quote-block",
      "section.section-white .two-col > div",
      "section.section-cream .two-col > div",
      ".penas-table-wrap", "ul.help-list",
      ".cta-banner .container > *"
    ];
    var seen = new Set();
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        el.setAttribute("data-reveal", "");
      });
    });
    document.querySelectorAll(".grid-3").forEach(function (g) {
      g.setAttribute("data-reveal-group", "");
    });
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach(function (el) { io.observe(el); });
  }

  function initHeaderShadow() {
    var header = document.querySelector("header.site-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markRevealTargets();
    initScrollReveal();
    initHeaderShadow();
  });
})();
