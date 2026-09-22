import { canonicalQuestion } from "./factory.js";

export const CHILDREN_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-children-node",
    learningUnitId: "children",
    difficulty: "easy",
    conceptTags: ["children", "composition"],
    content: {
      prompt: "props.children 在组合模式中最准确的含义是什么？",
      options: [
        { id: "react-node", text: "调用位置嵌套传入的 React node，可以是文本、元素或更深的组件树" },
        { id: "html-string", text: "必须是一段等待 innerHTML 解析的 HTML 字符串" },
        { id: "context", text: "React 自动创建的 Context value" },
        { id: "state", text: "容器组件自己的特殊 State" },
      ],
      correctOptionId: "react-node",
      explanation: "children 是普通 Props 中的一种 React node 数据，容器可以在自己的 JSX 中把它放到合适位置。",
      diagnosticOptionMap: {
        "html-string": "children-is-string",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "CardContainer.jsx", startLine: 41, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-children-ownership",
    learningUnitId: "children",
    difficulty: "medium",
    conceptTags: ["composition", "ownership"],
    content: {
      prompt: "CardContainer 同时承载说明文字和反馈表单时，为什么容器不需要知道表单字段？",
      options: [
        { id: "caller-owns-content", text: "具体内容结构由调用者拥有，CardContainer 只负责自己的外壳并渲染 children" },
        { id: "react-hides-fields", text: "React 会把所有表单字段自动隐藏在 DOM 里" },
        { id: "children-context", text: "children 会自动把字段放入 Context" },
        { id: "form-no-state", text: "因为表单永远没有业务状态" },
      ],
      correctOptionId: "caller-owns-content",
      explanation: "Composition 的关键是职责分离：调用者知道业务结构，容器只实现布局和自己明确拥有的行为。",
      diagnosticOptionMap: {
        "react-hides-fields": "container-owns-child-business",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "ChildrenSlotDemo.jsx", startLine: 52, endLine: 96 },
      { kind: "source", fileName: "CardContainer.jsx", startLine: 6, endLine: 45 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-children-transfer",
    learningUnitId: "children",
    difficulty: "medium",
    conceptTags: ["composition", "transfer"],
    content: {
      prompt: "下面 Box 为每种业务内容增加 kind 分支。若目标是让调用者决定任意内部结构，最合适的 API 改造是什么？",
      codeContext: {
        label: "陌生代码 · Box.jsx",
        language: "jsx",
        code: `function Box({ kind, text }) {
  return (
    <section>
      {kind === "profile" ? <Profile /> : <p>{text}</p>}
    </section>
  );
}`,
      },
      options: [
        { id: "children", text: "改成 Box({ children }) 并在 section 中渲染 children" },
        { id: "more-kinds", text: "继续为每种新业务结构增加 kind 枚举" },
        { id: "context", text: "把 kind 放进 Context，但仍让 Box 决定所有业务内容" },
        { id: "html", text: "让调用者传一段 HTML 字符串再用 innerHTML" },
      ],
      correctOptionId: "children",
      explanation: "当结构差异由调用者知道时，children 直接把结构所有权还给调用者，并保持 Box 外壳稳定。",
      diagnosticOptionMap: {
        "more-kinds": "container-owns-child-business",
        html: "children-is-string",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ChildrenSlotDemo.jsx", startLine: 52, endLine: 73 }],
  }),
  canonicalQuestion({
    id: "canonical-children-props-boundary",
    learningUnitId: "children",
    difficulty: "medium",
    conceptTags: ["children", "props"],
    content: {
      prompt: "使用 children composition 后，title、size、tone 这类稳定语义参数应该怎样处理？",
      options: [
        { id: "keep-props", text: "如果语义清晰且稳定，继续使用显式 Props 完全合理" },
        { id: "remove-all-props", text: "用了 children 就必须删除所有其他 Props" },
        { id: "context-only", text: "全部改成 Context 才算真正组合" },
        { id: "dom-data", text: "全部写成 data-* 属性由 DOM 决定" },
      ],
      correctOptionId: "keep-props",
      explanation: "结构插槽和稳定配置是不同职责。Composition 不是消灭 Props，而是把结构变化放到合适的所有者。",
      diagnosticOptionMap: {
        "remove-all-props": "composition-replaces-props",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "CardContainer.jsx", startLine: 6, endLine: 18 }],
  }),
  canonicalQuestion({
    id: "canonical-children-modal-shell",
    learningUnitId: "children",
    difficulty: "hard",
    conceptTags: ["composition", "shell"],
    content: {
      prompt: "ModalLayout 负责 ESC 关闭、遮罩和居中，调用者负责登录表单内容。这个边界最说明什么？",
      options: [
        { id: "separate-responsibilities", text: "容器可以拥有自己真实实现的外壳行为，同时通过 children 接收不属于它的业务内容" },
        { id: "container-no-behavior", text: "只要使用 children，容器就不应该有任何事件或 Effect" },
        { id: "caller-no-state", text: "children 内容不能拥有自己的 State" },
        { id: "inheritance", text: "这实际上是 React 的组件继承机制" },
      ],
      correctOptionId: "separate-responsibilities",
      explanation: "Composition 不是无行为容器。ModalLayout 可以拥有属于 Modal 外壳的行为，而业务表单仍由调用者提供。",
      diagnosticOptionMap: {
        "container-no-behavior": "container-owns-child-business",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "ModalLayout.jsx", startLine: 7, endLine: 24 },
      { kind: "source", fileName: "ChildrenSlotDemo.jsx", startLine: 121, endLine: 126 },
    ],
  }),
]);
