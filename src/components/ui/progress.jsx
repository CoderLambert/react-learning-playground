import { cn } from "../../lib/utils.js";

export function Progress({ value = 0, max = 100, className, ...props }) {
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), normalizedMax);
  const percentage = (normalizedValue / normalizedMax) * 100;

  return (
    <div
      {...props}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={normalizedMax}
      aria-valuenow={normalizedValue}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-tertiary)]", className)}
    >
      <div
        className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
