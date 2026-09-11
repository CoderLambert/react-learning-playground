export {
  CHAT_EVENT_TYPES,
  CHAT_LIMITS,
  CHAT_STATUS,
  buildChatRequest,
  normalizeChatEvent,
  normalizeHistory,
  serializeContext,
} from "./contracts.js";
export { INITIAL_CHAT_STATE, chatReducer } from "./chatReducer.js";
export {
  AI_ASSISTANT_MAX_OUTPUT_CHARS,
  appendWithinOutputLimit,
  countUnicodeCharacters,
  createUnicodeOutputLimiter,
} from "./outputLimit.js";
export { ChatStreamParser, parseChatEventStream } from "./streamProtocol.js";
export {
  AiChatAbortError,
  AiChatClientError,
  createAiChatClient,
  getConfiguredAiAssistantUrl,
} from "./chatClient.js";
export {
  DEEPSEEK_BROWSER_STORAGE_KEYS,
  DEEPSEEK_MODELS,
  DEEPSEEK_OPENAI_BASE_URL,
  DEFAULT_DEEPSEEK_MODEL,
  clearDeepSeekBrowserApiKey,
  loadDeepSeekBrowserSettings,
  normalizeDeepSeekModel,
  saveDeepSeekBrowserSettings,
} from "./deepseekBrowserSettings.js";
export {
  buildDeepSeekDirectMessages,
  createDeepSeekDirectClient,
  parseDeepSeekOpenAiStream,
} from "./deepseekDirectClient.js";
export { AI_LEARNING_ASSISTANT_SYSTEM_PROMPT } from "./assistantSystemPrompt.js";
export { AI_FINISH_REASONS, normalizeFinishReason } from "./finishReason.js";
export {
  DEFAULT_MODEL_CONTEXT,
  MODEL_CONTEXTS,
  getModelContextMetadata,
} from "./context/modelMetadata.js";
export {
  estimateMessagesTokens,
  estimateTextTokens,
  calibrateTokenEstimate,
} from "./context/tokenEstimator.js";
export {
  CONTEXT_CATEGORIES,
  buildContextBudget,
  selectContextWithinBudget,
} from "./context/contextBudget.js";
export {
  SUMMARY_CONTRACT_VERSION,
  createCompactionService,
  createEmptySummary,
  normalizeStructuredSummary,
  REDACTED_SECRET,
  sanitizeCompactionText,
  serializeStructuredSummary,
  shouldAutoCompact,
} from "./compaction/compactionService.js";
