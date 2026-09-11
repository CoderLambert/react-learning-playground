import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("React Learning Workbench final acceptance", () => {
  test("loads a production note for every one of the 58 registered demos", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loadApp(page);

    const titleLocator = page.locator(
      "button.workbench-navigation-item .workbench-navigation-item-title",
    );
    const labels = (await titleLocator.allTextContents()).map((label) => label.trim());
    expect(labels).toHaveLength(58);

    for (const label of labels) {
      await openDemo(page, label);
      await page.getByRole("tab", { name: "笔记" }).click();
      await expect(page.locator(".note-runtime-content")).toBeVisible();
      await expect(page.getByText("该知识点的详细笔记尚未创建。", { exact: true })).toHaveCount(0);
      await expect(page.locator(".note-runtime-state-error")).toHaveCount(0);
    }
  });

  test("keeps the GitHub Pages base path and demo URL stable across refresh", async ({ page }) => {
    await page.goto("./?demo=props");
    await expect(page).toHaveURL(/\/react-learning-playground\/\?demo=props$/);
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Props 基础");
    await expect(page.locator(".note-runtime-content")).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/react-learning-playground\/\?demo=props$/);
    await expect(page.locator(".demo-page h2.demo-title")).toContainText("Props 基础");
    await expect(page.locator(".note-runtime-content")).toBeVisible();
  });
});
