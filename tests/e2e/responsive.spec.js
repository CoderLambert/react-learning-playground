import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.body, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe("desktop viewport", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("keeps navigation, content, forms, and CodeViewer usable", async ({ page }) => {
    await loadApp(page);
    await expect(page.locator(".app-sidebar")).toBeVisible();
    await expect(page.getByRole("button", { name: /打开侧边导航/ })).toBeHidden();
    await expectNoPageOverflow(page);

    await openDemo(page, "Props 基础与解构");
    const toggle = page.locator(".code-accordion-toggle").first();
    await toggle.click();
    await expect(page.locator(".code-highlight-viewport").first()).toBeVisible();
    await expectNoPageOverflow(page);

    await openDemo(page, "受控与非受控组件");
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Controlled / Uncontrolled");
    await expectNoPageOverflow(page);
  });
});

test.describe("narrow viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps sidebar navigation, forms, and source viewing operable", async ({ page }) => {
    await loadApp(page);

    const menu = page.getByRole("button", { name: /打开侧边导航/ });
    await expect(menu).toBeVisible();
    await menu.press("Enter");
    await expect(page.locator(".app-sidebar")).toHaveClass(/open/);

    await page.getByRole("textbox", { name: "搜索知识点或关键词" }).fill("Modal Focus");
    await page.locator("button.nav-item").filter({ hasText: "Modal Focus" }).click();
    await expect(page.locator(".app-sidebar")).not.toHaveClass(/open/);
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Modal Focus");
    await expectNoPageOverflow(page);

    await openDemo(page, "Modal Focus");
    const codeToggle = page.locator(".code-accordion-toggle").first();
    await codeToggle.focus();
    await codeToggle.press("Space");
    await expect(page.locator(".code-highlight-viewport").first()).toBeVisible();
    await expectNoPageOverflow(page);

    await page.getByRole("textbox", { name: "搜索知识点或关键词" }).fill("");
    await openDemo(page, "语义、Label 与可访问状态反馈");
    const email = page.getByLabel("邮箱地址");
    await email.fill("learner@example.com");
    await email.press("Enter");
    await expect(page.getByRole("status")).toContainText("已保存 learner@example.com", { timeout: 3_000 });
    await expectNoPageOverflow(page);
  });
});
