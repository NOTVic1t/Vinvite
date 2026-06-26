// =============================================================================
// VINVITE — THEME 04: MELATI JAWA — render logic
// =============================================================================

window.renderInvitation = function (data) {
  document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";

  const shortNames = `${data.groom_nickname || data.groom_name} & ${data.bride_nickname || data.bride_name}`;
  document.querySelector(".cover-names").innerHTML = `${data.groom_nickname || data.groom_name} <span>&amp;</span> ${data.bride_nickname || data.bride_name}`;
  document.getElementById("hero-names").innerHTML = `${data.groom_nickname || data.groom_name} &amp; ${data.bride_nickname || data.bride_name}`;
  document.title = `Undangan Pernikahan ${shortNames}`;

  const events = Array.isArray(data.events) ? data.events : JSON.parse(data.events || "[]");
  const firstEvent = events[0];
  const heroDateStr = firstEvent ? firstEvent.date : (data.resepsi_date || data.akad_date);
  if (heroDateStr) {
    const d = new Date(heroDateStr);
    if (!isNaN(d)) document.getElementById("hero-date").textContent =
      d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  document.getElementById("groom-name").textContent = data.groom_name;
  document.getElementById("groom-parents").textContent = data.groom_parents || "";
  document.getElementById("bride-name").textContent = data.bride_name;
  document.getElementById("bride-parents").textContent = data.bride_parents || "";
  document.querySelector(".closing-names").innerHTML = `${data.groom_nickname || data.groom_name} &amp; ${data.bride_nickname || data.bride_name}`;

  const groomImg = document.getElementById("groom-photo");
  const brideImg = document.getElementById("bride-photo");
  if (groomImg && data.groom_photo_url) groomImg.src = data.groom_photo_url;
  if (brideImg && data.bride_photo_url) brideImg.src = data.bride_photo_url;

  // cover background photo (optional) — dark overlay keeps the gunungan
  // silhouette legible on top, same pattern as the other built themes.
  if (data.cover_image_url) {
    const cover = document.getElementById("cover-screen");
    if (cover) {
      cover.style.backgroundImage = `linear-gradient(rgba(43,31,22,.86), rgba(43,31,22,.93)), url('${data.cover_image_url}')`;
      cover.style.backgroundSize = "cover";
      cover.style.backgroundPosition = "center";
    }
  }

  const qt = document.getElementById("quote-text");
  const qs = document.getElementById("quote-source");
  if (qt && data.quote_text) qt.innerHTML = `&ldquo;${data.quote_text}&rdquo;`;
  if (qs && data.quote_source) qs.textContent = data.quote_source;

  window.renderEvents(data, "#events-container");
  window.renderRundown(data, "#rundown-container");

  if (firstEvent && firstEvent.date) {
    window.startCountdown(`${firstEvent.date}T${firstEvent.time_start || "00:00"}:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  } else if (data.resepsi_date || data.akad_date) {
    window.startCountdown(`${data.resepsi_date || data.akad_date}T00:00:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  }

  const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
  document.getElementById("story-timeline").innerHTML = story.map(s => `
    <div class="story-item">
      <p class="story-date">${s.date || ""}</p>
      <h3 class="story-title">${s.title || ""}</h3>
      <p class="story-text">${s.text || ""}</p>
    </div>
  `).join("");

  const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
  document.getElementById("gallery-grid").innerHTML = gallery.map(url => `
    <div class="gallery-item"><img src="${url}" loading="lazy" alt="" /></div>
  `).join("");

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

  if (data.music_url) document.getElementById("bg-music").src = data.music_url;

  window.initCoverGate("#cover-screen", "#open-invitation-btn");
  window.initMusicPlayer("#bg-music", "#music-toggle");
  window.initGalleryLightbox(".gallery-item img");
  // RSVP: kontrak data tetap 3 field (guest_name, attendance, guest_count).
  window.bindRsvpForm("#rsvp-form", data._invitationId);
  window.onRsvpSuccess = () => { document.getElementById("rsvp-success").hidden = false; };
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

  window.initScrollReveal();
  window.initParallax();
  window.initScrollProgress("#scroll-progress");
  window.initSocialProof("#social-proof", data._invitationId);
  window.applySectionControl(data);

  // Optional per-section background photos (admin-controlled, independent
  // of section content visibility).
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
    rsvp: "#section-rsvp",
    guestbook: '[data-section="guestbook"]',
    footer: ".footer",
  });

  initQuickNav();
  initAutoScroll();
};

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
      // "Beranda" points at #cover-screen, which is fixed-position and
      // hidden once the invitation is opened — scrollIntoView on it does
      // nothing. Scroll to the literal top of the page instead.
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
