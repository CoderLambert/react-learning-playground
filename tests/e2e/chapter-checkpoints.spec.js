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
  test("shows a manageable question bank at every chapter boundary", async ({ page }) => {
    await loadApp(page);

    for (const [demoLabel, chapter] of CHAPTER_END_DEMOS) {
      await openDemo(page, demoLabel);
      const checkpoint = page.locator(`[data-chapter-checkpoint="${chapter}"]`);
      await expect(checkpoint).toBeVisible();
      await expect(checkpoint.getByText("题库管理", { exact: true })).toBeVisible();
      await expect(checkpoint.getByLabel("查看已隐藏内置题")).toBeVisible();
      await expect(checkpoint.locator(`[data-chapter-next-step="${chapter}"]`)).toBeVisible();
      expect(await checkpoint.locator('[data-question-id*=":question:"]').count()).toBeGreaterThanOrEqual(4);
      expect(await checkpoint.locator('[data-question-id*=":exercise:"]').count()).toBeGreaterThanOrEqual(2);
    }
  });

  test("persists builtin overrides and custom CRUD/order across reload", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, CHAPTER_END_DEMOS[0][0]);

    const checkpoint = page.locator('[data-chapter-checkpoint="1"]');
    const firstBuiltin = checkpoint.locator('[data-question-id^="builtin:ch01:question:"]').first();
    const builtinId = await firstBuiltin.getAttribute("data-question-id");
    const originalText = (await firstBuiltin.locator("p").textContent())?.trim();

    await firstBuiltin.getByRole("button", { name: "编辑", exact: true }).click();
    await firstBuiltin.getByLabel("编辑问题").fill("Render 纯函数为什么必须可重复执行？");
    await firstBuiltin.getByRole("button", { name: "保存", exact: true }).click();
    await expect(firstBuiltin).toHaveAttribute("data-question-id", builtinId);
    await expect(firstBuiltin).toContainText("Render 纯函数为什么必须可重复执行？");

    await firstBuiltin.getByRole("button", { name: "隐藏", exact: true }).click();
    await expect(checkpoint.locator(`[data-question-id="${builtinId}"]`)).toHaveCount(0);
    await checkpoint.getByRole("button", { name: "撤销上一步", exact: true }).click();
    await expect(checkpoint.locator(`[data-question-id="${builtinId}"]`)).toContainText("Render 纯函数为什么必须可重复执行？");

    const restoredBuiltin = checkpoint.locator(`[data-question-id="${builtinId}"]`);
    await restoredBuiltin.getByRole("button", { name: "恢复默认", exact: true }).click();
    await expect(restoredBuiltin).toContainText(originalText);

    await restoredBuiltin.getByRole("button", { name: "隐藏", exact: true }).click();
    await checkpoint.getByLabel("查看已隐藏内置题").check();
    const hiddenBuiltin = checkpoint.locator(`[data-question-id="${builtinId}"]`);
    await expect(hiddenBuiltin).toContainText("已隐藏");
    await hiddenBuiltin.getByRole("button", { name: "恢复显示", exact: true }).click();
    await checkpoint.getByLabel("查看已隐藏内置题").uncheck();

    const newContent = checkpoint.getByLabel("新内容");
    await newContent.focus();
    await page.keyboard.type("自定义：解释组件身份与 stable key");
    await checkpoint.getByRole("button", { name: "新增", exact: true }).click();

    let custom = checkpoint.locator('[data-question-id^="custom:"]').filter({ hasText: "组件身份与 stable key" }).first();
    await expect(custom).toBeVisible();
    await custom.getByRole("button", { name: "编辑", exact: true }).click();
    await custom.getByLabel("编辑问题").fill("自定义：用反例解释组件身份与 stable key");
    await custom.getByRole("button", { name: "保存", exact: true }).click();
    await custom.getByRole("button", { name: "复制", exact: true }).click();

    const copies = checkpoint.locator('[data-question-id^="custom:"]').filter({ hasText: "stable key" });
    await expect(copies).toHaveCount(2);
    const copy = copies.filter({ hasText: "（副本）" });
    await expect(copy).toHaveCount(1);
    await copy.getByRole("button", { name: "上移", exact: true }).click();

    custom = checkpoint.locator('[data-question-id^="custom:"]').filter({ hasText: "用反例解释组件身份与 stable key" }).filter({ hasNotText: "副本" });
    await custom.getByRole("button", { name: "删除", exact: true }).click();
    await expect(custom).toHaveCount(0);

    await page.reload();
    await openDemo(page, CHAPTER_END_DEMOS[0][0]);
    const reloaded = page.locator('[data-chapter-checkpoint="1"]');
    await expect(reloaded.locator('[data-question-id^="custom:"]').filter({ hasText: "（副本）" })).toHaveCount(1);
    await expect(reloaded.locator(`[data-question-id="${builtinId}"]`)).toContainText(originalText);
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
