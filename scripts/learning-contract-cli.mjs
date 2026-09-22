import { pathToFileURL } from "node:url";

import {
  buildRepositoryLearningContractAudit,
  buildRepositorySemanticFingerprints,
  createCoverageSummary,
} from "./learning-contract/repository.mjs";

function printIssue(prefix, learningUnitId, item) {
  const scope = learningUnitId ? learningUnitId + ": " : "";
  const path = item.path ? " [" + item.path + "]" : "";
  console.log(prefix + " " + scope + item.code + path + " - " + item.message);
}

function printValidation(audit) {
  for (const item of audit.global.errors) printIssue("ERROR", null, item);
  for (const item of audit.global.warnings) printIssue("WARN", null, item);
  for (const item of audit.global.reviewRequired) printIssue("REVIEW_REQUIRED", null, item);

  for (const unit of audit.units) {
    for (const item of unit.errors) printIssue("ERROR", unit.learningUnitId, item);
    for (const item of unit.warnings) printIssue("WARN", unit.learningUnitId, item);
    for (const item of unit.reviewRequired) printIssue("REVIEW_REQUIRED", unit.learningUnitId, item);
  }

  console.log("");
  console.log(
    "Learning Contract " + audit.contractVersion
      + ": " + audit.summary.validUnits + "/" + audit.summary.totalUnits + " structurally valid"
      + ", errors=" + audit.summary.errorCount
      + ", warnings=" + audit.summary.warningCount
      + ", review_required=" + audit.summary.reviewRequiredCount,
  );
}

function printCoverage(coverage) {
  console.log("Learning Contract coverage (" + coverage.contractVersion + ")");
  console.log("  units: " + coverage.validUnits + "/" + coverage.totalUnits + " structurally valid");
  console.log("  semantic reviewed: " + coverage.semanticReviewedUnits + "/" + coverage.totalUnits);
  console.log("  semantic review pending: " + coverage.semanticReviewPendingUnits);
  console.log("  errors: " + coverage.errorCount);
  console.log("  warnings: " + coverage.warningCount);
  console.log("  review_required: " + coverage.reviewRequiredCount);
  console.log("  practice kinds: " + JSON.stringify(coverage.practiceKinds));
  console.log("  categories: " + JSON.stringify(coverage.categories));
}

export async function runLearningContractCli(command) {
  const audit = await buildRepositoryLearningContractAudit();

  if (command === "audit") {
    console.log(JSON.stringify(audit, null, 2));
  } else if (command === "coverage") {
    printCoverage(createCoverageSummary(audit));
  } else if (command === "validate") {
    printValidation(audit);
  } else if (command === "fingerprints") {
    console.log(JSON.stringify(await buildRepositorySemanticFingerprints(), null, 2));
  } else {
    console.error("Unknown Learning Contract command: " + command);
    return 2;
  }

  return audit.summary.errorCount === 0 ? 0 : 1;
}

const invokedAsScript =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (invokedAsScript) {
  process.exitCode = await runLearningContractCli(process.argv[2] ?? "validate");
}
