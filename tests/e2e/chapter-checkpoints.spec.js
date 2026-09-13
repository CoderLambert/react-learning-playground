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
  test("shows a read-only learning check at every chapter boundary", async ({ page }) => {
    await loadApp(page);

    for (const [demoLabel, chapter] of CHAPTER_END_DEMOS) {
      await openDemo(page, demoLabel);
      const checkpoint = page.locator(`[data-chapter-checkpoint="${chapter}"]`);
      const readonly = checkpoint.locator(`[data-legacy-checkpoint-readonly="${chapter}"]`);

      await expect(checkpoint).toBeVisible();
      await expect(readonly).toBeVisible();
      await expect(readonly.getByText("章节学习检查（只读）", { exact: true })).toBeVisible();
      await expect(readonly).toContainText("Assessment 面板");
      expect(await readonly.locator('[data-checkpoint-item-kind="question"]').count()).toBeGreaterThanOrEqual(4);
      expect(await readonly.locator('[data-checkpoint-item-kind="exercise"]').count()).toBeGreaterThanOrEqual(2);
      await expect(checkpoint.locator("[data-assessment-runner]")).toHaveCount(0);
      await expect(checkpoint.getByRole("button", { name: /新增|编辑|隐藏|恢复默认/ })).toHaveCount(0);
      await expect(checkpoint.locator(`[data-chapter-next-step="${chapter}"]`)).toBeVisible();
    }
  });

  test("legacy localStorage question-bank data never re-enables editable checkpoint controls", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("react-learning-playground:assessment-question-bank:v1", JSON.stringify({
        version: 1,
        chapters: { 1: { customQuestions: [{ id: "custom:legacy", text: "legacy editable question" }] } },
      }));
    });
    await loadApp(page);
    await openDemo(page, CHAPTER_END_DEMOS[0][0]);

    const checkpoint = page.locator('[data-chapter-checkpoint="1"]');
    await expect(checkpoint.locator('[data-legacy-checkpoint-readonly="1"]')).toBeVisible();
    await expect(checkpoint.getByText("legacy editable question", { exact: true })).toHaveCount(0);
    await expect(checkpoint.getByText("题库管理", { exact: true })).toHaveCount(0);
    await expect(checkpoint.locator("[data-assessment-runner]")).toHaveCount(0);
    await expect(checkpoint.getByRole("button", { name: /新增|编辑|删除|隐藏/ })).toHaveCount(0);
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

  test("renders twelve read-only checkpoints in continuous-reading mode", async ({ page }) => {
    await loadApp(page);
    await page.getByRole("button", { name: /全部功能完整总览/ }).click();
    await expect(page.locator("[data-chapter-checkpoint]")).toHaveCount(12);
    await expect(page.locator("[data-legacy-checkpoint-readonly]")).toHaveCount(12);
    await expect(page.locator("[data-assessment-runner]")).toHaveCount(0);
    await expect(page.locator("[data-integration-lab]")).toHaveCount(3);
    await expect(page.locator("[data-chapter-next-step]")).toHaveCount(12);
  });
});
