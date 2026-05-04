import { test, expect } from "@playwright/test";

const dashboardApis = [
  "/api/dashboard/stats",
  "/api/dashboard/conversations",
  "/api/dashboard/orders",
  "/api/dashboard/logs",
  "/api/dashboard/settings",
  "/api/dashboard/pilot-control",
  "/api/dashboard/products/overview",
  "/api/dashboard/products/catalog",
  "/api/dashboard/products/variants",
  "/api/dashboard/products/sync-health",
  "/api/dashboard/products/mapping-inspector",
  "/api/dashboard/products-intelligence/overview",
  "/api/dashboard/products-intelligence/products",
  "/api/dashboard/products-intelligence/channels",
];

test("health endpoint status ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(payload.status).toBe("ok");
  expect(payload.checks?.supabase).toBe("ok");
});

test("build-info endpoint has version metadata", async ({ request }) => {
  const response = await request.get("/api/build-info");
  expect(response.ok()).toBe(true);
  const payload = await response.json();
  expect(typeof payload.version).toBe("string");
  expect(Object.hasOwn(payload, "commit")).toBe(true);
});

test("dashboard APIs return auth errors or success, never 500", async ({ request }) => {
  for (const endpoint of dashboardApis) {
    const response = await request.get(endpoint);
    const status = response.status();
    expect([200, 401, 403]).toContain(status);
  }
});

test("dashboard pages should not trigger 500 responses", async ({ page }) => {
  test.setTimeout(120_000);
  const serverErrors: string[] = [];

  page.on("response", (response) => {
    if (response.status() >= 500 && response.url().includes("/api/")) {
      serverErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  for (const route of ["/dashboard/command-center", "/dashboard/inbox", "/dashboard/products", "/dashboard/products-intelligence", "/dashboard/orders", "/dashboard/logs", "/dashboard/settings", "/dashboard/statistics", "/dashboard/security", "/dashboard/devices", "/dashboard/profile"]) {
    await page.goto(route, { waitUntil: "networkidle" });
  }

  expect(serverErrors).toEqual([]);
});
