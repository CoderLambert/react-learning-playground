import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const USE_EFFECT_CORRECT_USAGE_DEFINITION = {
  learningUnitId: "use-effect-correct-usage",
  revision: 1,
  goal: "把 Effect 当作 React 与外部系统之间的 setup / cleanup 同步过程，而不是通用 State 监听器或业务事件中转站。",
  steps: [
    {
      id: "predict-watcher-unmount",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "LiveWindowWatcher 卸载时，之前注册的 resize listener 应该怎样处理？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "cleanup-remove-listener", label: "cleanup 移除 setup 注册的同一个 listener" },
          { id: "leave-listener", label: "无需处理；组件卸载会让浏览器自动删除 listener" },
          { id: "add-second-listener", label: "cleanup 再 add 一次 listener 来保证状态最新" },
        ],
      },
      reveal: {
        expectedOptionId: "cleanup-remove-listener",
        observation: "Effect setup 建立外部订阅，就必须在这轮同步结束时对称撤销，避免泄漏、重复监听或 stale handler。",
      },
    },
    {
      id: "experiment-effect-setup-cleanup",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "挂载/卸载 resize watcher，再修改未读数观察 document.title。分别指出 setup 建立的外部关系、cleanup 撤销什么，以及依赖值改变后为何需要重新同步。",
      demoActionId: "observe-effect-setup-cleanup",
      expectedObservation: "resize listener 随 watcher 生命周期建立/移除；pageTitleBadge commit 后，Effect 把最新值同步到 document.title。",
    },
    {
      id: "explain-effect-causality",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么“有副作用”不是使用 Effect 的充分条件：外部同步、render 派生值、一次用户命令分别应该放在哪里？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 external synchronization、render derivation、event cause 来说明…",
      },
    },
    {
      id: "practice-add-symmetric-cleanup",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面 Effect 注册了浏览器 listener，却没有撤销它。选择最小且对称的修复。",
      codeContext: {
        label: "陌生组件 · OnlineWatcher.jsx",
        language: "jsx",
        code: `function OnlineWatcher() {
  useEffect(() => {
    function handleOnline() {
      console.log("online");
    }

    window.addEventListener("online", handleOnline);
  }, []);

  return null;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "return-remove-same-handler",
            label: "Patch A",
            patch: `  window.addEventListener("online", handleOnline);
+ return () => {
+   window.removeEventListener("online", handleOnline);
+ };`,
          },
          {
            id: "remove-different-handler",
            label: "Patch B",
            patch: `+ return () => {
+   window.removeEventListener("online", () => console.log("online"));
+ };`,
          },
          {
            id: "add-on-cleanup",
            label: "Patch C",
            patch: `+ return () => {
+   window.addEventListener("online", handleOnline);
+ };`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "return-remove-same-handler",
        observation: "cleanup 必须撤销 setup 真正建立的关系：对同一 target、event type 和 handler 执行 removeEventListener。",
      },
    },
    {
      id: "review-effect-sync-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：Effect 面向外部系统；setup/cleanup 保持对称；依赖变化时旧同步先撤销再建立新同步；明确用户事件直接放 Event Handler。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
