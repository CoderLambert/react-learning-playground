import { Children, cloneElement, isValidElement } from "react";
import { AiAssistant as BaseAiAssistant } from "./AiAssistant";
import { ConversationExportActions } from "./conversations/ConversationExportActions.jsx";

function withConversationExports(conversationNavigation, props) {
  if (!isValidElement(conversationNavigation)) return conversationNavigation;

  const existingChildren = Children.toArray(conversationNavigation.props.children);
  const exportActions = (
    <ConversationExportActions
      key="conversation-export-actions"
      messages={props.messages}
      contextSummary={props.contextSummary}
      providerLabel={props.providerLabel}
      modelLabel={props.modelLabel}
      title={props.exportTitle}
      filePrefix={props.exportFilePrefix}
      disabled={props.status === "streaming" || props.status === "loading"}
    />
  );
  const children = [
    ...existingChildren.slice(0, 2),
    exportActions,
    ...existingChildren.slice(2),
  ];

  return cloneElement(
    conversationNavigation,
    {
      ...conversationNavigation.props,
      role: conversationNavigation.props.role ?? "group",
    },
    ...children,
  );
}

export function AiAssistant(props) {
  return (
    <BaseAiAssistant
      {...props}
      conversationNavigation={withConversationExports(props.conversationNavigation, props)}
    />
  );
}

export default AiAssistant;
