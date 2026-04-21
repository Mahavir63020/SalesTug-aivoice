export function initCookieBanner() {
  if (window.__topshieldCookieBannerInit) return;
  window.__topshieldCookieBannerInit = true;

  const CONSENT_KEY = "topshield:cookieConsent:v1";

  const prefersReducedMotion =
    window.matchMedia &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const storageGet = () => {
    try {
      const raw = window.localStorage ? window.localStorage.getItem(CONSENT_KEY) : null;
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return null;
      return {
        necessary: true,
        analytics: Boolean(data.analytics),
        marketing: Boolean(data.marketing),
        timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
      };
    } catch {
      return null;
    }
  };

  const storageSet = (consent) => {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch {
    }
  };

  const buildUrl = (path) => {
    try {
      return new URL(`../${path.replace(/^\//, "")}`, import.meta.url).toString();
    } catch {
      return path;
    }
  };

  const consent = storageGet();
  window.__topshieldCookieConsent = consent;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Cookie preferences");
  banner.setAttribute("aria-live", "polite");
  banner.hidden = true;

  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <div class="cookie-banner__copy">
        <div class="cookie-banner__title">
          <span class="cookie-banner__title-icon" aria-hidden="true"><i data-lucide="cookie"></i></span>
          <span>Cookies</span>
        </div>
        <p class="cookie-banner__text">
          We use cookies to improve site performance and personalize your experience. You can accept all, reject
          non-essential, or choose your preferences.
          <a class="cookie-banner__link" href="${buildUrl("legal/cookie-policy.html")}" target="_self" rel="nofollow">
            Cookie Policy
          </a>
        </p>
      </div>

      <div class="cookie-banner__actions" aria-label="Cookie actions">
        <button class="cookie-btn cookie-btn--ghost" type="button" data-cookie-reject>
          <i class="cookie-btn__icon" data-lucide="x" aria-hidden="true"></i>
          Reject non-essential
        </button>
        <button class="cookie-btn cookie-btn--ghost" type="button" data-cookie-customize aria-expanded="false">
          <i class="cookie-btn__icon" data-lucide="sliders-horizontal" aria-hidden="true"></i>
          Customize
        </button>
        <button class="cookie-btn cookie-btn--primary" type="button" data-cookie-accept>
          <i class="cookie-btn__icon" data-lucide="check" aria-hidden="true"></i>
          Accept all
        </button>
      </div>
    </div>

    <div class="cookie-banner__settings" data-cookie-settings-panel hidden>
      <div class="cookie-settings">
        <div class="cookie-settings__row">
          <div class="cookie-settings__meta">
            <div class="cookie-settings__name">
              <span class="cookie-settings__icon" aria-hidden="true"><i data-lucide="lock"></i></span>
              <span>Necessary</span>
            </div>
            <div class="cookie-settings__desc">Required for the site to function. Always on.</div>
          </div>
          <label class="cookie-switch" aria-label="Necessary cookies (always enabled)">
            <input type="checkbox" checked disabled />
            <span class="cookie-switch__ui" aria-hidden="true"></span>
          </label>
        </div>

        <div class="cookie-settings__row">
          <div class="cookie-settings__meta">
            <div class="cookie-settings__name">
              <span class="cookie-settings__icon" aria-hidden="true"><i data-lucide="bar-chart-3"></i></span>
              <span>Analytics</span>
            </div>
            <div class="cookie-settings__desc">Helps us understand traffic and improve the site.</div>
          </div>
          <label class="cookie-switch" aria-label="Analytics cookies">
            <input type="checkbox" data-cookie-analytics />
            <span class="cookie-switch__ui" aria-hidden="true"></span>
          </label>
        </div>

        <div class="cookie-settings__row">
          <div class="cookie-settings__meta">
            <div class="cookie-settings__name">
              <span class="cookie-settings__icon" aria-hidden="true"><i data-lucide="megaphone"></i></span>
              <span>Marketing</span>
            </div>
            <div class="cookie-settings__desc">Used for advertising and measuring campaign performance.</div>
          </div>
          <label class="cookie-switch" aria-label="Marketing cookies">
            <input type="checkbox" data-cookie-marketing />
            <span class="cookie-switch__ui" aria-hidden="true"></span>
          </label>
        </div>

        <div class="cookie-settings__actions">
          <button class="cookie-btn cookie-btn--ghost" type="button" data-cookie-cancel>Cancel</button>
          <button class="cookie-btn cookie-btn--primary" type="button" data-cookie-save>Save preferences</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const rejectBtn = banner.querySelector("[data-cookie-reject]");
  const customizeBtn = banner.querySelector("[data-cookie-customize]");
  const cancelBtn = banner.querySelector("[data-cookie-cancel]");
  const saveBtn = banner.querySelector("[data-cookie-save]");
  const settingsPanel = banner.querySelector("[data-cookie-settings-panel]");
  const analyticsInput = banner.querySelector("[data-cookie-analytics]");
  const marketingInput = banner.querySelector("[data-cookie-marketing]");

  const root = document.documentElement;

  const show = (expanded = false) => {
    const current = storageGet();
    if (current) {
      window.__topshieldCookieConsent = current;
      syncForm(current);
    } else {
      syncForm({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() });
    }

    root.classList.add("has-cookie-banner");
    banner.hidden = false;
    requestAnimationFrame(() => {
      banner.classList.add("is-visible");
      if (expanded) expandSettings(true);
    });
  };

  const hide = () => {
    banner.classList.remove("is-visible");
    window.setTimeout(() => {
      banner.hidden = true;
      expandSettings(false);
      root.classList.remove("has-cookie-banner");
    }, prefersReducedMotion ? 0 : 220);
  };

  const setConsent = (next) => {
    const normalized = {
      necessary: true,
      analytics: Boolean(next.analytics),
      marketing: Boolean(next.marketing),
      timestamp: Date.now(),
    };

    storageSet(normalized);
    window.__topshieldCookieConsent = normalized;

    window.dispatchEvent(
      new CustomEvent("cookies:consent", {
        detail: normalized,
      }),
    );
  };

  const syncForm = (state) => {
    if (analyticsInput instanceof HTMLInputElement) analyticsInput.checked = Boolean(state.analytics);
    if (marketingInput instanceof HTMLInputElement) marketingInput.checked = Boolean(state.marketing);
  };

  const expandSettings = (expanded) => {
    if (!(settingsPanel instanceof HTMLElement)) return;
    banner.classList.toggle("is-expanded", expanded);
    settingsPanel.hidden = !expanded;
    if (customizeBtn instanceof HTMLButtonElement) {
      customizeBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  };

  const acceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    hide();
  };

  const rejectNonEssential = () => {
    setConsent({ analytics: false, marketing: false });
    hide();
  };

  const savePreferences = () => {
    const analytics = analyticsInput instanceof HTMLInputElement ? analyticsInput.checked : false;
    const marketing = marketingInput instanceof HTMLInputElement ? marketingInput.checked : false;
    setConsent({ analytics, marketing });
    hide();
  };

  const cancelPreferences = () => {
    const current = storageGet();
    if (current) syncForm(current);
    else syncForm({ necessary: true, analytics: false, marketing: false });
    expandSettings(false);
  };

  if (acceptBtn instanceof HTMLButtonElement) acceptBtn.addEventListener("click", acceptAll);
  if (rejectBtn instanceof HTMLButtonElement) rejectBtn.addEventListener("click", rejectNonEssential);

  if (customizeBtn instanceof HTMLButtonElement) {
    customizeBtn.addEventListener("click", () => {
      const willExpand = !banner.classList.contains("is-expanded");
      expandSettings(willExpand);
    });
  }

  if (saveBtn instanceof HTMLButtonElement) saveBtn.addEventListener("click", savePreferences);
  if (cancelBtn instanceof HTMLButtonElement) cancelBtn.addEventListener("click", cancelPreferences);

  const openSettings = () => show(true);
  window.topshieldOpenCookieSettings = openSettings;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest("[data-cookie-settings]");
    if (!trigger) return;
    event.preventDefault();
    show(true);
  });

  if (!consent) {
    window.setTimeout(() => {
      if (storageGet()) return;
      show(false);
    }, 5000);
  }
}
