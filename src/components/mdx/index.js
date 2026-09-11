export const MDX_TEACHING_COMPONENT_NAMES = Object.freeze([
  "Callout",
  "MentalModel",
  "Concept",
  "Experiment",
  "Observation",
  "Compare",
  "Timeline",
  "Flow",
  "Boundary",
  "AntiPattern",
  "CodeBlock",
  "CodeDiff",
  "DemoReference",
  "Summary",
  "FurtherReading",
]);

export const MDX_TEACHING_COMPONENT_CONTRACT_VERSION = 1;

/**
 * F0 exports vocabulary only. The MDX Teaching Components worker owns the
 * implementations and styling. Note authors should use this approved set
 * instead of importing arbitrary presentation components from the app.
 */
export const MDX_TEACHING_COMPONENT_CONTRACT = Object.freeze(
  Object.fromEntries(MDX_TEACHING_COMPONENT_NAMES.map((name) => [name, null])),
);
