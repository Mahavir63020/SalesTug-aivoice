export function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  let status = form.querySelector(".contact-status");
  if (!(status instanceof HTMLElement)) {
    status = document.createElement("p");
    status.className = "contact-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !contact) {
      status.textContent = "Please add your name and phone or email so we can reach you.";
      return;
    }

    if (!message) {
      status.textContent = "Please add a short message so we know what to prioritize.";
      return;
    }

    status.textContent = "Thanks! Your request was sent. We'll contact you shortly.";
    form.reset();
  });
}
