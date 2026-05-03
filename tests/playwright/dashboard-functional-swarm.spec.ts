import { test, expect } from "@playwright/test";

const SAFE_MUTATIONS = process.env.TEST_SAFE_DASHBOARD_MUTATIONS === "true";

test("dashboard navigation links work", async ({ page }) => {
  await page.goto("/dashboard/command-center", { waitUntil: "domcontentloaded" });

  const links = [
    { name: "لوحة التحكم", url: /\/dashboard\/command-center/ },
    { name: "الرسائل", url: /\/dashboard\/inbox/ },
    { name: "المنتجات والمخزون", url: /\/dashboard\/products/ },
    { name: "الإحصائيات", url: /\/dashboard\/statistics/ },
    { name: "الأمان", url: /\/dashboard\/security/ },
    { name: "القنوات والمنتجات", url: /\/dashboard\/devices/ },
    { name: "الملف الشخصي", url: /\/dashboard\/profile/ },
    { name: "الطلبات", url: /\/dashboard\/orders/ },
    { name: "السجلات", url: /\/dashboard\/logs/ },
    { name: "الإعدادات", url: /\/dashboard\/settings/ },
  ];

  for (const link of links) {
    await page.getByRole("link", { name: link.name }).click();
    await expect(page).toHaveURL(link.url);
  }
});

test("command center shows AI/Kill switch context", async ({ page }) => {
  await page.goto("/dashboard/command-center");
  const hasHeading = await page.getByRole("heading").filter({ hasText: /YOULYA|لوحة التحكم|Command Center/ }).isVisible();
  expect(hasHeading, "Command center heading should be visible").toBe(true);
  const hasKillSwitch = await page.locator("body").filter({ hasText: /Kill switch|النظام يعمل|Kill Switch/ }).isVisible();
  expect(hasKillSwitch, "Kill switch context should be visible").toBe(true);
});

test("inbox page shows list or meaningful empty state", async ({ page }) => {
  await page.goto("/dashboard/inbox");
  await expect(page.getByText("طلبات التحويل للبشر")).toBeVisible();
  const hasEmpty = await page.getByText("لا يوجد تحويلات مفتوحة").isVisible().catch(() => false);
  const hasItems = (await page.locator("li.rounded-xl.border").count()) > 0;
  expect(hasEmpty || hasItems).toBe(true);
});

test("orders and logs pages render non-blank states", async ({ page }) => {
  await page.goto("/dashboard/orders");
  await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();

  await page.goto("/dashboard/logs");
  await expect(page.getByRole("heading", { name: "السجلات" })).toBeVisible();
  await expect(page.locator("span").filter({ hasText: "AI Tool" })).toBeVisible();
});

test("settings page controls inspected safely", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await expect(page.getByRole("heading", { name: "الإعدادات" })).toBeVisible();

  if (!SAFE_MUTATIONS) {
    test.info().annotations.push({ type: "safety", description: "Dangerous mutations disabled (TEST_SAFE_DASHBOARD_MUTATIONS!=true)" });
    return;
  }

  const toggleButtons = page.getByRole("button");
  const count = await toggleButtons.count();
  if (count > 0) {
    await expect(toggleButtons.first()).toBeVisible();
  }
});
