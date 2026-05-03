#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoreDirs = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'coverage',
  'qa-artifacts',
]);
const ignoreFiles = [
  '.env',
  '.env.local',
  '.env.production',
  'public/build-info.json',
  '.mcp.json',
];
const ignorePrefixes = ['.env.production.backup', '.env.'];
const ignoreFilePatterns = [/^package-lock\.json$/, /^pnpm-lock\.yaml$/, /^yarn\.lock$/];
const suspicious = [
  { name: 'OpenAI key', re: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'Shopify admin token', re: /shpat_[A-Za-z0-9_]{20,}/ },
  { name: 'Supabase service role JWT', re: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/ },
  { name: 'Generic private key', re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];
const allowPlaceholder = /replace-with|your-project|example|localhost|dummy|mock|changeme/i;
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) scanFile(full);
  }
}

function scanFile(file) {
  const rel = path.relative(root, file);
  const normalizedRel = rel.replace(/\\/g, '/');
  const base = path.basename(rel);
  if (ignoreFiles.includes(base)) return;
  if (ignorePrefixes.some((prefix) => base.startsWith(prefix))) {
    if (base !== '.env.example') return;
  }
  if (ignoreFilePatterns.some((pattern) => pattern.test(base))) return;
  if (normalizedRel.startsWith('qa-artifacts/')) return;
  if (/\.(png|jpg|jpeg|gif|webp|zip|pdf|ico)$/i.test(rel)) return;
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (allowPlaceholder.test(line)) continue;
    for (const rule of suspicious) {
      if (rule.re.test(line)) findings.push(`${rel}:${i + 1} possible ${rule.name}`);
    }
  }
}

walk(root);

if (findings.length > 0) {
  console.error('Potential secrets found:');
  for (const f of findings) console.error(`- ${f}`);
  process.exit(1);
}
console.log('Secret scan passed: no obvious live secrets found.');
