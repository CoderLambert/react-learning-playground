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

test("AI assistant sends current note, numbered source and active source context", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `回答:${body.context.learningUnit.id}:` },
        { type: "delta", text: body.context.activeSourceFile },
        { type: "done" },
      ),
    });
  });

  const composer = await openAiTab(page);
  const assistant = page.getByRole("region", { name: "AI 学习助手" });
  await expect(assistant.getByText("props.mdx", { exact: true })).toBeVisible();
  await expect(assistant.getByText("PropsBasicsDemo.jsx", { exact: true })).toBeVisible();

  await composer.fill("结合当前代码解释 props");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(assistant.getByText("回答:props:PropsBasicsDemo.jsx")).toBeVisible();

  expect(requests).toHaveLength(1);
  const first = requests[0];
  expect(first.context.learningUnit.id).toBe("props");
  expect(first.context.note.name).toBe("props.mdx");
  expect(first.context.note.content.length).toBeGreaterThan(50);
  expect(first.context.sources[0].name).toBe("PropsBasicsDemo.jsx");
  expect(first.context.sources[0].code).toMatch(/^1 \|/);
  expect(first.context.activeSourceFile).toBe("PropsBasicsDemo.jsx");

  await page.getByRole("tab", { name: "源码" }).click();
  await page.getByRole("tab", { name: "UserCard.jsx" }).click();
  await page.getByRole("tab", { name: "AI" }).click();
  await expect(assistant.getByText("UserCard.jsx", { exact: true })).toBeVisible();

  await composer.fill("分析当前选中的辅助文件");
  await page.getByRole("button", { name: "发送" }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].context.activeSourceFile).toBe("UserCard.jsx");
});

test("changing demos resets the context-bound chat and prevents stale context", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `unit=${body.context.learningUnit.id}` },
        { type: "done" },
      ),
    });
  });

  let composer = await openAiTab(page, "props");
  await composer.fill("props question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("unit=props")).toBeVisible();

  await page.getByRole("button", { name: /Children 默认插槽/ }).click();
  await expect(page).toHaveURL(/demo=children/);
  await expect(page.getByRole("log", { name: "AI 对话记录" }).getByText("props question", { exact: true })).toHaveCount(0);

  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  await composer.fill("children question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("unit=children")).toBeVisible();

  expect(requests.map((request) => request.context.learningUnit.id)).toEqual(["props", "children"]);
  expect(requests[1].context.note.name).toBe("children.mdx");
  expect(requests[1].context.note.content).not.toContain("props question");
});

test("AI assistant handles normalized errors, stop and New Chat", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);

    if (body.question.includes("错误")) {
      await route.fulfill({
        status: 200,
        contentType: "application/x-ndjson",
        body: normalizedStream({ type: "start" }, { type: "error", message: "mock quota", code: "RATE_LIMIT" }),
      });
      return;
    }

    if (body.question.includes("慢")) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      try {
        await route.fulfill({
          status: 200,
          contentType: "application/x-ndjson",
          body: normalizedStream({ type: "start" }, { type: "delta", text: "late" }, { type: "done" }),
        });
      } catch {
        // The browser request can be aborted by the Stop action before fulfillment.
      }
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream({ type: "start" }, { type: "delta", text: "ok" }, { type: "done" }),
    });
  });

  const composer = await openAiTab(page);
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  await composer.fill("触发错误");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByRole("alert")).toContainText("mock quota");

  await page.getByRole("button", { name: "新对话" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(transcript.getByText("触发错误", { exact: true })).toHaveCount(0);

  await composer.fill("慢回答");
  await page.getByRole("button", { name: "发送" }).click();
  await expect.poll(() => requests.some((request) => request.question === "慢回答")).toBe(true);
  await page.getByRole("button", { name: "停止" }).click();
  await expect(page.getByRole("button", { name: "发送" })).toBeVisible();
  await expect(page.getByText("late")).toHaveCount(0);
});

test("source citations open the Source inspector and highlight the requested range", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: "查看 [PropsBasicsDemo.jsx:L1-L2](source://PropsBasicsDemo.jsx#L1-L2)" },
        { type: "done", usage: { prompt_tokens: 80, completion_tokens: 20, total_tokens: 100 } },
      ),
    });
  });

  const composer = await openAiTab(page);
  await expect(page.getByRole("region", { name: "AI context usage" })).toBeVisible();
  await composer.fill("给出源码引用");
  await page.getByRole("button", { name: "发送" }).click();

  const citation = page.getByRole("button", { name: /打开源码 PropsBasicsDemo\.jsx L1–L2/ });
  await expect(citation).toBeVisible();
  await citation.click();

  await expect(page.getByRole("tab", { name: "源码" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-source-focus="1-2"]')).toBeVisible();
  await expect(page.locator('[data-source-line="1"][data-highlighted="true"]')).toBeVisible();
  await expect(page.locator('[data-source-line="2"][data-highlighted="true"]')).toBeVisible();
});

test("conversation history is visible, survives reload, and keeps learning units isolated", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `answer:${body.question}` },
        { type: "done" },
      ),
    });
  });

  let composer = await openAiTab(page);
  let transcript = page.getByRole("log", { name: "AI 对话记录" });
  const toolbar = page.getByLabel("AI 会话工具栏");
  await expect(toolbar.getByRole("button", { name: "新对话", exact: true })).toHaveCount(1);
  await expect(toolbar.getByText("模型", { exact: true })).toBeVisible();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 0");

  await composer.fill("first saved question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);
  await expect(transcript.getByText("answer:first saved question", { exact: true })).toBeVisible();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");

  await toolbar.getByRole("button", { name: "新对话", exact: true }).click();
  await expect(transcript.getByText("first saved question", { exact: true })).toHaveCount(0);
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");

  await composer.fill("second saved question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(transcript.getByText("answer:second saved question", { exact: true })).toBeVisible();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 2");

  await toolbar.locator("summary").click();
  const historyPanel = toolbar.locator(".ai-conversation-popover__panel");
  await expect(historyPanel.getByText("全部历史 · 2", { exact: true })).toBeVisible();
  await historyPanel.getByRole("button", { name: /first saved question/ }).click();
  await expect(transcript.getByText("first saved question", { exact: true })).toBeVisible();
  await expect(transcript.getByText("second saved question", { exact: true })).toHaveCount(0);

  await page.reload();
  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  transcript = page.getByRole("log", { name: "AI 对话记录" });
  await expect(composer).toBeEnabled();
  await expect(transcript.getByText("second saved question", { exact: true })).toBeVisible();
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);
  await expect(transcript.getByText("answer:second saved question", { exact: true })).toBeVisible();
  await expect(page.locator(".ai-conversation-popover summary")).toHaveText("历史会话 2");

  await page.getByRole("button", { name: /Children 默认插槽/ }).click();
  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  transcript = page.getByRole("log", { name: "AI 对话记录" });
  await expect(transcript.getByText("second saved question", { exact: true })).toHaveCount(0);
  await expect(page.locator(".ai-conversation-popover summary")).toHaveText("历史会话 2");

  await composer.fill("children unit question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(transcript.getByText("answer:children unit question", { exact: true })).toBeVisible();
  await page.locator(".ai-conversation-popover summary").click();
  await expect(page.getByText("全部历史 · 3", { exact: true })).toBeVisible();
  await expect(page.getByText("其他学习单元 · 2", { exact: true })).toBeVisible();
  await expect(page.getByText("first saved question", { exact: true })).toBeVisible();
  await expect(page.getByText("second saved question", { exact: true })).toBeVisible();
});

test("conversation history supports rename, archive, restore, and delete", async ({ page }) => {
  await page.route(GATEWAY_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream({ type: "start" }, { type: "delta", text: "saved" }, { type: "done" }),
    });
  });

  const composer = await openAiTab(page);
  const toolbar = page.getByLabel("AI 会话工具栏");
  await composer.fill("history actions question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");
  await toolbar.locator("summary").click();

  const panel = toolbar.locator(".ai-conversation-popover__panel");
  const item = panel.locator("li").filter({ hasText: "history actions question" });
  await expect(item).toHaveCount(1);
  await item.getByRole("button", { name: "重命名", exact: true }).click();
  const renameInput = panel.getByRole("textbox", { name: "重命名会话" });
  await expect(renameInput).toHaveCount(1);
  await renameInput.fill("renamed history");
  await renameInput.press("Enter");
  await expect(panel.getByText("renamed history", { exact: true })).toBeVisible();

  const renamedItem = panel.locator("li").filter({ hasText: "renamed history" });
  await renamedItem.getByRole("button", { name: "归档", exact: true }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 0");
  const archivedItem = panel.locator("li").filter({ hasText: "renamed history" });
  await expect(archivedItem).toHaveCount(1);
  await archivedItem.getByRole("button", { name: "恢复", exact: true }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 1");

  const restoredItem = panel.locator("li").filter({ hasText: "renamed history" });
  await restoredItem.getByRole("button", { name: "删除", exact: true }).click();
  await expect(toolbar.locator("summary")).toHaveText("历史会话 0");
  await expect(panel.getByText("renamed history", { exact: true })).toHaveCount(0);
});

test("IndexedDB unavailable mode shows an explicit memory-only warning", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", { configurable: true, value: undefined });
  });

  await openAiTab(page);
  await expect(page.locator(".ai-assistant-notice")).toContainText("浏览器本地持久化不可用，本次会话仅保存在内存中。");
});
