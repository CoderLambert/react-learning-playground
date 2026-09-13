import { useRef, useState } from "react";
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
  disabled = false,
  className = "",
}) {
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const renameButtonsRef = useRef(new Map());
  const deleteButtonsRef = useRef(new Map());
  const confirmDeleteButtonsRef = useRef(new Map());
  const newButtonRef = useRef(null);
  const listRef = useRef(null);

  const restoreRenameFocus = (conversationId) => {
    globalThis.requestAnimationFrame?.(() => {
      renameButtonsRef.current.get(conversationId)?.focus();
    });
  };

  const restoreDeleteFocus = (conversationId) => {
    globalThis.requestAnimationFrame?.(() => {
      deleteButtonsRef.current.get(conversationId)?.focus();
    });
  };

  const finishRename = (conversationId) => {
    setEditingId(null);
    setDraftTitle("");
    restoreRenameFocus(conversationId);
  };

  const startRename = (conversation) => {
    setPendingDeleteId(null);
    setEditingId(conversation.id);
    setDraftTitle(conversation.title ?? "");
  };

  const cancelRename = (conversation) => {
    finishRename(conversation.id);
  };

  const commitRename = (conversation) => {
    const title = draftTitle.trim();
    finishRename(conversation.id);
    if (title && title !== conversation.title) onRename?.(conversation.id, title);
  };

  const startDelete = (conversationId) => {
    setPendingDeleteId(conversationId);
    globalThis.requestAnimationFrame?.(() => {
      confirmDeleteButtonsRef.current.get(conversationId)?.focus();
    });
  };

  const cancelDelete = (conversationId) => {
    setPendingDeleteId(null);
    restoreDeleteFocus(conversationId);
  };

  const confirmDelete = (conversationId) => {
    setPendingDeleteId(null);
    onDelete?.(conversationId);
    globalThis.requestAnimationFrame?.(() => {
      if (newButtonRef.current) newButtonRef.current.focus();
      else listRef.current?.focus();
    });
  };

  return (
    <nav
      ref={listRef}
      className={`ai-conversation-list ${className}`.trim()}
      aria-label="AI 会话"
      tabIndex={onNew ? undefined : -1}
    >
      <div className="ai-conversation-list__header">
        <strong>{heading}</strong>
        {onNew ? (
          <button ref={newButtonRef} type="button" onClick={() => onNew()} disabled={disabled}>
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
            const confirmingDelete = pendingDeleteId === conversation.id;
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
                        if (event.key !== "Escape") return;
                        event.preventDefault();
                        event.stopPropagation();
                        cancelRename(conversation);
                      }}
                      onBlur={() => cancelRename(conversation)}
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

                <div
                  className="ai-conversation-list__actions"
                  aria-label={`${conversation.title || "新对话"} 操作`}
                  onKeyDown={(event) => {
                    if (!confirmingDelete || event.key !== "Escape") return;
                    event.preventDefault();
                    event.stopPropagation();
                    cancelDelete(conversation.id);
                  }}
                >
                  {confirmingDelete ? (
                    <div
                      className="ai-conversation-list__delete-confirmation"
                      role="group"
                      aria-label={`确认删除 ${conversation.title || "新对话"}`}
                    >
                      <span>永久删除此会话？</span>
                      <button type="button" onClick={() => cancelDelete(conversation.id)} disabled={disabled}>
                        取消
                      </button>
                      <button
                        ref={(node) => {
                          if (node) confirmDeleteButtonsRef.current.set(conversation.id, node);
                          else confirmDeleteButtonsRef.current.delete(conversation.id);
                        }}
                        type="button"
                        className="is-destructive"
                        onClick={() => confirmDelete(conversation.id)}
                        disabled={disabled}
                      >
                        确认删除
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        ref={(node) => {
                          if (node) renameButtonsRef.current.set(conversation.id, node);
                          else renameButtonsRef.current.delete(conversation.id);
                        }}
                        type="button"
                        onClick={() => startRename(conversation)}
                        disabled={disabled || editing}
                      >
                        重命名
                      </button>
                      {onArchive ? (
                        <button type="button" onClick={() => onArchive(conversation.id, !conversation.archived)} disabled={disabled}>
                          {conversation.archived ? "恢复" : "归档"}
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          ref={(node) => {
                            if (node) deleteButtonsRef.current.set(conversation.id, node);
                            else deleteButtonsRef.current.delete(conversation.id);
                          }}
                          type="button"
                          onClick={() => startDelete(conversation.id)}
                          disabled={disabled}
                        >
                          删除
                        </button>
                      ) : null}
                    </>
                  )}
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
