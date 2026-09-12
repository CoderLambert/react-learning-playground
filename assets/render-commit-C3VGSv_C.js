var e=`# Trigger → Render → Commit

<MentalModel title="render 是计算，commit 才是应用变化">
一次 UI 更新可以拆成 Trigger、Render、Commit。Trigger 请求更新；Render 调用组件计算下一棵 UI；Commit 把必要变化应用到 DOM。浏览器随后才有机会 paint。组件 render 了，不代表对应 DOM 一定改变。
</MentalModel>

<Experiment title="比较 state 更新与真实 DOM mutation">
在中间 Demo 里分别点击“更新 count”和“只更新无关 state”。两次操作都会请求 React 更新，但 \`MutationObserver\` 只观察 Count 节点本身：count 改变时会看到该节点发生 DOM mutation；只改 \`themeTick\` 时，Count 节点文本保持不变。这个实验验证的是“某次更新不等于某个 DOM 节点必然改变”，而不是用浏览器 API伪装成 React render/commit 计数器。
</Experiment>

<DemoReference action="分别更新 count 与无关 state，并查看 Count 节点的 MutationObserver 结果" observe="count 更新会改变 Count DOM；无关 state 更新不会改变 Count DOM。requestAnimationFrame 只负责下一浏览器帧的观察收尾，不是 React commit callback。" />

<Timeline steps={["Trigger：初始挂载或 state 更新", "Render：React 调用组件计算元素树", "Reconciliation：确定需要提交的差异", "Commit：更新 DOM / refs 等", "Browser Paint：浏览器绘制像素"]} />

<Boundary title="Demo 没有伪造 render 次数">
组件函数执行次数受开发 Strict Mode、并发调度等因素影响。本课不在 render 期间写 ref / 外部计数器来制造“可视化次数”，因为那会给纯 render 引入副作用。需要组件 render/commit 性能证据时使用 React DevTools Profiler；需要 layout/paint 证据时使用浏览器 Performance 工具。
</Boundary>

<Boundary title="requestAnimationFrame 属于浏览器，不属于 React 生命周期">
Demo 用 \`requestAnimationFrame\` 只是在下一浏览器帧确认观察窗口内没有 Count DOM mutation。它不能告诉你 React commit 的内部时刻，也不能证明组件函数执行了几次。
</Boundary>

<AntiPattern title="用 render 次数直接推断性能问题">
重新 render 并不等于昂贵 DOM 操作。优化前应先测量 React 计算成本、实际 commit 工作，以及必要时的浏览器 layout/paint；不要仅凭“render 次数多”就加入 memoization。
</AntiPattern>

<Summary>
- Trigger 请求工作，Render 计算 UI，Commit 修改宿主环境。
- render ≠ DOM update ≠ browser paint。
- 本 Demo 用真实 DOM mutation 证据比较两个更新路径，不把 \`requestAnimationFrame\` 当 commit hook。
- 性能判断应基于正确层级的测量，而非只数 render 次数。
</Summary>

<FurtherReading items={[{ label: "React: Render and Commit", href: "https://react.dev/learn/render-and-commit" }, { label: "React: Keeping Components Pure", href: "https://react.dev/learn/keeping-components-pure" }]} />`;export{e as default};