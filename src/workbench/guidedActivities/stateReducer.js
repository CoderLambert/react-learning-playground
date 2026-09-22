import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const STATE_REDUCER_DEFINITION = {
  learningUnitId: "state-reducer",
  revision: 1,
  goal: "把事件语义与纯 State 转换分开：Event Handler 收集输入，Action 描述事件，Reducer 计算 next State。",
  steps: [
    {
      id: "predict-dispatch-snapshot",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "同一个 click handler 中先 dispatch({type:'INCREMENT'})，随后立即读取当前 state.count。最可靠的模型是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "current-snapshot-remains", label: "当前 handler 仍读取这次 render 的 state snapshot；dispatch 请求下一次 State" },
          { id: "mutated-immediately", label: "dispatch 会同步改写当前 state.count 变量" },
          { id: "reducer-runs-only-effect", label: "Reducer 只有在 Effect 中才会运行" },
        ],
      },
      reveal: {
        expectedOptionId: "current-snapshot-remains",
        observation: "useReducer 仍遵守 render snapshot 模型；dispatch 不会回头改写当前 render 的变量。",
      },
    },
    {
      id: "experiment-actions-and-history",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "触发 INCREMENT / DECREMENT / RESET / UNDO，结合 Source 追踪 Event Handler → action → reducer → next state。",
      demoActionId: "trace-reducer-transitions",
      expectedObservation: "Action 描述发生的事件；Reducer 只基于 state/action 计算 next state；时间数据在事件边界产生后随 action 进入。",
    },
    {
      id: "explain-pure-reducer",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么时间、随机数、网络请求不应在 reducer 内产生，以及把这些值放进 action 后为什么更容易测试和重放。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从确定性、相同输入和 event boundary 来说明…",
      },
    },
    {
      id: "practice-move-time-out",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "Reducer 直接读取当前时间，导致相同 state/action 不再确定。选择最小正确修复。",
      codeContext: {
        label: "陌生组件 · counterReducer.js",
        language: "js",
        code: `function reducer(state, action) {
  if (action.type === "SAVE") {
    return {
      ...state,
      savedAt: new Date().toISOString(),
    };
  }
  return state;
}

dispatch({ type: "SAVE" });`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "time-in-action",
            label: "Patch A",
            patch: `- savedAt: new Date().toISOString(),
+ savedAt: action.at,
...
- dispatch({ type: "SAVE" });
+ dispatch({ type: "SAVE", at: new Date().toISOString() });`,
          },
          {
            id: "random-in-reducer",
            label: "Patch B",
            patch: `+ id: Math.random(),`,
          },
          {
            id: "make-async-reducer",
            label: "Patch C",
            patch: `- function reducer(state, action) {
+ async function reducer(state, action) {`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "time-in-action",
        observation: "Event boundary 负责取得当前时间，Action 携带事实，Reducer 恢复为 state + action 的确定性纯转换。",
      },
    },
    {
      id: "review-reducer-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：Event Handler 收集外部输入；Action 描述事件；Reducer 必须纯；dispatch 请求 next State，不同步修改当前 snapshot。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
