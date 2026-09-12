var e=`# Profiler：先测量，再优化

<MentalModel title="性能优化从证据开始">
React \`<Profiler>\` 测量某棵 React 子树 commit 时的 render 成本。\`actualDuration\` 表示本次更新实际花费，\`baseDuration\` 是根据各组件最近 render duration 估算出的“整棵子树无 memoization 重渲染”成本；它们用于比较趋势，不是浏览器完整性能时间线。
</MentalModel>

<Experiment title="制造热点并比较优化前后">
在中间 Demo 调高工作量，记录多次交互的 \`actualDuration\` / \`baseDuration\`；再启用示例优化，比较相同操作，而不是只看一次偶然值。
</Experiment>
<DemoReference action="执行相同交互序列并比较 Profiler 记录" observe="关注重复样本、最慢 commit 与优化前后的趋势。" />

<Flow items={["复现用户可感知的慢操作","Profiler 定位昂贵 React 子树/commit","浏览器 Performance 继续检查脚本、布局、绘制","做最小优化","用同一场景重新测量并防止回归"]} />

<Observation>
Profiler 只覆盖 React render/commit 相关信息。网络、长任务、布局、图片解码、第三方脚本等仍需浏览器 Performance/Network 工具。
</Observation>

<AntiPattern title="根据开发环境单次数字下结论">
开发模式、Strict Mode、机器负载都会影响数字。使用一致环境和重复样本。普通 production build 默认关闭 React profiling instrumentation；如果要在接近生产优化条件下继续采集 \`<Profiler>\` 数据，需要使用 profiling-enabled production build，而不是假设普通生产包仍会调用 \`onRender\`。
</AntiPattern>

<Boundary title="优化目标是交互体验">
减少某个组件的 render 次数不一定改善 INP 或页面响应；若瓶颈在 DOM、布局或网络，React memoization 可能无效。\`baseDuration\` 也是估算的 worst-case render cost，不是关闭 memoization 后的一次真实计时。
</Boundary>

<Summary>
- Profiler 用于定位和验证，不用于猜测。
- \`actualDuration\` 与 \`baseDuration\` 应结合场景解释。
- 普通 production build 默认关闭 profiling；生产级复测需要 profiling-enabled build/工具链。
- React Profiler 与浏览器性能工具互补。
</Summary>

<FurtherReading items={[{label:"React: Profiler",href:"https://react.dev/reference/react/Profiler"},{label:"React: Performance tracks",href:"https://react.dev/reference/dev-tools/react-performance-tracks"}]} />`;export{e as default};