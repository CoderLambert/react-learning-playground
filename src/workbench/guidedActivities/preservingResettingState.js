import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const PRESERVING_RESETTING_STATE_DEFINITION = {
  learningUnitId: "preserving-resetting-state",
  revision: 2,
  goal: "理解局部 State 与组件身份关联，并用稳定业务 key 明确表达何时保留或重置。",
  steps: [
    {
      id: "predict-contact-draft-preservation",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `在 Demo 上半区：

Taylor 的 Chat 中已经输入草稿「明天开会」。

现在点击 Alice。

联系人已经变成 Alice 后，textarea 中的草稿会怎样？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "draft-preserved", label: "原草稿仍然保留，现在显示在 Alice 的 Chat 中" },
          { id: "draft-cleared", label: "切换 contact prop 后 React 会自动清空草稿" },
          { id: "separate-draft-created", label: "React 会自动为 Alice 恢复一份独立草稿" },
        ],
      },
      reveal: {
        expectedOptionId: "draft-preserved",
        observation: "这里只改变了 contact prop。\n\n父级仍在同一位置渲染同一个 Chat 组件身份，因此内部 draft State 默认会继续保留。",
      },
    },
    {
      id: "experiment-compare-contact-identity",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中比较上下两组 Chat：

上半区：
1. 给 Taylor 输入一段草稿。
2. 切换到 Alice。
3. 观察草稿。

下半区：
4. 给 Taylor 输入一段草稿。
5. 切换到 Alice。
6. 观察带 key={contact.id} 的 Chat 是否仍保留旧草稿。`,
      demoActionId: "compare-preserved-and-keyed-chat",
      expectedObservation: "上半区相同位置、相同组件类型且没有业务 key 变化，因此 draft 被保留；下半区 contact.id 改变了 Chat 的身份，新 Chat 从空的初始 draft 开始。",
    },
    {
      id: "explain-state-identity",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `为什么 contact prop 从 Taylor 变成 Alice，并不会自动让 React 丢弃 Chat 的局部 draft？

什么时候 key={contact.id} 表达的是合理的产品身份边界？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从“这是同一个组件实例，还是另一个业务实例”来解释…",
      },
    },
    {
      id: "practice-place-reset-boundary",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `CustomerWorkspace 中，\`WorkspaceShell\` 保存展开面板、滚动位置等 UI State；
\`InvoiceEditor\` 保存当前客户尚未提交的发票草稿。

需求：
- customer 从 A 切到 B 时，只丢弃 InvoiceEditor 草稿；
- WorkspaceShell 的 UI State 必须保留；
- 普通 re-render 不能重置草稿。

当前结构：

\`\`\`jsx
<WorkspaceShell>
  <InvoiceEditor customer={customer} />
</WorkspaceShell>
\`\`\`

选择最小且准确的 identity 修复。`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "key-editor-by-customer",
            label: "Patch A",
            patch: `- <InvoiceEditor customer={customer} />
+ <InvoiceEditor key={customer.id} customer={customer} />`,
          },
          {
            id: "key-shell-by-customer",
            label: "Patch B",
            patch: `- <WorkspaceShell>
+ <WorkspaceShell key={customer.id}>`,
          },
          {
            id: "random-editor-key",
            label: "Patch C",
            patch: `- <InvoiceEditor customer={customer} />
+ <InvoiceEditor key={Date.now()} customer={customer} />`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "key-editor-by-customer",
        observation: `identity boundary 应放在真正需要随业务实体重置的子树上。

给 InvoiceEditor 使用稳定 customer.id，只在客户身份变化时重建编辑器；
给更外层 WorkspaceShell 加 key 会扩大重置范围；随机 key 会让无关 render 也不断重建编辑器。`,
      },
    },
    {
      id: "review-preserve-reset-identity",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对：

你真正要决定的不是“怎么强制刷新”，而是业务上当前 UI
应该继续代表同一个实例，还是一个新的实例。`,
      resources: ["notes", "source", "demo"],
    },
  ],
};
