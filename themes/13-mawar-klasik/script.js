// =============================================================================
// VINVITE — THEME 13: MAWAR KLASIK — render logic
// =============================================================================

window.renderInvitation = function (data) {
  // 1) UI / ANIMATION — always runs first
  initLoadingScreen();
  window.initCoverGate("#cover-screen", "#open-invitation-btn");
  spawnPetals();
  spawnDewDrops();
  buildWreaths();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("is-visible"); });
  }, { threshold: 0.3 });
  document.querySelectorAll(".rose-divider").forEach(el => io.observe(el));

  window.initScrollReveal();
  window.initParallax();
  window.initScrollProgress("#scroll-progress");
  initQuickNav();
  initAutoScroll();

  // 2) CONTENT — each block guarded
  const groomShort = data.groom_nickname || data.groom_name || "";
  const brideShort = data.bride_nickname || data.bride_name || "";

  try {
    document.getElementById("cover-guest-name").textContent = data.guest_name || "Bapak/Ibu Tamu Undangan";
    document.getElementById("cover-names-el").innerHTML = `${groomShort} <span>&amp;</span> ${brideShort}`;
    document.getElementById("hero-names").innerHTML = `${groomShort} &amp; ${brideShort}`;
    document.title = `Undangan Pernikahan ${groomShort} & ${brideShort}`;
    const li = document.getElementById("loading-initials");
    if (li) li.innerHTML = `${groomShort.charAt(0)}&nbsp;&amp;&nbsp;${brideShort.charAt(0)}`;
    document.querySelector(".closing-names").innerHTML = `${groomShort} &amp; ${brideShort}`;
  } catch (e) { console.error("[Vinvite] names:", e); }

  try {
    if (data.cover_image_url) {
      const cover = document.getElementById("cover-screen");
      if (cover) {
        cover.style.backgroundImage = `linear-gradient(rgba(251,245,239,.55), rgba(233,201,201,.65)), url('${data.cover_image_url}')`;
        cover.style.backgroundSize = "cover";
        cover.style.backgroundPosition = "center";
      }
    }
  } catch (e) { console.error("[Vinvite] cover photo:", e); }

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
  } catch (e) { console.error("[Vinvite] events:", e); }

  try {
    document.getElementById("groom-name").textContent = data.groom_name || "";
    document.getElementById("groom-parents").textContent = data.groom_parents || "";
    document.getElementById("bride-name").textContent = data.bride_name || "";
    document.getElementById("bride-parents").textContent = data.bride_parents || "";
    const gi = document.getElementById("groom-photo");
    const bi = document.getElementById("bride-photo");
    if (gi && data.groom_photo_url) gi.src = data.groom_photo_url;
    if (bi && data.bride_photo_url) bi.src = data.bride_photo_url;
  } catch (e) { console.error("[Vinvite] couple:", e); }

  try {
    const qt = document.getElementById("quote-text");
    const qs = document.getElementById("quote-source");
    if (qt && data.quote_text) qt.innerHTML = `&ldquo;${data.quote_text}&rdquo;`;
    if (qs && data.quote_source) qs.textContent = data.quote_source;
  } catch (e) { console.error("[Vinvite] quote:", e); }

  try { window.renderRundown(data, "#rundown-container"); } catch (e) { console.error("[Vinvite] rundown:", e); }
  try { window.renderDressCode(data, "#dress-code-container"); } catch (e) { console.error("[Vinvite] dresscode:", e); }
  try { window.renderHashtag(data, "#hashtag-container"); } catch (e) { console.error("[Vinvite] hashtag:", e); }

  try {
    if (firstEvent?.date) {
      window.startCountdown(`${firstEvent.date}T${firstEvent.time_start || "00:00"}:00`,
        { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
    } else if (data.resepsi_date || data.akad_date) {
      window.startCountdown(`${data.resepsi_date || data.akad_date}T00:00:00`,
        { d: "#cd-d", h: "#cd-h", m: "#cd-m", s: "#cd-s" });
    }
  } catch (e) { console.error("[Vinvite] countdown:", e); }

  try {
    const story = Array.isArray(data.love_story) ? data.love_story : JSON.parse(data.love_story || "[]");
    document.getElementById("story-timeline").innerHTML = story.map(s => `
      <div class="story-item">
        <p class="story-date">${s.date || ""}</p>
        <h3 class="story-title">${s.title || ""}</h3>
        <p class="story-text">${s.text || ""}</p>
      </div>`).join("");
  } catch (e) { console.error("[Vinvite] story:", e); }

  try {
    const gallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]");
    document.getElementById("gallery-grid").innerHTML = gallery.map(url =>
      `<div class="gallery-item"><img src="${url}" loading="lazy" alt="" /></div>`).join("");
  } catch (e) { console.error("[Vinvite] gallery:", e); }

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
      </div>`).join("");
    document.querySelectorAll(".btn-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Tersalin!";
        setTimeout(() => (btn.textContent = "Salin"), 1500);
      });
    });
  } catch (e) { console.error("[Vinvite] gift:", e); }

  try {
    if (data.music_url) document.getElementById("bg-music").src = data.music_url;
    window.initMusicPlayer("#bg-music", "#music-toggle");
  } catch (e) { console.error("[Vinvite] music:", e); }

  try { window.initGalleryLightbox(".gallery-item img"); } catch (e) {}

  try {
    window.bindRsvpForm("#rsvp-form", data._invitationId);
    window.onRsvpSuccess = () => { document.getElementById("rsvp-success").hidden = false; };
  } catch (e) { console.error("[Vinvite] rsvp:", e); }

  try {
    window.initGuestbook({
      formSelector: "#guestbook-form", listSelector: "#guestbook-list",
      invitationId: data._invitationId,
      itemTemplate: e => `<div class="wish-item"><p class="wish-name">${e.name}</p><p class="wish-message">${e.message}</p></div>`
    });
  } catch (e) { console.error("[Vinvite] guestbook:", e); }

  try { window.initSocialProof("#social-proof", data._invitationId); } catch (e) {}
  try { window.applySectionControl(data); } catch (e) {}

  try {
    window.applySectionBackgrounds(data, {
      hero: "#section-hero", quote: '[data-section="quote"]', couple: "#section-couple",
      countdown: "#section-countdown", events: "#section-acara",
      rundown: '[data-section="rundown"]', story: '[data-section="story"]',
      gallery: "#section-galeri", gift: '[data-section="gift"]',
      dress_code: '[data-section="dress_code"]', hashtag: '[data-section="hashtag"]',
      rsvp: "#section-rsvp", guestbook: '[data-section="guestbook"]', footer: ".footer",
    });
  } catch (e) {}
};

// Rose wreath rings: 18 wreathLeaf instances rotated around the photo circle
function buildWreaths() {
  const count = 18;
  const cx = 100, cy = 100, r = 82;
  ["wreath-groom", "wreath-bride"].forEach(id => {
    const svg = document.getElementById(id);
    if (!svg) return;
    let html = "";
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360;
      html += `<use href="#wreathLeaf" transform="rotate(${angle} ${cx} ${cy}) translate(${cx - 8} ${cy - r - 14}) scale(0.9)" class="wreath-fill" />`;
    }
    svg.innerHTML = html;
  });
  // Style the dynamically created use elements
  document.querySelectorAll(".wreath-ring use").forEach(el => {
    el.style.fill = "var(--blush)";
    el.style.stroke = "var(--deep-rose)";
    el.style.strokeWidth = "0.6";
    el.style.opacity = "0.85";
  });
}

// Spawn dew drops on the cover rose
function spawnDewDrops() {
  const field = document.getElementById("cover-dew");
  if (!field) return;
  const positions = [
    { top: "28%", left: "38%", s: 6 }, { top: "42%", left: "62%", s: 5 },
    { top: "55%", left: "44%", s: 7 }, { top: "35%", left: "54%", s: 4 },
    { top: "62%", left: "58%", s: 5 }, { top: "48%", left: "36%", s: 6 },
  ];
  field.innerHTML = positions.map((p, i) =>
    `<span class="dew" style="width:${p.s}px;height:${p.s}px;top:${p.top};left:${p.left};animation-delay:${i * 0.4}s;"></span>`
  ).join("");
}

// Falling rose petals (continuous, page-wide)
function spawnPetals() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const field = document.createElement("div");
  field.className = "petal-field";
  document.body.appendChild(field);
  function one() {
    const p = document.createElement("div");
    p.className = "falling-petal";
    const s = 10 + Math.random() * 10;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${9+Math.random()*7}s;`;
    p.style.setProperty("--drift", `${(Math.random()*50-25).toFixed(0)}px`);
    p.innerHTML = '<svg viewBox="0 0 28 36"><use href="#rosePetal" /></svg>';
    field.appendChild(p);
    setTimeout(() => p.remove(), 17000);
  }
  for (let i = 0; i < 4; i++) setTimeout(one, i * 1200);
  setInterval(one, 1900);
}

// Loading screen — auto-hide, 2.5s max
function initLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;
  let done = false;
  const hide = () => {
    if (done) return; done = true;
    screen.classList.add("is-hidden");
    setTimeout(() => screen.remove(), 700);
  };
  document.readyState === "complete" ? setTimeout(hide, 500)
    : window.addEventListener("load", () => setTimeout(hide, 400), { once: true });
  setTimeout(hide, 2500);
}

// Quick nav
function initQuickNav() {
  const links = [...document.querySelectorAll(".quicknav-link")];
  if (!links.length) return;
  const targets = links.map(a => ({ link: a, el: document.querySelector(a.getAttribute("href")) })).filter(t => t.el);
  if (!targets.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const m = targets.find(t => t.el === en.target);
        if (m) links.forEach(a => a.classList.toggle("is-active", a === m.link));
      }
    });
  }, { rootMargin: "-42% 0px -42% 0px" });
  targets.forEach(t => io.observe(t.el));
  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    if (a.getAttribute("href") === "#cover-screen") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
}

// Auto-scroll
function initAutoScroll() {
  const btn = document.getElementById("autoscroll-toggle");
  if (!btn) return;
  let active = false, raf = null;
  const step = () => {
    window.scrollBy(0, 1.1);
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) { stop(); return; }
    raf = requestAnimationFrame(step);
  };
  const start = () => { active = true; btn.classList.add("is-active"); btn.setAttribute("aria-label","Hentikan scroll otomatis"); step(); };
  const stop = () => { active = false; if (raf) cancelAnimationFrame(raf); btn.classList.remove("is-active"); btn.setAttribute("aria-label","Mulai scroll otomatis"); };
  btn.addEventListener("click", () => active ? stop() : start());
  ["wheel","touchstart"].forEach(e => window.addEventListener(e, () => { if (active) stop(); }, { passive: true }));
}
