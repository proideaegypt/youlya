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
  - waiting for getByRole('link', { name: 'لوحة التحكم' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e5]:
    - complementary "Primary navigation" [ref=e7]:
      - generic [ref=e8]:
        - generic "YOULYA HOME WEAR logo" [ref=e11]:
          - img "YOULYA HOME WEAR logo" [ref=e12]
        - button "Expand sidebar" [active] [ref=e13]:
          - img [ref=e14]
      - navigation [ref=e16]:
        - list [ref=e17]:
          - listitem [ref=e18]:
            - link [ref=e19] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e20]
          - listitem [ref=e25]:
            - link [ref=e26] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e27]
          - listitem [ref=e29]:
            - link [ref=e30] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e31]
          - listitem [ref=e33]:
            - link [ref=e34] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e35]
          - listitem [ref=e37]:
            - link [ref=e38] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e39]
          - listitem [ref=e43]:
            - link [ref=e44] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e45]
          - listitem [ref=e53]:
            - link [ref=e54] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e55]
          - listitem [ref=e57]:
            - link [ref=e58] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e59]
          - listitem [ref=e61]:
            - link [ref=e62] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e63]
          - listitem [ref=e66]:
            - link [ref=e67] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e68]
          - listitem [ref=e71]:
            - link [ref=e72] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e73]
          - listitem [ref=e76]:
            - link [ref=e77] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e78]
          - listitem [ref=e81]:
            - link [ref=e82] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e83]
      - button "تسجيل الخروج" [ref=e87]:
        - img [ref=e88]
        - generic [ref=e91]: تسجيل الخروج
    - main [ref=e92]:
      - generic [ref=e94]:
        - generic [ref=e96]:
          - img [ref=e98]
          - textbox "Search" [ref=e101]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e102]:
          - button "Open notifications" [ref=e103]:
            - img [ref=e104]
            - generic [ref=e107]: Open notifications
            - generic [ref=e108]: "3"
          - button "Open settings" [ref=e109]:
            - img [ref=e110]
            - generic [ref=e113]: Open settings
          - button "Open user menu" [ref=e114]:
            - generic [ref=e116]: YH
            - generic [ref=e117]: Open user menu
      - generic [ref=e119]:
        - generic [ref=e122]:
          - heading "أهلاً بك في YOULYA HOME WEAR" [level=1] [ref=e123]
          - paragraph [ref=e124]: إدارة الطلبات والمحادثات والذكاء الاصطناعي — YOULYA HOME WEAR
          - generic [ref=e125]:
            - img [ref=e126]
            - generic [ref=e128]:
              - generic [ref=e129]: النظام يعمل بكامل طاقته
              - generic [ref=e130]: 4 طلبات اليوم
        - generic [ref=e131]:
          - generic [ref=e132]:
            - generic [ref=e133]:
              - generic [ref=e135]:
                - generic [ref=e136]:
                  - paragraph [ref=e137]: الطلبات اليوم
                  - paragraph [ref=e138]: "4"
                  - paragraph [ref=e139]: 2,560 EGP
                - img [ref=e141]
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - paragraph [ref=e147]: محادثات واتساب
                  - paragraph [ref=e148]: "12"
                  - paragraph [ref=e149]: 12 AI
                - img [ref=e151]
              - generic [ref=e154]:
                - generic [ref=e155]:
                  - paragraph [ref=e156]: معدل التحويل
                  - paragraph [ref=e157]: 33%
                  - paragraph [ref=e158]: Orders / Conversations
                - img [ref=e160]
              - generic [ref=e164]:
                - generic [ref=e165]:
                  - paragraph [ref=e166]: تحويلات بشرية
                  - paragraph [ref=e167]: "4"
                - img [ref=e169]
              - generic [ref=e175]:
                - generic [ref=e176]:
                  - paragraph [ref=e177]: Webhooks محجوبة
                  - paragraph [ref=e178]: "0"
                - img [ref=e180]
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - paragraph [ref=e185]: تأكيدات معلقة
                  - paragraph [ref=e186]: "4"
                - img [ref=e188]
            - generic [ref=e190]:
              - heading "القنوات والتكاملات" [level=2] [ref=e192]
              - generic [ref=e193]:
                - generic [ref=e194]:
                  - generic [ref=e195]:
                    - img [ref=e197]
                    - heading "WhatsApp" [level=3] [ref=e199]
                  - paragraph [ref=e200]: Active
                - generic [ref=e201]:
                  - generic [ref=e202]:
                    - img [ref=e204]
                    - heading "Shopify" [level=3] [ref=e206]
                  - paragraph [ref=e207]: Active
                - generic [ref=e208]:
                  - generic [ref=e209]:
                    - img [ref=e211]
                    - heading "Evolution" [level=3] [ref=e213]
                  - paragraph [ref=e214]: Active
                - generic [ref=e215]:
                  - generic [ref=e216]:
                    - img [ref=e218]
                    - heading "n8n" [level=3] [ref=e220]
                  - paragraph [ref=e221]: Active
                - generic [ref=e222]:
                  - generic [ref=e223]:
                    - img [ref=e225]
                    - heading "Supabase" [level=3] [ref=e227]
                  - paragraph [ref=e228]: Active
                - generic [ref=e229]:
                  - generic [ref=e230]:
                    - img [ref=e232]
                    - heading "OpenAI" [level=3] [ref=e234]
                  - paragraph [ref=e235]: Active
            - generic [ref=e236]:
              - generic [ref=e237]:
                - heading "إجراءات سريعة" [level=2] [ref=e239]
                - generic [ref=e240]:
                  - link "غرفة الطيار Quick Action" [ref=e241] [cursor=pointer]:
                    - /url: /dashboard/pilot-control
                    - img [ref=e242]
                    - generic [ref=e244]:
                      - generic [ref=e245]: غرفة الطيار
                      - generic [ref=e246]: Quick Action
                  - link "Open Inbox Quick Action" [ref=e247] [cursor=pointer]:
                    - /url: /dashboard/inbox
                    - img [ref=e248]
                    - generic [ref=e250]:
                      - generic [ref=e251]: Open Inbox
                      - generic [ref=e252]: Quick Action
                  - generic [ref=e253] [cursor=pointer]:
                    - img [ref=e254]
                    - generic [ref=e257]:
                      - generic [ref=e258]: View Orders
                      - generic [ref=e259]: Quick Action
                  - generic [ref=e260] [cursor=pointer]:
                    - img [ref=e261]
                    - generic [ref=e264]:
                      - generic [ref=e265]: Check Logs
                      - generic [ref=e266]: Quick Action
                  - generic [ref=e267] [cursor=pointer]:
                    - img [ref=e268]
                    - generic [ref=e271]:
                      - generic [ref=e272]: Open Settings
                      - generic [ref=e273]: Quick Action
              - generic [ref=e274]:
                - heading "أفضل المنتجات" [level=2] [ref=e276]
                - generic [ref=e277]:
                  - generic [ref=e278]:
                    - heading "بيجامات" [level=4] [ref=e279]
                    - paragraph [ref=e280]: Top request
                  - generic [ref=e281]:
                    - heading "روب" [level=4] [ref=e282]
                    - paragraph [ref=e283]: Top request
                  - generic [ref=e284]:
                    - heading "بوركيني" [level=4] [ref=e285]
                    - paragraph [ref=e286]: Top request
                  - generic [ref=e287]:
                    - heading "لانجري" [level=4] [ref=e288]
                    - paragraph [ref=e289]: Top request
          - generic [ref=e290]:
            - generic [ref=e291]:
              - heading "AI Control" [level=2] [ref=e292]
              - generic [ref=e293]:
                - generic [ref=e294]:
                  - generic [ref=e295]:
                    - img [ref=e296]
                    - generic [ref=e298]: AI Enabled
                  - generic [ref=e299]: "ON"
                - generic [ref=e300]:
                  - generic [ref=e301]:
                    - img [ref=e302]
                    - generic [ref=e304]: Kill Switch
                  - generic [ref=e305]: "OFF"
                - generic [ref=e306]:
                  - generic [ref=e307]:
                    - img [ref=e308]
                    - generic [ref=e310]: Safety Guard
                  - generic [ref=e311]: Active
            - generic [ref=e312]:
              - heading "Conversion" [level=2] [ref=e313]
              - generic [ref=e316]: 33%
              - paragraph [ref=e317]: Orders / Conversations
        - generic [ref=e318]:
          - generic [ref=e319]:
            - heading "Sales Trend" [level=3] [ref=e320]
            - paragraph [ref=e321]: اتجاه المبيعات - Last 7 days
            - application [ref=e325]:
              - generic [ref=e335]:
                - generic [ref=e336]:
                  - generic [ref=e338]: Sat
                  - generic [ref=e340]: Sun
                  - generic [ref=e342]: Mon
                  - generic [ref=e344]: Tue
                  - generic [ref=e346]: Wed
                  - generic [ref=e348]: Thu
                  - generic [ref=e350]: Fri
                - generic [ref=e351]:
                  - generic [ref=e353]: "0"
                  - generic [ref=e355]: "2"
                  - generic [ref=e357]: "4"
                  - generic [ref=e359]: "6"
                  - generic [ref=e361]: "8"
          - generic [ref=e362]:
            - heading "AI vs Human Handoff" [level=3] [ref=e363]
            - paragraph [ref=e364]: توازن التشغيل
            - application [ref=e368]:
              - generic [ref=e386]:
                - generic [ref=e387]:
                  - generic [ref=e389]: AI
                  - generic [ref=e391]: Human
                  - generic [ref=e393]: Pending
                - generic [ref=e394]:
                  - generic [ref=e396]: "0"
                  - generic [ref=e398]: "3"
                  - generic [ref=e400]: "6"
                  - generic [ref=e402]: "9"
                  - generic [ref=e404]: "12"
      - paragraph [ref=e406]: Youlya AI Commerce OS · v2.15.1 integrate-pilot-sprint-playbook-safely · commit unknown · built 2026-05-04 05:19 · production
  - alert [ref=e407]
  - generic [ref=e408]: "3"
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
  14  |     { name: "غرفة التحكم التجريبي", url: /\/dashboard\/pilot/ },
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
  60  |   await page.goto("/dashboard/pilot");
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
```