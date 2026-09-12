var e=`# Controlled / Uncontrolled：这份 State 由谁决定？

React 里“受控 / 非受控”最有价值的用法，不是给整个组件贴标签，而是讨论**某一份重要状态由谁拥有最终决定权**。

<MentalModel title="onChange 表达意图，value 表达权威事实">
受控模式下，子组件可以通过 \`onChange(next)\` 告诉父组件“用户想切换到 next”，但最终 UI 是否真的变化，取决于父组件下一次 render 传回来的 \`value\`。非受控模式下，这份状态保存在组件自己的 State 中，父组件通常只通过 \`defaultValue\` 提供初始值。
</MentalModel>

## 先验证“请求不等于结果”

<Experiment title="让父组件拒绝一次受控更新">
保持中间 Demo 的“父组件拒绝切换到 settings”开启，然后点击“设置”。再关闭限制并重试。观察两次 \`onChange("settings")\` 都发生了，但只有父组件真正更新 \`value\` 的那一次，Tabs 才切换。
</Experiment>

<DemoReference action="点击受控 Tabs 的“设置”，切换父级拒绝开关，再使用“父组件强制重置”" observe="区分子组件发出的 intent 与父级传回的 authoritative value；确认父组件可以接受、拒绝或主动覆盖当前值。" />

这就是受控组件最核心的能力：**协调权在外部**。它适合 URL 与 UI 同步、多个组件共享选择、父级业务校验、权限阻止和集中重置等场景。

数据流可以理解成：

\`\`\`text
用户交互
  ↓
Tabs: onChange(next)        ← 请求 / intent
  ↓
Parent 决定是否 setState
  ↓
next render: value={...}    ← 权威事实
  ↓
Tabs 根据 value 展示最终状态
\`\`\`

<AntiPattern title="把 onChange 当成命令式 setter">
公共组件的 \`onChange(next)\` 不应暗示“调用后组件一定已经切换”。在受控模式里，它只是通知外部发生了什么或提出下一值；外部是否接受，需要由实际 \`value\` 决定。
</AntiPattern>

## defaultValue 为什么不是“另一个 value”

<Experiment title="修改 defaultValue，再重新挂载">
先在非受控 Tabs 中手动切换选中项，然后点击“仅修改父级 defaultValue”。当前选中项不会被覆盖。再点击“使用新 key 重新挂载”，新的组件实例会重新使用当前 defaultValue 初始化内部 State。
</Experiment>

<DemoReference action="依次操作非受控 Tabs、修改 defaultValue、使用新 key 重新挂载" observe="确认 defaultValue 参与初始化，但不会在挂载后持续控制 internalValue；新实例才重新读取初始值。" />

\`defaultValue\` 的语义是“初始值”。对于自定义组件，它通常被用来初始化内部 State；之后状态由组件自己维护。如果父级需要在挂载期间随时决定当前值，就应该提供受控 \`value\`，而不是试图让 \`defaultValue\` 充当同步信号。

<Boundary title="组件级 ownership 与原生表单元素要分开理解">
对自定义 React 组件，“controlled”通常表示某份重要信息由 props 驱动，“uncontrolled”表示它由组件自己的 local State 驱动。对原生 \`<input>\`、\`<select>\` 等表单元素，语义更具体：\`value\` / \`checked\` 持续指定当前值，而 \`defaultValue\` / \`defaultChecked\` 只指定初始值，之后未受控值主要由 DOM 持有。
</Boundary>

这两个层次相关，但不能简单混成一句“非受控状态都存在 DOM 里”。一个非受控 \`Tabs\` 可以完全使用 React State，而非 DOM value。

## 不是整个组件二选一

React 官方把 controlled / uncontrolled 作为讨论组件设计的实用概念，而不是严格的二元分类。真实组件通常同时包含两类信息：

\`\`\`text
Tabs
├── selectedValue  → 可以由父级 value 控制
├── hoverIndex     → 可以保留 local state
└── focusVisible   → 可以保留 local state
\`\`\`

因此更准确的问题不是：

> “这个组件是不是 controlled？”

而是：

> **“这份会影响业务协调的重要 State，应该由谁决定？”**

<AntiPattern title="维护两份同义的当前值">
如果组件同时把外部 \`value\` 和内部 \`internalValue\` 都当成当前事实，再靠 Effect 或条件同步两份值，很容易出现竞争和覆盖顺序问题。支持 controlled / uncontrolled 双模式时，应有明确规则：有 \`value\` 时读取外部值；没有 \`value\` 时读取内部值，并且一次挂载期间保持模式稳定。
</AntiPattern>

## 项目里怎么选

<Compare>
### 更适合受控

- 当前值需要写入 URL / Router State。
- 多个兄弟组件必须围绕同一状态协同。
- 父组件需要校验、拒绝、权限控制或集中重置。
- 业务需要在一个更高层维护唯一事实来源。

### 更适合非受控

- 状态只对组件内部交互有意义。
- 父级只关心默认状态，不需要持续协调当前值。
- 为了一个局部 UI 状态把它提升到父级只会增加样板代码。
</Compare>

<Boundary title="表单元素不要在挂载期间切换 controlled / uncontrolled">
原生输入若一开始 \`value={undefined}\`，后面又变成字符串，或反向切换，React 会警告 controlled / uncontrolled 模式变化。需要受控文本输入时，应从一开始就提供字符串值，例如空值使用 \`""\`。
</Boundary>

<Summary>
- 受控模式的关键不是“父组件收到了 onChange”，而是父级 \`value\` 对当前值有最终决定权。
- \`onChange\` 是 intent / notification；它不保证请求一定被接受。
- \`defaultValue\` 负责初始化，不是持续同步协议。
- 自定义组件的 uncontrolled State 可以存于 React State；原生表单元素的 uncontrolled value 则主要由 DOM 持有。
- 组件可以同时包含受控信息和内部 State，判断单位应该是“这份 State”。
</Summary>

<FurtherReading items={[
  { label: "React: Sharing State Between Components", href: "https://react.dev/learn/sharing-state-between-components" },
  { label: "React: input", href: "https://react.dev/reference/react-dom/components/input" }
]} />
`;export{e as default};