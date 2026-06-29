// =============================================================================
// VINVITE — THEME 10: MIDNIGHT GALA — render logic
// =============================================================================

window.renderInvitation = function (data) {
  // ---------------------------------------------------------------------
  // 1) UI / ANIMATION WIRING — always runs, regardless of data shape.
  // ---------------------------------------------------------------------
  window.initCoverGate("#cover-screen", "#open-invitation-btn");
  initFlareBurstTrigger();
  buildMarquees();
  spawnBubbles();

  const ruleIO = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("is-visible"); });
  }, { threshold: 0.35 });
  document.querySelectorAll(".gold-rule").forEach(el => ruleIO.observe(el));

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
  } catch (e) { console.error("[Vinvite] names render failed:", e); }

  try {
    // Cover background photo is admin-controlled and togglable — when set,
    // it sits behind the same radial navy gradient (slightly darkened) so
    // the gold text and marquee bulbs stay legible on top of any photo.
    if (data.cover_image_url) {
      const cover = document.getElementById("cover-screen");
      if (cover) {
        cover.style.backgroundImage = `radial-gradient(ellipse at 50% 30%, rgba(27,42,74,.55) 0%, rgba(15,26,48,.82) 75%), url('${data.cover_image_url}')`;
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
// MARQUEE BULBS — fills each .marquee-row with a chasing row of small
// light bulbs (theater-marquee style), staggered so they appear to chase.
// -----------------------------------------------------------------------------
function buildMarquees() {
  document.querySelectorAll(".marquee-row").forEach(row => {
    const count = 14;
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `<span class="bulb" style="animation-delay:${(i * 0.1).toFixed(2)}s"></span>`;
    }
    row.innerHTML = html;
  });
}

// -----------------------------------------------------------------------------
// CHAMPAGNE BUBBLES — a handful of small bubbles continuously rise from the
// bottom of the viewport for the whole life of the page (independent of
// scroll position, fixed-position field).
// -----------------------------------------------------------------------------
function spawnBubbles() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const field = document.createElement("div");
  field.className = "bubble-field";
  document.body.appendChild(field);

  function spawnOne() {
    const b = document.createElement("span");
    b.className = "bubble";
    const size = 4 + Math.random() * 7;
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.setProperty("--drift", `${(Math.random() * 40 - 20).toFixed(0)}px`);
    b.style.animationDuration = `${9 + Math.random() * 7}s`;
    field.appendChild(b);
    setTimeout(() => b.remove(), 17000);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawnOne, i * 900);
  setInterval(spawnOne, 1400);
}

// -----------------------------------------------------------------------------
// LIGHT-FLARE BURST — a handful of gold sparks burst outward from the
// "Buka Undangan" button the moment it's clicked, alongside the engine's
// normal cover fade (both listeners fire independently on the same click).
// -----------------------------------------------------------------------------
function initFlareBurstTrigger() {
  const btn = document.getElementById("open-invitation-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const container = document.createElement("div");
    container.className = "flare-burst-container";
    document.body.appendChild(container);

    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 50 + Math.random() * 50;
      const flare = document.createElement("span");
      flare.className = "flare";
      flare.style.left = `${cx}px`;
      flare.style.top = `${cy}px`;
      flare.style.setProperty("--fx", `${(Math.cos(angle) * dist).toFixed(0)}px`);
      flare.style.setProperty("--fy", `${(Math.sin(angle) * dist).toFixed(0)}px`);
      container.appendChild(flare);
    }

    setTimeout(() => container.remove(), 900);
  }, { once: true });
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
