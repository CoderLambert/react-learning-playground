import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { loadRawNote } from "../workbench/noteRegistry.js";
import { AI_LEARNING_ASSISTANT_SYSTEM_PROMPT } from "./assistantSystemPrompt.js";
import { createCompactionService } from "./compaction/compactionService.js";
import { ConversationRepository, StreamingMessagePersister, createConversationStore } from "./conversations/index.js";
import { buildContextBudget, selectContextWithinBudget } from "./context/contextBudget.js";
import { buildAiContext } from "./contextBuilder.js";
import { AiChatAbortError, createAiChatClient } from "./chatClient.js";
import { INITIAL_CHAT_STATE, chatReducer } from "./chatReducer.js";
import { CHAT_EVENT_TYPES, CHAT_LIMITS, CHAT_STATUS } from "./contracts.js";
import {
  clearDeepSeekBrowserApiKey,
  loadDeepSeekBrowserSettings,
  saveDeepSeekBrowserSettings,
} from "./deepseekBrowserSettings.js";
import { createDeepSeekDirectClient } from "./deepseekDirectClient.js";
import { normalizeFinishReason } from "./finishReason.js";
import {
  adaptLearningContextForGateway,
  buildCompletedChatHistory,
} from "./learningAssistantContext.js";
import { createUnicodeOutputLimiter } from "./outputLimit.js";
import { createToolExecutionContext } from "./agent/agentContracts.js";
import { MODEL_TURN_EVENT_TYPES } from "./providers/modelClient.js";

const GATEWAY_TRANSPORT_INPUT_CAP_TOKENS = 24 * 1024;

function createRequestId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function stripJsonFence(value) {
  const text = String(value ?? "").trim();
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

function normalizeUsage(usage) {
  if (!usage || typeof usage !== "object") return null;
  return {
    inputTokens: Number(usage.inputTokens ?? usage.prompt_tokens) || 0,
    outputTokens: Number(usage.outputTokens ?? usage.completion_tokens) || 0,
    totalTokens: Number(usage.totalTokens ?? usage.total_tokens) || 0,
  };
}

function buildAgentMessages({ question, context, history = [] }) {
  const material = [
    "<learning_material>",
    JSON.stringify(context, null, 2),
    "</learning_material>",
    "",
    "<question>",
    question,
    "</question>",
  ].join("\n");
  return [
    { role: "system", content: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT },
    ...history
      .filter((message) => (
        (message?.role === "user" || message?.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
      ))
      .map(({ role, content }) => ({ role, content })),
    { role: "user", content: material },
  ];
}

function shouldUseAssessmentAgent(question) {
  const normalized = String(question ?? "");
  return /assessment_(?:list|create|update|retire)_questions?/i.test(normalized)
    || /(?:出题|评测题|测验题|练习题)/.test(normalized);
}

export function useAiLearningAssistant({ learningUnit, activeSourceFile, assessmentRuntime = null } = {}) {
  const [chatState, dispatch] = useReducer(chatReducer, INITIAL_CHAT_STATE);
  const [inputValue, setInputValue] = useState("");
  const [deepSeekSettings, setDeepSeekSettings] = useState(() => loadDeepSeekBrowserSettings());
  const [noteState, setNoteState] = useState({
    learningUnitId: null,
    rawNote: null,
    loading: false,
    error: null,
  });
  const [repository, setRepository] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationStorage, setConversationStorage] = useState({ mode: "initializing", reason: null });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [latestCompaction, setLatestCompaction] = useState(null);
  const [compactedMessageCount, setCompactedMessageCount] = useState(0);
  const [compacting, setCompacting] = useState(false);
  const [compactionNotice, setCompactionNotice] = useState(null);
  const [contextSelectionNotice, setContextSelectionNotice] = useState(null);
  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(null);
  const compactionPromiseRef = useRef(null);
  const hydrationRequestRef = useRef(0);
  const gatewayClient = useMemo(() => createAiChatClient(), []);
  const directClient = useMemo(() => createDeepSeekDirectClient({
    apiKey: deepSeekSettings.apiKey,
    model: deepSeekSettings.model,
  }), [deepSeekSettings.apiKey, deepSeekSettings.model]);
  const client = directClient.configured ? directClient : gatewayClient;
  const agentRunner = useMemo(() => {
    if (!assessmentRuntime?.createAgentRunner || typeof client?.streamTurn !== "function") return null;
    return assessmentRuntime.createAgentRunner(client);
  }, [assessmentRuntime, client]);
  const connectionMode = directClient.configured
    ? "browser"
    : gatewayClient.configured
      ? "gateway"
      : "unconfigured";
  const contextModelId = connectionMode === "browser"
    ? deepSeekSettings.model
    : "gateway-model-unknown";
  const learningUnitId = learningUnit?.id ?? null;

  const refreshConversations = useCallback(async (repo = repository) => {
    if (!repo) return [];
    const next = await repo.listConversations({ includeArchived: true });
    setConversations(next);
    return next;
  }, [repository]);

  useEffect(() => {
    let cancelled = false;
    void createConversationStore().then(async (store) => {
      const repo = new ConversationRepository(store);
      await repo.recoverInterruptedMessages();
      if (cancelled) return;
      setRepository(repo);
      setConversationStorage({ mode: store.mode, reason: store.fallbackReason ?? null });
      setConversations(await repo.listConversations({ includeArchived: true }));
    });
    return () => { cancelled = true; };
  }, []);

  const hydrateConversation = useCallback(async (conversationId) => {
    const hydrationRequest = ++hydrationRequestRef.current;
    const activeRequestId = activeRequestIdRef.current;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    if (activeRequestId) dispatch({ type: "cancel", requestId: activeRequestId });
    if (!repository || !conversationId) {
      dispatch({ type: "hydrate", messages: [] });
      setLatestCompaction(null);
      setCompactedMessageCount(0);
      setActiveConversationId(null);
      return;
    }
    const conversation = await repository.getConversation(conversationId);
    if (
      hydrationRequest !== hydrationRequestRef.current ||
      !conversation ||
      conversation.archived ||
      conversation.learningUnitId !== learningUnitId
    ) return;
    const [messages, compactions] = await Promise.all([
      repository.listMessages(conversationId),
      repository.listCompactions(conversationId),
    ]);
    if (hydrationRequest !== hydrationRequestRef.current) return;
    setActiveConversationId(conversationId);
    const latest = compactions.at(-1) ?? null;
    const coveredMessageIndex = latest?.coveredThroughMessageId
      ? messages.findIndex((message) => message.id === latest.coveredThroughMessageId)
      : -1;
    setCompactedMessageCount(coveredMessageIndex + 1);
    setLatestCompaction(latest);
    dispatch({ type: "hydrate", messages });
    setInputValue("");
  }, [learningUnitId, repository]);

  useEffect(() => {
    hydrationRequestRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "hydrate", messages: [] });
    setInputValue("");
    setLatestCompaction(null);
    setCompactedMessageCount(0);
    setCompactionNotice(null);
    setContextSelectionNotice(null);

    if (!learningUnitId) {
      setNoteState({ learningUnitId: null, rawNote: null, loading: false, error: null });
      setActiveConversationId(null);
      return undefined;
    }

    let cancelled = false;
    setNoteState({ learningUnitId, rawNote: null, loading: true, error: null });

    loadRawNote(learningUnitId)
      .then((rawNote) => {
        if (!cancelled) {
          setNoteState({ learningUnitId, rawNote, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setNoteState({ learningUnitId, rawNote: null, loading: false, error });
        }
      });

    if (repository) {
      void repository.listConversations({ includeArchived: true }).then((items) => {
        if (cancelled) return;
        setConversations(items);
        const latest = items.find((item) => item.learningUnitId === learningUnitId && !item.archived);
        if (latest) void hydrateConversation(latest.id);
        else setActiveConversationId(null);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [hydrateConversation, learningUnitId, repository]);

  const contextReady = Boolean(
    learningUnit &&
    noteState.learningUnitId === learningUnitId &&
    !noteState.loading &&
    !noteState.error,
  );

  const aiContext = useMemo(() => {
    if (!contextReady || !learningUnit) return null;
    return buildAiContext({
      learningUnit,
      rawNote: noteState.rawNote,
      sources: learningUnit.sources,
      activeSourceFile,
    });
  }, [activeSourceFile, contextReady, learningUnit, noteState.rawNote]);

  const requestContext = useMemo(
    () => (aiContext ? adaptLearningContextForGateway(aiContext) : null),
    [aiContext],
  );

  const messagesSinceCompaction = useMemo(
    () => chatState.messages.slice(compactedMessageCount),
    [chatState.messages, compactedMessageCount],
  );
  const completedHistory = useMemo(
    () => buildCompletedChatHistory(messagesSinceCompaction),
    [messagesSinceCompaction],
  );
  const summaryText = typeof latestCompaction?.summary === "string"
    ? latestCompaction.summary
    : latestCompaction?.metadata?.serializedSummary ?? "";
  const lastActualUsage = (() => {
    for (let index = messagesSinceCompaction.length - 1; index >= 0; index -= 1) {
      const message = messagesSinceCompaction[index];
      if (!message?.usage) continue;
      return normalizeUsage(message.usage);
    }
    return null;
  })();

  const contextBudget = useMemo(() => buildContextBudget({
    modelId: contextModelId,
    systemPrompt: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT,
    note: aiContext?.note?.content ?? "",
    sources: aiContext?.sources ?? [],
    activeSourceFile: aiContext?.activeSourceFile ?? activeSourceFile,
    summary: summaryText,
    history: completedHistory,
    input: inputValue,
    actualUsage: lastActualUsage,
  }), [activeSourceFile, aiContext, completedHistory, contextModelId, inputValue, lastActualUsage, summaryText]);

  const stop = useCallback(() => {
    const requestId = activeRequestIdRef.current;
    if (!requestId) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "cancel", requestId });
  }, []);

  const ensureConversation = useCallback(async () => {
    if (!repository || !learningUnitId) return null;
    if (activeConversationId) {
      const current = await repository.getConversation(activeConversationId);
      if (current && !current.archived && current.learningUnitId === learningUnitId) return current;
    }
    const created = await repository.createConversation({
      learningUnitId,
      model: contextModelId,
    });
    setActiveConversationId(created.id);
    await refreshConversations(repository);
    return created;
  }, [activeConversationId, contextModelId, learningUnitId, refreshConversations, repository]);

  const newConversation = useCallback(async () => {
    hydrationRequestRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    setActiveConversationId(null);
    setLatestCompaction(null);
    setCompactedMessageCount(0);
    setCompactionNotice(null);
    setContextSelectionNotice(null);
    setInputValue("");
    dispatch({ type: "hydrate", messages: [] });
  }, []);

  const renameConversation = useCallback(async (id, title) => {
    if (!repository) return;
    await repository.renameConversation(id, title);
    await refreshConversations(repository);
  }, [refreshConversations, repository]);

  const archiveConversation = useCallback(async (id, archived = true) => {
    if (!repository) return;
    await repository.archiveConversation(id, archived);
    if (archived && id === activeConversationId) await newConversation();
    await refreshConversations(repository);
  }, [activeConversationId, newConversation, refreshConversations, repository]);

  const deleteConversation = useCallback(async (id) => {
    if (!repository) return;
    await repository.deleteConversation(id);
    if (id === activeConversationId) await newConversation();
    await refreshConversations(repository);
  }, [activeConversationId, newConversation, refreshConversations, repository]);

  const saveConnectionSettings = useCallback((nextSettings) => {
    hydrationRequestRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "hydrate", messages: [] });
    setActiveConversationId(null);
    setLatestCompaction(null);
    setCompactedMessageCount(0);
    setContextSelectionNotice(null);
    setInputValue("");
    setDeepSeekSettings(saveDeepSeekBrowserSettings(nextSettings));
  }, []);

  const clearConnectionSettings = useCallback(() => {
    hydrationRequestRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    setInputValue("");
    clearDeepSeekBrowserApiKey();
    setDeepSeekSettings((current) => ({
      ...current,
      apiKey: "",
      rememberApiKey: false,
    }));
  }, []);

  const summarizeMessages = useCallback(async ({ previousSummary, messages, reason }) => {
    if (!client.configured || !requestContext) throw new Error("AI provider is not configured for compaction");
    let content = "";
    const prompt = [
      "请将下面对话压缩为结构化 JSON，只输出 JSON，不要 Markdown。",
      "字段必须是 userGoal, establishedFacts, currentLearningUnit, importantSourceReferences, experiments, conclusions, unresolvedQuestions。",
      "数组字段必须是字符串数组；保留源码引用、已完成实验、结论和未解决问题；不要引入对话中不存在的事实。",
      `压缩原因: ${reason}`,
      `已有摘要: ${JSON.stringify(previousSummary)}`,
      `对话: ${JSON.stringify(messages.map(({ role, content: value }) => ({ role, content: value })))}`,
    ].join("\n");
    await client.stream(
      { question: prompt, context: requestContext, history: [] },
      {
        onEvent(event) {
          if (event.type === CHAT_EVENT_TYPES.DELTA) content += event.text;
        },
      },
    );
    try {
      return JSON.parse(stripJsonFence(content));
    } catch {
      return {
        userGoal: "继续当前 React 学习任务",
        establishedFacts: content ? [content] : [],
        currentLearningUnit: learningUnit ? { id: learningUnit.id, title: learningUnit.title ?? learningUnit.label } : null,
        importantSourceReferences: [],
        experiments: [],
        conclusions: [],
        unresolvedQuestions: [],
      };
    }
  }, [client, learningUnit, requestContext]);

  const compactContext = useCallback(async (reason = "manual") => {
    if (compactionPromiseRef.current) return compactionPromiseRef.current;
    if (!messagesSinceCompaction.length || !client.configured || !requestContext) {
      if (reason === "manual" && chatState.messages.length) {
        setCompactionNotice("当前没有需要继续压缩的新对话。完整对话仍保留。");
      }
      return null;
    }

    const promise = (async () => {
      setCompacting(true);
      setCompactionNotice(null);
      const service = createCompactionService({ summarize: summarizeMessages });
      const conversation = await ensureConversation();
      const persistedMessages = repository && conversation
        ? await repository.listMessages(conversation.id)
        : [];
      const coveredThroughMessageId = persistedMessages.at(-1)?.id
        ?? chatState.messages.at(-1)?.id
        ?? null;
      const result = await service.compact({
        conversationId: conversation?.id ?? null,
        messages: messagesSinceCompaction,
        previousSummary: latestCompaction?.summary && typeof latestCompaction.summary === "object"
          ? latestCompaction.summary
          : null,
        coveredThroughMessageId,
        modelId: contextModelId,
        budgetInput: {
          systemPrompt: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT,
          note: aiContext?.note?.content ?? "",
          sources: aiContext?.sources ?? [],
          activeSourceFile: aiContext?.activeSourceFile ?? activeSourceFile,
        },
        reason,
      });

      if (repository && conversation) {
        const stored = await repository.saveCompaction({
          conversationId: conversation.id,
          summary: result.summary,
          coveredThroughMessageId: result.checkpoint.coveredThroughMessageId,
          estimatedTokensBefore: result.checkpoint.estimatedTokensBefore,
          estimatedTokensAfter: result.checkpoint.estimatedTokensAfter,
          version: result.checkpoint.version,
          reason: result.checkpoint.reason,
          timestamp: result.checkpoint.timestamp,
          metadata: { reason, serializedSummary: result.serializedSummary },
        });
        setLatestCompaction(stored);
      } else {
        setLatestCompaction({
          summary: result.summary,
          coveredThroughMessageId,
          reason: result.checkpoint.reason,
          timestamp: result.checkpoint.timestamp,
          metadata: { serializedSummary: result.serializedSummary },
        });
      }
      setCompactedMessageCount(chatState.messages.length);
      setCompactionNotice(`上下文已从 ≈${result.checkpoint.estimatedTokensBefore} tokens 压缩到 ≈${result.checkpoint.estimatedTokensAfter} tokens。完整对话仍保留。`);
      return result;
    })().finally(() => {
      compactionPromiseRef.current = null;
      setCompacting(false);
    });

    compactionPromiseRef.current = promise;
    return promise;
  }, [activeSourceFile, aiContext, chatState.messages, client.configured, contextModelId, ensureConversation, latestCompaction, messagesSinceCompaction, repository, requestContext, summarizeMessages]);

  const submit = useCallback(async (question) => {
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";
    if (
      !normalizedQuestion ||
      !client.configured ||
      !requestContext ||
      noteState.loading ||
      activeRequestIdRef.current
    ) return;

    const controller = new AbortController();
    const requestId = createRequestId();
    const requestGeneration = hydrationRequestRef.current;
    abortControllerRef.current = controller;
    activeRequestIdRef.current = requestId;
    dispatch({ type: "request", requestId, question: normalizedQuestion });
    dispatch({ type: "start", requestId });
    setInputValue("");
    let conversation = null;
    let snapshot = null;
    let userRecord = null;
    let assistantRecord = null;
    let assistantRecordPromise = null;
    let persister = null;
    let assistantText = "";
    let terminalEvent = null;
    let outputLimitExceeded = false;
    let persistenceQueue = Promise.resolve();
    const outputLimiter = createUnicodeOutputLimiter({
      onOutputLimitExceeded() {
        outputLimitExceeded = true;
        controller.abort("output_limit");
      },
    });
    const assertCurrentRequest = () => {
      if (
        controller.signal.aborted ||
        activeRequestIdRef.current !== requestId ||
        hydrationRequestRef.current !== requestGeneration
      ) {
        throw new AiChatAbortError();
      }
    };

    const ensureAssistantRecord = () => {
      if (assistantRecord) return Promise.resolve(assistantRecord);
      if (!repository || !conversation) return Promise.resolve(null);
      if (!assistantRecordPromise) {
        assistantRecordPromise = repository.appendMessage({
          conversationId: conversation.id,
          role: "assistant",
          content: assistantText,
          status: "streaming",
          contextSnapshotId: snapshot?.id ?? null,
        }).then((record) => {
          assistantRecord = record;
          persister = new StreamingMessagePersister(repository, record.id);
          return record;
        });
      }
      return assistantRecordPromise;
    };

    const enqueuePersistence = (task = null) => {
      persistenceQueue = persistenceQueue.then(async () => {
        const record = await ensureAssistantRecord();
        if (!record || !task) return record;
        return task();
      });
      return persistenceQueue;
    };

    try {
      conversation = await ensureConversation();
      assertCurrentRequest();

      let effectiveSummary = summaryText;
      let effectiveCompactedMessageCount = compactedMessageCount;
      const submitBudget = buildContextBudget({
        modelId: contextModelId,
        systemPrompt: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT,
        note: aiContext?.note?.content ?? "",
        sources: aiContext?.sources ?? [],
        activeSourceFile: aiContext?.activeSourceFile ?? activeSourceFile,
        summary: effectiveSummary,
        history: completedHistory,
        input: normalizedQuestion,
        actualUsage: lastActualUsage,
      });
      if (submitBudget.shouldCompact && messagesSinceCompaction.length > 0) {
        try {
          const compacted = await compactContext("automatic");
          assertCurrentRequest();
          if (compacted) {
            effectiveSummary = compacted.serializedSummary ?? effectiveSummary;
            effectiveCompactedMessageCount = chatState.messages.length;
          }
        } catch (error) {
          if (error instanceof AiChatAbortError || controller.signal.aborted) throw error;
          setCompactionNotice(`自动压缩失败，已保留原始上下文：${error?.message || "unknown error"}`);
        }
      }

      const requestHistory = buildCompletedChatHistory(
        chatState.messages.slice(effectiveCompactedMessageCount),
      );
      const transportHistory = connectionMode === "gateway"
        ? requestHistory.slice(-CHAT_LIMITS.maxHistoryMessages)
        : requestHistory;
      const transportPrunedMessageCount = requestHistory.length - transportHistory.length;
      const selected = selectContextWithinBudget({
        modelId: contextModelId,
        transportInputCapTokens: connectionMode === "gateway"
          ? GATEWAY_TRANSPORT_INPUT_CAP_TOKENS
          : undefined,
        systemPrompt: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT,
        note: aiContext?.note?.content ?? "",
        sources: aiContext?.sources ?? [],
        activeSourceFile: aiContext?.activeSourceFile ?? activeSourceFile,
        summary: effectiveSummary,
        history: transportHistory,
        input: normalizedQuestion,
      });
      const selectionMetadata = {
        ...selected.metadata,
        prunedHistory: selected.metadata.prunedHistory || transportPrunedMessageCount > 0,
        prunedMessageCount: selected.metadata.prunedMessageCount + transportPrunedMessageCount,
        ...(connectionMode === "gateway"
          ? { transportInputCapTokens: GATEWAY_TRANSPORT_INPUT_CAP_TOKENS }
          : {}),
      };
      const selectionMessages = [];
      if (selectionMetadata.truncatedNote) selectionMessages.push("当前 Note 已截断");
      if (selectionMetadata.truncatedSources) selectionMessages.push("部分 Source 已截断或省略");
      if (selectionMetadata.prunedHistory) {
        selectionMessages.push(`已裁剪 ${selectionMetadata.prunedMessageCount} 条较早历史`);
      }
      setContextSelectionNotice(selectionMessages.length
        ? `上下文已按可用预算裁剪：${selectionMessages.join("；")}。`
        : null);

      const outboundContext = {
        ...requestContext,
        note: requestContext.note && selected.context.note
          ? { ...requestContext.note, content: selected.context.note }
          : null,
        sources: selected.context.sources,
        activeSourceFile: selectionMetadata.activeSourceFile ?? requestContext.activeSourceFile,
        ...(selected.context.summary ? { conversationSummary: selected.context.summary } : {}),
      };
      snapshot = repository && conversation
        ? await repository.saveContextSnapshot({
            learningUnitId,
            context: {
              ...outboundContext,
              model: contextModelId,
              selection: selectionMetadata,
            },
          })
        : null;
      assertCurrentRequest();

      if (repository && conversation) {
        userRecord = await repository.appendMessage({
          conversationId: conversation.id,
          role: "user",
          content: normalizedQuestion,
          status: "complete",
          contextSnapshotId: snapshot?.id ?? null,
        });
        assertCurrentRequest();
      }

      // Keep the established chat transport for ordinary conversation. The
      // AgentRunner is opt-in for assessment requests so existing chat,
      // citation, compaction, and abort flows retain their wire contract.
      if (agentRunner && shouldUseAssessmentAgent(normalizedQuestion)) {
        const agentContext = createToolExecutionContext({
          learningUnitId,
          conversationId: conversation?.id ?? `conversation-${requestId}`,
          agentRunId: requestId,
          contextSnapshotId: snapshot?.id ?? `context-${requestId}`,
          mutationId: `${requestId}:runtime`,
          model: contextModelId,
          actor: { type: "ai_agent", model: contextModelId },
        });
        await agentRunner.run({
          messages: buildAgentMessages({
            question: normalizedQuestion,
            context: outboundContext,
            history: selected.context.history,
          }),
          context: agentContext,
          signal: controller.signal,
          onEvent(event) {
            if (activeRequestIdRef.current !== requestId) return;
            if (event.type === MODEL_TURN_EVENT_TYPES.TURN_START) {
              dispatch({ type: "start", requestId });
              void enqueuePersistence();
            } else if (event.type === MODEL_TURN_EVENT_TYPES.TEXT_DELTA) {
              const limited = outputLimiter.push(event.text);
              assistantText = limited.content;
              if (limited.acceptedText) {
                dispatch({ type: "delta", requestId, text: limited.acceptedText });
              }
              const persistedText = assistantText;
              void enqueuePersistence(() => {
                persister?.schedule({ content: persistedText, status: "streaming" });
              });
            } else if (event.type === MODEL_TURN_EVENT_TYPES.TURN_COMPLETE) {
              terminalEvent = event;
            }
          },
        });
      } else {
        await client.stream(
          { question: normalizedQuestion, context: outboundContext, history: selected.context.history },
          {
            signal: controller.signal,
            onEvent(event) {
              if (activeRequestIdRef.current !== requestId) return;
              if (event.type === CHAT_EVENT_TYPES.START) {
                dispatch({ type: "start", requestId });
                void enqueuePersistence();
              } else if (event.type === CHAT_EVENT_TYPES.DELTA) {
                const limited = outputLimiter.push(event.text);
                assistantText = limited.content;
                if (limited.acceptedText) {
                  dispatch({ type: "delta", requestId, text: limited.acceptedText });
                }
                const persistedText = assistantText;
                void enqueuePersistence(() => {
                  persister?.schedule({ content: persistedText, status: "streaming" });
                });
              } else if (event.type === CHAT_EVENT_TYPES.DONE) {
                terminalEvent = event;
              }
            },
          },
        );
      }
      const finishReason = outputLimitExceeded
        ? "output_limit"
        : normalizeFinishReason(terminalEvent?.finishReason);
      const usage = normalizeUsage(terminalEvent?.usage);
      dispatch({ type: "done", requestId, finishReason, usage });
      await enqueuePersistence(() => persister?.finalize({
        content: assistantText,
        status: "complete",
        usage,
        metadata: { finishReason },
      }));
      await persistenceQueue;
      await persister?.flush();
      await refreshConversations(repository);
    } catch (error) {
      await persistenceQueue.catch(() => null);
      if (outputLimitExceeded) {
        dispatch({ type: "done", requestId, finishReason: "output_limit" });
        await ensureAssistantRecord();
        await persister?.finalize({
          content: assistantText,
          status: "complete",
          metadata: { finishReason: "output_limit" },
        });
      } else if (error instanceof AiChatAbortError || controller.signal.aborted) {
        dispatch({ type: "cancel", requestId });
        if (assistantRecordPromise || assistantRecord) {
          await ensureAssistantRecord();
          await persister?.finalize({
            content: assistantText,
            status: "interrupted",
            metadata: { finishReason: "user_abort" },
          });
        }
      } else {
        dispatch({
          type: "error",
          requestId,
          message: error?.message || "AI assistant request failed",
        });
        if (userRecord || assistantRecordPromise || assistantRecord) {
          await ensureAssistantRecord();
          await persister?.finalize({
            content: assistantText,
            status: "error",
            metadata: { finishReason: "error" },
          });
        }
      }
      await refreshConversations(repository);
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        abortControllerRef.current = null;
      }
    }
  }, [activeSourceFile, agentRunner, aiContext, chatState.messages, client, compactContext, compactedMessageCount, completedHistory, connectionMode, contextModelId, ensureConversation, lastActualUsage, learningUnitId, messagesSinceCompaction, noteState.loading, refreshConversations, repository, requestContext, summaryText]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const contextSummary = useMemo(() => ({
    note: aiContext?.note?.available ? aiContext.note.fileName : null,
    sources: aiContext?.sources ?? [],
    activeSourceFile: aiContext?.activeSourceFile ?? null,
  }), [aiContext]);

  const visibleConversations = useMemo(
    () => conversations.filter((conversation) => conversation.learningUnitId === learningUnitId && !conversation.archived),
    [conversations, learningUnitId],
  );

  const noticeParts = [];
  if (connectionMode === "unconfigured") {
    noticeParts.push("请配置你自己的 DeepSeek API Key。Key 默认只保存在当前浏览器会话中，配置后即可直接调用 DeepSeek。");
  } else if (connectionMode === "gateway") {
    noticeParts.push("当前使用站点 AI 网关；也可以配置自己的 DeepSeek API Key，改为浏览器直连。");
  } else if (noteState.loading) {
    noticeParts.push("正在准备当前笔记和源码上下文…");
  }
  if (compactionNotice) noticeParts.push(compactionNotice);
  if (contextSelectionNotice) noticeParts.push(contextSelectionNotice);
  if (conversationStorage.mode === "memory") {
    noticeParts.push("浏览器本地持久化不可用，本次会话仅保存在内存中。");
  }

  return {
    configured: client.configured,
    connectionMode,
    deepSeekSettings,
    modelLabel: connectionMode === "browser" ? deepSeekSettings.model : null,
    contextReady,
    contextSummary,
    contextBudget,
    compacting,
    compactContext: () => compactContext("manual"),
    conversations: visibleConversations,
    conversationHistory: conversations,
    conversationStorage,
    learningUnitId,
    activeConversationId,
    selectConversation: hydrateConversation,
    renameConversation,
    archiveConversation,
    deleteConversation,
    inputValue,
    setInputValue,
    messages: chatState.messages,
    status: chatState.status,
    error: noteState.error?.message || chatState.error,
    notice: noticeParts.filter(Boolean).join(" ") || null,
    disabled: !client.configured || !contextReady || chatState.status === CHAT_STATUS.STREAMING,
    settingsDisabled: chatState.status === CHAT_STATUS.STREAMING,
    saveConnectionSettings,
    clearConnectionSettings,
    submit,
    stop,
    reset: newConversation,
  };
}
