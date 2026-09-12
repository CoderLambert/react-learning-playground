import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptLearningContextForGateway,
  buildCompletedChatHistory,
} from "../src/ai/learningAssistantContext.js";
import { getConfiguredAiAssistantUrl } from "../src/ai/chatClient.js";

test("gateway adapter maps raw note, numbered source code and semantic regions", () => {
  const semantics = {
    path: "src/demos/PropsDemo.jsx",
    parser: "rolldown-oxc:jsx",
    primaryRegionId: "component:PropsDemo",
    regions: [
      { id: "component:PropsDemo", kind: "component", symbol: "PropsDemo", startLine: 1, endLine: 1 },
    ],
  };
  const context = adaptLearningContextForGateway({
    learningUnit: { id: "props", title: "Props", category: "components" },
    note: { available: true, fileName: "props.mdx", content: "# Props" },
    sources: [
      { name: "PropsDemo.jsx", code: "const x = 1;", numberedCode: "1 | const x = 1;", semantics },
    ],
    activeSourceFile: "PropsDemo.jsx",
  });

  assert.deepEqual(context.note, { name: "props.mdx", content: "# Props" });
  assert.deepEqual(context.sources, [
    { name: "PropsDemo.jsx", code: "1 | const x = 1;", semantics },
  ]);
  assert.equal(context.activeSourceFile, "PropsDemo.jsx");
});

test("gateway adapter keeps a missing note non-fatal", () => {
  const context = adaptLearningContextForGateway({
    learningUnit: { id: "missing", title: "Missing", category: null },
    note: { available: false, fileName: "missing.mdx", content: "" },
    sources: [],
    activeSourceFile: null,
  });

  assert.equal(context.note, null);
  assert.deepEqual(context.sources, []);
  assert.equal(context.activeSourceFile, "");
});

test("chat history excludes partial and cancelled assistant turns", () => {
  const history = buildCompletedChatHistory([
    { role: "user", content: "first" },
    { role: "assistant", content: "complete" },
    { role: "assistant", content: "partial", streaming: true },
    { role: "assistant", content: "cancelled", cancelled: true },
  ]);

  assert.deepEqual(history, [
    { role: "user", content: "first" },
    { role: "assistant", content: "complete" },
  ]);
});

test("browser gateway configuration exposes only a public endpoint", () => {
  assert.equal(getConfiguredAiAssistantUrl({}), "");
  assert.equal(
    getConfiguredAiAssistantUrl({ VITE_AI_ASSISTANT_URL: "  https://worker.example/chat  " }),
    "https://worker.example/chat",
  );
});
