var e=`# Profiler：先测量，再优化

<MentalModel title="性能优化从证据开始">
React \`<Profiler>\` 测量某棵 React 子树 commit 时的 render 成本。\`actualDuration\` 表示本次更新实际花费，\`baseDuration\` 估计没有 memoization 时整棵子树的基准成本；它们用于比较趋势，不是浏览器完整性能时间线。
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
开发模式、Strict Mode、机器负载都会影响数字。使用一致环境和重复样本；需要接近真实用户时应验证 production build。
</AntiPattern>

<Boundary title="优化目标是交互体验">
减少某个组件的 render 次数不一定改善 INP 或页面响应；若瓶颈在 DOM、布局或网络，React memoization 可能无效。
</Boundary>

<Summary>
- Profiler 用于定位和验证，不用于猜测。
- \`actualDuration\` 与 \`baseDuration\` 应结合场景解释。
- React Profiler 与浏览器性能工具互补。
- 优化后必须用相同场景重新测量。
</Summary>

<FurtherReading items={[{label:"React: Profiler",href:"https://react.dev/reference/react/Profiler"},{label:"React DevTools Profiler",href:"https://react.dev/learn/react-developer-tools"}]} />`;export{e as default};