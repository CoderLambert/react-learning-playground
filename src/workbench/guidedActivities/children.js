import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const CHILDREN_DEFINITION = {
  learningUnitId: "children",
  revision: 1,
  goal: "理解 children composition 如何让调用者拥有具体内容结构、容器只拥有可复用外壳。",
  steps: [
    {
      id: "predict-container-reuse",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "CardContainer 本体只渲染 {children}，调用者分别传入说明文字和完整 form。要支持第二种内容，CardContainer 最需要知道什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "nothing-about-form", label: "不需要知道表单字段；只需要渲染收到的 children" },
          { id: "form-fields", label: "必须接收 email/password 等表单业务字段" },
          { id: "content-type", label: "必须新增 contentType='form' 才能识别结构" },
        ],
      },
      reveal: {
        expectedOptionId: "nothing-about-form",
        observation: "组合把具体结构留给调用者；容器只实现自己的卡片外壳和插槽位置。",
      },
    },
    {
      id: "experiment-container-composition",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "观察两个 CardContainer 的不同 children，再分别打开提示型和登录型 Modal。找出哪些行为属于外壳，哪些业务内容只存在于调用位置。",
      demoActionId: "compare-children-composition",
      expectedObservation: "相同外壳能承载不同 React 节点；容器无需读取内容里的业务字段，具体内容交互仍由调用者拥有。",
    },
    {
      id: "explain-caller-shell-boundary",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话说明：为什么“大块内部结构由调用者变化”适合 children，而 title/size 这类稳定语义仍可以保留普通 props？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "区分结构所有权与稳定配置语义…",
      },
    },
    {
      id: "practice-extract-children-slot",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面 Panel 把两种业务内容硬编码进容器。要求 Panel 继续只负责外壳，并允许调用者组合任意内容。选择最小方向正确的重构。",
      codeContext: {
        label: "陌生容器 · Panel.jsx",
        language: "jsx",
        code: `function Panel({ kind, message }) {
  return (
    <Shell>
      {kind === "login" ? <LoginForm /> : <p>{message}</p>}
    </Shell>
  );
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "accept-children",
            label: "Patch A",
            patch: `- function Panel({ kind, message }) {
+ function Panel({ children }) {
    return (
      <Shell>
-       {kind === "login" ? <LoginForm /> : <p>{message}</p>}
+       {children}
      </Shell>
    );
  }`,
          },
          {
            id: "add-more-booleans",
            label: "Patch B",
            patch: `- function Panel({ kind, message }) {
+ function Panel({ kind, message, showLogin, showMessage }) {`,
          },
          {
            id: "move-content-to-context",
            label: "Patch C",
            patch: `+ const content = useContext(PanelContentContext);
- {kind === "login" ? <LoginForm /> : <p>{message}</p>}
+ {content}`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "accept-children",
        observation: "Panel 的职责是 Shell；调用者知道具体业务结构。children 直接表达这个边界，不需要不断增加 type/boolean 分支。",
      },
    },
    {
      id: "review-children-composition",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：children 是 React node；调用者拥有内容结构，容器拥有外壳；Composition 不要求消灭所有普通 Props。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
