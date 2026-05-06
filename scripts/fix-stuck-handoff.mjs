#!/usr/bin/env node
import { spawn } from "node:child_process";

const child = spawn("npx", ["tsx", "scripts/fix-stuck-handoff.ts", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 1));
