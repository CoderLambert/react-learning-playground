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
});

export function getSingleLearningFlowDefinition(learningUnitId) {
  return FLOW_DEFINITIONS[learningUnitId] ?? null;
}

export function isSingleLearningFlowUnit(learningUnitId) {
  return Boolean(getSingleLearningFlowDefinition(learningUnitId));
}
