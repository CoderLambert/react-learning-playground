import { COMPONENT_JSX_PURE_RENDER_QUESTIONS } from "./componentJsxPureRender.js";
import { PROPS_QUESTIONS } from "./props.js";
import { CHILDREN_QUESTIONS } from "./children.js";
import { MULTI_SLOTS_QUESTIONS } from "./multiSlots.js";
import { CONDITIONAL_RENDERING_QUESTIONS } from "./conditionalRendering.js";
import { PROP_DRILLING_QUESTIONS } from "./propDrilling.js";
import { RENDERING_LISTS_KEY_QUESTIONS } from "./renderingListsKey.js";
import { EVENT_PROPAGATION_QUESTIONS } from "./eventPropagation.js";
import { STATE_SNAPSHOT_QUEUE_QUESTIONS } from "./stateSnapshotQueue.js";
import { IMMUTABLE_STATE_QUESTIONS } from "./immutableState.js";
import { RENDER_COMMIT_QUESTIONS } from "./renderCommit.js";
import { PRESERVING_RESETTING_STATE_QUESTIONS } from "./preservingResettingState.js";
import { NOT_NEED_EFFECT_QUESTIONS } from "./notNeedEffect.js";
import { LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS } from "./lifecycleOfReactiveEffects.js";

const CANONICAL_QUESTIONS_BY_LEARNING_UNIT = Object.freeze({
  "component-jsx-pure-render": COMPONENT_JSX_PURE_RENDER_QUESTIONS,
  "props": PROPS_QUESTIONS,
  "children": CHILDREN_QUESTIONS,
  "multi-slots": MULTI_SLOTS_QUESTIONS,
  "conditional-rendering": CONDITIONAL_RENDERING_QUESTIONS,
  "prop-drilling": PROP_DRILLING_QUESTIONS,
  "rendering-lists-key": RENDERING_LISTS_KEY_QUESTIONS,
  "event-propagation": EVENT_PROPAGATION_QUESTIONS,
  "state-snapshot-queue": STATE_SNAPSHOT_QUEUE_QUESTIONS,
  "immutable-state": IMMUTABLE_STATE_QUESTIONS,
  "render-commit": RENDER_COMMIT_QUESTIONS,
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
