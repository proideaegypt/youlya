#!/usr/bin/env node
import fs from 'node:fs';

const input = fs.readFileSync(0, 'utf8');
const lines = input
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const trackedPrefixes = new Set(['M', 'A', 'D', 'R', 'C', 'U', 'T']);
const requiredIgnored = ['.env', '.env.production'];

const statusByFile = new Map();
for (const line of lines) {
  const status = line.slice(0, 2);
  const file = line.slice(3).trim();
  if (!file) continue;
  statusByFile.set(file, status);
}

const presentEnvFiles = fs
  .readdirSync(process.cwd(), { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => name === '.env' || name.startsWith('.env.'))
  .filter((name) => name !== '.env.example');

const problems = [];

for (const file of presentEnvFiles) {
  const status = statusByFile.get(file);
  if (!status) {
    problems.push(`${file} exists but was not reported by git status --ignored`);
    continue;
  }

  const first = status[0];
  const second = status[1];
  if (trackedPrefixes.has(first) || trackedPrefixes.has(second)) {
    problems.push(`${file} is tracked by git (${status})`);
    continue;
  }

  if (status !== '!!' && status !== '??') {
    problems.push(`${file} has unsupported git status (${status})`);
  }
}

for (const file of requiredIgnored) {
  const status = statusByFile.get(file);
  if (!status) {
    problems.push(`${file} was not found in git status output`);
  } else if (status !== '!!') {
    problems.push(`${file} must be ignored (expected !!, got ${status})`);
  }
}

for (const file of presentEnvFiles) {
  const status = statusByFile.get(file) ?? '--';
  const human = status === '!!' ? 'ignored' : status === '??' ? 'untracked' : `status ${status}`;
  console.log(`${file}: ${human}`);
}

if (problems.length > 0) {
  console.error('\nENV tracking check failed:');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log('\nENV tracking check passed.');
