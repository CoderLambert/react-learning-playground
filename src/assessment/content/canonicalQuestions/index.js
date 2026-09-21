import { RENDERING_LISTS_KEY_QUESTIONS } from "./renderingListsKey.js";
import { STATE_SNAPSHOT_QUEUE_QUESTIONS } from "./stateSnapshotQueue.js";
import { PRESERVING_RESETTING_STATE_QUESTIONS } from "./preservingResettingState.js";
import { NOT_NEED_EFFECT_QUESTIONS } from "./notNeedEffect.js";
import { LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS } from "./lifecycleOfReactiveEffects.js";

const CANONICAL_QUESTIONS_BY_LEARNING_UNIT = Object.freeze({
  "rendering-lists-key": RENDERING_LISTS_KEY_QUESTIONS,
  "state-snapshot-queue": STATE_SNAPSHOT_QUEUE_QUESTIONS,
  "not-need-effect": NOT_NEED_EFFECT_QUESTIONS,
  "preserving-resetting-state": PRESERVING_RESETTING_STATE_QUESTIONS,
  "lifecycle-of-reactive-effects": LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS,
});

export function getCanonicalAssessmentQuestions(learningUnitId) {
  const questions = CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId] ?? [];
  return questions.map((question) => structuredClone(question));
}

export function hasCanonicalAssessmentQuestions(learningUnitId) {
  return (CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId]?.length ?? 0) > 0;
}
