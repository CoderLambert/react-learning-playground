import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

function normalizedStream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

async function createConversation(page, question) {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream({ type: "start" }, { type: "delta", text: "saved" }, { type: "done" }),
    });
  });

  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  await composer.fill(question);
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByRole("log", { name: "AI 对话记录" }).getByText("saved", { exact: true })).toBeVisible();

  const toolbar = page.getByLabel("AI 会话工具栏");
  await toolbar.locator("summary").click();
  return toolbar.locator(".ai-conversation-popover__panel");
}

test("conversation rename Escape cancels without persisting and Enter commits with focus restoration", async ({ page }) => {
  const originalTitle = "rename keyboard question";
  const panel = await createConversation(page, originalTitle);
  let item = panel.locator("li").filter({ hasText: originalTitle });
  const renameButton = item.getByRole("button", { name: "重命名", exact: true });

  await renameButton.click();
  let renameInput = panel.getByRole("textbox", { name: "重命名会话" });
  await expect(renameInput).toBeFocused();
  await renameInput.fill("should not persist");
  await renameInput.press("Escape");

  await expect(panel.getByText(originalTitle, { exact: true })).toBeVisible();
  await expect(panel.getByText("should not persist", { exact: true })).toHaveCount(0);
  await expect(renameButton).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(panel.getByText(originalTitle, { exact: true })).toBeVisible();
  await expect(panel.getByText("should not persist", { exact: true })).toHaveCount(0);

  item = panel.locator("li").filter({ hasText: originalTitle });
  await item.getByRole("button", { name: "重命名", exact: true }).click();
  renameInput = panel.getByRole("textbox", { name: "重命名会话" });
  await renameInput.fill("committed rename");
  await renameInput.press("Enter");

  const renamedItem = panel.locator("li").filter({ hasText: "committed rename" });
  await expect(renamedItem).toHaveCount(1);
  await expect(panel.getByText(originalTitle, { exact: true })).toHaveCount(0);
  await expect(renamedItem.getByRole("button", { name: "重命名", exact: true })).toBeFocused();
});
