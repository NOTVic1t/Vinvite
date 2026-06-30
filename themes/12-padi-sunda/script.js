// =============================================================================
// VINVITE — THEME 12: ENCHANTED GARDEN — render logic
// =============================================================================

window.renderInvitation = function (data) {
  // ---------------------------------------------------------------------
  // 1) UI / ANIMATION WIRING — always runs, regardless of data shape.
  // ---------------------------------------------------------------------
  initLoadingScreen();
  spawnCoverFireflies();
  initGateOpen();
  spawnPetals();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("is-visible"); });
  }, { threshold: 0.35 });
  document.querySelectorAll(".vine-divider").forEach(el => io.observe(el));

  window.initScrollReveal();
  window.initParallax();
  window.initScrollProgress("#scroll-progress");
  initQuickNav();
  initAutoScroll();

  // ---------------------------------------------------------------------
  // 2) CONTENT RENDERING — each block guarded so one failure can't cascade.
  // ---------------------------------------------------------------------
  const groomShort = data.groom_nickname || data.groom_name || "";
  const brideShort = data.bride_nickname || data.bride_name || "";

  try {
    document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";
    document.querySelector(".cover-names").innerHTML = `${groomShort} <span>&amp;</span> ${brideShort}`;
    document.getElementById("hero-names").innerHTML = `${groomShort} &amp; ${brideShort}`;
    document.title = `Undangan Pernikahan ${groomShort} & ${brideShort}`;
    const loadingInitials = document.getElementById("loading-initials");
    if (loadingInitials && groomShort && brideShort) {
      loadingInitials.innerHTML = `${groomShort.charAt(0)}&nbsp;&amp;&nbsp;${brideShort.charAt(0)}`;
    }
  } catch (e) { console.error("[Vinvite] names render failed:", e); }

  try {
    if (data.cover_image_url) {
      const cover = document.getElementById("cover-screen");
      if (cover) {
        cover.style.backgroundImage = `radial-gradient(ellipse at 50% 20%, rgba(31,77,60,.55) 0%, rgba(18,46,36,.82) 80%), url('${data.cover_image_url}')`;
        cover.style.backgroundSize = "cover";
        cover.style.backgroundPosition = "center";
      }
    }
  } catch (e) { console.error("[Vinvite] cover photo failed:", e); }

  let firstEvent = null;
  try {
    const events = Array.isArray(data.events) ? data.events : JSON.parse(data.events || "[]");
    firstEvent = events[0] || null;
    const heroDateStr = firstEvent ? firstEvent.date : (data.resepsi_date || data.akad_date);
    if (heroDateStr) {
      const d = new Date(heroDateStr);
      if (!isNaN(d)) document.querySelector(".hero-date").textContent =
        d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
    window.renderEvents(data, "#events-container");
  } catch (e) { console.error("[Vinvite] events render failed:", e); }

  try {
    document.getElementById("groom-name").textContent = data.groom_name || "";
    document.getElementById("groom-parents").textContent = data.groom_parents || "";
    document.getElementById("bride-name").textContent = data.bride_name || "";
    document.getElementById("bride-parents").textContent = data.bride_parents || "";
    document.querySelector(".closing-names").innerHTML = `${groomShort} &amp; ${brideShort}`;
    const groomImg = document.getElementById("groom-photo");
    const brideImg = document.getElementById("bride-photo");
    if (groomImg && data.groom_photo_url) groomImg.src = data.groom_photo_url;
    if (brideImg && data.bride_photo_url) brideImg.src = data.bride_photo_url;
  } catch (e) { console.error("[Vinvite] couple render failed:", e); }

  try {
    const qt = document.getElementById("quote-text");
    const qs = document.getElementById("quote-source");
    if (qt && data.quote_text) qt.innerHTML = `&ldquo;${data.quote_text}&rdquo;`;
    if (qs && data.quote_source) qs.textContent = data.quote_source;
  } catch (e) { console.error("[Vinvite] quote render failed:", e); }

  try { window.renderRundown(data, "#rundown-container"); } catch (e) { console.error("[Vinvite] rundown render failed:", e); }
  try { window.renderDressCode(data, "#dress-code-container"); } catch (e) { console.error("[Vinvite] dress code render failed:", e); }
  try { window.renderHashtag(data, "#hashtag-container"); } catch (e) { console.error("[Vinvite] hashtag render failed:", e); }

  try {
    if (firstEvent && firstEvent.date) {
      window.startCountdown(`${firstEvent.date}T${firstEvent.time_start || "00:00"}:00`,
        { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
    } else if (data.resepsi_date || data.akad_date) {
      window.startCountdown(`${data.resepsi_date || data.akad_date}T00:00:00`,
        { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
    }
  } catch (e) { console.error("[Vinvite] countdown failed:", e); }

  try {
    const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
    document.getElementById("story-timeline").innerHTML = story.map(s => `
      <div class="story-item">
        <p class="story-date">${s.date || ""}</p>
        <h3 class="story-title">${s.title || ""}</h3>
        <p class="story-text">${s.text || ""}</p>
      </div>
    `).join("");
  } catch (e) { console.error("[Vinvite] story render failed:", e); }

  try {
    const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
    document.getElementById("gallery-grid").innerHTML = gallery.map(url => `
      <div class="gallery-item"><img src="${url}" loading="lazy" alt="" /></div>
    `).join("");
  } catch (e) { console.error("[Vinvite] gallery render failed:", e); }

  try {
    const accounts = Array.isArray(data.gift_accounts) ? data.gift_accounts : JSON.parse(data.gift_accounts || "[]");
    document.getElementById("gift-accounts").innerHTML = accounts.map(a => `
      <div class="gift-account">
        <div class="gift-account-info">
          <p>${a.type || ""}${a.bank_name ? " · " + a.bank_name : ""}</p>
          <strong>${a.account_number || ""}</strong>
          <p>a.n. ${a.account_holder || ""}</p>
        </div>
        <button class="btn-copy" data-copy="${a.account_number || ""}">Salin</button>
      </div>
    `).join("");
    document.querySelectorAll(".btn-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Tersalin!";
        setTimeout(() => (btn.textContent = "Salin"), 1500);
      });
    });
  } catch (e) { console.error("[Vinvite] gift render failed:", e); }

  try {
    if (data.music_url) document.getElementById("bg-music").src = data.music_url;
    window.initMusicPlayer("#bg-music", "#music-toggle");
  } catch (e) { console.error("[Vinvite] music player failed:", e); }

  try { window.initGalleryLightbox(".gallery-item img"); } catch (e) { console.error("[Vinvite] gallery lightbox failed:", e); }

  try {
    // RSVP: kontrak data tetap 3 field (guest_name, attendance, guest_count).
    window.bindRsvpForm("#rsvp-form", data._invitationId);
    window.onRsvpSuccess = () => { document.getElementById("rsvp-success").hidden = false; };
  } catch (e) { console.error("[Vinvite] RSVP bind failed:", e); }

  try {
    window.initGuestbook({
      formSelector: "#guestbook-form",
      listSelector: "#guestbook-list",
      invitationId: data._invitationId,
      itemTemplate: (e) => `
        <div class="wish-item">
          <p class="wish-name">${e.name}</p>
          <p class="wish-message">${e.message}</p>
        </div>`
    });
  } catch (e) { console.error("[Vinvite] guestbook init failed:", e); }

  try { window.initSocialProof("#social-proof", data._invitationId); } catch (e) { console.error("[Vinvite] social proof failed:", e); }
  try { window.applySectionControl(data); } catch (e) { console.error("[Vinvite] section control failed:", e); }

  try {
    window.applySectionBackgrounds(data, {
      hero: "#section-hero",
      quote: '[data-section="quote"]',
      couple: "#section-couple",
      countdown: "#section-countdown",
      events: "#section-acara",
      rundown: '[data-section="rundown"]',
      story: '[data-section="story"]',
      gallery: "#section-galeri",
      gift: '[data-section="gift"]',
      dress_code: '[data-section="dress_code"]',
      hashtag: '[data-section="hashtag"]',
      rsvp: "#section-rsvp",
      guestbook: '[data-section="guestbook"]',
      footer: ".footer",
    });
  } catch (e) { console.error("[Vinvite] section backgrounds failed:", e); }
};

// -----------------------------------------------------------------------------
// COVER FIREFLIES — a denser cluster of fireflies confined to the cover
// screen, on top of the regular page-wide parallax field.
// -----------------------------------------------------------------------------
function spawnCoverFireflies() {
  const field = document.getElementById("cover-firefly-field");
  if (!field) return;

  const drifts = ["drift-a", "drift-b", "drift-c"];
  const count = 16;
  let html = "";
  for (let i = 0; i < count; i++) {
    const size = 10 + Math.random() * 14;
    const drift = drifts[i % drifts.length];
    const duration = (6 + Math.random() * 6).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    html += `<span class="cover-firefly ${drift}" style="width:${size}px;height:${size}px;top:${(Math.random()*92).toFixed(0)}%;left:${(Math.random()*92).toFixed(0)}%;animation-duration:${duration}s;animation-delay:-${delay}s;">
      <svg viewBox="0 0 20 20"><use href="#firefly" /></svg>
    </span>`;
  }
  field.innerHTML = html;
}

// -----------------------------------------------------------------------------
// GATE OPEN — replaces the engine's plain fade for this theme. The two
// .gate-curtain panels (matching the cover background) swing open like a
// garden gate when "Buka Undangan" is pressed.
// -----------------------------------------------------------------------------
function initGateOpen() {
  const cover = document.getElementById("cover-screen");
  const btn = document.getElementById("open-invitation-btn");
  const frame = document.querySelector(".cover-frame");
  if (!cover || !btn) return;

  document.body.style.overflow = "hidden";
  document.body.style.height = "100vh";

  btn.addEventListener("click", () => {
    if (frame) {
      frame.style.transition = "opacity .3s ease, transform .3s ease";
      frame.style.opacity = "0";
      frame.style.transform = "scale(.97)";
    }
    setTimeout(() => {
      cover.classList.add("is-opening");
      document.body.style.overflow = "";
      document.body.style.height = "";
      if (typeof window.vinviteTryAutoplayMusic === "function") {
        window.vinviteTryAutoplayMusic();
      }
    }, 280);
    setTimeout(() => { cover.style.display = "none"; }, 280 + 1150);
  }, { once: true });
}

// -----------------------------------------------------------------------------
// FALLING PETALS — continuously spawned blush petals drifting down the
// whole page for as long as it's open (independent of scroll position),
// alongside the firefly/leaf parallax field.
// -----------------------------------------------------------------------------
function spawnPetals() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const field = document.createElement("div");
  field.className = "petal-field";
  document.body.appendChild(field);

  function spawnOne() {
    const p = document.createElement("div");
    p.className = "falling-petal";
    const size = 10 + Math.random() * 9;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--drift", `${(Math.random() * 50 - 25).toFixed(0)}px`);
    p.style.animationDuration = `${9 + Math.random() * 7}s`;
    p.innerHTML = '<svg viewBox="0 0 30 30"><use href="#fallingPetal" /></svg>';
    field.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }

  for (let i = 0; i < 4; i++) setTimeout(spawnOne, i * 1300);
  setInterval(spawnOne, 2000);
}

// -----------------------------------------------------------------------------
// LOADING SCREEN — brief monogram fade-in, hidden once the page finishes
// loading, with a safety timeout so it never blocks the invitation.
// -----------------------------------------------------------------------------
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;

  let hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    screen.classList.add("is-hidden");
    setTimeout(() => screen.remove(), 700);
  }

  if (document.readyState === "complete") {
    setTimeout(hide, 500);
  } else {
    window.addEventListener("load", () => setTimeout(hide, 400), { once: true });
  }
  setTimeout(hide, 2500);
}

// -----------------------------------------------------------------------------
// QUICK NAV — floating bottom pill, highlights the section currently in view.
// -----------------------------------------------------------------------------
function initQuickNav() {
  const links = [...document.querySelectorAll(".quicknav-link")];
  if (!links.length) return;

  const targets = links
    .map(a => ({ link: a, el: document.querySelector(a.getAttribute("href")) }))
    .filter(t => t.el);

  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = targets.find(t => t.el === entry.target);
        if (match) links.forEach(a => a.classList.toggle("is-active", a === match.link));
      }
    });
  }, { rootMargin: "-42% 0px -42% 0px" });

  targets.forEach(t => io.observe(t.el));

  links.forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (a.getAttribute("href") === "#cover-screen") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(a.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// -----------------------------------------------------------------------------
// AUTO-SCROLL TOGGLE — smooth, cancellable auto-scroll down the page.
// -----------------------------------------------------------------------------
function initAutoScroll() {
  const btn = document.getElementById("autoscroll-toggle");
  if (!btn) return;

  let active = false;
  let raf = null;

  function step() {
    window.scrollBy(0, 1.1);
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) { stop(); return; }
    raf = requestAnimationFrame(step);
  }

  function start() {
    active = true;
    btn.classList.add("is-active");
    btn.setAttribute("aria-label", "Hentikan scroll otomatis");
    step();
  }

  function stop() {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    btn.classList.remove("is-active");
    btn.setAttribute("aria-label", "Mulai scroll otomatis");
  }

  btn.addEventListener("click", () => (active ? stop() : start()));

  ["wheel", "touchstart"].forEach(evt => {
    window.addEventListener(evt, () => { if (active) stop(); }, { passive: true });
  });
}
