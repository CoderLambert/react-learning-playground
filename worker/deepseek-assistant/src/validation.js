export const LIMITS = Object.freeze({
  bodyBytes: 160_000,
  questionChars: 4_000,
  noteChars: 60_000,
  sourceFiles: 12,
  sourceCharsEach: 50_000,
  sourceCharsTotal: 120_000,
  summaryChars: 60_000,
  historyItems: 12,
  historyCharsEach: 8_000,
});

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function text(value, name, max) {
  if (typeof value !== "string") fail(`${name} must be a string`);
  const normalized = value.trim();
  if (!normalized) fail(`${name} is required`);
  if (normalized.length > max) fail(`${name} exceeds ${max} characters`, 413);
  return normalized;
}

export function assertContentLength(request) {
  const raw = request.headers.get("content-length");
  if (raw && Number(raw) > LIMITS.bodyBytes) fail("request body too large", 413);
}

export async function readJsonBody(request) {
  assertContentLength(request);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > LIMITS.bodyBytes) {
    fail("request body too large", 413);
  }

  try {
    return JSON.parse(raw);
  } catch {
    fail("invalid JSON body");
  }
}

export function validateRequest(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) fail("JSON object required");
  const question = text(payload.question, "question", LIMITS.questionChars);
  const context = payload.context;
  if (!context || typeof context !== "object" || Array.isArray(context)) fail("context object required");

  const learningUnit = context.learningUnit && typeof context.learningUnit === "object"
    ? {
        id: text(context.learningUnit.id, "context.learningUnit.id", 160),
        title: typeof context.learningUnit.title === "string" ? context.learningUnit.title.slice(0, 300) : "",
        category: typeof context.learningUnit.category === "string" ? context.learningUnit.category.slice(0, 160) : "",
      }
    : fail("context.learningUnit required");

  const note = context.note == null ? null : {
    name: text(context.note.name, "context.note.name", 240),
    content: text(context.note.content, "context.note.content", LIMITS.noteChars),
  };

  const rawSources = context.sources ?? [];
  if (!Array.isArray(rawSources)) fail("context.sources must be an array");
  if (rawSources.length > LIMITS.sourceFiles) fail(`too many source files; max ${LIMITS.sourceFiles}`, 413);
  let sourceTotal = 0;
  const sources = rawSources.map((source, index) => {
    if (!source || typeof source !== "object") fail(`context.sources[${index}] must be an object`);
    const name = text(source.name, `context.sources[${index}].name`, 240);
    const code = text(source.code, `context.sources[${index}].code`, LIMITS.sourceCharsEach);
    sourceTotal += code.length;
    return { name, code };
  });
  if (sourceTotal > LIMITS.sourceCharsTotal) fail(`source context exceeds ${LIMITS.sourceCharsTotal} characters`, 413);

  const activeSourceFile = typeof context.activeSourceFile === "string"
    ? context.activeSourceFile.slice(0, 240)
    : "";
  const conversationSummary = context.conversationSummary == null
    ? ""
    : text(context.conversationSummary, "context.conversationSummary", LIMITS.summaryChars);

  const rawHistory = payload.history ?? [];
  if (!Array.isArray(rawHistory)) fail("history must be an array");
  if (rawHistory.length > LIMITS.historyItems) fail(`history exceeds ${LIMITS.historyItems} messages`, 413);
  const history = rawHistory.map((item, index) => {
    if (!item || typeof item !== "object") fail(`history[${index}] must be an object`);
    if (item.role !== "user" && item.role !== "assistant") fail(`history[${index}].role must be user or assistant`);
    return { role: item.role, content: text(item.content, `history[${index}].content`, LIMITS.historyCharsEach) };
  });

  return {
    question,
    context: { learningUnit, note, sources, activeSourceFile, conversationSummary },
    history,
  };
}

export function jsonError(error) {
  return {
    status: Number.isInteger(error?.status) ? error.status : 500,
    body: { error: error?.status ? error.message : "internal server error" },
  };
}
