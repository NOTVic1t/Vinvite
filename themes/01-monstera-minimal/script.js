// =============================================================================
// VINVITE — THEME 01: MONSTERA MINIMAL v2 — render logic
// =============================================================================

window.renderInvitation = function (data) {
  // --- COVER ---
  document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";

  const groom = data.groom_nickname || data.groom_name;
  const bride  = data.bride_nickname  || data.bride_name;
  const shortNames = `${groom} & ${bride}`;

  document.querySelector(".cover-names").innerHTML = `${groom} <span>&amp;</span> ${bride}`;
  document.getElementById("hero-names").innerHTML  = `${groom} &amp; ${bride}`;
  document.querySelector(".closing-names").innerHTML = `${groom} &amp; ${bride}`;
  document.title = `Undangan Pernikahan ${shortNames}`;

  // --- COVER BG ---
  const coverBg = document.getElementById("cover-bg");
  const bgUrl = data.cover_image_url || (coverBg && coverBg.dataset.defaultBg) || "";
  if (coverBg && bgUrl) coverBg.style.backgroundImage = `url('${bgUrl}')`;

  // --- HERO DATE (first event) ---
  const events = Array.isArray(data.events) ? data.events : JSON.parse(data.events || "[]");
  const firstEvent = events[0];
  const heroDateStr = firstEvent ? firstEvent.date : (data.resepsi_date || data.akad_date);
  if (heroDateStr) {
    const d = new Date(heroDateStr);
    if (!isNaN(d)) {
      document.getElementById("hero-date").textContent =
        d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
    }
  }

  // --- COUPLE ---
  document.getElementById("groom-name").textContent    = data.groom_name;
  document.getElementById("groom-parents").textContent = data.groom_parents || "";
  document.getElementById("bride-name").textContent    = data.bride_name;
  document.getElementById("bride-parents").textContent = data.bride_parents || "";

  const groomImg = document.getElementById("groom-photo");
  const brideImg = document.getElementById("bride-photo");
  if (groomImg && data.groom_photo_url) groomImg.src = data.groom_photo_url;
  if (brideImg && data.bride_photo_url) brideImg.src = data.bride_photo_url;

  // --- QUOTE ---
  const qt = document.getElementById("quote-text");
  const qs = document.getElementById("quote-source");
  if (qt && data.quote_text) qt.innerHTML = `&ldquo;${data.quote_text}&rdquo;`;
  if (qs && data.quote_source) qs.textContent = data.quote_source;

  // --- EVENTS ---
  window.renderEvents(data, "#events-container");

  // --- COUNTDOWN ---
  if (firstEvent && firstEvent.date) {
    window.startCountdown(`${firstEvent.date}T${firstEvent.time_start || "00:00"}:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  } else if (data.resepsi_date || data.akad_date) {
    window.startCountdown(`${data.resepsi_date || data.akad_date}T00:00:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  }

  // --- RUNDOWN ---
  window.renderRundown(data, "#rundown-container");

  // --- STORY ---
  const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
  document.getElementById("story-timeline").innerHTML = story.map(s => `
    <div class="story-item">
      <p class="story-date">${s.date || ""}</p>
      <h3 class="story-title">${s.title || ""}</h3>
      <p class="story-text">${s.text || ""}</p>
    </div>`).join("");

  // --- GALLERY ---
  const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
  const galleryDirs = ["dir-tl", "dir-t", "dir-tr", "dir-l", "dir-c", "dir-r"];
  document.getElementById("gallery-grid").innerHTML = gallery.map((url, i) =>
    `<div class="gallery-item ${galleryDirs[i % galleryDirs.length]}"><img src="${url}" loading="lazy" alt="" /></div>`).join("");

  // --- GIFT ---
  const accounts = Array.isArray(data.gift_accounts) ? data.gift_accounts : JSON.parse(data.gift_accounts || "[]");
  document.getElementById("gift-accounts").innerHTML = accounts.map(a => `
    <div class="gift-account">
      <div class="gift-account-info">
        <p>${a.type || ""}${a.bank_name ? " · " + a.bank_name : ""}</p>
        <strong>${a.account_number || ""}</strong>
        <p>a.n. ${a.account_holder || ""}</p>
      </div>
      <button class="btn-copy" data-copy="${a.account_number || ""}">Salin</button>
    </div>`).join("");
  document.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Tersalin!";
      setTimeout(() => (btn.textContent = "Salin"), 1500);
    });
  });

  // --- DRESS CODE ---
  window.renderDressCode(data, "#dress-code-container");

  // --- HASHTAG ---
  window.renderHashtag(data, "#hashtag-container");

  // --- MUSIC ---
  if (data.music_url) document.getElementById("bg-music").src = data.music_url;

  // --- ENGINE BINDINGS ---
  window.initCoverGate("#cover-screen", "#open-invitation-btn");
  window.initMusicPlayer("#bg-music", "#music-toggle");
  window.initGalleryLightbox(".gallery-item img");
  window.bindRsvpForm("#rsvp-form", data._invitationId);
  window.onRsvpSuccess = () => { document.getElementById("rsvp-success").hidden = false; };
  window.initGuestbook({
    formSelector: "#guestbook-form",
    listSelector: "#guestbook-list",
    invitationId: data._invitationId,
    itemTemplate: e => `
      <div class="wish-item">
        <p class="wish-name">${e.name}</p>
        <p class="wish-message">${e.message}</p>
      </div>`
  });

  // --- REPEATABLE SCROLL REVEAL ---
  // Unlike the engine's default window.initScrollReveal() (one-way, plays
  // once), this toggles .is-visible on BOTH enter and exit, so scrolling
  // up past a section and back down replays its entrance animation —
  // covers [data-leaf] dividers, [data-reveal] blocks, the gallery grid,
  // and each individual rundown-item (for its left/right converge-in).
  initRepeatableReveal();

  // --- SCROLL FX ---
  window.initParallax();
  window.initFloatingParticles("#particle-field", { symbol: "🍃", count: 9, className: "particle-leaf" });
  window.initScrollProgress("#scroll-progress");
  window.initSocialProof("#social-proof", data._invitationId);

  // --- SECTION CONTROL (hide sections + update labels) ---
  window.applySectionControl(data);

  // --- BOTTOM NAV ---
  initBottomNav();

  // --- TIMELINE PROGRESS DOT (rundown) ---
  initTimelineDot();
};

// Repeatable reveal: adds .is-visible on intersect, removes it on exit, so
// every animation (dividers, reveal blocks, gallery, rundown items) replays
// each time the user scrolls back to it.
function initRepeatableReveal() {
  const targets = document.querySelectorAll("[data-leaf], [data-reveal], .gallery-grid, .rundown-item");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      en.target.classList.toggle("is-visible", en.isIntersecting);
    });
  }, { threshold: 0.25 });
  targets.forEach(el => io.observe(el));
}

// Scroll-linked progress dot: moves continuously along the rundown's
// vertical timeline in proportion to how far the section has been
// scrolled through — not just an on/off reveal.
function initTimelineDot() {
  const dot = document.getElementById("timeline-progress-dot");
  const wrap = document.querySelector(".rundown-wrap");
  if (!dot || !wrap) return;

  let ticking = false;
  function update() {
    ticking = false;
    const rect = wrap.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // Progress: 0 when wrap's top just enters viewport bottom, 1 when
    // wrap's bottom reaches viewport top — i.e. how far scrolled through.
    const total = rect.height + viewportH * 0.6;
    const scrolled = viewportH * 0.85 - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    const active = rect.bottom > 0 && rect.top < viewportH;
    dot.classList.toggle("is-active", active);
    if (active) {
      dot.style.transform = `translateY(${progress * Math.max(0, rect.height - 9)}px)`;
    }
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// Bottom nav — scroll to section + active state + hide if section is off
function initBottomNav() {
  const buttons = document.querySelectorAll(".bnav-item");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Highlight active section on scroll
  const sections = [...document.querySelectorAll("[data-section]")]
    .filter(el => el.style.display !== "none");

  const sectionIds = buttons.map(b => b.dataset.target);

  const ioNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        buttons.forEach(b => b.classList.toggle("active", b.dataset.target === id));
      }
    });
  }, { threshold: 0.4 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.style.display !== "none") ioNav.observe(el);
  });
}
