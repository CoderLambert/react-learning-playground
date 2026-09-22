import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  SINGLE_LEARNING_FLOW_UNIT_IDS,
  getSingleLearningFlowDefinition,
} from "../src/learning-flow/learningFlowRegistry.js";
import { getConceptModelForLearningUnit } from "../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";

const EXPECTED_FIRST_20 = [
  "component-jsx-pure-render",
  "props",
  "children",
  "multi-slots",
  "conditional-rendering",
  "rendering-lists-key",
  "prop-drilling",
  "event-propagation",
  "state-snapshot-queue",
  "immutable-state",
  "render-commit",
  "state-dry",
  "controlled-uncontrolled",
  "lifting-state-up",
  "preserving-resetting-state",
  "state-reducer",
  "context-propagation",
  "use-reduce-with-context",
  "use-ref",
  "use-effect-correct-usage",
];

const ALLOWED_POST_20_FLOW_IDS = [
  "lifecycle-of-reactive-effects",
  "not-need-effect",
];

async function readAuthoringSource(fileName) {
  const candidateDirs = ["../src/demos/", "../src/components/"];
  for (const directory of candidateDirs) {
    try {
      return await readFile(new URL(`${directory}${fileName}`, import.meta.url), "utf8");
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  assert.fail(`source-backed authoring file not found: ${fileName}`);
}

async function authoritativeDemoIds() {
  const registrySource = await readFile(new URL("../src/demos/index.js", import.meta.url), "utf8");
  const demosStart = registrySource.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1, "authoritative demo registry declaration missing");
  return [...registrySource.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)]
    .map((match) => match[1]);
}

test("the authoritative first 20 demos all satisfy the VNext cross-surface contract", async () => {
  const demoIds = await authoritativeDemoIds();
  const first20 = demoIds.slice(0, 20);

  assert.deepEqual(first20, EXPECTED_FIRST_20);
  assert.equal(new Set(first20).size, 20);

  for (const learningUnitId of first20) {
    const flow = getSingleLearningFlowDefinition(learningUnitId);
    const concept = getConceptModelForLearningUnit(learningUnitId);
    const guided = getGuidedActivityDefinition(learningUnitId);
    const questions = getCanonicalAssessmentQuestions(learningUnitId);

    assert.ok(flow, `${learningUnitId}: missing Single Learning Flow`);
    assert.equal(flow.learningUnitId, learningUnitId);
    assert.equal(typeof flow.aiReviewTarget, "string", `${learningUnitId}: missing AI closure target`);
    assert.ok(flow.aiReviewTarget.trim(), `${learningUnitId}: blank AI closure target`);

    assert.equal(concept?.learningUnitId, learningUnitId);
    assert.ok(concept.codeEvidence?.length >= 2, `${learningUnitId}: missing source-backed Understand evidence`);

    for (const evidence of concept.codeEvidence) {
      const ref = evidence.sourceRef;
      assert.equal(ref?.kind, "source", `${learningUnitId}/${evidence.id}: sourceRef must be source-backed`);
      assert.equal(typeof ref.fileName, "string");
      assert.ok(Number.isInteger(ref.startLine) && ref.startLine >= 1);
      assert.ok(Number.isInteger(ref.endLine) && ref.endLine >= ref.startLine);

      const source = await readAuthoringSource(ref.fileName);
      const lineCount = source.split("\n").length;
      assert.ok(
        ref.startLine <= lineCount && ref.endLine <= lineCount,
        `${learningUnitId}/${evidence.id}: stale source range ${ref.fileName} L${ref.startLine}-L${ref.endLine}`,
      );
    }

    assert.equal(guided?.learningUnitId, learningUnitId);
    assert.ok(guided.steps[3].codeContext?.code?.trim(), `${learningUnitId}: missing Practice code context`);

    assert.equal(questions.length, 5, `${learningUnitId}: Verify must contain exactly five canonical questions`);
    assert.ok(
      questions.some((question) => question.content?.codeContext?.code?.trim()),
      `${learningUnitId}: missing unfamiliar-code Verify transfer`,
    );
  }
});

test("first-20 rollout does not leak into new post-20 lessons", async () => {
  const demoIds = await authoritativeDemoIds();
  const post20 = new Set(demoIds.slice(20));
  const demoIdSet = new Set(demoIds);

  assert.ok(
    SINGLE_LEARNING_FLOW_UNIT_IDS.every((learningUnitId) => demoIdSet.has(learningUnitId)),
    "Single Learning Flow must never invent a second Learning Unit catalog",
  );

  const migratedPost20 = SINGLE_LEARNING_FLOW_UNIT_IDS
    .filter((learningUnitId) => post20.has(learningUnitId))
    .sort();

  assert.deepEqual(migratedPost20, [...ALLOWED_POST_20_FLOW_IDS].sort());
});
