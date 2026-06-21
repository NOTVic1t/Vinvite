-- ============================================================================
-- VINVITE — MIGRATION 003: FIX RLS INFINITE RECURSION
-- Run this in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- THE BUG
-- Policies like "profiles_admin_select" check the `profiles` table from inside
-- a policy that applies to `profiles` itself. Postgres re-applies RLS to that
-- inner query too, which re-triggers the same policy — infinite recursion.
-- Any other policy that checks someone's role via a subquery on `profiles`
-- (on invitations, guests, rsvps, orders) hits the same recursion indirectly,
-- because querying `profiles` from anywhere re-evaluates its policies.
--
-- THE FIX
-- Move the admin check into a SECURITY DEFINER function. Such a function runs
-- with the privileges of its owner and bypasses RLS for its own internal
-- query, so calling it from a policy no longer re-triggers profiles' policies.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Replace every policy that checked profiles via an inline EXISTS subquery
-- with one that calls is_admin() instead.
-- ---------------------------------------------------------------------------

drop policy if exists "profiles_admin_select" on profiles;
create policy "profiles_admin_select" on profiles for select using (public.is_admin());

drop policy if exists "profiles_admin_update" on profiles;
create policy "profiles_admin_update" on profiles for update using (public.is_admin());

drop policy if exists "invitations_admin_all" on invitations;
create policy "invitations_admin_all" on invitations for all using (public.is_admin());

drop policy if exists "guests_admin_all" on guests;
create policy "guests_admin_all" on guests for all using (public.is_admin());

drop policy if exists "rsvps_admin_select" on rsvps;
create policy "rsvps_admin_select" on rsvps for select using (public.is_admin());

drop policy if exists "orders_admin_all" on orders;
create policy "orders_admin_all" on orders for all using (public.is_admin());
