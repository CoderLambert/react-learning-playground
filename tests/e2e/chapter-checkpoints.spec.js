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
      await expect(checkpoint.locator(`[data-chapter-next-step="${chapter}"]`)).toBeVisible();
      expect(await checkpoint.locator("ol").nth(0).locator("li").count()).toBeGreaterThanOrEqual(4);
      expect(await checkpoint.locator("ol").nth(1).locator("li").count()).toBeGreaterThanOrEqual(2);
    }
  });

  test("edits, hides, restores and persists custom checkpoint questions", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Reducer + Context 双通道优化");

    const checkpoint = page.locator('[data-chapter-checkpoint="3"]');
    const firstQuestion = checkpoint.locator('[data-question-id="ch03-q01"]');
    await firstQuestion.getByRole("button", { name: "编辑" }).click();
    await firstQuestion.locator("textarea").fill("如何判断一个值是否真的需要成为 State？");
    await firstQuestion.getByRole("button", { name: "保存" }).click();
    await expect(firstQuestion).toContainText("如何判断一个值是否真的需要成为 State？");

    await firstQuestion.getByRole("button", { name: "从评测中移除" }).click();
    await expect(checkpoint.getByRole("button", { name: "撤销" })).toBeVisible();
    await checkpoint.getByText("已隐藏题目 · 1", { exact: true }).click();
    await expect(checkpoint.getByText("如何判断一个值是否真的需要成为 State？", { exact: true })).toBeVisible();
    await checkpoint.getByRole("button", { name: "恢复显示" }).click();
    await expect(checkpoint.locator('[data-question-id="ch03-q01"]')).toContainText("如何判断一个值是否真的需要成为 State？");

    await checkpoint.getByText("＋ 添加自己的评测题", { exact: true }).click();
    await checkpoint.getByPlaceholder("写下你想加入本章评测的问题或练习…").fill("我能解释 reducer 的状态转换边界吗？");
    await checkpoint.getByRole("button", { name: "添加到本章" }).click();
    const custom = checkpoint.locator("li").filter({ hasText: "我能解释 reducer 的状态转换边界吗？" });
    await expect(custom).toBeVisible();
    await custom.getByRole("button", { name: "删除自定义题" }).click();
    await expect(checkpoint.getByText("我能解释 reducer 的状态转换边界吗？", { exact: true })).toHaveCount(0);
    await checkpoint.getByRole("button", { name: "撤销" }).click();
    await expect(checkpoint.getByText("我能解释 reducer 的状态转换边界吗？", { exact: true })).toBeVisible();

    await page.reload();
    await openDemo(page, "Reducer + Context 双通道优化");
    const reloaded = page.locator('[data-chapter-checkpoint="3"]');
    await expect(reloaded.getByText("如何判断一个值是否真的需要成为 State？", { exact: true })).toBeVisible();
    await expect(reloaded.getByText("我能解释 reducer 的状态转换边界吗？", { exact: true })).toBeVisible();

    const edited = reloaded.locator('[data-question-id="ch03-q01"]');
    await edited.getByRole("button", { name: "恢复课程默认" }).click();
    await expect(edited).toContainText("如何判断一个值应该成为 State，还是应该从现有 Props/State 派生计算？");
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
    await expect(page.locator("[data-integration-lab]")).toHaveCount(3);
    await expect(page.locator("[data-chapter-next-step]")).toHaveCount(12);
  });
});
