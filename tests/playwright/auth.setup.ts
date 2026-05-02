import path from "node:path";
import { test as setup, expect } from "@playwright/test";
import { attachConsoleAndNetworkTrackers, ensureDir } from "./helpers";

const authFile = path.join(process.cwd(), "tests/playwright/.auth/admin.json");

setup("authenticate admin dashboard user", async ({ page }) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL;
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  const missing = [
    ["PLAYWRIGHT_BASE_URL", baseURL],
    ["PLAYWRIGHT_ADMIN_EMAIL", email],
    ["PLAYWRIGHT_ADMIN_PASSWORD", password],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required Playwright auth env keys: ${missing.join(", ")}`);
  }

  const trackers = await attachConsoleAndNetworkTrackers(page);

  try {
    await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded" });
    await page.getByLabel("البريد الإلكتروني").fill(email!);
    await page.getByLabel("كلمة المرور").fill(password!);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();

    await page.waitForURL(/\/dashboard(\/command-center)?/, { timeout: 20_000 });
    await expect(page).toHaveURL(/\/dashboard(\/command-center)?/);

    await ensureDir(path.dirname(authFile));
    await page.context().storageState({ path: authFile });
  } catch (error) {
    await ensureDir(path.join(process.cwd(), "qa-artifacts", "playwright"));
    await page.screenshot({ path: path.join(process.cwd(), "qa-artifacts", "playwright", "auth-login-failure.png"), fullPage: true });
    if (trackers.consoleErrors.length > 0) {
      throw new Error(`Auth setup failed with console errors: ${trackers.consoleErrors.join(" | ")}`);
    }
    throw error;
  }
});
