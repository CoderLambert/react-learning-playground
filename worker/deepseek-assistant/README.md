# DeepSeek Assistant Worker

Server-side gateway for the React Learning Workbench AI tab. The browser sends only the current learning context and question to this Worker; the DeepSeek API key never enters the frontend bundle.

## Runtime contract

`POST /chat` (the Worker currently accepts POST on its deployed route) with `Content-Type: application/json` and an allowed `Origin`.

Request:

```json
{
  "question": "为什么这里会重新渲染？",
  "context": {
    "learningUnit": { "id": "props", "title": "Props", "category": "components" },
    "note": { "name": "props.mdx", "content": "..." },
    "sources": [{ "name": "PropsDemo.jsx", "code": "1 | ..." }],
    "activeSourceFile": "PropsDemo.jsx"
  },
  "history": [{ "role": "user", "content": "..." }]
}
```

Response is newline-delimited JSON owned by this app, not DeepSeek's SSE format:

```text
{"type":"start"}
{"type":"delta","text":"..."}
{"type":"done","finishReason":"stop","usage":{...}}
```

Failures before streaming are normal JSON HTTP errors. A failure after streaming starts is emitted as `{ "type": "error", "message": "upstream stream failed" }`.

## Agent model-turn transport

The same endpoint also accepts the provider-neutral AgentRunner envelope:

```json
{
  "type": "model_turn",
  "purpose": "chat",
  "messages": [
    { "role": "user", "content": "find the answer" },
    {
      "role": "assistant",
      "content": "",
      "toolCalls": [{ "id": "call-1", "name": "lookup", "arguments": { "query": "x" } }]
    },
    { "role": "tool", "toolCallId": "call-1", "content": "{\"answer\":\"42\"}" }
  ],
  "tools": [{ "name": "lookup", "description": "...", "inputSchema": { "type": "object" } }]
}
```

The response uses the same model-turn event names as the direct browser adapter:
`turn_start`, `text_delta`, `tool_call`, and `turn_complete`. Tool calls are
forwarded to the browser; this Worker never executes tools or accesses
Assessment, IndexedDB, or Agent state. A `purpose: "compaction"` turn must
send `tools: []` and omit `toolChoice`; the Worker strips tool execution from
the provider request and rejects tool continuation messages.

## DeepSeek configuration

Verified against the official DeepSeek API documentation on 2026-09-11:

- OpenAI-compatible base URL: `https://api.deepseek.com`
- Chat Completions endpoint: `/chat/completions`
- current text model IDs: `deepseek-v4-flash`, `deepseek-v4-pro`
- Chat Completions streaming uses data-only SSE and terminates with `data: [DONE]`

The default is `deepseek-v4-flash`, non-thinking mode, with a provider allowance of 16K output tokens. The browser independently enforces the product limit of 6000 Unicode characters and cancels the upstream stream on overflow. All non-secret values are configurable in `wrangler.jsonc` / environment bindings.

## Required secret

Never put the key in `vars`, source code, GitHub Pages config, or a `VITE_*` variable.

```bash
cd worker/deepseek-assistant
npx wrangler secret put DEEPSEEK_API_KEY
```

For local development, use an uncommitted `.dev.vars` file:

```dotenv
DEEPSEEK_API_KEY=...
```

## Rate limiting

`AI_RATE_LIMITER` uses Cloudflare Workers' Rate Limiting binding (requires Wrangler >= 4.36.0). The checked-in example allows 10 requests / 60 seconds per key. This is a protective abuse-control limit, not billing-grade accounting; Cloudflare documents the binding as permissive/eventually consistent and location-local.

The current anonymous public-site key is `chat:<CF-Connecting-IP>`. Cloudflare recommends stable user/account identifiers over IP addresses because NAT/proxies can group legitimate users. If authentication is added later, replace the key with an authenticated user/tenant identifier.

Before production deployment, choose a `namespace_id` unique to the Cloudflare account/application instead of reusing the example `1001` when that namespace is already in use.

## Other controls

- exact origin allowlist via `ALLOWED_ORIGIN`
- POST + JSON-only endpoint
- body/question/note/source/history size limits
- maximum source file count and aggregate source size
- bounded model output
- request timeout and cancellation propagation
- generic upstream errors (provider response bodies are not returned)
- no logging of request content or secrets
- `Cache-Control: no-store`

CORS is not treated as authorization; the rate limiter and API-side validation are required even with an origin allowlist.

## Commands

```bash
cd worker/deepseek-assistant
npm install
npm test
npm run check
npx wrangler dev
npx wrangler deploy
```

`npm test` is deterministic and uses mocked upstream streams. A real DeepSeek smoke test is intentionally not part of CI because it requires a paid/user-owned secret; it remains PENDING until deployment credentials are configured.

## Sources used for implementation

- DeepSeek API: https://api-docs.deepseek.com/
- DeepSeek Chat Completions: https://api-docs.deepseek.com/api/create-chat-completion/
- Cloudflare Workers Rate Limiting: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Cloudflare Workers Secrets: https://developers.cloudflare.com/workers/configuration/secrets/
