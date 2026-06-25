// =============================================================================
// VINVITE ENGINE — SECTION CONTROL
// Applies hidden_sections and section_labels from invitation data to the DOM.
// =============================================================================

const RUNDOWN_ICONS = {
  ceremony: "⛪",
  rings:    "💍",
  dinner:   "🍽",
  photo:    "📸",
  music:    "🎵",
  flowers:  "💐",
  party:    "🎉",
  custom:   "✦",
};

window.VINVITE_DEFAULT_LABELS = {
  quote:      "Kutipan",
  countdown:  "Menuju Hari Bahagia",
  events:     "Acara",
  rundown:    "Susunan Acara",
  story:      "Kisah Kami",
  gallery:    "Galeri",
  gift:       "Tanda Kasih",
  dress_code: "Dress Code",
  hashtag:    "Tagar & Instagram",
  rsvp:       "Konfirmasi Kehadiran",
  guestbook:  "Ucapan & Doa",
};

window.applySectionControl = function (data) {
  const hidden = Array.isArray(data.hidden_sections)
    ? data.hidden_sections
    : (data.hidden_sections ? JSON.parse(data.hidden_sections) : []);

  const labels = data.section_labels
    ? (typeof data.section_labels === "object" ? data.section_labels : JSON.parse(data.section_labels))
    : {};

  document.querySelectorAll("[data-section]").forEach(el => {
    if (hidden.includes(el.dataset.section)) el.style.display = "none";
  });

  document.querySelectorAll("[data-section-label]").forEach(el => {
    const key = el.dataset.sectionLabel;
    if (labels[key]) el.textContent = labels[key];
  });

  // Sync bottom nav visibility
  document.querySelectorAll("[data-nav-section]").forEach(btn => {
    if (hidden.includes(btn.dataset.navSection)) {
      btn.style.display = "none";
    }
  });
};

// Renders events repeater
window.renderEvents = function (data, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const events = Array.isArray(data.events)
    ? data.events
    : (data.events ? JSON.parse(data.events) : []);
  const list = events.length > 0 ? events : _legacyEvents(data);
  if (!list.length) { container.innerHTML = ""; return; }

  container.innerHTML = list.map((ev, i) => {
    const dateStr = ev.date ? _formatDateID(ev.date) : "";
    const timeStr = [ev.time_start, ev.time_end].filter(Boolean).join(" – ");
    return `
      <div class="event-card" data-event-index="${i}">
        <h3 class="event-name">${ev.name || "Acara"}</h3>
        <div class="event-divider"></div>
        ${dateStr ? `<p class="event-date">${dateStr}</p>` : ""}
        ${timeStr ? `<p class="event-time">${timeStr} WIB</p>` : ""}
        ${ev.venue_name ? `<p class="event-venue">${ev.venue_name}</p>` : ""}
        ${ev.venue_address ? `<p class="event-address">${ev.venue_address}</p>` : ""}
        ${ev.maps_url ? `<a href="${ev.maps_url}" target="_blank" rel="noopener" class="btn-maps">Buka di Google Maps</a>` : ""}
        ${ev.venue_address ? `<div class="map-embed" id="map-embed-${i}" hidden></div>` : ""}
      </div>`;
  }).join("");

  list.forEach((ev, i) => {
    if (ev.venue_address && typeof window.injectMapsEmbed === "function") {
      window.injectMapsEmbed(`#map-embed-${i}`, ev.venue_address);
    }
  });
};

// Renders susunan acara (rundown) — rich visual with icons
window.renderRundown = function (data, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const items = Array.isArray(data.rundown)
    ? data.rundown
    : (data.rundown ? JSON.parse(data.rundown) : []);
  if (!items.length) { container.innerHTML = ""; return; }

  container.innerHTML = items.map((r, i) => {
    const icon = RUNDOWN_ICONS[r.icon] || RUNDOWN_ICONS.custom;
    return `
      <div class="rundown-item" data-rundown-index="${i}">
        <div class="rundown-left">
          <span class="rundown-time">${r.time || ""}</span>
        </div>
        <div class="rundown-center">
          <div class="rundown-icon">${icon}</div>
          <div class="rundown-line ${i === items.length - 1 ? 'last' : ''}"></div>
        </div>
        <div class="rundown-right">
          <h3 class="rundown-title">${r.title || ""}</h3>
          ${r.desc ? `<p class="rundown-desc">${r.desc}</p>` : ""}
        </div>
      </div>`;
  }).join("");
};

// Renders dress code section
window.renderDressCode = function (data, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const label = data.dress_code_label || "";
  const colors = Array.isArray(data.dress_code_colors)
    ? data.dress_code_colors
    : JSON.parse(data.dress_code_colors || "[]");

  container.innerHTML = `
    ${label ? `<p class="dress-code-label">${label}</p>` : ""}
    ${colors.length ? `
      <div class="dress-code-colors">
        ${colors.map(c => `
          <div class="dress-color-item">
            <div class="dress-color-swatch" style="background:${c.hex}"></div>
            <span class="dress-color-name">${c.name || ""}</span>
          </div>`).join("")}
      </div>` : ""}
  `;
};

// Renders hashtag/instagram section
window.renderHashtag = function (data, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const hashtag = data.hashtag || "";
  const instagram = data.instagram || "";
  if (!hashtag && !instagram) { container.innerHTML = ""; return; }

  container.innerHTML = `
    ${hashtag ? `
      <div class="hashtag-item">
        <span class="hashtag-icon">🏷</span>
        <span class="hashtag-text">${hashtag}</span>
        <button class="btn-copy-hashtag" data-copy="${hashtag}">Salin</button>
      </div>` : ""}
    ${instagram ? `
      <div class="hashtag-item">
        <span class="hashtag-icon">📷</span>
        <span class="hashtag-text">${instagram}</span>
      </div>` : ""}
  `;

  container.querySelectorAll(".btn-copy-hashtag").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Tersalin!";
      setTimeout(() => (btn.textContent = "Salin"), 1500);
    });
  });
};

function _formatDateID(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function _legacyEvents(data) {
  const out = [];
  if (data.akad_date) out.push({
    name: "Akad Nikah", date: data.akad_date,
    time_start: (data.akad_time || "").split(" ")[0],
    time_end: (data.akad_time || "").split("–")[1]?.trim() || null,
    venue_name: data.akad_venue_name, venue_address: data.akad_venue_address,
    maps_url: data.akad_maps_url,
  });
  if (data.resepsi_date) out.push({
    name: "Resepsi", date: data.resepsi_date,
    time_start: (data.resepsi_time || "").split(" ")[0],
    time_end: (data.resepsi_time || "").split("–")[1]?.trim() || null,
    venue_name: data.resepsi_venue_name, venue_address: data.resepsi_venue_address,
    maps_url: data.resepsi_maps_url,
  });
  return out;
}
