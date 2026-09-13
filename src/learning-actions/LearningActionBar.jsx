import {
  LEARNING_ACTION_KINDS,
  buildLearningActionPrompt,
  getLearningActionsForContext,
} from "./promptBuilder.js";

const LABELS = Object.freeze({
  [LEARNING_ACTION_KINDS.EXPLAIN]: "解释",
  [LEARNING_ACTION_KINDS.EXAMPLE]: "举例",
  [LEARNING_ACTION_KINDS.COUNTEREXAMPLE]: "反例",
  [LEARNING_ACTION_KINDS.QUIZ]: "测测我",
  [LEARNING_ACTION_KINDS.WHY]: "为什么这样写",
  [LEARNING_ACTION_KINDS.WALKTHROUGH]: "带我读实现",
  [LEARNING_ACTION_KINDS.VERIFY]: "它验证什么",
});

export function LearningActionBar({
  context,
  onAction,
  disabled = false,
  label = "AI 学习动作",
}) {
  if (!context) return null;
  const actions = getLearningActionsForContext(context.kind);
  if (!actions.length) return null;

  return (
    <div className="learning-action-bar" role="group" aria-label={label}>
      {actions.map((action) => (
        <button
          key={action}
          type="button"
          className="btn btn-outline btn-sm"
          disabled={disabled}
          onClick={() => onAction?.({
            action,
            context,
            prompt: buildLearningActionPrompt({ action, context }),
          })}
        >
          {LABELS[action]}
        </button>
      ))}
    </div>
  );
}

export default LearningActionBar;
