import { canonicalQuestion } from "./factory.js";

export const RENDERING_LISTS_KEY_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-rendering-lists-key-identity",
    learningUnitId: "rendering-lists-key",
    difficulty: "medium",
    conceptTags: ["key", "component-identity"],
    content: {
      prompt: "在可重排列表中，稳定 key 最核心的作用是什么？",
      options: [
        { id: "identity", text: "给同级元素提供稳定身份线索，让 React 在后续 render 中匹配同一个业务实体" },
        { id: "speed", text: "保证 map() 比普通 for 循环执行得更快" },
        { id: "prop", text: "把 key 自动作为 props.key 传给子组件" },
        { id: "warning", text: "只用于消除控制台 warning，不影响 State 保留" },
      ],
      correctOptionId: "identity",
      explanation: "key 的核心是 sibling 范围内的身份线索。React 会结合树中位置、组件类型和显式 key 判断组件身份是否延续；身份延续时，对应的局部 State 才能继续属于同一个业务实体。",
      diagnosticOptionMap: {
        warning: "key-only-warning",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-reorder",
    learningUnitId: "rendering-lists-key",
    difficulty: "medium",
    conceptTags: ["key", "reorder", "local-state"],
    content: {
      prompt: "使用 index key 时，第一行输入 AAA 后反转列表。AAA 还在第一行，但这一行的标题已经变成另一个 task。哪个解释最准确？",
      options: [
        { id: "identity-position", text: "同一个 index 让原组件身份按位置延续；新的 task Props 会更新，但这个身份上的 note State 也继续保留" },
        { id: "dom-static", text: "index key 让这一行 DOM 没有更新，所以旧内容整体留在原位置" },
        { id: "state-in-dom", text: "AAA 存在 input DOM 节点内部，因此只要节点复用就与 React State 无关" },
        { id: "props-reset", text: "task Props 已变化，React 本应自动清空 note；没清空只是浏览器 input 的偶发现象" },
      ],
      correctOptionId: "identity-position",
      explanation: "reorder 后 task Props 会正常更新，因此标题会变化；但 index key 仍让同一位置匹配到原组件身份，该身份上的 local State 继续保留，于是 note 看起来跟错了业务实体。",
      diagnosticOptionMap: {
        "dom-static": "dom-not-updated",
        "state-in-dom": "state-lives-in-dom",
        "props-reset": "props-reset-state",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 9, endLine: 11 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 22, endLine: 33 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-selection",
    learningUnitId: "rendering-lists-key",
    difficulty: "easy",
    conceptTags: ["key", "stable-id"],
    content: {
      prompt: "一个待办列表允许顶部插入、删除、排序，并且每行都有输入草稿。以下哪个值最适合作为 key？",
      options: [
        { id: "todo-id", text: "数据模型中创建后保持稳定的 todo.id" },
        { id: "index", text: "当前数组 index" },
        { id: "title", text: "用户可以随时编辑的 todo.title" },
        { id: "random", text: "每次 render 重新生成的随机 UUID" },
      ],
      correctOptionId: "todo-id",
      explanation: "key 应在同一业务实体生命周期内保持稳定。插入和排序会改变 index，可编辑 title 会变化，每次 render 生成的随机值更会强制产生新身份；稳定 todo.id 才符合身份语义。",
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 3, endLine: 7 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-stable-reorder",
    learningUnitId: "rendering-lists-key",
    difficulty: "hard",
    conceptTags: ["key", "component-identity", "remount"],
    content: {
      prompt: "切到 stable task.id 后，给 task-a 输入 AAA，再反转列表。AAA 跟着 task-a 移到最后一行并且没有消失。这个现象最能说明什么？",
      options: [
        { id: "identity-preserved", text: "相同 task.id 让 React 在新位置认出同一个组件身份，因此该身份上的 State 被保留" },
        { id: "stable-remount", text: "stable id 会让 task-a 在新位置完整 remount，但 React 会自动恢复旧 State" },
        { id: "dom-carries-state", text: "React 只是把原 input DOM 搬过去；AAA 主要由 DOM 自己保存，与组件身份无关" },
        { id: "id-follows-position", text: "task.id 会随着数组位置变化成新的值，所以 React 能知道应该重建哪一行" },
      ],
      correctOptionId: "identity-preserved",
      explanation: "AAA 没有被清空就是关键证据：如果发生 remount，useState(\"\") 会重新初始化。stable key 在 reorder 时让 React 保留同一业务实体对应的组件身份和 State，并把它匹配到新位置。",
      diagnosticOptionMap: {
        "stable-remount": "stable-key-remounts",
        "dom-carries-state": "state-lives-in-dom",
        "id-follows-position": "id-changes-with-data",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 9, endLine: 11 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-rendering-lists-key-strategy-switch",
    learningUnitId: "rendering-lists-key",
    difficulty: "hard",
    conceptTags: ["key", "identity-reset", "remount"],
    content: {
      prompt: "已经在第一行输入 AAA。此时把 key 策略从 index 切换为 stable task.id，AAA 被清空。为什么这一次可以说发生了身份重置？",
      options: [
        { id: "key-value-changed", text: "这一行的显式 key 从 0 变成 task-a，旧身份无法按原 key 匹配，因此创建新组件身份并重新初始化 State" },
        { id: "stable-always-remounts", text: "只要使用 stable id，React 每次 render 都会 remount 列表项" },
        { id: "props-caused-reset", text: "因为 task prop 仍然是 task-a，所以 React 会把 note State 清空以保持 Props 一致" },
        { id: "dom-lost-value", text: "只是旧 input DOM 被替换，React 组件 State 本身其实仍然保存在原实例里" },
      ],
      correctOptionId: "key-value-changed",
      explanation: "这里与 stable-id reorder 不同：切换策略让显式 key 值本身从 index 变成 task.id，旧身份无法继续匹配，所以新组件身份从 useState 初始值开始。这才是当前 Demo 中直接可观察的 remount/reset。",
      diagnosticOptionMap: {
        "stable-always-remounts": "stable-key-remounts",
        "props-caused-reset": "props-reset-state",
        "dom-lost-value": "state-lives-in-dom",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 9, endLine: 11 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
      { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 84, endLine: 96 },
    ],
  }),
]);
