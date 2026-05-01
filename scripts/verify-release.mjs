import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const versionName = pkg?.config?.youlyaVersionName;

const errors = [];

if (!/^\d+\.\d+\.\d+$/.test(String(version ?? ''))) errors.push('package.json version is not semver');
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(versionName ?? ''))) errors.push('config.youlyaVersionName missing or not kebab-case');

const readmePath = path.join(root, 'README.md');
const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
if (!/## Current Release/.test(readme)) errors.push('README missing "## Current Release" block');
if (!new RegExp(`\|\\s*Version\\s*\\|\\s*v${version.replace(/\./g, '\\.')}\\s*\\|`).test(readme)) {
  errors.push('README Current Release version does not match package.json');
}
if (!new RegExp(`\|\\s*Version Name\\s*\\|\\s*${versionName}\\s*\\|`).test(readme)) {
  errors.push('README Current Release version name does not match package.json');
}

const releaseFileRel = `RELEASES/v${version}-${versionName}.md`;
const releaseFile = path.join(root, releaseFileRel);
if (!fs.existsSync(releaseFile)) {
  errors.push(`Release file missing: ${releaseFileRel}`);
} else {
  const body = fs.readFileSync(releaseFile, 'utf8');
  const required = ['# Release: v', '## Task', '## What Changed', '## Files Changed', '## Tests Required', '## Status'];
  for (const key of required) {
    if (!body.includes(key)) errors.push(`Release file missing section: ${key}`);
  }
}

const progress = fs.existsSync(path.join(root, 'PROGRESS-LOG.md'))
  ? fs.readFileSync(path.join(root, 'PROGRESS-LOG.md'), 'utf8')
  : '';
if (!progress.includes(`v${version}`)) {
  errors.push(`PROGRESS-LOG.md does not mention current version v${version}`);
}

const buildInfoPath = path.join(root, 'public', 'build-info.json');
if (fs.existsSync(buildInfoPath)) {
  try {
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    if (String(buildInfo.version ?? '') !== String(version)) {
      errors.push('public/build-info.json version does not match package.json');
    }
  } catch {
    errors.push('public/build-info.json is invalid JSON');
  }
}

if (errors.length > 0) {
  console.log('FAIL');
  for (const e of errors) console.log(`- ${e}`);
  process.exit(1);
}

console.log('PASS');
console.log(`- version: v${version}`);
console.log(`- versionName: ${versionName}`);
console.log(`- releaseFile: ${releaseFileRel}`);
