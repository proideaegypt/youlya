import path from "node:path";
import { test, expect } from "@playwright/test";
import {
  attachConsoleAndNetworkTrackers,
  ensureDir,
  markdownFromRouteReport,
  taskRoot,
  writeJson,
  writeMarkdown,
} from "./helpers";

const routes = [
  "/dashboard/command-center",
  "/dashboard/inbox",
  "/dashboard/products",
  "/dashboard/products-intelligence",
  "/dashboard/orders",
  "/dashboard/logs",
  "/dashboard/settings",
  "/dashboard/statistics",
  "/dashboard/security",
  "/dashboard/devices",
  "/dashboard/profile",
];

for (const route of routes) {
  test(`ux audit ${route}`, async ({ page }) => {
    const trackers = await attachConsoleAndNetworkTrackers(page);

    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const screenshotDir = path.join(taskRoot(), "ux", "screenshots");
    await ensureDir(screenshotDir);
    const screenshotFile = path.join(screenshotDir, `${route.replaceAll("/", "_").replace(/^_/, "")}.png`);
    await page.screenshot({ path: screenshotFile, fullPage: true });

    const h1 = page.locator("h1").first();
    const hasH1 = (await h1.count()) > 0;
    const heading = hasH1 ? ((await h1.textContent({ timeout: 1000 }))?.trim() ?? "") : "";
    const title = await page.title();
    const bodyText = (await page.locator("body").innerText()).trim();

    const sidebarVisible = await page.locator("aside").first().isVisible().catch(() => false);
    const contentVisible = await page.locator("main").first().isVisible().catch(() => false);
    const footerBuildIdentityVisible = await page.locator("footer").filter({ hasText: "Youlya AI Commerce OS" }).first().isVisible().catch(() => false);

    const direction = await page.evaluate(() => {
      return document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "";
    });

    const hasArabicText = /[\u0600-\u06FF]/.test(bodyText);

    const hasHorizontalOverflow = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return overflow > 20;
    });

    const hasErrorOverlay = await page.locator("text=Application error").first().isVisible().catch(() => false);
    const shellPresent = sidebarVisible && contentVisible;
    const hasWeakEmptyState =
      /صفحة\s+(الطلبات|الإعدادات)/.test(bodyText) || /coming soon|placeholder/i.test(bodyText);

    const uxIssues: string[] = [];
    if (!hasH1) uxIssues.push("Missing h1/main page heading");
    if (hasWeakEmptyState) uxIssues.push("Weak empty state");
    if (!footerBuildIdentityVisible) uxIssues.push("Missing build identity");
    if (!hasArabicText) uxIssues.push("Missing Arabic labels");
    if (hasHorizontalOverflow) uxIssues.push("Horizontal overflow");

    const routeLooksBlank = bodyText.length <= 20 || (!shellPresent && !heading && title.length === 0);
    if (routeLooksBlank) uxIssues.push("Blank-looking page");

    const report = {
      route,
      heading,
      hasH1,
      title,
      bodyTextLength: bodyText.length,
      sidebarVisible,
      contentVisible,
      shellPresent,
      footerBuildIdentityVisible,
      hasArabicText,
      direction,
      hasHorizontalOverflow,
      hasErrorOverlay,
      hasWeakEmptyState,
      consoleErrors: trackers.consoleErrors,
      realFailedRequests: trackers.realFailedRequests,
      ignoredNetworkNoise: trackers.ignoredNetworkNoise,
      screenshot: screenshotFile,
      uxIssues,
    };

    const routeSlug = route.replaceAll("/", "_").replace(/^_/, "");
    const outDir = path.join(taskRoot(), "ux");
    await writeJson(path.join(outDir, `${routeSlug}.json`), report);
    await writeMarkdown(path.join(outDir, `${routeSlug}.md`), markdownFromRouteReport(report));

    expect(bodyText.length, "Page body is blank").toBeGreaterThan(20);
    expect(hasErrorOverlay, "Next.js error overlay visible").toBe(false);
    expect(sidebarVisible, "Sidebar should be visible on desktop").toBe(true);
    expect(contentVisible, "Content area should be visible").toBe(true);
    expect(shellPresent, "Dashboard shell/sidebar should be visible").toBe(true);
    expect(hasHorizontalOverflow, "Horizontal overflow >20px").toBe(false);
    expect(trackers.consoleErrors, "Uncaught console errors").toEqual([]);
    expect(trackers.realFailedRequests, "Unexpected failed network requests").toEqual([]);
  });
}
