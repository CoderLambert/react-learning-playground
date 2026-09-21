import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const RENDERING_LISTS_KEY_DEFINITION = {
  learningUnitId: "rendering-lists-key",
  revision: 2,
  goal: "理解 key 如何让列表项的局部 State 跟随数据身份，而不是数组位置。",
  steps: [
    {
      id: "predict-index-key-reorder",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `当前使用 index key。

给第一行「修复登录页 / Alice」输入备注 A-note，
然后点击「反转顺序」。

反转后，A-note 最可能出现在哪里？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "stays-first-position", label: "仍留在第一行，因此看起来跟到了「发布生产版本 / Carol」" },
          { id: "follows-task-a", label: "跟着「修复登录页 / Alice」移动到最后一行" },
          { id: "clears-after-reorder", label: "反转后备注会被清空" },
        ],
      },
      reveal: {
        expectedOptionId: "stays-first-position",
        observation: `使用 index key 时，React 仍用当前数组位置作为身份线索。
反转后 index 0 对应的数据从 task-a 变成 task-c，但原先 index 0
组件里的输入 State 仍留在这个位置，所以备注看起来跟错了任务。`,
      },
    },
    {
      id: "experiment-compare-list-identity",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中完成两轮实验：

1. 点击「恢复数据」，选择「使用 index key」。
2. 给第一行输入 A-note，再点击「反转顺序」。
3. 观察备注现在属于哪一个任务。

然后：

4. 选择「使用 stable id」并再次恢复数据。
5. 给第一行输入 A-note，再反转顺序。
6. 对比备注这次跟着“位置”还是“任务身份”移动。`,
      demoActionId: "compare-index-and-stable-key",
      expectedObservation: "index key 时，备注留在原数组位置并可能显示在另一个任务旁；stable task.id 时，备注会跟随 task-a / Alice 对应的业务实体移动。",
    },
    {
      id: "explain-list-identity",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `用自己的话解释：

为什么数据只是改变了顺序，index key 却可能让输入框的局部 State
“跟错任务”？

而 task.id 为什么能让 State 更稳定地跟随业务实体？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "重点解释“数组位置”和“业务身份”的差别…",
      },
    },
    {
      id: "practice-repair-list-identity",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `另一个可编辑 Todo 列表支持顶部插入、拖动排序和修改标题。
每个 \`TodoRow\` 内部都有尚未保存的 input draft。

要求：列表结构变化后，已有 draft 必须继续属于同一个 todo 实体。
选择最小正确修复。`,
      codeContext: {
        label: "当前 TodoList 实现",
        language: "jsx",
        code: `{todos.map((todo, index) => (
  <TodoRow key={index} todo={todo} />
))}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "stable-todo-id-key",
            label: "Patch A",
            patch: `- <TodoRow key={index} todo={todo} />
+ <TodoRow key={todo.id} todo={todo} />`,
          },
          {
            id: "editable-title-key",
            label: "Patch B",
            patch: `- <TodoRow key={index} todo={todo} />
+ <TodoRow key={todo.title} todo={todo} />`,
          },
          {
            id: "position-plus-id-key",
            label: "Patch C",
            patch: `- <TodoRow key={index} todo={todo} />
+ <TodoRow key={\`\${index}-\${todo.id}\`} todo={todo} />`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "stable-todo-id-key",
        observation: `key 必须稳定表达业务实体身份。

\`todo.id\` 在插入、重排和标题编辑时仍代表同一个 todo；
title 可编辑会变化；把 index 混进 key 会让同一个 todo 在移动后获得新身份，从而丢失原行 State。`,
      },
    },
    {
      id: "review-list-key-identity",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对你的判断：

key 的核心作用是提供稳定身份线索，让 React 在列表结构变化后仍能识别
“这是哪个业务实体”，而不只是消除 warning。`,
      resources: ["notes", "source", "demo"],
    },
  ],
};
