export function initScrollSpy() {
  const spyNodes = Array.from(document.querySelectorAll("[data-spy-target]")).filter(
    (el) => el instanceof HTMLElement,
  );
  if (spyNodes.length === 0) return;

  const byTarget = new Map();
  for (const node of spyNodes) {
    const target = node.getAttribute("data-spy-target")?.trim();
    if (!target) continue;
    if (!byTarget.has(target)) byTarget.set(target, []);
    byTarget.get(target).push(node);
  }

  const sections = Array.from(byTarget.keys())
    .map((id) => document.getElementById(id))
    .filter((el) => el instanceof HTMLElement);

  if (sections.length === 0) return;

  sections.sort((a, b) => a.offsetTop - b.offsetTop);

  const header =
    document.querySelector("[data-sticky-header]") ||
    document.querySelector(".site-header") ||
    document.querySelector("header");

  const getHeaderHeight = () => (header instanceof HTMLElement ? header.offsetHeight : 0);

  const applyActive = (activeId) => {
    for (const [id, nodes] of byTarget) {
      const active = id === activeId;

      for (const node of nodes) {
        node.classList.toggle("is-active", active);

        if (node instanceof HTMLAnchorElement) {
          if (active) node.setAttribute("aria-current", "page");
          else node.removeAttribute("aria-current");
        }
      }
    }
  };

  const compute = () => {
    const threshold = getHeaderHeight() + 16;
    let activeId = null;

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) activeId = section.id;
      else break;
    }

    applyActive(activeId);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      compute();
    });
  };

  compute();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

