# DeepSeek Browser BYOK

React Learning Playground supports a **Bring Your Own Key (BYOK)** mode for the AI Learning Inspector.

## Provider contract

The browser uses DeepSeek's OpenAI-compatible Chat Completions endpoint:

```text
base_url: https://api.deepseek.com
endpoint: https://api.deepseek.com/chat/completions
```

Selectable text models:

```text
deepseek-v4-flash
deepseek-v4-pro
```

The public UI intentionally uses the current official model identifiers above rather than an application-owned alias.

## Browser key behavior

Users can open the `AI` Inspector tab and configure their own DeepSeek API key.

- By default, the key is stored in `sessionStorage`, so it remains scoped to the current browser session/tab lifecycle.
- Users can opt into remembering the key on the device; that writes it to `localStorage`.
- The selected model is persisted in `localStorage` because the model identifier is not a secret.
- The key is never committed to the repository and is not put into any `VITE_*` environment variable.
- In direct mode, the request goes from the user's browser to `https://api.deepseek.com` with `Authorization: Bearer <user-key>`.

Browser storage is not a secure secret vault. Any script that can execute in the same origin can theoretically access Web Storage. The UI therefore recommends a dedicated, low-quota key if the user chooses persistent storage.

## Transport priority

The application selects transport in this order:

1. User-configured browser DeepSeek key → direct DeepSeek request.
2. No browser key + `VITE_AI_ASSISTANT_URL` configured → existing site gateway.
3. Neither configured → AI tab remains visible and prompts the user to configure DeepSeek.

This keeps the Cloudflare Worker gateway available for deployments that want a server-side provider key while allowing the public GitHub Pages site to work for any user with their own DeepSeek key.

## Context sent to DeepSeek

Direct mode sends the same bounded learning context as gateway mode:

- current learning-unit id/title/category;
- raw MDX note text;
- registered source files with line numbers;
- currently selected source file;
- bounded completed chat history;
- current user question.

The system prompt instructs the model to treat the note/source payload as untrusted reference material rather than instructions, distinguish project behavior from general React facts, and cite numbered source lines when possible.

## Validation boundary

Automated tests mock the provider endpoint and verify request shape, selected model, Authorization header, context inclusion, SSE parsing, storage behavior and UI model selection. A real DeepSeek request requires a user-owned key and is not part of repository CI.
