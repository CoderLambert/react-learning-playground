# State Design Lessons Status

Branch: `automation/state-design-lessons`
PR: `#78` (draft, do not merge yet)
Base: current `main` at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
Validated lesson head before this status-only commit: `0e18aafd626906e79b227402e2cb3301f997c94e`

## Scope

Primary ownership:

- `src/content/notes/controlled-uncontrolled.mdx`
- `src/demos/ControlledUncontrolledDemo.jsx`
- `src/content/notes/state-dry.mdx`
- `src/demos/StateDryDemo.jsx`

Adjacent ownership lessons inspected in this pass:

- `src/content/notes/lifting-state-up.mdx`
- `src/content/notes/preserving-resetting-state.mdx`

## Teaching rules

- Do not force every note into the same MDX template.
- Center Demo must produce an observable phenomenon; the Note explains why it happens.
- Every experiment claimed by a Note must be executable in the corresponding Demo.
- Prefer precise React 19.2 semantics over slogans.
- End with a usable project decision rule, not only API summary.

## Completed

### Controlled / Uncontrolled

Updated both Note and Demo around the more precise question: **who has authority over this state?**

Changes:

- `onChange(next)` is presented as intent / notification, not as a guaranteed setter.
- `value` is presented as the authoritative current value in controlled mode.
- Added an executable parent-rejection experiment: the child requests `settings`, while the parent can reject it and keep the UI unchanged.
- Added parent-driven reset to make external control observable.
- Added an uncontrolled `defaultValue` experiment: changing `defaultValue` after mount does not overwrite current internal state; remounting with a new key re-applies the current default.
- Explicitly separated component-level ownership from native form element ownership.
- Clarified that controlled/uncontrolled applies to a particular piece of information, not as a permanent binary label for the entire component.
- Added project decision guidance for coordination, URL state, validation/rejection/reset, and local-only UI state.

Primary references:

- https://react.dev/learn/sharing-state-between-components
- https://react.dev/reference/react-dom/components/input

### State structure / single source of truth

Reworked the Demo so the learner can create the failure modes instead of only reading bad-code snippets.

Executable experiments now cover:

1. **Redundant derived state** — `storedFullName` can become stale when `firstName` / `lastName` changes without a matching manual sync. `derivedFullName` cannot represent that inconsistency.
2. **Contradictory booleans** — the learner can set `isSending=true` and `isSent=true` simultaneously and compare that invalid combination with one `status` value.
3. **Duplicated entity objects** — `selectedCopy` becomes stale when the canonical cart item changes; `selectedId -> cartItems.find(...)` continues to read the current entity.
4. **Normalization boundary** — retained as a separate example, with wording clarified that flattening is useful when deep updates/shared identity make the nested model costly, not as a universal rule.

The rewritten Note explains the deeper reason: every duplicated fact introduces another invariant that all future update paths must maintain. Reducing redundant state shrinks the set of representable invalid states; it is a correctness property, not merely a DRY preference.

Primary references:

- https://react.dev/learn/choosing-the-state-structure
- https://react.dev/learn/you-might-not-need-an-effect

### Adjacent lesson: Lifting State Up

Found a real Note/Demo mismatch: the previous Note asked the learner to compare “independent local state” with “lifted state”, but the existing Demo only implements the correct lifted-state model.

Adjusted the Note to match the actual experiment:

- `query` is the one authoritative fact owned by the parent.
- `SearchBox` reports intent through `onChange`.
- `SearchSummary` and `FrameworkList` consume the same parent fact/derivations.
- The experiment now asks the learner to type/clear a query and observe all consumers update from one owner instead of pretending the Demo contains a second broken implementation.
- Connected lifting-state semantics to the controlled-component authority model without duplicating the controlled/uncontrolled lesson.
- Added a boundary against lifting local state higher than the real coordination scope.

Primary reference:

- https://react.dev/learn/sharing-state-between-components

### Adjacent lesson: Preserving / Resetting State

The existing Demo is already strong: it directly compares a Chat at the same position/type with a keyed Chat. The previous Note, however, described “changing the key strategy” as if the learner toggled a strategy in one experiment.

Adjusted the Note to match the actual two-region Demo and strengthened the ownership connection:

- Upper experiment: same parent position + same component type preserves `draft` while contact props change.
- Lower experiment: `key={contact.id}` gives different contacts different component identity, resetting local `draft`.
- Clarified that key expresses identity; it is not a generic “force refresh” mechanism.
- Added the important product boundary: if each contact should retain its own draft, the solution is usually to move ownership to a keyed draft collection rather than resetting everything.
- Kept the warning against unstable/random keys and nested component definitions.

Primary reference:

- https://react.dev/learn/preserving-and-resetting-state

## Validation state

The latest lesson/code head before this status-only documentation commit was `0e18aafd626906e79b227402e2cb3301f997c94e`.

Exact-head GitHub Actions results:

- `React Learning Verify` run `141`: **success**
- `Workbench Integration Verify` run `80`: **success**

`main` is still `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`, so the PR base has not advanced during this pass.

No CI failure needs task-attributable remediation. The final code/content diff remains limited to this task's primary lesson files, the two directly adjacent ownership notes, and this execution-status document; shared `package.json` and teaching infrastructure were not modified.

## Remaining work

No additional concrete state-ownership/content gap was found after the primary and adjacent lesson pass. Leave PR #78 as a draft for human review and do not merge it. Future runs should only resume substantive editing if `main` materially changes these lessons, review feedback identifies a real issue, or latest-head CI regresses for a task-attributable reason.
