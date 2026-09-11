import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

const CHAPTER_END_DEMOS = [
  ["属性逐层透传解法", 1],
  ["Trigger → Render → Commit", 2],
  ["Reducer + Context 双通道优化", 3],
  ["Layout Effect 与高级 Ref", 4],
  ["useOptimistic 成功收敛与失败回退", 5],
  ["Transition Pending 与 Deferred UI", 6],
  ["React Compiler 自动优化模型", 7],
  ["Portal 与第三方 DOM 生命周期", 8],
  ["请求竞态、取消与 Optimistic Mutation", 9],
  ["Route Loader 数据边界", 10],
  ["TypeScript for React 类型边界", 11],
  ["Server Functions 与 Framework 边界", 12],
];

test.describe("chapter review checkpoints", () => {
  test("shows one question/exercise checkpoint at every chapter boundary", async ({ page }) => {
    await loadApp(page);

    for (const [demoLabel, chapter] of CHAPTER_END_DEMOS) {
      await openDemo(page, demoLabel);
      const checkpoint = page.locator(`[data-chapter-checkpoint="${chapter}"]`);
      await expect(checkpoint).toBeVisible();
      await expect(checkpoint.getByText("你现在应该能回答什么？", { exact: true })).toBeVisible();
      await expect(checkpoint.getByText("练习", { exact: true })).toBeVisible();
      expect(await checkpoint.locator("ol").nth(0).locator("li").count()).toBeGreaterThanOrEqual(4);
      expect(await checkpoint.locator("ol").nth(1).locator("li").count()).toBeGreaterThanOrEqual(2);
    }
  });

  test("renders exactly twelve checkpoints in continuous-reading mode", async ({ page }) => {
    await loadApp(page);
    await page.getByRole("button", { name: /全部功能完整总览/ }).click();
    await expect(page.locator("[data-chapter-checkpoint]")).toHaveCount(12);
  });
});
