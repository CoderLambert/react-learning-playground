import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const GUIDED_STORAGE_KEY = "react-learning-workbench:guided-session:v1:state-snapshot-queue";

async function enterPracticeStage(page) {
  const learningFlow = page.locator("[data-learning-flow='single']");
  await expect(learningFlow).toBeVisible();
  await learningFlow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await expect(learningFlow).toHaveAttribute("data-learning-stage", "practice");
}

async function openGuidedLesson(page) {
  await page.goto("./?demo=state-snapshot-queue");
  await expect(page.locator("[data-learning-flow='single']")).toBeVisible();
  await enterPracticeStage(page);
  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await page.getByRole("button", { name: /开始|继续实践/ }).click();
}

async function completeGuidedSession(page) {
  await page.getByRole("radio", { name: "3" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "Replace × 3" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill("三个更新读取同一份 render snapshot。");
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await page.locator("[data-guided-practice-kind='patch-choice'] input[value='functional-updaters']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
}

test("restores Guided responses and current step after reload inside Practice", async ({ page }) => {
  await openGuidedLesson(page);
  await completeGuidedSession(page);
  await page.getByRole("button", { name: "退出实践" }).click();

  await page.reload();
  await enterPracticeStage(page);
  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await page.getByRole("button", { name: "继续实践" }).click();

  const flow = page.locator("[data-guided-flow]");
  await expect(flow).toHaveAttribute("data-guided-current-step", "review");
  await expect(flow).toContainText("第一次预测");
  await expect(flow).toContainText("3");
  await expect(flow).toContainText("三个更新读取同一份 render snapshot。");
  await expect(flow).toContainText("setCount((n) => n + 1)");
  const needsReview = page.getByRole("button", { name: "标记为需要复习" });
  await needsReview.click();
  await expect(page.getByRole("button", { name: "取消需要复习" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "退出实践" }).click();
  await page.reload();
  await enterPracticeStage(page);
  await page.getByRole("button", { name: "继续实践" }).click();
  await expect(page.getByRole("button", { name: "取消需要复习" })).toHaveAttribute("aria-pressed", "true");
});

test("重新实践 clears the previous Guided session before a later reload", async ({ page }) => {
  await openGuidedLesson(page);
  await completeGuidedSession(page);
  await page.getByRole("button", { name: "重新实践" }).click();

  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
  await expect(page.getByRole("radio", { name: "1" })).not.toBeChecked();
  await expect(page.locator("[data-guided-first-prediction]")).toHaveCount(0);

  await page.getByRole("button", { name: "退出实践" }).click();
  await page.reload();
  await enterPracticeStage(page);
  await page.getByRole("button", { name: "继续实践" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
  await expect(page.locator("[data-guided-first-prediction]")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "你的 explanation" })).toHaveCount(0);
});

test("completed Guided practice continues into the Verify stage", async ({ page }) => {
  await openGuidedLesson(page);
  await completeGuidedSession(page);

  await page.getByRole("button", { name: "进入验证" }).click();
  const learningFlow = page.locator("[data-learning-flow='single']");
  await expect(learningFlow).toHaveAttribute("data-learning-stage", "verify");
  await expect(page.getByRole("heading", { name: "准备好检查理解了吗？" })).toBeVisible();
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
});

test("corrupt Guided storage resets safely without blocking Practice free explore", async ({ page }) => {
  await page.goto("./?demo=state-snapshot-queue");
  await expect(page.locator("[data-learning-flow='single']")).toBeVisible();
  await page.evaluate((storageKey) => localStorage.setItem(storageKey, "{not-json"), GUIDED_STORAGE_KEY);
  await page.reload();
  await enterPracticeStage(page);

  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await expect(page.locator("[data-guided-persistence-status]")).toContainText("无法使用");
  await expect(page.getByRole("button", { name: "Replace × 3" })).toBeVisible();
  await expect.poll(() => page.evaluate((storageKey) => localStorage.getItem(storageKey), GUIDED_STORAGE_KEY)).toBeNull();

  await page.getByRole("button", { name: "开始实践" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
});
// @browser-owner workbench
