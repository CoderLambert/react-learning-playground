import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function openListsAndKey(page) {
  await loadApp(page);
  await openDemo(page, "列表渲染与 key 身份");
  return page.locator("[data-learning-flow='single']");
}

test("Lists and Key exposes one Understand Practice Verify journey instead of parallel learning modes", async ({ page }) => {
  const flow = await openListsAndKey(page);

  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("key → Component Identity → State preservation");
  await expect(flow).toContainText("不只是性能优化");
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "AI", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "笔记", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "评测", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "官方文档", exact: true })).toHaveCount(0);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("heading", { name: "Practice", exact: true })).toBeVisible();
  await expect(page.getByText("Guided Learning", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await expect(page.getByRole("heading", { name: "准备好检查理解了吗？" })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
  await expect(page.getByRole("button", { name: /让 AI/ })).toHaveCount(0);
});

test("canonical verification works without AI authoring and wrong answers route back to evidence", async ({ page }) => {
  const flow = await openListsAndKey(page);
  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();

  await page.getByRole("button", { name: "开始测试" }).click();
  await expect(page.getByText("在可重排列表中，稳定 key 最核心的作用是什么？")).toBeVisible();

  await page.getByRole("radio", { name: "只用于消除控制台 warning，不影响 State 保留" }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("再想一想", { exact: true })).toBeVisible();
  await expect(page.getByText(/key 的核心是 sibling 范围内的身份线索/)).toBeVisible();

  await page.getByRole("button", { name: "查看依据 1" }).click();
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".source-viewer--inspector")).toHaveAttribute("data-source-focus", "39-46");

  await page.getByRole("button", { name: /关闭学习面板/ }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /index 表示当前位置/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("回答正确", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /数据模型中创建后保持稳定的 todo.id/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  await expect(page.getByText("本轮评测已完成", { exact: true })).toBeVisible();
  await expect(flow.getByText("需要复习", { exact: true })).toBeVisible();
  await expect(flow).toContainText("最近一次已完成评测有 1 道错误");
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
});

test("official deep reading returns to the current Understand stage", async ({ page }) => {
  const flow = await openListsAndKey(page);

  await page.getByRole("button", { name: "React 官方解释" }).click();
  await expect(page.locator(".official-docs-pane")).toBeVisible();
  await expect(page.locator(".official-docs-frame")).toHaveAttribute(
    "src",
    /rendering-lists#keeping-list-items-in-order-with-key$/,
  );

  await page.getByRole("button", { name: "返回实验" }).click();
  await expect(flow).toBeVisible();
  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
});
// @browser-owner workbench
