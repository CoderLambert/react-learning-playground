# AiAssistant

`AiAssistant` is a controlled, provider-neutral presentational component intended for the Learning Inspector AI tab.

The caller owns conversation state, transport, context loading, cancellation, and reset behavior. The component accepts `contextSummary`, `messages`, `status`, `inputValue`, `onInputChange`, `onSubmit`, `onStop`, `onReset`, and optional retry/suggestion/provider display props.

It renders model output as plain text only. No provider API shape, API key, network request, or raw HTML handling belongs in this component.
