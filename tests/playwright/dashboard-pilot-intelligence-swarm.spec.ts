import { test, expect } from "@playwright/test";

test("pilot control room shows safety and message panels", async ({ page }) => {
  await page.goto("/dashboard/pilot-control", { waitUntil: "networkidle" });
  const sidebarToggle = page.getByRole("button", { name: /Toggle sidebar|Collapse sidebar|Expand sidebar|Open menu/ }).first();
  if (await sidebarToggle.isVisible().catch(() => false)) {
    await sidebarToggle.click();
  }

  await expect(page.getByRole("heading", { name: /غرفة الطيار للواتساب|Pilot control room/ })).toBeVisible();
  await expect(page.getByText("Safety blockers")).toBeVisible();
  await expect(page.getByText(/last 10 inbound messages|آخر 10 inbound messages/i)).toBeVisible();
  await expect(page.getByText(/last 10 outbound messages|آخر 10 outbound messages/i)).toBeVisible();
});

test("products intelligence shows product photos and channel insights", async ({ page }) => {
  await page.goto("/dashboard/products-intelligence", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: /ذكاء المنتجات|Products Intelligence/ })).toBeVisible();
  await expect(page.getByText("معرض المنتجات المتزامنة")).toBeVisible();
  await expect(page.getByText("أداء القنوات")).toBeVisible();
  await expect(page.getByText(/لا توجد بيانات بعد|Live|Empty/)).toBeVisible();
});
