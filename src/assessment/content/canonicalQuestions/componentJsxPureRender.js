import { canonicalQuestion } from "./factory.js";

export const COMPONENT_JSX_PURE_RENDER_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-component-jsx-pure-render-purity",
    learningUnitId: "component-jsx-pure-render",
    difficulty: "easy",
    conceptTags: ["render", "purity"],
    content: {
      prompt: "对一个纯 render 计算来说，相同 Props / State 输入重复执行两次，最重要的约束是什么？",
      options: [
        { id: "same-description", text: "应得到相同的 UI 描述，并且不依赖执行次数修改外部世界" },
        { id: "new-dom", text: "每次执行都必须创建不同 DOM 节点" },
        { id: "new-sequence", text: "第二次执行应该自动得到新的序号" },
        { id: "single-run", text: "组件函数必须保证只执行一次" },
      ],
      correctOptionId: "same-description",
      explanation: "纯 render 的关键是输出由当前输入决定且没有外部可观察副作用，因此 React 可以安全地重复、暂停或放弃一次计算。",
      diagnosticOptionMap: {
        "new-dom": "render-directly-mutates-dom",
        "new-sequence": "strict-mode-means-bug",
        "single-run": "strict-mode-means-bug",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 5, endLine: 11 }],
  }),
  canonicalQuestion({
    id: "canonical-component-jsx-pure-render-jsx",
    learningUnitId: "component-jsx-pure-render",
    difficulty: "easy",
    conceptTags: ["jsx", "render"],
    content: {
      prompt: "组件函数返回 JSX 时，这一步最准确的描述是什么？",
      options: [
        { id: "ui-description", text: "返回 React 元素描述，之后由 React 决定需要提交哪些宿主环境变化" },
        { id: "html-string", text: "直接拼接一段 HTML 字符串并立即写进 DOM" },
        { id: "network", text: "自动把 JSX 发送到服务端生成 DOM" },
        { id: "commit", text: "返回 JSX 本身就是 commit 阶段" },
      ],
      correctOptionId: "ui-description",
      explanation: "JSX 是 JavaScript 中描述 UI 的语法。组件函数执行属于 render 计算，是否修改 DOM 属于后续 commit。",
      diagnosticOptionMap: {
        "html-string": "render-directly-mutates-dom",
        commit: "render-directly-mutates-dom",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 14, endLine: 23 }],
  }),
  canonicalQuestion({
    id: "canonical-component-jsx-pure-render-transfer",
    learningUnitId: "component-jsx-pure-render",
    difficulty: "medium",
    conceptTags: ["purity", "mutation", "transfer"],
    content: {
      prompt: "下面组件被 React 重复 render 时，哪一处最直接破坏了 render purity？",
      codeContext: {
        label: "陌生代码 · Badge.jsx",
        language: "jsx",
        code: `let visits = 0;

function Badge({ label }) {
  visits += 1;
  return <span>{label} · {visits}</span>;
}`,
      },
      options: [
        { id: "module-mutation", text: "visits += 1 修改了 render 开始前已经存在的模块级数据" },
        { id: "read-label", text: "读取 label prop" },
        { id: "jsx-expression", text: "在 JSX 中插入 label" },
        { id: "return-span", text: "返回 span React 元素" },
      ],
      correctOptionId: "module-mutation",
      explanation: "模块级 visits 是 render 前已存在、可被后续调用观察的外部数据。修改它让相同 label 的结果依赖执行次数。",
      diagnosticOptionMap: {
        "return-span": "render-directly-mutates-dom",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 3, endLine: 11 }],
  }),
  canonicalQuestion({
    id: "canonical-component-jsx-pure-render-local-mutation",
    learningUnitId: "component-jsx-pure-render",
    difficulty: "medium",
    conceptTags: ["purity", "local-mutation"],
    content: {
      prompt: "下面哪种 mutation 通常仍符合 render purity 边界？",
      options: [
        { id: "local-new-array", text: "在本次 render 内新建 const rows = []，随后 push 当前输入生成的行，再立即用于本次返回值" },
        { id: "module-array", text: "向模块级 sharedRows.push(...) 写入数据" },
        { id: "local-storage", text: "在组件函数主体里 localStorage.setItem(...)" },
        { id: "dom-write", text: "在组件函数主体里直接修改 document.title" },
      ],
      correctOptionId: "local-new-array",
      explanation: "本次 render 内新建、尚未逃逸的局部对象可以用于构造结果；问题在于修改 render 前已存在或外部可观察的数据。",
      diagnosticOptionMap: {
        "module-array": "all-mutation-forbidden",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 48, endLine: 59 }],
  }),
  canonicalQuestion({
    id: "canonical-component-jsx-pure-render-commit",
    learningUnitId: "component-jsx-pure-render",
    difficulty: "medium",
    conceptTags: ["render", "commit"],
    content: {
      prompt: "为什么“组件函数执行了两次”不能直接推出“DOM 一定修改了两次”？",
      options: [
        { id: "separate-phases", text: "render 先计算元素描述，React 之后才决定哪些变化需要 commit；两者不是一一对应" },
        { id: "browser-cache", text: "浏览器会缓存第二次函数调用，所以 React 不知道它发生了" },
        { id: "jsx-no-dom", text: "因为 JSX 永远不会产生 DOM" },
        { id: "state-only", text: "只有 useState 组件才有 commit" },
      ],
      correctOptionId: "separate-phases",
      explanation: "React 可以执行 render 计算而最终不提交新的 DOM 变化。组件函数运行和 DOM commit 是不同阶段。",
      diagnosticOptionMap: {
        "jsx-no-dom": "render-directly-mutates-dom",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 132, endLine: 175 }],
  }),
]);
