import assert from "node:assert/strict";
import test from "node:test";

import { cn } from "../src/lib/utils.js";

test("cn accepts the standard clsx string, array, object, and conditional inputs", () => {
  const shouldEmphasize = true;

  assert.equal(
    cn(
      "inline-flex",
      ["items-center", ["gap-2", false]],
      { "font-semibold": true, "line-through": false },
      shouldEmphasize && "text-sm",
    ),
    "inline-flex items-center gap-2 font-semibold text-sm",
  );
});

test("cn resolves conflicting Tailwind utilities in favor of the consumer value", () => {
  assert.equal(cn("px-2", "px-4"), "px-4");
  assert.equal(cn("bg-blue-500", [false, "bg-red-500"]), "bg-red-500");
});

test("cn merges project CSS-variable arbitrary-value utilities", () => {
  assert.equal(
    cn("bg-[var(--bg-surface)]", "bg-[var(--bg-surface-secondary)]"),
    "bg-[var(--bg-surface-secondary)]",
  );
  assert.equal(
    cn("text-[var(--text-muted)]", "text-[var(--text-main)]"),
    "text-[var(--text-main)]",
  );
});
