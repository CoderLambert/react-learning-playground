import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const STATE_SNAPSHOT_QUEUE_DEFINITION = {
  learningUnitId: "state-snapshot-queue",
  revision: 2,
  goal: "理解当前 render snapshot 如何决定 update queue 的下一次 render。",
  steps: [
    {
      id: "predict-replace-triple",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "当前 count = 0。连续执行三次 setCount(count + 1) 后，下一次 render 显示多少？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "count-1", label: "1" },
          { id: "count-2", label: "2" },
          { id: "count-3", label: "3" },
        ],
      },
      reveal: {
        expectedOptionId: "count-1",
        observation: "Replace × 3 从 count = 0 开始时，下一次 render 的 count 是 1。",
      },
    },
    {
      id: "experiment-replace-triple",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在真实 Demo 中运行 Replace × 3，并观察 Queue Debugger 的 handler snapshot 与 next render state。",
      demoActionId: "replace-three-times",
      expectedObservation: "next render state 为 1；三个 replace 都读取同一份 render snapshot。",
    },
    {
      id: "explain-shared-snapshot",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话解释：为什么三个 setCount(count + 1) 没有让 count 连续增加三次？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "写下你对 snapshot 与 update queue 的解释…",
      },
    },
    {
      id: "practice-compose-three-increments",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `现在把问题迁移到真实修复场景。

一个 “+3” handler 可能和同一次事件中更早入队的 updater 一起执行：

\`\`\`js
setCount((n) => n + 10);
handlePlusThree();
\`\`\`

产品要求 \`handlePlusThree()\` 的三个 “+1” 都继续基于 queue 中前一项结果计算，
不能用当前 render snapshot 覆盖掉前面已经排队的更新。

选择最小且语义正确的修复。`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "functional-updaters",
            label: "Patch A",
            patch: `- setCount(count + 1);
- setCount(count + 1);
- setCount(count + 1);
+ setCount((n) => n + 1);
+ setCount((n) => n + 1);
+ setCount((n) => n + 1);`,
          },
          {
            id: "single-replace-plus-three",
            label: "Patch B",
            patch: `- setCount(count + 1);
- setCount(count + 1);
- setCount(count + 1);
+ setCount(count + 3);`,
          },
          {
            id: "three-snapshot-replacements",
            label: "Patch C",
            patch: `- setCount(count + 1);
- setCount(count + 1);
- setCount(count + 1);
+ setCount(count + 1);
+ setCount(count + 2);
+ setCount(count + 3);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "functional-updaters",
        observation: `functional updater 会接收 queue 中前一个待处理结果。

如果前面已经有 \`n => n + 10\`，三个 updater 会继续从那个结果依次 +1；
直接读取 \`count\` 的 replace 更新只看到当前 render snapshot，可能覆盖先前排队结果。`,
      },
    },
    {
      id: "review-snapshot-queue",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "回到现有 Notes、Source 或 Demo，核对你的预测、观察和解释。",
      resources: ["notes", "source", "demo"],
    },
  ],
};

assertGuidedActivityDefinition(STATE_SNAPSHOT_QUEUE_DEFINITION);
