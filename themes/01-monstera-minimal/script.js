// =============================================================================
// VINVITE — THEME 01: MONSTERA MINIMAL — render logic
// =============================================================================

function formatDateID(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

window.renderInvitation = function (data) {
  document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";

  const shortNames = `${data.groom_nickname || data.groom_name} & ${data.bride_nickname || data.bride_name}`;
  document.querySelector(".cover-names").innerHTML = `${data.groom_nickname || data.groom_name} <span>&amp;</span> ${data.bride_nickname || data.bride_name}`;
  document.getElementById("hero-names").innerHTML = `${data.groom_nickname || data.groom_name} &amp; ${data.bride_nickname || data.bride_name}`;
  document.getElementById("hero-date").textContent = formatDateID(data.resepsi_date || data.akad_date);
  document.title = `Undangan Pernikahan ${shortNames}`;

  document.getElementById("groom-name").textContent = data.groom_name;
  document.getElementById("groom-parents").textContent = data.groom_parents || "";
  document.getElementById("bride-name").textContent = data.bride_name;
  document.getElementById("bride-parents").textContent = data.bride_parents || "";

  // couple photos
  const groomImg = document.querySelector("#groom-photo");
  const brideImg = document.querySelector("#bride-photo");
  if (groomImg && data.groom_photo_url) groomImg.src = data.groom_photo_url;
  if (brideImg && data.bride_photo_url) brideImg.src = data.bride_photo_url;

  document.getElementById("akad-date").textContent = formatDateID(data.akad_date);
  document.getElementById("akad-time").textContent = data.akad_time || "";
  document.getElementById("akad-venue").textContent = data.akad_venue_name || "";
  document.getElementById("akad-address").textContent = data.akad_venue_address || "";
  document.getElementById("akad-maps").href = data.akad_maps_url || "#";

  document.getElementById("resepsi-date").textContent = formatDateID(data.resepsi_date);
  document.getElementById("resepsi-time").textContent = data.resepsi_time || "";
  document.getElementById("resepsi-venue").textContent = data.resepsi_venue_name || "";
  document.getElementById("resepsi-address").textContent = data.resepsi_venue_address || "";
  document.getElementById("resepsi-maps").href = data.resepsi_maps_url || "#";

  document.querySelector(".closing-names").innerHTML = `${data.groom_nickname || data.groom_name} &amp; ${data.bride_nickname || data.bride_name}`;

  // love story
  const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
  document.getElementById("story-timeline").innerHTML = story.map(s => `
    <div class="story-item">
      <p class="story-date">${s.date || ""}</p>
      <h3 class="story-title">${s.title || ""}</h3>
      <p class="story-text">${s.text || ""}</p>
    </div>
  `).join("");

  // gallery
  const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
  document.getElementById("gallery-grid").innerHTML = gallery.map(url => `
    <div class="gallery-item"><img src="${url}" loading="lazy" alt="" /></div>
  `).join("");

  // gift accounts
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

  // music
  if (data.music_url) document.getElementById("bg-music").src = data.music_url;

  // engine bindings
  window.initCoverGate("#cover-screen", "#open-invitation-btn");
  window.initMusicPlayer("#bg-music", "#music-toggle");
  window.initGalleryLightbox(".gallery-item img");
  window.startCountdown(
    `${data.resepsi_date || data.akad_date}T${(data.resepsi_time || data.akad_time || "00:00").split(" ")[0]}:00`,
    { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" }
  );
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

  // scroll-reveal for leaf dividers
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("is-visible"); });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-leaf]").forEach(el => io.observe(el));

  // scroll fx: reveal, parallax, particles, progress bar
  window.initScrollReveal();
  window.initParallax();
  window.initFloatingParticles("#particle-field", { symbol: "🍃", count: 9, className: "particle-leaf" });
  window.initScrollProgress("#scroll-progress");

  // maps embed + social proof
  window.injectMapsEmbed("#akad-map", data.akad_venue_address);
  window.injectMapsEmbed("#resepsi-map", data.resepsi_venue_address);
  window.initSocialProof("#social-proof", data._invitationId);
};
