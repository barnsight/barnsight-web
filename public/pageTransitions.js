(function initPageTransitions() {
  const body = document.body;
  if (!body) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    body.classList.remove("page-transition");
    return;
  }

  requestAnimationFrame(() => {
    body.classList.add("page-enter-active");
  });

  function shouldHandleLink(anchor, event) {
    if (!anchor || event.defaultPrevented) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.dataset.noTransition === "true") return false;
    if (!anchor.href) return false;
    const rawHref = (anchor.getAttribute("href") || "").trim();
    if (rawHref.startsWith("#")) return false;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const isHashOnly = url.pathname === window.location.pathname && url.search === window.location.search && url.hash;
    if (isHashOnly) return false;
    return true;
  }

  function handleHashLink(anchor) {
    if (!anchor) return false;
    const rawHref = (anchor.getAttribute("href") || "").trim();
    if (!rawHref.startsWith("#")) return false;
    if (rawHref.length <= 1) return true;

    const id = decodeURIComponent(rawHref.slice(1));
    const target = document.getElementById(id);
    if (!target) return true;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${encodeURIComponent(id)}`);
    return true;
  }

  function animateExit(nextUrl) {
    if (body.dataset.exiting === "1") return;
    body.dataset.exiting = "1";
    body.classList.remove("page-enter-active");
    body.classList.add("page-exit-active");
    window.setTimeout(() => {
      window.location.assign(nextUrl);
    }, 280);
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (handleHashLink(anchor)) {
      event.preventDefault();
      return;
    }
    if (!shouldHandleLink(anchor, event)) return;
    event.preventDefault();
    animateExit(anchor.href);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.dataset.noTransition === "true") return;
    if (body.dataset.exiting === "1") return;

    const method = (form.method || "get").toLowerCase();
    const action = form.action || window.location.href;
    const url = new URL(action, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    body.dataset.exiting = "1";
    body.classList.remove("page-enter-active");
    body.classList.add("page-exit-active");

    window.setTimeout(() => {
      form.dataset.noTransition = "true";
      if (method === "get") {
        window.location.assign(url.toString());
      } else {
        form.submit();
      }
    }, 280);
  });

  window.addEventListener("pageshow", () => {
    body.dataset.exiting = "0";
    body.classList.remove("page-exit-active");
    body.classList.remove("page-enter-active");
    requestAnimationFrame(() => body.classList.add("page-enter-active"));
  });
})();
