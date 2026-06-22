-- ============================================================================
-- VINVITE — MIGRATION 005: STORAGE RLS POLICIES
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- By default Supabase Storage buckets have RLS enabled but no policies,
-- which means ALL operations (including uploads from logged-in users) are
-- blocked. This migration adds the policies needed for:
--   - Any authenticated user to upload to invitation-media
--   - Anyone to read/download from invitation-media (public bucket)
--   - Only the uploader to update/delete their own files
-- ============================================================================

-- Allow any authenticated user to upload files
create policy "storage_auth_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'invitation-media'
    and auth.role() = 'authenticated'
  );

-- Allow public read (the bucket is already public, but policy still required)
create policy "storage_public_select"
  on storage.objects for select
  using (bucket_id = 'invitation-media');

-- Allow the uploader to update their own files
create policy "storage_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'invitation-media'
    and auth.uid() = owner
  );

-- Allow the uploader to delete their own files
create policy "storage_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'invitation-media'
    and auth.uid() = owner
  );
