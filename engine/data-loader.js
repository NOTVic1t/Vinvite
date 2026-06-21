// ============================================================================
// VINVITE ENGINE — DATA LOADER
// Every theme's script.js must define: window.renderInvitation(data)
// This file fetches the right data and calls it once the DOM is ready.
// ============================================================================

(async function loadInvitationData() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  let data = null;

  if (slug) {
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
  data._invitationId = data.id || null;

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
