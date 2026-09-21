import { getMisconceptionForLearningUnit } from "../../content/conceptModels.js";
import { assertQuestionRecord } from "../domain/question.js";

const CANONICAL_CATALOG_VERSION = "2026-09-20";
const CANONICAL_TIMESTAMP = "2026-09-20T00:00:00.000Z";

function validateDiagnosticOptionMap(learningUnitId, content) {
  const mapping = content?.diagnosticOptionMap;
  if (mapping == null) return;
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
    throw new TypeError("content.diagnosticOptionMap must be an object");
  }

  const optionIds = new Set((content.options ?? []).map((option) => option.id));
  for (const [optionId, misconceptionId] of Object.entries(mapping)) {
    if (!optionIds.has(optionId)) {
      throw new TypeError(`diagnostic option ${optionId} must reference an existing answer option`);
    }
    if (optionId === content.correctOptionId) {
      throw new TypeError("the correct option must not map to a misconception");
    }
    if (!getMisconceptionForLearningUnit(learningUnitId, misconceptionId)) {
      throw new TypeError(`unknown misconception ${misconceptionId} for ${learningUnitId}`);
    }
  }
}

function canonicalQuestion({ id, learningUnitId, type = "single_choice", content, difficulty, conceptTags, evidenceRefs = [] }) {
  validateDiagnosticOptionMap(learningUnitId, content);
  const question = {
    id,
    learningUnitId,
    type,
    content,
    difficulty,
    conceptTags,
    evidenceRefs,
    status: "active",
    revision: 1,
    createdAt: CANONICAL_TIMESTAMP,
    updatedAt: CANONICAL_TIMESTAMP,
    provenance: {
      source: "canonical",
      catalogVersion: CANONICAL_CATALOG_VERSION,
    },
  };
  assertQuestionRecord(question);
  return Object.freeze(question);
}

const RENDERING_LISTS_KEY_QUESTIONS = Object.freeze([
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

const STATE_SNAPSHOT_QUEUE_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-state-snapshot-current-value",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["state-snapshot", "setter"],
    content: {
      prompt: "当前 render 中 count = 0。事件 handler 里先执行 setCount(count + 1)，然后在同一个 handler 后面再次读取 count。这里最准确的理解是什么？",
      options: [
        { id: "snapshot-stays-zero", text: "当前 handler 仍读取这次 render 的 count = 0；setter 请求 React 为后续 render 计算新 State" },
        { id: "setter-mutates-now", text: "setCount 会先把当前变量 count 直接改成 1，后面的代码立刻读取 1" },
        { id: "count-unknown", text: "setCount 后 count 变成不可预测值，要等浏览器事件循环决定" },
        { id: "dom-first", text: "DOM 先更新为 1，然后 React 再把 JavaScript 变量同步成 1" },
      ],
      correctOptionId: "snapshot-stays-zero",
      explanation: "State 是一次 render 的 snapshot。setter 不会回头修改当前 handler 已经读取到的 count；它提交更新请求，React 处理更新后由下一次 render 得到新的 State snapshot。",
      diagnosticOptionMap: {
        "setter-mutates-now": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 22, endLine: 27 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-replace-three",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["state-snapshot", "replace-update", "queue"],
    content: {
      prompt: "Reset 后 count = 0。连续执行三次 setCount(count + 1)，为什么下一次 render 是 1 而不是 3？",
      options: [
        { id: "same-snapshot-replace", text: "三次表达式都读取同一个 count = 0 snapshot，因此队列里是 replace 1、replace 1、replace 1" },
        { id: "auto-accumulate", text: "每次 setCount 都会先把 count 改掉，所以应该依次计算 1、2、3；显示 1 只是 batching 延迟" },
        { id: "last-only", text: "React batching 会直接丢弃前两次 setter，只执行最后一次调用" },
        { id: "first-only", text: "React 在一个事件里只允许第一条 State 更新生效，后续调用都会被忽略" },
      ],
      correctOptionId: "same-snapshot-replace",
      explanation: "三次 count + 1 都发生在同一个 handler snapshot 上。count 为 0 时，它们都把 replace 1 加入 queue；React 依次处理后 pending 仍然是 1。",
      diagnosticOptionMap: {
        "auto-accumulate": "repeated-replace-accumulates",
        "last-only": "queue-keeps-last-only",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 29, endLine: 45 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-updater-three",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["functional-updater", "queue"],
    content: {
      prompt: "同样从 count = 0 开始，连续三次 setCount(n => n + 1) 为什么能得到 3？",
      options: [
        { id: "updater-pending", text: "每个 updater 在 queue processing 时接收前一项 pending State，所以依次计算 0→1→2→3" },
        { id: "syntax-only", text: "updater function 只是 setCount(count + 1) 的另一种语法，两者 queue 语义完全相同" },
        { id: "mutates-closure", text: "第一个 updater 会直接修改当前 handler 闭包里的 count，所以后两个 updater 能读取被改写的变量" },
        { id: "three-renders", text: "因为三个 updater 会强制 React 立即 render 三次，每次 render 各加 1" },
      ],
      correctOptionId: "updater-pending",
      explanation: "updater function 会进入 queue，并在 React 处理 queue 时接收当前 pending State。它们可以组合：第一个把 0 变 1，第二个接 1 变 2，第三个接 2 变 3。",
      diagnosticOptionMap: {
        "syntax-only": "updater-is-syntax-sugar",
        "mutates-closure": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 47, endLine: 63 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-replace-updater",
    learningUnitId: "state-snapshot-queue",
    difficulty: "hard",
    conceptTags: ["replace-update", "functional-updater", "queue-order"],
    content: {
      prompt: "Reset 后 count = 0。运行 Replace + Updater：先 setCount(snapshot + 5)，再 setCount(n => n + 1)。下一次 render 为什么是 6？",
      options: [
        { id: "ordered-queue", text: "queue 先把 pending 替换成 5，再把这个 pending 交给 +1 updater，得到 6" },
        { id: "last-updater-only", text: "batching 只保留最后的 +1 updater，所以 React 实际只执行一次 +1" },
        { id: "snapshot-became-five", text: "第一条 setter 先把当前 handler 的 snapshot 变成 5，第二条再从新的 count 读取 5" },
        { id: "two-renders", text: "第一条先 render 到 5，第二条再触发另一次 render 到 6" },
      ],
      correctOptionId: "ordered-queue",
      explanation: "同一批更新里，replace 5 先把 pending 设置为 5，随后 updater 接收这个 pending 并返回 6。当前 handler 的原 snapshot 仍然是 0，并不是中途被改写。",
      diagnosticOptionMap: {
        "last-updater-only": "queue-keeps-last-only",
        "snapshot-became-five": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 65, endLine: 79 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-final-replace",
    learningUnitId: "state-snapshot-queue",
    difficulty: "hard",
    conceptTags: ["queue-order", "replace-update"],
    content: {
      prompt: "Reset 后运行 Replace + Updater + Replace 42，最终是 42。下面哪个解释最准确？",
      options: [
        { id: "processed-then-replaced", text: "React 依次处理前面的 replace 和 updater，最后一项 replace 42 再把 pending State 设置为 42" },
        { id: "discard-earlier", text: "只要最后有 replace 42，React 在处理 queue 前就会把前面的所有更新删除" },
        { id: "updater-after-42", text: "React 会优先处理 replace 42，再运行前面的 updater，所以理论上应该得到 43" },
        { id: "same-semantics", text: "最终数字是 42，说明前面的 replace / updater 与单独 setCount(42) 在更新语义上完全等价" },
      ],
      correctOptionId: "processed-then-replaced",
      explanation: "queue 有顺序。前面的 replace 与 updater 仍会被处理；只是最后的 replace 42 把当时 pending value 改成了 42，因此 next render 显示 42。",
      diagnosticOptionMap: {
        "discard-earlier": "last-result-means-last-only",
        "same-semantics": "same-result-same-semantics",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 81, endLine: 98 },
    ],
  }),
]);


const PRESERVING_RESETTING_STATE_QUESTIONS = Object.freeze([
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

const NOT_NEED_EFFECT_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-not-need-effect-derived-list",
    learningUnitId: "not-need-effect",
    difficulty: "medium",
    conceptTags: ["derived-state", "render", "effect-boundary"],
    content: {
      prompt: "商品列表完全由 products、query 和 category 决定。query 改变后，filteredProducts 最合适放在哪里计算？",
      options: [
        { id: "derive-render", text: "直接在当前 render 中根据最新 props/state 派生 filteredProducts" },
        { id: "effect-copy-state", text: "把 filteredProducts 存成第二份 State，再用 Effect 监听 query/category 同步" },
        { id: "effect-because-change", text: "只要 query 会变化，就应该用 Effect 监听变化后再计算列表" },
        { id: "ref-cache", text: "把 filteredProducts 放进 ref，避免 React render 参与计算" },
      ],
      correctOptionId: "derive-render",
      explanation: "filteredProducts 是当前 UI 的纯派生值。query/category 改变已经会触发新的 render，因此直接重新计算即可。额外 State + Effect 会复制事实来源，并引入额外同步与 render。",
      diagnosticOptionMap: {
        "effect-copy-state": "derived-needs-effect-state",
        "effect-because-change": "effect-is-change-listener",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 41, endLine: 50 },
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 110, endLine: 114 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-not-need-effect-purchase-event",
    learningUnitId: "not-need-effect",
    difficulty: "medium",
    conceptTags: ["event-handler", "effect-boundary", "causal-source"],
    content: {
      prompt: "用户点击“购买”后需要发送购买请求并记录这次商品名。哪种设计最符合因果来源？",
      options: [
        { id: "handler-direct", text: "在购买按钮的 Event Handler 中直接发送请求并记录本次 productName" },
        { id: "effect-watch-count", text: "先只更新 purchasedCount，再用 Effect 监听 purchasedCount 变化后发送请求和日志" },
        { id: "effect-network-rule", text: "因为发送网络请求属于副作用，所以必须从 Event Handler 挪到 Effect" },
        { id: "render-request", text: "在 render 期间检测 purchasedCount 并发送请求" },
      ],
      correctOptionId: "handler-direct",
      explanation: "这里的业务动作之所以发生，是因为这次明确的购买点击。Event Handler 同时拥有最准确的事件上下文（包括 productName），应直接处理这次动作，而不是再监听某个 State 结果去反推原因。",
      diagnosticOptionMap: {
        "effect-watch-count": "state-change-needs-effect",
        "effect-network-rule": "side-effect-means-effect",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 55, endLine: 64 },
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 191, endLine: 197 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-not-need-effect-external-sync",
    learningUnitId: "not-need-effect",
    difficulty: "hard",
    conceptTags: ["effect", "external-system", "cleanup"],
    content: {
      prompt: "组件显示期间需要订阅 window.resize，并在组件卸载或同步目标变化时撤销旧监听。为什么这里适合使用 Effect？",
      options: [
        { id: "external-lifecycle-sync", text: "因为组件生命周期内需要与 React 外部的浏览器事件系统建立 setup/cleanup 同步关系" },
        { id: "all-changing-values", text: "因为 width 会变化；任何会变化的值都应该用 Effect 监听" },
        { id: "user-event-only", text: "resize 也是事件，所以只能放在某个用户 click Event Handler 里注册" },
        { id: "render-listener", text: "应该在每次 render 时直接 addEventListener，这样总能拿到最新 State" },
      ],
      correctOptionId: "external-lifecycle-sync",
      explanation: "Effect 的核心价值是建立 React 与外部系统之间的同步过程。浏览器事件订阅需要在组件存在期间 setup，并在依赖变化或卸载时 cleanup；依赖变化不是使用 Effect 的原因，只是决定这段外部同步何时需要重建。",
      diagnosticOptionMap: {
        "all-changing-values": "effect-is-change-listener",
        "user-event-only": "side-effect-means-effect",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 191, endLine: 197 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-not-need-effect-expensive-derive",
    learningUnitId: "not-need-effect",
    difficulty: "medium",
    conceptTags: ["render", "memoization", "performance"],
    content: {
      prompt: "filteredProducts 是纯派生值，但数据量变大后计算变慢。下一步最准确的判断是什么？",
      options: [
        { id: "measure-then-memo", text: "它仍属于 render 数据流；先测量，确有性能问题时再考虑 memoization" },
        { id: "move-to-effect", text: "只要计算昂贵，就应该移到 Effect 中并把结果存进 State" },
        { id: "always-state", text: "昂贵计算必须缓存成独立 State，否则 render 不应该执行它" },
        { id: "skip-derive", text: "为了避免 Effect，应该停止根据 query/category 重新计算结果" },
      ],
      correctOptionId: "measure-then-memo",
      explanation: "“是否需要 Effect”和“是否需要性能优化”是两个问题。纯派生仍应保持在 render 数据流；若测量证明值得，再用 memoization 等手段减少重复计算，而不是用 Effect + duplicate State 改写数据流。",
      diagnosticOptionMap: {
        "move-to-effect": "expensive-means-effect",
        "always-state": "expensive-means-effect",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 45, endLine: 50 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-not-need-effect-key-reset",
    learningUnitId: "not-need-effect",
    difficulty: "hard",
    conceptTags: ["key", "identity-reset", "state-ownership"],
    content: {
      prompt: "User_A 与 User_B 被产品视为不同留言板身份，切换用户时明确要求丢弃旧草稿。为什么 key={userId} 在这里合理？",
      options: [
        { id: "identity-boundary", text: "因为业务身份变化就应该创建新的 CommentForm 身份，新的局部 State 从初始值开始" },
        { id: "universal-reset", text: "只要看到任何 Effect 里 setState reset，都可以无条件改成 key reset" },
        { id: "key-performance", text: "key 只是让 reset 更快；State 是否丢弃与组件身份无关" },
        { id: "preserve-drafts", text: "因为 key 会自动替每个 userId 保存并恢复各自旧草稿" },
      ],
      correctOptionId: "identity-boundary",
      explanation: "这里的前提是产品语义明确要求“切换用户 = 新业务身份，旧局部草稿应丢弃”。key 把这个身份边界直接表达给 React。若产品要求分别保留每个用户草稿，则应该重新设计 State ownership，而不是继续 reset。",
      diagnosticOptionMap: {
        "universal-reset": "key-reset-is-universal",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 5, endLine: 24 },
      { kind: "source", fileName: "NotNeedEffectDemo.jsx", startLine: 236, endLine: 248 },
    ],
  }),
]);

const LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-effect-lifecycle-room-switch-order",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "hard",
    conceptTags: ["effect", "cleanup", "setup", "commit"],
    content: {
      prompt: "组件已连接 room #101。用户把 roomId 改成 #102。忽略 Strict Mode 的开发期额外检查后，哪条顺序最准确？",
      options: [
        { id: "commit-cleanup-setup", text: "更新触发新 render，commit 后先 cleanup #101，再 setup #102" },
        { id: "setup-cleanup", text: "先 setup #102，确认新连接成功后再 cleanup #101" },
        { id: "cleanup-only-unmount", text: "切换 room 时只 setup #102；cleanup #101 只会在组件最终 unmount 时发生" },
        { id: "cleanup-before-render", text: "点击事件一发生就先 cleanup #101，然后 React 才 render room #102" },
      ],
      correctOptionId: "commit-cleanup-setup",
      explanation: "roomId 更新先触发新的 render 并 commit。随后这个 Effect 需要重新同步：React 先运行上一轮 cleanup 撤销 room #101 连接，再用新 committed roomId setup room #102。",
      diagnosticOptionMap: {
        "setup-cleanup": "setup-before-old-cleanup",
        "cleanup-only-unmount": "cleanup-only-on-unmount",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 95, endLine: 99 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-muted-no-reconnect",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["effect-event", "reactive-values", "synchronization-target"],
    content: {
      prompt: "isMuted 会变化，而且收到消息时通知逻辑需要读取最新 isMuted。为什么切换静音不应该重建 Socket 连接？",
      options: [
        { id: "event-does-not-own-target", text: "isMuted 只影响收到消息后的通知行为，不决定连接哪个 room；Effect Event 可以读取最新 committed isMuted，而 roomId 仍负责同步目标" },
        { id: "all-values-deps", text: "isMuted 也是 State，所以必须加入连接 Effect 依赖；任何 State 变化都应该重连" },
        { id: "hide-all-deps", text: "只要把读取放进 Effect Event，就可以把 roomId、isMuted 等所有值都从依赖数组删除" },
        { id: "mute-is-nonreactive", text: "isMuted 不是 reactive value，所以 React 根本不会因为它变化重新 render" },
      ],
      correctOptionId: "event-does-not-own-target",
      explanation: "关键是同步关系本身由什么决定。roomId 决定 Socket 连接目标；isMuted 只决定收到消息后是否播放提示。Effect Event 让这段事件逻辑读取最新 committed 值，而不是隐藏真正的同步依赖。",
      diagnosticOptionMap: {
        "all-values-deps": "every-changing-value-reconnects",
        "hide-all-deps": "effect-event-is-dependency-hack",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 38, endLine: 49 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-messages-updater",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["functional-updater", "dependencies", "messages"],
    content: {
      prompt: "Socket 每收到消息都要更新 messages，但连接 Effect 不应因 messages 变化重新连接。这里 setMessages(prev => ...) 的作用是什么？",
      options: [
        { id: "remove-reactive-read", text: "把“基于上一份 messages 计算下一份 messages”交给 State updater，因此回调不需要读取当前 render 的 messages" },
        { id: "lint-bypass", text: "它只是让 dependency linter 看不到 messages；Effect 实际仍然依赖当前 messages" },
        { id: "messages-must-dep", text: "只要 messages 会更新，它就必须加入 Effect 依赖，否则 React 不能保存新消息" },
        { id: "prevents-rerender", text: "functional updater 会阻止 messages 更新触发 React render，所以连接自然不会重建" },
      ],
      correctOptionId: "remove-reactive-read",
      explanation: "functional updater 真正改变了代码的数据依赖。回调只提交“如何从上一份 State 得到下一份 State”的函数，不再读取当前 render 的 messages；因此连接 Effect 没有这个 reactive read。",
      diagnosticOptionMap: {
        "lint-bypass": "updater-is-dependency-hack",
        "messages-must-dep": "every-changing-value-reconnects",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-keep-room-dependency",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "hard",
    conceptTags: ["dependencies", "stale-synchronization", "roomId"],
    content: {
      prompt: "团队觉得切房间时 reconnect 太频繁，想把 roomId 从连接 Effect 的依赖数组删掉。最准确的判断是什么？",
      options: [
        { id: "keep-true-dependency", text: "不能靠删 roomId 优化；setup 直接用它决定连接目标，删除真实依赖会让 UI roomId 与外部 Socket 同步关系脱节" },
        { id: "remove-for-performance", text: "可以删除，只要 reconnect 成本高，依赖数组就应该优先减少运行次数" },
        { id: "effect-event-room", text: "把 roomId 放进 Effect Event 后就能从依赖删除，同时仍保证连接目标自动切换" },
        { id: "empty-array", text: "连接类 Effect 一般应该使用 []，React 会根据最新 props/state 自动更新内部连接目标" },
      ],
      correctOptionId: "keep-true-dependency",
      explanation: "依赖的正确性优先于“少运行”。connectChatSocket(roomId) 明确读取 roomId 并用它决定外部同步目标；如果业务上确实不该频繁重连，应重新设计同步边界或上游状态，而不是制造 stale Effect。",
      diagnosticOptionMap: {
        "remove-for-performance": "remove-true-dependency",
        "effect-event-room": "effect-event-is-dependency-hack",
        "empty-array": "dependency-array-run-switch",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 149, endLine: 152 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-strict-mode",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["strict-mode", "effect-lifecycle", "development"],
    content: {
      prompt: "开发环境首次进入页面时日志可能出现额外 setup → cleanup → setup。应该怎样理解？",
      options: [
        { id: "development-stress-test", text: "这是 Strict Mode 的开发期压力测试，用来验证 cleanup 能否完整镜像 setup；它不是一次 roomId 依赖变化" },
        { id: "production-rule", text: "这说明 production 中每个 Effect setup 都必然自动执行两次" },
        { id: "dependency-bug", text: "只要看到额外 setup/cleanup，就说明依赖数组一定写错了" },
        { id: "remove-cleanup", text: "为了避免开发日志重复，应该移除 cleanup，让 setup 只保留一次" },
      ],
      correctOptionId: "development-stress-test",
      explanation: "Strict Mode 在开发环境会额外执行一次 setup → cleanup → setup 检查，用来暴露不对称或不可重复的 Effect。判断真实依赖变化时，应把这个开发检查与 roomId change 导致的 cleanup old → setup new 分开。",
      diagnosticOptionMap: {
        "production-rule": "strict-mode-is-production-duplicate",
        "dependency-bug": "strict-mode-is-production-duplicate",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 159, endLine: 165 },
    ],
  }),
]);

const CANONICAL_QUESTIONS_BY_LEARNING_UNIT = Object.freeze({
  "rendering-lists-key": RENDERING_LISTS_KEY_QUESTIONS,
  "state-snapshot-queue": STATE_SNAPSHOT_QUEUE_QUESTIONS,
  "not-need-effect": NOT_NEED_EFFECT_QUESTIONS,
  "preserving-resetting-state": PRESERVING_RESETTING_STATE_QUESTIONS,
  "lifecycle-of-reactive-effects": LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS,
});

export function getCanonicalAssessmentQuestions(learningUnitId) {
  const questions = CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId] ?? [];
  return questions.map((question) => structuredClone(question));
}

export function hasCanonicalAssessmentQuestions(learningUnitId) {
  return (CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId]?.length ?? 0) > 0;
}
