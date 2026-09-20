import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test("React official docs use the center workspace and fullscreen shows only the document", async ({ page }) => {
  await loadApp(page);
  await openDemo(page, "Component、JSX 与纯渲染");

  const officialViewTab = page.getByRole("tab", { name: "React 官方文档", exact: true });
  await expect(officialViewTab).toBeVisible();
  await officialViewTab.click();

  const pane = page.locator(".official-docs-pane");
  const frame = page.locator(".official-docs-frame");

  await expect(pane).toBeVisible();
  await expect(page.getByRole("tab", { name: "官方", exact: true })).toHaveCount(0);
  await expect(frame).toHaveAttribute(
    "src",
    "https://zh-hans.react.dev/learn/your-first-component",
  );

  await page.getByRole("button", { name: "全屏阅读 React 官方文档" }).click();
  await expect(pane).toHaveAttribute("data-fullscreen", "true");
  await expect(page.locator(".official-docs-toolbar")).toBeHidden();
  await expect(frame).toBeVisible();

  await page.getByRole("button", { name: "退出官方文档全屏" }).click();
  await expect(pane).toHaveAttribute("data-fullscreen", "false");
  await expect(page.locator(".official-docs-toolbar")).toBeVisible();

  await page.getByRole("button", { name: "返回实验" }).click();
  await expect(page.locator(".demo-page h2.demo-title")).toContainText("Component");
});
// @browser-owner workbench
