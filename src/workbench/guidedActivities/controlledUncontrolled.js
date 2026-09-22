import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const CONTROLLED_UNCONTROLLED_DEFINITION = {
  learningUnitId: "controlled-uncontrolled",
  revision: 1,
  goal: "按每份 State 的 authority 区分 controlled 与 uncontrolled，并把 value、onChange、defaultValue 放回正确语义。",
  steps: [
    {
      id: "predict-rejected-controlled-change",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "受控 Tabs 调用 onChange('settings')，但父级拒绝更新 value。Tabs 最终应该显示什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "old-value-remains", label: "继续显示父级原来的 value；onChange 只是请求" },
          { id: "settings-anyway", label: "先切到 settings，因为子组件已经触发 onChange" },
          { id: "uncontrolled-now", label: "自动切换成 uncontrolled 模式" },
        ],
      },
      reveal: {
        expectedOptionId: "old-value-remains",
        observation: "Controlled 当前值由父级 prop 决定；子组件发出 intent 并不等于 authority 已改变。",
      },
    },
    {
      id: "experiment-authority-and-default",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "先让父级拒绝/接受受控 settings 请求，再在非受控 Tabs 中改 defaultValue 并重新挂载，比较当前值何时真正变化。",
      demoActionId: "compare-controlled-and-uncontrolled-authority",
      expectedObservation: "controlled UI 跟随 value；uncontrolled UI 跟随 internalValue；defaultValue 只在新实例初始化时生效。",
    },
    {
      id: "explain-authority",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释 value、onChange(next) 与 defaultValue 分别是什么语义，以及为什么不能让 value 与 internal State 同时充当当前事实。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 authority、intent 与 initialization 来说明…",
      },
    },
    {
      id: "practice-remove-controlled-mirror",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "这是一个只支持 controlled 模式的 Tabs，却把 value 镜像到 local State。选择最小正确修复。",
      codeContext: {
        label: "陌生组件 · Tabs.jsx",
        language: "jsx",
        code: `function Tabs({ value, onChange }) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  function select(next) {
    setCurrent(next);
    onChange(next);
  }

  return <button onClick={() => select("settings")}>{current}</button>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "read-value-directly",
            label: "Patch A",
            patch: `- const [current, setCurrent] = useState(value);
- useEffect(() => { setCurrent(value); }, [value]);
+ const current = value;
...
- setCurrent(next);
  onChange(next);`,
          },
          {
            id: "sync-layout-effect",
            label: "Patch B",
            patch: `- useEffect(() => {
+ useLayoutEffect(() => {
    setCurrent(value);
  }, [value]);`,
          },
          {
            id: "duplicate-default",
            label: "Patch C",
            patch: `+ const [initialValue] = useState(value);
+ const current = initialValue;`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "read-value-directly",
        observation: "只支持 controlled 模式时，value 就是当前权威事实。复制到 local State 只会增加同步与竞争路径。",
      },
    },
    {
      id: "review-controlled-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：value 是 controlled authority；onChange 是 intent；defaultValue 只初始化 uncontrolled State；判断单位是一份 State，而不是给整个组件永久贴标签。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
