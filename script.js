/* ==========================================================================
   Sudheer Dasineni — Dual-Profile Portfolio (SAP Profile + Business/OM Profile)
   ========================================================================== */

(function () {
  "use strict";

  const PROFILE_META = {
    sap: {
      pageTitle: "Sudheer Dasineni — SAP SD / Logistics Techno-Functional Consultant",
      brandName: "Sudheer Dasineni",
      brandRole: "SAP SD / Logistics Techno-Functional Consultant",
      experienceHeading: "SAP Consulting Career Timeline",
      contactHeading: "Discuss Senior SAP SD / S/4HANA Consulting Roles",
      contactDescription:
        "Based in Hyderabad, India — experienced working with global teams across India, EMEA, and Americas. Connect on LinkedIn or email directly to discuss SAP consulting engagements or request a tailored CV.",
      email: "dsudhir18@gmail.com",
      emailSubject: "SAP Opportunity — Sudheer Dasineni",
      shareUrl: "https://dsudheerk1-coder.github.io/?profile=sap"
    },
    business: {
      pageTitle: "Sudheer Kumar DP — Order Management & Manufacturing Operations Leader",
      brandName: "Sudheer Kumar DP",
      brandRole: "Order Management & Manufacturing Operations Leader",
      experienceHeading: "Order Management & Operations Career Timeline",
      contactHeading: "Discuss Order Management & Operations Leadership Roles",
      contactDescription:
        "Based in Hyderabad, India — 20+ years leading manufacturing operations, 15-member O2C teams, commercial controls, PPC reviews, and global supply chain execution. Reach out via LinkedIn or email.",
      email: "dsudheerk1@gmail.com",
      emailSubject: "Operations Leadership Opportunity — Sudheer Kumar DP",
      shareUrl: "https://dsudheerk1-coder.github.io/?profile=business"
    }
  };

  const body = document.body;
  const headerBrandName = document.getElementById("header-brand-name");
  const headerBrandRole = document.getElementById("header-brand-role");
  const experienceHeading = document.getElementById("experience-heading");
  const contactHeading = document.getElementById("contact-heading");
  const contactDescription = document.getElementById("contact-description");
  const contactEmailBtn = document.getElementById("contact-email-btn");
  const profileViews = document.querySelectorAll("[data-profile-view]");
  const profileSelectors = document.querySelectorAll("[data-profile-select]");
  const toastEl = document.getElementById("toast");

  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 2800);
  }

  function setActiveProfile(profileId, options) {
    const opts = options || {};
    const key = PROFILE_META[profileId] ? profileId : "sap";
    const meta = PROFILE_META[key];

    body.setAttribute("data-profile", key);
    document.title = meta.pageTitle;

    if (headerBrandName) headerBrandName.textContent = meta.brandName;
    if (headerBrandRole) headerBrandRole.textContent = meta.brandRole;
    if (experienceHeading) experienceHeading.textContent = meta.experienceHeading;
    if (contactHeading) contactHeading.textContent = meta.contactHeading;
    if (contactDescription) contactDescription.textContent = meta.contactDescription;
    if (contactEmailBtn) {
      contactEmailBtn.textContent = meta.email;
      contactEmailBtn.setAttribute(
        "href",
        "mailto:" + meta.email + "?subject=" + encodeURIComponent(meta.emailSubject)
      );
    }

    profileViews.forEach((view) => {
      const matches = view.getAttribute("data-profile-view") === key;
      view.classList.toggle("is-hidden", !matches);
    });

    profileSelectors.forEach((btn) => {
      const matches = btn.getAttribute("data-profile-select") === key;
      btn.classList.toggle("is-active", matches);
      if (btn.getAttribute("role") === "tab") {
        btn.setAttribute("aria-selected", String(matches));
      } else {
        btn.setAttribute("aria-pressed", String(matches));
      }
    });

    if (opts.updateUrl !== false && window.history && window.history.replaceState) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("profile", key);
        window.history.replaceState({}, "", url.toString());
      } catch (_err) {
        // Ignore on restricted file:// origins
      }
    }

    if (opts.scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  profileSelectors.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-profile-select");
      const shouldScrollTop = btn.closest("#opportunities") !== null;
      setActiveProfile(target, { updateUrl: true, scrollTop: shouldScrollTop });
    });
  });

  // Read initial profile from URL query (?profile=business or ?profile=om or ?profile=sap)
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("profile") || "").toLowerCase();
  if (requested === "business" || requested === "om" || requested === "operations") {
    setActiveProfile("business", { updateUrl: false });
  } else {
    setActiveProfile("sap", { updateUrl: false });
  }

  // Copy direct profile share link
  document.querySelectorAll("[data-copy-profile-link]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute("data-copy-profile-link");
      const link = PROFILE_META[key] ? PROFILE_META[key].shareUrl : PROFILE_META.sap.shareUrl;
      try {
        await navigator.clipboard.writeText(link);
        showToast("Copied link: " + link);
      } catch (_err) {
        showToast("Share URL: " + link);
      }
    });
  });

  // Copy structured public profile JSON URL
  const copyJsonBtn = document.getElementById("copy-json-url");
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener("click", async () => {
      const jsonUrl = "https://dsudheerk1-coder.github.io/profile-public.json";
      try {
        await navigator.clipboard.writeText(jsonUrl);
        showToast("Copied profile-public.json URL.");
      } catch (_err) {
        showToast("JSON URL: " + jsonUrl);
      }
    });
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
      });
    });
  }

  // Scroll-spy for active navigation link
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]')).filter(
    (link) => !link.classList.contains("nav-cta")
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle("is-current", link.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
  }

  // Print / Save PDF overview
  const printBtn = document.getElementById("print-profile");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Keep footer year current
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
