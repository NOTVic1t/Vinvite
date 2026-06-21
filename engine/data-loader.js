// ============================================================================
// VINVITE ENGINE — DATA LOADER
// Every theme's script.js must define: window.renderInvitation(data)
// This file fetches the right data and calls it once the DOM is ready.
// ============================================================================

(async function loadInvitationData() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const isDemo = params.get("demo") === "1";
  let data = null;

  if (isDemo) {
    // "Coba Gratis" self-serve preview — no account, no Supabase write, just URL params.
    data = JSON.parse(JSON.stringify(window.VINVITE_SAMPLE_DATA)); // clone so we don't mutate the sample
    const groom = params.get("groom");
    const bride = params.get("bride");
    const date = params.get("date");
    if (groom) { data.groom_name = groom; data.groom_nickname = groom; }
    if (bride) { data.bride_name = bride; data.bride_nickname = bride; }
    if (date) { data.akad_date = date; data.resepsi_date = date; }
    data.guest_name = "Tamu Undangan";
    data._isDemo = true;
    data._invitationId = null;
  } else if (slug) {
    const client = window.getVinviteClient && window.getVinviteClient();
    if (client) {
      try {
        const { data: row, error } = await client
          .from("invitations")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();
        if (!error && row) {
          data = row;
          const guestName = params.get("to");
          data.guest_name = guestName
            ? decodeURIComponent(guestName.replace(/\+/g, " "))
            : "Bapak/Ibu/Saudara/i";
        }
      } catch (e) {
        console.warn("Vinvite: failed to load invitation from Supabase, using sample data.", e);
      }
    }
  }

  if (!data) {
    data = window.VINVITE_SAMPLE_DATA;
  }

  // small derived helpers every theme can rely on
  data._invitationId = data.id || data._invitationId || null;

  function ready() {
    if (typeof window.renderInvitation === "function") {
      window.renderInvitation(data);
    } else {
      console.error("Vinvite: this theme has no window.renderInvitation(data) defined.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
