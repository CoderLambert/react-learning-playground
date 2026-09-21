import { canonicalQuestion } from "./factory.js";

export const LIFECYCLE_OF_REACTIVE_EFFECTS_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-effect-lifecycle-room-switch-order",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "hard",
    conceptTags: ["effect", "cleanup", "setup", "commit"],
    content: {
      prompt: "组件已连接 room #101。用户把 roomId 改成 #102。忽略 Strict Mode 的开发期额外检查后，哪条顺序最准确？",
      options: [
        { id: "commit-cleanup-setup", text: "更新触发新 render，commit 后先 cleanup #101，再 setup #102" },
        { id: "setup-cleanup", text: "先 setup #102，确认新连接成功后再 cleanup #101" },
        { id: "cleanup-only-unmount", text: "切换 room 时只 setup #102；cleanup #101 只会在组件最终 unmount 时发生" },
        { id: "cleanup-before-render", text: "点击事件一发生就先 cleanup #101，然后 React 才 render room #102" },
      ],
      correctOptionId: "commit-cleanup-setup",
      explanation: "roomId 更新先触发新的 render 并 commit。随后这个 Effect 需要重新同步：React 先运行上一轮 cleanup 撤销 room #101 连接，再用新 committed roomId setup room #102。",
      diagnosticOptionMap: {
        "setup-cleanup": "setup-before-old-cleanup",
        "cleanup-only-unmount": "cleanup-only-on-unmount",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 95, endLine: 99 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-muted-no-reconnect",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["effect-event", "reactive-values", "synchronization-target"],
    content: {
      prompt: "isMuted 会变化，而且收到消息时通知逻辑需要读取最新 isMuted。为什么切换静音不应该重建 Socket 连接？",
      options: [
        { id: "event-does-not-own-target", text: "isMuted 只影响收到消息后的通知行为，不决定连接哪个 room；Effect Event 可以读取最新 committed isMuted，而 roomId 仍负责同步目标" },
        { id: "all-values-deps", text: "isMuted 也是 State，所以必须加入连接 Effect 依赖；任何 State 变化都应该重连" },
        { id: "hide-all-deps", text: "只要把读取放进 Effect Event，就可以把 roomId、isMuted 等所有值都从依赖数组删除" },
        { id: "mute-is-nonreactive", text: "isMuted 不是 reactive value，所以 React 根本不会因为它变化重新 render" },
      ],
      correctOptionId: "event-does-not-own-target",
      explanation: "关键是同步关系本身由什么决定。roomId 决定 Socket 连接目标；isMuted 只决定收到消息后是否播放提示。Effect Event 让这段事件逻辑读取最新 committed 值，而不是隐藏真正的同步依赖。",
      diagnosticOptionMap: {
        "all-values-deps": "every-changing-value-reconnects",
        "hide-all-deps": "effect-event-is-dependency-hack",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 38, endLine: 49 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-messages-updater",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["functional-updater", "dependencies", "messages"],
    content: {
      prompt: "Socket 每收到消息都要更新 messages，但连接 Effect 不应因 messages 变化重新连接。这里 setMessages(prev => ...) 的作用是什么？",
      options: [
        { id: "remove-reactive-read", text: "把“基于上一份 messages 计算下一份 messages”交给 State updater，因此回调不需要读取当前 render 的 messages" },
        { id: "lint-bypass", text: "它只是让 dependency linter 看不到 messages；Effect 实际仍然依赖当前 messages" },
        { id: "messages-must-dep", text: "只要 messages 会更新，它就必须加入 Effect 依赖，否则 React 不能保存新消息" },
        { id: "prevents-rerender", text: "functional updater 会阻止 messages 更新触发 React render，所以连接自然不会重建" },
      ],
      correctOptionId: "remove-reactive-read",
      explanation: "functional updater 真正改变了代码的数据依赖。回调只提交“如何从上一份 State 得到下一份 State”的函数，不再读取当前 render 的 messages；因此连接 Effect 没有这个 reactive read。",
      diagnosticOptionMap: {
        "lint-bypass": "updater-is-dependency-hack",
        "messages-must-dep": "every-changing-value-reconnects",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-keep-room-dependency",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "hard",
    conceptTags: ["dependencies", "stale-synchronization", "roomId"],
    content: {
      prompt: "团队觉得切房间时 reconnect 太频繁，想把 roomId 从连接 Effect 的依赖数组删掉。最准确的判断是什么？",
      options: [
        { id: "keep-true-dependency", text: "不能靠删 roomId 优化；setup 直接用它决定连接目标，删除真实依赖会让 UI roomId 与外部 Socket 同步关系脱节" },
        { id: "remove-for-performance", text: "可以删除，只要 reconnect 成本高，依赖数组就应该优先减少运行次数" },
        { id: "effect-event-room", text: "把 roomId 放进 Effect Event 后就能从依赖删除，同时仍保证连接目标自动切换" },
        { id: "empty-array", text: "连接类 Effect 一般应该使用 []，React 会根据最新 props/state 自动更新内部连接目标" },
      ],
      correctOptionId: "keep-true-dependency",
      explanation: "依赖的正确性优先于“少运行”。connectChatSocket(roomId) 明确读取 roomId 并用它决定外部同步目标；如果业务上确实不该频繁重连，应重新设计同步边界或上游状态，而不是制造 stale Effect。",
      diagnosticOptionMap: {
        "remove-for-performance": "remove-true-dependency",
        "effect-event-room": "effect-event-is-dependency-hack",
        "empty-array": "dependency-array-run-switch",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 51, endLine: 65 },
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 149, endLine: 152 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-effect-lifecycle-strict-mode",
    learningUnitId: "lifecycle-of-reactive-effects",
    difficulty: "medium",
    conceptTags: ["strict-mode", "effect-lifecycle", "development"],
    content: {
      prompt: "开发环境首次进入页面时日志可能出现额外 setup → cleanup → setup。应该怎样理解？",
      options: [
        { id: "development-stress-test", text: "这是 Strict Mode 的开发期压力测试，用来验证 cleanup 能否完整镜像 setup；它不是一次 roomId 依赖变化" },
        { id: "production-rule", text: "这说明 production 中每个 Effect setup 都必然自动执行两次" },
        { id: "dependency-bug", text: "只要看到额外 setup/cleanup，就说明依赖数组一定写错了" },
        { id: "remove-cleanup", text: "为了避免开发日志重复，应该移除 cleanup，让 setup 只保留一次" },
      ],
      correctOptionId: "development-stress-test",
      explanation: "Strict Mode 在开发环境会额外执行一次 setup → cleanup → setup 检查，用来暴露不对称或不可重复的 Effect。判断真实依赖变化时，应把这个开发检查与 roomId change 导致的 cleanup old → setup new 分开。",
      diagnosticOptionMap: {
        "production-rule": "strict-mode-is-production-duplicate",
        "dependency-bug": "strict-mode-is-production-duplicate",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "LifecycleOfReactiveEffectsDemo.jsx", startLine: 159, endLine: 165 },
    ],
  }),
]);
