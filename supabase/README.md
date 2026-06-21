# Supabase setup

1. Create a free project at https://supabase.com
2. Open **SQL Editor** → paste the contents of `schema.sql` → Run
   - Already have a project from before this update? Run `migration_002_reseller_model.sql`
     instead (or after) — it upgrades an existing database to the reseller model below.
3. Open **Project Settings → API** → copy your **Project URL** and the **Publishable**
   (`sb_publishable_...`) key — not the Secret key
4. Paste both into `/engine/config.js` in this repo
5. (Optional) In **Authentication → Providers**, keep Email enabled

## Account model: Owner → Reseller → Client

There is **no public sign-up form**. Clients (the couple) never get a login — they order via
WhatsApp and the reseller/admin builds their invitation for them in the admin panel.

- **You (the owner/admin):** sign yourself up once via `/admin/login.html`, then run this in
  the SQL Editor (replace the email) to promote yourself:
  ```sql
  update profiles set role = 'admin'
  where id = (select id from auth.users where email = 'you@example.com');
  ```
- **Resellers:** create their account yourself in **Authentication → Users → Add user**
  (set an email + temporary password) and send them the credentials directly. A database
  trigger automatically gives every new account a `reseller` profile — no extra step needed.
  You can also promote/demote roles later from the admin panel's **Semua Reseller** page.

## Local theme preview without Supabase

Every theme can be opened directly with no backend connected — `engine/data-loader.js` falls
back to the sample couple in `engine/sample-data.js` whenever no `?slug=` is present in the URL,
or whenever the Supabase fetch fails (e.g. keys not filled in yet). This is what you see when
you open any `themes/*/index.html` file straight from disk.
