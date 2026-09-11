import { useMemo } from "react";
import { ConversationList } from "./ConversationList.jsx";
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
  const { current, archived, other } = useMemo(() => {
    const withLabels = conversations.map((conversation) => ({
      ...conversation,
      learningUnitLabel: learningUnitLabels[conversation.learningUnitId] ?? conversation.learningUnitId ?? "未知学习单元",
    }));
    return {
      current: withLabels.filter((item) => item.learningUnitId === learningUnitId && !item.archived),
      archived: withLabels.filter((item) => item.learningUnitId === learningUnitId && item.archived),
      other: withLabels.filter((item) => item.learningUnitId !== learningUnitId),
    };
  }, [conversations, learningUnitId, learningUnitLabels]);

  return (
    <div className="ai-conversation-history">
      <div className="ai-conversation-history__summary">
        <strong>全部历史 · {conversations.length}</strong>
        <span>模型上下文仍只使用当前学习单元的当前会话。</span>
      </div>
      <ConversationList
        conversations={current}
        activeConversationId={activeConversationId}
        heading={`当前学习单元 · ${current.length}`}
        emptyMessage="当前学习单元还没有保存的会话。"
        onSelect={onSelect}
        onRename={onRename}
        onArchive={onArchive}
        onDelete={onDelete}
        disabled={disabled}
      />
      {archived.length > 0 ? (
        <ConversationList
          conversations={archived}
          heading={`已归档 · ${archived.length}`}
          onRename={onRename}
          onArchive={onArchive}
          onDelete={onDelete}
          disabled={disabled}
        />
      ) : null}
      {other.length > 0 ? (
        <ConversationList
          conversations={other}
          heading={`其他学习单元 · ${other.length}`}
          onSelect={onSelect}
          onRename={onRename}
          onArchive={onArchive}
          onDelete={onDelete}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}

export default ConversationHistory;
