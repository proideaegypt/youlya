# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-ux-swarm.spec.ts >> ux audit /dashboard/products
- Location: tests/playwright/dashboard-ux-swarm.spec.ts:28:7

# Error details

```
Error: Uncaught console errors

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 7

- Array []
+ Array [
+   "Failed to load resource: net::ERR_NETWORK_CHANGED",
+   "Failed to load resource: net::ERR_NETWORK_CHANGED",
+   "Failed to load resource: net::ERR_NETWORK_CHANGED",
+   "Failed to load resource: net::ERR_NETWORK_CHANGED",
+   "Failed to load resource: net::ERR_NETWORK_CHANGED",
+ ]
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
          - heading "المنتجات والمخزون" [level=1] [ref=e196]
          - paragraph [ref=e197]: مراقبة ذاكرة المنتجات المؤقتة من Shopify — للقراءة فقط
        - generic [ref=e198]:
          - button "نظرة عامة" [ref=e199]
          - button "المنتجات" [ref=e200]
          - button "المتغيرات" [ref=e201]
          - button "صحة المزامنة" [ref=e202]
          - button "اختبار البحث" [ref=e203]
          - button "فاحص الربط" [ref=e204]
        - generic [ref=e206]:
          - heading "لا توجد بيانات" [level=3] [ref=e207]
          - paragraph [ref=e208]: تعذر تحميل نظرة عامة على المنتجات
      - paragraph [ref=e210]: Youlya AI Commerce OS · v2.23.3 finish-user-management-update-deactivate-invite-flow · commit unknown · built 2026-05-06 04:34 · production
  - alert [ref=e211]
```

# Test source

```ts
  14  |   "/dashboard/pilot-control",
  15  |   "/dashboard/inbox",
  16  |   "/dashboard/products",
  17  |   "/dashboard/products-intelligence",
  18  |   "/dashboard/orders",
  19  |   "/dashboard/logs",
  20  |   "/dashboard/settings",
  21  |   "/dashboard/statistics",
  22  |   "/dashboard/security",
  23  |   "/dashboard/devices",
  24  |   "/dashboard/profile",
  25  | ];
  26  | 
  27  | for (const route of routes) {
  28  |   test(`ux audit ${route}`, async ({ page }) => {
  29  |     const trackers = await attachConsoleAndNetworkTrackers(page);
  30  | 
  31  |     await page.goto(route, { waitUntil: "domcontentloaded" });
  32  |     await page.waitForLoadState("networkidle");
  33  | 
  34  |     const sidebarToggle = page.getByRole("button", { name: /Toggle sidebar|Collapse sidebar|Expand sidebar|Open menu/ }).first();
  35  |     if (!(await page.locator("aside").first().isVisible().catch(() => false)) && await sidebarToggle.isVisible().catch(() => false)) {
  36  |       await sidebarToggle.click();
  37  |       await page.waitForLoadState("networkidle");
  38  |     }
  39  | 
  40  |     const screenshotDir = path.join(taskRoot(), "ux", "screenshots");
  41  |     await ensureDir(screenshotDir);
  42  |     const screenshotFile = path.join(screenshotDir, `${route.replaceAll("/", "_").replace(/^_/, "")}.png`);
  43  |     await page.screenshot({ path: screenshotFile, fullPage: true });
  44  | 
  45  |     const h1 = page.locator("h1").first();
  46  |     const hasH1 = (await h1.count()) > 0;
  47  |     const heading = hasH1 ? ((await h1.textContent({ timeout: 1000 }))?.trim() ?? "") : "";
  48  |     const title = await page.title();
  49  |     const bodyText = (await page.locator("body").innerText()).trim();
  50  | 
  51  |     const sidebarVisible = await page.locator("aside").first().isVisible().catch(() => false);
  52  |     const contentVisible = await page.locator("main").first().isVisible().catch(() => false);
  53  |     const footerBuildIdentityVisible = await page.locator("footer").filter({ hasText: "Youlya AI Commerce OS" }).first().isVisible().catch(() => false);
  54  | 
  55  |     const direction = await page.evaluate(() => {
  56  |       return document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "";
  57  |     });
  58  | 
  59  |     const hasArabicText = /[\u0600-\u06FF]/.test(bodyText);
  60  | 
  61  |     const hasHorizontalOverflow = await page.evaluate(() => {
  62  |       const overflow = document.documentElement.scrollWidth - window.innerWidth;
  63  |       return overflow > 20;
  64  |     });
  65  | 
  66  |     const hasErrorOverlay = await page.locator("text=Application error").first().isVisible().catch(() => false);
  67  |     const shellPresent = sidebarVisible && contentVisible;
  68  |     const hasWeakEmptyState =
  69  |       /صفحة\s+(الطلبات|الإعدادات)/.test(bodyText) || /coming soon|placeholder/i.test(bodyText);
  70  | 
  71  |     const uxIssues: string[] = [];
  72  |     if (!hasH1) uxIssues.push("Missing h1/main page heading");
  73  |     if (hasWeakEmptyState) uxIssues.push("Weak empty state");
  74  |     if (!footerBuildIdentityVisible) uxIssues.push("Missing build identity");
  75  |     if (!hasArabicText) uxIssues.push("Missing Arabic labels");
  76  |     if (hasHorizontalOverflow) uxIssues.push("Horizontal overflow");
  77  | 
  78  |     const routeLooksBlank = bodyText.length <= 20 || (!shellPresent && !heading && title.length === 0);
  79  |     if (routeLooksBlank) uxIssues.push("Blank-looking page");
  80  | 
  81  |     const report = {
  82  |       route,
  83  |       heading,
  84  |       hasH1,
  85  |       title,
  86  |       bodyTextLength: bodyText.length,
  87  |       sidebarVisible,
  88  |       contentVisible,
  89  |       shellPresent,
  90  |       footerBuildIdentityVisible,
  91  |       hasArabicText,
  92  |       direction,
  93  |       hasHorizontalOverflow,
  94  |       hasErrorOverlay,
  95  |       hasWeakEmptyState,
  96  |       consoleErrors: trackers.consoleErrors,
  97  |       realFailedRequests: trackers.realFailedRequests,
  98  |       ignoredNetworkNoise: trackers.ignoredNetworkNoise,
  99  |       screenshot: screenshotFile,
  100 |       uxIssues,
  101 |     };
  102 | 
  103 |     const routeSlug = route.replaceAll("/", "_").replace(/^_/, "");
  104 |     const outDir = path.join(taskRoot(), "ux");
  105 |     await writeJson(path.join(outDir, `${routeSlug}.json`), report);
  106 |     await writeMarkdown(path.join(outDir, `${routeSlug}.md`), markdownFromRouteReport(report));
  107 | 
  108 |     expect(bodyText.length, "Page body is blank").toBeGreaterThan(20);
  109 |     expect(hasErrorOverlay, "Next.js error overlay visible").toBe(false);
  110 |     expect(sidebarVisible, "Sidebar should be visible on desktop").toBe(true);
  111 |     expect(contentVisible, "Content area should be visible").toBe(true);
  112 |     expect(shellPresent, "Dashboard shell/sidebar should be visible").toBe(true);
  113 |     expect(hasHorizontalOverflow, "Horizontal overflow >20px").toBe(false);
> 114 |     expect(trackers.consoleErrors, "Uncaught console errors").toEqual([]);
      |                                                               ^ Error: Uncaught console errors
  115 |     expect(trackers.realFailedRequests, "Unexpected failed network requests").toEqual([]);
  116 |   });
  117 | }
  118 | 
```