import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

async function openGuidedLesson(page, learningUnitId) {
  await page.goto(`./?demo=${learningUnitId}`);
  await expect(page.locator("h2.demo-title").first()).toBeVisible();

  if (learningUnitId === "rendering-lists-key") {
    await page.locator("[data-learning-flow='single'] .single-learning-flow__stages button").filter({ hasText: "实践" }).click();
    await expect(page.locator("[data-guided-entry]")).toBeVisible();
    await page.getByRole("button", { name: /开始实践|继续实践/ }).click();
  } else {
    await expect(page.locator("[data-guided-entry]")).toBeVisible();
    await page.getByRole("button", { name: /开始|继续 Guided Learning/ }).click();
  }

  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
}

async function completeGuidedLesson(page, { prediction, practice, predictionSubmitted = false }) {
  const flow = page.locator("[data-guided-flow]");
  if (!predictionSubmitted) {
    await page.getByRole("radio", { name: prediction }).check();
    await page.getByRole("button", { name: "提交 prediction" }).click();
  }
  await expect(flow).toHaveAttribute("data-guided-current-step", "experiment");
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "explain");
  await page.getByRole("textbox", { name: "你的 explanation" }).fill("我根据真实 Demo 的观察解释了这个因果关系。");
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "practice");
  await page.getByRole("radio", { name: practice }).check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(flow).toHaveAttribute("data-guided-current-step", "review");
}

test("identity Guided lesson uses the real list Demo and reaches review", async ({ page }) => {
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

  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "explain");
  await page.getByRole("textbox", { name: "你的 explanation" }).fill("stable identity 让局部 State 跟随业务实体。");
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await page.getByRole("radio", { name: /数据模型中的稳定 todo\.id/ }).check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
});

test("state Guided lesson uses keyed identity and reaches review", async ({ page }) => {
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

  await completeGuidedLesson(page, {
    prediction: /原草稿仍然保留/,
    practice: /<ProductForm key=\{product\.id\}/,
    predictionSubmitted: true,
  });
});

test("effect Guided lesson observes cleanup before setup in the real Demo", async ({ page }) => {
  await openGuidedLesson(page, "lifecycle-of-reactive-effects");
  await page.getByRole("radio", { name: /先 cleanup 旧房间连接/ }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();

  const demo = page.locator(".guided-flow-demo-surface");
  await demo.getByRole("button", { name: "清空日志" }).click();
  await demo.getByRole("button", { name: "房间 #102" }).click();
  await expect(demo).toContainText("cleanup：关闭房间 #101 的连接");
  await expect(demo).toContainText("setup：建立房间 #102 的连接");
  await expect(demo).toContainText("响应式 Effect 的生命周期与依赖");

  await completeGuidedLesson(page, {
    prediction: /先 cleanup 旧房间连接/,
    practice: /serverUrl \+ roomId；theme 作为非响应式消息处理逻辑读取/,
    predictionSubmitted: true,
  });
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
