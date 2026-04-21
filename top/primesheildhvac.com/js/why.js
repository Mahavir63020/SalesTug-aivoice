export function initWhySlider() {
  const host = document.getElementById("why");
  if (!(host instanceof HTMLElement)) return;

  const section =
    host.querySelector("[data-standard]") ||
    host.querySelector("#standard") ||
    document.getElementById("standard");
  if (!(section instanceof HTMLElement)) return;

  const items = Array.from(
    section.querySelectorAll("[data-standard-item]"),
  ).filter((el) => el instanceof HTMLElement);
  if (items.length === 0) return;

  const bgHost = section.querySelector(".standard__bg");
  if (!(bgHost instanceof HTMLElement)) return;

  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const supportsIO =
    typeof window !== "undefined" &&
    typeof window.IntersectionObserver === "function";

  const supportsHover =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches;

  const layers = items.map((item, i) => {
    const src = item.getAttribute("data-standard-media");
    const layer = document.createElement("div");
    layer.className = "standard__bg-layer";
    if (src) layer.style.backgroundImage = `url(${src})`;
    if (i === 0) layer.classList.add("is-active");
    bgHost.appendChild(layer);
    return layer;
  });

  let current =
    items.find((item) => item.classList.contains("is-active")) || items[0];

  const setActive = (next, { focus = false } = {}) => {
    if (!(next instanceof HTMLElement) || next === current) return;
    const index = items.indexOf(next);
    if (index === -1) return;

    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    layers.forEach((layer, i) =>
      layer.classList.toggle("is-active", i === index),
    );

    current = next;
    if (focus) next.focus();
  };

  setActive(current);

  for (const item of items) {
    item.addEventListener("click", () => setActive(item));
    item.addEventListener("focus", () => setActive(item));
    item.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      setActive(item, { focus: true });
    });
    if (supportsHover) {
      item.addEventListener("mouseenter", () => setActive(item));
    }
  }

  if (supportsIO && !reduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]?.target;
        if (top instanceof HTMLElement) setActive(top);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 },
    );
    items.forEach((item) => observer.observe(item));
  }
}
