var e=`# Context 更新传播模型

<MentalModel title="useContext 是对最近 Provider value 的订阅读取">
Context 让深层组件无需逐层 props 就能读取最近 Provider 的 value。消费者不是“读取一次全局变量”；当对应 Context 的 Provider value 变化时，React 会让消费该 Context 的组件获得新值并重新计算。
</MentalModel>

<Experiment title="观察 Provider value 的传播范围">
在中间 Demo 中分别更新 Context value 和父组件局部 State，比较普通 Consumer、memo Consumer 与 memo Non-consumer 的组件执行次数，确认 parent re-render 与 Context subscription 是两种不同触发来源。
</Experiment>

<DemoReference action="切换 Theme，再单独更新父组件 localCount" observe="Theme 改变时 memo Consumer 仍会重新执行并读取新 Context；localCount 改变时 props 不变的 memo Consumer / Non-consumer 可以跳过父级带来的重复工作。开发 Strict Mode 可能额外调用组件。" />

<Flow items={["Provider 提供 value", "深层组件 useContext 读取并订阅最近 Provider", "Provider value 用 Object.is 比较为不同", "React 通知对应消费者", "消费者用新 Context 重新 render"]} />

<Boundary title="memo 不能屏蔽组件自己消费的 Context 更新">
\`memo\` 主要比较 props。若组件内部读取的 Context 改变，它仍需要重新 render 才能看到新值。Context 也没有对象字段级 selector 语义：消费者订阅的是整个 value identity。优化时先考虑 value 建模、Provider 边界和拆分 Context，再根据实际性能问题决定是否稳定对象/函数引用。
</Boundary>

<AntiPattern title="一个巨大 Context 承载所有高频状态">
把互不相关且更新频率不同的数据塞进同一个 value，会扩大订阅耦合。尤其是每次 render 都新建对象/函数 value 时，identity 变化会让消费者收到更新。先按领域和读写模式拆分；必要时再评估外部 store 的 selector 机制。
</AntiPattern>

<Summary>
- Context 解决跨层依赖传递，不等于全局状态库。
- 消费者订阅最近 Provider 的整个 value identity。
- Context 更新可以让 memoized consumer 重新 render。
- 父组件重新 render 与 Context value 变化是两种不同触发来源。
- Provider/value 的边界设计决定传播成本和可维护性。
</Summary>

<FurtherReading items={[{ label: "React: Passing Data Deeply with Context", href: "https://react.dev/learn/passing-data-deeply-with-context" }, { label: "React: useContext", href: "https://react.dev/reference/react/useContext" }, { label: "React: memo", href: "https://react.dev/reference/react/memo" }]} />`;export{e as default};