import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const COMPONENT_JSX_PURE_RENDER_DEFINITION = {
  learningUnitId: "component-jsx-pure-render",
  revision: 1,
  goal: "理解函数组件 render 是可重复的纯 UI 计算，而不是一次执行就直接修改 DOM 或外部世界。",
  steps: [
    {
      id: "predict-pure-repeat",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "相同 name/count 连续传给纯计算函数两次。只考虑函数本身，它的两个结果最应该是什么关系？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "same-result", label: "相同输入得到相同结果" },
          { id: "second-must-change", label: "第二次必须包含新的序号或时间" },
          { id: "depends-on-dom", label: "取决于 DOM 是否已经 commit" },
        ],
      },
      reveal: {
        expectedOptionId: "same-result",
        observation: "纯 render 计算只依赖当前输入；重复执行不会因为执行次数本身而改变结果。",
      },
    },
    {
      id: "experiment-repeat-calculation",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在真实 Demo 中点击“模拟相同输入重复 Render 两次”，比较纯计算 #1/#2 与非纯计算 #1/#2。注意：这里只验证计算纯度，不把按钮当成真实 render/commit 计数器。",
      demoActionId: "compare-pure-and-impure-calculation",
      expectedObservation: "纯计算两次结果稳定；修改模块级 impureSequence 的非纯计算会产生不同序号。",
    },
    {
      id: "explain-render-purity",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话解释：为什么 React 可以重复调用组件计算，而 render 中修改模块级变量会让这个能力变得不可靠？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "区分当前输入、UI 描述和外部可观察 mutation…",
      },
    },
    {
      id: "practice-remove-render-mutation",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面组件每次 render 都修改模块级 sequence。产品只需要显示商品名。选择让 render 恢复为纯计算的最小修复。",
      codeContext: {
        label: "陌生组件 · ProductLabel.jsx",
        language: "jsx",
        code: `let sequence = 0;

function ProductLabel({ name }) {
  sequence += 1;
  return <span>{sequence}. {name}</span>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "remove-external-sequence",
            label: "Patch A",
            patch: `- sequence += 1;
- return <span>{sequence}. {name}</span>;
+ return <span>{name}</span>;`,
          },
          {
            id: "memoize-external-mutation",
            label: "Patch B",
            patch: `- sequence += 1;
+ const sequenceForRender = useMemo(() => ++sequence, [name]);
- return <span>{sequence}. {name}</span>;
+ return <span>{sequenceForRender}. {name}</span>;`,
          },
          {
            id: "set-state-during-render",
            label: "Patch C",
            patch: `- sequence += 1;
+ setSequence((value) => value + 1);
  return <span>{sequence}. {name}</span>;`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "remove-external-sequence",
        observation: "产品并不需要 render 次数。删除模块级 mutation 后，输出只由 name 决定；useMemo 不能把有副作用的 render 计算变成纯函数，render 中 setState 更会制造新的更新。",
      },
    },
    {
      id: "review-pure-render-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "回到 Notes、Source 或 Demo，核对：Component 是输入到 JSX 描述的计算；副作用离开 render；组件函数执行次数不等于 DOM commit 次数。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
