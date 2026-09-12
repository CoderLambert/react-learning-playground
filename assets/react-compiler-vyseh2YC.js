var e=`# React Compiler 自动优化模型

<MentalModel title="Compiler 在构建期理解 React 代码并自动 memoize">
React Compiler 分析遵守 Rules of React 的组件与 Hooks，在不改变语义的前提下自动缓存可复用的值、函数和子树。它减少的是机械式手工 memoization，不是把任意不纯代码自动修好。
</MentalModel>

<Experiment title="把 Demo 当成编译器心智模拟器">
在中间 Demo 对比“每次都重新计算”“手工 memo”与“Compiler 可优化的纯表达式”场景，先判断哪些工作理论上可安全复用，再查看展示结果。
</Experiment>
<DemoReference action="切换不同优化模型并触发更新" observe="重点理解编译器需要纯 render、稳定规则和可分析的数据流，而非只看 render 次数。" />

<Flow items={["源码遵守 Rules of React","构建阶段 Compiler 静态分析","安全区域生成 memoization","运行时按依赖/identity 复用结果","Profiler 验证实际用户场景收益"]} />

<Boundary title="Compiler 有明确边界">
编译器不能替你设计正确的 state ownership，也不能让 render 中的副作用变安全。违反 Rules of React、动态/不受支持模式、部分第三方库边界可能导致代码无法被优化；渐进采用时同一应用可以同时存在已编译与未编译代码。

自动 memoization 不是开发者可以根据源码形状预测的具体缓存 contract。若要确认某处是否实际被优化，应查看 Compiler diagnostics、compiler output，以及 React DevTools / Profiler evidence，而不是猜测“这里一定会被 memoize”。本仓库的 Core Demo 是 Compiler 心智模拟器，不是真实 Compiler runtime：它不提供编译输出或 diagnostics。若课程提到 \`infer\` / \`annotation\`，它们只是常见配置示例，不是 compilation modes 的完整全集。
</Boundary>

<AntiPattern title="启用 Compiler 后删除所有 memoization">
迁移应以官方兼容策略和测量为依据。已有手工 memo 可能承载第三方 identity contract 或位于未编译边界；不要机械删除。反过来，新代码也不应为了旧习惯无条件添加 memo。
</AntiPattern>

<Observation>
Compiler 的核心前提仍是 React 的纯度与 Hook 规则。eslint-plugin-react-hooks/Compiler diagnostics 应作为迁移反馈，而不是被随意关闭。
</Observation>

<Summary>
- Compiler 是构建期自动 memoization，不是运行时魔法。
- Rules of React 是可安全优化的基础。
- 支持渐进采用，未编译边界仍存在。
- 手工 memo 的保留/删除都应有 contract 或性能证据。
</Summary>

<FurtherReading items={[{label:"React Compiler",href:"https://react.dev/learn/react-compiler"},{label:"React Compiler: Introduction",href:"https://react.dev/reference/react-compiler"},{label:"Rules of React",href:"https://react.dev/reference/rules"}]} />
`;export{e as default};