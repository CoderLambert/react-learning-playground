import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

function gatewayResponse() {
  return `${JSON.stringify({ type: "start" })}\n${JSON.stringify({ type: "delta", text: "mock response" })}\n${JSON.stringify({ type: "done" })}\n`;
}

async function installGatewaySpy(page, requests) {
  await page.route(GATEWAY_URL, async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: gatewayResponse(),
    });
  });
}

async function openGuidedExplanation(page) {
  await page.goto("./?demo=state-snapshot-queue");
  const learningFlow = page.locator("[data-learning-flow='single']");
  await expect(learningFlow).toBeVisible();
  await learningFlow.locator(".single-learning-flow__stages button").filter({ hasText: "实践" }).click();
  await page.getByRole("button", { name: "开始实践" }).click();
  await page.getByRole("radio", { name: "3" }).check();
  await page.getByRole("button", { name: "提交 prediction" }).click();
  await page.getByRole("button", { name: "Replace × 3" }).click();
  await page.getByRole("button", { name: "我已运行并观察结果" }).click();
  await page.getByRole("textbox", { name: "你的 explanation" }).fill("三个更新都读取同一份 render snapshot。");
  await page.getByRole("button", { name: "保存 explanation，继续 practice" }).click();
  await page.locator("[data-guided-step='explain']").click();
  await expect(page.getByRole("button", { name: "Ask AI 检查我的推理" })).toBeVisible();
}

async function completeGuidedSession(page) {
  await page.locator("[data-guided-step='practice']").click();
  await page.locator("[data-guided-practice-kind='patch-choice'] input[value='functional-updaters']").check();
  await page.getByRole("button", { name: "提交 practice，查看 review" }).click();
  await expect(page.locator("[data-guided-flow]")).toHaveAttribute("data-guided-current-step", "review");
}

test("Explain Ask AI opens a closed inspector, prefills an editable prompt, and does not submit", async ({ page }) => {
  const requests = [];
  await installGatewaySpy(page, requests);
  await openGuidedExplanation(page);

  await page.getByRole("button", { name: "关闭学习面板" }).last().click();
  await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "false");

  await page.getByRole("button", { name: "Ask AI 检查我的推理" }).click();

  const aiTab = page.getByRole("tab", { name: "AI", exact: true });
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "true");
  await expect(aiTab).toHaveAttribute("aria-selected", "true");
  await expect(composer).toHaveValue(/\[学习单元\].*State Snapshot/s);
  await expect(composer).toHaveValue(/\[Guided step\] explain-shared-snapshot/);
  await expect(composer).toHaveValue(/\[问题\]/);
  await expect(composer).toHaveValue(/<learner_reasoning>[\s\S]*三个更新都读取同一份 render snapshot/);
  await expect(page.getByRole("log", { name: "AI 对话记录" }).locator("[data-message-role]")).toHaveCount(0);
  expect(requests).toHaveLength(0);

  await composer.fill("我编辑了这个 reasoning review prompt。");
  await expect(composer).toHaveValue("我编辑了这个 reasoning review prompt。");
});

test("Guided Ask AI protects an existing composer draft and supports Review", async ({ page }) => {
  const requests = [];
  await installGatewaySpy(page, requests);
  await openGuidedExplanation(page);

  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await page.getByRole("tab", { name: "AI", exact: true }).click();
  await expect(composer).toBeEnabled();
  await composer.fill("已有的 AI composer 草稿");
  await page.getByRole("button", { name: "关闭学习面板" }).last().click();

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Ask AI 检查我的推理" }).click();
  await expect(page.locator(".workbench-shell")).toHaveAttribute("data-inspector-open", "false");

  await page.getByRole("button", { name: "打开学习面板" }).click();
  await expect(composer).toHaveValue("已有的 AI composer 草稿");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Ask AI 检查我的推理" }).click();
  await expect(composer).toHaveValue(/\[Guided step\] explain-shared-snapshot/);
  expect(requests).toHaveLength(0);

  await completeGuidedSession(page);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Ask AI 检查我的推理" }).click();
  await expect(composer).toHaveValue(/\[Guided step\] review-snapshot-queue/);
  await expect(composer).toHaveValue(/\[入口\] review/);
  expect(requests).toHaveLength(0);
});
// @browser-owner workbench
