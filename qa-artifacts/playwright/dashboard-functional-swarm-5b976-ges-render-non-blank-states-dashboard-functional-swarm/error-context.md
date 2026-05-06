# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-functional-swarm.spec.ts >> orders and logs pages render non-blank states
- Location: tests/playwright/dashboard-functional-swarm.spec.ts:50:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'الطلبات' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'الطلبات' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic "YOULYA HOME WEAR logo" [ref=e7]:
          - img "YOULYA HOME WEAR logo" [ref=e8]
        - heading "تسجيل الدخول" [level=1] [ref=e9]
        - paragraph [ref=e10]: YOULYA HOME WEAR Dashboard
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: البريد الإلكتروني
          - textbox "البريد الإلكتروني" [ref=e14]:
            - /placeholder: you@example.com
        - generic [ref=e15]:
          - generic [ref=e16]: كلمة المرور
          - textbox "كلمة المرور" [ref=e17]:
            - /placeholder: ••••••••
        - button "تسجيل الدخول" [ref=e18]
    - paragraph [ref=e20]: Youlya AI Commerce OS · v2.23.3 finish-user-management-update-deactivate-invite-flow · commit unknown · built 2026-05-06 04:34 · production
  - alert [ref=e21]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const SAFE_MUTATIONS = process.env.TEST_SAFE_DASHBOARD_MUTATIONS === "true";
  4   | 
  5   | test("dashboard navigation links work", async ({ page }) => {
  6   |   await page.goto("/dashboard/command-center", { waitUntil: "domcontentloaded" });
  7   |   const sidebarToggle = page.getByRole("button", { name: /Expand sidebar|Collapse sidebar/ }).first();
  8   |   if (await sidebarToggle.isVisible().catch(() => false)) {
  9   |     await sidebarToggle.click();
  10  |   }
  11  | 
  12  |   const links = [
  13  |     { name: "لوحة التحكم", url: /\/dashboard\/command-center/ },
  14  |     { name: "غرفة التحكم التجريبي", url: /\/dashboard\/pilot-control/ },
  15  |     { name: "التحويل البشري", url: /\/dashboard\/handoff/ },
  16  |     { name: "الرسائل", url: /\/dashboard\/inbox/ },
  17  |     { name: "المنتجات والمخزون", url: /\/dashboard\/products/ },
  18  |     { name: "ذكاء المنتجات", url: /\/dashboard\/products-intelligence/ },
  19  |     { name: "الإحصائيات", url: /\/dashboard\/statistics/ },
  20  |     { name: "الأمان", url: /\/dashboard\/security/ },
  21  |     { name: "القنوات والمنتجات", url: /\/dashboard\/devices/ },
  22  |     { name: "الملف الشخصي", url: /\/dashboard\/profile/ },
  23  |     { name: "الطلبات", url: /\/dashboard\/orders/ },
  24  |     { name: "السجلات", url: /\/dashboard\/logs/ },
  25  |     { name: "الإعدادات", url: /\/dashboard\/settings/ },
  26  |   ];
  27  | 
  28  |   for (const link of links) {
  29  |     await page.getByRole("link", { name: link.name }).click();
  30  |     await expect(page).toHaveURL(link.url);
  31  |   }
  32  | });
  33  | 
  34  | test("command center shows AI/Kill switch context", async ({ page }) => {
  35  |   await page.goto("/dashboard/command-center");
  36  |   const hasHeading = await page.getByRole("heading").filter({ hasText: /YOULYA|لوحة التحكم|Command Center/ }).isVisible();
  37  |   expect(hasHeading, "Command center heading should be visible").toBe(true);
  38  |   const hasKillSwitch = await page.locator("body").filter({ hasText: /Kill switch|النظام يعمل|Kill Switch/ }).isVisible();
  39  |   expect(hasKillSwitch, "Kill switch context should be visible").toBe(true);
  40  | });
  41  | 
  42  | test("inbox page shows list or meaningful empty state", async ({ page }) => {
  43  |   await page.goto("/dashboard/inbox");
  44  |   await expect(page.getByText("طلبات التحويل للبشر")).toBeVisible();
  45  |   const hasEmpty = await page.getByText("لا يوجد تحويلات مفتوحة").isVisible().catch(() => false);
  46  |   const hasItems = (await page.locator("li.rounded-xl.border").count()) > 0;
  47  |   expect(hasEmpty || hasItems).toBe(true);
  48  | });
  49  | 
  50  | test("orders and logs pages render non-blank states", async ({ page }) => {
  51  |   await page.goto("/dashboard/orders");
> 52  |   await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  53  | 
  54  |   await page.goto("/dashboard/logs");
  55  |   await expect(page.getByRole("heading", { name: "السجلات" })).toBeVisible();
  56  |   await expect(page.locator("span").filter({ hasText: "AI Tool" })).toBeVisible();
  57  | });
  58  | 
  59  | test("pilot control shows health and safety counters", async ({ page }) => {
  60  |   await page.goto("/dashboard/pilot-control");
  61  |   const sidebarToggle = page.getByRole("button", { name: /Expand sidebar|Collapse sidebar/ }).first();
  62  |   if (await sidebarToggle.isVisible().catch(() => false)) {
  63  |     await sidebarToggle.click();
  64  |   }
  65  | 
  66  |   await expect(page.getByRole("heading", { name: /غرفة الطيار للواتساب|Pilot control room/ })).toBeVisible();
  67  |   await expect(page.getByText("الصحة العامة")).toBeVisible();
  68  |   await expect(page.getByText("Workflow & safety")).toBeVisible();
  69  |   await expect(page.getByText("Safety blockers")).toBeVisible();
  70  |   await expect(page.getByText("آخر 10 inbound messages")).toBeVisible();
  71  |   await expect(page.getByText("آخر 10 outbound messages")).toBeVisible();
  72  | });
  73  | 
  74  | test("products intelligence shows overview and gallery", async ({ page }) => {
  75  |   await page.goto("/dashboard/products-intelligence");
  76  |   await expect(page.getByRole("heading", { name: /ذكاء المنتجات|Products Intelligence/ })).toBeVisible();
  77  | 
  78  |   // KPI widgets should load
  79  |   await expect(page.locator("text=إجمالي المنتجات").first()).toBeVisible();
  80  |   await expect(page.locator("text=SKU مفقود").first()).toBeVisible();
  81  |   await expect(page.locator("text=نفذ المخزون").first()).toBeVisible();
  82  | 
  83  |   // Product gallery section should be visible
  84  |   await expect(page.locator("text=معرض المنتجات المتزامنة").first()).toBeVisible();
  85  | 
  86  |   // Channel performance section should be visible
  87  |   await expect(page.locator("text=أداء القنوات").first()).toBeVisible();
  88  | });
  89  | 
  90  | test("settings page controls inspected safely", async ({ page }) => {
  91  |   await page.goto("/dashboard/settings");
  92  |   await expect(page.getByRole("heading", { name: "الإعدادات" })).toBeVisible();
  93  | 
  94  |   if (!SAFE_MUTATIONS) {
  95  |     test.info().annotations.push({ type: "safety", description: "Dangerous mutations disabled (TEST_SAFE_DASHBOARD_MUTATIONS!=true)" });
  96  |     return;
  97  |   }
  98  | 
  99  |   const toggleButtons = page.getByRole("button");
  100 |   const count = await toggleButtons.count();
  101 |   if (count > 0) {
  102 |     await expect(toggleButtons.first()).toBeVisible();
  103 |   }
  104 | });
  105 | 
  106 | test("shipping settings page renders", async ({ page }) => {
  107 |   await page.goto("/dashboard/settings/shipping");
  108 |   await expect(page.getByRole("heading", { name: /إعدادات الشحن|Shipping/ })).toBeVisible();
  109 |   await expect(page.getByText(/حد الشحن المجاني|free shipping/i)).toBeVisible();
  110 | });
  111 | 
  112 | test("ai agent settings page renders with masked secrets", async ({ page }) => {
  113 |   await page.goto("/dashboard/settings/ai-agent");
  114 |   await expect(page.getByRole("heading", { name: /AI Agent/ })).toBeVisible();
  115 |   // Ensure no raw secret is visible
  116 |   const bodyText = await page.locator("body").textContent();
  117 |   expect(bodyText).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
  118 | });
  119 | 
  120 | test("channels settings page renders", async ({ page }) => {
  121 |   await page.goto("/dashboard/settings/channels");
  122 |   await expect(page.getByRole("heading", { name: /إعدادات القنوات|Channels/ })).toBeVisible();
  123 | });
  124 | 
  125 | test("users and roles page renders", async ({ page }) => {
  126 |   await page.goto("/dashboard/settings/users");
  127 |   await expect(page.getByRole("heading", { name: /المستخدمين والأدوار|Users/ })).toBeVisible();
  128 | });
  129 | 
  130 | test("profile page renders and persists preferences", async ({ page }) => {
  131 |   await page.goto("/dashboard/profile");
  132 |   await expect(page.getByRole("heading", { name: /الملف الشخصي|Profile/ })).toBeVisible();
  133 | });
  134 | 
```