import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

export function taskDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function taskRoot(): string {
  const taskSlug = process.env.PLAYWRIGHT_SWARM_TASK_SLUG || "dashboard-playwright-qa-swarm-and-n8n-manual-test-support";
  return path.join(
    process.cwd(),
    "qa-artifacts",
    "tasks",
    taskDate(),
    taskSlug,
  );
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function writeMarkdown(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function attachConsoleAndNetworkTrackers(page: Page) {
  const consoleErrors: string[] = [];
  const realFailedRequests: Array<{ url: string; method: string; status: number; statusText: string }> = [];
  const ignoredNetworkNoise: Array<{ url: string; method: string; status: number; statusText: string }> = [];
  const ignoredNetworkReasons: string[] = [];

  function isIgnorableRequestFailure(failure: { url: string; status: number; statusText: string }) {
    const lowerStatusText = failure.statusText.toLowerCase();
    const isRscRequest = failure.url.includes("?_rsc=") || failure.url.includes("&_rsc=");
    const isAborted = lowerStatusText.includes("net::err_aborted") || lowerStatusText.includes("aborted");
    const isFavicon404 = failure.status === 404 && failure.url.includes("favicon");

    if (isFavicon404) return { ignore: true, reason: "favicon-404" };
    if (isRscRequest && (isAborted || failure.status === 0)) return { ignore: true, reason: "next-rsc-prefetch-abort" };
    return { ignore: false, reason: "" };
  }

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("response", (response) => {
    const status = response.status();
    if (status >= 400) {
      const url = response.url();
      const isAllowedStatic404 = status === 404 && (url.includes("/_next/static/") || url.includes("favicon"));
      if (!isAllowedStatic404) {
        const failure = {
          url,
          method: response.request().method(),
          status,
          statusText: response.statusText(),
        };
        const ignoreCheck = isIgnorableRequestFailure(failure);
        if (ignoreCheck.ignore) {
          ignoredNetworkNoise.push(failure);
          ignoredNetworkReasons.push(`${ignoreCheck.reason}: ${failure.method} ${failure.url}`);
        } else {
          realFailedRequests.push(failure);
        }
      }
    }
  });

  page.on("requestfailed", (request) => {
    const failure = {
      url: request.url(),
      method: request.method(),
      status: 0,
      statusText: request.failure()?.errorText ?? "requestfailed",
    };
    const ignoreCheck = isIgnorableRequestFailure(failure);
    if (ignoreCheck.ignore) {
      ignoredNetworkNoise.push(failure);
      ignoredNetworkReasons.push(`${ignoreCheck.reason}: ${failure.method} ${failure.url}`);
    } else {
      realFailedRequests.push(failure);
    }
  });

  return {
    consoleErrors,
    realFailedRequests,
    ignoredNetworkNoise,
    ignoredNetworkReasons,
  };
}

export function markdownFromRouteReport(report: {
  route: string;
  heading: string;
  hasH1?: boolean;
  title: string;
  bodyTextLength?: number;
  sidebarVisible: boolean;
  contentVisible: boolean;
  shellPresent?: boolean;
  footerBuildIdentityVisible: boolean;
  hasArabicText: boolean;
  direction: string;
  hasHorizontalOverflow: boolean;
  consoleErrors: string[];
  realFailedRequests: Array<{ url: string; method: string; status: number; statusText: string }>;
  ignoredNetworkNoise: Array<{ url: string; method: string; status: number; statusText: string }>;
  uxIssues: string[];
  screenshot: string;
}) {
  const lines = [
    `# UX Route Report: ${report.route}`,
    "",
    `- route: ${report.route}`,
    `- title: ${report.title || "(empty)"}`,
    `- h1Present: ${report.hasH1 === undefined ? "unknown" : report.hasH1 ? "yes" : "no"}`,
    `- heading: ${report.heading || "(none)"}`,
    `- bodyTextLength: ${report.bodyTextLength ?? "unknown"}`,
    `- shellSidebarPresent: ${report.shellPresent === undefined ? "unknown" : report.shellPresent ? "yes" : "no"}`,
    `- sidebarVisible: ${report.sidebarVisible}`,
    `- contentVisible: ${report.contentVisible}`,
    `- footerBuildIdentityVisible: ${report.footerBuildIdentityVisible}`,
    `- hasArabicText: ${report.hasArabicText}`,
    `- direction: ${report.direction || "unknown"}`,
    `- hasHorizontalOverflow(>20px): ${report.hasHorizontalOverflow}`,
    `- screenshot: ${report.screenshot}`,
    `- consoleErrorCount: ${report.consoleErrors.length}`,
    `- realFailedRequestCount: ${report.realFailedRequests.length}`,
    `- ignoredNetworkNoiseCount: ${report.ignoredNetworkNoise.length}`,
    "",
  ];

  if (report.uxIssues.length > 0) {
    lines.push("## UX Issues", "");
    for (const issue of report.uxIssues) lines.push(`- ${issue}`);
    lines.push("");
  }

  if (report.consoleErrors.length > 0) {
    lines.push("## Console Errors", "");
    for (const err of report.consoleErrors) lines.push(`- ${err}`);
    lines.push("");
  }

  if (report.realFailedRequests.length > 0) {
    lines.push("## Real Failed Requests", "");
    for (const req of report.realFailedRequests) {
      lines.push(`- [${req.status}] ${req.method} ${req.url} (${req.statusText})`);
    }
    lines.push("");
  }

  if (report.ignoredNetworkNoise.length > 0) {
    lines.push("## Ignored Framework/Network Noise", "");
    for (const req of report.ignoredNetworkNoise) {
      lines.push(`- [${req.status}] ${req.method} ${req.url} (${req.statusText})`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
