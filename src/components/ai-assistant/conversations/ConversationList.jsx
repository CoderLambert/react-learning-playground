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

function getMutationErrorCopy(operation, error) {
  const fallback = {
    rename: "重命名失败，请重试。",
    archive: "归档失败，请重试。",
    restore: "恢复失败，请重试。",
    delete: "删除失败，请重试。",
  }[operation] ?? "会话操作失败，请重试。";
  return error?.message ? `${fallback} ${error.message}` : fallback;
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
  const [mutationState, setMutationState] = useState({ pending: null, error: null });
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

  const clearMutationError = () => {
    setMutationState((current) => ({ ...current, error: null }));
  };

  const runMutation = async ({ operation, conversationId, action }) => {
    clearMutationError();
    setMutationState({ pending: { operation, conversationId }, error: null });
    try {
      await action();
      setMutationState({ pending: null, error: null });
      return true;
    } catch (error) {
      setMutationState({
        pending: null,
        error: {
          operation,
          conversationId,
          message: getMutationErrorCopy(operation, error),
        },
      });
      return false;
    }
  };

  const finishRename = (conversationId) => {
    setEditingId(null);
    setDraftTitle("");
    restoreRenameFocus(conversationId);
  };

  const startRename = (conversation) => {
    clearMutationError();
    setPendingDeleteId(null);
    setEditingId(conversation.id);
    setDraftTitle(conversation.title ?? "");
  };

  const cancelRename = (conversation) => {
    finishRename(conversation.id);
  };

  const commitRename = async (conversation) => {
    const title = draftTitle.trim();
    if (!title || title === conversation.title) {
      finishRename(conversation.id);
      return;
    }
    const succeeded = await runMutation({
      operation: "rename",
      conversationId: conversation.id,
      action: () => onRename?.(conversation.id, title),
    });
    if (succeeded) finishRename(conversation.id);
  };

  const startDelete = (conversationId) => {
    clearMutationError();
    setPendingDeleteId(conversationId);
    globalThis.requestAnimationFrame?.(() => {
      confirmDeleteButtonsRef.current.get(conversationId)?.focus();
    });
  };

  const cancelDelete = (conversationId) => {
    setPendingDeleteId(null);
    restoreDeleteFocus(conversationId);
  };

  const confirmDelete = async (conversationId) => {
    const succeeded = await runMutation({
      operation: "delete",
      conversationId,
      action: () => onDelete?.(conversationId),
    });
    if (!succeeded) return;
    setPendingDeleteId(null);
    globalThis.requestAnimationFrame?.(() => {
      if (newButtonRef.current) newButtonRef.current.focus();
      else listRef.current?.focus();
    });
  };

  const commitArchive = async (conversation) => {
    const nextArchived = !conversation.archived;
    await runMutation({
      operation: nextArchived ? "archive" : "restore",
      conversationId: conversation.id,
      action: () => onArchive?.(conversation.id, nextArchived),
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

      {mutationState.error ? (
        <p className="ai-conversation-list__mutation-error" role="alert">
          {mutationState.error.message}
        </p>
      ) : null}

      {conversations.length === 0 ? (
        <p className="ai-conversation-list__empty">{emptyMessage}</p>
      ) : (
        <ul>
          {conversations.map((conversation) => {
            const active = conversation.id === activeConversationId;
            const editing = editingId === conversation.id;
            const confirmingDelete = pendingDeleteId === conversation.id;
            const pendingOperation = mutationState.pending?.conversationId === conversation.id
              ? mutationState.pending.operation
              : null;
            const itemDisabled = disabled || Boolean(pendingOperation);
            return (
              <li key={conversation.id} data-active={active ? "true" : undefined} aria-busy={pendingOperation ? "true" : undefined}>
                {editing ? (
                  <form
                    className="ai-conversation-list__rename"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void commitRename(conversation);
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
                      onBlur={() => {
                        if (!pendingOperation) cancelRename(conversation);
                      }}
                      maxLength={120}
                      disabled={itemDisabled}
                    />
                  </form>
                ) : onSelect ? (
                  <button
                    type="button"
                    className="ai-conversation-list__select"
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelect?.(conversation.id)}
                    disabled={itemDisabled}
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
                    if (!confirmingDelete || event.key !== "Escape" || pendingOperation) return;
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
                      <span>{pendingOperation === "delete" ? "正在删除…" : "永久删除此会话？"}</span>
                      <button type="button" onClick={() => cancelDelete(conversation.id)} disabled={itemDisabled}>
                        取消
                      </button>
                      <button
                        ref={(node) => {
                          if (node) confirmDeleteButtonsRef.current.set(conversation.id, node);
                          else confirmDeleteButtonsRef.current.delete(conversation.id);
                        }}
                        type="button"
                        className="is-destructive"
                        onClick={() => void confirmDelete(conversation.id)}
                        disabled={itemDisabled}
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
                        disabled={itemDisabled || editing}
                      >
                        重命名
                      </button>
                      {onArchive ? (
                        <button type="button" onClick={() => void commitArchive(conversation)} disabled={itemDisabled}>
                          {pendingOperation === "archive"
                            ? "归档中…"
                            : pendingOperation === "restore"
                              ? "恢复中…"
                              : conversation.archived
                                ? "恢复"
                                : "归档"}
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
                          disabled={itemDisabled}
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