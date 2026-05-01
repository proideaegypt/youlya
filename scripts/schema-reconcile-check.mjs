#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
const baseDir = path.join(process.cwd(), 'qa-artifacts', 'tasks', date, 'schema-migration-reconciliation');
const invPath = path.join(baseDir, 'schema-inventory.json');
const outPath = path.join(baseDir, 'reconcile-report.md');

if (!fs.existsSync(invPath)) {
  console.error(`Missing inventory file: ${invPath}`);
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const tableMap = new Map(inventory.public_tables.map((t) => [t.table, t]));

const requiredTables = [
  'stores',
  'store_integrations',
  'customers',
  'conversations',
  'messages',
  'products',
  'product_variants',
  'last_product_recommendations',
  'carts',
  'cart_items',
  'orders',
  'ai_tool_calls',
  'handoff_tickets',
  'audit_logs',
  'failed_events',
  'idempotency_keys',
  'processed_messages',
  'order_idempotency_keys',
  'dead_letter_log',
  'ai_settings',
  'human_handoffs',
  'store_users',
  'users_roles',
];

const expectedColumns = {
  stores: ['id', 'slug', 'name'],
  conversations: ['id', 'store_id', 'customer_id'],
  messages: ['id', 'conversation_id', 'store_id'],
  orders: ['id', 'store_id', 'conversation_id', 'status'],
  failed_events: ['id', 'store_id', 'error_message', 'created_at'],
  ai_tool_calls: ['id', 'store_id', 'tool_name', 'created_at'],
  handoff_tickets: ['id', 'store_id', 'conversation_id', 'status'],
  processed_messages: ['provider_message_id', 'conversation_id', 'processed_at'],
  order_idempotency_keys: ['id', 'store_id', 'key', 'status'],
  dead_letter_log: ['id', 'raw_input', 'error_message', 'created_at'],
  ai_settings: ['store_id', 'ai_enabled', 'updated_at'],
  human_handoffs: ['id', 'conversation_id', 'reason', 'requested_at'],
  store_users: ['id', 'store_id', 'user_id', 'role'],
  users_roles: ['id', 'store_id', 'user_id', 'role'],
};

const appRefsRaw = execFileSync('bash', ['-lc', "rg -o --no-filename \"from\\(\\s*['\\\"][a-zA-Z0-9_]+['\\\"]\\s*\\)\" app lib | sed -E \"s/.*['\\\"]([a-zA-Z0-9_]+)['\\\"].*/\\1/\" | sort -u"], { encoding: 'utf8' });
const appRefs = appRefsRaw.split('\n').map((s) => s.trim()).filter(Boolean);

const okTables = [];
const missingTables = [];
const columnGaps = [];
for (const table of requiredTables) {
  const actual = tableMap.get(table);
  if (!actual) {
    missingTables.push(table);
    continue;
  }
  okTables.push(table);
  const expected = expectedColumns[table] ?? [];
  if (expected.length > 0) {
    const actualCols = new Set(actual.columns.map((c) => c.column_name));
    const missingCols = expected.filter((c) => !actualCols.has(c));
    if (missingCols.length > 0) {
      columnGaps.push({ table, missingCols });
    }
  }
}

const specialFindings = [];
const lpr = tableMap.get('last_product_recommendations');
if (lpr) {
  const cols = new Set(lpr.columns.map((c) => c.column_name));
  if (!cols.has('index') && cols.has('recommendation_index')) {
    specialFindings.push('`last_product_recommendations` uses `recommendation_index` (not `index`). Older migration `20260429180000_last_product_recommendations.sql` assumes `index`, which explains replay conflict.');
  }
}

const rlsGaps = [];
for (const [name, t] of tableMap) {
  if (t.rls_enabled && (!t.policies || t.policies.length === 0)) {
    rlsGaps.push(name);
  }
}

const missingAppReferenced = appRefs.filter((t) => !tableMap.has(t));

const lines = [];
lines.push('# Schema Reconcile Report');
lines.push('');
lines.push(`- Date: ${date}`);
lines.push(`- Inventory file: ${path.relative(process.cwd(), invPath)}`);
lines.push(`- Tables in public schema: ${inventory.public_tables.length}`);
lines.push('');
lines.push('## OK Tables');
for (const t of okTables) lines.push(`- ${t}`);
lines.push('');
lines.push('## Missing Tables');
if (missingTables.length === 0) lines.push('- none');
for (const t of missingTables) lines.push(`- ${t}`);
lines.push('');
lines.push('## Missing Columns');
if (columnGaps.length === 0) lines.push('- none');
for (const g of columnGaps) lines.push(`- ${g.table}: ${g.missingCols.join(', ')}`);
lines.push('');
lines.push('## App Table References Missing In DB');
if (missingAppReferenced.length === 0) lines.push('- none');
for (const t of missingAppReferenced) lines.push(`- ${t}`);
lines.push('');
lines.push('## Migration Conflict Signals');
if (specialFindings.length === 0) lines.push('- none');
for (const f of specialFindings) lines.push(`- ${f}`);
lines.push('');
lines.push('## RLS/Policy Gaps');
if (rlsGaps.length === 0) lines.push('- none');
for (const t of rlsGaps) lines.push(`- ${t} has RLS enabled but no policies visible`);
lines.push('');
lines.push('## Recommended Forward-Only Fixes');
if (missingTables.length === 0 && columnGaps.length === 0 && missingAppReferenced.length === 0) {
  lines.push('- No schema drift requiring migration.');
} else {
  lines.push('- Create one idempotent reconciliation migration to add missing tables/columns/indexes only.');
  lines.push('- Do not drop or alter incompatible columns; keep forward-only fixes.');
  lines.push('- Keep existing `last_product_recommendations.recommendation_index` shape; avoid replaying older migration that expects `index`.');
}
lines.push('');
lines.push('## Pilot Readiness');
if (missingAppReferenced.length === 0 && missingTables.length === 0) {
  lines.push('- Safe for internal pilot from schema presence perspective.');
} else {
  lines.push('- Not ready until missing app-referenced tables are reconciled.');
}

fs.writeFileSync(outPath, lines.join('\n') + '\n');
console.log(outPath);
console.log(`missing_tables=${missingTables.length}`);
console.log(`missing_app_refs=${missingAppReferenced.length}`);
