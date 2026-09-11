# Runtime Lessons status

## Scope

Owned lesson pairs:

- `src/content/notes/event-propagation.mdx` + `src/demos/EventPropagationDemo.jsx`
- `src/content/notes/event-vs-effect.mdx` + `src/demos/EventVsEffectDemo.jsx`
- `src/content/notes/state-snapshot-queue.mdx` + `src/demos/StateSnapshotQueueDemo.jsx`

Base inspected: `main` at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`.

## Completed

### Event propagation

- narrowed the lesson to event handler passing, event object semantics, capture/target/bubble, `stopPropagation`, and `preventDefault`;
- removed substantial Event-vs-Effect teaching from this lesson;
- changed the Demo so propagation and default behavior are independently observable with two switches;
- added the React-specific `onScroll` propagation exception to the Note;
- Note experiment now maps directly to Demo controls.

### Event vs Effect

- added a real A/B experiment instead of only describing the anti-pattern;
- direct Event path sends the command from the click handler;
- anti-pattern path uses `requested` state plus Effect, and changing `product` while the request is pending visibly re-runs the Effect command;
- retained a separate legitimate Effect example for external online-state synchronization;
- Note now explains the causal model and maps exactly to the Demo.

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

## Validation

Repository-level CI is expected to run on the task PR. No shared `package.json` or teaching-infrastructure files were modified in this branch.

## Remaining work

- inspect exact-head CI once the PR exists;
- fix only task-attributable lint/build/E2E failures;
- keep the PR open for review; do not merge.
