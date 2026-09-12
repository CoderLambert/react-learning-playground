import { useMemo } from "react";
import { ConversationList } from "./ConversationList.jsx";
import { useConversationWorkspace } from "./useConversationWorkspace.js";
import "./ConversationHistory.css";

export function ConversationHistory({
  conversations = [],
  activeConversationId = null,
  learningUnitId = null,
  learningUnitLabels = {},
  onSelect,
  onRename,
  onArchive,
  onDelete,
  disabled = false,
}) {
  const workspace = useConversationWorkspace({ conversations, learningUnitLabels });

  const labeledConversations = useMemo(
    () => conversations.map((conversation) => ({
      ...conversation,
      learningUnitLabel: learningUnitLabels[conversation.learningUnitId] ?? conversation.learningUnitId ?? "未知学习单元",
    })),
    [conversations, learningUnitLabels],
  );

  const groups = useMemo(() => {
    if (workspace.query.trim()) {
      const results = workspace.searchResults.map((result) => ({
        ...result.conversation,
        learningUnitLabel: result.learningUnitLabel,
        searchSnippet: result.snippet,
        matchedRole: result.matchedRole,
      }));
      return { current: results, archived: [], other: [], searching: true };
    }

    return {
      current: labeledConversations.filter((item) => item.learningUnitId === learningUnitId && !item.archived),
      archived: labeledConversations.filter((item) => item.learningUnitId === learningUnitId && item.archived),
      other: labeledConversations.filter((item) => item.learningUnitId !== learningUnitId),
      searching: false,
    };
  }, [labeledConversations, learningUnitId, workspace.query, workspace.searchResults]);

  const commonActions = {
    onSelect,
    onRename,
    onArchive,
    onDelete,
    onCopy: workspace.copyConversation,
    onExport: workspace.exportConversation,
    disabled,
  };

  return (
    <div className="ai-conversation-history">
      <div className="ai-conversation-history__summary">
        <strong>全部历史 · {conversations.length}</strong>
        <span>模型上下文仍只使用当前学习单元的当前会话。</span>
      </div>

      <div className="ai-conversation-history__search">
        <label htmlFor="ai-conversation-search">搜索学习记录</label>
        <div className="ai-conversation-history__search-row">
          <input
            id="ai-conversation-search"
            type="search"
            value={workspace.query}
            onChange={(event) => workspace.setQuery(event.target.value)}
            placeholder="搜索标题、问题或回答内容…"
            disabled={disabled}
          />
          {workspace.query ? (
            <button type="button" onClick={() => workspace.setQuery("")} disabled={disabled}>清除</button>
          ) : null}
        </div>
        {workspace.loading ? <small>正在索引会话内容…</small> : null}
        {workspace.storageMode === "memory" ? (
          <small>当前为内存存储模式，历史正文搜索可能只覆盖可读取的会话。</small>
        ) : null}
      </div>

      {workspace.notice ? (
        <div className="ai-conversation-history__notice" role="status">
          <span>{workspace.notice}</span>
          <button type="button" onClick={workspace.clearNotice}>关闭</button>
        </div>
      ) : null}
      {workspace.error ? (
        <div className="ai-conversation-history__error" role="alert">
          <span>{workspace.error}</span>
          <button type="button" onClick={() => void workspace.reload()}>重试</button>
        </div>
      ) : null}

      {groups.searching ? (
        <ConversationList
          conversations={groups.current}
          activeConversationId={activeConversationId}
          heading={`搜索结果 · ${groups.current.length}`}
          emptyMessage="没有找到匹配的会话。试试问题关键词、概念名或回答中的词语。"
          {...commonActions}
        />
      ) : (
        <>
          <ConversationList
            conversations={groups.current}
            activeConversationId={activeConversationId}
            heading={`当前学习单元 · ${groups.current.length}`}
            emptyMessage="当前学习单元还没有保存的会话。"
            {...commonActions}
          />
          {groups.archived.length > 0 ? (
            <ConversationList
              conversations={groups.archived}
              heading={`已归档 · ${groups.archived.length}`}
              {...commonActions}
            />
          ) : null}
          {groups.other.length > 0 ? (
            <ConversationList
              conversations={groups.other}
              heading={`其他学习单元 · ${groups.other.length}`}
              {...commonActions}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

export default ConversationHistory;
