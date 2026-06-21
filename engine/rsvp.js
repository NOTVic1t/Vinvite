// ============================================================================
// VINVITE ENGINE — RSVP
// Usage: window.bindRsvpForm("#rsvp-form", invitationId)
// Form must contain fields named: guest_name, attendance, guest_count, message
// Calls optional window.onRsvpSuccess(result) if defined by the theme.
// ============================================================================

window.bindRsvpForm = function (formSelector, invitationId) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      invitation_id: invitationId,
      guest_name: fd.get("guest_name"),
      attendance: fd.get("attendance"),
      guest_count: Number(fd.get("guest_count")) || 1,
      message: fd.get("message") || null,
    };

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const client = window.getVinviteClient && window.getVinviteClient();
    if (client && invitationId) {
      const { error } = await client.from("rsvps").insert(payload);
      if (error) {
        console.error("Vinvite RSVP error:", error);
        if (typeof window.onRsvpError === "function") window.onRsvpError(error);
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
    } else {
      console.info("Vinvite preview mode — RSVP not saved (no backend connected):", payload);
    }

    form.reset();
    if (submitBtn) submitBtn.disabled = false;
    if (typeof window.onRsvpSuccess === "function") window.onRsvpSuccess(payload);
  });
};
