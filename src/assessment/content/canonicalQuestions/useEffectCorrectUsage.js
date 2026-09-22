import { canonicalQuestion } from "./factory.js";

export const USE_EFFECT_CORRECT_USAGE_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-effect-external-sync",
    learningUnitId: "use-effect-correct-usage",
    difficulty: "easy",
    conceptTags: ["effect", "external-system"],
    content: {
      prompt: "本课中 useEffect 最核心的使用条件是什么？",
      options: [
        { id: "external-sync", text: "需要把当前 committed React 状态与 React 外部系统保持同步" },
        { id: "any-state-change", text: "只要任何 State 改变就应该写 Effect" },
        { id: "any-side-effect", text: "只要代码有副作用就必须放 Effect" },
        { id: "after-render-hook", text: "把所有 render 后想执行的代码都放 Effect" },
      ],
      correctOptionId: "external-sync",
      explanation: "Effect 是 escape hatch，用于组件存在期间维护与外部系统的同步关系。",
      diagnosticOptionMap: {
        "any-state-change": "effect-is-state-listener",
        "any-side-effect": "event-command-needs-effect",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseEffectCorrectUsageDemo.jsx", startLine: 56, endLine: 75 }],
  }),
  canonicalQuestion({
    id: "canonical-effect-cleanup-subscription",
    learningUnitId: "use-effect-correct-usage",
    difficulty: "medium",
    conceptTags: ["effect", "cleanup", "subscription"],
    content: {
      prompt: "Effect setup 执行 window.addEventListener('resize', handleResize)。最匹配的 cleanup 是什么？",
      options: [
        { id: "remove-same", text: "window.removeEventListener('resize', handleResize)" },
        { id: "nothing", text: "不需要 cleanup，浏览器会在 React re-render 时自动删除 listener" },
        { id: "remove-new-function", text: "removeEventListener('resize', () => handleResize())" },
        { id: "add-again", text: "cleanup 中再次 addEventListener" },
      ],
      correctOptionId: "remove-same",
      explanation: "订阅 cleanup 必须撤销 setup 真正建立的关系，并使用同一个 handler identity。",
      diagnosticOptionMap: {
        nothing: "cleanup-is-optional-for-subscription",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseEffectCorrectUsageDemo.jsx", startLine: 3, endLine: 17 }],
  }),
  canonicalQuestion({
    id: "canonical-effect-document-title",
    learningUnitId: "use-effect-correct-usage",
    difficulty: "medium",
    conceptTags: ["effect", "dependency", "document"],
    content: {
      prompt: "为什么 pageTitleBadge 适合作为同步 document.title 的 Effect 依赖？",
      options: [
        { id: "determines-sync", text: "Effect 用它决定当前外部 title 应是什么；值改变时外部同步目标需要更新" },
        { id: "all-state-deps", text: "组件中的所有 State 都必须加入每个 Effect" },
        { id: "forces-paint", text: "依赖数组负责强制浏览器 paint" },
        { id: "cleanup-only", text: "依赖只用于决定是否运行 cleanup，与 setup 无关" },
      ],
      correctOptionId: "determines-sync",
      explanation: "依赖应反映 Effect setup 实际读取的 reactive values，以及这些值何时要求重新同步外部系统。",
      diagnosticOptionMap: {
        "all-state-deps": "effect-is-state-listener",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseEffectCorrectUsageDemo.jsx", startLine: 56, endLine: 65 }],
  }),
  canonicalQuestion({
    id: "canonical-effect-transfer",
    learningUnitId: "use-effect-correct-usage",
    difficulty: "medium",
    conceptTags: ["effect", "causality", "transfer"],
    content: {
      prompt: "下面三个需求中，哪一个最明确需要 Effect？",
      codeContext: {
        label: "陌生代码 · ProfilePage.jsx",
        language: "jsx",
        code: `const fullName = firstName + " " + lastName;

function handleBuy() {
  postPurchase(productId);
}

// 组件存在期间需要监听浏览器 online/offline 状态
`,
      },
      options: [
        { id: "online-subscription", text: "组件存在期间订阅浏览器 online/offline 事件，并在 cleanup 中解除订阅" },
        { id: "full-name", text: "计算 fullName" },
        { id: "purchase", text: "用户点击后调用 postPurchase(productId)" },
        { id: "all-three", text: "三者都必须通过 Effect 执行" },
      ],
      correctOptionId: "online-subscription",
      explanation: "浏览器订阅是组件生命周期内的外部同步；fullName 属于 render derivation，购买命令由明确 Event Handler 导致。",
      diagnosticOptionMap: {
        purchase: "event-command-needs-effect",
        "all-three": "effect-is-state-listener",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseEffectCorrectUsageDemo.jsx", startLine: 3, endLine: 17 }],
  }),
  canonicalQuestion({
    id: "canonical-effect-cleanup-boundary",
    learningUnitId: "use-effect-correct-usage",
    difficulty: "hard",
    conceptTags: ["effect", "cleanup", "strict-mode"],
    content: {
      prompt: "“每个 Effect 都必须 return cleanup”为什么不准确？",
      options: [
        { id: "cleanup-mirrors-setup", text: "cleanup 的职责是撤销 setup 建立的外部关系；没有需要停止/释放的关系时，不应为了形式机械添加" },
        { id: "cleanup-never", text: "cleanup 已被 React 19 废弃" },
        { id: "only-unmount", text: "cleanup 只会在真实业务卸载时运行，所以依赖变化无需考虑" },
        { id: "strict-only", text: "cleanup 只在 Strict Mode 中有意义" },
      ],
      correctOptionId: "cleanup-mirrors-setup",
      explanation: "是否需要 cleanup 取决于 setup 是否创建了需要撤销的外部同步；订阅、连接、timer 等通常需要对称清理。",
      diagnosticOptionMap: {
        "strict-only": "every-effect-needs-cleanup",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseEffectCorrectUsageDemo.jsx", startLine: 3, endLine: 17 }],
  }),
]);
