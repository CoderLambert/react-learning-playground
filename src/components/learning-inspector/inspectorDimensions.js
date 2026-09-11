import { WORKBENCH_DIMENSIONS } from "../../workbench/constants";

function getInspectorMaxWidth(viewportWidth) {
  const viewportBound = Math.floor(
    viewportWidth * WORKBENCH_DIMENSIONS.inspectorMaxViewportRatio,
  );

  return Math.max(
    WORKBENCH_DIMENSIONS.inspectorMinWidth,
    Math.min(WORKBENCH_DIMENSIONS.inspectorMaxWidth, viewportBound),
  );
}

export function clampInspectorWidth(width, viewportWidth = 1440) {
  const maxWidth = getInspectorMaxWidth(viewportWidth);
  return Math.min(
    maxWidth,
    Math.max(WORKBENCH_DIMENSIONS.inspectorMinWidth, Math.round(width)),
  );
}
