import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";
const SUMMARY = {
  userGoal: "继续学习 Props",
  establishedFacts: ["长回答已经持久化"],
  currentLearningUnit: { id: "props", title: "Props" },
  importantSourceReferences: [],
  experiments: [],
  conclusions: ["可通过专用 compaction payload 压缩"],
  unresolvedQuestions: [],
};

function stream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

async function readAiDatabase(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open("react-learning-ai");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(["messages", "compactions"], "readonly");
      const messages = tx.objectStore("messages").getAll();
      const compactions = tx.objectStore("compactions").getAll();
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => {
        resolve({ messages: messages.result, compactions: compactions.result });
        db.close();
      };
    };
  }));
}

test("a ~6000-char answer compacts through gateway without using the 4K question field", async ({ page }) => {
  const requests = [];
  const longAnswer = "中".repeat(5_900);

  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);

    if (body.purpose === "compaction") {
      await route.fulfill({
        status: 200,
        contentType: "application/x-ndjson",
        body: stream(
          { type: "start" },
          { type: "delta", text: JSON.stringify(SUMMARY) },
          { type: "done", finishReason: "stop" },
        ),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: stream(
        { type: "start" },
        { type: "delta", text: longAnswer },
        { type: "done", finishReason: "stop" },
      ),
    });
  });

  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();

  await composer.fill("生成长回答用于压缩测试");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);
  await expect.poll(async () => transcript.locator('[data-message-role="assistant"] .ai-assistant-markdown').evaluate(
    (node) => Array.from(node.textContent ?? "").length,
  )).toBe(5_900);

  await page.getByRole("button", { name: "Compact", exact: true }).click();
  await expect(page.locator(".ai-assistant-notice")).toContainText("完整对话仍保留");

  expect(requests).toHaveLength(2);
  const compaction = requests[1];
  expect(compaction.purpose).toBe("compaction");
  expect(compaction.question).toBeUndefined();
  expect(compaction.history).toBeUndefined();
  expect(compaction.compaction.prompt.length).toBeGreaterThan(4_000);
  expect(compaction.compaction.prompt).toContain(longAnswer.slice(0, 200));

  const stored = await readAiDatabase(page);
  expect(stored.messages).toHaveLength(2);
  expect(stored.messages.filter((message) => message.role === "assistant")).toHaveLength(1);
  expect(Array.from(stored.messages.find((message) => message.role === "assistant").content)).toHaveLength(5_900);
  expect(stored.compactions).toHaveLength(1);
  expect(stored.compactions[0].summary).toMatchObject(SUMMARY);

  await expect(transcript.locator('[data-message-role="user"]')).toHaveCount(1);
  await expect(transcript.locator('[data-message-role="assistant"]')).toHaveCount(1);
});
