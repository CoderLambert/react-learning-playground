import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";
const COMPACTION_PREFIX = "请将下面对话压缩为结构化 JSON";

function stream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

function isCompactionRequest(request) {
  return request?.purpose === "compaction"
    && request?.compaction?.prompt?.startsWith(COMPACTION_PREFIX);
}

function compactionPrompt(request) {
  return request?.compaction?.prompt ?? "";
}

const SUMMARY = {
  userGoal: "理解当前 React Demo",
  establishedFacts: ["第一轮已经观察过渲染"],
  currentLearningUnit: { id: "props", title: "Props" },
  importantSourceReferences: ["PropsBasicsDemo.jsx:L1-L2"],
  experiments: ["修改 name prop"],
  conclusions: ["props 是只读输入"],
  unresolvedQuestions: ["何时需要 memo"],
};

async function openAssistant(page) {
  await page.goto("?demo=props");
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
  await expect(page.getByRole("button", { name: "发送", exact: true })).toBeVisible();
}

async function readAiDatabase(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open("react-learning-ai");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction(["messages", "compactions"], "readonly");
      const messagesRequest = transaction.objectStore("messages").getAll();
      const compactionsRequest = transaction.objectStore("compactions").getAll();
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        resolve({ messages: messagesRequest.result, compactions: compactionsRequest.result });
        db.close();
      };
    };
  }));
}

test("manual compaction persists a durable checkpoint without deleting full history", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    const summarizing = isCompactionRequest(body);
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: summarizing
        ? stream({ type: "start" }, { type: "delta", text: JSON.stringify(SUMMARY) }, { type: "done", finishReason: "stop" })
        : stream({ type: "start" }, { type: "delta", text: `answer:${body.question}` }, { type: "done", finishReason: "stop", usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 } }),
    });
  });

  let composer = await openAssistant(page);
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  await submit(page, composer, "manual seed");
  await page.getByRole("button", { name: "Compact", exact: true }).click();
  await expect(page.locator(".ai-assistant-notice")).toContainText("完整对话仍保留");

  const stored = await readAiDatabase(page);
  expect(stored.messages).toHaveLength(2);
  expect(stored.compactions).toHaveLength(1);
  expect(stored.compactions[0]).toMatchObject({
    reason: "manual",
    version: 1,
    summary: SUMMARY,
  });
  expect(stored.compactions[0].timestamp).toMatch(/^2026-|^20\d\d-/);
  await expect(transcript.locator('[data-message-role="user"]')).toHaveCount(1);
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);

  await page.reload();
  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await submit(page, composer, "after reload");
  const restoredRequest = requests.find((request) => request.question === "after reload");
  expect(restoredRequest.context.conversationSummary).toContain("理解当前 React Demo");
  expect(restoredRequest.context.conversationSummary).toContain("PropsBasicsDemo.jsx:L1-L2");
  expect(restoredRequest.history).toEqual([]);

  await page.getByRole("button", { name: "Compact", exact: true }).click();
  await expect.poll(() => requests.filter(isCompactionRequest).length).toBe(2);
  const chainedSummaryRequest = requests.filter(isCompactionRequest)[1];
  expect(compactionPrompt(chainedSummaryRequest)).toContain("after reload");
  expect(compactionPrompt(chainedSummaryRequest)).not.toContain("manual seed");

  const chainedStored = await readAiDatabase(page);
  expect(chainedStored.messages).toHaveLength(4);
  expect(chainedStored.compactions).toHaveLength(2);
});

test("provider actual usage triggers one automatic compaction and does not chain stale usage", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    const summarizing = isCompactionRequest(body);
    const highUsage = body.question === "high usage seed";
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: summarizing
        ? stream({ type: "start" }, { type: "delta", text: JSON.stringify(SUMMARY) }, { type: "done", finishReason: "stop" })
        : stream(
            { type: "start" },
            { type: "delta", text: `answer:${body.question}` },
            {
              type: "done",
              finishReason: "stop",
              usage: highUsage
                ? { prompt_tokens: 220_000, completion_tokens: 100, total_tokens: 220_100 }
                : { prompt_tokens: 120, completion_tokens: 30, total_tokens: 150 },
            },
          ),
    });
  });

  const composer = await openAssistant(page);
  await submit(page, composer, "high usage seed");
  await submit(page, composer, "after automatic compaction");

  const summaryRequests = requests.filter(isCompactionRequest);
  expect(summaryRequests).toHaveLength(1);
  const afterCompaction = requests.find((request) => request.question === "after automatic compaction");
  expect(afterCompaction.context.conversationSummary).toContain("理解当前 React Demo");
  await expect(page.locator(".ai-assistant-notice")).toContainText("完整对话仍保留");

  await submit(page, composer, "low usage follow-up");
  expect(requests.filter(isCompactionRequest)).toHaveLength(1);
  const stored = await readAiDatabase(page);
  expect(stored.compactions).toHaveLength(1);
  expect(stored.messages).toHaveLength(6);
});
