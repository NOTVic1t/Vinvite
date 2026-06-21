// =============================================================================
// VINVITE — LANDING PAGE
// =============================================================================

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
