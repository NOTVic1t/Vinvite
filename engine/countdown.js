// ============================================================================
// VINVITE ENGINE — COUNTDOWN
// Usage: window.startCountdown("2026-10-17T08:00:00", { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" })
// ============================================================================

window.startCountdown = function (targetDateString, selectors) {
  const target = new Date(targetDateString).getTime();
  if (isNaN(target)) return;

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);

    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = String(val).padStart(2, "0");
    };

    set(selectors.d, days);
    set(selectors.h, hours);
    set(selectors.m, mins);
    set(selectors.s, secs);
  }

  tick();
  return setInterval(tick, 1000);
};
