import { useEffect, useId } from "react";
import MarkdownRender from "markstream-react";
import "markstream-react/index.css";
import {
  buildSourceCitationPreview,
  extractSourceCitations,
} from "../../ai/citations/sourceCitation.js";
import { LEARNING_ACTION_EVENT } from "../../learning-actions/learningActions.js";
import { AiSourcePreviewProvider } from "./citations/AiSourceLink.jsx";
import { SourceCitation } from "./citations/SourceCitation.js";
import { AI_MARKDOWN_CUSTOM_ID } from "./code/registerAiCodeBlock.js";
import "./citations/SourceCitation.css";
import "./AiAssistant.css";

const DEFAULT_SUGGESTIONS = [
  "解释当前 Demo 最重要的 React 概念",
  "结合源码指出最值得观察的执行过程",
  "这个实现有哪些常见误区或边界？",
];

const FINISH_REASON_COPY = Object.freeze({
  length: "模型达到 provider token 上限，回答可能未完整结束。",
  user_abort: "回答已由你停止。",
  error: "回答因错误中断。",
});

function normalizeContextItems(contextSummary) {
  if (!contextSummary) return [];

  if (Array.isArray(contextSummary)) {
    return contextSummary
      .filter(Boolean)
      .map((item, index) => {
        if (typeof item === "string") {
          return { key: `context-${index}`, label: item, kind: "context" };
        }

        return {
          key: item.key ?? `${item.kind ?? "context"}-${item.label ?? index}`,
          label: item.label ?? item.name ?? "当前上下文",
          kind: item.kind ?? "context",
          active: Boolean(item.active),
        };
      });
  }

  const items = [];
  if (contextSummary.note) {
    items.push({ key: "note", label: contextSummary.note, kind: "note" });
  }

  const sources = Array.isArray(contextSummary.sources)
    ? contextSummary.sources
    : contextSummary.source
      ? [contextSummary.source]
      : [];

  for (const source of sources) {
    const label = typeof source === "string" ? source : source?.name ?? source?.label;
    if (!label) continue;
    items.push({
      key: `source-${label}`,
      label,
      kind: "source",
      active: label === contextSummary.activeSourceFile,
    });
  }

  if (
    contextSummary.activeSourceFile &&
    !items.some((item) => item.label === contextSummary.activeSourceFile)
  ) {
    items.push({
      key: "active-source",
      label: contextSummary.activeSourceFile,
      kind: "source",
      active: true,
    });
  }

  return items;
}

function ContextChips({ contextSummary }) {
  const items = normalizeContextItems(contextSummary);

  if (items.length === 0) {
    return <span className="ai-assistant-context-empty">未提供学习上下文</span>;
  }

  return (
    <div className="ai-assistant-context-list" aria-label="AI 当前参考内容">
      {items.map((item) => (
        <span
          key={item.key}
          className={`ai-assistant-context-chip ${item.active ? "is-active" : ""}`.trim()}
          data-context-kind={item.kind}
          title={item.active ? `${item.label}（当前源码）` : item.label}
        >
          <span aria-hidden="true">
            {item.kind === "note" ? "笔记" : item.kind === "source" ? "源码" : "上下文"}
          </span>
          <strong>{item.label}</strong>
          {item.active ? <em>当前</em> : null}
        </span>
      ))}
    </div>
  );
}

function AssistantMarkdown({ content, isStreaming, sources }) {
  return (
    <div className="ai-assistant-markdown">
      <AiSourcePreviewProvider sources={sources}>
        <MarkdownRender
          customId={AI_MARKDOWN_CUSTOM_ID}
          mode="chat"
          content={content}
          final={!isStreaming}
          htmlPolicy="escape"
          typewriter={isStreaming}
          smoothStreaming={isStreaming ? "auto" : false}
          fade={!isStreaming}
          showTooltips
          codeBlockOptions={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.6,
            maxHeight: 420,
            padding: 12,
            tabSize: 2,
          }}
        />
      </AiSourcePreviewProvider>
    </div>
  );
}

function Message({ message, isStreaming, onCitationOpen, sources }) {
  const role = message?.role === "user" ? "user" : "assistant";
  const content = typeof message?.content === "string" ? message.content : "";
  const isAssistant = role === "assistant";
  const finishReason = isAssistant
    ? message?.finishReason ?? message?.metadata?.finishReason ?? null
    : null;
  const finishReasonCopy = finishReason ? FINISH_REASON_COPY[finishReason] : null;
  const citations = isAssistant && content ? extractSourceCitations(content, { dedupe: true }) : [];

  return (
    <article
      className={`ai-assistant-message is-${role} ${isStreaming ? "is-streaming" : ""}`.trim()}
      data-message-role={role}
      data-finish-reason={finishReason || undefined}
      aria-busy={isAssistant && isStreaming ? "true" : undefined}
    >
      <div className="ai-assistant-message-avatar" aria-hidden="true">
        {isAssistant ? "AI" : "你"}
      </div>
      <div className="ai-assistant-message-body">
        <header className="ai-assistant-message-header">
          <strong>{isAssistant ? "AI 学习助手" : "你"}</strong>
          {isAssistant && isStreaming ? <span>生成中</span> : null}
        </header>
        <div className="ai-assistant-message-content">
          {content ? (
            isAssistant ? (
              <AssistantMarkdown content={content} isStreaming={isStreaming} sources={sources} />
            ) : (
              <p className="ai-assistant-user-copy">{content}</p>
            )
          ) : isStreaming ? (
            <span className="ai-assistant-thinking">
              <span aria-hidden="true" className="ai-assistant-thinking-dots"><i /><i /><i /></span>
              正在组织回答
            </span>
          ) : null}
          {citations.length > 0 ? (
            <div className="ai-assistant-source-citations" aria-label="回答引用的源码">
              {citations.map((citation) => (
                <SourceCitation
                  key={`${citation.fileName}:${citation.startLine}-${citation.endLine}`}
                  fileName={citation.fileName}
                  startLine={citation.startLine}
                  endLine={citation.endLine}
                  label={citation.label}
                  preview={buildSourceCitationPreview(citation, sources)}
                  onOpen={onCitationOpen}
                />
              ))}
            </div>
          ) : null}
        </div>
        {finishReasonCopy ? (
          <p className="ai-assistant-finish-reason">
            {finishReasonCopy}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function EmptyState({ suggestions, onSuggestionSelect, disabled }) {
  const resolvedSuggestions = suggestions?.length ? suggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="ai-assistant-empty-state">
      <div className="ai-assistant-empty-icon" aria-hidden="true">✦</div>
      <strong>结合当前笔记和源码提问</strong>
      <p>问题越具体，越容易得到针对当前 Demo 的解释。</p>
      <div className="ai-assistant-suggestions" aria-label="建议问题">
        {resolvedSuggestions.slice(0, 4).map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionSelect?.(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiAssistant({
  contextSummary,
  messages = [],
  status = "idle",
  inputValue = "",
  onInputChange,
  onSubmit,
  onReset,
  onStop,
  onRetry,
  onSuggestionSelect,
  onCitationOpen,
  disabled = false,
  error = null,
  notice = null,
  suggestions,
  providerLabel,
  modelLabel,
  settings = null,
  conversationNavigation = null,
  contextMeter = null,
  placeholder = "针对当前笔记和源码提问…",
  className = "",
}) {
  const inputId = useId();
  const errorId = useId();
  const noticeId = useId();
  const statusId = useId();
  const isStreaming = status === "streaming" || status === "loading";
  const isSubmitDisabled = disabled || isStreaming || !inputValue.trim();
  const statusText = isStreaming
    ? "AI 正在生成回答"
    : status === "error"
      ? "AI 回答失败"
      : "";

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleLearningAction = (event) => {
      const prompt = event?.detail?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) return;
      onInputChange?.(prompt);
      requestAnimationFrame(() => {
        const input = document.getElementById(inputId);
        input?.focus();
        if (input instanceof HTMLTextAreaElement) {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
    };
    window.addEventListener(LEARNING_ACTION_EVENT, handleLearningAction);
    return () => window.removeEventListener(LEARNING_ACTION_EVENT, handleLearningAction);
  }, [inputId, onInputChange]);

  const submit = () => {
    const question = inputValue.trim();
    if (!question || disabled || isStreaming) return;
    onSubmit?.(question);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent?.isComposing) return;
    event.preventDefault();
    submit();
  };

  const handleSuggestion = (suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
      return;
    }
    onInputChange?.(suggestion);
  };

  const sourcePreviewEntries = Array.isArray(contextSummary?.sources) ? contextSummary.sources : [];

  return (
    <section
      className={`ai-assistant ${className}`.trim()}
      aria-label="AI 学习助手"
      data-ai-status={status}
    >
      <header className="ai-assistant-context">
        <div>
          <strong>当前学习上下文</strong>
          {(providerLabel || modelLabel) && (
            <span className="ai-assistant-provider">
              {[providerLabel, modelLabel].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
        <ContextChips contextSummary={contextSummary} />
        {settings ? <div className="ai-assistant-settings-slot">{settings}</div> : null}
      </header>

      {conversationNavigation ? (
        <div className="ai-assistant-conversation-navigation">{conversationNavigation}</div>
      ) : null}

      <div
        className="ai-assistant-transcript"
        role="log"
        aria-label="AI 对话记录"
        aria-live="off"
      >
        {messages.length === 0 ? (
          <EmptyState
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestion}
            disabled={disabled || isStreaming}
          />
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id ?? `${message.role ?? "message"}-${index}`}
              message={message}
              isStreaming={Boolean(message.streaming) || (isStreaming && index === messages.length - 1 && message.role !== "user")}
              onCitationOpen={onCitationOpen}
              sources={sourcePreviewEntries}
            />
          ))
        )}
      </div>

      <div id={statusId} className="ai-assistant-live-status" role="status" aria-live="polite" aria-atomic="true">
        {statusText}
      </div>

      {notice ? (
        <div id={noticeId} className="ai-assistant-notice" role="status">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div id={errorId} className="ai-assistant-error" role="alert">
          <span>{typeof error === "string" ? error : error.message ?? "请求失败，请稍后重试。"}</span>
          {onRetry ? (
            <button type="button" onClick={onRetry} disabled={disabled || isStreaming}>
              重试
            </button>
          ) : null}
        </div>
      ) : null}

      {contextMeter ? <div className="ai-assistant-context-meter-slot">{contextMeter}</div> : null}

      <form className="ai-assistant-composer" onSubmit={handleSubmit}>
        <label htmlFor={inputId}>向 AI 助手提问</label>
        <textarea
          id={inputId}
          value={inputValue}
          onChange={(event) => onInputChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
          aria-describedby={[statusId, notice ? noticeId : null, error ? errorId : null].filter(Boolean).join(" ")}
        />
        <div className="ai-assistant-composer-footer">
          <span className="ai-assistant-shortcut">Enter 发送 · Shift+Enter 换行</span>
          <div className="ai-assistant-actions">
            {onReset ? (
              <button
                type="button"
                className="ai-assistant-secondary-button"
                onClick={onReset}
                disabled={disabled || isStreaming || messages.length === 0}
              >
                新对话
              </button>
            ) : null}
            {isStreaming && onStop ? (
              <button type="button" className="ai-assistant-stop-button" onClick={onStop}>
                停止
              </button>
            ) : (
              <button type="submit" className="ai-assistant-send-button" disabled={isSubmitDisabled}>
                发送
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

export default AiAssistant;
