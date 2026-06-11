-- =========================================================================
-- Migration 003: wedding planning suite (budget, vendors, planning lists)
--
-- Adds the admin-only tables behind the new Budget / Vendors / Planning
-- tabs. Run AFTER migration-002. Safe to run more than once.
-- Then run import-planning.sql ONCE to load the content from the
-- "Ultimate Wedding Planning Spreadsheet".
--
-- Everything here is admin-only: there are NO anonymous policies and no
-- public functions — guests can never see budgets or vendor contacts.
-- =========================================================================

-- Generic rows for the simple planning lists (checklist, priorities,
-- wedding party, timeline, packing list, vendors). Each row's fields live
-- in a flexible JSON blob; the admin UI defines the columns per sheet.
create table if not exists planning_rows (
  id         uuid primary key default gen_random_uuid(),
  sheet      text not null,            -- 'checklist' | 'priorities' | ...
  position   numeric not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists planning_rows_sheet_idx on planning_rows (sheet, position);

-- Budget line items ("Wedding Venue", "Catering", ...) with the estimate.
-- The ACTUAL spent amount is never stored — it is always computed from the
-- expense log below, so the two can't drift apart.
create table if not exists budget_items (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  estimated  numeric not null default 0,
  notes      text,
  position   numeric not null default 0,
  created_at timestamptz not null default now()
);

-- The expense log. status='paid' rows are money out the door;
-- status='planned' rows are upcoming payments (deposits, balances) with a
-- due date — together they replace the spreadsheet's Payment Schedule tab.
create table if not exists expenses (
  id             uuid primary key default gen_random_uuid(),
  budget_item_id uuid references budget_items(id) on delete set null,
  description    text not null,
  vendor         text,
  amount         numeric not null default 0,
  status         text not null default 'paid' check (status in ('planned', 'paid')),
  due_date       date,                 -- for planned payments
  paid_date      date,                 -- when it was actually paid
  paid_by        text,                 -- e.g. 'Parents' | 'Us'
  notes          text,
  created_at     timestamptz not null default now()
);

-- Small key/value store for budget settings (goal, contributions, …).
create table if not exists planning_settings (
  key   text primary key,
  value text
);

-- ---------- Row Level Security: admin-only, no exceptions ----------------

alter table planning_rows     enable row level security;
alter table budget_items      enable row level security;
alter table expenses          enable row level security;
alter table planning_settings enable row level security;

drop policy if exists "admin full access" on planning_rows;
create policy "admin full access" on planning_rows
  for all to authenticated using (true) with check (true);

drop policy if exists "admin full access" on budget_items;
create policy "admin full access" on budget_items
  for all to authenticated using (true) with check (true);

drop policy if exists "admin full access" on expenses;
create policy "admin full access" on expenses
  for all to authenticated using (true) with check (true);

drop policy if exists "admin full access" on planning_settings;
create policy "admin full access" on planning_settings
  for all to authenticated using (true) with check (true);
