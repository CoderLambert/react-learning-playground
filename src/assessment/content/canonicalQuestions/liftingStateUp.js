import { canonicalQuestion } from "./factory.js";

export const LIFTING_STATE_UP_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-lifting-owner",
    learningUnitId: "lifting-state-up",
    difficulty: "easy",
    conceptTags: ["state-ownership", "lifting-state"],
    content: {
      prompt: "SearchBox、Summary、List 必须围绕同一个 query 协同。query 最合适放在哪里？",
      options: [
        { id: "nearest-owner", text: "三个消费者的最近共同 owner" },
        { id: "each-copy", text: "每个子组件各存一份，再用 Effect 同步" },
        { id: "window", text: "window 全局变量" },
        { id: "always-root", text: "无条件放到应用最顶层" },
      ],
      correctOptionId: "nearest-owner",
      explanation: "共享事实只保留一份，并放到能覆盖需要协调消费者的最近共同 owner。",
      diagnosticOptionMap: {
        "each-copy": "siblings-should-sync",
        "always-root": "lift-to-root",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "LiftingStateUpDemo.jsx", startLine: 137, endLine: 148 }],
  }),
  canonicalQuestion({
    id: "canonical-lifting-callback",
    learningUnitId: "lifting-state-up",
    difficulty: "medium",
    conceptTags: ["callbacks", "ownership"],
    content: {
      prompt: "SearchBox 调用 onChange(next) 最准确表达什么？",
      options: [
        { id: "intent", text: "向 query owner 报告用户意图；owner 仍决定最终值" },
        { id: "direct-parent-mutation", text: "子组件直接修改了父组件变量" },
        { id: "global-event", text: "把 query 写进浏览器全局状态" },
        { id: "context-subscription", text: "自动创建 Context" },
      ],
      correctOptionId: "intent",
      explanation: "Callback 让数据 owner 接收事件意图，不改变 State ownership。",
      diagnosticOptionMap: {
        "direct-parent-mutation": "callback-is-child-write",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "LiftingStateUpDemo.jsx", startLine: 7, endLine: 16 }],
  }),
  canonicalQuestion({
    id: "canonical-lifting-single-source",
    learningUnitId: "lifting-state-up",
    difficulty: "medium",
    conceptTags: ["single-source", "siblings"],
    content: {
      prompt: "为什么两个兄弟组件各自保存一份 selectedId，再互相同步，通常比提升 State 风险更高？",
      options: [
        { id: "duplicate-fact", text: "同一事实有两份可独立变化的 State，任何漏同步都可能让 UI 分叉" },
        { id: "siblings-cannot-state", text: "兄弟组件不能调用 useState" },
        { id: "callbacks-slow", text: "callback 一定比 Effect 慢" },
        { id: "only-context", text: "兄弟协同只能用 Context" },
      ],
      correctOptionId: "duplicate-fact",
      explanation: "提升 State 的核心是删除重复 truth，而不是建立更复杂的消息总线。",
      diagnosticOptionMap: {
        "only-context": "lift-to-root",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "LiftingStateUpDemo.jsx", startLine: 137, endLine: 148 }],
  }),
  canonicalQuestion({
    id: "canonical-lifting-transfer",
    learningUnitId: "lifting-state-up",
    difficulty: "medium",
    conceptTags: ["lifting-state", "transfer"],
    content: {
      prompt: "FilterInput 与 Results 都需要同一个 query。下面哪种改造最符合单一事实来源？",
      codeContext: {
        label: "陌生代码 · SearchWorkspace.jsx",
        language: "jsx",
        code: `function FilterInput() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

function Results() {
  const [query] = useState("");
  return <ResultList query={query} />;
}`,
      },
      options: [
        { id: "lift-query", text: "把 query 提到两者共同父级，并把 value / onChange / query 作为 props 传下去" },
        { id: "two-effects", text: "保留两份 query，用两个 Effect 互相同步" },
        { id: "dom-query", text: "从 input DOM 查询当前值供 Results 使用" },
        { id: "duplicate-more", text: "再加第三份 query State 作为中间缓存" },
      ],
      correctOptionId: "lift-query",
      explanation: "一个 owner 保存共享 query，消费者只读取同一个事实。",
      diagnosticOptionMap: {
        "two-effects": "siblings-should-sync",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "LiftingStateUpDemo.jsx", startLine: 137, endLine: 148 }],
  }),
  canonicalQuestion({
    id: "canonical-lifting-boundary",
    learningUnitId: "lifting-state-up",
    difficulty: "hard",
    conceptTags: ["state-ownership", "boundary"],
    content: {
      prompt: "某个展开面板 expanded 只被 Panel 自己使用，不需要任何兄弟组件协调。是否应该因为“状态提升是最佳实践”而移到页面根组件？",
      options: [
        { id: "keep-local", text: "不应该；只对局部交互有意义的 State 留在最近需要它的位置更清楚" },
        { id: "always-lift", text: "应该；所有 State 都必须放在最高层" },
        { id: "context", text: "应该先放 Context，不管有没有其他消费者" },
        { id: "url", text: "任何 boolean 都必须写入 URL" },
      ],
      correctOptionId: "keep-local",
      explanation: "状态提升服务真实协调需求，不是越高越好。",
      diagnosticOptionMap: {
        "always-lift": "lift-to-root",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "LiftingStateUpDemo.jsx", startLine: 137, endLine: 148 }],
  }),
]);
