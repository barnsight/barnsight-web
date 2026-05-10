/* ------------------------------------------------------------------ */
/* Shared site-wide interactivity:                                     */
/*  - theme toggle (light/dark, persisted, system-aware)               */
/*  - scroll-triggered reveal animations                               */
/*  - animated number counters                                         */
/*  - subtle hover-tilt on opt-in cards                                */
/*  - live API health pulse                                            */
/*  - pricing tab sliding pill                                         */
/* ------------------------------------------------------------------ */

(function setupTheme() {
  const locale = document.documentElement.lang === "en" ? "en" : "uk";
  const ui = {
    uk: {
      switchLight: "Увімкнути світлу тему",
      switchDark: "Увімкнути темну тему",
    },
    en: {
      switchLight: "Switch to light theme",
      switchDark: "Switch to dark theme",
    },
  }[locale];
  const STORAGE_KEY = "barnsight.theme";
  const root = document.documentElement;

  function preferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? ui.switchLight : ui.switchDark,
      );
    });
  }

  apply(preferredTheme());

  function bind() {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      if (btn.dataset.themeBound === "1") return;
      btn.dataset.themeBound = "1";
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {}
        apply(next);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {}
      apply(event.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else if (mq.addListener) mq.addListener(listener);
  }
})();

(function setupReveals() {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach((node) => observer.observe(node));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function setupCounters() {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function format(value, decimals) {
    return decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString();
  }

  function animate(node) {
    const target = Number(node.dataset.target);
    if (!Number.isFinite(target)) return;
    const decimals = Number(node.dataset.decimals || 0);
    const suffix = node.dataset.suffix || "";
    const prefix = node.dataset.prefix || "";
    const duration = Math.max(400, Number(node.dataset.duration || 1400));

    if (reduced) {
      node.textContent = `${prefix}${format(target, decimals)}${suffix}`;
      return;
    }

    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = `${prefix}${format(target * eased, decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll(".counter[data-target]");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );

    counters.forEach((node) => observer.observe(node));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function setupTilt() {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  function bind(node) {
    let rect = null;
    const max = Number(node.dataset.tiltMax || 6);

    function onEnter() {
      rect = node.getBoundingClientRect();
    }

    function onMove(event) {
      if (!rect) rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-2px)`;
    }

    function onLeave() {
      rect = null;
      node.style.transform = "";
    }

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
  }

  function init() {
    document.querySelectorAll(".tilt-card").forEach(bind);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function setupHealthPulse() {
  const locale = document.documentElement.lang === "en" ? "en" : "uk";
  const ui = {
    uk: {
      ok: "API · OK",
      warnPrefix: "API ·",
      offline: "API · офлайн",
    },
    en: {
      ok: "API · OK",
      warnPrefix: "API ·",
      offline: "API · offline",
    },
  }[locale];

  function init() {
    const dot = document.querySelector("[data-api-health]");
    const label = document.querySelector("[data-api-health-label]");
    if (!dot) return;

    fetch("/app/api/health", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        const ok = (data?.status || "ok").toLowerCase() === "ok";
        dot.classList.add(ok ? "is-ok" : "is-bad");
        if (label) label.textContent = ok ? ui.ok : `${ui.warnPrefix} ${data?.status || "warn"}`;
      })
      .catch(() => {
        dot.classList.add("is-bad");
        if (label) label.textContent = ui.offline;
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function setupPricingPill() {
  function init() {
    const groups = document.querySelectorAll(".pricing-tabs");
    groups.forEach((group) => {
      const tabs = group.querySelectorAll(".pricing-tab");
      if (!tabs.length) return;

      let pill = group.querySelector(".pricing-tab-pill");
      if (!pill) {
        pill = document.createElement("span");
        pill.className = "pricing-tab-pill";
        group.prepend(pill);
      }

      function place(tab) {
        const groupRect = group.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        pill.style.transform = `translateX(${(tabRect.left - groupRect.left).toFixed(1)}px)`;
        pill.style.width = `${tabRect.width.toFixed(1)}px`;
      }

      function activate(tab) {
        tabs.forEach((other) => other.classList.toggle("is-active", other === tab));
        place(tab);
      }

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => activate(tab));
      });

      const initial = group.querySelector(".pricing-tab.is-active") || tabs[0];
      requestAnimationFrame(() => activate(initial));
      window.addEventListener("resize", () => {
        const active = group.querySelector(".pricing-tab.is-active");
        if (active) place(active);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
