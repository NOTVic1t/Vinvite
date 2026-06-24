// =============================================================================
// VINVITE — THEME 03: SENJA SINEMATIK — render logic
// =============================================================================

window.renderInvitation = function (data) {
  document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";

  const shortNames = `${data.groom_nickname || data.groom_name} & ${data.bride_nickname || data.bride_name}`;
  document.querySelector(".cover-names").innerHTML = `${data.groom_nickname || data.groom_name} <span>&amp;</span> ${data.bride_nickname || data.bride_name}`;
  document.getElementById("hero-names").innerHTML = `${data.groom_nickname || data.groom_name} &amp; ${data.bride_nickname || data.bride_name}`;
  document.title = `Undangan Pernikahan ${shortNames}`;

  // hero date — use first event
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

  // couple photos
  const groomImg = document.getElementById("groom-photo");
  const brideImg = document.getElementById("bride-photo");
  if (groomImg && data.groom_photo_url) groomImg.src = data.groom_photo_url;
  if (brideImg && data.bride_photo_url) brideImg.src = data.bride_photo_url;

  // cover + hero background
  const coverBg = document.getElementById("cover-bg");
  const bgUrl = data.cover_image_url || (coverBg && coverBg.dataset.defaultBg) || "";
  if (coverBg && bgUrl) coverBg.style.backgroundImage = `url('${bgUrl}')`;
  const heroBg = document.querySelector(".hero-bg-layer");
  if (heroBg && bgUrl) {
    heroBg.style.cssText = `background:linear-gradient(180deg,var(--indigo),var(--black)),url('${bgUrl}') center/cover;background-blend-mode:multiply;`;
  }

  // quote
  const qt = document.getElementById("quote-text");
  const qs = document.getElementById("quote-source");
  if (qt && data.quote_text) qt.innerHTML = `&ldquo;${data.quote_text}&rdquo;`;
  if (qs && data.quote_source) qs.textContent = data.quote_source;

  // events repeater
  window.renderEvents(data, "#events-container");

  // countdown from first event
  if (firstEvent && firstEvent.date) {
    window.startCountdown(`${firstEvent.date}T${firstEvent.time_start || "00:00"}:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  } else if (data.resepsi_date || data.akad_date) {
    window.startCountdown(`${data.resepsi_date || data.akad_date}T00:00:00`,
      { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
  }

  // love story
  const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
  document.getElementById("story-timeline").innerHTML = story.map((s, i) => `
    <div class="story-item">
      <p class="story-date">${s.date || ""} — TC ${String(i + 1).padStart(2, "0")}</p>
      <h3 class="story-title">${s.title || ""}</h3>
      <p class="story-text">${s.text || ""}</p>
    </div>
  `).join("");

  // gallery
  const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
  document.getElementById("gallery-grid").innerHTML = gallery.map(url => `
    <div class="gallery-item"><img src="${url}" loading="lazy" alt="" /></div>
  `).join("");

  // gift
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
  window.initFloatingParticles("#particle-field", { symbol: "●", count: 12, className: "particle-ember" });
  window.initScrollProgress("#scroll-progress");
  window.initSocialProof("#social-proof", data._invitationId);

  // section control last
  window.applySectionControl(data);
};
