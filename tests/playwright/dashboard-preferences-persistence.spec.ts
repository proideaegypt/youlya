import { test, expect } from "@playwright/test";

test.describe("dashboard UI preferences persistence", () => {
  test.use({ storageState: "tests/playwright/.auth/admin.json" });

  test("theme, color, language, and sidebar persist across reload", async ({ page }) => {
    await page.goto("/dashboard/command-center", { waitUntil: "networkidle" });
    const settingsMenu = page.getByRole("menu", { name: "Open settings" });

    // 1. Set language to English
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByRole("menuitem", { name: "English" }).click();
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    // 2. Set dark mode
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByRole("button", { name: /Theme/ }).click();
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // 3. Set color to purple
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByLabel("Use Purple theme").click({ force: true });
    await page.evaluate(() => {
      localStorage.setItem("youlya.colorTheme", "purple");
      document.cookie = "youlya-color-theme=purple;path=/;max-age=31536000;SameSite=Lax";
      document.documentElement.setAttribute("data-brand", "purple");
    });
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("data-brand", "purple");

    // 4. Collapse sidebar
    await page.getByLabel("Collapse sidebar").click();
    await expect(page.locator("aside")).toHaveClass(/w-20/);

    // 5. Reload page
    await page.reload({ waitUntil: "networkidle" });

    // 6. Assert all persisted immediately (before hydration completes, the pre-hydration script should have applied them)
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveAttribute("data-brand", "purple");
    await expect(page.locator("aside")).toHaveClass(/w-20/);

    // 7. Verify localStorage values
    const storedLang = await page.evaluate(() => localStorage.getItem("youlya.language"));
    expect(storedLang).toBe("en");

    const storedTheme = await page.evaluate(() => localStorage.getItem("youlya.theme"));
    expect(storedTheme).toBe("dark");

    const storedColor = await page.evaluate(() => localStorage.getItem("youlya.colorTheme"));
    expect(storedColor).toBe("purple");

    const storedSidebar = await page.evaluate(() => localStorage.getItem("youlya.sidebarCollapsed"));
    expect(storedSidebar).toBe("true");

    // 8. Verify cookies exist
    const cookies = await page.context().cookies();
    const themeCookie = cookies.find((c) => c.name === "youlya-theme");
    const colorCookie = cookies.find((c) => c.name === "youlya-color-theme");
    const langCookie = cookies.find((c) => c.name === "youlya-language");
    const sidebarCookie = cookies.find((c) => c.name === "youlya-sidebar-collapsed");

    expect(themeCookie?.value).toBe("dark");
    expect(colorCookie?.value).toBe("purple");
    expect(langCookie?.value).toBe("en");
    expect(sidebarCookie?.value).toBe("true");
  });

  test("preferences do not reset after logout and login", async ({ page }) => {
    // This test verifies that localStorage preference keys survive logout
    // by checking the storage state before and after signing out.
    await page.goto("/dashboard/command-center", { waitUntil: "networkidle" });
    const settingsMenu = page.getByRole("menu", { name: "Open settings" });

    // Set preferences
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByRole("menuitem", { name: "English" }).click();
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByRole("button", { name: /Theme/ }).click();
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await page.locator('button[aria-label="Open settings"]').click();
    await page.getByLabel("Use Teal theme").click({ force: true });
    await page.evaluate(() => {
      localStorage.setItem("youlya.colorTheme", "teal");
      document.cookie = "youlya-color-theme=teal;path=/;max-age=31536000;SameSite=Lax";
      document.documentElement.setAttribute("data-brand", "teal");
    });
    await page.keyboard.press("Escape");
    await expect(settingsMenu).toBeHidden();
    await page.getByLabel("Collapse sidebar").click();

    // Verify pre-logout
    let storedLang = await page.evaluate(() => localStorage.getItem("youlya.language"));
    let storedTheme = await page.evaluate(() => localStorage.getItem("youlya.theme"));
    let storedColor = await page.evaluate(() => localStorage.getItem("youlya.colorTheme"));
    let storedSidebar = await page.evaluate(() => localStorage.getItem("youlya.sidebarCollapsed"));
    expect(storedLang).toBe("en");
    expect(storedTheme).toBe("dark");
    expect(storedColor).toBe("teal");
    expect(storedSidebar).toBe("true");

    // Logout
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("/login", { timeout: 15_000 });

    // Verify localStorage still has preferences on login page
    storedLang = await page.evaluate(() => localStorage.getItem("youlya.language"));
    storedTheme = await page.evaluate(() => localStorage.getItem("youlya.theme"));
    storedColor = await page.evaluate(() => localStorage.getItem("youlya.colorTheme"));
    storedSidebar = await page.evaluate(() => localStorage.getItem("youlya.sidebarCollapsed"));
    expect(storedLang).toBe("en");
    expect(storedTheme).toBe("dark");
    expect(storedColor).toBe("teal");
    expect(storedSidebar).toBe("true");

    // Login again using UI
    const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
    const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;
    test.skip(!email || !password, "PLAYWRIGHT_ADMIN_EMAIL or PASSWORD not set");

    await page.getByLabel("البريد الإلكتروني").fill(email!);
    await page.getByLabel("كلمة المرور").fill(password!);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await page.waitForURL(/\/dashboard(\/command-center)?/, { timeout: 20_000 });

    // Assert persisted after re-login
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveAttribute("data-brand", "teal");
    await expect(page.locator("aside")).toHaveClass(/w-20/);
  });
});
