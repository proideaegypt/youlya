#!/usr/bin/env node
/**
 * n8n-list-workflows.mjs
 * Lists workflows from n8n API using safe, read-only access.
 * Never prints the API key.
 */
import fs from 'node:fs';
import path from 'node:path';

const today = new Date().toISOString().slice(0, 10);
const outDir = path.join(process.cwd(), 'qa-artifacts', 'tasks', today, 'wire-n8n-api-and-mcp-agent-tooling');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'n8n-workflows.json');

// Load env from files if needed
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
      if (v && !process.env[k]) process.env[k] = v;
    }
  }
}

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_URL || !N8N_API_KEY) {
  console.error('ERROR: N8N_API_URL and N8N_API_KEY must be set in environment.');
  console.error('Run: npm run check:n8n:env');
  process.exit(1);
}

function normalizeUrl(url) {
  return url.replace(/\/$/, '');
}

async function fetchWorkflows() {
  const base = normalizeUrl(N8N_API_URL);
  const paths = [`${base}/api/v1/workflows`, `${base}/rest/workflows`, `${base}/workflows`];

  for (const url of paths) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.status === 401 || res.status === 403) {
        console.error(`ERROR: N8N_API_KEY rejected or lacks workflow access (HTTP ${res.status}) at ${url}`);
        continue;
      }
      if (!res.ok) {
        console.error(`ERROR: n8n API returned HTTP ${res.status} at ${url}`);
        continue;
      }

      const data = await res.json();
      // n8n API returns { data: [...] } or [...]
      const workflows = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      return workflows;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error(`ERROR: Request timed out at ${url}`);
      } else {
        console.error(`ERROR: Network error at ${url}: ${err.message}`);
      }
    }
  }
  return null;
}

const workflows = await fetchWorkflows();

if (!workflows) {
  console.error('ERROR: Could not retrieve workflows from any known n8n API path.');
  process.exit(1);
}

const searchTerms = ['Whatsapp Youlya', 'WhatsApp Youlya', 'Sales Assistant', 'SubWorkflow', 'youlya-whatsapp'];
const safeWorkflows = workflows.map(w => ({
  id: w.id || w._id || null,
  name: w.name || '(unnamed)',
  active: !!w.active,
  updatedAt: w.updatedAt || w.updated_at || null,
  nodeCount: Array.isArray(w.nodes) ? w.nodes.length : null,
  tags: Array.isArray(w.tags) ? w.tags.map(t => typeof t === 'string' ? t : t.name) : [],
}));

const matches = safeWorkflows.filter(w =>
  searchTerms.some(term => w.name.toLowerCase().includes(term.toLowerCase()))
);

const output = {
  timestamp: new Date().toISOString(),
  apiUrl: N8N_API_URL.replace(/\/$/, ''),
  totalWorkflows: safeWorkflows.length,
  workflows: safeWorkflows,
  matchedWorkflows: matches,
  searchTerms,
};

fs.writeFileSync(outFile, JSON.stringify(output, null, 2));

console.log('='.repeat(50));
console.log('N8N WORKFLOW LIST');
console.log('='.repeat(50));
console.log(`API URL: ${N8N_API_URL.replace(/\/$/, '')}`);
console.log(`Total workflows: ${safeWorkflows.length}`);
console.log(`Matched workflows: ${matches.length}`);
console.log('');

for (const w of safeWorkflows) {
  const icon = w.active ? '🟢' : '⚪';
  const matchIcon = matches.some(m => m.id === w.id) ? ' ⭐' : '';
  console.log(`${icon} ${w.name}${matchIcon}`);
  console.log(`   ID: ${w.id} | Nodes: ${w.nodeCount ?? '?'} | Updated: ${w.updatedAt ?? '?'}`);
}

console.log('');
console.log(`Output saved: ${outFile}`);
console.log('='.repeat(50));
