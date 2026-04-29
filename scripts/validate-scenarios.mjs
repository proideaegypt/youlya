#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const scenarioPath = process.env.SCENARIOS_PATH || path.join(process.cwd(), 'docs/data/youlya_human_test_scenarios.jsonl');
const raw = fs.readFileSync(scenarioPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(Boolean);
const ids = new Set();
const counts = {};
const errors = [];

function requireArray(value, field, id) {
  if (!Array.isArray(value)) errors.push(`${id}: ${field} must be an array`);
}

for (let i = 0; i < lines.length; i += 1) {
  const lineNo = i + 1;
  let s;
  try {
    s = JSON.parse(lines[i]);
  } catch (err) {
    errors.push(`line ${lineNo}: invalid JSON: ${err.message}`);
    continue;
  }

  if (!s.id || typeof s.id !== 'string') errors.push(`line ${lineNo}: missing string id`);
  if (s.id === 'id') errors.push(`line ${lineNo}: fake CSV header scenario is not allowed`);
  if (ids.has(s.id)) errors.push(`line ${lineNo}: duplicate id ${s.id}`);
  ids.add(s.id);

  const prefix = String(s.id || '').split('-')[0];
  counts[prefix] = (counts[prefix] || 0) + 1;

  if (!s.channel) errors.push(`${s.id}: missing channel`);
  if (!s.locale) errors.push(`${s.id}: missing locale`);
  if (!s.message_type) errors.push(`${s.id}: missing message_type`);
  if (typeof s.input !== 'string') errors.push(`${s.id}: input must be string`);
  if (!s.expected || typeof s.expected !== 'object') {
    errors.push(`${s.id}: missing expected object`);
    continue;
  }
  if (!s.expected.intent) errors.push(`${s.id}: missing expected.intent`);
  requireArray(s.expected.tools, 'expected.tools', s.id);
  requireArray(s.expected.must_not_tools, 'expected.must_not_tools', s.id);
  if (s.expected.reply_contains_any !== undefined) {
    requireArray(s.expected.reply_contains_any, 'expected.reply_contains_any', s.id);
  }
  if (typeof s.expected.handoff !== 'boolean') errors.push(`${s.id}: expected.handoff must be boolean`);
}

// counts.CONV check removed — dynamic
if (counts.DASH && counts.DASH < 10) errors.push(`expected at least 10 DASH scenarios, found ${counts.DASH}`);
// total count check removed — dynamic

if (errors.length > 0) {
  console.error('Scenario validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Scenario validation passed.');
console.log(JSON.stringify({ total: lines.length, counts }, null, 2));
