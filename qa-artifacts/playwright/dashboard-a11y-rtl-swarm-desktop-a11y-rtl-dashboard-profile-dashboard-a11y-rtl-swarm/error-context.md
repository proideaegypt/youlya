# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-a11y-rtl-swarm.spec.ts >> desktop >> a11y/rtl /dashboard/profile
- Location: tests/playwright/dashboard-a11y-rtl-swarm.spec.ts:18:11

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 3
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
        - heading "الملف الشخصي" [level=1] [ref=e195]
        - paragraph [ref=e196]: Store Profile / Operator Profile
        - generic [ref=e197]:
          - generic [ref=e199]:
            - generic [ref=e201]: "Y"
            - generic [ref=e202]:
              - paragraph [ref=e203]: YOULYA HOME WEAR
              - paragraph [ref=e204]: info@youlya.com
          - generic [ref=e205]:
            - heading "الإعدادات" [level=3] [ref=e206]
            - generic [ref=e207]:
              - generic [ref=e208]:
                - generic [ref=e209]: اسم العرض
                - textbox "اسم العرض" [ref=e210]
              - generic [ref=e211]:
                - generic [ref=e212]: اسم المستخدم
                - textbox "اسم المستخدم" [ref=e213]
              - generic [ref=e214]:
                - generic [ref=e215]: اللغة
                - combobox "اللغة" [ref=e216]:
                  - option "العربية" [selected]
                  - option "English"
          - generic [ref=e217]:
            - heading "المظهر" [level=3] [ref=e218]
            - generic [ref=e219]:
              - generic [ref=e220]: الوضع الداكن
              - switch [ref=e221]
            - generic [ref=e222]:
              - generic [ref=e223]: طي القائمة
              - switch [ref=e224]
        - button "حفظ" [ref=e226]
      - paragraph [ref=e228]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e229]
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