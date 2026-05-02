import path from "node:path";
import { test, expect } from "@playwright/test";
import { ensureDir, taskRoot } from "./helpers";

const pages = ["/dashboard/command-center", "/dashboard/inbox", "/dashboard/statistics", "/dashboard/security", "/dashboard/devices", "/dashboard/profile", "/dashboard/orders", "/dashboard/logs", "/dashboard/settings"];

const viewports = [
  { name: "desktop", size: { width: 1440, height: 900 } },
  { name: "tablet", size: { width: 768, height: 1024 } },
  { name: "mobile", size: { width: 390, height: 844 } },
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: viewport.size });

    for (const route of pages) {
      test(`a11y/rtl ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");

        const screenshotDir = path.join(taskRoot(), "a11y", "screenshots", viewport.name);
        await ensureDir(screenshotDir);
        await page.screenshot({
          path: path.join(screenshotDir, `${route.replaceAll("/", "_").replace(/^_/, "")}.png`),
          fullPage: true,
        });

        const dir = await page.evaluate(() => document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "");
        const navVisible = await page.locator("aside, nav").first().isVisible().catch(() => false);
        const navToggleVisible = await page.getByRole("button", { name: "Toggle sidebar" }).first().isVisible().catch(() => false);

        expect(navVisible || navToggleVisible, "Navigation should be visible or reachable").toBe(true);
        expect(["", "rtl", "ltr"]).toContain(dir);

        const unlabeledInputs = await page
          .locator("input, textarea, select")
          .evaluateAll((nodes) => {
            return nodes.filter((node) => {
              const element = node as HTMLInputElement;
              const hasAria = Boolean(element.getAttribute("aria-label") || element.getAttribute("aria-labelledby"));
              const id = element.id;
              const hasLabel = id ? Boolean(document.querySelector(`label[for='${id}']`)) : false;
              return !hasAria && !hasLabel;
            }).length;
          });
        expect(unlabeledInputs).toBe(0);

        const unnamedButtons = await page
          .locator("button")
          .evaluateAll((nodes) =>
            nodes.filter((n) => {
              const el = n as HTMLButtonElement;
              const hasText = !!(el.innerText || "").trim();
              const hasAriaLabel = !!el.getAttribute("aria-label")?.trim();
              return !hasText && !hasAriaLabel;
            }).length
          );
        expect(unnamedButtons).toBe(0);

        const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth > 20);
        expect(hasHorizontalOverflow, "Mobile/tablet layout overflow >20px").toBe(false);
      });
    }
  });
}
