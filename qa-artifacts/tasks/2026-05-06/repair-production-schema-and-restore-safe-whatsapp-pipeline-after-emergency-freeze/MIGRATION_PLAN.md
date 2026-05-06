# Migration Plan

1. Create forward-only migration with only:
- `CREATE TABLE IF NOT EXISTS`
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `COMMENT ON`

2. Validate SQL safety:
- `npm run check:migration:safe -- supabase/migrations/20260506093000_repair_handoff_settings_message_history_schema.sql`

3. Snapshot before apply:
- schema inventory JSON
- table counts JSON

4. Apply migration safely to production DB using owner role.

5. Refresh schema cache:
- `NOTIFY pgrst, 'reload schema'`

6. Verify columns/table/indexes now exist and freeze flags still enforced.
