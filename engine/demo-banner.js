// =============================================================================
// VINVITE ENGINE — DEMO BANNER
// Shows a "this is a preview, order now" bar when a theme page is opened with
// ?demo=1 (i.e. via the "Coba Gratis" self-serve form). Builds a WhatsApp link
// prefilled with the name/date/theme the visitor just entered.
// =============================================================================

(function () {
  function buildDemoWaLink({ groom, bride, date, themeName }) {
    const cfg = window.VINVITE_CONFIG || {};
    const number = cfg.WHATSAPP_NUMBER && !cfg.WHATSAPP_NUMBER.startsWith("62YOUR")
      ? cfg.WHATSAPP_NUMBER
      : "";

    const namePart = groom && bride ? `${groom} & ${bride}` : "[isi nama Anda]";
    const text =
      `Halo Vinvite, saya ${namePart} mau buat undangan dengan tema *${themeName}*.\n\n` +
      `Tanggal Acara: ${date || "[isi tanggal]"}\n` +
      `Mohon info paket & langkah selanjutnya ya 🙏`;

    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  async function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;

    let themeName = document.title || "tema ini";
    try {
      const res = await fetch("./theme.json");
      const themeData = await res.json();
      themeName = themeData.name || themeName;
    } catch (e) {
      /* fall back to document.title */
    }

    const waLink = buildDemoWaLink({
      groom: params.get("groom"),
      bride: params.get("bride"),
      date: params.get("date"),
      themeName,
    });

    const banner = document.createElement("div");
    banner.id = "vinvite-demo-banner";
    banner.innerHTML = `
      <span>🔍 Ini mode pratinjau "Coba Gratis" — undangan asli akan punya link permanen &amp; RSVP aktif.</span>
      <a href="${waLink}" target="_blank" rel="noopener">Suka? Pesan Sekarang via WhatsApp</a>
    `;
    banner.style.cssText = `
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 999;
      background: #14201C; color: #FAF6EE; font-family: "Plus Jakarta Sans", sans-serif;
      font-size: .78rem; padding: 12px 16px; display: flex; gap: 12px; align-items: center;
      justify-content: center; flex-wrap: wrap; text-align: center;
      box-shadow: 0 -6px 20px rgba(0,0,0,.25);
    `;
    const link = banner.querySelector("a");
    link.style.cssText = `
      background: #E8633D; color: #fff; padding: 8px 16px; border-radius: 100px;
      text-decoration: none; font-weight: 600; white-space: nowrap;
    `;
    document.body.appendChild(banner);
    document.body.style.paddingBottom = `${banner.offsetHeight}px`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
