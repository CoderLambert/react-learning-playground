var e=`# 状态提升：让需要协同的组件共享同一个事实

当多个组件必须基于同一份信息保持一致时，问题通常不是“怎么让兄弟组件互相通知”，而是：**这份事实应该由谁拥有？**

<MentalModel title="把共享事实放到需要协调它的最近共同 owner">
如果多个子组件都要读取或影响同一份状态，通常把这份 state 放到它们最近的共同父节点：父级保存权威值，通过 props 向下传数据，通过 callback 接收子组件表达的用户意图。

状态提升的目的不是把 state 搬得越高越好，而是给“必须一致的那份事实”找到一个唯一、足够近的 owner。
</MentalModel>

## Demo 中真正发生了什么

当前 Demo 的共享事实是搜索条件 \`query\`：

\`\`\`text
LiftingStateUpDemo owns query
        │
        ├── value / onChange → SearchBox
        ├── query + count   → SearchSummary
        └── query + results → FrameworkList
\`\`\`

\`SearchBox\` 不需要知道 Summary 或 List 的存在。它只做两件事：

\`\`\`text
显示父级给它的 value
用户输入时调用 onChange(nextValue)
\`\`\`

父级接受这次意图并更新 \`query\` 后，下一次 render 会把新的 \`query\` 同时传给所有依赖它的子组件。因此兄弟组件之间不需要建立第二条“横向同步”通道。

<Experiment title="实验：从一个子组件改变共享事实">
在中间 Demo 的搜索框输入 \`React\`、\`工具\` 或其他关键词：

1. 观察输入框显示新的 \`query\`。
2. 观察 Summary 的匹配数量和过滤条件同步变化。
3. 观察 List 使用同一个 \`query\` 得到新的过滤结果。
4. 点击清空按钮，确认三个区域再次同时回到同一个父级状态所决定的结果。

这个实验验证的是“一个 owner，多处消费”，不是两个本地 State 互相复制。
</Experiment>

<DemoReference action="在 SearchBox 输入关键词或清空 query" observe="同一个父级 query 如何同时决定 SearchBox、SearchSummary 与 FrameworkList；子组件之间没有互相 setState。" />

## 为什么不让每个子组件保存一份 query？

如果 SearchBox、Summary、List 各自保存：

\`\`\`text
inputQuery
summaryQuery
listQuery
\`\`\`

就会立刻出现新的正确性问题：

\`\`\`text
它们什么时候同步？
谁先更新？
某条更新路径漏掉其中一个怎么办？
\`\`\`

这和重复保存 \`fullName\`、复制 selected object 是同一种数据建模问题：**一个事实被复制成多份可独立变化的 State。**

提升之后，合法状态空间变得更小：三个区域只能基于同一个 \`query\` 渲染。

## callback 表达的是意图，不是子组件越权修改父级 State

典型 API：

\`\`\`jsx
<SearchBox value={query} onChange={setQuery} />
\`\`\`

从组件边界看，\`onChange(next)\` 表达“用户希望 query 变成 next”。真正拥有 \`query\` 的父组件仍然决定如何处理这个请求。

今天父级可以直接：

\`\`\`js
setQuery(next);
\`\`\`

以后也可以先做：

\`\`\`text
校验
规范化
权限检查
URL 同步
日志记录
\`\`\`

再决定最终值。

这也是状态提升和 controlled component 之间的直接联系：**值的 authority 在 owner，子组件通过事件回报意图。**

<Boundary title="不要把 State 提升得比协同范围更高">
如果一份 State 只有一个局部组件需要，留在本地通常更好。只有当多个组件确实需要基于同一事实协调时，才把 owner 提升到能够覆盖这些消费者的最近共同位置。

如果跨越非常深或广的树，仅靠逐层 props 已经影响设计，再评估 Context、状态库或路由/Server State 等更合适的归属；“提升到 App 根节点”不是默认答案。
</Boundary>

<AntiPattern title="两个本地 State 互相同步">
A 更新后再 set B、B 更新后又想 set A，说明系统很可能保存了两份同义事实。优先重新确定唯一 owner，而不是继续添加同步 Effect 或回调链。
</AntiPattern>

## 项目判断规则

遇到“两个组件要联动”时先问：

1. 它们是否真的在表达同一份事实？
2. 如果是，这份事实现在是不是被保存了两份？
3. 哪个最近共同祖先能够成为唯一 owner？
4. 子组件需要的是 \`value\`，还是只需要派生后的更小数据？
5. 子组件对修改的需求能否用清晰 callback 表达为 intent？

如果答案成立，状态提升通常比“兄弟之间互相同步”更简单，也更容易调试。

<Summary>
- 状态提升解决的是共享事实的 ownership，不是组件间消息总线问题。
- 共享事实通常只保留一份，由最近共同 owner 持有。
- 数据通过 props 向下，用户意图通过 callback 向上。
- 不需要协同的 State 不要为了统一而过度提升。
</Summary>

<FurtherReading items={[{ label: "React: Sharing State Between Components", href: "https://react.dev/learn/sharing-state-between-components" }, { label: "React: Choosing the State Structure", href: "https://react.dev/learn/choosing-the-state-structure" }]} />`;export{e as default};