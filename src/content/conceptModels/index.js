import { LISTS_KEY_MODEL } from "./renderingListsKey.js";
import { STATE_SNAPSHOT_QUEUE_MODEL } from "./stateSnapshotQueue.js";
import { NOT_NEED_EFFECT_MODEL } from "./notNeedEffect.js";
import { PRESERVING_RESETTING_STATE_MODEL } from "./preservingResettingState.js";
import { LIFECYCLE_OF_REACTIVE_EFFECTS_MODEL } from "./lifecycleOfReactiveEffects.js";

function deepFreeze(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  Object.values(value).forEach((child) => deepFreeze(child, visited));
  return Object.freeze(value);
}

export const CONCEPT_MODELS = deepFreeze({
  [LISTS_KEY_MODEL.learningUnitId]: LISTS_KEY_MODEL,
  [STATE_SNAPSHOT_QUEUE_MODEL.learningUnitId]: STATE_SNAPSHOT_QUEUE_MODEL,
  [NOT_NEED_EFFECT_MODEL.learningUnitId]: NOT_NEED_EFFECT_MODEL,
  [PRESERVING_RESETTING_STATE_MODEL.learningUnitId]: PRESERVING_RESETTING_STATE_MODEL,
  [LIFECYCLE_OF_REACTIVE_EFFECTS_MODEL.learningUnitId]: LIFECYCLE_OF_REACTIVE_EFFECTS_MODEL,
});

export function getConceptModelForLearningUnit(learningUnitId) {
  return CONCEPT_MODELS[learningUnitId] ?? null;
}

export function getMisconceptionForLearningUnit(learningUnitId, misconceptionId) {
  if (!learningUnitId || !misconceptionId) return null;
  return CONCEPT_MODELS[learningUnitId]?.misconceptions?.[misconceptionId] ?? null;
}
