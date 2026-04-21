function prefillContactForm({ planName }) {
  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) return;

  const service = form.querySelector("select[name='service']");
  if (service instanceof HTMLSelectElement) {
    service.value = "maintenance";
  }

  const message = form.querySelector("textarea[name='message']");
  if (message instanceof HTMLTextAreaElement) {
    const prefix = `Maintenance plan interest: ${planName}`;
    const existing = String(message.value || "").trim();

    if (!existing) {
      message.value = `${prefix}\n`;
      return;
    }

    const lines = existing.split(/\r?\n/);
    if (lines[0]?.startsWith("Maintenance plan interest: ")) {
      lines[0] = prefix;
      message.value = `${lines.join("\n").trim()}\n`;
      return;
    }

    message.value = `${prefix}\n\n${existing}\n`;
  }
}

export function initMaintenancePlans() {
  const host = document.getElementById("maintenance");
  if (!(host instanceof HTMLElement)) return;

  const section = host.querySelector("[data-maintenance-plans]");
  if (!(section instanceof HTMLElement)) return;

  const plans = Array.from(section.querySelectorAll("[data-plan]")).filter(
    (el) => el instanceof HTMLElement,
  );
  if (plans.length === 0) return;

  section.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const cta = target.closest("[data-plan-cta]");
    if (!(cta instanceof HTMLAnchorElement)) return;
    if (!section.contains(cta)) return;

    const plan = cta.closest("[data-plan]");
    if (!(plan instanceof HTMLElement)) return;

    const planName = plan.getAttribute("data-plan-name") || "Maintenance plan";
    prefillContactForm({ planName });
  });
}
