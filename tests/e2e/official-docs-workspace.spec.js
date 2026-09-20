import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test("verified React docs stay embedded and support focused fullscreen reading", async ({ page }) => {
  await loadApp(page);
  await openDemo(page, "Component、JSX 与纯渲染");

  const officialViewTab = page.getByRole("tab", { name: "官方文档", exact: true });
  await expect(officialViewTab).toBeVisible();
  await officialViewTab.click();

  const pane = page.locator(".official-docs-pane");
  const frame = page.locator(".official-docs-frame");
  const referencePicker = page.getByLabel("选择官方资料");

  await expect(pane).toBeVisible();
  await expect(pane).toHaveAttribute("data-provider", "React");
  await expect(pane).toHaveAttribute("data-presentation", "embed");
  await expect(frame).toHaveAttribute(
    "src",
    "https://zh-hans.react.dev/learn/your-first-component",
  );

  await referencePicker.selectOption({
    label: "延伸 · React · 保持组件纯粹",
  });
  await expect(frame).toHaveAttribute(
    "src",
    "https://zh-hans.react.dev/learn/keeping-components-pure",
  );

  await page.getByRole("button", { name: "全屏阅读官方文档" }).click();
  await expect(pane).toHaveAttribute("data-fullscreen", "true");
  await expect(page.locator(".official-docs-toolbar")).toBeHidden();
  await expect(frame).toBeVisible();

  await page.getByRole("button", { name: "退出官方文档全屏" }).click();
  await expect(pane).toHaveAttribute("data-fullscreen", "false");
  await expect(page.locator(".official-docs-toolbar")).toBeVisible();

  await page.getByRole("button", { name: "返回实验" }).click();
  await expect(page.locator(".demo-page h2.demo-title")).toContainText("Component");
});

test("third-party official sources use a reliable external-reading state instead of a blind iframe", async ({ page }) => {
  await loadApp(page);
  await openDemo(page, "Server State Cache 生命周期");

  await page.getByRole("tab", { name: "官方文档", exact: true }).click();

  const pane = page.locator(".official-docs-pane");
  const externalState = page.locator(".official-docs-external");

  await expect(pane).toHaveAttribute("data-provider", "TanStack Query");
  await expect(pane).toHaveAttribute("data-presentation", "external");
  await expect(page.locator(".official-docs-frame")).toHaveCount(0);
  await expect(externalState).toContainText("Important Defaults");
  await expect(page.getByRole("button", { name: "全屏阅读官方文档" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /在 TanStack Query 官网阅读/ })).toHaveAttribute(
    "href",
    "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults",
  );

  await page.getByLabel("选择官方资料").selectOption({
    label: "延伸 · TanStack Query · Query Keys",
  });
  await expect(externalState).toContainText("Query Keys");
  await expect(page.getByRole("link", { name: /在 TanStack Query 官网阅读/ })).toHaveAttribute(
    "href",
    "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
  );
});

test("browser back navigation resets transient official-reading state to the restored lesson", async ({ page }) => {
  await loadApp(page);
  await openDemo(page, "Props 基础与解构");

  await page.getByRole("tab", { name: "官方文档", exact: true }).click();
  await expect(page.locator(".official-docs-pane")).toBeVisible();

  await page.goBack();

  await expect(page.locator(".official-docs-pane")).toHaveCount(0);
  await expect(page.locator(".demo-page h2.demo-title")).toContainText("Component");
  await expect(page.getByRole("tab", { name: "实验内容", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
// @browser-owner workbench
