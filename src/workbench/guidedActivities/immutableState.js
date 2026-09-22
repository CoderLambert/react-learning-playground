import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const IMMUTABLE_STATE_DEFINITION = {
  learningUnitId: "immutable-state",
  revision: 1,
  goal: "把对象和数组 State 当作只读 snapshot，并在更新时复制完整变化路径而不是污染旧值。",
  steps: [
    {
      id: "predict-same-reference-mutation",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "先执行 mutationProbe.city='Tokyo'，再 setMutationProbe(mutationProbe) 把同一个对象引用交回 setter。最可靠的判断是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "can-skip-and-corrupt", label: "React 可能跳过这次更新，同时旧 snapshot 已经被改写" },
          { id: "always-renders", label: "只要调用 setter，React 一定立刻重新 render" },
          { id: "safe-equivalent", label: "这与 copy + set 新对象完全等价" },
        ],
      },
      reveal: {
        expectedOptionId: "can-skip-and-corrupt",
        observation: "同引用既可能被 Object.is 视为没有新值，更严重的是 mutation 已让旧 State snapshot 失去可信度。",
      },
    },
    {
      id: "experiment-mutation-vs-copy",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "先点“错误：mutate + set 同引用”，再点“触发一次无关 render”，最后点“正确：copy + set 新引用”。再观察 nested copy 与数组 map/filter/reverse。",
      demoActionId: "compare-state-mutation-and-copy",
      expectedObservation: "错误 mutation 不会可靠地产生自己的 UI 更新，却会污染后续 render 读取的旧 snapshot；copy + 新引用形成清楚的下一份 State。",
    },
    {
      id: "explain-shallow-copy",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么 [...items] 只复制数组容器，随后 next[0].done=true 仍会污染旧 items[0]；正确更新为什么要复制被修改的元素对象。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 shallow copy、共享引用和旧 snapshot 来解释…",
      },
    },
    {
      id: "practice-copy-array-item",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面代码虽然创建了新数组，但仍修改共享的 task 对象。选择保留旧 snapshot 的最小正确修复。",
      codeContext: {
        label: "陌生组件 · TaskList.jsx",
        language: "jsx",
        code: `function toggleFirst() {
  const next = [...tasks];
  next[0].done = !next[0].done;
  setTasks(next);
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "map-copy-item",
            label: "Patch A",
            patch: `- const next = [...tasks];
- next[0].done = !next[0].done;
+ const next = tasks.map((task, index) =>
+   index === 0 ? { ...task, done: !task.done } : task
+ );
  setTasks(next);`,
          },
          {
            id: "slice-mutate-item",
            label: "Patch B",
            patch: `- const next = [...tasks];
+ const next = tasks.slice();
  next[0].done = !next[0].done;`,
          },
          {
            id: "mutate-before-spread",
            label: "Patch C",
            patch: `+ tasks[0].done = !tasks[0].done;
+ setTasks([...tasks]);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "map-copy-item",
        observation: "新数组并不会复制元素对象。正确 patch 同时创建新数组和被修改 task 的新对象，未变化 task 可以安全复用。",
      },
    },
    {
      id: "review-immutable-snapshots",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：旧 State snapshot 不改写；spread 是浅复制；嵌套更新要复制从变化节点到顶层的整条路径。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
