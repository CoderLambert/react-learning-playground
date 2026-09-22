import { canonicalQuestion } from "./factory.js";

export const IMMUTABLE_STATE_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-immutable-state-snapshot",
    learningUnitId: "immutable-state",
    difficulty: "easy",
    conceptTags: ["state", "immutability"],
    content: {
      prompt: "对象进入 React State 后，最合适的更新心智模型是什么？",
      options: [
        { id: "readonly-snapshot", text: "把当前值当只读 snapshot，构造下一份值再交给 setter" },
        { id: "mutate-current", text: "直接修改当前对象，再 set 回同一个引用" },
        { id: "dom-source", text: "先修改 DOM，再让 React 从 DOM 读取新 State" },
        { id: "global-copy", text: "每次都必须深复制整个应用所有数据" },
      ],
      correctOptionId: "readonly-snapshot",
      explanation: "State snapshot 应保持可信。更新只需要为变化路径创建下一份对象/数组，而不是修改已有值。",
      diagnosticOptionMap: {
        "mutate-current": "same-reference-set-is-safe",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ImmutableStateDemo.jsx", startLine: 24, endLine: 30 }],
  }),
  canonicalQuestion({
    id: "canonical-immutable-state-shallow-copy",
    learningUnitId: "immutable-state",
    difficulty: "medium",
    conceptTags: ["state", "spread", "shallow-copy"],
    content: {
      prompt: "const next = [...tasks] 之后，Object.is(next[0], tasks[0]) 通常是什么结果？",
      options: [
        { id: "true", text: "true；数组被复制了，但元素对象仍是同一个引用" },
        { id: "false", text: "false；数组 spread 会递归深复制每个对象" },
        { id: "depends-react", text: "由 React reconciliation 决定" },
        { id: "error", text: "对象数组不能使用 spread" },
      ],
      correctOptionId: "true",
      explanation: "数组 spread 是浅复制，只创建新的数组容器，不复制其中对象。",
      diagnosticOptionMap: {
        false: "new-array-is-deep-copy",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ImmutableStateDemo.jsx", startLine: 48, endLine: 62 }],
  }),
  canonicalQuestion({
    id: "canonical-immutable-state-transfer",
    learningUnitId: "immutable-state",
    difficulty: "medium",
    conceptTags: ["state", "array", "transfer"],
    content: {
      prompt: "下面实现的问题是什么？",
      codeContext: {
        label: "陌生代码 · Tasks.jsx",
        language: "jsx",
        code: `function toggleFirst() {
  const next = [...tasks];
  next[0].done = !next[0].done;
  setTasks(next);
}`,
      },
      options: [
        { id: "shared-item", text: "next 是新数组，但 next[0] 与 tasks[0] 仍共享对象；直接改 done 会污染旧 snapshot" },
        { id: "no-new-array", text: "[...tasks] 不会创建新数组" },
        { id: "setter-needs-effect", text: "setTasks 必须放进 Effect 才有效" },
        { id: "toggle-invalid", text: "boolean State 不能使用 ! 运算" },
      ],
      correctOptionId: "shared-item",
      explanation: "容器复制不等于元素复制。应为被修改的 task 创建新对象，例如 map + { ...task, done: ... }。",
      diagnosticOptionMap: {
        "no-new-array": "new-array-is-deep-copy",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ImmutableStateDemo.jsx", startLine: 48, endLine: 50 }],
  }),
  canonicalQuestion({
    id: "canonical-immutable-state-nested-path",
    learningUnitId: "immutable-state",
    difficulty: "medium",
    conceptTags: ["state", "nested-update"],
    content: {
      prompt: "更新 profile.address.city 时，为什么当前 Demo 同时复制 profile 和 profile.address？",
      options: [
        { id: "copy-path", text: "因为变化节点到顶层的每一层都要有新引用，避免修改旧 snapshot 共享的 address" },
        { id: "react-syntax", text: "因为 React 语法规定对象必须写两个 spread" },
        { id: "deep-clone", text: "这样会自动深复制 profile 中所有对象" },
        { id: "performance", text: "只是为了让代码执行更快，与正确性无关" },
      ],
      correctOptionId: "copy-path",
      explanation: "spread 是浅复制。修改嵌套节点时，需要复制从该节点到 setter 顶层的完整路径。",
      diagnosticOptionMap: {
        "deep-clone": "copy-only-top-level",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ImmutableStateDemo.jsx", startLine: 24, endLine: 30 }],
  }),
  canonicalQuestion({
    id: "canonical-immutable-state-same-reference",
    learningUnitId: "immutable-state",
    difficulty: "hard",
    conceptTags: ["state", "identity"],
    content: {
      prompt: "mutationProbe.city 被直接修改后，又 setMutationProbe(mutationProbe)。为什么这不只是“可能少 render 一次”的性能问题？",
      options: [
        { id: "snapshot-corruption", text: "因为旧 State 对象本身已经被改写，之后的 render/调试再也不能把它当可信历史 snapshot" },
        { id: "setter-invalid", text: "因为 setter 永远禁止接收对象" },
        { id: "dom-mutation", text: "因为它直接修改了 DOM" },
        { id: "deep-copy-cost", text: "因为深复制一定比 mutation 更快" },
      ],
      correctOptionId: "snapshot-corruption",
      explanation: "不可变更新首先保护的是 State 值的时间边界。引用相同导致可跳过更新只是其中一个可观察后果。",
      diagnosticOptionMap: {
        "deep-copy-cost": "same-reference-set-is-safe",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ImmutableStateDemo.jsx", startLine: 32, endLine: 39 }],
  }),
]);
