var e=`# Children 默认插槽与组合

<MentalModel title="children 让容器拥有结构，让调用者拥有内容">
\`children\` 是普通 prop，但它承载调用位置嵌套的 React 节点。容器组件可以负责边框、布局、交互骨架，而不必知道内部具体内容，从而形成稳定的 composition seam。
</MentalModel>

<Experiment title="替换内容而不改容器">
在中间 Demo 中比较 CardContainer 与 ModalLayout：保持容器实现不变，替换嵌套内容，观察结构职责与内容职责如何分离。
</Experiment>

<DemoReference action="切换不同 children 内容和容器示例" observe="确认容器不需要读取业务字段，也能复用同一布局协议。" />

<Flow items={["调用者声明嵌套节点", "React 将节点作为 children prop", "容器决定 children 放置位置", "调用者继续拥有内容语义"]} />

<Compare>
### Composition
调用者直接传 React 节点，API 接近最终 UI 结构，适合布局和包装器。

### 大配置对象
容器读取大量业务字段再决定如何渲染，短期集中、长期容易形成条件分支和隐式协议。
</Compare>

<Boundary title="children 不等于共享 state">
Composition 解决的是结构与依赖传递问题。多个子节点若需要共享可变数据，仍应明确 state ownership，再通过 props、Context 或其他合适机制传播。
</Boundary>

<AntiPattern title="为了复用把所有差异都变成 boolean props">
当组件出现 \`showHeader\`、\`compactFooter\`、\`customBodyType\` 等大量开关时，优先检查是否应该让调用者直接组合节点，而不是继续扩张配置矩阵。
</AntiPattern>

<Summary>
- \`children\` 是 React 的默认内容插槽。
- Composition 将结构骨架与业务内容解耦。
- 组合优先于不断膨胀的配置开关。
- 数据所有权与 UI 组合是两个不同问题。
</Summary>

<FurtherReading items={[{ label: "React: Passing Props — children", href: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" }, { label: "React: Thinking in React", href: "https://react.dev/learn/thinking-in-react" }]} />`;export{e as default};