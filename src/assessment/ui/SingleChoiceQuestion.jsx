import { cn } from "../../lib/utils.js";

function optionMarker(index) {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

export function SingleChoiceQuestion({ question, value = "", feedback = null, onChange, disabled = false }) {
  const revealAnswer = Boolean(feedback);

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={revealAnswer ? `${question.id}-explanation` : undefined}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend className="w-full p-0 text-[17px] font-semibold leading-7 text-[var(--text-main)]">
        {question.content.prompt}
      </legend>
      <div className="mt-4 space-y-2.5">
        {question.content.options.map((option, index) => {
          const selected = value === option.id;
          const correct = revealAnswer && option.id === question.content.correctOptionId;
          const incorrect = revealAnswer && selected && !correct;
          return (
            <label key={option.id} className={cn("block", disabled ? "cursor-default" : "cursor-pointer")}>
              <input
                type="radio"
                className="peer sr-only"
                name={`assessment-${question.id}`}
                value={option.id}
                aria-label={option.text}
                checked={selected}
                onChange={() => onChange?.(option.id)}
              />
              <span
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm leading-6 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2",
                  "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)]",
                  !disabled && "hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-secondary)]",
                  selected && !revealAnswer && "border-[var(--color-primary)] bg-[var(--color-primary-light)]",
                  correct && "border-[var(--color-success-border)] bg-[var(--color-success-light)]",
                  incorrect && "border-[var(--color-danger-border)] bg-[var(--color-danger-light)]",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold",
                    selected && !revealAnswer
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--border-hover)] bg-[var(--bg-surface)] text-[var(--text-muted)]",
                    correct && "border-[var(--color-success)] bg-[var(--color-success)] text-white",
                    incorrect && "border-[var(--color-danger)] bg-[var(--color-danger)] text-white",
                  )}
                  aria-hidden="true"
                >
                  {correct ? "✓" : incorrect ? "×" : optionMarker(index)}
                </span>
                <span className="min-w-0 flex-1 break-words">{option.text}</span>
                {correct && <span className="shrink-0 text-[11px] font-semibold text-[var(--color-success-text)]">正确答案</span>}
                {incorrect && <span className="shrink-0 text-[11px] font-semibold text-[var(--color-danger-text)]">你的选择</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default SingleChoiceQuestion;
