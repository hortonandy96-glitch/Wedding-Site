-- =========================================================================
-- Migration: meal choices → food stations + plus ones
--
-- ONLY needed if you already ran the ORIGINAL setup.sql (the one with a
-- "meal" column) before 2026-06-09. Fresh projects should run setup.sql
-- instead, which includes everything.
--
-- Paste into Supabase → SQL Editor → Run. Then ALSO re-run the
-- "3. Guest-facing functions" section of the new setup.sql so
-- rsvp_lookup/rsvp_submit get their updated versions, and run its
-- revoke/grant lines.
-- =========================================================================

-- Dinner is stations now: meal choice becomes free-text dietary notes
alter table guests rename column meal to dietary;

-- One optional plus one per household
alter table guests add column if not exists is_plus_one boolean not null default false;
alter table households add column if not exists plus_one_allowed boolean not null default false;

-- The old 3-argument rsvp_submit is replaced by a 4-argument version
drop function if exists rsvp_submit(text, jsonb, text);
