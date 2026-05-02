# Schema Migration Reconciliation

## Purpose

Provide a repeatable, production-safe process to compare expected schema vs live schema and apply only forward-only non-destructive fixes.

## Commands

### 1) Generate production schema inventory

```bash
node scripts/schema-inventory.mjs
```

Output:

- `qa-artifacts/tasks/YYYY-MM-DD/schema-migration-reconciliation/schema-inventory.json`

### 2) Generate reconcile report

```bash
node scripts/schema-reconcile-check.mjs
```

Output:

- `qa-artifacts/tasks/YYYY-MM-DD/schema-migration-reconciliation/reconcile-report.md`

### 3) Mandatory SQL safety gate (before any production apply)

```bash
npm run check:migration:safe -- supabase/migrations/<file>.sql
```

If this fails, do not apply migration.

## No-Destructive-SQL Policy

Forbidden patterns (case-insensitive):

- `drop table`
- `drop column`
- `truncate`
- `delete from`
- `cascade`
- `alter column`
- `alter table ... drop`
- `rename table`
- `rename column`

Allowed style for production reconciliation:

- `create table if not exists`
- `alter table ... add column if not exists`
- `create index if not exists`
- guarded `create policy` when missing
- `alter table ... enable row level security`

## Pilot Readiness Rule

Schema is pilot-ready only when:

- reconcile report shows no missing app-critical tables,
- no critical missing columns,
- no unsafe migration apply was performed,
- `/api/health` remains PASS with `checks.supabase = ok`.

## Current Result (2026-05-01)

- Inventory and reconcile report generated.
- No missing app-critical tables remain.
- Existing reconciliation migration is flagged by safety gate due `cascade`; therefore no additional production SQL was applied in hardened pass.
- Pilot readiness: `yes` (conditional on keeping safety gate enforced for future migrations).
