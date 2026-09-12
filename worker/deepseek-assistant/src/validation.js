export const LIMITS = Object.freeze({
  bodyBytes: 160_000,
  questionChars: 4_000,
  compactionPromptChars: 120_000,
  noteChars: 60_000,
  sourceFiles: 12,
  sourceCharsEach: 50_000,
  sourceCharsTotal: 120_000,
  summaryChars: 60_000,
  historyItems: 12,
  historyCharsEach: 8_000,
  modelMessages: 64,
  modelMessageChars: 120_000,
  toolDefinitions: 32,
  toolNameChars: 160,
  toolDescriptionChars: 4_000,
  toolArgumentsChars: 24_000,
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

function content(value, name, max, { allowEmpty = false } = {}) {
  if (typeof value !== "string") fail(`${name} must be a string`);
  if (!allowEmpty && !value.trim()) fail(`${name} is required`);
  if (value.length > max) fail(`${name} exceeds ${max} characters`, 413);
  return value;
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

function validateContext(context) {
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

  return { learningUnit, note, sources, activeSourceFile, conversationSummary };
}

function plainObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`);
  return value;
}

function validateModelToolCall(value, index) {
  const call = plainObject(value, `messages tool call[${index}]`);
  const rawArguments = plainObject(call.arguments, `messages tool call[${index}].arguments`);
  const serializedArguments = JSON.stringify(rawArguments);
  if (serializedArguments.length > LIMITS.toolArgumentsChars) {
    fail(`messages tool call[${index}].arguments exceeds ${LIMITS.toolArgumentsChars} characters`, 413);
  }
  return {
    id: text(call.id, `messages tool call[${index}].id`, 240),
    name: text(call.name, `messages tool call[${index}].name`, LIMITS.toolNameChars),
    arguments: rawArguments,
  };
}

function validateModelMessage(value, index) {
  const message = plainObject(value, `messages[${index}]`);
  const role = message.role;
  if (!["system", "user", "assistant", "tool"].includes(role)) {
    fail(`messages[${index}].role is unsupported`);
  }

  if (role === "tool") {
    return {
      role,
      toolCallId: text(message.toolCallId ?? message.tool_call_id, `messages[${index}].toolCallId`, 240),
      content: content(message.content, `messages[${index}].content`, LIMITS.modelMessageChars, { allowEmpty: true }),
    };
  }

  const rawToolCalls = message.toolCalls ?? message.tool_calls;
  if (rawToolCalls !== undefined && !Array.isArray(rawToolCalls)) {
    fail(`messages[${index}].toolCalls must be an array`);
  }
  const toolCalls = (rawToolCalls ?? []).map(validateModelToolCall);
  const messageContent = message.content == null && toolCalls.length
    ? ""
    : content(message.content, `messages[${index}].content`, LIMITS.modelMessageChars, {
      allowEmpty: role === "assistant",
    });
  return {
    role,
    content: messageContent,
    ...(toolCalls.length ? { toolCalls } : {}),
  };
}

function validateToolChoice(value) {
  if (typeof value === "string") {
    if (!["auto", "none", "required"].includes(value)) fail("toolChoice is unsupported");
    return value;
  }
  const choice = plainObject(value, "toolChoice");
  return { ...choice };
}

function validateModelTool(value, index) {
  const tool = plainObject(value, `tools[${index}]`);
  const inputSchema = plainObject(tool.inputSchema ?? tool.parameters, `tools[${index}].inputSchema`);
  return {
    name: text(tool.name, `tools[${index}].name`, LIMITS.toolNameChars),
    description: typeof tool.description === "string"
      ? tool.description.slice(0, LIMITS.toolDescriptionChars)
      : "",
    inputSchema,
  };
}

export function validateModelTurnRequest(payload) {
  plainObject(payload, "JSON object");
  if (payload.type !== undefined && payload.type !== "model_turn") fail("unsupported request type");
  if (payload.purpose !== undefined && !["chat", "compaction"].includes(payload.purpose)) {
    fail("unsupported model turn purpose");
  }
  const purpose = payload.purpose === "compaction" ? "compaction" : "chat";
  const rawMessages = payload.messages;
  if (!Array.isArray(rawMessages) || !rawMessages.length) fail("messages must be a non-empty array");
  if (rawMessages.length > LIMITS.modelMessages) {
    fail(`messages exceeds ${LIMITS.modelMessages} messages`, 413);
  }
  const messages = rawMessages.map(validateModelMessage);
  const rawTools = payload.tools ?? [];
  if (!Array.isArray(rawTools)) fail("tools must be an array");
  if (rawTools.length > LIMITS.toolDefinitions) {
    fail(`tools exceeds ${LIMITS.toolDefinitions} definitions`, 413);
  }
  const tools = rawTools.map(validateModelTool);

  if (purpose === "compaction") {
    if (tools.length || Object.hasOwn(payload, "toolChoice")) {
      fail("compaction model turn must disable tools and omit toolChoice");
    }
    if (messages.some((message) => message.role === "tool" || message.toolCalls?.length)) {
      fail("compaction model turn cannot execute or continue tools");
    }
  }

  return {
    type: "model_turn",
    purpose,
    messages,
    tools,
    ...(Object.hasOwn(payload, "toolChoice") ? { toolChoice: validateToolChoice(payload.toolChoice) } : {}),
  };
}

export function validateRequest(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) fail("JSON object required");
  if (payload.type === "model_turn" || Array.isArray(payload.messages)) {
    return validateModelTurnRequest(payload);
  }
  const purpose = payload.purpose === "compaction" ? "compaction" : "chat";
  const context = validateContext(payload.context);

  if (purpose === "compaction") {
    if (Object.hasOwn(payload, "tools") || Object.hasOwn(payload, "toolCalls") || Object.hasOwn(payload, "toolChoice")) {
      fail("compaction payload cannot contain tool execution fields");
    }
    if (!payload.compaction || typeof payload.compaction !== "object" || Array.isArray(payload.compaction)) {
      fail("compaction object required");
    }
    const prompt = text(payload.compaction.prompt, "compaction.prompt", LIMITS.compactionPromptChars);
    return {
      purpose,
      context,
      compaction: { prompt },
      history: [],
    };
  }

  const question = text(payload.question, "question", LIMITS.questionChars);
  const rawHistory = payload.history ?? [];
  if (!Array.isArray(rawHistory)) fail("history must be an array");
  if (rawHistory.length > LIMITS.historyItems) fail(`history exceeds ${LIMITS.historyItems} messages`, 413);
  const history = rawHistory.map((item, index) => {
    if (!item || typeof item !== "object") fail(`history[${index}] must be an object`);
    if (item.role !== "user" && item.role !== "assistant") fail(`history[${index}].role must be user or assistant`);
    return { role: item.role, content: text(item.content, `history[${index}].content`, LIMITS.historyCharsEach) };
  });

  return {
    purpose,
    question,
    context,
    history,
  };
}

export function jsonError(error) {
  return {
    status: Number.isInteger(error?.status) ? error.status : 500,
    body: { error: error?.status ? error.message : "internal server error" },
  };
}
