import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-hover)]",
        secondary: "bg-[var(--bg-surface-secondary)] text-[var(--text-main)] hover:bg-[var(--bg-surface-tertiary)]",
        outline: "border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-secondary)]",
        ghost: "text-[var(--text-muted)] hover:bg-[var(--bg-surface-secondary)] hover:text-[var(--text-main)]",
        destructive: "bg-[var(--color-danger)] text-white hover:brightness-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const Button = forwardRef(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonVariants({ variant, size }),
        className,
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";
