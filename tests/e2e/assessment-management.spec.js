import { expect, test } from "@playwright/test";

const ASSESSMENT_DB = "react-learning-assessment";

async function seedCompletedReview(page) {
  await page.evaluate((dbName) => new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(["questions", "sessions", "attempts"], "readwrite");
      const questions = tx.objectStore("questions");
      const sessions = tx.objectStore("sessions");
      const attempts = tx.objectStore("attempts");
      const baseQuestion = {
        learningUnitId: "props",
        type: "single_choice",
        status: "active",
        revision: 2,
        provenance: { source: "e2e" },
        createdAt: "2026-09-14T08:00:00.000Z",
        updatedAt: "2026-09-14T08:10:00.000Z",
        difficulty: "medium",
        conceptTags: ["review"],
      };
      const q1 = {
        ...baseQuestion,
        id: "review-q1",
        content: {
          prompt: "CURRENT bank prompt A",
          options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
          correctOptionId: "a",
          explanation: "Historical explanation A",
        },
      };
      const q2 = {
        ...baseQuestion,
        id: "review-q2",
        content: {
          prompt: "CURRENT bank prompt B",
          options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
          correctOptionId: "a",
          explanation: "Historical explanation B",
        },
      };
      questions.put(q1);
      questions.put(q2);
      const snapshot = (question, prompt) => ({
        ...question,
        revision: 1,
        content: { ...question.content, prompt },
        updatedAt: "2026-09-14T08:00:00.000Z",
      });
      sessions.put({
        id: "review-session-current",
        learningUnitId: "props",
        items: [
          { questionId: q1.id, revision: 1, snapshot: snapshot(q1, "HISTORICAL snapshot prompt A") },
          { questionId: q2.id, revision: 1, snapshot: snapshot(q2, "HISTORICAL snapshot prompt B") },
        ],
        status: "completed",
        startedAt: "2026-09-14T08:00:00.000Z",
        completedAt: "2026-09-14T08:05:00.000Z",
      });
      attempts.put({
        id: "review-attempt-correct",
        sessionId: "review-session-current",
        questionId: q1.id,
        questionRevision: 1,
        answer: "a",
        correct: true,
        submittedAt: "2026-09-14T08:03:00.000Z",
      });
      attempts.put({
        id: "review-attempt-wrong",
        sessionId: "review-session-current",
        questionId: q2.id,
        questionRevision: 1,
        answer: "b",
        correct: false,
        submittedAt: "2026-09-14T08:04:00.000Z",
      });
      sessions.put({
        id: "review-session-other-unit",
        learningUnitId: "state-snapshot-queue",
        items: [{ questionId: "other-q", revision: 1, snapshot: { ...snapshot(q1, "OTHER UNIT SECRET"), id: "other-q", learningUnitId: "state-snapshot-queue" } }],
        status: "completed",
        startedAt: "2026-09-14T09:00:00.000Z",
        completedAt: "2026-09-14T09:05:00.000Z",
      });
      attempts.put({
        id: "review-attempt-other",
        sessionId: "review-session-other-unit",
        questionId: "other-q",
        questionRevision: 1,
        answer: "b",
        correct: false,
        submittedAt: "2026-09-14T09:04:00.000Z",
      });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }), ASSESSMENT_DB);
}

test("assessment tab exposes the new runtime-backed question manager", async ({ page }) => {
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "评测" }).click();

  await expect(page.getByRole("heading", { name: "当前知识点题目" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "显示已停用题目" })).toBeVisible();
  await expect(page.getByText(/当前知识点暂无评测|准备好检查理解了吗/)).toBeVisible();
});

test("assessment manager keeps practice UI in the same tab", async ({ page }) => {
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "评测" }).click();

  const panel = page.getByRole("tabpanel", { name: "评测" });
  await expect(panel.getByText("题库管理", { exact: true })).toBeVisible();
  await expect(panel.getByText("知识点评测", { exact: true })).toBeVisible();
});

test("completed session review is scoped, snapshot-correct, reloadable, and wrong-first", async ({ page }) => {
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "评测" }).click();
  await expect(page.getByRole("heading", { name: "当前知识点题目" })).toBeVisible();
  await seedCompletedReview(page);

  await page.reload();
  await page.getByRole("tab", { name: "评测" }).click();

  const review = page.locator('section[aria-labelledby="assessment-review-title"]');
  await expect(review.getByRole("heading", { name: "评测回顾" })).toBeVisible();
  await expect(review.getByText("HISTORICAL snapshot prompt A", { exact: true })).toBeVisible();
  await expect(review.getByText("HISTORICAL snapshot prompt B", { exact: true })).toBeVisible();
  await expect(review.getByText("OTHER UNIT SECRET", { exact: true })).toHaveCount(0);
  await expect(review.getByText("先看错题：共 1 道需要回顾。", { exact: true })).toBeVisible();

  const reviewedQuestions = review.locator("article");
  await expect(reviewedQuestions).toHaveCount(2);
  await expect(reviewedQuestions.first().getByText("错误", { exact: true })).toBeVisible();
  await expect(reviewedQuestions.first().getByText("HISTORICAL snapshot prompt B", { exact: true })).toBeVisible();
});
// @browser-owner assessment
