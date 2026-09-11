import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { loadRawNote } from "../workbench/noteRegistry.js";
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

function createRequestId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(null);
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

  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "reset" });
    setInputValue("");

    if (!learningUnitId) {
      setNoteState({ learningUnitId: null, rawNote: null, loading: false, error: null });
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

    return () => {
      cancelled = true;
    };
  }, [learningUnitId]);

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

  const stop = useCallback(() => {
    const requestId = activeRequestIdRef.current;
    if (!requestId) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "cancel", requestId });
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    setInputValue("");
    dispatch({ type: "reset" });
  }, []);

  const saveConnectionSettings = useCallback((nextSettings) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "reset" });
    setInputValue("");
    setDeepSeekSettings(saveDeepSeekBrowserSettings(nextSettings));
  }, []);

  const clearConnectionSettings = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    activeRequestIdRef.current = null;
    dispatch({ type: "reset" });
    setInputValue("");
    clearDeepSeekBrowserApiKey();
    setDeepSeekSettings((current) => ({
      ...current,
      apiKey: "",
      rememberApiKey: false,
    }));
  }, []);

  const submit = useCallback(async (question) => {
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";
    if (!normalizedQuestion || !client.configured || !requestContext || noteState.loading) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    const requestId = createRequestId();
    abortControllerRef.current = controller;
    activeRequestIdRef.current = requestId;

    const history = buildCompletedChatHistory(chatState.messages);
    dispatch({ type: "request", requestId, question: normalizedQuestion });
    setInputValue("");

    try {
      await client.stream(
        { question: normalizedQuestion, context: requestContext, history },
        {
          signal: controller.signal,
          onEvent(event) {
            if (activeRequestIdRef.current !== requestId) return;
            if (event.type === CHAT_EVENT_TYPES.START) {
              dispatch({ type: "start", requestId });
            } else if (event.type === CHAT_EVENT_TYPES.DELTA) {
              dispatch({ type: "delta", requestId, text: event.text });
            } else if (event.type === CHAT_EVENT_TYPES.DONE) {
              dispatch({ type: "done", requestId, usage: event.usage });
            }
          },
        },
      );
    } catch (error) {
      if (error instanceof AiChatAbortError || controller.signal.aborted) {
        dispatch({ type: "cancel", requestId });
      } else {
        dispatch({
          type: "error",
          requestId,
          message: error?.message || "AI assistant request failed",
        });
      }
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        abortControllerRef.current = null;
      }
    }
  }, [chatState.messages, client, requestContext, noteState.loading]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const contextSummary = useMemo(() => ({
    note: aiContext?.note?.available ? aiContext.note.fileName : null,
    sources: aiContext?.sources ?? [],
    activeSourceFile: aiContext?.activeSourceFile ?? null,
  }), [aiContext]);

  const notice = connectionMode === "unconfigured"
    ? "请配置你自己的 DeepSeek API Key。Key 默认只保存在当前浏览器会话中，配置后即可直接调用 DeepSeek。"
    : connectionMode === "gateway"
      ? "当前使用站点 AI 网关；也可以配置自己的 DeepSeek API Key，改为浏览器直连。"
      : noteState.loading
        ? "正在准备当前笔记和源码上下文…"
        : null;

  return {
    configured: client.configured,
    connectionMode,
    deepSeekSettings,
    modelLabel: connectionMode === "browser" ? deepSeekSettings.model : null,
    contextReady,
    contextSummary,
    inputValue,
    setInputValue,
    messages: chatState.messages,
    status: chatState.status,
    error: noteState.error?.message || chatState.error,
    notice,
    disabled: !client.configured || !contextReady || chatState.status === CHAT_STATUS.STREAMING,
    settingsDisabled: chatState.status === CHAT_STATUS.STREAMING,
    saveConnectionSettings,
    clearConnectionSettings,
    submit,
    stop,
    reset,
  };
}
