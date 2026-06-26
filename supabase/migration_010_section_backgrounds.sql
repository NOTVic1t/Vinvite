-- =============================================================================
-- VINVITE — MIGRATION 009: SECTION BACKGROUND PHOTOS
-- Optional per-section background photo, independently togglable from the
-- section's content visibility (hidden_sections).
-- =============================================================================

alter table invitations
  add column if not exists section_backgrounds jsonb not null default '{}';
  -- Shape: { "<sectionKey>": { "url": "https://...", "enabled": true } }
  -- sectionKey matches the keys used by hidden_sections / SECTION_KEYS,
  -- plus "hero", "couple", and "footer" which have no content-visibility
  -- toggle of their own but can still carry a background photo.
