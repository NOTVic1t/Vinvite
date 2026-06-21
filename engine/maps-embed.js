// =============================================================================
// VINVITE ENGINE — MAPS EMBED
// Embeds a Google Maps preview from a plain address (no API key required).
// Usage: window.injectMapsEmbed("#akad-map", "Jl. Kenanga No. 12, Bandung")
// =============================================================================

window.injectMapsEmbed = function (containerSelector, address) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (!address || !address.trim()) {
    container.hidden = true;
    return;
  }

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  container.innerHTML = `<iframe src="${src}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  container.hidden = false;
};
