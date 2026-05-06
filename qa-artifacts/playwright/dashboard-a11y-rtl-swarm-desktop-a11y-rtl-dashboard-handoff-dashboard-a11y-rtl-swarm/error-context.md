# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-a11y-rtl-swarm.spec.ts >> desktop >> a11y/rtl /dashboard/handoff
- Location: tests/playwright/dashboard-a11y-rtl-swarm.spec.ts:18:11

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
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
        - generic [ref=e196]:
          - generic [ref=e197]:
            - img [ref=e198]
            - text: Human Handoff Center
          - generic [ref=e200]:
            - heading "مركز التحويل البشري" [level=1] [ref=e201]
            - paragraph [ref=e202]: "إدارة المحادثات المحولة للبشر: تعيين، ملاحظات، إيقاف AI، وإرجاع المحادثة للذكاء الاصطناعي."
          - generic [ref=e203]:
            - generic [ref=e204]: 1 مفتوح
            - generic [ref=e205]: 0 معين
            - generic [ref=e206]: 1 سجل
        - generic [ref=e207]:
          - generic [ref=e208]:
            - generic [ref=e209]:
              - img [ref=e210]
              - text: Date filters
            - button "Today" [ref=e211]
            - button "This week" [ref=e212]
            - button "This month" [ref=e213]
          - generic [ref=e214]:
            - generic [ref=e215]:
              - generic [ref=e216]: From
              - textbox [ref=e217]: 2026-05-06
            - generic [ref=e218]:
              - generic [ref=e219]: To
              - textbox [ref=e220]: 2026-05-06
            - button "Apply" [ref=e221]:
              - img [ref=e222]
              - text: Apply
            - button "Reset" [ref=e224]:
              - img [ref=e225]
              - text: Reset
        - generic [ref=e228]:
          - generic [ref=e229]:
            - img [ref=e230]
            - combobox "تصفية الحالة" [ref=e232]:
              - option "كل الحالات" [selected]
              - option "مفتوح"
              - option "معين"
          - combobox "تصفية الأولوية" [ref=e234]:
            - option "كل الأولويات" [selected]
            - option "عالي"
            - option "عادي"
          - combobox "تصفية النوع" [ref=e236]:
            - option "كل الأنواع" [selected]
            - option "خدمة العملاء"
            - option "طلب الإدارة"
          - textbox "تصفية المعين" [ref=e238]:
            - /placeholder: Assignee
            - text: all
          - generic [ref=e239]:
            - img [ref=e240]
            - textbox "البحث في التحويلات" [ref=e243]:
              - /placeholder: بحث في التذاكر
          - generic [ref=e244]:
            - button "Export" [ref=e245]:
              - img [ref=e246]
              - text: Export
              - img [ref=e249]
            - generic:
              - generic:
                - generic:
                  - paragraph: Youlya Report
                  - heading "Handoff queue report" [level=1]
                  - generic:
                    - paragraph: "Page: handoff"
                    - paragraph: "Preset: today"
                    - paragraph: "From: 2026-05-06"
                    - paragraph: "To: 2026-05-06"
                    - paragraph: "Generated at: 2026-05-06T13:41:07.555Z"
                    - paragraph: "App version: 2.23.4"
                - generic:
                  - generic:
                    - paragraph: Open
                    - paragraph: "1"
                  - generic:
                    - paragraph: Assigned
                    - paragraph: "0"
                - table:
                  - rowgroup:
                    - row "Conversation Type Priority Status Problem Summary Created At":
                      - columnheader "Conversation"
                      - columnheader "Type"
                      - columnheader "Priority"
                      - columnheader "Status"
                      - columnheader "Problem Summary"
                      - columnheader "Created At"
                  - rowgroup:
                    - 'row "sy****02 customer_service NORMAL open customer_service_request: عايزه حد من خدمه العملاء يكلمني 2026-05-06T03:01:35.257+00:00"':
                      - cell "sy****02"
                      - cell "customer_service"
                      - cell "NORMAL"
                      - cell "open"
                      - 'cell "customer_service_request: عايزه حد من خدمه العملاء يكلمني"'
                      - cell "2026-05-06T03:01:35.257+00:00"
          - button "تحديث" [ref=e251]:
            - img [ref=e252]
            - text: تحديث
        - generic [ref=e259] [cursor=pointer]:
          - generic [ref=e260]:
            - img [ref=e262]
            - generic [ref=e264]:
              - generic [ref=e265]:
                - paragraph [ref=e266]: synthe···-002
                - generic [ref=e267]: عادي
                - generic [ref=e268]: مفتوح
              - paragraph [ref=e269]: CUSTOMER_SERVICE_REQUEST
              - paragraph [ref=e270]: "Type: customer_service · Summary: customer_service_request: عايزه حد من خدمه العملاء يكلمني"
              - paragraph [ref=e271]: ٦‏/٥‏/٢٠٢٦ ٦:٠١:٣٥ ص
          - button "إرجاع للذكاء الاصطناعي" [ref=e273]
      - paragraph [ref=e275]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e276]
```

# Test source

```ts
  1  | import path from "node:path";
  2  | import { test, expect } from "@playwright/test";
  3  | import { ensureDir, taskRoot } from "./helpers";
  4  | 
  5  | const pages = ["/dashboard/command-center", "/dashboard/pilot-control", "/dashboard/handoff", "/dashboard/inbox", "/dashboard/products", "/dashboard/products-intelligence", "/dashboard/statistics", "/dashboard/security", "/dashboard/devices", "/dashboard/profile", "/dashboard/orders", "/dashboard/logs", "/dashboard/settings"];
  6  | 
  7  | const viewports = [
  8  |   { name: "desktop", size: { width: 1440, height: 900 } },
  9  |   { name: "tablet", size: { width: 768, height: 1024 } },
  10 |   { name: "mobile", size: { width: 390, height: 844 } },
  11 | ];
  12 | 
  13 | for (const viewport of viewports) {
  14 |   test.describe(viewport.name, () => {
  15 |     test.use({ viewport: viewport.size });
  16 | 
  17 |     for (const route of pages) {
  18 |       test(`a11y/rtl ${route}`, async ({ page }) => {
  19 |         await page.goto(route, { waitUntil: "domcontentloaded" });
  20 |         await page.waitForLoadState("networkidle");
  21 | 
  22 |         const primaryNavigation = page.locator('aside[aria-label="Primary navigation"]');
  23 |         const openMenuButton = page.getByRole("button", { name: "Open menu" }).first();
  24 |         const sidebarToggle = page.getByRole("button", { name: /Collapse sidebar|Expand sidebar/ }).first();
  25 | 
  26 |         if (!(await primaryNavigation.isVisible().catch(() => false))) {
  27 |           if (await openMenuButton.isVisible().catch(() => false)) {
  28 |             await openMenuButton.click();
  29 |             await expect(primaryNavigation).toBeVisible();
  30 |           } else if (await sidebarToggle.isVisible().catch(() => false)) {
  31 |             await sidebarToggle.click();
  32 |             await expect(primaryNavigation).toBeVisible();
  33 |           }
  34 |         }
  35 | 
  36 |         const screenshotDir = path.join(taskRoot(), "a11y", "screenshots", viewport.name);
  37 |         await ensureDir(screenshotDir);
  38 |         await page.screenshot({
  39 |           path: path.join(screenshotDir, `${route.replaceAll("/", "_").replace(/^_/, "")}.png`),
  40 |           fullPage: true,
  41 |         });
  42 | 
  43 |         const dir = await page.evaluate(() => document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "");
  44 |         const navVisible = await primaryNavigation.isVisible().catch(() => false);
  45 |         const navToggleVisible =
  46 |           (await openMenuButton.isVisible().catch(() => false)) ||
  47 |           (await sidebarToggle.isVisible().catch(() => false));
  48 | 
  49 |         expect(navVisible || navToggleVisible, "Navigation should be visible or reachable").toBe(true);
  50 |         expect(["", "rtl", "ltr"]).toContain(dir);
  51 | 
  52 |         const unlabeledInputs = await page
  53 |           .locator("input, textarea, select")
  54 |           .evaluateAll((nodes) => {
  55 |             return nodes.filter((node) => {
  56 |               const element = node as HTMLInputElement;
  57 |               const hasAria = Boolean(element.getAttribute("aria-label") || element.getAttribute("aria-labelledby"));
  58 |               const id = element.id;
  59 |               const hasLabel = id ? Boolean(document.querySelector(`label[for='${id}']`)) : false;
  60 |               return !hasAria && !hasLabel;
  61 |             }).length;
  62 |           });
> 63 |         expect(unlabeledInputs).toBe(0);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  64 | 
  65 |         const unnamedButtons = await page
  66 |           .locator("button")
  67 |           .evaluateAll((nodes) =>
  68 |             nodes.filter((n) => {
  69 |               const el = n as HTMLButtonElement;
  70 |               const hasText = !!(el.innerText || "").trim();
  71 |               const hasAriaLabel = !!el.getAttribute("aria-label")?.trim();
  72 |               return !hasText && !hasAriaLabel;
  73 |             }).length
  74 |           );
  75 |         expect(unnamedButtons).toBe(0);
  76 | 
  77 |         const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth > 20);
  78 |         expect(hasHorizontalOverflow, "Mobile/tablet layout overflow >20px").toBe(false);
  79 |       });
  80 |     }
  81 |   });
  82 | }
  83 | 
```