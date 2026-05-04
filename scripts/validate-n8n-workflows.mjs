#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const workflowDir = process.env.WORKFLOWS_DIR || path.join(process.cwd(), 'workflows');
const canonicalDir = path.join(process.cwd(), 'n8n', 'workflows');

const canonicalName = 'youlya-whatsapp-main.json';
const canonicalPath = path.join(canonicalDir, canonicalName);
const syncWorkflowName = 'youlya-daily-shopify-product-sync.json';
const syncWorkflowPath = path.join(canonicalDir, syncWorkflowName);
const haidiDraftName = 'youlya-whatsapp-main-haidi-draft.json';
const haidiDraftPath = path.join(canonicalDir, haidiDraftName);

const requiredEnvKeys = [
  'APP_INTERNAL_URL',
  'INTERNAL_API_SECRET',
  'EVOLUTION_API_URL',
  'EVOLUTION_API_KEY',
  'EVOLUTION_INSTANCE',
];

const secretPatterns = [
  /[0-9A-F]{8,}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4,}-[0-9A-F]{8,}/gi,
  /shpat_[a-f0-9]{32}/gi,
  /shpca_[a-f0-9]{32}/gi,
  /sk-[a-zA-Z0-9]{20,}/g,
  /"value"\s*:\s*"Bearer\s+[A-Za-z0-9_.-]{20,}"/gi,
  /"name"\s*:\s*"apikey"[^}]{0,200}"value"\s*:\s*"[0-9A-Za-z_-]{20,}"/gi,
  /"value"\s*:\s*"[0-9A-F]{30,}"/gi,
  /https?:\/\/[^\s"]+:[^\s"]+@[^\s"]+/gi,
  /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  /"N8N_API_KEY"\s*:\s*"[^"]{10,}"/gi,
  /"N8N_MCP_TOKEN"\s*:\s*"[^"]{10,}"/gi,
];

function findNodesByType(json, typeRegex) {
  if (!Array.isArray(json.nodes)) return [];
  return json.nodes.filter(n => typeRegex.test(n.type));
}

function hasHardcodedSecrets(json) {
  const text = JSON.stringify(json);
  const matches = [];
  for (const pattern of secretPatterns) {
    const found = text.match(pattern);
    if (found && found.length > 0) {
      const suspicious = found.filter(v =>
        !v.includes('$env') &&
        !v.includes('{{') &&
        !v.includes('}}') &&
        !v.includes('${')
      );
      if (suspicious.length > 0) {
        matches.push(...suspicious.slice(0, 3));
      }
    }
  }
  return matches;
}

function validateCanonicalWorkflow(filePath) {
  const result = {
    name: path.basename(filePath),
    present: fs.existsSync(filePath),
    validJson: false,
    nodeCount: 0,
    webhookPath: null,
    hasTurnEndpoint: false,
    envRefsFound: [],
    hasSendText: false,
    hardcodedSecrets: [],
    errors: [],
    warnings: [],
  };

  if (!result.present) {
    result.errors.push('Canonical workflow not found');
    return result;
  }

  let json;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    json = JSON.parse(raw);
    result.validJson = true;
  } catch (err) {
    result.errors.push(`Invalid JSON: ${err.message}`);
    return result;
  }

  if (Array.isArray(json.nodes)) {
    result.nodeCount = json.nodes.length;
  } else {
    result.errors.push('Missing nodes array');
  }

  // Webhook path check
  const webhooks = findNodesByType(json, /^n8n-nodes-base\.webhook$/);
  if (webhooks.length === 0) {
    result.errors.push('No Webhook node found');
  } else {
    for (const wh of webhooks) {
      const p = wh.parameters?.path || '';
      if (p.includes('youlya-whatsapp')) {
        result.webhookPath = p;
        break;
      }
    }
    if (!result.webhookPath) {
      const paths = webhooks.map(wh => wh.parameters?.path || '(none)');
      result.errors.push(`Webhook path mismatch. Found: ${paths.join(', ')}`);
    }
  }

  // Turn endpoint check
  const text = JSON.stringify(json);
  if (text.includes('/api/internal/messages/turn')) {
    result.hasTurnEndpoint = true;
  } else {
    result.errors.push('Missing /api/internal/messages/turn endpoint call');
  }

  // Env references check
  for (const key of requiredEnvKeys) {
    if (text.includes(key)) {
      result.envRefsFound.push(key);
    }
  }
  const missing = requiredEnvKeys.filter(k => !result.envRefsFound.includes(k));
  if (missing.length > 0) {
    result.warnings.push(`Missing env references: ${missing.join(', ')}`);
  }

  // Send text check
  const httpNodes = findNodesByType(json, /^n8n-nodes-base\.httpRequest$/);
  const sendTextNodes = httpNodes.filter(n => {
    const url = JSON.stringify(n.parameters?.url || '');
    return url.includes('sendText') || url.includes('sendMedia');
  });
  if (sendTextNodes.length > 0) {
    result.hasSendText = true;
  } else {
    const evoNodes = findNodesByType(json, /evolution/i);
    if (evoNodes.length > 0) {
      result.hasSendText = true;
    } else {
      result.warnings.push('No Evolution sendText/sendMedia HTTP node found');
    }
  }

  // Secret scan
  result.hardcodedSecrets = hasHardcodedSecrets(json);
  if (result.hardcodedSecrets.length > 0) {
    result.errors.push(`Hardcoded secrets detected (${result.hardcodedSecrets.length} occurrences)`);
  }

  return result;
}

function validateSyncWorkflow(filePath) {
  const result = {
    name: path.basename(filePath),
    present: fs.existsSync(filePath),
    validJson: false,
    nodeCount: 0,
    hasScheduleTrigger: false,
    hasSyncEndpoint: false,
    envRefsFound: [],
    hardcodedSecrets: [],
    errors: [],
    warnings: [],
  };

  if (!result.present) {
    result.errors.push('Sync workflow not found');
    return result;
  }

  let json;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    json = JSON.parse(raw);
    result.validJson = true;
  } catch (err) {
    result.errors.push(`Invalid JSON: ${err.message}`);
    return result;
  }

  if (Array.isArray(json.nodes)) {
    result.nodeCount = json.nodes.length;
  }

  const text = JSON.stringify(json);

  // Schedule trigger check
  if (text.includes('scheduleTrigger') || text.includes('Schedule Trigger')) {
    result.hasScheduleTrigger = true;
  } else {
    result.warnings.push('No schedule trigger found');
  }

  // Sync endpoint check
  if (text.includes('/api/internal/shopify/sync-products')) {
    result.hasSyncEndpoint = true;
  } else {
    result.errors.push('Missing /api/internal/shopify/sync-products endpoint call');
  }

  // Env refs check
  for (const key of requiredEnvKeys) {
    if (text.includes(key)) {
      result.envRefsFound.push(key);
    }
  }

  // Secret scan
  result.hardcodedSecrets = hasHardcodedSecrets(json);
  if (result.hardcodedSecrets.length > 0) {
    result.errors.push(`Hardcoded secrets detected (${result.hardcodedSecrets.length} occurrences)`);
  }

  return result;
}

function validateHaidiDraftWorkflow(filePath) {
  const result = {
    name: path.basename(filePath),
    present: fs.existsSync(filePath),
    validJson: false,
    active: true,
    hasTurnEndpoint: false,
    hasHaidiNode: false,
    hasValidatorNode: false,
    hasShopifyDirectNodes: false,
    hardcodedSecrets: [],
    errors: [],
    warnings: [],
  };

  if (!result.present) {
    result.warnings.push('Haidi draft workflow not found');
    return result;
  }

  let json;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    json = JSON.parse(raw);
    result.validJson = true;
  } catch (err) {
    result.errors.push(`Invalid JSON: ${err.message}`);
    return result;
  }

  result.active = json.active === true;
  if (result.active) {
    result.errors.push('Haidi draft workflow must be inactive (active=false)');
  }

  const text = JSON.stringify(json);

  if (text.includes('/api/internal/messages/turn')) {
    result.hasTurnEndpoint = true;
  } else {
    result.errors.push('Missing /api/internal/messages/turn endpoint call');
  }

  if (text.includes('Haidi AI Sales Agent')) {
    result.hasHaidiNode = true;
  } else {
    result.warnings.push('Missing Haidi AI Sales Agent node');
  }

  if (text.includes('Validate Haidi Output')) {
    result.hasValidatorNode = true;
  } else {
    result.warnings.push('Missing Validate Haidi Output node');
  }

  // Check for direct Shopify mutation nodes
  const shopifyNodeTypes = ['shopify', 'shopifyApi', 'shopifyGraphql'];
  for (const type of shopifyNodeTypes) {
    if (text.includes(type)) {
      result.hasShopifyDirectNodes = true;
      result.errors.push(`Direct Shopify node found: ${type}`);
    }
  }

  result.hardcodedSecrets = hasHardcodedSecrets(json);
  if (result.hardcodedSecrets.length > 0) {
    result.errors.push(`Hardcoded secrets detected (${result.hardcodedSecrets.length} occurrences)`);
  }

  return result;
}

function checkForRawExportsInRepo() {
  const violations = [];
  if (!fs.existsSync(workflowDir)) return violations;

  const entries = fs.readdirSync(workflowDir);
  for (const entry of entries) {
    if (entry === 'README.md') continue;
    const fullPath = path.join(workflowDir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isFile() && entry.endsWith('.json')) {
      violations.push(fullPath);
    }
  }
  return violations;
}

// Main execution
const rawExportFiles = checkForRawExportsInRepo();
const canonicalResult = validateCanonicalWorkflow(canonicalPath);
const syncResult = validateSyncWorkflow(syncWorkflowPath);
const haidiDraftResult = validateHaidiDraftWorkflow(haidiDraftPath);

const hasRawExports = rawExportFiles.length > 0;
const hasCanonicalErrors = canonicalResult.errors.length > 0;
const hasSyncErrors = syncResult.errors.length > 0;
const hasHaidiDraftErrors = haidiDraftResult.errors.length > 0;

let status = 'PASS';
if (hasRawExports) {
  status = 'FAIL';
} else if (hasCanonicalErrors || hasSyncErrors || hasHaidiDraftErrors) {
  status = 'FAIL';
} else if (!canonicalResult.present) {
  status = 'BLOCKED';
}

console.log('='.repeat(60));
console.log('N8N WORKFLOW VALIDATION RESULT');
console.log('='.repeat(60));
console.log(`Status: ${status}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('');
console.log('REQUIRED ENV KEYS (by name only):');
for (const k of requiredEnvKeys) {
  console.log(`  - ${k}`);
}
console.log('');

console.log('CANONICAL WORKFLOW:');
const icon = canonicalResult.errors.length === 0 ? '✅' : '❌';
console.log(`  ${icon} ${canonicalResult.name}`);
console.log(`     Present: ${canonicalResult.present}`);
console.log(`     Valid JSON: ${canonicalResult.validJson}`);
console.log(`     Nodes: ${canonicalResult.nodeCount}`);
console.log(`     Webhook path: ${canonicalResult.webhookPath || 'N/A'}`);
console.log(`     Has turn endpoint: ${canonicalResult.hasTurnEndpoint}`);
console.log(`     Env refs found: ${canonicalResult.envRefsFound.join(', ') || 'none'}`);
console.log(`     Has send text: ${canonicalResult.hasSendText}`);
console.log(`     Hardcoded secrets: ${canonicalResult.hardcodedSecrets.length > 0 ? 'YES (' + canonicalResult.hardcodedSecrets.length + ')' : 'none'}`);
if (canonicalResult.errors.length > 0) {
  for (const e of canonicalResult.errors) console.log(`     ERROR: ${e}`);
}
if (canonicalResult.warnings.length > 0) {
  for (const w of canonicalResult.warnings) console.log(`     WARNING: ${w}`);
}

console.log('');
console.log('SYNC WORKFLOW:');
const syncIcon = syncResult.errors.length === 0 ? '✅' : '❌';
console.log(`  ${syncIcon} ${syncResult.name}`);
console.log(`     Present: ${syncResult.present}`);
console.log(`     Valid JSON: ${syncResult.validJson}`);
console.log(`     Nodes: ${syncResult.nodeCount}`);
console.log(`     Has schedule trigger: ${syncResult.hasScheduleTrigger}`);
console.log(`     Has sync endpoint: ${syncResult.hasSyncEndpoint}`);
console.log(`     Env refs found: ${syncResult.envRefsFound.join(', ') || 'none'}`);
console.log(`     Hardcoded secrets: ${syncResult.hardcodedSecrets.length > 0 ? 'YES (' + syncResult.hardcodedSecrets.length + ')' : 'none'}`);
if (syncResult.errors.length > 0) {
  for (const e of syncResult.errors) console.log(`     ERROR: ${e}`);
}
if (syncResult.warnings.length > 0) {
  for (const w of syncResult.warnings) console.log(`     WARNING: ${w}`);
}

console.log('');
console.log('HAIDI DRAFT WORKFLOW:');
const haidiIcon = haidiDraftResult.errors.length === 0 ? '✅' : '❌';
console.log(`  ${haidiIcon} ${haidiDraftResult.name}`);
console.log(`     Present: ${haidiDraftResult.present}`);
console.log(`     Valid JSON: ${haidiDraftResult.validJson}`);
console.log(`     Active: ${haidiDraftResult.active}`);
console.log(`     Has turn endpoint: ${haidiDraftResult.hasTurnEndpoint}`);
console.log(`     Has Haidi node: ${haidiDraftResult.hasHaidiNode}`);
console.log(`     Has validator node: ${haidiDraftResult.hasValidatorNode}`);
console.log(`     Has Shopify direct nodes: ${haidiDraftResult.hasShopifyDirectNodes}`);
console.log(`     Hardcoded secrets: ${haidiDraftResult.hardcodedSecrets.length > 0 ? 'YES (' + haidiDraftResult.hardcodedSecrets.length + ')' : 'none'}`);
if (haidiDraftResult.errors.length > 0) {
  for (const e of haidiDraftResult.errors) console.log(`     ERROR: ${e}`);
}
if (haidiDraftResult.warnings.length > 0) {
  for (const w of haidiDraftResult.warnings) console.log(`     WARNING: ${w}`);
}

console.log('');
console.log('RAW EXPORT QUARANTINE CHECK:');
if (hasRawExports) {
  console.log(`  ❌ FAIL: Raw workflow exports found in repo (${rawExportFiles.length} files):`);
  for (const f of rawExportFiles) {
    console.log(`     - ${path.relative(process.cwd(), f)}`);
  }
  console.log('     ACTION: Move these files outside the repo (e.g., /root/youlya-private/n8n-raw-exports/)');
} else {
  console.log('  ✅ No raw workflow exports found in repo');
}

console.log('');
console.log('SUMMARY:');
console.log(`  Canonical: ${canonicalResult.present ? 'present' : 'MISSING'}`);
console.log(`  Canonical errors: ${canonicalResult.errors.length}`);
console.log(`  Canonical warnings: ${canonicalResult.warnings.length}`);
console.log(`  Sync workflow: ${syncResult.present ? 'present' : 'MISSING'}`);
console.log(`  Sync errors: ${syncResult.errors.length}`);
console.log(`  Haidi draft: ${haidiDraftResult.present ? 'present' : 'MISSING'}`);
console.log(`  Haidi draft errors: ${haidiDraftResult.errors.length}`);
console.log(`  Raw exports in repo: ${rawExportFiles.length}`);
console.log('='.repeat(60));

if (status === 'FAIL' || status === 'BLOCKED') process.exit(1);
