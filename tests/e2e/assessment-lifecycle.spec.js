import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const ASSESSMENT_DB = "react-learning-assessment";
const ASSESSMENT_STORAGE_KEY = "react-learning.ai.deepseek.api-key";

const QUESTIONS = [
  {
    type: "single_choice",
    content: {
      prompt: "React component render is controlled by which input?",
      options: [
        { id: "props", text: "Props" },
        { id: "state", text: "Local State" },
      ],
      correctOptionId: "props",
      explanation: "Props are an input to a component render.",
    },
    difficulty: "easy",
    conceptTags: ["assessment", "props"],
    evidenceRefs: [{ kind: "source", fileName: "PropsBasicsDemo.jsx", startLine: 1, endLine: 2 }],
  },
  {
    type: "true_false",
    content: {
      prompt: "Props are read-only inputs to a React component.",
      correct: true,
      explanation: "A component should treat props as immutable inputs.",
    },
    difficulty: "easy",
    conceptTags: ["assessment", "props"],
  },
];

function sse(events) {
  return `${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("")}data: [DONE]\n\n`;
}

function toolTurn(name, argumentsValue, id = "assessment-create") {
  return sse([
    {
      choices: [{
        delta: {
          tool_calls: [{
            index: 0,
            id,
            function: { name, arguments: JSON.stringify(argumentsValue) },
          }],
        },
        finish_reason: "tool_calls",
      }],
    },
  ]);
}

function textTurn(text) {
  return sse([
    { choices: [{ delta: { content: text }, finish_reason: "stop" }] },
  ]);
}

async function installAssessmentModelMock(page) {
  const requests = [];
  await page.addInitScript(({ storageKey }) => {
    sessionStorage.setItem(storageKey, "test-only-not-a-real-secret");
  }, { storageKey: ASSESSMENT_STORAGE_KEY });
  await page.route(DEEPSEEK_ENDPOINT, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    const usedTool = body.messages.some((message) => message.role === "tool");
    const isQuestionMutation = body.messages.some((message) => (
      message.role === "user" && typeof message.content === "string" && message.content.includes("修改当前评测题")
    ));
    let response;
    if (!usedTool) {
      response = isQuestionMutation
        ? toolTurn("assessment_list_questions", {})
        : toolTurn("assessment_create_questions", { questions: QUESTIONS });
    } else if (isQuestionMutation) {
      const latestToolResult = body.messages.filter((message) => message.role === "tool").at(-1);
      const listed = JSON.parse(latestToolResult.content);
      response = Array.isArray(listed)
        ? toolTurn("assessment_update_question", {
            questionId: listed[0].id,
            expectedRevision: listed[0].revision,
            patch: { content: { prompt: "Mutated question-bank prompt" } },
          }, "assessment-update")
        : textTurn("Mock model completed assessment_update_question.");
    } else {
      response = textTurn("Mock model completed assessment_create_questions.");
    }
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: response,
    });
  });
  return requests;
}

async function readAssessmentDb(page) {
  return page.evaluate((dbName) => new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const stores = ["questions", "sessions", "attempts", "mutationReceipts"];
      const transaction = db.transaction(stores, "readonly");
      const records = Object.fromEntries(stores.map((store) => [store, []]));
      for (const store of stores) {
        const request = transaction.objectStore(store).getAll();
        request.onsuccess = () => { records[store] = request.result; };
      }
      transaction.oncomplete = () => {
        db.close();
        resolve(records);
      };
      transaction.onerror = () => reject(transaction.error);
    };
  }), ASSESSMENT_DB);
}

test.describe("Assessment Product Lifecycle E2E", () => {
  test("ordinary chat never receives assessment command tools", async ({ page }) => {
    const requests = [];
    await page.addInitScript(({ storageKey }) => {
      sessionStorage.setItem(storageKey, "test-only-not-a-real-secret");
    }, { storageKey: ASSESSMENT_STORAGE_KEY });
    await page.route(DEEPSEEK_ENDPOINT, async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: "text/event-stream", body: textTurn("Plain chat response.") });
    });
    await page.goto("./?demo=props");
    await page.getByRole("tab", { name: "AI", exact: true }).click();
    await page.getByRole("textbox", { name: "向 AI 助手提问" }).fill("解释当前 Props 示例");
    await page.getByRole("button", { name: "发送" }).click();
    await expect(page.getByText("Plain chat response.", { exact: true })).toBeVisible();

    expect(requests).toHaveLength(1);
    expect(requests[0].tools ?? []).toEqual([]);
  });

  test("AI create persists a recoverable snapshot session and completes after reload", async ({ page }, testInfo) => {
    const requests = await installAssessmentModelMock(page);
    await page.goto("./?demo=props");
    await page.getByRole("tab", { name: "评测", exact: true }).click();

    const assessment = page.locator("#learning-inspector-panel-assessment");
    await expect(assessment.getByRole("heading", { name: "当前知识点暂无评测" })).toBeVisible();
    await assessment.getByRole("button", { name: "让 AI 帮我出题" }).click();

    const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
    await expect(composer).toBeEnabled();
    await page.getByRole("button", { name: "发送" }).click();
    await expect(page.getByText("Mock model completed assessment_create_questions.", { exact: true })).toBeVisible();

    await page.getByRole("tab", { name: "评测", exact: true }).click();
    await expect(assessment.getByRole("button", { name: "开始测试" })).toBeEnabled();
    await assessment.getByRole("button", { name: "开始测试" }).click();
    const firstPrompt = assessment.locator("legend");
    await expect(firstPrompt).toBeVisible();
    const firstPromptText = await firstPrompt.textContent();
    const firstIsChoice = firstPromptText === QUESTIONS[0].content.prompt;

    if (firstIsChoice) {
      await assessment.getByLabel("Local State", { exact: true }).check();
      await assessment.getByRole("button", { name: "提交答案" }).click();
      await expect(assessment.getByText("再想一想", { exact: true })).toBeVisible();
      await expect(assessment.getByText(QUESTIONS[0].content.explanation, { exact: true })).toBeVisible();

      await assessment.getByRole("button", { name: "查看依据 1" }).click();
      await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page.locator('[data-source-file="PropsBasicsDemo.jsx"]')).toHaveAttribute("data-source-focus", "1-2");
      await expect(page.locator('[data-source-line="1"][data-highlighted="true"]')).toBeVisible();
      await expect(page.locator('[data-source-line="2"][data-highlighted="true"]')).toBeVisible();
    } else {
      await assessment.getByLabel("错误", { exact: true }).check();
      await assessment.getByRole("button", { name: "提交答案" }).click();
      await expect(assessment.getByText("再想一想", { exact: true })).toBeVisible();
      await expect(assessment.getByText(QUESTIONS[1].content.explanation, { exact: true })).toBeVisible();
    }

    const beforeReload = await readAssessmentDb(page);
    expect(requests).toHaveLength(2);
    expect(requests[0].tools.map((tool) => tool.function.name)).toContain("assessment_create_questions");
    expect(beforeReload.questions).toHaveLength(2);
    expect(beforeReload.sessions).toHaveLength(1);
    expect(beforeReload.sessions[0].status).toBe("in_progress");
    expect(beforeReload.attempts).toHaveLength(1);

    await page.getByRole("tab", { name: "AI", exact: true }).click();
    await page.getByRole("textbox", { name: "向 AI 助手提问" }).fill("请修改当前评测题");
    await page.getByRole("button", { name: "发送" }).click();
    await expect(page.getByText("Mock model completed assessment_update_question.", { exact: true })).toBeVisible();
    const afterQuestionMutation = await readAssessmentDb(page);
    expect(afterQuestionMutation.questions.some((question) => question.content.prompt === "Mutated question-bank prompt")).toBe(true);
    expect(afterQuestionMutation.sessions[0].items).toEqual(beforeReload.sessions[0].items);

    await page.reload();
    await page.getByRole("tab", { name: "评测", exact: true }).click();
    await expect(assessment.getByLabel("评测进度 2 / 2")).toBeVisible();

    if (firstIsChoice) {
      await assessment.getByLabel("正确", { exact: true }).check();
      await assessment.getByRole("button", { name: "提交答案" }).click();
      await expect(assessment.getByText("回答正确", { exact: true })).toBeVisible();
      await expect(assessment.getByText(QUESTIONS[1].content.explanation, { exact: true })).toBeVisible();
    } else {
      await assessment.getByLabel("Props", { exact: true }).check();
      await assessment.getByRole("button", { name: "提交答案" }).click();
      await expect(assessment.getByText("回答正确", { exact: true })).toBeVisible();
      await expect(assessment.getByText(QUESTIONS[0].content.explanation, { exact: true })).toBeVisible();
      await assessment.getByRole("button", { name: "查看依据 1" }).click();
      await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page.locator('[data-source-file="PropsBasicsDemo.jsx"]')).toHaveAttribute("data-source-focus", "1-2");
      await expect(page.locator('[data-source-line="1"][data-highlighted="true"]')).toBeVisible();
      await expect(page.locator('[data-source-line="2"][data-highlighted="true"]')).toBeVisible();
    }

    const afterReload = await readAssessmentDb(page);
    expect(afterReload.sessions[0].status).toBe("completed");
    expect(afterReload.sessions[0].completedAt).toBeTruthy();
    expect(afterReload.attempts).toHaveLength(2);
    expect(afterReload.sessions[0].items).toEqual(beforeReload.sessions[0].items);
    expect(afterReload.questions).toHaveLength(2);
    expect(afterReload.questions.some((question) => question.content.prompt === "Mutated question-bank prompt")).toBe(true);
    expect(requests).toHaveLength(5);

    await testInfo.attach("assessment-lifecycle-evidence.json", {
      body: JSON.stringify({
        scenario: "create → tool → service → repository → first attempt → reload recovery from snapshot → completion → evidence",
        gatewayRequests: requests.length,
        tool: requests[0].tools.find((item) => item.function.name === "assessment_create_questions")?.function.name,
        persistedBeforeReload: {
          questions: beforeReload.questions.length,
          sessions: beforeReload.sessions.length,
          attempts: beforeReload.attempts.length,
          sessionStatus: beforeReload.sessions[0].status,
        },
        persistedAfterReload: {
          questions: afterReload.questions.length,
          attempts: afterReload.attempts.length,
          sessionStatus: afterReload.sessions[0].status,
        },
        evidence: "PropsBasicsDemo.jsx L1-L2 highlighted in Source inspector",
      }, null, 2),
      contentType: "application/json",
    });
  });

  test("IndexedDB unavailable keeps the assessment usable with a session-only warning", async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "indexedDB", { configurable: true, value: undefined });
    });
    const requests = await installAssessmentModelMock(page);
    await page.goto("./?demo=props");
    await page.getByRole("tab", { name: "评测", exact: true }).click();
    const assessment = page.locator("#learning-inspector-panel-assessment");
    await expect(assessment).toContainText("本地持久化不可用，评测当前为本次会话存储。");
    await assessment.getByRole("button", { name: "让 AI 帮我出题" }).click();
    await page.getByRole("textbox", { name: "向 AI 助手提问" }).fill("请使用 assessment_create_questions 出题");
    await page.getByRole("button", { name: "发送" }).click();
    await expect(page.getByText("Mock model completed assessment_create_questions.", { exact: true })).toBeVisible();
    await page.getByRole("tab", { name: "评测", exact: true }).click();
    await expect(assessment.getByRole("button", { name: "开始测试" })).toBeEnabled();

    await page.reload();
    await page.getByRole("tab", { name: "评测", exact: true }).click();
    await expect(page.locator("#learning-inspector-panel-assessment").getByRole("heading", { name: "当前知识点暂无评测" })).toBeVisible();
    expect(requests).toHaveLength(2);
    await testInfo.attach("assessment-memory-fallback-evidence.json", {
      body: JSON.stringify({
        warning: "本地持久化不可用，评测当前为本次会话存储。",
        usableInSession: true,
        afterReload: "questions cleared as expected for session-only storage",
        gatewayRequests: requests.length,
      }, null, 2),
      contentType: "application/json",
    });
  });
});
