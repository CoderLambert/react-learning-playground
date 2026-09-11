import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { loadRawNote } from "../workbench/noteRegistry.js";
import { buildAiContext } from "./contextBuilder.js";
import { AiChatAbortError, createAiChatClient } from "./chatClient.js";
import { INITIAL_CHAT_STATE, chatReducer } from "./chatReducer.js";
import { CHAT_EVENT_TYPES, CHAT_STATUS } from "./contracts.js";
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
  const [noteState, setNoteState] = useState({
    learningUnitId: null,
    rawNote: null,
    loading: false,
    error: null,
  });
  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(null);
  const client = useMemo(() => createAiChatClient(), []);
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

  const gatewayContext = useMemo(
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

  const submit = useCallback(async (question) => {
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";
    if (!normalizedQuestion || !client.configured || !gatewayContext || noteState.loading) return;

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
        { question: normalizedQuestion, context: gatewayContext, history },
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
  }, [chatState.messages, client, gatewayContext, noteState.loading]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const contextSummary = useMemo(() => ({
    note: aiContext?.note?.available ? aiContext.note.fileName : null,
    sources: aiContext?.sources ?? [],
    activeSourceFile: aiContext?.activeSourceFile ?? null,
  }), [aiContext]);

  const notice = !client.configured
    ? "AI 网关尚未配置。当前版本可以查看 AI 界面和上下文，配置 VITE_AI_ASSISTANT_URL 后即可连接服务。"
    : noteState.loading
      ? "正在准备当前笔记和源码上下文…"
      : null;

  return {
    configured: client.configured,
    contextReady,
    contextSummary,
    inputValue,
    setInputValue,
    messages: chatState.messages,
    status: chatState.status,
    error: noteState.error?.message || chatState.error,
    notice,
    disabled: !client.configured || !contextReady || chatState.status === CHAT_STATUS.STREAMING,
    submit,
    stop,
    reset,
  };
}
