import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

async function openListsAndKey(page) {
  await loadApp(page);
  await openDemo(page, "列表渲染与 key 身份");
  return page.locator("[data-learning-flow='single']");
}

test("Lists and Key exposes one deep Understand Practice Verify journey instead of parallel learning modes", async ({ page }) => {
  const flow = await openListsAndKey(page);

  await expect(flow).toHaveAttribute("data-learning-stage", "understand");
  await expect(flow).toContainText("key → Component Identity → State preservation");
  await expect(flow).toContainText("先把这些对象分开，再讨论 key");
  await expect(flow).toContainText("Local State");
  await expect(flow).toContainText("DOM");
  await expect(flow).toContainText("index key + reorder");
  await expect(flow).toContainText("stable id + reorder");
  await expect(flow).toContainText("切换 index key ↔ stable id");
  await expect(flow).toContainText("错的不是“DOM 完全没更新”");
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "AI", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "笔记", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "评测", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "官方文档", exact: true })).toHaveCount(0);

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "practice");
  await expect(page.getByRole("heading", { name: "实践", exact: true })).toBeVisible();
  await expect(page.getByText("Guided Learning", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "开始实践" })).toBeVisible();

  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();
  await expect(flow).toHaveAttribute("data-learning-stage", "verify");
  await expect(page.getByRole("heading", { name: "准备好检查理解了吗？" })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
  await expect(page.getByRole("button", { name: /让 AI/ })).toHaveCount(0);
});

test("diagnostic verification turns a known wrong model into counter-evidence before the full answer", async ({ page }) => {
  const flow = await openListsAndKey(page);
  await flow.locator(".single-learning-flow__stages button").filter({ hasText: "验证" }).click();

  await page.getByRole("button", { name: "开始测试" }).click();

  await page.getByRole("radio", { name: /给同级元素提供稳定身份线索/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("回答正确", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /下一题/ }).click();

  await expect(page.getByText(/AAA 还在第一行/)).toBeVisible();
  await page.getByRole("radio", { name: /DOM 没有更新/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();

  const remediation = page.locator("[data-assessment-misconception='dom-not-updated']");
  await expect(page.getByText("再想一想", { exact: true })).toBeVisible();
  await expect(remediation).toBeVisible();
  await expect(remediation).toContainText("把“组件身份复用”理解成“DOM 没更新”");
  await expect(remediation).toContainText("反证线索");
  await expect(remediation).toContainText("先做这个实验");
  await expect(remediation).toContainText("第一行输入 AAA → 反转顺序");
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);
  await expect(remediation.getByText(/reorder 后 task Props 会正常更新/)).toBeHidden();
  await expect(remediation.getByText("实验后再看完整解释")).toBeVisible();

  await page.getByRole("button", { name: "重新选择" }).click();
  await expect(page.getByText("重新判断一次", { exact: true })).toBeVisible();
  await expect(page.getByText("正确答案", { exact: true })).toHaveCount(0);

  await page.getByRole("radio", { name: /AAA 存在 input DOM 节点内部/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  const secondRemediation = page.locator("[data-assessment-misconception='state-lives-in-dom']");
  await expect(secondRemediation).toBeVisible();
  await expect(secondRemediation).toContainText("把局部 State 当成 DOM 节点保存的数据");

  await page.getByRole("button", { name: "重新选择" }).click();
  await page.getByRole("radio", { name: /同一个 index 让原组件身份按位置延续/ }).check();
  await page.getByRole("button", { name: "再次验证" }).click();

  await expect(page.getByText("已纠正", { exact: true })).toBeVisible();
  await expect(page.locator("[data-assessment-correction='corrected']")).toBeVisible();
  await expect(page.getByText(/第一次错误仍保留在复习记录中/)).toBeVisible();

  await page.getByRole("button", { name: "查看依据 2" }).click();
  await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".source-viewer--inspector")).toHaveAttribute("data-source-focus", "22-33");

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /数据模型中创建后保持稳定的 todo.id/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /相同 task.id 让 React 在新位置认出同一个组件身份/ }).check();
  await page.getByRole("button", { name: "提交答案" }).click();
  await page.getByRole("button", { name: /下一题/ }).click();

  await page.getByRole("radio", { name: /显式 key 从 0 变成 task-a/ }).check();
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
