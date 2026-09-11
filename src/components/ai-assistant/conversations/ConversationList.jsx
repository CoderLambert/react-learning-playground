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
  onNew,
  onSelect,
  onRename,
  onDelete,
  onArchive,
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
        <strong>会话</strong>
        <button type="button" onClick={() => onNew?.()} disabled={disabled}>
          新对话
        </button>
      </div>

      {conversations.length === 0 ? (
        <p className="ai-conversation-list__empty">还没有保存的会话。</p>
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
                      onBlur={() => commitRename(conversation)}
                      maxLength={120}
                      disabled={disabled}
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className="ai-conversation-list__select"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelect?.(conversation.id)}
                    disabled={disabled}
                  >
                    <span>{conversation.title || "新对话"}</span>
                    <small>{formatConversationTime(conversation.lastMessageAt ?? conversation.updatedAt)}</small>
                  </button>
                )}

                <div className="ai-conversation-list__actions" aria-label={`${conversation.title || "新对话"} 操作`}>
                  <button type="button" onClick={() => startRename(conversation)} disabled={disabled || editing}>重命名</button>
                  {onArchive ? (
                    <button type="button" onClick={() => onArchive(conversation.id)} disabled={disabled}>归档</button>
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
