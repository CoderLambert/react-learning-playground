import { canonicalQuestion } from "./factory.js";

export const NOT_NEED_EFFECT_QUESTIONS = Object.freeze([
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
