import {
  createGuidedEvidenceSource,
  GUIDED_EVIDENCE_SOURCE_STATUS,
} from "../workbench/evidencePublic.js";
import { createLearnerEvidenceProjection } from "./projection.js";

export class LearnerEvidenceSourceError extends Error {
  constructor(source, status, message) {
    super(message);
    this.name = "LearnerEvidenceSourceError";
    this.source = source;
    this.status = status;
  }
}

function assertAssessmentSource(source) {
  if (!source || typeof source.read !== "function") {
    throw new TypeError("Learner Evidence requires assessmentSource.read");
  }
}

function assertGuidedSource(source) {
  if (!source || typeof source.read !== "function") {
    throw new TypeError("Learner Evidence requires guidedSource.read");
  }
}

function normalizeGuidedSource(result) {
  if (!result || typeof result !== "object") {
    throw new LearnerEvidenceSourceError(
      "guided",
      "invalid-result",
      "Guided Evidence source returned an invalid result",
    );
  }

  if (result.status === GUIDED_EVIDENCE_SOURCE_STATUS.EMPTY) {
    return {
      definition: result.definition,
      snapshot: null,
      practiceOutcome: null,
    };
  }

  if (result.status === GUIDED_EVIDENCE_SOURCE_STATUS.RESTORED) {
    return {
      definition: result.definition,
      snapshot: result.snapshot,
      practiceOutcome: result.practiceOutcome,
    };
  }

  throw new LearnerEvidenceSourceError(
    "guided",
    result.status,
    "Guided Evidence source is not safely readable: " + result.status,
  );
}

export function createLearnerEvidenceRuntime({
  assessmentSource,
  guidedSource = createGuidedEvidenceSource(),
} = {}) {
  assertAssessmentSource(assessmentSource);
  assertGuidedSource(guidedSource);

  return Object.freeze({
    async read({ learningUnitId }) {
      const [assessmentSources, guidedResult] = await Promise.all([
        assessmentSource.read({ learningUnitId }),
        Promise.resolve(guidedSource.read({ learningUnitId })),
      ]);

      if (!Array.isArray(assessmentSources)) {
        throw new LearnerEvidenceSourceError(
          "assessment",
          "invalid-result",
          "Assessment Evidence source must return an array",
        );
      }

      return createLearnerEvidenceProjection({
        learningUnitId,
        assessmentSources,
        guidedSource: normalizeGuidedSource(guidedResult),
      });
    },
  });
}
