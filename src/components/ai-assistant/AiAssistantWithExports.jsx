import { Children, cloneElement, isValidElement } from "react";
import { AiAssistant as BaseAiAssistant } from "./AiAssistant";
import { ConversationExportActions } from "./conversations/ConversationExportActions.jsx";

function withConversationExports(conversationNavigation, props) {
  if (!isValidElement(conversationNavigation)) return conversationNavigation;

  const existingChildren = Children.toArray(conversationNavigation.props.children);
  return cloneElement(
    conversationNavigation,
    conversationNavigation.props,
    ...existingChildren,
    <ConversationExportActions
      key="conversation-export-actions"
      messages={props.messages}
      contextSummary={props.contextSummary}
      providerLabel={props.providerLabel}
      modelLabel={props.modelLabel}
      title={props.exportTitle}
      filePrefix={props.exportFilePrefix}
      disabled={props.status === "streaming" || props.status === "loading"}
    />,
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
