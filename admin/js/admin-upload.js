// =============================================================================
// VINVITE ADMIN — FILE UPLOAD HELPER
// Wraps Supabase Storage uploads for invitation media.
// =============================================================================

const VINVITE_BUCKET = "invitation-media";

// Uploads a File to Supabase Storage, returns the public URL.
// progressCb(pct) is optional.
window.uploadInvitationFile = async function (file, folder, progressCb) {
  const client = window.getVinviteClient();
  if (!client) throw new Error("Supabase belum dikonfigurasi.");

  const ext = file.name.split(".").pop().toLowerCase();
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (progressCb) progressCb(10);

  const { data, error } = await client.storage
    .from(VINVITE_BUCKET)
    .upload(safeName, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(error.message);
  if (progressCb) progressCb(90);

  const { data: urlData } = client.storage.from(VINVITE_BUCKET).getPublicUrl(data.path);
  if (progressCb) progressCb(100);
  return urlData.publicUrl;
};

// Renders a file-upload widget into `container` (a DOM element).
// opts: { label, accept, folder, onUrl(url), currentUrl, preview: "image"|"audio" }
window.renderUploadWidget = function (container, opts) {
  const { label, accept, folder, onUrl, currentUrl, preview } = opts;

  container.innerHTML = `
    <div class="upload-widget">
      ${currentUrl ? renderPreview(currentUrl, preview) : ""}
      <label class="upload-label">
        <input type="file" class="upload-input" accept="${accept}" />
        <span class="upload-btn">${currentUrl ? "Ganti " + label : "Upload " + label}</span>
      </label>
      <div class="upload-progress" hidden>
        <div class="upload-bar"></div>
      </div>
      <p class="upload-status"></p>
    </div>
  `;

  const input = container.querySelector(".upload-input");
  const status = container.querySelector(".upload-status");
  const progressWrap = container.querySelector(".upload-progress");
  const bar = container.querySelector(".upload-bar");

  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;

    // 10MB limit for images, 20MB for audio
    const limitMB = accept.includes("audio") ? 20 : 10;
    if (file.size > limitMB * 1024 * 1024) {
      status.textContent = `Ukuran file melebihi ${limitMB}MB.`;
      return;
    }

    status.textContent = "Mengunggah...";
    progressWrap.hidden = false;

    try {
      const url = await window.uploadInvitationFile(file, folder, (pct) => {
        bar.style.width = pct + "%";
      });

      // Update preview
      const existingPreview = container.querySelector(".upload-preview");
      if (existingPreview) existingPreview.remove();
      container.querySelector(".upload-widget").insertAdjacentHTML("afterbegin", renderPreview(url, preview));
      container.querySelector(".upload-btn").textContent = "Ganti " + label;

      status.textContent = "Berhasil diunggah ✓";
      progressWrap.hidden = true;
      if (typeof onUrl === "function") onUrl(url);
    } catch (err) {
      status.textContent = "Gagal: " + err.message;
      progressWrap.hidden = true;
    }
  });
};

function renderPreview(url, type) {
  if (!url) return "";
  if (type === "audio") {
    return `<div class="upload-preview"><audio controls src="${url}" style="width:100%;margin-bottom:8px;"></audio></div>`;
  }
  return `<div class="upload-preview"><img src="${url}" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:8px;" /></div>`;
}
