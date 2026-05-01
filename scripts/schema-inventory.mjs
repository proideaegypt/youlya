#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
const outDir = path.join(process.cwd(), 'qa-artifacts', 'tasks', date, 'schema-migration-reconciliation');
const outFile = path.join(outDir, 'schema-inventory.json');
fs.mkdirSync(outDir, { recursive: true });

const sql = String.raw`
WITH public_tables AS (
  SELECT c.oid,
         n.nspname AS schema_name,
         c.relname AS table_name,
         c.relrowsecurity AS rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'r' AND n.nspname = 'public'
),
cols AS (
  SELECT c.table_schema,
         c.table_name,
         c.column_name,
         c.data_type,
         c.udt_name,
         c.is_nullable,
         c.column_default,
         c.ordinal_position
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
),
pks AS (
  SELECT tc.table_schema,
         tc.table_name,
         array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS pk_columns
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
  WHERE tc.table_schema = 'public'
    AND tc.constraint_type = 'PRIMARY KEY'
  GROUP BY tc.table_schema, tc.table_name
),
idx AS (
  SELECT schemaname,
         tablename,
         indexname,
         indexdef
  FROM pg_indexes
  WHERE schemaname = 'public'
),
pol AS (
  SELECT schemaname,
         tablename,
         policyname,
         permissive,
         roles,
         cmd,
         qual,
         with_check
  FROM pg_policies
  WHERE schemaname = 'public'
),
all_info AS (
  SELECT t.schema_name,
         t.table_name,
         t.rls_enabled,
         COALESCE(
           (SELECT json_agg(json_build_object(
             'column_name', c.column_name,
             'data_type', c.data_type,
             'udt_name', c.udt_name,
             'is_nullable', c.is_nullable,
             'column_default', c.column_default,
             'ordinal_position', c.ordinal_position
           ) ORDER BY c.ordinal_position)
           FROM cols c
           WHERE c.table_schema = t.schema_name AND c.table_name = t.table_name),
           '[]'::json
         ) AS columns,
         COALESCE(
           (SELECT pk_columns FROM pks p WHERE p.table_schema = t.schema_name AND p.table_name = t.table_name),
           ARRAY[]::text[]
         ) AS primary_key,
         COALESCE(
           (SELECT json_agg(json_build_object(
             'indexname', i.indexname,
             'indexdef', i.indexdef
           ) ORDER BY i.indexname)
           FROM idx i
           WHERE i.schemaname = t.schema_name AND i.tablename = t.table_name),
           '[]'::json
         ) AS indexes,
         COALESCE(
           (SELECT json_agg(json_build_object(
             'policyname', p.policyname,
             'permissive', p.permissive,
             'roles', p.roles,
             'cmd', p.cmd,
             'qual', p.qual,
             'with_check', p.with_check
           ) ORDER BY p.policyname)
           FROM pol p
           WHERE p.schemaname = t.schema_name AND p.tablename = t.table_name),
           '[]'::json
         ) AS policies
  FROM public_tables t
),
migration_history AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('schema_migrations', 'supabase_migrations')
)
SELECT json_build_object(
  'generated_at', now(),
  'public_tables', COALESCE((SELECT json_agg(json_build_object(
    'schema', a.schema_name,
    'table', a.table_name,
    'rls_enabled', a.rls_enabled,
    'primary_key', a.primary_key,
    'columns', a.columns,
    'indexes', a.indexes,
    'policies', a.policies
  ) ORDER BY a.table_name) FROM all_info a), '[]'::json),
  'migration_tables_present', COALESCE((SELECT json_agg(m.table_name ORDER BY m.table_name) FROM migration_history m), '[]'::json)
) AS payload;
`;

function runPsql(sqlText) {
  const tmpPath = path.join('/tmp', `youlya-schema-inventory-${Date.now()}.sql`);
  fs.writeFileSync(tmpPath, sqlText);
  try {
    return execFileSync(
      'bash',
      [
        '-lc',
        `set -a; source /root/youlya/.env.production; set +a; docker exec -i supabase-db psql -U postgres -d postgres -Atq -f - < ${JSON.stringify(tmpPath)}`,
      ],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
  } finally {
    fs.rmSync(tmpPath, { force: true });
  }
}

try {
  const raw = runPsql(sql).trim();
  const payload = JSON.parse(raw);
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  console.log(outFile);
  console.log(`tables=${payload.public_tables.length}`);
} catch (error) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`schema-inventory failed: ${msg}`);
  process.exit(1);
}
