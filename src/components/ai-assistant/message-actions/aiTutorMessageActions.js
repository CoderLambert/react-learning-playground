export const ASSISTANT_FOLLOW_UP_ACTIONS = Object.freeze([
  { id: "simplify", label: "讲简单点" },
  { id: "counterexample", label: "给反例" },
  { id: "quiz", label: "测测我" },
  { id: "source", label: "结合源码解释" },
]);

const FOLLOW_UP_PROMPTS = Object.freeze({
  simplify: "请把你刚才的回答讲得更简单一些。保留关键概念，但减少术语，并用一个短例子帮助我建立直觉。",
  counterexample: "请针对你刚才的回答给我一个有代表性的反例或错误写法，并解释它为什么容易误导。",
  quiz: "请基于你刚才的回答测测我。先只出一道需要解释思路的问题，不要立即给答案。",
  source: "请结合当前学习单元已经提供的源码，重新解释你刚才的结论。指出最相关的文件、代码位置和执行过程；如果现有上下文不足，请明确说明。",
  continue: "请从刚才中断的位置继续回答。不要重复已经完整讲过的部分，直接承接最后一个未完成的观点。",
});

export function buildAssistantFollowUpPrompt(actionId) {
  const prompt = FOLLOW_UP_PROMPTS[actionId];
  if (!prompt) throw new Error(`Unsupported AI tutor follow-up action: ${actionId}`);
  return prompt;
}

export function buildCodeExplainPrompt({ code, language = "text", label = "" } = {}) {
  const normalizedCode = String(code ?? "").trim();
  if (!normalizedCode) throw new Error("Cannot explain an empty code block");
  const normalizedLanguage = String(language || "text").trim() || "text";
  const normalizedLabel = String(label ?? "").trim();
  const labelLine = normalizedLabel ? `代码来源/标题：${normalizedLabel}\n` : "";
  return `请解释下面这段代码在当前学习单元中的作用。重点说明：它解决什么问题、关键执行步骤、涉及的 React 心智模型，以及最容易误解的边界。${labelLine}\n\`\`\`${normalizedLanguage}\n${normalizedCode}\n\`\`\``;
}

export function buildCitationExplainPrompt({ fileName, startLine, endLine } = {}) {
  const normalizedFile = String(fileName ?? "").trim();
  const start = Number(startLine);
  const end = Number(endLine ?? startLine);
  if (!normalizedFile || !Number.isInteger(start) || start < 1 || !Number.isInteger(end) || end < start) {
    throw new Error("Invalid source citation for explanation");
  }
  const range = start === end ? `L${start}` : `L${start}-L${end}`;
  return `请结合当前学习单元解释源码引用 [${normalizedFile}:${range}]。说明这段代码在完整执行流程中的位置、为什么这样写、它与当前 React 概念的关系，以及修改它时最需要注意的边界。`;
}

export function shouldOfferContinue(finishReason) {
  return finishReason === "length" || finishReason === "output_limit" || finishReason === "user_abort" || finishReason === "error";
}

export async function copyText(text, {
  navigatorImpl = globalThis.navigator,
  documentImpl = globalThis.document,
} = {}) {
  const value = String(text ?? "");
  if (!value) return false;

  if (navigatorImpl?.clipboard?.writeText) {
    await navigatorImpl.clipboard.writeText(value);
    return true;
  }

  if (!documentImpl?.createElement || !documentImpl?.body || !documentImpl?.execCommand) {
    throw new Error("当前环境不支持复制到剪贴板");
  }

  const textarea = documentImpl.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  documentImpl.body.appendChild(textarea);
  textarea.select();
  const copied = documentImpl.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("复制失败，请手动选择内容复制");
  return true;
}
