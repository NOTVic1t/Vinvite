// =============================================================================
// VINVITE ENGINE — SECTION BACKGROUND PHOTOS
// Optional, per-section background photo that fades in as the section
// scrolls into view. Independent of hidden_sections (content visibility) —
// a section can show its content with the photo off, or vice versa.
//
// Data shape (data.section_backgrounds):
//   { "<sectionKey>": { "url": "https://...", "enabled": true } }
//
// Usage (called once from a theme's script.js, after the section markup
// exists in the DOM):
//   window.applySectionBackgrounds(data, {
//     hero: "#section-hero",
//     couple: "#section-couple",
//     events: '[data-section="events"]',
//     // ...one CSS selector per sectionKey the theme wants to support
//   });
//
// Theme CSS contract: the target element needs `position: relative` (it
// already does, in every theme that uses the corner-vine / signature-divider
// pattern). This module injects a `<div class="section-bg-photo">` as the
// FIRST child of the target and toggles `.is-visible` on it; the theme's own
// CSS controls the tint/overlay color so it matches that theme's palette.
// =============================================================================

window.applySectionBackgrounds = function (data, sectionSelectorMap) {
  if (!sectionSelectorMap) return;

  const raw = data.section_backgrounds;
  const bgConfig = raw && typeof raw === "object" ? raw : (raw ? JSON.parse(raw) : {});

  Object.entries(sectionSelectorMap).forEach(([key, selector]) => {
    const target = document.querySelector(selector);
    if (!target) return;

    const cfg = bgConfig[key];
    if (!cfg || !cfg.enabled || !cfg.url) return;

    const photo = document.createElement("div");
    photo.className = "section-bg-photo";
    photo.style.backgroundImage = `url('${cfg.url}')`;
    photo.setAttribute("aria-hidden", "true");
    target.prepend(photo);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          photo.classList.add("is-visible");
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });

    io.observe(target);
  });
};
