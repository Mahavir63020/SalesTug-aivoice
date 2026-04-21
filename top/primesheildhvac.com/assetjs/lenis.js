function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function initLenis() {
  if (lenisInstance) return lenisInstance;
  if (prefersReducedMotion()) return null;

  const Lenis = window.Lenis;
  if (typeof Lenis !== "function") return null;
  document.documentElement.style.scrollBehavior = "auto";

  const lenis = new Lenis({
    duration: 1.15,
    lerp: 0.1,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    normalizeWheel: true,
  });

  lenisInstance = lenis;
  window.__topshieldLenis = lenis;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);
  }

  window.addEventListener(
    "resize",
    () => {
      if (lenisInstance) lenisInstance.resize();
    },
    { passive: true },
  );

  return lenisInstance;
}
