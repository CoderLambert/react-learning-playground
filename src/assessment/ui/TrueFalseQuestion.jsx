import { cn } from "../../lib/utils.js";

const OPTIONS = Object.freeze([
  { value: true, label: "正确", marker: "T" },
  { value: false, label: "错误", marker: "F" },
]);

export function TrueFalseQuestion({ question, value = null, feedback = null, onChange, disabled = false }) {
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
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          const correct = revealAnswer && option.value === question.content.correct;
          const incorrect = revealAnswer && selected && !correct;
          return (
            <label key={String(option.value)} className={cn("block", disabled ? "cursor-default" : "cursor-pointer")}>
              <input
                type="radio"
                className="peer sr-only"
                name={`assessment-${question.id}`}
                value={String(option.value)}
                checked={selected}
                onChange={() => onChange?.(option.value)}
              />
              <span
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-sm font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2",
                  "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)]",
                  !disabled && "hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-secondary)]",
                  selected && !revealAnswer && "border-[var(--color-primary)] bg-[var(--color-primary-light)]",
                  correct && "border-[var(--color-success-border)] bg-[var(--color-success-light)] text-[var(--color-success-text)]",
                  incorrect && "border-[var(--color-danger-border)] bg-[var(--color-danger-light)] text-[var(--color-danger-text)]",
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
                  {correct ? "✓" : incorrect ? "×" : option.marker}
                </span>
                <span className="flex-1">{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default TrueFalseQuestion;
