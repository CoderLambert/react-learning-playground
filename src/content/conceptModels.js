const LISTS_KEY_MODEL = {
  learningUnitId: "rendering-lists-key",
  version: 1,
  mechanismTitle: "先把这些对象分开，再讨论 key",
  mechanismAriaLabel: "Lists and Key 机制区分",
  mechanismHeaders: {
    subject: "对象",
    example: "当前 Demo",
    role: "它负责什么",
    change: "reorder 时会怎样",
  },
  contrastTitle: "三种变化，不要混成同一种“复用 / 重建”",
  mechanismMap: [
    {
      id: "business-entity",
      label: "业务实体",
      example: "task",
      role: "产品里真正要持续识别的对象。",
      reorder: "顺序会变，但同一个 task 仍是同一个业务实体。",
    },
    {
      id: "key",
      label: "key",
      example: "index / task.id",
      role: "同一父节点下，帮助 React 匹配前后两次 render 中的元素身份。",
      reorder: "index 表示位置；task.id 表示稳定业务身份。",
    },
    {
      id: "props",
      label: "Props",
      example: "task",
      role: "当前 render 传给组件的新输入。",
      reorder: "即使组件身份被复用，Props 仍会更新成当前位置的新 task。",
    },
    {
      id: "component-identity",
      label: "Component Identity",
      example: "EditableRow",
      role: "React 判断“前后是不是同一个组件实例”的结果。",
      reorder: "身份延续时局部 State 会继续属于这个实例。",
    },
    {
      id: "local-state",
      label: "Local State",
      example: "note",
      role: "属于 React 组件身份，而不是业务数据对象或 DOM 节点。",
      reorder: "它跟随被 React 保留的组件身份。",
    },
    {
      id: "dom",
      label: "DOM",
      example: "标题 / input",
      role: "React 根据最新 Props 与 State 提交出来的界面结果。",
      reorder: "节点可能复用或移动，但内容仍可根据新 Props / State 更新。",
    },
  ],
  contrastCases: [
    {
      id: "index-reorder",
      title: "index key + reorder",
      keyStory: "反转前后仍是 0 / 1 / 2，React 更容易按位置延续原身份。",
      identityStory: "位置 0 的 EditableRow 仍被当作原来的组件身份。",
      stateStory: "原来属于位置 0 身份的 note 继续保留。",
      uiStory: "task Props 已经换成新的业务数据，所以标题会更新；note 却可能出现在错误任务旁边。",
      conclusion: "错的不是“DOM 完全没更新”，而是组件身份与业务实体没有正确对齐。",
    },
    {
      id: "stable-reorder",
      title: "stable id + reorder",
      keyStory: "task-a / task-b / task-c 与业务实体绑定，排序改变时 key 本身不变。",
      identityStory: "React 能在新位置认出同一个组件身份。",
      stateStory: "note 随这个身份一起保留，因此跟着 task 移动。",
      uiStory: "这不是 remount；如果真的重建，useState 的 note 应重新初始化。",
      conclusion: "stable key 的价值是该保留身份时保留，而不是“总是重建”。",
    },
    {
      id: "strategy-switch",
      title: "切换 index key ↔ stable id",
      keyStory: "同一行从 key=0 变成 key=task-a（或反过来），显式 key 值本身变了。",
      identityStory: "旧身份无法与新的 key 匹配，因此会创建新的组件身份。",
      stateStory: "新的 EditableRow 从 useState 的初始值重新开始。",
      uiStory: "这才是当前 Demo 中可直接观察的 identity reset / remount 场景。",
      conclusion: "是否重建取决于身份是否还能匹配，而不是“stable id 天生会重建”。",
    },
  ],
  misconceptions: {
    "key-only-warning": {
      id: "key-only-warning",
      title: "把 key 当成 warning / 性能提示",
      diagnosis: "这个判断只看到了语法提示，没有解释 key 为什么会改变局部 State 的归属。",
      counterEvidence: "同一份列表数据只切换 key 策略，就能改变 note 在 reorder 后跟谁走；这已经是可观察的正确性差异。",
      experiment: "先用 index key 给第一行输入 AAA 并反转；再恢复数据，用 stable id 重做一次。只比较 AAA 最后属于哪个 task。",
      evidenceRefs: [{ kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 }],
    },
    "dom-not-updated": {
      id: "dom-not-updated",
      title: "把“组件身份复用”理解成“DOM 没更新”",
      diagnosis: "这里混淆了 React 复用组件身份，与 React 是否提交新的 DOM 内容。",
      counterEvidence: "如果 DOM 内容真的没更新，反转后 AAA 所在行的 task.title / owner 也应该保持旧值；但 Demo 中它们会跟着新的 Props 更新。",
      experiment: "保持 index key：第一行输入 AAA → 反转顺序。只观察 AAA 所在行上方的标题是否变化。",
      evidenceRefs: [
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 22, endLine: 33 },
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
      ],
    },
    "state-lives-in-dom": {
      id: "state-lives-in-dom",
      title: "把局部 State 当成 DOM 节点保存的数据",
      diagnosis: "note 来自 EditableRow 的 useState；input 的 value 只是把这个 React State 显示出来。",
      counterEvidence: "如果 note 的来源是 DOM 自己保存的数据，那么源码中的 useState(note) 就无法解释为什么 React 身份变化时 note 会重置。",
      experiment: "先输入 AAA，再切换 index key / stable id 策略。观察 key 值变化导致组件身份重建时，AAA 是否被清空。",
      evidenceRefs: [
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 9, endLine: 11 },
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 29, endLine: 33 },
      ],
    },
    "stable-key-remounts": {
      id: "stable-key-remounts",
      title: "认为 stable id 在 reorder 时会让组件重建",
      diagnosis: "如果 reorder 真的是 remount，useState(\"\") 会重新初始化，原来的 AAA 应该消失。",
      counterEvidence: "stable id 下 AAA 会跟着同一个 task 移到新位置且仍然存在，这恰好证明组件身份被保留。",
      experiment: "切到 stable id → 第一行输入 AAA → 反转顺序。预测 AAA 是消失，还是跟着原 task 移动。",
      evidenceRefs: [
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 9, endLine: 11 },
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
      ],
    },
    "id-changes-with-data": {
      id: "id-changes-with-data",
      title: "认为好的 id 应该“跟着数据变化”",
      diagnosis: "稳定 key 的核心恰好相反：同一个业务实体存在期间，它的 key 应保持不变。",
      counterEvidence: "排序改变的是 task 在数组里的位置，不应改变 task.id；index 会随位置语义变化，因此无法代表同一个业务实体。",
      experiment: "反转前后分别看 task-a 的 id 与 index：哪个值仍然描述“这是 task-a”，哪个只描述“它现在排第几”？",
      evidenceRefs: [{ kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 3, endLine: 7 }],
    },
    "props-reset-state": {
      id: "props-reset-state",
      title: "认为 Props 变化会自动重置组件局部 State",
      diagnosis: "Props 是当前 render 的输入；是否保留 local State 取决于组件身份是否延续，而不是某个 prop 是否换了值。",
      counterEvidence: "index key reorder 时 task Props 明明已经换成另一个 task，但 note 仍可能保留在原组件身份上。",
      experiment: "index key 下输入 AAA 后反转：同时观察标题（Props）与 AAA（State），确认它们可以出现不同的变化路径。",
      evidenceRefs: [
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 22, endLine: 33 },
        { kind: "source", fileName: "RenderingListsKeyDemo.jsx", startLine: 39, endLine: 46 },
      ],
    },
  },
};

const STATE_SNAPSHOT_QUEUE_MODEL = {
  learningUnitId: "state-snapshot-queue",
  version: 1,
  mechanismTitle: "先区分当前快照、更新请求和下一次 render",
  mechanismAriaLabel: "State Snapshot 与 Update Queue 机制区分",
  mechanismHeaders: {
    subject: "机制",
    example: "当前 Demo",
    role: "它负责什么",
    change: "同一次事件里会怎样",
  },
  contrastTitle: "三种队列，不要只看最后数字",
  contrastDimensions: [
    { id: "handlerStory", label: "当前 handler" },
    { id: "queueStory", label: "入队内容" },
    { id: "processingStory", label: "queue processing" },
    { id: "resultStory", label: "next render" },
  ],
  mechanismMap: [
    {
      id: "render-snapshot",
      label: "Render Snapshot",
      example: "count",
      role: "当前 render 已经得到的固定 State 值；事件 handler 读取的是这份快照。",
      change: "调用 setter 不会回头改写这份 count；当前 handler 后续读取仍看到同一 snapshot。",
    },
    {
      id: "update-request",
      label: "Update Request",
      example: "setCount(...)",
      role: "请求 React 为后续 render 计算新的 State，而不是直接修改当前变量。",
      change: "同一事件里的多个 setter 会形成一组待处理更新。",
    },
    {
      id: "replace-update",
      label: "Replace Update",
      example: "setCount(count + 1)",
      role: "先用当前 snapshot 计算一个具体值，再把“替换为这个值”的请求加入队列。",
      change: "count = 0 时连续三次都读取 0，因此三项都是 replace 1。",
    },
    {
      id: "updater-function",
      label: "Updater Function",
      example: "setCount(n => n + 1)",
      role: "把一个转换函数加入队列；React 处理队列时把上一项 pending state 传给它。",
      change: "三个 updater 会依次看到 0、1、2，并计算出 1、2、3。",
    },
    {
      id: "update-queue",
      label: "Update Queue",
      example: "replace → updater → replace",
      role: "按入队顺序处理本轮 State 更新，持续维护一个 pending state。",
      change: "replace 会直接设置 pending；updater 基于当前 pending 继续计算；后续 replace 还能再次覆盖 pending。",
    },
    {
      id: "next-render-state",
      label: "Next Render State",
      example: "scenario.result",
      role: "队列处理结束后的最终 pending value，会成为下一次 render 的 State。",
      change: "下一次 render 才拿到新的 snapshot；它与当前 handler 内仍在读取的旧 snapshot 是两回事。",
    },
  ],
  contrastCases: [
    {
      id: "replace-three",
      title: "Replace × 3",
      handlerStory: "当前 snapshot 是 0，三次表达式里的 count 都读取 0。",
      queueStory: "replace 1 → replace 1 → replace 1",
      processingStory: "pending 被设为 1，再设为 1，再设为 1。",
      resultStory: "下一次 render 得到 1。",
      conclusion: "调用了三次不等于基于前一次结果累加三次；三个 replace 值都来自同一份 snapshot。",
    },
    {
      id: "updater-three",
      title: "Updater × 3",
      handlerStory: "当前 snapshot 仍是 0；handler 本身不会看到 1、2、3。",
      queueStory: "+1 updater → +1 updater → +1 updater",
      processingStory: "pending 依次 0 → 1 → 2 → 3。",
      resultStory: "下一次 render 得到 3。",
      conclusion: "updater 的关键不是“更异步”，而是它基于 queue 中前一项的 pending state 继续计算。",
    },
    {
      id: "mixed-queue",
      title: "Replace + Updater + Replace 42",
      handlerStory: "所有直接读取 count 的表达式仍基于同一当前 snapshot。",
      queueStory: "replace count+5 → +1 updater → replace 42",
      processingStory: "先得到 count+5，再由 updater 得到 count+6，最后 replace 把 pending 设置为 42。",
      resultStory: "下一次 render 得到 42。",
      conclusion: "结果是 42 不代表 React 只保留最后一次调用；队列按顺序处理，只是最后一个 replace 改写了 pending。",
    },
  ],
  misconceptions: {
    "setter-mutates-snapshot": {
      id: "setter-mutates-snapshot",
      title: "认为 setter 会立即修改当前 render 里的 State 变量",
      diagnosis: "这里把“请求下一次 State”误解成了“改写当前 handler 已经读取到的 snapshot”。",
      counterEvidence: "Demo 会同时展示 handler snapshot 和 next render state：它们可以不同，说明 setter 没有回头改写当前 snapshot。",
      experiment: "Reset 后点击 Replace × 3。对比 Queue Debugger 的 handler snapshot 与 next render state：前者仍是 0，后者是 1。",
      evidenceRefs: [
        { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 22, endLine: 27 },
        { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 105, endLine: 127 },
      ],
    },
    "repeated-replace-accumulates": {
      id: "repeated-replace-accumulates",
      title: "认为三次 setCount(count + 1) 会自动基于前一次结果继续 +1",
      diagnosis: "三个表达式都在同一个 handler 中读取同一份 count snapshot，因此它们计算的是同一个 replacement value。",
      counterEvidence: "count = 0 时 Queue Debugger 明确显示三个 replace 都是 1，而下一次 render 只得到 1。",
      experiment: "Reset → Replace × 3；逐条读 Queue Debugger，确认三项都是 replace 1，而不是 1、2、3。",
      evidenceRefs: [{ kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 29, endLine: 45 }],
    },
    "updater-is-syntax-sugar": {
      id: "updater-is-syntax-sugar",
      title: "认为 updater function 只是 setCount(count + 1) 的另一种语法",
      diagnosis: "updater 会在 React 处理队列时接收当前 pending state；直接 replace 则把调用时已经算好的具体值入队。",
      counterEvidence: "同样连续调用三次，Replace × 3 从 0 得到 1，而 Updater × 3 得到 3。",
      experiment: "Reset 后分别运行 Replace × 3 和 Updater × 3，对比 Queue Debugger 的每一步输入值。",
      evidenceRefs: [
        { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 29, endLine: 45 },
        { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 47, endLine: 63 },
      ],
    },
    "queue-keeps-last-only": {
      id: "queue-keeps-last-only",
      title: "认为 batching 会让 React 只保留最后一次 setter",
      diagnosis: "batching 并不等于丢弃前面的更新；React 仍按顺序处理 queue 中的 replace 与 updater。",
      counterEvidence: "从 count = 0 运行 Replace + Updater 会得到 6；如果只保留最后一个 +1 updater，结果不会是 6。",
      experiment: "Reset → Replace + Updater。观察 debugger 先 replace 5，再执行 +1 updater 得到 6。",
      evidenceRefs: [{ kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 65, endLine: 79 }],
    },
    "same-result-same-semantics": {
      id: "same-result-same-semantics",
      title: "认为最终数字相同就代表更新语义相同",
      diagnosis: "单个 replace count+3 和三个 updater 在某个起点可以得到相同结果，但它们进入 queue 的内容与组合方式并不相同。",
      counterEvidence: "updater 会消费前一项 pending state，因此当它与其他更新混排时，行为取决于 queue 顺序；replace 是已经算好的具体值。",
      experiment: "先观察 Updater × 3 的 0→1→2→3，再观察 Replace + Updater，确认 updater 会接住前一项 pending，而不是重新读取 handler snapshot。",
      evidenceRefs: [
        { kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 47, endLine: 79 },
      ],
    },
    "last-result-means-last-only": {
      id: "last-result-means-last-only",
      title: "看到最终 42 就认为前面的 queue 项没有执行",
      diagnosis: "最后一个 replace 42 会把当时的 pending state 改成 42，但这不等于前面的 replace / updater 从未被处理。",
      counterEvidence: "Queue Debugger 会列出 count+5 和 +1 updater 的中间步骤，然后才显示 replace 42。",
      experiment: "运行 Replace + Updater + Replace 42，逐行查看 debugger；确认 42 是最后一步覆盖 pending 的结果。",
      evidenceRefs: [{ kind: "source", fileName: "StateSnapshotQueueDemo.jsx", startLine: 81, endLine: 98 }],
    },
  },
};

function deepFreeze(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  Object.values(value).forEach((child) => deepFreeze(child, visited));
  return Object.freeze(value);
}

export const CONCEPT_MODELS = deepFreeze({
  [LISTS_KEY_MODEL.learningUnitId]: LISTS_KEY_MODEL,
  [STATE_SNAPSHOT_QUEUE_MODEL.learningUnitId]: STATE_SNAPSHOT_QUEUE_MODEL,
});

export function getConceptModelForLearningUnit(learningUnitId) {
  return CONCEPT_MODELS[learningUnitId] ?? null;
}

export function getMisconceptionForLearningUnit(learningUnitId, misconceptionId) {
  if (!learningUnitId || !misconceptionId) return null;
  return CONCEPT_MODELS[learningUnitId]?.misconceptions?.[misconceptionId] ?? null;
}
