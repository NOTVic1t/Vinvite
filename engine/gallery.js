// ============================================================================
// VINVITE ENGINE — GALLERY LIGHTBOX
// Usage: window.initGalleryLightbox(".gallery-item img")
// ============================================================================

window.initGalleryLightbox = function (imgSelector) {
  let overlay = document.getElementById("vinvite-lightbox");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "vinvite-lightbox";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.92);display:none;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out;padding:24px;";
    overlay.innerHTML = '<img style="max-width:100%;max-height:100%;border-radius:4px;" />';
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => (overlay.style.display = "none"));
  }
  const img = overlay.querySelector("img");

  document.querySelectorAll(imgSelector).forEach((el) => {
    el.style.cursor = "zoom-in";
    el.addEventListener("click", () => {
      img.src = el.getAttribute("src");
      overlay.style.display = "flex";
    });
  });
};
