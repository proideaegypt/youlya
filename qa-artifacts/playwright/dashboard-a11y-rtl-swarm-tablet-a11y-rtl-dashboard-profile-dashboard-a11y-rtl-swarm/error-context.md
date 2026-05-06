# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-a11y-rtl-swarm.spec.ts >> tablet >> a11y/rtl /dashboard/profile
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
      - generic [ref=e9]:
        - generic "YOULYA HOME WEAR logo" [ref=e11]:
          - img "YOULYA HOME WEAR logo" [ref=e12]
        - generic [ref=e13]: YOULYA
      - navigation [ref=e14]:
        - list [ref=e15]:
          - listitem [ref=e16]:
            - link "لوحة التحكم" [ref=e17] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e18]
              - generic [ref=e23]: لوحة التحكم
          - listitem [ref=e24]:
            - link "الرسائل" [ref=e25] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e26]
              - generic [ref=e28]: الرسائل
          - listitem [ref=e29]:
            - link "الطلبات" [ref=e30] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e31]
              - generic [ref=e34]: الطلبات
          - listitem [ref=e35]:
            - link "المنتجات والمخزون" [ref=e36] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e37]
              - generic [ref=e41]: المنتجات والمخزون
          - listitem [ref=e42]:
            - link "ذكاء المنتجات" [ref=e43] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e44]
              - generic [ref=e52]: ذكاء المنتجات
          - listitem [ref=e53]:
            - link "التحويل البشري" [ref=e54] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e55]
              - generic [ref=e57]: التحويل البشري
          - listitem [ref=e58]:
            - link "المحادثات" [ref=e59] [cursor=pointer]:
              - /url: /dashboard/conversations
              - img [ref=e60]
              - generic [ref=e62]: المحادثات
          - listitem [ref=e63]:
            - link "الإحصائيات" [ref=e64] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e65]
              - generic [ref=e67]: الإحصائيات
          - listitem [ref=e68]:
            - link "القنوات" [ref=e69] [cursor=pointer]:
              - /url: /dashboard/settings/channels
              - img [ref=e70]
              - generic [ref=e73]: القنوات
          - listitem [ref=e74]:
            - link "AI Agent" [ref=e75] [cursor=pointer]:
              - /url: /dashboard/settings/ai-agent
              - img [ref=e76]
              - generic [ref=e79]: AI Agent
          - listitem [ref=e80]:
            - link "الشحن" [ref=e81] [cursor=pointer]:
              - /url: /dashboard/settings/shipping
              - img [ref=e82]
              - generic [ref=e87]: الشحن
          - listitem [ref=e88]:
            - link "المستخدمين والأدوار" [ref=e89] [cursor=pointer]:
              - /url: /dashboard/settings/users
              - img [ref=e90]
              - generic [ref=e95]: المستخدمين والأدوار
          - listitem [ref=e96]:
            - link "السجلات" [ref=e97] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e98]
              - generic [ref=e101]: السجلات
          - listitem [ref=e102]:
            - link "الملف الشخصي" [ref=e103] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e104]
              - generic [ref=e107]: الملف الشخصي
          - listitem [ref=e108]:
            - link "الإعدادات" [ref=e109] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e110]
              - generic [ref=e113]: الإعدادات
          - listitem [ref=e114]:
            - link "غرفة التحكم التجريبي" [ref=e115] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e116]
              - generic [ref=e118]: غرفة التحكم التجريبي
          - listitem [ref=e119]:
            - link "مختبر Haidi" [ref=e120] [cursor=pointer]:
              - /url: /dashboard/haidi/lab
              - img [ref=e121]
              - generic [ref=e123]: مختبر Haidi
          - listitem [ref=e124]:
            - link "تعلم Haidi" [ref=e125] [cursor=pointer]:
              - /url: /dashboard/haidi/learning
              - img [ref=e126]
              - generic [ref=e134]: تعلم Haidi
          - listitem [ref=e135]:
            - link "إعدادات Haidi" [ref=e136] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e137]
              - generic [ref=e140]: إعدادات Haidi
          - listitem [ref=e141]:
            - link "الأمان" [ref=e142] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e143]
              - generic [ref=e145]: الأمان
          - listitem [ref=e146]:
            - link "الأجهزة" [ref=e147] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e148]
              - generic [ref=e151]: الأجهزة
      - generic [ref=e152]:
        - generic [ref=e154]:
          - img [ref=e155]
          - paragraph [ref=e158]: متجر ذكي مدعوم بالذكاء الاصطناعي
        - button "تسجيل الخروج" [ref=e159]:
          - img [ref=e160]
          - generic [ref=e163]: تسجيل الخروج
    - main [ref=e164]:
      - generic [ref=e166]:
        - button "Open menu" [ref=e167]:
          - img [ref=e168]
        - generic [ref=e170]:
          - img [ref=e172]
          - textbox "Search" [ref=e175]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e176]:
          - button "Open notifications" [ref=e177]:
            - img [ref=e178]
            - generic [ref=e181]: Open notifications
            - generic [ref=e182]: "1"
          - button "Open settings" [ref=e183]:
            - img [ref=e184]
            - generic [ref=e187]: Open settings
          - button "Open user menu" [ref=e188]:
            - generic [ref=e190]: YH
            - generic [ref=e191]: Open user menu
      - generic [ref=e193]:
        - heading "الملف الشخصي" [level=1] [ref=e194]
        - paragraph [ref=e195]: Store Profile / Operator Profile
        - generic [ref=e196]:
          - generic [ref=e198]:
            - generic [ref=e200]: "Y"
            - generic [ref=e201]:
              - paragraph [ref=e202]: YOULYA HOME WEAR
              - paragraph [ref=e203]: info@youlya.com
          - generic [ref=e204]:
            - heading "الإعدادات" [level=3] [ref=e205]
            - generic [ref=e206]:
              - generic [ref=e207]:
                - generic [ref=e208]: اسم العرض
                - textbox "اسم العرض" [ref=e209]
              - generic [ref=e210]:
                - generic [ref=e211]: اسم المستخدم
                - textbox "اسم المستخدم" [ref=e212]
              - generic [ref=e213]:
                - generic [ref=e214]: اللغة
                - combobox "اللغة" [ref=e215]:
                  - option "العربية" [selected]
                  - option "English"
          - generic [ref=e216]:
            - heading "المظهر" [level=3] [ref=e217]
            - generic [ref=e218]:
              - generic [ref=e219]: الوضع الداكن
              - switch [ref=e220]
            - generic [ref=e221]:
              - generic [ref=e222]: طي القائمة
              - switch [ref=e223]
        - button "حفظ" [ref=e225]
      - paragraph [ref=e227]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e228]
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