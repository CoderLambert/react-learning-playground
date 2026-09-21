import { getConceptModelForLearningUnit } from "../content/conceptModels.js";

export const LEARNING_FLOW_STAGES = Object.freeze({
  UNDERSTAND: "understand",
  PRACTICE: "practice",
  VERIFY: "verify",
});

function flowDefinition(definition) {
  return Object.freeze({
    ...definition,
    conceptModel: getConceptModelForLearningUnit(definition.learningUnitId),
    stageHints: Object.freeze(definition.stageHints),
  });
}

const FLOW_DEFINITIONS = Object.freeze({
  "rendering-lists-key": flowDefinition({
    learningUnitId: "rendering-lists-key",
    version: 1,
    objective: "解释为什么稳定 key 决定组件身份与局部 State 归属，而不只是列表渲染性能。",
    aiReviewTarget: "只检查本节核心目标：学习者应能说明 stable key 是同级元素的稳定身份线索；reorder 时 React 是否匹配到同一组件身份决定 local State 是否继续属于同一业务实体；Props 更新、DOM 更新与 local State 保留不是同一件事。不要把 reconciliation 内部实现、极端边界或性能细节当成本节必答项。",
    coreModelTitle: "key → Component Identity → State preservation",
    mentalModel: "同一父节点下，React 需要判断前后两次 render 中“哪个组件还是同一个组件”。稳定 key 提供身份线索；身份延续时，局部 State 才能继续属于正确的业务实体。",
    misconceptionTitle: "不只是性能优化",
    misconception: "“key 主要是为了性能或消除 warning。”——真正危险的是不稳定身份会让已有局部 State 被复用到错误的数据实体。",
    decisionRuleTitle: "什么时候必须稳定 key",
    decisionRule: "如果列表会 insert / delete / reorder，或列表项包含输入、展开、动画等局部 State，优先使用来自数据模型、在实体生命周期内保持稳定的 id。",
    practiceTitle: "先做判断，再让 Demo 证明或推翻它",
    practiceDescription: "先预测结果，再亲手操作真实 Demo，最后把同一个 identity mental model 迁移到新场景。",
    verifyTitle: "不看答案，检查你有没有把几个身份机制混在一起",
    verifyDescription: "诊断题会区分“记住 stable id 规则”和“能解释 identity / Props / State / DOM 的因果关系”。答错时先用反证实验纠正模型，再看完整解释。",
    stageHints: {
      understand: "先建立 key → identity → State preservation 的关系。",
      practice: "先预测，再用真实 Demo 验证 index key 与 stable id 的差异。",
      verify: "离开当前解释，用诊断题检查你是否真正区分了 identity、Props、State 与 DOM。",
    },
  }),
  "state-snapshot-queue": flowDefinition({
    learningUnitId: "state-snapshot-queue",
    version: 1,
    objective: "解释为什么 setter 不会改写当前 render 的 State snapshot，以及 replace update 与 updater function 如何按队列顺序计算下一份 State。",
    aiReviewTarget: "只检查本节核心目标：学习者应能区分 current render snapshot、replace update、updater function 与 queue processing；理解 setter 不会回头改写当前 handler 的 snapshot，updater 会消费前一项 pending State，queue 按入队顺序得到 next render State。不要把调度 lane、React 内部数据结构或并发实现细节当成本节必答项。",
    coreModelTitle: "Render Snapshot → Update Queue → Next Render State",
    mentalModel: "每次 render 都拿到一份固定 State snapshot。setter 不会回头修改这份 snapshot；它把 replace value 或 updater function 加入队列。React 随后按顺序处理队列，得到下一次 render 的 State。",
    misconceptionTitle: "不要只背“setState 是异步的”",
    misconception: "“调用 setter 后变量应该立刻变”“连续调用三次就会自动累加三次”“batching 只保留最后一次调用”都混淆了 current snapshot 与 pending update queue。",
    decisionRuleTitle: "什么时候用 updater function",
    decisionRule: "如果下一份 State 依赖同一批更新里前一项计算出的 pending State，就使用 updater function；如果你要用当前 render 已知信息直接替换成一个具体值，replace update 更直接。",
    practiceTitle: "先预测数字，再解释队列为什么得到这个数字",
    practiceDescription: "不要只看最终 count。先预测每个 scenario 的 queue，再用 Queue Debugger 对照 handler snapshot、每一步 pending State 与 next render state。",
    verifyTitle: "不看 Demo，独立推演一次 update queue",
    verifyDescription: "诊断题会检查你是否真正区分 snapshot、replace、updater 与 queue order。答错时先用现有 Queue Debugger 反证自己的模型，再重新选择。",
    stageHints: {
      understand: "先区分 current snapshot、update request、queue processing 与 next render state。",
      practice: "先预测 Replace / Updater / mixed queue，再用 Queue Debugger 逐步验证。",
      verify: "离开当前日志，独立推演 queue，并诊断是否仍把 setter 当成同步变量赋值。",
    },
  }),
  "preserving-resetting-state": flowDefinition({
    learningUnitId: "preserving-resetting-state",
    version: 1,
    objective: "根据产品业务身份决定局部 State 应该保留还是重置，并把 key 放在准确的 identity boundary。",
    coreModelTitle: "Identity match → Preserve State / New identity → Reset State",
    mentalModel: "React 是否保留 local State，取决于前后 render 能否匹配到同一个组件身份，而不是某个 prop 值是否变化。同一父级位置、组件类型与 key 身份仍匹配时，State 会保留；身份不再匹配时，新组件从初始 State 开始。",
    misconceptionTitle: "不要把 key 当成“强制刷新”",
    misconception: "真正要解决的是产品身份边界：哪些 UI 仍代表同一个实例，哪些 UI 因业务实体切换应该成为新实例。把 key 放得过高或使用随机 key，都会重置本来应该保留的 State。",
    decisionRuleTitle: "先划业务 State 边界，再决定 key 放哪里",
    decisionRule: "如果某段局部 State 只属于当前业务实体，并且实体切换时明确应该丢弃，就让稳定业务 id 参与这段子树的身份；如果外层 UI State 应跨实体保留，就不要把 identity reset 扩大到外层。",
    practiceTitle: "先判断该保留哪一层，再选择最小 identity 修复",
    practiceDescription: "先用 Chat Demo 对比“只变 Props”和“改变业务 key”，再把模型迁移到 WorkspaceShell / InvoiceEditor：只 reset 真正属于新 customer 的编辑器 State。",
    verifyTitle: "不背 key 技巧，检查你能否划出正确的 identity boundary",
    verifyDescription: "诊断题会检查 Props、component identity、local State、key 和业务实体之间的关系，以及 reset 边界应该放在哪一层。答错时先用现有 Demo 做反证，再重新判断。",
    stageHints: {
      understand: "先区分业务实体、Props 输入、React component identity 与 local State。",
      practice: "先验证同一 Chat identity 如何保留 draft，再选择只 reset 必要子树的 patch。",
      verify: "离开当前示例，根据产品 State 边界判断什么时候保留 identity、什么时候创建新 identity。",
    },
  }),
  "not-need-effect": flowDefinition({
    learningUnitId: "not-need-effect",
    version: 1,
    objective: "根据逻辑的因果来源判断它应该留在 render、Event Handler、Effect，还是用 identity reset 表达业务边界。",
    coreModelTitle: "Why it runs → Where it belongs",
    mentalModel: "先问“为什么这段逻辑需要运行？”：为当前 UI 计算值就留在 render；因为一次明确用户交互就留在 Event Handler；因为组件存在而需要与 React 外部系统保持同步，才使用 Effect。",
    misconceptionTitle: "Effect 不是通用“变化监听器”",
    misconception: "“有副作用就用 Effect”“依赖某个 State 就监听它”“请求都必须放 Effect”都忽略了真正的因果来源。Effect 主要负责外部同步，而不是把内部数据流重新接一遍。",
    decisionRuleTitle: "先找因果，再谈 API",
    decisionRule: "能从当前 props/state 派生就直接计算；明确由用户动作触发就放 handler；需要组件生命周期内维持外部同步才用 Effect。key reset 与 memoization 分别属于 identity 与 performance 决策，不是 Effect 的通用替代或变体。",
    practiceTitle: "先判断因果来源，再让三个 Demo 场景验证边界",
    practiceDescription: "不要从 API 名称出发。先判断这段逻辑为什么运行，再对照派生列表、购买事件和 userId identity reset，最后迁移到真正的外部订阅场景。",
    verifyTitle: "不看口诀，按因果来源做工程判断",
    verifyDescription: "诊断题会检查你是否能区分 render derivation、event-caused logic、external synchronization、identity reset 与 memoization。答错时先用现有 Demo 反证，再重新选择并复述。",
    stageHints: {
      understand: "先建立 render / Event Handler / Effect / identity reset 的因果边界。",
      practice: "先判断 filteredProducts、购买日志与 userId reset 为什么运行，再用 Demo 验证。",
      verify: "离开当前说明，根据因果来源独立判断代码应该放在哪里。",
    },
  }),
  "lifecycle-of-reactive-effects": flowDefinition({
    learningUnitId: "lifecycle-of-reactive-effects",
    version: 1,
    objective: "把 Effect 理解为独立外部同步过程，并根据真实 reactive reads 判断何时 cleanup 旧同步、setup 新同步。",
    coreModelTitle: "Render → Commit → Cleanup(old) → Setup(new)",
    mentalModel: "Effect 不等同于组件生命周期回调。render 先读取本次 reactive values，commit 后如果同步目标需要变化，React 先运行上一轮 cleanup 撤销旧外部关系，再用本次 committed values 运行 setup 建立下一轮同步。",
    misconceptionTitle: "依赖数组不是“运行次数控制器”",
    misconception: "真正的问题是 setup 读取了哪些 reactive values、这些值是否决定同步关系。为了少运行删除真实依赖会制造 stale synchronization；反过来，组件里某个值会变化也不代表它一定要让这个 Effect 重建。",
    decisionRuleTitle: "先定义同步目标，再检查 reactive reads",
    decisionRule: "决定外部同步目标的 reactive value 必须保留为依赖；如果某个 read 只是为了基于旧 State 计算下一份 State，可改用 functional updater；如果它属于 Effect 内触发、但不应重建同步的事件逻辑，可用 Effect Event 分离。先改变代码，再让依赖准确反映代码。",
    practiceTitle: "先观察真实 cleanup/setup，再重建一次完整更新顺序",
    practiceDescription: "用聊天室 Demo 验证 roomId 变化、静音切换和消息更新的不同效果，再通过 ordered-sequence 把 update → render → commit → cleanup → setup 顺序迁移到 topic subscription。",
    verifyTitle: "不靠依赖数组口诀，判断同步过程为什么需要重建",
    verifyDescription: "诊断题会检查 cleanup 时机、真实依赖、functional updater、Effect Event 与 Strict Mode 边界。答错时先用日志或源码做反证，再重新选择并复述。",
    stageHints: {
      understand: "先区分 render/commit 与 Effect 的 cleanup/setup，并找到真正决定外部同步目标的值。",
      practice: "切换 room、静音和消息更新，观察哪些变化真的重建连接，再排列订阅更新顺序。",
      verify: "离开当前日志，根据同步目标和 reactive reads 独立判断依赖与生命周期。",
    },
  }),
});

export const SINGLE_LEARNING_FLOW_UNIT_IDS = Object.freeze(Object.keys(FLOW_DEFINITIONS));
 
export function getSingleLearningFlowDefinition(learningUnitId) {
  return FLOW_DEFINITIONS[learningUnitId] ?? null;
}

export function isSingleLearningFlowUnit(learningUnitId) {
  return Boolean(getSingleLearningFlowDefinition(learningUnitId));
}
