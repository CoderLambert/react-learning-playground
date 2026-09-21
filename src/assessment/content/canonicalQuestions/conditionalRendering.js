import { canonicalQuestion } from "./factory.js";

export const CONDITIONAL_RENDERING_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-conditional-rendering-early-return",
    learningUnitId: "conditional-rendering",
    difficulty: "easy",
    conceptTags: ["conditional-rendering", "early-return"],
    content: {
      prompt: "ResultPanel 在 status='error' 时进入 error 分支并 return。后面的 success JSX 会怎样？",
      options: [
        { id: "not-returned", text: "不会进入这次函数的返回结果" },
        { id: "also-rendered", text: "仍会和 error 一起渲染" },
        { id: "hidden-css", text: "会先生成 DOM，再由 CSS 隐藏" },
        { id: "effect", text: "要等 Effect 决定是否删除" },
      ],
      correctOptionId: "not-returned",
      explanation: "普通 JavaScript return 会结束当前函数路径。early return 非常适合清晰表达互斥阻断态。",
      diagnosticOptionMap: {
        "hidden-css": "conditional-is-react-directive",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ConditionalRenderingDemo.jsx", startLine: 5, endLine: 31 }],
  }),
  canonicalQuestion({
    id: "canonical-conditional-rendering-state-model",
    learningUnitId: "conditional-rendering",
    difficulty: "medium",
    conceptTags: ["state-model", "conditional-rendering"],
    content: {
      prompt: "为什么 loading/error/empty/success 这类互斥状态通常比 isLoading + hasError + isEmpty 三个独立 boolean 更可靠？",
      options: [
        { id: "avoid-invalid-combos", text: "单一 status 更难表达“同时 loading、error、empty”这类非法组合" },
        { id: "fewer-renders", text: "单一 status 保证 React 永远只 render 一次" },
        { id: "css", text: "boolean 不能用于 JSX className" },
        { id: "no-state", text: "status 不是 State，所以不会更新" },
      ],
      correctOptionId: "avoid-invalid-combos",
      explanation: "状态模型应先可靠表达业务事实。多个松散 boolean 可能组合出产品上不可能存在的情境。",
      diagnosticOptionMap: {
        "fewer-renders": "loose-booleans-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ConditionalRenderingDemo.jsx", startLine: 3, endLine: 5 }],
  }),
  canonicalQuestion({
    id: "canonical-conditional-rendering-transfer",
    learningUnitId: "conditional-rendering",
    difficulty: "medium",
    conceptTags: ["derived-state", "transfer"],
    content: {
      prompt: "下面 isEmpty 完全由当前 items.length 决定。最小正确简化是什么？",
      codeContext: {
        label: "陌生代码 · Results.jsx",
        language: "jsx",
        code: `function Results({ items }) {
  const [isEmpty, setIsEmpty] = useState(items.length === 0);

  useEffect(() => {
    setIsEmpty(items.length === 0);
  }, [items]);

  return isEmpty ? <Empty /> : <List items={items} />;
}`,
      },
      options: [
        { id: "derive", text: "删除 isEmpty State/Effect，直接 const isEmpty = items.length === 0" },
        { id: "keep-sync", text: "保留同步 State，因为条件渲染必须由 State 控制" },
        { id: "second-boolean", text: "再加 hasItems State，两个互相校验" },
        { id: "context", text: "把 isEmpty 放 Context" },
      ],
      correctOptionId: "derive",
      explanation: "isEmpty 是当前 items 的派生条件。直接计算让当前 render 的分支与当前输入保持一致。",
      diagnosticOptionMap: {
        "second-boolean": "loose-booleans-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ConditionalRenderingDemo.jsx", startLine: 143, endLine: 147 }],
  }),
  canonicalQuestion({
    id: "canonical-conditional-rendering-and-zero",
    learningUnitId: "conditional-rendering",
    difficulty: "medium",
    conceptTags: ["conditional-rendering", "and-operator"],
    content: {
      prompt: "如果写 {count && <Badge />}，当 count === 0 时最值得警惕什么？",
      options: [
        { id: "zero-can-render", text: "JavaScript && 返回 0，React 可能把数字 0 渲染出来" },
        { id: "badge-renders", text: "Badge 一定会渲染，因为 0 是有效数字" },
        { id: "syntax-error", text: "JSX 禁止 &&" },
        { id: "state-reset", text: "count 会自动被重置为 false" },
      ],
      correctOptionId: "zero-can-render",
      explanation: "&& 返回操作数本身，不会自动 Boolean 化。当前 Demo 用真正 boolean showDebug，因此更适合这种写法。",
      diagnosticOptionMap: {
        "badge-renders": "and-always-boolean",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ConditionalRenderingDemo.jsx", startLine: 109, endLine: 120 }],
  }),
  canonicalQuestion({
    id: "canonical-conditional-rendering-syntax-choice",
    learningUnitId: "conditional-rendering",
    difficulty: "hard",
    conceptTags: ["conditional-rendering", "readability"],
    content: {
      prompt: "一个页面有 loading、permissionDenied、error 三个阻断态和最后的正常内容。更稳妥的起点是什么？",
      options: [
        { id: "early-returns", text: "先让状态模型明确，再用连续 early return 处理阻断态，最后返回正常内容" },
        { id: "nested-ternary", text: "必须把所有状态压成一个多层嵌套 ternary" },
        { id: "four-effects", text: "为每种状态建立 Effect 来决定显示哪个 UI" },
        { id: "css-only", text: "始终渲染所有分支，只用 CSS display:none 控制" },
      ],
      correctOptionId: "early-returns",
      explanation: "复杂互斥业务态首先需要清楚的状态和优先级；early return 往往能让阻断分支保持独立可读。",
      diagnosticOptionMap: {
        "nested-ternary": "conditional-is-react-directive",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ConditionalRenderingDemo.jsx", startLine: 5, endLine: 39 }],
  }),
]);
