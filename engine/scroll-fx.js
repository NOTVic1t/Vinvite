// =============================================================================
// VINVITE ENGINE — SCROLL FX
// Shared by every theme: scroll-reveal, parallax, floating particles, progress bar.
// All effects respect prefers-reduced-motion.
// =============================================================================

const VINVITE_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// SCROLL REVEAL — fade/slide an element in once it enters the viewport.
// Usage: <div data-reveal> or <div data-reveal="left">  (default = up)
// ---------------------------------------------------------------------------
window.initScrollReveal = function (selector = "[data-reveal]") {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  if (VINVITE_REDUCED_MOTION) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
};

// ---------------------------------------------------------------------------
// PARALLAX — shifts an element vertically as the page scrolls past it.
// Usage: <img data-parallax data-parallax-speed="0.15" />
// ---------------------------------------------------------------------------
window.initParallax = function (selector = "[data-parallax]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length || VINVITE_REDUCED_MOTION) return;

  let ticking = false;

  function update() {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed || "0.15");
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(centerOffset * speed * -1).toFixed(1)}px, 0)`;
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
};

// ---------------------------------------------------------------------------
// FLOATING PARTICLES — ambient drifting shapes (petals / sparkles / embers).
// Usage: window.initFloatingParticles("#particle-field", { symbol: "❀", count: 14, className: "particle-petal" })
// ---------------------------------------------------------------------------
window.initFloatingParticles = function (containerSelector, opts = {}) {
  if (VINVITE_REDUCED_MOTION) return;
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const { symbol = "✦", count = 14, className = "vinvite-particle" } = opts;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = symbol;
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 12}s`;
    el.style.animationDelay = `${Math.random() * -20}s`;
    el.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);
    el.style.fontSize = `${0.6 + Math.random() * 0.9}rem`;
    container.appendChild(el);
  }
};

// ---------------------------------------------------------------------------
// SCROLL PROGRESS BAR
// Usage: <div id="scroll-progress"></div>  +  window.initScrollProgress("#scroll-progress")
// ---------------------------------------------------------------------------
window.initScrollProgress = function (barSelector) {
  const bar = document.querySelector(barSelector);
  if (!bar) return;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
};
