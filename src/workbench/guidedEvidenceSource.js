import { getGuidedActivityDefinition } from "./guidedActivity.js";
import {
  createGuidedSessionPersistence,
  GUIDED_SESSION_PERSISTENCE_STATUS,
} from "./guidedSessionStorage.js";

export const GUIDED_EVIDENCE_SOURCE_STATUS = Object.freeze({
  ...GUIDED_SESSION_PERSISTENCE_STATUS,
  MISSING_DEFINITION: "missing-definition",
});

export function createGuidedEvidenceSource({ storage } = {}) {
  return Object.freeze({
    read({ learningUnitId }) {
      const definition = getGuidedActivityDefinition(learningUnitId);
      if (!definition) {
        return Object.freeze({
          status: GUIDED_EVIDENCE_SOURCE_STATUS.MISSING_DEFINITION,
          definition: null,
          snapshot: null,
        });
      }

      const persistence = createGuidedSessionPersistence({
        definition,
        ...(storage ? { storage } : {}),
      });
      const result = persistence.read();

      return Object.freeze({
        status: result.status,
        definition,
        snapshot: result.snapshot,
      });
    },
  });
}
