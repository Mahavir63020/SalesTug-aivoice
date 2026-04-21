function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function parseRgbVar(value) {
  const parts = String(value || "")
    .trim()
    .split(",")
    .map((p) => Number.parseInt(p.trim(), 10))
    .filter((n) => Number.isFinite(n));

  if (parts.length < 3) return null;
  return [parts[0], parts[1], parts[2]];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixRgb(from, to, t) {
  return [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
  ];
}

function rgbCss(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function rgbVar(rgb) {
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

const PROBLEMS = {
  "cold-rooms": {
    tone: "heat",
    title: "Cold rooms",
    desc:
      "Independent HVAC pros track heat loss, airflow restrictions, and control settings to restore consistent warmth where you feel it most.",
    signs: [
      "One room never reaches the setpoint",
      "Weak airflow from a few vents",
      "System runs but comfort stays uneven",
    ],
    approach: [
      "Airflow and temperature-rise measurements",
      "Duct leakage and restriction checks",
      "Controls and safety verification",
    ],
    tags: ["Airflow", "Duct leakage", "Controls"],
    ctaHref: "./services/heating-repair.html",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2c3.4 3 5 5.8 5 8.6A5 5 0 1 1 7 10.6C7 7.8 8.6 5 12 2Z" />
        <path d="M10.4 14.3c.2 1.7 1.2 2.7 2.6 3.7" />
      </svg>
    `,
  },
  "uneven-temp": {
    tone: "neutral",
    title: "Uneven temperature",
    desc:
      "Independent HVAC pros measure airflow and pressure room-by-room to pinpoint imbalances, then tune delivery for steady comfort across the home.",
    signs: [
      "Hot and cold rooms on the same floor",
      "Strong airflow in one area, weak in another",
      "Setpoint swings throughout the day",
    ],
    approach: [
      "Static pressure and duct sizing checks",
      "Register balancing and supply/return flow tuning",
      "Zoning and thermostat placement review",
    ],
    tags: ["Balancing", "Static pressure", "Zoning"],
    ctaHref: "./services/ductless-mini-splits.html",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 12c3 0 3-6 6-6s3 12 6 12 3-6 8-6" />
        <path d="M4 16c3 0 3-4 6-4s3 8 6 8 3-4 8-4" />
      </svg>
    `,
  },
  "high-bills": {
    tone: "neutral",
    title: "High energy bills",
    desc:
      "Independent HVAC pros reduce waste by correcting sizing, setpoints, and airflow. You get a plan that lowers runtime without sacrificing comfort.",
    signs: [
      "Bills spike during normal weather",
      "System runs long cycles to keep up",
      "Comfort improves only with extreme settings",
    ],
    approach: [
      "Equipment sizing and airflow delivery verification",
      "Setpoint, fan setting, and schedule tuning",
      "Upgrade guidance with clear ROI priorities",
    ],
    tags: ["Runtime", "Sizing", "Setpoints"],
    ctaHref: "./services/heat-pumps.html",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    `,
  },
  "poor-air": {
    tone: "cool",
    title: "Poor air quality",
    desc:
      "Better filtration and healthier airflow: independent pros can match the right upgrades to allergies, odors, dust, and humidity issues.",
    signs: [
      "Dust returns quickly after cleaning",
      "Odors linger when the system runs",
      "Allergy symptoms feel worse indoors",
    ],
    approach: [
      "Filtration and filter-fitment review",
      "Airflow and fresh-air strategy improvements",
      "Humidity and airflow balance targeting",
    ],
    tags: ["Filtration", "Ventilation", "Humidity"],
    ctaHref: "./services/indoor-air-quality.html",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 7h12" />
        <path d="M7.5 12h9" />
        <path d="M9 17h6" />
        <path d="M4.5 5.5v13c0 1 1 2 2.2 2h10.6c1.2 0 2.2-1 2.2-2v-13" />
      </svg>
    `,
  },
  breakdowns: {
    tone: "heat",
    title: "Unexpected breakdowns",
    desc:
      "Preventive maintenance catches wear before failure. When a breakdown does happen, we help connect you with providers who prioritize accurate diagnosis and clear options.",
    signs: [
      "Random shutdowns or frequent resets",
      "Strange noises or burning smells",
      "Repeated service calls for the same issue",
    ],
    approach: [
      "Failure pinpointing, then performance testing",
      "Flag parts at risk before they fail",
      "Maintenance-plan guidance to prevent repeats",
    ],
    tags: ["Maintenance", "Priority", "Seasonal"],
    ctaHref: "./services/maintenance-plans.html",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a3.5 3.5 0 0 1 4.95 4.95l-2.1 2.1-4.95-4.95 2.1-2.1Z" />
        <path d="M11.5 9.5 4 17v3h3l7.5-7.5" />
      </svg>
    `,
  },
};

function readThemeRgbVars() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);

  const accent = parseRgbVar(styles.getPropertyValue("--theme-accent-rgb"));
  const accent2 = parseRgbVar(styles.getPropertyValue("--theme-accent-2-rgb"));

  const fallback1 = [51, 65, 85];
  const fallback2 = [100, 116, 139];

  return {
    accent: accent || fallback1,
    accent2: accent2 || fallback2,
  };
}

function getToneRefs(tone) {
  const refs = {
    cool: { a1: [17, 129, 242], a2: [14, 165, 233] },
    neutral: { a1: [51, 65, 85], a2: [100, 116, 139] },
    heat: { a1: [249, 115, 22], a2: [239, 68, 68] },
  };
  return refs[tone] || refs.neutral;
}

function applyTone(section, tone) {
  if (!(section instanceof HTMLElement)) return;

  const { accent, accent2 } = readThemeRgbVars();
  const refs = getToneRefs(tone);

  const t = tone === "neutral" ? 0.08 : 0.22;
  const toned1 = mixRgb(accent, refs.a1, t);
  const toned2 = mixRgb(accent2, refs.a2, t);

  section.style.setProperty("--problems-accent", rgbCss(toned1));
  section.style.setProperty("--problems-accent-2", rgbCss(toned2));
  section.style.setProperty("--problems-accent-rgb", rgbVar(toned1));
  section.style.setProperty("--problems-accent-2-rgb", rgbVar(toned2));
  section.dataset.problemTone = tone;
}

function updateDetail(detail, problem) {
  if (!(detail instanceof HTMLElement)) return;
  if (!problem) return;

  const iconEl = detail.querySelector("[data-solution-icon]");
  const titleEl = detail.querySelector("[data-solution-title]");
  const descEl = detail.querySelector("[data-solution-desc]");
  const ctaEl = detail.querySelector("[data-solution-cta]");
  const signsEl = detail.querySelector("[data-solution-signs]");
  const approachEl = detail.querySelector("[data-solution-approach]");
  const metaEl = detail.querySelector(".solution-card__meta");

  if (iconEl instanceof HTMLElement) iconEl.innerHTML = problem.icon || "";
  if (titleEl instanceof HTMLElement) titleEl.textContent = problem.title;
  if (descEl instanceof HTMLElement) descEl.textContent = problem.desc;

  const fillList = (root, items) => {
    if (!(root instanceof HTMLElement)) return;
    root.textContent = "";
    for (const text of items || []) {
      const li = document.createElement("li");
      li.textContent = text;
      root.append(li);
    }
  };

  fillList(signsEl, problem.signs);
  fillList(approachEl, problem.approach);

  if (metaEl instanceof HTMLElement) {
    metaEl.textContent = "";
    for (const tag of problem.tags || []) {
      const span = document.createElement("span");
      span.className = "solution-card__tag";
      span.textContent = tag;
      metaEl.append(span);
    }
  }

  if (ctaEl instanceof HTMLAnchorElement) {
    ctaEl.href = problem.ctaHref || "#";
    ctaEl.setAttribute("aria-label", `See how to address ${problem.title}`);
  }
}

function lockDetailMinHeight(section, detailCard) {
  if (!(section instanceof HTMLElement)) return;
  if (!(detailCard instanceof HTMLElement)) return;

  const rect = detailCard.getBoundingClientRect();
  if (!Number.isFinite(rect.width) || rect.width < 120) return;

  const probe = detailCard.cloneNode(true);
  if (!(probe instanceof HTMLElement)) return;

  probe.classList.remove("is-switching");
  probe.style.position = "absolute";
  probe.style.left = "-9999px";
  probe.style.top = "0";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.width = `${Math.ceil(rect.width)}px`;
  probe.style.minHeight = "0";
  probe.style.height = "auto";
  probe.style.maxHeight = "none";
  probe.style.opacity = "1";
  probe.style.transform = "none";
  probe.style.filter = "none";
  probe.style.transition = "none";
  probe.style.setProperty("--solution-card-min-h", "0px");

  section.append(probe);

  let maxHeight = 0;
  for (const problem of Object.values(PROBLEMS)) {
    updateDetail(probe, problem);
    maxHeight = Math.max(maxHeight, probe.getBoundingClientRect().height);
  }

  probe.remove();

  if (maxHeight > 0) {
    detailCard.style.setProperty("--solution-card-min-h", `${Math.ceil(maxHeight)}px`);
  }
}

export function initComfortProblems() {
  const section = document.querySelector("[data-comfort-problems]");
  if (!(section instanceof HTMLElement)) return;

  const triggers = Array.from(section.querySelectorAll("[data-problem-trigger]")).filter(
    (el) => el instanceof HTMLButtonElement,
  );
  if (triggers.length === 0) return;

  const detailCard = section.querySelector("[data-solution-card]");
  if (!(detailCard instanceof HTMLElement)) return;

  const supportsHover =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches;

  const reduced = prefersReducedMotion();

  let currentId =
    triggers.find((b) => b.classList.contains("is-active"))?.getAttribute("data-problem-id") ||
    triggers[0].getAttribute("data-problem-id") ||
    "";

  let currentTone =
    triggers.find((b) => b.classList.contains("is-active"))?.getAttribute("data-problem-tone") ||
    triggers[0].getAttribute("data-problem-tone") ||
    "neutral";

  const setActive = (nextId, { focus = false } = {}) => {
    if (!nextId || nextId === currentId) return;
    const problem = PROBLEMS[nextId];
    if (!problem) return;

    const nextBtn = triggers.find((b) => b.getAttribute("data-problem-id") === nextId);
    if (!nextBtn) return;

    for (const btn of triggers) {
      const active = btn === nextBtn;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    }

    currentId = nextId;
    currentTone = problem.tone || "neutral";
    applyTone(section, currentTone);

    if (reduced) {
      updateDetail(detailCard, problem);
      if (focus) nextBtn.focus();
      return;
    }

    if (detailCard.dataset.switchTimer) {
      window.clearTimeout(Number(detailCard.dataset.switchTimer));
      delete detailCard.dataset.switchTimer;
    }

    detailCard.classList.add("is-switching");
    const timer = window.setTimeout(() => {
      updateDetail(detailCard, problem);
      requestAnimationFrame(() => detailCard.classList.remove("is-switching"));
    }, 160);
    detailCard.dataset.switchTimer = String(timer);

    if (focus) nextBtn.focus();
  };

  const syncInitial = () => {
    const problem = PROBLEMS[currentId] || PROBLEMS[triggers[0].getAttribute("data-problem-id") || ""];
    if (!problem) return;

    currentId = Object.keys(PROBLEMS).includes(currentId) ? currentId : triggers[0].dataset.problemId;
    currentTone = problem.tone || currentTone || "neutral";

    applyTone(section, currentTone);
    updateDetail(detailCard, problem);
  };

  syncInitial();

  const initialHeight = detailCard.getBoundingClientRect().height;
  if (Number.isFinite(initialHeight) && initialHeight > 0) {
    detailCard.style.setProperty("--solution-card-min-h", `${Math.ceil(initialHeight)}px`);
  }

  const scheduleLock = (() => {
    let timer = 0;
    return () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        lockDetailMinHeight(section, detailCard);
      }, 120);
    };
  })();

  scheduleLock();
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(scheduleLock).catch(() => {});
  }
  window.addEventListener("resize", scheduleLock, { passive: true });

  for (const btn of triggers) {
    const id = btn.getAttribute("data-problem-id") || "";

    btn.addEventListener("click", () => setActive(id));

    if (supportsHover) {
      btn.addEventListener("mouseenter", () => setActive(id));
    }

    btn.addEventListener("focus", () => setActive(id));
  }

  window.addEventListener("theme:updated", () => applyTone(section, currentTone));
}
