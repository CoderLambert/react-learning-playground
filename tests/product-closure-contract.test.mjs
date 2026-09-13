import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { ASSESSMENT_ERROR_CODES } from "../src/assessment/domain/assessmentErrors.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { createFixedClock } from "../src/platform/clock.js";

const ROOT = process.cwd();
const EXPORT_MODULE = resolve(ROOT, "src/ai/conversations/exportConversation.js");
const QUESTION_BANK_MANAGER = resolve(ROOT, "src/assessment/QuestionBankManager.jsx");
const TIMESTAMP = "2026-09-13T00:00:00.000Z";
const UNIT = "props";

function questionDraft(prompt = "Props are what kind of input?") {
  return {
    type: "single_choice",
    content: {
      prompt,
      options: [
        { id: "readonly", text: "Read-only" },
        { id: "mutable", text: "Mutable" },
      ],
      correctOptionId: "readonly",
      explanation: "Props are read-only inputs.",
    },
    difficulty: "easy",
    conceptTags: ["props"],
  };
}

function createService() {
  const repository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  let sequence = 0;
  const service = new AssessmentService({
    repository,
    clock: createFixedClock(TIMESTAMP),
    idFactory: (prefix) => `${prefix}-closure-${++sequence}`,
  });
  return { service, repository };
}

test("assessment management contract: edit uses optimistic revision and stale edit conflicts", async () => {
  const { service, repository } = createService();
  const question = (await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "create" },
    questions: [questionDraft()],
  })).result[0];

  const saved = await service.updateQuestion({
    trusted: { learningUnitId: UNIT, mutationId: "edit-1" },
    questionId: question.id,
    expectedRevision: question.revision,
    patch: { content: { prompt: "Edited prompt" }, difficulty: "medium" },
  });
  assert.equal(saved.result.revision, 2);
  assert.equal(saved.result.content.prompt, "Edited prompt");

  await assert.rejects(
    service.updateQuestion({
      trusted: { learningUnitId: UNIT, mutationId: "stale-edit" },
      questionId: question.id,
      expectedRevision: 1,
      patch: { content: { prompt: "Stale overwrite" } },
    }),
    (error) => error?.code === ASSESSMENT_ERROR_CODES.REVISION_CONFLICT,
  );
  assert.equal((await repository.getQuestion({ learningUnitId: UNIT, questionId: question.id })).content.prompt, "Edited prompt");
});

test("assessment management contract: retire is soft-delete and existing session remains frozen", async () => {
  const { service, repository } = createService();
  const question = (await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "create-session-question" },
    questions: [questionDraft("Frozen prompt")],
  })).result[0];
  const session = await service.startSession({ trusted: { learningUnitId: UNIT }, questionIds: [question.id] });

  await service.updateQuestion({
    trusted: { learningUnitId: UNIT, mutationId: "edit-after-start" },
    questionId: question.id,
    expectedRevision: 1,
    patch: { content: { prompt: "Bank prompt changed" } },
  });
  await service.retireQuestion({
    trusted: { learningUnitId: UNIT, mutationId: "retire-after-start" },
    questionId: question.id,
    expectedRevision: 2,
  });

  const retired = await repository.getQuestion({ learningUnitId: UNIT, questionId: question.id });
  const persistedSession = await repository.getSession({ learningUnitId: UNIT, sessionId: session.id });
  assert.equal(retired.status, "retired");
  assert.equal(retired.revision, 3);
  assert.equal(persistedSession.items[0].snapshot.content.prompt, "Frozen prompt");
  assert.equal(persistedSession.items[0].snapshot.revision, 1);
  assert.equal(persistedSession.items[0].snapshot.status, "active");
});

test("conversation export contract runs automatically once export helper is merged", { skip: !existsSync(EXPORT_MODULE) }, async () => {
  const exports = await import(pathToFileURL(EXPORT_MODULE).href);
  const options = {
    title: "Props session",
    providerLabel: "DeepSeek",
    modelLabel: "deepseek-chat",
    contextSummary: { note: "props.mdx", sources: [{ name: "PropsBasicsDemo.jsx" }] },
    messages: [
      { role: "user", content: "Explain props" },
      { role: "assistant", content: "Props are read-only.", metadata: { finishReason: "stop" } },
    ],
  };

  const markdown = exports.serializeConversationMarkdown(options);
  const json = JSON.parse(exports.serializeConversationJson(options));
  assert.match(markdown, /Explain props/);
  assert.match(markdown, /Props are read-only/);
  assert.match(markdown, /DeepSeek/);
  assert.equal(json.messages.length, 2);
  assert.equal(json.messages[1].metadata.finishReason, "stop");
});

test("legacy chapter checkpoint contract activates once editable localStorage manager is removed", {
  skip: readFileSync(QUESTION_BANK_MANAGER, "utf8").includes("createQuestionBankRepository"),
}, () => {
  const source = readFileSync(QUESTION_BANK_MANAGER, "utf8");
  assert.doesNotMatch(source, /createQuestionBankRepository|repository\.save|repository\.upsertCustom|repository\.deleteCustom/);
  assert.doesNotMatch(source, /<AssessmentRunner/);
});
