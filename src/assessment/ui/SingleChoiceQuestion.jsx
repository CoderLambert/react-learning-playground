import { cn } from "../../lib/utils.js";
import MarkdownRender from "markstream-react";
import "markstream-react/index.css";

function optionMarker(index) {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

export function SingleChoiceQuestion({
  question,
  value = "",
  feedback = null,
  onChange,
  disabled = false,
}) {
  const revealAnswer = Boolean(feedback);

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={revealAnswer ? `${question.id}-explanation` : undefined}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend className="w-full p-0 text-[17px] font-semibold leading-7 text-[var(--text-main)]">
        <MarkdownRender
          content={question.content.prompt}
          final
          htmlPolicy="escape"
        />
      </legend>
      <div className="mt-5 space-y-3">
        {question.content.options.map((option, index) => {
          const selected = value === option.id;
          const correct =
            revealAnswer && option.id === question.content.correctOptionId;
          const incorrect = revealAnswer && selected && !correct;
          return (
            <label
              key={option.id}
              className={cn(
                "relative block",
                disabled ? "cursor-default" : "cursor-pointer",
              )}
            >
              <input
                type="radio"
                className={cn(
                  "peer absolute inset-0 z-10 m-0 h-full w-full opacity-0",
                  disabled ? "cursor-default" : "cursor-pointer",
                )}
                name={`assessment-${question.id}`}
                value={option.id}
                aria-label={option.text}
                checked={selected}
                onChange={() => onChange?.(option.id)}
              />
              <span
                className={cn(
                  "pointer-events-none flex min-h-[52px] w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left text-sm leading-6 transition-all duration-150",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2",
                  "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)]",
                  !disabled &&
                    "peer-hover:border-[var(--color-primary)]/40 peer-hover:bg-[var(--bg-surface-secondary)] peer-hover:shadow-sm",
                  selected &&
                    !revealAnswer &&
                    "border-[var(--color-primary)] bg-[var(--color-primary-light)] shadow-sm",
                  correct &&
                    "border-[var(--color-success-border)] bg-[var(--color-success-light)] shadow-sm",
                  incorrect &&
                    "border-[var(--color-danger-border)] bg-[var(--color-danger-light)]",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-150",
                    selected && !revealAnswer
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--border-hover)] bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]",
                    correct &&
                      "border-[var(--color-success)] bg-[var(--color-success)] text-white",
                    incorrect &&
                      "border-[var(--color-danger)] bg-[var(--color-danger)] text-white",
                  )}
                  aria-hidden="true"
                >
                  {correct ? "✓" : incorrect ? "✕" : optionMarker(index)}
                </span>
                <span className="min-w-0 flex-1 break-words leading-6">
                  {option.text}
                </span>
                {correct && (
                  <span className="ml-1 shrink-0 rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-success-text)]">
                    正确答案
                  </span>
                )}
                {incorrect && (
                  <span className="ml-1 shrink-0 rounded-full bg-[var(--color-danger)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-danger-text)]">
                    你的选择
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default SingleChoiceQuestion;
