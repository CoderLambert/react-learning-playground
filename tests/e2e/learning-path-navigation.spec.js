import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("Workbench learning path navigation", () => {
  test("shows chapter position and navigates previous, next and checkpoint without search", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Event Handler 与事件传播");

    const path = page.locator("[data-learning-path-current]");
    await expect(path).toContainText("Chapter 02");
    await expect(path).toContainText("1/4");

    const nextButton = path.getByRole("button", { name: "下一知识点" });
    await nextButton.focus();
    await expect(nextButton).toBeFocused();
    await nextButton.press("Enter");
    await expect(page).toHaveURL(/demo=state-snapshot-queue/);
    await expect(page.locator(".breadcrumb-current")).toContainText("State Snapshot");

    await page.locator("[data-learning-path-current]").getByRole("button", { name: "上一知识点" }).click();
    await expect(page).toHaveURL(/demo=event-propagation/);

    await page.locator("[data-learning-path-current]").getByRole("button", { name: /Checkpoint/ }).click();
    await expect(page).toHaveURL(/demo=render-commit/);
    await expect(page.locator('[data-chapter-checkpoint="2"]')).toBeVisible();
  });

  test("chapter checkpoint next step enters the next chapter first unit through the existing URL contract", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Trigger → Render → Commit");

    const checkpoint = page.locator('[data-chapter-checkpoint="2"]');
    await expect(checkpoint).toBeVisible();
    const nextChapterButton = checkpoint.getByRole("button", { name: "前往下一章" });
    await nextChapterButton.focus();
    await expect(nextChapterButton).toBeFocused();
    await nextChapterButton.press("Enter");

    await expect(page).toHaveURL(/demo=state-dry/);
    await expect(page.locator("[data-learning-path-current]")).toContainText("Chapter 03");
  });

  test("path navigation preserves persisted inspector state", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("react-learning-workbench:inspector-open", "true");
      localStorage.setItem("react-learning-workbench:inspector-tab", "source");
      localStorage.setItem("react-learning-workbench:inspector-width", "640");
    });
    await loadApp(page);
    await openDemo(page, "Event Handler 与事件传播");

    const shell = page.locator(".workbench-shell");
    await expect(shell).toHaveAttribute("data-inspector-open", "true");
    await page.locator("[data-learning-path-current]").getByRole("button", { name: "下一知识点" }).click();
    await expect(shell).toHaveAttribute("data-inspector-open", "true");
    await expect(page.getByRole("tab", { name: "源码" })).toHaveAttribute("aria-selected", "true");
    await expect.poll(async () => page.evaluate(() => localStorage.getItem("react-learning-workbench:inspector-width"))).toBe("640");
  });
});
