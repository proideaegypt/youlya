import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--task') out.task = argv[++i];
    else if (a === '--type') out.type = argv[++i];
  }
  return out;
}

function run(cmd, fallback = '') {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return fallback;
  }
}

function toVersionName(task) {
  let s = task.toLowerCase();
  s = s.replace(/^(phase-[a-z0-9]+-|fix-|feat-)+/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/--+/g, '-');
  return s || 'task-release';
}

function bump(version, type) {
  const m = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) throw new Error(`Invalid semver in package.json: ${version}`);
  let [maj, min, pat] = m.slice(1).map(Number);
  if (type === 'patch') pat += 1;
  else if (type === 'minor') { min += 1; pat = 0; }
  else if (type === 'major') { maj += 1; min = 0; pat = 0; }
  else throw new Error(`Invalid --type: ${type}`);
  return `${maj}.${min}.${pat}`;
}

function upsertCurrentRelease(readme, block) {
  const marker = /^## Current Release[\s\S]*?(?=\n##\s|$)/m;
  if (marker.test(readme)) return readme.replace(marker, block.trimEnd());

  const firstH1End = readme.indexOf('\n');
  if (firstH1End === -1) return `${readme}\n\n${block}\n`;
  return `${readme.slice(0, firstH1End + 1)}\n${block}\n${readme.slice(firstH1End + 1)}`;
}

const { task, type } = parseArgs(process.argv);
if (!task || !type) {
  console.error('Usage: node scripts/release-task.mjs --task "task-slug" --type patch|minor|major');
  process.exit(1);
}

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const readmePath = path.join(root, 'README.md');
const progressPath = path.join(root, 'PROGRESS-LOG.md');
const worktimePath = path.join(root, 'worktime.md');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const oldVersion = pkg.version;
const newVersion = bump(oldVersion, type);
const versionName = toVersionName(task);
pkg.version = newVersion;
pkg.config = { ...(pkg.config ?? {}), youlyaVersionName: versionName };
fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

const releaseFile = `RELEASES/v${newVersion}-${versionName}.md`;
const changedFiles = run('git status --short | awk "{print $2}"', '')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const releaseBody = `# Release: v${newVersion} — ${versionName}

## Task
${task}

## Release Type
${type}

## What Changed
- TODO: Fill with actual implemented changes for this task.

## Files Changed
${changedFiles.length ? changedFiles.map((f) => `- ${f}`).join('\n') : '- (no staged/working changes detected)'}

## Tests Required
- npm run typecheck
- npm run lint
- npm test
- npm run validate:scenarios
- npm run scan:secrets
- npm run build

## Deployment Notes
- Must pass verify before deploy.
- Must show version in dashboard/login footer.

## Status
PENDING
`;
fs.mkdirSync(path.dirname(path.join(root, releaseFile)), { recursive: true });
fs.writeFileSync(path.join(root, releaseFile), releaseBody);

const releaseBlock = `## Current Release

| Field | Value |
|---|---|
| Version | v${newVersion} |
| Version Name | ${versionName} |
| Task | ${task} |
| Release File | ${releaseFile} |
`;
const readme = fs.readFileSync(readmePath, 'utf8');
fs.writeFileSync(readmePath, upsertCurrentRelease(readme, releaseBlock));

const date = new Date().toISOString().slice(0, 10);
const progressEntry = `\n## ${date} — ${task}\n\nDate: ${date}\nPhase:\nTask: ${task}\nVersion: v${newVersion}\nVersion Name: ${versionName}\nFiles changed:\nCommands run:\nTests passed:\nTests failed/skipped:\nBlockers:\nNext step:\n`;
fs.appendFileSync(progressPath, progressEntry);

const worktimeEntry = `\nPROMPT TBD ${date}\nRelease prep for task ${task} (v${newVersion}, ${versionName}).\n\nRESULT TBD ${date}\nSTATUS: PENDING\nRelease file generated: ${releaseFile}\n`;
fs.appendFileSync(worktimePath, worktimeEntry);

if (fs.existsSync(path.join(root, 'scripts/write-build-info.mjs'))) {
  run('node scripts/write-build-info.mjs', '');
}

console.log(JSON.stringify({ oldVersion, newVersion, versionName, releaseFile }, null, 2));
