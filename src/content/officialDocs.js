const REACT_LEARN_BASE_URL = "https://zh-hans.react.dev/learn";

const RAW_OFFICIAL_DOCS_BY_LEARNING_UNIT_ID = {
  "component-jsx-pure-render": {
    title: "你的第一个组件",
    url: `${REACT_LEARN_BASE_URL}/your-first-component`,
    match: "direct",
    description: "对应组件定义、组件命名与组件嵌套的官方入门章节。",
  },
  props: {
    title: "向组件传递 Props",
    url: `${REACT_LEARN_BASE_URL}/passing-props-to-a-component`,
    match: "direct",
    description: "对应 Props 传递、读取、默认值与 JSX props 的官方章节。",
  },
  children: {
    title: "向组件传递 Props · 将 JSX 作为 children 传递",
    url: `${REACT_LEARN_BASE_URL}/passing-props-to-a-component#passing-jsx-as-children`,
    match: "direct",
    description: "对应 children 作为组合插槽的官方说明。",
  },
  "multi-slots": {
    title: "向组件传递 Props · 将 JSX 作为 children 传递",
    url: `${REACT_LEARN_BASE_URL}/passing-props-to-a-component#passing-jsx-as-children`,
    match: "related",
    description: "官方以 children 讲解组合；具名多插槽是在相同组合思想上扩展多个 JSX props。",
  },
  "conditional-rendering": {
    title: "条件渲染",
    url: `${REACT_LEARN_BASE_URL}/conditional-rendering`,
    match: "direct",
    description: "对应 if、三元表达式、&& 与条件返回 JSX 的官方章节。",
  },
  "rendering-lists-key": {
    title: "渲染列表 · 用 key 保持列表项顺序",
    url: `${REACT_LEARN_BASE_URL}/rendering-lists#keeping-list-items-in-order-with-key`,
    match: "direct",
    description: "对应列表渲染、稳定 key 与组件身份的官方章节。",
  },
  "prop-drilling": {
    title: "使用 Context 深层传递参数",
    url: `${REACT_LEARN_BASE_URL}/passing-data-deeply-with-context`,
    match: "direct",
    description: "对应 props 深层传递、替代方案与 Context 使用边界的官方章节。",
  },
};

export const OFFICIAL_DOCS_BY_LEARNING_UNIT_ID = Object.freeze(
  Object.fromEntries(
    Object.entries(RAW_OFFICIAL_DOCS_BY_LEARNING_UNIT_ID).map(([id, doc]) => [
      id,
      Object.freeze({ ...doc }),
    ]),
  ),
);

export const OFFICIAL_DOCS_PILOT_IDS = Object.freeze(
  Object.keys(OFFICIAL_DOCS_BY_LEARNING_UNIT_ID),
);

export function getOfficialDocsForLearningUnit(learningUnitId) {
  if (!learningUnitId) return null;
  return OFFICIAL_DOCS_BY_LEARNING_UNIT_ID[learningUnitId] ?? null;
}
