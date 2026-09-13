import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const ENDPOINT = "https://api.deepseek.com/chat/completions";
const STORAGE_KEY = "react-learning.ai.deepseek.api-key";
const DB_NAME = "react-learning-assessment";

const QUESTION = {
  type: "single_choice",
  content: {
    prompt: "Which React input is read-only?",
    options: [
      { id: "props", text: "Props" },
      { id: "state", text: "State" },
    ],
    correctOptionId: "props",
    explanation: "Props are read-only inputs.",
  },
  difficulty: "easy",
  conceptTags: ["props"],
};

function sse(events) {
  return `${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("")}data: [DONE]\n\n`;
}

async function installCreateQuestionMock(page) {
  await page.addInitScript((key) => sessionStorage.setItem(key, "test-only-not-a-real-secret"), STORAGE_KEY);
  await page.route(ENDPOINT, async (route) => {
    const body = route.request().postDataJSON();
    const hasToolResult = body.messages.some((message) => message.role === "tool");
    const response = hasToolResult
      ? sse([{ choices: [{ delta: { content: "Questions created." }, finish_reason: "stop" }] }])
      : sse([{ choices: [{ delta: { tool_calls: [{ index: 0, id: "create", function: { name: "assessment_create_questions", arguments: JSON.stringify({ questions: [QUESTION] }) } }] }, finish_reason: "tool_calls" }] }]);
    await route.fulfill({ status: 200, contentType: "text/event-stream", body: response });
  });
}

async function createQuestionViaAi(page) {
  await page.goto("./?demo=props");
  await page.getByRole("tab", { name: "评测", exact: true }).click();
  const panel = page.locator("#learning-inspector-panel-assessment");
  await panel.getByRole("button", { name: "让 AI 帮我出题" }).click();
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(page.getByText("Questions created.", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "评测", exact: true }).click();
  return panel;
}

async function readDb(page) {
  return page.evaluate((dbName) => new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction(["questions", "sessions"], "readonly");
      const q = transaction.objectStore("questions").getAll();
      const s = transaction.objectStore("sessions").getAll();
      transaction.oncomplete = () => { resolve({ questions: q.result, sessions: s.result }); db.close(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }), DB_NAME);
}

test.beforeEach(async ({ page }) => {
  await installCreateQuestionMock(page);
});

test("Assessment Tab edits active question and retire is a visible soft-delete", async ({ page }) => {
  const panel = await createQuestionViaAi(page);
  await expect(panel.getByRole("heading", { name: "当前知识点题目" })).toBeVisible();
  await panel.getByRole("button", { name: "编辑", exact: true }).click();
  const editor = panel.getByRole("form", { name: /编辑题目/ });
  await editor.getByLabel("题干").fill("Edited props question");
  await editor.getByLabel("答案解释").fill("Edited explanation");
  await editor.getByLabel("难度").selectOption("medium");
  await editor.getByLabel("概念标签（逗号分隔）").fill("props, identity");
  await editor.getByRole("textbox", { name: "选项 1", exact: true }).fill("Read-only Props");
  await editor.getByRole("radio", { name: "设为正确答案：选项 1", exact: true }).check();
  await editor.getByRole("button", { name: "保存修改" }).click();
  await expect(panel.locator('[data-notice-kind="success"]')).toContainText("题目已保存");
  await expect(panel.getByText("Edited props question", { exact: true })).toBeVisible();

  await panel.getByRole("button", { name: "停用", exact: true }).click();
  await expect(panel.locator('[data-notice-kind="success"]')).toContainText("题目已停用");
  await expect(panel.getByText("Edited props question", { exact: true })).toHaveCount(0);
  await panel.getByLabel("显示已停用题目").check();
  await expect(panel.getByText("Edited props question", { exact: true })).toBeVisible();
  await expect(panel.getByText("已停用", { exact: true })).toBeVisible();
});

test("stale editor revision reports conflict and refreshes instead of overwriting newer data", async ({ page }) => {
  const panel = await createQuestionViaAi(page);
  await panel.getByRole("button", { name: "编辑", exact: true }).click();
  const editor = panel.getByRole("form", { name: /编辑题目/ });
  await editor.getByLabel("题干").fill("Stale local edit");

  await page.evaluate((dbName) => new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("questions", "readwrite");
      const store = tx.objectStore("questions");
      const all = store.getAll();
      all.onsuccess = () => {
        const current = all.result[0];
        store.put({ ...current, revision: current.revision + 1, content: { ...current.content, prompt: "Concurrent winner" } });
      };
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }), DB_NAME);

  await editor.getByRole("button", { name: "保存修改" }).click();
  await expect(panel.locator("[data-notice-kind]")).toContainText(/冲突|刷新|最新/);
  await expect(panel.getByText("Concurrent winner", { exact: true })).toBeVisible();
  expect((await readDb(page)).questions[0].content.prompt).toBe("Concurrent winner");
});

test("editing or retiring the bank never mutates an in-progress session snapshot", async ({ page }) => {
  const panel = await createQuestionViaAi(page);
  await panel.getByRole("button", { name: "开始测试" }).click();
  const before = await readDb(page);
  expect(before.sessions).toHaveLength(1);
  expect(before.sessions[0].status).toBe("in_progress");
  const frozenItems = before.sessions[0].items;

  await panel.getByRole("button", { name: "编辑", exact: true }).click();
  const editor = panel.getByRole("form", { name: /编辑题目/ });
  await editor.getByLabel("题干").fill("Changed after session start");
  await editor.getByRole("button", { name: "保存修改" }).click();
  await panel.getByRole("button", { name: "停用", exact: true }).click();

  const after = await readDb(page);
  expect(after.questions[0].status).toBe("retired");
  expect(after.sessions[0].items).toEqual(frozenItems);
});

test("chapter checkpoint no longer exposes the legacy editable localStorage question bank", async ({ page }) => {
  await page.goto("./?demo=props");
  await expect(page.getByText("题库管理", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "新增", exact: true })).toHaveCount(0);
  await expect(page.getByText(/所有修改保存在当前浏览器/)).toHaveCount(0);
  await page.getByRole("tab", { name: "评测", exact: true }).click();
  await expect(page.locator("#learning-inspector-panel-assessment")).toBeVisible();
});
