export {
  AI_LEARNING_ASSISTANT_SYSTEM_PROMPT,
  AI_LEARNING_ASSISTANT_SYSTEM_PROMPT as SYSTEM_PROMPT,
} from "../../../src/ai/assistantSystemPrompt.js";

import { AI_LEARNING_ASSISTANT_SYSTEM_PROMPT } from "../../../src/ai/assistantSystemPrompt.js";

function block(tag, attrs, content) {
  const suffix = Object.entries(attrs ?? {}).map(([key, value]) => ` ${key}=${JSON.stringify(value)}`).join("");
  return `<${tag}${suffix}>\n${content}\n</${tag}>`;
}

function learningSections(context) {
  const { learningUnit, note, sources, activeSourceFile, conversationSummary } = context;
  const sections = [
    block("learning-unit", {}, [
      `id: ${learningUnit.id}`,
      `title: ${learningUnit.title || "(unknown)"}`,
      `category: ${learningUnit.category || "(unknown)"}`,
      `active-source-file: ${activeSourceFile || "(none)"}`,
    ].join("\n")),
  ];

  if (note) sections.push(block("note", { filename: note.name }, note.content));
  else sections.push("<note missing=\"true\" />");

  if (sources.length) {
    for (const source of sources) sections.push(block("source", { filename: source.name }, source.code));
  } else {
    sections.push("<sources missing=\"true\" />");
  }

  if (conversationSummary) sections.push(block("durable-summary", {}, conversationSummary));
  return sections;
}

export function buildMessages({ purpose = "chat", question, context, history = [], compaction }) {
  const sections = learningSections(context);

  if (purpose === "compaction") {
    sections.push(block("compaction-request", {}, compaction.prompt));
    return [
      {
        role: "system",
        content: `${AI_LEARNING_ASSISTANT_SYSTEM_PROMPT}\n\n当前请求用于内部对话压缩。严格按照 <compaction-request> 的结构化 JSON 要求输出，不要回答学习问题，不要添加 Markdown。`,
      },
      { role: "user", content: sections.join("\n\n") },
    ];
  }

  sections.push(block("question", {}, question));
  return [
    { role: "system", content: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT },
    ...history,
    { role: "user", content: sections.join("\n\n") },
  ];
}
