const SOURCE_LINE_REFERENCE_PATTERNS = Object.freeze([
  /source:\/\//iu,
  /第\s*\d+\s*(?:(?:[-–—~～]|至|到)\s*\d+\s*)?行/iu,
  /\d+\s*(?:[-–—~～]|至|到)\s*\d+\s*行/iu,
  /\bline(?:s)?\s+\d+(?:\s*(?:[-–—~]|to)\s*\d+)?\b/iu,
  /\.(?:[cm]?[jt]sx?|mdx?)\s*:?\s*L\s*\d+(?:\s*[-–—~:]\s*L?\s*\d+)?/iu,
  /(?:^|[\s([（【:：，。；、])L\s*\d+(?:\s*[-–—~:]\s*L?\s*\d+)?(?=$|[\s)\]）】,，。；、])/iu,
]);

function learnerFacingProse(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`[^`\n]*`/gu, " ");
}

function sourceNavigationReference(value) {
  const prose = learnerFacingProse(value);
  return SOURCE_LINE_REFERENCE_PATTERNS.find((pattern) => pattern.test(prose)) ?? null;
}

function pushTextIssue(issues, value, field) {
  if (typeof value !== "string" || !value.trim()) return;
  if (sourceNavigationReference(value)) {
    issues.push({
      field,
      code: "SOURCE_NAVIGATION_IN_LEARNER_TEXT",
      message: "learner-facing text must not require file/line navigation; inline the complete code or prose needed to answer and keep file/line ranges only in evidenceRefs",
    });
  }
}

/**
 * Deterministic authoring guard for model-owned learner-facing text.
 *
 * This intentionally lives in the Assessment AI adapter layer rather than the
 * domain model: a manually-authored question may have different editorial
 * rules, while AI-authored questions must be self-contained before they can
 * cross the command boundary.
 */
export function findAssessmentAuthoringQualityIssues(questionLike) {
  if (!questionLike || typeof questionLike !== "object" || Array.isArray(questionLike)) return [];
  const content = questionLike.content;
  if (!content || typeof content !== "object" || Array.isArray(content)) return [];

  const issues = [];
  pushTextIssue(issues, content.prompt, "content.prompt");
  if (Array.isArray(content.options)) {
    content.options.forEach((option, index) => {
      pushTextIssue(issues, option?.text, `content.options[${index}].text`);
    });
  }
  return issues;
}

export function assertAssessmentAuthoringQuality(questionLike, { field = "question" } = {}) {
  const [issue] = findAssessmentAuthoringQualityIssues(questionLike);
  if (!issue) return questionLike;
  throw new TypeError(`${field}.${issue.field}: ${issue.message}`);
}

export function assertAssessmentQuestionPatchAuthoringQuality(patch, { field = "patch" } = {}) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch) || !patch.content) return patch;
  return assertAssessmentAuthoringQuality({ content: patch.content }, { field });
}

export const ASSESSMENT_AUTHORING_INSTRUCTIONS = `Assessment 出题与修改是高约束写入流程。除通用导师规则外，必须遵守以下规则：

1. 题干必须自包含。学习者只阅读 content.prompt 与选项，就应获得作答所需的具体判断对象和上下文；不得要求学习者再去 Source/Note 中寻找关键前提。
2. 严禁把文件名、source://、"第 170–176 行"、"L170-L176"、"lines 170-176" 等源码定位信息写成题干或选项中的作答依据。文件与行号只属于 evidenceRefs，用于机器校验、审计和答题后的证据导航。
3. 如果答案依赖当前源码的具体实现，必须把最小但完整的相关代码直接内联到 prompt。代码优先使用 fenced code block；截取完整语句、函数、表达式或 JSX 元素，不要按行号机械切片，不要留下未闭合的 JSX 标签、括号或字符串。
4. 如果答案依赖 Note/源码中的解释性文字，应在 prompt 中用自然语言给出必要前提，但不要把正确答案原句完整复制成一道“复述文案”的阅读理解题。先判断证据是否真的能支持或证伪命题，再决定是否出题。
5. 必须区分事实与假设。源码中不存在的条件、运算或调用，只有在 prompt 明确写成“假设……”时才能用于推理；不得把假设伪装成当前 Demo 的事实。
6. Note 的语义陈述不等于 Demo 的可观测运行证据。若材料明确说某现象未被测量，就不能出要求学习者从该 Demo 观察该现象的题。
7. 选项必须语义完整、彼此可区分，不得出现明显截断；explanation 必须解释为什么正确，并且不得声称当前证据没有展示或测量的事实。
8. 同一批题避免重复使用完全相同的证据片段；优先覆盖不同机制与可证伪点，而不是围绕同一段代码改写多个近义题。
9. 批量创建或修改前，先用 assessment_list_questions 读取当前题目，避免基于过时状态操作。写入后必须再次调用 assessment_list_questions 回读完整题目，并核对 prompt、选项、explanation、evidenceRefs 与预期；revision/replayed 只能证明命令结果，不能证明正文正确。
10. 只有工具实际返回成功且回读一致时，才可以声称“已写入/已修改/已核实”。不要使用“未发送/确认发送/已发布”等当前工具并不表示的流程状态。

当工具因题干含源码定位信息而拒绝写入时，不要删除证据：把必要代码/文字内联进 prompt，并把原文件名与行号保留在 evidenceRefs 后重试。`;
