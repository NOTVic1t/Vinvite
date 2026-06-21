// ============================================================================
// VINVITE ENGINE — SUPABASE CLIENT
// Requires the Supabase JS CDN script to be loaded before this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// ============================================================================

window.getVinviteClient = function () {
  const cfg = window.VINVITE_CONFIG || {};
  const configured =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.startsWith("YOUR_") &&
    !cfg.SUPABASE_ANON_KEY.startsWith("YOUR_");

  if (!configured || typeof window.supabase === "undefined") {
    return null;
  }

  if (!window._vinviteClient) {
    window._vinviteClient = window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_ANON_KEY
    );
  }
  return window._vinviteClient;
};
