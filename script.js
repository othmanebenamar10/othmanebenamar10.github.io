const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealTargets = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = menuToggle?.querySelector(".sr-only");

const setMenuState = (isOpen) => {
  if (!topbar || !menuToggle) {
    return;
  }

  topbar.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  if (menuToggleLabel) {
    menuToggleLabel.textContent = isOpen ? "Fermer la navigation" : "Ouvrir la navigation";
  }
};

if (topbar && menuToggle) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!topbar.classList.contains("is-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });
}

const syncActiveLink = () => {
  const checkpoint = window.scrollY + window.innerHeight * 0.35;
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= checkpoint) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
  });
};

syncActiveLink();
window.addEventListener("scroll", syncActiveLink, { passive: true });
window.addEventListener("resize", () => {
  syncActiveLink();

  if (window.innerWidth > 760) {
    setMenuState(false);
  }
});

if (!prefersReducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const surface = card.querySelector(".tilt-surface") || card;
    const reset = () => {
      surface.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const rotateY = offsetX * 10;
      const rotateX = offsetY * -10;

      surface.style.transform =
        `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointerup", reset);
  });
}
