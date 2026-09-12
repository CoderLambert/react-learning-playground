# Runtime Lessons status

## Scope

Owned lesson pairs:

- `src/content/notes/event-propagation.mdx` + `src/demos/EventPropagationDemo.jsx`
- `src/content/notes/event-vs-effect.mdx` + `src/demos/EventVsEffectDemo.jsx`
- `src/content/notes/state-snapshot-queue.mdx` + `src/demos/StateSnapshotQueueDemo.jsx`

Base inspected: `main` at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`.
PR: `#82` (`automation/runtime-lessons` -> `main`, draft, do not merge automatically).

## Completed

### Event propagation

- narrowed the lesson to event handler passing, event object semantics, capture/target/bubble, `stopPropagation`, and `preventDefault`;
- removed substantial Event-vs-Effect teaching from this lesson;
- changed the Demo so propagation and default behavior are independently observable with two switches;
- added the React-specific `onScroll` propagation exception to the Note;
- Note experiment maps directly to Demo controls.

### Event vs Effect

- added a real A/B experiment instead of only describing the anti-pattern;
- direct Event path sends the command from the click handler;
- anti-pattern path uses `requested` state plus Effect, and changing `product` while the request is pending visibly re-runs the Effect command;
- retained a separate legitimate Effect example for external online-state synchronization;
- Note explains the causal model and maps exactly to the Demo.

### State Snapshot / Update Queue

- replaced the limited `+1`/`+3` illustration with a queue debugger;
- added four scenarios: Replace × 3, Updater × 3, Replace + Updater, Replace + Updater + Replace 42;
- exposes current handler snapshot, ordered queue steps, and predicted next render state;
- replaced the vague “setState is async” slogan with the snapshot / pending queue / next render model;
- documented updater purity and Strict Mode development checks.

## Factual baseline

Reviewed against current official React documentation:

- Responding to Events
- Separating Events from Effects
- State as a Snapshot
- Queueing a Series of State Updates
- Render and Commit

## Final validation

The lesson-content head `5ae77f4e92d4bb6b1ddf16586726ab18d6e8db47` was validated by both repository workflows:

- `React Learning Verify` run 145: **success**
- `Workbench Integration Verify` run 84: **success**

Final scope review of PR #82 shows exactly seven changed files: the six owned Note/Demo files plus this status document. No shared `package.json`, teaching infrastructure, registry, or unrelated lesson files are changed.

`main` remained at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948` during final validation, so there is no base drift requiring another content pass.

## Completion state

The runtime-mechanism lesson task is complete for its defined scope. Leave PR #82 open as a draft for human review and do not merge automatically. Re-open this work only if review identifies a concrete issue, `main` materially changes the relevant contracts, or CI regresses for a task-attributable reason.
