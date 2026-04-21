const scriptUrl = document.currentScript && document.currentScript.src;
const baseUrl = scriptUrl ? new URL(".", scriptUrl) : new URL("./", window.location.href);

document.addEventListener("DOMContentLoaded", async () => {
  const targets = {
    header: new URL("partials/header.html", baseUrl).toString(),
    hero: new URL("partials/hero.html", baseUrl).toString(),
    services: new URL("partials/services.html", baseUrl).toString(),
    why: new URL("partials/why.html", baseUrl).toString(),
    maintenance: new URL("partials/maintenance.html", baseUrl).toString(),
    how: new URL("partials/how.html", baseUrl).toString(),
    reviews: new URL("partials/reviews.html", baseUrl).toString(),
    cta: new URL("partials/cta.html", baseUrl).toString(),
    contact: new URL("partials/contact.html", baseUrl).toString(),
    footer: new URL("partials/footer.html", baseUrl).toString(),
  };

  const loaders = Object.entries(targets).map(async ([id, url]) => {
    const host = document.getElementById(id);
    if (!host) return;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    host.innerHTML = await response.text();
  });

  try {
    await Promise.all(loaders);
    window.dispatchEvent(new Event("partials:loaded"));
  } catch (error) {
    console.error("Partial load error:", error);
  }
});
