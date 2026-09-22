import { canonicalQuestion } from "./factory.js";

export const EVENT_PROPAGATION_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-event-propagation-order",
    learningUnitId: "event-propagation",
    difficulty: "easy",
    conceptTags: ["event", "propagation"],
    content: {
      prompt: "父层同时有 onClickCapture 与 onClick，按钮自身有 onClick。没有停止传播时，概念上的传播顺序是什么？",
      options: [
        { id: "capture-target-bubble", text: "parent capture → target button → parent bubble" },
        { id: "target-capture-bubble", text: "target → parent capture → parent bubble" },
        { id: "bubble-target-capture", text: "parent bubble → target → parent capture" },
        { id: "target-only", text: "只有 target handler 会执行" },
      ],
      correctOptionId: "capture-target-bubble",
      explanation: "capture 在事件到达 target 前从外向内观察，target handler 随后执行，之后事件再进入 bubble。",
      diagnosticOptionMap: {},
    },
    evidenceRefs: [{ kind: "source", fileName: "EventPropagationDemo.jsx", startLine: 45, endLine: 53 }],
  }),
  canonicalQuestion({
    id: "canonical-event-propagation-prevent-default",
    learningUnitId: "event-propagation",
    difficulty: "medium",
    conceptTags: ["event", "prevent-default"],
    content: {
      prompt: "target 只调用 event.preventDefault()，没有 stopPropagation()。最准确的判断是什么？",
      options: [
        { id: "bubble-default-cancelled", text: "parent bubble 仍可执行，但浏览器默认提交/跳转可被取消" },
        { id: "bubble-cancelled", text: "parent bubble 会被自动阻止" },
        { id: "capture-cancelled", text: "已经发生的 capture 会被撤销" },
        { id: "same-as-stop", text: "preventDefault 与 stopPropagation 完全等价" },
      ],
      correctOptionId: "bubble-default-cancelled",
      explanation: "preventDefault 控制浏览器默认行为，不控制 React 传播路径。",
      diagnosticOptionMap: {
        "bubble-cancelled": "prevent-default-stops-bubble",
        "same-as-stop": "prevent-default-stops-bubble",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "EventPropagationDemo.jsx", startLine: 12, endLine: 27 }],
  }),
  canonicalQuestion({
    id: "canonical-event-propagation-transfer",
    learningUnitId: "event-propagation",
    difficulty: "medium",
    conceptTags: ["event", "transfer"],
    content: {
      prompt: "需求是：点击链接应正常跳转，但不要触发外层 Card 的 onClick。下面 handler 应该怎么改？",
      codeContext: {
        label: "陌生代码 · CardLink.jsx",
        language: "jsx",
        code: `<div onClick={() => selectCard()}>
  <a
    href="/details"
    onClick={(event) => {
      event.preventDefault();
    }}
  >
    查看详情
  </a>
</div>`,
      },
      options: [
        { id: "stop-only", text: "把 preventDefault() 改成 stopPropagation()" },
        { id: "keep-prevent", text: "保持 preventDefault()，它会自动阻止外层 onClick" },
        { id: "both", text: "同时 preventDefault() + stopPropagation()，这是唯一正确方式" },
        { id: "call-parent", text: "在链接 handler 里主动调用 selectCard()" },
      ],
      correctOptionId: "stop-only",
      explanation: "需求只要求停止传播，同时保留链接默认跳转，因此只调用 stopPropagation 是最小正确修复。",
      diagnosticOptionMap: {
        "keep-prevent": "prevent-default-stops-bubble",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "EventPropagationDemo.jsx", startLine: 12, endLine: 22 }],
  }),
  canonicalQuestion({
    id: "canonical-event-propagation-handler-passing",
    learningUnitId: "event-propagation",
    difficulty: "easy",
    conceptTags: ["event", "handler"],
    content: {
      prompt: "onClick={handleSave} 与 onClick={handleSave()} 的关键区别是什么？",
      options: [
        { id: "pass-vs-call", text: "前者把函数交给 React 等待交互，后者在 render 求值时就调用函数" },
        { id: "same", text: "两者完全等价，React 都会等点击后调用" },
        { id: "capture", text: "前者是 capture，后者是 bubble" },
        { id: "default", text: "后者只会阻止浏览器默认行为" },
      ],
      correctOptionId: "pass-vs-call",
      explanation: "JSX 花括号里的表达式会在 render 求值。要等待事件发生，应把函数本身传给 React。",
      diagnosticOptionMap: {
        same: "handler-called-in-render",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "EventPropagationDemo.jsx", startLine: 50, endLine: 53 }],
  }),
  canonicalQuestion({
    id: "canonical-event-propagation-stop-default",
    learningUnitId: "event-propagation",
    difficulty: "hard",
    conceptTags: ["event", "stop-propagation", "default-behavior"],
    content: {
      prompt: "submit button 的 target handler 只调用 stopPropagation()。哪项结论最稳妥？",
      options: [
        { id: "default-may-run", text: "后续 parent bubble 会被截断，但 submit 默认行为仍可能发生" },
        { id: "submit-cancelled", text: "form submit 默认行为一定被取消" },
        { id: "capture-undone", text: "先前 capture 日志会被撤销" },
        { id: "nothing-runs", text: "target handler 自己也不会执行" },
      ],
      correctOptionId: "default-may-run",
      explanation: "stopPropagation 只处理传播。要取消浏览器提交还需要 preventDefault。",
      diagnosticOptionMap: {
        "submit-cancelled": "stop-propagation-prevents-default",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "EventPropagationDemo.jsx", startLine: 18, endLine: 27 }],
  }),
]);
