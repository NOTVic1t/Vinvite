// ============================================================================
// VINVITE ENGINE — COVER GATE
// Usage: window.initCoverGate("#cover-screen", "#open-invitation-btn")
// Hides the cover and starts music (if present) on tap.
// ============================================================================

window.initCoverGate = function (coverSelector, buttonSelector) {
  const cover = document.querySelector(coverSelector);
  const button = document.querySelector(buttonSelector);
  if (!cover || !button) return;

  button.addEventListener("click", () => {
    cover.classList.add("is-closing");
    document.body.classList.remove("vinvite-locked");
    if (typeof window.vinviteTryAutoplayMusic === "function") {
      window.vinviteTryAutoplayMusic();
    }
    setTimeout(() => {
      cover.style.display = "none";
    }, 800);
  });

  document.body.classList.add("vinvite-locked");
};
