import { forwardRef } from "react";
import { cn } from "../../lib/utils.js";

export const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm", className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

export const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />;
});
CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />;
});
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />;
});
CardFooter.displayName = "CardFooter";
