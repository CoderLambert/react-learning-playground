import {
  LEARNING_ACTION_KINDS,
  LEARNING_CONTEXT_KINDS,
  buildLearningActionPrompt,
  createLearningActionContext,
} from "../../learning-actions";

function focusedSourceText(code, locator) {
  if (typeof code !== "string" || !locator) return "";
  const lines = code.split("\n");
  return lines.slice(locator.startLine - 1, locator.endLine).join("\n");
}

export function createLocatorExplainAction({ learningUnit, source, locator } = {}) {
  if (!source?.name || !locator) return null;

  const context = createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit,
    fileName: source.name,
    range: {
      fileName: source.name,
      startLine: locator.startLine,
      endLine: locator.endLine,
    },
    semanticRegion: "visual-source-locator",
    selectedText: focusedSourceText(source.code, locator),
  });

  return Object.freeze({
    action: LEARNING_ACTION_KINDS.EXPLAIN,
    context,
    prompt: buildLearningActionPrompt({
      action: LEARNING_ACTION_KINDS.EXPLAIN,
      context,
    }),
  });
}
