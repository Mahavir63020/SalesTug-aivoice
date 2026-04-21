export function initializeMobileMenu() {
  initMobileMenu();
  initServicesDropdown();
  initServiceStatusBadges();
}

function initMobileMenu() {
  const burger = document.querySelector(".header-burger");
  const menu = document.getElementById("mobile-menu");
  if (!(burger instanceof HTMLElement) || !(menu instanceof HTMLElement)) return;

  const closeBtn = menu.querySelector(".mobile-menu-close");
  const panel = menu.querySelector(".mobile-menu-panel");
  const backdrop = menu.querySelector("[data-mobile-menu-close]");

  const setExpanded = (expanded) => {
    burger.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const lockScroll = (locked) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    document.documentElement.classList.toggle("is-mobile-menu-open", locked);
  };

  let closeFallback = null;

  const open = () => {
    if (!menu.hidden) return;
    menu.hidden = false;
    setExpanded(true);
    lockScroll(true);

    requestAnimationFrame(() => {
      menu.classList.add("is-open");
      if (closeBtn instanceof HTMLElement) closeBtn.focus();
    });
  };

  const finishClose = () => {
    menu.hidden = true;
    menu.classList.remove("is-open");
    lockScroll(false);
    setExpanded(false);
    burger.focus();
  };

  const close = () => {
    if (menu.hidden) return;
    menu.classList.remove("is-open");

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    if (prefersReducedMotion || !(panel instanceof HTMLElement)) {
      finishClose();
      return;
    }

    const onEnd = (event) => {
      if (event.target !== panel) return;
      panel.removeEventListener("transitionend", onEnd);
      finishClose();
    };

    panel.addEventListener("transitionend", onEnd);

    if (closeFallback) window.clearTimeout(closeFallback);
    closeFallback = window.setTimeout(() => {
      panel.removeEventListener("transitionend", onEnd);
      finishClose();
    }, 450);
  };

  const toggle = () => {
    if (menu.hidden) open();
    else close();
  };

  setExpanded(false);
  menu.hidden = true;
  menu.classList.remove("is-open");

  burger.addEventListener("click", toggle);
  if (closeBtn instanceof HTMLElement) closeBtn.addEventListener("click", close);
  if (backdrop instanceof HTMLElement) backdrop.addEventListener("click", close);

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const clickedLink = target.closest("a[href^='#']");
    if (clickedLink) close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menu.hidden) return;
    close();
  });
}

function initServicesDropdown() {
  const root = document.querySelector("[data-services-dropdown]");
  if (!(root instanceof HTMLElement)) return;

  const button = root.querySelector(".header-link--dropdown");
  const dropdown = root.querySelector(".header-dropdown");
  if (!(button instanceof HTMLButtonElement) || !(dropdown instanceof HTMLElement)) return;

  const setExpanded = (expanded) => {
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const open = () => {
    root.classList.add("is-open");
    setExpanded(true);
  };

  const close = () => {
    root.classList.remove("is-open");
    setExpanded(false);
  };

  const toggle = () => {
    if (root.classList.contains("is-open")) close();
    else open();
  };

  setExpanded(false);

  button.addEventListener("click", (event) => {
    event.preventDefault();
    toggle();
  });

  dropdown.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const clickedLink = target.closest("a[href^='#']");
    if (clickedLink) close();
  });

  if (window.matchMedia?.("(hover: hover)")?.matches) {
    root.addEventListener("mouseenter", open);
    root.addEventListener("mouseleave", close);
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (root.contains(target)) return;
    close();
  });

  root.addEventListener("focusout", (event) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node)) return close();
    if (root.contains(next)) return;
    close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!root.classList.contains("is-open")) return;
    close();
    button.focus();
  });
}

function initServiceStatusBadges() {
  const badges = Array.from(document.querySelectorAll("[data-service-status]")).filter(
    (el) => el instanceof HTMLElement,
  );
  if (badges.length === 0) return;

  const statusLabels = {
    available: "Matching open",
    limited: "Matching limited",
    emergency: "After-hours matching",
  };

  const computeStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;

    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
      if (hour >= 10 && hour < 16) return "available";
      if (hour >= 16 && hour < 20) return "limited";
      return "emergency";
    }

    if (hour >= 8 && hour < 18) return "available";
    if (hour >= 18 && hour < 22) return "limited";
    return "emergency";
  };

  const apply = (status) => {
    for (const badge of badges) {
      badge.dataset.status = status;
      const text = badge.querySelector(".service-status-text");
      if (text) text.textContent = statusLabels[status] || statusLabels.available;
    }
  };

  const update = () => apply(computeStatus());
  update();

  const scheduleNextUpdate = () => {
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 + (1000 - now.getMilliseconds());
    window.setTimeout(() => {
      update();
      scheduleNextUpdate();
    }, Math.max(1000, Math.min(msToNextMinute, 60000)));
  };

  scheduleNextUpdate();
}
