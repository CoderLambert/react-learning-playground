import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("React Learning Workbench integration", () => {
  test("persists shell state, restores demo URLs, and exercises inspector interactions", async ({ page }) => {
    await loadApp(page);

    const collapse = page.getByRole("button", { name: "收起左侧导航" });
    await collapse.click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-navigation-collapsed", "true");
    await page.getByRole("button", { name: "展开左侧导航" }).click();

    await openDemo(page, "State Snapshot、Batching 与 Update Queue");
    await expect(page).toHaveURL(/demo=state-snapshot-queue/);
    await expect(page.getByRole("heading", { name: "State Snapshot、Batching 与 Update Queue", exact: true })).toBeVisible();
    await expect(page.locator(".note-toc")).toBeVisible();

    const resize = page.getByRole("separator", { name: "调整学习面板宽度" });
    const before = Number(await resize.getAttribute("aria-valuenow"));
    await resize.press("ArrowLeft");
    await expect(resize).toHaveAttribute("aria-valuenow", String(before + 24));

    const box = await resize.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + 60);
      await page.mouse.down();
      await page.mouse.move(box.x - 40, box.y + 60);
      await page.mouse.up();
      expect(Number(await resize.getAttribute("aria-valuenow"))).toBeGreaterThan(before);
    }

    await page.getByRole("tab", { name: "源码", exact: true }).click();
    await expect(page.locator(".source-viewer--inspector")).toBeVisible();
    await page.getByRole("tab", { name: "笔记", exact: true }).click();

    await page.getByRole("button", { name: "进入专注模式" }).click();
    await expect(page.locator(".learning-inspector")).toHaveClass(/is-focus-mode/);
    await page.keyboard.press("Escape");
    await expect(page.locator(".learning-inspector")).not.toHaveClass(/is-focus-mode/);

    await page.getByRole("button", { name: "关闭学习面板" }).last().click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "false");
    await page.getByRole("button", { name: "打开学习面板" }).click();
    await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "true");

    await page.reload();
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("State Snapshot");
  });

  test("canonicalizes an invalid demo URL", async ({ page }) => {
    await page.goto("./?demo=does-not-exist");
    await expect(page).not.toHaveURL(/does-not-exist/);
    await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
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
