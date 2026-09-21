import { canonicalQuestion } from "./factory.js";

export const STATE_SNAPSHOT_QUEUE_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-state-snapshot-current-value",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["state-snapshot", "setter"],
    content: {
      prompt: "当前 render 中 count = 0。事件 handler 里先执行 setCount(count + 1)，然后在同一个 handler 后面再次读取 count。这里最准确的理解是什么？",
      options: [
        { id: "snapshot-stays-zero", text: "当前 handler 仍读取这次 render 的 count = 0；setter 请求 React 为后续 render 计算新 State" },
        { id: "setter-mutates-now", text: "setCount 会先把当前变量 count 直接改成 1，后面的代码立刻读取 1" },
        { id: "count-unknown", text: "setCount 后 count 变成不可预测值，要等浏览器事件循环决定" },
        { id: "dom-first", text: "DOM 先更新为 1，然后 React 再把 JavaScript 变量同步成 1" },
      ],
      correctOptionId: "snapshot-stays-zero",
      explanation: "State 是一次 render 的 snapshot。setter 不会回头修改当前 handler 已经读取到的 count；它提交更新请求，React 处理更新后由下一次 render 得到新的 State snapshot。",
      diagnosticOptionMap: {
        "setter-mutates-now": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 22, endLine: 27 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-replace-three",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["state-snapshot", "replace-update", "queue"],
    content: {
      prompt: "Reset 后 count = 0。连续执行三次 setCount(count + 1)，为什么下一次 render 是 1 而不是 3？",
      options: [
        { id: "same-snapshot-replace", text: "三次表达式都读取同一个 count = 0 snapshot，因此队列里是 replace 1、replace 1、replace 1" },
        { id: "auto-accumulate", text: "每次 setCount 都会先把 count 改掉，所以应该依次计算 1、2、3；显示 1 只是 batching 延迟" },
        { id: "last-only", text: "React batching 会直接丢弃前两次 setter，只执行最后一次调用" },
        { id: "first-only", text: "React 在一个事件里只允许第一条 State 更新生效，后续调用都会被忽略" },
      ],
      correctOptionId: "same-snapshot-replace",
      explanation: "三次 count + 1 都发生在同一个 handler snapshot 上。count 为 0 时，它们都把 replace 1 加入 queue；React 依次处理后 pending 仍然是 1。",
      diagnosticOptionMap: {
        "auto-accumulate": "repeated-replace-accumulates",
        "last-only": "queue-keeps-last-only",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 29, endLine: 45 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-updater-three",
    learningUnitId: "state-snapshot-queue",
    difficulty: "medium",
    conceptTags: ["functional-updater", "queue"],
    content: {
      prompt: "同样从 count = 0 开始，连续三次 setCount(n => n + 1) 为什么能得到 3？",
      options: [
        { id: "updater-pending", text: "每个 updater 在 queue processing 时接收前一项 pending State，所以依次计算 0→1→2→3" },
        { id: "syntax-only", text: "updater function 只是 setCount(count + 1) 的另一种语法，两者 queue 语义完全相同" },
        { id: "mutates-closure", text: "第一个 updater 会直接修改当前 handler 闭包里的 count，所以后两个 updater 能读取被改写的变量" },
        { id: "three-renders", text: "因为三个 updater 会强制 React 立即 render 三次，每次 render 各加 1" },
      ],
      correctOptionId: "updater-pending",
      explanation: "updater function 会进入 queue，并在 React 处理 queue 时接收当前 pending State。它们可以组合：第一个把 0 变 1，第二个接 1 变 2，第三个接 2 变 3。",
      diagnosticOptionMap: {
        "syntax-only": "updater-is-syntax-sugar",
        "mutates-closure": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 47, endLine: 63 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-replace-updater",
    learningUnitId: "state-snapshot-queue",
    difficulty: "hard",
    conceptTags: ["replace-update", "functional-updater", "queue-order"],
    content: {
      prompt: "Reset 后 count = 0。运行 Replace + Updater：先 setCount(snapshot + 5)，再 setCount(n => n + 1)。下一次 render 为什么是 6？",
      options: [
        { id: "ordered-queue", text: "queue 先把 pending 替换成 5，再把这个 pending 交给 +1 updater，得到 6" },
        { id: "last-updater-only", text: "batching 只保留最后的 +1 updater，所以 React 实际只执行一次 +1" },
        { id: "snapshot-became-five", text: "第一条 setter 先把当前 handler 的 snapshot 变成 5，第二条再从新的 count 读取 5" },
        { id: "two-renders", text: "第一条先 render 到 5，第二条再触发另一次 render 到 6" },
      ],
      correctOptionId: "ordered-queue",
      explanation: "同一批更新里，replace 5 先把 pending 设置为 5，随后 updater 接收这个 pending 并返回 6。当前 handler 的原 snapshot 仍然是 0，并不是中途被改写。",
      diagnosticOptionMap: {
        "last-updater-only": "queue-keeps-last-only",
        "snapshot-became-five": "setter-mutates-snapshot",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 65, endLine: 79 },
    ],
  }),
  canonicalQuestion({
    id: "canonical-state-snapshot-final-replace",
    learningUnitId: "state-snapshot-queue",
    difficulty: "hard",
    conceptTags: ["queue-order", "replace-update"],
    content: {
      prompt: "Reset 后运行 Replace + Updater + Replace 42，最终是 42。下面哪个解释最准确？",
      options: [
        { id: "processed-then-replaced", text: "React 依次处理前面的 replace 和 updater，最后一项 replace 42 再把 pending State 设置为 42" },
        { id: "discard-earlier", text: "只要最后有 replace 42，React 在处理 queue 前就会把前面的所有更新删除" },
        { id: "updater-after-42", text: "React 会优先处理 replace 42，再运行前面的 updater，所以理论上应该得到 43" },
        { id: "same-semantics", text: "最终数字是 42，说明前面的 replace / updater 与单独 setCount(42) 在更新语义上完全等价" },
      ],
      correctOptionId: "processed-then-replaced",
      explanation: "queue 有顺序。前面的 replace 与 updater 仍会被处理；只是最后的 replace 42 把当时 pending value 改成了 42，因此 next render 显示 42。",
      diagnosticOptionMap: {
        "discard-earlier": "last-result-means-last-only",
        "same-semantics": "same-result-same-semantics",
      },
    },
    evidenceRefs: [
      { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 81, endLine: 98 },
    ],
  }),
]);
