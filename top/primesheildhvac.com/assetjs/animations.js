function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function supportsHover() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover)").matches
  );
}

function isInView(el, threshold = 0.86) {
  if (!(el instanceof HTMLElement)) return false;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  if (!vh) return false;
  return rect.top <= vh * threshold && rect.bottom >= 0;
}

function getGsap() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return null;
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

function heroIntro({ gsap }) {
  const hero = document.querySelector(".hero");
  if (!(hero instanceof HTMLElement)) return;

  const eyebrow = hero.querySelector(".hero__eyebrow");
  const title = hero.querySelector(".hero__title");
  const sub = hero.querySelector(".hero__subheadline");
  const ctas = Array.from(hero.querySelectorAll(".hero__cta")).filter(
    (el) => el instanceof HTMLElement,
  );
  const trust = Array.from(hero.querySelectorAll(".hero__trust-item")).filter(
    (el) => el instanceof HTMLElement,
  );

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  const card = hero.querySelector(".climate-card");
  if (card instanceof HTMLElement) {
    tl.from(
      card,
      {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
      },
      0,
    );
  }

  if (eyebrow instanceof HTMLElement) {
    tl.from(
      eyebrow,
      {
        y: 12,
        autoAlpha: 0,
        duration: 0.55,
      },
      0,
    );
  }

  const SplitType = window.SplitType;
  if (title instanceof HTMLElement && typeof SplitType === "function") {
    let split = null;
    try {
      split = new SplitType(title, { types: "words" });
    } catch {
      split = null;
    }

    if (split && Array.isArray(split.words) && split.words.length > 0) {
      tl.from(
        split.words,
        {
          yPercent: 120,
          rotate: 0.001,
          autoAlpha: 0,
          duration: 1.05,
          stagger: 0.028,
        },
        0.1,
      );
    } else {
      tl.from(
        title,
        {
          y: 22,
          autoAlpha: 0,
          duration: 0.85,
        },
        0.1,
      );
    }
  } else if (title instanceof HTMLElement) {
    tl.from(
      title,
      {
        y: 22,
        autoAlpha: 0,
        duration: 0.85,
      },
      0.1,
    );
  }

  if (sub instanceof HTMLElement) {
    tl.from(
      sub,
      {
        y: 16,
        autoAlpha: 0,
        duration: 0.7,
      },
      0.42,
    );
  }

  if (ctas.length > 0) {
    tl.from(
      ctas,
      {
        y: 14,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.12,
      },
      0.56,
    );
  }

  if (trust.length > 0) {
    tl.from(
      trust,
      {
        y: 10,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.08,
      },
      0.72,
    );
  }
}

function servicesReveal({ gsap, ScrollTrigger }) {
  const items = gsap.utils.toArray(".service-showcase__item");
  if (items.length === 0) return;

  items.forEach((item) => {
    if (!(item instanceof HTMLElement)) return;

    const media = item.querySelector(".service-showcase__media");
    const content = item.querySelector(".service-showcase__content");
    if (!(media instanceof HTMLElement)) return;
    if (!(content instanceof HTMLElement)) return;

    const isReverse = item.classList.contains("service-showcase__item--reverse");
    const fromX = 140;
    const fromY = 18;

    const revealNow = isInView(item, 0.92);

    gsap.set(media, {
      x: isReverse ? fromX : -fromX,
      y: fromY,
      autoAlpha: 0,
    });

    gsap.set(content, {
      x: isReverse ? -fromX : fromX,
      y: fromY,
      autoAlpha: 0,
    });

    const reveal = () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set([media, content], { clearProps: "transform,opacity,filter" });
        },
      });

      tl.to(
        media,
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          overwrite: true,
        },
        0,
      );

      tl.to(
        content,
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1.05,
          overwrite: true,
        },
        0.12,
      );
    };

    if (revealNow) {
      reveal();
      return;
    }

    ScrollTrigger.create({
      trigger: item,
      start: "top 82%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onEnterBack: reveal,
    });
  });
}

function cardsFadeUp({ gsap, ScrollTrigger }) {
  const setups = [
    { trigger: ".maintenance-plans", items: ".maintenance-plans .plan", start: "top 78%" },
    { trigger: ".standard", items: ".standard .standard__item", start: "top 82%" },
  ];

  setups.forEach((setup) => {
    const trigger = document.querySelector(setup.trigger);
    if (!(trigger instanceof HTMLElement)) return;

    const items = gsap.utils.toArray(setup.items).filter((el) => el instanceof HTMLElement);
    if (items.length === 0) return;

    const revealNow = isInView(trigger, 0.9);

    gsap.set(items, { y: 22, autoAlpha: 0 });

    const reveal = () => {
      gsap.to(items, {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        overwrite: true,
        onComplete: () => gsap.set(items, { clearProps: "transform,opacity" }),
      });
    };

    if (revealNow) {
      reveal();
      return;
    }

    ScrollTrigger.create({
      trigger,
      start: setup.start,
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onEnterBack: reveal,
    });
  });
}

function benefitsReveal({ gsap, ScrollTrigger }) {
  const headers = gsap.utils.toArray(
    ".services__header, .maintenance-plans__header, .comfort-improve__header, .standard__header",
  );

  headers.forEach((header) => {
    if (!(header instanceof HTMLElement)) return;

    const revealNow = isInView(header, 0.94);

    gsap.set(header, { y: 18, autoAlpha: 0 });

    const reveal = () => {
      gsap.to(header, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
        onComplete: () => gsap.set(header, { clearProps: "transform,opacity" }),
      });
    };

    if (revealNow) {
      reveal();
      return;
    }

    ScrollTrigger.create({
      trigger: header,
      start: "top 88%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onEnterBack: reveal,
    });
  });
}

function comfortProblemsReveal({ gsap, ScrollTrigger }) {
  const section = document.querySelector(".comfort-problems");
  if (!(section instanceof HTMLElement)) return;

  const problems = gsap.utils
    .toArray(".comfort-problems .problem-item")
    .filter((el) => el instanceof HTMLElement);
  const card = section.querySelector(".solution-card");

  if (problems.length === 0 && !(card instanceof HTMLElement)) return;

  const revealNow = isInView(section, 0.92);

  if (problems.length > 0) gsap.set(problems, { y: 18, autoAlpha: 0 });
  if (card instanceof HTMLElement) gsap.set(card, { y: 18, autoAlpha: 0 });

  const reveal = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (problems.length > 0) gsap.set(problems, { clearProps: "transform,opacity" });
        if (card instanceof HTMLElement) gsap.set(card, { clearProps: "transform,opacity" });
      },
    });

    if (problems.length > 0) {
      tl.to(
        problems,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.08,
          overwrite: true,
        },
        0,
      );
    }

    if (card instanceof HTMLElement) {
      tl.to(
        card,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          overwrite: true,
        },
        0.12,
      );
    }
  };

  if (revealNow) {
    reveal();
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    once: true,
    invalidateOnRefresh: true,
    onEnter: reveal,
    onEnterBack: reveal,
  });
}

function finalCtaReveal({ gsap, ScrollTrigger }) {
  const section = document.querySelector(".final-cta");
  if (!(section instanceof HTMLElement)) return;

  const inner = section.querySelector(".final-cta__inner");
  if (!(inner instanceof HTMLElement)) return;

  const title = section.querySelector(".final-cta__title");
  const text = section.querySelector(".final-cta__text");
  const buttons = Array.from(section.querySelectorAll(".final-cta__actions a, .final-cta__actions button")).filter(
    (el) => el instanceof HTMLElement,
  );

  const parts = [inner];
  if (title instanceof HTMLElement) parts.push(title);
  if (text instanceof HTMLElement) parts.push(text);
  if (buttons.length > 0) parts.push(...buttons);

  const revealNow = isInView(section, 0.92);

  gsap.set(inner, { y: 54, scale: 0.92, autoAlpha: 0 });
  if (title instanceof HTMLElement) gsap.set(title, { y: 24, autoAlpha: 0 });
  if (text instanceof HTMLElement) gsap.set(text, { y: 20, autoAlpha: 0 });
  if (buttons.length > 0) gsap.set(buttons, { y: 16, autoAlpha: 0 });

  const reveal = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => gsap.set(parts, { clearProps: "transform,opacity" }),
    });

    tl.to(
      inner,
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.95,
        overwrite: true,
      },
      0,
    );

    if (title instanceof HTMLElement) {
      tl.to(
        title,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          overwrite: true,
        },
        0.12,
      );
    }

    if (text instanceof HTMLElement) {
      tl.to(
        text,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          overwrite: true,
        },
        0.22,
      );
    }

    if (buttons.length > 0) {
      tl.to(
        buttons,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.14,
          overwrite: true,
        },
        0.32,
      );
    }
  };

  if (revealNow) {
    reveal();
  } else {
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: reveal,
      onEnterBack: reveal,
    });
  }

  const primary = section.querySelector(".final-cta__primary");
  if (!(primary instanceof HTMLElement)) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "bottom 20%",
    onEnter: () => primary.classList.add("is-pulsing"),
    onLeave: () => primary.classList.remove("is-pulsing"),
    onEnterBack: () => primary.classList.add("is-pulsing"),
    onLeaveBack: () => primary.classList.remove("is-pulsing"),
  });
}

function contactReveal({ gsap }) {
  const section = document.querySelector(".contact-us");
  if (!(section instanceof HTMLElement)) return;

  const info = section.querySelector("[data-contact-info]");
  const form = section.querySelector("[data-contact-form]");
  if (!(info instanceof HTMLElement)) return;
  if (!(form instanceof HTMLElement)) return;

  const isMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 900px)").matches;

  const x = isMobile ? 90 : 170;
  const y = isMobile ? 16 : 22;

  const ScrollTrigger = window.ScrollTrigger;
  if (!ScrollTrigger) return;

  const revealNow = isInView(section, 0.92);

  gsap.set(info, { x: -x, y, autoAlpha: 0 });
  gsap.set(form, { x, y, autoAlpha: 0 });

  const reveal = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => gsap.set([info, form], { clearProps: "transform,opacity" }),
    });

    tl.to(
      info,
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        overwrite: true,
      },
      0,
    ).to(
      form,
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        overwrite: true,
      },
      0.12,
    );
  };

  if (revealNow) {
    reveal();
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top 78%",
    once: true,
    invalidateOnRefresh: true,
    onEnter: reveal,
    onEnterBack: reveal,
  });
}

function hoverEnhancements({ gsap }) {
  if (!supportsHover()) return;

  const cards = document.querySelectorAll(
    ".service-showcase__item, .plan, .comfort-block, .solution-card, .problem-item, .contact-block",
  );

  cards.forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    let tween = null;
    const enter = () => {
      tween?.kill();
      tween = gsap.to(card, {
        y: -6,
        duration: 0.22,
        ease: "power2.out",
        boxShadow:
          "0 30px 90px rgba(15, 23, 42, 0.14), 0 0 0 6px rgba(var(--theme-accent-rgb), 0.10)",
        overwrite: true,
      });
    };
    const leave = () => {
      tween?.kill();
      tween = gsap.to(card, {
        y: 0,
        duration: 0.24,
        ease: "power2.out",
        boxShadow: "",
        overwrite: true,
        onComplete: () => gsap.set(card, { clearProps: "transform,boxShadow" }),
      });
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", leave);
  });

  const buttons = document.querySelectorAll(
    ".hero__cta, .service-showcase__cta, .plan__cta, .solution-card__cta, .comfort-block__cta, .final-cta__primary, .final-cta__secondary, .contact-submit, .header-cta, .header-emergency",
  );

  buttons.forEach((btn) => {
    if (!(btn instanceof HTMLElement)) return;

    let tween = null;
    const enter = () => {
      tween?.kill();
      tween = gsap.to(btn, {
        scale: 1.035,
        duration: 0.18,
        ease: "power2.out",
        boxShadow:
          "0 22px 60px rgba(var(--theme-accent-rgb), 0.28), 0 0 0 6px rgba(var(--theme-accent-rgb), 0.12)",
        overwrite: true,
      });
    };
    const leave = () => {
      tween?.kill();
      tween = gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        boxShadow: "",
        overwrite: true,
        onComplete: () => gsap.set(btn, { clearProps: "transform,boxShadow" }),
      });
    };

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    btn.addEventListener("focusin", enter);
    btn.addEventListener("focusout", leave);
  });
}

let initialized = false;

export function initAnimations() {
  if (initialized) return;
  initialized = true;

  if (prefersReducedMotion()) return;

  const libs = getGsap();
  if (!libs) return;

  const { gsap, ScrollTrigger } = libs;

  heroIntro({ gsap });
  servicesReveal({ gsap, ScrollTrigger });
  cardsFadeUp({ gsap, ScrollTrigger });
  benefitsReveal({ gsap, ScrollTrigger });
  comfortProblemsReveal({ gsap, ScrollTrigger });
  finalCtaReveal({ gsap, ScrollTrigger });
  contactReveal({ gsap, ScrollTrigger });
  hoverEnhancements({ gsap });

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true },
  );

  window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 50);
}
