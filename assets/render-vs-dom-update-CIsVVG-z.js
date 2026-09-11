var e=`# Re-render ≠ DOM Update

<MentalModel title="Render 是计算，Commit 才是写 DOM">
组件重新执行只表示 React 重新计算下一棵 UI；只有比较结果确实要求宿主环境变化时，Commit 才会修改 DOM。性能分析必须区分“组件执行次数”和“真实 DOM mutation 成本”。
</MentalModel>

## 跟着 Demo 验证
<Experiment title="Render 与 MutationObserver 对照">
在中间 Demo 触发会导致父组件重新 render、但输出 DOM 保持相同的更新，再触发真正改变文本或节点的更新。比较 render 计数与 MutationObserver 日志。
</Experiment>
<DemoReference action="分别触发无 DOM 变化和有 DOM 变化的更新" observe="render 次数可能增加，但 DOM mutation 只在 commit 需要时出现。" />

<Timeline steps={["state/props/context 变化触发更新","React 执行组件并计算下一 UI","React 比较前后结果","Commit 仅应用必要宿主变化","浏览器随后布局、绘制与合成"]} />

<Observation>
“re-render”本身不是 bug。真正需要优化的是已测量到的昂贵 render、频繁 commit、布局抖动或长任务，而不是追求 render 次数归零。
</Observation>

<AntiPattern title="看到 render 就立即 memo">
盲目加入 \`memo\`、\`useMemo\`、\`useCallback\` 会增加依赖与认知成本，还可能因为引用不稳定而完全不命中。先用 Profiler 和浏览器性能工具定位瓶颈。
</AntiPattern>

<Boundary title="DOM 不变也不代表 render 免费">
组件函数、派生计算和子树协调仍可能消耗 CPU；反过来，render 很快时，即使次数较多也未必值得优化。React Compiler 也不会改变“先测量”的原则。
</Boundary>

<Summary>
- Render 计算 UI；Commit 写宿主环境。
- 组件执行不等于 DOM 一定更新。
- 优化目标是用户可感知成本，而非单一 render 次数。
- 用测量结果决定是否 memoize。
</Summary>

<FurtherReading items={[{label:"React: Render and Commit",href:"https://react.dev/learn/render-and-commit"},{label:"React: React Developer Tools Profiler",href:"https://react.dev/reference/react/Profiler"}]} />`;export{e as default};