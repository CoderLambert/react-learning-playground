const CHECKPOINT_BY_DEMO_ID = {
  "prop-drilling": 1,
  "render-commit": 2,
  "use-reduce-with-context": 3,
  "advanced-ref": 4,
  "optimistic-update": 5,
  "transition-deferred": 6,
  "react-compiler": 7,
  "portal-third-party": 8,
  "server-state-mutation": 9,
  "route-data-boundary": 10,
  "typescript-react": 11,
  "server-functions-framework": 12,
};

export function getCheckpointChapter(demoId) {
  return CHECKPOINT_BY_DEMO_ID[demoId] ?? null;
}
