// ============================================================================
// VINVITE ENGINE — GUESTBOOK ("Ucapan & Doa")
// Usage: window.initGuestbook({ formSelector, listSelector, invitationId, itemTemplate })
// itemTemplate(entry) must return an HTML string for one wish.
// ============================================================================

window.initGuestbook = function (opts) {
  const { formSelector, listSelector, invitationId, itemTemplate } = opts;
  const form = document.querySelector(formSelector);
  const list = document.querySelector(listSelector);
  if (!list) return;

  const client = window.getVinviteClient && window.getVinviteClient();

  async function render() {
    let entries = [];
    if (client && invitationId) {
      const { data, error } = await client
        .from("guestbook")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false });
      if (!error && data) entries = data;
    } else {
      entries = window._vinvitePreviewWishes || [
        { name: "Sahabat Mempelai", message: "Selamat menempuh hidup baru! Bahagia selalu ❤️", created_at: new Date().toISOString() },
      ];
    }

    list.innerHTML = entries.length
      ? entries.map(itemTemplate).join("")
      : '<p class="vinvite-empty">Jadilah yang pertama mengirimkan ucapan.</p>';
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const entry = {
        invitation_id: invitationId,
        name: fd.get("name"),
        message: fd.get("message"),
      };
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      if (client && invitationId) {
        await client.from("guestbook").insert(entry);
      } else {
        window._vinvitePreviewWishes = window._vinvitePreviewWishes || [];
        window._vinvitePreviewWishes.unshift({ ...entry, created_at: new Date().toISOString() });
      }

      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      render();
    });
  }

  render();
};
