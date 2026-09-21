import { canonicalQuestion } from "./factory.js";

export const PRESERVING_RESETTING_STATE_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-preserve-reset-props-switch",
    learningUnitId: "preserving-resetting-state",
    difficulty: "medium",
    conceptTags: ["component-identity", "props", "local-state"],
    content: {
      prompt: "Chat 没有显式 key。Taylor 的 textarea 已输入 AAA，然后 contact prop 切换为 Alice。为什么 AAA 仍然保留？",
      options: [
        { id: "identity-preserved", text: "父级同一位置仍渲染同一个 Chat 类型且身份仍匹配；Props 更新为 Alice，但该组件身份上的 draft State 继续保留" },
        { id: "props-reset", text: "contact prop 已变化，React 应自动创建新的 Chat State；AAA 保留只是 textarea 浏览器缓存" },
        { id: "state-by-contact", text: "React 会自动把 useState 按 contact 对象分组，因此 Alice 恰好继承了 Taylor 的草稿" },
        { id: "state-in-dom", text: "draft 只存在 textarea DOM 中，与 React component identity 无关" },
      ],
      correctOptionId: "identity-preserved",
      explanation: "Props 是当前 render 的输入，不等于组件身份。这里父级位置、组件类型与 key 身份仍匹配，所以 React 延续同一个 Chat identity；新的 contact Props 会生效，而 draft State 仍属于这个被保留的 identity。",
      diagnosticOptionMap: {
        "props-reset": "props-reset-state",
        "state-by-contact": "state-follows-business-object",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 72, endLine: 86 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-preserve-reset-contact-key",
    learningUnitId: "preserving-resetting-state",
    difficulty: "medium",
    conceptTags: ["key", "identity-reset", "local-state"],
    content: {
      prompt: "下半区给 Chat 使用 key={contact.id}。Taylor 切到 Alice 后 draft 变空，最准确的机制是什么？",
      options: [
        { id: "new-identity", text: "key 从 taylor 变为 alice，旧 Chat identity 无法继续匹配；React 创建新的 Chat identity，因此 useState 从初始值开始" },
        { id: "dom-refresh", text: "key 的作用是强制刷新 textarea DOM，React component State 本身仍是同一份" },
        { id: "list-warning", text: "key 只用于列表 warning；这里 draft 清空与 key 没有关系" },
        { id: "prop-clears", text: "contact prop 变化会自动执行 setDraft(\"\")，key 只是为了代码可读性" },
      ],
      correctOptionId: "new-identity",
      explanation: "显式 key 是同一父级下的身份线索。contact.id 改变后，旧 Chat identity 不再匹配，新 Chat 会重新执行 useState 初始值。这是 component identity reset，不是对 DOM 的命令式刷新。",
      diagnosticOptionMap: {
        "dom-refresh": "key-is-dom-refresh",
        "list-warning": "key-only-for-lists",
        "prop-clears": "props-reset-state",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 89, endLine: 100 },
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 106, endLine: 122 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-preserve-reset-boundary",
    learningUnitId: "preserving-resetting-state",
    difficulty: "hard",
    conceptTags: ["identity-boundary", "key", "state-ownership"],
    content: {
      prompt: "WorkspaceShell 保存展开面板和滚动位置，InvoiceEditor 保存当前 customer 的未提交草稿。切换 customer 时只应丢弃编辑器草稿。哪种 identity 设计最准确？",
      options: [
        { id: "key-editor", text: "保留 WorkspaceShell identity，只给 InvoiceEditor 使用稳定 customer.id 作为 key" },
        { id: "key-shell", text: "给 WorkspaceShell 使用 customer.id 作为 key，让整个工作区和编辑器一起重建" },
        { id: "random-editor", text: "给 InvoiceEditor 使用 Date.now() / Math.random() 作为 key，保证任何 render 都彻底清空" },
        { id: "no-key-props-reset", text: "不需要 key；customer prop 变化后 InvoiceEditor 的局部 State 会自动重置" },
      ],
      correctOptionId: "key-editor",
      explanation: "identity boundary 应放在真正属于 customer 的 State 子树上。WorkspaceShell 的 UI State 需要跨 customer 保留，因此不应随 customer 重建；InvoiceEditor 的草稿只属于当前 customer，所以稳定 customer.id 能准确表达新编辑器身份。",
      diagnosticOptionMap: {
        "key-shell": "reset-boundary-too-high",
        "random-editor": "random-key-is-reset-strategy",
        "no-key-props-reset": "props-reset-state",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 125, endLine: 136 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-preserve-reset-stable-key-rerender",
    learningUnitId: "preserving-resetting-state",
    difficulty: "medium",
    conceptTags: ["stable-key", "identity-preservation"],
    content: {
      prompt: "Chat 使用 key={contact.id}，当前一直是 Alice。父组件因为别的 State 更新而重新 render，但 contact.id 仍是 alice。Alice 的 draft 应该怎样理解？",
      options: [
        { id: "preserve-same-key", text: "同一位置、同一 Chat 类型且 key 仍是 alice，组件 identity 可以继续匹配，所以 draft 应保留" },
        { id: "key-always-reset", text: "只要 JSX 上写了 key，每次父组件 render 都会 remount Chat 并清空 draft" },
        { id: "props-own-state", text: "draft 是否保留只取决于 contact 对象引用是否严格相等，与组件 identity 无关" },
        { id: "dom-decides", text: "是否保留只看浏览器是否复用了 textarea DOM 节点" },
      ],
      correctOptionId: "preserve-same-key",
      explanation: "key 的价值是稳定身份，而不是强制重建。只要同一父级位置、组件类型和显式 key 仍能匹配，React 会继续使用同一个组件 identity，local State 也随之保留。",
      diagnosticOptionMap: {
        "props-own-state": "state-follows-business-object",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 91, endLine: 99 },
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 106, endLine: 122 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-preserve-reset-per-entity-drafts",
    learningUnitId: "preserving-resetting-state",
    difficulty: "hard",
    conceptTags: ["state-ownership", "identity", "product-requirement"],
    content: {
      prompt: "产品需求改为：Taylor、Alice 各自的未发送草稿都要保留，来回切联系人时恢复各自草稿。此时单纯用 key={contact.id} reset 是否足够？",
      options: [
        { id: "store-by-entity", text: "不够；需要把草稿 State 提升或按 contact.id 存储，让每个业务实体都有可恢复的数据，而不是切换时直接丢弃旧 State" },
        { id: "key-caches-drafts", text: "足够；React 会因为 contact.id 不同自动缓存每个 key 对应的旧组件 State，切回来会恢复" },
        { id: "random-key-cache", text: "改用随机 key 更好，React 会自动为每个随机身份保留一份历史草稿" },
        { id: "effect-prop-reset", text: "应该监听 contact prop 写 Effect，每次切换都 setDraft(\"\")，这样才能恢复各联系人草稿" },
      ],
      correctOptionId: "store-by-entity",
      explanation: "key reset 的语义是旧 identity 被丢弃，新 identity 从初始 State 开始；它不会替产品维护每个联系人历史草稿。如果需求要求跨切换恢复，就应重新设计 State ownership，例如在父级按 contact.id 保存草稿。",
      diagnosticOptionMap: {
        "key-caches-drafts": "state-follows-business-object",
        "random-key-cache": "random-key-is-reset-strategy",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 9, endLine: 28 },
      { kind: "source", fileName: "PreservingResettingStateDemo.jsx", startLine: 89, endLine: 100 },
    ],
  }),
]);
