import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const PROPS_DEFINITION = {
  learningUnitId: "props",
  revision: 1,
  goal: "理解 Props 的只读输入语义，并避免把可派生值复制成需要同步的 State。",
  steps: [
    {
      id: "predict-parent-prop-update",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "父组件把 userName 从“张三”改成“李四”，UserCard 自己没有 name State。下一次 render 最合理的结果是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "new-prop-rendered", label: "UserCard 读取新的 name prop 并显示李四" },
          { id: "child-keeps-old-prop", label: "子组件会保留第一次收到的张三，直到自己 setState" },
          { id: "prop-mutated-in-place", label: "React 会直接修改旧 props 对象里的 name" },
        ],
      },
      reveal: {
        expectedOptionId: "new-prop-rendered",
        observation: "父级更新源 State 后产生新的 render，子组件读取当前传入的 props；Props 不是子组件持久化存储。",
      },
    },
    {
      id: "experiment-props-controls",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在 Demo 控制面板修改姓名、角色、在线状态和价格/折扣，观察 UserCard / ProductCard 如何只根据当前输入重新计算显示结果。",
      demoActionId: "edit-parent-props-inputs",
      expectedObservation: "子组件随父级当前 props 更新；ProductCard 的 actualPrice 不需要独立 setter 也会跟随 price/discount 变化。",
    },
    {
      id: "explain-props-ownership",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么 Props 应看作父级提供的只读输入，以及 actualPrice 直接由 price × discount 派生为什么比复制一份 State 更可靠。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从数据所有者、当前 render 输入和重复同步责任来解释…",
      },
    },
    {
      id: "practice-remove-derived-state",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "价格完全由 price 和 discount 决定。当前组件复制 actualPrice State 并用 Effect 同步。选择最小正确修复。",
      codeContext: {
        label: "陌生组件 · Price.jsx",
        language: "jsx",
        code: `function Price({ price, discount }) {
  const [actualPrice, setActualPrice] = useState(price * discount);

  useEffect(() => {
    setActualPrice(price * discount);
  }, [price, discount]);

  return <strong>{actualPrice}</strong>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "derive-during-render",
            label: "Patch A",
            patch: `- const [actualPrice, setActualPrice] = useState(price * discount);
- useEffect(() => {
-   setActualPrice(price * discount);
- }, [price, discount]);
+ const actualPrice = price * discount;`,
          },
          {
            id: "sync-only-price",
            label: "Patch B",
            patch: `  useEffect(() => {
    setActualPrice(price * discount);
- }, [price, discount]);
+ }, [price]);`,
          },
          {
            id: "mutate-prop",
            label: "Patch C",
            patch: `+ price = price * discount;
- return <strong>{actualPrice}</strong>;
+ return <strong>{price}</strong>;`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "derive-during-render",
        observation: "actualPrice 没有独立生命周期，它只是当前 props 的函数。直接派生消除了同步 Effect 和过期 State 的可能。",
      },
    },
    {
      id: "review-props-data-flow",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习数据所有权、默认参数和派生值：父级拥有源数据，子组件读取 Props，能计算的显示值直接计算。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
