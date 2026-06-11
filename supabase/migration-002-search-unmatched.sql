-- =========================================================================
-- Migration 002: name search + unmatched RSVPs
--
-- Run this if your database was set up before 2026-06-10 (it adds the
-- pieces for the "type your name" RSVP screen). Fresh projects can skip
-- this — the current setup.sql includes everything below.
--
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.
-- =========================================================================

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
