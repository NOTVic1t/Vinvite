// =============================================================================
// VINVITE — LANDING PAGE
// =============================================================================

function getWhatsappNumber() {
  const cfg = window.VINVITE_CONFIG || {};
  return cfg.WHATSAPP_NUMBER && !cfg.WHATSAPP_NUMBER.startsWith("62YOUR")
    ? cfg.WHATSAPP_NUMBER
    : "";
}

// Builds the WA deep link. themeName, if given, produces:
// "Halo Vinvite, saya [isi nama Anda] mau buat undangan dengan tema X."
function buildWaLink({ packageName, themeName } = {}) {
  const number = getWhatsappNumber();
  let text;

  if (themeName) {
    text =
      `Halo Vinvite, saya [isi nama Anda] mau buat undangan dengan tema *${themeName}*.\n\n` +
      `Tanggal Acara: \n` +
      `Paket: ${packageName || "(mohon direkomendasikan)"}`;
  } else if (packageName) {
    text =
      `Halo Vinvite, saya [isi nama Anda] mau pesan undangan digital paket *${packageName}*.\n\n` +
      `Tanggal Acara: \n` +
      `Tema yang disuka: `;
  } else {
    text =
      `Halo Vinvite, saya [isi nama Anda] mau buat undangan pernikahan digital.\n\n` +
      `Tanggal Acara: \n` +
      `Tema yang disuka: `;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function bindWaButtons() {
  document.querySelectorAll(".wa-order-btn").forEach((btn) => {
    btn.setAttribute("href", buildWaLink({ packageName: btn.dataset.package }));
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener");
  });
}
bindWaButtons();

async function loadThemeGallery() {
  const grid = document.getElementById("theme-grid");
  try {
    const res = await fetch("themes/themes.json");
    const themes = await res.json();
    grid.innerHTML = themes
      .map(
        (t) => `
        <a class="theme-tile" href="themes/${t.slug}/index.html">
          <span class="badge ${t.status === "built" ? "" : "soon"}">${t.status === "built" ? "Tersedia" : "Segera"}</span>
          <h4>${t.name}</h4>
          <span>${t.category}</span>
          ${t.status === "built" ? `<a class="theme-tile-wa" href="${buildWaLink({ themeName: t.name })}" target="_blank" rel="noopener" aria-label="Pesan tema ${t.name} via WhatsApp" onclick="event.stopPropagation()">✆</a>` : ""}
        </a>`
      )
      .join("");
  } catch (e) {
    grid.innerHTML = '<p style="color:#5C6B62;">Gagal memuat daftar tema.</p>';
  }
}

loadThemeGallery();
