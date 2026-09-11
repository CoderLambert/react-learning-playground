import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

function normalizedStream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

test("AI answers render streaming Markdown with Markstream semantics", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: "## 结论\n\n" },
        { type: "delta", text: "- **Props** 是只读输入\n- 使用 `useState` 管理局部状态\n\n" },
        { type: "delta", text: "> 先看当前 Demo 的数据流。\n\n" },
        { type: "delta", text: "```js\nconst value = props.value\n```" },
        { type: "done" },
      ),
    });
  });

  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();

  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await composer.fill("用 Markdown 总结当前 props 示例");
  await page.getByRole("button", { name: "发送" }).click();

  const assistantMessage = page.locator('[data-message-role="assistant"]').last();
  await expect(assistantMessage.getByRole("heading", { name: "结论" })).toBeVisible();
  await expect(assistantMessage.getByText("Props", { exact: true })).toBeVisible();
  await expect(assistantMessage.locator("code").filter({ hasText: "useState" })).toBeVisible();
  await expect(assistantMessage.getByText("先看当前 Demo 的数据流。")).toBeVisible();
  await expect(assistantMessage).toContainText("const value = props.value");
  await expect.poll(() => assistantMessage.locator(".markstream-react").count()).toBeGreaterThan(0);
});
