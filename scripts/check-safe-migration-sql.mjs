#!/usr/bin/env node
import fs from 'node:fs';

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node scripts/check-safe-migration-sql.mjs <migration.sql>');
  process.exit(2);
}
if (!fs.existsSync(targetPath)) {
  console.error(`File not found: ${targetPath}`);
  process.exit(2);
}

const raw = fs.readFileSync(targetPath, 'utf8');

function stripComments(sql) {
  // Remove block comments while preserving newlines for line mapping.
  let s = sql.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  // Remove line comments while preserving line breaks.
  s = s.replace(/--.*$/gm, '');
  return s;
}

const sanitized = stripComments(raw);
const lines = sanitized.split(/\r?\n/);

const checks = [
  { name: 'drop table', re: /\bdrop\s+table\b/i },
  { name: 'drop column', re: /\bdrop\s+column\b/i },
  { name: 'truncate', re: /\btruncate\b/i },
  { name: 'delete from', re: /\bdelete\s+from\b/i },
  { name: 'cascade', re: /\bcascade\b/i },
  { name: 'alter column', re: /\balter\s+column\b/i },
  { name: 'alter table ... drop', re: /\balter\s+table\b[\s\S]*?\bdrop\b/i },
  { name: 'rename table', re: /\brename\s+table\b/i },
  { name: 'rename column', re: /\brename\s+column\b/i },
];

let failed = false;
for (const { name, re } of checks) {
  if (name === 'alter table ... drop') {
    const whole = sanitized;
    if (re.test(whole)) {
      failed = true;
      const firstIdx = whole.search(re);
      const line = whole.slice(0, firstIdx).split(/\r?\n/).length;
      console.error(`FORBIDDEN: ${name} at line ${line}`);
    }
    continue;
  }

  for (let i = 0; i < lines.length; i += 1) {
    if (re.test(lines[i])) {
      failed = true;
      console.error(`FORBIDDEN: ${name} at line ${i + 1}`);
      break;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('PASS: migration SQL safety check');
