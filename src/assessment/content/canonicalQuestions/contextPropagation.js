import { canonicalQuestion } from "./factory.js";

export const CONTEXT_PROPAGATION_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-context-subscription",
    learningUnitId: "context-propagation",
    difficulty: "easy",
    conceptTags: ["context", "subscription"],
    content: {
      prompt: "useContext(ThemeContext) 除了读取值，还意味着什么？",
      options: [
        { id: "subscribe", text: "组件订阅最近 Provider 的 ThemeContext value" },
        { id: "global-read-once", text: "只在第一次 mount 读取一次全局变量" },
        { id: "prop-only", text: "只订阅父组件 props" },
        { id: "dom", text: "直接订阅 DOM attribute" },
      ],
      correctOptionId: "subscribe",
      explanation: "Context 是响应式依赖；Provider value 改变时消费者需要新值。",
      diagnosticOptionMap: {
        "global-read-once": "context-is-global-variable",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ContextPropagationDemo.jsx", startLine: 34, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-context-memo",
    learningUnitId: "context-propagation",
    difficulty: "medium",
    conceptTags: ["context", "memo"],
    content: {
      prompt: "MemoConsumer 被 memo 包裹且内部读取 ThemeContext。theme Provider value 改变时最准确的判断是什么？",
      options: [
        { id: "rerender-for-context", text: "它仍需重新 render 以读取 fresh Context value" },
        { id: "memo-blocks", text: "memo 会阻止 Context 更新，继续显示旧 theme" },
        { id: "provider-only", text: "只有 Provider 自己变化" },
        { id: "manual-force", text: "必须 forceUpdate 才能收到新值" },
      ],
      correctOptionId: "rerender-for-context",
      explanation: "memo 主要优化 props 驱动工作，不取消组件自己的 Context 订阅。",
      diagnosticOptionMap: {
        "memo-blocks": "memo-blocks-context",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ContextPropagationDemo.jsx", startLine: 34, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-context-whole-value",
    learningUnitId: "context-propagation",
    difficulty: "medium",
    conceptTags: ["context", "identity"],
    content: {
      prompt: "value={{theme, cursor}} 中 cursor 高频变化。ThemeBadge 只读取 theme。原生 Context 是否自动提供字段级 selector？",
      options: [
        { id: "no-selector", text: "不会；consumer 订阅的是整个 Context value identity" },
        { id: "field-selector", text: "会；React 自动跟踪对象字段读取" },
        { id: "memo-selector", text: "只要 memo 就会自动变成字段 selector" },
        { id: "primitive-only", text: "Context 不能提供对象" },
      ],
      correctOptionId: "no-selector",
      explanation: "缩小通知范围要设计 Provider/value 粒度、拆 Context，或选择具备 selector 语义的其他方案。",
      diagnosticOptionMap: {
        "field-selector": "context-has-field-selectors",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ContextPropagationDemo.jsx", startLine: 112, endLine: 118 }],
  }),
  canonicalQuestion({
    id: "canonical-context-transfer",
    learningUnitId: "context-propagation",
    difficulty: "medium",
    conceptTags: ["context", "transfer"],
    content: {
      prompt: "ThemeBadge 被 memo 包裹并读取 SettingsContext。Provider value 的 theme 从 light 变 dark。哪项成立？",
      codeContext: {
        label: "陌生代码 · Settings.jsx",
        language: "jsx",
        code: `const SettingsContext = createContext(null);

const ThemeBadge = memo(function ThemeBadge() {
  const settings = useContext(SettingsContext);
  return <span>{settings.theme}</span>;
});

<SettingsContext value={{ theme }}>
  <ThemeBadge />
</SettingsContext>`,
      },
      options: [
        { id: "fresh-dark", text: "ThemeBadge 应重新读取 Context 并显示 dark" },
        { id: "stale-light", text: "memo 保证它继续显示 light" },
        { id: "no-provider", text: "memo consumer 不能放 Provider 下" },
        { id: "prop-required", text: "Context 更新必须同时改变 ThemeBadge props" },
      ],
      correctOptionId: "fresh-dark",
      explanation: "ThemeBadge 自己消费 Context，因此 value 更新不受 props memo 比较阻断。",
      diagnosticOptionMap: {
        "stale-light": "memo-blocks-context",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ContextPropagationDemo.jsx", startLine: 34, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-context-boundary",
    learningUnitId: "context-propagation",
    difficulty: "hard",
    conceptTags: ["context", "design"],
    content: {
      prompt: "何时拆分一个巨大 Context 更有意义？",
      options: [
        { id: "different-domains", text: "互不相关的数据有不同消费者和更新频率，当前组合 value 扩大了订阅耦合" },
        { id: "always", text: "每个字段都必须单独一个 Context" },
        { id: "never", text: "Context value 粒度不会影响消费者" },
        { id: "memo-only", text: "只要给所有 consumer 加 memo，就永远不需要拆分" },
      ],
      correctOptionId: "different-domains",
      explanation: "拆 Context 是依赖边界设计，应由领域和更新模式驱动。",
      diagnosticOptionMap: {
        "memo-only": "memo-blocks-context",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ContextPropagationDemo.jsx", startLine: 112, endLine: 118 }],
  }),
]);
