-- ============================================================================
-- VINVITE — MIGRATION 002: RESELLER MODEL
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- Safe to run on top of the original schema.sql — only adds/alters, doesn't drop data.
--
-- WHAT THIS CHANGES
-- Old model: anyone signs up publicly as a "customer" and builds their own invitation.
-- New model: clients order via WhatsApp, have no login. Only the Owner (admin) and
-- Resellers have accounts. A reseller manages invitations for their own clients;
-- the admin sees everything across all resellers.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Roles: drop 'customer', add 'reseller'
-- ----------------------------------------------------------------------------
update profiles set role = 'reseller' where role = 'customer';

alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('admin', 'reseller'));

-- ----------------------------------------------------------------------------
-- 2. Invitations now belong to a reseller (or admin), not the couple themselves.
--    Store the couple's own contact info directly since they have no account.
-- ----------------------------------------------------------------------------
alter table invitations add column if not exists client_name text;
alter table invitations add column if not exists client_phone text;
alter table invitations add column if not exists internal_notes text;

comment on column invitations.user_id is
  'The reseller (or admin) who owns/manages this invitation on the client''s behalf.';

-- ----------------------------------------------------------------------------
-- 3. Auto-create a profile row whenever a new auth user is created.
--    This is how reseller accounts get set up: the admin creates the user in
--    Supabase Dashboard -> Authentication -> Add user, and this trigger gives
--    them a 'reseller' profile automatically. No public sign-up form anymore.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'reseller')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Let the admin update any profile (needed to promote/demote roles from
--    the admin panel's "Semua Reseller" page instead of only via raw SQL).
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_admin_update" on profiles;
create policy "profiles_admin_update" on profiles for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ----------------------------------------------------------------------------
-- Note: invitations/guests/rsvps/guestbook RLS policies from schema.sql already
-- key off invitations.user_id = auth.uid() for the owning reseller, and have a
-- separate admin-bypass policy — no changes needed there.
-- ============================================================================
