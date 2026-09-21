import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION = {
  learningUnitId: "lifecycle-of-reactive-effects",
  revision: 2,
  goal: "理解 Effect 是一段独立同步过程：同步目标变化时，先停止旧同步，再建立新同步。",
  steps: [
    {
      id: "predict-room-resync-order",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `先清空生命周期日志。

当前已经连接某个房间。
现在切换到另一个房间。

连接 Effect 最合理的生命周期顺序是什么？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "cleanup-then-setup", label: "先 cleanup 旧房间连接，再 setup 新房间连接" },
          { id: "setup-then-cleanup", label: "先 setup 新房间，再 cleanup 旧房间" },
          { id: "setup-only", label: "只 setup 新房间，旧连接由 React 自动忽略" },
        ],
      },
      reveal: {
        expectedOptionId: "cleanup-then-setup",
        observation: `当决定同步目标的 roomId 改变时，
React 会先运行上一次 Effect 的 cleanup，
再用新的 roomId 建立下一次同步。`,
      },
    },
    {
      id: "experiment-room-effect-lifecycle",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中：

1. 点击「清空日志」。
2. 从当前房间切换到另一个不同房间。
3. 观察 cleanup / setup 的实际顺序。
4. 再只切换静音状态，观察是否发生重新连接。
5. 等待至少一条新消息，观察消息列表更新时是否发生重新连接。`,
      demoActionId: "observe-room-resynchronization",
      expectedObservation: `roomId 改变时会先 cleanup 旧房间，再 setup 新房间；

只改变静音状态不会重新连接；

消息通过函数式 updater 更新时，也不会因为 messages 改变而重建连接。`,
    },
    {
      id: "explain-reactive-effect-dependencies",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `为什么 roomId 必须决定连接 Effect 是否重新同步，

而 isMuted 和 messages 的变化不应该导致重新连接？

函数式 State updater 和 Effect Event 分别帮助移除了哪一种不必要的 reactive read？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "先定义“这个 Effect 到底在同步什么外部系统”，再分析依赖…",
      },
    },
    {
      id: "practice-subscription-update-order",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `把同一个 mental model 迁移到另一个订阅组件：

\`\`\`jsx
useEffect(() => {
  const subscription = subscribe(topicId);
  return () => subscription.unsubscribe();
}, [topicId]);
\`\`\`

组件已经订阅 \`news\`。一次用户操作把 topicId 改成 \`sports\`。
请按这次更新的真实顺序排列下面事件。`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE,
        items: [
          { id: "setup-new-subscription", label: "Effect setup：建立 sports 订阅" },
          { id: "render-new-topic", label: "React render：本次 render 读取 topicId = sports" },
          { id: "change-topic", label: "用户操作触发更新：topicId 从 news 变为 sports" },
          { id: "cleanup-old-subscription", label: "Effect cleanup：取消上一轮 news 订阅" },
          { id: "commit-new-render", label: "React commit：提交这次使用 sports 的 render" },
        ],
      },
      reveal: {
        expectedOrder: [
          "change-topic",
          "render-new-topic",
          "commit-new-render",
          "cleanup-old-subscription",
          "setup-new-subscription",
        ],
        observation: `State/prop 更新先触发新的 render，并完成 commit。

随后这次 Effect 重新同步：先用旧值执行上一轮 cleanup，
再用新 topicId 执行 setup。这里比较的是一次依赖变化的更新流程，不包含 Strict Mode 的开发期额外检查周期。`,
      },
    },
    {
      id: "review-reactive-effect-lifecycle",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对：

这个 Effect 究竟在同步什么外部系统？
哪些值真正决定同步目标？
cleanup 是否准确撤销了上一轮 setup？`,
      resources: ["notes", "source", "demo"],
    },
  ],
};
