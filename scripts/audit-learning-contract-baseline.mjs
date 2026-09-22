import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  SINGLE_LEARNING_FLOW_UNIT_IDS,
  getSingleLearningFlowDefinition,
} from "../src/learning-flow/learningFlowRegistry.js";
import { getConceptModelForLearningUnit } from "../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";

export const AUTHORING_BASELINE_SHA = "3b0d002289fdfb3d0921825f6e5d87d0f1658ef3";

export const REPRESENTATIVE_PILOT = Object.freeze([
  {
    learningUnitId: "props",
    role: "simple",
    reason: "组件基础的 patch-choice 路径，结构直接，同时包含多 source file authoring。",
  },
  {
    learningUnitId: "state-snapshot-queue",
    role: "medium",
    reason: "既有诊断式 Single Learning Flow 锚点，覆盖 snapshot / queue misconception 与 retry 语义。",
  },
  {
    learningUnitId: "preserving-resetting-state",
    role: "complex",
    reason: "跨 Props、component identity、local State 与 key boundary 的复杂推理，并已有 lesson-level closure。",
  },
  {
    learningUnitId: "render-commit",
    role: "exception-path",
    reason: "前 20 课中唯一 ordered-sequence Practice，覆盖非 patch-choice renderer/evaluator 路径。",
  },
  {
    learningUnitId: "use-effect-correct-usage",
    role: "latest-rollout",
    reason: "Batch D 最新迁移，覆盖 Effect external synchronization、cleanup 与完整 browser journey。",
  },
]);

function readCurrentCommitSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function readDemoMetadata(registrySource) {
  const demosStart = registrySource.indexOf("export const demos = [");
  if (demosStart === -1) {
    throw new Error("authoritative demo registry declaration missing");
  }

  return [...registrySource.slice(demosStart).matchAll(
    /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*badge:\s*"([^"]+)"/g,
  )].map((match) => ({
    id: match[1],
    label: match[2],
    category: match[3],
    badge: match[4],
  }));
}

function countBy(values) {
  return Object.fromEntries(
    [...new Set(values)].sort().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}

function duplicateValues(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort();
}

function inspectUnit(metadata) {
  const learningUnitId = metadata.id;
  const flow = getSingleLearningFlowDefinition(learningUnitId);
  const conceptModel = getConceptModelForLearningUnit(learningUnitId);
  const guidedActivity = getGuidedActivityDefinition(learningUnitId);
  const canonicalQuestions = getCanonicalAssessmentQuestions(learningUnitId);
  const practiceStep = guidedActivity?.steps?.find((step) => step.type === "practice") ?? null;
  const codeEvidence = Array.isArray(conceptModel?.codeEvidence) ? conceptModel.codeEvidence : [];
  const misconceptions = conceptModel?.misconceptions ?? {};
  const transferQuestions = canonicalQuestions.filter(
    (question) => typeof question.content?.codeContext?.code === "string"
      && question.content.codeContext.code.trim().length > 0,
  );

  const missing = [];
  if (!flow) missing.push("flow");
  if (!conceptModel) missing.push("conceptModel");
  if (codeEvidence.length < 2) missing.push("understandCodeEvidence");
  if (Object.keys(misconceptions).length === 0) missing.push("misconceptions");
  if (!guidedActivity) missing.push("guidedActivity");
  if (!practiceStep) missing.push("practice");
  if (!practiceStep?.codeContext?.code?.trim()) missing.push("practiceCodeContext");
  if (canonicalQuestions.length !== 5) missing.push("verifyQuestionCount");
  if (transferQuestions.length < 1) missing.push("verifyCodeTransfer");
  if (!flow?.aiReviewTarget?.trim()) missing.push("aiReviewTarget");

  return {
    ...metadata,
    complete: missing.length === 0,
    missing,
    flowVersion: flow?.version ?? null,
    conceptVersion: conceptModel?.version ?? null,
    guidedRevision: guidedActivity?.revision ?? null,
    codeEvidenceCount: codeEvidence.length,
    sourceEvidenceFiles: [...new Set(
      codeEvidence.map((evidence) => evidence.sourceRef?.fileName).filter(Boolean),
    )].sort(),
    misconceptionCount: Object.keys(misconceptions).length,
    practiceKind: practiceStep?.response?.kind ?? null,
    practiceHasCodeContext: Boolean(practiceStep?.codeContext?.code?.trim()),
    verifyQuestionCount: canonicalQuestions.length,
    verifyTransferQuestionCount: transferQuestions.length,
    aiReviewTargetPresent: Boolean(flow?.aiReviewTarget?.trim()),
    mechanismMapCount: conceptModel?.mechanismMap?.length ?? 0,
    contrastCaseCount: conceptModel?.contrastCases?.length ?? 0,
  };
}

export async function buildLearningContractBaselineReport() {
  const registrySource = await readFile(new URL("../src/demos/index.js", import.meta.url), "utf8");
  const demoMetadata = readDemoMetadata(registrySource);
  const demoIds = demoMetadata.map(({ id }) => id);
  const first20Metadata = demoMetadata.slice(0, 20);
  const first20Ids = first20Metadata.map(({ id }) => id);
  const units = first20Metadata.map(inspectUnit);
  const post20Ids = new Set(demoIds.slice(20));
  const unitById = new Map(units.map((unit) => [unit.id, unit]));

  const representativePilot = REPRESENTATIVE_PILOT.map((selection) => {
    const unit = unitById.get(selection.learningUnitId);
    return {
      ...selection,
      category: unit?.category ?? null,
      practiceKind: unit?.practiceKind ?? null,
      complete: unit?.complete ?? false,
    };
  });

  const practiceKinds = units
    .map(({ practiceKind }) => practiceKind)
    .filter(Boolean);

  return {
    reportVersion: 1,
    authoringBaselineSha: AUTHORING_BASELINE_SHA,
    sourceCommitSha: readCurrentCommitSha(),
    scope: {
      authoritativeRegistry: "src/demos/index.js",
      totalDemoCount: demoIds.length,
      first20Count: first20Ids.length,
      first20Ids,
    },
    summary: {
      completeUnits: units.filter(({ complete }) => complete).length,
      incompleteUnits: units.filter(({ complete }) => !complete).map(({ id }) => id),
      categories: countBy(units.map(({ category }) => category)),
      practiceKinds: countBy(practiceKinds),
      duplicateDemoIds: duplicateValues(demoIds),
      duplicateFlowIds: duplicateValues(SINGLE_LEARNING_FLOW_UNIT_IDS),
      post20FlowIds: SINGLE_LEARNING_FLOW_UNIT_IDS
        .filter((learningUnitId) => post20Ids.has(learningUnitId))
        .sort(),
    },
    representativePilot,
    units,
  };
}

const invokedAsScript =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  const report = await buildLearningContractBaselineReport();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}
