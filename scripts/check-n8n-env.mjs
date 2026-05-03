#!/usr/bin/env node
/**
 * check-n8n-env.mjs
 * Validates that required n8n MCP and API environment variables are set.
 * Never prints secret values.
 */
import fs from 'node:fs';
import path from 'node:path';

const required = [
  { key: 'N8N_MCP_URL', validate: v => v.startsWith('https://') },
  { key: 'N8N_MCP_TOKEN', validate: null },
  { key: 'N8N_API_URL', validate: v => v.startsWith('https://') },
  { key: 'N8N_API_KEY', validate: null },
];

// Optionally load .env and .env.production if available
const envFiles = ['.env', '.env.production', '.env.local'];
for (const file of envFiles) {
  const fp = path.join(process.cwd(), file);
  if (fs.existsSync(fp)) {
    const content = fs.readFileSync(fp, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim();
      if (v && !process.env[k]) {
        process.env[k] = v;
      }
    }
  }
}

let exitCode = 0;
console.log('='.repeat(50));
console.log('N8N ENV CHECK');
console.log('='.repeat(50));

for (const { key, validate } of required) {
  const value = process.env[key];
  if (!value || !value.trim()) {
    console.log(`${key}: MISSING`);
    exitCode = 1;
    continue;
  }
  if (validate && !validate(value)) {
    console.log(`${key}: INVALID (must start with https://)`);
    exitCode = 1;
    continue;
  }
  console.log(`${key}: SET`);
}

console.log('='.repeat(50));
if (exitCode !== 0) {
  console.log('STATUS: FAIL — some required env vars are missing or invalid.');
} else {
  console.log('STATUS: PASS — all required env vars are set.');
}
console.log('='.repeat(50));
process.exit(exitCode);
