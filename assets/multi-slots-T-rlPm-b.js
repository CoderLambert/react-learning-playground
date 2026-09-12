var e=`# 具名多插槽与组件 API

<MentalModel title="具名 slot 是显式的结构扩展点">
React 没有专门的 slot 语法；\`header\`、\`footer\`、\`actions\` 等接收 React 节点的 props 就能形成具名插槽。关键不是名称，而是把“容器控制什么、调用者可替换什么、如何表达缺省与隐藏”定义成稳定协议。
</MentalModel>

<Experiment title="验证三态协议">
在中间 Demo 中分别使用默认内容、局部覆盖和显式隐藏，观察 ProductionModal/Pannel 如何区分“未提供”“提供节点”“明确不渲染”。
</Experiment>

<DemoReference action="依次切换默认、覆盖、隐藏插槽" observe="关注 undefined/false/具体 ReactNode 在本组件 API 中各自代表的语义。" />

<Flow items={["容器声明稳定区域", "为可定制区域定义节点 props", "约定缺省值", "约定显式隐藏值", "调用者只覆盖需要变化的区域"]} />

<Boundary title="三态必须写进 API 契约">
本 Demo 的组件明确约定 \`undefined\` 表示使用默认模板，\`false\` 表示显式隐藏，其他已提供值表示覆盖内容。不要用模糊的 truthy 判断把这些状态合并，也不要在文档里把 \`null\` 与 \`false\` 当成可随意互换的隐藏协议。React 本身允许多种“什么都不渲染”的节点值，但组件 API 应只公开一种清晰约定，并让类型、文档和实现保持一致。
</Boundary>

<AntiPattern title="把插槽变成隐式配置 DSL">
若一个 slot prop 开始接受复杂对象并由内部解释几十个字段，组合优势就被重新变成配置驱动。能传节点时优先传节点；只有需要稳定数据协议时才传结构化配置。
</AntiPattern>

<Summary>
- 具名插槽本质是通过 props 传入可渲染内容。
- 默认、覆盖、隐藏应有明确三态语义。
- 本 Demo 的协议是 \`undefined\` 默认、\`false\` 隐藏、已提供节点覆盖。
- 容器拥有骨架，调用者拥有扩展内容。
- API 的可预测性比“支持所有配置”更重要。
</Summary>

<FurtherReading items={[{ label: "React: Passing Props to a Component", href: "https://react.dev/learn/passing-props-to-a-component" }, { label: "React: Choosing the State Structure", href: "https://react.dev/learn/choosing-the-state-structure" }]} />`;export{e as default};