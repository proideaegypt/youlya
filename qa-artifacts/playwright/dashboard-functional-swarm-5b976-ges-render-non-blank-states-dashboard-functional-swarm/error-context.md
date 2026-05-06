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

Locator: locator('span').filter({ hasText: 'AI Tool' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('span').filter({ hasText: 'AI Tool' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - complementary "Primary navigation" [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic "YOULYA HOME WEAR logo" [ref=e11]:
            - img "YOULYA HOME WEAR logo" [ref=e12]
          - generic [ref=e13]: YOULYA
        - button "Collapse sidebar" [ref=e14]:
          - img [ref=e15]
      - navigation [ref=e17]:
        - list [ref=e18]:
          - listitem [ref=e19]:
            - link "لوحة التحكم" [ref=e20] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e21]
              - generic [ref=e26]: لوحة التحكم
          - listitem [ref=e27]:
            - link "الرسائل" [ref=e28] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e29]
              - generic [ref=e31]: الرسائل
          - listitem [ref=e32]:
            - link "الطلبات" [ref=e33] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e34]
              - generic [ref=e37]: الطلبات
          - listitem [ref=e38]:
            - link "المنتجات والمخزون" [ref=e39] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e40]
              - generic [ref=e44]: المنتجات والمخزون
          - listitem [ref=e45]:
            - link "ذكاء المنتجات" [ref=e46] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e47]
              - generic [ref=e55]: ذكاء المنتجات
          - listitem [ref=e56]:
            - link "التحويل البشري" [ref=e57] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e58]
              - generic [ref=e60]: التحويل البشري
          - listitem [ref=e61]:
            - link "المحادثات" [ref=e62] [cursor=pointer]:
              - /url: /dashboard/conversations
              - img [ref=e63]
              - generic [ref=e65]: المحادثات
          - listitem [ref=e66]:
            - link "الإحصائيات" [ref=e67] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e68]
              - generic [ref=e70]: الإحصائيات
          - listitem [ref=e71]:
            - link "القنوات" [ref=e72] [cursor=pointer]:
              - /url: /dashboard/settings/channels
              - img [ref=e73]
              - generic [ref=e76]: القنوات
          - listitem [ref=e77]:
            - link "AI Agent" [ref=e78] [cursor=pointer]:
              - /url: /dashboard/settings/ai-agent
              - img [ref=e79]
              - generic [ref=e82]: AI Agent
          - listitem [ref=e83]:
            - link "الشحن" [ref=e84] [cursor=pointer]:
              - /url: /dashboard/settings/shipping
              - img [ref=e85]
              - generic [ref=e90]: الشحن
          - listitem [ref=e91]:
            - link "المستخدمين والأدوار" [ref=e92] [cursor=pointer]:
              - /url: /dashboard/settings/users
              - img [ref=e93]
              - generic [ref=e98]: المستخدمين والأدوار
          - listitem [ref=e99]:
            - link "السجلات" [ref=e100] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e101]
              - generic [ref=e104]: السجلات
          - listitem [ref=e105]:
            - link "الملف الشخصي" [ref=e106] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e107]
              - generic [ref=e110]: الملف الشخصي
          - listitem [ref=e111]:
            - link "الإعدادات" [ref=e112] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e113]
              - generic [ref=e116]: الإعدادات
          - listitem [ref=e117]:
            - link "غرفة التحكم التجريبي" [ref=e118] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e119]
              - generic [ref=e121]: غرفة التحكم التجريبي
          - listitem [ref=e122]:
            - link "مختبر Haidi" [ref=e123] [cursor=pointer]:
              - /url: /dashboard/haidi/lab
              - img [ref=e124]
              - generic [ref=e126]: مختبر Haidi
          - listitem [ref=e127]:
            - link "تعلم Haidi" [ref=e128] [cursor=pointer]:
              - /url: /dashboard/haidi/learning
              - img [ref=e129]
              - generic [ref=e137]: تعلم Haidi
          - listitem [ref=e138]:
            - link "إعدادات Haidi" [ref=e139] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e140]
              - generic [ref=e143]: إعدادات Haidi
          - listitem [ref=e144]:
            - link "الأمان" [ref=e145] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e146]
              - generic [ref=e148]: الأمان
          - listitem [ref=e149]:
            - link "الأجهزة" [ref=e150] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e151]
              - generic [ref=e154]: الأجهزة
      - generic [ref=e155]:
        - generic [ref=e157]:
          - img [ref=e158]
          - paragraph [ref=e161]: متجر ذكي مدعوم بالذكاء الاصطناعي
        - button "تسجيل الخروج" [ref=e162]:
          - img [ref=e163]
          - generic [ref=e166]: تسجيل الخروج
    - main [ref=e167]:
      - generic [ref=e169]:
        - generic [ref=e171]:
          - img [ref=e173]
          - textbox "Search" [ref=e176]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e177]:
          - button "Open notifications" [ref=e178]:
            - img [ref=e179]
            - generic [ref=e182]: Open notifications
            - generic [ref=e183]: "1"
          - button "Open settings" [ref=e184]:
            - img [ref=e185]
            - generic [ref=e188]: Open settings
          - button "Open user menu" [ref=e189]:
            - generic [ref=e191]: YH
            - generic [ref=e192]: Open user menu
      - generic [ref=e194]:
        - generic [ref=e195]:
          - generic [ref=e196]:
            - heading "السجلات" [level=1] [ref=e197]
            - paragraph [ref=e198]: Logs
          - generic [ref=e199]:
            - generic [ref=e200]:
              - button "Export" [ref=e201]:
                - img [ref=e202]
                - text: Export
                - img [ref=e205]
              - generic:
                - generic:
                  - generic:
                    - paragraph: Youlya Report
                    - heading "Logs report" [level=1]
                    - generic:
                      - paragraph: "Page: logs"
                      - paragraph: "Preset: today"
                      - paragraph: "From: 2026-05-06"
                      - paragraph: "To: 2026-05-06"
                      - paragraph: "Generated at: 2026-05-06T13:43:47.602Z"
                      - paragraph: "App version: 2.23.4"
                  - generic:
                    - generic:
                      - paragraph: Total
                      - paragraph: "0"
                    - generic:
                      - paragraph: Errors
                      - paragraph: "0"
                    - generic:
                      - paragraph: Warnings
                      - paragraph: "0"
                  - table:
                    - rowgroup:
                      - row "Timestamp Type Level Message Details":
                        - columnheader "Timestamp"
                        - columnheader "Type"
                        - columnheader "Level"
                        - columnheader "Message"
                        - columnheader "Details"
                    - rowgroup:
                      - row "No records for the selected filters.":
                        - cell "No records for the selected filters."
            - generic [ref=e207]:
              - img [ref=e208]
              - textbox "Search logs" [ref=e211]:
                - /placeholder: Search logs...
        - generic [ref=e213]:
          - generic [ref=e214]:
            - generic [ref=e215]:
              - img [ref=e216]
              - text: Date filters
            - button "Today" [ref=e217]
            - button "This week" [ref=e218]
            - button "This month" [ref=e219]
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]: From
              - textbox [ref=e223]: 2026-05-06
            - generic [ref=e224]:
              - generic [ref=e225]: To
              - textbox [ref=e226]: 2026-05-06
            - button "Apply" [ref=e227]:
              - img [ref=e228]
              - text: Apply
            - button "Reset" [ref=e230]:
              - img [ref=e231]
              - text: Reset
        - generic [ref=e234]:
          - generic [ref=e235]:
            - generic [ref=e236]:
              - img [ref=e237]
              - generic [ref=e240]: All
            - paragraph [ref=e241]: "6"
          - generic [ref=e242]:
            - generic [ref=e243]:
              - img [ref=e244]
              - generic [ref=e246]: Info
            - paragraph [ref=e247]: "4"
          - generic [ref=e248]:
            - generic [ref=e249]:
              - img [ref=e250]
              - generic [ref=e252]: Warning
            - paragraph [ref=e253]: "1"
          - generic [ref=e254]:
            - generic [ref=e255]:
              - img [ref=e256]
              - generic [ref=e258]: Error
            - paragraph [ref=e259]: "1"
        - paragraph [ref=e261]: No logs match your filters.
      - paragraph [ref=e263]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e264]
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
  52  |   await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
  53  | 
  54  |   await page.goto("/dashboard/logs");
  55  |   await expect(page.getByRole("heading", { name: "السجلات" })).toBeVisible();
> 56  |   await expect(page.locator("span").filter({ hasText: "AI Tool" })).toBeVisible();
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
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