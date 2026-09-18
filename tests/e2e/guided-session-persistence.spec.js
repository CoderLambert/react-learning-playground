import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const GUIDED_STORAGE_KEY = "react-learning-workbench:guided-session:v1:state-snapshot-queue";

async function openGuidedLesson(page) {
  await page.goto("./?demo=state-snapshot-queue");
  await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await page.getByRole("button", { name: /开始|继续 Guided Learning/ }).click();
}

async function completeGuidedSession(page) {
  await page.getByRole("radio", { name: "3" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "Replace × 3" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill("三个更新读取同一份 render snapshot。");
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await page.getByRole("radio", { name: /结果可以相同，但 queue 处理语义不同/ }).check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
}

test("restores Guided responses and current step after reload", async ({ page }) => {
  await openGuidedLesson(page);
  await completeGuidedSession(page);
  await page.getByRole("button", { name: "退出 Guided Mode" }).click();

  await page.reload();
  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await page.getByRole("button", { name: "继续 Guided Learning" }).click();

  const flow = page.locator("[data-guided-flow]");
  await expect(flow).toHaveAttribute("data-guided-current-step", "review");
  await expect(flow).toContainText("Your first prediction");
  await expect(flow).toContainText("3");
  await expect(flow).toContainText("三个更新读取同一份 render snapshot。");
  await expect(flow).toContainText("结果可以相同，但 queue 处理语义不同");
});

test("Start over clears the previous Guided session before a later reload", async ({ page }) => {
  await openGuidedLesson(page);
  await completeGuidedSession(page);
  await page.getByRole("button", { name: "重新开始" }).click();

  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
  await expect(page.getByRole("radio", { name: "1" })).not.toBeChecked();
  await expect(page.locator("[data-guided-first-prediction]")).toHaveCount(0);

  await page.getByRole("button", { name: "退出 Guided Mode" }).click();
  await page.reload();
  await page.getByRole("button", { name: "继续 Guided Learning" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
  await expect(page.locator("[data-guided-first-prediction]")).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "你的 explanation" })).toHaveCount(0);
});

test("corrupt Guided storage resets safely without blocking free explore", async ({ page }) => {
  await page.goto("./?demo=state-snapshot-queue");
  await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
  await page.evaluate((storageKey) => localStorage.setItem(storageKey, "{not-json"), GUIDED_STORAGE_KEY);
  await page.reload();

  await expect(page.locator("[data-guided-entry]")).toBeVisible();
  await expect(page.locator("[data-guided-persistence-status]")).toContainText("无法使用");
  await expect(page.getByRole("button", { name: "Replace × 3" })).toBeVisible();
  await expect.poll(() => page.evaluate((storageKey) => localStorage.getItem(storageKey), GUIDED_STORAGE_KEY)).toBeNull();

  await page.getByRole("button", { name: "开始 Guided Learning" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "predict");
});
