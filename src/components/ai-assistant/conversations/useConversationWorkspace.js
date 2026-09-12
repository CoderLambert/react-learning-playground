import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ConversationRepository,
  copyTextToClipboard,
  createConversationFilename,
  createConversationSearchDocument,
  createConversationStore,
  downloadTextFile,
  searchConversationDocuments,
  serializeConversationAsJson,
  serializeConversationAsMarkdown,
  serializeConversationAsReadableText,
} from "../../../ai/conversations/index.js";

function resolveLearningUnitLabel(conversation, labels) {
  return labels?.[conversation.learningUnitId] ?? conversation.learningUnitId ?? "未知学习单元";
}

export function useConversationWorkspace({ conversations = [], learningUnitLabels = {} } = {}) {
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [storageMode, setStorageMode] = useState("initializing");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadWorkspace = useCallback(async () => {
    if (!conversations.length) {
      setDocuments([]);
      setStorageMode("ready");
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const store = await createConversationStore();
      const repository = new ConversationRepository(store);
      setStorageMode(store.mode);
      const next = await Promise.all(conversations.map(async (conversation) => {
        let messages = [];
        try {
          messages = await repository.listMessages(conversation.id);
        } catch {
          messages = [];
        }
        return createConversationSearchDocument({
          conversation,
          messages,
          learningUnitLabel: resolveLearningUnitLabel(conversation, learningUnitLabels),
        });
      }));
      setDocuments(next);
      return next;
    } catch (loadError) {
      setError(loadError?.message || "无法读取会话内容");
      const metadataOnly = conversations.map((conversation) => createConversationSearchDocument({
        conversation,
        messages: [],
        learningUnitLabel: resolveLearningUnitLabel(conversation, learningUnitLabels),
      }));
      setDocuments(metadataOnly);
      return metadataOnly;
    } finally {
      setLoading(false);
    }
  }, [conversations, learningUnitLabels]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const searchResults = useMemo(
    () => searchConversationDocuments(documents, query),
    [documents, query],
  );

  const getDocument = useCallback(async (conversation) => {
    const cached = documents.find((item) => item.conversation.id === conversation.id);
    if (cached?.messages?.length) return cached;
    const store = await createConversationStore();
    const repository = new ConversationRepository(store);
    const messages = await repository.listMessages(conversation.id);
    return createConversationSearchDocument({
      conversation,
      messages,
      learningUnitLabel: resolveLearningUnitLabel(conversation, learningUnitLabels),
    });
  }, [documents, learningUnitLabels]);

  const copyConversation = useCallback(async (conversation) => {
    try {
      const document = await getDocument(conversation);
      await copyTextToClipboard(serializeConversationAsReadableText({
        conversation: document.conversation,
        messages: document.messages,
        learningUnitLabel: document.learningUnitLabel,
      }));
      setNotice("已复制整个会话");
      setError(null);
      return true;
    } catch (actionError) {
      setError(actionError?.message || "复制会话失败");
      return false;
    }
  }, [getDocument]);

  const exportConversation = useCallback(async (conversation, format) => {
    try {
      const document = await getDocument(conversation);
      const json = format === "json";
      const content = json
        ? serializeConversationAsJson({
            conversation: document.conversation,
            messages: document.messages,
            learningUnitLabel: document.learningUnitLabel,
          })
        : serializeConversationAsMarkdown({
            conversation: document.conversation,
            messages: document.messages,
            learningUnitLabel: document.learningUnitLabel,
          });
      downloadTextFile({
        content,
        filename: createConversationFilename({ conversation, extension: json ? "json" : "md" }),
        mimeType: json ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8",
      });
      setNotice(`已导出 ${json ? "JSON" : "Markdown"}`);
      setError(null);
      return true;
    } catch (actionError) {
      setError(actionError?.message || "导出会话失败");
      return false;
    }
  }, [getDocument]);

  return {
    query,
    setQuery,
    searchResults,
    loading,
    storageMode,
    error,
    notice,
    clearNotice: () => setNotice(null),
    reload: loadWorkspace,
    copyConversation,
    exportConversation,
  };
}
