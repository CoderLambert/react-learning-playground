import { useEffect, useRef, useState } from "react";
import {
  copyConversationMarkdown,
  exportConversationJson,
  exportConversationMarkdown,
} from "../../../ai/conversations/exportConversation.js";

export function ConversationExportActions({
  messages = [],
  contextSummary = null,
  providerLabel = null,
  modelLabel = null,
  title = "AI 学习会话",
  filePrefix = "ai-learning-conversation",
  disabled = false,
}) {
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const hasMessages = messages.some((message) => (
    (message?.role === "user" || message?.role === "assistant") &&
    typeof message?.content === "string" && message.content.trim()
  ));
  const actionsDisabled = disabled || !hasMessages;

  const options = {
    messages,
    contextSummary,
    providerLabel,
    modelLabel,
    title,
    filePrefix,
  };

  const showNotice = (message) => {
    setNotice(message);
    if (timerRef.current) globalThis.clearTimeout?.(timerRef.current);
    timerRef.current = globalThis.setTimeout?.(() => {
      setNotice("");
      timerRef.current = null;
    }, 1800);
  };

  useEffect(() => () => {
    if (timerRef.current) globalThis.clearTimeout?.(timerRef.current);
  }, []);

  const run = async (action, successMessage) => {
    try {
      await action();
      setOpen(false);
      showNotice(successMessage);
    } catch (error) {
      showNotice(error?.message || "会话操作失败");
    }
  };

  return (
    <div className="ai-conversation-export-actions">
      <div className={`ai-conversation-popover ai-conversation-export-popover ${open ? "is-open" : ""}`.trim()}>
        <button
          type="button"
          className="ai-conversation-popover__trigger"
          aria-label="会话导出与复制"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((current) => !current)}
        >
          导出
        </button>
        {open ? (
          <div className="ai-conversation-export-popover__panel" role="group" aria-label="当前会话操作">
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={() => void run(() => copyConversationMarkdown(options), "已复制整段会话")}
            >
              复制整段会话
            </button>
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={() => void run(() => exportConversationMarkdown(options), "已导出 Markdown")}
            >
              导出 Markdown
            </button>
            <button
              type="button"
              disabled={actionsDisabled}
              onClick={() => void run(() => exportConversationJson(options), "已导出 JSON")}
            >
              导出 JSON
            </button>
          </div>
        ) : null}
      </div>
      <span
        className="ai-conversation-export-actions__notice"
        role="status"
        aria-label="会话操作状态"
        aria-live="polite"
      >
        {notice}
      </span>
    </div>
  );
}

export default ConversationExportActions;
