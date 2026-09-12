import { useState } from "react";
import "./ConversationList.css";

function formatConversationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ConversationList({
  conversations = [],
  activeConversationId = null,
  heading = "会话",
  emptyMessage = "还没有保存的会话。",
  onNew,
  onSelect,
  onRename,
  onDelete,
  onArchive,
  onCopy,
  onExport,
  disabled = false,
  className = "",
}) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");

  const startRename = (conversation) => {
    setEditingId(conversation.id);
    setDraftTitle(conversation.title ?? "");
  };

  const commitRename = (conversation) => {
    const title = draftTitle.trim();
    setEditingId(null);
    setDraftTitle("");
    if (title && title !== conversation.title) onRename?.(conversation.id, title);
  };

  return (
    <nav className={`ai-conversation-list ${className}`.trim()} aria-label="AI 会话">
      <div className="ai-conversation-list__header">
        <strong>{heading}</strong>
        {onNew ? (
          <button type="button" onClick={() => onNew()} disabled={disabled}>
            新对话
          </button>
        ) : null}
      </div>

      {conversations.length === 0 ? (
        <p className="ai-conversation-list__empty">{emptyMessage}</p>
      ) : (
        <ul>
          {conversations.map((conversation) => {
            const active = conversation.id === activeConversationId;
            const editing = editingId === conversation.id;
            return (
              <li key={conversation.id} data-active={active ? "true" : undefined}>
                {editing ? (
                  <form
                    className="ai-conversation-list__rename"
                    onSubmit={(event) => {
                      event.preventDefault();
                      commitRename(conversation);
                    }}
                  >
                    <label className="sr-only" htmlFor={`conversation-title-${conversation.id}`}>重命名会话</label>
                    <input
                      id={`conversation-title-${conversation.id}`}
                      autoFocus
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setEditingId(null);
                          setDraftTitle("");
                        }
                      }}
                      onBlur={() => commitRename(conversation)}
                      maxLength={120}
                      disabled={disabled}
                    />
                  </form>
                ) : onSelect ? (
                  <button
                    type="button"
                    className="ai-conversation-list__select"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelect?.(conversation.id)}
                    disabled={disabled}
                  >
                    <span>{conversation.title || "新对话"}</span>
                    <small>
                      {conversation.learningUnitLabel ? `${conversation.learningUnitLabel} · ` : ""}
                      {formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt)}
                    </small>
                    {conversation.searchSnippet ? (
                      <span className="ai-conversation-list__snippet">
                        {conversation.matchedRole ? `${conversation.matchedRole === "user" ? "你" : "AI"}：` : ""}
                        {conversation.searchSnippet}
                      </span>
                    ) : null}
                  </button>
                ) : (
                  <div className="ai-conversation-list__select is-static">
                    <span>{conversation.title || "新对话"}</span>
                    <small>
                      {conversation.learningUnitLabel ? `${conversation.learningUnitLabel} · ` : ""}
                      {formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt)}
                    </small>
                  </div>
                )}

                <div className="ai-conversation-list__actions" aria-label={`${conversation.title || "新对话"} 操作`}>
                  {onCopy ? (
                    <button type="button" onClick={() => onCopy(conversation)} disabled={disabled}>复制</button>
                  ) : null}
                  {onExport ? (
                    <details className="ai-conversation-list__export">
                      <summary aria-label={`导出 ${conversation.title || "新对话"}`}>导出</summary>
                      <div>
                        <button type="button" onClick={() => onExport(conversation, "markdown")} disabled={disabled}>Markdown</button>
                        <button type="button" onClick={() => onExport(conversation, "json")} disabled={disabled}>JSON</button>
                      </div>
                    </details>
                  ) : null}
                  <button type="button" onClick={() => startRename(conversation)} disabled={disabled || editing}>重命名</button>
                  {onArchive ? (
                    <button type="button" onClick={() => onArchive(conversation.id, !conversation.archived)} disabled={disabled}>
                      {conversation.archived ? "恢复" : "归档"}
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button type="button" onClick={() => onDelete(conversation.id)} disabled={disabled}>删除</button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

export default ConversationList;
