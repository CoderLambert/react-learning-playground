var e=`# Re-render ≠ DOM Update

<MentalModel title="Render 是计算，Commit 才是写 DOM">
组件重新执行只表示 React 重新计算下一棵 UI；只有比较结果确实要求宿主环境变化时，Commit 才会修改 DOM。性能分析必须区分“组件执行次数”和“真实 DOM mutation 成本”。
</MentalModel>

## 跟着 Demo 验证
<Experiment title="组件执行次数与 MutationObserver 对照">
在中间 Demo 先触发无关 State 更新：\`RenderedPreview\` 会再次执行，但传给目标节点的文本保持不变。再修改 \`label\`，比较组件执行次数与只观察目标 \`<strong>\` 的 MutationObserver 记录。
</Experiment>
<DemoReference action="分别触发无关 State 更新和目标文本更新" observe="组件函数可以再次执行，而目标 DOM mutation 只在该子树确实需要改写时出现；开发 Strict Mode 可能带来额外组件调用。" />

<Timeline steps={["state/props/context 变化触发更新","React 执行组件并计算下一 UI","React 比较前后结果","Commit 仅应用必要宿主变化","浏览器随后布局、绘制与合成"]} />

<Observation>
“re-render”本身不是 bug。Demo 中的组件执行计数来自组件函数执行点，而 MutationObserver 只证明被观察目标子树是否发生 mutation；它并不等价于整个 React commit 的全局 DOM 变更计数。
</Observation>

<AntiPattern title="看到 render 就立即 memo">
盲目加入 \`memo\`、\`useMemo\`、\`useCallback\` 会增加依赖与认知成本，还可能因为引用不稳定而完全不命中。先用 Profiler 和浏览器性能工具定位瓶颈。
</AntiPattern>

<Boundary title="DOM 不变也不代表 render 免费">
组件函数、派生计算和子树协调仍可能消耗 CPU；反过来，render 很快时，即使次数较多也未必值得优化。开发环境 Strict Mode 还可能额外调用组件来暴露不纯 render，因此不要把一次点击机械地等同于一次组件执行。React Compiler 也不会改变“先测量”的原则。
</Boundary>

<Summary>
- Render 计算 UI；Commit 写宿主环境。
- 组件执行不等于 DOM 一定更新。
- MutationObserver 只证明被观察 DOM 子树的 mutation，不是 React commit profiler。
- 优化目标是用户可感知成本，而非单一 render 次数。
</Summary>

<FurtherReading items={[{label:"React: Render and Commit",href:"https://react.dev/learn/render-and-commit"},{label:"React: React Developer Tools Profiler",href:"https://react.dev/reference/react/Profiler"}]} />`;export{e as default};