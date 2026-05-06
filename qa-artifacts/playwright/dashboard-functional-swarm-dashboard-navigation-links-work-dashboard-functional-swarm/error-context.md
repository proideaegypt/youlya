# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-functional-swarm.spec.ts >> dashboard navigation links work
- Location: tests/playwright/dashboard-functional-swarm.spec.ts:5:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'القنوات والمنتجات' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e5]:
    - complementary "Primary navigation" [ref=e7]:
      - generic [ref=e8]:
        - generic "YOULYA HOME WEAR logo" [ref=e11]:
          - img "YOULYA HOME WEAR logo" [ref=e12]
        - button "Expand sidebar" [ref=e13]:
          - img [ref=e14]
      - navigation [ref=e16]:
        - list [ref=e17]:
          - listitem [ref=e18]:
            - link "لوحة التحكم" [ref=e19] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e20]
              - generic [ref=e25]: لوحة التحكم
          - listitem [ref=e26]:
            - link "الرسائل" [ref=e27] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e28]
              - generic [ref=e30]: الرسائل
          - listitem [ref=e31]:
            - link "الطلبات" [ref=e32] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e33]
              - generic [ref=e36]: الطلبات
          - listitem [ref=e37]:
            - link "المنتجات والمخزون" [ref=e38] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e39]
              - generic [ref=e43]: المنتجات والمخزون
          - listitem [ref=e44]:
            - link "ذكاء المنتجات" [ref=e45] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e46]
              - generic [ref=e54]: ذكاء المنتجات
          - listitem [ref=e55]:
            - link "التحويل البشري" [ref=e56] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e57]
              - generic [ref=e59]: التحويل البشري
          - listitem [ref=e60]:
            - link "المحادثات" [ref=e61] [cursor=pointer]:
              - /url: /dashboard/conversations
              - img [ref=e62]
              - generic [ref=e64]: المحادثات
          - listitem [ref=e65]:
            - link "الإحصائيات" [ref=e66] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e67]
              - generic [ref=e69]: الإحصائيات
          - listitem [ref=e70]:
            - link "القنوات" [ref=e71] [cursor=pointer]:
              - /url: /dashboard/settings/channels
              - img [ref=e72]
              - generic [ref=e75]: القنوات
          - listitem [ref=e76]:
            - link "AI Agent" [ref=e77] [cursor=pointer]:
              - /url: /dashboard/settings/ai-agent
              - img [ref=e78]
              - generic [ref=e81]: AI Agent
          - listitem [ref=e82]:
            - link "الشحن" [ref=e83] [cursor=pointer]:
              - /url: /dashboard/settings/shipping
              - img [ref=e84]
              - generic [ref=e89]: الشحن
          - listitem [ref=e90]:
            - link "المستخدمين والأدوار" [ref=e91] [cursor=pointer]:
              - /url: /dashboard/settings/users
              - img [ref=e92]
              - generic [ref=e97]: المستخدمين والأدوار
          - listitem [ref=e98]:
            - link "السجلات" [ref=e99] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e100]
              - generic [ref=e103]: السجلات
          - listitem [ref=e104]:
            - link "الملف الشخصي" [ref=e105] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e106]
              - generic [ref=e109]: الملف الشخصي
          - listitem [ref=e110]:
            - link "الإعدادات" [ref=e111] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e112]
              - generic [ref=e115]: الإعدادات
          - listitem [ref=e116]:
            - link "غرفة التحكم التجريبي" [ref=e117] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e118]
              - generic [ref=e120]: غرفة التحكم التجريبي
          - listitem [ref=e121]:
            - link "مختبر Haidi" [ref=e122] [cursor=pointer]:
              - /url: /dashboard/haidi/lab
              - img [ref=e123]
              - generic [ref=e125]: مختبر Haidi
          - listitem [ref=e126]:
            - link "تعلم Haidi" [ref=e127] [cursor=pointer]:
              - /url: /dashboard/haidi/learning
              - img [ref=e128]
              - generic [ref=e136]: تعلم Haidi
          - listitem [ref=e137]:
            - link "إعدادات Haidi" [ref=e138] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e139]
              - generic [ref=e142]: إعدادات Haidi
          - listitem [ref=e143]:
            - link "الأمان" [active] [ref=e144] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e145]
              - generic [ref=e147]: الأمان
          - listitem [ref=e148]:
            - link "الأجهزة" [ref=e149] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e150]
              - generic [ref=e153]: الأجهزة
      - button "تسجيل الخروج" [ref=e155]:
        - img [ref=e156]
        - generic [ref=e159]: تسجيل الخروج
    - main [ref=e160]:
      - generic [ref=e162]:
        - generic [ref=e164]:
          - img [ref=e166]
          - textbox "Search" [ref=e169]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e170]:
          - button "Open notifications" [ref=e171]:
            - img [ref=e172]
            - generic [ref=e175]: Open notifications
            - generic [ref=e176]: "1"
          - button "Open settings" [ref=e177]:
            - img [ref=e178]
            - generic [ref=e181]: Open settings
          - button "Open user menu" [ref=e182]:
            - generic [ref=e184]: YH
            - generic [ref=e185]: Open user menu
      - generic [ref=e187]:
        - heading "الأمان" [level=1] [ref=e188]
        - paragraph [ref=e189]: AI Safety / Kill Switch / Risk
        - generic [ref=e190]:
          - generic [ref=e191]:
            - generic [ref=e192]:
              - generic [ref=e193]:
                - img [ref=e194]
                - heading "AI Safety" [level=3] [ref=e196]
              - switch "Toggle AI safety" [checked] [ref=e197]
            - paragraph [ref=e198]: AI safety guards are active.
          - generic [ref=e199]:
            - generic [ref=e200]:
              - generic [ref=e201]:
                - img [ref=e202]
                - heading "Kill Switch" [level=3] [ref=e204]
              - switch "Toggle kill switch" [ref=e205]
            - paragraph [ref=e206]: Kill switch is OFF. Normal operation.
          - generic [ref=e207]:
            - generic [ref=e208]:
              - generic [ref=e209]:
                - img [ref=e210]
                - heading "Duplicate Guard" [level=3] [ref=e213]
              - switch "Toggle duplicate guard" [checked] [ref=e214]
            - paragraph [ref=e215]: Duplicate order protection active.
        - generic [ref=e216]:
          - heading "Recent activity" [level=3] [ref=e217]
          - list [ref=e218]:
            - listitem [ref=e219]:
              - generic [ref=e220]: Order confirmation guard passed
              - generic [ref=e221]: 08:32
            - listitem [ref=e222]:
              - generic [ref=e223]: Duplicate webhook blocked
              - generic [ref=e224]: 07:15
            - listitem [ref=e225]:
              - generic [ref=e226]: Kill switch toggled by admin
              - generic [ref=e227]: Yesterday
      - paragraph [ref=e229]: Youlya AI Commerce OS · v2.23.3 finish-user-management-update-deactivate-invite-flow · commit unknown · built 2026-05-06 04:34 · production
  - alert [ref=e230]: YOULYA HOME WEAR Dashboard
  - generic [ref=e231]: "0"
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
> 29  |     await page.getByRole("link", { name: link.name }).click();
      |                                                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
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
```