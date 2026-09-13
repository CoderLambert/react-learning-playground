import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";
const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";

function normalizedStream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

async function openAiTab(page, demoId = "props") {
  await page.goto(`?demo=${demoId}`);
  await page.getByRole("tab", { name: "AI" }).click();
  return page.getByRole("textbox", { name: "向 AI 助手提问" });
}

test("DeepSeek connection feedback is discarded when credentials change mid-test", async ({ page }) => {
  let releaseFirstTest;
  const firstTestBlocked = new Promise((resolve) => {
    releaseFirstTest = resolve;
  });
  let requestCount = 0;

  await page.route(DEEPSEEK_CHAT_URL, async (route) => {
    requestCount += 1;
    if (requestCount === 1) await firstTestBlocked;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: `test-${requestCount}`, choices: [] }),
    });
  });

  await openAiTab(page);
  await page.getByRole("button", { name: /配置 DeepSeek|DeepSeek 已配置/ }).click();
  const keyInput = page.getByRole("textbox", { name: "API Key", exact: true });
  await keyInput.fill("sk-first-credential");
  await page.getByRole("button", { name: "测试连接" }).click();
  await expect(page.getByText("正在测试 DeepSeek 连接…", { exact: true })).toBeVisible();

  await keyInput.fill("sk-second-credential");
  releaseFirstTest();
  await expect(page.getByText(/连接成功/)).toHaveCount(0);
  await expect(page.getByText("正在测试 DeepSeek 连接…", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "测试连接" }).click();
  await expect(page.getByText(/连接成功/)).toBeVisible();
  expect(requestCount).toBe(2);
});

test("conversation hard delete requires confirmation, supports Escape, and restores focus", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream({ type: "start" }, { type: "delta", text: "saved" }, { type: "done" }),
    });
  });

  const composer = await openAiTab(page);
  const toolbar = page.getByLabel("AI 会话工具栏");
  await composer.fill("delete confirmation question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");
  await toolbar.locator("summary").click();

  const panel = toolbar.locator(".ai-conversation-popover__panel");
  const item = panel.locator("li").filter({ hasText: "delete confirmation question" });
  const deleteButton = item.getByRole("button", { name: "删除", exact: true });
  await deleteButton.click();

  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");
  await expect(item.getByRole("button", { name: "确认删除", exact: true })).toBeFocused();
  await item.getByRole("button", { name: "确认删除", exact: true }).press("Escape");
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");
  await expect(deleteButton).toBeFocused();

  await deleteButton.click();
  await item.getByRole("button", { name: "确认删除", exact: true }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 0");
  await expect(panel.getByText("delete confirmation question", { exact: true })).toHaveCount(0);
  await expect(panel.locator("nav.ai-conversation-list").first()).toBeFocused();
});

test("narrow right-edge citation preview stays inside the viewport without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        {
          type: "delta",
          text: "引用 A [PropsBasicsDemo.jsx:L1-L2](source://PropsBasicsDemo.jsx#L1-L2) 引用 B [PropsBasicsDemo.jsx:L3-L4](source://PropsBasicsDemo.jsx#L3-L4) 引用 C [PropsBasicsDemo.jsx:L5-L6](source://PropsBasicsDemo.jsx#L5-L6)",
        },
        { type: "done" },
      ),
    });
  });

  const composer = await openAiTab(page);
  await composer.fill("给出多个源码引用");
  await page.getByRole("button", { name: "发送" }).click();

  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  const responseMessage = transcript.locator('[data-message-role="assistant"]').last();
  const citations = responseMessage.locator(".ai-source-citation-wrap");
  await expect(citations).toHaveCount(3);
  const lastCitation = citations.nth(2);
  await lastCitation.locator(".ai-source-citation").focus();
  const preview = lastCitation.getByRole("tooltip");
  await expect(preview).toBeVisible();

  await expect.poll(async () => lastCitation.getAttribute("data-preview-align")).toBe("end");
  const box = await preview.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);

  const overflow = await transcript.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
