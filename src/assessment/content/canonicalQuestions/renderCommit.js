import { canonicalQuestion } from "./factory.js";

export const RENDER_COMMIT_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-render-commit-phases",
    learningUnitId: "render-commit",
    difficulty: "easy",
    conceptTags: ["render", "commit"],
    content: {
      prompt: "React Render 与 Commit 最准确的区别是什么？",
      options: [
        { id: "compute-apply", text: "Render 计算下一份 UI 描述；Commit 把真正需要的宿主环境变化应用出去" },
        { id: "same-phase", text: "两者只是同一阶段的两个名字" },
        { id: "render-dom", text: "Render 直接写 DOM，Commit 只做日志" },
        { id: "commit-calculate", text: "Commit 负责调用组件函数计算 JSX" },
      ],
      correctOptionId: "compute-apply",
      explanation: "Render 是纯计算阶段，Commit 才把需要的 DOM/refs 等 host changes 应用到宿主环境。",
      diagnosticOptionMap: {
        "render-dom": "render-equals-dom-mutation",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 74, endLine: 80 }],
  }),
  canonicalQuestion({
    id: "canonical-render-commit-unrelated-state",
    learningUnitId: "render-commit",
    difficulty: "medium",
    conceptTags: ["render", "dom-mutation"],
    content: {
      prompt: "只更新 themeTick，而 Count 文本仍由相同 count 计算。最稳妥的结论是什么？",
      options: [
        { id: "render-no-count-mutation", text: "组件可以重新 render，但 Count DOM 节点不需要 mutation" },
        { id: "all-dom-mutates", text: "组件 render 意味着所有 DOM 节点都必须重写" },
        { id: "no-react-work", text: "React 不会处理 themeTick 更新" },
        { id: "paint-only", text: "只有 browser paint 会执行，React 不会 render" },
      ],
      correctOptionId: "render-no-count-mutation",
      explanation: "React 可以重新计算组件，但 commit 只应用结果中真正需要的变化。",
      diagnosticOptionMap: {
        "all-dom-mutates": "render-equals-dom-mutation",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 42, endLine: 50 },
      { kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 63, endLine: 70 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-render-commit-transfer",
    learningUnitId: "render-commit",
    difficulty: "medium",
    conceptTags: ["render", "commit", "transfer"],
    content: {
      prompt: "点击“切换主题”后，哪项结论可以从这段代码可靠推出？",
      codeContext: {
        label: "陌生代码 · PriceCard.jsx",
        language: "jsx",
        code: `function PriceCard({ price }) {
  const [theme, setTheme] = useState("light");

  return (
    <section data-theme={theme}>
      <strong>¥{price}</strong>
      <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
        切换主题
      </button>
    </section>
  );
}`,
      },
      options: [
        { id: "price-may-not-mutate", text: "State 更新会触发 React 工作，但 price 未变时 strong 文本本身不一定需要 DOM mutation" },
        { id: "strong-must-recreate", text: "strong DOM 节点必须被销毁并重新创建" },
        { id: "no-render", text: "因为 price 没变，PriceCard 不会因自己的 theme State 更新而 render" },
        { id: "raf-required", text: "必须调用 requestAnimationFrame 才能 commit theme" },
      ],
      correctOptionId: "price-may-not-mutate",
      explanation: "组件自己的 State 更新可触发 render，但具体某个 DOM 节点是否改变取决于新旧结果是否需要 host change。",
      diagnosticOptionMap: {
        "strong-must-recreate": "render-equals-dom-mutation",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 42, endLine: 70 }],
  }),
  canonicalQuestion({
    id: "canonical-render-commit-raf",
    learningUnitId: "render-commit",
    difficulty: "medium",
    conceptTags: ["render", "browser", "raf"],
    content: {
      prompt: "当前 Demo 中 requestAnimationFrame 的角色是什么？",
      options: [
        { id: "browser-observation", text: "在下一浏览器帧收尾观察窗口，确认是否没看到 Count DOM mutation；它不是 React commit callback" },
        { id: "commit-hook", text: "React 保证每次 commit 都会调用这个 rAF" },
        { id: "render-counter", text: "它精确统计组件函数执行次数" },
        { id: "state-queue", text: "它负责处理 React State update queue" },
      ],
      correctOptionId: "browser-observation",
      explanation: "rAF 属于浏览器调度。Demo 只用它在下一帧报告未观察到 mutation。",
      diagnosticOptionMap: {
        "commit-hook": "raf-is-commit-callback",
        "render-counter": "raf-is-commit-callback",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 28, endLine: 40 }],
  }),
  canonicalQuestion({
    id: "canonical-render-commit-paint",
    learningUnitId: "render-commit",
    difficulty: "hard",
    conceptTags: ["render", "commit", "paint"],
    content: {
      prompt: "哪条顺序最符合本课的概念层级？",
      options: [
        { id: "trigger-render-commit-paint", text: "Trigger → Render → Commit → Browser Paint" },
        { id: "paint-render-commit", text: "Browser Paint → Render → Commit" },
        { id: "render-paint-trigger", text: "Render → Browser Paint → Trigger → Commit" },
        { id: "commit-trigger-render", text: "Commit → Trigger → Render → Paint" },
      ],
      correctOptionId: "trigger-render-commit-paint",
      explanation: "更新先触发 React 工作，Render 计算 UI，Commit 应用必要 host changes，浏览器随后才有机会 paint。",
      diagnosticOptionMap: {
        "paint-render-commit": "paint-is-react-render",
        "render-paint-trigger": "paint-is-react-render",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "RenderCommitDemo.jsx", startLine: 74, endLine: 83 }],
  }),
]);
