/* ==========================================================================
   Sudheer Dasineni — Interactive Visual Portfolio Engine
   Features:
     1. Dual Profile Theme Switching (SAP Sapphire vs Business/OM Gold)
     2. Animated KPI Counters
     3. Interactive 5-Stage Architecture & Operations Flow Explorer
     4. Cross-Timeline Skill Spotlighter (click any skill -> highlight bullets)
     5. Expand / Collapse Career Roles + Compact View Toggle
     6. Cursor Spotlight Glow, Scroll Progress, Scroll Reveal, Recruiter Pitch Copy
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
      shareUrl: "https://dsudheerk1-coder.github.io/?profile=sap",
      pitch:
        "Sudheer Dasineni | SAP SD / Logistics Techno-Functional Consultant (20 Yrs) | SAP S/4HANA Dual-Certified (Sales & Sourcing/Procurement, 2025) | Current: Sr. SAP O2C Specialist at Wipro (Apple Inc.) — hands-on SAP SD/MM, Variant Configuration, APO/ATP, IDoc/EDI (WE02/WE05/BD87/WE20), 3PL (Blue Dart/DHL/FedEx), TMS 2.0 & ProShip | Portfolio: https://dsudheerk1-coder.github.io/?profile=sap"
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
      shareUrl: "https://dsudheerk1-coder.github.io/?profile=business",
      pitch:
        "Sudheer Kumar DP | Order Management & Manufacturing Operations Leader (20+ Yrs) | Led 15-member O2C & Sales Ops team at Regal Rexnord with 15–20% delegated discount authority, PPC backlog reviews, 95%+ OTD, $6M growth, -40% manual work, -35% logistics costs (JK Fenner) & -30% order cycle time (Apple Inc.) | Portfolio: https://dsudheerk1-coder.github.io/?profile=business"
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
  const scrollProgress = document.getElementById("scroll-progress");
  const toastEl = document.getElementById("toast");

  let toastTimer = null;
  let activeProfile = "sap";

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 3000);
  }

  /* ------------------------------------------------------------------------
     1. Animated KPI Counters
     ------------------------------------------------------------------------ */
  function animateVisibleCounters(profileKey) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = document.getElementById("hero-" + profileKey);
    if (!container) return;

    const counters = container.querySelectorAll("[data-count-to]");
    counters.forEach((el) => {
      const target = Number(el.getAttribute("data-count-to") || 0);
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      if (prefersReduced || !target) {
        el.textContent = prefix + target + suffix;
        return;
      }

      const duration = 680;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ------------------------------------------------------------------------
     2. Dual Profile Switching (SAP vs Business/OM)
     ------------------------------------------------------------------------ */
  function setActiveProfile(profileId, options) {
    const opts = options || {};
    const key = PROFILE_META[profileId] ? profileId : "sap";
    const meta = PROFILE_META[key];
    activeProfile = key;

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
        const ind = btn.querySelector(".tab-indicator");
        if (ind) ind.textContent = matches ? "Active View" : "Switch View";
      } else {
        btn.setAttribute("aria-pressed", String(matches));
      }
    });

    clearSkillHighlight("sap");
    clearSkillHighlight("business");
    revealNewlyVisibleElements();
    animateVisibleCounters(key);

    if (opts.updateUrl !== false && window.history && window.history.replaceState) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("profile", key);
        window.history.replaceState({}, "", url.toString());
      } catch (_err) {
        // Ignore on file:// origins
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

  /* ------------------------------------------------------------------------
     3. Interactive 5-Stage Architecture & Lifecycle Flow Explorer
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".flow-explorer").forEach((explorer) => {
    const nodes = explorer.querySelectorAll(".flow-node");
    const panels = explorer.querySelectorAll(".flow-panel");

    nodes.forEach((node) => {
      node.addEventListener("click", () => {
        const targetId = node.getAttribute("data-flow-target");
        nodes.forEach((n) => {
          const isMatch = n === node;
          n.classList.toggle("is-active", isMatch);
          n.setAttribute("aria-selected", String(isMatch));
        });
        panels.forEach((panel) => {
          panel.classList.toggle(
            "is-hidden",
            panel.getAttribute("data-flow-panel") !== targetId
          );
        });
      });
    });
  });

  /* ------------------------------------------------------------------------
     4. Interactive Cross-Timeline Skill Spotlighter
     ------------------------------------------------------------------------ */
  function clearSkillHighlight(profileKey) {
    const chipGroup = document.querySelector('[data-spotlight-group="' + profileKey + '"]');
    const banner = document.querySelector('[data-match-banner="' + profileKey + '"]');
    const timelineView = document.querySelector('#experience [data-profile-view="' + profileKey + '"]');

    if (chipGroup) {
      chipGroup.querySelectorAll(".skill-chip").forEach((c) => c.classList.remove("is-active"));
      const clearBtn = chipGroup.querySelector(".skill-chip-clear");
      if (clearBtn) clearBtn.classList.add("is-hidden");
    }
    if (banner) {
      banner.classList.add("is-hidden");
      banner.innerHTML = "";
    }
    if (timelineView) {
      timelineView.querySelectorAll(".role-card").forEach((card) => {
        card.classList.remove("has-skill-match", "is-non-match");
      });
      timelineView.querySelectorAll(".role-bullets li").forEach((li) => {
        li.classList.remove("is-bullet-hit");
      });
    }
  }

  function applySkillHighlight(profileKey, keyword, label) {
    const chipGroup = document.querySelector('[data-spotlight-group="' + profileKey + '"]');
    const banner = document.querySelector('[data-match-banner="' + profileKey + '"]');
    const timelineView = document.querySelector('#experience [data-profile-view="' + profileKey + '"]');
    if (!timelineView || !keyword) {
      clearSkillHighlight(profileKey);
      return;
    }

    const needle = keyword.toLowerCase();
    let matchedRoles = 0;
    let matchedBullets = 0;
    let firstMatchId = "";

    timelineView.querySelectorAll(".role-card").forEach((card) => {
      let cardHasMatch = false;
      const bullets = card.querySelectorAll(".role-bullets li");
      bullets.forEach((li) => {
        const hit = li.textContent.toLowerCase().includes(needle);
        li.classList.toggle("is-bullet-hit", hit);
        if (hit) {
          cardHasMatch = true;
          matchedBullets += 1;
        }
      });

      if (!cardHasMatch && card.textContent.toLowerCase().includes(needle)) {
        cardHasMatch = true;
      }

      card.classList.toggle("has-skill-match", cardHasMatch);
      card.classList.toggle("is-non-match", !cardHasMatch);

      if (cardHasMatch) {
        matchedRoles += 1;
        // Auto-expand matched role so recruiter immediately sees the highlighted bullets
        card.classList.remove("is-collapsed");
        const expBtn = card.querySelector(".expand-btn");
        if (expBtn) {
          expBtn.textContent = "Collapse";
          expBtn.setAttribute("aria-expanded", "true");
        }
        if (!firstMatchId && card.id) {
          firstMatchId = card.id;
        }
      }
    });

    if (chipGroup) {
      const clearBtn = chipGroup.querySelector(".skill-chip-clear");
      if (clearBtn) clearBtn.classList.remove("is-hidden");
    }

    if (banner) {
      const jumpHref = firstMatchId ? "#" + firstMatchId : "#experience";
      banner.innerHTML =
        "<span>Highlighted <strong>" +
        label +
        "</strong> across <strong>" +
        matchedRoles +
        " role" +
        (matchedRoles === 1 ? "" : "s") +
        "</strong> (" +
        matchedBullets +
        " matching achievement" +
        (matchedBullets === 1 ? "" : "s") +
        ").</span>" +
        '<a href="' +
        jumpHref +
        '">Jump to first match &darr;</a>';
      banner.classList.remove("is-hidden");
    }
  }

  document.querySelectorAll("[data-spotlight-group]").forEach((group) => {
    const profileKey = group.getAttribute("data-spotlight-group");
    group.querySelectorAll(".skill-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const kw = chip.getAttribute("data-keyword");
        if (!kw || chip.classList.contains("is-active")) {
          clearSkillHighlight(profileKey);
          return;
        }
        group.querySelectorAll(".skill-chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        applySkillHighlight(profileKey, kw, chip.textContent.trim());
      });
    });
  });

  /* ------------------------------------------------------------------------
     5. Expand / Collapse Individual Roles + Compact View Toggle
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".expand-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".role-card");
      if (!card) return;
      const collapsed = card.classList.toggle("is-collapsed");
      btn.textContent = collapsed ? "Expand" : "Collapse";
      btn.setAttribute("aria-expanded", String(!collapsed));
    });
  });

  const toggleAllBtn = document.getElementById("toggle-all-roles");
  let allCompact = false;
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", () => {
      allCompact = !allCompact;
      const activeTimeline = document.querySelector('#experience [data-profile-view="' + activeProfile + '"]');
      if (activeTimeline) {
        activeTimeline.querySelectorAll(".role-card").forEach((card) => {
          card.classList.toggle("is-collapsed", allCompact);
          const expBtn = card.querySelector(".expand-btn");
          if (expBtn) {
            expBtn.textContent = allCompact ? "Expand" : "Collapse";
            expBtn.setAttribute("aria-expanded", String(!allCompact));
          }
        });
      }
      toggleAllBtn.textContent = allCompact ? "Expand All" : "Compact View";
    });
  }

  /* ------------------------------------------------------------------------
     6. Cursor Spotlight Glow on Executive Snapshot Cards
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", x.toFixed(1) + "%");
      card.style.setProperty("--my", y.toFixed(1) + "%");
    });
  });

  /* ------------------------------------------------------------------------
     7. Copy Recruiter Pitch, Direct Profile Link, JSON URL & Print
     ------------------------------------------------------------------------ */
  async function copyText(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
    } catch (_err) {
      showToast(text);
    }
  }

  document.querySelectorAll("[data-copy-profile-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-copy-profile-link");
      const link = PROFILE_META[key] ? PROFILE_META[key].shareUrl : PROFILE_META.sap.shareUrl;
      copyText(link, "Copied link: " + link);
    });
  });

  document.querySelectorAll("[data-copy-pitch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-copy-pitch");
      const pitch = PROFILE_META[key] ? PROFILE_META[key].pitch : PROFILE_META.sap.pitch;
      copyText(pitch, "Copied executive recruiter pitch to clipboard.");
    });
  });

  const copyJsonBtn = document.getElementById("copy-json-url");
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener("click", () => {
      copyText(
        "https://dsudheerk1-coder.github.io/profile-public.json",
        "Copied profile-public.json URL."
      );
    });
  }

  const printBtn = document.getElementById("print-profile");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  /* ------------------------------------------------------------------------
     8. Mobile Navigation, Scroll Progress, Scroll Spy & Reveal Animations
     ------------------------------------------------------------------------ */
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

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollProgress) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    },
    { passive: true }
  );

  // Scroll reveal
  let revealObserver = null;
  function revealNewlyVisibleElements() {
    document.querySelectorAll(".reveal").forEach((el) => {
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add("is-visible");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-ready");
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
  }

  // Active nav highlighting
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]')).filter(
    (link) => !link.classList.contains("nav-cta")
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
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
    sections.forEach((sec) => spy.observe(sec));
  }

  // Current footer year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Initialize active profile from URL query (?profile=sap | business | om)
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("profile") || "").toLowerCase();
  if (requested === "business" || requested === "om" || requested === "operations") {
    setActiveProfile("business", { updateUrl: false });
  } else {
    setActiveProfile("sap", { updateUrl: false });
  }
})();
