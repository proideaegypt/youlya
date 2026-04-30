import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const outputPath = path.join(root, 'public', 'build-info.json');

function run(cmd, fallback = null) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return fallback;
  }
}

function isDirty() {
  const status = run('git status --porcelain', '');
  return Boolean(status && status.trim().length > 0);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const versionName = pkg?.config?.youlyaVersionName ?? null;

const buildInfo = {
  appName: 'Youlya AI Commerce OS',
  version: pkg.version ?? '0.0.0',
  versionName,
  commit: run('git rev-parse --short HEAD', 'unknown'),
  commitFull: run('git rev-parse HEAD', 'unknown'),
  branch: run('git branch --show-current', 'unknown'),
  tag: run('git tag --points-at HEAD', '') || run('git describe --tags --abbrev=0', null),
  builtAt: new Date().toISOString(),
  dirty: isDirty(),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(buildInfo, null, 2)}\n`, 'utf8');
console.log(`build info written: ${outputPath}`);
