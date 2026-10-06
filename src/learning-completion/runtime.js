import { evaluateLearningCompletion } from "./contract.js";

export function createLearningCompletionRuntime({ evidenceRuntime } = {}) {
  return Object.freeze({
    async read({ learningUnitId }) {
      return evaluateLearningCompletion(await evidenceRuntime.read({ learningUnitId }));
    },
  });
}
