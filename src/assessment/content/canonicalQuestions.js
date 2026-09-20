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

const CANONICAL_QUESTIONS_BY_LEARNING_UNIT = Object.freeze({
  "rendering-lists-key": RENDERING_LISTS_KEY_QUESTIONS,
  "state-snapshot-queue": STATE_SNAPSHOT_QUEUE_QUESTIONS,
  "not-need-effect": NOT_NEED_EFFECT_QUESTIONS,
});

export function getCanonicalAssessmentQuestions(learningUnitId) {
  const questions = CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId] ?? [];
  return questions.map((question) => structuredClone(question));
}

export function hasCanonicalAssessmentQuestions(learningUnitId) {
  return (CANONICAL_QUESTIONS_BY_LEARNING_UNIT[learningUnitId]?.length ?? 0) > 0;
}
