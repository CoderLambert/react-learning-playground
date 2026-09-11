import { DEFAULT_INSPECTOR_STATE, INSPECTOR_TABS } from "../../workbench/constants";

export const LEARNING_INSPECTOR_CONTRACT_VERSION = 1;

export const LEARNING_INSPECTOR_CONTRACT = Object.freeze({
  tabs: INSPECTOR_TABS,
  defaultState: DEFAULT_INSPECTOR_STATE,
  requiredProps: Object.freeze([
    "learningUnit",
    "state",
    "onTabChange",
    "onOpenChange",
    "onFocusModeChange",
    "onWidthChange",
    "onSourceFileChange",
  ]),
});

export { LearningInspector, clampInspectorWidth } from "./LearningInspector";
export { useInspectorScrollMemory } from "./useInspectorScrollMemory";
export { DEFAULT_INSPECTOR_STATE, INSPECTOR_TABS };
