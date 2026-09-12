import { AssessmentError, ASSESSMENT_ERROR_CODES } from "../domain/assessmentErrors.js";

function invalidEvidence(message, details) {
  return new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, message, { details });
}

function countLines(code) {
  // SourceViewer renders the source verbatim; a trailing newline is a real
  // (empty) source line there too, so use the same simple line model here.
  return String(code).split(/\r\n|\r|\n/).length;
}

/**
 * Resolve source evidence against the application's authoritative learning
 * unit registry.  This is deliberately composed at the product boundary:
 * AssessmentService receives only this resolver and never imports demos,
 * React, or IndexedDB.
 */
export function createLearningUnitEvidenceResolver({ getLearningUnit } = {}) {
  if (typeof getLearningUnit !== "function") {
    throw new TypeError("getLearningUnit must be a function");
  }

  return async function resolveSourceEvidence(ref, context = {}) {
    if (!ref || ref.kind !== "source") {
      throw invalidEvidence("only source evidence can be resolved", { ref });
    }
    const learningUnitId = context.learningUnitId;
    const learningUnit = getLearningUnit(learningUnitId);
    if (!learningUnit || learningUnit.id !== learningUnitId) {
      throw invalidEvidence("learning unit for evidence does not exist", { learningUnitId });
    }
    const source = learningUnit.sources?.find((candidate) => candidate?.name === ref.fileName);
    if (!source || typeof source.code !== "string") {
      throw invalidEvidence("evidence source is not part of the learning unit", {
        learningUnitId,
        fileName: ref.fileName,
      });
    }
    const lineCount = countLines(source.code);
    if (!Number.isInteger(ref.startLine) || ref.startLine < 1 ||
      !Number.isInteger(ref.endLine) || ref.endLine < ref.startLine || ref.endLine > lineCount) {
      throw invalidEvidence("evidence line range is outside the source file", {
        learningUnitId,
        fileName: ref.fileName,
        startLine: ref.startLine,
        endLine: ref.endLine,
        lineCount,
      });
    }
    return { learningUnitId, fileName: source.name, lineCount };
  };
}

export { countLines as countSourceLines };
