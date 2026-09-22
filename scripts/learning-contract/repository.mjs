import { readFile } from "node:fs/promises";
import { REPRESENTATIVE_PILOT } from "../audit-learning-contract-baseline.mjs";
import { getSingleLearningFlowDefinition } from "../../src/learning-flow/learningFlowRegistry.js";
import { getConceptModelForLearningUnit } from "../../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../../src/workbench/guidedActivity.js";
import { getCanonicalAssessmentQuestions } from "../../src/assessment/content/canonicalQuestions.js";
import { createLearningReviewProjection } from "../../src/learning-flow/learningReviewProjection.js";
import {
  LEARNING_CONTRACT_VERSION,
  findDuplicateValues,
  validateLearningContractSnapshot,
} from "./validator.mjs";

const DEMO_REGISTRY_URL = new URL("../../src/demos/index.js", import.meta.url);
const FLOW_REGISTRY_URL = new URL("../../src/learning-flow/learningFlowRegistry.js", import.meta.url);
const CONCEPT_REGISTRY_URL = new URL("../../src/content/conceptModels/index.js", import.meta.url);
const GUIDED_REGISTRY_URL = new URL("../../src/workbench/guidedActivities/index.js", import.meta.url);
const CANONICAL_REGISTRY_URL = new URL("../../src/assessment/content/canonicalQuestions/index.js", import.meta.url);
const SINGLE_FLOW_URL = new URL("../../src/learning-flow/SingleLearningFlow.jsx", import.meta.url);

function globalIssue(code, message, path = null) {
  return Object.freeze({ code, message, path });
}

function isNonBlank(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseRawImports(source) {
  return new Map(
    [...source.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+"([^"]+)\?raw";/g)]
      .map((match) => [match[1], match[2]]),
  );
}

function parseDemoEntries(source) {
  const demosStart = source.indexOf("export const demos = [");
  if (demosStart === -1) throw new Error("authoritative demo registry declaration missing");
  const demosSource = source.slice(demosStart);
  const entries = [];

  for (const match of demosSource.matchAll(
    /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*category:\s*"([^"]+)",[\s\S]*?files:\s*\[([\s\S]*?)\]\s*\},?/g,
  )) {
    entries.push({
      id: match[1],
      label: match[2],
      category: match[3],
      filesSource: match[4],
    });
  }

  return entries;
}

function parseDemoFileRefs(entry, rawImports) {
  const refs = [];
  for (const match of entry.filesSource.matchAll(
    /\{\s*name:\s*"([^"]+)",\s*code:\s*([A-Za-z0-9_]+)\s*\}/g,
  )) {
    const importPath = rawImports.get(match[2]);
    refs.push({ fileName: match[1], importPath: importPath ?? null });
  }
  return refs;
}

async function loadDemoRegistry() {
  const source = await readFile(DEMO_REGISTRY_URL, "utf8");
  const rawImports = parseRawImports(source);
  const entries = parseDemoEntries(source).map((entry) => ({
    ...entry,
    fileRefs: parseDemoFileRefs(entry, rawImports),
  }));
  return { source, entries };
}

async function loadSourceFiles(entry) {
  const sourceFiles = {};
  for (const ref of entry.fileRefs) {
    if (!ref.importPath) continue;
    sourceFiles[ref.fileName] = await readFile(new URL(ref.importPath, DEMO_REGISTRY_URL), "utf8");
  }
  return sourceFiles;
}

function practiceKind(guided) {
  return guided?.steps?.find((step) => step.type === "practice")?.response?.kind ?? null;
}

async function createRepositorySnapshot(entry) {
  const learningUnitId = entry.id;
  return {
    learningUnitId,
    flow: getSingleLearningFlowDefinition(learningUnitId),
    concept: getConceptModelForLearningUnit(learningUnitId),
    guided: getGuidedActivityDefinition(learningUnitId),
    questions: getCanonicalAssessmentQuestions(learningUnitId),
    sourceFiles: await loadSourceFiles(entry),
  };
}

async function literalRegistryIds(url, pattern) {
  const source = await readFile(url, "utf8");
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

async function computedRegistryIds(url) {
  const source = await readFile(url, "utf8");
  const importMap = new Map(
    [...source.matchAll(/import\s+\{\s*([A-Z0-9_]+)\s*\}\s+from\s+"([^"]+)";/g)]
      .map((match) => [match[1], match[2]]),
  );
  const symbols = [...source.matchAll(/\[([A-Z0-9_]+)\.learningUnitId\]\s*:/g)]
    .map((match) => match[1]);

  const ids = [];
  for (const symbol of symbols) {
    const importPath = importMap.get(symbol);
    if (!importPath) {
      ids.push(null);
      continue;
    }
    const moduleUrl = new URL(importPath, url);
    const module = await import(moduleUrl.href);
    ids.push(module[symbol]?.learningUnitId ?? null);
  }
  return ids;
}

function addDuplicateIssues(target, surface, ids) {
  for (const duplicateId of findDuplicateValues(ids)) {
    target.push(globalIssue(
      "DUPLICATE_" + surface.toUpperCase() + "_OWNERSHIP",
      surface + ": duplicate authoring ownership for " + duplicateId,
      surface,
    ));
  }
}

async function inspectDuplicateOwnership(demoEntries) {
  const errors = [];
  addDuplicateIssues(errors, "demo", demoEntries.map(({ id }) => id));

  const flowIds = await literalRegistryIds(
    FLOW_REGISTRY_URL,
    /^\s*"([a-z0-9-]+)":\s*flowDefinition\(/gm,
  );
  addDuplicateIssues(errors, "flow", flowIds);

  const conceptIds = await computedRegistryIds(CONCEPT_REGISTRY_URL);
  if (conceptIds.some((id) => !isNonBlank(id))) {
    errors.push(globalIssue("CONCEPT_OWNERSHIP_UNRESOLVED", "concept registry contains an unresolvable authoring owner", "concept"));
  }
  addDuplicateIssues(errors, "concept", conceptIds);

  const guidedIds = await computedRegistryIds(GUIDED_REGISTRY_URL);
  if (guidedIds.some((id) => !isNonBlank(id))) {
    errors.push(globalIssue("GUIDED_OWNERSHIP_UNRESOLVED", "Guided registry contains an unresolvable authoring owner", "guided"));
  }
  addDuplicateIssues(errors, "guided", guidedIds);

  const canonicalIds = await literalRegistryIds(
    CANONICAL_REGISTRY_URL,
    /^\s*"([a-z0-9-]+)":\s*[A-Z0-9_]+,/gm,
  );
  addDuplicateIssues(errors, "canonical", canonicalIds);

  return errors;
}

async function inspectRuntimeBoundary() {
  const errors = [];
  const source = await readFile(SINGLE_FLOW_URL, "utf8");

  if (!source.includes('verificationSession?.status === "completed"')) {
    errors.push(globalIssue(
      "COMPLETION_GATE_CHANGED",
      "SingleLearningFlow no longer exposes completion from a completed verification session",
      "SingleLearningFlow",
    ));
  }
  if (source.includes("aiReviewTarget")) {
    errors.push(globalIssue(
      "AI_ENTERED_COMPLETION_FLOW",
      "SingleLearningFlow directly references aiReviewTarget; V1 requires AI-independent completion",
      "SingleLearningFlow",
    ));
  }

  const clean = createLearningReviewProjection();
  const assessment = createLearningReviewProjection({
    assessmentReview: { review: { incorrectCount: 1 } },
  });
  const guided = createLearningReviewProjection({ guidedNeedsReview: true });

  if (clean.needsReview !== false || assessment.needsReview !== true || guided.needsReview !== true) {
    errors.push(globalIssue(
      "REVIEW_PROJECTION_CHANGED",
      "lesson review projection no longer reflects deterministic Assessment/Guided evidence",
      "learningReviewProjection",
    ));
  }
  for (const projection of [clean, assessment, guided]) {
    if ("score" in projection || "mastery" in projection || "ai" in projection) {
      errors.push(globalIssue(
        "REVIEW_PROJECTION_INVENTED_STATE",
        "review projection introduced score/mastery/AI-owned state",
        "learningReviewProjection",
      ));
      break;
    }
  }

  return errors;
}

function countIssues(units, key) {
  return units.reduce((total, unit) => total + unit[key].length, 0);
}

export async function buildRepositoryLearningContractAudit() {
  const { entries } = await loadDemoRegistry();
  const first20 = entries.slice(0, 20);
  const semanticReviewed = new Set(REPRESENTATIVE_PILOT.map(({ learningUnitId }) => learningUnitId));

  const globalErrors = [
    ...(await inspectDuplicateOwnership(entries)),
    ...(await inspectRuntimeBoundary()),
  ];

  if (first20.length !== 20) {
    globalErrors.push(globalIssue(
      "FIRST20_SCOPE_INVALID",
      "authoritative demo registry does not expose 20 lessons for V1 scope",
      "src/demos/index.js",
    ));
  }

  const units = [];
  for (const entry of first20) {
    const snapshot = await createRepositorySnapshot(entry);
    const result = validateLearningContractSnapshot(snapshot, {
      semanticReviewed: semanticReviewed.has(entry.id),
    });
    units.push(Object.freeze({
      learningUnitId: entry.id,
      label: entry.label,
      category: entry.category,
      practiceKind: practiceKind(snapshot.guided),
      semanticReviewed: semanticReviewed.has(entry.id),
      errors: result.errors,
      warnings: result.warnings,
      reviewRequired: result.reviewRequired,
    }));
  }

  const summary = Object.freeze({
    contractVersion: LEARNING_CONTRACT_VERSION,
    totalUnits: units.length,
    validUnits: units.filter(({ errors }) => errors.length === 0).length,
    errorCount: globalErrors.length + countIssues(units, "errors"),
    warningCount: countIssues(units, "warnings"),
    reviewRequiredCount: countIssues(units, "reviewRequired"),
    semanticReviewedUnits: units.filter(({ semanticReviewed: reviewed }) => reviewed).length,
    semanticReviewPendingUnits: units.filter(({ semanticReviewed: reviewed }) => !reviewed).length,
  });

  return Object.freeze({
    contractVersion: LEARNING_CONTRACT_VERSION,
    scope: Object.freeze({
      authoritativeRegistry: "src/demos/index.js",
      first20Ids: Object.freeze(first20.map(({ id }) => id)),
    }),
    global: Object.freeze({
      errors: Object.freeze(globalErrors),
      warnings: Object.freeze([]),
      reviewRequired: Object.freeze([]),
    }),
    summary,
    units: Object.freeze(units),
  });
}

export function createCoverageSummary(audit) {
  const kinds = {};
  const categories = {};
  for (const unit of audit.units) {
    if (unit.practiceKind) kinds[unit.practiceKind] = (kinds[unit.practiceKind] ?? 0) + 1;
    categories[unit.category] = (categories[unit.category] ?? 0) + 1;
  }

  return Object.freeze({
    contractVersion: audit.contractVersion,
    totalUnits: audit.summary.totalUnits,
    validUnits: audit.summary.validUnits,
    semanticReviewedUnits: audit.summary.semanticReviewedUnits,
    semanticReviewPendingUnits: audit.summary.semanticReviewPendingUnits,
    errorCount: audit.summary.errorCount,
    warningCount: audit.summary.warningCount,
    reviewRequiredCount: audit.summary.reviewRequiredCount,
    practiceKinds: Object.freeze(kinds),
    categories: Object.freeze(categories),
  });
}
