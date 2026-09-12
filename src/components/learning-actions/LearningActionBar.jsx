import "./LearningActionBar.css";

export function LearningActionBar({
  label = "AI 学习动作",
  actions = [],
  compact = false,
  className = "",
}) {
  const visible = actions.filter((action) => action && typeof action.onSelect === "function");
  if (!visible.length) return null;

  return (
    <div
      className={`learning-action-bar ${compact ? "is-compact" : ""} ${className}`.trim()}
      role="group"
      aria-label={label}
    >
      <span className="learning-action-bar__label" aria-hidden="true">✦ AI</span>
      <div className="learning-action-bar__actions">
        {visible.map((action) => (
          <button
            key={action.id}
            type="button"
            className="learning-action-bar__button"
            onClick={action.onSelect}
            title={action.title ?? action.label}
            disabled={action.disabled}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LearningActionBar;
