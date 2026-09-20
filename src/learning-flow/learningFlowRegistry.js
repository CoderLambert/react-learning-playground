const FLOW_DEFINITIONS = Object.freeze({
  "rendering-lists-key": Object.freeze({
    learningUnitId: "rendering-lists-key",
    version: 1,
    objective: "解释为什么稳定 key 决定组件身份与局部 State 归属，而不只是列表渲染性能。",
    mentalModel: "同一父节点下，React 需要判断前后两次 render 中“哪个组件还是同一个组件”。稳定 key 提供身份线索；身份延续时，局部 State 才能继续属于正确的业务实体。",
    misconception: "“key 主要是为了性能或消除 warning。”——真正危险的是不稳定身份会让已有局部 State 被复用到错误的数据实体。",
    decisionRule: "如果列表会 insert / delete / reorder，或列表项包含输入、展开、动画等局部 State，优先使用来自数据模型、在实体生命周期内保持稳定的 id。",
    stageHints: Object.freeze({
      understand: "先建立 key → identity → State preservation 的关系。",
      practice: "先预测，再用真实 Demo 验证 index key 与 stable id 的差异。",
      verify: "离开当前解释，用 3 道题检查是否能独立判断。",
    }),
  }),
});

export function getSingleLearningFlowDefinition(learningUnitId) {
  return FLOW_DEFINITIONS[learningUnitId] ?? null;
}

export function isSingleLearningFlowUnit(learningUnitId) {
  return Boolean(getSingleLearningFlowDefinition(learningUnitId));
}
