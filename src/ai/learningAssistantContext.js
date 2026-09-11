export function adaptLearningContextForGateway(context) {
  if (!context || typeof context !== "object") {
    throw new TypeError("AI learning context is required");
  }

  const learningUnit = context.learningUnit || {};
  if (!learningUnit.id) {
    throw new TypeError("AI learning context requires a learning unit id");
  }

  const note = context.note?.available
    ? {
        name: context.note.fileName,
        content: context.note.content,
      }
    : null;

  const sources = Array.isArray(context.sources)
    ? context.sources.map((source) => ({
        name: source.name,
        code: source.numberedCode ?? source.code ?? "",
      }))
    : [];

  return {
    learningUnit: {
      id: learningUnit.id,
      title: learningUnit.title ?? "",
      category: learningUnit.category ?? "",
    },
    note,
    sources,
    activeSourceFile: context.activeSourceFile ?? "",
  };
}

export function buildCompletedChatHistory(messages = []) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => (
      (message?.role === "user" || message?.role === "assistant") &&
      typeof message?.content === "string" &&
      message.content.trim() &&
      !message.streaming &&
      !message.cancelled
    ))
    .map((message) => ({ role: message.role, content: message.content }));
}
