import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.body, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe("desktop viewport", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  async function expectInspectorPaneScrollable(page, paneId) {
    const pane = page.locator(`#${paneId}`);
    await expect(pane).toBeVisible();
    const metrics = await pane.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: getComputedStyle(element).overflowY,
    }));
    expect(metrics.overflowY).toBe("auto");
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

    await pane.evaluate((element) => { element.scrollTop = 0; });
    await pane.hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => pane.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  }

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

  test("keeps note and source panes within the viewport and independently scrollable", async ({ page }) => {
    await loadApp(page);
    await expect(page.locator(".note-runtime-content")).toBeVisible();

    const inspectorMetrics = await page.locator(".learning-inspector").evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, height: box.height, viewportHeight: window.innerHeight };
    });
    expect(inspectorMetrics.top).toBeGreaterThanOrEqual(0);
    expect(inspectorMetrics.height).toBeGreaterThanOrEqual(inspectorMetrics.viewportHeight - 1);
    expect(inspectorMetrics.bottom).toBeLessThanOrEqual(inspectorMetrics.viewportHeight + 1);

    await expectInspectorPaneScrollable(page, "learning-inspector-panel-notes");
    await page.getByRole("tab", { name: "源码" }).click();
    await expect(page.locator(".source-viewer .code-highlight-viewport")).toBeVisible();
    await expectInspectorPaneScrollable(page, "learning-inspector-panel-source");
  });
});

test.describe("narrow viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("keeps mobile navigation and full-screen inspector operable", async ({ page }) => {
    await loadApp(page);
    const navigationHeading = page.getByRole("heading", { name: "React 核心实验室", exact: true });
    const shell = page.locator(".workbench-shell");
    const navigationSlot = page.locator(".workbench-navigation-slot");
    const contentSlot = page.locator(".workbench-content-slot");
    await expect(navigationHeading).toBeHidden();
    await expect(page.locator(".workbench-inspector-slot")).toBeVisible();
    await page.getByRole("button", { name: "关闭学习面板" }).last().click();
    const menu = page.getByRole("button", { name: "打开侧边导航" });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("aria-controls", "workbench-navigation");
    await menu.focus();
    await menu.press("Enter");
    await expect(shell).toHaveAttribute("data-mobile-navigation-open", "true");
    await expect(navigationHeading).toBeVisible();
    await expect(navigationSlot).toBeFocused();
    await expect(contentSlot).toHaveAttribute("inert", "");
    const closeMenu = page.getByRole("button", { name: "关闭侧边导航" });
    await expect(closeMenu).toHaveAttribute("aria-expanded", "true");
    await expect(closeMenu).toHaveAttribute("aria-controls", "workbench-navigation");

    await page.keyboard.press("Escape");
    await expect(shell).toHaveAttribute("data-mobile-navigation-open", "false");
    await expect(navigationHeading).toBeHidden();
    await expect(contentSlot).not.toHaveAttribute("inert", "");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await menu.press("Enter");
    await expect(shell).toHaveAttribute("data-mobile-navigation-open", "true");
    await expect(navigationSlot).toBeFocused();
    await page.getByRole("searchbox", { name: "搜索知识点或关键词" }).fill("Modal Focus");
    await page.locator("button.workbench-navigation-item").filter({ hasText: "Modal Focus" }).click();
    await expect(shell).toHaveAttribute("data-mobile-navigation-open", "false");
    await expect(navigationHeading).toBeHidden();
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Modal Focus");
    await expectNoPageOverflow(page);
  });
});
