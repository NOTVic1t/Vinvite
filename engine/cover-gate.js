// ============================================================================
// VINVITE ENGINE — COVER GATE
// Usage: window.initCoverGate("#cover-screen", "#open-invitation-btn")
// Hides the cover and starts music (if present) on tap.
// ============================================================================

window.initCoverGate = function (coverSelector, buttonSelector) {
  const cover = document.querySelector(coverSelector);
  const button = document.querySelector(buttonSelector);
  if (!cover || !button) return;

  // Lock body scroll while cover is showing
  document.body.classList.add("vinvite-locked");

  button.addEventListener("click", () => {
    cover.classList.add("is-closing");
    document.body.classList.remove("vinvite-locked");

    if (typeof window.vinviteTryAutoplayMusic === "function") {
      window.vinviteTryAutoplayMusic();
    }

    // After transition: remove from layout entirely and disable pointer events
    setTimeout(() => {
      cover.style.display = "none";
      // Scroll to top of main content cleanly
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 820);
  });
};
