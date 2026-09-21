import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const NOT_NEED_EFFECT_DEFINITION = {
  learningUnitId: "not-need-effect",
  revision: 2,
  goal: "学会先判断逻辑的因果来源，再决定它属于 render、Event Handler 还是 Effect。",
  steps: [
    {
      id: "predict-derived-list-without-effect",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `商品列表当前由 query 和 category 决定。

当用户修改搜索词时，setQuery 已经触发一次新的 render。

为了得到最新 filteredProducts，还必须再做什么？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "derive-during-render", label: "直接在这次 render 中根据新的 query / category 重新计算" },
          { id: "sync-with-effect", label: "等 render 完成后，再由 Effect 把过滤结果写入另一份 State" },
          { id: "store-in-ref", label: "把过滤结果写进 ref，等待下一次交互读取" },
        ],
      },
      reveal: {
        expectedOptionId: "derive-during-render",
        observation: `filteredProducts 完全可以由当前 query、category 和 products 计算得到。

React 因 State 变化重新 render 时，直接重新计算即可；
再复制一份 filtered State 会增加第二份事实来源和额外同步链。`,
      },
    },
    {
      id: "experiment-no-effect-boundaries",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中完成三组操作：

1. 修改搜索词和分类，观察商品列表立即由当前输入重新派生。
2. 点击某个商品的「购买」，观察日志由这次点击直接产生。
3. 在留言板输入草稿，再切换 User_A / User_B，观察 key 切换身份后的草稿重置。

思考这三组行为分别为什么不需要一个额外 Effect 来“监听变化”。`,
      demoActionId: "exercise-render-event-identity-boundaries",
      expectedObservation: "过滤结果在 render 中由当前 State 派生；购买日志由明确的 click Event Handler 直接产生；用户身份切换通过 key 创建新的 CommentForm 身份并重置局部 State。",
    },
    {
      id: "explain-effect-boundary",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `用“为什么这段代码需要运行？”来解释 Demo 的三种情况：

- filteredProducts 为什么属于 render？
- 购买日志为什么属于 Event Handler？
- 什么样的需求才真正需要 Effect？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从“派生计算 / 用户事件 / 外部同步”的因果边界解释…",
      },
    },
    {
      id: "practice-remove-derived-state-effect",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `ProductSearch 把完全可由 \`products + query\` 得到的列表复制进 State：

\`\`\`jsx
const [visibleProducts, setVisibleProducts] = useState([]);

useEffect(() => {
  setVisibleProducts(filterProducts(products, query));
}, [products, query]);
\`\`\`

\`visibleProducts\` 不需要和任何外部系统同步，而且当 products prop 或 query 改变时都必须立即反映最新输入。

选择能移除额外同步链、同时保持行为正确的最小修复。`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "derive-visible-products",
            label: "Patch A",
            patch: `- const [visibleProducts, setVisibleProducts] = useState([]);
-
- useEffect(() => {
-   setVisibleProducts(filterProducts(products, query));
- }, [products, query]);
+ const visibleProducts = filterProducts(products, query);`,
          },
          {
            id: "sync-only-in-input-handler",
            label: "Patch B",
            patch: `- useEffect(() => {
-   setVisibleProducts(filterProducts(products, query));
- }, [products, query]);
+ function handleQueryChange(nextQuery) {
+   setQuery(nextQuery);
+   setVisibleProducts(filterProducts(products, nextQuery));
+ }`,
          },
          {
            id: "replace-with-layout-effect",
            label: "Patch C",
            patch: `- useEffect(() => {
+ useLayoutEffect(() => {
    setVisibleProducts(filterProducts(products, query));
  }, [products, query]);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "derive-visible-products",
        observation: `visibleProducts 是当前 render 输入的纯派生值，直接计算即可。

只在输入事件里同步会漏掉 products prop 的变化；
换成 useLayoutEffect 仍然保留了重复 State、额外 render 和不必要的同步关系。`,
      },
    },
    {
      id: "review-effect-decision-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，重新检查每段逻辑：

它是在计算 UI、
响应一个明确事件，
还是在与 React 外部系统保持同步？`,
      resources: ["notes", "source", "demo"],
    },
  ],
};
