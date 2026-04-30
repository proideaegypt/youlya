import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import packageJson from '@/package.json';

type BuildInfo = {
  appName: string;
  version: string;
  versionName: string | null;
  commit: string;
  branch: string;
  tag: string | null;
  builtAt: string;
  dirty: boolean;
};

function fallback(): BuildInfo {
  return {
    appName: 'Youlya AI Commerce OS',
    version: packageJson.version ?? '0.0.0',
    versionName: packageJson.config?.youlyaVersionName ?? null,
    commit: 'unknown',
    branch: 'unknown',
    tag: null,
    builtAt: new Date(0).toISOString(),
    dirty: false,
  };
}

export async function GET() {
  try {
    const p = path.join(process.cwd(), 'public', 'build-info.json');
    if (!fs.existsSync(p)) {
      return NextResponse.json(fallback());
    }

    const parsed = JSON.parse(fs.readFileSync(p, 'utf8')) as Partial<BuildInfo>;
    return NextResponse.json({
      appName: parsed.appName ?? 'Youlya AI Commerce OS',
      version: parsed.version ?? packageJson.version ?? '0.0.0',
      versionName: parsed.versionName ?? packageJson.config?.youlyaVersionName ?? null,
      commit: parsed.commit ?? 'unknown',
      branch: parsed.branch ?? 'unknown',
      tag: parsed.tag ?? null,
      builtAt: parsed.builtAt ?? new Date(0).toISOString(),
      dirty: Boolean(parsed.dirty),
    });
  } catch {
    return NextResponse.json(fallback());
  }
}
