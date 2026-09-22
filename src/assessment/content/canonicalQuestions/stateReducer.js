import { canonicalQuestion } from "./factory.js";

export const STATE_REDUCER_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-reducer-pure-transition",
    learningUnitId: "state-reducer",
    difficulty: "easy",
    conceptTags: ["reducer", "purity"],
    content: {
      prompt: "Reducer 最核心的职责是什么？",
      options: [
        { id: "pure-next-state", text: "根据 current state + action 纯计算 next state" },
        { id: "network", text: "集中发网络请求和写 localStorage" },
        { id: "dom", text: "直接修改 DOM" },
        { id: "global", text: "自动把 State 变成全局状态" },
      ],
      correctOptionId: "pure-next-state",
      explanation: "Reducer 的结构价值来自确定性 State 转换。",
      diagnosticOptionMap: {
        "network": "reducer-can-do-side-effects",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateReducerDemo.jsx", startLine: 16, endLine: 25 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-action-data",
    learningUnitId: "state-reducer",
    difficulty: "medium",
    conceptTags: ["reducer", "action"],
    content: {
      prompt: "日志需要记录事件发生时间。为什么 Demo 在 dispatch 前读取时间，再放进 action.at？",
      options: [
        { id: "keep-reducer-deterministic", text: "让事件边界提供非确定输入，Reducer 对相同 state/action 保持确定性" },
        { id: "dispatch-needs-date", text: "dispatch API 强制要求 action 包含 Date" },
        { id: "render-date", text: "这样会避免组件 render" },
        { id: "context", text: "因为 Context 不能传时间" },
      ],
      correctOptionId: "keep-reducer-deterministic",
      explanation: "Action 携带转换所需事实，Reducer 不自己读取外部世界。",
      diagnosticOptionMap: {
        "dispatch-needs-date": "reducer-can-do-side-effects",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateReducerDemo.jsx", startLine: 67, endLine: 72 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-dispatch-snapshot",
    learningUnitId: "state-reducer",
    difficulty: "medium",
    conceptTags: ["reducer", "snapshot"],
    content: {
      prompt: "同一个 handler 中 dispatch(INCREMENT) 后立即读取当前 state.count，应如何理解？",
      options: [
        { id: "old-snapshot", text: "仍读取当前 render 的 snapshot；dispatch 请求下一次 State" },
        { id: "mutated", text: "state.count 变量已经被 reducer 同步改写" },
        { id: "undefined", text: "dispatch 后读取 State 是非法操作" },
        { id: "dom-source", text: "应该从 DOM 读取 next count" },
      ],
      correctOptionId: "old-snapshot",
      explanation: "useReducer 仍遵守 State snapshot 语义。",
      diagnosticOptionMap: {
        "mutated": "dispatch-mutates-current-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateReducerDemo.jsx", startLine: 67, endLine: 72 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-transfer",
    learningUnitId: "state-reducer",
    difficulty: "medium",
    conceptTags: ["reducer", "transfer"],
    content: {
      prompt: "下面 reducer 的主要问题是什么？",
      codeContext: {
        label: "陌生代码 · reducer.js",
        language: "js",
        code: `function reducer(state, action) {
  if (action.type === "SAVE") {
    return {
      ...state,
      savedAt: new Date().toISOString(),
    };
  }
  return state;
}`,
      },
      options: [
        { id: "impure-time", text: "Reducer 读取当前时间；应在事件边界生成 at 并放进 action" },
        { id: "object-return", text: "Reducer 不能返回对象" },
        { id: "if-invalid", text: "Reducer 只能写 switch，不能写 if" },
        { id: "date-state", text: "State 不能保存时间字符串" },
      ],
      correctOptionId: "impure-time",
      explanation: "外部/非确定输入应在 reducer 外产生。Reducer 只消费 action.at。",
      diagnosticOptionMap: {
        "object-return": "object-state-requires-reducer",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateReducerDemo.jsx", startLine: 67, endLine: 72 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-when",
    learningUnitId: "state-reducer",
    difficulty: "hard",
    conceptTags: ["reducer", "design"],
    content: {
      prompt: "哪个场景更能说明应该考虑 useReducer？",
      options: [
        { id: "related-transitions", text: "同一份 State 有多条相关更新路径和明确事件语义，转换规则值得集中测试" },
        { id: "one-boolean", text: "只有一个独立 open boolean" },
        { id: "object-only", text: "只因为 State 是对象" },
        { id: "global-required", text: "只因为需要跨组件共享" },
      ],
      correctOptionId: "related-transitions",
      explanation: "Reducer 是状态转换组织工具，不是对象 State 或全局共享的自动答案。",
      diagnosticOptionMap: {
        "object-only": "object-state-requires-reducer",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "StateReducerDemo.jsx", startLine: 16, endLine: 25 }],
  }),
]);
