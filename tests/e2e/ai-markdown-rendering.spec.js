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
        { type: "delta", text: "```js\nconst value = props.value\nconst hiddenAfterCollapse = true\n```" },
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

  const codeBlock = assistantMessage.locator('[data-ai-code-block="true"]');
  await expect(codeBlock).toHaveCount(1);
  await expect(codeBlock.locator('[data-ai-code-block-body="true"]')).toHaveCount(1);
  await expect(codeBlock.getByRole("button", { name: "收起代码" })).toHaveAttribute("aria-expanded", "true");

  await codeBlock.getByRole("button", { name: "收起代码" }).click();

  await expect(codeBlock).toHaveAttribute("data-collapsed", "true");
  await expect(codeBlock.locator('[data-ai-code-block-body="true"]')).toHaveCount(0);
  await expect(codeBlock.locator('[data-ai-code-block-summary="true"]')).toContainText("const value = props.value");
  await expect(codeBlock).not.toContainText("const hiddenAfterCollapse = true");
  await expect(codeBlock.getByRole("button", { name: "展开代码" })).toHaveAttribute("aria-expanded", "false");

  await codeBlock.getByRole("button", { name: "展开代码" }).click();

  await expect(codeBlock).toHaveAttribute("data-collapsed", "false");
  await expect(codeBlock.locator('[data-ai-code-block-body="true"]')).toHaveCount(1);
  await expect(codeBlock).toContainText("const hiddenAfterCollapse = true");
});

test("an incomplete streaming code fence stays renderable", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: "```tsx\nconst partial = <Demo" },
        { type: "done" },
      ),
    });
  });

  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();
  await page.getByRole("textbox", { name: "向 AI 助手提问" }).fill("展示未完成代码块");
  await page.getByRole("button", { name: "发送" }).click();

  const assistantMessage = page.locator('[data-message-role="assistant"]').last();
  await expect(assistantMessage.locator('[data-ai-code-block="true"]')).toHaveCount(1);
  await expect(assistantMessage).toContainText("const partial = <Demo");
});
