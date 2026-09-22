import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const STATE_DRY_DEFINITION = {
  learningUnitId: "state-dry",
  revision: 1,
  goal: "只把独立事实保存为 State，把派生值、重复实体和互斥流程建模成更小、更可靠的状态空间。",
  steps: [
    {
      id: "predict-stale-full-name",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "只更新 firstName / lastName，却不更新 storedFullName。哪个结果最符合当前模型？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "stored-can-stale", label: "storedFullName 可以过期，而 render 中直接派生的 fullName 会立即反映新源数据" },
          { id: "react-syncs-copy", label: "React 会自动同步所有语义相同的 State" },
          { id: "both-stay-old", label: "两个 fullName 都必须等 Effect 后才会变化" },
        ],
      },
      reveal: {
        expectedOptionId: "stored-can-stale",
        observation: "React 不知道两个字段表达同一事实。保存副本意味着你自己承担同步不变量。",
      },
    },
    {
      id: "experiment-create-invalid-state",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "依次制造 stale fullName、isSending + isSent 矛盾组合和 selectedCopy 过期，再比较派生 fullName、status 与 selectedId 模型。",
      demoActionId: "compare-minimal-and-duplicated-state",
      expectedObservation: "重复 State 和松散 boolean 可以进入业务不希望出现的组合；派生值、枚举 status 和 stable id 会缩小状态空间。",
    },
    {
      id: "explain-minimal-facts",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释“State 只保存最小独立事实”为什么是正确性原则，而不只是 DRY 风格。至少举一个 stale copy 或非法组合例子。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从单一事实来源、同步不变量和无法表示的错误状态来解释…",
      },
    },
    {
      id: "practice-remove-derived-state",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "fullName 完全由 firstName + lastName 决定。选择删除重复 State 和同步 Effect 的最小正确修复。",
      codeContext: {
        label: "陌生组件 · ProfileForm.jsx",
        language: "jsx",
        code: `function ProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(\`\${firstName} \${lastName}\`.trim());
  }, [firstName, lastName]);

  return <p>{fullName}</p>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "derive-in-render",
            label: "Patch A",
            patch: `- const [fullName, setFullName] = useState("");
-
- useEffect(() => {
-   setFullName(\`\${firstName} \${lastName}\`.trim());
- }, [firstName, lastName]);
+ const fullName = \`\${firstName} \${lastName}\`.trim();`,
          },
          {
            id: "sync-more-often",
            label: "Patch B",
            patch: `- }, [firstName, lastName]);
+ });`,
          },
          {
            id: "store-second-copy",
            label: "Patch C",
            patch: `+ const [displayName, setDisplayName] = useState(fullName);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "derive-in-render",
        observation: "fullName 不是独立事实。直接派生删除了第二份 truth 和同步路径，stale fullName 因而无法出现。",
      },
    },
    {
      id: "review-state-shape",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：独立事实才进 State；可派生值直接计算；选择关系优先保存 id；互斥流程优先使用能限制合法状态的模型。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
