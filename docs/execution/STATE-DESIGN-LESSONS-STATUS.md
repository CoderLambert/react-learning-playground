# State Design Lessons Status

Branch: `automation/state-design-lessons`

## Scope

Primary ownership:

- `src/content/notes/controlled-uncontrolled.mdx`
- `src/demos/ControlledUncontrolledDemo.jsx`
- `src/content/notes/state-dry.mdx`
- `src/demos/StateDryDemo.jsx`

Then inspect directly adjacent state-ownership lessons (`lifting-state-up`, `preserving-resetting-state`) for concrete gaps.

## Teaching rules

- Do not force every note into the same MDX template.
- Center Demo must produce an observable phenomenon; the Note explains why it happens.
- Every experiment claimed by a Note must be executable in the corresponding Demo.
- Prefer precise React 19.2 semantics over slogans.
- End with a usable project decision rule, not only API summary.

## Completed in first pass

### Controlled / Uncontrolled

Updated both Note and Demo around the more precise question: **who has authority over this state?**

Changes:

- `onChange(next)` is presented as intent / notification, not as a guaranteed setter.
- `value` is presented as the authoritative current value in controlled mode.
- Added an executable parent-rejection experiment: the child requests `settings`, while the parent can reject it and keep the UI unchanged.
- Added parent-driven reset to make external control observable.
- Added an uncontrolled `defaultValue` experiment: changing `defaultValue` after mount does not overwrite current internal state; remounting with a new key re-applies the current default.
- Explicitly separated component-level ownership from native form element ownership. A custom uncontrolled component may store state in React State; an uncontrolled native input/select mainly leaves its current value in the DOM.
- Clarified that controlled/uncontrolled is not a permanent binary label for an entire component; different pieces of information in the same component may be controlled or internal.
- Added project decision guidance for coordination, URL state, validation/rejection/reset, and local-only UI state.

Primary factual references checked against current React documentation:

- https://react.dev/learn/sharing-state-between-components
- https://react.dev/reference/react-dom/components/input

## Next work

1. Make `state-dry` failure modes executable rather than displaying bad code only.
2. Let the learner intentionally create duplicate/contradictory state and observe inconsistency before comparing with derived/single-source models.
3. Explain redundant State as expansion of the representable invalid-state space.
4. Inspect adjacent lifting/reset lessons once primary files are strong.

## Validation

No local PASS claim is made from this automation environment. The branch should be validated by repository CI after opening/updating the PR; follow-up runs should inspect CI before declaring completion.
