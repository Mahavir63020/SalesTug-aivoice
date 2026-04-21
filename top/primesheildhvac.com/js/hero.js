export function initHeroClimateControl() {
  const STORAGE_THEME_TEMP = "topshield:themeTemp:v1";

  const sessionGet = (key) => {
    try {
      return window.sessionStorage ? window.sessionStorage.getItem(key) : null;
    } catch {
      return null;
    }
  };

  const sessionSet = (key, value) => {
    try {
      if (!window.sessionStorage) return;
      window.sessionStorage.setItem(key, value);
    } catch {
    }
  };

  const applyFallbackTheme = (rawTemp) => {
    const base = 72;
    const min = 60;
    const max = 80;

    const parsed = Number.parseInt(String(rawTemp || ""), 10);
    if (!Number.isFinite(parsed)) return;

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

    window.dispatchEvent(
      new CustomEvent("theme:updated", {
        detail: { temp, mode, intensity },
      }),
    );
  };

  const card = document.querySelector("[data-climate-card]");
  if (!(card instanceof HTMLElement)) {
    applyFallbackTheme(sessionGet(STORAGE_THEME_TEMP));
    return;
  }

  const slider = card.querySelector("[data-temp-slider]");
  if (!(slider instanceof HTMLInputElement)) return;

  const decBtn = card.querySelector("[data-temp-dec]");
  const incBtn = card.querySelector("[data-temp-inc]");
  const tempValueEl = card.querySelector("[data-temp-value]");
  const hintEl = card.querySelector("[data-temp-hint]");
  const modeTextEl = card.querySelector("[data-mode-text]");
  const modeLabelEl = card.querySelector("[data-mode-label]");
  const flowLabelEl = card.querySelector("[data-flow-label]");

  const base = 72;
  const min = Number.parseInt(slider.min || "60", 10);
  const max = Number.parseInt(slider.max || "80", 10);

  const clamp = (value) => Math.min(max, Math.max(min, value));

  const lerp = (a, b, t) => a + (b - a) * t;

  const mixRgb = (from, to, t) => [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
  ];

  const rgbCss = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const rgbVar = (rgb) => `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;

  const getMode = (temp) => {
    const delta = temp - base;
    if (Math.abs(delta) <= 1) return "auto";
    return delta < 0 ? "cooling" : "heating";
  };

  const setText = (node, text) => {
    if (node instanceof HTMLElement) node.textContent = text;
  };

  const update = () => {
    const temp = clamp(Number.parseInt(slider.value || String(base), 10));
    slider.value = String(temp);
    sessionSet(STORAGE_THEME_TEMP, String(temp));

    const delta = temp - base;
    const intensity = Math.min(1, Math.abs(delta) / 8);
    const pct = ((temp - min) / Math.max(1, max - min)) * 100;

    const mode = getMode(temp);

    const modeLabel =
      mode === "cooling" ? "Cooling" : mode === "heating" ? "Heating" : "Auto";

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

    setText(tempValueEl, String(temp));
    setText(modeTextEl, modeLabel);
    setText(modeLabelEl, modeLabel);

    const flowLabel = intensity < 0.34 ? "Low" : intensity < 0.72 ? "Normal" : "High";
    setText(flowLabelEl, flowLabel);

    if (hintEl instanceof HTMLElement) {
      if (mode === "auto") hintEl.textContent = "Comfort hold";
      else if (mode === "cooling") hintEl.textContent = `Cooling to ${temp}\u00B0F`;
      else hintEl.textContent = `Heating to ${temp}\u00B0F`;
    }

    window.dispatchEvent(
      new CustomEvent("theme:updated", {
        detail: { temp, mode, intensity },
      }),
    );
  };

  slider.addEventListener("input", update, { passive: true });

  if (decBtn instanceof HTMLButtonElement) {
    decBtn.addEventListener("click", () => {
      const next = clamp(Number.parseInt(slider.value, 10) - 1);
      slider.value = String(next);
      update();
    });
  }

  if (incBtn instanceof HTMLButtonElement) {
    incBtn.addEventListener("click", () => {
      const next = clamp(Number.parseInt(slider.value, 10) + 1);
      slider.value = String(next);
      update();
    });
  }

  const storedTemp = Number.parseInt(sessionGet(STORAGE_THEME_TEMP) || "", 10);
  if (Number.isFinite(storedTemp)) {
    slider.value = String(clamp(storedTemp));
  }

  update();

  initHeroClimateTutorial({
    panel: card,
    slider,
    decBtn: decBtn instanceof HTMLButtonElement ? decBtn : null,
    incBtn: incBtn instanceof HTMLButtonElement ? incBtn : null,
  });
}

function initHeroClimateTutorial({ panel, slider, decBtn, incBtn }) {
  if (!(panel instanceof HTMLElement)) return;
  if (!(slider instanceof HTMLInputElement)) return;

  panel.classList.add("climate-panel");

  const prefersReducedMotion =
    window.matchMedia &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STORAGE_DONE = "topshield:heroClimateTutorialDone";
  const STORAGE_TOOLTIP = "topshield:heroClimateTooltipDismissed";

  const storageGet = (key) => {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  };

  const storageSet = (key, value) => {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(key, value);
    } catch {
    }
  };

  const controlRoot = panel.closest(".hero__control") || panel.parentElement;
  const microcopy =
    controlRoot instanceof HTMLElement
      ? controlRoot.querySelector("[data-climate-tutorial]")
      : null;

  const tooltip = panel.querySelector("[data-climate-tooltip]");

  const isDone = storageGet(STORAGE_DONE) === "1";
  if (isDone) {
    if (microcopy instanceof HTMLElement) microcopy.hidden = true;
    if (tooltip instanceof HTMLElement) tooltip.hidden = true;
    panel.classList.remove("is-tutorial-pulse");
    return;
  }

  let completed = false;

  if (microcopy instanceof HTMLElement) {
    microcopy.hidden = false;
    microcopy.classList.remove("is-dismissed");
    requestAnimationFrame(() => {
      if (completed) return;
      microcopy.classList.add("is-visible");
    });
  }

  if (!prefersReducedMotion) {
    panel.classList.add("is-tutorial-pulse");
  }

  let tooltipShowTimer = 0;
  let tooltipHideTimer = 0;

  const hideTooltip = (dismiss = false) => {
    if (!(tooltip instanceof HTMLElement)) return;
    tooltip.classList.remove("is-visible");

    window.clearTimeout(tooltipHideTimer);
    tooltipHideTimer = window.setTimeout(() => {
      tooltip.hidden = true;
      if (dismiss) storageSet(STORAGE_TOOLTIP, "1");
    }, 220);
  };

  const completeTutorial = () => {
    if (completed) return;
    completed = true;

    storageSet(STORAGE_DONE, "1");
    storageSet(STORAGE_TOOLTIP, "1");

    panel.classList.remove("is-tutorial-pulse");

    window.clearTimeout(tooltipShowTimer);
    window.clearTimeout(tooltipHideTimer);
    hideTooltip(true);

    if (microcopy instanceof HTMLElement) {
      microcopy.classList.remove("is-visible");
      microcopy.classList.add("is-dismissed");
      window.setTimeout(() => {
        microcopy.hidden = true;
      }, 180);
    }

    cleanup();
  };

  const tooltipDismissed = storageGet(STORAGE_TOOLTIP) === "1";
  if (!prefersReducedMotion && tooltip instanceof HTMLElement && !tooltipDismissed) {
    tooltipShowTimer = window.setTimeout(() => {
      if (completed) return;
      tooltip.hidden = false;
      requestAnimationFrame(() => tooltip.classList.add("is-visible"));

      tooltipHideTimer = window.setTimeout(() => {
        if (completed) return;
        hideTooltip(true);
      }, 3000);
    }, 2000);

    tooltip.addEventListener(
      "pointerdown",
      () => {
        if (completed) return;
        hideTooltip(true);
      },
      { passive: true },
    );
  } else if (tooltip instanceof HTMLElement) {
    tooltip.hidden = true;
  }

  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;

  const isDragTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("[data-temp-slider], .climate-range"));
  };

  const onPointerDown = (event) => {
    if (completed) return;
    if (!(event instanceof PointerEvent)) return;
    if (!isDragTarget(event.target)) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  };

  const onPointerMove = (event) => {
    if (completed) return;
    if (!(event instanceof PointerEvent)) return;
    if (dragPointerId === null || event.pointerId !== dragPointerId) return;

    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    if (Math.hypot(dx, dy) < 6) return;

    completeTutorial();
  };

  const onPointerUp = (event) => {
    if (!(event instanceof PointerEvent)) return;
    if (dragPointerId !== null && event.pointerId === dragPointerId) {
      dragPointerId = null;
    }
  };

  const onSliderInput = () => {
    if (completed) return;
    completeTutorial();
  };

  const onButtonClick = () => {
    if (completed) return;
    completeTutorial();
  };

  const cleanup = () => {
    panel.removeEventListener("pointerdown", onPointerDown);
    panel.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    slider.removeEventListener("input", onSliderInput);
    if (decBtn instanceof HTMLButtonElement)
      decBtn.removeEventListener("click", onButtonClick);
    if (incBtn instanceof HTMLButtonElement)
      incBtn.removeEventListener("click", onButtonClick);
  };

  panel.addEventListener("pointerdown", onPointerDown, { passive: true });
  panel.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });

  slider.addEventListener("input", onSliderInput, { passive: true });

  if (decBtn instanceof HTMLButtonElement)
    decBtn.addEventListener("click", onButtonClick);
  if (incBtn instanceof HTMLButtonElement)
    incBtn.addEventListener("click", onButtonClick);
}
