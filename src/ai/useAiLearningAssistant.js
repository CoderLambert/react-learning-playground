import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { loadRawNote } from "../workbench/noteRegistry.js";
import { createCompactionService } from "./compaction/compactionService.js";
import { ConversationRepository, StreamingMessagePersister, createConversationStore } from "./conversations/index.js";
import { buildContextBudget, selectContextWithinBudget } from "./context/contextBudget.js";
import { buildAiContext } from "./contextBuilder.js";
import { AiChatAbortError, createAiChatClient } from "./chatClient.js";
import { INITIAL_CHAT_STATE, chatReducer } from "./chatReducer.js";
import { CHAT_EVENT_TYPES, CHAT_STATUS } from "./contracts.js";
import {
  clearDeepSeekBrowserApiKey,
  loadDeepSeekBrowserSettings,
  saveDeepSeekBrowserSettings,
} from "./deepseekBrowserSettings.js";
import { createDeepSeekDirectClient } from "./deepseekDirectClient.js";
import {
  adaptLearningContextForGateway,
  buildCompletedChatHistory,
} from "./learningAssistantContext.js";

const CONTEXT_SYSTEM_PROMPT = "React Learning Playground assistant with current note/source grounding and source:// citations.";

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

export function useAiLearningAssistant({ learningUnit, activeSourceFile } = {}) {
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
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [latestCompaction, setLatestCompaction] = useState(null);
  const [compacting, setCompacting] = useState(false);
  const [compactionNotice, setCompactionNotice] = useState(null);
  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(null);
  const compactionPromiseRef = useRef(null);
  const gatewayClient = useMemo(() => createAiChatClient(), []);
  const directClient = useMemo(() => createDeepSeekDirectClient({
    apiKey: deepSeekSettings.apiKey,
    model: deepSeekSettings.model,
  }), [deepSeekSettings.apiKey, deepSeekSettings.model]);
  const client = directClient.configured ? directClient : gatewayClient;
  const connectionMode = directClient.configured
    ? "browser"
    : gatewayClient.configured
      ? "gateway"
      : "unconfigured";
  const learningUnitId = learningUnit?.id ?? null;

  const refreshConversations = useCallback(async (repo = repository) => {
    if (!repo) return [];
    const next = await repo.listConversations();
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
      setConversations(await repo.listConversations());
    });
    return () => { cancelled = true; };
  }, []);

  const hydrateConversation = useCallback(async (conversationId) => {
    if (!repository || !conversationId) {
      dispatch({ type: "hydrate", messages: [] });
      setLatestCompaction(null);
      setActiveConversationId(null);
      return;
    }
    const conversation = await repository.getConversation(conversationId);
    if (!conversation || conversation.archived) return;
    const [messages, compactions] = await Promise.all([
      repository.listMessages(conversationId),
      repository.listCompactions(conversationId),
    ]);
    abortControllerRef.current?.abort();
    activeRequestIdRef.current = null;
    setActiveConversationId(conversationId);
    setLatestCompaction(compactions.at(-1) ?? null);
    dispatch({ type: "hydrate", messages });
    setInputValue("");
  }, [repository]);

  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "hydrate", messages: [] });
    setInputValue("");
    setLatestCompaction(null);
    setCompactionNotice(null);

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
      void repository.listConversations().then((items) => {
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

  const completedHistory = useMemo(
    () => buildCompletedChatHistory(chatState.messages),
    [chatState.messages],
  );
  const summaryText = typeof latestCompaction?.summary === "string"
    ? latestCompaction.summary
    : latestCompaction?.metadata?.serializedSummary ?? "";
  const lastActualUsage = useMemo(() => {
    for (let index = chatState.messages.length - 1; index >= 0; index -= 1) {
      if (chatState.messages[index]?.usage) return normalizeUsage(chatState.messages[index].usage);
    }
    return null;
  }, [chatState.messages]);

  const contextBudget = useMemo(() => buildContextBudget({
    modelId: deepSeekSettings.model,
    systemPrompt: CONTEXT_SYSTEM_PROMPT,
    note: aiContext?.note?.content ?? "",
    sources: aiContext?.sources ?? [],
    summary: summaryText,
    history: completedHistory,
    input: inputValue,
    actualUsage: lastActualUsage,
  }), [aiContext, completedHistory, deepSeekSettings.model, inputValue, lastActualUsage, summaryText]);

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
      model: deepSeekSettings.model,
    });
    setActiveConversationId(created.id);
    await refreshConversations(repository);
    return created;
  }, [activeConversationId, deepSeekSettings.model, learningUnitId, refreshConversations, repository]);

  const newConversation = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    setActiveConversationId(null);
    setLatestCompaction(null);
    setCompactionNotice(null);
    setInputValue("");
    dispatch({ type: "hydrate", messages: [] });
  }, []);

  const renameConversation = useCallback(async (id, title) => {
    if (!repository) return;
    await repository.renameConversation(id, title);
    await refreshConversations(repository);
  }, [refreshConversations, repository]);

  const archiveConversation = useCallback(async (id) => {
    if (!repository) return;
    await repository.archiveConversation(id, true);
    if (id === activeConversationId) await newConversation();
    await refreshConversations(repository);
  }, [activeConversationId, newConversation, refreshConversations, repository]);

  const deleteConversation = useCallback(async (id) => {
    if (!repository) return;
    await repository.deleteConversation(id);
    if (id === activeConversationId) await newConversation();
    await refreshConversations(repository);
  }, [activeConversationId, newConversation, refreshConversations, repository]);

  const saveConnectionSettings = useCallback((nextSettings) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "hydrate", messages: [] });
    setActiveConversationId(null);
    setLatestCompaction(null);
    setInputValue("");
    setDeepSeekSettings(saveDeepSeekBrowserSettings(nextSettings));
  }, []);

  const clearConnectionSettings = useCallback(() => {
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
    if (!chatState.messages.length || !client.configured || !requestContext) return null;

    const promise = (async () => {
      setCompacting(true);
      setCompactionNotice(null);
      const service = createCompactionService({ summarize: summarizeMessages });
      const result = await service.compact({
        messages: chatState.messages,
        previousSummary: latestCompaction?.summary && typeof latestCompaction.summary === "object"
          ? latestCompaction.summary
          : null,
        coveredThroughMessageId: chatState.messages.at(-1)?.id ?? null,
        modelId: deepSeekSettings.model,
        budgetInput: {
          systemPrompt: CONTEXT_SYSTEM_PROMPT,
          note: aiContext?.note?.content ?? "",
          sources: aiContext?.sources ?? [],
        },
        reason,
      });

      const conversation = await ensureConversation();
      if (repository && conversation) {
        const stored = await repository.saveCompaction({
          conversationId: conversation.id,
          summary: result.summary,
          coveredThroughMessageId: result.checkpoint.coveredThroughMessageId,
          estimatedTokensBefore: result.checkpoint.estimatedTokensBefore,
          estimatedTokensAfter: result.checkpoint.estimatedTokensAfter,
          version: result.checkpoint.version,
          metadata: { reason, serializedSummary: result.serializedSummary },
        });
        setLatestCompaction(stored);
      } else {
        setLatestCompaction({
          summary: result.summary,
          metadata: { serializedSummary: result.serializedSummary },
        });
      }
      setCompactionNotice(`上下文已从 ≈${result.checkpoint.estimatedTokensBefore} tokens 压缩到 ≈${result.checkpoint.estimatedTokensAfter} tokens。完整对话仍保留。`);
      return result;
    })().finally(() => {
      compactionPromiseRef.current = null;
      setCompacting(false);
    });

    compactionPromiseRef.current = promise;
    return promise;
  }, [aiContext, chatState.messages, client.configured, deepSeekSettings.model, ensureConversation, latestCompaction, repository, requestContext, summarizeMessages]);

  const submit = useCallback(async (question) => {
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";
    if (!normalizedQuestion || !client.configured || !requestContext || noteState.loading) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    const requestId = createRequestId();
    abortControllerRef.current = controller;
    activeRequestIdRef.current = requestId;

    const conversation = await ensureConversation();
    const snapshot = repository && conversation
      ? await repository.saveContextSnapshot({
          learningUnitId,
          context: { ...requestContext, model: deepSeekSettings.model },
        })
      : null;

    if (repository && conversation) {
      await repository.appendMessage({
        conversationId: conversation.id,
        role: "user",
        content: normalizedQuestion,
        status: "complete",
        contextSnapshotId: snapshot?.id ?? null,
      });
    }

    let effectiveSummary = summaryText;
    const submitBudget = buildContextBudget({
      modelId: deepSeekSettings.model,
      systemPrompt: CONTEXT_SYSTEM_PROMPT,
      note: aiContext?.note?.content ?? "",
      sources: aiContext?.sources ?? [],
      summary: effectiveSummary,
      history: completedHistory,
      input: normalizedQuestion,
      actualUsage: lastActualUsage,
    });
    if (submitBudget.shouldCompact && chatState.messages.length > 0) {
      try {
        const compacted = await compactContext("automatic");
        effectiveSummary = compacted?.serializedSummary ?? effectiveSummary;
      } catch (error) {
        setCompactionNotice(`自动压缩失败，已保留原始上下文：${error?.message || "unknown error"}`);
      }
    }

    const selected = selectContextWithinBudget({
      modelId: deepSeekSettings.model,
      systemPrompt: CONTEXT_SYSTEM_PROMPT,
      note: aiContext?.note?.content ?? "",
      sources: aiContext?.sources ?? [],
      summary: effectiveSummary,
      history: completedHistory,
      input: normalizedQuestion,
    });
    const outboundContext = effectiveSummary
      ? { ...requestContext, conversationSummary: effectiveSummary }
      : requestContext;

    dispatch({ type: "request", requestId, question: normalizedQuestion });
    setInputValue("");
    let assistantRecord = null;
    let persister = null;
    let assistantText = "";

    const ensureAssistantRecord = async () => {
      if (assistantRecord || !repository || !conversation) return assistantRecord;
      assistantRecord = await repository.appendMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: assistantText,
        status: "streaming",
        contextSnapshotId: snapshot?.id ?? null,
      });
      persister = new StreamingMessagePersister(repository, assistantRecord.id);
      return assistantRecord;
    };

    try {
      await client.stream(
        { question: normalizedQuestion, context: outboundContext, history: selected.context.history },
        {
          signal: controller.signal,
          onEvent(event) {
            if (activeRequestIdRef.current !== requestId) return;
            if (event.type === CHAT_EVENT_TYPES.START) {
              dispatch({ type: "start", requestId });
              void ensureAssistantRecord();
            } else if (event.type === CHAT_EVENT_TYPES.DELTA) {
              assistantText += event.text;
              dispatch({ type: "delta", requestId, text: event.text });
              void ensureAssistantRecord().then(() => persister?.schedule({ content: assistantText, status: "streaming" }));
            } else if (event.type === CHAT_EVENT_TYPES.DONE) {
              dispatch({ type: "done", requestId, usage: event.usage });
              void ensureAssistantRecord().then(() => persister?.finalize({
                content: assistantText,
                status: "complete",
                usage: normalizeUsage(event.usage),
              }));
            }
          },
        },
      );
      await persister?.flush();
      await refreshConversations(repository);
    } catch (error) {
      if (error instanceof AiChatAbortError || controller.signal.aborted) {
        dispatch({ type: "cancel", requestId });
        await ensureAssistantRecord();
        await persister?.finalize({ content: assistantText, status: "interrupted" });
      } else {
        dispatch({
          type: "error",
          requestId,
          message: error?.message || "AI assistant request failed",
        });
        await ensureAssistantRecord();
        await persister?.finalize({ content: assistantText, status: "error" });
      }
      await refreshConversations(repository);
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        abortControllerRef.current = null;
      }
    }
  }, [aiContext, chatState.messages.length, client, compactContext, completedHistory, deepSeekSettings.model, ensureConversation, lastActualUsage, learningUnitId, noteState.loading, refreshConversations, repository, requestContext, summaryText]);

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
