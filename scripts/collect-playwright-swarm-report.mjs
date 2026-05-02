#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const date = new Date().toISOString().slice(0, 10);
const taskSlug = process.env.PLAYWRIGHT_SWARM_TASK_SLUG || "fix-playwright-ux-swarm-signal-quality";
const taskRoot = path.join(
  process.cwd(),
  "qa-artifacts",
  "tasks",
  date,
  taskSlug,
);
const uxDir = path.join(taskRoot, "ux");
const reportJsonPath = path.join(process.cwd(), "qa-artifacts", "playwright", "report.json");
const finalPath = path.join(taskRoot, "FINAL_QA_REPORT.md");

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function listIssues(uxReports) {
  const uxIssues = [];
  const consoleIssues = [];
  const realNetworkIssues = [];
  const ignoredNetworkNoise = [];
  const missingH1Routes = [];

  for (const report of uxReports) {
    for (const issue of report.uxIssues || []) {
      uxIssues.push(`- ${report.route}: ${issue}`);
    }

    if (!report.sidebarVisible || !report.contentVisible || report.hasHorizontalOverflow || report.hasErrorOverlay) {
      uxIssues.push(`- ${report.route}: sidebar=${report.sidebarVisible}, content=${report.contentVisible}, overflow=${report.hasHorizontalOverflow}, overlay=${report.hasErrorOverlay}`);
    }
    if (report.hasH1 === false) {
      missingH1Routes.push(`- ${report.route}`);
    }

    for (const err of report.consoleErrors || []) {
      consoleIssues.push(`- ${report.route}: ${err}`);
    }

    for (const req of report.realFailedRequests || []) {
      realNetworkIssues.push(`- ${report.route}: [${req.status}] ${req.method} ${req.url}`);
    }

    for (const req of report.ignoredNetworkNoise || []) {
      ignoredNetworkNoise.push(`- ${report.route}: [${req.status}] ${req.method} ${req.url}`);
    }
  }

  return { uxIssues, consoleIssues, realNetworkIssues, ignoredNetworkNoise, missingH1Routes };
}

async function main() {
  await fs.mkdir(taskRoot, { recursive: true });

  let playwrightSummary = null;
  if (await exists(reportJsonPath)) {
    const raw = await fs.readFile(reportJsonPath, "utf8");
    const data = JSON.parse(raw);
    playwrightSummary = data?.stats || null;
  }

  const uxReports = [];
  if (await exists(uxDir)) {
    const files = (await fs.readdir(uxDir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const payload = JSON.parse(await fs.readFile(path.join(uxDir, file), "utf8"));
      uxReports.push(payload);
    }
  }

  const { uxIssues, consoleIssues, realNetworkIssues, ignoredNetworkNoise, missingH1Routes } = listIssues(uxReports);

  const screenshots = uxReports.map((r) => `- ${r.route}: ${r.screenshot}`);
  const a11yRtlResponsiveIssues = uxReports
    .filter((r) => !r.hasArabicText || (r.direction && r.direction !== "rtl"))
    .map((r) => `- ${r.route}: hasArabicText=${r.hasArabicText}, direction=${r.direction || "unset"}`);

  const apiHealthIssues = [];
  if (!playwrightSummary) {
    apiHealthIssues.push("- Playwright JSON report not found; API swarm execution may be skipped.");
  }

  const summaryLines = [
    "# Dashboard Playwright Swarm Final QA Report",
    "",
    `- Date: ${date}`,
    `- Task: ${taskSlug}`,
    `- Playwright summary: ${playwrightSummary ? `expected=${playwrightSummary.expected}, passed=${playwrightSummary.expected - playwrightSummary.unexpected}, failed=${playwrightSummary.unexpected}` : "not available"}`,
    "",
    "## Executive summary",
    `- UX route reports generated: ${uxReports.length}`,
    `- Failed tests count: ${playwrightSummary ? playwrightSummary.unexpected : "unknown"}`,
    `- UX issues: ${uxIssues.length}`,
    `- Console errors: ${consoleIssues.length}`,
    `- Real network failures: ${realNetworkIssues.length}`,
    `- Ignored network noise count: ${ignoredNetworkNoise.length}`,
    `- Missing h1 routes: ${missingH1Routes.length}`,
    "",
    "## Screenshots index",
    ...(screenshots.length > 0 ? screenshots : ["- No UX screenshots found."]),
    "",
    "## UX issues",
    ...(uxIssues.length > 0 ? uxIssues : ["- No critical UX layout failures detected by swarm checks."]),
    "",
    "## Functional issues",
    "- Review functional swarm test output in Playwright report for any failed assertions.",
    "",
    "## Console errors",
    ...(consoleIssues.length > 0 ? consoleIssues : ["- None captured in UX route audits."]),
    "",
    "## Real network failures",
    ...(realNetworkIssues.length > 0 ? realNetworkIssues : ["- None captured in UX route audits."]),
    "",
    "## Ignored framework/network noise",
    ...(ignoredNetworkNoise.length > 0 ? ignoredNetworkNoise : ["- None captured in UX route audits."]),
    "",
    "## Missing h1 list",
    ...(missingH1Routes.length > 0 ? missingH1Routes : ["- None."]),
    "",
    "## A11Y/RTL/responsive issues",
    ...(a11yRtlResponsiveIssues.length > 0 ? a11yRtlResponsiveIssues : ["- No RTL/A11Y direction issues flagged in UX route reports."]),
    "",
    "## API/health issues",
    ...(apiHealthIssues.length > 0 ? apiHealthIssues : ["- No API/health issues detected by collector inputs."]),
    "",
    "## UX issue priority",
    "- P0: crash, auth loop, 500 API, blank page",
    "- P1: missing heading, broken layout, inaccessible nav",
    "- P2: weak empty states, visual polish, spacing",
    "",
    "## Pilot blockers",
    "- Any 500 API responses, auth redirects loops, or missing build footer should block pilot.",
    "",
    "## Non-blocking improvements",
    "- Enrich empty states with guidance and relevant next actions.",
    "- Add page-level skeleton/loading states and error boundaries for data-heavy views.",
    "",
  ];

  await fs.writeFile(finalPath, `${summaryLines.join("\n")}\n`, "utf8");
  console.log(`Generated ${finalPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
