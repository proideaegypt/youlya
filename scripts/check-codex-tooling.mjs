#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const today = new Date().toISOString().slice(0, 10);
const reportPath = path.join(
  process.cwd(),
  "qa-artifacts",
  "tasks",
  today,
  "codex-skills-setup",
  "tooling",
  "tooling-report.json",
);

function run(cmd, args = []) {
  try {
    const output = execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    return { ok: true, output };
  } catch (error) {
    const stderr = error && typeof error === "object" && "stderr" in error ? String(error.stderr || "").trim() : "";
    return { ok: false, output: stderr || "not available" };
  }
}

function checkBinary(name, versionArgs = ["--version"]) {
  const probe = run("which", [name]);
  if (!probe.ok) return { installed: false, details: "missing" };
  const version = run(name, versionArgs);
  return { installed: true, details: version.ok ? version.output : "installed (version unavailable)" };
}

const checks = {
  essential: {
    node: checkBinary("node"),
    npm: checkBinary("npm"),
    git: checkBinary("git"),
  },
  recommended: {
    docker: checkBinary("docker"),
    docker_compose: run("docker", ["compose", "version"]),
    supabase: checkBinary("supabase"),
    shopify: checkBinary("shopify"),
    npx: checkBinary("npx"),
    jq: checkBinary("jq"),
    rg: checkBinary("rg"),
    gitleaks: checkBinary("gitleaks"),
  },
  playwright: {
    playwright_test_cli: run("npx", ["playwright", "--version"]),
    playwright_agent_cli_npx: run("npx", ["playwright-cli", "--help"]),
    playwright_agent_cli_global: run("playwright-cli", ["--help"]),
  },
};

const normalized = {
  essential: Object.fromEntries(
    Object.entries(checks.essential).map(([k, v]) => [k, v.installed ? { status: "found", details: v.details } : { status: "missing", details: v.details }]),
  ),
  recommended: Object.fromEntries(
    Object.entries(checks.recommended).map(([k, v]) => {
      if ("installed" in v) return [k, v.installed ? { status: "found", details: v.details } : { status: "missing", details: v.details }];
      return [k, v.ok ? { status: "found", details: v.output } : { status: "missing", details: v.output }];
    }),
  ),
  playwright: {
    playwright_test_cli: checks.playwright.playwright_test_cli.ok
      ? { status: "found", details: checks.playwright.playwright_test_cli.output }
      : { status: "missing", details: checks.playwright.playwright_test_cli.output },
    playwright_agent_cli_npx: checks.playwright.playwright_agent_cli_npx.ok
      ? { status: "found", details: checks.playwright.playwright_agent_cli_npx.output.split("\n")[0] || "available" }
      : { status: "missing", details: checks.playwright.playwright_agent_cli_npx.output || "not available" },
    playwright_agent_cli_global: checks.playwright.playwright_agent_cli_global.ok
      ? { status: "found", details: checks.playwright.playwright_agent_cli_global.output.split("\n")[0] || "available" }
      : { status: "missing", details: checks.playwright.playwright_agent_cli_global.output || "not available" },
  },
  generated_at: new Date().toISOString(),
};

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify(normalized, null, 2) + "\n");

function summarizeGroup(name, group) {
  console.log(`\n${name}:`);
  for (const [tool, result] of Object.entries(group)) {
    if (tool === "generated_at") continue;
    console.log(`- ${tool}: ${result.status}`);
  }
}

console.log("Codex tooling check summary");
summarizeGroup("Essential", normalized.essential);
summarizeGroup("Recommended", normalized.recommended);
summarizeGroup("Playwright", normalized.playwright);
console.log(`\nReport: ${reportPath}`);
