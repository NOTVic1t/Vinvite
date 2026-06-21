// =============================================================================
// VINVITE — LANDING PAGE
// =============================================================================

// Fill in your WhatsApp number (with country code, no + or spaces, e.g. "6281234567890")
const OWNER_WHATSAPP_NUMBER = "62YOUR_WHATSAPP_NUMBER";

function buildWaLink(packageName) {
  const intro = packageName
    ? `Halo Vinvite, saya ingin pesan undangan digital paket *${packageName}*.`
    : `Halo Vinvite, saya ingin tanya-tanya soal undangan digital pernikahan.`;
  const text = `${intro}\n\nNama: \nTanggal Pernikahan: \nTema yang disuka: `;
  return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function bindWaButtons() {
  document.querySelectorAll(".wa-order-btn").forEach((btn) => {
    btn.setAttribute("href", buildWaLink(btn.dataset.package));
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
        </a>`
      )
      .join("");
  } catch (e) {
    grid.innerHTML = '<p style="color:#5C6B62;">Gagal memuat daftar tema.</p>';
  }
}

loadThemeGallery();
