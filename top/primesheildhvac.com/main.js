import { initializeMobileMenu } from "./js/header.js";
import { initContactForm } from "./js/contact.js";
import { initWhySlider } from "./js/why.js";
import { initScrollSpy } from "./js/scrollspy.js";
import { initCookieBanner } from "./js/cookieBanner.js";
import { initHeroClimateControl } from "./js/hero.js";
import { initServicesSection } from "./js/services.js";
import { initComfortProblems } from "./js/how.js";
import { initMaintenancePlans } from "./js/maintenance.js";
import { initLenis } from "./assets/js/lenis.js";
import { initAnimations } from "./assets/js/animations.js";

function applySessionThemeEarly() {
  const STORAGE_THEME_TEMP = "topshield:themeTemp:v1";

  let stored = null;
  try {
    stored = window.sessionStorage ? window.sessionStorage.getItem(STORAGE_THEME_TEMP) : null;
  } catch {
    stored = null;
  }

  const parsed = Number.parseInt(String(stored || ""), 10);
  if (!Number.isFinite(parsed)) return;

  const base = 72;
  const min = 60;
  const max = 80;

  const clamp = (value) => Math.min(max, Math.max(min, value));
  const temp = clamp(parsed);

  const lerp = (a, b, t) => a + (b - a) * t;
  const mixRgb = (from, to, t) => [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
  ];

  const rgbCss = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const rgbVar = (rgb) => `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;

  const delta = temp - base;
  const intensity = Math.min(1, Math.abs(delta) / 8);
  const pct = ((temp - min) / Math.max(1, max - min)) * 100;
  const mode = Math.abs(delta) <= 1 ? "auto" : delta < 0 ? "cooling" : "heating";

  const speed = lerp(2.15, 1.05, intensity);
  const alpha = lerp(0.28, 0.72, intensity);
  const blur = lerp(0.4, 0.12, intensity);

  const root = document.documentElement;

  const coolA1 = [17, 129, 242];
  const coolA2 = [14, 165, 233];
  const neutralA1 = [51, 65, 85];
  const neutralA2 = [100, 116, 139];
  const warmA1 = [249, 115, 22];
  const warmA2 = [239, 68, 68];

  const themeT = mode === "auto" ? 0 : intensity;

  const accent1 =
    mode === "heating"
      ? mixRgb(neutralA1, warmA1, themeT)
      : mixRgb(neutralA1, coolA1, themeT);

  const accent2 =
    mode === "heating"
      ? mixRgb(neutralA2, warmA2, themeT)
      : mixRgb(neutralA2, coolA2, themeT);

  root.style.setProperty("--theme-accent", rgbCss(accent1));
  root.style.setProperty("--theme-accent-2", rgbCss(accent2));
  root.style.setProperty("--theme-accent-rgb", rgbVar(accent1));
  root.style.setProperty("--theme-accent-2-rgb", rgbVar(accent2));

  root.style.setProperty("--hero-flow-speed", `${speed.toFixed(2)}s`);
  root.style.setProperty("--hero-flow-alpha", alpha.toFixed(2));
  root.style.setProperty("--hero-flow-blur", `${blur.toFixed(2)}px`);
  root.style.setProperty("--hero-temp-pct", `${pct.toFixed(1)}%`);
}

applySessionThemeEarly();

function rewriteRootHrefLinks() {
  const rootUrl = new URL(".", import.meta.url);

  document.querySelectorAll("a[data-root-href]").forEach((a) => {
    const rootHref = a.getAttribute("data-root-href") || "";
    if (!rootHref) return;
    a.setAttribute("href", new URL(rootHref, rootUrl).toString());
  });
}

function rewriteHeaderFooterHashesToIndex() {
  const path = (window.location && window.location.pathname) || "";
  const isIndex =
    path === "/" || /(^|\/)index\.html$/i.test(path) || path.endsWith("/index.html");
  if (isIndex) return;

  const indexUrl = new URL("index.html", new URL(".", import.meta.url));

  document
    .querySelectorAll(".site-header a[href^='#'], .site-footer a[href^='#'], .mobile-cta a[href^='#']")
    .forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#") || href === "#") return;

      const targetId = href.slice(1);
      if (targetId && document.getElementById(targetId)) return;

      a.setAttribute("href", new URL(href, indexUrl).toString());
    });
}

function initStickyHeader() {
  const header =
    document.querySelector("[data-sticky-header]") ||
    document.querySelector(".site-header") ||
    document.querySelector("header");
  if (!(header instanceof HTMLElement)) return;

  header.classList.add("is-sticky");
  header.dataset.sticky = "true";

  let ticking = false;
  const apply = () => {
    ticking = false;
    const top = window.scrollY || document.documentElement.scrollTop || 0;
    const scrolled = top > 8;
    header.classList.toggle("scrolled", scrolled);
  };

  apply();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    },
    { passive: true },
  );
}

function initSmoothAnchors() {
  document.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (event) => {
      const href = a.getAttribute("href") || "";
      if (href === "#" || href === "") return;

      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();

      const header =
        document.querySelector("[data-sticky-header]") ||
        document.querySelector(".site-header") ||
        document.querySelector("header");

      const headerOffset = header instanceof HTMLElement ? header.offsetHeight : 0;
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

      const lenis = window.__topshieldLenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(Math.max(0, Math.round(y)), { duration: 1.05 });
        return;
      }

      window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "smooth" });
    });
  });
}

function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function initializeApp() {
  initStickyHeader();
  initLenis();
  initializeMobileMenu();
  initHeroClimateControl();
  initAnimations();
  initServicesSection();
  initMaintenancePlans();
  initComfortProblems();
  rewriteRootHrefLinks();
  rewriteHeaderFooterHashesToIndex();
  initSmoothAnchors();
  initScrollSpy();
  initWhySlider();
  initContactForm();
  initCookieBanner();
  initLucide();
}

window.addEventListener("partials:loaded", initializeApp, { once: true });
