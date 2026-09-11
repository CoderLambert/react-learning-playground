import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("application shell", () => {
  test("supports focused mode, category navigation, and all-demo mode", async ({ page, browserDiagnostics }) => {
    await loadApp(page);

    const navItems = page.locator("button.workbench-navigation-item");
    const demoCount = await navItems.count();
    expect(demoCount).toBeGreaterThan(50);
    expect(await page.locator(".workbench-navigation-group").count()).toBe(14);

    const categoryGroups = page.locator(".workbench-navigation-group");
    for (let index = 0; index < await categoryGroups.count(); index += 1) {
      await categoryGroups.nth(index).locator("button.workbench-navigation-item").first().click();
      await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
    }

    await page.getByRole("button", { name: /全部功能完整总览/ }).click();
    await expect(page.locator(".demo-all-container")).toBeVisible();
    await expect(page.locator('[id^="demo-"]')).toHaveCount(demoCount);
    await expect(page.locator('[id^="demo-"]').last()).toBeVisible();

    expect(browserDiagnostics.pageErrors).toHaveLength(0);
  });

  test("switches through every registered demo without a runtime crash", async ({ page }) => {
    await loadApp(page);
    const labels = await page.locator("button.workbench-navigation-item .workbench-navigation-item-title").allTextContents();
    expect(labels.length).toBeGreaterThan(50);
    for (const label of labels) await openDemo(page, label.trim());
  });

  test("searches titles, category names, and keywords and restores content when cleared", async ({ page }) => {
    await loadApp(page);
    const search = page.getByRole("searchbox", { name: "搜索知识点或关键词" });
    const navItems = page.locator("button.workbench-navigation-item");
    const fullCount = await navItems.count();

    await search.fill("Props");
    await expect(navItems.filter({ hasText: "Props 基础与解构" })).toBeVisible();
    await search.fill("Forms");
    await expect(page.locator(".workbench-navigation-group-header").filter({ hasText: "Forms 与 React 19 Actions" })).toBeVisible();
    expect(await navItems.count()).toBeGreaterThan(0);
    await search.fill("Cleanup");
    await expect(navItems.filter({ hasText: "useEffect 正确用法" })).toBeVisible();
    await search.fill("this-will-not-match-any-demo");
    await expect(page.getByText(/未找到匹配/)).toBeVisible();
    await expect(navItems).toHaveCount(0);
    await search.fill("");
    await expect(navItems).toHaveCount(fullCount);
  });
});
