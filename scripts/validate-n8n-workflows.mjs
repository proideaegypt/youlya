#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const workflowDir = process.env.WORKFLOWS_DIR || path.join(process.cwd(), 'workflows');
const expected = [
  'Whatsapp Youlya (4).json',
  'Sales Assistant - SubWorkflow.json',
];
const result = {
  status: 'PASS',
  workflowDir,
  expected,
  present: [],
  missing: [],
  errors: [],
  warnings: [],
};

for (const name of expected) {
  const file = path.join(workflowDir, name);
  if (!fs.existsSync(file)) {
    result.missing.push(name);
    continue;
  }
  result.present.push(name);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    result.errors.push(`${name}: invalid JSON: ${err.message}`);
    continue;
  }
  if (!Array.isArray(json.nodes)) result.errors.push(`${name}: missing nodes array`);
  else {
    for (const [idx, node] of json.nodes.entries()) {
      if (!node.id) result.errors.push(`${name}: node ${idx} missing id`);
      if (!node.name) result.errors.push(`${name}: node ${idx} missing name`);
      if (!node.type) result.errors.push(`${name}: node ${idx} missing type`);
      const nodeText = JSON.stringify(node);
      if (/shpat_|sk-[A-Za-z0-9_-]{20,}|Bearer\s+[A-Za-z0-9_.-]{20,}/.test(nodeText)) {
        result.errors.push(`${name}: node ${node.name || idx} appears to contain hardcoded secret`);
      }
    }
  }
}

if (result.missing.length > 0) {
  result.status = 'BLOCKED';
  result.warnings.push('n8n workflow JSON files are not included yet. Place them in workflows/ and re-run this script.');
}
if (result.errors.length > 0) result.status = 'FAIL';

console.log(JSON.stringify(result, null, 2));
if (result.status === 'FAIL') process.exit(1);
// BLOCKED is not a process failure for the starter pack because files are intentionally absent.
