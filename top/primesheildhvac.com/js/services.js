export function initServicesSection() {
  const section = document.getElementById("services");
  if (!(section instanceof HTMLElement)) return;

  const items = Array.from(
    section.querySelectorAll(".service-showcase__item[data-service-tags]"),
  ).filter((el) => el instanceof HTMLElement);

  if (items.length === 0) return;

  const hint = section.querySelector("[data-services-hint]");
  const hintInitial = hint instanceof HTMLElement ? hint.textContent?.trim() || "" : "";

  const getRecommendation = (temp) => {
    if (!Number.isFinite(temp)) return "";
    if (temp <= 70) return "heating";
    if (temp >= 74) return "cooling";
    return "";
  };

  const applyRecommendation = (temp) => {
    const recommendation = getRecommendation(temp);

    for (const item of items) {
      const tags = (item.getAttribute("data-service-tags") || "")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);

      const recommended = recommendation !== "" && tags.includes(recommendation);
      item.classList.toggle("is-recommended", recommended);
    }

    if (hint instanceof HTMLElement) {
      if (recommendation === "heating") hint.textContent = "Highlighted: Heating services";
      else if (recommendation === "cooling") hint.textContent = "Highlighted: Cooling services";
      else hint.textContent = hintInitial;
    }
  };

  const onThemeUpdate = (event) => {
    const detail = event?.detail;
    const temp = typeof detail?.temp === "number" ? detail.temp : Number.NaN;
    applyRecommendation(temp);
  };

  window.addEventListener("theme:updated", onThemeUpdate);

  const slider = document.querySelector("[data-temp-slider]");
  if (slider instanceof HTMLInputElement) {
    const temp = Number.parseInt(slider.value || "0", 10);
    applyRecommendation(temp);
  }
}
