import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "https://admin.youlya365.com";

export default defineConfig({
  testDir: "./tests/playwright",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: "qa-artifacts/playwright",
  reporter: [["list"], ["json", { outputFile: "qa-artifacts/playwright/report.json" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: false,
  },
  projects: [
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "dashboard-ux-swarm",
      testMatch: /dashboard-ux-swarm\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: { storageState: "tests/playwright/.auth/admin.json" },
    },
    {
      name: "dashboard-functional-swarm",
      testMatch: /dashboard-functional-swarm\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: { storageState: "tests/playwright/.auth/admin.json" },
    },
    {
      name: "dashboard-a11y-rtl-swarm",
      testMatch: /dashboard-a11y-rtl-swarm\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: { storageState: "tests/playwright/.auth/admin.json" },
    },
    {
      name: "dashboard-api-health-swarm",
      testMatch: /dashboard-api-health-swarm\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: { storageState: "tests/playwright/.auth/admin.json" },
    },
  ],
});
