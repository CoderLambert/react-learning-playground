import { useCallback, useEffect, useId, useRef, useState } from "react";
import MarkdownRender from "markstream-react";
import "markstream-react/index.css";
import {
  buildSourceCitationPreview,
  extractSourceCitations,
} from "../../ai/citations/sourceCitation.js";
import { subscribeLearningActions } from "../../learning-actions";
import { AiSourcePreviewProvider } from "./citations/AiSourceLink.jsx";
import { SourceCitation } from "./citations/SourceCitation.js";
import { AI_CODE_EXPLAIN_EVENT } from "./code/aiCodeExplainEvent.js";
import { AI_MARKDOWN_CUSTOM_ID } from "./code/registerAiCodeBlock.js";
import {
  ASSISTANT_FOLLOW_UP_ACTIONS,
  buildAssistantFollowUpPrompt,
  buildCitationExplainPrompt,
  buildCodeExplainPrompt,
  copyText,
  shouldOfferContinue,
} from "./message-actions/aiTutorMessageActions.js";
import {
  isTranscriptScrollKey,
  resolveAutoFollowState,
} from "./streaming/aiTutorScrollBehavior.js";
import "./citations/SourceCitation.css";
import "./AiAssistant.css";

const DEFAULT_SUGGESTIONS = [
  "解释当前 Demo 最重要的 React 概念",
  "结合源码指出最值得观察的执行过程",
  "这个实现有哪些常见误区或边界？",
];

const FINISH_REASON_COPY = Object.freeze({
  length: "模型达到 provider token 上限，回答可能未完整结束。",
  output_limit: "模型达到输出上限，回答可能未完整结束。",
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

function MessageActions({ role, finishReason, disabled, onCopy, onFollowUp }) {
  return (
    <div className="ai-assistant-message-actions" aria-label={`${role === "assistant" ? "AI 回答" : "用户消息"}操作`}>
      <button type="button" onClick={onCopy} disabled={disabled}>复制</button>
      {role === "assistant" && !disabled ? (
        <>
          {ASSISTANT_FOLLOW_UP_ACTIONS.map((action) => (
            <button key={action.id} type="button" onClick={() => onFollowUp?.(action.id)}>
              {action.label}
            </button>
          ))}
          {shouldOfferContinue(finishReason) ? (
            <button type="button" onClick={() => onFollowUp?.("continue")}>继续回答</button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Message({
  message,
  isStreaming,
  onCitationOpen,
  onCitationExplain,
  sources,
  onCopy,
  onFollowUp,
  disabled,
}) {
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
                <span
                  className="ai-assistant-source-citation-actions"
                  key={`${citation.fileName}:${citation.startLine}-${citation.endLine}`}
                >
                  <SourceCitation
                    fileName={citation.fileName}
                    startLine={citation.startLine}
                    endLine={citation.endLine}
                    label={citation.label}
                    preview={buildSourceCitationPreview(citation, sources)}
                    onOpen={onCitationOpen}
                  />
                  {!isStreaming ? (
                    <button
                      type="button"
                      className="ai-assistant-citation-explain"
                      onClick={() => onCitationExplain?.(citation)}
                      disabled={disabled}
                      aria-label={`解释引用 ${citation.fileName} 第 ${citation.startLine} 到 ${citation.endLine} 行`}
                    >
                      解释引用
                    </button>
                  ) : null}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {finishReasonCopy ? <p className="ai-assistant-finish-reason">{finishReasonCopy}</p> : null}
        {content ? (
          <MessageActions
            role={role}
            finishReason={finishReason}
            disabled={disabled || isStreaming}
            onCopy={() => onCopy?.(content)}
            onFollowUp={onFollowUp}
          />
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
          <button key={suggestion} type="button" onClick={() => onSuggestionSelect?.(suggestion)} disabled={disabled}>
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
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);
  const userScrollIntentRef = useRef(false);
  const [isFollowingLatest, setIsFollowingLatest] = useState(true);
  const [actionNotice, setActionNotice] = useState("");
  const noticeTimerRef = useRef(null);
  const isStreaming = status === "streaming" || status === "loading";
  const isSubmitDisabled = disabled || isStreaming || !inputValue.trim();
  const statusText = isStreaming ? "AI 正在生成回答" : status === "error" ? "AI 回答失败" : "";

  const showActionNotice = useCallback((message) => {
    setActionNotice(message);
    if (noticeTimerRef.current) globalThis.clearTimeout?.(noticeTimerRef.current);
    noticeTimerRef.current = globalThis.setTimeout?.(() => {
      setActionNotice("");
      noticeTimerRef.current = null;
    }, 1800);
  }, []);

  useEffect(() => () => {
    if (noticeTimerRef.current) globalThis.clearTimeout?.(noticeTimerRef.current);
  }, []);

  useEffect(() => subscribeLearningActions((detail) => {
    if (!detail?.prompt) return;
    onInputChange?.(detail.prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  }), [onInputChange]);

  const fillTutorPrompt = useCallback((prompt, noticeMessage) => {
    if (!prompt || disabled || isStreaming) return false;
    onInputChange?.(prompt);
    inputRef.current?.focus();
    showActionNotice(noticeMessage);
    return true;
  }, [disabled, isStreaming, onInputChange, showActionNotice]);

  useEffect(() => {
    if (typeof globalThis.addEventListener !== "function") return undefined;

    const handleCodeExplain = (event) => {
      try {
        const prompt = buildCodeExplainPrompt(event?.detail);
        fillTutorPrompt(prompt, "已填入代码解释问题");
      } catch (actionError) {
        showActionNotice(actionError?.message || "无法生成代码解释问题");
      }
    };

    globalThis.addEventListener(AI_CODE_EXPLAIN_EVENT, handleCodeExplain);
    return () => globalThis.removeEventListener?.(AI_CODE_EXPLAIN_EVENT, handleCodeExplain);
  }, [fillTutorPrompt, showActionNotice]);

  const scrollToLatest = useCallback((behavior = "smooth") => {
    const element = transcriptRef.current;
    if (!element) return;
    userScrollIntentRef.current = false;
    setIsFollowingLatest(true);
    element.scrollTo?.({ top: element.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (!isFollowingLatest) return;
    scrollToLatest(isStreaming ? "auto" : "smooth");
  }, [messages, isStreaming, isFollowingLatest, scrollToLatest]);

  const markTranscriptUserScrollIntent = () => {
    userScrollIntentRef.current = true;
  };

  const handleTranscriptKeyDown = (event) => {
    if (isTranscriptScrollKey(event.key)) markTranscriptUserScrollIntent();
  };

  const handleTranscriptScroll = () => {
    const element = transcriptRef.current;
    if (!element) return;
    const nextFollowing = resolveAutoFollowState({
      current: isFollowingLatest,
      userInitiated: userScrollIntentRef.current,
      metrics: element,
    });
    setIsFollowingLatest(nextFollowing);
    if (nextFollowing) userScrollIntentRef.current = false;
  };

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

  const handleMessageCopy = async (content) => {
    try {
      await copyText(content);
      showActionNotice("已复制消息");
    } catch (copyError) {
      showActionNotice(copyError?.message || "复制失败，请手动复制");
    }
  };

  const handleFollowUp = (actionId) => {
    try {
      const prompt = buildAssistantFollowUpPrompt(actionId);
      fillTutorPrompt(prompt, "已填入后续问题");
    } catch (actionError) {
      showActionNotice(actionError?.message || "无法生成后续问题");
    }
  };

  const handleCitationExplain = (citation) => {
    try {
      const prompt = buildCitationExplainPrompt(citation);
      fillTutorPrompt(prompt, "已填入引用解释问题");
    } catch (actionError) {
      showActionNotice(actionError?.message || "无法生成引用解释问题");
    }
  };

  const handleStop = () => {
    if (!isStreaming || !onStop) return;
    onStop();
    showActionNotice("已请求停止生成");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const sourcePreviewEntries = Array.isArray(contextSummary?.sources) ? contextSummary.sources : [];
  const visibleNotice = actionNotice || notice;

  return (
    <section className={`ai-assistant ${className}`.trim()} aria-label="AI 学习助手" data-ai-status={status}>
      <header className="ai-assistant-context">
        <div>
          <strong>当前学习上下文</strong>
          {(providerLabel || modelLabel) && (
            <span className="ai-assistant-provider">{[providerLabel, modelLabel].filter(Boolean).join(" · ")}</span>
          )}
        </div>
        <ContextChips contextSummary={contextSummary} />
        {settings ? <div className="ai-assistant-settings-slot">{settings}</div> : null}
      </header>

      {conversationNavigation ? <div className="ai-assistant-conversation-navigation">{conversationNavigation}</div> : null}

      <div className="ai-assistant-transcript-shell">
        <div
          ref={transcriptRef}
          className="ai-assistant-transcript"
          role="log"
          aria-label="AI 对话记录"
          aria-live="off"
          tabIndex={0}
          onScroll={handleTranscriptScroll}
          onWheel={markTranscriptUserScrollIntent}
          onTouchMove={markTranscriptUserScrollIntent}
          onKeyDown={handleTranscriptKeyDown}
        >
          {messages.length === 0 ? (
            <EmptyState suggestions={suggestions} onSuggestionSelect={handleSuggestion} disabled={disabled || isStreaming} />
          ) : (
            messages.map((message, index) => (
              <Message
                key={message.id ?? `${message.role ?? "message"}-${index}`}
                message={message}
                isStreaming={Boolean(message.streaming) || (isStreaming && index === messages.length - 1 && message.role !== "user")}
                onCitationOpen={onCitationOpen}
                onCitationExplain={handleCitationExplain}
                sources={sourcePreviewEntries}
                onCopy={handleMessageCopy}
                onFollowUp={handleFollowUp}
                disabled={disabled}
              />
            ))
          )}
        </div>
        {!isFollowingLatest && messages.length > 0 ? (
          <button type="button" className="ai-assistant-jump-latest" onClick={() => scrollToLatest("smooth")}>
            回到最新消息
          </button>
        ) : null}
      </div>

      <div id={statusId} className="ai-assistant-live-status" role="status" aria-live="polite" aria-atomic="true">{statusText}</div>

      {visibleNotice ? <div id={noticeId} className="ai-assistant-notice" role="status">{visibleNotice}</div> : null}

      {error ? (
        <div id={errorId} className="ai-assistant-error" role="alert">
          <span>{typeof error === "string" ? error : error.message ?? "请求失败，请稍后重试。"}</span>
          {onRetry ? <button type="button" onClick={onRetry} disabled={disabled || isStreaming}>重试</button> : null}
        </div>
      ) : null}

      {contextMeter ? <div className="ai-assistant-context-meter-slot">{contextMeter}</div> : null}

      <form className="ai-assistant-composer" onSubmit={handleSubmit}>
        <label htmlFor={inputId}>向 AI 助手提问</label>
        <textarea
          ref={inputRef}
          id={inputId}
          value={inputValue}
          onChange={(event) => onInputChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
          aria-describedby={[statusId, visibleNotice ? noticeId : null, error ? errorId : null].filter(Boolean).join(" ")}
        />
        <div className="ai-assistant-composer-footer">
          <span className="ai-assistant-shortcut">Enter 发送 · Shift+Enter 换行</span>
          <div className="ai-assistant-actions">
            {onReset ? (
              <button type="button" className="ai-assistant-secondary-button" onClick={onReset} disabled={disabled || isStreaming || messages.length === 0}>新对话</button>
            ) : null}
            {isStreaming && onStop ? (
              <button type="button" className="ai-assistant-stop-button" onClick={handleStop}>停止</button>
            ) : (
              <button type="submit" className="ai-assistant-send-button" disabled={isSubmitDisabled}>发送</button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

export default AiAssistant;
