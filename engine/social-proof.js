// =============================================================================
// VINVITE ENGINE — SOCIAL PROOF
// Shows "X orang akan hadir" pulled from confirmed RSVPs.
// Usage: window.initSocialProof("#social-proof", invitationId)
// =============================================================================

window.initSocialProof = async function (selector, invitationId) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Demo/preview mode (no real invitation row yet) — show an illustrative placeholder.
  if (!invitationId) {
    el.textContent = "32 orang akan hadir";
    return;
  }

  const client = window.getVinviteClient && window.getVinviteClient();
  if (!client) { el.hidden = true; return; }

  try {
    const { data, error } = await client
      .from("rsvps")
      .select("guest_count")
      .eq("invitation_id", invitationId)
      .eq("attendance", "hadir");

    if (error || !data || !data.length) { el.hidden = true; return; }

    const total = data.reduce((sum, r) => sum + (r.guest_count || 1), 0);
    if (total <= 0) { el.hidden = true; return; }

    el.textContent = `${total} orang akan hadir`;
  } catch (e) {
    el.hidden = true;
  }
};
