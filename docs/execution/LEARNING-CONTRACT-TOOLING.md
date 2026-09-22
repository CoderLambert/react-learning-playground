# Learning Contract Tooling — #316

The frozen contract is `docs/product/LEARNING-CONTRACT-V1.md`.

These tools validate that contract against the existing authoritative authoring surfaces. They do not create another lesson registry.

## Commands

```bash
npm run lessons:validate
npm run lessons:audit
npm run lessons:coverage
```

### `lessons:validate`

Fast human-readable validation.

Severity:

- `ERROR` — deterministic V1 invariant is broken. Exit code is non-zero.
- `WARN` — optional/recommended authoring is absent or unusual, but V1 remains valid.
- `REVIEW_REQUIRED` — semantic alignment cannot be proven mechanically. This does **not** fail the command.

The command is part of `npm run verify:required`.

### `lessons:audit`

Emits the full repository audit as JSON for migration matrices, CI artifacts, or review tooling.

### `lessons:coverage`

Prints compact coverage:

- structurally valid units;
- error / warning / review-required counts;
- semantic review coverage;
- Practice kinds;
- first-20 categories.

## Source of truth

The repository adapter derives lesson scope from `src/demos/index.js` and reads the existing:

- Single Learning Flow registry;
- concept model registry;
- Guided activity registry;
- canonical Assessment registry.

It must never become a second catalog.

## Duplicate ownership

Duplicate lesson authoring ownership is an `ERROR`.

This guard exists because Batch D exposed a real failure mode where duplicate object keys could silently overwrite earlier definitions.

## Semantic review

The five #315 representative lessons are currently marked semantically reviewed:

- `props`;
- `state-snapshot-queue`;
- `preserving-resetting-state`;
- `render-commit`;
- `use-effect-correct-usage`.

The other first-20 lessons intentionally remain `REVIEW_REQUIRED` until #317 performs the canary/full audit.

Do not auto-rewrite content to clear semantic review.

## #317 handoff

#317 must use these tools in this order:

```text
representative canary
→ classify any failures
→ stop on systemic errors
→ full first-20 audit
→ resolve explicit exceptions
→ governance close-out
```

A validator defect is fixed in tooling. A contract gap stops the rollout. A lesson-local content defect is handled only after classification.
