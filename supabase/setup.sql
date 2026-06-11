-- =========================================================================
-- Robin & Andy wedding — database setup
-- Paste this whole file into Supabase: Dashboard → SQL Editor → New query
-- → paste → Run. It is safe to run on a brand-new project.
-- (Already ran an older version? Use migration-001-stations.sql instead.)
--
-- WHAT THIS CREATES (plain English):
--   1. Two tables: households (one per invitation) and guests (people).
--      Dinner is food stations, so guests have a free-text "dietary"
--      field instead of a meal choice. Households can optionally be
--      granted a plus one.
--   2. Security rules ("Row Level Security") so that:
--        - YOU (signed in as admin) can read/write everything.
--        - Random visitors can read/write NOTHING directly.
--   3. Two carefully-scoped functions the RSVP page uses:
--        - rsvp_lookup(code):  given an invite code, return that household
--        - rsvp_submit(code,…): record that household's responses
--      Functions are the only doorway guests have, and each one checks
--      the invite code first — like a keycard that only opens one room.
-- =========================================================================

-- ---------- 1. Tables ----------------------------------------------------

create table if not exists households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                 -- e.g. "The Beattie Family"
  -- invite code used in QR links; random 10 characters
  code        text not null unique default substr(md5(random()::text), 1, 10),
  email       text,
  phone       text,
  notes       text,                          -- private admin notes
  plus_one_allowed boolean not null default false,
  rsvp_message text,                         -- note guests leave when RSVPing
  responded_at timestamptz,                  -- set when the household RSVPs
  reminder_sent_at timestamptz,              -- set when a reminder email goes out
  created_at  timestamptz not null default now()
);

create table if not exists guests (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  name         text not null,
  rsvp_status  text not null default 'pending'
               check (rsvp_status in ('pending', 'yes', 'no')),
  dietary      text,                         -- free text; stations dinner
  notes        text,                         -- private admin notes
  is_plus_one  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------- 2. Row Level Security ----------------------------------------
-- "Enable RLS" = deny everything unless a policy explicitly allows it.

alter table households enable row level security;
alter table guests     enable row level security;

-- Signups are disabled in the dashboard, so "any signed-in user" = just you.
drop policy if exists "admin full access" on households;
create policy "admin full access" on households
  for all to authenticated using (true) with check (true);

drop policy if exists "admin full access" on guests;
create policy "admin full access" on guests
  for all to authenticated using (true) with check (true);

-- Deliberately NO policies for the anonymous role: guests cannot touch the
-- tables directly. They go through the two functions below instead.

-- ---------- 3. Guest-facing functions (used by the RSVP page) -------------
-- "security definer" = the function runs with the database owner's power,
-- so it can read the tables even though anonymous visitors can't. That's
-- why each function validates the invite code before doing anything.

create or replace function rsvp_lookup(invite_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  hh households%rowtype;
  result jsonb;
begin
  select * into hh from households where code = lower(trim(invite_code));
  if not found then
    return null;  -- wrong/unknown code: reveal nothing
  end if;

  select jsonb_build_object(
    'household_name',   hh.name,
    'responded_at',     hh.responded_at,
    'rsvp_message',     hh.rsvp_message,
    'plus_one_allowed', hh.plus_one_allowed,
    'has_plus_one',     coalesce(bool_or(g.is_plus_one), false),
    'guests', coalesce(jsonb_agg(
       jsonb_build_object('id', g.id, 'name', g.name,
                          'rsvp_status', g.rsvp_status,
                          'dietary', g.dietary,
                          'is_plus_one', g.is_plus_one)
       order by g.created_at), '[]'::jsonb)
  ) into result
  from guests g where g.household_id = hh.id;

  return result;
end;
$$;

create or replace function rsvp_submit(
  invite_code text,
  responses   jsonb,                -- [{"id": "<uuid>", "rsvp_status": "yes", "dietary": "..."}]
  message     text default null,
  plus_one    jsonb default null    -- {"name": "...", "dietary": "..."} or null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  hh households%rowtype;
  r jsonb;
begin
  select * into hh from households where code = lower(trim(invite_code));
  if hh.id is null then
    return false;
  end if;

  for r in select * from jsonb_array_elements(responses) loop
    update guests
       set rsvp_status = coalesce(r->>'rsvp_status', rsvp_status),
           dietary     = r->>'dietary'
     where id = (r->>'id')::uuid
       and household_id = hh.id              -- can't touch other households
       and (r->>'rsvp_status') in ('pending', 'yes', 'no');
  end loop;

  -- Add a plus one only if this household was granted one, it has a real
  -- name, and one hasn't been added already (one per household, max).
  if plus_one is not null
     and hh.plus_one_allowed
     and length(trim(coalesce(plus_one->>'name', ''))) >= 2
     and not exists (select 1 from guests
                      where household_id = hh.id and is_plus_one) then
    insert into guests (household_id, name, rsvp_status, dietary, is_plus_one)
    values (hh.id, trim(plus_one->>'name'), 'yes', plus_one->>'dietary', true);
  end if;

  update households
     set responded_at = now(),
         rsvp_message = coalesce(message, rsvp_message)
   where id = hh.id;

  return true;
end;
$$;

-- Only the anonymous web role and you may call these; nobody else.
revoke all on function rsvp_lookup(text) from public;
revoke all on function rsvp_submit(text, jsonb, text, jsonb) from public;
grant execute on function rsvp_lookup(text) to anon, authenticated;
grant execute on function rsvp_submit(text, jsonb, text, jsonb) to anon, authenticated;

-- ---------- 4. Name search & unmatched RSVPs ------------------------------

-- RSVPs from people whose name didn't match the guest list. They land
-- here for you to reconcile by hand in the admin report.
create table if not exists unmatched_rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  attending   text not null check (attending in ('yes', 'no')),
  party_names text,            -- who they say is coming with them
  dietary     text,
  message     text,
  created_at  timestamptz not null default now()
);

alter table unmatched_rsvps enable row level security;

drop policy if exists "admin full access" on unmatched_rsvps;
create policy "admin full access" on unmatched_rsvps
  for all to authenticated using (true) with check (true);
-- (no anonymous policies: visitors submit only via the function below)

-- Guided-fill search: given a few typed letters, return matching guests.
-- Requires 2+ characters and returns at most 8 results, so the guest list
-- can't be downloaded wholesale. Returning the household code here is what
-- lets a matched guest open their household's RSVP form — same trust model
-- as every "find your invitation" box on The Knot/Zola.
create or replace function rsvp_search(query text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  q text;
  result jsonb;
begin
  -- strip ilike wildcards so guests can't search for '%'
  q := trim(translate(coalesce(query, ''), '%_', ''));
  if length(q) < 2 then
    return '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'guest_name', m.name,
           'household_name', m.household_name,
           'code', m.code)), '[]'::jsonb)
    into result
  from (
    select g.name, h.name as household_name, h.code
    from guests g
    join households h on h.id = g.household_id
    where g.name ilike '%' || q || '%'
    order by g.name
    limit 8
  ) m;

  return result;
end;
$$;

-- Fallback submission for names the search can't find.
create or replace function rsvp_submit_unmatched(
  guest_name  text,
  email       text default null,
  attending   text default 'yes',
  party_names text default null,
  dietary     text default null,
  message     text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(trim(coalesce(guest_name, ''))) < 2
     or attending not in ('yes', 'no') then
    return false;
  end if;
  insert into unmatched_rsvps (name, email, attending, party_names, dietary, message)
  values (trim(guest_name), nullif(trim(coalesce(email, '')), ''),
          attending, nullif(trim(coalesce(party_names, '')), ''),
          nullif(trim(coalesce(dietary, '')), ''),
          nullif(trim(coalesce(message, '')), ''));
  return true;
end;
$$;

revoke all on function rsvp_search(text) from public;
revoke all on function rsvp_submit_unmatched(text, text, text, text, text, text) from public;
grant execute on function rsvp_search(text) to anon, authenticated;
grant execute on function rsvp_submit_unmatched(text, text, text, text, text, text) to anon, authenticated;

-- ---------- 5. (Optional) sample data — uncomment to try things out ------
-- insert into households (name, email, plus_one_allowed)
--   values ('The Test Family', 'test@example.com', true);
-- insert into guests (household_id, name)
--   select id, 'Pat Test' from households where name = 'The Test Family';
