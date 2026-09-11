var e=`# React.memo 命中与失效

<MentalModel title="memo 是跳过父驱动重复 render 的性能提示">
\`memo(Component)\` 在父组件重新 render 时比较新旧 props；默认逐项使用 \`Object.is\`。props 相同可跳过该组件的一次 render，但自身 state 或所消费 Context 的变化仍会触发更新。
</MentalModel>

<Experiment title="让 memo 命中，再故意击穿">
在中间 Demo 比较 primitive prop、每次新建对象 prop 与稳定对象 prop。触发父组件无关更新并观察子组件 render 计数。
</Experiment>
<DemoReference action="切换不同 prop 传递方式并更新父组件" observe="新对象/函数会让浅比较失效；稳定 props 才可能命中 memo。" />

<Observation>
\`memo\` 的收益取决于两个条件：组件 render 确实昂贵，而且 props 在大量父级更新中经常保持相同。缺少任一条件，缓存成本可能没有意义。
</Observation>

<AntiPattern title="用 memo 修复逻辑问题">
组件必须在没有 \`memo\` 时仍然正确。若移除 memo 就出现错误，通常意味着 render 不纯、Effect 依赖错误或状态所有权有问题。
</AntiPattern>

<Boundary title="React Compiler 改变手工 memo 的默认策略">
启用 React Compiler 的代码可获得构建期自动 memoization，通常减少手写 \`memo\` 的必要性；但编译器不是性能保证，也不能替代 Rules of React、Profiler 测量和对未编译边界的判断。
</Boundary>

<Summary>
- \`memo\` 优化父级导致的重复 render，不屏蔽自身 state/context 更新。
- 默认 props 比较是浅层 \`Object.is\`。
- 新对象/函数 props 常会击穿缓存。
- Compiler 环境优先让编译器工作，再针对测量结果处理例外。
</Summary>

<FurtherReading items={[{label:"React: memo",href:"https://react.dev/reference/react/memo"},{label:"React Compiler",href:"https://react.dev/learn/react-compiler"}]} />`;export{e as default};