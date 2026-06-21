# Supabase setup

1. Create a free project at https://supabase.com
2. Open **SQL Editor** → paste the contents of `schema.sql` → Run
3. Open **Project Settings → API** → copy your **Project URL** and **anon public key**
4. Paste both into `/engine/config.js` in this repo
5. (Optional) In **Authentication → Providers**, keep Email enabled — the admin panel signs
   admins/customers in with email + password
6. To make yourself an admin: after signing up once via `/admin/login.html`, run this in the
   SQL Editor (replace the email):

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## Local theme preview without Supabase

Every theme can be opened directly with no backend connected — `engine/data-loader.js` falls
back to the sample couple in `engine/sample-data.js` whenever no `?slug=` is present in the URL,
or whenever the Supabase fetch fails (e.g. keys not filled in yet). This is what you see when
you open any `themes/*/index.html` file straight from disk.
