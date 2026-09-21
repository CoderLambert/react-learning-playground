import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

async function openGuidedLesson(page, learningUnitId) {
  await page.goto(`./?demo=${learningUnitId}`);
  await expect(page.locator("h2.demo-title").first()).toBeVisible();

  if ([
    "rendering-lists-key",
    "state-snapshot-queue",
    "preserving-resetting-state",
    "not-need-effect",
  ].includes(learningUnitId)) {
    await page.locator("[data-learning-flow='single'] .single-learning-flow__stages button").filter({ hasText: "实践" }).click();
    await expect(page.locator("[data-guided-entry]")).toBeVisible();
    await page.getByRole("button", { name: /开始实践|继续实践/ }).click();
  } else {
    await expect(page.locator("[data-guided-entry]")).toBeVisible();
    await page.getByRole("button", { name: /开始|继续 Guided Learning/ }).click();
  }

  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
}

async function acknowledgeAndExplain(page, explanation) {
  const flow = page.locator("[data-guided-flow]");
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "explain");
  await page.getByRole("textbox", { name: "你的 explanation" }).fill(explanation);
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "practice");
}

async function submitPatch(page, optionId) {
  const flow = page.locator("[data-guided-flow]");
  const practice = page.locator("[data-guided-practice-kind='patch-choice']");
  await expect(practice).toBeVisible();
  await expect(practice.getByText("期望结果", { exact: true })).toHaveCount(0);
  await practice.locator(`input[value="${optionId}"]`).check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "review");
  await expect(flow.locator("[data-guided-practice-outcome='correct']")).toBeVisible();
}

test("State Snapshot Practice V2 requires a queue-safe code repair", async ({ page }) => {
  await openGuidedLesson(page, "state-snapshot-queue");
  await page.getByRole("radio", { name: "3" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();

  const demo = page.locator(".guided-flow-demo-surface");
  await demo.getByRole("button", { name: "Replace × 3" }).click();
  await acknowledgeAndExplain(page, "三个 replace 都读取当前 render snapshot，所以不会依次消费 queue 中前一项结果。");

  await expect(page.locator("[data-guided-practice-kind='patch-choice']")).toContainText("handlePlusThree");
  await submitPatch(page, "functional-updaters");
  await expect(page.locator("[data-guided-review-practice]")).toContainText("setCount((n) => n + 1)");
});

test("List Key Practice V2 diagnoses and repairs unstable row identity", async ({ page }) => {
  await openGuidedLesson(page, "rendering-lists-key");

  await page.getByRole("radio", { name: /仍留在第一行/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "experiment");

  const demo = page.locator(".guided-flow-demo-surface");
  await demo.getByRole("button", { name: "恢复数据" }).click();
  await demo.getByRole("button", { name: "使用 index key" }).click();
  await demo.getByPlaceholder("给这一行输入临时备注").first().fill("A-note");
  await demo.getByRole("button", { name: "反转顺序" }).click();
  await expect(demo.locator("input[placeholder='给这一行输入临时备注']").first()).toHaveValue("A-note");
  await demo.getByRole("button", { name: "使用 stable id" }).click();
  await demo.getByRole("button", { name: "恢复数据" }).click();
  await demo.getByPlaceholder("给这一行输入临时备注").first().fill("A-note");
  await demo.getByRole("button", { name: "反转顺序" }).click();
  await expect(demo.locator("input[placeholder='给这一行输入临时备注']").last()).toHaveValue("A-note");

  await acknowledgeAndExplain(page, "index 把身份绑在位置上；stable id 才让局部 State 跟随 todo 实体。");
  await submitPatch(page, "stable-todo-id-key");
  await expect(page.locator("[data-guided-review-practice]")).toContainText("key={todo.id}");
});

test("Preserve and Reset Practice V2 places the reset at the narrow identity boundary", async ({ page }) => {
  await openGuidedLesson(page, "preserving-resetting-state");
  await page.getByRole("radio", { name: /原草稿仍然保留/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();

  const demo = page.locator(".guided-flow-demo-surface");
  const chats = demo.locator("textarea");
  await chats.nth(0).fill("明天开会");
  await demo.getByRole("button", { name: "Alice" }).nth(0).click();
  await expect(chats.nth(0)).toHaveValue("明天开会");
  await chats.nth(1).fill("明天开会");
  await demo.getByRole("button", { name: "Alice" }).nth(1).click();
  await expect(chats.nth(1)).toHaveValue("");

  await acknowledgeAndExplain(page, "State 绑定组件身份；只应在业务身份真正变化的子树上改变 key。");
  await submitPatch(page, "key-editor-by-customer");
  await expect(page.locator("[data-guided-review-practice]")).toContainText("key={customer.id}");
});

test("You Might Not Need an Effect Practice V2 removes duplicated derived State", async ({ page }) => {
  await openGuidedLesson(page, "not-need-effect");
  await page.getByRole("radio", { name: /直接在这次 render 中/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "experiment");

  await acknowledgeAndExplain(page, "能从当前 props/state 推导的值属于 render，不需要额外 Effect 同步第二份 State。");
  await submitPatch(page, "derive-visible-products");
  await expect(page.locator("[data-guided-review-practice]")).toContainText("filterProducts(products, query)");
});

test("Effect Lifecycle Practice V2 orders update, commit, cleanup, and setup by stable ids", async ({ page }) => {
  await openGuidedLesson(page, "lifecycle-of-reactive-effects");
  await page.getByRole("radio", { name: /先 cleanup 旧房间连接/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();

  const demo = page.locator(".guided-flow-demo-surface");
  await demo.getByRole("button", { name: "清空日志" }).click();
  await demo.getByRole("button", { name: "房间 #102" }).click();
  await expect(demo).toContainText("cleanup：关闭房间 #101 的连接");
  await expect(demo).toContainText("setup：建立房间 #102 的连接");

  await acknowledgeAndExplain(page, "依赖变化触发新 render；commit 后先 cleanup 旧同步，再 setup 新同步。");

  const practice = page.locator("[data-guided-practice-kind='ordered-sequence']");
  await expect(practice).toBeVisible();
  await expect(practice.getByText("期望结果", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: /上移 用户操作触发更新/ }).click();
  await page.getByRole("button", { name: /上移 用户操作触发更新/ }).click();
  await page.getByRole("button", { name: /上移 React render/ }).click();
  await page.getByRole("button", { name: /上移 React commit/ }).click();
  await page.getByRole("button", { name: /上移 React commit/ }).click();
  await page.getByRole("button", { name: /上移 Effect cleanup/ }).click();

  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  const flow = page.locator("[data-guided-flow]");
  await expect(flow).toHaveAttribute("data-guided-current-step", "review");
  await expect(flow.locator("[data-guided-practice-outcome='correct']")).toBeVisible();
  const review = page.locator("[data-guided-review-practice]");
  await expect(review).toContainText("topicId 从 news 变为 sports");
  await expect(review).toContainText("取消上一轮 news 订阅");
  await expect(review).toContainText("建立 sports 订阅");
});

test("Guided responses stay isolated when switching to another lesson", async ({ page }) => {
  await openGuidedLesson(page, "rendering-lists-key");
  await page.getByRole("radio", { name: /仍留在第一行/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "experiment");

  await openGuidedLesson(page, "not-need-effect");
  await expect(page.locator("[data-guided-first-prediction]")).toHaveCount(0);
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
});
// @browser-owner workbench
