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

const REAL_INTEGRATION_LABS = [
  [9, "tanstack-query", "Real Integration Lab: TanStack Query", "query identity", "actual TanStack Query runtime"],
  [10, "router", "React Router Data Router Real Lab", "URL", "nested route"],
  [12, "next-app-router", "Next.js App Router Real Lab", "Rendering Strategies", "framework runtime"],
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
      await expect(checkpoint.locator(`[data-assessment-runner="${chapter}"]`)).toBeVisible();
      await expect(checkpoint.locator(`[data-chapter-next-step="${chapter}"]`)).toBeVisible();
      expect(await checkpoint.locator("ol").nth(0).locator("li").count()).toBeGreaterThanOrEqual(4);
      expect(await checkpoint.locator("ol").nth(1).locator("li").count()).toBeGreaterThanOrEqual(2);
    }
  });

  test("persists and resumes a practice assessment without fabricating a score", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Trigger → Render → Commit");

    const checkpoint = page.locator('[data-chapter-checkpoint="2"]');
    let runner = checkpoint.locator('[data-assessment-runner="2"]');
    const answer = runner.getByLabel("你的回答");

    await answer.fill("state 是一次 render 的快照，因此当前事件闭包不会看到未来 render 的值。".repeat(12));
    await runner.locator('input[type="radio"]').nth(3).check();
    await runner.getByLabel("需要复习").check();
    await runner.getByRole("button", { name: "保存并继续" }).click();
    await expect(runner.getByLabel("你的回答")).toBeFocused();
    await runner.getByLabel("你的回答").fill("functional updater 使用更新队列里的前一个值。 ");
    await runner.getByRole("button", { name: "跳过" }).click();

    await page.reload();
    runner = page.locator('[data-assessment-runner="2"]');
    await expect(runner).toBeVisible();
    await runner.getByLabel("筛选").selectOption("review");
    await expect(runner.getByLabel("你的回答")).toHaveValue(/state 是一次 render 的快照/);
    await expect(runner.getByLabel("需要复习")).toBeChecked();

    await runner.getByRole("button", { name: "重新回答" }).click();
    await expect(runner.getByLabel("你的回答")).toBeFocused();
    await expect(runner.getByLabel("你的回答")).toHaveValue("");
    await runner.getByLabel("筛选").selectOption("all");
    await runner.getByRole("button", { name: "完成练习" }).click();

    await expect(runner.getByText("Practice Assessment · 完成", { exact: true })).toBeVisible();
    await expect(runner).toContainText("这里不提供自动评分");
    await expect(runner).not.toContainText(/Score:/i);

    await runner.getByRole("button", { name: "重新查看 / 回答" }).click();
    await expect(runner.getByLabel("你的回答")).toBeFocused();
    await runner.getByRole("button", { name: "完成练习" }).click();
    await runner.getByRole("button", { name: "重新开始" }).click();
    await expect(runner.getByLabel("你的回答")).toHaveValue("");
  });

  test("provides real integration lab handoffs after the relevant checkpoints", async ({ page }) => {
    await loadApp(page);

    for (const [chapter, labId, title, coreText, realLabText] of REAL_INTEGRATION_LABS) {
      const [demoLabel] = CHAPTER_END_DEMOS.find(([, chapterNumber]) => chapterNumber === chapter);
      await openDemo(page, demoLabel);
      const checkpoint = page.locator(`[data-chapter-checkpoint="${chapter}"]`);
      const lab = checkpoint.locator(`[data-integration-lab="${labId}"]`);
      await expect(lab).toBeVisible();
      await expect(lab.getByText(title, { exact: true })).toBeVisible();
      await expect(lab).toContainText(coreText);
      await expect(lab).toContainText(realLabText);
      await expect(lab.getByRole("link", { name: /打开 Lab README \/ Source/ })).toHaveAttribute(
        "href",
        new RegExp(`/integration-labs/${labId}$`),
      );
    }
  });

  test("renders exactly twelve checkpoints in continuous-reading mode", async ({ page }) => {
    await loadApp(page);
    await page.getByRole("button", { name: /全部功能完整总览/ }).click();
    await expect(page.locator("[data-chapter-checkpoint]")).toHaveCount(12);
    await expect(page.locator("[data-assessment-runner]")).toHaveCount(12);
    await expect(page.locator("[data-integration-lab]")).toHaveCount(3);
    await expect(page.locator("[data-chapter-next-step]")).toHaveCount(12);
  });
});
