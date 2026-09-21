import {
  GUIDED_RESPONSE_KINDS,
  GUIDED_REVIEW_RESOURCES,
  GUIDED_STEP_TYPES,
  assertGuidedActivityDefinition,
  validateGuidedActivityDefinition,
} from "./contract.js";
import { COMPONENT_JSX_PURE_RENDER_DEFINITION } from "./componentJsxPureRender.js";
import { PROPS_DEFINITION } from "./props.js";
import { CHILDREN_DEFINITION } from "./children.js";
import { MULTI_SLOTS_DEFINITION } from "./multiSlots.js";
import { CONDITIONAL_RENDERING_DEFINITION } from "./conditionalRendering.js";
import { PROP_DRILLING_DEFINITION } from "./propDrilling.js";
import { STATE_SNAPSHOT_QUEUE_DEFINITION } from "./stateSnapshotQueue.js";
import { RENDERING_LISTS_KEY_DEFINITION } from "./renderingListsKey.js";
import { PRESERVING_RESETTING_STATE_DEFINITION } from "./preservingResettingState.js";
import { NOT_NEED_EFFECT_DEFINITION } from "./notNeedEffect.js";
import { LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION } from "./lifecycleOfReactiveEffects.js";

export {
  GUIDED_RESPONSE_KINDS,
  GUIDED_REVIEW_RESOURCES,
  GUIDED_STEP_TYPES,
  assertGuidedActivityDefinition,
  validateGuidedActivityDefinition,
};

function deepFreeze(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  Object.values(value).forEach((child) => deepFreeze(child, visited));
  return Object.freeze(value);
}

assertGuidedActivityDefinition(COMPONENT_JSX_PURE_RENDER_DEFINITION);
assertGuidedActivityDefinition(PROPS_DEFINITION);
assertGuidedActivityDefinition(CHILDREN_DEFINITION);
assertGuidedActivityDefinition(MULTI_SLOTS_DEFINITION);
assertGuidedActivityDefinition(CONDITIONAL_RENDERING_DEFINITION);
assertGuidedActivityDefinition(PROP_DRILLING_DEFINITION);
assertGuidedActivityDefinition(STATE_SNAPSHOT_QUEUE_DEFINITION);
assertGuidedActivityDefinition(RENDERING_LISTS_KEY_DEFINITION);
assertGuidedActivityDefinition(PRESERVING_RESETTING_STATE_DEFINITION);
assertGuidedActivityDefinition(NOT_NEED_EFFECT_DEFINITION);
assertGuidedActivityDefinition(LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION);

export const GUIDED_ACTIVITY_DEFINITIONS = deepFreeze({
  [COMPONENT_JSX_PURE_RENDER_DEFINITION.learningUnitId]: COMPONENT_JSX_PURE_RENDER_DEFINITION,
  [PROPS_DEFINITION.learningUnitId]: PROPS_DEFINITION,
  [CHILDREN_DEFINITION.learningUnitId]: CHILDREN_DEFINITION,
  [MULTI_SLOTS_DEFINITION.learningUnitId]: MULTI_SLOTS_DEFINITION,
  [CONDITIONAL_RENDERING_DEFINITION.learningUnitId]: CONDITIONAL_RENDERING_DEFINITION,
  [PROP_DRILLING_DEFINITION.learningUnitId]: PROP_DRILLING_DEFINITION,
  [STATE_SNAPSHOT_QUEUE_DEFINITION.learningUnitId]: STATE_SNAPSHOT_QUEUE_DEFINITION,
  [RENDERING_LISTS_KEY_DEFINITION.learningUnitId]: RENDERING_LISTS_KEY_DEFINITION,
  [PRESERVING_RESETTING_STATE_DEFINITION.learningUnitId]: PRESERVING_RESETTING_STATE_DEFINITION,
  [NOT_NEED_EFFECT_DEFINITION.learningUnitId]: NOT_NEED_EFFECT_DEFINITION,
  [LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION.learningUnitId]: LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION,
});

export const COMPONENT_JSX_PURE_RENDER_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["component-jsx-pure-render"];
export const PROPS_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["props"];
export const CHILDREN_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["children"];
export const MULTI_SLOTS_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["multi-slots"];
export const CONDITIONAL_RENDERING_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["conditional-rendering"];
export const PROP_DRILLING_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["prop-drilling"];

export const STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["state-snapshot-queue"];
export const RENDERING_LISTS_KEY_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["rendering-lists-key"];
export const PRESERVING_RESETTING_STATE_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["preserving-resetting-state"];
export const NOT_NEED_EFFECT_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["not-need-effect"];
export const LIFECYCLE_OF_REACTIVE_EFFECTS_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["lifecycle-of-reactive-effects"];

const LOOKUP_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

function isLookupId(value) {
  return typeof value === "string" && LOOKUP_ID_PATTERN.test(value);
}

/**
 * Look up the sparse extension by the authoritative Learning Unit id.
 *
 * @param {unknown} learningUnitId
 * @returns {object | null}
 */
export function getGuidedActivityDefinition(learningUnitId) {
  if (!isLookupId(learningUnitId)) return null;
  return GUIDED_ACTIVITY_DEFINITIONS[learningUnitId] ?? null;
}

export function hasGuidedActivity(learningUnitId) {
  return getGuidedActivityDefinition(learningUnitId) !== null;
}

/**
 * Return a discriminated lookup result so callers do not need to infer whether
 * a missing registry entry means "no Guided activity" or an invalid definition.
 */
export function getGuidedActivity(learningUnitId) {
  const definition = getGuidedActivityDefinition(learningUnitId);
  if (definition) {
    return Object.freeze({ kind: "definition", definition });
  }
  return Object.freeze({
    kind: "none",
    learningUnitId: typeof learningUnitId === "string" ? learningUnitId : null,
  });
}
