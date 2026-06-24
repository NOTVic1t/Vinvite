// =============================================================================
// VINVITE ENGINE — SECTION CONTROL
// Applies hidden_sections and section_labels from invitation data to the DOM.
//
// Usage: window.applySectionControl(data)
// Call this inside renderInvitation(data) after the DOM is built.
//
// Each section must have data-section="key" on its element.
// Labels: elements with data-section-label="key" get their textContent replaced.
// =============================================================================

// Default label text for each section key
window.VINVITE_DEFAULT_LABELS = {
  quote:     "Kutipan",
  countdown: "Menuju Hari Bahagia",
  events:    "Acara",
  story:     "Kisah Kami",
  gallery:   "Galeri",
  gift:      "Tanda Kasih",
  rsvp:      "Konfirmasi Kehadiran",
  guestbook: "Ucapan & Doa",
};

window.applySectionControl = function (data) {
  const hidden = Array.isArray(data.hidden_sections)
    ? data.hidden_sections
    : (data.hidden_sections ? JSON.parse(data.hidden_sections) : []);

  const labels = data.section_labels
    ? (typeof data.section_labels === "object" ? data.section_labels : JSON.parse(data.section_labels))
    : {};

  // Hide sections
  document.querySelectorAll("[data-section]").forEach(el => {
    const key = el.dataset.section;
    if (hidden.includes(key)) {
      el.style.display = "none";
    }
  });

  // Apply custom labels
  document.querySelectorAll("[data-section-label]").forEach(el => {
    const key = el.dataset.sectionLabel;
    if (labels[key]) {
      el.textContent = labels[key];
    }
  });
};

// Renders events (new repeater format) into a container element
// containerSelector: CSS selector for the events wrapper
// mapEmbedFn: optional function(id, address) to inject a map embed
window.renderEvents = function (data, containerSelector, opts = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const events = Array.isArray(data.events)
    ? data.events
    : (data.events ? JSON.parse(data.events) : []);

  // Fallback to legacy akad/resepsi fields if events array is empty
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

  // Inject maps
  list.forEach((ev, i) => {
    if (ev.venue_address && typeof window.injectMapsEmbed === "function") {
      window.injectMapsEmbed(`#map-embed-${i}`, ev.venue_address);
    }
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
