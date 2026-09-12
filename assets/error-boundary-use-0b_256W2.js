var e=`# Error Boundary + React 19 use：把 pending 与 failure 分到不同边界

React 19 的 \`use(resource)\` 可以读取 Promise：pending 时 suspend 交给 Suspense，fulfilled 时返回值，rejected 时错误向最近的 Error Boundary 传播。

<MentalModel title="同一资源有三态，两个边界各管一类">Promise pending → Suspense fallback；fulfilled → 正常 UI；rejected → Error Boundary fallback。Error Boundary 处理 render 阶段传播出的错误，不是所有异步错误的全局 try/catch。</MentalModel>

<Flow items={["稳定 Promise/resource", "use(resource)", "pending → Suspense", "fulfilled → value", "rejected → Error Boundary"]} />

<Experiment title="切换成功、等待、失败">
在中间 Demo 触发资源读取，分别观察 pending fallback、成功内容与 rejection fallback。重新渲染时留意 Promise identity：如果每次 render 都创建新 Promise，会破坏稳定读取/缓存预期。
</Experiment>

<DemoReference action="在 Demo 中触发成功、pending 和失败三种资源路径" observe="分别查看 Suspense fallback、成功内容和 Error Boundary fallback，并比较稳定 resource identity 对重渲染的影响。" />

<Observation>\`use\` 与普通 Hook 不完全相同，它可以在条件/循环中调用，但仍必须在组件或 Hook 中使用。生产数据读取通常应依赖框架或缓存层提供稳定资源。</Observation>

<AntiPattern title="render 中无缓存地 new Promise">每次 render 生成新 Promise 会让资源身份不断变化，可能导致重复请求或持续 suspend。稳定 Promise/缓存是关键边界。</AntiPattern>

<Boundary>Error Boundary 不捕获事件 handler、服务端渲染等所有错误类别；需要按 React 的错误传播规则和应用数据层分别处理。</Boundary>

<Summary>
- use 读取 Promise 可触发 Suspense。
- rejection 交给 Error Boundary。
- 资源 identity 必须稳定。
- 框架/缓存层负责生产级数据协议。
</Summary>

<FurtherReading items={[{label:"React: use",href:"https://react.dev/reference/react/use"},{label:"React: Suspense",href:"https://react.dev/reference/react/Suspense"},{label:"React: Component Error Boundaries",href:"https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"}]} />
`;export{e as default};