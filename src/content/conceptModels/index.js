import { COMPONENT_JSX_PURE_RENDER_MODEL } from "./componentJsxPureRender.js";
import { PROPS_MODEL } from "./props.js";
import { CHILDREN_MODEL } from "./children.js";
import { MULTI_SLOTS_MODEL } from "./multiSlots.js";
import { CONDITIONAL_RENDERING_MODEL } from "./conditionalRendering.js";
import { PROP_DRILLING_MODEL } from "./propDrilling.js";
import { LISTS_KEY_MODEL } from "./renderingListsKey.js";
import { EVENT_PROPAGATION_MODEL } from "./eventPropagation.js";
import { STATE_SNAPSHOT_QUEUE_MODEL } from "./stateSnapshotQueue.js";
import { IMMUTABLE_STATE_MODEL } from "./immutableState.js";
import { RENDER_COMMIT_MODEL } from "./renderCommit.js";
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
  [COMPONENT_JSX_PURE_RENDER_MODEL.learningUnitId]: COMPONENT_JSX_PURE_RENDER_MODEL,
  [PROPS_MODEL.learningUnitId]: PROPS_MODEL,
  [CHILDREN_MODEL.learningUnitId]: CHILDREN_MODEL,
  [MULTI_SLOTS_MODEL.learningUnitId]: MULTI_SLOTS_MODEL,
  [CONDITIONAL_RENDERING_MODEL.learningUnitId]: CONDITIONAL_RENDERING_MODEL,
  [PROP_DRILLING_MODEL.learningUnitId]: PROP_DRILLING_MODEL,
  [LISTS_KEY_MODEL.learningUnitId]: LISTS_KEY_MODEL,
  [EVENT_PROPAGATION_MODEL.learningUnitId]: EVENT_PROPAGATION_MODEL,
  [STATE_SNAPSHOT_QUEUE_MODEL.learningUnitId]: STATE_SNAPSHOT_QUEUE_MODEL,
  [IMMUTABLE_STATE_MODEL.learningUnitId]: IMMUTABLE_STATE_MODEL,
  [RENDER_COMMIT_MODEL.learningUnitId]: RENDER_COMMIT_MODEL,
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
