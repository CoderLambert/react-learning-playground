var e=`# TypeScript for React：类型描述组件边界，不替代运行时模型

<MentalModel title="先设计组件协议，再让类型系统检查它">
React 组件的类型重点是输入输出边界：props、children、事件、ref、受控值、discriminated union 与泛型关系。TypeScript 能阻止大量不合法组合，但运行时数据、React 渲染语义和业务约束仍需要代码与测试保证。
</MentalModel>

<Flow items={[
  "从组件允许的状态/变体定义 props 协议",
  "用 union 表达互斥状态，而不是一堆可选字段",
  "事件类型从实际元素/handler 推导",
  "泛型只在输入输出确有类型关系时引入",
  "外部 JSON/API 在运行时校验后再进入可信类型域"
]} />

<Experiment title="让类型错误暴露 API 设计问题">
查看中间 Demo 的 React/TypeScript 边界样例，尝试构造非法 props 组合、错误事件类型和泛型不匹配。观察编译器如何把“组件不允许这种状态”提前变成开发期反馈。
</Experiment>

<DemoReference action="检查 TypeScript React Demo 与泛型样例" observe="区分类型系统能证明的关系与只能在运行时验证的事实。" />

<Observation>
\`ReactNode\`、\`ReactElement\`、\`JSX.Element\` 并非可以无脑互换的“React 返回值”。组件 API 应选择最符合真实契约的类型；多数普通 children 使用 \`ReactNode\`，需要操作具体 element 时才收窄。
</Observation>

<Compare>
### Optional props 堆叠
\`loading?\`, \`error?\`, \`data?\` 允许大量互相矛盾组合。

### Discriminated union
\`{status: 'loading'} | {status:'error'; error: Error} | {status:'success'; data: T}\` 把合法状态编码进类型。
</Compare>

<AntiPattern title="为了消除红线大量使用 as / any">
类型断言不会验证运行时事实，只是要求编译器相信你。边界数据应通过 schema/guard 验证；内部类型应尽量由推导和明确协议得到，而不是不断扩大 \`any\`。
</AntiPattern>

<Boundary title="TypeScript 被编译掉">
浏览器不会执行 TypeScript 类型。API 返回值、localStorage、URL 参数、用户输入等外部数据都可能违反静态声明；这些 trust boundary 需要运行时解析/校验。类型测试也不能替代 React 行为测试。
</Boundary>

<Summary>
- 用类型表达组件允许的状态和输入输出关系。
- union 通常比互相依赖的 optional flags 更可靠。
- 泛型应服务真实关系，不为“高级”而增加复杂度。
- 外部数据必须运行时验证；\`as\` 不是验证。
</Summary>

<FurtherReading items={[
  { label: "React: Using TypeScript", href: "https://react.dev/learn/typescript" },
  { label: "TypeScript: Narrowing", href: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
  { label: "TypeScript: Generics", href: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }
]} />`;export{e as default};