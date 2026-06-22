// ============================================================================
// VINVITE ENGINE — COVER GATE
// Pure JS approach — no dependency on CSS transitions to hide the cover.
// This avoids the scroll-snap / transition conflict that caused the stuck bug.
// ============================================================================

window.initCoverGate = function (coverSelector, buttonSelector) {
  const cover = document.querySelector(coverSelector);
  const button = document.querySelector(buttonSelector);
  if (!cover || !button) return;

  // Prevent scroll while cover is visible
  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";

  button.addEventListener("click", () => {
    // Start fade via inline style (works regardless of any CSS class conflicts)
    cover.style.transition = "opacity 0.7s ease";
    cover.style.opacity = "0";
    cover.style.pointerEvents = "none";
    cover.style.touchAction = "none";

    // Restore scroll immediately so the page behind is live
    document.body.style.overflow = "";
    document.body.style.height = "";

    // Try autoplay music
    if (typeof window.vinviteTryAutoplayMusic === "function") {
      window.vinviteTryAutoplayMusic();
    }

    // Fully remove from DOM after fade
    setTimeout(() => {
      cover.style.display = "none";
      cover.style.opacity = "";
      cover.style.transition = "";
    }, 750);
  });
};
