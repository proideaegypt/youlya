#!/usr/bin/env node
/**
 * n8n-export-workflows.mjs
 * Exports a workflow from n8n API and writes sanitized JSON.
 * Never prints the API key.
 */
import fs from 'node:fs';
import path from 'node:path';

// Parse CLI args
const args = process.argv.slice(2);
let nameFilter = null;
let idFilter = null;
let outDir = path.join(process.cwd(), 'workflows');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && args[i + 1]) nameFilter = args[i + 1];
  if (args[i] === '--id' && args[i + 1]) idFilter = args[i + 1];
  if (args[i] === '--out' && args[i + 1]) outDir = path.resolve(args[i + 1]);
}

if (!nameFilter && !idFilter) {
  console.error('Usage: node scripts/n8n-export-workflows.mjs --name "Workflow Name" [--out workflows/]');
  console.error('       node scripts/n8n-export-workflows.mjs --id "workflow-id" [--out workflows/]');
  process.exit(1);
}

// Load env
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
  console.error('ERROR: N8N_API_URL and N8N_API_KEY must be set.');
  console.error('Run: npm run check:n8n:env');
  process.exit(1);
}

function normalizeUrl(url) {
  return url.replace(/\/$/, '');
}

async function fetchWorkflow(id) {
  const base = normalizeUrl(N8N_API_URL);
  const url = `${base}/api/v1/workflows/${id}`;
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
      console.error(`ERROR: N8N_API_KEY rejected (HTTP ${res.status})`);
      return null;
    }
    if (!res.ok) {
      console.error(`ERROR: n8n API returned HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`ERROR: Network error: ${err.message}`);
    return null;
  }
}

async function findWorkflowByName(name) {
  const base = normalizeUrl(N8N_API_URL);
  const listUrl = `${base}/api/v1/workflows`;
  try {
    const res = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const workflows = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    return workflows.find(w => w.name && w.name.toLowerCase().includes(name.toLowerCase())) || null;
  } catch {
    return null;
  }
}

let workflow = null;
if (idFilter) {
  console.log(`Fetching workflow by ID: ${idFilter}...`);
  workflow = await fetchWorkflow(idFilter);
} else {
  console.log(`Searching for workflow: "${nameFilter}"...`);
  const found = await findWorkflowByName(nameFilter);
  if (found) {
    console.log(`Found: ${found.name} (${found.id})`);
    workflow = await fetchWorkflow(found.id);
  }
}

if (!workflow) {
  console.error('ERROR: Workflow not found or API request failed.');
  process.exit(1);
}

// Sanitize: remove credentials objects
function sanitizeWorkflow(json) {
  const clone = JSON.parse(JSON.stringify(json));
  if (Array.isArray(clone.nodes)) {
    for (const node of clone.nodes) {
      if (node.credentials) {
        delete node.credentials;
      }
      // Also scrub any hardcoded apikey values in HTTP request nodes
      if (node.parameters && node.parameters.headerParameters && node.parameters.headerParameters.parameters) {
        for (const param of node.parameters.headerParameters.parameters) {
          if (param.name && param.name.toLowerCase() === 'apikey' && param.value && !param.value.includes('{{')) {
            param.value = '={{ $env.EVOLUTION_API_KEY }}';
          }
        }
      }
    }
  }
  return clone;
}

const sanitized = sanitizeWorkflow(workflow);
const safeName = (sanitized.name || 'workflow')
  .replace(/[^a-zA-Z0-9\s_-]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const fileName = `${safeName}.json`;
const filePath = path.join(outDir, fileName);

fs.mkdirSync(outDir, { recursive: true });

// Backup existing
if (fs.existsSync(filePath)) {
  const backup = `${filePath}.backup-${Date.now()}`;
  fs.copyFileSync(filePath, backup);
  console.log(`Backup created: ${backup}`);
}

fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2));

console.log('='.repeat(50));
console.log('N8N WORKFLOW EXPORT');
console.log('='.repeat(50));
console.log(`Name: ${sanitized.name}`);
console.log(`ID: ${sanitized.id}`);
console.log(`Active: ${sanitized.active}`);
console.log(`Nodes: ${Array.isArray(sanitized.nodes) ? sanitized.nodes.length : '?'}`);
console.log(`Sanitized: credentials removed, apikey values env-referenced`);
console.log(`Output: ${filePath}`);
console.log('='.repeat(50));
