import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const CONTEXT_PROPAGATION_DEFINITION = {
  learningUnitId: "context-propagation",
  revision: 1,
  goal: "把 useContext 理解为对最近 Provider value 的响应式订阅读取，并区分 props memoization 与 Context 更新。",
  steps: [
    {
      id: "predict-memo-context-update",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "MemoConsumer 被 memo 包裹，但内部调用 useContext(ThemeContext)。Provider theme 改变时它会怎样？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "consumer-rerenders", label: "需要重新 render 以读取新的 Context value" },
          { id: "memo-freezes", label: "memo 会把旧 theme 永久缓存住" },
          { id: "only-parent", label: "只有 Provider 自己 render，consumer 不会收到通知" },
        ],
      },
      reveal: {
        expectedOptionId: "consumer-rerenders",
        observation: "memo 主要比较 props；组件自己的 Context subscription 仍然需要接收新 value。",
      },
    },
    {
      id: "experiment-context-vs-parent-update",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "分别切换 Theme 与只更新父级 localCount，比较普通 Consumer、memo Consumer、memo Non-consumer 的行为。",
      demoActionId: "compare-context-and-parent-updates",
      expectedObservation: "ThemeContext 变化会通知真正读取它的 consumer；memo Non-consumer 没有这条订阅。父级 render 与 Context notification 是不同来源。",
    },
    {
      id: "explain-context-subscription",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么 memo 不能阻止一个组件自己消费的 Context 更新，以及对象 Context 为什么没有字段级 selector 语义。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 Provider value identity、useContext 订阅与 props memoization 来解释…",
      },
    },
    {
      id: "practice-split-hot-context",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "ThemeBadge 只需要 theme，但它订阅了包含高频 cursor 的大对象 Context。选择缩小订阅边界的最小结构修复。",
      codeContext: {
        label: "陌生组件 · AppContext.jsx",
        language: "jsx",
        code: `const AppContext = createContext(null);

function ThemeBadge() {
  const { theme } = useContext(AppContext);
  return <span>{theme}</span>;
}

<AppContext value={{ theme, cursor }}>
  <ThemeBadge />
  <Canvas />
</AppContext>`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "split-contexts",
            label: "Patch A",
            patch: `+ const ThemeContext = createContext("light");
+ const CursorContext = createContext(null);
- <AppContext value={{ theme, cursor }}>
+ <ThemeContext value={theme}>
+   <CursorContext value={cursor}>
      ...
+   </CursorContext>
+ </ThemeContext>`,
          },
          {
            id: "memo-theme-badge",
            label: "Patch B",
            patch: `- function ThemeBadge() {
+ const ThemeBadge = memo(function ThemeBadge() {`,
          },
          {
            id: "copy-theme-state",
            label: "Patch C",
            patch: `+ const [localTheme, setLocalTheme] = useState(theme);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "split-contexts",
        observation: "Theme 与 cursor 更新频率和消费者不同。拆分 Context 能让 ThemeBadge 不再订阅 cursor 所在的 value；memo 本身不会取消 Context 订阅。",
      },
    },
    {
      id: "review-context-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：useContext 读取最近 Provider 并建立订阅；Provider value identity 变化会通知 consumer；memo 不屏蔽组件自己的 Context 更新。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
