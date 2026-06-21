// ============================================================================
// VINVITE ENGINE — MUSIC PLAYER
// Usage: window.initMusicPlayer("#bg-music", "#music-toggle")
// Autoplay browsers block audio until a user gesture, so this starts paused
// and plays once the cover gate (or the toggle button) is tapped.
// ============================================================================

window.initMusicPlayer = function (audioSelector, toggleSelector) {
  const audio = document.querySelector(audioSelector);
  const toggle = document.querySelector(toggleSelector);
  if (!audio) return;

  audio.loop = true;

  function setState(playing) {
    if (toggle) toggle.classList.toggle("is-playing", playing);
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => setState(true)).catch(() => {});
      } else {
        audio.pause();
        setState(false);
      }
    });
  }

  window.vinviteTryAutoplayMusic = function () {
    audio.play().then(() => setState(true)).catch(() => setState(false));
  };
};
