#!/usr/bin/env node
import fs from 'node:fs';

const file = '.env.production';
const requiredKeys = [
  'APP_URL',
  'NEXT_PUBLIC_APP_URL',
  'INTERNAL_API_SECRET',
  'SHOPIFY_STORE_DOMAIN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

if (!fs.existsSync(file)) {
  console.log(`${file} not found. Skipping production env key check.`);
  process.exit(0);
}

const content = fs.readFileSync(file, 'utf8');
const present = new Set();
for (const raw of content.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx <= 0) continue;
  present.add(line.slice(0, idx).trim());
}

const missing = requiredKeys.filter((key) => !present.has(key));
const hasShopifyToken =
  present.has('SHOPIFY_ADMIN_API_TOKEN') ||
  present.has('SHOPIFY_ADMIN_ACCESS_TOKEN') ||
  present.has('SHOPIFY_ADMIN_API_KEY');
if (!hasShopifyToken) {
  missing.push('SHOPIFY_ADMIN_API_TOKEN|SHOPIFY_ADMIN_ACCESS_TOKEN|SHOPIFY_ADMIN_API_KEY');
}
console.log(`Checked ${file} keys only (values not printed).`);
console.log(`Required keys: ${requiredKeys.length + 1}`);
console.log(`Present keys: ${requiredKeys.length + 1 - missing.length}`);

if (missing.length > 0) {
  console.error('Missing required keys:');
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

console.log('Production env key check passed.');
