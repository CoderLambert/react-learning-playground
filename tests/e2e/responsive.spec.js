import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.body, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe("desktop viewport", () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test("keeps navigation, content, forms, and inspector usable", async ({ page }) => {
    await loadApp(page);
    await expect(page.locator(".workbench-navigation-slot")).toBeVisible();
    await expect(page.getByRole("button", { name: /打开侧边导航/ })).toBeHidden();
    await expect(page.locator(".learning-inspector")).toBeVisible();
    await expectNoPageOverflow(page);
    await openDemo(page, "Props 基础与解构");
    await page.getByRole("tab", { name: "源码" }).click();
    await expect(page.locator(".source-viewer .code-highlight-viewport")).toBeVisible();
    await openDemo(page, "受控与非受控组件");
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Controlled / Uncontrolled");
    await expectNoPageOverflow(page);
  });
});

test.describe("narrow viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("keeps mobile navigation and full-screen inspector operable", async ({ page }) => {
    await loadApp(page);
    await expect(page.locator(".workbench-inspector-slot")).toBeVisible();
    await page.getByRole("button", { name: "关闭学习面板" }).last().click();
    const menu = page.getByRole("button", { name: /打开侧边导航/ });
    await expect(menu).toBeVisible();
    await menu.press("Enter");
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-mobile-navigation-open", "true");
    await page.getByRole("textbox", { name: "搜索知识点或关键词" }).fill("Modal Focus");
    await page.locator("button.workbench-navigation-item").filter({ hasText: "Modal Focus" }).click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-mobile-navigation-open", "false");
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Modal Focus");
    await expectNoPageOverflow(page);
  });
});
