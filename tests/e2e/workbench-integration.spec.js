import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("React Learning Workbench integration", () => {
  test("persists shell state, restores demo URLs, and exercises inspector interactions", async ({ page }) => {
    await loadApp(page);

    const collapse = page.getByRole("button", { name: "收起左侧导航" });
    await collapse.click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-navigation-collapsed", "true");
    await page.getByRole("button", { name: "展开左侧导航" }).click();

    await openDemo(page, "Props 基础");
    await expect(page).toHaveURL(/demo=props/);
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Props 基础");
    await expect(page.locator(".note-toc")).toBeVisible();

    const resize = page.getByRole("separator", { name: "调整学习面板宽度" });
    const before = Number(await resize.getAttribute("aria-valuenow"));
    await resize.press("ArrowLeft");
    await expect(resize).toHaveAttribute("aria-valuenow", String(before + 24));
    await expect.poll(() => page.evaluate(() => (
      window.localStorage.getItem("react-learning-workbench:inspector-width")
    ))).toBe(String(before + 24));

    const box = await resize.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + 60);
      await page.mouse.down();
      await page.mouse.move(box.x - 40, box.y + 60);
      await page.mouse.up();
      expect(Number(await resize.getAttribute("aria-valuenow"))).toBeGreaterThan(before);
      await expect.poll(() => page.evaluate(() => (
        window.localStorage.getItem("react-learning-workbench:inspector-width")
      ))).toBe(await resize.getAttribute("aria-valuenow"));
    }

    const notesTab = page.getByRole("tab", { name: "笔记", exact: true });
    const sourceTab = page.getByRole("tab", { name: "源码", exact: true });
    await notesTab.focus();
    await notesTab.press("ArrowRight");
    await expect(sourceTab).toBeFocused();
    await expect(sourceTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".source-viewer--inspector")).toBeVisible();
    await sourceTab.press("Home");
    await expect(notesTab).toBeFocused();
    await expect(notesTab).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "进入专注模式" }).click();
    await expect(page.locator(".learning-inspector")).toHaveClass(/is-focus-mode/);
    await page.getByRole("button", { name: "关闭学习面板" }).last().click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "false");
    await expect(page.locator(".workbench-shell")).not.toHaveClass(/workbench-focus-mode/);
    await page.getByRole("button", { name: "打开学习面板" }).click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "true");

    await page.reload();
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Props 基础");
  });

  test("canonicalizes an invalid demo URL", async ({ page }) => {
    await page.goto("./?demo=does-not-exist");
    await expect(page).not.toHaveURL(/does-not-exist/);
    await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
  });

  test("completes the state-snapshot-queue Guided practice inside the single learning flow", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "State Snapshot、Batching 与 Update Queue");

    const learningFlow = page.locator("[data-learning-flow='single']");
    await learningFlow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();

    const entry = page.locator("[data-guided-entry]");
    await expect(entry).toBeVisible();
    await expect(entry.getByRole("button", { name: "开始实践" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Replace × 3" })).toBeVisible();

    await entry.getByRole("button", { name: "开始实践" }).click();
    await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
    await expect(page.getByRole("button", { name: "Replace × 3" })).toHaveCount(0);
    await expect(page.getByText("提交前不会显示正确结果。")).toBeVisible();

    await page.getByRole("radio", { name: "3" }).check();
    await page.getByRole("button", { name: "提交 prediction" }).click();
    await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "experiment");
    await expect(page.getByRole("button", { name: "Replace × 3" })).toBeVisible();

    await page.locator("[data-guided-step='predict']").click();
    await expect(page.getByRole("radio", { name: "3" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "3" })).toBeDisabled();
    await page.locator("[data-guided-step='experiment']").click();
    await page.getByRole("button", { name: "Replace × 3" }).click();
    await page.getByRole("button", { name: "我已运行并观察结果" }).click();

    await page.getByRole("textbox", { name: "你的 explanation" }).fill("三个 replace 都读取同一份 render snapshot。");
    await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
    await page.getByRole("radio", { name: /结果可以相同，但 queue 处理语义不同/ }).check();
    await page.getByRole("button", { name: "提交 practice，查看 review" }).click();

    await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
    await expect(page.locator("[data-guided-flow]")).toContainText("第一次预测");
    await expect(page.locator("[data-guided-flow]")).toContainText("实际观察");
    await expect(page.locator("[data-guided-flow]")).toContainText("三个 replace 都读取同一份 render snapshot");
    await expect(page.getByRole("button", { name: "回顾笔记" })).toBeVisible();
    await expect(page.getByRole("button", { name: "查看源码" })).toBeVisible();

    await page.getByRole("button", { name: "退出实践" }).click();
    await expect(page.locator("[data-guided-flow]")).toHaveCount(0);
    await expect(entry).toBeVisible();
    await expect(page.getByRole("button", { name: "Replace × 3" })).toBeVisible();
  });

  test("keeps expanded navigation semantics coherent below 1180px", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await loadApp(page);
    const shell = page.locator(".workbench-shell");
    await expect(shell).toHaveAttribute("data-navigation-collapsed", "false");
    const navigationBox = await page.locator(".workbench-navigation-slot").boundingBox();
    expect(navigationBox?.width).toBeGreaterThan(200);
    await expect(page.getByRole("button", { name: "收起左侧导航" })).toBeVisible();
  });

  test("does not reserve inspector grid width when inspector is overlayed", async ({ page }) => {
    await page.setViewportSize({ width: 950, height: 800 });
    await loadApp(page);
    const navigationBox = await page.locator(".workbench-navigation-slot").boundingBox();
    const contentBox = await page.locator(".workbench-content-slot").boundingBox();
    const inspectorBox = await page.locator(".learning-inspector").boundingBox();
    expect(navigationBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(inspectorBox).not.toBeNull();
    expect((contentBox?.width ?? 0) + (navigationBox?.width ?? 0)).toBeGreaterThanOrEqual(949);
    expect(inspectorBox?.x).toBeGreaterThan(contentBox?.x ?? 0);
  });

  test("uses a full-screen inspector presentation on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loadApp(page);
    const inspector = page.locator(".workbench-inspector-slot");
    await expect(inspector).toBeVisible();
    const box = await inspector.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(389);
    expect(box?.height).toBeGreaterThanOrEqual(843);
  });
});
// @browser-owner workbench
