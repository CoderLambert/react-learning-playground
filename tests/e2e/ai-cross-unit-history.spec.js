import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

function normalizedStream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

async function openAiTab(page, demoId = "props") {
  await page.goto(`?demo=${demoId}`);
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  return composer;
}

async function submit(page, composer, question) {
  await composer.fill(question);
  await page.getByRole("button", { name: "发送", exact: true }).click();
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  await expect(transcript.getByText(`answer:${question}`, { exact: true })).toBeVisible();
}

test("selecting history from another learning unit navigates and restores the exact conversation", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `answer:${body.question}` },
        { type: "done", finishReason: "stop" },
      ),
    });
  });

  let composer = await openAiTab(page, "props");
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  const toolbar = page.getByLabel("AI 会话工具栏");

  await submit(page, composer, "props conversation one");
  await toolbar.getByRole("button", { name: "新对话", exact: true }).click();
  await submit(page, composer, "props conversation two");
  await expect(toolbar.locator("summary")).toHaveText("历史会话 2");

  await page.getByRole("button", { name: /Children 默认插槽/ }).click();
  await expect(page).toHaveURL(/demo=children/);
  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  await expect(transcript.getByText("props conversation one", { exact: true })).toHaveCount(0);
  await expect(transcript.getByText("props conversation two", { exact: true })).toHaveCount(0);

  await toolbar.locator("summary").click();
  const historyPanel = toolbar.locator(".ai-conversation-popover__panel");
  await expect(historyPanel.getByText("其他学习单元 · 2", { exact: true })).toBeVisible();
  await historyPanel.getByRole("button", { name: /props conversation one/ }).click();

  await expect(page).toHaveURL(/demo=props/);
  await expect(page.getByRole("tab", { name: "AI" })).toHaveAttribute("aria-selected", "true");
  await expect(transcript.getByText("props conversation one", { exact: true })).toBeVisible();
  await expect(transcript.getByText("answer:props conversation one", { exact: true })).toBeVisible();
  await expect(transcript.getByText("props conversation two", { exact: true })).toHaveCount(0);
  await expect(transcript.getByText("answer:props conversation two", { exact: true })).toHaveCount(0);
  await expect(transcript.locator('[data-message-role="user"]')).toHaveCount(1);
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);
});
