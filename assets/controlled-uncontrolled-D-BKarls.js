var e=`# 受控与非受控组件

<MentalModel title="受控与非受控的核心是 state ownership">
受控组件由父级通过 \`value\`（或等价 prop）决定当前值，并通过 \`onChange\` 请求修改；非受控组件把当前值保存在自身/DOM 内部，父级通常只给初始值。选择哪种模式，本质是在定义谁拥有事实。
</MentalModel>

<Experiment title="比较外部控制能力">
在中间 Demo 中分别操作 controlled 与 uncontrolled 输入，再让父级尝试重置/同步它们，观察两种 ownership 的差异。
</Experiment>

<DemoReference action="编辑输入并触发父级控制操作" observe="确认 value + onChange 的闭环，以及 defaultValue 只负责初始化而非持续控制。" />

<Compare>
### Controlled
父级是 source of truth，易于联动、校验和集中重置，但每次变化都进入 React 数据流。

### Uncontrolled
内部/DOM 持有值，接入简单、局部自治，但外部实时协调能力更弱。
</Compare>

<Boundary title="不要在生命周期中随意切换模式">
输入从 \`undefined\` 变成字符串或反向变化，可能造成 controlled/uncontrolled 切换 warning。组件 API 应从一开始就明确 ownership，并保持一致。
</Boundary>

<AntiPattern title="同时维护内部 value 和外部 value 两个真相">
若组件既接受受控 \`value\` 又保存同义内部 state，却没有明确优先级与同步协议，很容易产生竞态。支持双模式时应显式定义 controlled 判定、初始值和更新契约。
</AntiPattern>

<Summary>
- controlled/uncontrolled 是 ownership 选择。
- \`value + onChange\` 构成受控闭环。
- \`defaultValue\` 表达初始值，不是持续控制。
- 公共组件应明确且稳定地定义控制模式。
</Summary>

<FurtherReading items={[{ label: "React: Sharing State Between Components", href: "https://react.dev/learn/sharing-state-between-components" }, { label: "React: input", href: "https://react.dev/reference/react-dom/components/input" }]} />`;export{e as default};