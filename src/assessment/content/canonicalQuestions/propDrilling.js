import { canonicalQuestion } from "./factory.js";

export const PROP_DRILLING_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-prop-drilling-not-automatic",
    learningUnitId: "prop-drilling",
    difficulty: "easy",
    conceptTags: ["props", "prop-drilling"],
    content: {
      prompt: "数据经过三层 Props 就一定应该改成 Context 吗？",
      options: [
        { id: "depends-on-cost", text: "不一定；先看中间层是否只是机械透传、真正消费者数量和依赖可读性" },
        { id: "always-context", text: "是，只要超过两层就是反模式" },
        { id: "always-store", text: "是，跨组件数据必须进全局 store" },
        { id: "props-static", text: "是，因为 Props 不能响应更新" },
      ],
      correctOptionId: "depends-on-cost",
      explanation: "Props 显式性本身有价值。是否需要重构取决于真实职责和接口成本，不是固定层数。",
      diagnosticOptionMap: {
        "always-context": "any-depth-is-drilling",
        "props-static": "any-depth-is-drilling",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropDrillingDemo.jsx", startLine: 35, endLine: 74 }],
  }),
  canonicalQuestion({
    id: "canonical-prop-drilling-composition",
    learningUnitId: "prop-drilling",
    difficulty: "medium",
    conceptTags: ["composition", "props"],
    content: {
      prompt: "中间 Navbar 只负责布局，只有深层 Avatar 需要 user。为什么 composition 可能比让 Navbar 继续接 user 更合适？",
      options: [
        { id: "layout-no-business-dependency", text: "父级可先组装 Avatar，再把 JSX 交给 Navbar，让布局层不需要知道 user" },
        { id: "changes-owner", text: "composition 会自动把 user State 所有权移到 Navbar" },
        { id: "prevents-render", text: "composition 保证 Navbar 永远不会重新 render" },
        { id: "creates-context", text: "children/slot 会自动建立 Context" },
      ],
      correctOptionId: "layout-no-business-dependency",
      explanation: "Composition 可以缩短业务数据 Props 链，同时保持调用处依赖显式；它不改变 State ownership。",
      diagnosticOptionMap: {
        "changes-owner": "composition-changes-ownership",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropDrillingDemo.jsx", startLine: 82, endLine: 112 }],
  }),
  canonicalQuestion({
    id: "canonical-prop-drilling-transfer",
    learningUnitId: "prop-drilling",
    difficulty: "medium",
    conceptTags: ["composition", "transfer"],
    content: {
      prompt: "下面只有 Avatar 真正消费 user，Shell 只是布局。若目标是保持依赖显式并去掉无意义透传，优先考虑什么？",
      codeContext: {
        label: "陌生代码 · Page.jsx",
        language: "jsx",
        code: `function Shell({ user }) {
  return <main><Avatar user={user} /></main>;
}

function Page({ user }) {
  return <Shell user={user} />;
}`,
      },
      options: [
        { id: "compose", text: "让 Page 直接组装 <Avatar user={user}/>，Shell 改为接 children/slot" },
        { id: "context", text: "立刻创建 UserContext，即使只有一个消费者" },
        { id: "global-store", text: "把 user 移进全局 store" },
        { id: "rename", text: "把 user prop 改名为 currentUser 但继续机械透传" },
      ],
      correctOptionId: "compose",
      explanation: "布局层不需要业务数据且消费者很少时，composition 是更小的职责修复；Context 不应只为省一个 prop。",
      diagnosticOptionMap: {
        context: "context-default-choice",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropDrillingDemo.jsx", startLine: 99, endLine: 110 }],
  }),
  canonicalQuestion({
    id: "canonical-prop-drilling-context",
    learningUnitId: "prop-drilling",
    difficulty: "medium",
    conceptTags: ["context", "consumers"],
    content: {
      prompt: "下面哪种场景更能证明 Context 的价值？",
      options: [
        { id: "many-distant", text: "主题/当前账号等同一环境值被树中多个相距很远的后代消费" },
        { id: "one-child", text: "父组件只给直接子组件传一个 title" },
        { id: "avoid-all-props", text: "团队规定任何 Props 都不允许超过一层" },
        { id: "local-input", text: "一个 input 自己的临时 draft" },
      ],
      correctOptionId: "many-distant",
      explanation: "Context 适合真正的跨层共享依赖。它降低机械透传，但同时让依赖更隐式并产生订阅关系。",
      diagnosticOptionMap: {
        "avoid-all-props": "context-default-choice",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropDrillingDemo.jsx", startLine: 119, endLine: 145 }],
  }),
  canonicalQuestion({
    id: "canonical-prop-drilling-ownership",
    learningUnitId: "prop-drilling",
    difficulty: "hard",
    conceptTags: ["ownership", "context", "composition"],
    content: {
      prompt: "把 Props 路径改成 Composition 或 Context 后，顶层 user State 的所有权会自动发生什么？",
      options: [
        { id: "unchanged", text: "不会自动改变；传递机制和 State ownership 是两个独立问题" },
        { id: "context-owns", text: "Context 对象自动成为 user 的所有者" },
        { id: "consumer-owns", text: "最深层消费者自动获得修改 user 的所有权" },
        { id: "dom-owns", text: "最终显示 user 的 DOM 节点成为所有者" },
      ],
      correctOptionId: "unchanged",
      explanation: "Props/Composition/Context 决定数据如何到达消费者，不会自动改变谁保存并更新源 State。",
      diagnosticOptionMap: {
        "context-owns": "composition-changes-ownership",
        "consumer-owns": "composition-changes-ownership",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "PropDrillingDemo.jsx", startLine: 190, endLine: 198 }],
  }),
]);
