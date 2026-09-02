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

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    var header = document.querySelector("header.site-header");
    if (!toggle || !nav) return;

    function setHeaderHeight() {
      if (header) {
        document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
      }
    }
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);

    function closeNav() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openNav() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav(); else openNav();
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  function initSpecialtiesToggle() {
    var btn = document.getElementById("btn-specialties-toggle");
    var extra = document.getElementById("specialties-extra");
    if (!btn || !extra) return;
    btn.addEventListener("click", function () {
      var isOpen = extra.classList.toggle("is-open");
      btn.classList.toggle("is-open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      var label = btn.querySelector(".btn-label");
      if (label) {
        label.textContent = isOpen ? "Ver menos especialidades" : "Ver todas las especialidades (26)";
      }
      if (isOpen) {
        extra.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function initCrimeAccordion() {
    var items = document.querySelectorAll(".crime-item");
    if (!items.length) return;
    items.forEach(function (item) {
      var btn = item.querySelector(".crime-q");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  // Sección "Últimos artículos" en portada: lee /assets/data/blog-posts.json
  // y pinta los 3 primeros. Publicar un artículo nuevo solo requiere añadir
  // una entrada al principio de ese JSON — esta portada se actualiza sola,
  // sin tocar index.html. Si falla la carga (sin JS, red, etc.) se conserva
  // el bloque estático ya presente en el HTML como respaldo.
  function buildBlogCard(post) {
    var a = document.createElement("a");
    a.href = "/blog/" + post.slug + "/";
    a.className = "blog-card";
    a.style.textDecoration = "none";

    var cover = document.createElement("div");
    cover.className = "blog-cover";
    var img = document.createElement("img");
    img.src = post.img;
    img.alt = post.alt || post.title;
    img.loading = "lazy";
    var mark = document.createElement("span");
    mark.className = "mark";
    mark.style.display = "none";
    mark.textContent = "ASM";
    img.onerror = function () {
      mark.style.display = "flex";
      img.remove();
    };
    cover.appendChild(img);
    cover.appendChild(mark);

    var body = document.createElement("div");
    body.className = "blog-card-body";
    var cat = document.createElement("div");
    cat.className = "cat";
    cat.textContent = post.cat;
    var h3 = document.createElement("h3");
    h3.textContent = post.title;
    var p = document.createElement("p");
    p.textContent = post.excerpt;
    var more = document.createElement("span");
    more.className = "more";
    more.textContent = "Leer artículo";
    body.appendChild(cat);
    body.appendChild(h3);
    body.appendChild(p);
    body.appendChild(more);

    a.appendChild(cover);
    a.appendChild(body);
    return a;
  }

  function initLatestPosts() {
    var grid = document.getElementById("latest-posts-grid");
    if (!grid) return;
    fetch("/assets/data/blog-posts.json")
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var posts = data && data.posts;
        if (!posts || !posts.length) return;
        var frag = document.createDocumentFragment();
        posts.slice(0, 3).forEach(function (post) {
          frag.appendChild(buildBlogCard(post));
        });
        grid.innerHTML = "";
        grid.appendChild(frag);
      })
      .catch(function () {
        // Sin conexión al JSON: se deja el respaldo estático ya presente en el HTML.
      });
  }

  // Aviso de cookies: el sitio no usa cookies de analítica ni publicidad,
  // solo localStorage técnico para recordar que el aviso ya se mostró.
  // Se construye por JS para no tener que tocar cada página del sitio.
  function initCookieBanner() {
    var STORAGE_KEY = "asm-cookie-notice-dismissed";
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch (e) {
      return; // Sin acceso a localStorage: no insistimos con el aviso.
    }

    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de cookies");

    var inner = document.createElement("div");
    inner.className = "cookie-banner-inner";

    var text = document.createElement("p");
    text.innerHTML = 'Este sitio no usa cookies de analítica ni publicidad, solo almacenamiento técnico necesario. Más información en la <a href="/politica-de-cookies/">política de cookies</a>.';

    var actions = document.createElement("div");
    actions.className = "cookie-banner-actions";

    var moreBtn = document.createElement("a");
    moreBtn.href = "/politica-de-cookies/";
    moreBtn.textContent = "Más información";
    moreBtn.style.cssText = "align-self:center; color:#cfd4dd; font-size:0.85rem; text-decoration:underline;";

    var acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.className = "cookie-accept";
    acceptBtn.textContent = "Entendido";

    function dismiss() {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
      banner.classList.remove("is-visible");
      window.setTimeout(function () { banner.remove(); }, 400);
    }
    acceptBtn.addEventListener("click", dismiss);

    actions.appendChild(moreBtn);
    actions.appendChild(acceptBtn);
    inner.appendChild(text);
    inner.appendChild(actions);
    banner.appendChild(inner);
    document.body.appendChild(banner);

    window.requestAnimationFrame(function () {
      window.setTimeout(function () { banner.classList.add("is-visible"); }, 200);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markRevealTargets();
    initScrollReveal();
    initHeaderShadow();
    initMobileNav();
    initSpecialtiesToggle();
    initCrimeAccordion();
    initLatestPosts();
    initCookieBanner();
  });
})();
