import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-primary-light)] text-[var(--color-primary)]",
        secondary: "border-transparent bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]",
        outline: "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)]",
        success: "border-[var(--color-success-border)] bg-[var(--color-success-light)] text-[var(--color-success-text)]",
        warning: "border-[var(--color-warning-border)] bg-[var(--color-warning-light)] text-[var(--color-warning-text)]",
        destructive: "border-[var(--color-danger-border)] bg-[var(--color-danger-light)] text-[var(--color-danger-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const Badge = forwardRef(function Badge({ className, variant = "default", ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        badgeVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";
